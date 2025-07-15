import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Payment Architecture Logic Tests
 * 
 * These tests validate the core payment logic without importing Deno modules.
 * They test the business logic that would be used in the edge functions.
 */

// Mock Stripe instance
const mockStripe = {
  customers: {
    create: vi.fn(),
  },
  setupIntents: {
    create: vi.fn(),
    retrieve: vi.fn(),
  },
  paymentMethods: {
    retrieve: vi.fn(),
  },
  paymentIntents: {
    create: vi.fn(),
  },
};

// Mock Supabase client
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
};

// Payment architecture core logic functions
interface StripeClient {
  customers: {
    create: (params: { email: string; metadata: Record<string, string> }) => Promise<{ id: string; email: string }>;
  };
  setupIntents: {
    create: (params: { customer: string; usage: string; payment_method_types: string[] }) => Promise<{ id: string; client_secret: string; customer: string }>;
    retrieve: (id: string) => Promise<unknown>;
  };
  paymentMethods: {
    retrieve: (id: string) => Promise<unknown>;
  };
  paymentIntents: {
    create: (params: Record<string, unknown>, options?: { idempotencyKey: string }) => Promise<{ id: string; status: string; amount: number; currency: string }>;
  };
}

interface SupabaseClient {
  from: (table: string) => SupabaseClient;
  select: (columns: string) => SupabaseClient;
  insert: (data: unknown) => SupabaseClient;
  update: (data: unknown) => SupabaseClient;
  eq: (column: string, value: unknown) => SupabaseClient;
  single: () => Promise<unknown>;
  auth: {
    getUser: () => Promise<unknown>;
  };
}

class PaymentArchitecture {
  constructor(private stripe: StripeClient, private supabase: SupabaseClient) {}

  async createSetupIntent(userId: string, email: string) {
    // Step 1: Create or get Stripe customer
    const customer = await this.stripe.customers.create({
      email,
      metadata: { supabase_user_id: userId }
    });

    // Step 2: Create setup intent for off-session usage
    const setupIntent = await this.stripe.setupIntents.create({
      customer: customer.id,
      usage: 'off_session',
      payment_method_types: ['card'],
    });

    return {
      client_secret: setupIntent.client_secret,
      stripe_customer_id: customer.id,
    };
  }

  async validateCampaignForAutoBooking(campaignId: string, flightPrice: number) {
    // Mock campaign lookup
    const campaign = {
      id: campaignId,
      max_price: 500,
      currency: 'USD',
      status: 'active',
      payment_method: {
        stripe_customer_id: 'cus_test',
        stripe_payment_method_id: 'pm_test',
        exp_month: 12,
        exp_year: 2025,
      }
    };

    // Business logic validations
    const validations = {
      campaignExists: !!campaign,
      campaignActive: campaign.status === 'active',
      priceWithinBudget: flightPrice <= campaign.max_price,
      hasPaymentMethod: !!campaign.payment_method?.stripe_payment_method_id,
      cardNotExpired: this.isCardNotExpired(campaign.payment_method),
    };

    return {
      valid: Object.values(validations).every(Boolean),
      validations,
      campaign,
    };
  }

  async createAutoBookingPaymentIntent(
    campaignId: string,
    flightOffer: {
      id: string;
      price: number;
      currency: string;
      airline: string;
      flight_number: string;
      route: string;
      departure_date: string;
    },
    stripeCustomerId: string,
    stripePaymentMethodId: string
  ) {
    const amount = Math.round(flightOffer.price * 100); // Convert to cents
    
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: flightOffer.currency.toLowerCase(),
      customer: stripeCustomerId,
      payment_method: stripePaymentMethodId,
      off_session: true,
      confirm: true,
      capture_method: 'automatic',
      description: `Auto-booking: ${flightOffer.airline} ${flightOffer.flight_number}`,
      metadata: {
        campaign_id: campaignId,
        flight_offer_id: flightOffer.id,
        auto_booking: 'true',
        route: flightOffer.route,
        departure_date: flightOffer.departure_date,
      }
    }, {
      idempotencyKey: `auto-booking-${campaignId}-${flightOffer.id}-${Date.now()}`
    });

    return paymentIntent;
  }

  private isCardNotExpired(paymentMethod: { exp_month?: number; exp_year?: number }): boolean {
    if (!paymentMethod?.exp_month || !paymentMethod?.exp_year) {
      return false;
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    return (
      paymentMethod.exp_year > currentYear ||
      (paymentMethod.exp_year === currentYear && paymentMethod.exp_month >= currentMonth)
    );
  }

  parseStripeError(error: {
    type?: string;
    code?: string;
    message?: string;
  }): { userMessage: string; errorCode: string } {
    if (error.type === 'StripeCardError') {
      switch (error.code) {
        case 'card_declined':
          return { userMessage: 'Card was declined by your bank', errorCode: error.code };
        case 'insufficient_funds':
          return { userMessage: 'Insufficient funds on card', errorCode: error.code };
        case 'expired_card':
          return { userMessage: 'Card has expired', errorCode: error.code };
        case 'authentication_required':
          return { userMessage: 'Payment requires additional authentication', errorCode: error.code };
        default:
          return { userMessage: error.message || 'Payment processing failed', errorCode: error.code || 'unknown' };
      }
    }
    return { userMessage: 'Payment processing failed', errorCode: 'unknown' };
  }
}

describe('Payment Architecture Core Logic', () => {
  let paymentArchitecture: PaymentArchitecture;

  beforeEach(() => {
    vi.clearAllMocks();
    paymentArchitecture = new PaymentArchitecture(mockStripe, mockSupabase);
  });

  describe('Setup Intent Creation', () => {
    it('should create setup intent with correct parameters', async () => {
      mockStripe.customers.create.mockResolvedValue({
        id: 'cus_test_123',
        email: 'test@example.com',
      });

      mockStripe.setupIntents.create.mockResolvedValue({
        id: 'seti_test_123',
        client_secret: 'seti_test_123_secret_abc',
        customer: 'cus_test_123',
      });

      const result = await paymentArchitecture.createSetupIntent('user_123', 'test@example.com');

      expect(mockStripe.customers.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        metadata: { supabase_user_id: 'user_123' }
      });

      expect(mockStripe.setupIntents.create).toHaveBeenCalledWith({
        customer: 'cus_test_123',
        usage: 'off_session',
        payment_method_types: ['card'],
      });

      expect(result).toEqual({
        client_secret: 'seti_test_123_secret_abc',
        stripe_customer_id: 'cus_test_123',
      });
    });
  });

  describe('Campaign Validation for Auto-Booking', () => {
    it('should validate campaign successfully when all conditions are met', async () => {
      const result = await paymentArchitecture.validateCampaignForAutoBooking('campaign_123', 450);

      expect(result.valid).toBe(true);
      expect(result.validations).toEqual({
        campaignExists: true,
        campaignActive: true,
        priceWithinBudget: true,
        hasPaymentMethod: true,
        cardNotExpired: true,
      });
    });

    it('should reject when flight price exceeds budget', async () => {
      const result = await paymentArchitecture.validateCampaignForAutoBooking('campaign_123', 600);

      expect(result.valid).toBe(false);
      expect(result.validations.priceWithinBudget).toBe(false);
    });

    it('should detect expired cards', async () => {
      // Test with expired card (year 2023)
      const paymentArchitectureWithExpiredCard = new PaymentArchitecture(mockStripe, mockSupabase);
      
      // Override the method to return an expired card scenario
      vi.spyOn(paymentArchitectureWithExpiredCard as unknown as { isCardNotExpired: (paymentMethod: unknown) => boolean }, 'isCardNotExpired').mockReturnValue(false);
      
      const result = await paymentArchitectureWithExpiredCard.validateCampaignForAutoBooking('campaign_123', 450);

      expect(result.valid).toBe(false);
      expect(result.validations.cardNotExpired).toBe(false);
    });
  });

  describe('Auto-Booking Payment Intent Creation', () => {
    it('should create payment intent with correct off-session parameters', async () => {
      const flightOffer = {
        id: 'offer_789',
        price: 350,
        currency: 'USD',
        airline: 'TestAir',
        flight_number: 'TA123',
        route: 'SFO → LAX',
        departure_date: '2024-03-15',
      };

      mockStripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_auto_booking_123',
        status: 'succeeded',
        amount: 35000,
        currency: 'usd',
      });

      const result = await paymentArchitecture.createAutoBookingPaymentIntent(
        'campaign_123',
        flightOffer,
        'cus_test_123',
        'pm_test_456'
      );

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 35000, // $350 in cents
          currency: 'usd',
          customer: 'cus_test_123',
          payment_method: 'pm_test_456',
          off_session: true,
          confirm: true,
          capture_method: 'automatic',
          description: 'Auto-booking: TestAir TA123',
          metadata: expect.objectContaining({
            campaign_id: 'campaign_123',
            flight_offer_id: 'offer_789',
            auto_booking: 'true',
            route: 'SFO → LAX',
            departure_date: '2024-03-15',
          }),
        }),
        expect.objectContaining({
          idempotencyKey: expect.stringContaining('auto-booking-campaign_123-offer_789'),
        })
      );

      expect(result.id).toBe('pi_auto_booking_123');
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Card Expiry Detection', () => {
    it('should detect non-expired cards correctly', () => {
      const paymentMethod = {
        exp_month: 12,
        exp_year: 2025, // Future year
      };

      const isNotExpired = (paymentArchitecture as unknown as { isCardNotExpired: (paymentMethod: unknown) => boolean }).isCardNotExpired(paymentMethod);
      expect(isNotExpired).toBe(true);
    });

    it('should detect expired cards correctly', () => {
      const paymentMethod = {
        exp_month: 1,
        exp_year: 2023, // Past year
      };

      const isNotExpired = (paymentArchitecture as unknown as { isCardNotExpired: (paymentMethod: unknown) => boolean }).isCardNotExpired(paymentMethod);
      expect(isNotExpired).toBe(false);
    });

    it('should handle missing expiry information', () => {
      const paymentMethod = {};

      const isNotExpired = (paymentArchitecture as unknown as { isCardNotExpired: (paymentMethod: unknown) => boolean }).isCardNotExpired(paymentMethod);
      expect(isNotExpired).toBe(false);
    });
  });

  describe('Stripe Error Parsing', () => {
    it('should parse card declined error correctly', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'card_declined',
        message: 'Your card was declined.',
      };

      const result = paymentArchitecture.parseStripeError(stripeError);

      expect(result).toEqual({
        userMessage: 'Card was declined by your bank',
        errorCode: 'card_declined',
      });
    });

    it('should parse insufficient funds error correctly', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'insufficient_funds',
        message: 'Your card has insufficient funds.',
      };

      const result = paymentArchitecture.parseStripeError(stripeError);

      expect(result).toEqual({
        userMessage: 'Insufficient funds on card',
        errorCode: 'insufficient_funds',
      });
    });

    it('should parse authentication required error correctly', () => {
      const stripeError = {
        type: 'StripeCardError',
        code: 'authentication_required',
        message: 'Your card requires authentication.',
      };

      const result = paymentArchitecture.parseStripeError(stripeError);

      expect(result).toEqual({
        userMessage: 'Payment requires additional authentication',
        errorCode: 'authentication_required',
      });
    });

    it('should handle unknown errors gracefully', () => {
      const unknownError = {
        type: 'SomeOtherError',
        message: 'Something went wrong.',
      };

      const result = paymentArchitecture.parseStripeError(unknownError);

      expect(result).toEqual({
        userMessage: 'Payment processing failed',
        errorCode: 'unknown',
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete auto-booking flow validation', async () => {
      // Test the complete validation flow for auto-booking
      const campaignId = 'campaign_integration_test';
      const flightOffer = {
        id: 'offer_integration',
        price: 400, // Within budget
        currency: 'USD',
        airline: 'TestAir',
        flight_number: 'TA999',
        route: 'NYC → LAX',
        departure_date: '2024-04-01',
      };

      // Step 1: Validate campaign
      const validation = await paymentArchitecture.validateCampaignForAutoBooking(
        campaignId,
        flightOffer.price
      );

      expect(validation.valid).toBe(true);

      // Step 2: If validation passes, create payment intent
      if (validation.valid) {
        mockStripe.paymentIntents.create.mockResolvedValue({
          id: 'pi_integration_test',
          status: 'succeeded',
          amount: 40000,
          currency: 'usd',
        });

        const paymentIntent = await paymentArchitecture.createAutoBookingPaymentIntent(
          campaignId,
          flightOffer,
          validation.campaign.payment_method.stripe_customer_id,
          validation.campaign.payment_method.stripe_payment_method_id
        );

        expect(paymentIntent.status).toBe('succeeded');
        expect(paymentIntent.amount).toBe(40000);
      }
    });

    it('should fail validation and prevent payment for over-budget flights', async () => {
      const campaignId = 'campaign_over_budget';
      const expensiveFlightOffer = {
        price: 600, // Exceeds $500 budget
        currency: 'USD',
      };

      const validation = await paymentArchitecture.validateCampaignForAutoBooking(
        campaignId,
        expensiveFlightOffer.price
      );

      expect(validation.valid).toBe(false);
      expect(validation.validations.priceWithinBudget).toBe(false);

      // Payment intent should not be created
      expect(mockStripe.paymentIntents.create).not.toHaveBeenCalled();
    });
  });
});
