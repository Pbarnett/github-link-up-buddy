

@/flightSearchV2/useFlightOffers';
@/flightSearchV2/types';

import React from 'react';
import TripOffersV2Skeleton from '@/components/TripOffersV2Skeleton';
import TripOffersV2Skeleton from '@/components/TripOffersV2Skeleton'; } from '@/components/ui/use-toast';

type FC<T = {}> = React.FC<T>;

// Placeholder for a component to show when the feature flag is disabled
const FlagDisabledPlaceholder: FC = () => (
  <Alert variant="destructive">
    <Terminal className="h-4 w-4" />
    <AlertTitle>Feature Disabled</AlertTitle>
    <AlertDescription>
      The Flight Search V2 feature is currently disabled. Please contact support
      if you believe this is an error.
    </AlertDescription>
  </Alert>
);

const EmptyStateCard: FC = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center">
        <AlertCircle className="mr-2 h-6 w-6 text-yellow-500" />
        No Offers Found Yet
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">
        We couldn't find any flight offers matching your criteria at the moment.
        Please try adjusting your search or check back later.
      </p>
    </CardContent>
  </Card>
);

const TripOffersV2: FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { offers, isLoading, error, isFeatureEnabled, refetch } =
    useFlightOffers(tripId || 'default-trip-id');

  // Debug logging
  console.log('[TripOffersV2] Debug info:', {
    tripId,
    offers: offers?.length || 0,
    offersData: offers,
    isLoading,
    error: error?.message,
    isFeatureEnabled,
  });

  if (!isFeatureEnabled) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <FlagDisabledPlaceholder />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <TripOffersV2Skeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Offers</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred.'}
                <button
                  onClick={refetch}
                  className="ml-2 mt-2 p-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  Retry
                </button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateCard />
            <button
              onClick={refetch}
              className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Refresh Offers
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (_e) {
      console.error('Error formatting date:', dateString, _e);
      return 'Invalid Date';
    }
  };

  const calculateTripDuration = (departDt: string, returnDt: string | null) => {
    if (!returnDt) return '1 day';
    try {
      const departDate = new Date(departDt);
      const returnDate = new Date(returnDt);
      const diffInMs = returnDate.getTime() - departDate.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'}`;
    } catch (_e) {
      console.error('Error calculating duration:', _e);
      return 'N/A';
    }
  };

  const formatFlightTime = (_departDt: string, _returnDt: string | null) => {
    // For V2, we don't have individual flight durations stored,
    // so we'll estimate based on route distance
    try {
      // This is a simplified estimation - in real implementation,
      // actual flight time would come from Amadeus API response
      return '~8h 30m'; // Placeholder for typical international flight
    } catch (_e) {
      return 'N/A';
    }
  };

  const handleBookOffer = (offer: FlightOfferV2) => {
    console.log('Booking offer:', offer.id, 'Booking URL:', offer.bookingUrl);

    // If offer has external booking URL (like Google Flights), redirect to airline website
    if (offer.bookingUrl) {
      console.log(`[ANALYTICS] External booking clicked:`, {
        offerId: offer.id,
        route: `${offer.originIata} → ${offer.destinationIata}`,
        price: offer.priceTotal,
        bookingUrl: offer.bookingUrl,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: `Redirecting to Airline Website`,
        description: 'Opening airline website to complete your booking...',
        duration: 3000,
      });

      // Redirect to the airline website for external bookings (like Google Flights)
      setTimeout(() => {
        window.open(offer.bookingUrl as string, '_blank');
      }, 500);

      return;
    }

    // If no external booking URL, fall back to internal booking flow
    console.log('No external booking URL found, using internal booking flow');

    // Convert V2 offer format to legacy format for internal booking
    const params = new URLSearchParams();
    params.set('id', offer.id as string);
    params.set('airline', offer.originIata + '-' + offer.destinationIata); // Placeholder airline
    params.set('flight_number', 'V2-' + offer.id.slice(0, 6));
    params.set('price', offer.priceTotal.toString());
    params.set('departure_date', offer.departDt.split('T')[0]);
    params.set('departure_time', new Date(offer.departDt).toLocaleTimeString());
    params.set(
      'return_date',
      offer.returnDt
        ? offer.returnDt.split('T')[0]
        : offer.departDt.split('T')[0]
    );
    params.set(
      'return_time',
      offer.returnDt
        ? new Date(offer.returnDt).toLocaleTimeString()
        : new Date(offer.departDt).toLocaleTimeString()
    );
    params.set(
      'duration',
      offer.returnDt
        ? Math.ceil(
            (new Date(offer.returnDt).getTime() -
              new Date(offer.departDt).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + ' days'
        : '1 day'
    );

    navigate(`/trip/confirm?${params.toString()}`);

    toast({
      title: 'Flight Selected',
      description: `You've selected flight ${offer.originIata} → ${offer.destinationIata} for booking.`,
    });
  };

  // Filter out one-way flights if this search expects round-trip flights
  // Check if this is a round-trip search by looking for offers that have return dates
  const hasRoundTripOffers = offers.some(offer => offer.returnDt);
  const hasOneWayOffers = offers.some(offer => !offer.returnDt);

  const filteredOffers = hasRoundTripOffers
    ? offers.filter(offer => offer.returnDt) // Only show round-trip flights if any exist
    : offers; // Show all flights (including one-way) if no round-trip offers exist

  const oneWayOffersFiltered =
    hasRoundTripOffers &&
    hasOneWayOffers &&
    filteredOffers.length < offers.length;

  // Sort offers by price (cheapest first)
  const sortedOffers = [...filteredOffers].sort(
    (a, b) => a.priceTotal - b.priceTotal
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Available Flight Offers
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Sorted by price (lowest to highest)
          </p>
          {oneWayOffersFiltered && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Round-trip flights only</AlertTitle>
              <AlertDescription>
                One-way flights have been filtered out to show only nonstop
                round-trip options as requested.
                {offers.length - filteredOffers.length} one-way flight
                {offers.length - filteredOffers.length !== 1
                  ? 's were'
                  : ' was'}{' '}
                hidden.
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {sortedOffers.map(offer => (
              <div
                key={offer.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* LEFT: Flight Details */}
                  <div className="flex-1 space-y-1">
                    {/* Route and Trip Duration */}
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {offer.originIata} → {offer.destinationIata}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {calculateTripDuration(offer.departDt, offer.returnDt)}
                      </span>
                    </div>

                    {/* Flight Details */}
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">Depart:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatDate(offer.departDt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Return:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {offer.returnDt
                            ? formatDate(offer.returnDt)
                            : 'One-way'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Flight:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatFlightTime(offer.departDt, offer.returnDt)}
                        </span>
                      </div>

                      {/* Badges inline */}
                      {offer.nonstop && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Nonstop
                        </span>
                      )}
                      {offer.bagsIncluded && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Bags Included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: Price and Book Button */}
                  <div className="flex items-center gap-4 ml-6">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(
                          offer.priceTotal,
                          offer.priceCurrency || 'USD'
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBookOffer(offer)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Book Flight
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={refetch}
              className="p-2 border rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out flex items-center"
            >
              <Terminal className="mr-2 h-4 w-4" />
              Refresh Offers
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOffersV2;
