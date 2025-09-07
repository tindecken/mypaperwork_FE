import { boot } from 'quasar/wrappers';
import { authClient } from 'src/utils/auth-client';

export default boot(async ({ router }) => {
  const w = window as any;
  const isNative = w?.Capacitor?.isNativePlatform?.() === true;
  if (!isNative) return;

  // Add listener for app URL open (deep links)
  w?.Capacitor?.App?.addListener?.('appUrlOpen', async (event: any) => {
    try {
      const url: string = event?.url || '';
      if (!url) return;

      // Handle our OAuth callback deep link
      if (url.startsWith('mypaperwork://auth/callback')) {
        // Optionally parse query for ?error=...
        const hasError = url.includes('error=');
        if (!hasError) {
          // Refresh session from server in WebView context
          await authClient.getSession();
        }
        // Route to home (or any redirect you want)
        void router.replace({ path: '/home' });
      }
    } catch (e) {
      // swallow errors; you can add logging here if desired
      console.error('[deeplink] error handling appUrlOpen', e);
    }
  });
});
