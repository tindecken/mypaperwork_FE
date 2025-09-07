<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-header elevated class="bg-primary text-white safe-areas">
      <q-toolbar>
        <q-btn flat dense icon="sym_o_home" label="Home" to="/home" class="q-mr-md" />
        <q-toolbar-title>Reset Password</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page padding class="row justify-center">
        <div class="col-auto" style="max-width: 400px; width: 100%; padding: 20px">
          <q-form @submit="onSubmit" class="q-gutter-y-md">
            <p class="text-subtitle1 q-mb-md">Enter your new password.</p>
            <q-input :type="isPwd ? 'password' : 'text'" outlined v-model="resetPassword" label="New Password" lazy-rules :rules="[(val: string) => (val && val.length > 0) || 'Password is required']">
              <template v-slot:prepend>
                <q-icon name="sym_o_password" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <q-btn label="Set" type="submit" outline class="full-width q-py-sm" unelevated />
          </q-form>
          <div class="q-mt-md" v-if="responseMessage">
            <p class="text-secondary text-subtitle1">{{ responseMessage }}</p>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { authClient } from 'src/utils/auth-client';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const resetPassword = ref('');
const isPwd = ref(true);
const responseMessage = ref('');
async function onSubmit() {
  responseMessage.value = '';
  // Get the hash fragment excluding the # character
  const hashFragment = window.location.hash.substring(1);

  // Split the hash to separate the path from query params
  // Format is typically "#/path?query=params"
  const hashParts = hashFragment.split('?');

  // If there are query params after the hash
  const hashParams = hashParts.length > 1 ? new URLSearchParams(hashParts[1]) : new URLSearchParams('');

  // Get token from hash params
  const token = hashParams.get('token');

  if (!token) {
    $q.notify({
      type: 'negative',
      message: 'Token not found',
    });
    return;
  }

  const { data, error } = await authClient.resetPassword({
    newPassword: resetPassword.value,
    token: token,
  });
  if (error) {
    if (error.message === 'invalid token') {
      responseMessage.value = 'The token is invalid or expired.';
    } else {
      responseMessage.value = error.message || 'An error occurred';
    }
    console.log(error);
    return;
  } else {
    responseMessage.value = 'Password reset successful. Please login with your new password.';
  }
}
</script>
<style scoped>
/* Apply safe-area padding to any element marked with .safe-areas.
   We use env() directly so it works even if CSS variables are not set. */
.safe-areas,
.q-header.safe-areas {
  padding-top: env(safe-area-inset-top, 0px);
  padding-right: env(safe-area-inset-right, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-left: env(safe-area-inset-left, 0px);
}

@supports (left: env(safe-area-inset-left)) {
  .safe-areas {
    --safe-area-left: env(safe-area-inset-left);
    --safe-area-right: env(safe-area-inset-right);
    --safe-area-top: env(safe-area-inset-top);
    --safe-area-bottom: env(safe-area-inset-bottom);
  }
}
</style>
