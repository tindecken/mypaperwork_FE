<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 410px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Paperwork</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="createPaperwork()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="description" label="Description"> </q-input>
          </div>
          <div class="row q-mt-md q-col-gutter-sm">
            <q-select class="col-6" outlined v-model="selectedCategory" :options="categories" option-label="name" option-value="id" label="Category" @update:model-value="onSelectedCategory($event)" />
            <q-input class="col-6" outlined v-model="issueAt" label="Issue Date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="issueAt" today-btn mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row q-mt-md q-col-gutter-sm">
            <q-input class="col-grow" type="number" outlined dense v-model.number="price" label="Price"> </q-input>
            <q-input type="text" class="col-grow" outlined dense v-model="priceCurrency" label="Price Currency (USD, VND, ...)"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="row q-mt-sm">
            <q-uploader
              hide-upload-btn
              :color="isDark ? 'grey-9' : 'grey-6'"
              ref="uploader"
              class="col-grow"
              label="Images or Files (max 50 files, max size: 20mb per file)"
              multiple
              max-files="20"
              max-file-size="20000000"
              @rejected="onRejected($event)"
              @added="onAdded($event)"
            />
          </div>
          <div class="row justify-end">
            <q-btn class="q-mt-sm" outline label="Create" type="submit" style="height: 50px; width: 100px" />
          </div>
        </q-form>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { QInput, useDialogPluginComponent } from 'quasar';
import { Ref, ref } from 'vue';
import { useCategoryStore } from 'src/stores/categoryStore';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { Category } from 'src/Models/Category/CategoryInterface';
import { CreatePaperworkRequestModel } from 'src/Models/Paperwork/CreatePaperworkRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { useGlobalStore } from 'src/stores/globalStore';
import heic2any from 'heic2any';

const categoryStore = useCategoryStore();
const paperworkStore = usePaperworkStore();
const globalStore = useGlobalStore();
const categories = computed(() => categoryStore.categories);
const selectedCategory: Ref<Category> = ref(categoryStore.categories.filter((cat) => cat.name === 'Uncategorized')[0]);
const $q = useQuasar();
const issueAt: Ref<string | null> = ref(null);

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const isDark = computed(() => globalStore.darkTheme);
const description = ref('');
const name = ref('');
const uploader = ref();
const price: Ref<number | null> = ref(null);
const priceCurrency = ref('');
async function createPaperwork() {
  console.log('uploader.value?.files', uploader.value?.files);
  const requestModel: CreatePaperworkRequestModel = {
    name: name.value,
    description: description.value,
    categoryId: selectedCategory.value.id,
    price: price.value,
    priceCurrency: priceCurrency.value,
    issueAt: issueAt.value,
    files: uploader.value?.files,
  };
  console.log('Creating paperwork request model:', requestModel);
  $q.loading.show({
    message: 'Creating post...',
  });
  paperworkStore
    .createPaperwork(requestModel)
    .then((response: GenericResponseData | undefined) => {
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: response?.message,
      });
      onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
      onDialogHide();
    });
}
async function onRejected(rejectedEntries: any) {
  if (rejectedEntries.length > 0) {
    if (rejectedEntries[0].failedPropValidation === 'duplicate') {
      $q.notify({
        type: 'warning',
        message: "You've added the same file twice.",
      });
    } else if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
      $q.notify({
        type: 'warning',
        message: 'Exceeded the maximum file size.',
      });
    }
  }
}
async function onSelectedCategory(cat: Category) {
  console.log('Selected category:', cat.id);
}
async function onAdded(files: any) {
  console.log('Files added:', files);
  const convertedFiles = await Promise.all(
    files.map(async (file: File) => {
      if (file.name.toLowerCase().endsWith('.heic')) {
        uploader.value?.removeQueuedFiles(file);
        console.log('Converting HEIC to PNG:', file.name);
        const image = await heic2any({ blob: file, toType: 'image/jpeg' });
        if (image instanceof Blob) {
          return new File([image], file.name.replace(/\.heic$/i, '.jpeg'), {
            type: 'image/jpeg',
            lastModified: file.lastModified,
          });
        }
      }
      return file;
    })
  );
  uploader.value?.addFiles(convertedFiles.filter(Boolean));
}
</script>
