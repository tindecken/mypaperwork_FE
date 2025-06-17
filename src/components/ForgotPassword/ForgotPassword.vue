<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-page-container class="login-page-container">
      <div class="col-auto login-container" style="max-width: 400px; width: 100%; padding: 20px">
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          <q-input
            outlined
            v-model="email"
            label="Email address"
            lazy-rules
            :rules="[
            (val: string) => (val && val.length > 0) || 'Email is required',
            (val: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
          ]"
          />
          <q-btn label="Send" type="submit" outline class="full-width q-py-sm" unelevated />
        </q-form>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from 'src/utils/auth-client';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const email = ref('');
async function onSubmit() {
  const { data, error } = await authClient.requestPasswordReset({
    email: email.value,
    redirectTo: process.env.BASEURL + '/#/reset-password',
  });

  if (error) {
    $q.notify({
      type: 'negative',
      message: typeof error === 'string' ? error : error.message || 'An error occurred',
    });
    return;
  } else {
    $q.notify({
      type: 'positive',
      message: data.message,
    });
  }
}
</script>
