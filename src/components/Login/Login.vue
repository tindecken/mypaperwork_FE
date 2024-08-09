<template>
  <q-layout view="hHh LpR fFf">
    <q-page-container class="row justify-center">
      <div class="col-auto">
        <q-form
          @submit="onClickLogin"
          @reset="onReset"
          style="min-width: 400px"
          class="q-mt-xl"
        >
          <q-input
            filled
            v-model="username"
            label="User Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Username is required',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Your password"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Password is required',
            ]"
          />

          <div>
            <q-btn label="Submit" type="submit" color="primary" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </div>
    </q-page-container>
    <q-footer
      reveal
      bordered
      class="bg-primary text-white"
      style="height: 24px"
    >
      Tindecken @ 2023 - Quasar: {{ $q.version }}
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { AuthenticateRequestModel } from 'src/Models/Authentication/AuthenticateRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();
const username = ref('');
const password = ref('');
const userStore = useUserStore();
const onClickLogin = async () => {
  const payload: AuthenticateRequestModel = {
    Username: username.value,
    Password: password.value,
  };
  userStore
    .login(payload)
    .then((response: GenericResponseData | undefined) => {
      const redirectUrl = `/${$route.query.redirect || 'home'}`;
      void $router.replace(redirectUrl);
      // suggest for me
      $q.notify({
        type: 'positive',
        message: response?.Message,
      });
    })
    .catch((err: GenericResponseData | any) => {
      $q.notify({
        type: 'negative',
        message: err.message || err.Message,
      });
    });
};
function onReset() {
  username.value = '';
  password.value = '';
}
</script>
