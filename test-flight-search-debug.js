#!/usr/bin/env node

/**
 * Comprehensive Debug Test Plan for flight-search-v2
 * Tests both mock and real Amadeus API integration
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: 'supabase/.env' });

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Test trip request ID from your database
const TEST_TRIP_ID = '776a3f30-4c31-4f6e-ace2-a3db8b1a8edf';

// Colors for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEnvironmentVariables() {
  log('cyan', '\n🔧 TESTING ENVIRONMENT VARIABLES');
  log('blue', '=' .repeat(50));
  
  const envVars = {
    'AMADEUS_CLIENT_ID': process.env.AMADEUS_CLIENT_ID,
    'AMADEUS_CLIENT_SECRET': process.env.AMADEUS_CLIENT_SECRET,
    'AMADEUS_BASE_URL': process.env.AMADEUS_BASE_URL,
    'TEST_MODE': process.env.TEST_MODE
  };
  
  for (const [key, value] of Object.entries(envVars)) {
    if (value) {
      if (key.includes('SECRET')) {
        log('green', `✅ ${key}: ${value.substring(0, 4)}...`);
      } else {
        log('green', `✅ ${key}: ${value}`);
      }
    } else {
      log('red', `❌ ${key}: NOT SET`);
    }
  }
  
  // Environment analysis
  const usingTestCredentials = process.env.AMADEUS_CLIENT_ID === 'test_client_id';
  const baseUrl = process.env.AMADEUS_BASE_URL;
  
  log('yellow', '\n📊 ENVIRONMENT ANALYSIS:');
  log('blue', `🏷️  Credentials Type: ${usingTestCredentials ? 'MOCK/TEST' : 'REAL'}`);
  log('blue', `🌐 API Environment: ${baseUrl?.includes('test.api') ? 'SANDBOX' : 'UNKNOWN'}`);
  log('blue', `🔨 Test Mode: ${process.env.TEST_MODE === 'true' ? 'ENABLED' : 'DISABLED'}`);
  
  return {
    hasCredentials: !usingTestCredentials,
    isSandbox: baseUrl?.includes('test.api'),
    isTestMode: process.env.TEST_MODE === 'true'
  };
}

async function testDatabaseConnection() {
  log('cyan', '\n🗄️  TESTING DATABASE CONNECTION');
  log('blue', '=' .repeat(50));
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/trip_requests?id=eq.${TEST_TRIP_ID}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Database query failed: ${response.status}`);
    }
    
    const data = await response.json();
    log('green', `✅ Database connection successful`);
    
    if (data.length > 0) {
      const trip = data[0];
      log('green', `✅ Trip request found: ${trip.id}`);
      log('blue', `   Origin: ${trip.origin_location_code || 'NOT SET'}`);
      log('blue', `   Destination: ${trip.destination_location_code || 'NOT SET'}`);
      log('blue', `   Departure: ${trip.departure_date || 'NOT SET'}`);
      
      const hasRequiredData = trip.origin_location_code && trip.destination_location_code && trip.departure_date;
      if (!hasRequiredData) {
        log('red', '❌ Trip request missing required flight search data');
        return { connected: true, hasValidTrip: false };
      }
      log('green', '✅ Trip request has all required data');
      return { connected: true, hasValidTrip: true };
    } else {
      log('red', `❌ Trip request ${TEST_TRIP_ID} not found`);
      return { connected: true, hasValidTrip: false };
    }
  } catch (error) {
    log('red', `❌ Database connection failed: ${error.message}`);
    return { connected: false, hasValidTrip: false };
  }
}

async function testEdgeFunctionWithMockData() {
  log('cyan', '\n🎭 TESTING EDGE FUNCTION WITH MOCK DATA');
  log('blue', '=' .repeat(50));
  
  // This would require modifying the edge function to support mock mode
  // For now, we'll test the structure and response format
  
  const mockPayload = {
    tripRequestId: TEST_TRIP_ID,
    mockMode: true // This would need to be added to the edge function
  };
  
  try {
    log('yellow', '🔄 Calling flight-search-v2 with mock mode...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flight-search-v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockPayload)
    });
    
    const responseText = await response.text();
    log('blue', `📡 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      log('green', '✅ Edge function responded successfully');
      log('blue', `   Inserted: ${data.inserted || 0} flight offers`);
      return { success: true, data };
    } else {
      log('red', `❌ Edge function failed: ${response.status}`);
      log('red', `   Error: ${responseText}`);
      return { success: false, error: responseText };
    }
  } catch (error) {
    log('red', `❌ Mock test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAmadeusCredentials() {
  log('cyan', '\n🔑 TESTING AMADEUS API CREDENTIALS');
  log('blue', '=' .repeat(50));
  
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  const baseUrl = process.env.AMADEUS_BASE_URL;
  
  if (!clientId || !clientSecret || !baseUrl) {
    log('red', '❌ Missing Amadeus credentials');
    return { valid: false, error: 'Missing credentials' };
  }
  
  if (clientId === 'test_client_id') {
    log('yellow', '⚠️  Using mock credentials, skipping real API test');
    return { valid: false, error: 'Mock credentials' };
  }
  
  try {
    log('yellow', '🔄 Testing Amadeus token request...');
    
    const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    
    const data = await response.text();
    
    if (response.ok) {
      const tokenData = JSON.parse(data);
      log('green', '✅ Amadeus credentials are valid');
      log('blue', `   Token Type: ${tokenData.type || 'Bearer'}`);
      log('blue', `   Expires In: ${tokenData.expires_in || 'Unknown'} seconds`);
      return { valid: true, token: tokenData.access_token };
    } else {
      log('red', `❌ Amadeus authentication failed: ${response.status}`);
      log('red', `   Error: ${data}`);
      return { valid: false, error: data };
    }
  } catch (error) {
    log('red', `❌ Amadeus test failed: ${error.message}`);
    return { valid: false, error: error.message };
  }
}

async function testEdgeFunctionWithRealAPI() {
  log('cyan', '\n🌐 TESTING EDGE FUNCTION WITH REAL AMADEUS API');
  log('blue', '=' .repeat(50));
  
  const payload = {
    tripRequestId: TEST_TRIP_ID
  };
  
  try {
    log('yellow', '🔄 Calling flight-search-v2 with real API...');
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/flight-search-v2`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const responseText = await response.text();
    log('blue', `📡 Response Status: ${response.status}`);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      log('green', '✅ Real API integration successful');
      log('blue', `   Inserted: ${data.inserted || 0} flight offers`);
      return { success: true, data };
    } else {
      log('red', `❌ Real API integration failed: ${response.status}`);
      log('red', `   Error: ${responseText}`);
      
      // Parse common error types
      if (responseText.includes('invalid_client')) {
        log('yellow', '💡 This is an authentication error - check your Amadeus credentials');
      } else if (responseText.includes('Trip request not found')) {
        log('yellow', '💡 This is a database error - the trip request may be missing required data');
      }
      
      return { success: false, error: responseText };
    }
  } catch (error) {
    log('red', `❌ Real API test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function generateDebugReport(results) {
  log('cyan', '\n📋 DEBUG REPORT SUMMARY');
  log('blue', '=' .repeat(50));
  
  const { env, db, credentials, realApi } = results;
  
  log('yellow', '🔧 ENVIRONMENT STATUS:');
  log(env.hasCredentials ? 'green' : 'red', `   Credentials: ${env.hasCredentials ? 'REAL' : 'MOCK/TEST'}`);
  log(env.isSandbox ? 'green' : 'red', `   Environment: ${env.isSandbox ? 'SANDBOX' : 'UNKNOWN'}`);
  
  log('yellow', '\n🗄️  DATABASE STATUS:');
  log(db.connected ? 'green' : 'red', `   Connection: ${db.connected ? 'SUCCESS' : 'FAILED'}`);
  log(db.hasValidTrip ? 'green' : 'red', `   Trip Data: ${db.hasValidTrip ? 'COMPLETE' : 'MISSING'}`);
  
  log('yellow', '\n🔑 AMADEUS API STATUS:');
  log(credentials.valid ? 'green' : 'red', `   Authentication: ${credentials.valid ? 'SUCCESS' : 'FAILED'}`);
  
  log('yellow', '\n🌐 INTEGRATION STATUS:');
  log(realApi.success ? 'green' : 'red', `   Flight Search: ${realApi.success ? 'SUCCESS' : 'FAILED'}`);
  
  // Recommendations
  log('cyan', '\n💡 RECOMMENDATIONS:');
  
  if (!env.hasCredentials) {
    log('yellow', '1. Get real Amadeus API credentials from https://developers.amadeus.com/');
    log('yellow', '2. Update AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in your .env files');
  }
  
  if (!db.hasValidTrip) {
    log('yellow', '3. Fix trip request data - ensure origin_location_code, destination_location_code, and departure_date are set');
  }
  
  if (!credentials.valid && env.hasCredentials) {
    log('yellow', '4. Verify your Amadeus credentials are for the sandbox environment');
    log('yellow', '5. Check that credentials haven\'t expired or been revoked');
  }
  
  if (!realApi.success) {
    log('yellow', '6. Debug the edge function logs for specific error details');
    log('yellow', '7. Consider implementing a fallback to mock data during development');
  }
}

async function main() {
  log('magenta', '🚀 FLIGHT-SEARCH-V2 DEBUG TEST SUITE');
  log('magenta', '=' .repeat(60));
  
  const results = {};
  
  // Test 1: Environment Variables
  results.env = await testEnvironmentVariables();
  
  // Test 2: Database Connection
  results.db = await testDatabaseConnection();
  
  // Test 3: Amadeus Credentials (if real)
  results.credentials = await testAmadeusCredentials();
  
  // Test 4: Mock Data (would need edge function modification)
  // results.mock = await testEdgeFunctionWithMockData();
  
  // Test 5: Real API Integration
  results.realApi = await testEdgeFunctionWithRealAPI();
  
  // Generate comprehensive report
  await generateDebugReport(results);
  
  log('magenta', '\n🏁 DEBUG TEST SUITE COMPLETE');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
