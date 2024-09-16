<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 410px !important" :class="isDark ? 'bg-dark' : 'bg-white'" :style="isDark ? 'border: 1px solid white' : 'border: 1px solid black'">
      <div class="row">
        <div class="col-grow">
          <q-bar :class="isDark ? 'bg-grey-9' : 'bg-grey-7'">
            <span class="text-h6 text-white">Paperwork</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <q-form @submit="post()" class="col-grow">
          <div class="row">
            <q-input class="col-grow" outlined dense v-model="name" label="Name"> </q-input>
          </div>
          <div class="row q-mt-md">
            <q-input type="textarea" class="col-grow" outlined dense v-model="description" label="Description"> </q-input>
          </div>
          <q-separator class="row q-mt-sm" color="amber" size="1px" />
          <div class="row q-mt-sm">
            <q-uploader :color="isDark ? 'grey-9' : 'grey-6'" ref="uploader" class="col-grow" label="Images (max 50 file, max size: 20mb per file)" multiple hide-upload-btn max-files="50" max-file-size="20000000" @rejected="onRejected($event)" />
          </div>
          <div class="row justify-end">
            <q-btn class="q-mt-sm" outline label="Create" type="submit" style="height: 50px; width: 100px" />
          </div>
        </q-form>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { QInput, useDialogPluginComponent, useQuasar, QEditor } from 'quasar';
import { ref } from 'vue';

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
const isDark = ref(false);
const $q = useQuasar();
const description = ref('');
const name = ref('');
const uploader = ref();
async function createCategory() {
  // TODO: Implement create category logic
}
async function onRejected(rejectedFiles: any) {
  // TODO: Implement on rejected logic
}
</script>
