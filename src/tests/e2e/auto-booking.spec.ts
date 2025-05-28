import { SupabaseClient, createClient, PostgrestError } from '@supabase/supabase-js';

// Define simple interfaces for test data (can be expanded or imported from actual types)
interface TripRequest {
  id: number;
  user_id: string;
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date: string | null;
  adults: number;
  auto_book: boolean;
  budget: number | null;
  best_price: number | null;
  created_at?: string;
  updated_at?: string;
}

interface BookingRequest {
  id: number;
  user_id: string;
  trip_request_id: number;
  offer_id: string;
  offer_data: any; // Should match the Offer interface from scheduler
  auto: boolean;
  status: string; // 'processing', 'done', 'failed'
  error_message: string | null;
  created_at?: string;
  updated_at?: string;
}

interface Booking {
  id: number;
  user_id: string;
  trip_request_id: number;
  booking_request_id: number;
  flight_details: any; // Should match the Offer interface
  price: number;
  source: string; // 'auto', 'manual'
  status: string; // 'pending', 'booked', 'cancelled'
  booked_at?: string;
}

interface Notification {
  id: number;
  user_id: string;
  trip_request_id: number;
  type: string; // 'price_drop', 'auto_booking_success'
  message: string;
  data: any;
  read?: boolean;
  created_at?: string;
}


describe('End-to-End: Scheduler Auto-Booking Flow', () => {
  let supabase: SupabaseClient;
  // IMPORTANT: This test user ID MUST exist in your test database's auth.users table.
  // For a robust E2E setup, this user should be programmatically created/managed.
  const testUserId = '00000000-0000-0000-0000-000000000001'; 
  let tripRequestIdsToDelete: number[] = [];

  beforeAll(() => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for E2E tests');
    }
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      // Optional: Configure Supabase client options if needed
      // auth: {
      //   persistSession: false // Don't persist session for server-side tests
      // }
    });

    // Verify test user exists (optional, but good for early failure)
    // This is a placeholder check; actual user management is more complex.
    console.log(`Using test user ID: ${testUserId}. Ensure this user exists in your test DB.`);
  });

  beforeEach(async () => {
    // Clean up data related to the specific test user ID or specific trip_request_ids
    // This ensures test independence.
    if (tripRequestIdsToDelete.length > 0) {
        // Delete notifications, bookings, booking_requests associated with the trip_requests
        // that are about to be cleaned up or were created in previous tests for this user.
        const { error: nError } = await supabase.from('notifications').delete().in('trip_request_id', tripRequestIdsToDelete);
        if (nError) console.error('Cleanup error (notifications):', nError);
        
        const { data: brs, error: brsError } = await supabase.from('booking_requests').select('id').in('trip_request_id', tripRequestIdsToDelete);
        if (brsError) console.error('Cleanup error (fetching booking_requests):', brsError);
        if (brs && brs.length > 0) {
            const brIds = brs.map(br => br.id);
            const { error: bError } = await supabase.from('bookings').delete().in('booking_request_id', brIds);
            if (bError) console.error('Cleanup error (bookings):', bError);
        }

        const { error: brError } = await supabase.from('booking_requests').delete().in('trip_request_id', tripRequestIdsToDelete);
        if (brError) console.error('Cleanup error (booking_requests):', brError);
        
        const { error: trError } = await supabase.from('trip_requests').delete().in('id', tripRequestIdsToDelete);
        if (trError) console.error('Cleanup error (trip_requests):', trError);
        
        tripRequestIdsToDelete = []; // Reset for the next test
    }
    // A more aggressive cleanup based on user_id if tests are strictly partitioned by user
    // await supabase.from('notifications').delete().eq('user_id', testUserId);
    // await supabase.from('bookings').delete().eq('user_id', testUserId);
    // await supabase.from('booking_requests').delete().eq('user_id', testUserId);
    // await supabase.from('trip_requests').delete().eq('user_id', testUserId);
  });
  
  afterAll(async () => {
      // Global cleanup if any test data might have been missed by beforeEach
      if (tripRequestIdsToDelete.length > 0) {
        console.warn(`Warning: Some tripRequestIds were still marked for deletion after tests: ${tripRequestIdsToDelete.join(', ')}. Running cleanup.`);
        const { error: nError } = await supabase.from('notifications').delete().in('trip_request_id', tripRequestIdsToDelete);
        if (nError) console.error('AfterAll Cleanup error (notifications):', nError);
        
        const { data: brs, error: brsError } = await supabase.from('booking_requests').select('id').in('trip_request_id', tripRequestIdsToDelete);
        if (brsError) console.error('AfterAll Cleanup error (fetching booking_requests):', brsError);
        if (brs && brs.length > 0) {
            const brIds = brs.map(br => br.id);
            const { error: bError } = await supabase.from('bookings').delete().in('booking_request_id', brIds);
            if (bError) console.error('AfterAll Cleanup error (bookings):', bError);
        }
        
        const { error: brError } = await supabase.from('booking_requests').delete().in('trip_request_id', tripRequestIdsToDelete);
        if (brError) console.error('AfterAll Cleanup error (booking_requests):', brError);
        
        const { error: trError } = await supabase.from('trip_requests').delete().in('id', tripRequestIdsToDelete);
        if (trError) console.error('AfterAll Cleanup error (trip_requests):', trError);
      }
  });

  it('should successfully auto-book a flight when conditions are met', async () => {
    // 1. Seed Data
    const initialBestPrice = 700;
    const budget = 600;
    // CRITICAL ASSUMPTION: flight-search needs to find an offer at this price for the given params
    const expectedBookPrice = 550; 

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 90); // 3 months in the future
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7); // 1 week trip

    const { data: tripRequestData, error: tripError } = await supabase
      .from('trip_requests')
      .insert({
        user_id: testUserId,
        origin_location_code: 'LHR', 
        destination_location_code: 'JFK',
        departure_date: departureDate.toISOString().split('T')[0],
        return_date: returnDate.toISOString().split('T')[0],
        adults: 1,
        auto_book: true,
        budget: budget,
        best_price: initialBestPrice,
      })
      .select()
      .single();

    if (tripError) console.error("Error inserting trip_request:", tripError);
    expect(tripError).toBeNull();
    expect(tripRequestData).toBeDefined();
    const tripRequest = tripRequestData as TripRequest;
    const tripRequestId = tripRequest.id;
    tripRequestIdsToDelete.push(tripRequestId); // Mark for cleanup

    // Pre-condition: Ensure no existing bookings for this trip request
    const { data: existingBookingsBefore, error: existingBookingsErrorBefore } = await supabase
        .from('bookings')
        .select('id')
        .eq('trip_request_id', tripRequestId);
    expect(existingBookingsErrorBefore).toBeNull();
    expect(existingBookingsBefore?.length).toBe(0);


    // 2. Invoke Scheduler Function
    // This relies on the 'scheduler-flight-search' function being deployed and
    // the 'flight-search' function it calls returning a suitable offer
    // (e.g., price: expectedBookPrice) for the LHR-JFK parameters.
    console.log(`Invoking scheduler-flight-search for trip ID: ${tripRequestId}...`);
    const { data: schedulerResponse, error: invokeError } = await supabase.functions.invoke('scheduler-flight-search', {
      // No body needed as the scheduler fetches its own data, but can pass if function expects something
    });
    
    if (invokeError) {
        console.error("Scheduler function invocation error:", invokeError);
    }
    expect(invokeError).toBeNull();
    // Optional: Check schedulerResponse content if it's meaningful for success
    console.log("Scheduler response:", schedulerResponse);
    // Example: expect(schedulerResponse?.autoBookingsCreated).toBeGreaterThanOrEqual(1);


    // 3. Assert Database State:
    //    Wait a bit for all async operations within the scheduler and RPC to complete.
    await new Promise(resolve => setTimeout(resolve, 3000)); // Adjust timeout as needed

    //    A. Exactly one new booking_requests
    const { data: bookingRequests, error: brError } = await supabase
      .from('booking_requests')
      .select<"*", BookingRequest>('*')
      .eq('trip_request_id', tripRequestId);

    if (brError) console.error("Error fetching booking_requests:", brError);
    expect(brError).toBeNull();
    expect(bookingRequests).toHaveLength(1);
    const bookingRequest = bookingRequests![0];
    expect(bookingRequest.auto).toBe(true);
    expect(bookingRequest.status).toBe('done'); 
    expect(bookingRequest.offer_data?.price).toBe(expectedBookPrice);

    //    B. A matching booking with source='auto'
    const { data: bookings, error: bError } = await supabase
      .from('bookings')
      .select<"*", Booking>('*')
      .eq('trip_request_id', tripRequestId);

    if (bError) console.error("Error fetching bookings:", bError);
    expect(bError).toBeNull();
    expect(bookings).toHaveLength(1);
    const booking = bookings![0];
    expect(booking.source).toBe('auto');
    expect(booking.status).toBe('booked');
    expect(booking.price).toBe(expectedBookPrice);
    expect(booking.booking_request_id).toBe(bookingRequest.id);

    //    C. A notification record
    const { data: notifications, error: nError } = await supabase
      .from('notifications')
      .select<"*", Notification>('*')
      .eq('trip_request_id', tripRequestId)
      .eq('type', 'auto_booking_success');

    if (nError) console.error("Error fetching notifications:", nError);
    expect(nError).toBeNull();
    expect(notifications).toHaveLength(1);
    const notification = notifications![0];
    expect(notification.user_id).toBe(testUserId);
    expect(notification.message).toContain(`from LHR to JFK`); 
    expect(notification.message).toContain(`$${expectedBookPrice.toFixed(2)}`);
    expect(notification.data?.booking_id).toBe(booking.id);

    //    D. trip_requests.best_price updated
    const { data: updatedTripRequestData, error: utrError } = await supabase
      .from('trip_requests')
      .select('best_price')
      .eq('id', tripRequestId)
      .single();

    if (utrError) console.error("Error fetching updated trip_request:", utrError);
    expect(utrError).toBeNull();
    const updatedTripRequest = updatedTripRequestData as TripRequest;
    expect(updatedTripRequest!.best_price).toBe(expectedBookPrice);
    
  }, 15000); // Increased timeout for E2E test involving multiple async ops & scheduler invocation

  // TODO: Add more E2E test cases:
  // - Scenario: No offer meets budget (assert no booking actions).
  //   - Seed trip_request with a very low budget.
  //   - Invoke scheduler.
  //   - Assert no booking_requests, bookings, or auto_booking_success notifications created for that trip.
  //   - Assert trip_requests.best_price is unchanged (or updated by price_drop logic if that kicks in).
  //
  // - Scenario: Trip already has a 'booked' booking (assert scheduler skips).
  //   - Seed trip_request with auto_book = true.
  //   - Seed a 'bookings' record for this trip_request with status = 'booked'.
  //   - Invoke scheduler.
  //   - Assert no new booking_requests, bookings, or notifications for this trip.
  //
  // - Scenario: RPC `rpc_auto_book_match` fails (e.g., if flight-search returns an offer, scheduler tries to book, but RPC fails internally).
  //   - This is harder to test reliably in E2E without specific triggers for RPC internal failure.
  //   - One way could be to insert a booking_request with data that would cause the RPC to fail (e.g., invalid user_id if RPC checks it).
  //   - Then check booking_requests.status is 'failed' and error_message is set by the RPC.
  //   - However, testing the scheduler's reaction to the RPC call *itself* failing (network error, RPC not found) is
  //     covered by the scheduler's unit/integration tests where the rpc call is mocked.
});
```
