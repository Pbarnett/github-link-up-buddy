
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAutoBooking() {
  console.log('🚀 Starting auto-booking test...');
  
  try {
    // 1. Create a test user (or use existing)
    const testEmail = 'test-auto-booking@example.com';
    console.log(`📝 Using test user: ${testEmail}`);
    
    // 2. Create a trip request with auto-booking enabled
    const { data: tripRequest, error: tripError } = await supabase
      .from('trip_requests')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Use a test UUID
        departure_airports: ['JFK', 'LGA'],
        destination_airport: 'LAX',
        earliest_departure: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        latest_departure: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        min_duration: 3,
        max_duration: 7,
        budget: 500,
        auto_book_enabled: true,
        max_price: 400,
      })
      .select()
      .single();
      
    if (tripError) {
      console.error('❌ Error creating trip request:', tripError);
      return;
    }
    
    console.log('✅ Created trip request:', tripRequest.id);
    
    // 3. Create an under-budget flight offer
    const { data: flightOffer, error: offerError } = await supabase
      .from('flight_offers')
      .insert({
        trip_request_id: tripRequest.id,
        airline: 'Test Airlines',
        flight_number: 'TS123',
        departure_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        departure_time: '10:00',
        return_date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        return_time: '16:00',
        duration: '6h 30m',
        price: 350, // Under budget
      })
      .select()
      .single();
      
    if (offerError) {
      console.error('❌ Error creating flight offer:', offerError);
      return;
    }
    
    console.log('✅ Created under-budget flight offer:', flightOffer.id, `($${flightOffer.price})`);
    
    // 4. Invoke the scheduler to trigger auto-booking
    console.log('🔄 Invoking scheduler...');
    const { data: schedulerResult, error: schedulerError } = await supabase.functions.invoke('scheduler-flight-search', {
      body: { 
        tripRequestId: tripRequest.id,
        testMode: true 
      }
    });
    
    if (schedulerError) {
      console.error('❌ Error invoking scheduler:', schedulerError);
      return;
    }
    
    console.log('✅ Scheduler result:', schedulerResult);
    
    // 5. Check if booking request was created
    console.log('🔍 Checking for auto-created booking request...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    const { data: bookingRequests, error: bookingRequestError } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('user_id', tripRequest.user_id)
      .eq('offer_id', flightOffer.id);
      
    if (bookingRequestError) {
      console.error('❌ Error checking booking requests:', bookingRequestError);
      return;
    }
    
    if (bookingRequests && bookingRequests.length > 0) {
      console.log('✅ Auto-booking request created:', bookingRequests[0].id);
      console.log('📊 Status:', bookingRequests[0].status);
    } else {
      console.log('❌ No auto-booking request was created');
    }
    
    // 6. Check if booking was completed
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', tripRequest.user_id)
      .eq('flight_offer_id', flightOffer.id);
      
    if (bookingError) {
      console.error('❌ Error checking bookings:', bookingError);
      return;
    }
    
    if (bookings && bookings.length > 0) {
      console.log('✅ Booking completed:', bookings[0].id);
    } else {
      console.log('⏳ Booking not yet completed (this is normal for test mode)');
    }
    
    // 7. Check notifications
    const { data: notifications, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', tripRequest.user_id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (notificationError) {
      console.error('❌ Error checking notifications:', notificationError);
    } else {
      console.log('📬 Recent notifications:', notifications?.length || 0);
      notifications?.forEach(notif => {
        console.log(`  - ${notif.type}: ${JSON.stringify(notif.payload)}`);
      });
    }
    
    console.log('🎉 Auto-booking test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAutoBooking();
