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
      <div class="row q-pa-md q-gutter-md">
        <q-card class="my-card" v-for="pw in papperworks" :key="pw.id">
          <q-card-section>
            <q-item-label>{{ pw.name }}</q-item-label>
            <q-item-label>{{ pw.description }}</q-item-label>
          </q-card-section>
          <img v-if="pw.coverBlob" :src="getImgUrl(pw.coverBlob)" />
        </q-card>
      </div>
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white row inline justify-between" style="height: 24px">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, onMounted, computed } from 'vue';
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
const papperworks = computed(() => paperworkStore.paperworks);

onBeforeMount(() => {
  if (!userStore.userInfo.selectedFileId) {
    $router.push('/selectfile');
  }
});
onMounted(async () => {
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
function getImgUrl(arrBuff: { type: string; data: number[] }) {
  var binary = '';
  var bytes = new Uint8Array(arrBuff.data);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const btoawindow = window.btoa(binary);
  const imgUrl = `data:${arrBuff.type};base64,${btoawindow}`;
  return imgUrl;
}

const leftDrawerOpen = ref(true);
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
