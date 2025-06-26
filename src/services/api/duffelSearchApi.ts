/**
 * @file Service layer for interacting with the Duffel flight search Supabase edge function.
 */

import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

/**
 * Request payload for the Duffel search Supabase function.
 */
export interface DuffelSearchRequestBody {
  /** The ID of the trip request for which to find flights. */
  tripRequestId: string;
  /** Maximum price filter for flight offers */
  maxPrice?: number;
  /** Cabin class preference */
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  /** Maximum number of results to return */
  maxResults?: number;
}

/**
 * Expected successful response structure from the 'duffel-search' Supabase edge function.
 */
export interface DuffelSearchResponse {
  /** Whether the search was successful */
  success: boolean;
  /** Number of flight offers inserted by the function. */
  inserted: number;
  /** Total offers found from Duffel API */
  offersFound: number;
  /** Success message from the function. */
  message: string;
  /** Error details if the search failed */
  error?: {
    message: string;
    phase: string;
    timestamp: string;
  };
}

/**
 * Represents an error that occurred during the Duffel search invocation.
 */
export interface DuffelSearchError {
  /** The error message. */
  message: string;
  /** Optional additional details or the original error object from Supabase client or the edge function's error response. */
  details?: any;
}

/**
 * Invokes the 'duffel-search' Supabase edge function.
 *
 * @param payload - The data to send to the Duffel search function.
 * @returns A promise that resolves with the structured response from the function.
 * @throws {DuffelSearchError} If the Supabase function invocation itself fails (network, permissions)
 *         or if the function returns an error status (e.g., 500).
 */
export const invokeDuffelSearch = async (
  payload: DuffelSearchRequestBody
): Promise<DuffelSearchResponse> => {
  logger.info("[🔍 DUFFEL-SEARCH-DEBUG] Starting Duffel search with payload:", payload);
  
  const { data, error: invokeError } = await supabase.functions.invoke(
    "duffel-search",
    { body: payload }
  );
  
  logger.info("[🔍 DUFFEL-SEARCH-DEBUG] Raw response from edge function:", { data, error: invokeError });

  if (invokeError) {
    logger.error("Error invoking duffel-search function:", { details: invokeError });

    let functionErrorData;
    if (invokeError.context && invokeError.context.json) {
        functionErrorData = invokeError.context.json;
    }

    throw {
      message: invokeError.message || "Failed to invoke Duffel search function.",
      details: invokeError,
      functionErrorData: functionErrorData
    } as DuffelSearchError;
  }

  // Handle successful response
  if (data && typeof data.success === 'boolean') {
    return data as DuffelSearchResponse;
  }

  logger.warn("Duffel search function returned unexpected data format:", { responseData: data });
  // Fallback case for unexpected response format
  return {
    success: false,
    inserted: 0,
    offersFound: 0,
    message: "Duffel search function invoked, but response format was unexpected.",
    error: {
      message: "Unexpected response format",
      phase: "Response parsing",
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Fetches flight search results from Duffel.
 * This is a convenience wrapper around invokeDuffelSearch.
 */
export const fetchDuffelFlights = async (
  tripRequestId: string,
  options?: {
    maxPrice?: number;
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
    maxResults?: number;
  }
): Promise<DuffelSearchResponse> => {
  const payload: DuffelSearchRequestBody = {
    tripRequestId,
    maxPrice: options?.maxPrice,
    cabinClass: options?.cabinClass || 'economy',
    maxResults: options?.maxResults || 50,
  };
  
  logger.info("[🔍 DUFFEL-SEARCH-API] fetchDuffelFlights called with options:", options);
  
  return await invokeDuffelSearch(payload);
};

/**
 * Search for flights using both Amadeus and Duffel APIs
 * This allows you to compare results from both providers
 */
export const searchAllProviders = async (
  tripRequestId: string,
  options?: {
    maxPrice?: number;
    cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
    maxResults?: number;
    includeAmadeus?: boolean;
    includeDuffel?: boolean;
  }
): Promise<{
  amadeus?: any;
  duffel?: DuffelSearchResponse;
  summary: {
    totalOffersFound: number;
    totalOffersInserted: number;
    providersUsed: string[];
  };
}> => {
  const {
    includeAmadeus = true,
    includeDuffel = true,
    ...searchOptions
  } = options || {};

  const results: any = {};
  const summary = {
    totalOffersFound: 0,
    totalOffersInserted: 0,
    providersUsed: [] as string[]
  };

  // Search with Duffel
  if (includeDuffel) {
    try {
      logger.info("[🔍 MULTI-PROVIDER] Starting Duffel search...");
      const duffelResult = await fetchDuffelFlights(tripRequestId, searchOptions);
      results.duffel = duffelResult;
      
      if (duffelResult.success) {
        summary.totalOffersFound += duffelResult.offersFound;
        summary.totalOffersInserted += duffelResult.inserted;
        summary.providersUsed.push('Duffel');
      }
    } catch (error) {
      logger.error("[🔍 MULTI-PROVIDER] Duffel search failed:", error);
      results.duffel = {
        success: false,
        inserted: 0,
        offersFound: 0,
        message: "Duffel search failed",
        error: {
          message: error.message,
          phase: "Provider search",
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Search with Amadeus (you can add this integration later)
  if (includeAmadeus) {
    try {
      logger.info("[🔍 MULTI-PROVIDER] Amadeus search would go here...");
      // Import and call your existing Amadeus search
      // const amadeusResult = await invokeFlightSearch({ tripRequestId, ... });
      // results.amadeus = amadeusResult;
      
      // For now, just add to the providers list if enabled
      summary.providersUsed.push('Amadeus (placeholder)');
    } catch (error) {
      logger.error("[🔍 MULTI-PROVIDER] Amadeus search failed:", error);
    }
  }

  logger.info("[🔍 MULTI-PROVIDER] Search completed:", summary);
  
  return {
    ...results,
    summary
  };
};
