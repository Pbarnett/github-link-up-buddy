import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

export interface Offer {
  id: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
}

// Maximum number of retries for database operations
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const MAX_PAGE_SIZE = 100;

// Validation constants
const MIN_PRICE = 1;
const MAX_PRICE = 100000; // $100k as sanity check
const AIRLINE_CODE_REGEX = /^[A-Z0-9]{2,3}$/;
const FLIGHT_NUMBER_REGEX = /^[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Helper function to add retry logic
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES,
  retryDelay: number = RETRY_DELAY_MS
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[tripOffersService] ${operationName} failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxRetries} attempts`);
}

// Sanitize string input
function sanitizeString(input: string): string {
  return input.trim().replace(/[^\w\s-:]/g, '');
}

// Validate price
function isValidPrice(price: number): boolean {
  return !isNaN(price) && price >= MIN_PRICE && price <= MAX_PRICE;
}

// Validate date string
function isValidDate(date: string): boolean {
  if (!DATE_REGEX.test(date)) return false;
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}

// Validate time string
function isValidTime(time: string): boolean {
  return TIME_REGEX.test(time);
}

// Validate airline code
function isValidAirline(airline: string): boolean {
  return AIRLINE_CODE_REGEX.test(airline);
}

// Validate flight number
function isValidFlightNumber(flightNumber: string): boolean {
  return FLIGHT_NUMBER_REGEX.test(flightNumber);
}

// Validate duration format (e.g., "2h 30m" or "PT4H15M")
export function isValidDuration(duration: string): boolean {
  if (!duration) {
    console.log('[tripOffersService] Duration is empty');
    return false;
  }

  // Accept ISO 8601 format (e.g., PT4H30M)
  const isoPattern = /^PT(?:\d+H)?(?:\d+M)?$/i;
  // Accept human readable format (e.g., 4h 30m, 4h)
  const humanPattern = /^\d+h(?:\s*\d+m)?$/i;
  // Accept numeric format (e.g., 4:30, 04:30)
  const numericPattern = /^(?:[0-9]{1,2}):(?:[0-9]{2})$/;
  // Accept simple format (e.g., 4.5h, 4.5)
  const simplePattern = /^\d+(?:\.\d+)?h?$/;

  const isValidFormat = 
    isoPattern.test(duration) ||
    humanPattern.test(duration) ||
    numericPattern.test(duration) ||
    simplePattern.test(duration);

  console.log(`[tripOffersService] Duration validation for "${duration}": ${isValidFormat}`);
  return isValidFormat;
}

// Validate offer data
function validateOffer(offer: any): offer is Offer {
  // Log the raw offer for debugging
  console.log('[tripOffersService] Validating raw offer:', {
    id: offer.id,
    price: offer.price,
    duration: offer.duration,
    airline: offer.airline,
    flight_number: offer.flight_number
  });

  // Basic required field check
  if (!offer.id || !offer.price) {
    console.log('[tripOffersService] Offer missing critical fields');
    return false;
  }

  // Create validated offer with type coercion
  const validatedOffer = {
    id: String(offer.id),
    price: Number(offer.price),
    airline: String(offer.airline || ''),
    flight_number: String(offer.flight_number || ''),
    departure_date: String(offer.departure_date || ''),
    departure_time: String(offer.departure_time || ''),
    return_date: String(offer.return_date || ''),
    return_time: String(offer.return_time || ''),
    duration: String(offer.duration || '')
  };

  // Log the validated offer
  console.log('[tripOffersService] Validated offer:', validatedOffer);

  return true; // Accept all offers that have at least id and price
}


/**
 * Check if any flight offers exist for a specific trip
 * @param tripId The trip request ID to check
 * @returns Promise resolving to true if offers exist, false otherwise
 */
export const checkTripOffersExist = async (tripId: string): Promise<boolean> => {
  const sanitizedTripId = sanitizeString(tripId);
  console.log(`[tripOffersService] Checking if offers exist for trip ID: ${sanitizedTripId}`);
  
  return withRetry(async () => {
    const { count, error } = await supabase
      .from("flight_offers")
      .select("*", { count: "exact", head: true })
      .eq("trip_request_id", sanitizedTripId);
    
    if (error) {
      console.error(`[tripOffersService] Error checking offers existence:`, error);
      return false;
    }
    
    const exists = count !== null && count > 0;
    console.log(`[tripOffersService] Trip ${sanitizedTripId} has offers: ${exists} (count: ${count})`);
    return exists;
  }, `checkTripOffersExist(${sanitizedTripId})`);
};

/**
 * Get the count of flight offers for a specific trip
 * @param tripId The trip request ID to count offers for
 * @returns Promise resolving to the number of offers
 */
export const getTripOffersCount = async (tripId: string): Promise<number> => {
  const sanitizedTripId = sanitizeString(tripId);
  console.log(`[tripOffersService] Counting offers for trip ID: ${sanitizedTripId}`);
  
  return withRetry(async () => {
    const { count, error } = await supabase
      .from("flight_offers")
      .select("*", { count: "exact", head: true })
      .eq("trip_request_id", sanitizedTripId);
    
    if (error) {
      console.error(`[tripOffersService] Error counting offers:`, error);
      return 0;
    }
    
    console.log(`[tripOffersService] Found ${count || 0} offers for trip ${sanitizedTripId}`);
    return count || 0;
  }, `getTripOffersCount(${sanitizedTripId})`);
};

/**
 * Fetch flight offers for a trip with pagination
 */
export const fetchTripOffers = async (
  tripId: string,
  page: number = 0,
  pageSize: number = 20
): Promise<{ offers: Offer[]; total: number }> => {
  // Input validation
  const sanitizedTripId = sanitizeString(tripId);
  const validatedPage = Math.max(0, Math.floor(Number(page)));
  const validatedPageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(Number(pageSize))));

  console.log(`[tripOffersService] Fetching offers for trip ID: ${sanitizedTripId}, page: ${validatedPage}, pageSize: ${validatedPageSize}`);
  
  return withRetry(async () => {
    const from = validatedPage * validatedPageSize;
    const to = from + validatedPageSize - 1;
    
    console.log(`[tripOffersService] Query range: ${from} to ${to}`);

    // Remove the early exit pre-check for offers existence
    // Instead, always attempt to fetch offers, even if none existed previously
    console.log(`[tripOffersService] Fetching offers for trip ID: ${sanitizedTripId}, even if none existed before`);
    

    const { data, error, count } = await supabase
      .from("flight_offers")
      .select("*", { count: "exact" })
      .eq("trip_request_id", sanitizedTripId)
      .order("price", { ascending: true })
      .range(from, to);
    
    if (error) {
      const pgError = error as PostgrestError;
      console.error(`[tripOffersService] Database error fetching trip offers: ${pgError.code} - ${pgError.message}`, {
        tripId: sanitizedTripId,
        details: pgError.details,
        hint: pgError.hint
      });
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log(`[tripOffersService] No offers found for trip ID: ${sanitizedTripId} in range ${from}-${to}`);
      
      // Double-check total count to make sure we didn't miss any
      const totalCount = await getTripOffersCount(sanitizedTripId);
      if (totalCount > 0) {
        console.log(`[tripOffersService] NOTE: Trip ${sanitizedTripId} has ${totalCount} total offers, but none in the requested range`);
        
        // Try a more direct query to get any offers, regardless of range
        if (from > 0) {
          console.log(`[tripOffersService] Attempting to fetch first available offers directly`);
          const { data: firstOffers } = await supabase
            .from("flight_offers")
            .select("*")
            .eq("trip_request_id", sanitizedTripId)
            .order("price", { ascending: true })
            .limit(validatedPageSize);
            
          if (firstOffers && firstOffers.length > 0) {
            console.log(`[tripOffersService] Found ${firstOffers.length} offers with direct query`);
            return { 
              offers: firstOffers
                .map(item => ({
                  id: String(item.id),
                  price: Number(item.price),
                  airline: String(item.airline || ''),
                  flight_number: String(item.flight_number || ''),
                  departure_date: String(item.departure_date || ''),
                  departure_time: String(item.departure_time || ''),
                  return_date: String(item.return_date || ''),
                  return_time: String(item.return_time || ''),
                  duration: String(item.duration || ''),
                }))
                .filter(validateOffer),
              total: totalCount
            };
          }
        }
      }
      
      return { offers: [], total: 0 };
    }

    console.log(`[tripOffersService] Found ${data.length} raw offers for trip ID: ${sanitizedTripId}, total count: ${count}`);
    
    // Log some sample durations to assist with debugging format issues
    if (data.length > 0) {
      console.log(`[tripOffersService] Sample durations:`, 
        data.slice(0, Math.min(5, data.length)).map(item => item.duration));
    }

    // Transform and validate offers with robust type coercion
    const offers = data
      .map(item => ({
        id: String(item.id),
        price: Number(item.price),
        airline: String(item.airline || ''),
        flight_number: String(item.flight_number || ''),
        departure_date: String(item.departure_date || ''),
        departure_time: String(item.departure_time || ''),
        return_date: String(item.return_date || ''),
        return_time: String(item.return_time || ''),
        duration: String(item.duration || ''),
      }))
      .filter(validateOffer);

    if (offers.length < data.length) {
      console.warn(`[tripOffersService] Some offers failed validation: ${data.length - offers.length} invalid offers`);
      
      // With the more lenient validation, this should rarely happen
      // But log any failures for debugging
      const failedItems = data.filter(item => {
        return !item.id || item.price === undefined || item.price === null;
      });
      
      if (failedItems.length > 0) {
        console.log(`[tripOffersService] Example of an offer with missing critical fields:`, 
          JSON.stringify(failedItems[0]));
      }
    }

    console.log(`[tripOffersService] Returning ${offers.length} validated offers`);
    return { offers, total: count || offers.length };
  }, `fetchTripOffers(${sanitizedTripId}, ${validatedPage}, ${validatedPageSize})`);
};

/**
 * Debug function to inspect raw flight_offers data for a trip
 * Useful for diagnosing issues with offer data
 * @param tripId The trip request ID to inspect
 * @returns Raw database rows
 */
export const debugInspectTripOffers = async (tripId: string): Promise<any[]> => {
  const sanitizedTripId = sanitizeString(tripId);
  console.log(`[tripOffersService] DEBUG: Inspecting raw flight_offers data for trip ${sanitizedTripId}`);
  
  return withRetry(async () => {
    const { data, error } = await supabase
      .from("flight_offers")
      .select("*")
      .eq("trip_request_id", sanitizedTripId);
    
    if (error) {
      console.error(`[tripOffersService] DEBUG: Error inspecting offers:`, error);
      return [];
    }
    
    console.log(`[tripOffersService] DEBUG: Found ${data?.length || 0} raw offers for trip ${sanitizedTripId}`);
    
    if (data && data.length > 0) {

      console.log(
        `[tripOffersService] DEBUG: First offer structure:`,
        Object.keys(data[0]).join(', ')
      );

      console.log(
        `[tripOffersService] DEBUG: Sample offer data:`,
        JSON.stringify(data[0]).substring(0, 200) + '...'
      );
    } else {
      console.log(`[tripOffersService] DEBUG: First offer structure:`, 'No data');

    }
    
    return data || [];
  }, `debugInspectTripOffers(${sanitizedTripId})`);
};
