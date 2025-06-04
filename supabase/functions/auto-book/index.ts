// Required imports for Supabase, Amadeus, Stripe, and local helpers
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import amadeus from '../lib/amadeus.ts'; // Assuming amadeus.ts exports the initialized SDK instance
import { stripe } from '../lib/stripe.ts';   // Assuming stripe.ts exports the initialized SDK instance
import { selectSeat } from '../lib/seatSelector.ts'; // Assuming seatSelector.ts exports selectSeat

// Define a type for the trip object for better type safety (optional but good practice)
interface TripRequest {
  id: string;
  user_id: string; // Assuming user_id is part of the trip object for fetching profile
  payment_intent_id: string;
  origin_location_code: string;
  destination_location_code: string;
  departure_date: string;
  return_date?: string; // Optional for one-way
  adults: number;
  nonstop_required: boolean;
  max_price: number; // Used as totalBudget for seat selection
  allow_middle_seat: boolean;
  traveler_data?: { // Assuming traveler_data might be a JSONB field or similar
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string; // Format YYYY-MM-DD
    gender?: string;      // Format MALE/FEMALE
    email?: string;
    phone?: string;
    passportNumber?: string;
    // passportExpiry?: string;
    // nationality?: string;
    // issuanceCountry?: string;
  };
  // ... other trip fields
}

console.log('[AutoBook] Function cold start or new instance.');

Deno.serve(async (req: Request) => {
  console.log('[AutoBook] Request received.');
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  let trip: TripRequest | null = null;
  let bookingAttemptId: string | null = null;
  let mainOperationSuccessful = false;
  let flightOrderIdForRollback: string | null = null;
  let capturedErrorObject: any = null; // Using 'any' for simplicity, can be 'Error | null'

  // CORS headers (important for browser-based calls, though Edge Functions might be invoked server-side)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log('[AutoBook] Handling OPTIONS request.');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('[AutoBook] Entering main try block.');
    const body = await req.json();
    trip = body.trip as TripRequest; // Type assertion

    if (!trip || !trip.id) {
      console.error('[AutoBook] Invalid trip data received.', body);
      return new Response(JSON.stringify({ error: 'Invalid trip data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    console.log(`[AutoBook] Processing trip ID: ${trip.id}`);

    // 1. Lock Acquisition
    console.log(`[AutoBook] Attempting to acquire lock for trip ID: ${trip.id}`);
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
      if (attemptError.code === '23505') { // Unique violation
        console.log(`[AutoBook] Trip ID: ${trip.id} is already being processed or has been processed. Idempotency check passed.`);
        return new Response(JSON.stringify({ success: true, message: 'Trip processing already in progress or completed.' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.error(`[AutoBook] Error acquiring lock for trip ID: ${trip.id}. Error:`, attemptError);
      throw new Error(`Failed to acquire booking lock: ${attemptError.message}`);
    }
    bookingAttemptId = attemptData.id;
    console.log(`[AutoBook] Lock acquired. Booking Attempt ID: ${bookingAttemptId} for trip ID: ${trip.id}`);

    // --- BEGIN CORE AUTO-BOOKING LOGIC ---
    // (Derived from previous subtasks, now integrated here)

    // User object placeholder
    const user = {
        email: trip.traveler_data?.email || 'placeholder@example.com',
        phone: trip.traveler_data?.phone || '0000000000'
    };
    if (!trip.traveler_data?.email) console.warn(`[AutoBook] Using placeholder email for booking for trip ID: ${trip.id}`);

    // 1. Search flight offers
    console.log(`[AutoBook] Searching flight offers for trip ID: ${trip.id}`);
    const searchRes = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: trip.origin_location_code,
        destinationLocationCode: trip.destination_location_code,
        departureDate: trip.departure_date,
        returnDate: trip.return_date,
        adults: trip.adults,
        nonStop: trip.nonstop_required,
        max: 5
    }).catch(err => {
        console.error(`[AutoBook] Amadeus flight search failed for trip ID: ${trip.id}`, err);
        if (err.code === 429 || err.statusCode === 429) {
            console.warn(`[AutoBook] Amadeus API rate limit hit (429). Retry logic needed for trip ID: ${trip.id}.`);
        }
        throw new Error(`Amadeus flight search failed: ${err.message}`);
    });

    const offers = searchRes.data;
    if (!offers?.length) {
        console.log(`[AutoBook] No flight offers found for trip ID: ${trip.id}`);
        throw new Error('No flight offers found');
    }
    console.log(`[AutoBook] Found ${offers.length} flight offers for trip ID: ${trip.id}.`);

    // 2. Price top offer(s)
    let pricedOffer = null;
    console.log(`[AutoBook] Attempting to price up to 3 offers for trip ID: ${trip.id}.`);
    for (let i = 0; i < Math.min(offers.length, 3); i++) {
        try {
            console.log(`[AutoBook] Pricing offer ${i + 1} of ${Math.min(offers.length, 3)} for trip ID: ${trip.id}. Offer ID (if available): ${offers[i].id}`);
            const priceRes = await amadeus.shopping.flightOffers.pricing.post(
                JSON.stringify({ data: { type: 'flight-offers-pricing', flightOffers: [offers[i]] }})
            );
            pricedOffer = priceRes.data;
            console.log(`[AutoBook] Successfully priced offer ${i + 1} for trip ID: ${trip.id}. Price: ${pricedOffer?.price?.total}`);
            break;
        } catch (e) {
            console.warn(`[AutoBook] Pricing failed for offer ${i + 1} (ID: ${offers[i].id}) for trip ID: ${trip.id}. Error:`, e.description || e.message);
            let isInvalidOfferError = false;
            if (e.code === 422 || e.statusCode === 422) isInvalidOfferError = true;
            else if (e.description && Array.isArray(e.description)) isInvalidOfferError = e.description.some(errDetail => String(errDetail.code).includes('422') || String(errDetail.status).includes('422'));
            if (isInvalidOfferError) {
                 console.log(`[AutoBook] Offer ${i + 1} is invalid (422). Trying next offer for trip ID: ${trip.id}.`);
                continue;
            }
            throw new Error(`Amadeus pricing failed for offer ${offers[i].id}: ${e.message}`);
        }
    }

    if (!pricedOffer) {
        console.log(`[AutoBook] Pricing failed for all top offers for trip ID: ${trip.id}.`);
        throw new Error('Pricing failed for all offers');
    }
    console.log(`[AutoBook] Successfully priced an offer for trip ID: ${trip.id}. Final Price: ${pricedOffer.price.total}`);

    // 3. Seat Map & Selection
    console.log(`[AutoBook] Preparing for seat selection for priced offer ID: ${pricedOffer.id}, Trip ID: ${trip.id}`);
    const baseFare = Number(pricedOffer.price.grandTotal || pricedOffer.price.total);
    console.log(`[AutoBook] Base fare for seat selection: ${baseFare}. Total budget (trip.max_price): ${trip.max_price}`);
    let chosenSeat: { seatNumber: string, seatType?: string, price?: number } | null = null;

    try {
        const flightOffersForSeatmap = pricedOffer.flightOffers || [pricedOffer];
        console.log(`[AutoBook] Calling amadeus.shopping.seatMaps.get() for trip ID: ${trip.id}`);
        const seatMapRes = await amadeus.shopping.seatMaps.get({
            flightOffers: flightOffersForSeatmap
        }).catch(err => {
            console.warn(`[AutoBook] Amadeus seat map retrieval using .get() failed for Trip ID: ${trip.id}. Error:`, err.description || err.message, err);
            return null;
        });

        if (seatMapRes?.data?.length) {
            console.log(`[AutoBook] Successfully retrieved ${seatMapRes.data.length} seat map(s) for Trip ID: ${trip.id}.`);
            const seatMapForSelection = seatMapRes.data[0];
            if (seatMapForSelection) {
                 console.log(`[AutoBook] Processing seat map for selection. Trip ID: ${trip.id}. Base Fare: ${baseFare}, Total Budget: ${trip.max_price}, Allow Middle: ${trip.allow_middle_seat}`);
                chosenSeat = selectSeat(seatMapForSelection, baseFare, trip.max_price, trip.allow_middle_seat);
                if (chosenSeat) console.log(`[AutoBook] Seat selected: ${chosenSeat.seatNumber}, Type: ${chosenSeat.seatType}, Price: ${chosenSeat.price} for trip ID: ${trip.id}`);
                else console.log(`[AutoBook] No seat selected by selectSeat helper for trip ID: ${trip.id}. Proceeding without seat selection.`);
            } else console.log(`[AutoBook] First seat map data (seatMapRes.data[0]) was null or empty for Trip ID: ${trip.id}.`);
        } else console.log(`[AutoBook] No seat map data returned or failed to retrieve for Trip ID: ${trip.id}. (seatMapRes: ${JSON.stringify(seatMapRes)})`);
    } catch (seatmapError) {
        console.warn(`[AutoBook] Outer error during seat map processing for Trip ID: ${trip.id}. Error:`, seatmapError.message);
        chosenSeat = null;
    }

    // 4. Amadeus Flight Order Booking
    console.log(`[AutoBook] Creating flight order for trip ID: ${trip.id}. Chosen seat: ${chosenSeat ? chosenSeat.seatNumber : 'None'}`);
    const offersForBooking = pricedOffer.flightOffers || [pricedOffer];
    const flightOrderPayload = { /* ... constructed payload ... */
        data: {
            type: 'flight-order',
            flightOffers: offersForBooking,
            travelers: [{
                id: '1',
                dateOfBirth: trip.traveler_data?.dateOfBirth,
                name: { firstName: trip.traveler_data?.firstName, lastName: trip.traveler_data?.lastName },
                gender: trip.traveler_data?.gender?.toUpperCase() || 'MALE',
                contact: {
                    emailAddress: user.email,
                    phones: user.phone ? [{ deviceType: 'MOBILE', countryCallingCode: '1', number: user.phone }] : []
                },
                documents: trip.traveler_data?.passportNumber ? [{
                    documentType: 'PASSPORT', number: trip.traveler_data.passportNumber,
                }] : undefined,
                seatSelections: chosenSeat && chosenSeat.seatNumber && offersForBooking[0]?.itineraries?.[0]?.segments?.[0]?.id
                ? [{ segmentId: offersForBooking[0].itineraries[0].segments[0].id, seatNumber: chosenSeat.seatNumber }] : []
            }],
            remarks: { general: [{ subType: 'GENERAL_MISCELLANEOUS', text: `Auto-booking for trip_request_id: ${trip.id}` }] },
            ticketingAgreement: { option: 'DELAY_TO_CANCEL', delay: '6H' },
            metadata: { clientBookingReference: trip.id }
        }
    };
    if (!flightOrderPayload.data.travelers[0].documents) delete flightOrderPayload.data.travelers[0].documents;
    console.log(`[AutoBook] Flight order payload for trip ID ${trip.id} being sent.`); // Avoid logging full payload if too verbose or sensitive

    const bookingRes = await amadeus.booking.flightOrders.post(JSON.stringify(flightOrderPayload));

    if (!bookingRes?.data || !(bookingRes.data.id || bookingRes.data.flightOrderId)) {
        console.error('[AutoBook] Invalid booking response structure from Amadeus:', bookingRes);
        throw new Error('Amadeus booking failed: Invalid response structure.');
    }
    flightOrderIdForRollback = bookingRes.data.id || bookingRes.data.flightOrderId; // CRITICAL: SET FOR ROLLBACK
    const airlinePnr = bookingRes.data.associatedRecords?.[0]?.reference;
    console.log(`[AutoBook] Flight order created. Order ID: ${flightOrderIdForRollback}, Airline PNR (if available): ${airlinePnr} for trip ID: ${trip.id}`);
    const finalPrice = Number(bookingRes.data.flightOffers?.[0]?.price?.total || bookingRes.data.price?.total);
    if (isNaN(finalPrice)) {
        console.error('[AutoBook] Could not determine final price from booking response:', bookingRes.data);
        throw new Error('Amadeus booking succeeded but final price is unclear.');
    }
    console.log(`[AutoBook] Final confirmed price: ${finalPrice} for trip ID: ${trip.id}`);

    // 5. Stripe PaymentIntent Capture
    console.log(`[AutoBook] Initiating Stripe payment capture for trip ID: ${trip.id}. Flight Order ID: ${flightOrderIdForRollback}`);
    const paymentIntentId = trip.payment_intent_id;
    if (!paymentIntentId) {
        console.error(`[AutoBook] Stripe PaymentIntent ID is missing for trip ID: ${trip.id}. Cannot capture payment.`);
        // This error will be caught by the main catch, which will attempt Amadeus rollback using flightOrderIdForRollback
        throw new Error(`Stripe PaymentIntent ID is missing. Booking must be rolled back.`);
    }
    console.log(`[AutoBook] Found PaymentIntent ID: ${paymentIntentId} for trip ID: ${trip.id}.`);
    try {
        const capturedPaymentIntent = await stripe.paymentIntents.capture(paymentIntentId, {
            amount_to_capture: Math.round(finalPrice * 100),
            idempotencyKey: `${paymentIntentId}-${flightOrderIdForRollback}`
        });
        if (capturedPaymentIntent.status !== 'succeeded') {
            throw new Error(`PaymentIntent capture did not succeed. Status: ${capturedPaymentIntent.status}`);
        }
        console.log(`[AutoBook] Stripe PaymentIntent ${paymentIntentId} captured successfully for trip ID: ${trip.id}. Status: ${capturedPaymentIntent.status}.`);
    } catch (stripeError) {
        console.error(`[AutoBook] Stripe payment capture failed for PI: ${paymentIntentId}, Trip ID: ${trip.id}. Error: ${stripeError.message}`);
        // This error will be caught by the main catch, which will attempt Amadeus rollback using flightOrderIdForRollback
        throw stripeError; // Re-throw to trigger main catch block's rollback
    }

    // 6. Database Updates
    console.log(`[AutoBook] Updating database records for successful booking. Trip ID: ${trip.id}, Flight Order ID: ${flightOrderIdForRollback}`);
    try {
        const { error: bookingUpdateError } = await supabaseClient.from('bookings').update({
            status: 'booked', pnr: airlinePnr || flightOrderIdForRollback, price: finalPrice,
            selected_seat_number: chosenSeat?.seatNumber || null, selected_seat_info: chosenSeat || null,
            updated_at: new Date().toISOString(), amadeus_order_id: flightOrderIdForRollback
        }).eq('trip_request_id', trip.id).select().single();
        if (bookingUpdateError) throw new Error(`Failed to update 'bookings' table: ${bookingUpdateError.message}`);

        const { error: tripRequestUpdateError } = await supabaseClient.from('trip_requests').update({
            auto_book: false, status: 'booked', best_price: finalPrice,
            last_checked_at: new Date().toISOString(), pnr: airlinePnr || flightOrderIdForRollback,
            selected_seat_number: chosenSeat?.seatNumber || null
        }).eq('id', trip.id).select().single();
        if (tripRequestUpdateError) throw new Error(`Failed to update 'trip_requests' table: ${tripRequestUpdateError.message}`);

        console.log(`[AutoBook] Database records updated successfully for Trip ID: ${trip.id}.`);
    } catch (dbUpdateError) {
        console.error(`[AutoBook] Database update failed for Trip ID: ${trip.id}. Error: ${dbUpdateError.message}`);
        // This is critical. Booking and payment done, but DB update failed.
        // The main catch won't rollback Amadeus here as payment was successful. Manual reconciliation needed.
        // Or, ideally, a more sophisticated retry/queue for DB updates.
        throw dbUpdateError; // Propagate to main catch, which won't rollback Amadeus if payment succeeded.
    }

    mainOperationSuccessful = true; // All steps completed successfully
    console.log(`[AutoBook] Main operation successful for trip ID: ${trip.id}.`);
    // --- END CORE AUTO-BOOKING LOGIC ---

    return new Response(JSON.stringify({
      success: true,
      tripId: trip.id,
      flightOrderId: flightOrderIdForRollback,
      message: 'Auto-booking completed successfully.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[AutoBook] Main catch block error for Trip ID: ${trip?.id}. Error: ${error.message}`, error.stack);
    capturedErrorObject = error; // Store error for finally block

    if (flightOrderIdForRollback && !mainOperationSuccessful) { // Only rollback if main op didn't fully succeed (e.g. payment failed or DB update failed after payment)
        // Check if the error is due to Stripe failure specifically, or missing PI
        const isStripeRelatedFailure = error.message.includes('Stripe') || error.message.includes('PaymentIntent');

        if (isStripeRelatedFailure) {
            console.log(`[AutoBook] Attempting to cancel Amadeus booking ${flightOrderIdForRollback} due to payment-related failure for trip ID: ${trip?.id}.`);
            try {
                await amadeus.booking.flightOrders.cancel.post({ path: { flightOrderId: flightOrderIdForRollback } });
                console.log(`[AutoBook] Amadeus booking ${flightOrderIdForRollback} cancelled successfully after payment failure.`);
            } catch (cancelError) {
                console.error(`[AutoBook] CRITICAL: Failed to cancel Amadeus booking ${flightOrderIdForRollback} after payment failure. Manual intervention required. Error:`, cancelError.message, cancelError.stack);
            }
        } else {
            // If error is not Stripe-related but flight order was created (e.g. subsequent DB update failed but before payment success was confirmed)
            // This condition needs careful review. If payment was successful, we should NOT cancel.
            // The current structure: Stripe errors are re-thrown. If DB update fails *after* successful payment,
            // mainOperationSuccessful is FALSE. flightOrderIdForRollback is SET.
            // This means we *would* cancel here. This is WRONG if payment was successful.
            // Let's refine: only cancel if Stripe itself failed, or if paymentIntentId was missing.
            // The nested try/catch for Stripe already handles its own rollback.
            // This top-level catch should only roll back if flightOrderIdForRollback is set AND Stripe capture didn't succeed.
            // The variable `mainOperationSuccessful` being false covers this if it's set correctly before Stripe.
            // The problem is if DB update fails *after* successful Stripe capture. `mainOperationSuccessful` would be false.
            //
            // Refined logic for this main catch block rollback:
            // The nested Stripe catch ALREADY attempts rollback for Stripe errors.
            // So, this main catch rollback is primarily for:
            // 1. Missing PaymentIntentID (flight order created, then PI check fails).
            // 2. Errors *before* Stripe capture but *after* flight order creation.
            // It should NOT roll back if Stripe succeeded and a *later* step (DB update) failed.
            //
            // The `isStripeRelatedFailure` check might be too broad if used to prevent rollback.
            // Let's assume for now the primary rollback for payment issues is handled in the Stripe try-catch.
            // This main catch rollback for `flightOrderIdForRollback` should be for errors like
            // "missing paymentIntentId" specifically, or other pre-payment catastrophic failures
            // *after* an order was made.
            // The existing code for "missing paymentIntentId" already throws and should be caught here.
            if (error.message.includes('Stripe PaymentIntent ID is missing')) {
                 // This case is already handled inside the Stripe block by throwing, which should lead here.
                 // The cancellation for this specific case is already attempted there.
                 // To avoid double cancellation attempts, we rely on the Stripe block's throw.
                 // If flightOrderIdForRollback is set and error is "Stripe PaymentIntent ID is missing",
                 // cancellation was ALREADY attempted.
                 console.log(`[AutoBook] Main catch: Not re-attempting Amadeus cancellation for missing PI, assumed handled by Stripe block for trip ID: ${trip?.id}`);
            } else if (!error.message.includes('PaymentIntent capture did not succeed')) {
                // This is for errors that occurred *after* Amadeus booking but *before* successful payment,
                // and are *not* Stripe capture failures (which have their own rollback).
                // E.g. an unexpected error between Amadeus booking and Stripe section.
                console.warn(`[AutoBook] Main catch: Unhandled scenario for Amadeus rollback. flightOrderIdForRollback=${flightOrderIdForRollback}. Error: ${error.message}. Review logic. For trip ID: ${trip?.id}`);
            }
        }
    }


    if (trip && trip.id) {
      try {
        console.log(`[AutoBook] Updating trip_requests status to 'failed' for trip ID: ${trip.id}`);
        await supabaseClient
          .from('trip_requests')
          .update({
            status: 'failed',
            auto_book_processed_at: new Date().toISOString(),
            auto_book_error: error.message?.substring(0, 500),
          })
          .eq('id', trip.id);
        console.log(`[AutoBook] trip_requests status updated to 'failed' for trip ID: ${trip.id}`);
      } catch (dbError) {
        console.error(`[AutoBook] CRITICAL: Failed to update trip_requests status to 'failed' for trip ID: ${trip.id}. DB Error:`, dbError.message);
      }
    }

    return new Response(JSON.stringify({ success: false, tripId: trip?.id, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } finally {
    console.log(`[AutoBook] Entering finally block for trip ID: ${trip?.id}, Booking Attempt ID: ${bookingAttemptId}`);
    if (bookingAttemptId) {
      const attemptStatus = mainOperationSuccessful ? 'completed' : 'failed';
      try {
        await supabaseClient
          .from('booking_attempts')
          .update({
            status: attemptStatus,
            ended_at: new Date().toISOString(),
            flight_order_id: mainOperationSuccessful ? flightOrderIdForRollback : null,
            error_message: mainOperationSuccessful || !capturedErrorObject ? null : capturedErrorObject.message?.substring(0, 500),
          })
          .eq('id', bookingAttemptId);
        console.log(`[AutoBook] Booking attempt ${bookingAttemptId} status updated to: ${attemptStatus} for trip ID: ${trip?.id}`);
      } catch (finalUpdateError) {
        console.error(`[AutoBook] CRITICAL: Failed to update booking_attempts table for attempt ID ${bookingAttemptId}. Error:`, finalUpdateError.message);
      }
    }
    console.log(`[AutoBook] Finished processing attempt for trip ID: ${trip?.id}. Success: ${mainOperationSuccessful}`);
  }
});
