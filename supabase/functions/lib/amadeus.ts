// supabase/functions/lib/amadeus.ts

// Environment variable checks (moved to top for clarity, though Deno.env can be accessed directly)
const AMADEUS_CLIENT_ID = Deno.env.get("AMADEUS_CLIENT_ID");
const AMADEUS_CLIENT_SECRET = Deno.env.get("AMADEUS_CLIENT_SECRET");
const AMADEUS_BASE_URL = Deno.env.get("AMADEUS_BASE_URL");

if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
  console.error('CRITICAL Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, and AMADEUS_BASE_URL must be set.');
  // Depending on Deno version, `Deno.exit(1)` might be too harsh for a library.
  // Throwing an error at module load time is also an option, or functions will fail at runtime.
  // For now, functions will throw if these are missing at call time.
}

export interface TravelerData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: "MALE" | "FEMALE"; // Or other values Amadeus accepts
  documents?: {
    documentType: string; // e.g., PASSPORT
    number: string;
    expiryDate?: string; // YYYY-MM-DD
    nationality?: string; // 2-letter country code
    issuanceCountry?: string; // 2-letter country code
    // holder?: boolean; // Not typically needed here, set by Amadeus if required
  }[];
}

export interface BookingResponse {
  success: boolean;
  bookingReference?: string; // This is the Amadeus Order ID
  confirmationNumber?: string; // This is usually the Airline PNR
  error?: string;
  bookingData?: any; // Full response from Amadeus
}

export interface SeatSelection {
  segmentId: string;
  seatNumber: string;
}

// Function to get Amadeus Access Token
export async function getAmadeusAccessToken(): Promise<string> {
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
    console.error("Error: Missing Amadeus credentials in environment variables for getAmadeusAccessToken.");
    throw new Error("Missing Amadeus credentials.");
  }

  const response = await fetch(`${AMADEUS_BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Failed to get Amadeus access token: ${response.status} ${response.statusText}`, errorText);
    throw new Error(`Failed to get Amadeus access token: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// New function to search and price flight offers
export async function priceWithAmadeus(
  tripParams: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string; // YYYY-MM-DD
    returnDate?: string; // YYYY-MM-DD, optional for one-way
    adults: number;
    travelClass?: string; // e.g., ECONOMY, BUSINESS
    nonStop?: boolean;
    maxOffers?: number; // Max offers to fetch for pricing (e.g., 3)
  },
  token: string
): Promise<any | null> {
  if (!AMADEUS_BASE_URL) {
    console.error("Error: AMADEUS_BASE_URL not configured for priceWithAmadeus.");
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  // Step 1: Flight Offers Search
  const searchParams = new URLSearchParams({
    originLocationCode: tripParams.originLocationCode,
    destinationLocationCode: tripParams.destinationLocationCode,
    departureDate: tripParams.departureDate,
    adults: String(tripParams.adults),
    max: String(tripParams.maxOffers || 3), // Default to fetching 3 offers if not specified
  });
  if (tripParams.returnDate) searchParams.append('returnDate', tripParams.returnDate);
  if (tripParams.travelClass) searchParams.append('travelClass', tripParams.travelClass);
  if (tripParams.nonStop !== undefined) searchParams.append('nonStop', String(tripParams.nonStop));

  console.log(`[AmadeusLib] Searching offers with params: ${searchParams.toString()}`);
  let offersResponse;
  try {
    offersResponse = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${searchParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!offersResponse.ok) {
      const errorText = await offersResponse.text();
      console.error(`[AmadeusLib] Flight Offers Search failed: ${offersResponse.status}`, errorText);
      return null; // Or throw new Error(`Flight Offers Search failed: ${errorText}`);
    }
  } catch (searchError) {
    console.error(`[AmadeusLib] Network error during Flight Offers Search:`, searchError);
    return null;
  }

  const offersData = await offersResponse.json();
  if (!offersData.data || offersData.data.length === 0) {
    console.log('[AmadeusLib] No flight offers found from search.');
    return null;
  }
  console.log(`[AmadeusLib] Found ${offersData.data.length} offers from search.`);

  // Step 2: Flight Offers Price (try first few offers)
  const offersToPrice = offersData.data.slice(0, tripParams.maxOffers || 1); // Price up to maxOffers, default 1 if not specified

  for (let i = 0; i < offersToPrice.length; i++) {
    const offer = offersToPrice[i];
    console.log(`[AmadeusLib] Attempting to price offer ${i + 1} (ID: ${offer.id})`);
    try {
      const pricingResponse = await fetch(`${AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { type: 'flight-offers-pricing', flightOffers: [offer] } }),
      });

      if (pricingResponse.ok) {
        const pricedOfferData = await pricingResponse.json();
        console.log(`[AmadeusLib] Successfully priced offer ${i + 1} (ID: ${offer.id}).`);
        return pricedOfferData.data; // Return the data part of the first successfully priced offer
      } else {
        const errorText = await pricingResponse.text();
        console.warn(`[AmadeusLib] Pricing failed for offer ${i + 1} (ID: ${offer.id}): ${pricingResponse.status}`, errorText);
        // Try next offer if pricing fails (e.g. 422 Unprocessable Entity if offer is stale)
      }
    } catch (priceError) {
      console.warn(`[AmadeusLib] Network error during pricing for offer ${i + 1} (ID: ${offer.id}):`, priceError);
      // Try next offer
    }
  }

  console.log('[AmadeusLib] All pricing attempts failed.');
  return null;
}


// Updated function to book with Amadeus using a provided token
export async function bookWithAmadeus(
  pricedOffer: any, // This should be the full priced offer object from the pricing endpoint
  travelerData: TravelerData,
  seatSelections: SeatSelection[], // Array of { segmentId: string, seatNumber: string }
  token: string
): Promise<BookingResponse> {
  if (!AMADEUS_BASE_URL) {
    console.error("Error: AMADEUS_BASE_URL not configured for bookWithAmadeus.");
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  try {
    console.log("[AmadeusLib] Booking flight with Amadeus using provided token.");
    // console.log("[AmadeusLib] Priced offer for booking:", JSON.stringify(pricedOffer, null, 2));
    // console.log("[AmadeusLib] Traveler data for booking:", JSON.stringify(travelerData, null, 2));
    // console.log("[AmadeusLib] Seat selections for booking:", JSON.stringify(seatSelections, null, 2));

    // Construct traveler payload with seat selections
    const travelersPayload = [{
      id: "1", // Assuming one traveler for now; this might need to be dynamic
      dateOfBirth: travelerData.dateOfBirth,
      name: {
        firstName: travelerData.firstName,
        lastName: travelerData.lastName,
      },
      gender: travelerData.gender || "MALE", // Default or ensure valid value
      contact: {
        emailAddress: travelerData.email,
        phones: travelerData.phone ? [{ deviceType: "MOBILE", countryCallingCode: "1", number: travelerData.phone }] : [],
      },
      documents: travelerData.documents, // Pass as is, can be undefined
      // Add seatSelections to the first traveler.
      // Amadeus API expects seatSelections at the traveler level if specific seats are chosen.
      // The structure is an array of objects, each specifying segmentId and seatNumber.
      seatSelections: seatSelections && seatSelections.length > 0 ? seatSelections : undefined,
    }];
    
    // Remove undefined documents or seatSelections from payload if they are truly optional and Amadeus dislikes null/empty
    if (travelersPayload[0].documents === undefined) delete travelersPayload[0].documents;
    if (travelersPayload[0].seatSelections === undefined) delete travelersPayload[0].seatSelections;


    const bookingPayload = {
      data: {
        type: "flight-order",
        // Amadeus expects an array of flight offer objects that were confirmed by pricing.
        // pricedOffer from pricing response often contains `flightOffers` array.
        flightOffers: pricedOffer.flightOffers || [pricedOffer], // Use the flightOffers array from priced object, or wrap it
        travelers: travelersPayload,
        // Add remarks, ticketingAgreement, contacts, etc. as needed by your specific Amadeus setup or requirements
        remarks: {
            general: [{
                subType: "GENERAL_MISCELLANEOUS",
                text: "Automated booking via system." // Example remark
            }]
        },
        ticketingAgreement: {
            option: "DELAY_TO_CANCEL", // Or "CONFIRM_IMMEDIATELY"
            delay: "6H" // Relevant if DELAY_TO_CANCEL
        }
      }
    };

    console.log("[AmadeusLib] Making Amadeus booking request...");
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/booking/flight-orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Amadeus uses application/vnd.amadeus+json but often application/json works
        'Accept': 'application/json, application/vnd.amadeus+json'
      },
      body: JSON.stringify(bookingPayload),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error("[AmadeusLib] Amadeus booking failed:", response.status, JSON.stringify(responseData, null, 2));
      const errorDetail = responseData.errors?.[0]?.detail || responseData.errors?.[0]?.title || `Amadeus API error: ${response.status}`;
      return { success: false, error: errorDetail, bookingData: responseData };
    }

    console.log("[AmadeusLib] Amadeus booking successful.");
    return {
      success: true,
      bookingReference: responseData.data?.id, // This is the Amadeus Order ID
      confirmationNumber: responseData.data?.associatedRecords?.[0]?.reference, // Airline PNR
      bookingData: responseData.data,
    };

  } catch (error) {
    console.error("[AmadeusLib] Exception during Amadeus booking:", error);
    return { success: false, error: error.message || "Unknown booking error" };
  }
}

// New function to cancel an Amadeus order
export async function cancelAmadeusOrder(
  orderId: string,
  token: string
): Promise<{ success: boolean, error?: string }> {
  if (!AMADEUS_BASE_URL) {
    console.error("Error: AMADEUS_BASE_URL not configured for cancelAmadeusOrder.");
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  console.log(`[AmadeusLib] Attempting to cancel Amadeus order ID: ${orderId}`);
  try {
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/booking/flight-orders/${orderId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.status === 204 || response.ok) { // 204 No Content is typical for successful DELETE
      console.log(`[AmadeusLib] Amadeus order ${orderId} cancelled successfully.`);
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error(`[AmadeusLib] Failed to cancel Amadeus order ${orderId}: ${response.status}`, errorText);
      return { success: false, error: `Failed to cancel Amadeus order: ${response.status} ${errorText}` };
    }
  } catch (cancelError) {
    console.error(`[AmadeusLib] Network error during Amadeus order cancellation for order ID ${orderId}:`, cancelError);
    return { success: false, error: cancelError.message || "Network error during cancellation" };
  }
}
