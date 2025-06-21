<template>
  <q-btn flat :label="userStore.userInfo.name">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="password()">
          <q-item-section>
            <span><q-icon name="sym_o_password" class="q-mr-sm" />Password</span>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple class="cursor-pointer" router-link to="/settings">
          <q-item-section
            ><span><q-icon name="sym_o_settings" class="q-mr-sm" />Settings</span></q-item-section
          >
        </q-item>
        <q-item clickable v-ripple @click="switchTheme()" class="cursor-pointer">
          <q-item-section
            ><span v-if="Dark.isActive"><q-icon name="sym_o_light_mode" class="q-mr-sm" />Light</span>
            <span v-else><q-icon name="sym_o_dark_mode" class="q-mr-sm" />Dark</span>
          </q-item-section>
        </q-item>
        <q-item clickable v-close-popup @click="logout">
          <q-item-section>
            <span><q-icon name="sym_o_exit_to_app" class="q-mr-sm" />Logout</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useQuasar, Dark } from 'quasar';
import { useUserStore } from 'stores/userStore';
import { useRoute, useRouter } from 'vue-router';
import ChangePasswordDialog from './Dialogs/ChangePasswordDialog.vue';
import SetPasswordDialog from './Dialogs/SetPasswordDialog.vue';
import { usePaperworkStore } from 'src/stores/paperworkStore';
import { useCategoryStore } from 'src/stores/categoryStore';
import { authClient } from 'src/utils/auth-client';

const $route = useRoute();
const $router = useRouter();
const userStore = useUserStore();
const paperworkStore = usePaperworkStore();
const categoryStore = useCategoryStore();

const $q = useQuasar();
const logout = async () => {
  userStore.$reset();
  paperworkStore.$reset();
  categoryStore.$reset();
  await authClient.signOut();
  const redirectUrl = `/${$route.query.redirect || 'login'}`;
  void $router.replace(redirectUrl);
};
const password = () => {
  if (userStore.userInfo.isExistingPassword) {
    $q.dialog({
      component: ChangePasswordDialog,
      componentProps: {},
    })
      .onOk(() => {
        // TODO: handle ok
      })
      .onCancel(() => {
        // TODO
      })
      .onDismiss(() => {
        // TODO
      });
  } else {
    $q.dialog({
      component: SetPasswordDialog,
      componentProps: {},
    })
      .onOk(() => {
        // TODO: handle ok
      })
      .onCancel(() => {
        // TODO
      })
      .onDismiss(() => {
        // TODO
      });
  }
};
function switchTheme() {
  // TO BE IMPLEMENTED
}
</script>
