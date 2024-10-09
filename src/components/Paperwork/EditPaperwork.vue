<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end">
      <span class="col title">Infos</span>
      <div class="col-auto">
        <q-btn flat color="primary" label="Save" @click="savePaperwork()" />
        <q-btn class="q-ml-sm" flat color="primary" label="Cancel" @click="cancel()" />
      </div>
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly class="col-6" v-model="createdAt" label="Created At" />
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input type="textarea" autogrow outlined class="col-6" v-model="description" label="Description" />
      <q-input outlined class="col-3" v-model="price" label="Price" />
      <q-input outlined class="col-3" v-model="priceCurrency" label="Currency" />
    </div>
    <div class="row q-mt-md">
      <span class="self-center">Categories:</span>
      <q-chip outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event"> {{ cat.name }}</q-chip>
    </div>
    <span class="row q-mt-md title"
      >Attachments
      <q-badge class="q-ml-xs badge" color="primary" text-color="black" :label="attachments.length" />
    </span>
    <q-table dense :rows="attachments" :columns="columns" row-key="id" no-data-label="No attachments" flat bordered class="q-mt-md" separator="cell" v-if="attachments.length > 0">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="fileName" :props="props">
            {{ props.row.fileName }}
          </q-td>
          <q-td key="fileSize" :props="props">
            {{ prettyBytes(props.row.fileSize) }}
          </q-td>
          <q-td key="download" :props="props">
            <q-btn icon="sym_o_download" flat label="Download" @click="onDownloadAttachment(props.row.id, props.row.fileName)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row q-mt-md">
      <span class="self-center title">Images </span>
      <q-badge class="q-ml-xs badge" color="primary" text-color="black" :label="images.length" />
    </div>
    <div class="row q-mt-md q-col-gutter-lg">
      <div class="col" v-for="image in images" :key="image.id" style="max-width: 300px; height: 150px">
        <q-img :src="getImgUrl(image.fileBlob)" @click="showImages(getImgUrl(image.fileBlob), images)" class="images">
          <q-icon class="absolute all-pointer-events" size="32px" name="info" color="white" style="top: 8px; left: 8px">
            <q-tooltip>{{ image.fileName }} - {{ prettyBytes(image.fileSize) }} </q-tooltip>
          </q-icon>
        </q-img>
      </div>
    </div>
    <div class="row q-mt-lg" v-if="isShowedJson">
      <vue-json-pretty :deep="3" showLineNumber :data="(paperwork as unknown as JSONDataType)" />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useUserStore } from 'src/stores/userStore';
import { useDocumentStore } from 'src/stores/documentStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { PaperworkDetails } from 'src/Models/Paperwork/PaperworkDetails';
import { JSONDataType } from 'vue-json-pretty/types/utils';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Category } from 'src/Models/Category/CategoryInterface';
import { AttachmentInterface } from 'src/Models/Document/AttachmentInterface';
import { DownloadAttachmentRequestModel } from 'src/Models/Document/DownloadAttachmentRequestModel';
import { ImageInterface } from 'src/Models/Document/ImageInterface';
import { api as viewerApi } from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import prettyBytes from 'pretty-bytes';
import { useGlobalStore } from 'src/stores/globalStore';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const documentStore = useDocumentStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const paperwork: Ref<PaperworkDetails | null> = ref(null);
const name = ref('');
const description = ref('');
const price = ref('');
const priceCurrency = ref('');
const categories: Ref<Category[]> = ref([]);
const attachments: Ref<AttachmentInterface[]> = ref([]);
const images: Ref<ImageInterface[]> = ref([]);
const imagesUrls: Ref<string[]> = ref([]);
const createdAt = ref(paperwork.value?.createdAt.toString());
const globalStore = useGlobalStore();
const isShowedJson = computed(() => globalStore.isShowedJson);
const columns = [
  {
    name: 'fileName',
    required: true,
    label: 'File Name',
    align: 'left',
    field: 'fileName',
    sortable: true,
  },
  { name: 'fileSize', align: 'right', label: 'Size', field: 'fileSize', sortable: true, format: (val: number) => `${prettyBytes(val)}`, style: 'width: 50px' },
  { name: 'download', label: 'Download', align: 'left' },
];
onMounted(() => {
  $q.loading.show();
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      description.value = paperwork.value?.description;
      createdAt.value = paperwork.value?.createdAt?.toString();
      price.value = paperwork.value?.price?.toString();
      priceCurrency.value = paperwork.value?.priceCurrency;
      categories.value = paperwork.value?.categories;
      attachments.value = paperwork.value?.attachments || [];
      images.value = paperwork.value?.images || [];
      imagesUrls.value = images.value.map((image) => getImgUrl(image.fileBlob));
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
async function onDownloadAttachment(attachmentId: string, attachmentFileName: string) {
  const body: DownloadAttachmentRequestModel = {
    paperworkId: $route.params.id as string,
    documentId: attachmentId,
  };
  documentStore
    .downloadAttachment(body)
    .then((response: GenericResponseData | undefined) => {
      const responseData = response?.data as AttachmentInterface;
      var bytes = new Uint8Array(responseData.fileBlob.data);
      var len = bytes.byteLength;
      let blob = new Blob([new Uint8Array(bytes, 0, len)], { type: 'application/octet-binary;charset=utf-8' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = attachmentFileName;
      link.click();
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: response?.message,
      });
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
}
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
async function showImages(currentImageUrl: string, images: ImageInterface[]) {
  const imageUrls = images.map((image) => getImgUrl(image.fileBlob));
  const index = imageUrls.indexOf(currentImageUrl);
  const $viewer = viewerApi({
    images: imageUrls,
    options: {
      inline: true,
      button: true,
      navbar: false,
      title: () => `${images[index].fileName} - ${prettyBytes(images[index].fileSize)}`,
      toolbar: true,
      tooltip: false,
      movable: true,
      zoomable: true,
      rotatable: true,
      scalable: false,
      transition: true,
      fullscreen: true,
      keyboard: true,
      initialViewIndex: index,
    },
  });
}
function savePaperwork() {
  // TODO: Implement update paperwork logic
}
function cancel() {
  // TODO: Implement cancel paperwork logic
}
</script>

<style lang="sass" scoped>
.images
  width: -webkit-fill-available
  height: -webkit-fill-available
  cursor: pointer
  border: 1px solid
  border-color: rgba(0, 0, 0, 0.4)
  transition: transform 0.3s ease-in-out
  &:hover
    transform: scale(1.1)
.title
  font-size: 20px
  letter-spacing: 0.005em
  font-weight: 400
.badge
  height: 16px
</style>
