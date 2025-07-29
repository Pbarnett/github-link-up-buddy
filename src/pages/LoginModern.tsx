import * as React from 'react';
import { useState, useEffect, use } from 'react';
import { AlertTriangle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { AuthErrorHandler } from '@/services/authErrorHandler';
import { AuthResilience, SessionManager } from '@/services/authResilience';
import {
  authMigrationService,
  getMigrationStatus,
} from '@/services/authMigrationService';
import {
  modernGoogleAuth,
  type AuthResult,
} from '@/services/modernGoogleAuthService';

/**
 * MODERN LOGIN COMPONENT - Uses Google Identity Services (GIS)
 *
 * This replaces the deprecated gapi.auth2 library with modern Google Identity Services
 * Features:
 * - FedCM support for enhanced privacy
 * - One Tap authentication
 * - Popup fallback for blocked third-party cookies
 * - Enhanced security with token validation
 * - Cross-browser compatibility
 */

const LoginModern = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'standard' | 'fedcm' | 'redirect'>(
    'standard'
  );
  const [oneTapAttempted, setOneTapAttempted] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(getMigrationStatus());

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Validate session with recovery capability
      const sessionValid = await SessionManager.validateAndRecoverSession();

      if (sessionValid) {
        const { data, error } = await supabase.auth.getSession();

        if (!error && data.session) {
          console.log('✅ User already authenticated');
          setIsAuthenticated(true);
          return;
        }
      }

      // If we get here, session validation failed or no session exists
      setIsAuthenticated(false);

      // Update migration status
      setMigrationStatus(getMigrationStatus());

      // Initialize authentication using migration service
      if (migrationStatus.userInMigration) {
        console.log('🚀 Initializing Modern Google Auth via Migration Service');

        // Initialize modern Google Auth
        await modernGoogleAuth.initialize();

        // Determine best auth mode based on browser capabilities
        const privacyMode = await modernGoogleAuth.handlePrivacySettings();
        setAuthMode(privacyMode);

        // Attempt One Tap if not already tried and user not authenticated
        if (!oneTapAttempted && privacyMode !== 'redirect') {
          attemptOneTap();
        }
      } else {
        console.log('🔄 Using Legacy OAuth via Migration Service');
        setAuthMode('redirect'); // Use redirect mode for legacy
      }
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'LoginModern',
        flow: 'initializeAuth',
      });
      setIsAuthenticated(false);
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔍 Auth state changed:', event, !!session);
      setIsAuthenticated(!!session);

      if (event === 'SIGNED_IN' && session) {
        UserInitializationService.handlePostSignin(session.user.id);
        toast({
          title: 'Welcome!',
          description: `Successfully signed in as ${session.user.email}`,
        });
      }
    });

    // Listen for Google Auth events
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
      'googleAuthSuccess',
      handleGoogleAuthSuccess
    );
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.addEventListener(
      'googleAuthError',
      handleGoogleAuthError
    );

    return () => {
      subscription.unsubscribe();
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.removeEventListener(
        'googleAuthSuccess',
        handleGoogleAuthSuccess
      );
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.removeEventListener(
        'googleAuthError',
        handleGoogleAuthError
      );
    };
  };

  const attemptOneTap = async () => {
    if (oneTapAttempted) return;

    try {
      setOneTapAttempted(true);

      // Use migration service for One Tap
      await authMigrationService.displayOneTap();
    } catch (error) {
      console.log('One Tap failed, will use button flow:', error);
    }
  };

  const handleGoogleAuthSuccess = (event: any) => {
    console.log('✅ Google auth success:', event.detail);
    setLoading(false);
  };

  const handleGoogleAuthError = (event: any) => {
    console.error('❌ Google auth error:', event.detail);
    setLoading(false);
    toast({
      title: 'Sign In Failed',
      description: event.detail.error || 'Failed to sign in with Google',
      variant: 'destructive',
    });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      // Check for popup blockers first
      const popupTest =
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.open(
          'about:blank',
          '_blank',
          'width=1,height=1'
        );
      if (!popupTest) {
        toast({
          title: 'Popup Blocked',
          description:
            'Please enable popups for this site to use Google sign-in',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      popupTest.close();

      // Use migration service for sign in
      const result = await authMigrationService.signIn();

      if (!result.success) {
        throw new Error(result.error || 'Sign in failed');
      }

      // The auth state change listener will handle the success case
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'LoginModern',
        flow: 'handleGoogleSignIn',
      });
      setLoading(false);

      toast({
        title: 'Sign In Failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleFallbackAuth = async () => {
    // Fallback to Supabase OAuth redirect for cases where modern methods fail
    setLoading(true);

    try {
      await AuthResilience.withRetry(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.location.origin}/login`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) throw error;
      }, 'fallback-oauth-signin');
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Authentication Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to initiate authentication',
        variant: 'destructive',
      });
    }
  };

  const clearAuthData = () => {
    // Emergency reset function
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });

    toast({
      title: 'Auth Reset',
      description: 'Authentication data cleared. Page will reload.',
    });

    setTimeout(
      () =>
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.location.reload(),
      1000
    );
  };

  if (isAuthenticated) {
    return <Navigate to="/auto-booking" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in with Google to access your dashboard
          </CardDescription>

          {/* Privacy & Security Indicator */}
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-gray-500">
            <Shield size={14} />
            <span>
              {migrationStatus.userInMigration &&
                authMode === 'fedcm' &&
                'Enhanced Privacy Mode (Modern)'}
              {migrationStatus.userInMigration &&
                authMode === 'standard' &&
                'Standard Security Mode (Modern)'}
              {migrationStatus.userInMigration &&
                authMode === 'redirect' &&
                'Compatibility Mode (Modern)'}
              {!migrationStatus.userInMigration && 'Legacy Authentication Mode'}
            </span>
          </div>

          {/* Migration Status Indicator */}
          {import.meta.env.DEV && (
            <div className="mt-2 text-xs text-center">
              <span
                className={`px-2 py-1 rounded text-white ${
                  migrationStatus.userInMigration
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
              >
                {migrationStatus.userInMigration
                  ? '🚀 Modern Auth'
                  : '🔄 Legacy Auth'}
              </span>
              <div className="mt-1 text-gray-400">
                Phase: {migrationStatus.phase} | Rollout:{' '}
                {migrationStatus.rolloutPercentage}%
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Primary Sign In Button */}
          <Button
            className="w-full relative bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          {/* Fallback Options */}
          {(authMode === 'redirect' || !migrationStatus.userInMigration) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                <AlertTriangle size={14} />
                <span>
                  {migrationStatus.userInMigration
                    ? 'Using compatibility mode for enhanced privacy browsers'
                    : 'Using legacy authentication for compatibility'}
                </span>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleFallbackAuth}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {migrationStatus.userInMigration
                  ? 'Alternative Sign In Method'
                  : 'Legacy Sign In Method'}
              </Button>
            </div>
          )}

          {/* One Tap Status */}
          {!oneTapAttempted &&
            authMode !== 'redirect' &&
            migrationStatus.userInMigration && (
              <div className="text-xs text-center text-gray-500">
                Looking for seamless sign-in options...
              </div>
            )}

          {/* Emergency Reset */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full text-xs"
              onClick={clearAuthData}
            >
              🔧 Emergency Reset (Clear Auth Data)
            </Button>
          </div>

          {/* Feature Information */}
          <div className="text-xs text-center text-gray-400 space-y-1">
            {migrationStatus.userInMigration ? (
              <>
                <p>✓ Modern Google Identity Services</p>
                <p>✓ Enhanced security with token validation</p>
                <p>✓ Privacy-first authentication</p>
                <p>✓ FedCM support for enhanced privacy</p>
                <p>✓ Cross-browser compatibility</p>
              </>
            ) : (
              <>
                <p>✓ Legacy OAuth compatibility</p>
                <p>✓ Reliable authentication</p>
                <p>✓ Cross-browser support</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginModern;
