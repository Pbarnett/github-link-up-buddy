import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Use service role to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createSimpleTestData() {
  try {
    console.log('🎯 Creating simple test data for Duffel integration...');

    // Get any existing user from profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .limit(1);

    if (profileError) {
      console.error('Error fetching profiles:', profileError);
      return;
    }

    let userId;
    if (profiles && profiles.length > 0) {
      userId = profiles[0].id;
      console.log(`✅ Using existing user: ${profiles[0].email}`);
    } else {
      console.log('❌ No users found. Please sign in to your app first, then run this script.');
      return;
    }

    // Clear old test data
    await supabase
      .from('trip_requests')
      .delete()
      .eq('user_id', userId)
      .in('origin_location_code', ['JFK', 'BOS']);

    // Create simple test trip requests
    const testRequests = [
      {
        user_id: userId,
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
        user_id: userId,
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

    const { data: inserted, error: insertError } = await supabase
      .from('trip_requests')
      .insert(testRequests)
      .select();

    if (insertError) {
      console.error('Error inserting trip requests:', insertError);
      return;
    }

    console.log('✅ Test trip requests created:');
    inserted.forEach((req, i) => {
      console.log(`${i + 1}. ${req.origin_location_code} → ${req.destination_location_code}`);
      console.log(`   ID: ${req.id}`);
    });

    console.log('\n🧪 To test:');
    console.log('1. Sign in to your app with your account');
    console.log('2. Go to /duffel-test');
    console.log('3. Use these trip request IDs:');
    inserted.forEach(req => console.log(`   ${req.id}`));

  } catch (error) {
    console.error('Error:', error);
  }
}

createSimpleTestData();
