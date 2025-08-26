<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense icon="sym_o_home" label="Home" to="/home" class="q-ml-md" />
        <q-toolbar-title>Forgot Password</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding class="row justify-center">
        <div class="col-auto" style="max-width: 400px; width: 100%; padding: 20px">
          <q-form id="recaptcha-response" @submit="onSubmit" class="q-gutter-y-md">
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
          <p v-if="responseMessage" class="text-secondary text-subtitle1 q-mt-md">{{ responseMessage }}</p>
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
const responseMessage = ref('');
async function onSubmit() {
  responseMessage.value = '';
  $q.loading.show({
    message: 'Requesting ...',
  });
  userStore
    .forgotPassword(email.value)
    .then((response: GenericResponseData | undefined) => {
      console.log('response', response);
      $q.loading.hide();
      const message = 'A password reset email has been sent to your email address, please follow the instructions in the email to reset your password.';
      // $q.notify({
      //   type: 'positive',
      //   message,
      // });
      responseMessage.value = message;
    })
    .catch((err: GenericResponseData | any) => {
      $q.loading.hide();
      const message = err.message ?? err.title ?? 'An error occurred while sending the password reset email.';
      $q.notify({
        type: 'negative',
        message,
      });
      responseMessage.value = message;
    });
}
</script>
