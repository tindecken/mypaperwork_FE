<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 300px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Edit Category</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="editCategory()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name *" :rules="[(val) => !!val || 'Name is required']"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="description" label="Description"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="q-mt-sm row justify-between">
            <div>
              <q-btn class="q-mr-sm" flat color="negative" label="Delete" @click="confirmDelete = true" />
              <q-dialog v-model="confirmDelete" persistent>
                <q-card>
                  <q-card-section class="row items-center">
                    <q-avatar icon="delete" color="primary" text-color="white" />
                    <span class="q-ml-sm q-mt-sm">Are you sure to delete this category? It will delete all the paperworks associated with this category.</span>
                  </q-card-section>

                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Delete" color="negative" @click="onDeleteCategory()" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <div class="row justify-end">
              <q-btn class="q-mr-sm" flat color="primary" label="Cancel" @click="onDialogHide()" />
              <q-btn flat color="primary" type="submit" label="Edit" />
            </div>
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
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { EditCategoryRequestModel } from 'src/Models/Category/EditCategoryRequestModel';
import { Category } from 'src/Models/Category/CategoryInterface';
import { DeleteCategoryRequestModel } from 'src/Models/Category/DeleteCategoryRequestModel';

const categoryStore = useCategoryStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const $q = useQuasar();

const props = defineProps<{ category: Category }>();
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const isDark = computed(() => globalStore.darkTheme);
const description = ref(props.category.description);
const name = ref(props.category.name);
const confirmDelete = ref(false);
async function editCategory() {
  const requestModel: EditCategoryRequestModel = {
    fileId: userStore.userInfo.selectedFileId!,
    categoryId: props.category.id,
    name: name.value,
    description: description.value,
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
async function onDeleteCategory() {
  $q.loading.show({
    message: 'Deleting Category...',
  });

  try {
    const requestModel: DeleteCategoryRequestModel = {
      fileId: userStore.userInfo.selectedFileId!,
      categoryId: props.category.id,
    };
    await categoryStore.deleteCategory(requestModel);
    $q.notify({
      type: 'positive',
      message: 'Category deleted successfully!',
    });

    await categoryStore.getCategoriesByFileId();
    onDialogOK();
  } catch (err: any) {
    $q.notify({
      type: 'negative',
      message: err.message || err.title || err,
    });
  } finally {
    $q.loading.hide();
  }
}
</script>
