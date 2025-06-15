#!/usr/bin/env deno run --allow-net

/**
 * Simple script to test direct Amadeus API connectivity
 * This bypasses the edge function and tests the API directly
 */

const AMADEUS_CLIENT_ID = Deno.env.get("AMADEUS_CLIENT_ID") || "test_client_id";
const AMADEUS_CLIENT_SECRET = Deno.env.get("AMADEUS_CLIENT_SECRET") || "test_client_secret";
const AMADEUS_BASE_URL = Deno.env.get("AMADEUS_BASE_URL") || "https://test.api.amadeus.com";

console.log("🔍 Testing Amadeus API connectivity...");
console.log(`Base URL: ${AMADEUS_BASE_URL}`);
console.log(`Client ID: ${AMADEUS_CLIENT_ID.substring(0, 8)}...`);

async function testAmadeusConnection() {
  try {
    console.log("\n📡 Attempting to fetch OAuth token...");
    
    const tokenResponse = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_CLIENT_ID,
        client_secret: AMADEUS_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`❌ Token fetch failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
      console.error(`Response: ${errorText}`);
      
      if (tokenResponse.status === 401) {
        console.error("\n🔑 Authentication failed - check your AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET");
      } else if (tokenResponse.status === 429) {
        console.error("\n⏱️ Rate limit exceeded - you may have hit the quota limit");
      }
      return;
    }

    const tokenData = await tokenResponse.json();
    console.log(`✅ Successfully received OAuth token`);
    console.log(`Token type: ${tokenData.token_type}`);
    console.log(`Expires in: ${tokenData.expires_in} seconds`);
    
    // Test a simple API call with the token
    console.log("\n🛫 Testing flight offers search...");
    
    const searchResponse = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?originLocationCode=NYC&destinationLocationCode=MAD&departureDate=2025-09-01&returnDate=2025-09-08&adults=1`, {
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
      },
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`❌ Flight search failed: ${searchResponse.status} ${searchResponse.statusText}`);
      console.error(`Response: ${errorText}`);
      return;
    }

    const searchData = await searchResponse.json();
    console.log(`✅ Flight search successful!`);
    console.log(`Found ${searchData.data?.length || 0} flight offers`);
    
    if (searchData.data && searchData.data.length > 0) {
      const firstOffer = searchData.data[0];
      console.log(`First offer: ${firstOffer.price?.total} ${firstOffer.price?.currency}`);
    }
    
  } catch (error) {
    console.error(`❌ Connection error: ${error.message}`);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error("\n🌐 Network connectivity issue - check internet connection and firewall settings");
    }
  }
}

await testAmadeusConnection();
console.log("\n🏁 Test completed");

