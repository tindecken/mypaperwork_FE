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
import { ref, onMounted, onBeforeMount } from 'vue';
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
import { useThemeStore } from 'src/stores/themeStore';

const themeStore = useThemeStore();
const categoryStore = useCategoryStore();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const paperworkStore = usePaperworkStore();

$q.loading.show({
  message: 'Getting paperworks...',
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
onBeforeMount(() => {
  themeStore.getThemes();
});
onMounted(async () => {
  // Check for existing session from auth client
  try {
    const session = await authClient.getSession();
    if (session && session.data) {
      // Extract user info from the session
      const userResponse = session.data.user;
      const userInfo: UserInfoInterface = {
        email: userResponse.email,
        name: userResponse.name,
        id: userResponse.id,
        role: null,
        isExistingPassword: false,
      };
      const loginMethod = await userStore.checkexistingpassword();
      userInfo.isExistingPassword = loginMethod?.data as boolean;

      // Update user store with session data
      userStore.$patch({
        userInfo: userInfo,
      });
    }
  } catch (error: any) {
    $q.loading.hide();
    $q.notify({
      type: 'negative',
      message: error.message || 'Error retrieving session',
    });
  }

  $q.loading.show({
    message: 'Getting paperworks...',
  });
  themeStore
    .getUserTheme()
    .then(() => {})
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
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
  $q.loading.show({
    message: 'Getting paperworks...',
  });
  await paperworkStore.getPaperworks();
  $q.loading.hide();
  $router.push('/home');
}
const leftDrawerOpen = ref($q.platform.is.mobile ? false : true);
</script>
<style lang="sass" scoped></style>
