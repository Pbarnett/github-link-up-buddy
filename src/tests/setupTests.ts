import { vi, afterEach, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import React from 'react'

// Set up environment variables for testing before any imports
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    VITE_SUPABASE_URL: 'https://test.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key-for-testing',
    VITE_ENABLE_PREFERENCES_INIT: 'false',
  },
  configurable: true,
})

// Make React available globally for component tests
;(globalThis as any).React = React

// ==============================================================================
// GLOBAL CALENDAR MOCKS (for react-day-picker and Calendar component)
// ==============================================================================

// Provide a simple, test-friendly calendar mock available to all tests
vi.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect }: any) => (
    React.createElement('div', { 'data-testid': 'mock-calendar', role: 'grid' },
      React.createElement('button', {
        'data-testid': 'select-date-button',
        onClick: () => onSelect && onSelect(new Date())
      }, 'Select Date')
    )
  ),
}))

vi.mock('@/components/ui/calendar', () => ({
  Calendar: ({ onSelect }: any) => (
    React.createElement('div', { 'data-testid': 'mock-calendar', role: 'grid' },
      React.createElement('button', {
        'data-testid': 'select-date-button',
        onClick: () => onSelect && onSelect(new Date())
      }, 'Select Date')
    )
  ),
}))

// ==============================================================================
// JSDOM POLYFILLS FOR RADIX UI
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

// Pointer capture methods for Radix UI components
// Guard for environments where HTMLElement may not yet be defined
if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype) {
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
}

// matchMedia polyfill for components/hooks that depend on it
// Hardened to ensure matchMedia is always a callable function with expected API
if (typeof window !== 'undefined' && typeof (window as any).matchMedia !== 'function') {
  const mm = (query: string) => ({
    matches: false,
    media: String(query),
    onchange: null as ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as any

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mm.bind(window),
  })
}

// Scroll methods
if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype) {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: vi.fn(),
    writable: true,
  })
}

// PointerEvent constructor for JSDOM
if (!globalThis.PointerEvent) {
  class PointerEvent extends Event {
    constructor(type: string, props: any = {}) {
      super(type, props)
    }
  }
  (globalThis as any).PointerEvent = PointerEvent
}

// ==============================================================================
// SUPABASE MOCK SETUP
// ==============================================================================
// Create chainable mock that supports method chaining
const createSupabaseQueryMock = () => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  // Promise interface for async/await
  then: vi.fn().mockResolvedValue({ data: [], error: null }),
})

const mockSupabaseClient = {
  from: vi.fn(() => createSupabaseQueryMock()),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' } },
      error: null
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: { user: { id: 'test-user-id' } } },
      error: null
    }),
    onAuthStateChange: vi.fn((callback: any) => {
      const session = { user: { id: 'test-user-id', email: 'test@example.com' } }
      // Simulate immediate signed-in callback
      try { callback('SIGNED_IN', { session }) } catch {}
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
        error: null,
      }
    }),
  },
  rpc: vi.fn().mockResolvedValue({ data: null, error: null })
}

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
  BusinessRulesProvider: ({ children }: { children: React.ReactNode }) => children,
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
// React Router v7 future flag warnings: filter in test output
// ==============================================================================
// React Router emits deprecation-like warnings about upcoming v7 behavior. These are
// informative but extremely noisy in tests, and we intentionally exercise routing.
// We filter only those specific warnings while letting other warnings pass through.
try {
  const originalWarn = console.warn.bind(console);
  const originalError = console.error.bind(console);
  const suppressedPatterns = [
    /React Router Future Flag Warning/i,
  ];
  (globalThis as any).consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation((...args: any[]) => {
    try {
      const msg = args.map((a: unknown) => {
        if (typeof a === 'string') return a;
        const m = (a as any)?.message;
        return typeof m === 'string' ? m : String(a);
      }).join(' ');
      if (suppressedPatterns.some((re) => re.test(msg))) {
        return;
      }
    } catch {}
    originalWarn(...(args as Parameters<typeof console.warn>));
  });
  (globalThis as any).consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
    try {
      const msg = args.map((a: unknown) => {
        if (typeof a === 'string') return a;
        const m = (a as any)?.message;
        return typeof m === 'string' ? m : String(a);
      }).join(' ');
      if (suppressedPatterns.some((re) => re.test(msg))) {
        return;
      }
    } catch {}
    originalError(...(args as Parameters<typeof console.error>));
  });
} catch {}

// ==============================================================================
// DEBOUNCE: MAKE SYNCHRONOUS IN TESTS
// ==============================================================================
// If a debounce utility exists, force it to call immediately to avoid act warnings
try {
  vi.mock('@/lib/utils/debounce', () => ({
    debounce: (fn: any) => fn,
  }));
} catch {}

// ==============================================================================
// GLOBAL TEST ENVIRONMENT RESET
// ==============================================================================

afterEach(() => {
  // Clear all mocks and restore functions
  vi.clearAllMocks()
  
  // Clear localStorage and sessionStorage
  localStorage.clear()
  sessionStorage.clear()
  
  // Reset console spies if they exist
  if ((globalThis as any).consoleLogSpy?.mockRestore) {
    (globalThis as any).consoleLogSpy.mockRestore()
  }
  if ((globalThis as any).consoleErrorSpy?.mockRestore) {
    (globalThis as any).consoleErrorSpy.mockRestore()
  }
  if ((globalThis as any).consoleWarnSpy?.mockRestore) {
    (globalThis as any).consoleWarnSpy.mockRestore()
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
export { mockSupabaseClient, createSupabaseQueryMock as createQueryMock }
