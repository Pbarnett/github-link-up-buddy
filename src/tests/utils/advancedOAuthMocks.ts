import { vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';

/**
 * Advanced OAuth Mocking Utilities
 *
 * This file demonstrates how to use the advanced Vitest mocking patterns
 * documented in VITEST_API_AND_GUIDE.md for OAuth testing scenarios.
 */

// =============================================================================
// 1. Pre-Import Mocking with vi.hoisted()
// =============================================================================

export const mockGoogleIdentityServices = vi.hoisted(() => {
  return {
    accounts: {
      id: {
        initialize: vi.fn(),
        prompt: vi.fn(),
        renderButton: vi.fn(),
        disableAutoSelect: vi.fn(),
        storeCredential: vi.fn(),
        cancel: vi.fn(),
      },
      oauth2: {
        initTokenClient: vi.fn(),
        hasGrantedAnyScope: vi.fn(),
        hasGrantedAllScopes: vi.fn(),
        revoke: vi.fn(),
      },
    },
  };
});

// =============================================================================
// 2. Environment Isolation with vi.stubGlobal()
// =============================================================================

export function createOAuthTestEnvironment() {
  beforeEach(() => {
    // Clear all previous mocks
    vi.clearAllMocks();

    // Mock Google Identity Services globally
    vi.stubGlobal('google', mockGoogleIdentityServices);

    // Mock browser APIs with proper OAuth behavior
    vi.stubGlobal('window', {
      ...globalThis.window,
      location: {
        origin: 'https://localhost:3000',
        href: 'https://localhost:3000',
        hostname: 'localhost',
        port: '3000',
        protocol: 'https:',
        search: '',
        hash: '',
        pathname: '/',
        reload: vi.fn(),
        assign: vi.fn(),
        replace: vi.fn(),
      },
      // OAuth popup handling
      open: vi.fn().mockReturnValue({
        close: vi.fn(),
        closed: false,
        postMessage: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
      // OAuth postMessage handling
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      postMessage: vi.fn(),
    });

    // Mock FedCM API for privacy-compliant OAuth
    vi.stubGlobal(
      'IdentityCredential',
      class MockIdentityCredential {
        static async get() {
          return new MockIdentityCredential();
        }
      }
    );

    // Mock localStorage with OAuth-specific behavior
    const mockLocalStorage = {
      getItem: vi.fn(key => {
        // Simulate OAuth state/nonce storage
        if (key.includes('oauth') || key.includes('auth_state')) {
          return 'mock-oauth-value';
        }
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', mockLocalStorage);

    // Mock document methods for OAuth script loading
    const mockScript = {
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      src: '',
      async: false,
      defer: false,
    };

    vi.spyOn(document, 'createElement').mockReturnValue(mockScript as any);
    vi.spyOn(document, 'querySelector').mockReturnValue(null);
    vi.spyOn(document.head, 'appendChild').mockImplementation(() => {
      // Simulate successful script loading
      setTimeout(() => {
        if (mockScript.onload) mockScript.onload();
      }, 0);
      return mockScript as any;
    });
  });

  afterEach(() => {
    // Clean up all global stubs
    vi.unstubAllGlobals();
  });
}

// =============================================================================
// 3. Service-Level Mocking with vi.doMock()
// =============================================================================

export function mockOAuthService(authResult: any = { success: true }) {
  vi.doMock('@/services/modernGoogleAuthService', () => ({
    modernGoogleAuth: {
      initialize: vi.fn().mockResolvedValue(true),
      signIn: vi.fn().mockResolvedValue(authResult),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      isSignedIn: vi.fn().mockResolvedValue(!!authResult.success),
      getCurrentUser: vi.fn().mockResolvedValue(authResult.user || null),
      renderSignInButton: vi.fn(),
      handlePrivacySettings: vi.fn().mockResolvedValue('standard'),
    },
  }));
}

// =============================================================================
// 4. Browser Environment Detection Mocking
// =============================================================================

export function mockBrowserEnvironment(
  userAgent = 'Chrome/120.0.0.0 Safari/537.36'
) {
  vi.stubGlobal('navigator', {
    ...globalThis.navigator,
    userAgent,
    cookieEnabled: true,
    onLine: true,
    // Mock Credential Management API
    credentials: {
      get: vi.fn().mockResolvedValue(null),
      store: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue(null),
      preventSilentAccess: vi.fn().mockResolvedValue(undefined),
    },
  });
}

// =============================================================================
// 5. Network Request Mocking for OAuth Endpoints
// =============================================================================

export function mockOAuthNetworkRequests() {
  global.fetch = vi.fn().mockImplementation((url, options) => {
    const urlStr = url.toString();

    // Mock Google OAuth token endpoint
    if (
      urlStr.includes('oauth2/v4/token') ||
      urlStr.includes('token.googleapis.com')
    ) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            access_token: 'mock-access-token',
            id_token: 'mock-id-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'Bearer',
          }),
          { status: 200 }
        )
      );
    }

    // Mock Google userinfo endpoint
    if (urlStr.includes('www.googleapis.com/oauth2/v2/userinfo')) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            id: '123456789',
            email: 'test@gmail.com',
            verified_email: true,
            name: 'Test User',
            picture: 'https://example.com/avatar.jpg',
          }),
          { status: 200 }
        )
      );
    }

    // Default mock response
    return Promise.resolve(new Response('{}', { status: 404 }));
  });
}

// =============================================================================
// 6. Test Scenario Factory
// =============================================================================

export const OAuthTestScenarios = {
  // Successful OAuth flow
  successfulAuth: (userEmail = 'test@gmail.com') => {
    mockOAuthService({
      success: true,
      user: {
        id: '123456789',
        email: userEmail,
        name: 'Test User',
        picture: 'https://example.com/avatar.jpg',
      },
      token: 'mock-jwt-token',
    });
  },

  // User cancellation
  userCancelled: () => {
    mockOAuthService({
      success: false,
      error: 'User cancelled authentication',
      cancelled: true,
    });
  },

  // Network error
  networkError: () => {
    mockOAuthService({
      success: false,
      error: 'Network error during authentication',
    });
  },

  // Privacy mode detection
  privacyModeBlocked: () => {
    // Mock third-party cookie blocking
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn().mockImplementation(() => {
        throw new Error('Third-party cookies blocked');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal('localStorage', mockLocalStorage);
    vi.stubGlobal('IdentityCredential', undefined);
  },

  // FedCM support
  fedCMSupported: () => {
    vi.stubGlobal(
      'IdentityCredential',
      class MockIdentityCredential {
        static async get() {
          return {
            id: 'test@gmail.com',
            name: 'Test User',
            token: 'mock-fedcm-token',
          };
        }
      }
    );
  },
};

// =============================================================================
// 7. Complete Test Environment Setup
// =============================================================================

export function setupAdvancedOAuthTesting() {
  createOAuthTestEnvironment();
  mockBrowserEnvironment();
  mockOAuthNetworkRequests();

  return {
    mockGoogleIdentityServices,
    OAuthTestScenarios,
    mockOAuthService,
  };
}
