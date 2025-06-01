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
      lastError = error;
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

// Validate duration format (e.g., "2h 30m" or "PT2H30M")
function isValidDuration(duration: string): boolean {
  // Accept both human-readable and ISO 8601 duration formats
  return /^(\d+h\s*\d*m?|PT\d+H\d*M?)$/.test(duration);
}


/**
 * Diagnostic function to track validation failures by category
 * This helps identify which validation rules are most frequently failing
 */
export const validationFailureStats = {
  missingFields: 0,
  invalidPrice: 0,
  invalidDepartureDate: 0,
  invalidReturnDate: 0,
  invalidDepartureTime: 0,
  invalidReturnTime: 0,
  invalidAirline: 0,
  invalidFlightNumber: 0,
  invalidDuration: 0,
  totalProcessed: 0,
  totalRejected: 0,
  
  // Reset stats
  reset() {
    this.missingFields = 0;
    this.invalidPrice = 0;
    this.invalidDepartureDate = 0;
    this.invalidReturnDate = 0;
    this.invalidDepartureTime = 0;
    this.invalidReturnTime = 0;
    this.invalidAirline = 0;
    this.invalidFlightNumber = 0;
    this.invalidDuration = 0;
    this.totalProcessed = 0;
    this.totalRejected = 0;
  },
  
  // Get summary of validation failures
  getSummary() {
    return {
      totalProcessed: this.totalProcessed,
      totalRejected: this.totalRejected,
      acceptRate: this.totalProcessed > 0 
        ? ((this.totalProcessed - this.totalRejected) / this.totalProcessed * 100).toFixed(2) + '%' 
        : 'N/A',
      failuresByType: {
        missingFields: this.missingFields,
        invalidPrice: this.invalidPrice,
        invalidDepartureDate: this.invalidDepartureDate,
        invalidReturnDate: this.invalidReturnDate,
        invalidDepartureTime: this.invalidDepartureTime,
        invalidReturnTime: this.invalidReturnTime,
        invalidAirline: this.invalidAirline,
        invalidFlightNumber: this.invalidFlightNumber,
        invalidDuration: this.invalidDuration
      }
    };
  }
};

/**
 * Detailed diagnostic logging for the offer pipeline
 * Helps track where offers are being lost without modifying the actual processing logic
 */
export function diagnosePipeline(tripId: string, stage: string, data: any, details?: any): void {
  console.log(`[DIAGNOSE:${tripId}] ${stage}: ${
    Array.isArray(data) 
      ? `${data.length} items` 
      : typeof data === 'object' && data !== null 
        ? Object.keys(data).join(', ') 
        : data
  }`);
  
  if (details) {
    console.log(`[DIAGNOSE:${tripId}] Details:`, 
      typeof details === 'object' ? JSON.stringify(details).substring(0, 300) + '...' : details);
  }
}

// Validate offer data with enhanced diagnostics
function validateOffer(offer: any): offer is Offer {
  validationFailureStats.totalProcessed++;
  const validationErrors: string[] = [];

  // Check required fields
  const required = [
    'id', 'price', 'airline', 'flight_number',
    'departure_date', 'departure_time',
    'return_date', 'return_time', 'duration'
  ];
  
  const missing = required.filter(field => !offer[field]);
  if (missing.length > 0) {
    validationFailureStats.missingFields++;
    validationErrors.push(`Missing required fields: ${missing.join(', ')}`);
    validationFailureStats.totalRejected++;
    return false;
  }

  // Validate price
  if (!isValidPrice(offer.price)) {
    validationFailureStats.invalidPrice++;
    validationErrors.push(`Invalid price: ${offer.price}`);
  }

  // Validate dates and times
  if (!isValidDate(offer.departure_date)) {
    validationFailureStats.invalidDepartureDate++;
    validationErrors.push(`Invalid departure date: ${offer.departure_date}`);
  }
  if (!isValidDate(offer.return_date)) {
    validationFailureStats.invalidReturnDate++;
    validationErrors.push(`Invalid return date: ${offer.return_date}`);
  }
  if (!isValidTime(offer.departure_time)) {
    validationFailureStats.invalidDepartureTime++;
    validationErrors.push(`Invalid departure time: ${offer.departure_time}`);
  }
  if (!isValidTime(offer.return_time)) {
    validationFailureStats.invalidReturnTime++;
    validationErrors.push(`Invalid return time: ${offer.return_time}`);
  }

  // Validate airline and flight number
  if (!isValidAirline(offer.airline)) {
    validationFailureStats.invalidAirline++;
    validationErrors.push(`Invalid airline code: ${offer.airline}`);
  }
  if (!isValidFlightNumber(offer.flight_number)) {
    validationFailureStats.invalidFlightNumber++;
    validationErrors.push(`Invalid flight number: ${offer.flight_number}`);
  }

  // Validate duration
  if (!isValidDuration(offer.duration)) {
    validationFailureStats.invalidDuration++;
    validationErrors.push(`Invalid duration format: ${offer.duration}`);
  }

  if (validationErrors.length > 0) {
    validationFailureStats.totalRejected++;
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
 * Diagnostic function to analyze offer pipeline for a specific trip
 * This provides a detailed breakdown of where offers are being lost
 * @param tripId The trip request ID to analyze
 * @param bypassFilters Set to true to see raw data without validation filtering
 * @returns Full diagnostic report including validation statistics
 */
export const diagnoseOfferPipeline = async (
  tripId: string,
  bypassFilters: boolean = false
): Promise<any> => {
  const sanitizedTripId = sanitizeString(tripId);
  console.log(`[tripOffersService] 🔍 DIAGNOSTIC: Analyzing offer pipeline for trip ${sanitizedTripId}`);
  diagnosePipeline(sanitizedTripId, "DIAGNOSIS_START", "Beginning pipeline diagnosis");
  
  // Reset validation stats
  validationFailureStats.reset();
  
  try {
    // Step 1: Check if any offers exist at all
    const offersExist = await checkTripOffersExist(sanitizedTripId);
    diagnosePipeline(sanitizedTripId, "STEP_1_EXISTS_CHECK", offersExist ? "Offers exist" : "No offers found");
    
    if (!offersExist) {
      return {
        tripId: sanitizedTripId,
        stage: "existence_check",
        result: "FAILURE",
        message: "No flight offers found in the database for this trip"
      };
    }
    
    // Step 2: Get raw database data
    const rawData = await debugInspectTripOffers(sanitizedTripId);
    diagnosePipeline(sanitizedTripId, "STEP_2_RAW_DATA", `Retrieved ${rawData.length} raw offers`);
    
    if (!rawData || rawData.length === 0) {
      return {
        tripId: sanitizedTripId,
        stage: "data_retrieval",
        result: "FAILURE",
        message: "No data returned from database despite existence check passing"
      };
    }
    
    // Step 3: Transform data
    const transformedData = rawData.map(item => ({
      id: item.id,
      price: Number(item.price),
      airline: item.airline,
      flight_number: item.flight_number,
      departure_date: item.departure_date,
      departure_time: item.departure_time,
      return_date: item.return_date,
      return_time: item.return_time,
      duration: item.duration,
    }));
    
    diagnosePipeline(sanitizedTripId, "STEP_3_TRANSFORMED", `Transformed ${transformedData.length} offers`);
    
    // Step 4: Validate offers (but don't filter if bypass is enabled)
    // We still run validation to collect stats, but we'll return all data if bypassing
    const validatedOffers = bypassFilters 
      ? transformedData.map(offer => { validateOffer(offer); return offer; })
      : transformedData.filter(validateOffer);
    
    const validationSummary = validationFailureStats.getSummary();
    diagnosePipeline(
      sanitizedTripId, 
      "STEP_4_VALIDATION", 
      `${bypassFilters ? "Validation bypassed" : `${validatedOffers.length}/${transformedData.length} passed validation`}`,
      validationSummary
    );
    
    // Complete diagnostic results
    return {
      tripId: sanitizedTripId,
      pipelineStages: {
        existence: { passed: true, count: rawData.length },
        rawData: { count: rawData.length, sample: rawData.length > 0 ? rawData[0] : null },
        transformation: { count: transformedData.length },
        validation: { 
          passed: validatedOffers.length,
          failed: transformedData.length - validatedOffers.length,
          acceptRate: validationSummary.acceptRate,
          bypassApplied: bypassFilters,
          failureStats: validationSummary.failuresByType
        }
      },
      finalResult: {
        offersAvailable: validatedOffers.length > 0,
        count: validatedOffers.length,
        offers: validatedOffers.slice(0, 5) // Return just a few samples
      },
      recommendations: []
    };
  } catch (error) {
    console.error(`[tripOffersService] Error during pipeline diagnosis:`, error);
    return {
      tripId: sanitizedTripId,
      stage: "diagnosis",
      result: "ERROR",
      error: error.message,
      stack: error.stack
    };
  }
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
  
  // Reset validation stats for this fetch operation
  validationFailureStats.reset();
  
  return withRetry(async () => {
    const from = validatedPage * validatedPageSize;
    const to = from + validatedPageSize - 1;
    
    console.log(`[tripOffersService] Query range: ${from} to ${to}`);

    const offersExist = await checkTripOffersExist(sanitizedTripId);
    if (!offersExist) {
      diagnosePipeline(sanitizedTripId, "EXISTENCE_CHECK", "No offers found in database");
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
      diagnosePipeline(sanitizedTripId, "DATABASE_ERROR", pgError.message, {
        code: pgError.code,
        details: pgError.details
      });
      console.error(`[tripOffersService] Database error fetching trip offers: ${pgError.code} - ${pgError.message}`, {
        tripId: sanitizedTripId,
        details: pgError.details,
        hint: pgError.hint
      });
      throw error;
    }
    
    if (!data || data.length === 0) {
      diagnosePipeline(sanitizedTripId, "EMPTY_RESULT", `No offers in range ${from}-${to}`);
      console.log(`[tripOffersService] No offers found for trip ID: ${sanitizedTripId} in range ${from}-${to}`);
      
      const totalCount = await getTripOffersCount(sanitizedTripId);
      if (totalCount > 0) {
        diagnosePipeline(sanitizedTripId, "PAGINATION_ISSUE", 
          `Trip has ${totalCount} total offers, but none in requested range ${from}-${to}`);
        console.log(`[tripOffersService] NOTE: Trip ${sanitizedTripId} has ${totalCount} total offers, but none in the requested range`);
      }
      
      return { offers: [], total: 0 };
    }

    diagnosePipeline(sanitizedTripId, "RAW_DATA_RECEIVED", data.length, {
      sampleFields: data[0] ? Object.keys(data[0]) : 'no data',
      sampleData: data[0] ? JSON.stringify(data[0]).substring(0, 100) : 'no sample'
    });
    console.log(`[tripOffersService] Found ${data.length} offers for trip ID: ${sanitizedTripId}, total count: ${count}`);

    // Transform and validate offers
    const transformedData = data.map(item => ({
      id: item.id,
      price: Number(item.price),
      airline: item.airline,
      flight_number: item.flight_number,
      departure_date: item.departure_date,
      departure_time: item.departure_time,
      return_date: item.return_date,
      return_time: item.return_time,
      duration: item.duration,
    }));
    
    diagnosePipeline(sanitizedTripId, "TRANSFORMED_DATA", transformedData.length);
    
    const offers = transformedData.filter(validateOffer);

    if (offers.length < data.length) {
      const validationSummary = validationFailureStats.getSummary();
      diagnosePipeline(sanitizedTripId, "VALIDATION_RESULTS", 
        `${offers.length}/${data.length} offers passed validation (${validationSummary.acceptRate} accepted)`, 
        validationSummary.failuresByType);
      console.warn(`[tripOffersService] Some offers failed validation: ${data.length - offers.length} invalid offers`);
    } else {
      diagnosePipeline(sanitizedTripId, "VALIDATION_RESULTS", "All offers passed validation");
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
      console.log(`[tripOffersService] DEBUG: First offer structure:`, 
        Object.keys(data[0]).join(', '));
        
      console.log(`[tripOffersService] DEBUG: Sample offer data:`, 
        JSON.stringify(data[0]).substring(0, 200) + '...');
    }
    
    return data || [];
  }, `debugInspectTripOffers(${sanitizedTripId})`);
};
