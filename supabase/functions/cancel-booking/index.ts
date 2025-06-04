// supabase/functions/cancel-booking/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getAmadeusAccessToken, cancelAmadeusOrder } from '../lib/amadeus.ts'; // HTTP Helpers
import { stripe } from '../lib/stripe.ts'; // Stripe SDK instance (assuming stripe.ts exports it)

// Helper function to get Supabase admin client
const getSupabaseAdmin = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('[CancelBooking] CRITICAL: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
    throw new Error('Server configuration error: Supabase credentials missing.');
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
  });
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let bookingId: string | null = null;
  let authenticatedUserId: string | null = null;
  const supabaseAdmin = getSupabaseAdmin();
  // For invoking send-notification
  const supabaseUrlForInvoke = Deno.env.get('SUPABASE_URL');
  const serviceRoleKeyForInvoke = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');


  try {
    // 1. Get Authenticated User ID (from JWT)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user) {
      console.warn('[CancelBooking] Auth error or no user from token:', userError?.message);
      return new Response(JSON.stringify({ error: 'Authentication failed or user not found' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    authenticatedUserId = user.id;
    console.log(`[CancelBooking] Authenticated user: ${authenticatedUserId}`);

    // 2. Get booking_id from request payload
    const body = await req.json().catch(() => ({})); // Handle non-JSON body gracefully
    bookingId = body.booking_id;
    if (!bookingId || typeof bookingId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid booking_id in request body' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`[CancelBooking] Received request to cancel booking_id: ${bookingId}`);

    // 3. Fetch Booking & Validate Eligibility
    const { data: booking, error: fetchBookingError } = await supabaseAdmin
      .from('bookings')
      .select('id, pnr, user_id, status, created_at, trip_request_id, amadeus_order_id') // Added amadeus_order_id
      .eq('id', bookingId)
      .single();

    if (fetchBookingError) {
      console.error(`[CancelBooking] Error fetching booking ${bookingId}:`, fetchBookingError.message);
      return new Response(JSON.stringify({ error: 'Booking not found or database error' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!booking) { // Should be caught by fetchBookingError with .single(), but good practice
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (booking.user_id !== authenticatedUserId) {
      console.warn(`[CancelBooking] User ${authenticatedUserId} unauthorized to cancel booking ${bookingId} owned by ${booking.user_id}.`);
      return new Response(JSON.stringify({ error: 'Unauthorized to cancel this booking' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (booking.status !== 'ticketed' && booking.status !== 'booked') { // Allow 'booked' or 'ticketed'
      console.log(`[CancelBooking] Booking ${bookingId} not in a cancelable status (current: ${booking.status}).`);
      return new Response(JSON.stringify({ error: `Booking is not in a cancelable state (status: ${booking.status})` }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    const bookingCreatedAt = new Date(booking.created_at).getTime();
    const now = Date.now();
    if (now - bookingCreatedAt > twentyFourHoursInMs) {
      console.log(`[CancelBooking] Booking ${bookingId} created at ${booking.created_at} is outside the 24-hour cancellation window.`);
      return new Response(JSON.stringify({ error: 'Cancellation window has passed (must be within 24 hours of booking)' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`[CancelBooking] Booking ${bookingId} is eligible for cancellation.`);

    // 4. Amadeus Cancellation (use amadeus_order_id if available, fallback to pnr)
    const orderIdToCancelWithAmadeus = booking.amadeus_order_id || booking.pnr;
    if (!orderIdToCancelWithAmadeus) {
        console.error(`[CancelBooking] Booking ${bookingId} is missing Amadeus Order ID (or PNR to use as such). Cannot proceed with Amadeus cancellation.`);
        throw new Error('Booking Amadeus Order ID/PNR is missing, cannot cancel with Amadeus.');
    }

    console.log(`[CancelBooking] Attempting Amadeus cancellation for Amadeus Order ID: ${orderIdToCancelWithAmadeus}`);
    const amadeusToken = await getAmadeusAccessToken();
    if (!amadeusToken) throw new Error('Failed to get Amadeus access token for cancellation.');

    const amadeusCancelResult = await cancelAmadeusOrder(orderIdToCancelWithAmadeus, amadeusToken);
    if (!amadeusCancelResult.success) {
      console.error(`[CancelBooking] Amadeus cancellation failed for Order ID ${orderIdToCancelWithAmadeus}: ${amadeusCancelResult.error}`);
      throw new Error(`Amadeus cancellation failed: ${amadeusCancelResult.error || 'Unknown Amadeus error'}`);
    }
    console.log(`[CancelBooking] Amadeus cancellation successful for Order ID ${orderIdToCancelWithAmadeus}`);

    // 5. Stripe Refund
    console.log(`[CancelBooking] Attempting Stripe refund for booking ${bookingId}`);
    const { data: paymentRow, error: fetchPaymentError } = await supabaseAdmin
      .from('payments')
      .select('stripe_payment_intent_id')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchPaymentError || !paymentRow || !paymentRow.stripe_payment_intent_id) {
      console.error(`[CancelBooking] Could not find Stripe PaymentIntent ID for booking ${bookingId}. Error: ${fetchPaymentError?.message || 'No payment record or PI ID'}`);
      throw new Error(`Stripe PaymentIntent ID not found for booking ${bookingId}. Amadeus order was cancelled. Manual refund check required.`);
    }
    const intentId = paymentRow.stripe_payment_intent_id;
    console.log(`[CancelBooking] Found Stripe PaymentIntent ID: ${intentId}. Proceeding with refund.`);

    await stripe.refunds.create({
        payment_intent: intentId,
        reason: 'requested_by_customer'
    });
    console.log(`[CancelBooking] Stripe refund initiated for PaymentIntent ID: ${intentId}`);

    // 6. Update Database
    console.log(`[CancelBooking] Updating database records for booking ${bookingId}`);
    const nowISO = new Date().toISOString();
    const { error: updateBookingError } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'canceled', updated_at: nowISO, cancellation_reason: 'user_requested_within_24h' })
      .eq('id', bookingId);
    if (updateBookingError) throw new Error(`Failed to update booking status: ${updateBookingError.message}`);

    const { error: updatePaymentError } = await supabaseAdmin
      .from('payments')
      .update({ status: 'refunded', updated_at: nowISO })
      .eq('stripe_payment_intent_id', intentId);
    if (updatePaymentError) console.warn(`[CancelBooking] Failed to update payment status to refunded for PI ${intentId}: ${updatePaymentError.message}`); // Log as warning, main cancellation succeeded.
    console.log(`[CancelBooking] Database records updated for booking ${bookingId} to canceled/refunded.`);

    // 7. Send Cancellation Notification
    if (supabaseUrlForInvoke && serviceRoleKeyForInvoke && booking.user_id) {
      const sendNotificationUrl = `${supabaseUrlForInvoke}/functions/v1/send-notification`;
      const notificationPayload = {
        booking_id: booking.id,
        pnr: booking.pnr, // Use the actual PNR from the booking record for notification
        trip_request_id: booking.trip_request_id,
        reason: 'Your booking was successfully canceled and refunded as per your request within the 24-hour window.',
      };
      fetch(sendNotificationUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${serviceRoleKeyForInvoke}`, 'Content-Type': 'application/json', 'apikey': serviceRoleKeyForInvoke },
          body: JSON.stringify({ user_id: booking.user_id, type: 'booking_canceled', payload: notificationPayload })
      })
      .then(async res => res.ok ? console.log('[CancelBooking] Cancellation notification sent.') : res.text().then(txt => console.error('[CancelBooking] Failed to send cancellation notification:', res.status, txt)))
      .catch(err => console.error('[CancelBooking] Error sending cancellation notification:', err.message));
    }

    return new Response(JSON.stringify({ success: true, message: 'Booking canceled and refund initiated successfully.' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[CancelBooking] Error processing cancellation for booking ${bookingId || 'unknown'}: ${error.message}`, error.stack);
    return new Response(JSON.stringify({ error: error.message }), {
      status: (error.message.includes('Unauthorized') ? 403 : (error.message.includes('not found') ? 404 : (error.message.includes('cancelable state') || error.message.includes('window has passed') || error.message.includes('Missing booking_id') ? 400 : 500))),
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
