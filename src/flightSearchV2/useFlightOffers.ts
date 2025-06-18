import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // For safeQuery's potential use, though safeQuery abstracts it
import { safeQuery } from '@/lib/supabaseUtils';
import { useFlightSearchV2Flag } from './useFlightSearchV2Flag';
import type { FlightOfferV2 } from './types';

export interface UseFlightOffersOptions {
  enabled?: boolean;
}

export function useFlightOffers(
  tripRequestId: string,
  opts: UseFlightOffersOptions = {}
) {
  const { enabled = true } = opts; // Default to true if not provided
  const { enabled: v2FlagEnabled, loading: v2FlagLoading } = useFlightSearchV2Flag(); // Assuming hook returns { enabled, loading }

  const [offers, setOffers] = useState<FlightOfferV2[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  // Validation guard for tripRequestId
  if (!tripRequestId || typeof tripRequestId !== 'string') {
    // Ensure this structure is returned consistently, even if called during render phase
    // This immediate return might cause issues if states are expected to be initialized by React first.
    // A common pattern is to set an error state and return, or handle this within useEffect.
    // For this implementation, following the spec for immediate return.
    return { offers: [], isLoading: false, error: new Error('INVALID_ID') };
  }

  useEffect(() => {
    // Do not proceed if the v2 flag is still loading, or if the flag is disabled, or the hook instance is disabled via opts
    if (v2FlagLoading || !v2FlagEnabled || !enabled) {
      // If query shouldn't run, ensure loading is false and offers are empty.
      setOffers([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const fetchOffers = async () => {
      setLoading(true);
      setError(null); // Reset error before new fetch

      // Using safeQuery as specified
      const { data, error: queryError } = await safeQuery(() =>
        supabase
          .from('flight_offers_v2')
          .select('*')
          .eq('trip_request_id', tripRequestId)
      );

      if (!cancelled) {
        if (queryError) {
          console.error('Error fetching flight offers v2:', queryError);
          setError(queryError);
          setOffers([]);
        } else {
          // Assuming the data from Supabase matches FlightOfferV2[] structure.
          // Add type assertion if necessary, or data transformation.
          setOffers(data as FlightOfferV2[] || []); // Ensure data is not null/undefined before setting
          setError(null);
        }
        setLoading(false);
      }
    };

    fetchOffers();

    return () => {
      cancelled = true;
    };
  }, [tripRequestId, enabled, v2FlagEnabled, v2FlagLoading]); // Dependencies for the effect

  return { offers, isLoading, error };
}
