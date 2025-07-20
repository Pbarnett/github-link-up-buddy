import * as React from 'react';
// supabase/functions/lib/amadeus.ts

// Helper function to get environment variables dynamically
function getAmadeusEnv() {
  const AMADEUS_CLIENT_ID = Deno.env.get("AMADEUS_API_KEY") || Deno.env.get("AMADEUS_CLIENT_ID");
  const AMADEUS_CLIENT_SECRET = Deno.env.get("AMADEUS_API_SECRET") || Deno.env.get("AMADEUS_CLIENT_SECRET");
  const AMADEUS_BASE_URL = Deno.env.get("AMADEUS_BASE_URL");

  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
    console.error('CRITICAL Error: Missing Amadeus environment variables. AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, and AMADEUS_BASE_URL must be set.');
  }

  return { AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, AMADEUS_BASE_URL };
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
  errorCategory?: 'CLIENT_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'AUTHENTICATION';
  errorCode?: string; // HTTP status code or Amadeus error code
  retryable?: boolean; // Whether the error can be retried
  bookingData?: Record<string, unknown>; // Full response from Amadeus
}

export interface SeatSelection {
  segmentId: string;
  seatNumber: string;
}

// Token caching variables
let _cachedToken: string | undefined;
let _cachedExpiry = 0;

// Enhanced error categorization for better debugging
function categorizeError(status: number, response?: any): {
  category: 'CLIENT_ERROR' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'AUTHENTICATION';
  retryable: boolean;
  errorCode: string;
} {
  if (status === 401) {
    return { category: 'AUTHENTICATION', retryable: true, errorCode: status.toString() };
  }
  if (status === 429) {
    return { category: 'RATE_LIMIT', retryable: true, errorCode: status.toString() };
  }
  if (status >= 400 && status < 500) {
    return { category: 'CLIENT_ERROR', retryable: false, errorCode: status.toString() };
  }
  if (status >= 500) {
    return { category: 'SERVER_ERROR', retryable: true, errorCode: status.toString() };
  }
  return { category: 'NETWORK_ERROR', retryable: true, errorCode: 'UNKNOWN' };
}

// Exponential backoff retry mechanism
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Check if error is retryable
      if (error instanceof Response) {
        const errorInfo = categorizeError(error.status);
        if (!errorInfo.retryable) {
          throw lastError;
        }
      }
      
      const delayMs = baseDelayMs * Math.pow(2, attempt);
      console.log(`[AmadeusLib] Retry attempt ${attempt + 1}/${maxRetries} after ${delayMs}ms delay`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError!;
}

// Function to get Amadeus Access Token with caching and enhanced error handling
export async function getAmadeusAccessToken(): Promise<string> {
  const { AMADEUS_CLIENT_ID, AMADEUS_CLIENT_SECRET, AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET || !AMADEUS_BASE_URL) {
    console.error("Error: Missing Amadeus credentials in environment variables for getAmadeusAccessToken.");
    throw new Error("Missing Amadeus credentials.");
  }

  const now = Date.now();
  
  // Return cached token if valid (with 60-second buffer)
  if (_cachedToken && now < _cachedExpiry - 60_000) {
    console.log("[lib/amadeus] Using cached access token");
    return _cachedToken;
  }

  console.log("[lib/amadeus] Fetching new access token");
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
    const errorInfo = categorizeError(response.status);
    console.error(`[AmadeusLib] Token request failed - ${errorInfo.category}:`, {
      status: response.status,
      statusText: response.statusText,
      errorText,
      retryable: errorInfo.retryable
    });
    throw new Error(`Authentication failed: ${errorInfo.category} - ${errorText}`);
  }

  const data = await response.json();
  
  // Cache the token and expiry time
  _cachedToken = data.access_token;
  _cachedExpiry = now + (data.expires_in * 1000);
  
  console.log(`[lib/amadeus] Token cached, expires in ${data.expires_in} seconds`);
  return _cachedToken;
}

// Interface for CO2 emissions data
export interface CO2EmissionsData {
  weight: number; // grams of CO2
  weightUnit: string; // 'G' for grams
  cabin: string; // cabin class used in calculation
}

// Interface for fare rules
export interface FareRules {
  category: string; // e.g., 'EXCHANGE', 'REFUND', 'REVALIDATION'
  rules?: string; // Rules text if available
  maxPenaltyAmount?: string; // Maximum penalty amount
  currency?: string; // Currency for penalties
}

// Enhanced pricing response with CO2 and fare rules
export interface EnhancedPricingResponse {
  flightOffers: Record<string, unknown>[];
  co2Emissions?: CO2EmissionsData[];
  fareRules?: FareRules[];
  dictionaries?: Record<string, unknown>;
}

// New function to search and price flight offers with CO2 emissions
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
    includeCO2Emissions?: boolean; // Include CO2 emissions data
    includeFareRules?: boolean; // Include fare rules information
  },
  token: string
): Promise<EnhancedPricingResponse | null> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
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
  
  // Enhanced search with retry mechanism
  const offersResponse = await retryWithBackoff(async () => {
    const response = await fetch(`${AMADEUS_BASE_URL}/v2/shopping/flight-offers?${searchParams.toString()}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorInfo = categorizeError(response.status);
      console.error(`[AmadeusLib] Flight search failed - ${errorInfo.category}:`, {
        status: response.status,
        errorText,
        retryable: errorInfo.retryable
      });
      
      if (!errorInfo.retryable) {
        throw new Error(`Non-retryable flight search error: ${errorText}`);
      }
      throw response; // Will be caught and retried
    }
    
    return response;
  }).catch(error => {
    console.error(`[AmadeusLib] Flight search failed after retries:`, error);
    return null;
  });
  
  if (!offersResponse) {
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
      // Enhanced pricing request body with optional CO2 and fare rules
      const pricingPayload: any = {
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [offer]
        }
      };
      
      // Add CO2 emissions request if enabled
      if (tripParams.includeCO2Emissions) {
        pricingPayload.data.include = ['co2Emissions'];
      }
      
      const pricingResponse = await retryWithBackoff(async () => {
        const response = await fetch(`${AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pricingPayload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const errorInfo = categorizeError(response.status);
          
          if (response.status === 422) {
            // Offer is stale, try next offer instead of retrying
            throw new Error('STALE_OFFER');
          }
          
          if (!errorInfo.retryable) {
            throw new Error(`Non-retryable pricing error: ${errorText}`);
          }
          throw response; // Will be caught and retried
        }
        
        return response;
      });

      const pricedOfferData = await pricingResponse.json();
      console.log(`[AmadeusLib] Successfully priced offer ${i + 1} (ID: ${offer.id}).`);
      
      // Extract enhanced data
      const enhancedResponse: EnhancedPricingResponse = {
        flightOffers: pricedOfferData.data?.flightOffers || [pricedOfferData.data],
        co2Emissions: pricedOfferData.data?.co2Emissions,
        dictionaries: pricedOfferData.dictionaries
      };
      
      // Fetch fare rules if requested (separate API call)
      if (tripParams.includeFareRules && pricedOfferData.data?.flightOffers?.[0]) {
        try {
          const fareRules = await fetchFareRules(pricedOfferData.data.flightOffers[0], token);
          enhancedResponse.fareRules = fareRules;
        } catch (fareRulesError) {
          console.warn(`[AmadeusLib] Failed to fetch fare rules:`, fareRulesError);
          // Continue without fare rules
        }
      }
      
      return enhancedResponse;
      
    } catch (priceError) {
      if (priceError.message === 'STALE_OFFER') {
        console.warn(`[AmadeusLib] Offer ${i + 1} (ID: ${offer.id}) is stale, trying next offer`);
        continue; // Try next offer
      }
      console.warn(`[AmadeusLib] Pricing failed for offer ${i + 1} (ID: ${offer.id}):`, priceError);
      // Try next offer
    }
  }

  console.log('[AmadeusLib] All pricing attempts failed.');
  return null;
}



// Helper function to fetch fare rules (if available)
async function fetchFareRules(
  flightOffer: Record<string, unknown>,
  token: string
): Promise<FareRules[]> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_BASE_URL) {
    throw new Error("AMADEUS_BASE_URL not configured.");
  }
  
  // Note: Fare rules API might not be available in test environment
  // This is a placeholder implementation
  try {
    const response = await fetch(`${AMADEUS_BASE_URL}/v1/shopping/flight-offers/fare-rules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: 'fare-rules',
          flightOffers: [flightOffer]
        }
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data || [];
    } else {
      console.warn(`[AmadeusLib] Fare rules request failed: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.warn(`[AmadeusLib] Fare rules fetch error:`, error);
    return [];
  }
}

// Enhanced booking function with better error handling
export async function bookWithAmadeus(
  pricedOffer: Record<string, unknown>, // This should be the full priced offer object from the pricing endpoint
  travelerData: TravelerData,
  seatSelections: SeatSelection[], // Array of { segmentId: string, seatNumber: string }
  token: string
): Promise<BookingResponse> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
  if (!AMADEUS_BASE_URL) {
    console.error("Error: AMADEUS_BASE_URL not configured for bookWithAmadeus.");
    throw new Error("AMADEUS_BASE_URL not configured.");
  }

  try {
    console.log("[AmadeusLib] Booking flight with Amadeus using provided token.");
    
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
      seatSelections: seatSelections && seatSelections.length > 0 ? seatSelections : undefined,
    }];
    
    // Clean up undefined fields
    if (travelersPayload[0].documents === undefined) delete travelersPayload[0].documents;
    if (travelersPayload[0].seatSelections === undefined) delete travelersPayload[0].seatSelections;

    const bookingPayload = {
      data: {
        type: "flight-order",
        flightOffers: pricedOffer.flightOffers || [pricedOffer],
        travelers: travelersPayload,
        remarks: {
          general: [{
            subType: "GENERAL_MISCELLANEOUS",
            text: "Automated booking via system."
          }]
        },
        ticketingAgreement: {
          option: "DELAY_TO_CANCEL",
          delay: "6H"
        }
      }
    };

    console.log("[AmadeusLib] Making Amadeus booking request...");
    
    // Enhanced booking with retry mechanism
    const response = await retryWithBackoff(async () => {
      const bookingResponse = await fetch(`${AMADEUS_BASE_URL}/v1/booking/flight-orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/vnd.amadeus+json'
        },
        body: JSON.stringify(bookingPayload),
      });
      
      if (!bookingResponse.ok) {
        const errorInfo = categorizeError(bookingResponse.status);
        if (!errorInfo.retryable) {
          throw bookingResponse; // Don't retry client errors
        }
        throw bookingResponse; // Will be retried for server errors
      }
      
      return bookingResponse;
    });

    const responseData = await response.json();
    
    console.log("[AmadeusLib] Amadeus booking successful.");
    return {
      success: true,
      bookingReference: responseData.data?.id,
      confirmationNumber: responseData.data?.associatedRecords?.[0]?.reference,
      bookingData: responseData.data,
    };

  } catch (error) {
    console.error("[AmadeusLib] Exception during Amadeus booking:", error);
    
    let errorResponse: BookingResponse = {
      success: false,
      error: "Unknown booking error"
    };
    
    if (error instanceof Response) {
      const errorText = await error.text();
      const errorInfo = categorizeError(error.status);
      const responseData = JSON.parse(errorText || '{}');
      
      errorResponse = {
        success: false,
        error: responseData.errors?.[0]?.detail || responseData.errors?.[0]?.title || `Amadeus API error: ${error.status}`,
        errorCategory: errorInfo.category,
        errorCode: errorInfo.errorCode,
        retryable: errorInfo.retryable,
        bookingData: responseData
      };
    } else if (error instanceof Error) {
      errorResponse.error = error.message;
    }
    
    return errorResponse;
  }
}

// New function to cancel an Amadeus order
export async function cancelAmadeusOrder(
  orderId: string,
  token: string
): Promise<{ success: boolean, error?: string }> {
  const { AMADEUS_BASE_URL } = getAmadeusEnv();
  
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
