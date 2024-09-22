<template>{{ $route.params.id }}</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
import { useUserStore } from 'src/stores/userStore';
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
</script>

<style lang="sass" scoped></style>
