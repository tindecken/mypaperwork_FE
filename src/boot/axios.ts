import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from 'src/stores/userStore';
import { useJwt } from '@vueuse/integrations/useJwt';
import { UserInfoInterface } from '../Models/UserInfoInterface';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({ baseURL: process.env.API_BASEURL });
api.interceptors.request.use((request) => {
  const userStore = useUserStore();
  if (userStore.token) {
    const decodedJwt = useJwt(userStore.token);
    const token = decodedJwt.payload.value as UserInfoInterface;
    const currentTime = Math.floor(Date.now() / 1000);
    if (token.exp && token.exp < currentTime) {
      userStore.$reset();
      window.location.href = '#/login';
      return Promise.reject('Token has expired');
    }
  }
  return request;
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
