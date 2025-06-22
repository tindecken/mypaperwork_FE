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
import { useThemeStore } from 'src/stores/themeStore';

const themeStore = useThemeStore();
const userStore = useUserStore();
const paperworkStore = usePaperworkStore();
const categoryStore = useCategoryStore();
const router = useRouter();
onMounted(async () => {
  try {
    await authClient.signOut();
    // reset all stores
    userStore.$reset();
    paperworkStore.$reset();
    categoryStore.$reset();
    themeStore.$reset();
    router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
    router.push('/login');
  }
});
</script>

<style scoped></style>
