<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>
      <div class="row justify-center q-pa-xl">
        <q-btn size="xl" outline color="primary" label="Get associated Files" @click="onCallAPI()" />
      </div>
      <div class="row justify-center q-pa-xl">
        <q-btn size="xl" outline color="primary" label="Get paperwork by id" @click="onCallAPIGetPaperworkById()" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useQuasar } from 'quasar';

const paperworkStore = usePaperworkStore();
const $q = useQuasar();

const onCallAPI = async () => {
  // TODO
};
const onCallAPIGetPaperworkById = async () => {
  paperworkStore
    .getPaperworksById('01J6DZDNMWTNMK97HXKWKPSNY3')
    .then((response) => {})
    .catch((err: GenericResponseData | any) => {
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
