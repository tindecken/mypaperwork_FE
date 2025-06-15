<template>
  <q-layout view="hHh LpR fFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar style="height: 24px">
        <q-btn dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          <span @click="goHome()" style="cursor: pointer"> My Paperwork {{ $q.version }} </span>
        </q-toolbar-title>
        <user></user>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" side="left" bordered :width="250">
      <left-drawer></left-drawer>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white" style="height: 24px">
      <app-footer></app-footer>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import User from 'src/components/User/User.vue';
import AppFooter from 'src/components/AppFooter/AppFooter.vue';
import LeftDrawer from 'src/components/LeftDrawer/LeftDrawer.vue';
import { authClient } from 'src/utils/auth-client';
import { UserInfoInterface } from 'src/Models/UserInfoInterface';

const categoryStore = useCategoryStore();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();

paperworkStore
  .getPaperworks()
  .then(() => {
    $q.loading.hide();
  })
  .catch((err: GenericResponseData | any) => {
    $q.loading.hide();
    $q.notify({
      type: 'negative',
      message: err.message || err.title || err,
    });
  });

paperworkStore
  .getPaperworks()
  .then(() => {
    $q.loading.hide();
  })
  .catch((err: GenericResponseData | any) => {
    $q.loading.hide();
    $q.notify({
      type: 'negative',
      message: err.message || err.title || err,
    });
  });

onMounted(async () => {
  // Check for existing session from auth client
  try {
    const session = await authClient.getSession();
    if (session && session.data) {
      console.log('session', session);
      // Extract user info from the session
      const userResponse = session.data.user;
      const userInfo: UserInfoInterface = {
        email: userResponse.email,
        name: userResponse.name,
        id: userResponse.id,
        role: null, // Set default value since role doesn't exist in the response
        isExistingPassword: false,
      };
      const loginMethod = await userStore.checkexistingpassword();
      userInfo.isExistingPassword = loginMethod?.data as boolean;

      // Update user store with session data
      userStore.$patch({
        userInfo: userInfo,
      });
    }
  } catch (error) {
    console.error('Error retrieving session:', error);
  }

  $q.loading.show({
    message: 'Getting paperworks...',
  });

  categoryStore
    .getCategories()
    .then(() => {
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
async function goHome() {
  await paperworkStore.getPaperworks();
  $router.push('/home');
}
const leftDrawerOpen = ref($q.platform.is.mobile ? false : true);
</script>
<style lang="sass" scoped></style>
