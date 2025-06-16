#!/usr/bin/env node

// Immediate Flight Search Test - No Frontend Required
// This tests the complete backend flow without browser dependencies

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const TEST_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

async function testFlightSearch() {
  console.log('🚀 Starting Complete Flight Search Test...');
  
  try {
    // Step 1: Create test user in auth.users (bypass normal auth flow for testing)
    console.log('👤 Creating test auth user...');
    
    const authUserResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_metadata: {
          first_name: 'Test',
          last_name: 'User'
        },
        email: 'test@example.com',
        email_confirm: true,
        user_id: TEST_USER_ID
      })
    });
    
    if (authUserResponse.status === 422) {
      console.log('✅ Auth user already exists, continuing...');
    } else if (!authUserResponse.ok) {
      const error = await authUserResponse.text();
      console.log('⚠️  Auth user creation failed:', error);
      // Continue anyway - user might exist
    } else {
      console.log('✅ Created test auth user');
    }
    
    // Step 2: Create test trip request
    console.log('📝 Creating test trip request...');
    
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
        departure_airports: ['SFO', 'OAK'],
        destination_location_code: 'LAX',
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
      throw new Error(`Failed to create trip request: ${error}`);
    }
    
    const tripData = await tripResponse.json();
    const tripId = tripData[0].id;
    console.log(`✅ Created trip request: ${tripId}`);
    
    // Step 3: Invoke flight search edge function
    console.log('🔍 Invoking flight search edge function...');
    
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
    console.log('✅ Flight search completed successfully');
    
    // Step 4: Check created flight offers
    console.log('📊 Checking for flight offers in database...');
    
    const offersResponse = await fetch(`${SUPABASE_URL}/rest/v1/flight_offers?trip_request_id=eq.${tripId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const offers = await offersResponse.json();
    
    // Step 5: Check flight matches
    console.log('🎯 Checking for flight matches...');
    
    const matchesResponse = await fetch(`${SUPABASE_URL}/rest/v1/flight_matches?trip_request_id=eq.${tripId}&select=*`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      }
    });
    
    const matches = await matchesResponse.json();
    
    // Results Summary
    console.log('\n📋 TEST RESULTS SUMMARY:');
    console.log('================================');
    console.log(`Trip Request ID: ${tripId}`);
    console.log(`Requests Processed: ${searchResult.requestsProcessed}`);
    console.log(`Matches Inserted: ${searchResult.matchesInserted}`);
    console.log(`Flight Offers in DB: ${offers.length}`);
    console.log(`Flight Matches in DB: ${matches.length}`);
    console.log(`Pool A (Best): ${searchResult.poolA ? searchResult.poolA.length : 0}`);
    console.log(`Pool B (Good): ${searchResult.poolB ? searchResult.poolB.length : 0}`);
    console.log(`Pool C (Backup): ${searchResult.poolC ? searchResult.poolC.length : 0}`);
    
    // Detailed Analysis
    if (searchResult.details && searchResult.details.length > 0) {
      console.log('\n🔍 SEARCH DETAILS:');
      searchResult.details.forEach((detail, index) => {
        console.log(`\nRequest ${index + 1}:`);
        console.log(`- Trip ID: ${detail.tripRequestId}`);
        console.log(`- Matches Found: ${detail.matchesFound}`);
        console.log(`- Offers Generated: ${detail.offersGenerated || 'N/A'}`);
        console.log(`- Exact Destination Offers: ${detail.exactDestinationOffers || 'N/A'}`);
        console.log(`- Offers After Filters: ${detail.offersAfterAllFilters || 'N/A'}`);
        if (detail.error) {
          console.log(`- Error: ${detail.error}`);
        }
        if (detail.filteringDetails) {
          console.log(`- Filtering Details: ${detail.filteringDetails}`);
        }
      });
    }
    
    // Sample offers
    if (offers.length > 0) {
      console.log('\n✈️  SAMPLE FLIGHT OFFERS:');
      offers.slice(0, 3).forEach((offer, index) => {
        console.log(`\nOffer ${index + 1}:`);
        console.log(`- Price: $${offer.price}`);
        console.log(`- Route: ${offer.origin_airport} → ${offer.destination_airport}`);
        console.log(`- Airline: ${offer.airline} ${offer.flight_number}`);
        console.log(`- Departure: ${offer.departure_date} ${offer.departure_time}`);
        console.log(`- Return: ${offer.return_date} ${offer.return_time}`);
        console.log(`- Nonstop: ${offer.nonstop_match}`);
        console.log(`- Baggage Included: ${offer.baggage_included}`);
      });
    }
    
    // Diagnosis
    console.log('\n🩺 DIAGNOSIS:');
    if (searchResult.requestsProcessed === 0) {
      console.log('❌ No requests were processed - check trip request creation');
    } else if (searchResult.matchesInserted === 0) {
      console.log('⚠️  Requests processed but no matches - check search criteria and API response');
    } else {
      console.log('✅ Flight search working correctly!');
    }
    
    if (offers.length === 0) {
      console.log('❌ No flight offers in database - check edge function logic');
    } else {
      console.log('✅ Flight offers successfully created in database');
    }
    
    console.log('\n🎉 Test completed successfully!');
    
    return {
      tripId,
      searchResult,
      offers,
      matches
    };
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return null;
  }
}

// Run the test immediately
testFlightSearch();

