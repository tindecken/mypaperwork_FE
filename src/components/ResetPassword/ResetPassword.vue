<template>
  <q-layout view="hHh LpR fFf" class="login-layout">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
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
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGlobalStore } from 'src/stores/globalStore';
import { authClient } from 'src/utils/auth-client';
import { useQuasar } from 'quasar';
const $q = useQuasar();
const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
const resetPassword = ref('');
const isPwd = ref(true);
async function onSubmit() {
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
  console.log('error', error);
  if (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: error.message || 'An error occurred',
    });
    return;
  } else {
    $q.notify({
      position: 'top',
      type: 'positive',
      message: 'Password reset successful. Please login.',
    });
  }
}
</script>
