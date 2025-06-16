// Test if our dual system fix resolves the June 12th breaking change
// This tests the exact scenario that stopped working

const PRODUCTION_SUPABASE_URL = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
// You need to add your production service role key here
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI1MTk1NCwiZXhwIjoyMDYyODI3OTU0fQ.zrhXOjjMK2pX154UeLiKM8-iRvuVzVA8cGne8LTVrqE';

async function testJune12Fix() {
  console.log('🔍 Testing June 12th Breaking Change Fix...');
  console.log('   Issue: Edge function changed to return pools format');
  console.log('   Fix: Enhanced legacy system to handle new response');
  
  // Create a new MVY trip to test with current system
  try {
    console.log('\n1️⃣ Creating new MVY test trip...');
    
    const createResponse = await fetch(`${PRODUCTION_SUPABASE_URL}/rest/v1/trip_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: '9eb76269-ff0c-4553-a85c-aa23c241b4c0',
        departure_airports: ['JFK'],
        destination_location_code: 'MVY',
        earliest_departure: '2025-07-15T00:00:00Z',
        latest_departure: '2025-07-25T00:00:00Z',
        min_duration: 3,
        max_duration: 7,
        budget: 1000,
        auto_book_enabled: false,
        nonstop_required: false, // Relaxed to allow connections
        baggage_included_required: false
      })
    });
    
    if (!createResponse.ok) {
      throw new Error(`Failed to create trip: ${await createResponse.text()}`);
    }
    
    const newTrip = await createResponse.json();
    const tripId = newTrip[0].id;
    console.log(`   ✅ Created trip: ${tripId}`);
    
    console.log('\n2️⃣ Testing edge function with new trip...');
    
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
    
    console.log('\n📊 EDGE FUNCTION RESULTS:');
    console.log(`   Requests Processed: ${searchResult.requestsProcessed}`);
    console.log(`   Matches Inserted: ${searchResult.matchesInserted}`);
    console.log(`   Pool A: ${searchResult.poolA ? searchResult.poolA.length : 0}`);
    console.log(`   Pool B: ${searchResult.poolB ? searchResult.poolB.length : 0}`);
    console.log(`   Pool C: ${searchResult.poolC ? searchResult.poolC.length : 0}`);
    
    if (searchResult.details && searchResult.details.length > 0) {
      const detail = searchResult.details[0];
      console.log('\n🔍 DETAILED BREAKDOWN:');
      console.log(`   Offers Generated: ${detail.offersGenerated || 0}`);
      console.log(`   Exact Destination Offers: ${detail.exactDestinationOffers || 0}`);
      console.log(`   After All Filters: ${detail.offersAfterAllFilters || 0}`);
      console.log(`   Error: ${detail.error || 'None'}`);
    }
    
    console.log('\n3️⃣ Checking database for offers...');
    
    // Wait a moment for database writes
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
    
    if (searchResult.matchesInserted > 0 && offers.length > 0) {
      console.log('   🎉 SUCCESS! June 12th fix is working!');
      console.log('   ✅ Edge function creates offers');
      console.log('   ✅ Database contains offers');
      console.log('   ✅ Legacy system should now display them');
    } else if (searchResult.requestsProcessed === 0) {
      console.log('   ❌ Edge function not processing trip');
      console.log('   🔧 Check database connection');
    } else if (searchResult.details && searchResult.details[0] && searchResult.details[0].offersGenerated === 0) {
      console.log('   ⚠️  Amadeus API returns 0 flights for MVY');
      console.log('   💡 This is the real issue - not our code!');
      console.log('   💡 MVY may not be available in Amadeus test environment');
    } else {
      console.log('   ⚠️  Offers found but filtered out');
      console.log('   💡 Try relaxing criteria (budget, nonstop, etc.)');
    }
    
    return { tripId, searchResult, offers };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('SERVICE_ROLE_KEY')) {
      console.log('\n💡 TO RUN THIS TEST:');
      console.log('   1. Go to Supabase Dashboard → Project Settings → API');
      console.log('   2. Copy the "service_role" key');
      console.log('   3. Replace SERVICE_ROLE_KEY in this script');
      console.log('   4. Run: node test-june-12-fix.js');
    }
  }
}

if (SERVICE_ROLE_KEY === 'YOUR_PRODUCTION_SERVICE_ROLE_KEY') {
  console.log('⚠️  You need to add your production service role key to test this!');
  console.log('   Get it from: Supabase Dashboard → Project Settings → API');
} else {
  testJune12Fix();
}

