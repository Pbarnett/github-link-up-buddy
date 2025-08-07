import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_TOKEN_TEST');
const DUFFEL_BASE_URL = 'https://api.duffel.com';

interface TripRequest {
  id: string;
  user_id: string;
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date?: string;
  adults: number;
  nonstop_required: boolean;
  travel_class?: string;
  max_price: number;
  traveler_data?: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    email?: string;
    phone?: string;
    passportNumber?: string;
    nationality?: string;
  };
}

console.log('[AutoBookDuffel] Function initialized');

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let trip: TripRequest | null = null;
  let bookingAttemptId: string | null = null;
  let mainOperationSuccessful = false;
  let duffelOrderId: string | null = null;

  try {
    const body = await req.json();
    trip = body.trip as TripRequest;

    if (!trip?.id) {
      throw new Error('Invalid trip data');
    }

    if (!DUFFEL_API_KEY) {
      throw new Error('DUFFEL_API_TOKEN_TEST not configured');
    }

    console.log(`[AutoBookDuffel] Processing trip ID: ${trip.id}`);

    // 1. Acquire booking lock
    const { data: attemptData, error: attemptError } = await supabaseClient
      .from('booking_attempts')
      .insert({
        trip_request_id: trip.id,
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (attemptError) {
      if (attemptError.code === '23505') {
        console.log(`[AutoBookDuffel] Trip ${trip.id} already being processed`);
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Trip processing already in progress' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`Failed to acquire booking lock: ${attemptError.message}`);
    }

    bookingAttemptId = attemptData.id;
    console.log(`[AutoBookDuffel] Lock acquired: ${bookingAttemptId}`);

    // 2. Validate traveler data
    const traveler = trip.traveler_data;
    const missingFields: string[] = [];

    if (!traveler?.firstName?.trim()) missingFields.push('firstName');
    if (!traveler?.lastName?.trim()) missingFields.push('lastName');
    if (!traveler?.email?.trim()) missingFields.push('email');

    // Check if international travel requires passport
    const originCountry = trip.origin_location_code?.slice(0, 2).toUpperCase();
    const destCountry = trip.destination_location_code?.slice(0, 2).toUpperCase();
    const isInternational = originCountry && destCountry && originCountry !== destCountry;

    if (isInternational && !traveler?.passportNumber?.trim()) {
      missingFields.push('passportNumber');
    }

    if (missingFields.length > 0) {
      const errorMsg = `Missing traveler data: ${missingFields.join(', ')}`;
      console.warn(`[AutoBookDuffel] Validation failed: ${errorMsg}`);
      
      // Update booking attempt
      await supabaseClient
        .from('booking_attempts')
        .update({
          status: 'failed',
          ended_at: new Date().toISOString(),
          error_message: errorMsg,
        })
        .eq('id', bookingAttemptId);

      throw new Error(errorMsg);
    }

    console.log(`[AutoBookDuffel] Traveler data validation passed`);

    // 3. Search for flights with Duffel
    console.log(`[AutoBookDuffel] Searching flights with Duffel...`);
    
    const searchResponse = await fetch(`${DUFFEL_BASE_URL}/air/offer_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
      },
      body: JSON.stringify({
        data: {
          slices: [
            {
              origin: trip.origin_location_code,
              destination: trip.destination_location_code,
              departure_date: trip.departure_date,
            },
            ...(trip.return_date ? [{
              origin: trip.destination_location_code,
              destination: trip.origin_location_code,
              departure_date: trip.return_date,
            }] : []),
          ],
          passengers: Array(trip.adults).fill({ type: 'adult' }),
          cabin_class: trip.travel_class?.toLowerCase() || 'economy',
        },
      }),
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      throw new Error(`Duffel search failed: ${errorText}`);
    }

    const searchData = await searchResponse.json();
    const offerRequestId = searchData.data.id;
    
    // Wait for offers to be processed
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Fetch offers
    const offersResponse = await fetch(`${DUFFEL_BASE_URL}/air/offers?offer_request_id=${offerRequestId}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v2',
      },
    });

    if (!offersResponse.ok) {
      throw new Error('Failed to fetch offers');
    }

    const offersData = await offersResponse.json();
    const offers = offersData.data || [];

    console.log(`[AutoBookDuffel] Found ${offers.length} offers`);

    // 5. Find best offer within budget
    const validOffers = offers.filter((offer: Record<string, unknown>) => {
      const price = parseFloat(offer.total_amount as string);
      return price <= trip.max_price && new Date(offer.expires_at as string) > new Date();
    });

    if (validOffers.length === 0) {
      throw new Error(`No offers found within budget of ${trip.max_price}`);
    }

    // Sort by price and select cheapest
    validOffers.sort((a: Record<string, unknown>, b: Record<string, unknown>) => 
      parseFloat(a.total_amount as string) - parseFloat(b.total_amount as string)
    );
    const selectedOffer = validOffers[0];
    
    console.log(`[AutoBookDuffel] Selected offer: ${selectedOffer.id}, Price: ${selectedOffer.total_amount}`);

    // 6. Create booking with Duffel
    const bookingResponse = await fetch(`${DUFFEL_BASE_URL}/air/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v2',
      },
      body: JSON.stringify({
        data: {
          type: 'instant',
          selected_offers: [selectedOffer.id],
          passengers: [{
            title: 'mr',
            given_name: traveler.firstName,
            family_name: traveler.lastName,
            born_on: traveler.dateOfBirth || '1990-01-01',
            email: traveler.email,
            phone_number: traveler.phone || '+1234567890',
            gender: 'M',
            type: 'adult',
          }],
          payments: [{
            type: 'balance', // Using Duffel sandbox balance
            amount: selectedOffer.total_amount,
            currency: selectedOffer.total_currency,
          }],
        },
      }),
    });

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text();
      throw new Error(`Duffel booking failed: ${errorText}`);
    }

    const bookingData = await bookingResponse.json();
    const order = bookingData.data;
    duffelOrderId = order.id;

    console.log(`[AutoBookDuffel] Booking successful: ${order.id}, Reference: ${order.booking_reference}`);

    // 7. Store booking in database
    const { data: bookingResult, error: bookingError } = await supabaseClient
      .rpc('rpc_create_duffel_booking', {
        p_trip_request_id: trip.id,
        p_flight_offer_id: null,
        p_duffel_payment_intent_id: order.id,
        p_amount: parseFloat(order.total_amount),
        p_currency: order.total_currency,
      });

    if (bookingError) {
      throw new Error(`Failed to create booking record: ${bookingError.message}`);
    }

    // 8. Update booking with order details
    const { error: updateError } = await supabaseClient
      .rpc('rpc_update_duffel_booking', {
        p_booking_id: bookingResult.booking_id,
        p_duffel_order_id: order.id,
        p_pnr: order.booking_reference,
        p_duffel_status: 'order_created',
        p_raw_order: order,
      });

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    // 9. Update trip request
    await supabaseClient
      .from('trip_requests')
      .update({
        status: 'booked',
        auto_book_enabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trip.id);

    mainOperationSuccessful = true;
    console.log(`[AutoBookDuffel] Auto-booking completed successfully for trip: ${trip.id}`);

    return new Response(JSON.stringify({
      success: true,
      trip_id: trip.id,
      duffel_order_id: order.id,
      booking_reference: order.booking_reference,
      total_amount: order.total_amount,
      message: 'Auto-booking completed successfully',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[AutoBookDuffel] Error for trip ${trip?.id}:`, error);

    return new Response(JSON.stringify({
      success: false,
      trip_id: trip?.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } finally {
    // Update booking attempt status
    if (bookingAttemptId) {
      const status = mainOperationSuccessful ? 'completed' : 'failed';
      await supabaseClient
        .from('booking_attempts')
        .update({
          status,
          ended_at: new Date().toISOString(),
          flight_order_id: duffelOrderId,
        })
        .eq('id', bookingAttemptId);
    }
  }
});
