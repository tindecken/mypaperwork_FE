<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="persistent">
    <q-layout
      view="hHh lpR fFf"
      :style="{
        'max-width': maxWidth,
        'min-width': minWidth,
        'min-height': minHeight,
        'max-height': maxHeight,
        border: themeStore && `1px solid ${themeStore.selectedTheme.isDark === 1 ? '#ccc' : '#333'}`,
      }"
      container
      :class="{ 'bg-light-green-1': !isDark }"
    >
      <!-- Header -->
      <q-header reveal class="row justify-between" :class="headerClass || 'bg-primary'">
        <div class="self-center text-subtitle1 q-pl-sm">
          <!-- Title slot -->
          <slot name="title">Dialog Title</slot>
        </div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogCancel()">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>

      <!-- Content container -->
      <q-page-container class="q-pa-sm q-mt-sm" :class="contentClass">
        <!-- Content slot -->
        <slot name="content"></slot>
      </q-page-container>
      <!-- Footer -->
      <footer v-if="hasFooter" reveal class="q-pa-sm" :class="footerClass">
        <div class="row justify-end q-mt-sm">
          <!-- Actions slot -->
          <slot name="actions">
            <q-btn flat label="Cancel" @click="onDialogCancel()" v-close-popup class="q-mr-sm" />
            <q-btn outline label="OK" @click="onDialogOK()" :disable="okDisabled" />
          </slot>
        </div>
      </footer>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useThemeStore } from '../../stores/themeStore';
import { computed } from 'vue';

const isDark = computed(() => useThemeStore().selectedTheme.isDark === 1);

// Define props
const props = defineProps({
  // Layout props
  maxWidth: {
    type: String,
    default: '600px',
  },
  minWidth: {
    type: String,
    default: '300px',
  },
  maxHeight: {
    type: String,
    default: 'auto',
  },
  minHeight: {
    type: String,
    default: '100px !important',
  },
  // Style props
  headerClass: {
    type: [String, Object],
    default: null,
  },
  contentClass: {
    type: [String, Object],
    default: null,
  },
  footerClass: {
    type: [String, Object],
    default: null,
  },
  // Behavior props
  persistent: {
    type: Boolean,
    default: true,
  },
  hasFooter: {
    type: Boolean,
    default: true,
  },
  okDisabled: {
    type: Boolean,
    default: false,
  },
  useTheme: {
    type: Boolean,
    default: true,
  },
});

// Access theme store conditionally
const themeStore = computed(() => (props.useTheme ? useThemeStore() : null));

// Dialog plugin component
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

// Define emits using the dialogPluginComponent emits
defineEmits([...useDialogPluginComponent.emits]);

// Expose the dialog methods for child components
defineExpose({
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
});
</script>
