<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end">
      <span class="col title">Infos</span>
      <div class="col-auto">
        <q-btn flat icon="sym_o_edit" label="Edit" @click="editPaperwork()" />
        <q-btn flat icon="sym_o_arrow_back" class="q-ml-sm" label="Back" @click="back()" />
      </div>
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input readonly outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly outlined class="col-6" v-model="issueAt" label="Issue At" />
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input type="textarea" autogrow readonly outlined class="col-12" v-model="note" label="Note" />
    </div>

    <!-- Custom Fields Section -->
    <div class="row q-mt-md" v-if="customFields && customFields.length > 0">
      <span class="col title">Custom Fields</span>
    </div>
    <div class="row q-col-gutter-md q-mt-xs" v-if="customFields && customFields.length > 0">
      <div v-for="(field, index) in customFields" :key="index" class="col-12 q-mb-sm">
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <q-input readonly outlined dense v-model="field.key" label="Name" />
          </div>
          <div class="col-6">
            <q-input readonly outlined dense v-model="field.value" label="Value" />
          </div>
        </div>
      </div>
    </div>
    <div class="row q-mt-md title">
      <span class="self-center">Categories:</span>
      <q-chip outlined v-for="cat in categories" :key="cat.id" outline icon="event" :class="{ 'truncate-chip-labels': truncate }"> {{ cat.name }}</q-chip>
    </div>
    <span class="row q-mt-md title"
      >Attachments
      <q-badge class="q-ml-xs badge" color="primary" :label="attachments.length" />
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
      <q-badge class="q-ml-xs badge" color="primary" :label="images.length" />
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
          <q-btn flat round icon="star" v-if="image.isCover" class="absolute all-pointer-events" size="sm" style="top: 2px; left: 2px">
            <q-tooltip style="font-size: small">Cover</q-tooltip>
          </q-btn>
        </q-img>
      </div>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useDocumentStore } from 'src/stores/documentStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { PaperworkDetails } from 'src/Models/Paperwork/PaperworkDetails';
import { Category } from 'src/Models/Category/CategoryInterface';
import { AttachmentInterface } from 'src/Models/Document/AttachmentInterface';
import { DownloadAttachmentRequestModel } from 'src/Models/Document/DownloadAttachmentRequestModel';
import { ImageInterface } from 'src/Models/Document/ImageInterface';
import { api as viewerApi } from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import prettyBytes from 'pretty-bytes';
import { getImageUrl } from 'src/utils/getImageUrl';

const $route = useRoute();
const $router = useRouter();
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
const customFields = ref<Array<{ key: string; value: string }>>([]);
const createdAt = ref(paperwork.value?.createdAt.toString());
const issueAt = ref(paperwork.value?.issuedAt.toString());
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
// watch works directly on a ref
const paperworkId = computed(() => $route.params.id as string);
// Function to process paperwork data from API response
const processPaperworkData = (response: GenericResponseData | undefined) => {
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

  // Handle customFields - could be a JSON string or already an object
  if (paperwork.value?.customFields) {
    try {
      // Check if it's already an object
      if (typeof paperwork.value.customFields === 'object') {
        customFields.value = paperwork.value.customFields;
      } else if (typeof paperwork.value.customFields === 'string') {
        // If it's a string, try to parse it as JSON
        customFields.value = JSON.parse(paperwork.value.customFields);
      } else {
        console.warn('customFields has unexpected type:', typeof paperwork.value.customFields);
        customFields.value = [];
      }
    } catch (error) {
      console.error('Error handling customFields:', error);
      customFields.value = [];
    }
  } else {
    customFields.value = [];
  }
};

watch(paperworkId, async (newPaperworkId) => {
  $q.loading.show({
    message: 'Loading ...',
  });
  paperworkStore
    .getPaperworksById(newPaperworkId as string)
    .then((response: GenericResponseData | undefined) => {
      processPaperworkData(response);
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
});
onMounted(() => {
  $q.loading.show({
    message: 'Getting paperwork details...',
  });
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      processPaperworkData(response);
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
  viewerApi({
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
