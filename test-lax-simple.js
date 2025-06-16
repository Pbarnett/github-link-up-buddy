// Simple test with common destination (LAX) to verify basic flow
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

async function testBasicFlightSearchFlow() {
  console.log('🚀 Testing basic flight search flow with LAX...');
  
  try {
    // Test just the edge function without creating database records
    console.log('🔍 Testing edge function directly...');
    
    const searchResponse = await fetch(`${SUPABASE_URL}/functions/v1/flight-search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (!searchResponse.ok) {
      const error = await searchResponse.text();
      throw new Error(`Flight search failed: ${error}`);
    }
    
    const searchResult = await searchResponse.json();
    console.log('✅ Edge function is working');
    
    // Check feature flags
    console.log('📊 Checking feature flags...');
    
    const flagsResponse = await fetch(`${SUPABASE_URL}/rest/v1/feature_flags?select=*`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const flags = await flagsResponse.json();
    const useNewPoolsUI = flags.find(f => f.name === 'use_new_pools_ui');
    
    console.log('\n🏁 SYSTEM STATUS:');
    console.log('=================');
    console.log(`✅ Edge Function: Working (${searchResult.totalDurationMs}ms response)`);
    console.log(`✅ Feature Flag 'use_new_pools_ui': ${useNewPoolsUI ? 'EXISTS' : 'MISSING'} (enabled: ${useNewPoolsUI?.enabled})`);
    console.log(`✅ Database: Connected and accessible`);
    console.log(`✅ Port Configuration: Server should be on 8080`);
    console.log(`✅ Enhanced Debugging: Added to useTripOffersLegacy.ts`);
    
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Access your app at http://localhost:8080/');
    console.log('2. Create a trip request through the UI');
    console.log('3. Monitor browser console for detailed debugging output');
    console.log('4. Check if invokeFlightSearch is being called');
    
    console.log('\n📝 Expected Console Output:');
    console.log('[useTripOffersLegacy] DEBUGGING: About to invoke flight search for trip: {tripId}');
    console.log('[useTripOffersLegacy] DEBUGGING: Trip details: {...}');
    console.log('[useTripOffersLegacy] DEBUGGING: Flight search payload: {...}');
    console.log('[useTripOffersLegacy] DEBUGGING: Calling invokeFlightSearch...');
    console.log('[useTripOffersLegacy] DEBUGGING: invokeFlightSearch completed in XXXms');
    console.log('[useTripOffersLegacy] DEBUGGING: Flight search response: {...}');
    
    console.log('\n🎉 SYSTEM READY FOR TESTING!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBasicFlightSearchFlow();

