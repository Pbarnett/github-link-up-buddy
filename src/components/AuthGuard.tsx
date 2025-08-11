import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserInitializationService } from '@/services/userInitialization';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      setIsAuthenticated(hasSession);

      // Initialize user preferences if session exists
      if (hasSession && data.session?.user?.id) {
        UserInitializationService.ensureUserPreferences(data.session.user.id);
      }

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);

        if (event === 'SIGNED_IN' && session) {
          UserInitializationService.handlePostSignin(session.user.id);
        }

        if (event === 'SIGNED_OUT') {
          // Show a friendly session expiry notice; redirect handled by component render
          toast({ title: 'Session expired', description: 'Please sign in again to continue.' });
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkAuth();
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
