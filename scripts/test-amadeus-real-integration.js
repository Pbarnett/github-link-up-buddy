#!/usr/bin/env node

// scripts/test-amadeus-real-integration.js
// Test script to verify real Amadeus API integration

import process from 'process';

// Check if we have the required environment variables
const requiredEnvVars = [
  'AMADEUS_API_KEY',
  'AMADEUS_API_SECRET',
  'AMADEUS_BASE_URL'
];

console.log('🔍 Checking Amadeus API Integration...\n');

// Check environment variables
let missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  } else {
    console.log(`✅ ${envVar}: ${envVar === 'AMADEUS_API_SECRET' ? '*'.repeat(8) : process.env[envVar]}`);
  }
}

if (missingVars.length > 0) {
  console.log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`);
  console.log('Please set these variables before testing the real API integration.');
  process.exit(1);
}

// Test 1: Token fetch
async function testTokenFetch() {
  console.log('\n🔧 Test 1: Fetching Amadeus Access Token...');
  
  try {
    const response = await fetch(`${process.env.AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token fetch failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Token fetch successful`);
    console.log(`   - Access token: ${data.access_token.substring(0, 20)}...`);
    console.log(`   - Expires in: ${data.expires_in} seconds`);
    
    return data.access_token;
  } catch (error) {
    console.log(`❌ Token fetch failed: ${error.message}`);
    throw error;
  }
}

// Test 2: Flight search
async function testFlightSearch(token) {
  console.log('\n✈️  Test 2: Flight Offers Search...');
  
  const searchParams = new URLSearchParams({
    originLocationCode: 'JFK',
    destinationLocationCode: 'LAX',
    departureDate: '2025-09-15',
    adults: '1',
    max: '3',
  });

  try {
    const response = await fetch(`${process.env.AMADEUS_BASE_URL}/v2/shopping/flight-offers?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Flight search failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ Flight search successful`);
    console.log(`   - Found ${data.data ? data.data.length : 0} flight offers`);
    
    if (data.data && data.data.length > 0) {
      const firstOffer = data.data[0];
      console.log(`   - First offer price: ${firstOffer.price.total} ${firstOffer.price.currency}`);
      console.log(`   - Airline: ${firstOffer.itineraries[0].segments[0].carrierCode}`);
    }
    
    return data;
  } catch (error) {
    console.log(`❌ Flight search failed: ${error.message}`);
    throw error;
  }
}

// Main test function
async function runTests() {
  try {
    const token = await testTokenFetch();
    await testFlightSearch(token);
    
    console.log('\n🎉 All tests passed! Amadeus API integration is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('   1. Set AMADEUS_LIVE=1 to enable real API calls in your edge functions');
    console.log('   2. Test flight search through your application UI');
    console.log('   3. Monitor API usage in your Amadeus dashboard');
    
  } catch (error) {
    console.log('\n💥 Tests failed. Please check your Amadeus API configuration.');
    process.exit(1);
  }
}

// Run tests if this is the main module
runTests();

export { testTokenFetch, testFlightSearch };
