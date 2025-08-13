import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AuthUser = {
  id: string;
  email?: string | null;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        // Test-only shim: if provided by E2E, prefer that user
        const w: any = typeof window !== 'undefined' ? (window as any) : {};
        if (w.__TEST_MODE__ && w.__TEST_AUTH_USER) {
          if (isMounted) setUser({ id: w.__TEST_AUTH_USER.id, email: w.__TEST_AUTH_USER.email });
          return;
        }
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user;
        if (isMounted) {
          setUser(u ? { id: u.id, email: u.email } : null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (isMounted) setUser(u ? { id: u.id, email: u.email } : null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (returnTo?: string) => {
    const publicBase = (import.meta.env.VITE_PUBLIC_BASE_URL as string) || window.location.origin;
    const callbackBase = `${publicBase.replace(/\/$/, '')}/auth/callback`;
    const redirectTo = returnTo ? `${callbackBase}?returnTo=${encodeURIComponent(returnTo)}` : callbackBase;
    return supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
  }, []);

  const signInWithEmailOtp = useCallback(async (email: string, returnTo?: string) => {
    const publicBase = (import.meta.env.VITE_PUBLIC_BASE_URL as string) || window.location.origin;
    const callbackBase = `${publicBase.replace(/\/$/, '')}/auth/callback`;
    const redirectTo = returnTo ? `${callbackBase}?returnTo=${encodeURIComponent(returnTo)}` : callbackBase;
    return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut({ scope: 'global' });
  }, []);

  return { user, loading, signInWithGoogle, signInWithEmailOtp, signOut };
}
