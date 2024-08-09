<template>
  <div>
    {{ $q.screen.name }} ({{ $q.screen.sizes }}). Icon set:
    {{ $q.iconSet.name }}
  </div>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
const $q = useQuasar();
</script>
