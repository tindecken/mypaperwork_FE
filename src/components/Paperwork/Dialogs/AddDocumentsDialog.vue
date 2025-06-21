<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 150px !important" class="bg-grey-9">
      <div class="row">
        <div class="col-grow">
          <q-bar class="bg-grey-9">
            <span class="text-h6 text-white">Add Documents</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="addDocuments()" class="col-grow">
          <div class="row q-mt-sm">
            <q-uploader
              hide-upload-btn
              color="grey-6"
              ref="uploader"
              class="col-grow"
              label="Images or Files (max 20 files, max size: 2mb per file)"
              multiple
              max-files="20"
              max-file-size="10000000"
              @rejected="onRejected($event)"
              @added="onAdded($event)"
            />
          </div>
          <div class="row justify-end q-mt-sm">
            <q-btn flat label="Cancel" @click="onDialogHide()"></q-btn>
            <q-btn color="red-7" class="q-ml-sm" flat label="Add" type="submit"></q-btn>
          </div>
        </q-form>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { useDocumentStore } from 'stores/documentStore';
import { UploadDocumentsRequestModel } from 'src/Models/Document/UploadDocumentsequestModel';
import heic2any from 'heic2any';
import { IMAGE_FILE_TYPE } from 'src/constants/imageType';
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const $q = useQuasar();
const documentStore = useDocumentStore();
const uploader = ref();
const props = defineProps({
  paperworkId: {
    type: String,
    required: true,
  },
});

function checkIfDuplicateExists(arr: any[]): boolean {
  return new Set(arr).size !== arr.length;
}
async function onRejected(rejectedEntries: any) {
  if (rejectedEntries.length > 0) {
    console.error('Rejected files:', rejectedEntries);
    if (rejectedEntries[0].failedPropValidation === 'duplicate') {
      // check if there is a duplicate file name in the uploader.value.files array, if so, notify the user
      if (checkIfDuplicateExists(uploader.value?.files)) {
        $q.notify({
          type: 'warning',
          message: "You've added the same file twice.",
        });
      }
    } else if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
      $q.notify({
        type: 'warning',
        message: 'Exceeded the maximum file size.',
      });
    }
  }
}
async function addDocuments() {
  $q.loading.show({
    message: 'Uploading ...',
  });
  const request: UploadDocumentsRequestModel = {
    paperworkId: props.paperworkId,
    files: uploader.value?.files,
  };
  documentStore
    .uploadDocuments(request)
    .then(() => {
      $q.loading.hide();
      $q.notify({
        type: 'positive',
        message: 'Add document(s) successfully.',
      });
      onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
      onDialogHide();
    });
}
async function onAdded(files: any) {
  // loop for all files and check if the file type is not image type, check the size, if the size is > 2MB, notify the user and remove the file
  if (
    files.some((file: File) => {
      // get file type by file.name
      const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);
      return IMAGE_FILE_TYPE.includes(fileExtension.toLowerCase());
    })
  ) {
    const convertedHEICFiles = await Promise.all(
      files.map(async (file: File) => {
        if (file.name.toLowerCase().endsWith('.heic')) {
          $q.loading.show({
            message: 'Converting HEIC to JPEG...',
          });
          const image = await heic2any({ blob: file, toType: 'image/jpeg' });
          $q.loading.hide();
          uploader.value?.removeFile(file);
          if (image instanceof Blob) {
            return new File([image], file.name.replace(/\.heic$/i, '.jpeg'), {
              type: 'image/jpeg',
              lastModified: file.lastModified,
            });
          }
        }
        return file;
      })
    );
    uploader.value?.addFiles(convertedHEICFiles);
  } else {
    // check if the file size is > 2MB, if so, notify the user and remove the file
    if (
      files.some((file: File) => file.size > 2000000) // 2MB = 2000000 bytes
    ) {
      $q.notify({
        type: 'warning',
        message: 'Exceeded the maximum file size (2MB).',
      });
      uploader.value?.removeQueuedFiles();
    } else {
      uploader.value?.addFiles(files);
    }
  }
}
</script>
