<template>
  <div class="row q-pa-md q-gutter-md justify-center">
    <q-input dense flat debounce="400" v-model="searchText" icon="search" @update:model-value="updatePaperworks()" clearable clear-icon="close" placeholder="Search" class="searchText" />
  </div>
  <template v-if="papperworks.length > 0">
    <div class="row q-pa-md q-gutter-md justify-start">
      <q-card class="card-item q-pa-xs" v-for="pw in papperworks" :key="pw.id" @click="openPaperwork(pw)">
        <q-card-section class="row justify-between card-item q-pa-sm">
          <div class="col-11" style="word-break: break-all">
            <q-item-label class="self-center q-pa-none">{{ pw.name }} ({{ pw.documentCount }})</q-item-label>
          </div>
          <div class="col-1">
            <q-btn size="sm" flat round icon="more_vert" class="self-center" @click.stop>
              <q-menu>
                <q-list style="min-width: 100px" dense>
                  <q-item clickable v-close-popup @click="editPaperwork(pw)" style="padding-left: 8px">
                    <q-item-section class="row inline no-wrap"
                      ><div><q-icon size="xs" name="sym_o_edit" class="q-mr-xs" />Edit</div></q-item-section
                    >
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="deletePaperwork(pw)" style="padding-left: 8px">
                    <q-item-section class="row inline no-wrap"
                      ><div><q-icon size="xs" name="sym_o_delete" class="q-mr-xs" />Delete</div></q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
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
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { Paperwork } from 'src/Models/Paperwork/PaperworkInterface';
import { Paging } from 'src/Models/PagingInterface';
import ConfirmDeletePaperworkDialog from './Dialogs/ConfirmDeletePaperworkDialog.vue';

const $router = useRouter();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const currentPagingNumber = ref(1);
const pageSize = ref(process.env.DEFAULT_PAGESIZE);
const pageSizeOption = ref([10, 20, 30, 40, 50]);
const totalRecords = computed(() => paperworkStore.totalRecords);
const pageSizeMax = computed(() => Math.ceil(totalRecords.value / pageSize.value));
const searchText = ref('');
const papperworks = computed(() => paperworkStore.paperworks);

const props = defineProps<{ categoryId?: string }>();
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
  if (props.categoryId) {
    paperworkStore
      .getPaperworksByCategoryId(props.categoryId, paging)
      .then((response: GenericResponseData | undefined) => {
        $q.loading.hide();
      })
      .catch((err: GenericResponseData | any) => {
        $q.notify({
          type: 'negative',
          message: err.message || err.title || err,
        });
        $q.loading.hide();
      });
  } else {
    paperworkStore
      .getPaperworksBySelectedFile(paging)
      .then((response: GenericResponseData | undefined) => {
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

// reset searchText when navigating to another page
onBeforeRouteUpdate((to, from, next) => {
  searchText.value = '';
  next();
});
</script>

<style lang="sass" scoped>
.card-item
  width: 100%
  max-width: 250px
  cursor: pointer
  @media (max-width: $breakpoint-xs-max)
    max-width: 100%
.searchText
  width: 200px
</style>
