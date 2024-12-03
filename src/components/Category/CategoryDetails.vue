<template>
  <h4>Category: {{ categoryId }}</h4>
  <paperwork-list></paperwork-list>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import PaperworkList from 'src/components/Paperwork/PaperworkList.vue';

const $route = useRoute();
const $q = useQuasar();
const categoryId = computed(() => $route.params.id);
const paperworkStore = usePaperworkStore();
// watch works directly on a ref
watch(categoryId, async (newCategoryId, oldCategoryId) => {
  $q.loading.show({
    message: 'Loading ...',
  });
  paperworkStore
    .getPaperworksByCategoryId(newCategoryId as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
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

onMounted(() => {
  $q.loading.show({
    message: 'Loading ...',
  });
  paperworkStore
    .getPaperworksByCategoryId($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
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
</script>

<style lang="sass" scoped></style>
