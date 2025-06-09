// supabase/functions/tests/cancel-booking.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, MockedFunction, SpyInstance } from 'vitest';

// --- Mock Deno.env.get ---
const originalDeno = globalThis.Deno;
const mockEnvGet = vi.fn();
vi.stubGlobal('Deno', {
  ...originalDeno,
  env: { get: mockEnvGet },
});

// --- Mock Supabase Client ---
const mockSupabaseSingle = vi.fn();
const mockSupabaseUpdateResult = vi.fn(); // To control outcome of .update().eq()
const mockSupabaseUpdateEq = vi.fn(() => mockSupabaseUpdateResult);
const mockSupabaseFromChainedMethods = {
  select: vi.fn().mockReturnThis(),
  update: vi.fn(() => ({ eq: mockSupabaseUpdateEq })),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: mockSupabaseSingle,
};
const mockSupabaseAuthGetUser = vi.fn();
const mockSupabaseClientInstance = {
  from: vi.fn((_tableName: string) => mockSupabaseFromChainedMethods),
  auth: { getUser: mockSupabaseAuthGetUser },
};
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));

// --- Mock Amadeus Helpers ---
const mockGetAmadeusAccessToken = vi.fn();
const mockCancelAmadeusOrder = vi.fn();
vi.mock('../lib/amadeus.ts', () => ({
  getAmadeusAccessToken: mockGetAmadeusAccessToken,
  cancelAmadeusOrder: mockCancelAmadeusOrder,
}));

// --- Mock Stripe SDK ---
const mockStripeRefundsCreate = vi.fn();
vi.mock('../lib/stripe.ts', () => ({ // Assuming stripe.ts exports the initialized client as 'stripe'
  stripe: { refunds: { create: mockStripeRefundsCreate } },
}));

// --- Mock global fetch for send-notification ---
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// --- Test Suite ---
describe('cancel-booking Edge Function', () => {
  let cancelBookingHandler: (req: Request) => Promise<Response>;
  let consoleErrorSpy: SpyInstance, consoleLogSpy: SpyInstance, consoleWarnSpy: SpyInstance;

  const mockBookingId = 'booking_id_cancel_123';
  const mockUserId = 'user_auth_abc';
  const mockAmadeusOrderId = 'AMADEUS_ORDER_ID_XYZ'; // Assuming this is stored in booking.pnr or booking.amadeus_order_id
  const mockTripRequestId = 'trip_req_cancel_789';
  const mockStripePiId = 'pi_stripe_mock_cancel';

  const mockEligibleBooking = {
    id: mockBookingId,
    pnr: 'PNR_FALLBACK', // Fallback if amadeus_order_id is not present
    amadeus_order_id: mockAmadeusOrderId, // Preferred field for Amadeus Order ID
    user_id: mockUserId,
    status: 'ticketed',
    created_at: new Date().toISOString(), // Assumes current time is within 24h
    trip_request_id: mockTripRequestId,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockEnvGet.mockImplementation((key: string) => {
      if (key === 'SUPABASE_URL') return 'http://mock-supabase.url';
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'mock-service-role-key';
      return undefined;
    });

    mockSupabaseAuthGetUser.mockResolvedValue({ data: { user: { id: mockUserId } }, error: null });
    mockSupabaseSingle.mockImplementation((_chainedCall?: any) => {
        const lastFromCall = mockSupabaseClientInstance.from.mock.calls.slice(-1)[0]?.[0];
        if (lastFromCall === 'bookings') return Promise.resolve({ data: mockEligibleBooking, error: null });
        if (lastFromCall === 'payments') return Promise.resolve({ data: { stripe_payment_intent_id: mockStripePiId }, error: null });
        return Promise.resolve({ data: null, error: new Error('Supabase mock: Unhandled "from" table in .single()')});
    });
    mockSupabaseUpdateResult.mockResolvedValue({ error: null }); // Default successful DB update

    mockGetAmadeusAccessToken.mockResolvedValue('mock-amadeus-access-token');
    mockCancelAmadeusOrder.mockResolvedValue({ success: true });
    mockStripeRefundsCreate.mockResolvedValue({ id: 're_stripe_mock_refund', status: 'succeeded' });
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const module = await import('../cancel-booking/index.ts');
    cancelBookingHandler = (module as any).testableHandler ||
        (module as any).default?.handler ||
        (async (_req: Request) => new Response("Handler not found in module", { status: 501 }));
    if (cancelBookingHandler.toString().includes("Handler not found in module")) {
        console.warn("Test setup: Could not get testableHandler from cancel-booking/index.ts.");
    }
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  const createMockCancelRequest = (body: any, token = 'mock-jwt') =>
    new Request('http://localhost/cancel-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    });

  it('1. Successfully cancels a booking and issues refund', async () => {
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toContain('Booking canceled and refund initiated successfully.');
    expect(mockGetAmadeusAccessToken).toHaveBeenCalled();
    expect(mockCancelAmadeusOrder).toHaveBeenCalledWith(mockAmadeusOrderId, 'mock-amadeus-access-token');
    expect(mockStripeRefundsCreate).toHaveBeenCalledWith({ payment_intent: mockStripePiId, reason: 'requested_by_customer' });
    expect(mockSupabaseUpdateEq).toHaveBeenCalledTimes(2); // bookings and payments
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/send-notification'), expect.objectContaining({
        body: expect.stringContaining('"type":"booking_canceled"')
    }));
  });

  it('2a. Returns 400 if booking status is not "ticketed" or "booked"', async () => {
    mockSupabaseSingle.mockResolvedValueOnce({ data: { ...mockEligibleBooking, status: 'pending_payment' }, error: null });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(expect.objectContaining({ error: expect.stringContaining("not in a cancelable state") }));
  });

  it('2b. Returns 400 if booking is older than 24 hours', async () => {
    const oldDate = new Date(Date.now() - (25 * 60 * 60 * 1000)).toISOString();
    mockSupabaseSingle.mockResolvedValueOnce({ data: { ...mockEligibleBooking, created_at: oldDate }, error: null });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Cancellation window has passed' }));
  });

  it('3. Returns 403 for authorization failure (user_id mismatch)', async () => {
    mockSupabaseSingle.mockResolvedValueOnce({ data: { ...mockEligibleBooking, user_id: 'another-user-id' }, error: null });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Unauthorized to cancel this booking' }));
  });

  it('4. Returns 404 if booking not found', async () => {
    mockSupabaseSingle.mockResolvedValueOnce({ data: null, error: null }); // No booking found
    const request = createMockCancelRequest({ booking_id: 'non_existent_booking' });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Booking not found' }));
  });

  it('5. Returns 500 if getAmadeusAccessToken fails', async () => {
    mockGetAmadeusAccessToken.mockResolvedValueOnce(null);
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Failed to get Amadeus access token' }));
  });

  it('6. Returns 500 if Amadeus cancelAmadeusOrder fails', async () => {
    mockCancelAmadeusOrder.mockResolvedValueOnce({ success: false, error: 'Amadeus system down' });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Amadeus cancellation failed: Amadeus system down' }));
  });

  it('7. Returns 500 if Stripe PaymentIntent ID not found', async () => {
    mockSupabaseSingle.mockImplementation((_chainedCall?: any) => { // Override for this test
        const lastFromCall = mockSupabaseClientInstance.from.mock.calls.slice(-1)[0]?.[0];
        if (lastFromCall === 'bookings') return Promise.resolve({ data: mockEligibleBooking, error: null });
        if (lastFromCall === 'payments') return Promise.resolve({ data: null, error: null }); // PI not found
        return Promise.resolve({ data: null, error: new Error('Supabase mock: Unhandled "from" table in .single()')});
    });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual(expect.objectContaining({ error: expect.stringContaining('Stripe PaymentIntent ID not found') }));
  });

  it('8. Returns 500 if Stripe refunds.create fails', async () => {
    mockStripeRefundsCreate.mockRejectedValueOnce(new Error('Stripe refund error'));
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Stripe refund error' }));
  });

  it('9. Returns 500 if bookings table update fails', async () => {
    mockSupabaseUpdateResult.mockResolvedValueOnce({ error: new Error('Bookings DB update failed') }); // First update is bookings
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Failed to update booking status: Bookings DB update failed' }));
  });

  it('10. Returns 400 if booking_id is missing in request', async () => {
    const request = createMockCancelRequest({}); // Empty body
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Missing or invalid booking_id' }));
  });

  it('11. Returns 401 for authentication failure', async () => {
    mockSupabaseAuthGetUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Invalid token' } });
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    const response = await cancelBookingHandler(request);
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual(expect.objectContaining({ error: 'Authentication failed or user not found' }));
  });

  it('12. send-notification is called on successful cancellation', async () => {
    // This is covered by test case 1, but can be a specific check too
    const request = createMockCancelRequest({ booking_id: mockBookingId });
    await cancelBookingHandler(request);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://mock-supabase.url/functions/v1/send-notification',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining(`"type":"booking_canceled"`),
      })
    );
  });
});
