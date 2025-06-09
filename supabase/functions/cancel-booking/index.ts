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

  let bookingId: string | undefined; // Standardized bookingId
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
    bookingId = body.booking_id;
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

    // --- REORDERED AND UPDATED ELIGIBILITY CHECKS ---
    // 4. Add Early payment_intent_id Validation (User Step 5)
    if (!booking.payment_intent_id) {
      console.warn(`[CancelBooking] Booking ${bookingId} has no payment_intent_id; cannot issue Stripe refund or proceed with monetary-related cancellation aspects.`);
      return new Response(
        JSON.stringify({
          error: "Cannot cancel: no payment_intent_id associated with this booking for refund processing.",
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Enforce Status Check is "ticketed" (User Step 3, re-verified, part of User Step 6 sequence)
    if (booking.status !== "ticketed") {
      console.log(`[CancelBooking] Booking ${bookingId} cannot be canceled. Status is "${booking.status}", requires "ticketed".`);
      return new Response(
        JSON.stringify({ error: `Cannot cancel: Booking not in "ticketed" status (current: ${booking.status})` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Enforce 24-Hour Window (User Step 6)
    const now = new Date();
    const bookedAt = new Date(booking.created_at);
    const hoursSinceBooking = (now.getTime() - bookedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceBooking >= 24) {
      console.warn(`[CancelBooking] Booking ${bookingId} is ${hoursSinceBooking.toFixed(2)}h old; cancellation window expired.`);
      return new Response(
          JSON.stringify({ error: "Cancellation window has closed (24 h elapsed)." }), // Changed from 200 to 400
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`[CancelBooking] Booking ${bookingId} is eligible for cancellation (within ${Math.floor(24 - hoursSinceBooking)}h window).`);
    // --- END OF ELIGIBILITY CHECKS ---


    // Amadeus Cancellation (User Step 7 - logs error but continues)
    const amadeusOrderIdToCancel = booking.amadeus_order_id || booking.pnr;
    if (!amadeusOrderIdToCancel) {
        console.error(`[CancelBooking] No Amadeus Order ID or PNR found for booking ${bookingId}. This should have been caught earlier if status was 'ticketed'. Critical inconsistency.`);
        throw new Error('Amadeus Order ID/PNR missing for cancellation despite ticketed status.');
    }

    let amadeusCancellationSuccessful = false;
    try {
        console.log(`[CancelBooking] Attempting Amadeus cancellation for Order ID: ${amadeusOrderIdToCancel}`);
        const accessToken = await getAmadeusAccessToken();
        if (!accessToken) throw new Error("Failed to get Amadeus access token.");

        const amadeusResult = await cancelAmadeusOrder(amadeusOrderIdToCancel, accessToken);
        if (!amadeusResult.success) {
            console.error(`[CancelBooking] Amadeus cancellation failed for Order ID ${amadeusOrderIdToCancel}:`, amadeusResult.error);
        } else {
            amadeusCancellationSuccessful = true;
            console.log(`[CancelBooking] Amadeus cancellation successful for Order ID: ${amadeusOrderIdToCancel}`);
        }
    } catch (amadeusErr) {
        console.error(`[CancelBooking] Exception during Amadeus cancellation for Order ID ${amadeusOrderIdToCancel}:`, amadeusErr.message);
    }

    // Stripe Refund (User Step 7 - exits on failure)
    // booking.payment_intent_id was already checked to exist earlier
    console.log(`[CancelBooking] Attempting Stripe refund for PaymentIntent ID: ${booking.payment_intent_id}`);
    try {
        const stripeRefund = await stripe.refunds.create({ payment_intent: booking.payment_intent_id, reason: 'requested_by_customer' });
        console.log(`[CancelBooking] Stripe refund succeeded for PI ${booking.payment_intent_id} (booking ${bookingId}), refund ID: ${stripeRefund.id}`);
    } catch (stripeErr: any) {
        console.error(`[CancelBooking] Stripe refund error for PI ${booking.payment_intent_id} (booking ${bookingId}): ${stripeErr.message}`);
        return new Response( // Exit on Stripe refund failure
            JSON.stringify({ error: "Stripe refund failed. Please contact support." }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Conditional Database Update to "canceled" (User Step 8)
    // If we reach here, Stripe refund either succeeded or was skipped (no PI - but we added PI check, so it must exist).
    // Amadeus cancellation might have failed (logged) but we proceed as per spec.
    console.log(`[CancelBooking] Updating database status for booking ${bookingId} to 'cancelled'.`);
    const nowISO = new Date().toISOString();

    const { error: updateBookingsErr } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'cancelled', updated_at: nowISO })
      .eq('id', bookingId);
    if (updateBookingsErr) {
      console.error(`[CancelBooking] Failed to update bookings table for ${bookingId}:`, updateBookingsErr.message);
      throw new Error(`Failed to update booking status after cancellation/refund: ${updateBookingsErr.message}`);
    }
    console.log(`[CancelBooking] Booking ${bookingId} marked as "canceled" in database.`);

    if (booking.booking_request_id) {
      const { error: updateBookingRequestsErr } = await supabaseAdmin
        .from('booking_requests')
        .update({ status: 'cancelled', updated_at: nowISO })
        .eq('id', booking.booking_request_id);
      if (updateBookingRequestsErr) {
        console.error(`[CancelBooking] Failed to update booking_requests table for ${booking.booking_request_id}:`, updateBookingRequestsErr.message);
        // Log and continue, as main booking is cancelled.
      }
    }

    // Payments table update was removed as per User Step 4 of this refactoring.

    // Send notification
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
      }).catch(err => console.error('[CancelBooking] Notification dispatch failed:', err.message));
    }

    console.log(`[CancelBooking] Successfully processed cancellation for booking ${bookingId}.`);
    return new Response(JSON.stringify({ status: 'cancelled', message: 'Booking cancelled successfully.' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }});

  } catch (error) {
    console.error(`[CancelBooking] Unhandled error for booking ${bookingId || 'unknown'}: ${error.message}`, error.stack);
    // Determine appropriate status code based on the error, if possible, or default to 500.
    // The specific error returns (400, 401, 403, 404, 502) are handled inline.
    // This catch is for truly unexpected errors or those thrown by failed DB updates after Amadeus/Stripe.
    return new Response(JSON.stringify({ error: 'An unexpected error occurred during cancellation.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
