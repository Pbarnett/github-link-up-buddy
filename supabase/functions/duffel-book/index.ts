import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const DUFFEL_API_KEY = Deno.env.get('DUFFEL_API_KEY');
const DUFFEL_BASE_URL = 'https://api.duffel.com';

interface BookingRequest {
  offer_id: string;
  trip_request_id: string;
  passengers: Array<{
    title?: string;
    given_name: string;
    family_name: string;
    born_on: string; // YYYY-MM-DD
    email: string;
    phone_number: string;
    gender?: 'M' | 'F';
    type: 'adult' | 'child' | 'infant_without_seat';
  }>;
  payment: {
    type: 'balance'; // Using Duffel credit for sandbox
    amount: string;
    currency: string;
  };
}

console.log('[DuffelBook] Function initialized');

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

    const bookingParams: BookingRequest = await req.json();
    console.log('[DuffelBook] Booking request for offer:', bookingParams.offer_id);

    // 1. First, get the offer details to validate price
    const offerResponse = await fetch(`${DUFFEL_BASE_URL}/air/offers/${bookingParams.offer_id}`, {
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Duffel-Version': 'v1',
      },
    });

    if (!offerResponse.ok) {
      const errorText = await offerResponse.text();
      console.error('[DuffelBook] Offer fetch failed:', errorText);
      throw new Error(`Failed to fetch offer: ${errorText}`);
    }

    const offerData = await offerResponse.json();
    const offer = offerData.data;
    
    console.log('[DuffelBook] Offer details retrieved:', {
      id: offer.id,
      total_amount: offer.total_amount,
      expires_at: offer.expires_at,
    });

    // 2. Check if offer is still valid
    if (new Date(offer.expires_at) < new Date()) {
      throw new Error('Offer has expired');
    }

    // 3. Create Duffel order
    const orderResponse = await fetch(`${DUFFEL_BASE_URL}/air/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_API_KEY}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
      },
      body: JSON.stringify({
        data: {
          type: 'instant',
          selected_offers: [bookingParams.offer_id],
          passengers: bookingParams.passengers,
          payments: [bookingParams.payment],
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('[DuffelBook] Order creation failed:', errorText);
      throw new Error(`Duffel order creation failed: ${errorText}`);
    }

    const orderData = await orderResponse.json();
    const order = orderData.data;
    
    console.log('[DuffelBook] Order created successfully:', {
      id: order.id,
      booking_reference: order.booking_reference,
      total_amount: order.total_amount,
    });

    // 4. Create booking record using the RPC function
    const { data: bookingResult, error: bookingError } = await supabaseClient
      .rpc('rpc_create_duffel_booking', {
        p_trip_request_id: bookingParams.trip_request_id,
        p_flight_offer_id: null, // We'll store the Duffel offer ID in raw data
        p_duffel_payment_intent_id: order.id,
        p_amount: parseFloat(order.total_amount),
        p_currency: order.total_currency,
      });

    if (bookingError) {
      console.error('[DuffelBook] Database booking creation failed:', bookingError);
      throw new Error(`Failed to create booking record: ${bookingError.message}`);
    }

    const bookingId = bookingResult.booking_id;

    // 5. Update booking with order details
    const { error: updateError } = await supabaseClient
      .rpc('rpc_update_duffel_booking', {
        p_booking_id: bookingId,
        p_duffel_order_id: order.id,
        p_pnr: order.booking_reference,
        p_duffel_status: 'order_created',
        p_raw_order: order,
      });

    if (updateError) {
      console.error('[DuffelBook] Booking update failed:', updateError);
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    // 6. Update trip request status
    const { error: tripUpdateError } = await supabaseClient
      .from('trip_requests')
      .update({
        status: 'booked',
        auto_book_enabled: false, // Disable further auto-booking
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingParams.trip_request_id);

    if (tripUpdateError) {
      console.warn('[DuffelBook] Trip request update failed:', tripUpdateError);
      // Non-fatal, booking was successful
    }

    console.log('[DuffelBook] Booking completed successfully');

    return new Response(JSON.stringify({
      success: true,
      booking_id: bookingId,
      duffel_order_id: order.id,
      booking_reference: order.booking_reference,
      total_amount: order.total_amount,
      total_currency: order.total_currency,
      message: 'Booking completed successfully',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[DuffelBook] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
