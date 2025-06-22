import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock function to simulate Amadeus API calls
async function fetchAmadeusOffers(tripRequestId: string, maxPrice?: number) {
  console.log(`[fetchAmadeusOffers] Simulating API call for tripRequestId: ${tripRequestId}, maxPrice: ${maxPrice}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock offers
  return [
    {
      id: `mock-offer-1-${Date.now()}`,
      mode: 'AUTO' as const,
      price_total: 299.99,
      price_carry_on: 25.00,
      bags_included: false,
      cabin_class: 'ECONOMY',
      nonstop: true,
      origin_iata: 'JFK',
      destination_iata: 'LAX',
      depart_dt: '2024-12-01T10:00:00Z',
      return_dt: '2024-12-10T18:00:00Z',
      seat_pref: 'AISLE'
    },
    {
      id: `mock-offer-2-${Date.now()}`,
      mode: 'AUTO' as const,
      price_total: maxPrice && maxPrice < 400 ? Math.min(maxPrice - 10, 350) : 350.00,
      price_carry_on: 30.00,
      bags_included: true,
      cabin_class: 'ECONOMY',
      nonstop: false,
      origin_iata: 'JFK',
      destination_iata: 'LAX',
      depart_dt: '2024-12-01T14:00:00Z',
      return_dt: '2024-12-10T20:00:00Z',
      seat_pref: 'WINDOW'
    }
  ];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { tripRequestId, maxPrice } = await req.json()

    if (!tripRequestId) {
      return new Response(
        JSON.stringify({ error: 'tripRequestId is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`[flight-search-v2] Starting search for tripRequestId: ${tripRequestId}, maxPrice: ${maxPrice}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch mock offers from "Amadeus API"
    const mockOffers = await fetchAmadeusOffers(tripRequestId, maxPrice);
    
    // Filter offers by maxPrice if specified
    const filteredOffers = maxPrice 
      ? mockOffers.filter(offer => offer.price_total <= maxPrice)
      : mockOffers;

    console.log(`[flight-search-v2] Found ${filteredOffers.length} offers within budget`);

    // Clear existing offers for this trip request to simulate fresh search
    const { error: deleteError } = await supabase
      .from('flight_offers_v2')
      .delete()
      .eq('trip_request_id', tripRequestId);

    if (deleteError) {
      console.error('[flight-search-v2] Error clearing existing offers:', deleteError);
    }

    // Insert new offers into flight_offers_v2 table
    const offersToInsert = filteredOffers.map(offer => ({
      trip_request_id: tripRequestId,
      mode: offer.mode,
      price_total: offer.price_total,
      price_carry_on: offer.price_carry_on,
      bags_included: offer.bags_included,
      cabin_class: offer.cabin_class,
      nonstop: offer.nonstop,
      origin_iata: offer.origin_iata,
      destination_iata: offer.destination_iata,
      depart_dt: offer.depart_dt,
      return_dt: offer.return_dt,
      seat_pref: offer.seat_pref
    }));

    const { data, error } = await supabase
      .from('flight_offers_v2')
      .insert(offersToInsert)
      .select();

    if (error) {
      console.error('[flight-search-v2] Error inserting offers:', error);
      return new Response(
        JSON.stringify({ error: `Failed to insert offers: ${error.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const insertedCount = data?.length || 0;
    console.log(`[flight-search-v2] Successfully inserted ${insertedCount} offers`);

    return new Response(
      JSON.stringify({ 
        inserted: insertedCount, 
        message: `Successfully processed ${insertedCount} flight offers` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[flight-search-v2] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
