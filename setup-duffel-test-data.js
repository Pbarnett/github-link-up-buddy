import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Use service role to bypass RLS for setup
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupTestData() {
  try {
    console.log('🔧 Setting up Duffel test data...');

    // Check if there are any existing users
    const { data: existingUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email')
      .limit(5);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    let userId;
    
    if (existingUsers && existingUsers.length > 0) {
      // Use the first existing user
      userId = existingUsers[0].id;
      console.log(`✅ Using existing user: ${existingUsers[0].email} (${userId})`);
    } else {
      // Create a simple test user directly in auth.users with service role
      console.log('🆕 Creating test user...');
      
      // Insert directly into auth.users table
      const testUserId = crypto.randomUUID();
      const { error: authError } = await supabase
        .from('auth.users')
        .insert({
          id: testUserId,
          email: 'duffel-test@parker.com',
          encrypted_password: '$2a$10$placeholder', // placeholder password hash
          email_confirmed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          role: 'authenticated',
          aud: 'authenticated'
        });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          email: 'duffel-test@parker.com',
          first_name: 'Duffel',
          last_name: 'Test'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return;
      }

      userId = testUserId;
      console.log(`✅ Created test user: duffel-test@parker.com (${userId})`);
    }

    // Delete any existing test trip requests for this user
    await supabase
      .from('trip_requests')
      .delete()
      .eq('user_id', userId)
      .in('origin_location_code', ['JFK', 'BOS']);

    // Create test trip requests
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

    console.log('🎯 For testing:');
    console.log(`1. Sign in to your app with any existing account`);
    console.log(`2. Navigate to /duffel-test`);
    console.log(`3. Use these trip request IDs:`);
    insertedRequests.forEach(request => {
      console.log(`   ${request.id}`);
    });

    console.log('\n⚠️  Note: These trip requests belong to the test user.');
    console.log('   If you want to test with your real account, update the user_id in the database.');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

setupTestData();
