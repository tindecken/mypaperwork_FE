<template>
  <DialogBase ref="dialogBaseRef" max-height="180px" max-width="598px" min-height="150px !important" :has-footer="false">
    <template v-slot:title>
      <span class="text-h6 text-white">Confirm Delete</span>
    </template>
    <template v-slot:content>
      <div class="q-pa-md">
        <span class="text-body1">Are you sure you want to delete this attachment ?</span>
      </div>
      <div class="q-pa-md justify-end row">
        <q-btn flat label="Cancel" v-close-popup class="q-mr-sm" />
        <q-btn color="primary" flat label="Delete" @click="onDelete()" />
      </div>
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DialogBase from 'src/components/Dialog/DialogBase.vue';

const dialogBaseRef = ref();

function onDelete() {
  dialogBaseRef.value.onDialogOK();
}
</script>
