

import * as React from 'react';
const { use } = React;
type ReactNode = React.ReactNode;
type Component<P = {}, S = {}> = React.Component<P, S>;

import { vi, afterEach, expect } from "vitest";
import { cleanup } from '@testing-library/react';

// Import testing-library jest-dom for custom matchers
import '@testing-library/jest-dom';
// Custom matchers for date testing
expect.extend({
  toMatchISODate(received: string) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    const pass = isoDateRegex.test(received);
    return {
      pass,
      message: () => `Expected ${received} to match ISO date format`
    };
  },
  toBeBefore(received: string | Date, expected: string | Date) {
    const receivedDate = new Date(received);
    const expectedDate = new Date(expected);
    const pass = receivedDate.getTime() < expectedDate.getTime();
    return {
      pass,
      message: () => `Expected ${received} to be before ${expected}`
    };
  },
  toBeFuture(received: string | Date) {
    const receivedDate = new Date(received);
    const now = new Date();
    const pass = receivedDate.getTime() > now.getTime();
    return {
      pass,
      message: () => `Expected ${received} to be in the future`
    };
  }
})

// Set up environment variables for testing before any imports
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key-for-testing',
  },
  configurable: true,
})

// Make React available globally for component tests
;(globalThis as Record<string, unknown>).React = React

// ==============================================================================
// JSDOM POLYFILLS FOR MODERN WEB APIS (OAUTH + RADIX UI)
// ==============================================================================

// ResizeObserver polyfill for Radix UI components
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(globalThis, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
})

// Window.matchMedia polyfill for responsive components
Object.defineProperty(globalThis, 'matchMedia', {
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
})

// Crypto API polyfill using Node.js crypto for OAuth token generation
import * as nodeCrypto from 'node:crypto'

if (!globalThis.crypto) {
  vi.stubGlobal('crypto', {
    getRandomValues: nodeCrypto.getRandomValues || ((arr) => {
      const bytes = nodeCrypto.randomBytes(arr.length)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = bytes[i]
      }
      return arr
    }),
    randomUUID: nodeCrypto.randomUUID || (() => nodeCrypto.randomBytes(16).toString('hex')),
    subtle: nodeCrypto.webcrypto?.subtle || {}
  })
  vi.stubGlobal('CryptoKey', nodeCrypto.webcrypto?.CryptoKey || class CryptoKey {})
}

// Base64 encoding/decoding for JWT tokens
if (!globalThis.atob) {
  Object.defineProperty(globalThis, 'atob', {
    value: (str) => Buffer.from(str, 'base64').toString('binary'),
    writable: true,
  })
}

if (!globalThis.btoa) {
  Object.defineProperty(globalThis, 'btoa', {
    value: (str) => Buffer.from(str, 'binary').toString('base64'),
    writable: true,
  })
}

// URL constructor for OAuth redirects
if (!globalThis.URL && typeof URL !== 'undefined') {
  Object.defineProperty(globalThis, 'URL', {
    value: URL,
    writable: true,
  })
}

// URLSearchParams for OAuth parameter parsing  
if (!globalThis.URLSearchParams && typeof URLSearchParams !== 'undefined') {
  Object.defineProperty(globalThis, 'URLSearchParams', {
    value: URLSearchParams,
    writable: true,
  })
}

// CustomEvent polyfill for OAuth events
if (!globalThis.CustomEvent) {
  class CustomEventPolyfill extends Event {
    detail: any
    constructor(type: string, eventInitDict: any = {}) {
      super(type, eventInitDict)
      this.detail = eventInitDict.detail
    }
  }
  Object.defineProperty(globalThis, 'CustomEvent', {
    value: CustomEventPolyfill,
    writable: true,
  })
}

// Modern storage APIs with proper error handling
const createStorageMock = () => ({
  length: 0,
  clear: vi.fn(),
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(() => null)
})

if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createStorageMock(),
    writable: true,
  })
}

if (!globalThis.sessionStorage) {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: createStorageMock(),
    writable: true,
  })
}

// Pointer capture methods for Radix UI components
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: () => false,
  writable: true,
})

Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: () => {},
  writable: true,
})

Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: () => {},
  writable: true,
})

// Scroll methods
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: vi.fn(),
  writable: true,
})

// PointerEvent constructor for JSDOM
if (!globalThis.PointerEvent) {
  class PointerEvent extends Event {
    constructor(type: string, props: Record<string, unknown> = {}) {
      super(type, props)
    }
  }
  (globalThis as Record<string, unknown>).PointerEvent = PointerEvent
}

// ==============================================================================
// SUPABASE MOCK SETUP
// ==============================================================================

// Import the comprehensive mock
import { mockSupabaseClient, createMockSupabaseClient } from './mocks/supabase'

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}))

// ==============================================================================
// BUSINESS RULES MOCK WITH SAFE DEFAULTS
// ==============================================================================

vi.mock('@/hooks/useBusinessRules', () => ({
  useBusinessRules: vi.fn(() => ({
    config: {
      flightSearch: {
        minPriceUSD: 100,
        maxPriceUSD: 2000,
        defaultNonstopRequired: false,
      },
      autoBooking: { enabled: false },
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
  })),
  BusinessRulesProvider: ({ children }: { children: ReactNode }) => children,
}))

// ==============================================================================
// FEATURE FLAGS MOCK
// ==============================================================================

vi.mock('@/hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn((flag: string) => {
    // Provide sensible defaults for common feature flags
    const defaults: Record<string, boolean> = {
      'enable-new-flight-search': true,
      'enable-profile-completeness': true,
      'enable-auto-booking': false,
    }
    return defaults[flag] ?? false
  }),
}))

// ==============================================================================
// DATE UTILITY SAFE WRAPPER
// ==============================================================================

import { parseISO, format, isValid } from 'date-fns'

// Create safe date formatting utility
export const formatDateSafe = (dateString: string, formatStr: string = 'MMM dd, yyyy'): string => {
  try {
    if (!dateString) return ''
    const date = parseISO(dateString)
    return isValid(date) ? format(date, formatStr) : ''
  } catch {
    return ''
  }
}

// Mock the date utility if it exists
vi.mock('@/lib/utils/formatDate', () => ({
  formatDate: formatDateSafe,
}))

// ==============================================================================
// ROUTER MOCK
// ==============================================================================

// Don't globally mock react-router-dom - let tests import the real ones when needed
// This allows MemoryRouter in tests to work correctly with query parameters

// ==============================================================================
// GLOBAL TEST ENVIRONMENT RESET
// ==============================================================================

afterEach(() => {
  // Clean up React Testing Library components first
  cleanup()
  
  // Run all pending timers first, in case they're pending
  try {
    vi.runAllTimers()
  } catch {
    // Timers aren't mocked, ignore
  }
  // Clear all timers and restore real timers (only if fake timers are active)
  try {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  } catch {
    // Timers aren't mocked, ignore
  }
  
  // Clear all mocks and restore functions
  vi.clearAllMocks()
  
  // Unstub all globals to prevent test pollution
  vi.unstubAllGlobals()
  
  // Clear localStorage and sessionStorage
  localStorage.clear()
  sessionStorage.clear()
  
  // Reset console spies if they exist
  const globalThisWithSpies = globalThis as Record<string, unknown>
  if (globalThisWithSpies.consoleLogSpy && typeof globalThisWithSpies.consoleLogSpy === 'object' && globalThisWithSpies.consoleLogSpy && 'mockRestore' in globalThisWithSpies.consoleLogSpy) {
    (globalThisWithSpies.consoleLogSpy as { mockRestore: () => void }).mockRestore()
  }
  if (globalThisWithSpies.consoleErrorSpy && typeof globalThisWithSpies.consoleErrorSpy === 'object' && globalThisWithSpies.consoleErrorSpy && 'mockRestore' in globalThisWithSpies.consoleErrorSpy) {
    (globalThisWithSpies.consoleErrorSpy as { mockRestore: () => void }).mockRestore()
  }
  if (globalThisWithSpies.consoleWarnSpy && typeof globalThisWithSpies.consoleWarnSpy === 'object' && globalThisWithSpies.consoleWarnSpy && 'mockRestore' in globalThisWithSpies.consoleWarnSpy) {
    (globalThisWithSpies.consoleWarnSpy as { mockRestore: () => void }).mockRestore()
  }
})

// ==============================================================================
// TOAST/NOTIFICATION MOCKS
// ==============================================================================

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}))

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: vi.fn(), dismiss: vi.fn() }),
  toast: vi.fn(),
}))

// ==============================================================================
// LAUNCHDARKLY MOCKS
// ==============================================================================

// Mock LaunchDarkly React SDK
vi.mock('launchdarkly-react-client-sdk', () => {
  const React = require('react');
  
  const mockLDClient = {
    variation: vi.fn((key: string, defaultValue: any) => defaultValue),
    allFlags: vi.fn(() => ({})),
    track: vi.fn(),
    identify: vi.fn(),
    flush: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    setStreaming: vi.fn(),
  };

  const MockLDProvider = ({ children }: { children: ReactNode }) => {
    return React.createElement(React.Fragment, {}, children);
  };

  return {
    useFlags: vi.fn(() => ({})),
    useLDClient: vi.fn(() => mockLDClient),
    useFlag: vi.fn((key: string, defaultValue: any) => defaultValue),
    LDProvider: MockLDProvider,
    asyncWithLDProvider: vi.fn().mockResolvedValue(MockLDProvider),
    withLDProvider: vi.fn((config: any) => (Component: ComponentType) => {
      return (props: any) => React.createElement(Component, props);
    }),
  };
});

// Mock LaunchDarkly JS Client SDK
vi.mock('launchdarkly-js-client-sdk', () => ({
  initialize: vi.fn().mockResolvedValue({
    variation: vi.fn((key: string, defaultValue: any) => defaultValue),
    allFlags: vi.fn(() => ({})),
    track: vi.fn(),
    identify: vi.fn(),
    flush: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    waitForInitialization: vi.fn().mockResolvedValue(true),
  }),
  createConsoleLogger: vi.fn(),
  basicLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock our custom LaunchDarkly components
vi.mock('@/lib/launchdarkly/LaunchDarklyProvider', () => {
  const React = require('react');
  return {
    LaunchDarklyProvider: ({ children }: { children: ReactNode }) => {
      return React.createElement(React.Fragment, {}, children);
    },
    useLDClient: vi.fn(() => ({
      variation: vi.fn((key: string, defaultValue: any) => defaultValue),
      allFlags: vi.fn(() => ({})),
      track: vi.fn(),
      identify: vi.fn(),
      flush: vi.fn(),
      close: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    })),
    useFlags: vi.fn(() => ({})),
  };
});

vi.mock('@/lib/launchdarkly/DevOverrides', () => {
  const React = require('react');
  return {
    DevFlagOverrides: class {
      static get = vi.fn((key: string) => null);
      static set = vi.fn();
      static remove = vi.fn();
      static clear = vi.fn();
      static list = vi.fn(() => []);
      static isEnabled = vi.fn(() => false);
    },
    useDevFlags: vi.fn(() => ({})),
    useDevFlag: vi.fn((key: string, defaultValue: any) => defaultValue),
    DevFlagOverrideStatus: ({ children }: { children: ReactNode }) => {
      return React.createElement(React.Fragment, {}, children);
    },
  };
});

vi.mock('@/lib/launchdarkly/context-manager', () => ({
  LaunchDarklyContextManager: {
    createContext: vi.fn(() => ({ key: 'test-user', kind: 'user' })),
    createAnonymousContext: vi.fn(() => ({ key: 'anonymous', kind: 'user', anonymous: true })),
    updateContextOnAuth: vi.fn((context: any, attributes: any) => ({ ...context, ...attributes })),
    updateContextOnSubscription: vi.fn((context: any, subscription: string) => ({ ...context, subscription })),
    updateContextWithFeatureUsage: vi.fn((context: any, feature: string, used: boolean) => context),
    updateContextWithLocation: vi.fn((context: any, country?: string, timezone?: string) => context),
    createExperimentContext: vi.fn((attributes: any, group: string) => ({ ...attributes, experimentGroup: group })),
    validateContext: vi.fn(() => true),
    sanitizeContext: vi.fn((context: any) => context),
  },
}));

vi.mock('@/lib/launchdarkly/AuthSync', () => {
  const React = require('react');
  return {
    AuthSync: ({ children }: { children: ReactNode }) => {
      return React.createElement(React.Fragment, {}, children);
    },
  };
});

// ==============================================================================
// EXTERNAL SERVICE MOCKS
// ==============================================================================

// Stripe mock
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({
    elements: vi.fn(),
    confirmPayment: vi.fn(),
  }),
}))

// Sentry mock
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}))

// Export commonly used mocks for test files
export { mockSupabaseClient, createMockSupabaseClient as createQueryMock }
