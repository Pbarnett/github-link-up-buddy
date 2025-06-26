/**
 * @file Service layer for interacting with the flight search Supabase edge function.
 */

import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";
import { ScoredOffer } from "@/types/offer";

/**
 * Request payload for the flight search Supabase function.
 */
export interface FlightSearchRequestBody {
  /** The ID of the trip request for which to find flights. */
  tripRequestId: string;
  /** Whether to use relaxed criteria for the search. */
  relaxedCriteria: boolean;
}

/**
 * Details for each trip request processed by the flight search function.
 */
export interface FlightSearchDetail {
  tripRequestId: string;
  matchesFound: number;
  offersGenerated?: number;
  exactDestinationOffers?: number;
  offersFiltered?: number;
  offersInserted?: number;
  error?: string;
  relaxedCriteria?: boolean;
  exactDestinationOnly?: boolean;
}

/**
 * Expected successful response structure from the 'flight-search-v2' Supabase edge function.
 */
export interface FlightSearchResponse {
  /** Number of flight offers inserted by the function. */
  inserted: number;
  /** Success message from the function. */
  message: string;
  /** Optional: A top-level success indicator, true if no major errors transforming the function's output. */
  success?: boolean; // Kept as optional, can be set by invokeFlightSearch wrapper
  
  // Legacy fields for backward compatibility
  /** @deprecated Use inserted instead */
  requestsProcessed?: number;
  /** @deprecated Use inserted instead */
  matchesInserted?: number;
  /** @deprecated Not used in v2 */
  totalDurationMs?: number;
  /** @deprecated Not used in v2 */
  relaxedCriteriaUsed?: boolean;
  /** @deprecated Not used in v2 */
  exactDestinationOnly?: boolean;
  /** @deprecated Not used in v2 */
  details?: FlightSearchDetail[];
  /** @deprecated Not used in v2 */
  pool1?: ScoredOffer[];
  /** @deprecated Not used in v2 */
  pool2?: ScoredOffer[];
  /** @deprecated Not used in v2 */
  pool3?: ScoredOffer[];
}

// FlightSearchResponseWithPools interface removed

/**
 * Represents an error that occurred during the flight search invocation.
 */
export interface FlightSearchError {
  /** The error message. */
  message: string;
  /** Optional additional details or the original error object from Supabase client or the edge function's error response. */
  details?: any;
  /** Specific error data returned from the edge function in case of a 500 error. */
  functionErrorData?: {
    error: string;
    requestsProcessed: number;
    matchesInserted: number;
    totalDurationMs: number;
    details: FlightSearchDetail[];
  }
}

/**
 * Invokes the 'flight-search' Supabase edge function.
 *
 * @param payload - The data to send to the flight search function.
 * @returns A promise that resolves with the structured response from the function.
 * @throws {FlightSearchError} If the Supabase function invocation itself fails (network, permissions)
 *         or if the function returns an error status (e.g., 500).
 */
export const invokeFlightSearch = async (
  payload: FlightSearchRequestBody
): Promise<FlightSearchResponse> => { // Updated return type
  logger.info("[🔍 FLIGHT-SEARCH-DEBUG] Starting flight search with payload:", payload);
  
  const { data, error: invokeError } = await supabase.functions.invoke(
    "flight-search-v2",
    { body: payload }
  );
  
  logger.info("[🔍 FLIGHT-SEARCH-DEBUG] Raw response from edge function:", { data, error: invokeError });

  if (invokeError) {
    logger.error("Error invoking flight-search function:", { details: invokeError });

    let functionErrorData;
    if (invokeError.context && invokeError.context.json) {
        functionErrorData = invokeError.context.json;
    }

    // Constructing a FlightSearchError, but need to ensure it aligns with what callers expect
    // or if they expect FlightSearchResponse even on error (which is not typical for a Promise rejection)
    // For now, throwing the error object as before.
    throw {
      message: invokeError.message || "Failed to invoke flight search function.",
      details: invokeError,
      functionErrorData: functionErrorData
    } as FlightSearchError;
  }

  // Handle flight-search-v2 response structure
  if (data && typeof data.inserted === 'number') {
    // After V2 function inserts offers, fetch them with proper round-trip filtering
    logger.info('[FlightSearchAPI] V2 function inserted offers, now fetching filtered pools');
    
    try {
      // Get trip request details to determine if round-trip
      const { data: tripRequest } = await supabase
        .from('trip_requests')
        .select('return_date')
        .eq('id', payload.tripRequestId)
        .single();
      
      const isRoundTrip = !!(tripRequest?.return_date);
      
      // Build filtered query
      let query = supabase
        .from('flight_offers_v2')
        .select('*')
        .eq('trip_request_id', payload.tripRequestId);
      
      // Apply round-trip filter if needed
      if (isRoundTrip) {
        query = query.not('return_dt', 'is', null);
        logger.info('[FlightSearchAPI] Applied round-trip filter to offers query');
      }
      
      const { data: offers } = await query
        .order('price_total', { ascending: true })
        .limit(50);
      
      // Transform V2 offers to pool format (simple distribution)
      const transformedOffers = (offers || []).map(offer => ({
        id: offer.id,
        price: offer.price_total,
        airline: offer.origin_iata + '-' + offer.destination_iata,
        score: 1.0,
        isRoundTrip: !!offer.return_dt
      }));
      
      logger.info(`[FlightSearchAPI] Fetched ${transformedOffers.length} ${isRoundTrip ? 'round-trip' : 'any'} offers for pools`);
      
      // Distribute offers into pools (simple strategy)
      const pool1 = transformedOffers.slice(0, 17);
      const pool2 = transformedOffers.slice(17, 34);
      const pool3 = transformedOffers.slice(34, 50);
      
      return {
        inserted: data.inserted,
        message: data.message,
        success: true,
        requestsProcessed: 1,
        matchesInserted: data.inserted,
        totalDurationMs: 0,
        relaxedCriteriaUsed: payload.relaxedCriteria,
        exactDestinationOnly: true,
        details: [],
        pool1,
        pool2,
        pool3,
      } as FlightSearchResponse;
      
    } catch (poolsError) {
      logger.error('[FlightSearchAPI] Error fetching filtered pools:', poolsError);
      // Fallback to empty pools
      return {
        inserted: data.inserted,
        message: data.message,
        success: true,
        requestsProcessed: 1,
        matchesInserted: data.inserted,
        totalDurationMs: 0,
        relaxedCriteriaUsed: payload.relaxedCriteria,
        exactDestinationOnly: true,
        details: [],
        pool1: [],
        pool2: [],
        pool3: [],
      } as FlightSearchResponse;
    }
  }

  logger.warn("Flight search function returned unexpected data format:", { responseData: data });
  // Fallback case, now includes mandatory pool1, pool2, pool3
  return {
    requestsProcessed: 0,
    matchesInserted: 0,
    totalDurationMs: 0,
    relaxedCriteriaUsed: payload.relaxedCriteria,
    exactDestinationOnly: true,
    details: [],
    pool1: [],
    pool2: [],
    pool3: [],
    success: false, // Set to false as format was unexpected
    message: "Flight search function invoked, but response format was unexpected.",
  };
};

/**
 * Fetches flight search results, including specific pools.
 * This function now directly returns the result of invokeFlightSearch as its structure is aligned.
 */
export const fetchFlightSearch = async (
  tripRequestId: string,
  relaxedCriteria: boolean = false
): Promise<FlightSearchResponse> => { // Updated return type
  const payload: FlightSearchRequestBody = {
    tripRequestId,
    relaxedCriteria,
  };
  
  // invokeFlightSearch now returns data in the desired FlightSearchResponse structure
  // including pool1, pool2, pool3.
  return await invokeFlightSearch(payload);
};
