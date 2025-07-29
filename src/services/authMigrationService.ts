import * as React from 'react';
/**
 * Authentication Migration Service
 *
 * Manages the transition from deprecated Google Sign-In library to
 * modern Google Identity Services (GIS) with enterprise-grade features.
 *
 * Features:
 * - Backward compatibility with existing login components
 * - Progressive migration capabilities
 * - Feature flagging for controlled rollout
 * - Fallback mechanisms for compatibility
 * - Migration analytics and monitoring
 */

import { supabase } from '@/integrations/supabase/client';
import { modernGoogleAuth, AuthResult } from './modernGoogleAuthService';
import { AuthErrorHandler } from './authErrorHandler';
import { AuthResilience, SessionManager } from './authResilience';
export interface MigrationConfig {
  enableModernAuth: boolean;
  fallbackToLegacy: boolean;
  enableOneTap: boolean;
  enableFedCM: boolean;
  migrationPhase: 'disabled' | 'testing' | 'partial' | 'complete';
  rolloutPercentage: number; // 0-100
}

export interface AuthProvider {
  name: string;
  initialize(): Promise<void>;
  signIn(): Promise<AuthResult>;
  signOut(): Promise<void>;
  isAvailable(): boolean;
}

/**
 * Migration Service for Authentication Systems
 */
export class AuthMigrationService {
  private config: MigrationConfig;
  private providers: Map<string, AuthProvider> = new Map();
  private currentProvider: AuthProvider | null = null;

  constructor(config?: Partial<MigrationConfig>) {
    this.config = {
      enableModernAuth: true,
      fallbackToLegacy: true,
      enableOneTap: true,
      enableFedCM: true,
      migrationPhase: 'partial',
      rolloutPercentage: 50,
      ...config,
    };

    this.initializeProviders();
  }

  /**
   * Initialize all available authentication providers
   */
  private initializeProviders(): void {
    // Modern Google Identity Services Provider
    this.providers.set('modern-google', {
      name: 'Modern Google Identity Services',
      initialize: async () => {
        await modernGoogleAuth.initialize();
      },
      signIn: async () => {
        return await modernGoogleAuth.signInWithPopup();
      },
      signOut: async () => {
        await modernGoogleAuth.signOut();
      },
      isAvailable: () => {
        return (
          this.config.enableModernAuth &&
          typeof (
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) !== 'undefined' &&
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
            .google?.accounts?.id !== undefined
        );
      },
    });

    // Legacy Supabase OAuth Provider (fallback)
    this.providers.set('legacy-supabase', {
      name: 'Legacy Supabase OAuth',
      initialize: async () => {
        // Already initialized with supabase client
      },
      signIn: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.location.origin}/login`,
            skipBrowserRedirect: false,
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
      isAvailable: () => {
        return this.config.fallbackToLegacy;
      },
    });
  }

  /**
   * Determine which authentication provider to use based on migration config
   */
  async selectAuthProvider(): Promise<AuthProvider> {
    const shouldUseModern = this.shouldUseMigration();

    if (shouldUseModern && this.providers.get('modern-google')?.isAvailable()) {
      this.currentProvider = this.providers.get('modern-google')!;
      console.log('🚀 Using Modern Google Identity Services');
    } else if (
      this.config.fallbackToLegacy &&
      this.providers.get('legacy-supabase')?.isAvailable()
    ) {
      this.currentProvider = this.providers.get('legacy-supabase')!;
      console.log('🔄 Falling back to Legacy Supabase OAuth');
    } else {
      throw new Error('No authentication provider available');
    }

    return this.currentProvider;
  }

  /**
   * Determine if user should get modern authentication based on rollout configuration
   */
  private shouldUseMigration(): boolean {
    switch (this.config.migrationPhase) {
      case 'disabled':
        return false;
      case 'testing':
        // Enable for development/testing environments only
        return (
          import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === 'testing'
        );
      case 'partial':
        // Enable for percentage of users
        const _userHash = this.getUserHash();
        return userHash % 100 < this.config.rolloutPercentage;
      case 'complete':
        return true;
      default:
        return false;
    }
  }

  /**
   * Generate consistent hash for user to ensure stable rollout experience
   */
  private getUserHash(): number {
    const userIdentifier =
      localStorage.getItem('user-migration-id') ||
      sessionStorage.getItem('user-migration-id') ||
      this.generateUserMigrationId();

    let hash = 0;
    for (let i = 0; i < userIdentifier.length; i++) {
      const char = userIdentifier.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Generate unique identifier for migration rollout consistency
   */
  private generateUserMigrationId(): string {
    const id = `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    try {
      localStorage.setItem('user-migration-id', id);
    } catch {
      sessionStorage.setItem('user-migration-id', id);
    }
    return id;
  }

  /**
   * Enhanced sign-in with migration support and resilience
   */
  async signIn(): Promise<AuthResult> {
    try {
      // Validate session first
      const sessionValid = await SessionManager.validateAndRecoverSession();
      if (sessionValid) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          return {
            success: true,
            user: data.session.user as any,
            token: data.session.access_token,
          };
        }
      }

      // Select and initialize appropriate provider
      const provider = await this.selectAuthProvider();
      await provider.initialize();

      // Attempt sign in with resilience
      const result = await AuthResilience.withRetry(
        () => provider.signIn(),
        `auth-migration-${provider.name}`,
        { maxRetries: 3, baseDelay: 1000 }
      );

      // Log migration usage for analytics
      this.logMigrationEvent('sign_in_attempt', {
        provider: provider.name,
        success: result.success,
        migrationPhase: this.config.migrationPhase,
        rolloutPercentage: this.config.rolloutPercentage,
      });

      return result;
    } catch (error) {
      const authError = AuthErrorHandler.handleAuthError(error, {
        component: 'AuthMigrationService',
        flow: 'signIn',
      });

      this.logMigrationEvent('sign_in_error', {
        error: authError.category,
        migrationPhase: this.config.migrationPhase,
      });

      return {
        success: false,
        error: authError.userMessage,
      };
    }
  }

  /**
   * Enhanced One Tap authentication (modern provider only)
   */
  async displayOneTap(): Promise<void> {
    if (!this.config.enableOneTap) {
      console.log('One Tap disabled by configuration');
      return;
    }

    try {
      const shouldUseModern = this.shouldUseMigration();
      if (!shouldUseModern) {
        console.log('One Tap not available in legacy mode');
        return;
      }

      const modernProvider = this.providers.get('modern-google');
      if (modernProvider?.isAvailable()) {
        await modernProvider.initialize();
        await modernGoogleAuth.displayOneTap();

        this.logMigrationEvent('one_tap_displayed', {
          migrationPhase: this.config.migrationPhase,
        });
      }
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'AuthMigrationService',
        flow: 'displayOneTap',
      });
    }
  }

  /**
   * Sign out with migration support
   */
  async signOut(): Promise<void> {
    try {
      if (this.currentProvider) {
        await this.currentProvider.signOut();
      } else {
        // Fallback: sign out from all possible providers
        await supabase.auth.signOut();
        if (
          typeof (
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) !== 'undefined' &&
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
            .google?.accounts?.id
        ) {
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.google.accounts.id.disableAutoSelect();
        }
      }

      this.logMigrationEvent('sign_out', {
        provider: this.currentProvider?.name || 'unknown',
      });
    } catch (error) {
      AuthErrorHandler.handleAuthError(error, {
        component: 'AuthMigrationService',
        flow: 'signOut',
      });
      throw error;
    }
  }

  /**
   * Get migration status for debugging and monitoring
   */
  getMigrationStatus(): {
    phase: string;
    rolloutPercentage: number;
    currentProvider: string | null;
    modernAuthAvailable: boolean;
    fedcmSupported: boolean;
    userInMigration: boolean;
  } {
    return {
      phase: this.config.migrationPhase,
      rolloutPercentage: this.config.rolloutPercentage,
      currentProvider: this.currentProvider?.name || null,
      modernAuthAvailable:
        this.providers.get('modern-google')?.isAvailable() || false,
      fedcmSupported:
        typeof (
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
        ) !== 'undefined' &&
        'IdentityCredential' in
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window,
      userInMigration: this.shouldUseMigration(),
    };
  }

  /**
   * Update migration configuration (for A/B testing or rollout changes)
   */
  updateMigrationConfig(newConfig: Partial<MigrationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔄 Migration config updated:', this.config);

    this.logMigrationEvent('config_updated', {
      newPhase: this.config.migrationPhase,
      newRollout: this.config.rolloutPercentage,
    });
  }

  /**
   * Check browser compatibility for modern authentication
   */
  checkBrowserCompatibility(): {
    compatible: boolean;
    features: Record<string, boolean>;
    recommendations: string[];
  } {
    const features = {
      googleIdentityServices:
        typeof (
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
        ) !== 'undefined' &&
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          .google?.accounts?.id !== undefined,
      fedcm:
        typeof (
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
        ) !== 'undefined' &&
        'IdentityCredential' in
          /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window,
      localStorage: typeof localStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      promises: typeof Promise !== 'undefined',
    };

    const compatible =
      features.googleIdentityServices &&
      features.localStorage &&
      features.fetch &&
      features.promises;

    const recommendations: string[] = [];
    if (!features.googleIdentityServices) {
      recommendations.push('Google Identity Services not loaded');
    }
    if (!features.fedcm) {
      recommendations.push('Browser does not support FedCM (use fallback)');
    }
    if (!features.localStorage) {
      recommendations.push(
        'localStorage not available (sessions may not persist)'
      );
    }

    return { compatible, features, recommendations };
  }

  /**
   * Log migration events for analytics and monitoring
   */
  private logMigrationEvent(
    eventName: string,
    data: Record<string, any>
  ): void {
    const event = {
      event: `auth_migration_${eventName}`,
      timestamp: new Date().toISOString(),
      data: {
        ...data,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        url:
          typeof (
            /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
          ) !== 'undefined'
            ? /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
                .location.href
            : 'unknown',
      },
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('📊 Migration Event:', event);
    }

    // Send to analytics service (implement based on your needs)
    // Example: send to PostHog, Google Analytics, or custom analytics
    if (
      typeof (
        /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window
      ) !== 'undefined' &&
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ (
        window as any
      ).analytics
    ) {
      /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ (
        window as any
      ).analytics.track(event.event, event.data);
    }
  }

  /**
   * Get migration analytics summary
   */
  getMigrationAnalytics(): {
    totalEvents: number;
    successRate: number;
    modernUsageRate: number;
    commonErrors: string[];
  } {
    // This would typically pull from your analytics service
    // For now, return mock data structure
    return {
      totalEvents: 0,
      successRate: 0,
      modernUsageRate: this.config.rolloutPercentage,
      commonErrors: [],
    };
  }
}

/**
 * Create migration service instance with environment-based configuration
 */
function createMigrationService(): AuthMigrationService {
  const envConfig: Partial<MigrationConfig> = {};

  // Configure based on environment
  if (import.meta.env.DEV) {
    envConfig.migrationPhase = 'testing';
    envConfig.rolloutPercentage = 100;
  } else if (import.meta.env.VITE_ENVIRONMENT === 'staging') {
    envConfig.migrationPhase = 'partial';
    envConfig.rolloutPercentage = 75;
  } else if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    envConfig.migrationPhase = 'partial';
    envConfig.rolloutPercentage = 25; // Conservative rollout
  }

  // Check for feature flags (if you have them)
  if (import.meta.env.VITE_ENABLE_MODERN_AUTH === 'true') {
    envConfig.enableModernAuth = true;
  }
  if (import.meta.env.VITE_ENABLE_ONE_TAP === 'true') {
    envConfig.enableOneTap = true;
  }

  return new AuthMigrationService(envConfig);
}

// Export singleton instance
export const authMigrationService = createMigrationService();

// Export types for external use
export type { AuthProvider };

// Utility functions
export const isMigrationEnabled = () => {
  return authMigrationService.getMigrationStatus().userInMigration;
};

export const getMigrationStatus = () => {
  return authMigrationService.getMigrationStatus();
};

export default AuthMigrationService;
