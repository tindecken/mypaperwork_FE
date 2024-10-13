<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 150px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Add Categories</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="addCategories()" class="col-grow">
          <div class="row q-mt-sm">
            <q-option-group option-label="name" option-value="id" :options="categoriesOptions" type="checkbox" v-model="selectedCategories" />
          </div>
          <div class="row q-pa-md justify-end">
            <q-btn flat label="Cancel" @click="onDialogHide()"></q-btn>
            <q-btn color="red-7" class="q-ml-sm" flat label="Add" type="submit"></q-btn>
          </div>
        </q-form>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { QInput, useDialogPluginComponent } from 'quasar';
import { PropType, Ref, ref } from 'vue';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed } from 'vue';
import { useQuasar, date } from 'quasar';
import { Category } from 'src/Models/Category/CategoryInterface';
import { useGlobalStore } from 'src/stores/globalStore';

const props = defineProps({
  existingCategories: {
    type: Array as PropType<Category[]>,
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

async function addCategories() {
  console.log('selectedCategories', selectedCategories.value);
  onDialogOK(selectedCategories.value);
}
</script>
