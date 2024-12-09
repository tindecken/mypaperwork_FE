<template>
  <q-layout class="q-pa-md">
    <div class="header q-pa-md">
      <div class="row justify-end">
        <span class="col title">Infos</span>
      </div>
      <q-form @submit="savePaperwork()">
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input outlined class="col-6" v-model="name" label="Name *" />
          <q-input class="col-6" outlined v-model="issueAt" label="Issue Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="issueAt" today-btn mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn flat v-close-popup label="Close" color="primary" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input type="textarea" autogrow outlined class="col-6" v-model="description" label="Description" />
          <q-input type="number" outlined class="col-3" v-model.number="price" label="Price" />
          <q-input outlined class="col-3" v-model="priceCurrency" label="Currency" />
        </div>

        <div class="row justify-end q-mt-sm">
          <div class="col-auto">
            <q-btn flat outline color="primary" label="Save" type="submit" />
            <q-btn flat outline class="q-ml-sm" color="primary" label="Cancel" @click="cancel()" />
          </div>
        </div>
      </q-form>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row">
        <span class="row self-center title">Categories</span>
        <q-btn flat class="q-ml-md" outline icon="sym_o_category" color="primary" label="Update" @click="updateCategories()" />
      </div>
      <q-chip class="row q-mt-md" outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event" :class="{ 'truncate-chip-labels': truncate }"> {{ cat.name }}</q-chip>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row">
        <span class="row title"
          >Documents
          <q-badge class="q-ml-xs badge" color="primary" text-color="black" :label="attachments.length + images.length" />
          <q-btn flat class="q-ml-md" outline icon="sym_o_attach_file_add" color="primary" label="Add" @click="addDocuments()" />
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
          <q-img :src="getImgUrl(image.fileBlob)" @click="showImages(image, images)" class="row images self-center">
            <q-tooltip style="font-size: small">{{ image.fileName }} - {{ prettyBytes(image.fileSize) }} </q-tooltip>
            <q-btn v-if="image.isCover" size="sm" flat round icon="star" color="primary" style="top: 1px; left: 1px">
              <q-tooltip style="font-size: small">Cover</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round icon="more_vert" color="primary" class="absolute all-pointer-events" style="top: 1px; right: 1px" @click.stop>
              <q-menu>
                <q-list style="min-width: 100px" dense>
                  <q-item clickable v-close-popup @click="setCover(image.id)">
                    <q-item-section>Set Cover</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable v-close-popup @click="onRemoveImage(image.id)">
                    <q-item-section>Remove</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-img>
        </div>
      </div>
    </div>
    <div class="row q-mt-lg" v-if="isShowedJson">
      <vue-json-pretty :deep="3" showLineNumber :data="images" />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted, computed } from 'vue';
import { QInput, useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useUserStore } from 'src/stores/userStore';
import { useDocumentStore } from 'src/stores/documentStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { PaperworkDetails } from 'src/Models/Paperwork/PaperworkDetails';
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
import { UpdatePaperworkRequestModel } from 'src/Models/Paperwork/UpdatePaperworkRequestModel';
import { SetCoverRequestModel } from 'src/Models/Document/SetCoverRequestModel';
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
const price = ref(0);
const priceCurrency = ref('');
const categories: Ref<Category[]> = ref([]);
const attachments: Ref<AttachmentInterface[]> = ref([]);
const images: Ref<ImageInterface[]> = ref([]);
const imagesUrls: Ref<string[]> = ref([]);
const createdAt = ref(paperwork.value?.createdAt.toString());
const issueAt = ref(paperwork.value?.issuedAt.toString());
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
  { name: 'actions', label: 'Actions', align: 'left' },
];
onMounted(() => {
  $q.loading.show({
    message: 'Getting paperwork ...',
  });
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      description.value = paperwork.value?.description;
      issueAt.value = paperwork.value?.issuedAt?.toString();
      createdAt.value = paperwork.value?.createdAt?.toString();
      price.value = paperwork.value?.price;
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
  var bytes = new Uint8Array(arrBuff.data);
  var blob = new Blob([bytes.buffer], { type: 'image/jpeg' });
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(blob);
  return imageUrl;
}
async function showImages(currentImage: ImageInterface, images: ImageInterface[]) {
  const imageUrls = images.map((image) => ({
    source: getImgUrl(image.fileBlob),
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
function savePaperwork() {
  $q.loading.show({
    message: 'Updating ...',
  });
  const updateRequest: UpdatePaperworkRequestModel = {
    id: paperwork.value?.id as string,
    name: name.value,
    description: description.value,
    price: price.value,
    priceCurrency: priceCurrency.value,
    issueAt: issueAt.value ?? null,
  };
  paperworkStore
    .updatePaperwork(updateRequest)
    .then(() => {
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: 'Paperwork updated successfully.',
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
function cancel() {
  $router.push('/paperwork-details');
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
      };
      documentStore
        .removeAttachment(request)
        .then(() => {
          attachments.value = attachments.value.filter((attachment) => attachment.id !== attachmentId);
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
        });
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
      };
      documentStore
        .removeAttachment(request)
        .then(() => {
          images.value = images.value.filter((image) => image.id !== imageId);
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
        });
    })
    .onCancel(async () => {})
    .onDismiss(() => {
      // TODO
    });
}
async function setCover(imageId: string) {
  $q.loading.show({
    message: 'Setting cover...',
  });
  const request: SetCoverRequestModel = {
    paperworkId: $route.params.id as string,
    documentId: imageId,
  };
  documentStore
    .setCover(request)
    .then(() => {
      $q.loading.hide();
      images.value = images.value.map((image) => (image.id === imageId ? { ...image, isCover: true } : { ...image, isCover: false }));
      $q.notify({
        type: 'positive',
        message: 'Set cover successfully.',
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
function addDocuments() {
  $q.dialog({
    component: AddDocumentsDialog,
    componentProps: {
      paperworkId: $route.params.id as string,
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
          images.value = (paperwork.value?.images || []) as ImageInterface[];
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
          if (response?.data && 'categories' in response.data) {
            categories.value = (response.data as PaperworkDetails).categories;
          }
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
