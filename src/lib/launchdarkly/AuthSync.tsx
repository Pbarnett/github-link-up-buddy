


import { LDContext } from 'launchdarkly-js-client-sdk';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../../integrations/supabase/client';
import { LaunchDarklyContextManager, UserAttributes } from './context-manager';
import * as React from 'react';

export function LaunchDarklyAuthSync() {
  const ldClient = useLDClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!ldClient) return;

    let mounted = true;

    // Wait for LaunchDarkly client to be ready
    ldClient.waitForInitialization().then(() => {
      if (mounted) {
        setIsInitialized(true);
      }
    }).catch(error => {
      console.error('LaunchDarkly initialization failed:', error);
    });

    return () => {
      mounted = false;
    };
  }, [ldClient]);

  useEffect(() => {
    if (!ldClient || !isInitialized) return;

    // Get initial session
    const initializeSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await updateLaunchDarklyContext(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      }
    };

    initializeSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (import.meta.env.DEV) {
          console.log('🔐 Auth state changed:', event, session?.user?.id);
        }

        try {
          if (event === 'SIGNED_IN' && session?.user) {
            await updateLaunchDarklyContext(session.user);
          } else if (event === 'SIGNED_OUT') {
            await revertToAnonymousContext();
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            // Update context with potentially new user metadata
            await updateLaunchDarklyContext(session.user);
          }
        } catch (error) {
          console.error('Error updating LaunchDarkly context:', error);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [ldClient, isInitialized]);

  const updateLaunchDarklyContext = async (user: any) => {
    if (!ldClient) return;

    try {
      // Extract user attributes from Supabase user object
      const userAttributes: UserAttributes = {
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        signupDate: user.created_at,
        lastLogin: user.last_sign_in_at,
        
        // Extract subscription info if available
        subscription: user.app_metadata?.subscription_tier || 'free',
        
        // Extract location info if available
        country: user.user_metadata?.country,
        language: user.user_metadata?.locale || navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        
        // Custom attributes from user metadata
        customAttributes: {
          provider: user.app_metadata?.provider || 'unknown',
          emailVerified: user.email_confirmed_at ? true : false,
          phoneVerified: user.phone_confirmed_at ? true : false,
          ...user.user_metadata?.custom_attributes
        }
      };

      // Create LaunchDarkly context
      const ldContext = LaunchDarklyContextManager.createContext(userAttributes);

      if (import.meta.env.DEV) {
        console.log('🚀 Updating LaunchDarkly context for user:', user.id);
        console.log('Context:', ldContext);
      }

      // Update LaunchDarkly context
      await new Promise<void>((resolve, reject) => {
        ldClient.identify(ldContext, undefined, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      if (import.meta.env.DEV) {
        console.log('✅ LaunchDarkly context updated successfully');
      }
    } catch (error) {
      console.error('Failed to update LaunchDarkly context:', error);
    }
  };

  const revertToAnonymousContext = async () => {
    if (!ldClient) return;

    try {
      // Create anonymous context
      const anonymousContext = LaunchDarklyContextManager.createAnonymousContext();

      if (import.meta.env.DEV) {
        console.log('🔄 Reverting to anonymous LaunchDarkly context');
        console.log('Context:', anonymousContext);
      }

      // Update to anonymous context
      await new Promise<void>((resolve, reject) => {
        ldClient.identify(anonymousContext, undefined, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      if (import.meta.env.DEV) {
        console.log('✅ Reverted to anonymous LaunchDarkly context');
      }
    } catch (error) {
      console.error('Failed to revert to anonymous context:', error);
    }
  };

  // This component doesn't render anything
  return null;
}

// Hook for manually updating user context (e.g., when subscription changes)
export function useLaunchDarklyContextUpdate() {
  const ldClient = useLDClient();

  const updateSubscription = async (subscription: 'free' | 'premium' | 'enterprise') => {
    if (!ldClient) return;

    try {
      const currentContext = ldClient.getContext();
      const updatedContext = LaunchDarklyContextManager.updateContextOnSubscription(
        currentContext,
        subscription
      );

      await new Promise<void>((resolve, reject) => {
        ldClient.identify(updatedContext, undefined, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Failed to update subscription context:', error);
    }
  };

  const trackFeatureUsage = async (featureKey: string) => {
    if (!ldClient) return;

    try {
      const currentContext = ldClient.getContext();
      const updatedContext = LaunchDarklyContextManager.updateContextWithFeatureUsage(
        currentContext,
        featureKey
      );

      await new Promise<void>((resolve, reject) => {
        ldClient.identify(updatedContext, undefined, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  };

  return {
    updateSubscription,
    trackFeatureUsage
  };
}
