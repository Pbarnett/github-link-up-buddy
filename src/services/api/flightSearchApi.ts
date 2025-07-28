import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import logger from '@/lib/logger';

export interface ScoredOffer {
  id: string;
  score: number;
  price: number;
  // Add other properties as needed
}

export interface FlightSearchResponse {
  requestsProcessed: number;
  matchesInserted: number;
  totalDurationMs: number;
  relaxedCriteriaUsed: boolean;
  exactDestinationOnly: boolean;
  details: Array<{
    tripRequestId: string;
    matchesFound: number;
    offersGenerated: number;
    offersInserted: number;
  }>;
  success: boolean;
  message: string;
  pool1: ScoredOffer[];
  pool2: ScoredOffer[];
  pool3: ScoredOffer[];
  inserted: number;
}

export interface FlightSearchRequestBody {
  tripRequestId: string;
  relaxedCriteria?: boolean;
}

/**
 * Invoke flight search - triggers the flight search process
 */
export async function invokeFlightSearch(
  payload: FlightSearchRequestBody
): Promise<FlightSearchResponse> {
  try {
    logger.info('[FlightSearchApi] Invoking flight search', payload);

    // Call the flight search edge function
    const { data, error } = await supabase.functions.invoke(
      'flight-search-v2',
      {
        body: payload,
      }
    );

    if (error) {
      logger.error('[FlightSearchApi] Error from edge function:', error);
      throw new Error(`Flight search failed: ${error.message}`);
    }

    logger.info('[FlightSearchApi] Flight search completed successfully');
    return data as FlightSearchResponse;
  } catch (error) {
    logger.error('[FlightSearchApi] invokeFlightSearch error:', error);
    throw error;
  }
}

/**
 * Fetch flight search results with filtering options
 */
export async function fetchFlightSearch(
  tripId: string,
  relaxedCriteria = false,
  filterOptions: {
    budget?: number;
    currency?: string;
    pipelineType?: 'standard' | 'budget' | 'fast';
  } = {}
): Promise<FlightSearchResponse> {
  try {
    logger.info('[FlightSearchApi] Fetching flight search results', {
      tripId,
      relaxedCriteria,
      filterOptions,
    });

    // For now, we'll use the existing edge function approach
    // In the future, this could be enhanced with more sophisticated filtering
    const payload: FlightSearchRequestBody = {
      tripRequestId: tripId,
      relaxedCriteria,
    };

    const response = await invokeFlightSearch(payload);

    // Apply any additional filtering based on filterOptions
    if (filterOptions.budget) {
      // Filter pools by budget
      const filterByBudget = (offers: ScoredOffer[]) =>
        offers.filter(offer => offer.price <= filterOptions.budget!);

      response.pool1 = filterByBudget(response.pool1);
      response.pool2 = filterByBudget(response.pool2);
      response.pool3 = filterByBudget(response.pool3);
    }

    return response;
  } catch (error) {
    logger.error('[FlightSearchApi] fetchFlightSearch error:', error);

    // Return a default response structure on error
    return {
      requestsProcessed: 0,
      matchesInserted: 0,
      totalDurationMs: 0,
      relaxedCriteriaUsed: relaxedCriteria,
      exactDestinationOnly: true,
      details: [],
      success: false,
      message: `Flight search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      pool1: [],
      pool2: [],
      pool3: [],
      inserted: 0,
    };
  }
}
