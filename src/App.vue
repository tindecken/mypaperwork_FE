<template>
  <router-view />
</template>

<script setup lang="ts">
import { useUserStore } from 'src/stores/userStore';
import { onBeforeMount, watch } from 'vue';
import { Dark } from 'quasar';
import { useGlobalStore } from 'src/stores/globalStore';
import { useReleaseStore } from 'src/stores/release';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const releaseStore = useReleaseStore();

globalStore.$subscribe(() => {
  localStorage.setItem(
    'global',
    JSON.stringify({
      DarkTheme: globalStore.darkTheme,
      SelectedTheme: globalStore.selectedTheme,
      Themes: globalStore.themes,
    })
  );
  Dark.set(globalStore.darkTheme);
});
userStore.$subscribe(() => {
  localStorage.setItem(
    'user',
    JSON.stringify({
      Id: userStore.Id,
      UserName: userStore.UserName,
      Email: userStore.Email,
      Role: userStore.Role,
      Token: userStore.Token,
    })
  );
});
releaseStore.$subscribe(() => {
  localStorage.setItem(
    'release',
    JSON.stringify({
      SelectedRelease: releaseStore.selectedRelease,
      Releases: releaseStore.releases,
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
    userStore.Id = userObj.id;
    userStore.UserName = userObj.UserName;
    userStore.Email = userObj.Email;
    userStore.Role = userObj.Role;
    userStore.Token = userObj.Token;
  }
  const globalStorage = localStorage.getItem('global');

  if (globalStorage) {
    if (JSON.parse(globalStorage).hasOwnProperty('DarkTheme')) {
      globalStore.darkTheme = JSON.parse(globalStorage).DarkTheme;
    }
    if (JSON.parse(globalStorage).hasOwnProperty('Themes')) {
      globalStore.themes = JSON.parse(globalStorage).Themes;
    }
    if (JSON.parse(globalStorage).hasOwnProperty('SelectedTheme')) {
      globalStore.selectedTheme = JSON.parse(globalStorage).SelectedTheme;
    }
  }
  const releaseStorage = localStorage.getItem('release');
  if (releaseStorage) {
    releaseStore.selectedRelease = JSON.parse(releaseStorage).SelectedRelease;
    releaseStore.releases = JSON.parse(releaseStorage).Releases;
  }
});
</script>
