
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
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        setState({
          user: data.user,
          userId: data.user?.id || null,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error getting user:", error);
        setState({
          user: null,
          userId: null,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          userId: session?.user?.id || null,
        }));
      }
    );
    
    // Initial user check
    getCurrentUser();
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return state;
};
