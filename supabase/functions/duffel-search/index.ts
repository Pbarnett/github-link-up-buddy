import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY');
const DUFFEL_BASE_URL = 'https://api.duffel.com';

interface SearchRequest {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
  }>;
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
}

console.log('[DuffelSearch] Function initialized');

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (!DUFFEL_API_KEY) {
      throw new Error('DUFFEL_API_KEY not configured');
    }

    const searchParams: SearchRequest = await req.json();
    console.log('[DuffelSearch] Search request:', JSON.stringify(searchParams, null, 2));

    // 1. Create offer request with Duffel
    const offerRequestResponse = await fetch(`${DUFFEL_BASE_URL}/air/offer_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
      },
      body: JSON.stringify({
        data: {
          slices: [
            {
              origin: searchParams.origin,
              destination: searchParams.destination,
              departure_date: searchParams.departure_date,
            },
            ...(searchParams.return_date ? [{
              origin: searchParams.destination,
              destination: searchParams.origin,
              departure_date: searchParams.return_date,
            }] : []),
          ],
          passengers: searchParams.passengers,
          cabin_class: searchParams.cabin_class || 'economy',
        },
      }),
    });

    if (!offerRequestResponse.ok) {
      const errorText = await offerRequestResponse.text();
      console.error('[DuffelSearch] Offer request failed:', errorText);
      throw new Error(`Duffel offer request failed: ${errorText}`);
    }

    const offerRequestData = await offerRequestResponse.json();
    const offerRequestId = offerRequestData.data.id;
    
    console.log('[DuffelSearch] Offer request created:', offerRequestId);

    // 2. Wait briefly then fetch offers
    await new Promise(resolve => setTimeout(resolve, 2000));

    const offersResponse = await fetch(`${DUFFEL_BASE_URL}/air/offers?offer_request_id=${offerRequestId}&limit=50`, {
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v1',
      },
    });

    if (!offersResponse.ok) {
      const errorText = await offersResponse.text();
      console.error('[DuffelSearch] Offers fetch failed:', errorText);
      throw new Error(`Duffel offers fetch failed: ${errorText}`);
    }

    const offersData = await offersResponse.json();
    let offers = offersData.data || [];
    
    console.log(`[DuffelSearch] Retrieved ${offers.length} offers`);

    // ROUND-TRIP FILTERING: Ensure only true round-trip results for round-trip searches
    if (searchParams.return_date) {
      const beforeFilter = offers.length;
      
      // Filter to ensure offers have both outbound and return slices
      offers = offers.filter((offer: any) => {
        return offer.slices && offer.slices.length === 2;
      });
      
      // Verify proper routing for round-trip
      offers = offers.filter((offer: any) => {
        if (!offer.slices || offer.slices.length !== 2) return false;
        
        const outbound = offer.slices[0];
        const inbound = offer.slices[1];
        
        // Verify outbound goes from origin to destination
        const outboundOrigin = outbound.segments?.[0]?.origin?.iata_code;
        const outboundDestination = outbound.segments?.[outbound.segments.length - 1]?.destination?.iata_code;
        
        // Verify inbound goes from destination back to origin
        const inboundOrigin = inbound.segments?.[0]?.origin?.iata_code;
        const inboundDestination = inbound.segments?.[inbound.segments.length - 1]?.destination?.iata_code;
        
        return (
          outboundOrigin === searchParams.origin &&
          outboundDestination === searchParams.destination &&
          inboundOrigin === searchParams.destination &&
          inboundDestination === searchParams.origin
        );
      });
      
      console.log(`[DuffelSearch] Round-trip filtering: ${beforeFilter} -> ${offers.length} offers (removed ${beforeFilter - offers.length} non-round-trip offers)`);
    } else {
      // For one-way searches, ensure offers have only 1 slice
      const beforeFilter = offers.length;
      offers = offers.filter((offer: any) => {
        return offer.slices && offer.slices.length === 1;
      });
      console.log(`[DuffelSearch] One-way filtering: ${beforeFilter} -> ${offers.length} offers (removed ${beforeFilter - offers.length} multi-slice offers)`);
    }

    // 3. Store offers in flight_offers_v2 table for consistency
    if (offers.length > 0) {
      const transformedOffers = offers.map((offer: any) => ({
        id: offer.id,
        trip_request_id: null, // Will be set by caller if needed
        provider: 'duffel',
        total_amount: parseFloat(offer.total_amount),
        total_currency: offer.total_currency,
        raw_response: offer,
        created_at: new Date().toISOString(),
      }));

      console.log(`[DuffelSearch] Transformed ${transformedOffers.length} offers for storage`);
    }

    return new Response(JSON.stringify({
      success: true,
      offer_request_id: offerRequestId,
      offers: offers,
      count: offers.length,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[DuffelSearch] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
