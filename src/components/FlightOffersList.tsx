import { Offer } from '@/types/offers';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useFlightOffers } from '@/hooks/useFlightOffers';
import { TripOfferCard } from '@/components/trip/TripOfferCard';
import { useEffect } from 'react';

interface FlightOffersListProps {
  tripId: string;
  className?: string;
}

export function FlightOffersList({ tripId, className = '' }: FlightOffersListProps) {
  const { 
    data,
    isLoading,
    isError,
    error
  } = useFlightOffers({
    tripId,
    refetchInterval: 5000
  });

  // Add debug logging
  useEffect(() => {
    console.group('[FlightOffersList] State update');
    console.log('Current state:', {
      tripId,
      isLoading,
      isError,
      hasData: !!data,
      offersCount: data?.offers.length || 0
    });
    if (isError) {
      console.error('Error:', error);
    }
    console.groupEnd();
  }, [tripId, isLoading, isError, data, error]);

  // Loading state
  if (isLoading && (!data || data.offers.length === 0)) {
    console.log('[FlightOffersList] Showing loading state');
    return (
      <div className="w-full max-w-5xl space-y-4">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="text-center text-gray-600">
              <p>Searching for flights...</p>
              <p className="text-sm mt-1">This may take up to a minute. Results will appear automatically.</p>
            </div>
            <Progress value={45} className="h-2 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    console.log('[FlightOffersList] Showing error state:', error);
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500">Error loading flight offers: {error.message}</p>
      </Card>
    );
  }

  // No offers found
  if (!data || data.offers.length === 0) {
    const searchCompleted = localStorage.getItem(`flight_search_${tripId}_completed`);
    const searchInserted = localStorage.getItem(`flight_search_${tripId}_inserted`);

    console.log('[FlightOffersList] No offers state:', {
      searchCompleted,
      searchInserted
    });

    if (searchCompleted === 'true' && searchInserted === '0') {
      return (
        <Card className="p-6 text-center">
          <p className="text-gray-600">No flights found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search parameters.</p>
        </Card>
      );
    }

    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">Searching for flights...</p>
        <Progress value={75} className="h-2 w-full mt-4" />
      </Card>
    );
  }

  // Display offers
  console.log('[FlightOffersList] Rendering offers:', data.offers.length);
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-semibold">Found {data.total} flights for your trip</h2>
      {data.offers.map((offer) => (
        <TripOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

