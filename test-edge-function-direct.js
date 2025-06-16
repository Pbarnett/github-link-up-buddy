// Direct Edge Function Test - Test if the flight search edge function works
// Run this with: node test-edge-function-direct.js

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function testEdgeFunction() {
  console.log('🧪 Testing Edge Function Directly...');
  
  try {
    // Test 1: Call edge function without trip ID (auto-book mode)
    console.log('\n1️⃣ Testing auto-book mode (no trip ID)...');
    const autoBookResponse = await fetch(`${SUPABASE_URL}/functions/v1/flight-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    const autoBookResult = await autoBookResponse.json();
    console.log('Auto-book result:', {
      requestsProcessed: autoBookResult.requestsProcessed,
      matchesInserted: autoBookResult.matchesInserted,
      totalDurationMs: autoBookResult.totalDurationMs
    });
    
    // Test 2: Get a recent trip ID from database
    console.log('\n2️⃣ Getting recent trip ID from database...');
    const tripResponse = await fetch(`${SUPABASE_URL}/rest/v1/trip_requests?select=id,destination_location_code,created_at&order=created_at.desc&limit=1`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const trips = await tripResponse.json();
    
    if (trips.length > 0) {
      const tripId = trips[0].id;
      const destination = trips[0].destination_location_code;
      console.log(`Found recent trip: ${tripId} (destination: ${destination})`);
      
      // Test 3: Call edge function with specific trip ID
      console.log('\n3️⃣ Testing with specific trip ID...');
      const specificResponse = await fetch(`${SUPABASE_URL}/functions/v1/flight-search`, {
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
      
      const specificResult = await specificResponse.json();
      console.log('Specific trip result:', {
        requestsProcessed: specificResult.requestsProcessed,
        matchesInserted: specificResult.matchesInserted,
        totalDurationMs: specificResult.totalDurationMs,
        details: specificResult.details
      });
      
      // Test 4: Check if offers were created
      console.log('\n4️⃣ Checking database for offers...');
      const offersResponse = await fetch(`${SUPABASE_URL}/rest/v1/flight_offers?trip_request_id=eq.${tripId}&select=*`, {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        }
      });
      
      const offers = await offersResponse.json();
      console.log(`Database offers count: ${offers.length}`);
      
      if (offers.length > 0) {
        console.log('Sample offer:', {
          price: offers[0].price,
          origin: offers[0].origin_airport,
          destination: offers[0].destination_airport,
          airline: offers[0].airline
        });
      }
      
      // Diagnosis
      console.log('\n🩺 DIAGNOSIS:');
      if (specificResult.requestsProcessed === 0) {
        console.log('❌ Edge function did not process the trip request');
      } else if (specificResult.matchesInserted === 0) {
        console.log('⚠️  Edge function processed request but found no matches');
        if (specificResult.details && specificResult.details.length > 0) {
          const detail = specificResult.details[0];
          console.log('   Error:', detail.error);
          console.log('   Offers generated:', detail.offersGenerated);
          console.log('   Exact destination offers:', detail.exactDestinationOffers);
        }
      } else {
        console.log('✅ Edge function found matches!');
      }
      
      if (specificResult.matchesInserted > 0 && offers.length === 0) {
        console.log('🚨 CRITICAL: Edge function reports success but database has no offers!');
        console.log('   This indicates a database insertion problem.');
      } else if (offers.length > 0) {
        console.log('✅ Database contains offers - system working correctly!');
      }
      
    } else {
      console.log('❌ No recent trips found in database');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEdgeFunction();

