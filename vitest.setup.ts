import { vi } from 'vitest';
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
