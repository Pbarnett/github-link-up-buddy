#!/usr/bin/env node

/**
 * Amadeus API Integration Debugging and Test Plan
 * Run with: node scripts/test-flight-search-debug.js
 * 
 * This script implements the debugging checklist from the provided analysis:
 * 1. Verify Environment Setup
 * 2. Local Edge Function Test
 * 3. Direct Amadeus API Call
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Using built-in fetch (Node.js 18+)

// Load environment variables from both root and supabase directories
dotenv.config({ path: '.env' });
dotenv.config({ path: 'supabase/.env' });

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID || process.env.AMADEUS_API_KEY;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET || process.env.AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

console.log('🔧 AMADEUS API INTEGRATION DEBUGGING AND TEST PLAN');
console.log('=' .repeat(60));

/**
 * Step 1: Verify Environment Setup
 */
async function verifyEnvironmentSetup() {
  console.log('\n📋 STEP 1: VERIFY ENVIRONMENT SETUP');
  console.log('-'.repeat(40));
  
  console.log('Environment Variables Check:');
  console.log(`✓ AMADEUS_BASE_URL: ${AMADEUS_BASE_URL}`);
  console.log(`${AMADEUS_CLIENT_ID ? '✓' : '❌'} AMADEUS_CLIENT_ID: ${AMADEUS_CLIENT_ID ? AMADEUS_CLIENT_ID.substring(0, 8) + '...' : 'NOT SET'}`);
  console.log(`${AMADEUS_CLIENT_SECRET ? '✓' : '❌'} AMADEUS_CLIENT_SECRET: ${AMADEUS_CLIENT_SECRET ? AMADEUS_CLIENT_SECRET.substring(0, 8) + '...' : 'NOT SET'}`);
  console.log(`${SUPABASE_URL ? '✓' : '❌'} SUPABASE_URL: ${SUPABASE_URL}`);
  console.log(`${SUPABASE_SERVICE_ROLE_KEY ? '✓' : '❌'} SUPABASE_SERVICE_ROLE_KEY: ${SUPABASE_SERVICE_ROLE_KEY ? SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'NOT SET'}`);
  
  // Check for mock/placeholder values
  const hasMockValues = 
    AMADEUS_CLIENT_ID === 'test_client_id' ||
    AMADEUS_CLIENT_SECRET === 'test_client_secret' ||
    AMADEUS_CLIENT_ID === 'mock' ||
    AMADEUS_CLIENT_SECRET === 'mock';
    
  if (hasMockValues) {
    console.log('\n❌ CRITICAL ISSUE: Mock/placeholder credentials detected!');
    console.log('   The function is using placeholder values instead of real sandbox credentials.');
    console.log('   This explains the "invalid_client" authentication error.');
    return false;
  }
  
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
    console.log('\n❌ CRITICAL ISSUE: Missing required Amadeus credentials!');
    return false;
  }
  
  console.log('\n✅ Environment setup looks correct');
  return true;
}

/**
 * Step 2: Direct Amadeus API Call
 */
async function directAmadeusApiCall() {
  console.log('\n📡 STEP 2: DIRECT AMADEUS API CALL');
  console.log('-'.repeat(40));
  
  try {
    console.log('Testing OAuth token request...');
    
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.log(`❌ Amadeus authentication failed: ${response.status} ${response.statusText}`);
      console.log(`   Response: ${responseText}`);
      
      if (response.status === 401 && responseText.includes('invalid_client')) {
        console.log('\n🔍 DIAGNOSIS: "invalid_client" error indicates:');
        console.log('   - The client ID/secret pair is not recognized by Amadeus');
        console.log('   - You may be using placeholder/mock credentials');
        console.log('   - The credentials might be for the wrong environment (prod vs sandbox)');
        console.log('   - There might be a typo in the credentials');
      }
      
      return null;
    }
    
    const data = JSON.parse(responseText);
    console.log(`✅ Successfully obtained access token`);
    console.log(`   Token type: ${data.token_type}`);
    console.log(`   Expires in: ${data.expires_in} seconds`);
    console.log(`   Application name: ${data.application_name || 'Unknown'}`);
    
    return data.access_token;
    
  } catch (error) {
    console.log(`❌ Network error during Amadeus API call: ${error.message}`);
    return null;
  }
}

/**
 * Step 3: Test Flight Search with Valid Token
 */
async function testFlightSearch(token) {
  console.log('\n🔍 STEP 3: TEST FLIGHT SEARCH');
  console.log('-'.repeat(40));
  
  try {
    console.log('Searching for flights NYC → LAX...');
    
    // Use a future date (30 days from now)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const departureDateStr = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const searchParams = new URLSearchParams({
      originLocationCode: 'NYC',
      destinationLocationCode: 'LAX',
      departureDate: departureDateStr,
      adults: '1',
      max: '3',
    });
    
    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Flight search failed: ${response.status} ${response.statusText}`);
      console.log(`   Response: ${errorText}`);
      return false;
    }
    
    const data = await response.json();
    const offers = data.data || [];
    
    console.log(`✅ Successfully retrieved ${offers.length} flight offers`);
    
    if (offers.length > 0) {
      const offer = offers[0];
      console.log('\n📄 Sample offer:');
      console.log(`   Offer ID: ${offer.id}`);
      console.log(`   Price: ${offer.price.total} ${offer.price.currency}`);
      console.log(`   Route: ${offer.itineraries[0].segments[0].departure.iataCode} → ${offer.itineraries[0].segments[0].arrival.iataCode}`);
      console.log(`   Departure: ${offer.itineraries[0].segments[0].departure.at}`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ Error during flight search: ${error.message}`);
    return false;
  }
}

/**
 * Step 4: Local Edge Function Test
 */
async function localEdgeFunctionTest() {
  console.log('\n🚀 STEP 4: LOCAL EDGE FUNCTION TEST');
  console.log('-'.repeat(40));
  
  try {
    // First, create a mock trip request if it doesn't exist
    console.log('Setting up test data...');
    
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Use a future date (30 days from now) for the trip request
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const departureDateStr = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Generate UUIDs for trip and user
    const tripId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // Valid UUID format
    const userId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef'; // Valid user UUID
    
    // Create earliest and latest departure timestamps
    const earliestDeparture = new Date(departureDateStr + 'T00:00:00Z').toISOString();
    const latestDeparture = new Date(departureDateStr + 'T23:59:59Z').toISOString();
    
    // Create a test trip request with all required fields
    const { data: tripData, error: tripError } = await supabaseClient
      .from('trip_requests')
      .upsert({
        id: tripId,
        user_id: userId,
        earliest_departure: earliestDeparture,
        latest_departure: latestDeparture,
        budget: 500, // Required budget field
        departure_airports: ['JFK', 'LGA', 'EWR'], // Required array field
        destination_location_code: 'LAX', // Required destination
        origin_location_code: 'NYC',
        departure_date: departureDateStr,
        return_date: null,
        adults: 1,
        nonstop_required: false,
        auto_book_enabled: false,
        baggage_included_required: false,
        search_mode: 'AUTO',
        created_at: new Date().toISOString(),
      }, { onConflict: 'id' })
      .select()
      .single();
    
    if (tripError) {
      console.log(`⚠️  Could not create test trip request: ${tripError.message}`);
      console.log('   This might be expected if the table doesn\'t exist yet');
    } else {
      console.log(`✅ Test trip request ready: ${tripData.id}`);
    }
    
    console.log('\nTesting flight-search-v2 edge function...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flight-search-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        tripRequestId: tripId,
        maxPrice: 500
      }),
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.log(`❌ Edge function call failed: ${response.status} ${response.statusText}`);
      console.log(`   Response: ${responseText}`);
      
      if (responseText.includes('invalid_client')) {
        console.log('\n🔍 DIAGNOSIS: The edge function is still using invalid credentials');
        console.log('   This confirms the environment variables are not properly set in the function');
      }
      
      return false;
    }
    
    const data = JSON.parse(responseText);
    console.log(`✅ Edge function executed successfully`);
    console.log(`   Inserted ${data.inserted} flight offers`);
    console.log(`   Message: ${data.message}`);
    
    return true;
    
  } catch (error) {
    console.log(`❌ Error during edge function test: ${error.message}`);
    return false;
  }
}

/**
 * Step 5: Mock Data Mode Check
 */
function checkMockDataMode() {
  console.log('\n🎭 STEP 5: MOCK DATA MODE ANALYSIS');
  console.log('-'.repeat(40));
  
  console.log('Current Status:');
  console.log('❌ The flight-search-v2 function does NOT have a built-in mock mode');
  console.log('❌ Mock data is only available in test scripts (test-amadeus-integration-mock.js)');
  console.log('❌ Both Warp AI and Lovable must use real API calls for end-to-end testing');
  
  console.log('\nRecommendations:');
  console.log('1. Ensure sandbox credentials are configured correctly for testing');
  console.log('2. Consider implementing a mock mode flag in the edge function');
  console.log('3. Use the existing mock test script for offline development');
  
  console.log('\nAvailable Mock Test Script:');
  console.log('   Location: scripts/test-amadeus-integration-mock.js');
  console.log('   Usage: For local testing without API quota consumption');
}

/**
 * Main debugging function
 */
async function main() {
  console.log('Starting comprehensive debugging process...\n');
  
  let allPassed = true;
  
  // Step 1: Environment verification
  const envOk = await verifyEnvironmentSetup();
  allPassed = allPassed && envOk;
  
  if (!envOk) {
    console.log('\n🛑 STOPPING: Environment issues must be fixed first');
    console.log('\nIMMEDIATE FIX REQUIRED:');
    console.log('1. Update supabase/.env with real sandbox credentials:');
    console.log('   AMADEUS_CLIENT_ID=8zOO8pGvMqZBQexvFTGbf0fBGG15R0xV');
    console.log('   AMADEUS_CLIENT_SECRET=mk2wZGGLmUcyrL14... (complete secret)');
    console.log('2. Restart local Supabase functions environment');
    console.log('3. Re-run this debugging script');
    process.exit(1);
  }
  
  // Step 2: Direct API test
  const token = await directAmadeusApiCall();
  if (!token) {
    allPassed = false;
  } else {
    // Step 3: Flight search test
    const searchOk = await testFlightSearch(token);
    allPassed = allPassed && searchOk;
  }
  
  // Step 4: Edge function test
  const functionOk = await localEdgeFunctionTest();
  allPassed = allPassed && functionOk;
  
  // Step 5: Mock data analysis
  checkMockDataMode();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🏁 DEBUGGING SUMMARY');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('✅ Amadeus API integration is working correctly');
    console.log('✅ Edge function can successfully fetch and store flight offers');
    console.log('\nNext Steps:');
    console.log('1. Both Warp AI and Lovable can now test the integration');
    console.log('2. Consider implementing optional mock mode for offline testing');
    console.log('3. Add additional error handling and edge cases');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('❌ Check the error messages above for specific issues');
    console.log('\nCommon Issues:');
    console.log('1. Invalid or placeholder credentials');
    console.log('2. Environment variables not properly loaded');
    console.log('3. Network connectivity issues');
    console.log('4. Database schema mismatches');
  }
  
  console.log('\nFor support, review the error messages and:');
  console.log('1. Verify credentials in supabase/.env');
  console.log('2. Ensure local Supabase is running');
  console.log('3. Check database table schemas');
}

// Run the debugging script
main().catch(error => {
  console.error('\n💥 FATAL ERROR:', error.message);
  process.exit(1);
});
