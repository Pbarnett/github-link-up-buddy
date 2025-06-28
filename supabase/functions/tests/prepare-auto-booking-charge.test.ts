import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSupabaseMock } from '../../../src/tests/mocks/supabase-mock';

// Mock Stripe
const mockStripeInstance = {
  paymentIntents: {
    create: vi.fn(),
  },
};

vi.mock('../lib/stripe.ts', () => ({
  stripe: mockStripeInstance,
}));

// Use the proven Supabase mock structure
const { supabase: mockSupabaseClient, mocks } = createSupabaseMock();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

describe('prepare-auto-booking-charge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCampaignData = {
    id: 'campaign_123',
    user_id: 'user_456',
    max_price: 500,
    currency: 'USD',
    status: 'active',
    payment_method: {
      stripe_customer_id: 'cus_test123',
      stripe_payment_method_id: 'pm_test456',
      last4: '4242',
      brand: 'visa',
      exp_month: 12,
      exp_year: 2025,
    },
    traveler_profile: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
    },
  };

  const mockFlightOffer = {
    id: 'offer_789',
    price: 450,
    currency: 'USD',
    airline: 'TestAir',
    flight_number: 'TA123',
    departure_date: '2024-02-01',
    return_date: '2024-02-08',
    route: 'LAX → JFK',
  };

  const mockRequest = (body: any) => ({
    method: 'POST',
    json: async () => body,
    headers: new Headers(),
  });

  it('should successfully create PaymentIntent and booking request for valid campaign', async () => {
    // Setup specific responses for each call
    mocks.mockSingle
      .mockResolvedValueOnce({ data: mockCampaignData, error: null }) // Campaign lookup
      .mockResolvedValueOnce({ data: { id: 'booking_req_123' }, error: null }); // Booking request creation

    mockStripeInstance.paymentIntents.create.mockResolvedValue({
      id: 'pi_test123',
      status: 'succeeded',
      amount: 45000,
      currency: 'usd',
    });

    mockSupabaseClient.functions.invoke.mockResolvedValue({ data: null, error: null });

    // Import and test the handler
    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    expect(responseData.payment_intent_id).toBe('pi_test123');
    expect(responseData.booking_request_id).toBe('booking_req_123');

    // Verify Stripe PaymentIntent creation
    expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 45000, // $450 in cents
        currency: 'usd',
        customer: 'cus_test123',
        payment_method: 'pm_test456',
        off_session: true,
        confirm: true,
        metadata: expect.objectContaining({
          campaign_id: 'campaign_123',
          flight_offer_id: 'offer_789',
          auto_booking: 'true',
        }),
      }),
      expect.objectContaining({
        idempotencyKey: expect.stringContaining('auto-booking-campaign_123-offer_789'),
      })
    );

    // Verify booking request creation
    expect(mocks.mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user_456',
        campaign_id: 'campaign_123',
        payment_intent_id: 'pi_test123',
        offer_id: 'offer_789',
        status: 'pending_booking',
      })
    );

    // Verify process-booking invocation
    expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
      'process-booking',
      { body: { bookingRequestId: 'booking_req_123' } }
    );
  });

  it('should reject payment when flight price exceeds campaign budget', async () => {
    const expensiveOffer = { ...mockFlightOffer, price: 600 }; // Exceeds $500 budget

    mocks.mockSingle.mockResolvedValueOnce({ data: mockCampaignData, error: null });

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: expensiveOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('exceeds campaign budget');

    // Verify no payment was attempted
    expect(mockStripeInstance.paymentIntents.create).not.toHaveBeenCalled();
  });

  it('should reject payment when card is expired', async () => {
    const campaignWithExpiredCard = {
      ...mockCampaignData,
      payment_method: {
        ...mockCampaignData.payment_method,
        exp_month: 1,
        exp_year: 2023, // Expired
      },
    };

    mocks.mockSingle.mockResolvedValueOnce({ data: campaignWithExpiredCard, error: null });

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Payment method has expired');

    // Verify no payment was attempted
    expect(mockStripeInstance.paymentIntents.create).not.toHaveBeenCalled();
  });

  it('should handle PaymentIntent requiring 3DS authentication', async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: mockCampaignData, error: null });

    mockStripeInstance.paymentIntents.create.mockResolvedValue({
      id: 'pi_requires_action',
      status: 'requires_action',
      next_action: {
        type: 'use_stripe_sdk',
        use_stripe_sdk: {
          type: 'three_d_secure_redirect',
        },
      },
    });

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.success).toBe(false);
    expect(responseData.requires_action).toBe(true);
    expect(responseData.payment_intent_id).toBe('pi_requires_action');
    expect(responseData.error).toContain('requires additional authentication');

    // Verify no booking request was created
    expect(mocks.mockInsert).not.toHaveBeenCalled();
  });

  it('should handle Stripe card declined error gracefully', async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: mockCampaignData, error: null });

    const stripeError = new Error('Your card was declined.');
    stripeError.type = 'StripeCardError';
    stripeError.code = 'card_declined';
    
    mockStripeInstance.paymentIntents.create.mockRejectedValue(stripeError);

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Card was declined by your bank');
    expect(responseData.stripe_error_code).toBe('card_declined');
    expect(responseData.stripe_error_type).toBe('StripeCardError');
  });

  it('should handle insufficient funds error', async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: mockCampaignData, error: null });

    const stripeError = new Error('Your card has insufficient funds.');
    stripeError.type = 'StripeCardError';
    stripeError.code = 'insufficient_funds';
    
    mockStripeInstance.paymentIntents.create.mockRejectedValue(stripeError);

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Insufficient funds on card');
    expect(responseData.stripe_error_code).toBe('insufficient_funds');
  });

  it('should return 404 for inactive campaign', async () => {
    mocks.mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'No rows returned' } });

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'inactive_campaign',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(404);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Campaign not found or inactive');

    // Verify no payment was attempted
    expect(mockStripeInstance.paymentIntents.create).not.toHaveBeenCalled();
  });

  it('should return 400 for missing required parameters', async () => {
    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      // Missing flight_offer
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Missing required parameters');
  });

  it('should handle campaign without payment method', async () => {
    const campaignWithoutPayment = {
      ...mockCampaignData,
      payment_method: null,
    };

    mocks.mockSingle.mockResolvedValueOnce({ data: campaignWithoutPayment, error: null });

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    const response = await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
    }));

    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('No valid payment method found for campaign');

    // Verify no payment was attempted
    expect(mockStripeInstance.paymentIntents.create).not.toHaveBeenCalled();
  });

  it('should use traveler_data from request when provided', async () => {
    mocks.mockSingle
      .mockResolvedValueOnce({ data: mockCampaignData, error: null })
      .mockResolvedValueOnce({ data: { id: 'booking_req_123' }, error: null });

    mockStripeInstance.paymentIntents.create.mockResolvedValue({
      id: 'pi_test123',
      status: 'succeeded',
    });

    const customTravelerData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+9876543210',
    };

    const { handlePrepareAutoBookingCharge } = await import('../prepare-auto-booking-charge/index.ts');
    
    await handlePrepareAutoBookingCharge(mockRequest({
      campaign_id: 'campaign_123',
      flight_offer: mockFlightOffer,
      traveler_data: customTravelerData,
    }));

    // Verify booking request uses custom traveler data
    expect(mocks.mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        traveler_data: customTravelerData,
      })
    );
  });
});
