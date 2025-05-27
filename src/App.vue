<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';
import { onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';

const globalStore = useGlobalStore();
const userStore = useUserStore();

globalStore.$subscribe(() => {
  localStorage.setItem(
    'global',
    JSON.stringify({
      darkTheme: globalStore.darkTheme,
      selectedTheme: globalStore.selectedTheme,
      themes: globalStore.themes,
    })
  );
  Dark.set(globalStore.darkTheme);
});
userStore.$subscribe(() => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      token: userStore.token,
      userId: userStore.userInfo.userId,
      userName: userStore.userInfo.userName,
      email: userStore.userInfo.email,
      name: userStore.userInfo.name,
      role: userStore.userInfo.role,
    })
  );
});

watch(
  globalStore,
  (newGlobalStore) => {
    if (newGlobalStore.selectedTheme) {
      document.body.setAttribute('data-theme', newGlobalStore.selectedTheme.value);
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  const userStorage = localStorage.getItem('user');
  if (userStorage) {
    const userObj = JSON.parse(userStorage);
    userStore.userInfo.userId = userObj.userId;
    userStore.userInfo.userName = userObj.userName;
    userStore.userInfo.email = userObj.email;
    userStore.userInfo.name = userObj.name;
    userStore.userInfo.role = userObj.role;
    userStore.token = userObj.token;
  }
  const globalStorage = localStorage.getItem('global');

  if (globalStorage) {
    if (JSON.parse(globalStorage).hasOwnProperty('darkTheme')) {
      globalStore.darkTheme = JSON.parse(globalStorage).darkTheme;
    }
    if (JSON.parse(globalStorage).hasOwnProperty('themes')) {
      globalStore.themes = JSON.parse(globalStorage).themes;
    }
    if (JSON.parse(globalStorage).hasOwnProperty('selectedTheme')) {
      globalStore.selectedTheme = JSON.parse(globalStorage).selectedTheme;
    }
  }
});
</script>
