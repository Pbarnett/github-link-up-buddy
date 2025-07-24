type FC<T = {}> = React.FC<T>;

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TripOffersV2Skeleton from '@/components/TripOffersV2Skeleton';
import AdvancedFilterControls, {
  FilterOptions,
} from '@/components/filtering/AdvancedFilterControls';
import { useFilterState } from '@/hooks/useFilterState';
import { useTripOffersPools } from '@/hooks/useTripOffers';
import { toast } from '@/components/ui/use-toast';

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

const TripOffersV2Enhanced: FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  // Use the enhanced pools hook that supports filtering
  const poolsResult = useTripOffersPools({ tripId: tripId || null });
  const {
    pool1,
    pool2,
    pool3,
    budget: tripBudget,
    maxBudget,
    isLoading,
    hasError,
    errorMessage,
    refreshPools,
  } = poolsResult;

  // Initialize filter state with trip budget
  const {
    filterState,
    filteredOffers,
    updateFilters,
    resetFilters,
    setOffers,
    isApplyingFilters,
  } = useFilterState(
    { budget: tripBudget, currency: 'USD' },
    { persist: true, storageKey: `trip-filters-${tripId}` }
  );

  // Combine all pool offers
  const allOffers = useMemo(() => {
    return [...pool1, ...pool2, ...pool3];
  }, [pool1, pool2, pool3]);

  // Set offers for filtering when they change
  useEffect(() => {
    if (allOffers.length > 0) {
      setOffers(allOffers);
    }
  }, [allOffers, setOffers]);

  // Handler for filter changes that require backend refresh
  const handleFiltersChange = async (newOptions: FilterOptions) => {
    updateFilters(newOptions);

    // Check if this requires a backend refresh (budget, nonstop, pipelineType changes)
    const needsBackendRefresh =
      newOptions.budget !== filterState.options.budget ||
      newOptions.nonstop !== filterState.options.nonstop ||
      newOptions.pipelineType !== filterState.options.pipelineType;

    if (needsBackendRefresh && refreshPools) {
      toast({
        title: 'Updating Results',
        description: 'Fetching new results based on your filter criteria...',
      });

      try {
        await refreshPools();
      } catch (_error) {
        toast({
          title: 'Error',
          description: 'Failed to refresh results. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  // Debug logging
  console.log('[TripOffersV2Enhanced] Debug info:', {
    tripId,
    allOffersCount: allOffers.length,
    filteredOffersCount: filteredOffers.length,
    filterState,
    isLoading,
    hasError,
    errorMessage,
  });

  if (isLoading) {
    return <TripOffersV2Skeleton />;
  }

  if (hasError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2 Enhanced</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Offers</AlertTitle>
              <AlertDescription>
                {errorMessage || 'An unexpected error occurred.'}
                <button
                  onClick={refreshPools}
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

  if (allOffers.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2 Enhanced</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateCard />
            <button
              onClick={refreshPools}
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

  const handleBookOffer = (offer: Record<string, unknown>) => {
    const offerId = typeof offer.id === 'string' ? offer.id : String(offer.id);
    const offerPrice =
      typeof offer.price === 'number' ? offer.price : Number(offer.price);
    const offerAirline =
      typeof offer.airline === 'string' ? offer.airline : String(offer.airline);

    console.log('Booking offer:', offerId);

    toast({
      title: 'Flight Selected',
      description: `You've selected a flight for ${formatCurrency(offerPrice)} for booking.`,
    });

    // Navigate to booking confirmation
    const params = new URLSearchParams();
    params.set('id', offerId);
    params.set('airline', offerAirline);
    params.set('flight_number', offerId.slice(0, 8)); // Use part of ID as flight number
    params.set('price', offerPrice.toString());
    params.set('departure_date', new Date().toISOString().split('T')[0]); // Placeholder
    params.set('departure_time', '08:00'); // Placeholder
    params.set(
      'return_date',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    ); // Placeholder
    params.set('return_time', '18:00'); // Placeholder
    params.set('duration', 'Round-trip'); // Placeholder

    navigate(`/trip/confirm?${params.toString()}`);
  };

  // Sort filtered offers by price (cheapest first)
  const sortedOffers = [...filteredOffers].sort((a, b) => a.price - b.price);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Enhanced Filter Controls */}
      <AdvancedFilterControls
        filterState={filterState}
        onFiltersChange={handleFiltersChange}
        onResetFilters={resetFilters}
        onRefreshResults={refreshPools}
        isLoading={isApplyingFilters || isLoading}
        showAdvanced={true}
        maxBudget={maxBudget}
        tripBudget={tripBudget}
      />

      {/* Results Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Filter className="h-6 w-6 text-blue-600" />
                Available Flight Offers
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                {filteredOffers.length === allOffers.length
                  ? `Showing all ${allOffers.length} offers`
                  : `Showing ${filteredOffers.length} of ${allOffers.length} offers`}{' '}
                • Sorted by price (lowest to highest)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {filterState.activeFiltersCount > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {filterState.activeFiltersCount} filter
                  {filterState.activeFiltersCount !== 1 ? 's' : ''} active
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPools}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-800"
              >
                <Terminal className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {sortedOffers.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No flights match your filters
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filter criteria to see more results.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedOffers.map(offer => (
                <div
                  key={offer.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {/* LEFT: Flight Details */}
                    <div className="flex-1 space-y-1">
                      {/* Route and Trip Type */}
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {offer.airline} Flight
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {offer.isRoundTrip ? 'Round-trip' : 'One-way'}
                        </span>
                        {offer.score && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            Score: {(offer.score * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>

                      {/* Flight Details */}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Airline:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {offer.airline}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Flight ID:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {offer.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Price and Book Button */}
                    <div className="flex items-center gap-4 ml-6">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(
                            offer.price,
                            filterState.options.currency || 'USD'
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          handleBookOffer(
                            offer as unknown as Record<string, unknown>
                          )
                        }
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
          )}
        </CardContent>
      </Card>

      {/* Pool Distribution Debug Info (Development Only) */}
      {import.meta.env.DEV && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Pool Distribution (Dev Info)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600">
            <div className="grid grid-cols-3 gap-4">
              <div>Pool 1: {pool1.length} offers</div>
              <div>Pool 2: {pool2.length} offers</div>
              <div>Pool 3: {pool3.length} offers</div>
            </div>
            <div className="mt-2">
              Filter Mode: {filterState.options.pipelineType || 'standard'} •
              Budget:{' '}
              {filterState.options.budget
                ? formatCurrency(filterState.options.budget)
                : 'None'}{' '}
              • Active Filters: {filterState.activeFiltersCount}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripOffersV2Enhanced;
