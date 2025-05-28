import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { serve } from '../scheduler-flight-search/index.ts'; // Adjust path as necessary

// Define simple Offer and TripRequest interfaces for mock data
interface MockOffer {
  id: string;
  price: number;
  flight_number?: string;
  airline?: string;
  departure_time?: string;
  arrival_time?: string;
  departure_date?: string;
  return_date?: string | null;
  duration?: string;
}

interface MockTripRequest {
  id: number;
  user_id: string;
  best_price: number | null;
  budget: number | null;
  auto_book: boolean;
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date: string | null;
  adults: number;
}

// Mock Supabase client parts
const mockSupabaseRpc = vi.fn();
const mockSupabaseFrom = vi.fn();
const mockSupabaseInsert = vi.fn();
const mockSupabaseSelect = vi.fn();
const mockSupabaseUpdate = vi.fn();
const mockSupabaseEq = vi.fn();
const mockSupabaseLimit = vi.fn();
const mockSupabaseSingle = vi.fn();
const mockFunctionsInvoke = vi.fn();

// Mock the Supabase client factory
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
    rpc: mockSupabaseRpc,
    functions: { invoke: mockFunctionsInvoke },
  })),
}));

// Mock environment variables
vi.stubEnv('SUPABASE_URL', 'http://localhost:54321');
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key');


describe('Scheduler Flight Search - Auto-Booking Logic', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Default mock implementations for chained calls
    // Ensure that methods like select, insert, update, eq, single, limit return 'this' or a promise
    mockSupabaseFrom.mockImplementation(() => ({
      select: mockSupabaseSelect.mockReturnThis(),
      insert: mockSupabaseInsert.mockReturnThis(),
      update: mockSupabaseUpdate.mockReturnThis(),
      eq: mockSupabaseEq.mockReturnThis(),
      limit: mockSupabaseLimit.mockReturnThis(),
      single: mockSupabaseSingle.mockReturnThis(),
    }));
    
    // Default resolutions for promise-returning methods to prevent hanging
    mockSupabaseSelect.mockResolvedValue({ data: [], error: null });
    mockSupabaseInsert.mockResolvedValue({ data: [{id: 'new-mock-id'}], error: null }); // Default for insert().select().single()
    mockSupabaseUpdate.mockResolvedValue({ data: [], error: null });
    mockSupabaseEq.mockResolvedValue({ data: [], error: null }); // Default for .eq() returning data
    mockSupabaseLimit.mockResolvedValue({ data: [], error: null });
    mockSupabaseSingle.mockResolvedValue({ data: null, error: null }); // Default for .single()
    mockFunctionsInvoke.mockResolvedValue({ data: { offers: [] }, error: null });
    mockSupabaseRpc.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockRequest = (method = 'POST', body = {}) =>
    new Request('http://localhost/scheduler-flight-search', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body) : undefined,
    });

  it('1. Successful Auto-Booking: offer within budget', async () => {
    const tripId = 1;
    const userId = 'user-123';
    const mockTripRequest: MockTripRequest = {
      id: tripId,
      user_id: userId,
      best_price: 550,
      budget: 500,
      auto_book: true,
      origin_location_code: 'LHR',
      destination_location_code: 'JFK',
      departure_date: '2024-12-01',
      return_date: '2024-12-10',
      adults: 1,
    };
    const mockOffer: MockOffer = {
      id: 'offer-001',
      price: 450, // Within budget
      airline: 'TestAir',
      flight_number: 'TA123',
    };
    const bookingRequestId = 'br-001';

    // Mock fetching trip requests
    mockSupabaseFrom.mockImplementation((tableName) => {
        if (tableName === 'trip_requests') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockResolvedValueOnce({ data: [mockTripRequest], error: null }) // For fetching trip request
            };
        }
        if (tableName === 'bookings') { // For checking existing bookings
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn((col, val) => { // Simulate two .eq() calls
                    if (col === 'trip_request_id' && val === tripId) return { eq: vi.fn().mockReturnThis() };
                    if (col === 'status' && val === 'booked') return { eq: vi.fn().mockReturnThis() }; // This was missing, now it's explicit.
                    return { eq: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValueOnce({ data: [], error: null }) };
                }).mockReturnThis(), // Ensure the first eq returns this
                limit: vi.fn().mockResolvedValueOnce({ data: [], error: null }) 
            };
        }
        if (tableName === 'booking_requests') { // For insert and update
             return {
                insert: mockSupabaseInsert.mockImplementation(() => ({
                    select: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValueOnce({ data: { id: bookingRequestId }, error: null })
                })),
                update: mockSupabaseUpdate.mockReturnThis(),
                eq: mockSupabaseEq.mockReturnThis(), // For update
            };
        }
        return { select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), single: vi.fn().mockReturnThis() };
    });


    // Mock flight-search invocation
    mockFunctionsInvoke.mockResolvedValueOnce({ data: { offers: [mockOffer] }, error: null });
    // Mock RPC call
    mockSupabaseRpc.mockResolvedValueOnce({ error: null }); // Simulate successful RPC

    const response = await serve(mockRequest());
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.autoBookingsCreated).toBe(1);

    // Verify booking_requests insert
    expect(mockSupabaseInsert).toHaveBeenCalledWith(expect.objectContaining({
      user_id: userId,
      offer_id: mockOffer.id,
      offer_data: mockOffer,
      trip_request_id: tripId,
      auto: true,
      status: 'processing',
    }));
    
    // Verify RPC call
    expect(mockSupabaseRpc).toHaveBeenCalledWith('rpc_auto_book_match', { p_booking_request_id: bookingRequestId });

    // Verify trip_requests update (best_price)
    let updatedTripRequest = false;
    for (const call of mockSupabaseFrom.mock.calls) {
        if (call[0] === 'trip_requests') {
            const updateCall = mockSupabaseUpdate.mock.calls.find(c => c[0].best_price === mockOffer.price);
            if (updateCall) {
                expect(mockSupabaseEq).toHaveBeenCalledWith("id", tripId); // Check specific ID for update
                updatedTripRequest = true;
                break;
            }
        }
    }
    expect(updatedTripRequest).toBe(true);


    // Verify notifications was NOT called for price_drop (since it was auto-booked)
    let notificationInsertCalled = false;
    for (const call of mockSupabaseFrom.mock.calls) {
        if (call[0] === 'notifications') {
             if (mockSupabaseInsert.mock.calls.some(c => c[0].type === 'price_drop')) {
                notificationInsertCalled = true;
                break;
            }
        }
    }
    expect(notificationInsertCalled).toBe(false);
  });

  it('2. No Suitable Offer Found: all offers over budget', async () => {
    const tripId = 2;
    const mockTripRequest: MockTripRequest = {
      id: tripId,
      user_id: 'user-456',
      best_price: null,
      budget: 300,
      auto_book: true,
      origin_location_code: 'CDG',
      destination_location_code: 'LAX',
      departure_date: '2024-11-15',
      return_date: '2024-11-25',
      adults: 1,
    };
    const mockOfferExpensive: MockOffer = { id: 'offer-002', price: 350 }; // Over budget

    mockSupabaseFrom.mockImplementation((tableName) => {
        if (tableName === 'trip_requests') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockResolvedValueOnce({ data: [mockTripRequest], error: null })
            };
        }
        if (tableName === 'bookings') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockReturnThis(), // chained eq
                limit: vi.fn().mockResolvedValueOnce({ data: [], error: null }) 
            };
        }
         return { select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), single: vi.fn().mockReturnThis() };
    });
    
    mockFunctionsInvoke.mockResolvedValueOnce({ data: { offers: [mockOfferExpensive] }, error: null });

    const response = await serve(mockRequest());
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.autoBookingsCreated).toBe(0);
    expect(mockSupabaseInsert).not.toHaveBeenCalled(); // No booking_requests insert
    expect(mockSupabaseRpc).not.toHaveBeenCalled();
    expect(mockSupabaseUpdate).not.toHaveBeenCalled(); // No trip_requests update
  });

  it('3. Trip Already Booked: safeguard test', async () => {
    const tripId = 3;
    const mockTripRequest: MockTripRequest = {
      id: tripId,
      user_id: 'user-789',
      auto_book: true,
      // ... other fields
    } as MockTripRequest; // Cast to avoid filling all fields for this test

    mockSupabaseFrom.mockImplementation((tableName) => {
        if (tableName === 'trip_requests') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockResolvedValueOnce({ data: [mockTripRequest], error: null })
            };
        }
        if (tableName === 'bookings') { // Simulate existing booking
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn((col, val) => { 
                    if (col === 'trip_request_id' && val === tripId) return { eq: vi.fn().mockReturnThis() };
                    if (col === 'status' && val === 'booked') return { eq: vi.fn().mockReturnThis() };
                    return { eq: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValueOnce({ data: [{ id: 'existing-booking-001' }], error: null }) };
                }).mockReturnThis(),
                limit: vi.fn().mockResolvedValueOnce({ data: [{ id: 'existing-booking-001' }], error: null }) 
            };
        }
        return { select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), single: vi.fn().mockReturnThis() };
    });

    const response = await serve(mockRequest());
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.autoBookingsCreated).toBe(0);
    expect(mockFunctionsInvoke).not.toHaveBeenCalled(); // flight-search not called
    expect(mockSupabaseInsert).not.toHaveBeenCalled();
    expect(mockSupabaseRpc).not.toHaveBeenCalled();
  });


  it('4. RPC Call Failure Simulation', async () => {
    const tripId = 4;
    const userId = 'user-rpc-fail';
    const mockTripRequest: MockTripRequest = {
      id: tripId, user_id: userId, best_price: null, budget: 200, auto_book: true,
      origin_location_code: 'SFO', destination_location_code: 'LAX', departure_date: '2024-10-01', return_date: null, adults: 1,
    };
    const mockOffer: MockOffer = { id: 'offer-004', price: 180 }; // Suitable offer
    const bookingRequestId = 'br-rpc-fail';
    const rpcErrorMessage = 'RPC failed deliberately';

    mockSupabaseFrom.mockImplementation((tableName) => {
        if (tableName === 'trip_requests') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockResolvedValueOnce({ data: [mockTripRequest], error: null }) 
            };
        }
        if (tableName === 'bookings') { 
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValueOnce({ data: [], error: null }) 
            };
        }
        if (tableName === 'booking_requests') { 
             return {
                insert: mockSupabaseInsert.mockImplementation(() => ({
                    select: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValueOnce({ data: { id: bookingRequestId }, error: null })
                })),
                update: mockSupabaseUpdate.mockReturnThis(), // For the 'failed' status update
                eq: mockSupabaseEq.mockReturnThis(), 
            };
        }
       return { select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), single: vi.fn().mockReturnThis() };
    });

    mockFunctionsInvoke.mockResolvedValueOnce({ data: { offers: [mockOffer] }, error: null });
    mockSupabaseRpc.mockResolvedValueOnce({ error: { message: rpcErrorMessage } }); // Simulate RPC failure

    const response = await serve(mockRequest());
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.autoBookingsCreated).toBe(0);

    // Verify booking_requests insert (initial 'processing' status)
    expect(mockSupabaseInsert).toHaveBeenCalledWith(expect.objectContaining({ status: 'processing', trip_request_id: tripId }));
    expect(mockSupabaseRpc).toHaveBeenCalledWith('rpc_auto_book_match', { p_booking_request_id: bookingRequestId });

    // Verify booking_requests update to 'failed'
    let updatedBookingRequestToFailed = false;
    for (const call of mockSupabaseFrom.mock.calls) {
        if (call[0] === 'booking_requests') {
            const updateCall = mockSupabaseUpdate.mock.calls.find(c => c[0].status === 'failed' && c[0].error_message === rpcErrorMessage);
            if (updateCall) {
                 expect(mockSupabaseEq).toHaveBeenCalledWith("id", bookingRequestId);
                updatedBookingRequestToFailed = true;
                break;
            }
        }
    }
    expect(updatedBookingRequestToFailed).toBe(true);


    // Verify trip_requests.best_price was NOT updated
    let tripRequestBestPriceUpdated = false;
     for (const call of mockSupabaseFrom.mock.calls) {
        if (call[0] === 'trip_requests') {
            if (mockSupabaseUpdate.mock.calls.some(c => c[0].best_price !== undefined && c[0].id === tripId)) { // Check if best_price was part of any update for this trip
                tripRequestBestPriceUpdated = true;
                break;
            }
        }
    }
    expect(tripRequestBestPriceUpdated).toBe(false);
  });

  it('5. Successful Auto-Booking: offer cheaper than best_price, no budget set', async () => {
    const tripId = 5;
    const userId = 'user-nobudget';
    const mockTripRequest: MockTripRequest = {
      id: tripId, user_id: userId, best_price: 600, budget: null, auto_book: true,
      origin_location_code: 'AMS', destination_location_code: 'BCN', departure_date: '2024-11-20', return_date: '2024-11-28', adults: 1,
    };
    const mockOffer: MockOffer = { id: 'offer-005', price: 550 }; // Cheaper than best_price
    const bookingRequestId = 'br-nobudget';

    mockSupabaseFrom.mockImplementation((tableName) => {
        if (tableName === 'trip_requests') {
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockResolvedValueOnce({ data: [mockTripRequest], error: null })
            };
        }
        if (tableName === 'bookings') { 
            return { 
                select: mockSupabaseSelect.mockReturnThis(), 
                eq: vi.fn().mockReturnThis(),
                limit: vi.fn().mockResolvedValueOnce({ data: [], error: null }) 
            };
        }
        if (tableName === 'booking_requests') {
             return {
                insert: mockSupabaseInsert.mockImplementation(() => ({
                    select: vi.fn().mockReturnThis(),
                    single: vi.fn().mockResolvedValueOnce({ data: { id: bookingRequestId }, error: null })
                })),
                update: mockSupabaseUpdate.mockReturnThis(),
                eq: mockSupabaseEq.mockReturnThis(),
            };
        }
        return { select: vi.fn().mockReturnThis(), insert: vi.fn().mockReturnThis(), update: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), single: vi.fn().mockReturnThis() };
    });

    mockFunctionsInvoke.mockResolvedValueOnce({ data: { offers: [mockOffer] }, error: null });
    mockSupabaseRpc.mockResolvedValueOnce({ error: null }); // RPC success

    const response = await serve(mockRequest());
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.autoBookingsCreated).toBe(1);
    expect(mockSupabaseInsert).toHaveBeenCalledWith(expect.objectContaining({ trip_request_id: tripId, offer_data: mockOffer }));
    expect(mockSupabaseRpc).toHaveBeenCalledWith('rpc_auto_book_match', { p_booking_request_id: bookingRequestId });

    // Verify trip_requests.best_price updated
    let updatedTripRequestBestPrice = false;
    for (const call of mockSupabaseFrom.mock.calls) {
        if (call[0] === 'trip_requests') {
            const updateCall = mockSupabaseUpdate.mock.calls.find(c => c[0].best_price === mockOffer.price);
            if (updateCall) {
                expect(mockSupabaseEq).toHaveBeenCalledWith("id", tripId);
                updatedTripRequestBestPrice = true;
                break;
            }
        }
    }
    expect(updatedTripRequestBestPrice).toBe(true);
  });
  
});
