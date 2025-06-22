<template>
  <div class="row">
    <div class="col-xs-4 col-sm-3 col-md-2 col-xl-2 col-lg-2 col-xl-1">
      <q-select dense outlined :model-value="selectedTheme" :options="themeOptions" option-value="id" label="Select Theme" @update:model-value="updateUserTheme($event.id)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { computed } from 'vue';
import { useThemeStore } from 'src/stores/themeStore';

useTitle('Settings');

const themeStore = useThemeStore();
const selectedTheme = computed(() => themeStore.selectedTheme);
const themeOptions = computed(() => themeStore.themes);

function updateUserTheme(themeId: string) {
  themeStore.updateUserTheme(themeId);
}
</script>
