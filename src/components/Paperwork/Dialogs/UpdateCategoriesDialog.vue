<template>
  <DialogBase ref="dialogBaseRef" max-height="300px" max-width="598px" :has-footer="true">
    <template v-slot:title>
      <span class="text-h6 text-white">Update Categories</span>
    </template>
    <template v-slot:content>
      <div class="q-pa-md">
        <q-form style="max-height: 150px; overflow-y: auto">
          <div class="row">Select categories to update:</div>
          <div class="row q-mt-sm">
            <q-option-group option-label="name" option-value="id" :options="categoriesOptions" type="checkbox" v-model="selectedCategories" />
          </div>
        </q-form>
      </div>
    </template>
    <template v-slot:actions>
      <q-btn flat label="Cancel" v-close-popup class="q-mr-sm" />
      <q-btn color="primary" class="q-ml-sm" flat label="Update" @click="updateCategories()"></q-btn>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { useQuasar } from 'quasar';
import { Category } from 'src/Models/Category/CategoryInterface';
import { UpdateCategoriesRequestModel } from 'src/Models/Paperwork/UpdateCategoriesRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import DialogBase from 'src/components/Dialog/DialogBase.vue';

const props = defineProps({
  existingCategories: {
    type: Array as PropType<Category[]>,
    required: true,
  },
  paperworkId: {
    type: String,
    required: true,
  },
});
const dialogBaseRef = ref();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const categoryStore = useCategoryStore();

const categoriesOptions = ref<Category[]>(categoryStore.categories);
const mapExistingCategories = categoriesOptions.value.filter((c) => props.existingCategories.map((cc) => cc.id).indexOf(c.id) > -1);
const selectedCategories = ref<string[]>(mapExistingCategories.map((m) => m.id));

async function updateCategories() {
  const model: UpdateCategoriesRequestModel = {
    paperworkId: props.paperworkId,
    categoryIds: selectedCategories.value,
  };
  $q.loading.show({
    message: 'Updating ...',
  });
  paperworkStore
    .updateCategoriesByPaperworkId(model)
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type: 'positive',
        message: `${response?.message}`,
      });
      $q.loading.hide();
      dialogBaseRef.value.onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
      $q.loading.hide();
    });
}
</script>
