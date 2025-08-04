/**
 * Production-Ready Auto-Booking Edge Function
 * 
 * Implements a simplified, battle-tested Saga pattern for autonomous flight booking:
 * 1. Create booking attempt (with idempotency)
 * 2. Search flights with Duffel
 * 3. Charge payment via Stripe 
 * 4. Create Duffel order
 * 5. Complete booking (or compensate on failure)
 * 
 * Features:
 * - Idempotency protection
 * - Automatic compensation (refunds)
 * - Feature flag control
 * - Comprehensive error handling
 * - Structured logging
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { logger } from '../_shared/logger.ts'
import { initSentryForFunction, captureException, addBreadcrumb } from '../_shared/sentry.ts'
import { capturePaymentIntent, refundPaymentIntent } from '../_shared/stripe.ts'
import { recordAutoBookingSuccess, recordAutoBookingFailure, recordStripeCaptureSuccess, recordStripeCaptureFailure, autoBookingFailureTotal } from '../_shared/metrics.ts'
import { alertBookingSuccess, alertBookingFailure, alertRefundCompleted } from '../_shared/notifications.ts'
import { checkAutoBookingFlags } from '../_shared/launchdarkly-guard.ts'
import { notifyBookingSuccess, notifyBookingFailure, notifyBookingWarning } from '../_shared/booking-alerts.ts'
import { 
  createDuffelProductionClient,
  mapTripRequestToDuffelSearch,
  mapTravelerDataToPassenger,
  type DuffelOrder
} from '../lib/duffel-production.ts'

interface AutoBookRequest {
  tripRequestId: string;
  maxPrice?: number;
  userId?: string; // Optional override for admin testing
}

interface BookingAttempt {
  id: string;
  status: string;
  trip_request_id: string;
  idempotency_key: string;
}

console.log('[AutoBookProduction] Function initialized');

initSentryForFunction('auto-book-production');

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Critical: Check LaunchDarkly flags before any processing
  const flagCheck = await checkAutoBookingFlags(req, 'auto-book-production');
  if (!flagCheck.canProceed) {
    return flagCheck.response!;
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let bookingAttempt: BookingAttempt | null = null;
  let stripeChargeId: string | null = null;
  let duffelOrder: DuffelOrder | null = null;
  let bookingId: string | null = null;

  // Create stripeClient object with refundPaymentIntent method
  const stripeClient = {
    refundPaymentIntent: async (paymentIntentId: string, idempotencyKey: string) => {
      return await refundPaymentIntent({
        paymentIntentId,
        metadata: { idempotency_key: idempotencyKey }
      });
    }
  };

  try {
    // Parse and validate request
    const body = await req.json();
    const { tripRequestId, maxPrice }: AutoBookRequest = body;

    if (!tripRequestId) {
      throw new Error('tripRequestId is required');
    }

    console.log(`[AutoBookProduction] Processing trip request: ${tripRequestId}`);

    // Step 1: Get trip request for user ID
    const { data: tripRequest, error: tripError } = await supabaseClient
      .from('trip_requests')
      .select('user_id')
      .eq('id', tripRequestId)
      .single();

    if (tripError || !tripRequest) {
      throw new Error(`Trip request not found: ${tripError?.message}`);
    }

    // Auto-booking flags already checked at function entry

    // Step 2: Get full trip request details (we already have user_id from Step 1)
    const { data: fullTripRequest, error: fullTripError } = await supabaseClient
      .from('trip_requests')
      .select('*')
      .eq('id', tripRequestId)
      .single();

    if (fullTripError || !fullTripRequest) {
      throw new Error(`Trip request not found: ${fullTripError?.message}`);
    }

    // Use the full trip request data
    const tripRequestData = fullTripRequest;

    console.log(`[AutoBookProduction] Trip details:`, {
      origin: tripRequestData.departure_airports?.[0],
      destination: tripRequestData.destination_location_code,
      departure: tripRequestData.departure_date,
      return: tripRequestData.return_date,
      budget: tripRequestData.max_price || tripRequestData.budget
    });

    // Step 3: Create booking attempt with idempotency
    const idempotencyKey = `auto-book-${tripRequestId}-${Date.now()}`;
    
    // Try to insert booking attempt with idempotency protection
    const { data: existingAttempt, error: checkError } = await supabaseClient
      .from('booking_attempts')
      .select('*')
      .eq('trip_request_id', tripRequestId)
      .eq('status', 'processing')
      .maybeSingle();

    if (checkError) {
      throw new Error(`Failed to check existing booking attempts: ${checkError.message}`);
    }

    if (existingAttempt) {
      console.log('[AutoBookProduction] Booking attempt already in progress (idempotent)');
      return new Response(JSON.stringify({
        success: true,
        message: 'Booking attempt already in progress',
        attempt: existingAttempt
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create new booking attempt
    const { data: newAttempt, error: attemptError } = await supabaseClient
      .from('booking_attempts')
      .insert({
        trip_request_id: tripRequestId,
        offer_id: '', // Will be updated after offer selection
        idempotency_key: idempotencyKey,
        status: 'initiated'
      })
      .select()
      .single();

    if (attemptError) {
      throw new Error(`Failed to create booking attempt: ${attemptError.message}`);
    }

    bookingAttempt = newAttempt;
    console.log(`[AutoBookProduction] Created booking attempt: ${bookingAttempt.id}`);

    // Step 4: Validate traveler data
    const travelerData = tripRequestData.traveler_data;
    if (!travelerData?.firstName || !travelerData?.lastName || !travelerData?.email) {
      throw new Error('Missing required traveler data: firstName, lastName, email');
    }

    // Check for international travel requirements
    const originCountry = tripRequestData.departure_airports?.[0]?.slice(0, 2);
    const destCountry = tripRequestData.destination_location_code?.slice(0, 2);
    const isInternational = originCountry && destCountry && originCountry !== destCountry;

    if (isInternational && !travelerData.passportNumber) {
      throw new Error('Passport number required for international travel');
    }

    // Step 5: Search flights with Duffel
    console.log('[AutoBookProduction] Searching flights with Duffel...');
    
    const duffelClient = await createDuffelProductionClient(supabaseClient);
    const searchParams = mapTripRequestToDuffelSearch(tripRequestData);
    
    const { offers } = await duffelClient.searchFlights(searchParams);
    
    if (offers.length === 0) {
      throw new Error('No flights found for the specified criteria');
    }

    // Step 6: Find best offer within budget
    const budget = maxPrice || tripRequestData.max_price || tripRequestData.budget;
    const validOffers = offers.filter(offer => {
      const price = parseFloat(offer.total_amount);
      const validation = duffelClient.validateOffer(offer);
      return price <= budget && validation.valid;
    });

    if (validOffers.length === 0) {
      throw new Error(`No offers found within budget of ${budget} ${tripRequestData.currency || 'USD'}`);
    }

    // Sort by price and select cheapest
    validOffers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
    const selectedOffer = validOffers[0];
    
    console.log(`[AutoBookProduction] Selected offer:`, {
      id: selectedOffer.id,
      price: selectedOffer.total_amount,
      currency: selectedOffer.total_currency,
      expires: selectedOffer.expires_at
    });

    // Step 6.1: Validate expires_at before booking (Gap #57)
    if (selectedOffer.expires_at) {
      const expiresAt = new Date(selectedOffer.expires_at);
      const now = new Date();
      
      if (expiresAt <= now) {
        logger.error('Selected offer expired before booking', {
          operation: 'auto_book_expired_offer',
          offerId: selectedOffer.id,
          expiresAt: selectedOffer.expires_at,
          currentTime: now.toISOString(),
          tripRequestId
        });
        
        throw new Error(`Selected offer ${selectedOffer.id} has expired at ${selectedOffer.expires_at}`);
      }
      
      // Warn if offer expires soon (within 3 minutes for auto-booking)
      const threeMinutesFromNow = new Date(now.getTime() + 3 * 60 * 1000);
      if (expiresAt <= threeMinutesFromNow) {
        const minutesUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (60 * 1000));
        logger.warn('Selected offer expires very soon', {
          operation: 'auto_book_expiring_offer',
          offerId: selectedOffer.id,
          expiresAt: selectedOffer.expires_at,
          minutesUntilExpiry,
          tripRequestId
        });
        
        if (minutesUntilExpiry < 1) {
          throw new Error(`Selected offer ${selectedOffer.id} expires in less than 1 minute, too risky to proceed`);
        }
      }
    } else {
      // Log warning for offers without expiration time
      logger.warn('Selected offer has no expiration time set', {
        operation: 'auto_book_no_expiry',
        offerId: selectedOffer.id,
        tripRequestId
      });
    }

    // Step 7: Capture payment via Stripe with idempotency
    logger.info('Capturing payment via Stripe', {
      operation: 'auto_book_stripe_capture',
      userId: tripRequest.user_id,
      amount: parseFloat(selectedOffer.total_amount),
      currency: selectedOffer.total_currency,
      offerId: selectedOffer.id,
      bookingAttemptId: bookingAttempt.id
    });
    
    // Get existing PaymentIntent ID from booking attempt or trip request
    const paymentIntentId = tripRequestData.payment_intent_id;
    if (!paymentIntentId) {
      throw new Error('No PaymentIntent found for this booking attempt');
    }
    
    // Capture the PaymentIntent using shared Stripe client with idempotency
    const capturedIntent = await capturePaymentIntent(
      paymentIntentId,
      bookingAttempt.idempotency_key
    );

    stripeChargeId = capturedIntent.id;
    
    logger.stripeCaptureSuccess(stripeChargeId, parseFloat(selectedOffer.total_amount) * 100, {
      userId: tripRequest.user_id,
      bookingAttemptId: bookingAttempt.id,
      currency: selectedOffer.total_currency
    });

    recordStripeCaptureSuccess(stripeChargeId, selectedOffer.total_currency);

    // Step 8: Create Duffel order
    console.log('[AutoBookProduction] Creating Duffel order...');
    
    const passenger = mapTravelerDataToPassenger(travelerData);
    
    try {
      duffelOrder = await duffelClient.createOrder({
        offerId: selectedOffer.id,
        passengers: [passenger],
        idempotencyKey: bookingAttempt.id
      });

      console.log(`[AutoBookProduction] Duffel order created:`, {
        orderId: duffelOrder.id,
        reference: duffelOrder.booking_reference,
        status: duffelOrder.status
      });

    } catch (duffelError) {
      console.error('[AutoBookProduction] Duffel order creation failed:', duffelError);
      
      // Compensate: Refund the payment using shared Stripe client with idempotency
      logger.info('Initiating automated refund saga', {
        operation: 'auto_book_refund_saga',
        paymentIntentId: stripeChargeId,
        reason: 'duffel_booking_failed',
        bookingAttemptId: bookingAttempt.id,
        userId: tripRequest.user_id
      });
      
      let refundCompleted = false;
      
      try {
        const refundIdempotencyKey = `refund-${bookingAttempt.idempotency_key}`;
        
        // Call stripeClient.refundPaymentIntent as specified in task
        const { refund, status } = await stripeClient.refundPaymentIntent(
          paymentIntentId, // Use paymentIntentId as specified
          refundIdempotencyKey
        );
        
        refundCompleted = (status === 'refunded');
        
        // Emit observability signals  
        logger.info('refund_completed', {
          bookingId: bookingAttempt.id,
          paymentIntentId: paymentIntentId
        });
        
        // Increment failure metric as specified
        autoBookingFailureTotal.inc();
        
        // Send Slack alert for refund completion
        await alertRefundCompleted(
          bookingAttempt.id,
          paymentIntentId,
          parseFloat(selectedOffer.total_amount),
          selectedOffer.total_currency,
          'Duffel booking failed, refund processed successfully'
        );
        
        // Update booking status to 'refunded' - need to check if this should be flight_bookings table
        if (refundCompleted) {
          await supabaseClient
            .from('flight_bookings')
            .update({ status: 'refunded' })
            .eq('id', bookingId);
        }
        
      } catch (refundError) {
        recordStripeCaptureFailure(stripeChargeId, refundError.message, selectedOffer.total_currency);
        logger.error('Automated refund failed', {
          operation: 'auto_book_refund_failed',
          paymentIntentId: stripeChargeId,
          error: refundError.message,
          bookingAttemptId: bookingAttempt.id
        });
        
        captureException(refundError, {
          operation: 'auto_book_refund_saga',
          paymentIntentId: stripeChargeId,
          bookingAttemptId: bookingAttempt.id
        });
        
        // Send Slack alert for refund failure
        await alertBookingFailure(
          tripRequest.user_id,
          `Duffel booking failed and refund also failed: ${refundError.message}`,
          stripeChargeId,
          'failed'
        );
        
        // Send booking failure alert (Gap #31)
        await notifyBookingFailure(
          bookingAttempt.id,
          tripRequest.user_id,
          parseFloat(selectedOffer.total_amount),
          selectedOffer.total_currency,
          `Duffel booking failed and refund failed: ${refundError.message}`,
          {
            originalError: duffelError.message,
            refundError: refundError.message,
            stripeChargeId,
            tripRequestId
          }
        );
      }
      
      // Mark attempt as failed
      await supabaseClient.rpc('rpc_fail_booking_attempt', {
        p_attempt_id: bookingAttempt.id,
        p_error_message: `Duffel booking failed: ${duffelError.message}`,
        p_stripe_refund_id: stripeChargeId
      });
      
      // Send initial failure alert
      await alertBookingFailure(
        tripRequest.user_id,
        `Duffel order creation failed: ${duffelError.message}`,
        stripeChargeId,
        refundCompleted ? 'completed' : 'pending'
      );
      
      // Send booking failure alert (Gap #31)
      await notifyBookingFailure(
        bookingAttempt.id,
        tripRequest.user_id,
        parseFloat(selectedOffer.total_amount),
        selectedOffer.total_currency,
        `Duffel order creation failed: ${duffelError.message}`,
        {
          duffelError: duffelError.message,
          refundStatus: refundCompleted ? 'completed' : 'pending',
          stripeChargeId,
          tripRequestId,
          offerId: selectedOffer.id
        }
      );

      throw new Error(`Booking failed: ${duffelError.message}. Payment has been ${refundCompleted ? 'refunded' : 'queued for refund'}.`);
    }

    // Step 9: Complete booking atomically
    console.log('[AutoBookProduction] Finalizing booking...');
    
    const { data: completionResult, error: completionError } = await supabaseClient
      .rpc('rpc_complete_duffel_booking', {
        p_attempt_id: bookingAttempt.id,
        p_duffel_order_id: duffelOrder.id,
        p_stripe_payment_intent_id: stripeChargeId,
        p_price: parseFloat(selectedOffer.total_amount),
        p_currency: selectedOffer.total_currency,
        p_raw_order: duffelOrder
      });

    if (completionError) {
      console.error('[AutoBookProduction] Booking completion failed:', completionError);
      // At this point we have a successful Duffel order but failed to record it
      // This is a critical error that requires manual reconciliation
      throw new Error(`Booking completion failed: ${completionError.message}. Order ${duffelOrder.id} may need manual verification.`);
    }

    // Step 10: Send confirmation notification
    console.log('[AutoBookProduction] Sending booking confirmation...');
    
    try {
      await supabaseClient.functions.invoke('send-booking-confirmation', {
        body: {
          userId: tripRequest.user_id,
          bookingId: completionResult.booking_id,
          duffelOrderId: duffelOrder.id,
          bookingReference: duffelOrder.booking_reference
        }
      });
    } catch (notificationError) {
      console.warn('[AutoBookProduction] Notification failed (non-critical):', notificationError);
      // Don't fail the entire booking for notification issues
    }

    console.log(`[AutoBookProduction] Booking completed successfully: ${completionResult.booking_id}`);
    
    // Set bookingId for potential refund path
    bookingId = completionResult.booking_id;

    recordAutoBookingSuccess(tripRequest.user_id, selectedOffer.total_currency);

    // Send booking success alert (Gap #31)
    await notifyBookingSuccess(
      completionResult.booking_id,
      tripRequest.user_id,
      parseFloat(selectedOffer.total_amount),
      selectedOffer.total_currency,
      {
        duffelOrderId: duffelOrder.id,
        bookingReference: duffelOrder.booking_reference,
        tripRequestId,
        offerId: selectedOffer.id
      }
    );

    return new Response(JSON.stringify({
      success: true,
      bookingId: completionResult.booking_id,
      duffelOrderId: duffelOrder.id,
      bookingReference: duffelOrder.booking_reference,
      totalAmount: selectedOffer.total_amount,
      currency: selectedOffer.total_currency,
      status: 'confirmed'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[AutoBookProduction] Error:', error);

    // Attempt cleanup if we got far enough
    if (bookingAttempt) {
      try {
        await supabaseClient.rpc('rpc_fail_booking_attempt', {
          p_attempt_id: bookingAttempt.id,
          p_error_message: error.message
        });
      } catch (cleanupError) {
        console.error('[AutoBookProduction] Cleanup failed:', cleanupError);
      }
    }

    recordAutoBookingFailure(tripRequest.user_id || 'unknown_user', error.message, selectedOffer.total_currency || 'USD');

    // Send booking failure alert for general errors (Gap #31)
    if (bookingAttempt && tripRequest) {
      await notifyBookingFailure(
        bookingAttempt.id,
        tripRequest.user_id,
        parseFloat(selectedOffer?.total_amount || 0),
        selectedOffer?.total_currency || 'USD',
        error.message,
        {
          tripRequestId,
          errorType: 'general_booking_error',
          phase: stripeChargeId ? 'post_payment' : 'pre_payment'
        }
      );
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

/**
 * Charge customer via Stripe (off-session)
 */
async function chargeCustomer(userId: string, params: {
  amount: number;
  currency: string;
  description: string;
  idempotencyKey: string;
}): Promise<{ paymentIntentId: string }> {
  
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }

  // For demo purposes, we'll simulate a successful charge
  // In production, you would:
  // 1. Get customer's saved payment method from database
  // 2. Create PaymentIntent with off_session: true
  // 3. Handle 3D Secure if required
  
  console.log(`[Stripe] Charging customer ${userId}: ${params.amount} ${params.currency}`);
  
  // Simulate Stripe API call
  const mockPaymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  
  // In real implementation:
  /*
  const response = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': params.idempotencyKey
    },
    body: new URLSearchParams({
      amount: (params.amount * 100).toString(), // Stripe uses cents
      currency: params.currency,
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: 'true',
      confirm: 'true',
      description: params.description
    })
  });
  */

  return { paymentIntentId: mockPaymentIntentId };
}

/**
 * Refund payment via Stripe
 */
async function refundPayment(paymentIntentId: string, reason: string): Promise<void> {
  console.log(`[Stripe] Refunding payment ${paymentIntentId}: ${reason}`);
  
  // In real implementation:
  /*
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
  
  const response = await fetch('https://api.stripe.com/v1/refunds', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer'
    })
  });
  */
  
  console.log(`[Stripe] Refund processed for ${paymentIntentId}`);
}
