<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 300px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Create Category</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="createCategory()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name *" :rules="[(val) => !!val || 'Name is required']"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="description" label="Note (max 1000 chars)" :rules="[(val) => val.length <= 1000 || 'Maximum 1000 chars']"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="q-mt-sm row justify-end">
            <q-btn class="q-mr-sm" flat color="primary" label="Cancel" @click="onDialogHide()" />
            <q-btn flat color="primary" type="submit" label="Create" />
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
import { useUserStore } from 'src/stores/userStore';
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';
import { CreateCategoryRequestModel } from 'src/Models/Category/CreateCategoryRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const $q = useQuasar();

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const isDark = computed(() => globalStore.darkTheme);
const description = ref('');
const name = ref('');
async function createCategory() {
  const requestModel: CreateCategoryRequestModel = {
    fileId: userStore.userInfo.selectedFileId!,
    name: name.value,
    description: description.value,
  };
  $q.loading.show({
    message: 'Creating Category...',
  });
  categoryStore
    .createCategory(requestModel)
    .then(async () => {
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: 'Category created successfully!',
      });
      await categoryStore.getCategoriesByFileId();
      onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
}
</script>
