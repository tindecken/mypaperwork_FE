import { createAuthClient } from 'better-auth/vue';
export const authClient = createAuthClient({
  baseURL: process.env.API_BASEURL, // the base url of your auth server
});
