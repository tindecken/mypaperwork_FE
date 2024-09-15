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
import { onBeforeMount, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import User from 'src/components/User/User.vue';
import AppFooter from 'src/components/AppFooter/AppFooter.vue';
import LeftDrawer from 'src/components/LeftDrawer/LeftDrawer.vue';

const categoryStore = useCategoryStore();
const paperworkStore = usePaperworkStore();
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();

onBeforeMount(() => {
  console.log('bbbbbbbbbbbbbbbb');
  if (!userStore.userInfo.selectedFileId) {
    $router.push('/selectfile');
  }
});
onMounted(async () => {
  console.log('aaaaaaaaaaaaaa');
  categoryStore
    .getCategoriesByFileId()
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type: 'positive',
        message: response?.message,
      });
    })
    .catch((err: GenericResponseData | any) => {
      console.log('err', err);
      $q.notify({
        type: 'negative',
        message: err.message || err.title,
      });
    });
  paperworkStore
    .getPaperworksBySelectedFile()
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type: 'positive',
        message: response?.message,
      });
    })
    .catch((err: GenericResponseData | any) => {
      console.log('err', err);
      $q.notify({
        type: 'negative',
        message: err.message || err.title,
      });
    });
});

const leftDrawerOpen = ref(true);
</script>
