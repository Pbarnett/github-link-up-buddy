import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestTripRequests() {
  try {
    // Create a test user first
    const { data: user, error: userError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    let userId;
    if (userError && userError.message.includes('already registered')) {
      // User already exists, sign in instead
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });
      
      if (signInError) {
        console.error('Error signing in:', signInError);
        return;
      }
      userId = signInData.user.id;
      console.log('✅ Signed in existing test user:', userId);
    } else if (userError) {
      console.error('Error creating user:', userError);
      return;
    } else {
      userId = user.user.id;
      console.log('✅ Created new test user:', userId);
    }

    // Create test trip requests with different routes
    const testTripRequests = [
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
        nonstop_required: false,
        baggage_included_required: false,
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
        nonstop_required: true,
        baggage_included_required: true,
        departure_airports: ['BOS'],
        destination_airport: 'SFO'
      }
    ];

    const { data: insertedRequests, error: insertError } = await supabase
      .from('trip_requests')
      .insert(testTripRequests)
      .select();

    if (insertError) {
      console.error('Error inserting trip requests:', insertError);
      return;
    }

    console.log('✅ Created test trip requests:');
    insertedRequests.forEach((request, index) => {
      console.log(`${index + 1}. ID: ${request.id}`);
      console.log(`   Route: ${request.origin_location_code} → ${request.destination_location_code}`);
      console.log(`   Dates: ${request.departure_date} to ${request.return_date}`);
      console.log(`   Adults: ${request.adults}, Budget: $${request.budget}`);
      console.log('');
    });

    console.log('Use these trip request IDs in your Duffel test page:');
    insertedRequests.forEach(request => {
      console.log(request.id);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestTripRequests();
