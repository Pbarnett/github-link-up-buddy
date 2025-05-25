
#!/usr/bin/env node

/**
 * Test script for notification functions
 * Run with: node scripts/testNotifications.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createTestUser() {
  // Create a test user profile directly (simulating signup)
  const testUserId = crypto.randomUUID();
  const testEmail = `test-${Date.now()}@example.com`;
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      id: testUserId,
      email: testEmail,
      first_name: 'Test',
      last_name: 'User',
      phone: '+1234567890'
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create test user:', error);
    throw error;
  }

  return profile;
}

async function createTestTripRequest(userId) {
  const { data: tripRequest, error } = await supabase
    .from('trip_requests')
    .insert({
      user_id: userId,
      earliest_departure: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      latest_departure: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      budget: 1000,
      departure_airports: ['JFK'],
      destination_airport: 'CDG',
      min_duration: 3,
      max_duration: 7
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create test trip request:', error);
    throw error;
  }

  return tripRequest;
}

async function testNotifications() {
  console.log('🧪 Testing Notification Functions...\n');

  let testUserId = null;
  let testTripRequestId = null;
  let testBookingRequests = [];

  try {
    // Test 1: Create test user and trip request
    console.log('1️⃣ Creating test user and trip request...');
    
    const testUser = await createTestUser();
    testUserId = testUser.id;
    console.log('✅ Test user created:', testUserId);

    const testTripRequest = await createTestTripRequest(testUserId);
    testTripRequestId = testTripRequest.id;
    console.log('✅ Test trip request created:', testTripRequestId);

    // Test 2: Create successful booking request
    console.log('\n2️⃣ Testing booking confirmation flow...');
    
    const successfulBookingRequest = {
      user_id: testUserId,
      offer_id: crypto.randomUUID(),
      offer_data: {
        destination: 'Paris',
        departure_date: '2024-06-15',
        departure_time: '14:30',
        return_date: '2024-06-22',
        return_time: '18:45',
        flight_number: 'AF1234',
        airline: 'Air France',
        price: 599,
        trip_request_id: testTripRequestId
      },
      status: 'done'
    };

    const { data: successBooking, error: successError } = await supabase
      .from('booking_requests')
      .insert(successfulBookingRequest)
      .select()
      .single();

    if (successError) {
      console.error('❌ Failed to create successful booking request:', successError);
      return;
    }

    testBookingRequests.push(successBooking.id);
    console.log('✅ Successful booking request created:', successBooking.id);

    // Test confirmation email
    const { data: confirmationResult, error: confirmationError } = await supabase.functions.invoke('send-booking-confirmation', {
      body: { booking_request_id: successBooking.id }
    });

    if (confirmationError) {
      console.error('❌ Confirmation email failed:', confirmationError);
    } else {
      console.log('✅ Confirmation email sent successfully');
    }

    // Test 3: Create failed booking request  
    console.log('\n3️⃣ Testing booking failure flow...');
    
    const failedBookingRequest = {
      user_id: testUserId,
      offer_id: crypto.randomUUID(),
      offer_data: {
        destination: 'London',
        departure_date: '2024-07-01',
        departure_time: '10:00',
        return_date: '2024-07-08',
        return_time: '16:30',
        flight_number: 'BA456',
        airline: 'British Airways',
        price: 450,
        trip_request_id: testTripRequestId
      },
      status: 'failed',
      error: 'Payment processing failed - insufficient funds'
    };

    const { data: failedBooking, error: failedError } = await supabase
      .from('booking_requests')
      .insert(failedBookingRequest)
      .select()
      .single();

    if (failedError) {
      console.error('❌ Failed to create failed booking request:', failedError);
      return;
    }

    testBookingRequests.push(failedBooking.id);
    console.log('✅ Failed booking request created:', failedBooking.id);

    // Test failure email
    const { data: failureResult, error: failureError } = await supabase.functions.invoke('send-booking-failed', {
      body: { booking_request_id: failedBooking.id }
    });

    if (failureError) {
      console.error('❌ Failure email failed:', failureError);
    } else {
      console.log('✅ Failure email sent successfully');
    }

    // Test 4: Test SMS reminder for booking departing tomorrow
    console.log('\n4️⃣ Testing SMS reminder...');
    
    const tomorrowBookingRequest = {
      user_id: testUserId,
      offer_id: crypto.randomUUID(),
      offer_data: {
        destination: 'Rome',
        departure_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        departure_time: '08:00',
        return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        return_time: '20:15',
        flight_number: 'AZ789',
        airline: 'Alitalia',
        price: 350,
        trip_request_id: testTripRequestId
      },
      status: 'done'
    };

    const { data: tomorrowBooking, error: tomorrowError } = await supabase
      .from('booking_requests')
      .insert(tomorrowBookingRequest)
      .select()
      .single();

    if (tomorrowError) {
      console.error('❌ Failed to create tomorrow booking request:', tomorrowError);
      return;
    }

    testBookingRequests.push(tomorrowBooking.id);
    console.log('✅ Tomorrow booking request created:', tomorrowBooking.id);

    // Test SMS reminder
    const { data: smsResult, error: smsError } = await supabase.functions.invoke('send-sms-reminder', {
      body: { booking_request_id: tomorrowBooking.id }
    });

    if (smsError) {
      console.error('❌ SMS reminder failed:', smsError);
    } else {
      console.log('✅ SMS reminder sent successfully');
    }

    // Test 5: Test reminder scheduler
    console.log('\n5️⃣ Testing reminder scheduler...');
    
    const { data: schedulerResult, error: schedulerError } = await supabase.functions.invoke('scheduler-reminders');

    if (schedulerError) {
      console.error('❌ Scheduler failed:', schedulerError);
    } else {
      console.log('✅ Scheduler ran successfully:', schedulerResult);
    }

    // Verify notifications were created
    console.log('\n📊 Checking notification records...');
    
    const { data: notifications, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .in('booking_request_id', testBookingRequests);

    if (notificationError) {
      console.error('❌ Failed to fetch notifications:', notificationError);
    } else {
      console.log(`✅ Found ${notifications.length} notification records`);
      notifications.forEach(n => {
        console.log(`   - ${n.type} notification for booking ${n.booking_request_id}`);
      });
    }

    console.log('\n🎉 All notification tests completed successfully!');

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  } finally {
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    
    if (testBookingRequests.length > 0) {
      await supabase.from('notifications').delete().in('booking_request_id', testBookingRequests);
      await supabase.from('booking_requests').delete().in('id', testBookingRequests);
    }
    
    if (testTripRequestId) {
      await supabase.from('trip_requests').delete().eq('id', testTripRequestId);
    }
    
    if (testUserId) {
      await supabase.from('profiles').delete().eq('id', testUserId);
    }
    
    console.log('✅ Cleanup completed');
  }
}

if (require.main === module) {
  testNotifications();
}

module.exports = { testNotifications };
