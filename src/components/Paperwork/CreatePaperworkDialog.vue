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
          <div class="row q-mt-md">
            <q-select outlined v-model="selectedCategory" :options="categories" option-label="name" option-value="id" label="Category" @update:model-value="onSelectedCategory($event)" />
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="row q-mt-sm">
            <q-uploader hide-upload-btn :color="isDark ? 'grey-9' : 'grey-6'" ref="uploader" class="col-grow" label="Images (max 50 file, max size: 20mb per file)" multiple max-files="50" max-file-size="50000000" @rejected="onRejected($event)" />
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
import { Category } from 'src/Models/Category/CategoryInterface';
import { CreatePaperworkRequestModel } from 'src/Models/Paperwork/CreatePaperworkRequestModel';

const categoryStore = useCategoryStore();
const paperworkStore = usePaperworkStore();
const categories = computed(() => categoryStore.categories);
const selectedCategory: Ref<Category | null> = ref(categoryStore.categories.filter((cat) => cat.name === 'Uncategorized')[0]);

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide } = useDialogPluginComponent();
const isDark = ref(false);
const description = ref('');
const name = ref('');
const uploader = ref();
async function createPaperwork() {
  console.log('uploader.value?.files', uploader.value?.files);
  const requestModel: CreatePaperworkRequestModel = {
    name: name.value,
    description: description.value,
    categoryId: selectedCategory.value?.id,
    files: uploader.value?.files,
  };
  console.log('Creating paperwork request model:', requestModel);
  await paperworkStore.createPaperwork(requestModel);
}
async function onRejected(rejectedFiles: any) {
  console.log('Rejected files:', rejectedFiles);
  // TODO: Implement on rejected logic
}
async function onSelectedCategory(cat: Category) {
  console.log('Selected category:', cat.id);
}
</script>
