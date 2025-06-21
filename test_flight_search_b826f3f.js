import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const anonClient = createClient(supabaseUrl, supabaseAnonKey);

async function testFlightSearchB826f3f() {
  console.log('🧪 Testing flight search at commit b826f3f...');
  
  try {
    // Create a test user first
    console.log('\n1. Creating test user...');
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'password123',
      email_confirm: true
    });
    
    if (authError) {
      console.error('❌ Failed to create test user:', authError.message);
      return;
    }
    
    const userId = authData.user.id;
    console.log('✅ Created test user:', userId);
    
    // Create a test trip request
    console.log('\n2. Creating test trip request...');
    const testTripRequest = {
      user_id: userId,
      earliest_departure: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      latest_departure: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      budget: 500,
      departure_airports: ['JFK'],
      destination_location_code: 'LAX',
      min_duration: 3,
      max_duration: 7,
      auto_book_enabled: false
    };
    
    const { data: tripRequest, error: tripError } = await supabase
      .from('trip_requests')
      .insert(testTripRequest)
      .select()
      .single();
    
    if (tripError) {
      console.error('❌ Failed to create trip request:', tripError.message);
      return;
    }
    
    console.log('✅ Created trip request:', tripRequest.id);
    
    // Test flight search function
    console.log('\n3. Testing flight search function...');
    const searchPayload = {
      tripRequestId: tripRequest.id,
      relaxedCriteria: false
    };
    
    const searchResponse = await fetch('http://127.0.0.1:54321/functions/v1/flight-search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchPayload)
    });
    
    console.log('Flight search response status:', searchResponse.status);
    
    if (searchResponse.ok) {
      const searchResult = await searchResponse.json();
      console.log('✅ Flight search completed:', searchResult);
      
      // Check if flight offers were created
      console.log('\n4. Checking for flight offers...');
      const { data: offers, error: offersError } = await supabase
        .from('flight_offers')
        .select('*')
        .eq('trip_request_id', tripRequest.id);
      
      if (offersError) {
        console.error('❌ Error fetching offers:', offersError.message);
      } else {
        console.log(`✅ Found ${offers.length} flight offers`);
        if (offers.length > 0) {
          console.log('Sample offer:', offers[0]);
        }
      }
      
      // Check if flight matches were created
      console.log('\n5. Checking for flight matches...');
      const { data: matches, error: matchesError } = await supabase
        .from('flight_matches')
        .select('*')
        .eq('trip_request_id', tripRequest.id);
      
      if (matchesError) {
        console.error('❌ Error fetching matches:', matchesError.message);
      } else {
        console.log(`✅ Found ${matches.length} flight matches`);
        if (matches.length > 0) {
          console.log('Sample match:', matches[0]);
        }
      }
      
    } else {
      const errorText = await searchResponse.text();
      console.error('❌ Flight search failed:', errorText);
    }
    
    // Clean up
    console.log('\n6. Cleaning up...');
    await supabase.from('trip_requests').delete().eq('id', tripRequest.id);
    await supabase.auth.admin.deleteUser(userId);
    console.log('✅ Cleanup complete');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testFlightSearchB826f3f();

