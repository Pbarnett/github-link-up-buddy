
#!/usr/bin/env node

/**
 * Test script for notification functions
 * Run with: node scripts/testNotifications.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testNotifications() {
  console.log('🧪 Testing Notification Functions...\n');

  try {
    // Test 1: Create a test booking request
    console.log('1️⃣ Creating test booking request...');
    
    const testBookingRequest = {
      user_id: '00000000-0000-0000-0000-000000000000', // Replace with actual test user ID
      offer_id: '00000000-0000-0000-0000-000000000000', // Replace with actual test offer ID
      offer_data: {
        destination: 'Paris',
        departure_date: '2024-06-15',
        departure_time: '14:30',
        return_date: '2024-06-22',
        return_time: '18:45',
        flight_number: 'AF1234',
        airline: 'Air France',
        price: 599
      },
      status: 'done'
    };

    const { data: bookingRequest, error: brError } = await supabase
      .from('booking_requests')
      .insert(testBookingRequest)
      .select()
      .single();

    if (brError) {
      console.error('❌ Failed to create test booking request:', brError);
      return;
    }

    console.log('✅ Test booking request created:', bookingRequest.id);

    // Test 2: Test confirmation email
    console.log('\n2️⃣ Testing booking confirmation email...');
    
    const { data: confirmationResult, error: confirmationError } = await supabase.functions.invoke('send-booking-confirmation', {
      body: { booking_request_id: bookingRequest.id }
    });

    if (confirmationError) {
      console.error('❌ Confirmation email failed:', confirmationError);
    } else {
      console.log('✅ Confirmation email sent successfully:', confirmationResult);
    }

    // Test 3: Test failure email
    console.log('\n3️⃣ Testing booking failure email...');
    
    // Update booking request to have an error
    await supabase
      .from('booking_requests')
      .update({ 
        status: 'failed',
        error: 'Payment processing failed - insufficient funds' 
      })
      .eq('id', bookingRequest.id);

    const { data: failureResult, error: failureError } = await supabase.functions.invoke('send-booking-failed', {
      body: { booking_request_id: bookingRequest.id }
    });

    if (failureError) {
      console.error('❌ Failure email failed:', failureError);
    } else {
      console.log('✅ Failure email sent successfully:', failureResult);
    }

    // Test 4: Test SMS reminder
    console.log('\n4️⃣ Testing SMS reminder...');
    
    const { data: smsResult, error: smsError } = await supabase.functions.invoke('send-sms-reminder', {
      body: { booking_request_id: bookingRequest.id }
    });

    if (smsError) {
      console.error('❌ SMS reminder failed:', smsError);
    } else {
      console.log('✅ SMS reminder sent successfully:', smsResult);
    }

    // Test 5: Test scheduler
    console.log('\n5️⃣ Testing reminder scheduler...');
    
    const { data: schedulerResult, error: schedulerError } = await supabase.functions.invoke('scheduler-reminders');

    if (schedulerError) {
      console.error('❌ Scheduler failed:', schedulerError);
    } else {
      console.log('✅ Scheduler ran successfully:', schedulerResult);
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('notifications').delete().eq('booking_request_id', bookingRequest.id);
    await supabase.from('booking_requests').delete().eq('id', bookingRequest.id);
    
    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Add to package.json scripts
console.log('Add this to your package.json scripts section:');
console.log('"test:notifications": "node scripts/testNotifications.js"');

if (require.main === module) {
  testNotifications();
}

module.exports = { testNotifications };
