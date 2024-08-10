<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';
import { onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';
import { AuthenticateResponse } from './Models/Authentication/AuthenticateResponse';

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
      id: userStore.id,
      userName: userStore.userName,
      email: userStore.email,
      systemRole: userStore.systemRole,
      token: userStore.token,
      name: userStore.name,
    })
  );
});

watch(
  globalStore,
  (newGlobalStore) => {
    if (newGlobalStore.selectedTheme) {
      document.body.setAttribute(
        'data-theme',
        newGlobalStore.selectedTheme.value
      );
    }
  },
  { deep: true }
);

onBeforeMount(() => {
  const userStorage = localStorage.getItem('user');
  if (userStorage) {
    const userObj = JSON.parse(userStorage) as AuthenticateResponse;
    userStore.id = userObj.id;
    userStore.userName = userObj.userName;
    userStore.email = userObj.email;
    userStore.systemRole = userObj.systemRole;
    userStore.token = userObj.token;
    userStore.name = userObj.name;
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
