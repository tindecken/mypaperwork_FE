<template>
  <div id="leftdrawer" class="q-pa-md" style="overflow: hidden; white-space: nowrap">
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

        <q-item v-for="cat in categories" :key="cat.id" clickable class="cursor-pointer q-pr-xs" @click="onSelectCategory(cat)">
          <q-avatar icon="sym_o_folder" />
          <q-item-section @mouseover="hoveredCategoryId = cat.id" @mouseleave="hoveredCategoryId = null">
            <div class="row inline justify-between no-wrap" style="width: -webkit-fill-available">
              <span class="col-10" style="text-overflow: ellipsis; overflow: hidden">{{ cat.name }} ({{ cat.paperworkCount }})</span>
              <q-btn flat size="sm" icon="sym_o_edit" class="col-auto q-pa-none" @click.stop="onEditCategory(cat)" v-if="hoveredCategoryId === cat.id">
                <q-tooltip> Edit </q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed, ref, Ref } from 'vue';
import { Category } from 'src/Models/Category/CategoryInterface';
import { useQuasar } from 'quasar';
import CreatePaperworkDialog from 'components/Paperwork/Dialogs/CreatePaperworkDialog.vue';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import CreateCategoryDialog from '../Category/CreateCategoryDialog.vue';
import EditCategoryDialog from '../Category/EditCategoryDialog.vue';
const hoveredCategoryId: Ref<string | null> = ref(null);

const categoryStore = useCategoryStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const categories = computed(() => categoryStore.categories);
const $router = useRouter();
const expandedCategories = ref(true);

function onEditCategory(category: Category) {
  $q.dialog({
    component: EditCategoryDialog,
    componentProps: {
      category: category,
    },
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
function onSelectCategory(category: Category) {
  $router.push(`/category-details/${category.id}`);
}
function onCreatePaperwork() {
  $q.dialog({
    component: CreatePaperworkDialog,
  })
    .onOk(async (paperworkId: string) => {
      $router.push(`/paperwork-details/${paperworkId}`);
    })
    .onCancel(async () => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
function onCreateCategory() {
  $q.dialog({
    component: CreateCategoryDialog,
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
function onSelectAllItems() {
  $q.loading.show({
    message: 'Getting paperworks...',
  });
  paperworkStore
    .getPaperworks()
    .then(() => {
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
