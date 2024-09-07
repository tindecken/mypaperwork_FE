<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container>
      <div class="row justify-center q-pa-xl">
        <q-btn size="xl" outline color="primary" label="Get associated Files" @click="onCallAPI()" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
import { useFileStore } from 'src/stores/fileStore';

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
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
