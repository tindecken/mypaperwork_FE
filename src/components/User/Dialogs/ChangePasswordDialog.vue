<template>
  <DialogBase ref="dialogRef" max-height="320px" min-height="100px !important" min-width="300px" :ok-disabled="!isFormValid">
    <template v-slot:title>Change password</template>
    <template v-slot:content>
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
      </q-form>
    </template>
    <template v-slot:actions>
      <q-btn icon="sym_o_save" label="Change" :disable="!isFormValid" @click="changePassword" class="q-mr-sm" />
      <q-btn icon="sym_o_close" flat label="Cancel" v-close-popup />
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../../../stores/userStore';
import { QForm } from 'quasar';
import { ChangePasswordRequestModel } from 'src/Models/User/ChangePasswordRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import DialogBase from 'src/components/Dialog/DialogBase.vue';
const isPwd = ref(true);
const isFormValid = ref(false);
const form = ref() as Ref<QForm>;
const dialogRef = ref();
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const userStore = useUserStore();
const $q = useQuasar();

function changePassword() {
  const changePasswordRequestData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmNewPassword: confirmPassword.value,
  } as ChangePasswordRequestModel;
  userStore
    .changePassword(changePasswordRequestData)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Password changed successfully.',
      });
      dialogRef.value.onDialogOK();
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
