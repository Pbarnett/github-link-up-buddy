import * as React from 'react';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { trackComponentRender } from '@/utils/debugUtils';
interface CurrentUserState {
  user: User | null;
  userId: string | null;
  loading: boolean;
  error: Error | null;
}

export const useCurrentUser = (): CurrentUserState => {
  // Track hook usage for debugging
  trackComponentRender('useCurrentUser');

  const [state, setState] = useState<CurrentUserState>({
    user: null,
    userId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    let hasInitialized = false;

    const updateState = (newState: Partial<CurrentUserState>) => {
      if (!isMounted) return;

      setState(prev => {
        // Only update if something actually changed
        const _userId = newState.user?.id || null;
        if (
          prev.user?.id === userId &&
          prev.loading === (newState.loading ?? prev.loading) &&
          prev.error === (newState.error ?? prev.error)
        ) {
          return prev; // No change, prevent re-render
        }

        return {
          ...prev,
          ...newState,
          userId,
        };
      });
    };

    const getCurrentUser = async () => {
      if (hasInitialized) return; // Prevent multiple initialization

      try {
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;
        hasInitialized = true;

        if (error) {
          // Don't treat missing session as an error - it's normal for unauthenticated users
          if (error.message?.includes('Auth session missing')) {
            updateState({
              user: null,
              loading: false,
              error: null,
            });
            return;
          }
          throw error;
        }

        updateState({
          user: data.user,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!isMounted) return;
        hasInitialized = true;

        console.error('Error getting user:', error);
        updateState({
          user: null,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      updateState({
        user: session?.user || null,
        loading: false,
        error: null,
      });
    });

    // Initial user check
    getCurrentUser();

    // Clean up subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
