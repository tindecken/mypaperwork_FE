<template>
  <div id="leftdrawer" class="q-pa-md">
    <q-btn class="q-pl-md q-pr-lg" size="lg" icon="sym_o_add" rounded color="primary" label="New" id="btnNew" @click="onCreatePaperwork()"> </q-btn>
    <q-list class="q-mt-md">
      <q-item clickable v-ripple class="cursor-pointer" @click.stop="onSelectAllItems()">
        <q-item-section avatar>
          <q-avatar round icon="sym_o_dashboard" />
        </q-item-section>
        <q-item-section>All Items</q-item-section>
      </q-item>
      <q-expansion-item switch-toggle-side expand-separator v-model="expandedCategories">
        <template v-slot:header>
          <q-item-section>CATEGORIES</q-item-section>
          <q-item-section side>
            <q-btn size="sm" flat round icon="sym_o_add" class="self-center" @click.stop="onCreateCategory()">
              <q-tooltip> Add Category </q-tooltip>
            </q-btn>
          </q-item-section>
        </template>

        <q-item v-for="cat in categories" :key="cat.id" clickable v-ripple class="cursor-pointer" @click="onSelectCategory(cat)" dense>
          <q-avatar icon="sym_o_folder" />
          <q-item-section class="q-pa-none">{{ cat.name }} ({{ cat.paperworkCount }})</q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { Dark } from 'quasar';
import { useRouter } from 'vue-router';
import { useGlobalStore } from 'src/stores/globalStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed, ref } from 'vue';
import { Category } from 'src/Models/Category/CategoryInterface';
import { useQuasar } from 'quasar';
import CreatePaperworkDialog from 'components/Paperwork/Dialogs/CreatePaperworkDialog.vue';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const categoryStore = useCategoryStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const categories = computed(() => categoryStore.categories);
const $router = useRouter();
const expandedCategories = ref(true);

const globalStore = useGlobalStore();

function onSelectCategory(category: Category) {
  $router.push(`/category-details/${category.id}`);
}
function onCreatePaperwork() {
  $q.dialog({
    component: CreatePaperworkDialog,
  })
    .onOk(async () => {
      // TODO
    })
    .onCancel(async () => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onCreateCategory() {
  console.log('Creating category...');
}
function onSelectAllItems() {
  $q.loading.show({
    message: 'Getting paperworks...',
  });
  paperworkStore
    .getPaperworksBySelectedFile()
    .then((response: GenericResponseData | undefined) => {
      $q.loading.hide();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
  $router.push('/home');
}
</script>
<style scoped lang="scss">
.q-expansion-item :deep(.q-item__section--side) {
  padding-right: 0px;
  min-width: 30px;
}
</style>
