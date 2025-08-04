/**
 * Auto-Book Search Stage - Trip Search Implementation
 * Handles flight search and offer generation for auto-booking pipeline
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import { corsHeaders } from '../_shared/cors.ts';

interface TripSearchRequest {
  tripRequestId: string;
  forceRefresh?: boolean;
  maxResults?: number;
}

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service key
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseServiceKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      supabaseServiceKey
    );

    // Parse request
    const { tripRequestId, forceRefresh = false, maxResults = 10 }: TripSearchRequest = 
      await req.json();

    console.log(`Starting auto-book search for trip ${tripRequestId}`);

    // Get trip request details
    const { data: tripRequest, error: tripError } = await supabase
      .from('trip_requests')
      .select('*')
      .eq('id', tripRequestId)
      .single();

    if (tripError || !tripRequest) {
      throw new Error(`Trip request not found: ${tripError?.message}`);
    }

    // Verify auto-booking is enabled
    if (!tripRequest.auto_book_enabled) {
      throw new Error('Auto-booking is not enabled for this trip request');
    }

    // Check if we already have recent offers (unless forcing refresh)
    if (!forceRefresh) {
      const { data: existingOffers, error: offersError } = await supabase
        .from('flight_offers')
        .select('count(*)')
        .eq('trip_request_id', tripRequestId)
        .gt('expires_at', new Date().toISOString())
        .gt('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()); // 30 minutes ago

      if (!offersError && existingOffers && existingOffers[0]?.count > 0) {
        console.log('Recent offers found, skipping search');
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Recent offers already exist',
            offersFound: existingOffers[0].count
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        );
      }
    }

    // Build search parameters
    const searchParams: FlightSearchParams = {
      origin: tripRequest.origin_code,
      destination: tripRequest.destination_code,
      departureDate: tripRequest.departure_date,
      returnDate: tripRequest.return_date,
      passengers: tripRequest.passenger_count || 1,
      cabinClass: tripRequest.cabin_class || 'economy'
    };

    console.log('Search parameters:', searchParams);

    // Perform flight search using Duffel API
    const offers = await searchFlightOffers(searchParams, maxResults);
    
    if (!offers || offers.length === 0) {
      // Update trip status to indicate no offers found
      await supabase
        .from('trip_requests')
        .update({
          auto_book_status: 'FAILED',
          last_checked_at: new Date().toISOString()
        })
        .eq('id', tripRequestId);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'No flight offers found',
          tripRequestId
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Store offers in database
    const offersToInsert = offers.map(offer => ({
      trip_request_id: tripRequestId,
      external_offer_id: offer.id,
      price_total: parseFloat(offer.total_amount),
      currency: offer.total_currency,
      cabin_class: offer.cabin_class || 'economy',
      bags_included: offer.bags_included || false,
      duration_minutes: offer.duration_minutes || 0,
      stops: offer.stops || 0,
      airline_name: offer.airline_name || 'Unknown',
      expires_at: offer.expires_at || new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min default
      raw_offer_data: offer
    }));

    const { data: insertedOffers, error: insertError } = await supabase
      .from('flight_offers')
      .insert(offersToInsert)
      .select('id, price_total, airline_name');

    if (insertError) {
      console.error('Failed to insert offers:', insertError);
      throw new Error(`Failed to store offers: ${insertError.message}`);
    }

    console.log(`Inserted ${insertedOffers.length} offers`);

    // Update trip request status
    await supabase
      .from('trip_requests')
      .update({
        auto_book_status: 'PENDING', // Ready for offer selection
        last_checked_at: new Date().toISOString()
      })
      .eq('id', tripRequestId);

    // Trigger offer selection if auto-booking is still enabled
    if (tripRequest.auto_book_enabled) {
      // This could trigger the next stage via Redis queue or direct call
      console.log('Triggering offer selection stage...');
      
      // For now, we'll use a simple HTTP call to the next stage
      // In production, you might use Redis queue or Supabase pg_net
      try {
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/auto-book-monitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ tripRequestId, action: 'select_offer' })
        });
      } catch (callError) {
        console.warn('Failed to trigger next stage:', callError);
        // Non-fatal - monitoring loop will pick it up
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Flight search completed',
        tripRequestId,
        offersFound: insertedOffers.length,
        offers: insertedOffers.map(o => ({
          id: o.id,
          price: o.price_total,
          airline: o.airline_name
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Auto-book search error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

/**
 * Search flight offers using Duffel API
 * This is a simplified version - in production you'd use the full DuffelService
 */
async function searchFlightOffers(
  params: FlightSearchParams,
  maxResults: number = 10
): Promise<any[]> {
  const duffelApiKey = Deno.env.get('DUFFEL_API_TOKEN');
  if (!duffelApiKey) {
    throw new Error('Missing DUFFEL_API_TOKEN');
  }

  try {
    const searchBody = {
      data: {
        slices: [
          {
            origin: params.origin,
            destination: params.destination,
            departure_date: params.departureDate
          }
        ],
        passengers: Array(params.passengers).fill({
          type: 'adult'
        }),
        cabin_class: params.cabinClass || 'economy',
        max_connections: 2 // Allow up to 2 stops
      }
    };

    // Add return slice if round trip
    if (params.returnDate) {
      searchBody.data.slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate
      });
    }

    console.log('Calling Duffel API with:', JSON.stringify(searchBody, null, 2));

    const response = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelApiKey}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2'
      },
      body: JSON.stringify(searchBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Duffel API error:', response.status, errorText);
      throw new Error(`Duffel API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log(`Duffel search returned ${result.data?.offers?.length || 0} offers`);

    // Transform Duffel offers to our format
    const offers = (result.data?.offers || [])
      .slice(0, maxResults)
      .map((offer: any) => {
        // Calculate basic stats from Duffel offer
        const totalDuration = offer.slices?.reduce((total: number, slice: any) => {
          return total + (slice.duration ? parseInt(slice.duration.replace(/[^\d]/g, '')) : 0);
        }, 0) || 0;

        const totalStops = offer.slices?.reduce((total: number, slice: any) => {
          return total + (slice.segments?.length - 1 || 0);
        }, 0) || 0;

        const mainAirline = offer.slices?.[0]?.segments?.[0]?.marketing_carrier?.name || 'Unknown';

        // Check if bags are included (simplified check)
        const bagsIncluded = offer.services?.some((service: any) => 
          service.type === 'baggage' && parseInt(service.quantity) > 0
        ) || false;

        return {
          id: offer.id,
          total_amount: offer.total_amount,
          total_currency: offer.total_currency,
          cabin_class: params.cabinClass,
          bags_included: bagsIncluded,
          duration_minutes: totalDuration,
          stops: totalStops,
          airline_name: mainAirline,
          expires_at: offer.expires_at,
          ...offer // Include full Duffel offer data
        };
      });

    return offers;

  } catch (error) {
    console.error('Flight search error:', error);
    throw error;
  }
}
