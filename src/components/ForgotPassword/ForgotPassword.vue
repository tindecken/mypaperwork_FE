<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Forgot Password</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding class="row justify-center">
        <div class="col-auto" style="max-width: 400px; width: 100%; padding: 20px">
          <q-form @submit="onSubmit" class="q-gutter-y-md">
            <p class="text-subtitle1 q-mb-md">Enter your email address and click Send to receive a password reset link.</p>
            <q-input
              outlined
              v-model="email"
              label="Email address"
              lazy-rules
              :rules="[
            (val: string) => (val && val.length > 0) || 'Email is required',
            (val: string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Please enter a valid email'
          ]"
            >
              <template v-slot:prepend>
                <q-icon name="sym_o_email" />
              </template>
            </q-input>
            <q-btn icon="sym_o_send" label="Send" type="submit" outline class="full-width q-py-sm" unelevated> </q-btn>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const userStore = useUserStore();
const $q = useQuasar();
const email = ref('');
async function onSubmit() {
  $q.loading.show({
    message: 'Requesting ...',
  });
  userStore
    .forgotPassword(email.value)
    .then((response: GenericResponseData | undefined) => {
      console.log('response', response);
      $q.loading.hide();
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
}
</script>
