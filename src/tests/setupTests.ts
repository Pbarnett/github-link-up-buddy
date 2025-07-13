import { vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

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
    })
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
// GLOBAL TEST ENVIRONMENT RESET
// ==============================================================================

afterEach(() => {
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
