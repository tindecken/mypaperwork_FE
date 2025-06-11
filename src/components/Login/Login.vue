<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-page-container class="login-page-container">
      <div class="col-auto login-container" style="max-width: 400px; width: 100%; padding: 20px">
        <q-form @submit="onClickLogin" @reset="onReset" class="q-gutter-y-md">
          <q-input outlined v-model="email" label="Email address" lazy-rules :rules="[(val: string) => (val && val.length > 0) || 'Email is required']" />

          <q-input outlined v-model="password" label="Password" :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[(val: string) => (val && val.length > 0) || 'Password is required']">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <div class="text-left">
            <a href="#/forgot-password" class="text-primary">Forgot password?</a>
          </div>

          <q-btn label="Continue" type="submit" outline class="full-width q-py-sm" unelevated />

          <div class="text-left q-my-md">Don't have an account? <a href="#/signup" class="text-primary">Sign up</a></div>

          <div class="row items-center q-my-md">
            <div class="col"><q-separator /></div>
            <div class="col-auto q-px-sm">OR</div>
            <div class="col"><q-separator /></div>
          </div>

          <q-btn outline class="full-width q-py-sm" @click="loginWithGoogle">
            <div class="row items-center no-wrap">
              <q-icon name="mdi-google" size="18px" class="q-mr-sm" />
              <div>Continue with Google</div>
            </div>
          </q-btn>
        </q-form>
      </div>
    </q-page-container>
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
const isPwd = ref(true);
const userStore = useUserStore();

const loginWithGoogle = async () => {
  await authClient.signIn.social(
    {
      provider: 'google',
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      errorCallbackURL: process.env.GOOGLE_ERROR_CALLBACK_URL,
    },
    {
      onSuccess: () => {
        console.log('Google login successful');
      },
      onError: (error) => {
        console.error('Google login failed:', error);
      },
    }
  );
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
      const redirectUrl = `/${$route.query.redirect || 'home'}`;
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

<style scoped>
.login-layout {
  height: 100vh;
}

.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
