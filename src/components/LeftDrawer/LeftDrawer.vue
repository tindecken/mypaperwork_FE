<template>
  <div id="leftdrawer" class="q-pa-md">
    <q-btn-dropdown size="lg" icon="add" rounded color="primary" label="New" id="btnNew" dropdown-icon="none">
      <q-list>
        <q-item clickable v-close-popup @click="onCreatePaperwork()">
          <q-item-section>
            <q-item-label>Paperwork</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onCreateCategory()">
          <q-item-section>
            <q-item-label>Category</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-list class="q-mt-md">
      <q-item v-for="cat in categories" :key="cat.id" clickable v-ripple class="cursor-pointer" @click="onSelectCategory(cat)">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" />
        </q-item-section>
        <q-item-section>{{ cat.name }} ({{ cat.paperworkCount }})</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-ripple class="cursor-pointer" router-link to="/settings">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" icon="settings" />
        </q-item-section>
        <q-item-section>Settings</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="switchTheme()" class="cursor-pointer">
        <q-item-section avatar>
          <q-avatar rounded color="primary" text-color="white" :icon="globalStore.darkTheme ? 'light_mode' : 'dark_mode'" />
        </q-item-section>
        <q-item-section
          ><span v-if="globalStore.darkTheme">Light Mode</span>
          <span v-else>Dark Mode</span>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup lang="ts">
import { Dark } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed } from 'vue';
import { Category } from 'src/Models/Category/CategoryInterface';
import { useQuasar } from 'quasar';
import CreatePaperworkDialog from 'components/Paperwork/Dialogs/CreatePaperworkDialog.vue';

const categoryStore = useCategoryStore();
const $q = useQuasar();
const categories = computed(() => categoryStore.categories);

const globalStore = useGlobalStore();
function switchTheme() {
  globalStore.switchDarkTheme();
  Dark.set(globalStore.darkTheme);
}
function onSelectCategory(category: Category) {
  console.log('Selected category:', category);
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
</script>
<style scoped>
/* #btnNew {
  width: -webkit-fill-available;
} */
</style>
