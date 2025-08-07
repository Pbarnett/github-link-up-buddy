/**
 * Authentication Service
 *
 * Enterprise-grade authentication service with comprehensive error handling,
 * retry logic, and proper state management for OAuth flows.
 */

./userInitialization';
import {
  validateOAuthConfig,
  runOAuthDiagnostics,

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
}

export interface AuthCallbacks {
  onAuthStateChange?: (state: AuthState) => void;
  onError?: (error: Error) => void;
  onSuccess?: (user: any) => void;
}

/**
 * Custom error classes for better error handling
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class OAuthError extends AuthError {
  constructor(message: string, originalError?: any) {
    super(message, 'OAUTH_ERROR', originalError);
    this.name = 'OAuthError';
  }
}

/**
 * Authentication Service Class
 */
export class AuthService {
  private static instance: AuthService;
  private authStateCallbacks: Set<(state: AuthState) => void> = new Set();
  private currentState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    error: null,
  };

  private constructor() {
    this.initializeAuthListener();
    authUtils.logConfig();
  }

  /**
   * Singleton pattern for consistent state management
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize authentication state listener
   */
  private initializeAuthListener(): void {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔐 Auth event: ${event}`, session?.user?.id || 'no-user');

      // Always clear loading state when we get an auth event
      const newState: AuthState = {
        isAuthenticated: !!session,
        isLoading: false,
        user: session?.user || null,
        error: null,
      };

      // Update state immediately to clear loading state
      this.updateState(newState);

      // Handle successful sign-in
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          await UserInitializationService.handlePostSignin(session.user.id);
          console.log('✅ User initialization completed');
        } catch (error) {
          console.error('❌ User initialization failed:', error);
          // Update state again with error if initialization fails
          this.updateState({
            ...newState,
            error: 'Failed to initialize user profile',
          });
        }
      }
    });
  }

  /**
   * Update internal state and notify subscribers
   */
  private updateState(newState: Partial<AuthState>): void {
    this.currentState = { ...this.currentState, ...newState };
    this.authStateCallbacks.forEach(callback => callback(this.currentState));
  }

  /**
   * Subscribe to authentication state changes
   */
  public subscribe(callback: (state: AuthState) => void): () => void {
    this.authStateCallbacks.add(callback);

    // Immediately call with current state
    callback(this.currentState);

    // Return unsubscribe function
    return () => {
      this.authStateCallbacks.delete(callback);
    };
  }

  /**
   * Get current authentication state
   */
  public getCurrentState(): AuthState {
    return { ...this.currentState };
  }

  /**
   * Initialize authentication state from existing session
   */
  public async initializeAuth(): Promise<AuthState> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Check for OAuth callback parameters
      await this.handleOAuthCallback();

      // Get current session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new AuthError('Session check failed', 'SESSION_ERROR', error);
      }

      const newState: AuthState = {
        isAuthenticated: !!data.session,
        isLoading: false,
        user: data.session?.user || null,
        error: null,
      };

      this.updateState(newState);
      return newState;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown auth error';
      const newState: AuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: errorMessage,
      };

      this.updateState(newState);
      console.error('❌ Auth initialization failed:', error);
      return newState;
    }
  }

  /**
   * Handle OAuth callback from URL parameters
   */
  private async handleOAuthCallback(): Promise<void> {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    const hasOAuthParams =
      hashParams.has('access_token') ||
      urlParams.has('code') ||
      hashParams.has('refresh_token');

    if (hasOAuthParams) {
      console.log('🔗 OAuth callback detected, processing...');

      // Give Supabase time to process the OAuth callback
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clean up URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  /**
   * Sign in with Google OAuth
   */
  public async signInWithGoogle(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Validate configuration
      if (!authUtils.validateRedirectUrl(authConfig.redirectUrls.success)) {
        throw new OAuthError('Invalid redirect URL configuration');
      }

      // Check for popup blockers
      await this.checkPopupBlocker();

      console.log('🚀 Initiating Google OAuth...', {
        redirectTo: authConfig.redirectUrls.success,
        environment: import.meta.env.MODE,
      });

      // Force localhost redirect in development
      const isDevelopment =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';
      const redirectUrl = isDevelopment
        ? `${window.location.protocol}//${window.location.host}/auth/callback`
        : authConfig.redirectUrls.success;

      console.log('🔧 OAuth redirect URL:', redirectUrl);
      console.log('🏠 Current hostname:', window.location.hostname);
      console.log('🌍 Is development:', isDevelopment);

      // Initiate OAuth flow
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw new OAuthError('OAuth initiation failed', error);
      }

      // Loading state will be updated by auth state listener
      console.log('✅ OAuth flow initiated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google sign-in failed';
      this.updateState({
        isLoading: false,
        error: errorMessage,
      });

      console.error('❌ Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Check for popup blockers
   */
  private async checkPopupBlocker(): Promise<void> {
    const popup = window.open('about:blank', '_blank', 'width=1,height=1');

    if (!popup) {
      throw new OAuthError(
        'Popup blocked. Please enable popups for this site.'
      );
    }

    popup.close();
  }

  /**
   * Sign out user
   */
  public async signOut(): Promise<void> {
    this.updateState({ isLoading: true, error: null });

    try {
      // Clear local storage
      this.clearAuthStorage();

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({
        scope: 'global',
      });

      if (error) {
        console.warn('⚠️ Sign out warning:', error);
        // Continue anyway as local storage is cleared
      }

      this.updateState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });

      console.log('✅ User signed out successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign out failed';
      this.updateState({
        isLoading: false,
        error: errorMessage,
      });

      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Clear authentication storage
   */
  private clearAuthStorage(): void {
    try {
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      Object.keys(sessionStorage || {}).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });

      console.log('🧹 Auth storage cleared');
    } catch (error) {
      console.warn('⚠️ Storage clear warning:', error);
    }
  }

  /**
   * Emergency reset - clears all auth state and reloads page
   */
  public emergencyReset(): void {
    console.log('🚨 Emergency auth reset initiated');

    this.clearAuthStorage();

    // Reset internal state
    this.updateState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });

    // Reload page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
