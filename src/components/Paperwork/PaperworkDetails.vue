<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end">
      <span class="col title">Infos</span>
      <div class="col-auto">
        <q-btn flat color="primary" label="Edit" @click="editPaperwork()" />
        <q-btn flat class="q-ml-sm" color="primary" label="Back" @click="back()" />
      </div>
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input readonly outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly outlined class="col-6" v-model="issueAt" label="Issue At" />
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input type="textarea" autogrow readonly outlined class="col-6" v-model="note" label="Note" />
    </div>
    <div class="row q-mt-md">
      <span class="self-center">Categories:</span>
      <q-chip outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event" :class="{ 'truncate-chip-labels': truncate }"> {{ cat.name }}</q-chip>
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
          <q-td key="actions" :props="props">
            <q-btn icon="sym_o_download" flat @click="onDownloadAttachment(props.row.id, props.row.fileName)">
              <q-tooltip style="font-size: small">Download</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row q-mt-md">
      <span class="self-center title">Images </span>
      <q-badge class="q-ml-xs badge" color="primary" text-color="black" :label="images.length" />
    </div>
    <div class="row q-mt-md q-col-gutter-lg">
      <div
        v-for="image in images"
        :key="image.id"
        :class="{
          'col-6 col-md-4 col-lg-3': images.length > 10,
          'col-6': images.length <= 10,
        }"
        style="max-width: 300px; height: 150px"
      >
        <q-img :src="getImageUrl(image.imageBase64!)" @click="showImages(image, images)" class="images">
          <q-icon class="absolute all-pointer-events" size="32px" name="info" color="white" style="top: 2px; right: 2px">
            <q-tooltip>{{ image.fileName }} - {{ prettyBytes(image.fileSize) }} </q-tooltip>
          </q-icon>
          <q-btn flat round icon="star" v-if="image.isCover" class="absolute all-pointer-events" size="sm" color="primary" style="top: 2px; left: 2px">
            <q-tooltip style="font-size: small">Cover</q-tooltip>
          </q-btn>
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
import { getImageUrl } from 'src/utils/getImageUrl';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const documentStore = useDocumentStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const paperwork: Ref<PaperworkDetails | null> = ref(null);
const name = ref('');
const note = ref('');
const categories: Ref<Category[]> = ref([]);
const attachments: Ref<AttachmentInterface[]> = ref([]);
const images: Ref<ImageInterface[]> = ref([]);
const imagesUrls: Ref<string[]> = ref([]);
const createdAt = ref(paperwork.value?.createdAt.toString());
const issueAt = ref(paperwork.value?.issuedAt.toString());
const globalStore = useGlobalStore();
const isShowedJson = computed(() => globalStore.isShowedJson);
const truncate = ref(true);
const columns = [
  {
    name: 'fileName',
    required: true,
    label: 'File Name',
    align: 'left' as const,
    field: 'fileName',
    sortable: true,
  },
  { name: 'fileSize', align: 'right' as const, label: 'Size', field: 'fileSize', sortable: true, format: (val: number) => `${prettyBytes(val)}`, style: 'width: 50px' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left' as const },
];
onMounted(() => {
  $q.loading.show({
    message: 'Getting paperwork details...',
  });
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      $q.loading.hide();
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      note.value = paperwork.value?.note || '';
      createdAt.value = paperwork.value?.createdAt?.toString();
      issueAt.value = paperwork.value?.issuedAt?.toString();
      categories.value = paperwork.value?.categories;
      attachments.value = paperwork.value?.attachments || [];
      images.value = paperwork.value?.images || [];
      imagesUrls.value = images.value.map((image) => getImageUrl(image.imageBase64!));
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
  // add loading
  $q.loading.show({
    message: 'Downloading attachment...',
  });
  const body: DownloadAttachmentRequestModel = {
    paperworkId: $route.params.id as string,
    documentId: attachmentId,
  };
  documentStore
    .downloadAttachment(body)
    .then((response: GenericResponseData | undefined) => {
      console.log('body:', body);
      console.log('Downloaded attachment:', response);
      if (response?.data) {
        $q.loading.hide();
        const uint8Array = new Uint8Array(Object.values(response.data!));
        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: 'application/octet-stream' }); // Change the MIME type as needed

        // Create a link element
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = attachmentFileName; // Specify the file name and extension

        // Append to the body (required for Firefox)
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up and remove the link
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);

        $q.notify({
          type: 'positive',
          message: response?.message,
        });
      }
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
}
async function showImages(currentImage: ImageInterface, images: ImageInterface[]) {
  const imageUrls = images.map((image) => ({
    source: getImageUrl(image.imageBase64!),
    fileName: image.fileName,
    fileSize: prettyBytes(image.fileSize),
    alt: image.fileName,
  }));
  const index = images.findIndex((image) => image.id === currentImage.id);
  console.log('imageUrls', imageUrls);
  console.log('index:', index);
  const $viewer = viewerApi({
    images: imageUrls,
    options: {
      url: 'source',
      inline: true,
      button: true,
      navbar: true,
      title: true,
      toolbar: true,
      tooltip: true,
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
function editPaperwork() {
  $router.push(`/paperwork-edit/${$route.params.id}`);
}
function back() {
  $router.back();
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
.truncate-chip-labels > .q-chip
  max-width: 140px

@media (max-width: 600px)
  .col-6
    max-width: 50%
</style>
