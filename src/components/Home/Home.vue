<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title> My Paperwork {{ $q.version }} </q-toolbar-title>
        <user></user>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="250">
      <left-drawer></left-drawer>
    </q-drawer>
    <q-page-container>
      <div class="row q-pa-md q-gutter-md justify-center">
        <q-input dense flat debounce="400" v-model="searchText" icon="search" @update:model-value="updatePaperworks()" clearable clear-icon="close" placeholder="Search" class="searchText" />
      </div>
      <template v-if="papperworks.length > 0">
        <div class="row q-pa-md q-gutter-md" :class="papperworks.length > 3 ? 'cards-justify' : ''">
          <q-card class="my-card" v-for="pw in papperworks" :key="pw.id" @click="openPaperwork(pw)">
            <q-card-section class="row justify-between card-item">
              <q-item-label class="self-center">{{ pw.name }} ({{ pw.documentCount }})</q-item-label>
              <q-btn size="sm" flat round icon="more_vert" class="self-center">
                <q-menu>
                  <q-list style="min-width: 100px" dense>
                    <q-item clickable v-close-popup>
                      <q-item-section>Edit</q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable v-close-popup>
                      <q-item-section>Move</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section>Copy</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable v-close-popup>
                      <q-item-section>Delete</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-card-section>
            <img v-if="pw.coverBlob" :src="getImgUrl(pw.coverBlob)" />
          </q-card>
        </div>
        <q-separator class="row q-mt-xs q-mb-xs" inset />
        <div class="row justify-between q-pa-md">
          <span class="text-center">Showing {{ papperworks.length }}/{{ totalRecords }} paperworks</span>
          <q-pagination v-model="currentPagingNumber" :max="pageSizeMax" direction-links push flat color="grey" active-color="primary" @update:model-value="updatePaperworks()" gutter="md" />
          <q-select class="col-1" dense outlined v-model="pageSize" :options="pageSizeOption" label="Page Size" @update:model-value="updatePaperworks()" />
        </div>
      </template>
      <template v-else>
        <div class="row text-center q-pa-md">No paperworks found.</div>
      </template>
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
import { Paperwork } from 'src/Models/Paperwork/PaperworkInterface';
import { Paging } from 'src/Models/PagingInterface';

const categoryStore = useCategoryStore();
const paperworkStore = usePaperworkStore();
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const papperworks = computed(() => paperworkStore.paperworks);
const currentPagingNumber = ref(1);
const pageSize = ref(10);
const pageSizeOption = ref([10, 20, 30, 40, 50]);
const totalRecords = ref(0);
const pageSizeMax = computed(() => Math.ceil(totalRecords.value / pageSize.value));
const searchText = ref('');
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
      totalRecords.value = response?.totalRecords ?? 0;
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
function openPaperwork(pw: Paperwork) {
  console.log('openPaperwork', pw);
}
function navigateTo(selectedPageNumber: number) {
  const paging: Paging = {
    pageNumber: selectedPageNumber,
    pageSize: pageSize.value,
    filterValue: searchText.value,
  };
  paperworkStore
    .getPaperworksBySelectedFile(paging)
    .then((response: GenericResponseData | undefined) => {
      totalRecords.value = response?.totalRecords ?? 0;
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
}
function updatePaperworks() {
  const paging: Paging = {
    pageNumber: currentPagingNumber.value,
    pageSize: pageSize.value,
    filterValue: searchText.value,
  };
  paperworkStore
    .getPaperworksBySelectedFile(paging)
    .then((response: GenericResponseData | undefined) => {
      totalRecords.value = response?.totalRecords ?? 0;
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
}

const leftDrawerOpen = ref(true);
</script>
<style lang="sass" scoped>
.cards-justify
  justify-content: space-between
.my-card
  width: 100%
  max-width: 250px
.searchText
  width: 200px
</style>
