<template>
  <div class="row">
    <div class="col-xs-4 col-sm-3 col-md-2 col-xl-2 col-lg-2 col-xl-1">
      <q-select
        dense
        outlined
        v-model="selectedTheme"
        :options="themeOptions"
        label="Select Theme"
        @update:model-value="
          changeTheme({ label: $event.label, value: $event.value })
        "
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from 'src/stores/globalStore';
import { useTitle } from '@vueuse/core';
import { computed } from 'vue';

useTitle('Settings');
const globalStore = useGlobalStore();

const selectedTheme = computed(() => globalStore.selectedTheme);
const themeOptions = computed(() => globalStore.themes);

function changeTheme(newTheme: { label: string; value: string }) {
  globalStore.changeTheme(newTheme);
}
</script>
