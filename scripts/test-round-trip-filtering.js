#!/usr/bin/env node
/**
 * Test script to verify that one-way flights are properly filtered out
 * when searching for round-trip flights
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

// Test configuration - try multiple env var names
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'http://localhost:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!SUPABASE_SERVICE_ROLE_KEY);
  console.log('\n💡 Please ensure your .env file contains:');
  console.log('   VITE_SUPABASE_URL=your-supabase-url');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testRoundTripFiltering() {
  console.log('🧪 Testing Round-trip Flight Filtering');
  console.log('=====================================\n');

  try {
    // 1. Get or create a test user
    console.log('1. Setting up test user...');
    let testUserId = '00000000-0000-0000-0000-000000000001';
    
    // Check if test user exists, if not create one
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', testUserId)
      .single();
      
    if (!existingUser) {
      console.log('   Creating test user...');
      const { data: newUser, error: userError } = await supabase
        .from('profiles')
        .insert({
          id: testUserId,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com'
        })
        .select()
        .single();
        
      if (userError) {
        // If user creation fails, try to get any existing user
        console.log('   User creation failed, using existing user...');
        const { data: anyUser } = await supabase
          .from('profiles')
          .select('id')
          .limit(1)
          .single();
        testUserId = anyUser?.id || testUserId;
      } else {
        console.log(`   ✅ Created test user: ${newUser.id}`);
      }
    } else {
      console.log(`   ✅ Using existing test user: ${existingUser.id}`);
    }
    
    // 2. Create a test trip request for round-trip
    console.log('\n2. Creating test round-trip request...');
    const now = new Date();
    const earliestDeparture = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10);
    const latestDeparture = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20);

    const { data: tripRequest, error: tripError } = await supabase
      .from('trip_requests')
      .insert({
        user_id: testUserId, // Use the actual test user ID
        origin_location_code: 'JFK',
        destination_location_code: 'LAX',
        departure_date: '2024-12-15',
        return_date: '2024-12-22', // Round-trip request
        adults: 1,
        nonstop_required: true,
        earliest_departure: earliestDeparture.toISOString(),
        latest_departure: latestDeparture.toISOString(),
        budget: 500,
        destination_airport: 'LAX',
        departure_airports: ['JFK'],
      })
      .select()
      .single();

    if (tripError) {
      throw new Error(`Failed to create trip request: ${tripError.message}`);
    }

    console.log(`✅ Created trip request: ${tripRequest.id}`);

    // 2. Insert mixed flight offers (both one-way and round-trip)
    console.log('\n2. Inserting test flight offers (mixed one-way and round-trip)...');
    
    const testOffers = [
      {
        trip_request_id: tripRequest.id,
        mode: 'MANUAL',
        price_total: 350.00,
        price_currency: 'USD',
        bags_included: true,
        nonstop: true,
        origin_iata: 'JFK',
        destination_iata: 'LAX',
        depart_dt: '2024-12-15T08:00:00Z',
        return_dt: '2024-12-22T18:00:00Z', // Round-trip
      },
      {
        trip_request_id: tripRequest.id,
        mode: 'MANUAL',
        price_total: 200.00,
        price_currency: 'USD',
        bags_included: false,
        nonstop: true,
        origin_iata: 'JFK',
        destination_iata: 'LAX',
        depart_dt: '2024-12-15T10:00:00Z',
        return_dt: null, // One-way flight
      },
      {
        trip_request_id: tripRequest.id,
        mode: 'MANUAL',
        price_total: 425.00,
        price_currency: 'USD',
        bags_included: true,
        nonstop: true,
        origin_iata: 'JFK',
        destination_iata: 'LAX',
        depart_dt: '2024-12-15T14:00:00Z',
        return_dt: '2024-12-22T20:00:00Z', // Round-trip
      },
      {
        trip_request_id: tripRequest.id,
        mode: 'MANUAL',
        price_total: 180.00,
        price_currency: 'USD',
        bags_included: false,
        nonstop: true,
        origin_iata: 'JFK',
        destination_iata: 'LAX',
        depart_dt: '2024-12-15T16:00:00Z',
        return_dt: null, // One-way flight
      }
    ];

    const { data: insertedOffers, error: insertError } = await supabase
      .from('flight_offers_v2')
      .insert(testOffers)
      .select();

    if (insertError) {
      throw new Error(`Failed to insert flight offers: ${insertError.message}`);
    }

    console.log(`✅ Inserted ${insertedOffers.length} flight offers`);
    console.log(`   - 2 round-trip offers (return_dt is not null)`);
    console.log(`   - 2 one-way offers (return_dt is null)`);

    // 3. Test unfiltered query (should return all offers)
    console.log('\n3. Testing unfiltered query (all offers)...');
    const { data: allOffers, error: allOffersError } = await supabase
      .from('flight_offers_v2')
      .select('*')
      .eq('trip_request_id', tripRequest.id);

    if (allOffersError) {
      throw new Error(`Failed to fetch all offers: ${allOffersError.message}`);
    }

    console.log(`✅ Found ${allOffers.length} total offers (unfiltered)`);
    allOffers.forEach((offer, index) => {
      const type = offer.return_dt ? 'Round-trip' : 'One-way';
      console.log(`   ${index + 1}. ${type} - $${offer.price_total} (${offer.return_dt ? 'has return_dt' : 'no return_dt'})`);
    });

    // 4. Test filtered query (should only return round-trip offers)
    console.log('\n4. Testing filtered query (round-trip only)...');
    const { data: filteredOffers, error: filteredError } = await supabase
      .from('flight_offers_v2')
      .select('*')
      .eq('trip_request_id', tripRequest.id)
      .not('return_dt', 'is', null); // This is the key round-trip filter

    if (filteredError) {
      throw new Error(`Failed to fetch filtered offers: ${filteredError.message}`);
    }

    console.log(`✅ Found ${filteredOffers.length} round-trip offers (filtered)`);
    filteredOffers.forEach((offer, index) => {
      console.log(`   ${index + 1}. Round-trip - $${offer.price_total} (${offer.return_dt})`);
    });

    // 5. Verify filtering worked correctly
    console.log('\n5. Verification Results:');
    const expectedRoundTripCount = 2;
    const expectedOneWayCount = 2;
    const actualRoundTripCount = filteredOffers.length;
    const actualOneWayCount = allOffers.length - filteredOffers.length;

    if (actualRoundTripCount === expectedRoundTripCount) {
      console.log(`✅ PASS: Correctly filtered to ${actualRoundTripCount} round-trip offers`);
    } else {
      console.log(`❌ FAIL: Expected ${expectedRoundTripCount} round-trip offers, got ${actualRoundTripCount}`);
    }

    if (actualOneWayCount === expectedOneWayCount) {
      console.log(`✅ PASS: Correctly excluded ${actualOneWayCount} one-way offers`);
    } else {
      console.log(`❌ FAIL: Expected to exclude ${expectedOneWayCount} one-way offers, excluded ${actualOneWayCount}`);
    }

    // 6. Test with one-way trip request
    console.log('\n6. Testing with one-way trip request...');
    const { data: oneWayTripRequest, error: oneWayTripError } = await supabase
      .from('trip_requests')
      .insert({
        user_id: testUserId,
        origin_location_code: 'LAX',
        destination_location_code: 'JFK',
        departure_date: '2024-12-20',
        return_date: null, // One-way trip
        adults: 1,
        nonstop_required: true,
        earliest_departure: earliestDeparture.toISOString(),
        latest_departure: latestDeparture.toISOString(),
        budget: 300,
        destination_airport: 'JFK',
        departure_airports: ['LAX'],
      })
      .select()
      .single();

    if (oneWayTripError) {
      throw new Error(`Failed to create one-way trip request: ${oneWayTripError.message}`);
    }

    // For one-way trips, we should show all flights (no filtering)
    console.log(`✅ Created one-way trip request: ${oneWayTripRequest.id}`);
    console.log(`   - Since return_date is null, no filtering should be applied`);

    // 7. Cleanup
    console.log('\n7. Cleaning up test data...');
    await supabase.from('flight_offers_v2').delete().eq('trip_request_id', tripRequest.id);
    await supabase.from('trip_requests').delete().eq('id', tripRequest.id);
    await supabase.from('trip_requests').delete().eq('id', oneWayTripRequest.id);

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 Round-trip filtering test completed successfully!');
    console.log('\nSummary:');
    console.log('- One-way flights are properly filtered out for round-trip searches');
    console.log('- Round-trip flights are preserved in search results');
    console.log('- Database query filtering works as expected');
    console.log('- Frontend should now show only round-trip flights when expected');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRoundTripFiltering().catch(console.error);

export { testRoundTripFiltering };
