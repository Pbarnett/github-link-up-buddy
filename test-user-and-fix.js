// Simplified test that creates a user first, then tests the June 12 fix

const PRODUCTION_SUPABASE_URL = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1MTk1NCwiZXhwIjoyMDYyODI3OTU0fQ.zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE';

async function testWithValidUser() {
  console.log('🔍 Testing June 12th Fix with Valid User...');
  
  try {
    // First, let's check if there are any existing users
    console.log('\n1️⃣ Checking for existing users...');
    
    const usersResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const users = await usersResponse.json();
    
    let userId;
    if (users.length > 0) {
      userId = users[0].id;
      console.log(`   ✅ Found existing user: ${userId}`);
    } else {
      console.log('   ⚠️  No users found. Creating test user...');
      
      // Create a test user with proper UUID format
      const testUserId = '00000000-0000-4000-8000-' + Math.random().toString(16).substr(2, 12).padStart(12, '0');
      
      // Create profile (this will handle the user creation via trigger)
      const profileResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          id: testUserId,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com'
        })
      });
      
      if (!profileResponse.ok) {
        throw new Error(`Failed to create user: ${await profileResponse.text()}`);
      }
      
      userId = testUserId;
      console.log(`   ✅ Created test user: ${userId}`);
    }
    
    console.log('\n2️⃣ Creating MVY test trip...');
    
    const createResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/trip_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: userId,
        departure_airports: ['JFK'],
        destination_location_code: 'MVY',
        earliest_departure: '2025-07-15T00:00:00Z',
        latest_departure: '2025-07-25T00:00:00Z',
        min_duration: 3,
        max_duration: 7,
        budget: 1000,
        auto_book_enabled: false,
        nonstop_required: false,
        baggage_included_required: false
      })
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create trip: ${await createResponse.text()}`);
    }
    
    const newTrip = await createResponse.json();
    const tripId = newTrip[0].id;
    console.log(`   ✅ Created trip: ${tripId}`);
    
    console.log('\n3️⃣ Testing edge function...');
    
    const searchResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/functions/v1/flight-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripRequestId: tripId,
        relaxedCriteria: false
      })
    });
    
    const searchResult = await searchResponse.json();
    
    console.log('\n📊 RESULTS:');
    console.log(`   Status: ${searchResponse.status}`);
    console.log(`   Requests Processed: ${searchResult.requestsProcessed || 0}`);
    console.log(`   Matches Inserted: ${searchResult.matchesInserted || 0}`);
    
    if (searchResult.error) {
      console.log(`   Error: ${searchResult.error}`);
    }
    
    // Check database for offers
    console.log('\n4️⃣ Checking database...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const offersResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/flight_offers?trip_request_id=eq.${tripId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const offers = await offersResponse.json();
    console.log(`   Database offers: ${offers.length}`);
    
    console.log('\n🩺 DIAGNOSIS:');
    if (offers.length > 0) {
      console.log('   🎉 SUCCESS! June 12th fix is working!');
      console.log('   ✅ System can now create flight offers');
      console.log('   ✅ Database shows the offers');
      console.log('   ✅ Search results should now display');
    } else if (searchResult.requestsProcessed === 0) {
      console.log('   ❌ Edge function not processing trips');
      console.log('   🔧 Check edge function logs');
    } else {
      console.log('   ⚠️  Edge function runs but no offers saved');
      console.log('   💡 May be an API issue or filtering problem');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithValidUser();

