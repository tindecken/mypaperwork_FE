<template>
  <div class="row justify-between">
    <div class="col">{{ $q.screen.name }} - {{ $q.screen.sizes }}</div>
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
