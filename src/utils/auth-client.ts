import { createAuthClient } from 'better-auth/vue';
export const authClient = createAuthClient({
  baseURL: process.env.API_BASEURL + '/auth', // the base url of your auth server
});
