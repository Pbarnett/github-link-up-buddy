import * as nodeCrypto from 'node:crypto';
import React, { createElement, Fragment } from 'react';
import { vi, afterEach, expect } from "vitest";
import { parseISO, format, isValid } from 'date-fns';
import { cleanup, render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

type ReactNode = React.ReactNode;
type ComponentType<P = {}> = ComponentType<P>;

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends jest.Expect {}
}

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

// Set up process.env for Node.js style environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-for-testing'
process.env.NODE_ENV = 'test'

// Make React available globally for component tests
;(globalThis as Record<string, unknown>).React = React
;(globalThis as Record<string, unknown>).forwardRef = React.forwardRef
;(globalThis as Record<string, unknown>).createElement = React.createElement
;(globalThis as Record<string, unknown>).Fragment = React.Fragment
;(globalThis as Record<string, unknown>).useState = React.useState
;(globalThis as Record<string, unknown>).useEffect = React.useEffect
;(globalThis as Record<string, unknown>).useCallback = React.useCallback
;(globalThis as Record<string, unknown>).useMemo = React.useMemo
;(globalThis as Record<string, unknown>).useRef = React.useRef
;(globalThis as Record<string, unknown>).useContext = React.useContext
;(globalThis as Record<string, unknown>).useReducer = React.useReducer
;(globalThis as Record<string, unknown>).useLayoutEffect = React.useLayoutEffect
;(globalThis as Record<string, unknown>).useId = React.useId
;(globalThis as Record<string, unknown>).createContext = React.createContext

// Make React Testing Library functions globally available
;(globalThis as Record<string, unknown>).render = render
;(globalThis as Record<string, unknown>).screen = screen
;(globalThis as Record<string, unknown>).waitFor = waitFor
;(globalThis as Record<string, unknown>).fireEvent = fireEvent
;(globalThis as Record<string, unknown>).act = act

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
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    length: 0,
    clear: vi.fn(() => {
      store = {};
    }),
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    key: vi.fn(() => null)
  };
};

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

// Mock HTMLElement for Node.js environment (needed for AWS SDK tests)
if (typeof HTMLElement === 'undefined') {
  global.HTMLElement = class HTMLElement {
    hasPointerCapture() { return false; }
    setPointerCapture() {}
    releasePointerCapture() {}
    scrollIntoView() {}
  } as any;
}

// Pointer capture methods for Radix UI components
if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype) {
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: () => false,
    writable: true,
  });

  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: () => {},
    writable: true,
  });

  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: () => {},
    writable: true,
  });

  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: vi.fn(),
    writable: true,
  });
}


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

// Create simple inline Supabase mock
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null
    }),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
      error: null
    }))
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}))

// Mock the Profile API KMS service
vi.mock('@/services/api/profileApiKMS', () => ({
  ProfileApiKMS: class {
    static getInstance() {
      return {
        getProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
        updateProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
        createProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
        calculateCompleteness: vi.fn().mockReturnValue({
          overall: 85,
          categories: {
            basic_info: 100,
            contact_info: 90,
            travel_documents: 80,
            preferences: 60,
            verification: 50
          },
          missing_fields: ['known_traveler_number'],
          recommendations: []
        })
      };
    }
  }
}));

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

// Mock React Router hooks for tests that need them
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  
  // Create a mock Link component
  const MockLink = ({ to, children, ...props }: any) => {
    return createElement('a', { ...props, href: to }, children);
  };
  
  return {
    ...actual,
    Link: MockLink,
    useSearchParams: vi.fn(() => [
      new URLSearchParams(),
      vi.fn()
    ]),
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    })),
    useParams: vi.fn(() => ({})),
    MemoryRouter: ({ children, initialEntries, ...props }: any) => {
      // Don't pass initialEntries as a DOM prop to avoid React warnings
      return createElement('div', { ...props, 'data-testid': 'memory-router' }, children);
    },
    Routes: ({ children, ...props }: any) => {
      return createElement('div', { ...props, 'data-testid': 'routes' }, children);
    },
    Route: ({ children, element, ...props }: any) => {
      return createElement('div', { ...props, 'data-testid': 'route' }, element || children);
    },
  };
});

// Make Link and MemoryRouter globally available for components
const MockLink = ({ to, children, ...props }: any) => {
  return createElement('a', { ...props, href: to }, children);
};

const MockMemoryRouter = ({ children, initialEntries, ...props }: any) => {
  // Don't pass initialEntries as a DOM prop to avoid React warnings
  return createElement('div', { ...props, 'data-testid': 'memory-router' }, children);
};

;(globalThis as Record<string, unknown>).Link = MockLink
;(globalThis as Record<string, unknown>).MemoryRouter = MockMemoryRouter

// Make React Router Routes and Route components globally available
const MockRoutes = ({ children, ...props }: any) => {
  return createElement('div', { ...props, 'data-testid': 'routes' }, children);
};

const MockRoute = ({ children, element, ...props }: any) => {
  return createElement('div', { ...props, 'data-testid': 'route' }, element || children);
};

;(globalThis as Record<string, unknown>).Routes = MockRoutes
;(globalThis as Record<string, unknown>).Route = MockRoute

// Make React Router hooks globally available
;(globalThis as Record<string, unknown>).useParams = vi.fn(() => ({}))
;(globalThis as Record<string, unknown>).useNavigate = vi.fn(() => vi.fn())
;(globalThis as Record<string, unknown>).useLocation = vi.fn(() => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default'
}))

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
    return createElement(Fragment, {}, children);
  };

  return {
    useFlags: vi.fn(() => ({})),
    useLDClient: vi.fn(() => mockLDClient),
    useFlag: vi.fn((key: string, defaultValue: any) => defaultValue),
    LDProvider: MockLDProvider,
    asyncWithLDProvider: vi.fn().mockResolvedValue(MockLDProvider),
    withLDProvider: vi.fn((_config: any) => (Component: ComponentType) => {
      return (props: any) => createElement(Component, props);
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

// Mock LaunchDarkly Node.js SDK for server-side tests
vi.mock('launchdarkly-node-server-sdk', () => {
  const mockLDClientNode = {
    variation: vi.fn((key: string, user: any, defaultValue: any) => defaultValue),
    allFlagsState: vi.fn(() => ({ valid: true, toJSON: () => ({}) })),
    track: vi.fn(),
    identify: vi.fn(),
    flush: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    waitForInitialization: vi.fn().mockResolvedValue(true),
    initialized: vi.fn(() => true),
  };

  return {
    init: vi.fn().mockResolvedValue(mockLDClientNode),
    createConsoleLogger: vi.fn(),
    basicLogger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
});

// Mock our custom LaunchDarkly components
vi.mock('@/lib/launchdarkly/LaunchDarklyProvider', () => {
  return {
    LaunchDarklyProvider: ({ children }: { children: ReactNode }) => {
      return createElement(Fragment, {}, children);
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
  return {
    DevFlagOverrides: class {
      static get = vi.fn((_key: string) => null);
      static set = vi.fn();
      static remove = vi.fn();
      static clear = vi.fn();
      static list = vi.fn(() => []);
      static isEnabled = vi.fn(() => false);
    },
    useDevFlags: vi.fn(() => ({})),
    useDevFlag: vi.fn((key: string, defaultValue: any) => defaultValue),
    DevFlagOverrideStatus: ({ children }: { children: ReactNode }) => {
      return createElement(Fragment, {}, children);
    },
  };
});

vi.mock('@/lib/launchdarkly/context-manager', () => ({
  LaunchDarklyContextManager: {
    createContext: vi.fn(() => ({ key: 'test-user', kind: 'user' })),
    createAnonymousContext: vi.fn(() => ({ key: 'anonymous', kind: 'user', anonymous: true })),
    updateContextOnAuth: vi.fn((context: any, attributes: any) => ({ ...context, ...attributes })),
    updateContextOnSubscription: vi.fn((context: any, subscription: string) => ({ ...context, subscription })),
    updateContextWithFeatureUsage: vi.fn((context: any, _feature: string, _used: boolean) => context),
    updateContextWithLocation: vi.fn((context: any, _country?: string, _timezone?: string) => context),
    createExperimentContext: vi.fn((attributes: any, group: string) => ({ ...attributes, experimentGroup: group })),
    validateContext: vi.fn(() => true),
    sanitizeContext: vi.fn((context: any) => context),
  },
}));

vi.mock('@/lib/launchdarkly/AuthSync', () => {
  return {
    AuthSync: ({ children }: { children: ReactNode }) => {
      return createElement(Fragment, {}, children);
    },
  };
});

// ==============================================================================
// RADIX UI MOCKS
// ==============================================================================

// Mock all Radix UI components with simple div replacements
vi.mock('@radix-ui/react-label', () => ({
  Root: ({ children, ...props }: any) => createElement('label', props, children),
}));

vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: any) => createElement('div', props, children),
}));

vi.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, ...props }: any) => createElement('div', props, children),
  List: ({ children, ...props }: any) => createElement('div', props, children),
  Trigger: ({ children, ...props }: any) => createElement('button', props, children),
  Content: ({ children, ...props }: any) => createElement('div', props, children),
}));

vi.mock('@radix-ui/react-toast', () => ({
  Provider: ({ children }: any) => createElement(Fragment, {}, children),
  Root: ({ children, ...props }: any) => createElement('div', props, children),
  Title: ({ children, ...props }: any) => createElement('div', props, children),
  Description: ({ children, ...props }: any) => createElement('div', props, children),
  Action: ({ children, ...props }: any) => createElement('button', props, children),
  Close: ({ children, ...props }: any) => createElement('button', props, children),
  Viewport: ({ children, ...props }: any) => createElement('div', props, children),
}));

vi.mock('@radix-ui/react-progress', () => ({
  Root: ({ children, ...props }: any) => createElement('div', props, children),
  Indicator: ({ ...props }: any) => createElement('div', props),
}));

vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: any) => createElement(Fragment, {}, children),
  Portal: ({ children }: any) => createElement(Fragment, {}, children),
  Overlay: ({ children, ...props }: any) => createElement('div', props, children),
  Content: ({ children, ...props }: any) => createElement('div', props, children),
  Header: ({ children, ...props }: any) => createElement('div', props, children),
  Footer: ({ children, ...props }: any) => createElement('div', props, children),
  Title: ({ children, ...props }: any) => createElement('h2', props, children),
  Description: ({ children, ...props }: any) => createElement('p', props, children),
  Close: ({ children, ...props }: any) => createElement('button', props, children),
  Trigger: ({ children, ...props }: any) => createElement('button', props, children),
}));

vi.mock('@radix-ui/react-select', () => ({
  Root: ({ children }: any) => createElement(Fragment, {}, children),
  Trigger: ({ children, ...props }: any) => createElement('button', props, children),
  Value: ({ children, ...props }: any) => createElement('span', props, children),
  Content: ({ children, ...props }: any) => createElement('div', props, children),
  Item: ({ children, ...props }: any) => createElement('div', props, children),
  ItemText: ({ children, ...props }: any) => createElement('span', props, children),
  ItemIndicator: ({ children, ...props }: any) => createElement('span', props, children),
  ScrollUpButton: ({ children, ...props }: any) => createElement('button', props, children),
  ScrollDownButton: ({ children, ...props }: any) => createElement('button', props, children),
  Group: ({ children, ...props }: any) => createElement('div', props, children),
  Label: ({ children, ...props }: any) => createElement('label', props, children),
  Separator: ({ ...props }: any) => createElement('hr', props),
  Icon: ({ children, ...props }: any) => createElement('span', props, children),
  Portal: ({ children }: any) => createElement(Fragment, {}, children),
  Viewport: ({ children, ...props }: any) => createElement('div', props, children),
}));

vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: any) => createElement(Fragment, {}, children),
  Trigger: ({ children, ...props }: any) => createElement('button', props, children),
  Content: ({ children, ...props }: any) => createElement('div', props, children),
  Portal: ({ children }: any) => createElement(Fragment, {}, children),
  Close: ({ children, ...props }: any) => createElement('button', props, children),
  Anchor: ({ children, ...props }: any) => createElement('div', props, children),
  Arrow: ({ ...props }: any) => createElement('div', props),
}));

vi.mock('@radix-ui/react-separator', () => ({
  Root: ({ ...props }: any) => createElement('hr', props),
}));

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

// ==============================================================================
// TANSTACK QUERY (REACT QUERY) MOCKS
// ==============================================================================

// Mock TanStack Query
class MockQueryClient {
  invalidateQueries = vi.fn();
  setQueryData = vi.fn();
  getQueryData = vi.fn();
  refetchQueries = vi.fn();
  cancelQueries = vi.fn();
  removeQueries = vi.fn();
  clear = vi.fn();
}

const mockQueryClient = new MockQueryClient();

vi.mock('@tanstack/react-query', () => ({
  QueryClient: MockQueryClient,
  QueryClientProvider: ({ children }: { children: ReactNode }) => {
    return createElement(Fragment, {}, children);
  },
  useQuery: vi.fn((options: any) => ({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
    refetch: vi.fn(),
    ...options.defaultData,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    reset: vi.fn(),
  })),
  useQueryClient: vi.fn(() => mockQueryClient),
  useInfiniteQuery: vi.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: true,
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: vi.fn(),
  })),
}));

// Make QueryClient globally available
;(globalThis as Record<string, unknown>).QueryClient = MockQueryClient

// ==============================================================================
// REACT HOOK FORM MOCKS
// ==============================================================================

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(() => ({
    register: vi.fn(() => ({})),
    handleSubmit: vi.fn((fn) => (e: any) => {
      e?.preventDefault?.();
      return fn({});
    }),
    formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
      isDirty: false,
      isSubmitted: false,
    },
    reset: vi.fn(),
    setValue: vi.fn(),
    getValue: vi.fn(),
    getValues: vi.fn(() => ({})),
    watch: vi.fn(),
    control: {},
    clearErrors: vi.fn(),
    setError: vi.fn(),
  })),
  Controller: ({ render, ...props }: any) => {
    const field = {
      value: props.defaultValue || '',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: props.name,
    };
    return render({ field, fieldState: { error: null } });
  },
  useController: vi.fn(() => ({
    field: {
      value: '',
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: 'test',
    },
    fieldState: { error: null },
  })),
  FormProvider: ({ children }: { children: ReactNode }) => {
    return createElement(Fragment, {}, children);
  },
}));

// Make useForm globally available
;(globalThis as Record<string, unknown>).useForm = vi.fn(() => ({
  register: vi.fn(() => ({})),
  handleSubmit: vi.fn((fn) => (e: any) => {
    e?.preventDefault?.();
    return fn({});
  }),
  formState: {
    errors: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
    isSubmitted: false,
  },
  reset: vi.fn(),
  setValue: vi.fn(),
  getValue: vi.fn(),
  getValues: vi.fn(() => ({})),
  watch: vi.fn(),
  control: {},
  clearErrors: vi.fn(),
  setError: vi.fn(),
}))

// ==============================================================================
// RADIX UI SLOT COMPONENT
// ==============================================================================

// Make Slot globally available (needed for button component)
const MockSlot = ({ children, ...props }: any) => {
  return createElement('div', props, children);
};
;(globalThis as Record<string, unknown>).Slot = MockSlot

// ==============================================================================
// LUCIDE REACT ICONS MOCKS
// ==============================================================================

// Mock all commonly used Lucide React icons
vi.mock('lucide-react', () => {
  // Create a generic icon component that renders as a span with the icon name
  const createMockIcon = (name: string) => ({
    className = '',
    size,
    ...props
  }: any) => {
    return createElement('span', {
      ...props,
      className: `lucide-icon lucide-${name.toLowerCase()} ${className}`,
      'data-testid': `icon-${name.toLowerCase()}`,
      'aria-label': name,
      role: 'img'
    });
  };

  return {
    AlertCircle: createMockIcon('AlertCircle'),
    Terminal: createMockIcon('Terminal'),
    CheckCircle: createMockIcon('CheckCircle'),
    XCircle: createMockIcon('XCircle'),
    Info: createMockIcon('Info'), 
    Loader: createMockIcon('Loader'),
    RefreshCw: createMockIcon('RefreshCw'),
    Search: createMockIcon('Search'),
    Filter: createMockIcon('Filter'),
    Calendar: createMockIcon('Calendar'),
    Clock: createMockIcon('Clock'),
    MapPin: createMockIcon('MapPin'),
    Plane: createMockIcon('Plane'),
    DollarSign: createMockIcon('DollarSign'),
    Users: createMockIcon('Users'),
    Settings: createMockIcon('Settings'),
    Menu: createMockIcon('Menu'),
    X: createMockIcon('X'),
    ChevronDown: createMockIcon('ChevronDown'),
    ChevronUp: createMockIcon('ChevronUp'),
    ChevronLeft: createMockIcon('ChevronLeft'),
    ChevronRight: createMockIcon('ChevronRight'),
    Plus: createMockIcon('Plus'),
    Minus: createMockIcon('Minus'),
    Edit: createMockIcon('Edit'),
    Trash: createMockIcon('Trash'),
    Save: createMockIcon('Save'),
    Copy: createMockIcon('Copy'),
    Share: createMockIcon('Share'),
    Download: createMockIcon('Download'),
    Upload: createMockIcon('Upload'),
    Eye: createMockIcon('Eye'),
    EyeOff: createMockIcon('EyeOff'),
    Lock: createMockIcon('Lock'),
    Unlock: createMockIcon('Unlock'),
    Star: createMockIcon('Star'),
    Heart: createMockIcon('Heart'),
    Home: createMockIcon('Home'),
    Mail: createMockIcon('Mail'),
    Phone: createMockIcon('Phone'),
    Globe: createMockIcon('Globe'),
    ArrowRight: createMockIcon('ArrowRight'),
    ArrowLeft: createMockIcon('ArrowLeft'),
    ArrowUp: createMockIcon('ArrowUp'),
    ArrowDown: createMockIcon('ArrowDown'),
  };
});

// Make commonly used icons globally available
const createMockIcon = (name: string) => ({
  className = '',
  size,
  ...props
}: any) => {
  return createElement('span', {
    ...props,
    className: `lucide-icon lucide-${name.toLowerCase()} ${className}`,
    'data-testid': `icon-${name.toLowerCase()}`,
    'aria-label': name,
    role: 'img'
  });
};

;(globalThis as Record<string, unknown>).AlertCircle = createMockIcon('AlertCircle')
;(globalThis as Record<string, unknown>).Terminal = createMockIcon('Terminal')
;(globalThis as Record<string, unknown>).CheckCircle = createMockIcon('CheckCircle')
;(globalThis as Record<string, unknown>).XCircle = createMockIcon('XCircle')
;(globalThis as Record<string, unknown>).RefreshCw = createMockIcon('RefreshCw')

// Export commonly used mocks for test files
const createMockSupabaseClient = () => mockSupabaseClient;
export { mockSupabaseClient, createMockSupabaseClient, mockQueryClient };
