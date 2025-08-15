
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface CurrentUserState {
  user: User | null;
  userId: string | null;
  loading: boolean;
  error: Error | null;
}

export const useCurrentUser = (): CurrentUserState => {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    userId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const initFromSession = async () => {
      try {
        // Prefer session-first to avoid AuthSessionMissingError
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (error) {
          // Non-fatal in unauthenticated state; record but don't spam console
          setState(prev => ({ ...prev, loading: false, error }));
          return;
        }

        setState({
          user: session?.user ?? null,
          userId: session?.user?.id ?? null,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!isMounted) return;
        // Log once; avoid noisy stack during initial load
        console.error('Error initializing auth session:', err);
        setState({
          user: null,
          userId: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    // Subscribe to auth state changes (SIGNED_IN, SIGNED_OUT, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMounted) return;
      setState(prev => ({
        ...prev,
        user: session?.user || null,
        userId: session?.user?.id || null,
        // Keep existing error but clear loading once we have an event
        loading: false,
      }));
    });

    // Initial session check
    void initFromSession();

    // Clean up subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
  
  return state;
};
