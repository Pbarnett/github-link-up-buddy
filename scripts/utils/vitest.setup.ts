import { vi, beforeEach, afterEach } from 'vitest';
import 'dotenv/config';

// ==============================================================================
// REACT ACT ENVIRONMENT SETUP (CRITICAL FOR TEST STABILITY)
// ==============================================================================

// Set React ACT environment as required by React 18+ testing
// This prevents "The current testing environment is not configured to support act" errors
global.IS_REACT_ACT_ENVIRONMENT = true;

// Ensure React Testing Library uses the correct ACT implementation
process.env.NODE_ENV = 'test';

// Set additional environment variables for AWS tests
process.env.AWS_REGION = 'us-west-2';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';

// Set LaunchDarkly environment variables
process.env.VITE_LAUNCHDARKLY_CLIENT_ID = 'test-client-id';
process.env.LAUNCHDARKLY_SDK_KEY = 'test-sdk-key';

// ==============================================================================
// MODERN DOM POLYFILLS FOR JSDOM + RADIX UI COMPATIBILITY
// ==============================================================================

// Polyfills for JSDOM to work with modern React components and Radix UI
if (!HTMLElement.prototype.hasPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: vi.fn(() => false),
    writable: true,
    configurable: true,
  });
}

if (!HTMLElement.prototype.setPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
}

if (!HTMLElement.prototype.releasePointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
}

if (!HTMLElement.prototype.scrollIntoView) {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
}

// Mock ResizeObserver for components that use it
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia for responsive components
Object.defineProperty(/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ==============================================================================
// COMPREHENSIVE MOCK CLEANUP HOOKS
// ==============================================================================

// Global cleanup before each test
beforeEach(() => {
  // Clear all mocks but preserve implementations
  vi.clearAllMocks();
  
  // Clear timers and restore real timers
  vi.useRealTimers();
  
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Reset document.body
  document.body.innerHTML = '';
  
  // Reset console methods (in case they were mocked)
  vi.restoreAllMocks();
});

// Global cleanup after each test
afterEach(() => {
  // Additional cleanup for any remaining async operations
  try {
    vi.runOnlyPendingTimers();
  } catch {
    // Ignore timer errors if no fake timers are set
  }
  vi.useRealTimers();
  
  // Clear all environment variable stubs
  vi.unstubAllEnvs();
  
  // Clear all global variable stubs
  vi.unstubAllGlobals();
});

// Mock react-day-picker before any component imports
vi.mock('react-day-picker');

/**
 * Business-rules hook (test stub)
 */
vi.mock('@/hooks/useBusinessRules', () => {
  const defaultRules = {
    config: {
      version: '1.0.0',
      ui: {
        destination: true,
        budget: true,
        paymentMethod: true
      },
      flightSearch: {
        minPriceUSD: 100,
        maxPriceUSD: 5000,
        defaultNonstopRequired: true,
        allowedCabinClasses: ['economy', 'business', 'first']
      },
      autoBooking: {
        enabled: true,
        maxConcurrentCampaigns: 3
      }
    },
    loading: false,
    error: null
  };

  return {
    useBusinessRules: vi.fn(() => defaultRules),
    BusinessRulesProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}, { virtual: true });

// Export mock functions for test access
export const mockAnalytics = {
  trackFieldInteraction: vi.fn(),
  trackFieldError: vi.fn(),
  trackFormSubmit: vi.fn(),

/**
 * Form-analytics hook (test stub)
 */
vi.mock('@/hooks/useFormAnalytics', () => {
  return {
    useSessionId: vi.fn(() => 'test-session-123'),
    useFormAnalytics: vi.fn(() => ({
      trackFieldInteraction: mockAnalytics.trackFieldInteraction,
      trackFieldError: mockAnalytics.trackFieldError,
      trackFormSubmit: mockAnalytics.trackFormSubmit,
    })),
  };
}, { virtual: true });

// Mock Supabase client with proper method chaining
vi.mock('@supabase/supabase-js', () => {
  const createMockQueryBuilder = (data = [], error = null) => {
    const queryBuilder = {
      select: vi.fn(() => queryBuilder),
      insert: vi.fn(() => queryBuilder),
      update: vi.fn(() => queryBuilder),
      delete: vi.fn(() => queryBuilder),
      eq: vi.fn(() => queryBuilder),
      neq: vi.fn(() => queryBuilder),
      gt: vi.fn(() => queryBuilder),
      gte: vi.fn(() => queryBuilder),
      lt: vi.fn(() => queryBuilder),
      lte: vi.fn(() => queryBuilder),
      like: vi.fn(() => queryBuilder),
      ilike: vi.fn(() => queryBuilder),
      is: vi.fn(() => queryBuilder),
      in: vi.fn(() => queryBuilder),
      contains: vi.fn(() => queryBuilder),
      match: vi.fn(() => queryBuilder),
      not: vi.fn(() => queryBuilder),
      filter: vi.fn(() => queryBuilder),
      or: vi.fn(() => queryBuilder),
      order: vi.fn(() => queryBuilder),
      limit: vi.fn(() => queryBuilder),
      range: vi.fn(() => queryBuilder),
      single: vi.fn(() => Promise.resolve({ data: data[0] || null, error })),
      maybeSingle: vi.fn(() => Promise.resolve({ data: data[0] || null, error })),
      // Make it thenable for direct awaiting
      then: vi.fn((resolve) => resolve({ data, error })),
      data,
      error,
    };
    return queryBuilder;
  };

  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => createMockQueryBuilder([{ id: '123', name: 'TestData' }], null)),
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user', email: 'test@example.com' } },
          error: null
        }),
        signUp: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user' }, session: null },
          error: null
        }),
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: 'test-user' }, session: { access_token: 'test-token' } },
          error: null
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: { subscription: { unsubscribe: vi.fn() } }
        }),
        getSession: vi.fn().mockResolvedValue({
          data: { session: { access_token: 'test-token' } },
          error: null
        })
      },
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
          download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
          getPublicUrl: vi.fn().mockReturnValue({ 
            data: { publicUrl: 'https://test.com/test.jpg' } 
          })
        }))
      },
      functions: {
        invoke: vi.fn().mockResolvedValue({ data: { result: 'success' }, error: null })
      }
    }))
  };
});

// Mock Stripe
vi.mock('stripe', () => ({
  default: vi.fn().mockImplementation(() => ({
    paymentIntents: {
      capture: vi.fn().mockResolvedValue({ id: 'pi_test_capture' })
    }
  }))
}));

// Mock Twilio
vi.mock('twilio', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({ sid: 'test_message_sid' })
    }
  }))
}));
