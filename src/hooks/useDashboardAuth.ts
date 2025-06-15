import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  [key: string]: any;
}

export function useDashboardAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (ignore) return;

      if (error) {
        setLoading(false);
        return;
      }
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      ignore = true;
      authListener.subscription.unsubscribe();
    };
  }, []);
  return { user, loading };
}
