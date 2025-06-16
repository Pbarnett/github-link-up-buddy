// Test script to verify MVY destination matching fix
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

async function testMVYFix() {
  console.log('🧪 Testing MVY destination matching fix...');
  
  try {
    // Create auth user
    const authUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_metadata: { first_name: 'Test', last_name: 'User' },
        email: 'test@example.com',
        email_confirm: true,
        user_id: TEST_USER_ID
      })
    });
    
    if (authUserResponse.status === 422) {
      console.log('✅ Auth user already exists');
    } else if (authUserResponse.ok) {
      console.log('✅ Created auth user');
    }
    
    // Create trip request for MVY (Martha's Vineyard)
    console.log('📝 Creating MVY trip request...');
    
    const tripResponse = await fetch(`${SUPABASE_URL}/rest/v1/trip_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        departure_airports: ['JFK', 'LGA'],
        destination_location_code: 'MVY', // Martha's Vineyard
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
      throw new Error(`Failed to create MVY trip request: ${error}`);
    }
    
    const tripData = await tripResponse.json();
    const tripId = tripData[0].id;
    console.log(`✅ Created MVY trip request: ${tripId}`);
    
    // Test flight search with MVY destination
    console.log('🔍 Testing flight search for MVY destination...');
    
    const searchResponse = await fetch(`${SUPABASE_URL}/functions/v1/flight-search`, {
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
    
    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      throw new Error(`Flight search failed: ${error}`);
    }
    
    const searchResult = await searchResponse.json();
    console.log('✅ Flight search completed for MVY');
    
    // Check flight offers
    const offersResponse = await fetch(`${SUPABASE_URL}/rest/v1/flight_offers?trip_request_id=eq.${tripId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const offers = await offersResponse.json();
    
    // Results
    console.log('\n📊 MVY TEST RESULTS:');
    console.log('========================');
    console.log(`Trip Request ID: ${tripId}`);
    console.log(`Requests Processed: ${searchResult.requestsProcessed}`);
    console.log(`Matches Inserted: ${searchResult.matchesInserted}`);
    console.log(`Flight Offers Found: ${offers.length}`);
    
    if (searchResult.details && searchResult.details.length > 0) {
      const detail = searchResult.details[0];
      console.log('\n🔍 SEARCH DETAILS:');
      console.log(`- Offers Generated: ${detail.offersGenerated || 'N/A'}`);
      console.log(`- Exact Destination Offers: ${detail.exactDestinationOffers || 'N/A'}`);
      console.log(`- After All Filters: ${detail.offersAfterAllFilters || 'N/A'}`);
      if (detail.error) {
        console.log(`- Error: ${detail.error}`);
      }
      if (detail.filteringDetails) {
        console.log(`- Filtering Details: ${detail.filteringDetails}`);
      }
    }
    
    // Check destination airports in offers
    if (offers.length > 0) {
      const destinations = [...new Set(offers.map(o => o.destination_airport))];
      console.log(`\n✈️  DESTINATION AIRPORTS: ${destinations.join(', ')}`);
      
      const hasNearbyAirports = destinations.some(dest => ['BOS', 'ACK', 'HYA', 'PVC'].includes(dest));
      if (hasNearbyAirports) {
        console.log('✅ SUCCESS: MVY search now accepts nearby airports!');
      } else if (destinations.includes('MVY')) {
        console.log('✅ SUCCESS: Found direct MVY flights!');
      } else {
        console.log('⚠️  ISSUE: No MVY or nearby airport flights found');
      }
    } else {
      console.log('❌ NO OFFERS: MVY search still returning no results');
    }
    
    console.log('\n🎯 TEST COMPLETED!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMVYFix();

