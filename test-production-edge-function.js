// Test Production Edge Function with Real Data
// This tests against your actual production database

const PRODUCTION_SUPABASE_URL = 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SERVICE_ROLE_KEY = 'YOUR_PRODUCTION_SERVICE_ROLE_KEY'; // You need to get this from Supabase Dashboard

async function testProductionEdgeFunction() {
  console.log('🧪 Testing PRODUCTION Edge Function with Real Data...');
  
  try {
    // Use the real trip ID from your SQL results
    const realTripId = '1622800e-9ea8-479b-82c3-c853d061eccf'; // Most recent MVY trip
    
    console.log(`\n🎯 Testing with real trip ID: ${realTripId}`);
    console.log('   Destination: MVY (Martha\'s Vineyard)');
    console.log('   Origin: JFK');
    console.log('   Budget: $1000');
    
    // Test the production edge function
    const response = await fetch(`${PRODUCTION_SUPABASE_URL}/functions/v1/flight-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tripRequestId: realTripId,
        relaxedCriteria: false
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('\n📊 PRODUCTION EDGE FUNCTION RESULTS:');
    console.log('=====================================');
    console.log(`Requests Processed: ${result.requestsProcessed}`);
    console.log(`Matches Inserted: ${result.matchesInserted}`);
    console.log(`Total Duration: ${result.totalDurationMs}ms`);
    console.log(`Exact Destination Only: ${result.exactDestinationOnly}`);
    
    if (result.details && result.details.length > 0) {
      const detail = result.details[0];
      console.log('\n🔍 DETAILED BREAKDOWN:');
      console.log(`- Trip ID: ${detail.tripRequestId}`);
      console.log(`- Offers Generated: ${detail.offersGenerated || 'N/A'}`);
      console.log(`- Exact Destination Offers: ${detail.exactDestinationOffers || 'N/A'}`);
      console.log(`- Offers After All Filters: ${detail.offersAfterAllFilters || 'N/A'}`);
      console.log(`- Matches Found: ${detail.matchesFound}`);
      console.log(`- Error: ${detail.error || 'None'}`);
      
      if (detail.filteringDetails) {
        console.log(`- Filtering Details: ${detail.filteringDetails}`);
      }
    }
    
    // Diagnosis
    console.log('\n🩺 DIAGNOSIS:');
    if (result.requestsProcessed === 0) {
      console.log('❌ Edge function did not process the trip request');
      console.log('   - Check if trip ID exists in production database');
      console.log('   - Check edge function database connection');
    } else if (result.matchesInserted === 0) {
      console.log('⚠️  Edge function processed request but found no matches');
      console.log('   - This means the flight search API is not finding flights to MVY');
      console.log('   - Or all found flights are being filtered out');
      
      if (result.details && result.details[0]) {
        const detail = result.details[0];
        if (detail.offersGenerated === 0) {
          console.log('   🎯 ROOT CAUSE: Amadeus API returns 0 flights for JFK→MVY route');
          console.log('   💡 SOLUTION: Try with a more common destination like LAX or JFK→BOS');
        } else if (detail.exactDestinationOffers === 0) {
          console.log('   🎯 ROOT CAUSE: API finds flights but none to exact MVY destination');
          console.log('   💡 SOLUTION: API may be returning nearby airports (BOS, ACK) instead of MVY');
        } else {
          console.log('   🎯 ROOT CAUSE: Flights found but filtered out by requirements');
          console.log('   💡 SOLUTION: Relax filters (nonstop_required, budget, etc.)');
        }
      }
    } else {
      console.log('✅ Edge function found matches! The system is working.');
      console.log('   - Check if frontend is displaying the offers correctly');
    }
    
    console.log('\n📋 NEXT STEPS:');
    if (result.matchesInserted === 0) {
      console.log('1. Try creating a trip with destination LAX (common route)');
      console.log('2. Check if MVY is a valid airport code in Amadeus API');
      console.log('3. Test with relaxed criteria (relaxedCriteria: true)');
    } else {
      console.log('1. Check if offers appear in Supabase flight_offers table');
      console.log('2. Verify frontend is reading from database correctly');
      console.log('3. Test the complete UI flow');
    }
    
  } catch (error) {
    console.error('❌ Production test failed:', error.message);
    
    if (error.message.includes('SERVICE_ROLE_KEY')) {
      console.log('\n💡 TO FIX: Get your production service role key from:');
      console.log('   1. Go to Supabase Dashboard');
      console.log('   2. Project Settings → API');
      console.log('   3. Copy the "service_role" key');
      console.log('   4. Replace SERVICE_ROLE_KEY in this script');
    }
  }
}

console.log('⚠️  IMPORTANT: You need to add your production service role key to this script!');
console.log('   Get it from: Supabase Dashboard → Project Settings → API → service_role key');
console.log('');

// Uncomment this line after adding your service role key:
// testProductionEdgeFunction();

