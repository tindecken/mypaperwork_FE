<template>
  <div>
    <q-spinner color="primary" size="3em" class="absolute-center" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from 'src/utils/auth-client';

const router = useRouter();
onMounted(async () => {
  console.log('Logout component mounted');
  try {
    await authClient.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    router.push('/login');
  }
});
</script>

<style scoped></style>
