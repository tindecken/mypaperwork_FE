<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-toolbar-title> My Paperwork {{ $q.version }} </q-toolbar-title>
        <user></user>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <div class="row q-pa-md justify-center q-gutter-md">
        <q-card class="my-card">
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </q-card-section>
        </q-card>
        <q-card class="my-card">
          <q-card-section>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </q-card-section>
        </q-card>
      </div>
      <div class="row justify-center">
        <q-btn outline color="primary" label="Create new file" />
      </div>
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white row inline justify-between" style="height: 24px">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
