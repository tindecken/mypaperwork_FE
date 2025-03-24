<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container class="row justify-center">
      <div class="col-auto">
        <q-form @submit="onClickLogin" @reset="onReset" style="min-width: 400px" class="q-mt-xl">
          <q-input filled v-model="email" label="Email" lazy-rules :rules="[(val: string) => (val && val.length > 0) || 'Email is required']" />
          <q-input filled type="password" v-model="password" label="Your password" lazy-rules :rules="[(val: string) => (val && val.length > 0) || 'Password is required']" />
          <div>
            <q-btn label="Login" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
    </q-page-container>
    <q-footer reveal bordered class="bg-primary text-white" style="height: 24px"> Tindecken @ 2023 - Quasar: {{ $q.version }} </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import { authClient } from 'src/utils/auth-client';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const email = ref('');
const password = ref('');
const userStore = useUserStore();

const onLogout = async () => {
  try {
    $q.loading.show({
      message: 'Logout new user...',
    });

    const response = await authClient.signOut();

    $q.loading.hide();

    if (response.error) {
      $q.notify({
        type: 'negative',
        message: response.error.message || 'Logout failed',
      });
    } else {
      $q.notify({
        type: 'positive',
        message: 'Logout success',
      });

      // Optionally auto-fill the login form with the registered credentials
      email.value = 'tindecken@gmail.com';
      password.value = 'zzivaldo';
    }
  } catch (error: any) {
    $q.loading.hide();
    $q.notify({
      type: 'negative',
      message: error.message || 'Registration failed',
    });
  }
};
const handleLoginGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: 'google',
  });

  return data;
};
const onClickLogin = async () => {
  $q.loading.show({
    message: 'Authenticating...',
  });
  const payload: AuthenticateRequestModel = {
    email: email.value,
    password: password.value,
  };
  userStore
    .loginByEmailPassword(payload)
    .then((response: GenericResponseData | undefined) => {
      $q.loading.hide();
      console.log('Login success', `/${$route.query.redirect || 'selectfile'}`);
      const redirectUrl = `/${$route.query.redirect || 'selectfile'}`;
      void $router.replace(redirectUrl);
      $q.notify({
        type: 'positive',
        message: response?.message,
      });
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
};
function onReset() {
  email.value = '';
  password.value = '';
}
</script>
