<template>
  <DialogBase 
    ref="dialogRef"
    max-width="598px" 
    min-height="300px !important"
    header-class="bg-primary"
    content-class="bg-primary"
    :has-footer="false">
    <template v-slot:title>
      <span class="text-h6 text-white">Create Category</span>
    </template>
    <template v-slot:content>
      <div class="q-pa-md">
        <q-form @submit="createCategory()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name *" :rules="[(val) => !!val || 'Name is required', (val) => val.length <= 100 || 'Maximum 100 chars']"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="note" label="Note (max 2000 chars)" :rules="[(val) => val.length <= 2000 || 'Maximum 2000 chars']"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="q-mt-sm row justify-end">
            <q-btn flat color="primary" type="submit" label="Create" class="q-ml-sm" />
            <q-btn flat color="primary" label="Cancel" v-close-popup />
          </div>
        </q-form>
      </div>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import { ref } from 'vue';
import { useCategoryStore } from 'src/stores/categoryStore';
import { useUserStore } from 'src/stores/userStore';
import { useQuasar } from 'quasar';
import { CreateCategoryRequestModel } from 'src/Models/Category/CreateCategoryRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import DialogBase from 'src/components/Dialog/DialogBase.vue';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const $q = useQuasar();

defineEmits(['ok', 'hide', 'cancel']);
const dialogRef = ref();
const note = ref('');
const name = ref('');
async function createCategory() {
  const requestModel: CreateCategoryRequestModel = {
    name: name.value,
    note: note.value,
    userId: userStore.userInfo.id,
    icon: null,
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
      await categoryStore.getCategories();
      dialogRef.value.onDialogOK();
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
