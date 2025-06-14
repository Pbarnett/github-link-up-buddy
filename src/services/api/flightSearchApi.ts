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
 * Expected successful response structure from the 'flight-search' Supabase edge function.
 */
export interface FlightSearchResponse {
  /** Number of trip requests processed by the function. */
  requestsProcessed: number;
  /** Total number of new flight matches inserted into the database. */
  matchesInserted: number;
  /** Total time taken for the function to execute, in milliseconds. */
  totalDurationMs: number;
  /** Indicates if relaxed criteria were used for any part of the search. */
  relaxedCriteriaUsed: boolean;
  /** Indicates if the search was restricted to exact destinations only. */
  exactDestinationOnly: boolean;
  /** Detailed results for each processed trip request. */
  details: FlightSearchDetail[];
  /** Optional: A top-level success indicator, true if no major errors transforming the function's output. */
  success?: boolean; // Kept as optional, can be set by invokeFlightSearch wrapper
  /** Optional: A top-level message, mainly for client-side use if needed. */
  message?: string; // Kept as optional, can be set by invokeFlightSearch wrapper
  /** Pool 1: Best Value/Perfect offers */
  pool1: ScoredOffer[];
  /** Pool 2: Low Cost/Close offers */
  pool2: ScoredOffer[];
  /** Pool 3: Premium/Backup offers */
  pool3: ScoredOffer[];
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
  const { data, error: invokeError } = await supabase.functions.invoke(
    "flight-search",
    { body: payload }
  );

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

  // Assuming 'data' from Supabase function might contain poolA, poolB, poolC
  // and other fields of FlightSearchResponse directly.
  if (data && typeof data.requestsProcessed === 'number') {
    const { poolA, poolB, poolC, ...restOfData } = data;
    return {
        ...restOfData,
        pool1: poolA || [],
        pool2: poolB || [],
        pool3: poolC || [],
        success: true,
        message: `Flight search processed ${data.requestsProcessed} request(s).`
    } as FlightSearchResponse; // Cast to ensure type compatibility
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
