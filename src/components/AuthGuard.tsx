import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserInitializationService } from '@/services/userInitialization';

type ReactNode = React.ReactNode;
type AuthGuardProps = {
  children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      setIsAuthenticated(hasSession);
      
      // Initialize user preferences if session exists
      if (hasSession && data.session?.user?.id) {
        UserInitializationService.ensureUserPreferences(data.session.user.id);
      }
      
      const { data: authListener } = supabase.auth.onAuthStateChange((event: string, session: unknown) => {
        setIsAuthenticated(!!session);
        
        if (event === 'SIGNED_IN' && session && typeof session === 'object' && session !== null && 'user' in session) {
          const sessionObj = session as { user: { id: string } };
          UserInitializationService.handlePostSignin(sessionObj.user.id);
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
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
