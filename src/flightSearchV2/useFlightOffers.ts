import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { getFlightOffers } from '@/serverActions/getFlightOffers';
import { mapFlightOfferDbRowToV2 } from './utils/mapFlightOfferDbRowToV2';
import type { FlightOfferV2, FlightOfferV2DbRow } from './types';

export interface UseFlightOffersOptions {
  // If false, the hook will not run the fetch operation.
  enabled?: boolean;
}

export interface UseFlightOffersResult {
  offers: FlightOfferV2[];
  isLoading: boolean;
  error: Error | null;
  isFeatureEnabled: boolean;
  refetch: () => void;
}

const initialState = {
  offers: [],
  isLoading: false,
  error: null,
};

export function useFlightOffers(
  tripRequestId: string,
  opts: UseFlightOffersOptions = {}
): UseFlightOffersResult {
  const { enabled: optionEnabled = true } = opts;

  // The useFeatureFlag hook returns an object with { data, isLoading, isError, error }
  // We need to extract the data property to get the actual boolean value
  const featureFlagResult = useFeatureFlag('flight_search_v2_enabled', false);
  const isFeatureFlagEnabled = featureFlagResult.data;

  const [offers, setOffers] = useState<FlightOfferV2[]>(initialState.offers);
  const [isLoading, setLoading] = useState<boolean>(initialState.isLoading);
  const [error, setError] = useState<Error | null>(initialState.error);
  // Removed duplicate state declarations for offers, isLoading, error
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = () => {
    setFetchTrigger(prev => prev + 1);
  };

  const isValidTripRequestId =
    tripRequestId && typeof tripRequestId === 'string';

  useEffect(() => {
    // Only proceed if feature is enabled, hook is enabled via options, and tripRequestId is valid.
    if (!isFeatureFlagEnabled || !optionEnabled) {
      setOffers(initialState.offers);
      setLoading(false);
      setError(null);
      return;
    }

    if (!isValidTripRequestId) {
      setError(new Error('Invalid tripRequestId provided.'));
      setOffers(initialState.offers);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchOffersData = async () => {
      setLoading(true);
      setError(null);

      try {
        // If this is a refetch (fetchTrigger > 0), force refresh to trigger flight search
        const shouldRefresh = fetchTrigger > 0;
        const dbRows: FlightOfferV2DbRow[] = await getFlightOffers({
          tripRequestId,
          refresh: shouldRefresh,
          useCache: true,
        });

        if (abortController.signal.aborted) {
          return;
        }

        const mappedOffers = dbRows.map(mapFlightOfferDbRowToV2);
        setOffers(mappedOffers);
      } catch (e) {
        if (abortController.signal.aborted) {
          return;
        }
        console.error('Error fetching or processing flight offers v2:', e);
        setError(
          e instanceof Error ? e : new Error('An unknown error occurred')
        );
        setOffers([]);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOffersData();

    return () => {
      abortController.abort();
    };
  }, [
    tripRequestId,
    optionEnabled,
    isFeatureFlagEnabled,
    isValidTripRequestId,
    fetchTrigger,
  ]);

  // If feature flag is not enabled, return the disabled state.
  // This check is now after the useEffect to comply with rules of hooks.
  if (!isFeatureFlagEnabled) {
    return {
      offers: [],
      isLoading: false, // Should be false as useEffect would have reset it or not run fetch.
      error: null, // Should be null for the same reason.
      isFeatureEnabled: false,
      refetch,
    };
  }

  return {
    offers,
    isLoading,
    error,
    isFeatureEnabled: true,
    refetch,
  };
}

// Exporting the mapper as requested by requirements,
// though it's also directly importable from its own module.
export { mapFlightOfferDbRowToV2 };
