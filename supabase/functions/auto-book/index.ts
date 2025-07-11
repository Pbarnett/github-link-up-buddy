// Required imports for Supabase, Amadeus, Stripe, and local helpers
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Import HTTP-based Amadeus helper functions
import {
    getAmadeusAccessToken,
    priceWithAmadeus,
    bookWithAmadeus,
    cancelAmadeusOrder,
    TravelerData, // For constructing traveler payload
    // BookingResponse, // If needed for type checking results
} from '../lib/amadeus.ts';
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
  travel_class?: string; // Added for priceWithAmadeus
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
    passportExpiry?: string; // Optional fields for documents
    nationality?: string;    // Optional fields for documents
    issuanceCountry?: string;// Optional fields for documents
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
  let accessToken: string | null = null; // Scoped accessToken, initialized to null
  let stripePaymentCapturedByAutoBook = false; // New flag
  let associatedBookingRequestId: string | null = null;

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[AutoBook] CRITICAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured for invoking other functions.');
    // This would ideally prevent the function from even starting or return an immediate error.
    // For now, subsequent fetch calls will fail if these are missing.
  }
  const sendNotificationUrl = `${supabaseUrl}/functions/v1/send-notification`;

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

    // --- Check for existing booking_request and payment_captured status ---
    if (trip && trip.id) {
        console.log(`[AutoBook] Checking for existing booking_request for trip_request_id: ${trip.id} with status 'pending_payment'.`);
        const { data: existingBR, error: brFetchError } = await supabaseClient
            .from('booking_requests')
            .select('id, payment_captured')
            .eq('trip_request_id', trip.id)
            .eq('status', 'pending_payment')
            .maybeSingle();

        if (brFetchError) {
            console.warn(`[AutoBook] Error fetching existing booking_request for trip_request_id ${trip.id}:`, brFetchError.message);
        }

        if (existingBR) {
            console.log(`[AutoBook] Found existing booking_request (ID: ${existingBR.id}) for trip_request_id: ${trip.id} with payment_captured: ${existingBR.payment_captured}`);
            if (existingBR.payment_captured === true) {
                console.log(`[AutoBook] Payment already captured for booking_request ${existingBR.id} (trip_request_id ${trip.id}). Aborting auto-book to prevent double processing.`);
                if (bookingAttemptId) {
                    await supabaseClient
                        .from('booking_attempts')
                        .update({
                            status: 'completed_idempotent',
                            ended_at: new Date().toISOString(),
                            error_message: 'Payment already captured for associated booking_request.'
                        })
                        .eq('id', bookingAttemptId);
                }
                return new Response(JSON.stringify({ success: true, message: 'Payment already captured for this trip via a booking request. Auto-book processing stopped.' }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } else {
                associatedBookingRequestId = existingBR.id;
                console.log(`[AutoBook] Associated booking_request ID ${associatedBookingRequestId} found, payment not yet captured. Will update this record after Stripe capture.`);
            }
        } else {
            console.log(`[AutoBook] No existing booking_request in 'pending_payment' state found for trip_request_id: ${trip.id}. Proceeding with standard auto-book flow.`);
        }
    }
    // --- End Check ---

    // --- Traveler Data Validation ---
    console.log(`[AutoBook] Validating traveler data for trip ID: ${trip.id}`);
    const traveler = trip.traveler_data;
    const missingFields: string[] = [];

    if (!traveler?.firstName?.trim()) missingFields.push('firstName');
    if (!traveler?.lastName?.trim()) missingFields.push('lastName');
    if (!traveler?.email?.trim()) missingFields.push('email');

    const originCountry = trip.origin_location_code?.slice(0, 2).toUpperCase();
    const destCountry = trip.destination_location_code?.slice(0, 2).toUpperCase();
    const isInternational = originCountry && destCountry && originCountry !== destCountry;

    if (isInternational && !traveler?.passportNumber?.trim()) {
        missingFields.push('passportNumber');
    }

    if (missingFields.length > 0) {
        const errorMsg = `Missing or invalid traveler data: ${missingFields.join(', ')}`;
        console.warn(`[AutoBook] Validation failed for trip ID ${trip.id}: ${errorMsg}`);

        const { error: insertBookingReqError } = await supabaseClient
            .from('booking_requests')
            .insert({
                trip_request_id: trip.id,
                status: 'validation_failed',
                error_message: errorMsg,
                user_id: trip.user_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (insertBookingReqError) {
            console.error(`[AutoBook] Failed to insert validation_failed record into booking_requests for trip ${trip.id}:`, insertBookingReqError.message);
        } else {
            console.log(`[AutoBook] Inserted validation_failed record into booking_requests for trip ${trip.id}.`);
        }

        if (trip.user_id && sendNotificationUrl && serviceRoleKey) {
             console.log(`[AutoBook] Sending 'traveler_data_incomplete' notification for trip ID: ${trip.id}`);
             fetch(sendNotificationUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    'apikey': serviceRoleKey,
                },
                body: JSON.stringify({
                    user_id: trip.user_id,
                    type: 'traveler_data_incomplete',
                    payload: { missingFields, trip_request_id: trip.id },
                }),
            }).then(async res => {
                if (!res.ok) console.error('[AutoBook] traveler_data_incomplete notification failed:', res.status, await res.text());
                else console.log('[AutoBook] traveler_data_incomplete notification sent.');
            }).catch(err =>
                console.error('[AutoBook] Error sending traveler_data_incomplete notification:', err.message)
            );
        } else {
            console.warn('[AutoBook] Cannot send traveler_data_incomplete notification due to missing user_id or Supabase config for functions.');
        }

        if (bookingAttemptId) {
             await supabaseClient
                .from('booking_attempts')
                .update({
                    status: 'failed',
                    ended_at: new Date().toISOString(),
                    error_message: `Validation failed: ${errorMsg}`.substring(0,500)
                })
                .eq('id', bookingAttemptId);
        }

        return new Response(JSON.stringify({ success: false, error: 'Traveler data validation failed.', details: errorMsg }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } else {
        console.log(`[AutoBook] Traveler data validation passed for trip ID: ${trip.id}`);
    }
    // --- End Traveler Data Validation ---

    // --- BEGIN CORE AUTO-BOOKING LOGIC ---

    // Get Amadeus Access Token
    console.log("[AutoBook] Fetching Amadeus Access Token...");
    accessToken = await getAmadeusAccessToken(); // Assign to scoped variable
    if (!accessToken) {
        throw new Error("Failed to retrieve Amadeus access token.");
    }
    console.log("[AutoBook] Amadeus Access Token acquired.");

    // User object placeholder (remains the same)
    const user = {
        email: trip.traveler_data?.email || 'placeholder@example.com',
        phone: trip.traveler_data?.phone || '0000000000'
    };
    if (!trip.traveler_data?.email) console.warn(`[AutoBook] Using placeholder email for booking for trip ID: ${trip.id}`);

    // 1. Search and Price Flight Offers (using HTTP helper)
    console.log(`[AutoBook] Searching and pricing flight offers for trip ID: ${trip.id} via HTTP helper...`);
    const pricedOffer = await priceWithAmadeus({
        originLocationCode: trip.origin_location_code,
        destinationLocationCode: trip.destination_location_code,
        departureDate: trip.departure_date,
        returnDate: trip.return_date,
        adults: trip.adults,
        travelClass: trip.travel_class?.toUpperCase(),
        nonStop: trip.nonstop_required,
        maxOffers: 3 // Corresponds to max: 3 in previous logic for pricing attempts
    }, accessToken);

    if (!pricedOffer) {
        console.log(`[AutoBook] No priceable flight offers found for trip ID: ${trip.id} via HTTP helper.`);
        throw new Error('No priceable flight offers found via HTTP.');
    }
    // pricedOffer from helper is already the confirmed priced offer data object
    console.log(`[AutoBook] Successfully priced an offer for trip ID: ${trip.id} via HTTP. Offer ID (if available): ${pricedOffer.id}, Price: ${pricedOffer.price?.total}`);

    // 2. Conditional Seat Selection Logic
    let seatSelections: Array<{ segmentId: string; seatNumber: string }> = [];
    const enableSeatSelectionEnv = Deno.env.get('ENABLE_SEAT_SELECTION');
    const enableSeatSelection = enableSeatSelectionEnv === 'true';

    console.log(`[AutoBook] Seat selection feature flag 'ENABLE_SEAT_SELECTION': ${enableSeatSelectionEnv} (parsed as: ${enableSeatSelection}) for trip ID: ${trip.id}`);

    if (enableSeatSelection && pricedOffer && pricedOffer.id && accessToken) {
        const amadeusBaseUrl = Deno.env.get('AMADEUS_BASE_URL');
        const flightOfferIdForSeatmap = pricedOffer.id;

        let baseFareForSeatSelection: number | null = null;
        if (pricedOffer.price?.grandTotal) {
            baseFareForSeatSelection = parseFloat(String(pricedOffer.price.grandTotal));
        } else if (pricedOffer.price?.total) {
            baseFareForSeatSelection = parseFloat(String(pricedOffer.price.total));
        } else if (typeof pricedOffer.price === 'number') {
             baseFareForSeatSelection = pricedOffer.price;
        }
        if (baseFareForSeatSelection !== null && isNaN(baseFareForSeatSelection)) baseFareForSeatSelection = null;


        if (!amadeusBaseUrl) {
            console.warn('[AutoBook] AMADEUS_BASE_URL not set. Skipping seat map fetch for trip ID:', trip.id);
        } else if (baseFareForSeatSelection === null) {
            console.warn(`[AutoBook] Base fare for seat selection could not be determined from pricedOffer.price (value: ${JSON.stringify(pricedOffer.price)}). Skipping selectSeat call for trip ID:`, trip.id);
        } else {
            console.log(`[AutoBook] Fetching seat map for flightOfferId: ${flightOfferIdForSeatmap}, Trip ID: ${trip.id}`);
            try {
                const seatMapResponse = await fetch(
                    `${amadeusBaseUrl}/v1/shopping/seatmaps?flightOfferId=${encodeURIComponent(flightOfferIdForSeatmap)}`,
                    { headers: { 'Authorization': `Bearer ${accessToken}` } }
                );

                if (!seatMapResponse.ok) {
                    const errorText = await seatMapResponse.text().catch(() => `Status ${seatMapResponse.status}`);
                    console.warn(`[AutoBook] Seat map fetch failed for trip ID ${trip.id}: ${seatMapResponse.status}. Error: ${errorText}`);
                } else {
                    const seatMapResJson = await seatMapResponse.json().catch(() => null);
                    if (seatMapResJson?.data) {
                        console.log(`[AutoBook] Seat map data received for trip ID: ${trip.id}.`);

                        let seatMapInputForSelectSeat = null;
                        if (Array.isArray(seatMapResJson.data)) {
                             seatMapInputForSelectSeat = { flightSegments: seatMapResJson.data };
                             console.log(`[AutoBook] Passing ${seatMapResJson.data.length} segment maps (wrapped) to selectSeat.`);
                        } else if (typeof seatMapResJson.data === 'object' && seatMapResJson.data !== null) {
                             seatMapInputForSelectSeat = seatMapResJson.data;
                             console.log(`[AutoBook] Seat map data is an object, passing to selectSeat for trip ID: ${trip.id}.`);
                        }

                        if (seatMapInputForSelectSeat) {
                            console.log(`[AutoBook] Calling selectSeat for trip ID: ${trip.id} with baseFare: ${baseFareForSeatSelection}, totalBudget: ${trip.max_price}`);
                            const chosen = selectSeat(
                                seatMapInputForSelectSeat,
                                baseFareForSeatSelection,
                                trip.max_price,
                                trip.allow_middle_seat
                            );

                            if (chosen) {
                                const firstSegmentId = pricedOffer.itineraries?.[0]?.segments?.[0]?.id;
                                if (firstSegmentId) {
                                    console.log(`[AutoBook] Seat selected: ${chosen.seatNumber}. Assigning to segment ID: ${firstSegmentId} for trip ID: ${trip.id}.`);
                                    seatSelections = [{ segmentId: firstSegmentId, seatNumber: chosen.seatNumber }];
                                } else {
                                    console.warn(`[AutoBook] Could not determine segment ID for chosen seat from pricedOffer (trip ID: ${trip.id}). Proceeding without seat selection.`);
                                }
                            } else {
                                console.log(`[AutoBook] No seat selected by selectSeat helper for trip ID: ${trip.id}.`);
                            }
                        } else {
                            console.log(`[AutoBook] Processed seat map data is null or unsuitable for selectSeat for trip ID: ${trip.id}.`);
                        }
                    } else {
                        console.log(`[AutoBook] No 'data' property in seat map JSON response or fetch failed for trip ID: ${trip.id}.`);
                    }
                }
            } catch (fetchErr) {
                console.warn(`[AutoBook] Error during seat map fetch or processing for trip ID ${trip.id}:`, fetchErr.message);
            }
        }
    } else {
        if (!enableSeatSelection) {
            console.log(`[AutoBook] Seat selection is disabled by feature flag for trip ID: ${trip.id}.`);
        } else {
            console.log(`[AutoBook] Seat selection skipped due to missing pricedOffer, pricedOffer.id, or accessToken for trip ID: ${trip.id}.`);
        }
    }
    // --- End Conditional Seat Selection ---

    // 3. Amadeus Flight Order Booking (using HTTP helper)
    console.log(`[AutoBook] Creating flight order via HTTP for trip ID: ${trip.id}. Chosen seat(s): ${seatSelections.length > 0 ? JSON.stringify(seatSelections) : 'None'}`);

    const travelerDataPayload: TravelerData = {
        firstName: trip.traveler_data?.firstName || "TestFirstName",
        lastName: trip.traveler_data?.lastName || "TestLastName",
        dateOfBirth: trip.traveler_data?.dateOfBirth, // Format YYYY-MM-DD
        gender: (trip.traveler_data?.gender?.toUpperCase() as "MALE" | "FEMALE" | undefined) || "MALE",
        email: user.email,
        phone: user.phone,
        documents: trip.traveler_data?.passportNumber ? [{
            documentType: 'PASSPORT',
            number: trip.traveler_data.passportNumber,
            expiryDate: trip.traveler_data.passportExpiry,
            nationality: trip.traveler_data.nationality,
            issuanceCountry: trip.traveler_data.issuanceCountry,
        }] : undefined,
    };

    const bookingResult = await bookWithAmadeus(
        pricedOffer,
        travelerDataPayload,
        seatSelections, // Pass the conditionally populated seatSelections array
        accessToken
    );

    if (!bookingResult.success || !bookingResult.bookingReference) { // Ensure bookingReference exists
        console.error(`[AutoBook] Amadeus booking via HTTP failed for trip ID: ${trip.id}. Error: ${bookingResult.error}`);
        throw new Error(bookingResult.error || 'Amadeus booking via HTTP failed.');
    }

    flightOrderIdForRollback = bookingResult.bookingReference; // Store for potential rollback
    const airlinePnr = bookingResult.confirmationNumber || bookingResult.bookingReference; // Define airlinePnr correctly
    // Attempt to get final price from bookingResult.bookingData, fallback to pricedOffer.price.total
    const bookingDataFinalPrice = bookingResult.bookingData?.flightOffers?.[0]?.price?.total || bookingResult.bookingData?.price?.total;
    const finalPrice = Number(bookingDataFinalPrice || pricedOffer.price?.total);

    if (isNaN(finalPrice)) {
        console.error('[AutoBook] Could not determine final price from booking response. PricedOffer price: ' + pricedOffer?.price?.total + ', BookingResult data: ', bookingResult.bookingData);
        throw new Error('Amadeus booking succeeded but final price is unclear.');
    }
    console.log(`[AutoBook] Final confirmed price: ${finalPrice} for trip ID: ${trip.id}`);

    // 5. Stripe PaymentIntent Capture (logic remains largely the same)
    console.log(`[AutoBook] Initiating Stripe payment capture for trip ID: ${trip.id}. Flight Order ID: ${flightOrderIdForRollback}`);
    const paymentIntentId = trip.payment_intent_id;
    if (!paymentIntentId) {
        console.error(`[AutoBook] Stripe PaymentIntent ID is missing for trip ID: ${trip.id}. Cannot capture payment.`);
        throw new Error(`Stripe PaymentIntent ID is missing. Booking must be rolled back.`);
    }
    console.log(`[AutoBook] Found PaymentIntent ID: ${paymentIntentId} for trip ID: ${trip.id}.`);
    try {
        // Simplified Stripe capture call
        const capturedPaymentIntent = await stripe.paymentIntents.capture(paymentIntentId);

        if (capturedPaymentIntent.status !== 'succeeded') {
            throw new Error(`PaymentIntent capture did not succeed. Status: ${capturedPaymentIntent.status}`);
        }
        stripePaymentCapturedByAutoBook = true;
        console.log(`[AutoBook] Stripe PaymentIntent ${paymentIntentId} captured successfully by auto-book for trip ID: ${trip.id}. Status: ${capturedPaymentIntent.status}.`);

        if (associatedBookingRequestId) {
            console.log(`[AutoBook] Updating payment_captured to true for booking_request ID: ${associatedBookingRequestId}`);
            const { error: updateBrError } = await supabaseClient
                .from('booking_requests')
                .update({
                    payment_captured: true,
                    status: 'processing_after_payment',
                    updated_at: new Date().toISOString()
                })
                .eq('id', associatedBookingRequestId);

            if (updateBrError) {
                console.error(`[AutoBook] CRITICAL: Failed to update booking_request ${associatedBookingRequestId} with payment_captured=true. Error: ${updateBrError.message}. Payment was captured. Manual reconciliation may be needed.`);
                throw new Error(`Failed to update booking_request ${associatedBookingRequestId} payment_captured flag: ${updateBrError.message}`);
            } else {
                console.log(`[AutoBook] Successfully updated payment_captured for booking_request ID: ${associatedBookingRequestId}.`);
            }
        }
    } catch (stripeError) {
        // Enhanced error handling for Stripe capture failure
        console.error(`[AutoBook] Stripe payment capture failed for PI: ${paymentIntentId}, Trip ID: ${trip.id}. Error: ${stripeError.message}`, stripeError);

        if (paymentIntentId && trip) {
            try {
                console.warn(`[AutoBook] Attempting to refund Stripe payment ${paymentIntentId} due to capture failure.`);
                await stripe.refunds.create({
                    payment_intent: paymentIntentId,
                    reason: 'application_error'
                });
                console.log(`[AutoBook] Stripe payment ${paymentIntentId} refunded successfully after capture failure.`);
            } catch (refundErr) {
                console.error(`[AutoBook] CRITICAL: Refund attempt for ${paymentIntentId} failed after capture failure. Manual intervention likely required. Refund Error:`, refundErr.message);
            }
        }

        if (associatedBookingRequestId && trip) {
            console.log(`[AutoBook] Updating associated booking_request ${associatedBookingRequestId} to 'failed' due to Stripe capture error.`);
            const { error: updateBrError } = await supabaseClient
                .from('booking_requests')
                .update({
                    status: 'failed',
                    error_message: `Stripe capture failed: ${stripeError.message}`.substring(0, 500),
                    updated_at: new Date().toISOString(),
                    payment_captured: false
                })
                .eq('id', associatedBookingRequestId);
            if (updateBrError) {
                console.error(`[AutoBook] Failed to update booking_request ${associatedBookingRequestId} to 'failed' after Stripe error:`, updateBrError.message);
            }
        }

        if (trip && trip.user_id && sendNotificationUrl && serviceRoleKey) {
            console.log(`[AutoBook] Sending 'booking_failed' notification due to Stripe capture error for trip ID: ${trip.id}`);
            const failurePayload = {
                trip_request_id: trip.id,
                payment_intent_id: paymentIntentId, // Ensure paymentIntentId is defined in this scope
                error: `Stripe capture failed: ${stripeError.message}`,
            };
            fetch(sendNotificationUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${serviceRoleKey}`,
                    'Content-Type': 'application/json',
                    'apikey': serviceRoleKey,
                },
                body: JSON.stringify({
                    user_id: trip.user_id,
                    type: 'booking_failed',
                    payload: failurePayload,
                }),
            }).catch(notificationErr =>
                console.error('[AutoBook] Booking_failed notification (after Stripe error) failed:', notificationErr.message)
            );
        }

        throw new Error(`Stripe capture failed: ${stripeError.message}`); // Re-throw to trigger main error handling
    }

    // 6. Database Updates
    console.log(`[AutoBook] Updating database records for successful booking. Trip ID: ${trip.id}, Flight Order ID: ${flightOrderIdForRollback}`);
    try {
        const { error: bookingUpdateError } = await supabaseClient.from('bookings').update({
            status: 'booked', pnr: airlinePnr, price: finalPrice,
            selected_seat_number: null, // Stubbed out chosenSeat
            selected_seat_info: null,   // Stubbed out chosenSeat
            updated_at: new Date().toISOString(), amadeus_order_id: flightOrderIdForRollback
        }).eq('trip_request_id', trip.id).select().single();
        if (bookingUpdateError) throw new Error(`Failed to update 'bookings' table: ${bookingUpdateError.message}`);

        const { error: tripRequestUpdateError } = await supabaseClient.from('trip_requests').update({
            auto_book: false, status: 'booked', best_price: finalPrice,
            last_checked_at: new Date().toISOString(), pnr: airlinePnr,
            selected_seat_number: null // Stubbed out chosenSeat
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

    if (mainOperationSuccessful && trip && serviceRoleKey && sendNotificationUrl) {
        console.log(`[AutoBook] Invoking send-notification for booking_success. Trip ID: ${trip.id}`);
        // airlinePnr, flightOrderIdForRollback, finalPrice, pricedOffer should be available here
        const successPayload = {
            pnr: airlinePnr, // Use defined airlinePnr
            flight_details: `Flight from ${trip.origin_location_code} to ${trip.destination_location_code}`,
            departure_datetime: pricedOffer?.itineraries?.[0]?.segments?.[0]?.departure?.at || trip.departure_date, // Best available departure
            arrival_datetime: pricedOffer?.itineraries?.[0]?.segments?.[pricedOffer.itineraries[0].segments.length -1]?.arrival?.at, // Best available arrival
            price: finalPrice,
            airline: pricedOffer?.validatingAirlineCodes?.[0] || pricedOffer?.flightOffers?.[0]?.validatingAirlineCodes?.[0], // Best available airline
            // Ensure carrierCode and number are present before concatenating
            flight_number: pricedOffer?.itineraries?.[0]?.segments?.[0]?.carrierCode && pricedOffer?.itineraries?.[0]?.segments?.[0]?.number
                           ? pricedOffer.itineraries[0].segments[0].carrierCode + pricedOffer.itineraries[0].segments[0].number
                           : 'N/A'
        };
        fetch(sendNotificationUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey
            },
            body: JSON.stringify({
                user_id: trip.user_id,
                type: 'booking_success',
                payload: successPayload
            })
        }).then(async res => { // Made async to await res.text()
            if (!res.ok) console.error('[AutoBook] send-notification call for success failed:', res.status, await res.text());
            else console.log('[AutoBook] send-notification for success invoked.');
        }).catch(err => console.error('[AutoBook] Error invoking send-notification for success:', err.message));
    }

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
    // mainOperationSuccessful remains false or is explicitly set if error occurs after it was true

    if (flightOrderIdForRollback && !mainOperationSuccessful) { // Check if Amadeus booking was made and operation didn't fully succeed
        const isStripePaymentFailure = error.message.includes('Stripe PaymentIntent ID is missing') || error.message.includes('PaymentIntent capture did not succeed');

        if (isStripePaymentFailure) {
            console.log(`[AutoBook] Attempting to cancel Amadeus booking ${flightOrderIdForRollback} via HTTP due to Stripe payment failure for trip ID: ${trip?.id}.`);
            try {
                if (!accessToken) { // Should ideally not happen if booking was made
                    console.warn("[AutoBook] Amadeus accessToken is null in catch block, attempting to re-fetch for cancellation.");
                    accessToken = await getAmadeusAccessToken();
                }
                if (accessToken) {
                    const cancelOutcome = await cancelAmadeusOrder(flightOrderIdForRollback, accessToken);
                    if (cancelOutcome.success) {
                        console.log(`[AutoBook] Amadeus booking ${flightOrderIdForRollback} cancelled successfully via HTTP after Stripe payment failure.`);
                    } else {
                        console.error(`[AutoBook] CRITICAL: Failed to cancel Amadeus booking ${flightOrderIdForRollback} via HTTP after Stripe payment failure. Error: ${cancelOutcome.error}`);
                    }
                } else {
                     console.error(`[AutoBook] CRITICAL: Cannot cancel Amadeus booking ${flightOrderIdForRollback} as accessToken could not be retrieved.`);
                }
            } catch (cancelError) {
                console.error(`[AutoBook] CRITICAL: Exception during Amadeus booking cancellation for ${flightOrderIdForRollback} via HTTP. Error:`, cancelError.message, cancelError.stack);
            }
        } else if (error.message.includes('No priceable flight offers found') || error.message.includes('Amadeus flight search failed')) {
            console.log(`[AutoBook] No Amadeus cancellation needed as booking was not created. Error: ${error.message}`);
        }
        // Note: If error occurred AFTER successful Stripe capture (e.g., during DB update),
        // Amadeus cancellation should NOT happen here as payment was successful.
        // The 'stripePaymentCapturedByAutoBook' flag will handle the refund attempt below.
        // The condition '!mainOperationSuccessful' is key. If DB update fails, mainOperationSuccessful is false.
    }

    // --- NEW STRIPE REFUND LOGIC ---
    if (stripePaymentCapturedByAutoBook && trip && trip.payment_intent_id) {
        // This means Stripe capture was successful, but a subsequent step (like DB update) failed.
        console.warn(`[AutoBook] Error occurred after Stripe payment capture for trip ID ${trip.id}. Attempting to refund Stripe payment ${trip.payment_intent_id}. Main Error: ${error.message}`);
        try {
            await stripe.refunds.create({
                payment_intent: trip.payment_intent_id,
                reason: 'application_error',
            });
            console.log(`[AutoBook] Stripe payment ${trip.payment_intent_id} for trip ID ${trip.id} refunded successfully due to post-capture error.`);
        } catch (refundError) {
            console.error(`[AutoBook] CRITICAL: Failed to refund Stripe payment ${trip.payment_intent_id} for trip ID ${trip.id} after a post-capture error. Manual intervention required. Refund Error:`, refundError.message);
        }
    }
    // --- END NEW STRIPE REFUND LOGIC ---


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

      // Invoke send-notification for failure
      if (trip.user_id && serviceRoleKey && sendNotificationUrl) {
        console.log(`[AutoBook] Invoking send-notification for booking_failure. Trip ID: ${trip.id}`);
        const failurePayload = {
            trip_request_id: trip.id,
            // pricedOffer might be null if error occurred before it was defined.
            // Check if pricedOffer is in scope and defined before accessing its properties.
            // For simplicity, assuming 'pricedOffer' variable exists in this catch scope,
            // or it was declared at a higher scope. If it's only in try, it won't be accessible.
            // Let's assume `pricedOffer` was declared at the top of the try block.
            flight_offer_id: typeof pricedOffer !== 'undefined' && pricedOffer ? pricedOffer.id : null,
            amadeus_order_id: flightOrderIdForRollback || null,
            error: capturedErrorObject?.message || 'Unknown booking error',
            origin: trip.origin_location_code,
            destination: trip.destination_location_code,
            departure_date: trip.departure_date
        };
        fetch(sendNotificationUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey
            },
            body: JSON.stringify({
                user_id: trip.user_id,
                type: 'booking_failure',
                payload: failurePayload
            })
        }).then(async res => { // Made async to await res.text()
            if (!res.ok) console.error('[AutoBook] send-notification call for failure failed:', res.status, await res.text());
            else console.log('[AutoBook] send-notification for failure invoked.');
        }).catch(err => console.error('[AutoBook] Error invoking send-notification for failure:', err.message));
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
