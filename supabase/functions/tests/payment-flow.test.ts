// supabase/functions/tests/payment-flow.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, Mocked, SpyInstance } from 'vitest';

// --- Mocking Configuration ---
// We need to mock the actual module and then spy on its exports to change them per test
let mockUseManualCapture = true;
vi.mock('../lib/config.ts', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    get USE_MANUAL_CAPTURE() { return mockUseManualCapture; }, // Use getter to allow dynamic changes
  };
});

// --- Mocking External SDKs and Libraries ---
const mockAmadeusInstance = {
  shopping: { // Added for auto-book related mocks if any function uses it.
    flightOffersSearch: { get: vi.fn() },
    flightOffers: { pricing: { post: vi.fn() } },
    seatMaps: { get: vi.fn() },
  },
  booking: {
    flightOrders: {
      post: vi.fn(), // For auto-book
      cancel: { post: vi.fn() } // For process-booking and auto-book rollbacks
    }
  }
};
const mockBookWithAmadeus = vi.fn();
vi.mock('../lib/amadeus.ts', () => ({
  amadeus: mockAmadeusInstance,
  bookWithAmadeus: mockBookWithAmadeus,
}));

const mockStripeInstance = {
  paymentIntents: { create: vi.fn(), capture: vi.fn(), cancel: vi.fn() },
  checkout: { sessions: { create: vi.fn() } },
};
vi.mock('../lib/stripe.ts', () => ({
  stripe: mockStripeInstance,
}));
// If Stripe class is imported directly: new Stripe(...)
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => mockStripeInstance)
  };
});

const mockSupabaseClientInstance = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  single: vi.fn(), // Changed to vi.fn() to allow different mockResolvedValueOnce per call
  eq: vi.fn().mockReturnThis(),
  functions: { invoke: vi.fn() }
};
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));


// --- Test Suite ---
describe.skip('Payment Flow Integration Tests', () => {
  let createBookingRequestHandler: (req: any) => Promise<Response>;
  let processBookingHandler: (req: any) => Promise<Response>;
  let consoleLogSpy: SpyInstance, consoleErrorSpy: SpyInstance, consoleWarnSpy: SpyInstance;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockUseManualCapture = true; // Default for tests

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Conceptual import of handlers. This assumes that the Deno.serve callback logic
    // is exported or otherwise made available for testing.
    try {
      const createBookingModule = await import('../create-booking-request/index.ts');
      createBookingRequestHandler = (createBookingModule as any).testableHandler ||
        (async (_req:any) => new Response("createBookingRequestHandler not available for test", { status: 501 }));
    } catch (e) {
      createBookingRequestHandler = async (_req:any) => new Response("Failed to import create-booking-request", { status: 501 });
    }
    try {
      const processBookingModule = await import('../process-booking/index.ts');
      processBookingHandler = (processBookingModule as any).testableHandler ||
        (async (_req:any) => new Response("processBookingHandler not available for test", { status: 501 }));
    } catch (e) {
      processBookingHandler = async (_req:any) => new Response("Failed to import process-booking", { status: 501 });
    }
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  const mockRequest = (body: any, headers?: any, method = 'POST') => ({
    method,
    headers: new Headers(headers || { 'origin': 'http://localhost:3000' }),
    json: async () => body,
  });

  describe('create-booking-request/index.ts', () => {
    const mockOffer = {
      id: 'offer_123',
      price: 100,
      currency: 'usd',
      airline: 'TestAir',
      flight_number: 'TA100',
      departure_date: '2024-01-01',
      return_date: '2024-01-05',
      trip_request_id: 'trip_req_abc'
    };
    const mockBookingReq = { id: 'br_456', user_id: 'user_789' };
    const mockUserId = 'user_789';

    it('MANUAL CAPTURE: should create PaymentIntent and return client_secret', async () => {
      mockUseManualCapture = true;
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: mockOffer, error: null }) // fetch offer
        .mockResolvedValueOnce({ data: mockBookingReq, error: null }); // create booking_requests

      const mockPI = { id: 'pi_test_123', client_secret: 'pi_test_123_secret' };
      mockStripeInstance.paymentIntents.create.mockResolvedValue(mockPI);
      (mockSupabaseClientInstance.single as Mocked<any>).mockResolvedValueOnce({ data: {}, error: null }); // update booking_requests with PI

      const response = await createBookingRequestHandler(mockRequest({ userId: mockUserId, offerId: mockOffer.id }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 10000,
          currency: 'usd',
          capture_method: 'manual',
          metadata: expect.objectContaining({ booking_request_id: mockBookingReq.id })
        }),
        expect.objectContaining({ idempotencyKey: `pi_create_${mockBookingReq.id}`})
      );
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({ payment_intent_id: mockPI.id, checkout_session_id: null })
      );
      expect(body.client_secret).toBe(mockPI.client_secret);
      expect(body.payment_intent_id).toBe(mockPI.id);
    });

    it('MANUAL CAPTURE: should cancel PI if DB update fails after PI creation', async () => {
      mockUseManualCapture = true;
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: mockOffer, error: null }) // fetch offer
        .mockResolvedValueOnce({ data: mockBookingReq, error: null }); // create booking_requests

      const mockPI = { id: 'pi_cancel_test', client_secret: 'pi_cancel_test_secret' };
      mockStripeInstance.paymentIntents.create.mockResolvedValue(mockPI);
      // Mock DB update failure
      (mockSupabaseClientInstance.single as Mocked<any>).mockResolvedValueOnce({ data: null, error: new Error('DB update failed') });
      mockStripeInstance.paymentIntents.cancel.mockResolvedValue({ id: mockPI.id }); // PI cancel success

      const response = await createBookingRequestHandler(mockRequest({ userId: mockUserId, offerId: mockOffer.id }));
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toContain('Failed to update booking request with PaymentIntent ID');
      expect(mockStripeInstance.paymentIntents.cancel).toHaveBeenCalledWith(mockPI.id);
    });

    it('CHECKOUT SESSION: should create Checkout Session if USE_MANUAL_CAPTURE is false', async () => {
      mockUseManualCapture = false;
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: mockOffer, error: null })
        .mockResolvedValueOnce({ data: mockBookingReq, error: null });

      const mockSession = { id: 'cs_test_456', url: 'https://checkout.stripe.com/pay/cs_test_456' };
      mockStripeInstance.checkout.sessions.create.mockResolvedValue(mockSession);
      (mockSupabaseClientInstance.single as Mocked<any>).mockResolvedValueOnce({ data: {}, error: null });

      const response = await createBookingRequestHandler(mockRequest({ userId: mockUserId, offerId: mockOffer.id }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalled();
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({ checkout_session_id: mockSession.id, payment_intent_id: null })
      );
      expect(body.url).toBe(mockSession.url);
      expect(body.session_id).toBe(mockSession.id);
    });
  });

  describe('process-booking/index.ts', () => {
    const mockBookingRequestPI = {
      id: 'br_pi_proc',
      payment_intent_id: 'pi_proc_123',
      offer_data: { price: 150, currency: 'eur', trip_request_id: 'tr_abc', id: 'offer_xyz' },
      traveler_data: {},
      user_id: 'user_proc',
      attempts: 0,
    };
    const mockBookingRequestCS = {
      id: 'br_cs_proc',
      checkout_session_id: 'cs_proc_456',
      offer_data: { price: 200, currency: 'gbp', trip_request_id: 'tr_def', id: 'offer_uvw' },
      traveler_data: {},
      user_id: 'user_proc_cs',
      attempts: 0,
    };
    const amadeusSuccessResult = { success: true, bookingReference: 'amadeus_order_1', confirmationNumber: 'PNR_SUCCESS' };
    const newBookingRecord = { id: 'booking_rec_789' };

    it('MANUAL CAPTURE: should capture payment and update statuses on success', async () => {
      mockUseManualCapture = true;
      (mockSupabaseClientInstance.single as Mocked<any>) // fetch booking_request by PI
        .mockResolvedValueOnce({ data: mockBookingRequestPI, error: null });
      mockBookWithAmadeus.mockResolvedValue(amadeusSuccessResult);
      (mockSupabaseClientInstance.single as Mocked<any>) // insert into bookings
        .mockResolvedValueOnce({ data: newBookingRecord, error: null });
      mockStripeInstance.paymentIntents.capture.mockResolvedValue({ status: 'succeeded', id: mockBookingRequestPI.payment_intent_id });
      // Mock DB updates after capture
      (mockSupabaseClientInstance.single as Mocked<any>) // update bookings to ticketed
        .mockResolvedValueOnce({ data: {}, error: null });
      (mockSupabaseClientInstance.single as Mocked<any>) // update booking_requests to done
        .mockResolvedValueOnce({ data: {}, error: null });

      const response = await processBookingHandler(mockRequest({ payment_intent_id: mockBookingRequestPI.payment_intent_id }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.results[0].success).toBe(true);
      expect(mockStripeInstance.paymentIntents.capture).toHaveBeenCalledWith(mockBookingRequestPI.payment_intent_id, expect.any(Object));
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'ticketed' })); // bookings table
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'done' })); // booking_requests table
      expect(mockSupabaseClientInstance.functions.invoke).toHaveBeenCalledWith("send-booking-confirmation", expect.any(Object));
    });

    it('MANUAL CAPTURE: should cancel Amadeus order if Stripe capture fails', async () => {
      mockUseManualCapture = true;
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: mockBookingRequestPI, error: null }); // fetch booking_request
      mockBookWithAmadeus.mockResolvedValue(amadeusSuccessResult); // Amadeus booking succeeds
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: newBookingRecord, error: null }); // insert into bookings
      mockStripeInstance.paymentIntents.capture.mockRejectedValue(new Error('Stripe Capture Failed')); // Stripe fails
      mockAmadeusInstance.booking.flightOrders.cancel.post.mockResolvedValue({ data: {} }); // Amadeus cancel success
      // Mock DB updates for failure path
      (mockSupabaseClientInstance.single as Mocked<any>) // update bookings to canceled_payment_failed
        .mockResolvedValueOnce({ data: {}, error: null });
      (mockSupabaseClientInstance.single as Mocked<any>) // update booking_requests to failed/pending
        .mockResolvedValueOnce({ data: {}, error: null });


      const response = await processBookingHandler(mockRequest({ payment_intent_id: mockBookingRequestPI.payment_intent_id }));
      const body = await response.json();

      expect(response.status).toBe(200); // Main handler returns 200, but result inside indicates failure
      expect(body.results[0].success).toBe(false);
      expect(body.results[0].error).toContain('Stripe Capture Failed');
      expect(mockAmadeusInstance.booking.flightOrders.cancel.post).toHaveBeenCalledWith({ path: { flightOrderId: amadeusSuccessResult.bookingReference }});
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'canceled_payment_failed' })); // bookings
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending_booking' })); // booking_requests (or 'failed' depending on retry logic)
    });

    it('CHECKOUT SESSION: should NOT call Stripe capture and succeed if old flow', async () => {
      mockUseManualCapture = false;
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: mockBookingRequestCS, error: null }); // fetch by CS ID
      mockBookWithAmadeus.mockResolvedValue(amadeusSuccessResult);
      (mockSupabaseClientInstance.single as Mocked<any>)
        .mockResolvedValueOnce({ data: newBookingRecord, error: null }); // insert into bookings
      // Mock DB updates for success (old flow)
      (mockSupabaseClientInstance.single as Mocked<any>) // update bookings to ticketed
        .mockResolvedValueOnce({ data: {}, error: null });
      (mockSupabaseClientInstance.single as Mocked<any>) // update booking_requests to done
        .mockResolvedValueOnce({ data: {}, error: null });

      const response = await processBookingHandler(mockRequest({ sessionId: mockBookingRequestCS.checkout_session_id }));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.results[0].success).toBe(true);
      expect(mockStripeInstance.paymentIntents.capture).not.toHaveBeenCalled();
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'ticketed' })); // bookings
      expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'done' })); // booking_requests
    });
  });
});
