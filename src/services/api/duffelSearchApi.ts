import { supabase } from '@/integrations/supabase/client';
import logger from '@/lib/logger';

export interface DuffelSearchRequest {
  tripRequestId: string;
  maxPrice?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxResults?: number;
}

export interface DuffelSearchResponse {
  success: boolean;
  offersFound: number;
  inserted: number;
  message: string;
  error?: {
    message: string;
    phase: string;
    timestamp: string;
  };
}

export async function fetchDuffelFlights(
  tripRequestId: string,
  options: DuffelSearchRequest
): Promise<DuffelSearchResponse> {
  try {
    logger.info('[DuffelSearchApi] Fetching Duffel flights', {
      tripRequestId,
      options,
    });

    // Call Duffel search function
    const { data, error } = await supabase.functions.invoke('duffel-search', {
      body: options,
    });

    if (error) {
      logger.error('[DuffelSearchApi] Error from edge function:', error);
      throw new Error(`Duffel search failed: ${error.message}`);
    }

    logger.info('[DuffelSearchApi] Duffel search completed successfully');
    return data as DuffelSearchResponse;
  } catch (error) {
    logger.error('[DuffelSearchApi] fetchDuffelFlights error:', error);
    throw error;
  }
}
