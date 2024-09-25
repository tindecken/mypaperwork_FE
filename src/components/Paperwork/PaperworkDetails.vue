<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end q-col-gutter-md">
      <q-input readonly outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly outlined class="col-grow" v-model="createdAt" label="Created At" />
    </div>
    <div class="row">
      <pre>{{ paperwork }}</pre>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useUserStore } from 'src/stores/userStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { PaperworkDetails } from 'src/Models/Paperwork/PaperworkDetails';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const paperwork: Ref<PaperworkDetails | null> = ref(null);
const name = ref('');
const createdAt = ref(paperwork.value?.createdAt.toString());

onBeforeMount(() => {
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      createdAt.value = paperwork.value?.createdAt.toString();
    })
    .catch((error) => {
      $q.notify({
        type: 'negative',
        message: 'Error fetching paperwork',
      });
    });
});
</script>

<style lang="sass" scoped></style>
