type FormEvent = React.FormEvent;

import * as React from 'react';
import { AuthErrorHandler } from '@/services/authErrorHandler';
import { AuthResilience, SessionManager } from '@/services/authResilience';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserInitializationService } from '@/services/userInitialization';

/**
 * LOGIN COMPONENT - GOOGLE-ONLY MVP
 *
 * Magic Link functionality has been ARCHIVED (not deleted) for the MVP.
 * To restore magic link authentication:
 * 1. Uncomment the email state (around line 46)
 * 2. Uncomment the handleEmailLogin function (around lines 73-119)
 * 3. Uncomment the magic link form UI (around lines 202-232)
 * 4. Update the card description and button styling as needed
 */

// Auth state cleanup utility
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');

  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });

  // Remove from sessionStorage if in use
  try {
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore if sessionStorage is not available
  }
};

const Login = () => {
  // ARCHIVED: Email state (not needed for Google-only MVP)
  // const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize auth state and handle any OAuth callbacks
    const initializeAuth = async () => {
      try {
        // First, check for any OAuth callback in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        if (
          hashParams.has('access_token') ||
          urlParams.has('code') ||
          hashParams.has('refresh_token')
        ) {
          console.log(
            '🔗 OAuth callback detected, waiting for Supabase to process...'
          );

          // Give Supabase a moment to process the OAuth callback
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Validate session with recovery capability
        const sessionValid = await SessionManager.validateAndRecoverSession();
        
        if (sessionValid) {
          const { data, error } = await supabase.auth.getSession();
          
          if (!error && data.session) {
            console.log('✅ User authenticated successfully');
            setIsAuthenticated(true);
            return;
          }
        }

        // If we get here, session validation failed or no session exists
        setIsAuthenticated(false);
      } catch (error) {
        AuthErrorHandler.handleAuthError(error, {
          component: 'Login',
          flow: 'initializeAuth'
        });
        setIsAuthenticated(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        '🔍 Auth state changed:',
        event,
        session?.user?.id,
        !!session
      );
      setIsAuthenticated(!!session);

      if (event === 'SIGNED_IN' && session) {
        // Call user initialization service
        UserInitializationService.handlePostSignin(session.user.id);
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ARCHIVED: Magic Link Login (commented out for Google-only MVP)
  // Uncomment this function to restore magic link functionality
  /*
  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out globally (ignore errors)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // console.log('Sign out error (ignored):', signOutError); // Removed
      }
      
      // Now sign in with OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auto-booking',
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We've sent you a login link",
      });
    } catch (error: unknown) {
      errorHandler.handleAuthError(error, {
        component: 'Login',
        flow: 'handleGoogleLogin'
      });
    } finally {
      setLoading(false);
    }
  };
  */

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      // Log debugging information
      // console.log("Initiating Google login from:", window.location.origin); // Removed
      // console.log("Redirect URL:", window.location.origin + '/dashboard'); // Removed

      // Log known Supabase configuration (using hardcoded known values instead of accessing protected properties)
      // console.log("Supabase URL:", "https://bbonngdyfyfjqfhvoljl.supabase.co"); // Removed
      // console.log("Supabase auth config:", { // Removed
      //   storage: "localStorage", // Removed
      //   autoRefreshToken: true, // Removed
      //   persistSession: true // Removed
      // }); // Removed

      // Check for popup blockers
      const popupTest = window.open(
        'about:blank',
        '_blank',
        'width=1,height=1'
      );
      if (!popupTest) {
        toast({
          title: 'Popup Blocked',
          description: 'Please enable popups for this site to use Google login',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      popupTest.close();

      // console.log("Sending OAuth request with params:", { // Removed
      //   provider: 'google', // Removed
      //   options: { // Removed
      //     redirectTo: window.location.origin + '/dashboard', // Removed
      //     skipBrowserRedirect: false // Removed
      //   } // Removed
      // }); // Removed

      // Sign in with Google OAuth using retry logic
      await AuthResilience.withRetry(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin + '/auto-booking',
            skipBrowserRedirect: false,
          },
        });
        
        if (error) throw error;
      }, 'google-oauth-signin');
    } catch (error: unknown) {
      const authError = AuthErrorHandler.handleAuthError(error, {
        component: 'Login',
        flow: 'handleGoogleLogin'
      });
      
      toast({
        title: 'Google Login Failed',
        description: authError.userMessage,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/auto-booking" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">Sign In</CardTitle>
          <CardDescription className="text-gray-600 text-base mt-2">
            Sign in with Google to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ARCHIVED: Magic Link Form (commented out for Google-only MVP) */}
          {/* Uncomment this section to restore magic link functionality */}
          {/*
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)} 
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending link...' : 'Send Magic Link'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          */}

          <Button
            className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </div>
            )}
          </Button>

          <div className="pt-6 border-t border-gray-300">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full text-xs bg-red-600 hover:bg-red-700 text-white font-medium"
              onClick={() => {
                cleanupAuthState();
                toast({
                  title: 'Auth Reset',
                  description: 'Authentication data cleared. Page will reload.',
                });
                setTimeout(() => window.location.reload(), 1000);
              }}
            >
              🔧 Emergency Reset (Clear Auth Data)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
