<template>
  <q-list>
    <q-item clickable v-ripple class="cursor-pointer" router-link to="/releases">
      <q-item-section avatar>
        <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
      </q-item-section>
      <q-item-section>Releases</q-item-section>
    </q-item>
    <q-item clickable v-ripple class="cursor-pointer" router-link to="/regression-monitoring">
      <q-item-section avatar>
        <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
      </q-item-section>
      <q-item-section>Regression Monitoring</q-item-section>
    </q-item>

    <q-separator />
    <q-item clickable v-ripple class="cursor-pointer" router-link to="/test-project">
      <q-item-section avatar>
        <q-avatar rounded color="primary" text-color="white" icon="swap_horiz" />
      </q-item-section>
      <q-item-section>Test Project</q-item-section>
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

const globalStore = useGlobalStore();
function switchTheme() {
  globalStore.switchDarkTheme();
  Dark.set(globalStore.darkTheme);
}
</script>
