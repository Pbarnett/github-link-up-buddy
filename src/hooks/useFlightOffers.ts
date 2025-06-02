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
  
  return useQuery<FlightOffersResponse, Error>({
    queryKey: ['flightOffers', tripId],
    queryFn: async () => {
      console.log('[useFlightOffers] Fetching offers for trip:', tripId);
      
      const { data, error, count } = await supabase
        .from('flight_offers')
        .select('*', { count: 'exact' })
        .eq('trip_request_id', tripId)
        .order('price', { ascending: true });

      if (error) {
        console.error('[useFlightOffers] Error fetching offers:', error);
        toast({
          title: "Error loading flight offers",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Check if we got any offers
      if (data && data.length > 0) {
        console.log('[useFlightOffers] Found offers:', data.length);
      } else {
        console.log('[useFlightOffers] No offers found for trip:', tripId);
        // Check if the search was completed but no offers were inserted
        const searchCompleted = window.localStorage.getItem(`flight_search_${tripId}_completed`);
        const searchInserted = window.localStorage.getItem(`flight_search_${tripId}_inserted`);
        
        if (searchCompleted === 'true' && searchInserted === '0') {
          console.log('[useFlightOffers] Search completed with no matches');
        }
      }
      
      return {
        offers: data || [],
        total: count || 0
      };
    },
    enabled: enabled && !!tripId,
    refetchInterval: (data) => {
      // Stop polling if we have offers or if the search completed with no matches
      const searchCompleted = window.localStorage.getItem(`flight_search_${tripId}_completed`);
      const searchInserted = window.localStorage.getItem(`flight_search_${tripId}_inserted`);
      
      if (data?.offers.length > 0 || (searchCompleted === 'true' && searchInserted === '0')) {
        return false;
      }
      
      return refetchInterval;
    },
    staleTime: 0, // Always fetch fresh data
    retry: 3,
    retryDelay: 1000,
  });
}

