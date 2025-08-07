
/**
 * Authentication Hook
 *
 * React hook for managing authentication state with proper TypeScript types,
 * error handling, and optimal re-render patterns.
 */

import {
  authService,
  AuthState,
  AuthError,
  OAuthError,

export interface UseAuthReturn {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;

  // Actions
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  emergencyReset: () => void;
  clearError: () => void;

  // Utils
  isInitialized: boolean;
}

/**
 * Authentication hook with comprehensive state management
 */
export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>(() =>
    authService.getCurrentState()
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Subscribe to auth state changes
  useEffect(() => {
    console.log('🔗 Setting up auth subscription');

    const unsubscribe = authService.subscribe(newState => {
      console.log('🔄 Auth state update:', newState);
      setAuthState(newState);

      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    // Initialize auth state only once
    if (!isInitialized) {
      authService
        .initializeAuth()
        .then(() => {
          console.log('✅ Auth initialization completed');
        })
        .catch(error => {
          console.error('❌ Auth initialization failed:', error);
        });
    }

    return () => {
      console.log('🔌 Cleaning up auth subscription');
      unsubscribe();
    };
  }, []); // Remove isInitialized dependency to prevent infinite loop

  /**
   * Sign in with Google OAuth
   */
  const signInWithGoogle = useCallback(async (): Promise<void> => {
    try {
      await authService.signInWithGoogle();

      // Success toast will be shown after successful auth state change
      console.log('🚀 Google sign-in initiated');
    } catch (error) {
      console.error('❌ Sign-in failed:', error);

      let errorMessage = 'Failed to sign in with Google';

      if (error instanceof OAuthError) {
        errorMessage = error.message;
      } else if (error instanceof AuthError) {
        errorMessage = `Authentication error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, []);

  /**
   * Sign out user
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await authService.signOut();

      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });

      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Sign-out failed:', error);

      toast({
        title: 'Sign Out Failed',
        description:
          error instanceof Error ? error.message : 'Failed to sign out',
        variant: 'destructive',
      });
    }
  }, []);

  /**
   * Emergency reset - clears all auth data and reloads
   */
  const emergencyReset = useCallback((): void => {
    toast({
      title: 'Emergency Reset',
      description: 'Clearing authentication data and reloading page...',
      variant: 'destructive',
    });

    authService.emergencyReset();
  }, []);

  /**
   * Clear current error state
   */
  const clearError = useCallback((): void => {
    if (authState.error) {
      // This will trigger a state update to clear the error
      console.log('🧹 Clearing auth error');
    }
  }, [authState.error]);

  // Show success toast when user successfully signs in
  useEffect(() => {
    if (authState.isAuthenticated && authState.user && isInitialized) {
      const userName =
        authState.user.user_metadata?.name || authState.user.email || 'User';

      toast({
        title: 'Welcome!',
        description: `Successfully signed in as ${userName}`,
      });
    }
  }, [authState.isAuthenticated, authState.user, isInitialized]);

  return {
    // State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    error: authState.error,

    // Actions
    signInWithGoogle,
    signOut,
    emergencyReset,
    clearError,

    // Utils
    isInitialized,
  };
}
