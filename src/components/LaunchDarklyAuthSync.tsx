import { useEffect } from 'react';
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { useCurrentUser } from '@/hooks/useCurrentUser';

// Sync LaunchDarkly context with auth state
export default function LaunchDarklyAuthSync() {
  const ldClient = useLDClient();
  const { user } = useCurrentUser();

  useEffect(() => {
    if (!ldClient) return;

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
          await ldClient.identify(context);
        } else {
          // Anonymous/device context when signed out
          await ldClient.identify({ kind: 'device', key: 'anonymous' } as const);
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
