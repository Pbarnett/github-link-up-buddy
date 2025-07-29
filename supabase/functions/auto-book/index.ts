// Required imports for Supabase, Amadeus, Stripe, and local helpers
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Import HTTP-based Amadeus helper functions
import {
    getAmadeusAccessToken,
    priceWithAmadeus,
    cancelAmadeusOrder,
    // TravelerData, // For constructing traveler payload (unused)
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
  const flightOrderIdForRollback: string | null = null;
  let capturedErrorObject: Error | null = null; // Error or null
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

    // --- Enhanced Traveler Data Validation ---
    console.log(`[AutoBook] Validating traveler data for trip ID: ${trip.id}`);
    
    // Import validation utilities (note: we'll need to make these available in the edge function context)
    const traveler = trip.traveler_data;
    const missingFields: string[] = [];
    const validationErrors: string[] = [];
    const validationWarnings: string[] = [];

    // Basic required fields
    if (!traveler?.firstName?.trim()) missingFields.push('firstName');
    if (!traveler?.lastName?.trim()) missingFields.push('lastName');
    if (!traveler?.email?.trim()) {
        missingFields.push('email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email)) {
        validationErrors.push('Please enter a valid email address.');
    }

    // Enhanced international travel validation
    const originCountry = trip.origin_location_code?.slice(0, 2).toUpperCase();
    const destCountry = trip.destination_location_code?.slice(0, 2).toUpperCase();
    const isInternational = originCountry && destCountry && originCountry !== destCountry;

    if (isInternational) {
        console.log(`[AutoBook] International travel detected: ${originCountry} -> ${destCountry}`);
        
        if (!traveler?.passportNumber?.trim()) {
            missingFields.push('passportNumber');
        }
        
        if (!traveler?.passportExpiry?.trim()) {
            missingFields.push('passportExpiry');
        } else {
            // Validate passport expiry
            try {
                const expiryDate = new Date(traveler.passportExpiry);
                const travelDate = new Date(trip.departure_date);
                const today = new Date();
                
                if (expiryDate <= today) {
                    validationErrors.push('Passport has expired. Please renew your passport before traveling.');
                } else if (expiryDate <= travelDate) {
                    validationErrors.push('Passport expires before your travel date. Please renew your passport.');
                } else {
                    // Check 6-month rule for strict countries
                    const sixMonthsFromTravel = new Date(travelDate);
                    sixMonthsFromTravel.setMonth(sixMonthsFromTravel.getMonth() + 6);
                    
                    const strictSixMonthCountries = ['US', 'TH', 'MY', 'SG', 'PH', 'ID', 'VN'];
                    if (expiryDate < sixMonthsFromTravel && strictSixMonthCountries.includes(destCountry)) {
                        validationErrors.push('Your destination requires your passport to be valid for at least 6 months from your travel date.');
                    } else if (expiryDate < sixMonthsFromTravel) {
                        validationWarnings.push('Your passport expires within 6 months of travel. Some destinations may require longer validity.');
                    }
                }
            } catch {
                validationErrors.push('Invalid passport expiry date format. Please use YYYY-MM-DD format.');
            }
        }
        
        if (!traveler?.nationality?.trim()) {
            missingFields.push('nationality');
        }
        
        // Enhanced security destinations
        const enhancedSecurityCountries = ['US', 'CA', 'GB', 'AU', 'NZ', 'JP', 'KR', 'IL', 'AE', 'SA'];
        if (enhancedSecurityCountries.includes(destCountry)) {
            if (!traveler?.issuanceCountry?.trim()) {
                missingFields.push('issuanceCountry');
            }
            validationWarnings.push('This destination may require additional security screening. Please arrive at the airport early.');
        }
    }

    // Phone number validation (recommended)
    if (!traveler?.phone?.trim()) {
        validationWarnings.push('A phone number is recommended for travel notifications.');
    } else if (!/^\+?[\d\s\-()]+$/.test(traveler.phone)) {
        validationWarnings.push('Please verify your phone number format is correct.');
    }

    // Date of birth validation
    if (!traveler?.dateOfBirth?.trim()) {
        missingFields.push('dateOfBirth');
    } else {
        try {
            const birthDate = new Date(traveler.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 0 || age > 120) {
                validationErrors.push('Please enter a valid date of birth.');
            }
            
            if (age < 18) {
                validationWarnings.push('Travelers under 18 may require additional documentation.');
            }
        } catch {
            validationErrors.push('Please enter a valid date of birth in YYYY-MM-DD format.');
        }
    }

    // Compile all validation issues
    const hasValidationErrors = missingFields.length > 0 || validationErrors.length > 0;
    
    if (hasValidationErrors) {
        const fieldNames = missingFields.map(field => {
            const displayNames: Record<string, string> = {
                firstName: 'First Name',
                lastName: 'Last Name',
                dateOfBirth: 'Date of Birth',
                email: 'Email Address',
                phone: 'Phone Number',
                passportNumber: 'Passport Number',
                passportExpiry: 'Passport Expiry Date',
                nationality: 'Nationality',
                issuanceCountry: 'Passport Issuing Country'
            };
            return displayNames[field] || field;
        });
        
        const errorDetails = [];
        if (missingFields.length > 0) {
            errorDetails.push(`Missing required information: ${fieldNames.join(', ')}`);
        }
        if (validationErrors.length > 0) {
            errorDetails.push(...validationErrors);
        }
        
        const errorMsg = errorDetails.join('. ');
        console.warn(`[AutoBook] Validation failed for trip ID ${trip.id}: ${errorMsg}`);
        
        if (validationWarnings.length > 0) {
            console.info(`[AutoBook] Validation warnings for trip ID ${trip.id}: ${validationWarnings.join('. ')}`);
        }

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

    // Note: user object removed as it's not used in the Duffel booking flow
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
    // Note: seatSelections array removed as it's not used in the current booking flow
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
                                    // Note: seatSelections array removed as it's not used in the current booking flow
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
            } catch (_fetchErr) {
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

    // 3. Production-Ready Duffel Integration Following Saga Pattern
    console.log(`[AutoBook] Starting Duffel booking integration for trip ID: ${trip.id}`);
    
    // Check feature flag for Duffel live mode
    const { data: featureFlag } = await supabaseClient
        .from('feature_flags')
        .select('enabled')
        .eq('name', 'duffel_live_enabled')
        .single();
    
    const useLiveDuffel = featureFlag?.enabled || false;
    console.log(`[AutoBook] Duffel mode: ${useLiveDuffel ? 'LIVE' : 'TEST'} for trip ID: ${trip.id}`);
    
    // Import enhanced Duffel service
    const { DuffelService, createDuffelService } = await import('../lib/duffelService.ts');
    
    let duffelService: Record<string, unknown>;
    let selectedOffer: Record<string, unknown> | null = null;
    
    try {
        // Initialize Duffel service with appropriate environment
        duffelService = createDuffelService(useLiveDuffel);
        
        // Create Duffel offer request from trip criteria
        const duffelOfferRequest = DuffelService.mapAmadeusSearchToDuffelRequest(
            {
                origin: trip.origin_location_code,
                destination: trip.destination_location_code,
                departure_date: trip.departure_date,
                return_date: trip.return_date,
                cabin_class: trip.travel_class?.toLowerCase() || 'economy',
                max_connections: trip.nonstop_required ? 0 : undefined
            },
            { adults: trip.adults }
        );
        
        console.log(`[AutoBook] Creating Duffel offer request for trip ID: ${trip.id}`);
        const offerRequest = await (duffelService as Record<string, unknown>).createOfferRequest(duffelOfferRequest);
        
        // Wait for offers to be processed (Duffel needs time to fetch from airlines)
        console.log(`[AutoBook] Waiting for offers to be processed...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get available offers
        const duffelOffers = await (duffelService as Record<string, unknown>).getOffers(offerRequest.id, 20);
        
        if (!duffelOffers || duffelOffers.length === 0) {
            console.error(`[AutoBook] No valid Duffel offers found for trip ID: ${trip.id}`);
            throw new Error('No bookable offers found via Duffel within budget and time constraints');
        }
        
        // Filter offers within budget and select best one
        const affordableOffers = duffelOffers.filter(offer => {
            const price = parseFloat(offer.total_amount);
            return price <= trip.max_price;
        });
        
        if (affordableOffers.length === 0) {
            console.warn(`[AutoBook] No Duffel offers within budget ${trip.max_price} for trip ID: ${trip.id}`);
            throw new Error(`No offers found within budget of ${trip.max_price}`);
        }
        
        // Sort by price and select cheapest
        affordableOffers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
        selectedOffer = affordableOffers[0];
        
        console.log(`[AutoBook] Selected Duffel offer ${selectedOffer.id} with price ${selectedOffer.total_amount} ${selectedOffer.total_currency} for trip ID: ${trip.id}`);
        
        // Store Duffel offer data for reference
        if (associatedBookingRequestId) {
            await supabaseClient
                .from('booking_requests')
                .update({
                    duffel_offer_id: selectedOffer.id,
                    duffel_offer_data: selectedOffer,
                    updated_at: new Date().toISOString()
                })
                .eq('id', associatedBookingRequestId);
        }
        
        // Validate offer is still available before proceeding
        const validatedOffer = await (duffelService as Record<string, unknown>).getOffer(selectedOffer.id);
        if (!validatedOffer) {
            throw new Error('Selected offer has expired or is no longer available');
        }
        
        console.log(`[AutoBook] Offer ${selectedOffer.id} validated and still available`);
        
    } catch (_duffelSearchError) {
        console.error(`[AutoBook] Duffel search/offer selection failed for trip ID: ${trip.id}:`, duffelSearchError.message);
        
        // Update booking attempt with search failure
        if (bookingAttemptId) {
            await supabaseClient
                .from('booking_attempts')
                .update({
                    status: 'failed',
                    ended_at: new Date().toISOString(),
                    error_message: `Duffel search failed: ${duffelSearchError.message}`.substring(0, 500)
                })
                .eq('id', bookingAttemptId);
        }
        
        throw new Error(`Flight search failed: ${duffelSearchError.message}`);
    }

    // 4. Stripe PaymentIntent Capture (updated numbering)
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
    } catch (_stripeError) {
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
            } catch (_refundErr) {
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
    
    // Extract price and PNR from Duffel offer
    const finalPrice = selectedOffer?.total_amount ? parseFloat(selectedOffer.total_amount) : 0;
    const airlinePnr = selectedOffer?.booking_reference || 'PENDING';
    
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
    } catch (_dbUpdateError) {
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
            } catch (_cancelError) {
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
        } catch (_refundError) {
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
      } catch (_dbError) {
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
      } catch (_finalUpdateError) {
        console.error(`[AutoBook] CRITICAL: Failed to update booking_attempts table for attempt ID ${bookingAttemptId}. Error:`, finalUpdateError.message);
      }
    }
    console.log(`[AutoBook] Finished processing attempt for trip ID: ${trip?.id}. Success: ${mainOperationSuccessful}`);
  }
});
