<template>
  <q-btn flat :label="userStore.UserName">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="changePassword()">
          <q-item-section>
            <span
              ><q-icon name="password" class="q-mr-sm" />Change Password</span
            >
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="logout">
          <q-item-section>
            <span><q-icon name="exit_to_app" class="q-mr-sm" />Logout</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUserStore } from '../../stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import ChangePasswordDialog from './Dialogs/ChangePasswordDialog.vue';
const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const logout = () => {
  userStore.$reset();
  const redirectUrl = `/${$route.query.redirect || 'login'}`;
  void $router.replace(redirectUrl);
};
const changePassword = () => {
  $q.dialog({
    component: ChangePasswordDialog,
    componentProps: {},
  })
    .onOk(() => {
      // TODO: handle ok
    })
    .onCancel(() => {
      // TODO
    })
    .onDismiss(() => {
      // TODO
    });
};
</script>
