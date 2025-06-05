import { createAuthClient } from 'better-auth/vue';
export const authClient = createAuthClient({
  baseURL: process.env.API_BASEURL || 'http://localhost:3001', // the base url of your auth server
});
