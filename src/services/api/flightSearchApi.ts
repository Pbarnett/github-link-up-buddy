import { supabase } from "@/integrations/supabase/client";
import logger from "@/lib/logger";

export interface FlightSearchRequestBody {
  tripRequestId: string;
  relaxedCriteria?: boolean;
  filterOptions?: {
    budget?: number;
    currency?: string;
    pipelineType?: 'standard' | 'budget' | 'fast';
  };
}

export interface FlightSearchResponse {
  success: boolean;
  message: string;
  inserted?: number;
  pool1?: any[];
  pool2?: any[];
  pool3?: any[];
}

/**
 * Invokes the flight-search-v2 edge function
 * @param payload The flight search request payload
 * @returns Promise resolving to the flight search response
 */
export const invokeFlightSearch = async (
  payload: FlightSearchRequestBody
): Promise<FlightSearchResponse> => {
  try {
    logger.info("[invokeFlightSearch] Invoking flight-search-v2 with payload:", payload);
    
    const { data, error } = await supabase.functions.invoke<FlightSearchResponse>(
      "flight-search-v2",
      {
        body: payload,
      }
    );

    if (error) {
      logger.error("[invokeFlightSearch] Supabase function error:", error);
      throw new Error(`Flight search failed: ${error.message}`);
    }

    if (!data) {
      logger.warn("[invokeFlightSearch] No data returned from flight-search-v2");
      return {
        success: false,
        message: "No data returned from flight search",
      };
    }

    logger.info("[invokeFlightSearch] Flight search completed successfully:", {
      success: data.success,
      inserted: data.inserted,
      message: data.message,
    });

    return data;
  } catch (error) {
    logger.error("[invokeFlightSearch] Error invoking flight search:", error);
    throw error;
  }
};

/**
 * Fetches flight search results with filtering options
 * @param tripRequestId The trip request ID
 * @param relaxedCriteria Whether to use relaxed search criteria
 * @param filterOptions Optional filtering options
 * @returns Promise resolving to the flight search response
 */
export const fetchFlightSearch = async (
  tripRequestId: string,
  relaxedCriteria: boolean = false,
  filterOptions?: {
    budget?: number;
    currency?: string;
    pipelineType?: 'standard' | 'budget' | 'fast';
  }
): Promise<FlightSearchResponse> => {
  const payload: FlightSearchRequestBody = {
    tripRequestId,
    relaxedCriteria,
    filterOptions,
  };

  return invokeFlightSearch(payload);
};
