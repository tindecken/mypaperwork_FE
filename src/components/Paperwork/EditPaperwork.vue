<template>
  <q-layout class="q-pa-md">
    <div class="header q-pa-md">
      <div class="row justify-end">
        <span class="col title">Infos</span>
      </div>
      <q-form @submit="savePaperwork()">
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input outlined class="col-6" v-model="name" label="Name *" :rules="[(val) => !!val || 'Name is required']" />
          <q-input class="col-6" outlined v-model="issueAt" label="Issue Date" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="issueAt" today-btn mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn flat v-close-popup label="Close" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="row justify-end q-col-gutter-md q-mt-xs">
          <q-input type="textarea" autogrow outlined class="col-12" v-model="note" label="Note (max 2000 chars)" :rules="[(val) => val.length <= 2000 || 'Maximum 2000 chars']" />
        </div>
        <!-- Custom Fields Section -->
        <div class="header q-pa-md q-mt-md q-mb-md">
          <div class="row" :class="$q.screen.xs ? 'justify-between' : 'justify-start'">
            <span class="row self-center title">Custom Fields</span>
            <q-btn flat icon="sym_o_add" label="Add" @click="addCustomField()" class="q-ml-md" />
          </div>
        </div>
        <div class="row q-mt-xs">
          <div class="col-12">
            <div v-for="(field, index) in customFields" :key="index" class="row q-col-gutter-md q-mb-sm">
              <div class="col-5 col-xl-2 col-lg-3">
                <q-input outlined v-model="field.key" label="Name" dense :rules="[(val) => val.length <= 100 || 'Maximum 100 characters']" class="full-width" />
              </div>
              <div class="col-5 col-xl-3 col-lg-4">
                <q-input outlined v-model="field.value" label="Value" dense :rules="[(val) => val.length <= 256 || 'Maximum 256 characters']" class="full-width" />
              </div>
              <div class="col-2 items-start pt-3">
                <q-btn flat round icon="sym_o_delete" @click="removeCustomField(index)" size="md" />
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-end q-mt-sm">
          <div class="col-auto">
            <q-btn flat icon="sym_o_save" label="Save" type="submit" />
            <q-btn flat icon="sym_o_close" class="q-ml-sm" label="Cancel" @click="cancel()" />
          </div>
        </div>
      </q-form>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row" :class="$q.screen.xs ? 'justify-between' : 'justify-start'">
        <span class="row self-center title">Categories</span>
        <q-btn flat icon="sym_o_update" class="q-ml-md" label="Update" @click="updateCategories()" />
      </div>
      <q-chip class="row q-mt-md" outlined v-for="cat in categories" :key="cat.id" outline icon="event" :class="{ 'truncate-chip-labels': truncate }"> {{ cat.name }}</q-chip>
    </div>
    <div class="header q-pa-md q-mt-md q-mb-md">
      <div class="row" :class="$q.screen.xs ? 'justify-between' : 'justify-start'">
        <span class="row title"
          >Documents & Images
          <q-badge class="q-ml-xs badge" :label="attachments.length + images.length" />
          <q-btn flat class="q-ml-md" outline icon="sym_o_attach_file_add" label="Add" @click="addDocuments()" />
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
        <div
          v-for="image in images"
          :key="image.id"
          :class="{
            'col-6 col-md-4 col-lg-3': images.length > 10,
            'col-6': images.length <= 10,
          }"
          style="max-width: 300px; height: 150px"
        >
          <q-img :src="getImageUrl(image.imageBase64!)" @click="showImages(image, images)" class="row images self-center">
            <q-tooltip style="font-size: small">{{ image.fileName }} - {{ prettyBytes(image.fileSize) }} </q-tooltip>
            <q-btn v-if="image.isCover" size="sm" flat round icon="star" style="top: 1px; left: 1px">
              <q-tooltip style="font-size: small">Cover</q-tooltip>
            </q-btn>
            <q-btn size="sm" flat round icon="more_vert" class="absolute all-pointer-events" style="top: 1px; right: 1px" @click.stop>
              <q-menu>
                <q-list style="min-width: 100px" dense>
                  <q-item clickable v-close-popup @click="setCover(image.id)">
                    <q-item-section>Set as cover</q-item-section>
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
  </q-layout>
</template>

<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue';
import { QInput, useQuasar, QTableColumn } from 'quasar';
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
import ConfirmDeleteImageDialog from './Dialogs/ConfirmDeleteImageDialog.vue';
import ConfirmDeleteAttachmentDialog from './Dialogs/ConfirmDeleteAttachmentDialog.vue';
import AddDocumentsDialog from './Dialogs/AddDocumentsDialog.vue';
import UpdateCategoriesDialog from './Dialogs/UpdateCategoriesDialog.vue';
import { RemoveAttachmentRequestModel } from 'src/Models/Document/RemoveAttachmentRequestModel';
import { UpdatePaperworkRequestModel } from 'src/Models/Paperwork/UpdatePaperworkRequestModel';
import { SetCoverRequestModel } from 'src/Models/Document/SetCoverRequestModel';
import { getImageUrl } from 'src/utils/getImageUrl';
import { useCategoryStore } from 'src/stores/categoryStore';

const truncate = ref(true);
const $route = useRoute();
const $router = useRouter();
const documentStore = useDocumentStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const categoryStore = useCategoryStore();
const paperwork: Ref<PaperworkDetails | null> = ref(null);
const name = ref('');
const note = ref('');
const customFields = ref<Array<{ key: string; value: string }>>([]);
const categories: Ref<Category[]> = ref([]);
const attachments: Ref<AttachmentInterface[]> = ref([]);
const images: Ref<ImageInterface[]> = ref([]);
const imagesUrls: Ref<string[]> = ref([]);
const createdAt = ref(paperwork.value?.createdAt.toString());
const issueAt = ref(paperwork.value?.issuedAt.toString());
const columns: QTableColumn[] = [
  {
    name: 'fileName',
    required: true,
    label: 'File Name',
    align: 'left',
    field: 'fileName',
    sortable: true,
  },
  { name: 'fileSize', align: 'right', label: 'Size', field: 'fileSize', sortable: true, format: (val: number) => `${prettyBytes(val)}`, style: 'width: 50px' },
  { name: 'actions', label: 'Actions', align: 'left', field: 'actions' },
];
onMounted(() => {
  $q.loading.show({
    message: 'Getting paperwork ...',
  });
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      note.value = paperwork.value?.note || '';
      issueAt.value = paperwork.value?.issuedAt?.toString();
      createdAt.value = paperwork.value?.createdAt?.toString();
      categories.value = paperwork.value?.categories;
      attachments.value = paperwork.value?.attachments || [];
      images.value = paperwork.value?.images || [];
      imagesUrls.value = images.value.map((image) => getImageUrl(image.imageBase64!));

      // Parse customFields if they exist
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
      if (response?.data) {
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
        $q.loading.hide();
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
function savePaperwork() {
  $q.loading.show({
    message: 'Updating ...',
  });
  const updateRequest: UpdatePaperworkRequestModel = {
    paperworkId: paperwork.value?.id as string,
    name: name.value,
    note: note.value,
    issueAt: issueAt.value ?? null,
    customFields: (() => {
      // Filter out empty fields
      const filteredFields = customFields.value.filter((field) => field.key.trim() !== '' && field.value.trim() !== '');
      if (filteredFields.length === 0) {
        return null;
      }
      return JSON.stringify(filteredFields); // Return the filtered array directly
    })(),
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
async function cancel() {
  await paperworkStore.getPaperworks();
  $router.push('/home');
}

function addCustomField() {
  customFields.value.push({ key: '', value: '' });
}

function removeCustomField(index: number) {
  customFields.value.splice(index, 1);
}
function onRemoveAttachment(attachmentId: string) {
  $q.dialog({
    component: ConfirmDeleteAttachmentDialog,
  })
    .onOk(async () => {
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
      console.log('AddDocumentsDialog onOk()');
      paperworkStore
        .getPaperworksById($route.params.id as string)
        .then((response: GenericResponseData | undefined) => {
          $q.loading.hide();
          paperwork.value = response?.data as PaperworkDetails;
          attachments.value = paperwork.value?.attachments || [];
          images.value = (paperwork.value?.images || []) as ImageInterface[];
          imagesUrls.value = images.value.map((image) => getImageUrl(image.imageBase64!));
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
  }).onOk(async () => {
    $q.loading.show({
      message: 'Getting paperwork ...',
    });
    paperworkStore
      .getPaperworksById($route.params.id as string)
      .then(async (response: GenericResponseData | undefined) => {
        if (response?.data && 'categories' in response.data) {
          categories.value = (response.data as PaperworkDetails).categories;
        }
        await categoryStore.getCategories();
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
@media (max-width: 600px)
  .col-6
    max-width: 50%
</style>
