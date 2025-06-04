<template>
  <div>
    <q-spinner color="primary" size="3em" class="absolute-center" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authClient } from 'src/utils/auth-client';
import { useUserStore } from 'src/stores/userStore';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useCategoryStore } from 'src/stores/categoryStore';

const userStore = useUserStore();
const paperworkStore = usePaperworkStore();
const categoryStore = useCategoryStore();
const router = useRouter();
onMounted(async () => {
  console.log('Logout component mounted');
  try {
    await authClient.signOut();
    console.log('Logout successfully');
    // reset all stores
    userStore.$reset();
    paperworkStore.$reset();
    categoryStore.$reset();
    console.log('Logout successfully 2');
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    router.push('/login');
  }
});
</script>

<style scoped></style>
