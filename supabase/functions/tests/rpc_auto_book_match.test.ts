import { SupabaseClient, createClient, PostgrestError } from '@supabase/supabase-js';
import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';

// Define interfaces for the data we'll be working with to ensure type safety
// These should ideally align with src/integrations/supabase/types.ts after its update
interface TripRequest {
  id: string; // Changed to string for UUID
  user_id: string; // Assuming this is UUID, already string
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date?: string | null;
  adults?: number;
  auto_book: boolean;
  budget?: number | null;
  best_price?: number | null;
  // other fields as necessary
}

interface BookingRequest {
  id: string; // Changed to string for UUID
  user_id: string; // Assuming UUID
  trip_request_id: string; // Changed to string for UUID FK
  offer_id: string;
  offer_data: Record<string, any>;
  auto: boolean;
  status: string;
  error_message?: string | null;
  // other fields
}

interface Booking {
    id: number; // Assuming bookings.id (PK) is still BIGINT serial
    trip_request_id: string; // Changed to string for UUID FK
    user_id: string; // Assuming UUID
    booking_request_id: string; // Changed to string for UUID FK
    flight_details: Record<string, any>;
    price: number;
    source: string;
    status: string;
    // other fields
}

interface Notification {
    id: number; // Assuming notifications.id (PK) is still BIGINT serial
    user_id: string; // Assuming UUID
    trip_request_id: string; // Changed to string for UUID FK
    type: string;
    message: string;
    data: Record<string, any>;
    // other fields
}


describe('RPC: rpc_auto_book_match', () => {
  let supabase: SupabaseClient;
  const testUserId = '00000000-0000-0000-0000-000000000001';

  let tripRequestIdsToDelete: string[] = []; // Changed to string[] for UUIDs
  let bookingRequestIdsToDelete: string[] = []; // Changed to string[] for UUIDs

  beforeAll(async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for RPC tests');
    }
    supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ensure test user exists (optional, but good for consistency if other tests rely on it)
    // This is a simplified check. In a real setup, ensure this user has necessary permissions or RLS is bypassed.
    const { data: user, error: userError } = await supabase.from('users').select('id').eq('id', testUserId).maybeSingle();
    if (userError) console.error("Error checking test user:", userError);
    if (!user) {
      console.warn(`Test user ${testUserId} not found. Some tests might behave unexpectedly if RLS is restrictive.`);
      // Optionally, insert the test user here if your RLS policies require it for FK constraints.
      // For this test, we assume the user_id is just a UUID and doesn't need to strictly exist in auth.users
      // for the tables being tested, unless there are explicit FKs to auth.users.
    }
  });

  const cleanupTestData = async () => {
    if (bookingRequestIdsToDelete.length > 0) {
        // Delete notifications based on booking_request_id if present in data, or trip_request_id
        for (const brId of bookingRequestIdsToDelete) {
            await supabase.from('notifications').delete().eq('data->>booking_request_id', brId.toString());
        }
        await supabase.from('bookings').delete().in('booking_request_id', bookingRequestIdsToDelete);
        await supabase.from('booking_requests').delete().in('id', bookingRequestIdsToDelete);
        bookingRequestIdsToDelete = [];
    }
    if (tripRequestIdsToDelete.length > 0) {
        await supabase.from('notifications').delete().in('trip_request_id', tripRequestIdsToDelete);
        await supabase.from('booking_requests').delete().in('trip_request_id', tripRequestIdsToDelete); // Clean up any BRs missed
        await supabase.from('trip_requests').delete().in('id', tripRequestIdsToDelete);
        tripRequestIdsToDelete = [];
    }
  };

  beforeEach(async () => {
    await cleanupTestData(); // Clean before each test to ensure isolation
  });

  afterEach(async () => {
    await cleanupTestData(); // Ensure cleanup after each test
  });

  it('should successfully process booking, create booking, notification, and update status to done', async () => {
    // 1. Arrange: Create trip_requests and booking_requests
    const { data: tripReqData, error: tripReqErr } = await supabase
      .from('trip_requests')
      .insert({
        user_id: testUserId,
        origin_location_code: 'LAX',
        destination_location_code: 'JFK',
        departure_date: '2024-12-01',
        auto_book: true,
        adults: 1, // Assuming adults is required by trip_requests
      })
      .select()
      .single();

    expect(tripReqErr, `Trip Request Insert Error: ${tripReqErr?.message}`).toBeNull();
    expect(tripReqData).toBeDefined();
    const tripReq = tripReqData as TripRequest;
    tripRequestIdsToDelete.push(tripReq.id);

    const offerData = {
        id: "offer-rpc-success-test", // from Offer interface
        price: 250.75,
        airline: 'TestAir',
        flight_number: 'TA200',
        departure_time: "10:00",
        arrival_time: "18:00",
        departure_date: "2024-12-01",
        // other fields as per Offer interface used by scheduler
    };

    const { data: bookReqData, error: bookReqErr } = await supabase
      .from('booking_requests')
      .insert({
        user_id: testUserId,
        trip_request_id: tripReq.id,
        offer_id: offerData.id,
        offer_data: offerData,
        auto: true,
        status: 'processing'
      })
      .select()
      .single();

    expect(bookReqErr, `Booking Request Insert Error: ${bookReqErr?.message}`).toBeNull();
    expect(bookReqData).toBeDefined();
    const bookReq = bookReqData as BookingRequest;
    bookingRequestIdsToDelete.push(bookReq.id);

    // 2. Act: Call the RPC
    const { error: rpcError } = await supabase.rpc('rpc_auto_book_match', { p_booking_request_id: bookReq.id });
    expect(rpcError, `RPC Call Error: ${rpcError?.message}`).toBeNull();

    // 3. Assert
    // Booking request status
    const { data: updatedBookReq, error: updatedBookReqErr } = await supabase.from('booking_requests').select('*').eq('id', bookReq.id).single();
    expect(updatedBookReqErr, `Fetch Updated Booking Request Error: ${updatedBookReqErr?.message}`).toBeNull();
    expect(updatedBookReq).toBeDefined();
    expect(updatedBookReq!.status).toBe('done');
    expect(updatedBookReq!.error_message).toBeNull();

    // Booking created
    const { data: bookings, error: bookingsErr } = await supabase.from('bookings').select<"*", Booking>('*').eq('booking_request_id', bookReq.id);
    expect(bookingsErr, `Fetch Bookings Error: ${bookingsErr?.message}`).toBeNull();
    expect(bookings).toHaveLength(1);
    const createdBooking = bookings![0];
    expect(createdBooking.source).toBe('auto');
    expect(createdBooking.status).toBe('booked');
    expect(createdBooking.price).toBe(offerData.price);
    expect(createdBooking.flight_details.airline).toBe(offerData.airline);
    expect(createdBooking.flight_details.flight_number).toBe(offerData.flight_number);


    // Notification created
    const { data: notifications, error: notificationsErr } = await supabase.from('notifications').select<"*", Notification>('*').eq('trip_request_id', tripReq.id).eq('type', 'auto_booking_success');
    expect(notificationsErr, `Fetch Notifications Error: ${notificationsErr?.message}`).toBeNull();
    expect(notifications).toHaveLength(1);
    const createdNotification = notifications![0];
    expect(createdNotification.message).toContain(`We auto-booked your flight from ${tripReq.origin_location_code} to ${tripReq.destination_location_code}`);
    expect(createdNotification.message).toContain(`with ${offerData.airline} (${offerData.flight_number}) for $${offerData.price.toFixed(2)}!`);
    expect(createdNotification.data?.booking_id).toBe(createdBooking.id);
    expect(createdNotification.data?.offer_price).toBe(offerData.price);
    expect(createdNotification.data?.airline).toBe(offerData.airline);
  }, 10000); // Timeout for DB operations

  it('should update booking_requests to failed if RPC encounters an error (e.g., invalid trip_request_id)', async () => {
    // 1. Arrange: Create booking_requests with an invalid trip_request_id
    const invalidTripRequestId = 999999; // Assume this does not exist
    // No need to add invalidTripRequestId to tripRequestIdsToDelete as it's not created,
    // and it's a number, not a UUID string, so it wouldn't match a UUID PK anyway.
    // For this test, we'll use a validly formatted but non-existent UUID.
    const nonExistentTripRequestIdUUID = 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e5e5';

    const offerData = {
        id: "offer-rpc-fail-test-uuid",
        price: 100.00,
        airline: 'FailAir',
        flight_number: 'FA000',
        departure_time: "10:00",
        arrival_time: "18:00",
        departure_date: "2024-12-01"
    };
    const { data: bookReqData, error: bookReqErr } = await supabase
      .from('booking_requests')
      .insert({
        user_id: testUserId,
        trip_request_id: nonExistentTripRequestIdUUID, // Use non-existent UUID string
        offer_id: offerData.id,
        offer_data: offerData,
        auto: true,
        status: 'processing'
      })
      .select()
      .single();

    expect(bookReqErr, `Booking Request Insert Error (Fail Case): ${bookReqErr?.message}`).toBeNull();
    expect(bookReqData).toBeDefined();
    const bookReq = bookReqData as BookingRequest; // ID will be string (UUID)
    bookingRequestIdsToDelete.push(bookReq.id);

    // 2. Act: Call the RPC
    const { error: rpcError } = await supabase.rpc('rpc_auto_book_match', { p_booking_request_id: bookReq.id });
    expect(rpcError, `RPC Call Error (Fail Case - should be null if RPC handles error internally): ${rpcError?.message}`).toBeNull();

    // 3. Assert
    const { data: updatedBookReq, error: updatedBookReqErr } = await supabase.from('booking_requests').select('*').eq('id', bookReq.id).single();
    expect(updatedBookReqErr, `Fetch Updated Booking Request Error (Fail Case): ${updatedBookReqErr?.message}`).toBeNull();
    expect(updatedBookReq).toBeDefined();
    expect(updatedBookReq!.status).toBe('failed');
    expect(updatedBookReq!.error_message).not.toBeNull();
    // The error message from RPC uses the UUID format now.
    expect(updatedBookReq!.error_message).toContain(`Associated trip request ID ${nonExistentTripRequestIdUUID} not found`);

    // Assert no booking created
    const { data: bookings, error: bookingsErr } = await supabase.from('bookings').select('*').eq('booking_request_id', bookReq.id);
    expect(bookingsErr, `Fetch Bookings Error (Fail Case): ${bookingsErr?.message}`).toBeNull();
    expect(bookings).toHaveLength(0);

    // Assert no 'auto_booking_success' notification created for this booking_request_id
    const { data: notifications, error: notificationsErr } = await supabase
      .from('notifications')
      .select('*')
      .eq('data->>booking_request_id', bookReq.id) // bookReq.id is already string (UUID)
      .eq('type', 'auto_booking_success');
    expect(notificationsErr, `Fetch Notifications Error (Fail Case): ${notificationsErr?.message}`).toBeNull();
    expect(notifications).toHaveLength(0);
  }, 10000); // Timeout for DB operations
});
