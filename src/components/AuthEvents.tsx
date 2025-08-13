import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserInitializationService } from '@/services/userInitialization';

/**
 * Centralized auth event listener mounted once at app root.
 * - Subscribes to Supabase auth events
 * - Defers heavy side-effects per Supabase docs (setTimeout 0)
 * - Deduplicates post-sign-in initialization per session/user
 */
const AuthEvents = () => {
  const lastInitializedRef = useRef<string | null>(null);
  const lastInitAtRef = useRef<number>(0);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Defer heavy effects as recommended by Supabase docs
      setTimeout(() => {
        if (event === 'SIGNED_IN' && session?.user?.id) {
          const key = `${session.user.id}:${session.user?.email ?? ''}:${session.expires_at ?? ''}`;
          const now = Date.now();
          // Avoid running more than once within 10 seconds for the same key
          if (lastInitializedRef.current === key && now - lastInitAtRef.current < 10_000) {
            return;
          }
          lastInitializedRef.current = key;
          lastInitAtRef.current = now;
          void UserInitializationService.handlePostSignin(session.user.id);
        }
      }, 0);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return null;
};

export default AuthEvents;
