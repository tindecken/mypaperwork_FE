<template>
  <DialogBase ref="dialogRef" max-width="598px" min-height="300px !important" max-height="360px !important" :has-footer="false">
    <template v-slot:title>
      <span class="text-h6 text-white">Edit Category</span>
    </template>
    <template v-slot:content>
      <div class="row q-pa-md">
        <q-form @submit="editCategory()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name *" :rules="[(val) => !!val || 'Name is required', (val) => val.length <= 100 || 'Maximum 100 chars']"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="note" label="Note (max 2000 chars)" :rules="[(val) => val.length <= 2000 || 'Maximum 2000 chars']"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="q-mt-sm row justify-between">
            <div>
              <q-btn class="q-mr-sm" flat label="Delete" @click="confirmDelete = true" />
              <q-dialog v-model="confirmDelete" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar icon="delete" color="primary" text-color="white" size="2rem" /><span class="q-ml-sm text-h6">Confirm Deleting</span>
                    <span class="q-ml-sm q-mt-md">Are you sure to delete this category? It will delete all the paperworks associated with this category.</span>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Delete" @click="onDeleteCategory()" />
                    <q-btn flat label="Cancel" v-close-popup />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <div class="row justify-end">
              <q-btn flat type="submit" label="Edit" />
              <q-btn class="q-mr-sm" flat label="Cancel" @click="onCancel()" />
            </div>
          </div>
        </q-form>
      </div>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import DialogBase from 'src/components/Dialog/DialogBase.vue';
import { ref, ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from 'src/stores/categoryStore';
import { useUserStore } from 'src/stores/userStore';
import { useQuasar } from 'quasar';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { EditCategoryRequestModel } from 'src/Models/Category/EditCategoryRequestModel';
import { Category } from 'src/Models/Category/CategoryInterface';
import { DeleteCategoryRequestModel } from 'src/Models/Category/DeleteCategoryRequestModel';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const $q = useQuasar();
const router = useRouter();

const props = defineProps<{ category: Category }>();
defineEmits(['ok', 'hide']);
const dialogRef = ref<(ComponentPublicInstance & { onDialogCancel: () => void; onDialogOK: () => void }) | null>(null);
const note = ref(props.category.note);
const name = ref(props.category.name);
const confirmDelete = ref(false);
async function editCategory() {
  const requestModel: EditCategoryRequestModel = {
    categoryId: props.category.id,
    name: name.value,
    note: note.value,
    icon: null,
    userId: userStore.userInfo.id,
  };
  $q.loading.show({
    message: 'Edit Category...',
  });
  categoryStore
    .editCategory(requestModel)
    .then(async () => {
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: 'Edit category successfully!',
      });
      await categoryStore.getCategories();
      dialogRef.value?.onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
}
async function onDeleteCategory() {
  $q.loading.show({
    message: 'Deleting ...',
  });

  try {
    const requestModel: DeleteCategoryRequestModel = {
      categoryId: props.category.id,
    };
    await categoryStore.deleteCategory(requestModel);
    $q.notify({
      type: 'positive',
      message: 'Category deleted successfully!',
    });
    // route to home page
    router.push('/');
    await categoryStore.getCategories();
    dialogRef.value?.onDialogOK();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: err.message || err.title || err,
    });
  } finally {
    $q.loading.hide();
  }
}
function onCancel() {
  console.log('onCancel');
  dialogRef.value?.onDialogCancel();
}
</script>
