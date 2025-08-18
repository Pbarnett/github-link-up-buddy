import { vi, beforeEach, afterEach } from 'vitest';
import 'dotenv/config';

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
};

// Fail tests on unexpected console.error or console.warn to catch regressions early
let originalError: typeof console.error;
let originalWarn: typeof console.warn;

beforeEach(() => {
  originalError = console.error;
  originalWarn = console.warn;
  console.error = (...args: unknown[]) => {
    const message = String(args?.[0] ?? '');
    // Allow known intentional error logs in tests
    if (/ReactDOMTestUtils\.act/.test(message)) return;
    if (/error during concurrent rendering/i.test(message) && /React was able to recover/i.test(message)) return;
    if (/^\[ERROR\] Application error:/i.test(message)) return;
    if(/^\[FilterPipeline\] Filter .* failed:/i.test(message)) return;
    if(/^\[BudgetFilter\] No valid budget specified/i.test(message)) return;
    if(/^Unexpected error fetching trip history/i.test(message)) return;
    throw new Error(`console.error called during test: ${message}`);
  };
  console.warn = (...args: unknown[]) => {
    const message = String(args?.[0] ?? '');
    // Allow deprecation warnings pattern if needed
    if (/deprecated/i.test(message)) return;
    // Suppress React Router v7 future flag warnings to reduce noise in tests
    if (/React Router Future Flag Warning/i.test(message)) return;
    // Allow known expected warns in performance/error-path tests
    if(/^\[FilterPipeline\] Limited processing to/i.test(message)) return;
    if(/^Business rules API not available/i.test(message)) return;
    if(/^Failed to load static business rules config/i.test(message)) return;
    throw new Error(`console.warn called during test: ${message}`);
  };
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

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

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn(),
      select: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    })
  })
}));

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
