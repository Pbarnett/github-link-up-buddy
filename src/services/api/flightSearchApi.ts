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
  /** Optional filter options for the new filtering architecture */
  filterOptions?: {
    budget?: number;
    currency?: string;
    nonstop?: boolean;
    pipelineType?: 'standard' | 'budget' | 'fast';
  };
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
    // After V2 function inserts offers, fetch them using the new filtering architecture
    logger.info('[FlightSearchAPI] V2 function inserted offers, now fetching filtered pools with new architecture');
    
    try {
      // Import the filtering service here to avoid circular dependencies
      const { fetchTripOffers } = await import('@/services/tripOffersService');
      
      // Use the new filtering architecture to get filtered offers
      const filteredOffers = await fetchTripOffers(
        payload.tripRequestId,
        payload.filterOptions
      );
      
      logger.info(`[FlightSearchAPI] New filtering architecture returned ${filteredOffers.length} filtered offers`);
      
      // Transform to pool format
      const transformedOffers = filteredOffers.map(offer => ({
        id: offer.id,
        price: offer.price,
        airline: offer.airline,
        score: 1.0,
        isRoundTrip: !!(offer.return_date && offer.return_date.trim() !== '')
      }));
      
      // Distribute offers into pools using different strategies based on filter type
      const pipelineType = payload.filterOptions?.pipelineType || 'standard';
      let pool1: any[], pool2: any[], pool3: any[];
      
      switch (pipelineType) {
        case 'budget':
          // Budget-focused distribution: cheapest first
          const sortedByPrice = [...transformedOffers].sort((a, b) => a.price - b.price);
          pool1 = sortedByPrice.slice(0, 20);
          pool2 = sortedByPrice.slice(20, 35);
          pool3 = sortedByPrice.slice(35, 50);
          break;
        
        case 'fast':
          // Fast distribution: smaller pools for quicker loading
          pool1 = transformedOffers.slice(0, 10);
          pool2 = transformedOffers.slice(10, 20);
          pool3 = transformedOffers.slice(20, 30);
          break;
        
        case 'standard':
        default:
          // Standard distribution: balanced pools
          pool1 = transformedOffers.slice(0, 17);
          pool2 = transformedOffers.slice(17, 34);
          pool3 = transformedOffers.slice(34, 50);
          break;
      }
      
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
 * Now supports the new filtering architecture via filterOptions parameter.
 */
export const fetchFlightSearch = async (
  tripRequestId: string,
  relaxedCriteria: boolean = false,
  filterOptions?: {
    budget?: number;
    currency?: string;
    nonstop?: boolean;
    pipelineType?: 'standard' | 'budget' | 'fast';
  }
): Promise<FlightSearchResponse> => { // Updated return type
  const payload: FlightSearchRequestBody = {
    tripRequestId,
    relaxedCriteria,
    filterOptions,
  };
  
  logger.info("[🔍 FLIGHT-SEARCH-API] fetchFlightSearch called with filter options:", filterOptions);
  
  // invokeFlightSearch now returns data in the desired FlightSearchResponse structure
  // including pool1, pool2, pool3.
  return await invokeFlightSearch(payload);
};
