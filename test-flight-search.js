// Simple Flight Search Test Script
// Copy and paste this into your browser console on any page of your app

(async function testFlightSearch() {
  console.log('🔍 Starting Flight Search Test...');
  
  try {
    // Test 1: Create a test trip request in the database
    console.log('📝 Creating test trip request...');
    
    const tripResponse = await fetch('/rest/v1/trip_requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`,
        'apikey': 'your-anon-key-here',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: 'your-user-id-here', // Replace with actual user ID
        departure_airports: ['SFO', 'OAK'],
        destination_location_code: 'LAX',
        earliest_departure: '2025-07-15T00:00:00Z',
        latest_departure: '2025-07-20T00:00:00Z',
        min_duration: 3,
        max_duration: 7,
        budget: 500,
        max_price: 600,
        auto_book_enabled: false,
        nonstop_required: false,
        baggage_included_required: false
      })
    });
    
    if (!tripResponse.ok) {
      const error = await tripResponse.text();
      console.error('❌ Failed to create trip request:', error);
      return;
    }
    
    const trip = await tripResponse.json();
    console.log('✅ Created trip request:', trip[0].id);
    
    // Test 2: Invoke flight search edge function
    console.log('🛩️ Invoking flight search edge function...');
    
    const searchResponse = await fetch('/functions/v1/flight-search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripRequestId: trip[0].id,
        relaxedCriteria: false
      })
    });
    
    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      console.error('❌ Flight search failed:', error);
      return;
    }
    
    const searchResult = await searchResponse.json();
    console.log('✅ Flight search completed:', searchResult);
    
    // Test 3: Check if offers were created
    console.log('📊 Checking for flight offers...');
    
    const offersResponse = await fetch(`/rest/v1/flight_offers?trip_request_id=eq.${trip[0].id}&select=*`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sb-access-token')}`,
        'apikey': 'your-anon-key-here'
      }
    });
    
    const offers = await offersResponse.json();
    console.log(`✅ Found ${offers.length} flight offers:`, offers);
    
    // Summary
    console.log('\n📋 TEST SUMMARY:');
    console.log(`- Trip Request ID: ${trip[0].id}`);
    console.log(`- Search processed: ${searchResult.requestsProcessed} requests`);
    console.log(`- Matches inserted: ${searchResult.matchesInserted}`);
    console.log(`- Flight offers found: ${offers.length}`);
    console.log(`- Pool A: ${searchResult.poolA ? searchResult.poolA.length : 0}`);
    console.log(`- Pool B: ${searchResult.poolB ? searchResult.poolB.length : 0}`);
    console.log(`- Pool C: ${searchResult.poolC ? searchResult.poolC.length : 0}`);
    
    if (searchResult.details && searchResult.details.length > 0) {
      console.log('📝 Search details:', searchResult.details);
    }
    
    return {
      tripId: trip[0].id,
      searchResult,
      offers
    };
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
})();

// Alternative: Test just the edge function without creating a trip
console.log('\n🔧 Alternative: Test edge function with auto-book enabled trips:');
console.log('Run this to test existing auto-book trips:');
console.log(`
fetch('/functions/v1/flight-search', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('sb-access-token'),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
}).then(r => r.json()).then(console.log).catch(console.error);
`);

