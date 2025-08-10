import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function AuthDebug() {
  const [info, setInfo] = useState<any>({});

  useEffect(() => {
    (async () => {
      const env = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_PUBLIC_BASE_URL: import.meta.env.VITE_PUBLIC_BASE_URL,
      };
      const sessionRes = await supabase.auth.getSession();
      const userRes = await supabase.auth.getUser();
      setInfo({ env, session: sessionRes.data, user: userRes.data });
    })();
  }, []);

  return (
    <pre style={{ padding: 16, background: '#111', color: '#0f0', overflow: 'auto' }}>
      {JSON.stringify(info, null, 2)}
    </pre>
  );
}
