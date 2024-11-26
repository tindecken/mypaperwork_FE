<template>
  <div class="row q-pa-md q-gutter-md justify-center">
    <q-input dense flat debounce="400" v-model="searchText" icon="search" @update:model-value="updatePaperworks()" clearable clear-icon="close" placeholder="Search" class="searchText" />
  </div>
  <template v-if="papperworks.length > 0">
    <div class="row q-pa-md q-gutter-md justify-start">
      <q-card class="card-item" v-for="pw in papperworks" :key="pw.id" @click="openPaperwork(pw)">
        <q-card-section class="row justify-between card-item">
          <q-item-label class="self-center">{{ pw.name }} ({{ pw.documentCount }})</q-item-label>
          <q-btn size="sm" flat round icon="more_vert" class="self-center" @click.stop>
            <q-menu>
              <q-list style="min-width: 100px" dense>
                <q-item clickable v-close-popup @click="editPaperwork(pw)">
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="deletePaperwork(pw)">
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
      <q-select class="col-lg-1 col-md-2 col-sm-2 col-xs-3" dense outlined v-model="pageSize" :options="pageSizeOption" label="Page Size" @update:model-value="updatePaperworks()" />
    </div>
  </template>
  <template v-else>
    <div class="row text-center q-pa-md">No paperworks found.</div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { Paperwork } from 'src/Models/Paperwork/PaperworkInterface';
import { Paging } from 'src/Models/PagingInterface';
import ConfirmDeletePaperworkDialog from './Dialogs/ConfirmDeletePaperworkDialog.vue';

const $router = useRouter();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const currentPagingNumber = ref(1);
const pageSize = ref(10);
const pageSizeOption = ref([10, 20, 30, 40, 50]);
const totalRecords = ref(0);
const pageSizeMax = computed(() => Math.ceil(totalRecords.value / pageSize.value));
const searchText = ref('');
const papperworks = computed(() => paperworkStore.paperworks);

onMounted(() => {
  $q.loading.show({
    message: 'Getting paperworks...',
  });
  paperworkStore
    .getPaperworksBySelectedFile()
    .then((response: GenericResponseData | undefined) => {
      totalRecords.value = response?.totalRecords ?? 0;
      $q.loading.hide();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
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
  // routing to paperwork-details page
  $router.push(`/paperwork-details/${pw.id}`);
}
function updatePaperworks() {
  $q.loading.show();

  const paging: Paging = {
    pageNumber: currentPagingNumber.value,
    pageSize: pageSize.value,
    filterValue: searchText.value,
  };
  paperworkStore
    .getPaperworksBySelectedFile(paging)
    .then((response: GenericResponseData | undefined) => {
      totalRecords.value = response?.totalRecords ?? 0;
      $q.loading.hide();
    })
    .catch((err: GenericResponseData | any) => {
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
      $q.loading.hide();
    });
}
function editPaperwork(pw: Paperwork) {
  $router.push(`/paperwork-edit/${pw.id}`);
}
function deletePaperwork(pw: Paperwork) {
  $q.dialog({
    component: ConfirmDeletePaperworkDialog,
  })
    .onOk(async () => {
      $q.loading.show();
      paperworkStore
        .deletePaperwork(pw.id)
        .then(() => {
          totalRecords.value -= 1;
          $q.notify({
            type: 'positive',
            message: 'Delete paperwork successfully!',
          });
          $q.loading.hide();
        })
        .catch((err: GenericResponseData | any) => {
          $q.notify({
            type: 'negative',
            message: err.message || err.title || err,
          });
          $q.loading.hide();
        });
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
}
</script>

<style lang="sass" scoped>
.card-item
  width: 100%
  max-width: 250px
  cursor: pointer
.searchText
  width: 200px
</style>
