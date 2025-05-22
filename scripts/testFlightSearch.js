
#!/usr/bin/env node

/**
 * This script manually tests the flight-search edge function
 * by sending a request and verifying the response and database state.
 * 
 * Usage:
 *   node testFlightSearch.js <trip-request-id>
 * 
 * If no trip request ID is provided, the script will use the 
 * TRIP_REQUEST_ID environment variable or exit with an error.
 */

const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Get Supabase URL and anon key from environment or .env file
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get trip request ID from command line or environment
const tripRequestId = process.argv[2] || process.env.TRIP_REQUEST_ID;

if (!tripRequestId) {
  console.error('Error: Trip request ID is required. Provide it as an argument or set TRIP_REQUEST_ID');
  process.exit(1);
}

/**
 * Main test function
 */
async function testFlightSearch() {
  console.log(`Testing flight search for trip request ID: ${tripRequestId}`);
  
  try {
    // First, verify the trip request exists
    const { data: tripRequest, error: tripError } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('id', tripRequestId)
      .single();
    
    if (tripError) {
      console.error('Error fetching trip request:', tripError.message);
      process.exit(1);
    }
    
    if (!tripRequest) {
      console.error(`Trip request with ID ${tripRequestId} not found`);
      process.exit(1);
    }
    
    console.log('Trip request found:', {
      id: tripRequest.id,
      destination: tripRequest.destination_airport,
      departure: tripRequest.departure_airports,
      earliestDeparture: tripRequest.earliest_departure,
      latestDeparture: tripRequest.latest_departure,
      budget: tripRequest.budget
    });
    
    // Check initial state of offers and matches
    const initialOfferCount = await countOffers(tripRequestId);
    const initialMatchCount = await countMatches(tripRequestId);
    
    console.log(`Initial state: ${initialOfferCount} offers, ${initialMatchCount} matches`);
    
    // Invoke the flight search edge function
    console.log('Invoking flight-search edge function...');
    const { data: searchResult, error: invokeError } = await supabase.functions.invoke('flight-search', {
      body: { tripRequestId }
    });
    
    if (invokeError) {
      console.error('Error invoking flight-search:', invokeError);
      process.exit(1);
    }
    
    console.log('Flight search completed:', searchResult);
    
    // Check state after function execution
    const finalOfferCount = await countOffers(tripRequestId);
    const finalMatchCount = await countMatches(tripRequestId);
    
    console.log(`Final state: ${finalOfferCount} offers (${finalOfferCount - initialOfferCount} new), ${finalMatchCount} matches (${finalMatchCount - initialMatchCount} new)`);
    
    // Verify offers were created
    if (finalOfferCount > initialOfferCount) {
      console.log('✅ New offers were created successfully');
      
      // Get the latest offers
      const { data: offers } = await supabase
        .from('flight_offers')
        .select('*')
        .eq('trip_request_id', tripRequestId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      console.log('Latest offers:', offers);
    } else {
      console.log('⚠️ No new offers were created');
    }
    
    // Verify matches were created
    if (finalMatchCount > initialMatchCount) {
      console.log('✅ New matches were created successfully');
      
      // Get the latest matches
      const { data: matches } = await supabase
        .from('flight_matches')
        .select('*')
        .eq('trip_request_id', tripRequestId)
        .order('created_at', { ascending: false })
        .limit(5);
      
      console.log('Latest matches:', matches);
    } else {
      console.log('⚠️ No new matches were created');
    }
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

/**
 * Count offers for a trip request
 */
async function countOffers(tripRequestId) {
  const { count, error } = await supabase
    .from('flight_offers')
    .select('*', { count: 'exact', head: true })
    .eq('trip_request_id', tripRequestId);
  
  if (error) {
    console.error('Error counting offers:', error.message);
    return 0;
  }
  
  return count || 0;
}

/**
 * Count matches for a trip request
 */
async function countMatches(tripRequestId) {
  const { count, error } = await supabase
    .from('flight_matches')
    .select('*', { count: 'exact', head: true })
    .eq('trip_request_id', tripRequestId);
  
  if (error) {
    console.error('Error counting matches:', error.message);
    return 0;
  }
  
  return count || 0;
}

// Run the test
testFlightSearch();
