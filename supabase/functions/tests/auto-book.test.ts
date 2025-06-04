// supabase/functions/tests/auto-book.test.ts
import { describe, it, expect, vi, beforeEach, afterEach, MockedFunction } from 'vitest';

// --- Mocking External Dependencies ---

// Mock Amadeus SDK
const mockAmadeusInstance = {
  shopping: {
    flightOffersSearch: { get: vi.fn() },
    flightOffers: { pricing: { post: vi.fn() } },
    seatMaps: { get: vi.fn() },
  },
  booking: {
    flightOrders: {
      post: vi.fn(),
      // Assuming 'cancel' is an object with a 'post' method based on user's spec
      cancel: { post: vi.fn() }
    },
    // If cancellation is flightOrder(id).delete() for the SDK:
    // flightOrder: vi.fn().mockReturnThis(), // flightOrder(id)
    // delete: vi.fn() // .delete()
  },
  // If cancellation is a direct post to a path (less common for SDK object):
  // post: vi.fn(), // For generic post like amadeus.post('/v1/booking/flight-orders/ORDER_ID/cancel')
};
vi.mock('../lib/amadeus.ts', () => ({
  default: mockAmadeusInstance, // Assuming amadeus.ts exports default
  amadeus: mockAmadeusInstance, // Also mock named export if used
}));

// Mock Stripe SDK
const mockStripeInstance = {
  paymentIntents: { capture: vi.fn() },
};
vi.mock('../lib/stripe.ts', () => ({
  stripe: mockStripeInstance,
}));

// Mock selectSeat
const mockSelectSeat = vi.fn();
vi.mock('../lib/seatSelector.ts', () => ({
  selectSeat: mockSelectSeat,
}));

// Mock Supabase Client
const mockSupabaseClientInstance = {
  from: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(), // Keep .single() separate to allow different mockResolvedValueOnce
  eq: vi.fn().mockReturnThis(),
};
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClientInstance),
}));

// --- Dynamically Importing the Handler ---
// This is the tricky part. For robust testing, auto-book/index.ts should export its core logic.
// Here, we'll assume that after mocks are set up, we can import and access the handler.
let autoBookHandler: (req: any) => Promise<Response>;

describe('auto-book Integration Tests', () => {
  let consoleLogSpy: MockedFunction<any>;
  let consoleErrorSpy: MockedFunction<any>;
  let consoleWarnSpy: MockedFunction<any>;

  beforeEach(async () => {
    vi.clearAllMocks(); // Reset all mocks

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Attempt to import the handler logic from the Deno server file
    // This assumes auto-book/index.ts is structured in a way that Deno.serve's callback can be accessed or tested.
    // A common pattern is to have the core logic in a separate function, imported by index.ts.
    // If Deno.serve is top-level, this dynamic import might grab the module but invoking Deno.serve directly is hard.
    // We'll proceed as if `handler` can be extracted or the entire `Deno.serve` is somehow testable.
    const autoBookModule = await import('../auto-book/index.ts');
    // This line is highly dependent on how auto-book/index.ts is structured.
    // If it directly calls Deno.serve, we can't easily get the handler without a testing library for Deno.
    // For now, let's assume a hypothetical export or a way to simulate a request.
    // This is a conceptual placeholder for "the function that Deno.serve would call".
    if (typeof (autoBookModule as any).testableHandler === 'function') {
        autoBookHandler = (autoBookModule as any).testableHandler;
    } else {
        // Fallback: if no testableHandler, we can't directly test Deno.serve's callback here easily.
        // Tests would need to be more abstract or use a Deno-specific test runner.
        // For this exercise, we'll assume autoBookHandler is callable.
        autoBookHandler = async (_req) => new Response("Handler not available for test", { status: 501 });
        console.warn("Test setup: Could not get testableHandler from auto-book/index.ts. Tests may not run correctly.");
    }
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  const createMockRequest = (tripData: any, method = 'POST') => ({
    method,
    json: async () => ({ trip: tripData }),
    // Add other request properties if your Deno.serve handler uses them (e.g., headers)
  });

  // --- Test Case 1: Successful Flow with Seat Selection ---
  it('should successfully book a flight with seat selection and update database', async () => {
    const mockTrip = {
      id: 'tripSuccess123', user_id: 'user1', payment_intent_id: 'pi_success',
      origin_location_code: 'LHR', destination_location_code: 'JFK',
      departure_date: '2024-12-01', return_date: '2024-12-10', adults: 1, nonstop_required: false,
      max_price: 600, allow_middle_seat: true,
      traveler_data: { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', gender: 'MALE', email: 'john.doe@example.com', phone: '1234567890', passportNumber: 'PX12345' }
    };
    const mockRequest = createMockRequest(mockTrip);

    // Mock Lock Acquisition
    (mockSupabaseClientInstance.single as MockedFunction<any>).mockResolvedValueOnce({ data: { id: 'attemptLock1' }, error: null }); // booking_attempts.insert

    // Mock Amadeus
    const pricedOfferData = { id: 'offer001', price: { total: '500.00', grandTotal: '500.00' }, flightOffers: [{ price: {total: '500.00', grandTotal: '500.00'}}], itineraries: [{ segments: [{ id: 'seg001' }] }] };
    mockAmadeusInstance.shopping.flightOffersSearch.get.mockResolvedValue({ data: [pricedOfferData] });
    mockAmadeusInstance.shopping.flightOffers.pricing.post.mockResolvedValue({ data: pricedOfferData });
    const seatMapData = { data: [{ flightSegments: [{ decks: [{ rows: [{ seats: [{ seatNumber: '1A', features: ['AISLE'], pricing: {total: '20.00'}, available: true }] }] }] }] }] };
    mockAmadeusInstance.shopping.seatMaps.get.mockResolvedValue(seatMapData);
    const bookingConfirmation = { data: { id: 'orderXYZ1', flightOrderId: 'orderXYZ1', associatedRecords: [{reference: 'PNR123'}], flightOffers: [pricedOfferData] }};
    mockAmadeusInstance.booking.flightOrders.post.mockResolvedValue(bookingConfirmation);

    // Mock selectSeat
    const chosenSeatData = { seatNumber: '1A', seatType: 'AISLE' as const, price: 20 };
    mockSelectSeat.mockReturnValue(chosenSeatData);

    // Mock Stripe
    mockStripeInstance.paymentIntents.capture.mockResolvedValue({ status: 'succeeded', id: 'pi_success' });

    // Mock DB Updates (bookings, trip_requests, booking_attempts)
    (mockSupabaseClientInstance.single as MockedFunction<any>)
        .mockResolvedValueOnce({ data: { id: 'bookingRec1' }, error: null }) // bookings.update
        .mockResolvedValueOnce({ data: { id: 'tripSuccess123' }, error: null }) // trip_requests.update
        .mockResolvedValueOnce({ data: { id: 'attemptLock1' }, error: null }); // booking_attempts.update (finally)

    const response = await autoBookHandler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.flightOrderId).toBe('orderXYZ1');
    expect(mockSelectSeat).toHaveBeenCalledWith(seatMapData.data[0], 500, 600, true);

    const amadeusBookingCall = mockAmadeusInstance.booking.flightOrders.post.mock.calls[0][0];
    expect(JSON.parse(amadeusBookingCall).data.travelers[0].seatSelections).toEqual([{ segmentId: 'seg001', seatNumber: '1A' }]);

    expect(mockSupabaseClientInstance.from).toHaveBeenCalledWith('bookings');
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'booked', selected_seat_number: '1A', amadeus_order_id: 'orderXYZ1' }));
    expect(mockSupabaseClientInstance.from).toHaveBeenCalledWith('trip_requests');
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ auto_book: false, status: 'booked' }));
    expect(mockSupabaseClientInstance.from).toHaveBeenCalledWith('booking_attempts');
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'completed', flight_order_id: 'orderXYZ1' }));
  });

  // --- Test Case 2: Stripe Payment Fails ---
  it('should attempt Amadeus cancellation and update statuses if Stripe payment fails', async () => {
    const mockTrip = { id: 'tripStripeFail', payment_intent_id: 'pi_stripe_fail', traveler_data: {}, user_id: 'user2' };
    const mockRequest = createMockRequest(mockTrip);
    (mockSupabaseClientInstance.single as MockedFunction<any>).mockResolvedValueOnce({ data: { id: 'attemptLock2' }, error: null }); // Lock

    const pricedOfferData = { id: 'offer002', price: { total: '300.00', grandTotal: '300.00' }, flightOffers: [{price: {total: '300.00', grandTotal: '300.00'}}] };
    mockAmadeusInstance.shopping.flightOffersSearch.get.mockResolvedValue({ data: [pricedOfferData] });
    mockAmadeusInstance.shopping.flightOffers.pricing.post.mockResolvedValue({ data: pricedOfferData });
    mockAmadeusInstance.shopping.seatMaps.get.mockResolvedValue({ data: [] }); // No seats
    const bookingConfirmation = { data: { id: 'orderStripeFail', flightOrderId: 'orderStripeFail', flightOffers: [pricedOfferData] }};
    mockAmadeusInstance.booking.flightOrders.post.mockResolvedValue(bookingConfirmation); // Amadeus booking succeeds

    mockStripeInstance.paymentIntents.capture.mockRejectedValue(new Error('Stripe Payment Failed')); // Stripe fails
    mockAmadeusInstance.booking.flightOrders.cancel.post.mockResolvedValue({ data: {} }); // Amadeus cancel mock

    (mockSupabaseClientInstance.single as MockedFunction<any>)
        .mockResolvedValueOnce({ data: { id: 'tripStripeFail' }, error: null }) // trip_requests.update (to failed)
        .mockResolvedValueOnce({ data: { id: 'attemptLock2' }, error: null }); // booking_attempts.update (to failed in finally)

    const response = await autoBookHandler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.success).toBe(false);
    expect(responseBody.error).toContain('Stripe Payment Failed');
    expect(mockAmadeusInstance.booking.flightOrders.cancel.post).toHaveBeenCalledWith({ path: { flightOrderId: 'orderStripeFail' } });
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed', auto_book_error: expect.stringContaining('Stripe Payment Failed') })); // trip_requests
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed', error_message: expect.stringContaining('Stripe Payment Failed') })); // booking_attempts
  });

  // --- Test Case 3: Amadeus Seat Map Fails (Graceful fallback) ---
  it('should proceed with booking if seat map fails, without seat selection', async () => {
    const mockTrip = { id: 'tripSeatFail', max_price: 400, payment_intent_id: 'pi_seat_fail', traveler_data: {firstName: 'Seat', lastName: 'Fail'}, user_id: 'user3' };
    const mockRequest = createMockRequest(mockTrip);
    (mockSupabaseClientInstance.single as MockedFunction<any>).mockResolvedValueOnce({ data: { id: 'attemptLock3' }, error: null }); // Lock

    const pricedOfferData = { id: 'offer003', price: { total: '350.00', grandTotal: '350.00' }, flightOffers: [{price: {total: '350.00', grandTotal: '350.00'}}] };
    mockAmadeusInstance.shopping.flightOffersSearch.get.mockResolvedValue({ data: [pricedOfferData] });
    mockAmadeusInstance.shopping.flightOffers.pricing.post.mockResolvedValue({ data: pricedOfferData });
    mockAmadeusInstance.shopping.seatMaps.get.mockRejectedValue(new Error('Seat map unavailable')); // Seat map fails

    const bookingConfirmation = { data: { id: 'orderSeatFail', flightOrderId: 'orderSeatFail', flightOffers: [pricedOfferData] }};
    mockAmadeusInstance.booking.flightOrders.post.mockResolvedValue(bookingConfirmation);
    mockSelectSeat.mockReturnValue(null); // selectSeat will return null if map fails or no seat found
    mockStripeInstance.paymentIntents.capture.mockResolvedValue({ status: 'succeeded', id: 'pi_seat_fail' });

    (mockSupabaseClientInstance.single as MockedFunction<any>)
        .mockResolvedValueOnce({ data: {}, error: null }) // bookings.update
        .mockResolvedValueOnce({ data: {}, error: null }) // trip_requests.update
        .mockResolvedValueOnce({ data: {}, error: null }); // booking_attempts.update

    const response = await autoBookHandler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.flightOrderId).toBe('orderSeatFail');
    const amadeusBookingCall = mockAmadeusInstance.booking.flightOrders.post.mock.calls[0][0];
    expect(JSON.parse(amadeusBookingCall).data.travelers[0].seatSelections).toEqual([]); // No seat selection
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'booked', selected_seat_number: null })); // bookings
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'completed', flight_order_id: 'orderSeatFail' })); // booking_attempts
  });

  // --- Test Case 4: DB Update Fails (after successful payment) ---
  it('should return error if DB update fails after payment, without Amadeus rollback', async () => {
    const mockTrip = { id: 'tripDbFail', payment_intent_id: 'pi_db_fail', traveler_data: {}, user_id: 'user4' };
    const mockRequest = createMockRequest(mockTrip);
    (mockSupabaseClientInstance.single as MockedFunction<any>).mockResolvedValueOnce({ data: { id: 'attemptLock4' }, error: null }); // Lock

    const pricedOfferData = { id: 'offer004', price: { total: '200.00', grandTotal: '200.00' }, flightOffers: [{price: {total: '200.00', grandTotal: '200.00'}}] };
    mockAmadeusInstance.shopping.flightOffersSearch.get.mockResolvedValue({ data: [pricedOfferData] });
    mockAmadeusInstance.shopping.flightOffers.pricing.post.mockResolvedValue({ data: pricedOfferData });
    mockAmadeusInstance.shopping.seatMaps.get.mockResolvedValue({ data: [] });
    const bookingConfirmation = { data: { id: 'orderDbFail', flightOrderId: 'orderDbFail', flightOffers: [pricedOfferData] }};
    mockAmadeusInstance.booking.flightOrders.post.mockResolvedValue(bookingConfirmation);
    mockStripeInstance.paymentIntents.capture.mockResolvedValue({ status: 'succeeded', id: 'pi_db_fail' }); // Stripe succeeds

    // Mock DB update failure (e.g., bookings update fails)
    (mockSupabaseClientInstance.single as MockedFunction<any>)
        .mockResolvedValueOnce({ data: null, error: new Error('DB Bookings Update Failed') }); // bookings.update fails
        // trip_requests update might not be reached or also fail
    (mockSupabaseClientInstance.single as MockedFunction<any>)
        .mockResolvedValueOnce({ data: { id: 'attemptLock4' }, error: null }); // booking_attempts.update (finally)

    const response = await autoBookHandler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.success).toBe(false);
    expect(responseBody.error).toContain('DB Bookings Update Failed');
    expect(mockAmadeusInstance.booking.flightOrders.cancel.post).not.toHaveBeenCalled(); // CRITICAL: No Amadeus rollback if payment succeeded
    expect(mockSupabaseClientInstance.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'failed', error_message: expect.stringContaining('DB Bookings Update Failed') })); // booking_attempts
  });

  // --- Test Case 5: Locking Scenario - Idempotency ---
  it('should return 200 if lock acquisition fails with unique constraint (idempotency)', async () => {
    const mockTrip = { id: 'tripLockFail', user_id: 'user5' };
    const mockRequest = createMockRequest(mockTrip);

    // Mock Lock Acquisition Failure (unique violation)
    (mockSupabaseClientInstance.single as MockedFunction<any>).mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'Unique constraint violation' } });

    const response = await autoBookHandler(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toContain('Trip processing already in progress or completed.');
    expect(mockAmadeusInstance.shopping.flightOffersSearch.get).not.toHaveBeenCalled(); // Core logic should not run
  });
});
