<template>
  <q-layout class="q-pa-md">
    <div class="header q-pa-md">
      <div class="row justify-end">
        <span class="col title">Infos</span>
      </div>
      <q-form @submit="savePaperwork()">
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input outlined class="col-6" v-model="name" label="Name *" />
          <q-input readonly class="col-6" v-model="createdAt" label="Created At" />
        </div>
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input type="textarea" autogrow outlined class="col-6" v-model="description" label="Description" />
          <q-input outlined class="col-3" v-model="price" label="Price" />
          <q-input outlined class="col-3" v-model="priceCurrency" label="Currency" />
        </div>

        <div class="row justify-end">
          <div class="col-auto">
            <q-btn flat color="primary" label="Save" type="submit" />
            <q-btn class="q-ml-sm" flat color="primary" label="Cancel" @click="cancel()" />
          </div>
        </div>
      </q-form>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row">
        <span class="row self-center title">Categories</span>
        <q-btn class="q-ml-md" outline icon="sym_o_category" color="primary" label="Update" @click="updateCategories()" />
      </div>
      <q-chip class="row q-mt-md" outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event" :class="{ 'truncate-chip-labels': truncate }"> {{ cat.name }}</q-chip>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row">
        <span class="row title"
          >Documents
          <q-badge class="q-ml-xs badge" color="primary" text-color="black" :label="attachments.length + images.length" />
          <q-btn class="q-ml-md" outline icon="sym_o_attach_file_add" color="primary" label="Add" @click="addDocuments()" />
        </span>
      </div>
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
              <q-btn icon="sym_o_delete_forever" flat @click="onRemoveAttachment(props.row.id)">
                <q-tooltip style="font-size: small">Delete</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <div class="row q-mt-sm q-col-gutter-lg">
        <div class="col" v-for="image in images" :key="image.id" style="max-width: 300px; height: 150px">
          <q-img :src="getImgUrl(image.fileBlob)" @click="showImages(getImgUrl(image.fileBlob), images)" class="row images self-center">
            <q-tooltip style="font-size: small">{{ image.fileName }} - {{ prettyBytes(image.fileSize) }} </q-tooltip>
            <q-btn round class="absolute all-pointer-events" size="xs" icon="sym_o_delete_forever" color="primary" style="top: 1px; right: 1px" @click.stop="onRemoveImage(image.id)">
              <q-tooltip style="font-size: small">Remove</q-tooltip>
            </q-btn>
          </q-img>
        </div>
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
import ConfirmDeleteImageDialog from './Dialogs/ConfirmDeleteImageDialog.vue';
import ConfirmDeleteAttachmentDialog from './Dialogs/ConfirmDeleteAttachmentDialog.vue';
import AddDocumentsDialog from './Dialogs/AddDocumentsDialog.vue';
import UpdateCategoriesDialog from './Dialogs/UpdateCategoriesDialog.vue';
import { RemoveAttachmentRequestModel } from 'src/Models/Document/RemoveAttachmentRequestModel';
const truncate = ref(true);
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
const paperworkId = $route.params.id as string;
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
  { name: 'actions', label: 'Actions', align: 'left' },
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
  console.log('paperworkId', $route.params.id);
  const body: DownloadAttachmentRequestModel = {
    paperworkId: $route.params.id,
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
function onRemoveAttachment(attachmentId: string) {
  $q.dialog({
    component: ConfirmDeleteAttachmentDialog,
  })
    .onOk(async () => {
      console.log('Removing attachmentId:', attachmentId);
      const request: RemoveAttachmentRequestModel = {
        paperworkId: $route.params.id as string,
        documentId: attachmentId,
      }
      documentStore.removeAttachment(request).then(() => {
        attachments.value = attachments.value.filter((attachment) => attachment.id!== attachmentId);
        $q.notify({
          type: 'positive',
          message: 'Attachment removed successfully.',
        });
      })
      .catch((err: GenericResponseData | any) => {
        $q.notify({
          type: 'negative',
          message: err.message || err.title || err,
        });
      })
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
}
function onRemoveImage(imageId: string) {
  $q.dialog({
    component: ConfirmDeleteImageDialog,
  })
    .onOk(async () => {
      const request: RemoveAttachmentRequestModel = {
        paperworkId: $route.params.id as string,
        documentId: imageId,
      }
      documentStore.removeAttachment(request).then(() => {
        images.value = images.value.filter((image) => image.id!== imageId);
        $q.notify({
          type: 'positive',
          message: 'Image removed successfully.',
        });
      })
        .catch((err: GenericResponseData | any) => {
          $q.notify({
            type: 'negative',
            message: err.message || err.title || err,
          });
        })
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
}
function addDocuments() {
  $q.dialog({
    component: AddDocumentsDialog,
    componentProps: {
      paperworkId: $route.params.id as string
    },
  })
    .onOk(async () => {
      console.log('Added documents');
      // Reload paperwork data
      paperworkStore
        .getPaperworksById($route.params.id as string)
        .then((response: GenericResponseData | undefined) => {
          paperwork.value = response?.data as PaperworkDetails;
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
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
}
async function updateCategories() {
  $q.dialog({
    component: UpdateCategoriesDialog,
    componentProps: { existingCategories: categories.value, paperworkId: $route.params.id as string },
  })
    .onOk(async () => {
      $q.loading.show({
        message: 'Getting paperwork ...',
      });
      paperworkStore
        .getPaperworksById($route.params.id as string)
        .then((response: GenericResponseData | undefined) => {
          categories.value = response?.data?.categories;
          $q.loading.hide();
        })
        .catch((err: GenericResponseData | any) => {
          $q.loading.hide();
          $q.notify({
            type: 'negative',
            message: err.message || err.title || err,
          });
        });
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
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
.header
  border: 1px solid rgba(0, 0, 0, 0.1)
  box-shadow: $shadow-1
.truncate-chip-labels > .q-chip
  max-width: 140px
</style>
