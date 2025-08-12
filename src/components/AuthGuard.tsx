import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      if (isMounted) setIsAuthenticated(hasSession);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) setIsAuthenticated(!!session);

        // On SIGNED_OUT show a friendly session expiry notice; redirect handled by component render
        if (!session) {
          toast({ title: 'Session expired', description: 'Please sign in again to continue.' });
        }
      });

      unsubscribe = () => authListener.subscription.unsubscribe();
    };

    checkAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    const returnTo = `${location.pathname}${location.search || ''}${location.hash || ''}` || '/auto-booking';
    try {
      sessionStorage.setItem('returnTo', returnTo);
    } catch {}
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
