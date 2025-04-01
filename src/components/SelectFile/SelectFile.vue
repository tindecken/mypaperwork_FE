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
        <q-btn outline color="primary" label="Create new file" @click="onCreateFile" />
      </div>
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white row inline justify-between" style="height: 24px">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import AppFooter from '../AppFooter/AppFooter.vue';
import User from '../User/User.vue';
import { useUserStore } from 'src/stores/userStore';
import { authClient } from 'src/utils/auth-client';
import CreateFileDialog from '../SelectFile/CreateFileDialog.vue';
import { api } from '../../boot/axios';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();

onBeforeMount(async () => {
  const { data: session, error } = await authClient.getSession();
  if (session) {
    userStore.userInfo.name = session.user.name;
    userStore.userInfo.email = session.user.email;
    userStore.userInfo.userId = session.user.id;
  }
  if (userStore.userInfo.selectedFileId) {
    console.log('userStore.userInfo.selectedFileId', userStore.userInfo.selectedFileId);
    const redirectUrl = `/${$route.query.redirect || 'home'}`;
    void $router.replace(redirectUrl);
  } else {
    // call api to get selectedFileId and role
    let selectedFileId = null;
    let role = null;
    const responseSelectedFileId = await api.get('/files/getSelectedFile', {
      withCredentials: true,
    });
    console.log('responseSelectedFileId', responseSelectedFileId);
    if (responseSelectedFileId.status === 200 && responseSelectedFileId.data.data != null) {
      selectedFileId = responseSelectedFileId.data.data.fileId;
      role = responseSelectedFileId.data.data.role;
      userStore.userInfo.selectedFileId = selectedFileId;
      userStore.userInfo.role = role;
      const redirectUrl = `/${$route.query.redirect || 'home'}`;
      void $router.replace(redirectUrl);
    } // Update the store state
  }
});

function onCreateFile() {
  $q.dialog({
    component: CreateFileDialog,
  })
    .onOk(async (fileId: string) => {
      // set fileId in userStore as selectedFileId
      userStore.userInfo.selectedFileId = fileId;
      // set role in userStore as owner
      userStore.userInfo.role = 'owner';
      // route to /home
      const redirectUrl = `/${$route.query.redirect || 'home'}`;
      void $router.replace(redirectUrl);
    })
    .onCancel(async () => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 250px
</style>
