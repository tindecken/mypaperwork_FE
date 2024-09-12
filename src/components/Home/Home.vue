<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title> My Paperwork {{ $q.version }} </q-toolbar-title>
        <user></user>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="180">
      <left-drawer></left-drawer>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white row inline justify-between" style="height: 24px">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeftDrawer from '../LeftDrawer/LeftDrawer.vue';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
import { useUserStore } from 'src/stores/userStore';
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();

onBeforeMount(() => {
  if (!userStore.userInfo.selectedFileId) {
    const redirectUrl = `/${$route.query.redirect || 'home'}`;
    void $router.replace({ path: redirectUrl, query: { fileId: userStore.userInfo.selectedFileId } });
  }
});

const leftDrawerOpen = ref(true);
const fileId = ref(userStore.userInfo.selectedFileId);
console.log('Selected file:', fileId.value);
</script>
