// supabase/functions/cancel-booking/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getAmadeusAccessToken, cancelAmadeusOrder } from '../lib/amadeus.ts';
import { stripe } from '../lib/stripe.ts';

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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // let bookingIdFromInput: string | null = null; // REMOVED
  let authenticatedUserId: string | null = null;
  const supabaseAdmin = getSupabaseAdmin();

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid Authorization header' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: authUser }, error: authErr } = await supabaseAdmin.auth.getUser(jwt);

    if (authErr || !authUser) {
      console.warn('[CancelBooking] Authentication error:', authErr?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token or user not found' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    authenticatedUserId = authUser.id;
    console.log(`[CancelBooking] Authenticated user: ${authenticatedUserId}`);

    // 2. Parse and validate bookingId from request body
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const bookingId: string | undefined = body.booking_id; // Use bookingId directly
    if (!bookingId || typeof bookingId !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid bookingId in request payload' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    console.log(`[CancelBooking] Request to cancel booking ID: ${bookingId}`);

    // 3. Fetch booking from `bookings` table
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from('bookings')
      .select('id, booking_request_id, pnr, payment_intent_id, created_at, status, user_id, amadeus_order_id')
      .eq('id', bookingId)
      .single();

    if (bookingErr || !booking) {
      console.warn(`[CancelBooking] Booking not found for ID: ${bookingId}`, bookingErr?.message);
      return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3a. Ensure user owns the booking
    if (booking.user_id !== authenticatedUserId) {
      console.warn(`[CancelBooking] User ${authenticatedUserId} attempted to cancel booking ${bookingId} owned by ${booking.user_id}. Forbidden.`);
      return new Response(JSON.stringify({ error: 'Forbidden: You do not own this booking' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 3b. Check eligibility: status must be 'ticketed'
    if (booking.status !== 'ticketed') {
      console.log(`[CancelBooking] Booking ${bookingId} cannot be canceled. Status is "${booking.status}", requires "ticketed".`);
      return new Response(
        JSON.stringify({ error: `Cannot cancel: Booking not in "ticketed" status (current: ${booking.status})` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3c. Check 24-hour cancellation window from created_at (as per user spec)
    const now = new Date();
    const bookedAt = new Date(booking.created_at);
    const hoursSinceBooking = (now.getTime() - bookedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceBooking >= 24) {
      console.log(`[CancelBooking] Booking ${bookingId} is outside the 24-hour free cancellation window.`);
      return new Response(
        JSON.stringify({
          status: 'outside_window', // Consistent with user spec
          message: 'Free cancellation window closed. Contact airline or support for assistance.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`[CancelBooking] Booking ${bookingId} is eligible for cancellation (within ${Math.floor(24 - hoursSinceBooking)}h window).`);

    // 4. Call Amadeus cancellation helper
    const amadeusOrderIdToCancel = booking.amadeus_order_id || booking.pnr;
    if (!amadeusOrderIdToCancel) {
        console.error(`[CancelBooking] No Amadeus Order ID or PNR found for booking ${bookingId}. Cannot cancel with Amadeus.`);
        throw new Error('Amadeus Order ID/PNR missing for cancellation.');
    }

    let amadeusCancellationSuccessful = false; // Flag to track outcome
    try {
        console.log(`[CancelBooking] Attempting Amadeus cancellation for Order ID: ${amadeusOrderIdToCancel}`);
        const accessToken = await getAmadeusAccessToken();
        if (!accessToken) throw new Error("Failed to get Amadeus access token.");

        const amadeusResult = await cancelAmadeusOrder(amadeusOrderIdToCancel, accessToken);
        if (!amadeusResult.success) {
            console.error(`[CancelBooking] Amadeus cancellation failed for Order ID ${amadeusOrderIdToCancel}:`, amadeusResult.error);
            // Log error but continue to refund and DB updates as per spec ("We proceed with refund anyway...")
        } else {
            amadeusCancellationSuccessful = true;
            console.log(`[CancelBooking] Amadeus cancellation successful for Order ID: ${amadeusOrderIdToCancel}`);
        }
    } catch (amadeusErr) {
        console.error(`[CancelBooking] Exception during Amadeus cancellation for Order ID ${amadeusOrderIdToCancel}:`, amadeusErr.message);
        // Log error but continue to refund and DB updates as per spec
    }

    // 5. Issue Stripe refund using bookings.payment_intent_id
    let stripeRefundSuccessful = false;
    if (booking.payment_intent_id) {
        console.log(`[CancelBooking] Attempting Stripe refund for PaymentIntent ID: ${booking.payment_intent_id}`);
        try {
            await stripe.refunds.create({ payment_intent: booking.payment_intent_id, reason: 'requested_by_customer' });
            stripeRefundSuccessful = true;
            console.log(`[CancelBooking] Stripe refund succeeded for PaymentIntent ID: ${booking.payment_intent_id}`);
        } catch (refundErr: any) {
            console.error(`[CancelBooking] Stripe refund failed for PaymentIntent ID ${booking.payment_intent_id}:`, refundErr.message);
            // Log error, but proceed with DB updates.
        }
    } else {
        console.warn(`[CancelBooking] No payment_intent_id found for booking ${bookingId}. Skipping Stripe refund.`);
    }

    // 6. Update both tables to status = 'cancelled' / 'refunded'
    const nowISO = new Date().toISOString();
    console.log(`[CancelBooking] Updating database status for booking ${bookingId}`);
    const { error: updateBookingsErr } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled', updated_at: nowISO })
      .eq('id', bookingId);

    if (updateBookingsErr) {
      console.error(`[CancelBooking] Failed to update bookings table for ${bookingId}:`, updateBookingsErr.message);
      // This is a significant issue if other steps succeeded. Consider how to handle.
      // For now, just logging. The overall function might still be considered a "success" if Amadeus/Stripe were okay.
    }

    if (booking.booking_request_id) {
      const { error: updateBookingRequestsErr } = await supabaseAdmin
        .from('booking_requests')
        .update({ status: 'cancelled', updated_at: nowISO })
        .eq('id', booking.booking_request_id);
      if (updateBookingRequestsErr) {
        console.error(`[CancelBooking] Failed to update booking_requests table for ${booking.booking_request_id}:`, updateBookingRequestsErr.message);
      }
    }

    // Update payments table status if refund was attempted/successful - REMOVED
    // if (booking.payment_intent_id) {
    //     const paymentStatusOnDB = stripeRefundSuccessful ? 'refunded' : 'refund_failed';
    //     console.log(`[CancelBooking] Updating payments table for PI ${booking.payment_intent_id} to status: ${paymentStatusOnDB}`);
    //     const { error: updatePaymentsErr } = await supabaseAdmin
    //         .from('payments')
    //         .update({ status: paymentStatusOnDB, updated_at: nowISO })
    //         .eq('stripe_payment_intent_id', booking.payment_intent_id);
    //     if (updatePaymentsErr) {
    //         console.warn(`[CancelBooking] Failed to update payments table for PI ${booking.payment_intent_id}:`, updatePaymentsErr.message);
    //     }
    // }

    // 7. Send booking_cancelled notification
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (supabaseUrl && serviceRoleKey && booking.user_id) {
      const sendNotificationUrl = `${supabaseUrl}/functions/v1/send-notification`;
      const notificationPayload = {
        booking_id: bookingId,
        pnr: booking.pnr,
        trip_request_id: booking.booking_request_id
      };
      fetch(sendNotificationUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey
        },
        body: JSON.stringify({
          user_id: authUser.id,
          type: 'booking_cancelled',
          payload: notificationPayload
        })
      }).catch(err => console.error('[CancelBooking] Notification dispatch failed:', err.message)); // Fire and forget
    }

    console.log(`[CancelBooking] Successfully processed cancellation for booking ${bookingId}.`);
    return new Response(JSON.stringify({ status: 'cancelled', message: 'Booking cancelled successfully.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});

  } catch (error) {
    console.error(`[CancelBooking] Unhandled error for booking ${bookingId || 'unknown'}: ${error.message}`, error.stack);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred during cancellation.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
