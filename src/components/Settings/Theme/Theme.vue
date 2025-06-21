<template>
  <div class="row">
    <div class="col-xs-4 col-sm-3 col-md-2 col-xl-2 col-lg-2 col-xl-1">
      <q-select dense outlined v-model="selectedTheme" :options="themeOptions" label="Select Theme" @update:model-value="changeTheme({ label: $event.label, value: $event.value, mode: $event.mode })" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { computed } from 'vue';
import { useThemeStore } from 'src/stores/themeStore';
import { ThemeModel } from 'src/Models/Theme/ThemeModel';

useTitle('Settings');

const themeStore = useThemeStore();
const selectedTheme = computed(() => themeStore.selectedTheme);
const themeOptions = computed(() => themeStore.themes);

function changeTheme(newTheme: ThemeModel) {
  themeStore.changeTheme(newTheme);
}
</script>
