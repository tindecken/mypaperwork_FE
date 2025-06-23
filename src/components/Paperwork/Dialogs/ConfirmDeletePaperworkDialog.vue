<template>
  <DialogBase 
    ref="dialogRef" 
    max-width="598px" 
    min-height="150px !important" 
    header-class="bg-grey-9"
    content-class="bg-grey-9"
    footer-class="bg-grey-9"
    :has-footer="false">
    <template v-slot:title>
      <span class="text-h6 text-white">Confirm Delete</span>
    </template>
    <template v-slot:content>
      <div class="q-pa-md">
        <span class="text-body1">Are you sure you want to delete this paperwork ?</span>
      </div>
      <div class="q-pa-md justify-end row">
        <q-btn flat label="Cancel" v-close-popup class="q-mr-sm" />
        <q-btn color="red-7" flat label="Delete" @click="onDelete()" />
      </div>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogBase from 'src/components/Dialog/DialogBase.vue';

defineEmits(['ok', 'hide', 'cancel']);
const dialogRef = ref();

function onDelete() {
  dialogRef.value.onDialogOK();
}
</script>
