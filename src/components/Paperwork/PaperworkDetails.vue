<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end q-col-gutter-md">
      <q-input readonly outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly outlined class="col-grow" v-model="createdAt" label="Created At" />
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input type="textarea" autogrow readonly outlined class="col-6" v-model="description" label="Description" />
      <q-input readonly outlined class="col-grow" v-model="price" label="Price" />
      <q-input readonly outlined class="col-grow" v-model="priceCurrency" label="Currency" />
    </div>
    <div class="row q-mt-md">
      <span class="self-center">Categories:</span>
      <q-chip outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event"> {{ cat.name }}</q-chip>
    </div>
    <div class="row q-mt-md" v-if="attachments.length > 0">
      <span class="self-center">Attachments ({{ attachments.length }})</span>
    </div>
    <div class="row q-mt-md q-col-gutter-md" v-for="attachment in attachments" :key="attachment.id">
      <span class="self-center">{{ attachment.fileName }}</span>
      <span class="self-center">{{ attachment.fileSize }}</span>
      <q-btn outline label="Download" @click="onDownloadAttachment(attachment.id, attachment.fileName)" />
    </div>
    <div class="row q-mt-md" v-if="imagesUrls.length > 0">
      <span class="self-center">Images ({{ imagesUrls.length }})</span>
    </div>
    <div class="row q-mt-md q-col-gutter-md">
      <div class="col" v-for="imageUrl in imagesUrls" :key="imageUrl" style="max-width: 300px; height: 150px">
        <q-img :src="imageUrl" @click="showImages(imageUrl, imagesUrls)" class="images">
          <template v-slot:loading>
            <div class="text-yellow">
              <q-spinner-ios />
              <div class="q-mt-md">Loading...</div>
            </div>
          </template>
        </q-img>
      </div>
    </div>
    <div class="row q-mt-lg" v-if="paperwork">
      <vue-json-pretty :deep="3" showLineNumber :data="(paperwork as unknown as JSONDataType)" />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, Ref, onMounted } from 'vue';
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
        message: err.message || err.title,
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
        message: err.message || err.title,
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
async function showImages(currentImageUrl: string, imageUrls: string[]) {
  console.log('Showing images:', currentImageUrl);
  console.log('Showing images:', imageUrls);
  const index = imageUrls.indexOf(currentImageUrl);
  const $viewer = viewerApi({
    images: imageUrls,
    options: {
      inline: true,
      button: true,
      navbar: false,
      title: false,
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
</script>

<style lang="sass" scoped>
.images
  width: -webkit-fill-available
  height: -webkit-fill-available
  cursor: pointer
  transition: transform 0.3s ease-in-out
  &:hover
    transform: scale(1.1)
</style>
