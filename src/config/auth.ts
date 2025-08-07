/**
 * Authentication Configuration
 *
 * Handles OAuth redirect URLs across different environments with fallback logic.
 * Follows enterprise patterns for configuration management.
 */

interface AuthConfig {
  redirectUrls: {
    success: string;
    failure: string;
    signOut: string;
  };
  oauth: {
    providers: string[];
    scopes: Record<string, string[]>;
  };
  session: {
    timeout: number;
    refreshThreshold: number;
  };
}

/**
 * Determines the appropriate base URL for the current environment
 */
function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    const { protocol, host } = window.location;

    // Development environment detection
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
      return `${protocol}//${host}`;
    }

    // Production or staging environment
    return `${protocol}//${host}`;
  }

  // Server-side fallback (should not happen in this app)
  return 'http://localhost:3000';
}

/**
 * Generates environment-appropriate redirect URLs
 */
function generateRedirectUrls(): AuthConfig['redirectUrls'] {
  const baseUrl = getBaseUrl();

  return {
    success: `${baseUrl}/auth/callback`,
    failure: `${baseUrl}/login?error=auth_failed`,
    signOut: `${baseUrl}/login`,
  };
}

/**
 * Main authentication configuration
 */
export const authConfig: AuthConfig = {
  redirectUrls: generateRedirectUrls(),
  oauth: {
    providers: ['google'],
    scopes: {
      google: ['email', 'profile'],
    },
  },
  session: {
    timeout: 24 * 60 * 60 * 1000, // 24 hours
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },
};

/**
 * OAuth provider configuration
 */
export const oauthProviders = {
  google: {
    name: 'Google',
    icon: '🚀',
    buttonText: 'Sign in with Google',
    scopes: authConfig.oauth.scopes.google,
  },
} as const;

/**
 * Development utilities
 */
export const authUtils = {
  /**
   * Logs current auth configuration (development only)
   */
  logConfig: () => {
    if (import.meta.env.DEV) {
      console.group('🔐 Auth Configuration');
      console.log('Base URL:', getBaseUrl());
      console.log('Redirect URLs:', authConfig.redirectUrls);
      console.log('Environment:', import.meta.env.MODE);
      console.groupEnd();
    }
  },

  /**
   * Validates redirect URL format
   */
  validateRedirectUrl: (url: string): boolean => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
};
