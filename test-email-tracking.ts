#!/usr/bin/env -S deno run --allow-net --allow-env

/**
 * Test script to verify email tracking integration
 * Run with: deno run --allow-net --allow-env test-email-tracking.ts
 */

// Test the send-notification function with email tracking
async function testEmailTracking() {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
    return;
  }

  const functionUrl = `${SUPABASE_URL}/functions/v1/send-notification`;
  
  const testPayload = {
    user_id: '4c441fef-7d7a-4b76-9a84-0e7cfff0b5ab', // Replace with a real user ID from your database
    type: 'booking_success',
    payload: {
      airline: 'Test Airlines',
      flight_number: 'TA123',
      pnr: 'TEST123',
      departure_datetime: '2025-07-03T10:00:00Z',
      arrival_datetime: '2025-07-03T14:00:00Z',
      price: 299.99
    }
  };

  try {
    console.log('Sending test notification...');
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Notification sent successfully!');
      console.log('Notification ID:', result.notification_id);
      console.log('Check your email and the database tables for tracking data.');
      
      // Instructions for checking tracking
      console.log('\n📊 To verify tracking is working:');
      console.log('1. Check your email inbox for the test notification');
      console.log('2. Query the database tables:');
      console.log('   - notification_deliveries: SELECT * FROM notification_deliveries WHERE notification_id = \'' + result.notification_id + '\';');
      console.log('   - email_events (after email events occur): SELECT * FROM email_events;');
      console.log('   - email_engagement (after opens/clicks): SELECT * FROM email_engagement;');
      
    } else {
      console.error('❌ Notification failed:', result);
    }
  } catch (error) {
    console.error('❌ Error sending notification:', error);
  }
}

// Check database tables
async function checkDatabaseTables() {
  console.log('\n🔍 Checking if tracking tables exist...');
  
  // This would need to be run with psql or a database connection
  // For now, just provide the SQL commands to run
  console.log('Run these SQL commands to check table status:');
  console.log('1. SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\' AND table_name IN (\'email_events\', \'email_suppressions\', \'email_engagement\', \'notification_deliveries\');');
  console.log('2. SELECT COUNT(*) FROM notification_deliveries;');
  console.log('3. SELECT COUNT(*) FROM email_events;');
}

console.log('🧪 Email Tracking Integration Test');
console.log('==================================');

await checkDatabaseTables();
await testEmailTracking();

console.log('\n✨ Test completed!');
console.log('Next steps:');
console.log('1. Configure your domain in Resend dashboard');
console.log('2. Set up webhook endpoint: https://YOUR_PROJECT.supabase.co/functions/v1/resend-webhook');
console.log('3. Enable tracking features in Resend dashboard');
