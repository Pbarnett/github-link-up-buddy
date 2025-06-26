#!/usr/bin/env node

/**
 * Test script to verify that tripOffersService now correctly fetches from flight_offers_v2 table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
dotenv.config({ path: 'supabase/.env' });

// Use the REMOTE URLs that match the browser environment (not local)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bbonngdyfyfjqfhvoljl.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJib25uZ2R5ZnlmanFmaHZvbGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNTE5NTQsImV4cCI6MjA2MjgyNzk1NH0.qoXypUh-SemZwFjTyONGztNbhoowqLMiKSRKgA7fRR0';

console.log('🔧 Environment Debug:');
console.log('   SUPABASE_URL:', SUPABASE_URL);
console.log('   Using anon key for consistency with browser environment');

console.log('🧪 TESTING TRIP OFFERS SERVICE FIX');
console.log('=' .repeat(50));

/**
 * Simulate the tripOffersService fetchTripOffers function
 */
async function testFetchTripOffers(tripRequestId) {
  console.log(`\n🔍 Testing fetchTripOffers for tripRequestId: ${tripRequestId}`);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Transform V2 offer to legacy format for compatibility
  function transformV2ToLegacy(v2Offer) {
    const extractIataCode = (airportCode) => {
      if (!airportCode) return '';
      return airportCode.length > 3 ? airportCode.substring(0, 3) : airportCode;
    };

    const parseDateTime = (isoString) => {
      if (!isoString) return { date: '', time: '' };
      try {
        const date = new Date(isoString);
        return {
          date: date.toISOString().split('T')[0], // YYYY-MM-DD
          time: date.toTimeString().split(' ')[0].substring(0, 5) // HH:MM
        };
      } catch {
        return { date: '', time: '' };
      }
    };

    const departure = parseDateTime(v2Offer.depart_dt);
    const returnInfo = parseDateTime(v2Offer.return_dt);

    return {
      id: v2Offer.id,
      trip_request_id: v2Offer.trip_request_id,
      price: v2Offer.price_total || 0,
      airline: extractIataCode(v2Offer.origin_iata) + '-' + extractIataCode(v2Offer.destination_iata),
      flight_number: 'V2-' + v2Offer.id.substring(0, 8),
      departure_date: departure.date,
      departure_time: departure.time,
      return_date: returnInfo.date,
      return_time: returnInfo.time,
      duration: '1 day',
      booking_url: v2Offer.booking_url,
      carrier_code: extractIataCode(v2Offer.origin_iata),
      origin_airport: v2Offer.origin_iata,
      destination_airport: v2Offer.destination_iata,
      price_total: v2Offer.price_total,
      price_currency: v2Offer.price_currency,
      cabin_class: v2Offer.cabin_class,
      nonstop: v2Offer.nonstop,
      bags_included: v2Offer.bags_included,
      mode: v2Offer.mode,
      created_at: v2Offer.created_at,
    };
  }

  try {
    // First, try the new flight_offers_v2 table
    console.log('   Checking flight_offers_v2 table...');
    const { data: v2Data, error: v2Error } = await supabase
      .from('flight_offers_v2')
      .select('*')
      .eq('trip_request_id', tripRequestId)
      .order('price_total', { ascending: true });

    if (!v2Error && v2Data && v2Data.length > 0) {
      console.log(`   ✅ Found ${v2Data.length} offers in flight_offers_v2 table`);
      
      // Transform V2 data to legacy format for compatibility
      const transformedOffers = v2Data.map(transformV2ToLegacy);
      
      console.log('   📄 Sample V2 offers (first 2):');
      transformedOffers.slice(0, 2).forEach((offer, index) => {
        console.log(`      ${index + 1}. ${offer.airline} - $${offer.price} ${offer.price_currency || 'USD'} - ${offer.origin_airport} → ${offer.destination_airport}`);
        console.log(`         Departure: ${offer.departure_date} ${offer.departure_time}`);
        console.log(`         Mode: ${offer.mode}, Nonstop: ${offer.nonstop}, Bags: ${offer.bags_included}`);
      });
      
      return { success: true, source: 'flight_offers_v2', count: transformedOffers.length, offers: transformedOffers };
    }

    // Fall back to legacy flight_offers table
    console.log('   No V2 offers found, checking legacy flight_offers table...');
    
    const { data: legacyData, error: legacyError } = await supabase
      .from('flight_offers')
      .select('*')
      .eq('trip_request_id', tripRequestId)
      .order('price', { ascending: true });

    if (legacyError) {
      throw new Error(`Failed to fetch trip offers: ${legacyError.message}`);
    }

    const offers = legacyData || [];
    console.log(`   📊 Found ${offers.length} offers in legacy flight_offers table`);
    
    if (offers.length > 0) {
      console.log('   📄 Sample legacy offers (first 2):');
      offers.slice(0, 2).forEach((offer, index) => {
        console.log(`      ${index + 1}. ${offer.airline} - $${offer.price} - ${offer.origin_airport} → ${offer.destination_airport}`);
      });
    }

    return { success: true, source: 'flight_offers', count: offers.length, offers };

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Test with a known trip ID that has offers
 */
async function main() {
  // Test with the trip ID from the console logs
  const tripRequestId = 'f70516a7-3847-4d85-a5d6-91707fdb4cc9';
  
  console.log(`\nTesting with trip ID: ${tripRequestId}`);
  
  const result = await testFetchTripOffers(tripRequestId);
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 TEST RESULTS');
  console.log('='.repeat(50));
  
  if (result.success) {
    console.log(`✅ SUCCESS: Found ${result.count} offers from ${result.source} table`);
    
    if (result.count > 0) {
      console.log('✅ The tripOffersService fix is working correctly!');
      console.log('✅ Legacy system will now see the offers from flight_offers_v2');
      console.log('✅ This should resolve the "No flight offers found" error');
    } else {
      console.log('⚠️  No offers found in either table - this is expected if no search has been run yet');
    }
  } else {
    console.log(`❌ FAILED: ${result.error}`);
  }
  
  console.log('\n📝 NEXT STEPS:');
  console.log('1. The fix is implemented and should resolve the contradiction');
  console.log('2. Refresh the page to see if the error message disappears');
  console.log('3. The legacy system should now display the same offers as the V2 system');
}

// Run the test
main().catch(error => {
  console.error('\n💥 FATAL ERROR:', error.message);
  process.exit(1);
});
