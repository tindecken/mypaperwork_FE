<template>
  <DialogBase 
    ref="dialogRef"
    max-height="340px" 
    min-height="100px !important" 
    min-width="300px"
    header-class="bg-primary"
    content-class="bg-primary"
    :ok-disabled="!isFormValid">
    <template v-slot:title>Set Password</template>
    <template v-slot:content>
      <q-form autofocus @submit="setPassword" @validation-success="isFormValid = true" @validation-error="isFormValid = false" ref="form" class="q-mt-sm">
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
      <q-btn flat label="Cancel" v-close-popup class="q-mr-sm" />
      <q-btn flat label="Set" :disable="!isFormValid" @click="setPassword" color="primary" />
    </template>
  </DialogBase>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../../../stores/userStore';
import { QForm } from 'quasar';
import { SetPasswordRequestModel } from 'src/Models/User/SetPasswordRequestModel';
import { GenericResponseData } from 'src/Models/GenericResponseData';
import DialogBase from 'src/components/Dialog/DialogBase.vue';

const isPwd = ref(true);
const isFormValid = ref(false);
const form = ref() as Ref<QForm>;
const dialogRef = ref();
const newPassword = ref('');
const confirmPassword = ref('');
const userStore = useUserStore();
const $q = useQuasar();

function setPassword() {
  const setPasswordRequestModel = {
    password: newPassword.value,
  } as SetPasswordRequestModel;
  userStore
    .setPassword(setPasswordRequestModel)
    .then((response: GenericResponseData | undefined) => {
      $q.notify({
        type: 'positive',
        message: `${response?.message}. Return login page.`,
      });
      userStore.userInfo.isExistingPassword = true;
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
