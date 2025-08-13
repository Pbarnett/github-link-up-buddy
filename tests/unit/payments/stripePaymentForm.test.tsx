import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

// Mock supabase client used in StripePaymentForm BEFORE importing component
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { client_secret: 'cs_test' }, error: null }),
    },
  }),
}));

// Mock Stripe hooks and elements BEFORE importing component
vi.mock('@stripe/react-stripe-js', () => ({
  CardElement: (props: any) => React.createElement('div', props),
  Elements: ({ children }: any) => React.createElement('div', null, children),
  useStripe: () => ({ confirmCardPayment: vi.fn().mockResolvedValue({ paymentIntent: { id: 'pi_123', status: 'succeeded' } }) }),
  useElements: () => ({ getElement: () => ({}) }),
}));

// Now import the component under test so it picks up the mocks
import StripePaymentForm from '@/components/StripePaymentForm';

vi.stubGlobal('analytics', { track: vi.fn() });

describe('StripePaymentForm gating', () => {
  beforeEach(() => {
    (window as any).analytics.track = vi.fn();
  });

  it('does not create PaymentIntent when unauthenticated and calls onRequireAuth', async () => {
    const onRequireAuth = vi.fn();
    const onError = vi.fn();
    const onSuccess = vi.fn();
    const onProcessing = vi.fn();

    await act(async () => {
      render(
        <StripePaymentForm
          amount={100}
          currency="USD"
          offerId="offer_1"
          passengers={[{ given_name: 'A', family_name: 'B', email: 'a@b.com' }]}
          onSuccess={onSuccess}
          onError={onError}
          onProcessing={onProcessing}
          onRequireAuth={onRequireAuth}
        />
      );
    });

    // Wait a tick to allow useEffect to run
    await new Promise((r) => setTimeout(r, 0));

    expect(onRequireAuth).toHaveBeenCalled();
    expect((window as any).analytics.track).not.toHaveBeenCalledWith('payment_intent_created', expect.anything());
  });
});

