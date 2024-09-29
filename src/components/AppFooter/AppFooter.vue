<template>
  <div class="row justify-between">
    <div class="col">{{ $q.screen.name }} - {{ $q.screen.sizes }}</div>
    <div class="col-auto">
      <q-btn size="sm" flat @click="toogleIsShowJson()">Show/hide Json</q-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';

const globalStore = useGlobalStore();
const $q = useQuasar();
function toogleIsShowJson() {
  $q.loading.show();
  globalStore.toggleIsShowedJson();
  $q.loading.hide();
}
</script>
