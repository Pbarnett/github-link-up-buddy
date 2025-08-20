import { useEffect } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useCurrentUser } from '../hooks/useCurrentUser';

// Sync LaunchDarkly context with auth state
export default function LaunchDarklyAuthSync() {
  const ldClient = useLDClient();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (!ldClient) return;

    // Ensure client initialization completes with a bounded timeout (quiet warning in SDK)
    if (typeof (ldClient as any).waitForInitialization === 'function') {
      try {
        // Some SDK versions accept no args; ignore result intentionally
        void (ldClient as any).waitForInitialization();
      } catch {}
    }

    // Build context from current user
    const identify = async () => {
      try {
        if (user?.id) {
          const context = {
            kind: 'user',
            key: user.id,
            email: user.email ?? undefined,
            // you can extend with app-specific traits here
          } as const;
          if (import.meta.env.DEV) {
            console.log('[LD] identify → user', { key: context.key, email: context.email });
          }
          await ldClient.identify(context);
        } else {
          // Anonymous/device context when signed out
          const anon = { kind: 'device', key: 'anonymous' } as const;
          if (import.meta.env.DEV) {
            console.log('[LD] identify → anonymous', anon);
          }
          await ldClient.identify(anon);
        }
      } catch (e) {
        // Non-fatal: fail closed to defaults on errors
        try { console.warn('[LD] identify failed:', e); } catch {}
      }
    };

    identify();
  }, [ldClient, user?.id, user?.email]);

  return null;
}
