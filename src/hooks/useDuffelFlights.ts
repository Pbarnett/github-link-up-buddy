
/**
 * @file Hook for managing Duffel flight search state
 * Battle-tested pattern following existing useTripOffers approach
 */

import {
  fetchDuffelFlights,
  DuffelSearchResponse,

import logger from '@/lib/logger';

export interface DuffelSearchOptions {
  maxPrice?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  maxResults?: number;
  autoSearch?: boolean; // Trigger search automatically when tripRequestId changes
}

export interface DuffelFlightOffer {
  id: string;
  price: number;
  currency: string;
  airline_code: string;
  flight_number: string;
  origin_airport: string;
  destination_airport: string;
  departure_date: string;
  departure_time: string;
  return_date?: string;
  return_time?: string;
  duration: string;
  expires_at?: string;
  cabin_class?: string;
  provider: 'duffel'; // Always 'duffel' for this hook
}

export interface UseDuffelFlightsReturn {
  // Data
  offers: DuffelFlightOffer[];
  searchResponse: DuffelSearchResponse | null;

  // State
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  // Actions
  searchFlights: (options?: DuffelSearchOptions) => Promise<void>;
  clearResults: () => void;
  retry: () => void;

  // Metadata
  lastSearchTime: Date | null;
  offersCount: number;
  searchSuccess: boolean;
}

/**
 * Hook for managing Duffel flight search operations
 * Integrates with existing useTripOffers pattern for consistency
 */
export const useDuffelFlights = (
  tripRequestId: string | null,
  initialOptions: DuffelSearchOptions = {}
): UseDuffelFlightsReturn => {
  // State
  const [offers, setOffers] = useState<DuffelFlightOffer[]>([]);
  const [searchResponse, setSearchResponse] =
    useState<DuffelSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  const [lastSearchOptions, setLastSearchOptions] =
    useState<DuffelSearchOptions>(initialOptions);

  // Clear all state
  const clearResults = useCallback(() => {
    setOffers([]);
    setSearchResponse(null);
    setError(null);
    setLastSearchTime(null);
  }, []);

  // Search flights function
  const searchFlights = useCallback(
    async (options: DuffelSearchOptions = {}) => {
      if (!tripRequestId) {
        logger.warn(
          '[useDuffelFlights] No tripRequestId provided, skipping search'
        );
        return;
      }

      setIsSearching(true);
      setIsLoading(true);
      setError(null);

      const searchOptions = { ...initialOptions, ...options };
      setLastSearchOptions(searchOptions);

      logger.info('[useDuffelFlights] Starting Duffel search:', {
        tripRequestId,
        options: searchOptions,
      });

      try {
        const response = await fetchDuffelFlights(tripRequestId, {
          tripRequestId,
          ...searchOptions,
        });

        setSearchResponse(response);
        setLastSearchTime(new Date());

        if (response.success) {
          logger.info('[useDuffelFlights] Search successful:', {
            offersFound: response.offersFound,
            inserted: response.inserted,
          });

          // Current architecture: Search API inserts offers to database, then we fetch them
          // This allows for better caching, persistence, and data integrity
          // NOTE: Could optimize by returning offers directly from search API in future
          await fetchOffersFromDatabase();
        } else {
          const errorMessage =
            response.error?.message || 'Search failed without specific error';
          logger.error('[useDuffelFlights] Search failed:', errorMessage);
          setError(errorMessage);
          setOffers([]);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Network error during search';
        logger.error('[useDuffelFlights] Search exception:', err);
        setError(errorMessage);
        setOffers([]);
        setSearchResponse(null);
      } finally {
        setIsSearching(false);
        setIsLoading(false);
      }
    },
    [tripRequestId, initialOptions]
  );

  // Helper function to fetch offers from database after search
  const fetchOffersFromDatabase = useCallback(async () => {
    if (!tripRequestId) return;

    try {
      // Import here to avoid circular dependencies
      const { supabase } = await import('@/integrations/supabase/client');

      // Debug: Check current user
      const userResult = await supabase.auth.getUser();
      const {
        data: { user },
      } = userResult;
      logger.info('[useDuffelFlights] Current user for database query:', {
        userId: user?.id,
        email: user?.email,
        tripRequestId,
      });

      const query = supabase
        .from('flight_offers_v2')
        .select('*')
        .eq('trip_request_id', tripRequestId)
        .eq('mode', 'AUTO') // Duffel offers use AUTO mode
        .order('price_total', { ascending: true })
        .limit(50);

      const result = await (query as unknown as Promise<{
        data: any;
        error: any;
      }>);
      const { data: offersData, error: fetchError } = result;

      if (fetchError) {
        logger.error(
          '[useDuffelFlights] Error fetching offers from database:',
          fetchError
        );
        throw new Error(`Database fetch failed: ${fetchError.message}`);
      }

      if (offersData && offersData.length > 0) {
        // Transform database offers to our hook format
        const transformedOffers: DuffelFlightOffer[] = offersData.map(
          (offer: any) => ({
            id: offer.id,
            price: offer.price_total,
            currency: offer.price_currency || 'USD',
            airline_code:
              offer.raw_offer_payload?.slices?.[0]?.segments?.[0]
                ?.operating_carrier?.iata_code || 'XX',
            flight_number:
              offer.raw_offer_payload?.slices?.[0]?.segments?.[0]
                ?.operating_carrier_flight_number || 'XXXX',
            origin_airport: offer.origin_iata,
            destination_airport: offer.destination_iata,
            departure_date: offer.depart_dt?.split('T')[0] || '',
            departure_time:
              offer.depart_dt?.split('T')[1]?.substring(0, 5) || '',
            return_date: offer.return_dt?.split('T')[0] || undefined,
            return_time:
              offer.return_dt?.split('T')[1]?.substring(0, 5) || undefined,
            duration:
              offer.raw_offer_payload?.slices?.[0]?.duration || 'Unknown',
            expires_at: offer.raw_offer_payload?.expires_at,
            cabin_class: offer.cabin_class,
            provider: 'duffel',
          })
        );

        setOffers(transformedOffers);
        logger.info(
          '[useDuffelFlights] Loaded offers from database:',
          transformedOffers.length
        );
      } else {
        setOffers([]);
        logger.info('[useDuffelFlights] No offers found in database');
      }
    } catch (err: unknown) {
      logger.error(
        '[useDuffelFlights] Exception fetching offers from database:',
        err
      );
      // Don't set error state here since the search itself might have been successful
      // Just log the issue and leave offers empty
    }
  }, [tripRequestId]);

  // Retry function (re-runs last search)
  const retry = useCallback(() => {
    searchFlights(lastSearchOptions);
  }, [searchFlights, lastSearchOptions]);

  // Auto-search effect
  useEffect(() => {
    if (tripRequestId && initialOptions.autoSearch !== false) {
      logger.info(
        '[useDuffelFlights] Auto-searching for tripRequestId:',
        tripRequestId
      );
      searchFlights(initialOptions);
    }
  }, [tripRequestId, searchFlights]); // Only depend on tripRequestId changes

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any pending operations if component unmounts
      logger.info('[useDuffelFlights] Hook cleanup');
    };
  }, []);

  return {
    // Data
    offers,
    searchResponse,

    // State
    isLoading,
    isSearching,
    error,

    // Actions
    searchFlights,
    clearResults,
    retry,

    // Metadata
    lastSearchTime,
    offersCount: offers.length,
    searchSuccess: searchResponse?.success ?? false,
  };
};

export default useDuffelFlights;
