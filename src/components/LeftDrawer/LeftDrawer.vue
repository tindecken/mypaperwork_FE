<template>
  <q-list>
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
</template>
<script setup lang="ts">
import { Dark } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { computed } from 'vue';
import { Category } from 'src/Models/Category/CategoryInterface';

const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);

const globalStore = useGlobalStore();
function switchTheme() {
  globalStore.switchDarkTheme();
  Dark.set(globalStore.darkTheme);
}
function onSelectCategory(category: Category) {
  console.log('Selected category:', category);
}
</script>
