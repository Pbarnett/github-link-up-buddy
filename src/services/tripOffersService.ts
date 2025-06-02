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
  // Accept both human-readable and ISO 8601 duration formats
  const isoPattern = /^PT(?=\d)(?:\d+H)?(?:\d+M)?$/; // PT4H15M, PT4H, PT15M
  const humanPattern = /^\d+h(?:\s*\d+m)?$/;          // 4h 15m, 4h

  
  // Check if it matches either format but ensure at least one time component exists
  if (isoPattern.test(duration)) {
    // ISO format: Make sure at least one time component (H or M) is present
    return duration.includes('H') || duration.includes('M');
  }
  
  return humanPattern.test(duration);
}

// Validate offer data
function validateOffer(offer: any): offer is Offer {
  const validationErrors: string[] = [];

  // Check required fields
  const required = [
    'id', 'price', 'airline', 'flight_number',
    'departure_date', 'departure_time',
    'return_date', 'return_time', 'duration'
  ];
  
  const missing = required.filter(field => !offer[field]);
  if (missing.length > 0) {
    validationErrors.push(`Missing required fields: ${missing.join(', ')}`);
    return false;
  }

  // Validate price
  if (!isValidPrice(offer.price)) {
    validationErrors.push(`Invalid price: ${offer.price}`);
  }

  // Validate dates and times
  if (!isValidDate(offer.departure_date)) {
    validationErrors.push(`Invalid departure date: ${offer.departure_date}`);
  }
  if (!isValidDate(offer.return_date)) {
    validationErrors.push(`Invalid return date: ${offer.return_date}`);
  }
  if (!isValidTime(offer.departure_time)) {
    validationErrors.push(`Invalid departure time: ${offer.departure_time}`);
  }
  if (!isValidTime(offer.return_time)) {
    validationErrors.push(`Invalid return time: ${offer.return_time}`);
  }

  // Validate airline and flight number
  if (!isValidAirline(offer.airline)) {
    validationErrors.push(`Invalid airline code: ${offer.airline}`);
  }
  if (!isValidFlightNumber(offer.flight_number)) {
    validationErrors.push(`Invalid flight number: ${offer.flight_number}`);
  }

  // Validate duration
  if (!isValidDuration(offer.duration)) {
    validationErrors.push(`Invalid duration format: ${offer.duration}`);
  }

  if (validationErrors.length > 0) {
    console.warn(`[tripOffersService] Offer validation failed:`, validationErrors);
    return false;
  }

  return true;
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

    const offersExist = await checkTripOffersExist(sanitizedTripId);
    if (!offersExist) {
      console.log(`[tripOffersService] No offers found for trip ID: ${sanitizedTripId} (pre-check)`);
      return { offers: [], total: 0 };
    }

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
      
      const totalCount = await getTripOffersCount(sanitizedTripId);
      if (totalCount > 0) {
        console.log(`[tripOffersService] NOTE: Trip ${sanitizedTripId} has ${totalCount} total offers, but none in the requested range`);
      }
      
      return { offers: [], total: 0 };
    }

    console.log(`[tripOffersService] Found ${data.length} offers for trip ID: ${sanitizedTripId}, total count: ${count}`);

    // Transform and validate offers
    const offers = data
      .map(item => ({
        id: item.id,
        price: Number(item.price),
        airline: item.airline,
        flight_number: item.flight_number,
        departure_date: item.departure_date,
        departure_time: item.departure_time,
        return_date: item.return_date,
        return_time: item.return_time,
        duration: item.duration,
      }))
      .filter(validateOffer);

    if (offers.length < data.length) {
      console.warn(`[tripOffersService] Some offers failed validation: ${data.length - offers.length} invalid offers`);
    }

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
