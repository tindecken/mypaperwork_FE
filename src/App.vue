<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useThemeStore } from 'src/stores/themeStore';

const themeStore = useThemeStore();
themeStore.$subscribe(() => {
  localStorage.setItem(
    'theme',
    JSON.stringify({
      selectedTheme: themeStore.selectedTheme,
      themes: themeStore.themes,
    })
  );
});

watch(
  themeStore,
  (newThemeStore) => {
    if (newThemeStore.selectedTheme) {
      document.body.setAttribute('data-theme', newThemeStore.selectedTheme.value);
    }
    Dark.set(newThemeStore.darkTheme);
  },
  { deep: true }
);

onBeforeMount(() => {
  const themeStorage = localStorage.getItem('theme');
  if (themeStorage) {
    if (JSON.parse(themeStorage).hasOwnProperty('selectedTheme')) {
      themeStore.selectedTheme = JSON.parse(themeStorage).selectedTheme;
    }
    if (JSON.parse(themeStorage).hasOwnProperty('themes')) {
      themeStore.themes = JSON.parse(themeStorage).themes;
    }
  }
});
</script>
