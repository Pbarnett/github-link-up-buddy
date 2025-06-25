#!/usr/bin/env node

/**
 * Simple integration test for Amadeus API
 * Run with: node scripts/test-amadeus-integration.js
 * 
 * This tests the real Amadeus API to verify our integration works
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com';

async function getAmadeusToken() {
  console.log('🔑 Getting Amadeus access token...');
  
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

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token fetch failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`✅ Token received, expires in ${data.expires_in} seconds`);
  return data.access_token;
}

async function searchFlights(token) {
  console.log('🔍 Searching flights NYC to LAX...');
  
  // Use a known working route for testing
  const searchParams = new URLSearchParams({
    originLocationCode: 'NYC',
    destinationLocationCode: 'LAX', 
    departureDate: '2024-12-15', // Future date
    adults: '1',
    max: '3', // Limit results for testing
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
    throw new Error(`Flight search failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.data?.length || 0} flight offers`);
  
  if (data.data && data.data.length > 0) {
    const offer = data.data[0];
    console.log('📄 Sample offer structure:');
    console.log(`   ID: ${offer.id}`);
    console.log(`   Price: ${offer.price.total} ${offer.price.currency}`);
    console.log(`   Itineraries: ${offer.itineraries.length}`);
    console.log(`   First segment: ${offer.itineraries[0].segments[0].departure.iataCode} → ${offer.itineraries[0].segments[0].arrival.iataCode}`);
    console.log(`   Departure: ${offer.itineraries[0].segments[0].departure.at}`);
  }
  
  return data;
}

async function testPricing(token, offer) {
  console.log('💰 Testing flight offers pricing...');
  
  const response = await fetch(`${AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        type: 'flight-offers-pricing',
        flightOffers: [offer]
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log(`⚠️  Pricing failed (this is normal for stale offers): ${response.status}`);
    return null;
  }

  const data = await response.json();
  console.log(`✅ Pricing confirmed: ${data.data.flightOffers[0].price.total} ${data.data.flightOffers[0].price.currency}`);
  return data;
}

async function main() {
  try {
    console.log('🚀 Starting Amadeus API Integration Test\n');
    
    // Check environment variables
    if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET) {
      throw new Error('Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET environment variables');
    }
    
    console.log(`📡 Using Amadeus API: ${AMADEUS_BASE_URL}`);
    console.log(`🔑 Client ID: ${AMADEUS_CLIENT_ID.substring(0, 8)}...`);
    
    // Test authentication
    const token = await getAmadeusToken();
    
    // Test flight search
    const searchResults = await searchFlights(token);
    
    // Test pricing (optional, might fail for stale offers)
    if (searchResults.data && searchResults.data.length > 0) {
      await testPricing(token, searchResults.data[0]);
    }
    
    console.log('\n🎉 Integration test completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Update edge function to use real API calls');
    console.log('2. Fix data transformation to match Amadeus response');
    console.log('3. Add proper error handling');
    
  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

main();
