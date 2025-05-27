<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Register</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding class="row justify-center items-center">
        <q-card class="register-card">
          <q-card-section class="text-center">
            <h4 class="text-h4 q-mb-md">Register</h4>
          </q-card-section>

          <q-card-section>
            <q-form @submit="handleSubmit" class="q-gutter-md">
              <q-input v-model="formData.name" label="Name" :rules="[(val) => !!val || 'Name is required']" outlined>
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input v-model="formData.email" label="Email" type="email" :rules="[(val) => !!val || 'Email is required', (val) => validateEmail(val) || 'Invalid email format']" outlined>
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input v-model="formData.password" label="Password" :type="isPwd ? 'password' : 'text'" :rules="[(val) => !!val || 'Password is required', (val) => val.length >= 6 || 'Password must be at least 6 characters']" outlined>
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-input
                v-model="formData.confirmPassword"
                label="Confirm Password"
                :type="isPwdConfirm ? 'password' : 'text'"
                :rules="[(val) => !!val || 'Please confirm your password', (val) => val === formData.password || 'Passwords do not match']"
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isPwdConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwdConfirm = !isPwdConfirm" />
                </template>
              </q-input>

              <div class="row justify-center q-mt-md">
                <q-btn type="submit" color="primary" label="Register" :loading="loading" class="full-width" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from 'src/stores/userStore';
import { GenericResponseData } from 'src/Models/GenericResponseData';

const userStore = useUserStore();
const $route = useRoute();
const $router = useRouter();
interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isDeleted: number;
}

const $q = useQuasar();

const formData = ref<FormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  isDeleted: 0,
});

const isPwd = ref(true);
const isPwdConfirm = ref(true);
const loading = ref(false);

const validateEmail = (email: string): boolean => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(email);
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    // Here you would typically make an API call to register the user
    console.log('Form submitted:', formData.value);
    userStore
      .register(formData.value)
      .then((res: GenericResponseData | undefined) => {
        console.log('res', res);
        const redirectUrl = `/${$route.query.redirect || 'home'}`;
        void $router.replace(redirectUrl);
        $q.notify({
          type: 'positive',
          message: 'Registration successful!',
        });
      })
      .catch((err: GenericResponseData | any) => {
        $q.loading.hide();
        $q.notify({
          type: 'negative',
          message: err.message || err.title || err,
        });
      });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Registration failed. Please try again.',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-card {
  width: 100%;
  max-width: 400px;
}
</style>
