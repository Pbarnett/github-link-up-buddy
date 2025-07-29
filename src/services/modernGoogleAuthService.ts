// Modern Google OAuth Service using Google Identity Services (GIS)
// Replaces deprecated gapi.auth2 library

import * as React from 'react';
import { createElement, use } from 'react';
type _Component<P = {}, S = {}> = React.Component<P, S>;

import { supabase } from '@/integrations/supabase/client';
import { authSecurityMonitor } from './authSecurityMonitor';
import { AuthErrorHandler } from './authErrorHandler';
import { AuthResilience } from './authResilience';
interface GoogleAuthConfig {
  clientId: string;
  scopes: string[];
  autoSelect?: boolean;
  cancelOnTapOutside?: boolean;
}

interface GoogleCredentialResponse {
  credential: string; // JWT ID token
  select_by: string;
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email_verified: boolean;
}

interface AuthResult {
  success: boolean;
  user?: GoogleUser;
  error?: string;
  token?: string;
}

// Utility function to decode JWT token
function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

class ModernGoogleAuthService {
  private config: GoogleAuthConfig;
  private isInitialized: boolean = false;
  private oneTapDisplayed: boolean = false;

  constructor(config?: Partial<GoogleAuthConfig>) {
    this.config = {
      clientId:
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        process.env.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID ||
        '209526864602-b7g6tlsftft5srildqrv7ulb4ll2v3smk.apps.googleusercontent.com',
      scopes: ['openid', 'email', 'profile'],
      autoSelect: false,
      cancelOnTapOutside: true,
      ...config,
    };
  }

  /**
   * Initialize Google Identity Services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if running in browser
      if (
        typeof (
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
        ) === 'undefined'
      ) {
        throw new Error(
          'Google Auth can only be initialized in browser environment'
        );
      }

      // Load Google Identity Services script if not already loaded with retry logic
      if (
        !/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          .google?.accounts
      ) {
        await AuthResilience.withRetry(
          () => this.loadGoogleIdentityScript(),
          'modern-google-script-load',
          { maxRetries: 3, baseDelay: 1000 }
        );
      }

      // Initialize Google Identity Services
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.id.initialize(
        {
          client_id: this.config.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: this.config.autoSelect,
          cancel_on_tap_outside: this.config.cancelOnTapOutside,
          // Enhanced security and privacy settings
          use_fedcm_for_prompt: true, // Use FedCM when available
          itp_support: true, // Enable Intelligent Tracking Prevention support
        }
      );

      this.isInitialized = true;
      console.log('✅ Modern Google Auth Service initialized');
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'ModernGoogleAuthService',
        flow: 'initialize',
        provider: 'google',
      });
      throw error;
    }
  }

  /**
   * Load Google Identity Services script dynamically
   */
  private loadGoogleIdentityScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      ) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Google Identity Services'));

      document.head.appendChild(script);
    });
  }

  /**
   * Handle credential response from Google One Tap or popup
   */
  private async handleCredentialResponse(
    response: GoogleCredentialResponse
  ): Promise<void> {
    try {
      // Use resilience wrapper for token processing
      await AuthResilience.withRetry(
        async () => {
          const userProfile = parseJWT(response.credential);

          if (!userProfile) {
            authSecurityMonitor.logTokenValidationFailure({
              reason: 'Invalid credential response - failed to parse JWT',
              tokenClaims: null,
            });
            throw new Error('Invalid credential response');
          }

          // Validate token claims
          if (!this.validateTokenClaims(userProfile)) {
            authSecurityMonitor.logTokenValidationFailure({
              reason: 'Token validation failed',
              tokenClaims: userProfile,
              expectedAudience: this.config.clientId,
            });
            throw new Error('Token validation failed');
          }

          // Sign in with Supabase using the ID token with retry logic
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
          });

          if (error) {
            console.error('❌ Supabase auth error:', error);
            authSecurityMonitor.logAuthFailure({
              authMethod: 'one_tap',
              errorCode: error.message,
              errorMessage: error.message,
            });
            throw error;
          }

          console.log(
            '✅ Successfully signed in with Google:',
            data.user?.email
          );

          // Log successful authentication
          const privacyMode = await this.handlePrivacySettings();
          authSecurityMonitor.logAuthSuccess({
            userId: data.user!.id,
            sessionId: data.session!.access_token,
            authMethod: 'one_tap',
            privacyMode: privacyMode,
            tokenClaims: userProfile,
          });

          // Trigger custom event for components to listen to
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.dispatchEvent(
            new CustomEvent('googleAuthSuccess', {
              detail: {
                user: data.user,
                session: data.session,
              },
            })
          );
        },
        'modern-google-credential-response',
        { maxRetries: 2, baseDelay: 1000 }
      );
    } catch (error) {
      // Use enterprise error handler
      const authError = AuthErrorHandler.handleAuthError(error, {
        component: 'ModernGoogleAuthService',
        flow: 'handleCredentialResponse',
        provider: 'google',
      });

      console.error('❌ Google auth error:', error);
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.dispatchEvent(
        new CustomEvent('googleAuthError', {
          detail: {
            error: authError.userMessage,
            errorId: authError.id,
            category: authError.category,
            retryable: authError.retryable,
          },
        })
      );
    }
  }

  /**
   * Validate JWT token claims for security
   */
  private validateTokenClaims(claims: any): boolean {
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      console.error('Token expired');
      return false;
    }

    // Check issuer
    if (claims.iss !== 'https://accounts.google.com') {
      console.error('Invalid issuer');
      return false;
    }

    // Check audience (client ID)
    if (claims.aud !== this.config.clientId) {
      console.error('Invalid audience');
      return false;
    }

    // Check required claims
    if (!claims.email || !claims.email_verified) {
      console.error('Email not verified');
      return false;
    }

    return true;
  }

  /**
   * Display One Tap prompt for seamless sign-in
   */
  async displayOneTap(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.oneTapDisplayed) {
      console.log('One Tap already displayed');
      return;
    }

    try {
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.id.prompt(
        notification => {
          if (notification.isNotDisplayed()) {
            console.log(
              'One Tap not displayed:',
              notification.getNotDisplayedReason()
            );
          } else if (notification.isSkippedMoment()) {
            console.log('One Tap skipped:', notification.getSkippedReason());
          }
        }
      );

      this.oneTapDisplayed = true;
    } catch (error) {
      console.error('❌ Failed to display One Tap:', error);
    }
  }

  /**
   * Sign in with popup flow (fallback when One Tap fails)
   */
  async signInWithPopup(): Promise<AuthResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      // Check for popup blockers
      const popupTest =
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.open(
          '',
          '_blank',
          'width=1,height=1'
        );
      if (!popupTest || popupTest.closed) {
        const error = new Error(
          'Popup blocked. Please allow popups for this site and try again.'
        );

        // Log popup blocking with enterprise error handler
        AuthErrorHandler.handleAuthError(error, {
          component: 'ModernGoogleAuthService',
          flow: 'signInWithPopup',
          provider: 'google',
        });

        resolve({
          success: false,
          error:
            'Popup blocked. Please allow popups for this site and try again.',
        });
        return;
      }
      popupTest.close();

      // Use OAuth 2.0 token client for popup flow
      const client =
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.oauth2.initTokenClient(
          {
            client_id: this.config.clientId,
            scope: this.config.scopes.join(' '),
            callback: async (response: any) => {
              try {
                if (response.error) {
                  const error = new Error(response.error);
                  AuthErrorHandler.handleAuthError(error, {
                    component: 'ModernGoogleAuthService',
                    flow: 'signInWithPopup-callback',
                    provider: 'google',
                  });

                  resolve({
                    success: false,
                    error: response.error,
                  });
                  return;
                }

                // Exchange access token for user info with retry logic
                const userInfo = await AuthResilience.withRetry(
                  () => this.getUserInfo(response.access_token),
                  'modern-google-userinfo',
                  { maxRetries: 3, baseDelay: 1000 }
                );

                // Log successful popup authentication
                authSecurityMonitor.logAuthSuccess({
                  userId: userInfo.id,
                  sessionId: response.access_token,
                  authMethod: 'popup',
                  privacyMode: await this.handlePrivacySettings(),
                  tokenClaims: userInfo,
                });

                resolve({
                  success: true,
                  user: userInfo,
                  token: response.access_token,
                });
              } catch (error) {
                const authError = AuthErrorHandler.handleAuthError(error, {
                  component: 'ModernGoogleAuthService',
                  flow: 'signInWithPopup-callback',
                  provider: 'google',
                });

                resolve({
                  success: false,
                  error: authError.userMessage,
                });
              }
            },
            error_callback: (error: any) => {
              const authError = AuthErrorHandler.handleAuthError(error, {
                component: 'ModernGoogleAuthService',
                flow: 'signInWithPopup-error',
                provider: 'google',
              });

              resolve({
                success: false,
                error: authError.userMessage || 'Authentication cancelled',
              });
            },
          }
        );

      // Request access token
      client.requestAccessToken({
        prompt: 'consent',
      });
    });
  }

  /**
   * Get user information using access token
   */
  private async getUserInfo(accessToken: string): Promise<GoogleUser> {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = new Error(
        `Failed to fetch user information: ${response.status} ${response.statusText}`
      );
      AuthErrorHandler.handleAuthError(error, {
        component: 'ModernGoogleAuthService',
        flow: 'getUserInfo',
        provider: 'google',
      });
      throw error;
    }

    return await response.json();
  }

  /**
   * Sign out from Google and clear session
   */
  async signOut(): Promise<void> {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Revoke Google tokens if available
      if (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          .google?.accounts?.id
      ) {
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.id.disableAutoSelect();
      }

      // Clear One Tap state
      this.oneTapDisplayed = false;

      console.log('✅ Successfully signed out');

      // Trigger sign out event
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.dispatchEvent(
        new CustomEvent('googleAuthSignOut')
      );
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Check if user is currently signed in
   */
  async isSignedIn(): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      console.error('❌ Error checking sign in status:', error);
      return false;
    }
  }

  /**
   * Get current user session
   */
  async getCurrentUser(): Promise<any> {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }
  }

  /**
   * Handle browser privacy settings (ITP, third-party cookie blocking)
   */
  async handlePrivacySettings(): Promise<'fedcm' | 'redirect' | 'standard'> {
    let detectedMode: 'fedcm' | 'redirect' | 'standard';

    // Check if FedCM is available
    if (
      'IdentityCredential' in
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
    ) {
      detectedMode = 'fedcm';
    } else {
      // Check if third-party cookies are blocked (simplified check)
      try {
        // This is a simplified check - in production, you might want a more robust method
        localStorage.setItem('test-third-party', 'test');
        localStorage.removeItem('test-third-party');
        detectedMode = 'standard';
      } catch {
        // If localStorage access fails in third-party context, use redirect flow
        detectedMode = 'redirect';
      }
    }

    // Log privacy mode detection
    authSecurityMonitor.logPrivacyModeDetection(detectedMode);

    return detectedMode;
  }

  /**
   * Render Google Sign In button with modern styling
   */
  renderSignInButton(
    containerId: string,
    options?: {
      theme?: 'outline' | 'filled_blue' | 'filled_black';
      size?: 'large' | 'medium' | 'small';
      text?: 'signin_with' | 'signup_with' | 'continue_with';
      shape?: 'rectangular' | 'pill' | 'circle' | 'square';
      width?: number;
      locale?: string;
    }
  ): void {
    if (!this.isInitialized) {
      console.error('Google Auth Service not initialized');
      return;
    }

    const defaultOptions = {
      theme: 'outline' as const,
      size: 'large' as const,
      text: 'signin_with' as const,
      width: 250,
    };

    const buttonOptions = { ...defaultOptions, ...options };

    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.id.renderButton(
      document.getElementById(containerId),
      buttonOptions
    );
  }
}

// Global instance
export const modernGoogleAuth = new ModernGoogleAuthService();

// Types for external use
export type { GoogleUser, AuthResult, GoogleAuthConfig };

// Utility function to check if Google Identity Services is loaded
export function isGoogleIdentityLoaded(): boolean {
  return (
    typeof (
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
    ) !== 'undefined' &&
    /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      .google?.accounts?.id !== undefined
  );
}

// Type declarations for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
          disableAutoSelect: () => void;
          storeCredential: (credential: any) => void;
          cancel: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: (overrideConfig?: any) => void;
          };
          hasGrantedAnyScope: (token: any, ...scopes: string[]) => boolean;
          hasGrantedAllScopes: (token: any, ...scopes: string[]) => boolean;
          revoke: (token: string, callback?: () => void) => void;
        };
      };
    };
  }
}
