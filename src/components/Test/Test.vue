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
import { useFileStore } from 'src/stores/fileStore';
import { usePaperworkStore } from 'src/stores/paperworkStore';

const paperworkStore = usePaperworkStore();
const fileStore = useFileStore();
const onCallAPI = async () => {
  fileStore
    .getAssociatedFiles()
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};
const onCallAPIGetPaperworkById = async () => {
  paperworkStore
    .getPaperworksById('01J6DZDNMWTNMK97HXKWKPSNY3')
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
