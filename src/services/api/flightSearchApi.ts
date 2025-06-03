/**
 * @file Service layer for interacting with the flight search Supabase edge function.
 */

import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger"; // Import logger

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
  success?: boolean; // Added to align with how useTripOffers might use it
   /** Optional: A top-level message, mainly for client-side use if needed. */
  message?: string; // Added to align
}

/**
 * Represents an error that occurred during the flight search invocation.
 * This could be a network error, or an error explicitly returned by the function (e.g., 500 status).
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
): Promise<FlightSearchResponse> => {
  const { data, error: invokeError } = await supabase.functions.invoke(
    "flight-search",
    { body: payload }
  );

  if (invokeError) {
    // This typically catches network errors or if the function itself threw an unhandled exception
    // leading to a 500, or other non-2xx status codes that the Supabase client treats as an error.
    // The 'invokeError' object might contain the function's actual response if it was a non-200.
    logger.error("Error invoking flight-search function:", { details: invokeError });

    let functionErrorData;
    if (invokeError.context && invokeError.context.json) { // Try to parse error from function response
        functionErrorData = invokeError.context.json;
    }

    throw {
      message: invokeError.message || "Failed to invoke flight search function.",
      details: invokeError,
      functionErrorData: functionErrorData
    } as FlightSearchError;
  }

  // If invokeError is null, it means the function returned a 2xx status.
  // The 'data' variable here is the body of the function's response.
  // We assume 'data' directly matches the structure of a successful FlightSearchResponse from the edge function.
  if (data && typeof data.requestsProcessed === 'number') {
    // Add the 'success' and 'message' fields for client-side convenience,
    // though the edge function itself doesn't return them at the top level.
    return {
        ...data,
        success: true,
        message: `Flight search processed ${data.requestsProcessed} request(s).`
    } as FlightSearchResponse;
  }

  // Fallback if the data is not in the expected format, though ideally this shouldn't be reached
  // if the edge function adheres to its contract.
  logger.warn("Flight search function returned unexpected data format:", { responseData: data });
  return {
    requestsProcessed: 0,
    matchesInserted: 0,
    totalDurationMs: 0,
    relaxedCriteriaUsed: payload.relaxedCriteria, // Best guess
    exactDestinationOnly: true, // Assuming default
    details: [],
    success: true, // Or false, depending on how to interpret this state
    message: "Flight search function invoked, but response format was unexpected.",
  };
};
