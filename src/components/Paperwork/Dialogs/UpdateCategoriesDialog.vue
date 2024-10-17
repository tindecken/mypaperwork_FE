<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 150px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Update Categories</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="updateCategories()" class="col-grow">
          <div class="row q-mt-sm">
            <q-option-group option-label="name" option-value="id" :options="categoriesOptions" type="checkbox" v-model="selectedCategories" />
          </div>
          <div class="row q-pa-md justify-end">
            <q-btn flat label="Cancel" @click="onDialogHide()"></q-btn>
            <q-btn color="red-7" class="q-ml-sm" flat label="Update" type="submit"></q-btn>
          </div>
        </q-form>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { PropType, ref } from 'vue';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { Category } from 'src/Models/Category/CategoryInterface';
import { useGlobalStore } from 'src/stores/globalStore';
import { UpdateCategoriesRequestModel } from 'src/Models/Category/UpdateCategoriesRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';

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
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();
const categoryStore = useCategoryStore();

const categoriesOptions = ref<Category[]>(categoryStore.categories);
const mapExistingCategories = categoriesOptions.value.filter((c) => props.existingCategories.map((cc) => cc.id).indexOf(c.id) > -1);
const selectedCategories = ref<string[]>(mapExistingCategories.map((m) => m.id));

async function updateCategories() {
  const model: UpdateCategoriesRequestModel = {
    paperworkId: props.paperworkId,
    categoryIds: selectedCategories.value,
  }
  $q.loading.show({
    message: 'Updating ...'
  });
  categoryStore.updateCategoriesByFileId(model)
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type:'positive',
        message: `${response?.message}`
    })
    $q.loading.hide();
    onDialogOK();

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
