import { SupabaseClient, createClient, PostgrestError } from '@supabase/supabase-js';
import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

// Assuming type definitions might be available, e.g.:
// import { TripRequest, Booking, Notification, BookingRequest } from '@/integrations/supabase/types';

// Define interfaces for the data we'll be working with to ensure type safety
// These should ideally align with src/integrations/supabase/types.ts after its update
interface TripRequest {
  id: string; // Changed to string for UUID
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
  id: string; // Changed to string for UUID
  user_id: string;
  trip_request_id: string; // Changed to string for UUID FK
  offer_id: string;
  offer_data: any;
  auto: boolean;
  status: string;
  error_message?: string | null; // Made optional to align with DB schema (TEXT allows NULL)
  created_at?: string;
  updated_at?: string;
}

interface Booking {
  id: number; // Assuming bookings.id (PK) is still BIGINT serial
  user_id: string;
  trip_request_id: string; // Changed to string for UUID FK
  booking_request_id: string; // Changed to string for UUID FK
  flight_details?: any; // Added optional based on schema
  price?: number; // Added optional based on schema
  source?: string; // Added optional based on schema
  status?: string; // Added optional based on schema
  booked_at?: string;
}

interface Notification {
  id: number; // Assuming notifications.id (PK) is still BIGINT serial
  user_id: string;
  trip_request_id: string; // Changed to string for UUID FK
  type: string;
  message?: string; // Added optional based on schema (TEXT allows NULL)
  data?: any; // Added optional based on schema (JSONB allows NULL)
  read?: boolean;
  created_at?: string;
}


describe('E2E: Full Auto-Book Flow (Scheduler -> RPC -> DB)', () => {
  let supabase: SupabaseClient;
  const testUserId = '00000000-0000-0000-0000-000000000002';

  let tripRequestId: string | undefined; // Changed to string for UUID
  let initialBestPrice: number | null;
  let budget: number | null;
  let expectedBookPrice: number;

  beforeAll(async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for E2E tests');
    }
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log(`E2E Test User ID: ${testUserId}. Ensure this user exists or RLS allows operations.`);
  });

  beforeEach(async () => {
    // Clean up data from previous runs for this specific testUserId or tripRequestId
    if (tripRequestId) {
      console.log(`Cleaning up data for tripRequestId: ${tripRequestId}`);
      // Delete notifications first (might reference bookings or booking_requests if data field is used that way)
      await supabase.from('notifications').delete().eq('trip_request_id', tripRequestId);

      // Find booking_requests associated with the trip_request_id to delete related bookings
      const { data: bookingRequests, error: brDelErr } = await supabase
        .from('booking_requests')
        .select('id')
        .eq('trip_request_id', tripRequestId);

      if (brDelErr) {
        console.error("Error fetching booking_requests for cleanup:", brDelErr.message);
      } else if (bookingRequests && bookingRequests.length > 0) {
        const bookingRequestIds = bookingRequests.map(br => br.id);
        if (bookingRequestIds.length > 0) {
          await supabase.from('bookings').delete().in('booking_request_id', bookingRequestIds);
        }
      }

      await supabase.from('booking_requests').delete().eq('trip_request_id', tripRequestId);
      await supabase.from('trip_requests').delete().eq('id', tripRequestId);
      console.log(`Cleanup complete for tripRequestId: ${tripRequestId}`);
      tripRequestId = undefined; // Reset
    }
  });

  // Optional: afterAll to clean any remaining test data for this user
  afterAll(async () => {
    if (tripRequestId) { // If a test failed mid-way and beforeEach didn't catch it
        console.warn(`Performing afterAll cleanup for potentially orphaned tripRequestId: ${tripRequestId}`);
        await supabase.from('notifications').delete().eq('trip_request_id', tripRequestId);
        const { data: bookingRequests } = await supabase.from('booking_requests').select('id').eq('trip_request_id', tripRequestId);
        if (bookingRequests && bookingRequests.length > 0) {
            const bookingRequestIds = bookingRequests.map(br => br.id);
            if (bookingRequestIds.length > 0) await supabase.from('bookings').delete().in('booking_request_id', bookingRequestIds);
        }
        await supabase.from('booking_requests').delete().eq('trip_request_id', tripRequestId);
        await supabase.from('trip_requests').delete().eq('id', tripRequestId);
    }
    // Consider a more general cleanup for the testUserId if tests are strictly isolated by user
    // await supabase.from('trip_requests').delete().eq('user_id', testUserId);
    // (ensure cascading deletes or manual cleanup of related tables if doing this)
  });

  it('should complete the auto-booking flow: scheduler invokes RPC, updates DB, and creates notifications', async () => {
    console.log('E2E TEST RUNNING: auto-book-flow.spec.ts');
    // 1. Seed Data
    initialBestPrice = 800;
    budget = 650;
    expectedBookPrice = 600; // CRITICAL ASSUMPTION: flight-search returns this for PAR-ROM

    const departureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const returnDate = new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: tripRequestData, error: tripError } = await supabase
      .from('trip_requests')
      .insert({
        user_id: testUserId,
        origin_location_code: 'PAR',
        destination_location_code: 'ROM',
        departure_date: departureDate,
        return_date: returnDate,
        adults: 1,
        auto_book: true,
        budget: budget,
        best_price: initialBestPrice,
      })
      .select()
      .single();

    expect(tripError, `Trip request insert error: ${tripError?.message}`).toBeNull();
    expect(tripRequestData, 'Trip request data is null/undefined after insert').toBeDefined();
    tripRequestId = tripRequestData!.id as string; // id from DB is UUID string

    // 2. Invoke the Edge Function (scheduler-flight-search)
    console.log(`Invoking scheduler-flight-search for trip ID: ${tripRequestId}...`);
    const { data: schedulerInvokeData, error: invokeError } = await supabase.functions.invoke('scheduler-flight-search', {});

    if (invokeError) console.error('Scheduler function invocation error details:', invokeError);
    expect(invokeError, `Scheduler invocation error: ${invokeError?.message}`).toBeNull();
    console.log('Scheduler invoked. Response data:', schedulerInvokeData);


    // 3. Assert DB State
    // Allow some time for async operations (scheduler -> flight-search -> rpc -> db updates)
    await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust as needed

    // A. One new booking_requests (auto, processing -> done)
    const { data: bookingRequests, error: brError } = await supabase
      .from('booking_requests')
      .select<"*", BookingRequest>('*') // Explicitly type the select
      .eq('trip_request_id', tripRequestId!);

    expect(brError, `Error fetching booking_requests: ${brError?.message}`).toBeNull();
    expect(bookingRequests, 'Booking requests array is null/undefined').toBeDefined();
    expect(bookingRequests!.length, `Expected 1 booking request, found ${bookingRequests!.length}. Data: ${JSON.stringify(bookingRequests)}`).toBe(1);

    const bookingRequest = bookingRequests![0];
    expect(bookingRequest.auto, 'booking_requests.auto should be true').toBe(true);
    expect(bookingRequest.status, `booking_requests.status should be 'done', was '${bookingRequest.status}'`).toBe('done');
    expect(bookingRequest.offer_data?.price, `Price in booking_requests.offer_data mismatch. Expected ${expectedBookPrice}, got ${bookingRequest.offer_data?.price}`).toBe(expectedBookPrice);

    // B. One new row in bookings (source='auto', correct flight JSON)
    const { data: bookings, error: bError } = await supabase
      .from('bookings')
      .select<"*", Booking>('*') // Explicitly type the select
      .eq('booking_request_id', bookingRequest.id);

    expect(bError, `Error fetching bookings: ${bError?.message}`).toBeNull();
    expect(bookings, 'Bookings array is null/undefined').toBeDefined();
    expect(bookings!.length, `Expected 1 booking, found ${bookings!.length}. Data: ${JSON.stringify(bookings)}`).toBe(1);

    const booking = bookings![0];
    expect(booking.source, `bookings.source should be 'auto', was '${booking.source}'`).toBe('auto');
    expect(booking.status, `bookings.status should be 'booked', was '${booking.status}'`).toBe('booked');
    expect(booking.price, `Price in bookings mismatch. Expected ${expectedBookPrice}, got ${booking.price}`).toBe(expectedBookPrice);
    expect(booking.flight_details?.price, `Price in bookings.flight_details mismatch. Expected ${expectedBookPrice}, got ${booking.flight_details?.price}`).toBe(expectedBookPrice);

    // C. One new notifications entry
    const { data: notifications, error: nError } = await supabase
      .from('notifications')
      .select<"*", Notification>('*') // Explicitly type the select
      .eq('trip_request_id', tripRequestId!)
      .eq('type', 'auto_booking_success');

    expect(nError, `Error fetching notifications: ${nError?.message}`).toBeNull();
    expect(notifications, 'Notifications array is null/undefined').toBeDefined();
    expect(notifications!.length, `Expected 1 notification, found ${notifications!.length}. Data: ${JSON.stringify(notifications)}`).toBe(1);

    const notification = notifications![0];
    expect(notification.user_id, `Notification user_id mismatch`).toBe(testUserId);
    // Message format as per rpc_auto_book_match
    expect(notification.message, `Notification message incorrect. Got: "${notification.message}"`).toContain(`We auto-booked your flight from PAR to ROM`);
    expect(notification.message, `Notification message price incorrect. Got: "${notification.message}"`).toContain(`$${expectedBookPrice.toFixed(2)}!`);
    expect(notification.data?.booking_id, `booking_id in notification.data mismatch`).toBe(booking.id);
    expect(notification.data?.offer_price, `Price in notification.data mismatch. Expected ${expectedBookPrice}, got ${notification.data?.offer_price}`).toBe(expectedBookPrice);

    // D. trip_requests.best_price updated
    const { data: updatedTripRequestData, error: utrError } = await supabase
      .from('trip_requests')
      .select('best_price')
      .eq('id', tripRequestId!)
      .single();

    expect(utrError, `Error fetching updated trip_request: ${utrError?.message}`).toBeNull();
    expect(updatedTripRequestData, 'Updated trip_request is null/undefined').toBeDefined();
    const updatedTripRequest = updatedTripRequestData as TripRequest; // Cast for typing
    expect(updatedTripRequest!.best_price, `trip_requests.best_price should be updated to ${expectedBookPrice}, was ${updatedTripRequest!.best_price}`).toBe(expectedBookPrice);
  }, 20000); // Increased timeout for full E2E flow
});
```
