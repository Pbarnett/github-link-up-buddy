import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Use service role to bypass all authentication
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createPublicTestData() {
  try {
    console.log('🎯 Creating public test data for Duffel integration...');

    // Create a simple test user ID
    const testUserId = crypto.randomUUID();
    const testTripId1 = crypto.randomUUID();
    const testTripId2 = crypto.randomUUID();

    // Create test trip requests directly
    const testRequests = [
      {
        id: testTripId1,
        user_id: testUserId,
        origin_location_code: 'JFK',
        destination_location_code: 'LAX',
        departure_date: '2025-08-15',
        return_date: '2025-08-20',
        earliest_departure: '2025-08-15T06:00:00Z',
        latest_departure: '2025-08-15T23:59:59Z',
        adults: 1,
        budget: 500,
        departure_airports: ['JFK'],
        destination_airport: 'LAX'
      },
      {
        id: testTripId2,
        user_id: testUserId,
        origin_location_code: 'BOS',
        destination_location_code: 'SFO',
        departure_date: '2025-09-10',
        return_date: '2025-09-15',
        earliest_departure: '2025-09-10T06:00:00Z',
        latest_departure: '2025-09-10T23:59:59Z',
        adults: 2,
        budget: 800,
        departure_airports: ['BOS'],
        destination_airport: 'SFO'
      }
    ];

    // Delete any existing test data for this user
    await supabase
      .from('trip_requests')
      .delete()
      .eq('user_id', testUserId);

    // Insert new test data
    const { data: inserted, error: insertError } = await supabase
      .from('trip_requests')
      .insert(testRequests)
      .select();

    if (insertError) {
      console.error('Error inserting trip requests:', insertError);
      return;
    }

    console.log('✅ Public test trip requests created:');
    inserted.forEach((req, i) => {
      console.log(`${i + 1}. ${req.origin_location_code} → ${req.destination_location_code}`);
      console.log(`   ID: ${req.id}`);
    });

    console.log('\n🧪 To test Duffel integration:');
    console.log('1. Go to your app at /duffel-test');
    console.log('2. Use these trip request IDs:');
    inserted.forEach(req => console.log(`   ${req.id}`));

    console.log('\n📋 Copy these trip request IDs for testing:');
    console.log(testTripId1);
    console.log(testTripId2);

  } catch (error) {
    console.error('Error:', error);
  }
}

createPublicTestData();
