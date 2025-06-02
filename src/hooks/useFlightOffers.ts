import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Offer } from '@/types/offers';
import { useToast } from '@/hooks/use-toast';

interface UseFlightOffersOptions {
  tripId: string;
  enabled?: boolean;
  refetchInterval?: number | false;
}

interface FlightOffersResponse {
  offers: Offer[];
  total: number;
}

export function useFlightOffers({ 
  tripId, 
  enabled = true,
  refetchInterval = 5000 
}: UseFlightOffersOptions) {
  const { toast } = useToast();
  
  const queryFn = async () => {
    console.group(`[useFlightOffers] Fetching offers for trip: ${tripId}`);
    console.log('Query start time:', new Date().toISOString());
    
    try {
      // First check if trip exists
      const { data: trip, error: tripError } = await supabase
        .from('trip_requests')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) {
        console.error('Trip fetch error:', tripError);
        throw tripError;
      }

      console.log('Trip found:', trip);

      // Then get the offers
      const { data: offers, error: offersError, count } = await supabase
        .from('flight_offers')
        .select('*', { count: 'exact' })
        .eq('trip_request_id', tripId)
        .order('price', { ascending: true });

      if (offersError) {
        console.error('Offers fetch error:', offersError);
        throw offersError;
      }
      console.log('Query results:', {
        offersCount: offers?.length || 0,
        total: count || 0,
        sampleOffer: offers?.[0]
      });

      // Check flight search status
      const searchCompleted = localStorage.getItem(`flight_search_${tripId}_completed`);
      const searchInserted = localStorage.getItem(`flight_search_${tripId}_inserted`);

      console.log('Search status:', {
        completed: searchCompleted,
        inserted: searchInserted
      });

      console.groupEnd();
      
      return {
        offers: offers || [],
        total: count || 0
      };
    } catch (err) {
      console.error('Query error:', err);
      console.groupEnd();
      throw err;
    }
  };

  return useQuery<FlightOffersResponse, Error>({
    queryKey: ['flightOffers', tripId],
    queryFn,
    enabled: enabled && !!tripId,
    refetchInterval: (data) => {
      // Stop polling if we have offers
      if (data?.offers.length > 0) {
        console.log('[useFlightOffers] Stopping poll - offers found');
        return false;
      }
      
      // Stop polling if search completed with no matches
      const searchCompleted = localStorage.getItem(`flight_search_${tripId}_completed`);
      const searchInserted = localStorage.getItem(`flight_search_${tripId}_inserted`);
      
      if (searchCompleted === 'true' && searchInserted === '0') {
        console.log('[useFlightOffers] Stopping poll - search completed with no matches');
        return false;
      }
      
      console.log('[useFlightOffers] Continuing to poll');
      return refetchInterval;
    },
    staleTime: 0,
    retry: 3,
    onError: (error) => {
      console.error('[useFlightOffers] Query error:', error);
      toast({
        title: "Error loading flight offers",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

