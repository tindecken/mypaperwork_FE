<template>
  <q-layout class="q-pa-md">
    <div class="row justify-end q-col-gutter-md">
      <q-input readonly outlined class="col-6" v-model="name" label="Name *" />
      <q-input readonly outlined class="col-grow" v-model="createdAt" label="Created At" />
    </div>
    <div class="row justify-end q-col-gutter-md q-mt-xs">
      <q-input type="textarea" autogrow readonly outlined class="col-6" v-model="description" label="Description" />
      <q-input readonly outlined class="col-grow" v-model="price" label="Price" />
      <q-input readonly outlined class="col-grow" v-model="priceCurrency" label="Currency" />
    </div>
    <div class="row q-mt-md">
      <span class="self-center">Categories:</span>
      <q-chip outlined v-for="cat in categories" :key="cat.id" outline color="primary" text-color="white" icon="event"> {{ cat.name }}</q-chip>
    </div>
    <div class="row q-mt-md">
      <span class="self-center">Attachments</span>
    </div>
    <div class="row q-mt-md" v-for="attachment in attachments" :key="attachment.id">
      <span class="self-center">{{ attachment.fileName }}</span>
      <span class="self-center">{{ attachment.fileSize }}</span>
      <span class="self-center">Download</span>
    </div>
    <div class="row q-mt-lg" v-if="paperwork">
      <vue-json-pretty :deep="3" showLineNumber :data="(paperwork as unknown as JSONDataType)" />
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
import { JSONDataType } from 'vue-json-pretty/types/utils';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { Category } from 'src/Models/Category/CategoryInterface';
import { AttachmentInterface } from 'src/Models/Document/AttachmentInterface';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();
const paperwork: Ref<PaperworkDetails | null> = ref(null);
const name = ref('');
const description = ref('');
const price = ref('');
const priceCurrency = ref('');
const categories: Ref<Category[]> = ref([]);
const attachments: Ref<AttachmentInterface[]> = ref([]);
const createdAt = ref(paperwork.value?.createdAt.toString());

onBeforeMount(() => {
  paperworkStore
    .getPaperworksById($route.params.id as string)
    .then((response: GenericResponseData | undefined) => {
      console.log('Fetched paperwork:', response?.data);
      paperwork.value = response?.data as PaperworkDetails;
      name.value = paperwork.value?.name;
      description.value = paperwork.value?.description;
      createdAt.value = paperwork.value?.createdAt.toString();
      price.value = paperwork.value?.price.toString();
      priceCurrency.value = paperwork.value?.priceCurrency;
      categories.value = paperwork.value?.categories;
      attachments.value = paperwork.value?.attachments || [];
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
