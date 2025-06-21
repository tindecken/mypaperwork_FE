<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout style="max-width: 598px; min-height: 150px !important" class="bg-grey-9">
      <div class="row">
        <div class="col-grow">
          <q-bar class="bg-grey-9">
            <span class="text-h6 text-white">Confirm Delete</span>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip style="font-size: small">Close</q-tooltip>
            </q-btn>
          </q-bar>
        </div>
      </div>
      <div class="row q-pa-md">
        <span class="text-body1">Are you sure you want to delete this paperwork ?</span>
      </div>
      <div class="row q-pa-md justify-end">
        <q-btn flat label="Cancel" @click="onDialogHide()"></q-btn>
        <q-btn color="red-7" class="q-ml-sm" flat label="Delete" @click="onDelete()"></q-btn>
      </div>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

function onDelete() {
  onDialogOK();
}
</script>
