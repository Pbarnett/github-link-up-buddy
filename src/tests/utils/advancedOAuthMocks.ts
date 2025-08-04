import * as React from 'react';
import { createElement, use } from 'react';
import { vi, beforeEach, afterEach } from 'vitest';
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
    vi.stubGlobal(
      '/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window',
      {
        ...globalThis./* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window,
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
      }
    );

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
// 7. Enhanced Popup Handling Mocks with Network Resilience
// =============================================================================

export interface PopupMockOptions {
  shouldBlock?: boolean;
  timeoutMs?: number;
  networkDelay?: number;
  shouldFail?: boolean;
  intermittentFailures?: boolean;
  failureRate?: number;
}

export function createPopupMocks(options: PopupMockOptions = {}) {
  const {
    shouldBlock = false,
    timeoutMs = 5000,
    networkDelay = 100,
    shouldFail = false,
    intermittentFailures = false,
    failureRate = 0.3,
  } = options;

  const mockPopupWindow = {
    close: vi.fn(),
    closed: shouldBlock,
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    location: { href: '' },
    focus: vi.fn(),
  };

  const mockWindowOpen = vi.fn().mockImplementation((url, target, features) => {
    // Simulate popup blocker
    if (shouldBlock) {
      return null;
    }

    // Simulate already closed popup (another form of blocking)
    if (shouldBlock && Math.random() > 0.5) {
      return { ...mockPopupWindow, closed: true };
    }

    return mockPopupWindow;
  });

  const mockTokenClient = {
    requestAccessToken: vi.fn().mockImplementation((options) => {
      // Simulate network delay
      const delay = networkDelay + Math.random() * 100;
      
      setTimeout(() => {
        const config = mockGoogleIdentityServices.accounts.oauth2.initTokenClient.mock.calls[0]?.[0];
        if (!config) return;

        // Simulate intermittent failures
        if (intermittentFailures && Math.random() < failureRate) {
          if (config.error_callback) {
            config.error_callback({
              error: 'network_error',
              message: 'Intermittent network failure',
            });
          }
          return;
        }

        // Simulate timeout
        if (shouldFail && Math.random() > 0.7) {
          // Don't call any callback to simulate timeout
          return;
        }

        // Simulate user cancellation
        if (shouldFail) {
          if (config.error_callback) {
            config.error_callback({
              error: 'popup_closed_by_user',
              message: 'User closed the popup',
            });
          }
          return;
        }

        // Simulate success
        if (config.callback) {
          config.callback({
            access_token: 'mock-access-token-' + Date.now(),
            token_type: 'Bearer',
            expires_in: 3600,
          });
        }
      }, delay);
    }),
  };

  // Mock initTokenClient with timeout and retry handling
  mockGoogleIdentityServices.accounts.oauth2.initTokenClient.mockImplementation((config) => {
    // Add timeout wrapper
    const originalCallback = config.callback;
    const originalErrorCallback = config.error_callback;

    if (originalCallback) {
      config.callback = (response) => {
        clearTimeout(timeoutHandle);
        originalCallback(response);
      };
    }

    if (originalErrorCallback) {
      config.error_callback = (error) => {
        clearTimeout(timeoutHandle);
        originalErrorCallback(error);
      };
    }

    // Set up timeout
    const timeoutHandle = setTimeout(() => {
      if (originalErrorCallback) {
        originalErrorCallback({
          error: 'timeout',
          message: `Authentication timed out after ${timeoutMs}ms`,
        });
      }
    }, timeoutMs);

    return mockTokenClient;
  });

  return {
    mockWindowOpen,
    mockPopupWindow,
    mockTokenClient,
  };
}

// =============================================================================
// 8. Popup Test Scenarios
// =============================================================================

export const PopupTestScenarios = {
  // Popup blocked by browser
  popupBlocked: () => {
    const { mockWindowOpen } = createPopupMocks({ shouldBlock: true });
    vi.stubGlobal('open', mockWindowOpen);
  },

  // Popup opens but user closes it
  userCancelledPopup: () => {
    const { mockWindowOpen } = createPopupMocks({ shouldFail: true });
    vi.stubGlobal('open', mockWindowOpen);
  },

  // Network timeout during popup auth
  networkTimeout: (timeoutMs = 2000) => {
    const { mockWindowOpen } = createPopupMocks({ 
      timeoutMs,
      networkDelay: timeoutMs + 100 
    });
    vi.stubGlobal('open', mockWindowOpen);
  },

  // Intermittent network failures
  intermittentFailures: (failureRate = 0.5) => {
    const { mockWindowOpen } = createPopupMocks({ 
      intermittentFailures: true,
      failureRate 
    });
    vi.stubGlobal('open', mockWindowOpen);
  },

  // Successful popup flow with network delays
  successfulWithDelay: (delayMs = 200) => {
    const { mockWindowOpen } = createPopupMocks({ 
      networkDelay: delayMs 
    });
    vi.stubGlobal('open', mockWindowOpen);
  },
};

// =============================================================================
// 9. One Tap Mock Enhancements
// =============================================================================

export function createOneTapMocks(options: {
  shouldTimeout?: boolean;
  shouldNotDisplay?: boolean;
  notDisplayedReason?: string;
  timeoutMs?: number;
} = {}) {
  const {
    shouldTimeout = false,
    shouldNotDisplay = false,
    notDisplayedReason = 'opt_out_or_no_session',
    timeoutMs = 3000,
  } = options;

  mockGoogleIdentityServices.accounts.id.prompt.mockImplementation((callback) => {
    const delay = Math.random() * 100 + 50; // 50-150ms delay

    setTimeout(() => {
      if (shouldTimeout) {
        // Don't call callback to simulate timeout
        return;
      }

      const notification = {
        isNotDisplayed: () => shouldNotDisplay,
        getNotDisplayedReason: () => notDisplayedReason,
        isSkippedMoment: () => false,
        getSkippedReason: () => '',
        isDismissedMoment: () => false,
        getDismissedReason: () => '',
      };

      callback(notification);
    }, delay);
  });
}

// =============================================================================
// 10. Enhanced Test Scenario Factory with Popup Support
// =============================================================================

export const EnhancedOAuthTestScenarios = {
  ...OAuthTestScenarios,

  // Popup-specific scenarios
  popupBlockedFlow: () => {
    PopupTestScenarios.popupBlocked();
    mockOAuthService({
      success: false,
      error: 'Popup blocked. Please allow popups for this site and try again.',
    });
  },

  popupTimeoutFlow: (timeoutMs = 3000) => {
    PopupTestScenarios.networkTimeout(timeoutMs);
    mockOAuthService({
      success: false,
      error: `Authentication timed out after ${timeoutMs}ms`,
    });
  },

  // One Tap scenarios
  oneTapSuccess: () => {
    createOneTapMocks();
    mockOAuthService({
      success: true,
      user: {
        id: '123456789',
        email: 'test@gmail.com',
        name: 'Test User',
      },
      method: 'oneTap',
    });
  },

  oneTapNotDisplayed: (reason = 'opt_out_or_no_session') => {
    createOneTapMocks({ 
      shouldNotDisplay: true, 
      notDisplayedReason: reason 
    });
  },

  oneTapTimeout: (timeoutMs = 3000) => {
    createOneTapMocks({ 
      shouldTimeout: true, 
      timeoutMs 
    });
  },

  // Network resilience scenarios
  networkResilienceTest: () => {
    PopupTestScenarios.intermittentFailures(0.3);
    mockOAuthNetworkRequests();
    
    // Override fetch to simulate retries
    const originalFetch = global.fetch;
    let attemptCount = 0;
    
    global.fetch = vi.fn().mockImplementation(async (url, options) => {
      attemptCount++;
      
      // Fail first 2 attempts, succeed on 3rd
      if (attemptCount <= 2 && url.toString().includes('userinfo')) {
        throw new Error('Network error');
      }
      
      return originalFetch(url, options);
    });
  },
};

// =============================================================================
// 11. Complete Test Environment Setup
// =============================================================================

export function setupAdvancedOAuthTesting() {
  createOAuthTestEnvironment();
  mockBrowserEnvironment();
  mockOAuthNetworkRequests();

  return {
    mockGoogleIdentityServices,
    OAuthTestScenarios: EnhancedOAuthTestScenarios,
    PopupTestScenarios,
    createPopupMocks,
    createOneTapMocks,
    mockOAuthService,
  };
}
