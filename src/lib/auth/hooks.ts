import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useUser() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthState({ user: null, loading: false, error });
        } else {
          setAuthState({
            user: session?.user ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error:
            error instanceof Error ? error : new Error('Unknown auth error'),
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return authState.user;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setAuthState({ user: null, loading: false, error });
        } else {
          setAuthState({
            user: session?.user ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error:
            error instanceof Error ? error : new Error('Unknown auth error'),
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthState({
        user: session?.user ?? null,
        loading: false,
        error: null,
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error }));
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      const authError =
        error instanceof Error ? error : new Error('Sign in failed');
      setAuthState(prev => ({ ...prev, loading: false, error: authError }));
      return { data: null, error: authError };
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error }));
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      const authError =
        error instanceof Error ? error : new Error('Sign up failed');
      setAuthState(prev => ({ ...prev, loading: false, error: authError }));
      return { data: null, error: authError };
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setAuthState(prev => ({ ...prev, loading: false, error }));
        return { error };
      }

      setAuthState({ user: null, loading: false, error: null });
      return { error: null };
    } catch (error) {
      const authError =
        error instanceof Error ? error : new Error('Sign out failed');
      setAuthState(prev => ({ ...prev, loading: false, error: authError }));
      return { error: authError };
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
  };
}
