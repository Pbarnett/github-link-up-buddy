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
  console.log("📡 [flightSearchApi] Starting flight search invocation", {
    payload,
    timestamp: new Date().toISOString(),
    supabaseUrl: supabase.supabaseUrl
  });

  try {
    console.log("🔄 [flightSearchApi] Calling supabase.functions.invoke...");
    const { data, error: invokeError } = await supabase.functions.invoke(
      "flight-search",
      { body: payload }
    );

    console.log("📨 [flightSearchApi] Function invoke completed", {
      hasData: !!data,
      hasError: !!invokeError,
      errorDetails: invokeError,
      dataPreview: data ? {
        requestsProcessed: data.requestsProcessed,
        matchesInserted: data.matchesInserted,
        hasDetails: !!data.details
      } : null
    });

    if (invokeError) {
      // This typically catches network errors or if the function itself threw an unhandled exception
      // leading to a 500, or other non-2xx status codes that the Supabase client treats as an error.
      console.error("❌ [flightSearchApi] Error invoking flight-search function:", { 
        error: invokeError,
        message: invokeError.message,
        context: invokeError.context 
      });

      let functionErrorData;
      if (invokeError.context && invokeError.context.json) {
          functionErrorData = invokeError.context.json;
          console.log("📋 [flightSearchApi] Function error data:", functionErrorData);
      }

      throw {
        message: invokeError.message || "Failed to invoke flight search function.",
        details: invokeError,
        functionErrorData: functionErrorData
      } as FlightSearchError;
    }

    // If invokeError is null, it means the function returned a 2xx status.
    // The 'data' variable here is the body of the function's response.
    if (data && typeof data.requestsProcessed === 'number') {
      console.log("✅ [flightSearchApi] Flight search successful", {
        requestsProcessed: data.requestsProcessed,
        matchesInserted: data.matchesInserted,
        totalDurationMs: data.totalDurationMs,
        relaxedCriteriaUsed: data.relaxedCriteriaUsed
      });

      return {
          ...data,
          success: true,
          message: `Flight search processed ${data.requestsProcessed} request(s).`
      } as FlightSearchResponse;
    }

    // Fallback if the data is not in the expected format
    console.warn("⚠️ [flightSearchApi] Flight search function returned unexpected data format:", { responseData: data });
    return {
      requestsProcessed: 0,
      matchesInserted: 0,
      totalDurationMs: 0,
      relaxedCriteriaUsed: payload.relaxedCriteria,
      exactDestinationOnly: true,
      details: [],
      success: true,
      message: "Flight search function invoked, but response format was unexpected.",
    };
  } catch (error) {
    console.error("❌ [flightSearchApi] Unexpected error during flight search invocation:", {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Re-throw if it's already a FlightSearchError
    if (error && typeof error === 'object' && 'message' in error && 'details' in error) {
      throw error;
    }
    
    // Otherwise wrap in a FlightSearchError
    throw {
      message: error instanceof Error ? error.message : "Unexpected error during flight search invocation",
      details: error
    } as FlightSearchError;
  }
};
