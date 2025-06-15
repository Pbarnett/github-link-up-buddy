
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useDashboardAuth() {
  const [user, setUser] = useState<any>(null);
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
