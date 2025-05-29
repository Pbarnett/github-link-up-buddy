import { SupabaseClient, createClient, PostgrestError } from '@supabase/supabase-js';
// import { vi, describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest'; // Assuming vitest is used based on other tests

// Define simple interfaces for test data (can be expanded or imported from actual types)
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
  error_message?: string | null; 
  created_at?: string;
  updated_at?: string;
}

interface Booking {
  id: number; // Assuming bookings.id (PK) is still BIGINT serial
  user_id: string;
  trip_request_id: string; // Changed to string for UUID FK
  booking_request_id: string; // Changed to string for UUID FK
  flight_details?: any; 
  price?: number; 
  source?: string; 
  status?: string; 
  booked_at?: string;
}

interface Notification {
  id: number; // Assuming notifications.id (PK) is still BIGINT serial
  user_id: string;
  trip_request_id: string; // Changed to string for UUID FK
  type: string; 
  message?: string; 
  data?: any; 
  read?: boolean;
  created_at?: string;
}


describe('End-to-End: Scheduler Auto-Booking Flow', () => {
  let supabase: SupabaseClient;
  const testUserId = '00000000-0000-0000-0000-000000000001'; 
  let tripRequestIdsToDelete: string[] = []; // Changed to string[] for UUIDs

  beforeAll(async () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for E2E tests');
    }
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log(`Using test user ID: ${testUserId}. Ensure this user exists in your test DB.`);
  });

  let currentTripRequestId: string | undefined; // Changed to string for UUID

  beforeEach(async () => {
    if (currentTripRequestId) {
      console.log(`Cleaning up data for tripRequestId: ${currentTripRequestId}`);
      await supabase.from('notifications').delete().eq('trip_request_id', currentTripRequestId);
      const { data: bookingRequests, error: brDelErr } = await supabase.from('booking_requests').select('id').eq('trip_request_id', currentTripRequestId);
      if (brDelErr) console.error("Error fetching booking_requests for cleanup:", brDelErr.message);
      if (bookingRequests && bookingRequests.length > 0) {
        const bookingRequestIds = bookingRequests.map(br => br.id);
        if (bookingRequestIds.length > 0) {
          await supabase.from('bookings').delete().in('booking_request_id', bookingRequestIds);
        }
      }
      await supabase.from('booking_requests').delete().eq('trip_request_id', currentTripRequestId);
      await supabase.from('trip_requests').delete().eq('id', currentTripRequestId);
      console.log(`Cleanup complete for tripRequestId: ${currentTripRequestId}`);
      currentTripRequestId = undefined; 
    }
  });
  
  afterAll(async () => {
      if (currentTripRequestId) { 
        console.warn(`Performing afterAll cleanup for potentially orphaned tripRequestId: ${currentTripRequestId}`);
        await supabase.from('notifications').delete().eq('trip_request_id', currentTripRequestId);
        const { data: bookingRequests } = await supabase.from('booking_requests').select('id').eq('trip_request_id', currentTripRequestId);
        if (bookingRequests && bookingRequests.length > 0) {
            const bookingRequestIds = bookingRequests.map(br => br.id);
            if (bookingRequestIds.length > 0) await supabase.from('bookings').delete().in('booking_request_id', bookingRequestIds);
        }
        await supabase.from('booking_requests').delete().eq('trip_request_id', currentTripRequestId);
        await supabase.from('trip_requests').delete().eq('id', currentTripRequestId);
      }
  });

  it('should successfully auto-book a flight when conditions are met', async () => {
    const initialBestPrice = 700;
    const budget = 600;
    const expectedBookPrice = 550; 

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 90); 
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 7); 

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

    if (tripError) console.error("Error inserting trip_request:", tripError.message);
    expect(tripError).toBeNull();
    expect(tripRequestData).toBeDefined();
    const tripRequest = tripRequestData as TripRequest;
    currentTripRequestId = tripRequest.id; // tripRequest.id is already string (UUID from DB)
    tripRequestIdsToDelete.push(currentTripRequestId); 

    const { data: existingBookingsBefore, error: existingBookingsErrorBefore } = await supabase
        .from('bookings')
        .select('id')
        .eq('trip_request_id', currentTripRequestId);
    expect(existingBookingsErrorBefore).toBeNull();
    expect(existingBookingsBefore?.length).toBe(0);

    console.log(`Invoking scheduler-flight-search for trip ID: ${currentTripRequestId}...`);
    const { data: schedulerResponse, error: invokeError } = await supabase.functions.invoke('scheduler-flight-search', {});
    
    if (invokeError) {
        console.error("Scheduler function invocation error:", invokeError.message);
    }
    expect(invokeError).toBeNull();
    console.log("Scheduler response:", schedulerResponse);

    await new Promise(resolve => setTimeout(resolve, 5000)); 

    const { data: bookingRequests, error: brError } = await supabase
      .from('booking_requests')
      .select<"*", BookingRequest>('*')
      .eq('trip_request_id', currentTripRequestId);

    if (brError) console.error("Error fetching booking_requests:", brError.message);
    expect(brError).toBeNull();
    expect(bookingRequests).toHaveLength(1);
    const bookingRequest = bookingRequests![0];
    expect(bookingRequest.auto).toBe(true);
    expect(bookingRequest.status).toBe('done'); 
    expect(bookingRequest.offer_data?.price).toBe(expectedBookPrice);

    const { data: bookings, error: bError } = await supabase
      .from('bookings')
      .select<"*", Booking>('*')
      .eq('booking_request_id', bookingRequest.id); // bookingRequest.id is string (UUID)

    if (bError) console.error("Error fetching bookings:", bError.message);
    expect(bError).toBeNull();
    expect(bookings).toHaveLength(1);
    const booking = bookings![0];
    expect(booking.source).toBe('auto');
    expect(booking.status).toBe('booked');
    expect(booking.price).toBe(expectedBookPrice);
    expect(booking.booking_request_id).toBe(bookingRequest.id);

    const { data: notifications, error: nError } = await supabase
      .from('notifications')
      .select<"*", Notification>('*')
      .eq('trip_request_id', currentTripRequestId)
      .eq('type', 'auto_booking_success');

    if (nError) console.error("Error fetching notifications:", nError.message);
    expect(nError).toBeNull();
    expect(notifications).toHaveLength(1);
    const notification = notifications![0];
    expect(notification.user_id).toBe(testUserId);
    // Ensuring template literals here are correctly terminated
    expect(notification.message, `Notification message incorrect. Got: "${notification.message}"`).toContain(`from LHR to JFK`); 
    expect(notification.message, `Notification message price incorrect. Got: "${notification.message}"`).toContain(`$${expectedBookPrice.toFixed(2)}!`);
    expect(notification.data?.booking_id).toBe(booking.id);

    const { data: updatedTripRequestData, error: utrError } = await supabase
      .from('trip_requests')
      .select('best_price')
      .eq('id', currentTripRequestId)
      .single();

    if (utrError) console.error("Error fetching updated trip_request:", utrError.message);
    expect(utrError).toBeNull();
    const updatedTripRequest = updatedTripRequestData as TripRequest;
    expect(updatedTripRequest!.best_price).toBe(expectedBookPrice);
    
  }, 15000); 
});
```
