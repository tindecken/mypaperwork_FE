<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-layout view="hHh lpR fFf" style="max-height: 340px; min-height: 100px !important; min-width: 300px" container :class="isDark ? 'bg-grey-9' : 'bg-grey-3'">
      <q-header reveal bordered class="row justify-between bg-primary">
        <div class="self-center text-subtitle1 q-pl-sm">Change password</div>
        <q-btn class="self-center" dense flat icon="close" @click="onDialogHide">
          <q-tooltip style="font-size: small">Close</q-tooltip>
        </q-btn>
      </q-header>
      <q-page-container class="q-pa-sm">
        <q-form autofocus @submit="changePassword" @validation-success="isFormValid = true" @validation-error="isFormValid = false" ref="form" class="q-mt-sm">
          <div class="row">
            <q-input label="Current Password" outlined dense v-model="currentPassword" :rules="[(val) => !!val || '* Required']" lazy-rules :type="isPwd ? 'password' : 'text'" class="col">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row q-mt-sm">
            <q-input label="New Password" outlined dense v-model="newPassword" :rules="[(val) => !!val || '* Required', (val) => val.length >= 3 || 'Password length has atleast 3 characters.']" :type="isPwd ? 'password' : 'text'" class="col">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row q-mt-sm">
            <q-input
              label="Confirm Password"
              outlined
              dense
              v-model="confirmPassword"
              @blur="validateForm()"
              :rules="[(val) => !!val || '* Required', (val) => val === newPassword || 'Password does not match']"
              lazy-rules
              :type="isPwd ? 'password' : 'text'"
              class="col"
            >
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>
          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancel" @click="onDialogCancel()" v-close-popup class="q-mr-sm" />
            <q-btn outline label="Change" :disable="!isFormValid" type="submit" color="primary" />
          </div>
        </q-form>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, Ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../../stores/userStore';
import { useGlobalStore } from '../../../stores/globalStore';
import { QForm, useDialogPluginComponent } from 'quasar';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const globalStore = useGlobalStore();
const isDark = computed(() => globalStore.darkTheme);
const isPwd = ref(true);
const isFormValid = ref(false);
const form = ref() as Ref<QForm>;
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const emits = defineEmits([...useDialogPluginComponent.emits]);
const userStore = useUserStore();
const $q = useQuasar();
const $route = useRoute();
const $router = useRouter();

function changePassword() {
  const changePasswordRequestData = {
    userId: userStore.userInfo.id,
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmNewPassword: confirmPassword.value,
  } as ChangePasswordRequestModel;
  userStore
    .changePassword(changePasswordRequestData)
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type: 'positive',
        message: `${response?.message}. Return login page.`,
      });
      userStore.$reset();
      const redirectUrl = `/${$route.query.redirect || 'login'}`;
      void $router.replace(redirectUrl);
      onDialogOK();
    })
    .catch((err: GenericResponseData | any) => {
      $q.notify({
        type: 'negative',
        message: err.message || err.title || err,
      });
    });
}
function validateForm() {
  if (form.value !== null) form.value.validate(false);
}
</script>
