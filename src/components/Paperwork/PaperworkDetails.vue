<template>{{ $route.params.id }}</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
import { useUserStore } from 'src/stores/userStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();

onBeforeMount(() => {
  // Fetch user data on route change
  paperworkStore
    .getPaperworksById($route.params.id)
    .then((response: GenericResponseData) => {
      console.log('Fetched paperwork:', response.data);
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
