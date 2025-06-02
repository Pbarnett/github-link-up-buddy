import { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { fetchTripOffers, Offer } from "@/services/tripOffersService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format as formatDate } from "date-fns";
import TripOfferCard from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";
import { Progress } from "@/components/ui/progress";

interface TripDetails {
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
}

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  // Support both legacy `tripRequestId` and new `id` query param names
  const tripId = searchParams.get("id") || searchParams.get("tripRequestId");
  const autoBook = searchParams.get("auto_book") === 'true';
  const budget = Number(searchParams.get("budget")) || 0;
  const initialOffersCount = Number(searchParams.get("initial_offers")) || 0;
  const departureDateParam = searchParams.get("departure");
  const returnDateParam = searchParams.get("return");
  const location = useLocation();
  
  // Still use location.state as fallback for backward compatibility
  const locationState = location.state as { offers?: Offer[] } | null;
  const initialOffers = locationState?.offers ?? [];
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [isLoading, setIsLoading] = useState(true); // Start as loading by default
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ignoreFilter, setIgnoreFilter] = useState(false);
  const [usedRelaxedCriteria, setUsedRelaxedCriteria] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchDuration, setSearchDuration] = useState(0);
  const refreshIntervalRef = useRef<number | null>(null);
  const searchStartTimeRef = useRef<number>(Date.now());
  
  // Add debug logging for state changes
  useEffect(() => {
    console.log('[TripOffers] Current offers state:', {
      offersCount: offers.length,
      isLoading,
      hasError,
      firstOffer: offers[0]
    });
  }, [offers, isLoading, hasError]);

  // Client-side validateOfferDuration is removed.

  const loadOffers = useCallback(async (pageToLoad = 0, overrideFilter = false, relaxCriteria = false) => {
    console.log('[TripOffers] Loading offers:', {
      pageToLoad,
      overrideFilter,
      relaxCriteria,
      currentOffersCount: offers.length
    });

    // Don't show loading if we already have offers
    if (pageToLoad === 0 && offers.length === 0) {
      setIsLoading(true);
    } else if (pageToLoad > 0) {
      setIsFetchingNextPage(true);
    }
    setHasError(false);

    const pageSize = 20;

    console.log('loadOffers debug - before fetch:', {
      pageToLoad,
      overrideFilter,
      relaxCriteria,
      currentOffersCount: offers.length,
      isLoading,
      hasError
    });
    
    try {
      if (!tripId) {
        setHasError(true);
        setErrorMessage("No trip ID provided");
        if (pageToLoad === 0) setIsLoading(false); else setIsFetchingNextPage(false);
        return;
      }

      // Fetch trip details if not already available. This is crucial for filters.
      let currentTripDetails = tripDetails;
      if (!currentTripDetails) { // Fetch if tripDetails is null
        const { data: fetchedTripData, error: tripError } = await supabase
          .from("trip_requests")
          .select("min_duration,max_duration,budget,earliest_departure,latest_departure")
          .eq("id", tripId)
          .single();

        if (tripError || !fetchedTripData) {
          throw tripError || new Error("No trip data found for this ID.");
        }
        currentTripDetails = fetchedTripData;
        setTripDetails(currentTripDetails);
      }
      
      // If tripDetails are still null (e.g. initial fetch failed before, or for some other reason), we cannot proceed.
      // Even if trip details are missing, we should still try to fetch offers
      // The backend service should apply default filtering if needed
      console.log('[TripOffers] Trip details available:', !!currentTripDetails);
      
      const { offers: newOffers, total } = await fetchTripOffers(tripId, pageToLoad, pageSize);
      console.log('[TripOffers] Received offers:', {
        newOffersCount: newOffers.length,
        total,
        firstNewOffer: newOffers[0]
      });
      
      console.log('loadOffers debug - after fetch:', {
        newOffersCount: newOffers.length,
        total,
        firstOffer: newOffers[0],
        isLoading,
        hasError
      });
      
      // Update offers without clearing existing ones first
      if (pageToLoad === 0) {
        setOffers(newOffers);
      } else {
        setOffers(prev => [...prev, ...newOffers]);
      }
      
      // Update pagination data
      const paginationData = { totalFilteredOffers: total, currentPage: pageToLoad, pageSize };
      setHasMore((pageToLoad + 1) * pageSize < total);
      
      // If we found offers, slow down the refresh rate
      if (newOffers.length > 0 && refreshIntervalRef.current) {
        stopAutoRefresh();
        refreshIntervalRef.current = window.setInterval(() => {
          // Only check for new offers every 30 seconds once we have results
          refreshWithCheck();
        }, 30000);
      }

      // Update usedRelaxedCriteria state based on the actual criteria used for this load.
      // This is important for reflecting the state accurately in the UI and subsequent calls.
      // Only update this on a full reload (page 0) to reflect the current filter set accurately.
      if (pageToLoad === 0) {
        setUsedRelaxedCriteria(relaxCriteria);
      }


      if (pageToLoad === 0) { // Only show these toasts on initial load/refresh
        if (relaxCriteria) {
          toast({
            title: "Search with relaxed criteria",
            description: "Finding flights with more flexible duration and budget constraints.",
          });
        }
        if (overrideFilter) {
          toast({
            title: "Search without duration filter",
            description: `Showing all available offers regardless of trip duration.`,
          });
        }
      }
      
      // Show toast notifications based on results
      if (pageToLoad === 0) {
        // Show a toast only if no offers were found
        if (newOffers.length === 0) {
          toast({
            title: "No flight offers found",
            description: "Try relaxing your search criteria or refreshing.",
            variant: "destructive",
          });
        } else {
          // If offers were found, show a success toast
          toast({
            title: "Flight offers found",
            description: `Found ${newOffers.length} flight offers matching your criteria.`,
          });
        }
      }

    } catch (err: unknown) {
      console.error('Error loading offers:', err);
      setHasError(true);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong loading offers";
      setErrorMessage(errorMessage);
      toast({ title: "Error Loading Flight Offers", description: errorMessage, variant: "destructive" });
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [tripId, tripDetails]);
  
  // Main useEffect for loading offers when tripId or primary filters change.
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (tripId) {
        // Debug logs to help trace issues
        console.log('Debug: Initial load triggered', {
          tripId,
          budget,
          initialOffersCount,
          departureDateParam,
          returnDateParam,
          autoBook
        });
        
        console.log('Initial load debug:', {
          tripId,
          isLoading,
          offersCount: offers.length,
          hasError,
          errorMessage,
          tripDetails
        });
        
        // Validate parameters
        if (budget <= 0) {
          console.warn('Invalid or missing budget parameter:', budget);
        }
        
        if (initialOffersCount < 0) {
          console.warn('Invalid initial offers count:', initialOffersCount);
        }
        
        // If departure and return dates are available, log them for debugging
        if (departureDateParam && returnDateParam) {
          console.log('Travel window from URL:', departureDateParam, 'to', returnDateParam);
        }
        
        // If auto_book is specified, log it
        console.log('Auto-book setting from URL:', autoBook);
        
        setCurrentPage(0);
        setHasMore(true);
        setSearchDuration(0);
        searchStartTimeRef.current = Date.now();
        setTripDetails(null);

        // Don't clear existing offers to avoid flickering, unless they're stale
        if (offers.length > 0 && isRefreshing) {
          // Keep the existing offers during a refresh
          loadOffers(0, ignoreFilter, usedRelaxedCriteria);
        } else {
          // Clear any existing offers for a fresh load
          setOffers([]);
          loadOffers(0, ignoreFilter, usedRelaxedCriteria);
        }
        
        // Then start the auto-refresh for continuous updates
        startAutoRefresh();

        initialLoadRef.current = false;
    } else if (initialLoadRef.current) {
        // No trip ID provided, show error toast
        toast({
          title: "Invalid Request",
          description: "No trip ID provided. Please try creating a new trip request.",
          variant: "destructive",
        });
    }
    
    // Cleanup function to clear the interval when component unmounts or tripId changes
    return () => {
      stopAutoRefresh();
    };
  // ignoreFilter and usedRelaxedCriteria changes will trigger a page 0 reload.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, ignoreFilter, usedRelaxedCriteria, initialOffers.length]); 
  
  // Clean up the interval
  const stopAutoRefresh = useCallback(() => {
    if (refreshIntervalRef.current !== null) {
      window.clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  // Function to prefill trip details from URL parameters if available
  const buildInitialTripDetails = useCallback((): Partial<TripDetails> | null => {
    if (!tripId) return null;
    
    const details: Partial<TripDetails> = {};
    
    if (budget > 0) {
      details.budget = budget;
    }
    
    if (departureDateParam && returnDateParam) {
      try {
        // Validate dates
        const departureDate = new Date(departureDateParam);
        const returnDate = new Date(returnDateParam);
        
        if (!isNaN(departureDate.getTime()) && !isNaN(returnDate.getTime())) {
          details.earliest_departure = departureDateParam;
          details.latest_departure = returnDateParam;
        }
      } catch (e) {
        console.warn('Invalid date parameters in URL');
      }
    }
    
    return Object.keys(details).length > 0 ? details : null;
  }, [tripId, budget, departureDateParam, returnDateParam]);
  
  // Refresh offers function - must be defined before startAutoRefresh 
  const refreshOffers = useCallback(async () => {
    if (!tripId) return;
    setIsRefreshing(true); 
    setCurrentPage(0);
    // Don't clear offers during refresh to avoid flickering
    setHasMore(true);
    
    // First try to use URL parameters for trip details if available
    const initialDetails = buildInitialTripDetails();
    if (initialDetails) {
      setTripDetails(initialDetails as TripDetails);
    } else {
      setTripDetails(null); // Force re-fetch of trip details if no URL params
    }
    
    try {
      // When refreshing, use the current state of ignoreFilter and usedRelaxedCriteria
      await loadOffers(0, ignoreFilter, usedRelaxedCriteria); 
    } finally {
      setIsRefreshing(false);
    }
  }, [tripId, ignoreFilter, usedRelaxedCriteria, loadOffers]);
  
  // Setup auto-refresh interval - defined after its dependencies
  const startAutoRefresh = useCallback(() => {
    // Clear any existing interval first
    stopAutoRefresh();
    
    // Define the refresh function that will be used in both intervals
    const refreshWithCheck = () => {
      // Only auto-refresh if we're not already loading or refreshing
      if (!isLoading && !isRefreshing && !isFetchingNextPage) {
        console.log('Auto-refresh check - current state:', {
          offersCount: offers.length,
          isLoading,
          isRefreshing,
          isFetchingNextPage,
          hasError
        });
        // Update search duration for progress indicator
        const currentDuration = Math.min(100, Math.floor((Date.now() - searchStartTimeRef.current) / 600));
        setSearchDuration(currentDuration);
        
        console.log("Auto-refreshing offers...");
        
        // First check directly if offers exist before performing a full refresh
        supabase
          .from("flight_offers")
          .select("*", { count: "exact", head: true })
          .eq("trip_request_id", tripId || '')
          .then(({ count }) => {
            console.log(`Auto-refresh found ${count || 0} offers in database`);
            
            // Only do a full refresh if either:
            // 1. We don't have any offers locally but they exist in DB
            // 2. It's been less than a minute and we're still actively searching
            if ((offers.length === 0 && count && count > 0) || currentDuration < 100) {
              refreshOffers();
            }
            
            // If we've found offers or search has been going for over a minute, slow down the refresh rate
            if (offers.length > 0 || currentDuration >= 100) {
              console.log("Slowing down refresh rate...");
              stopAutoRefresh();
              refreshIntervalRef.current = window.setInterval(refreshWithCheck, 30000); // Slow down to every 30 seconds
            }
          })
          .catch(err => {
            console.error("Error in auto-refresh check:", err);
            refreshOffers(); // Fall back to full refresh on error
          });
      }
    };

    // Set initial interval - refresh every 10 seconds
    refreshIntervalRef.current = window.setInterval(refreshWithCheck, 5000); // Start with a faster refresh rate
  }, [isLoading, isRefreshing, isFetchingNextPage, offers.length, refreshOffers, stopAutoRefresh]);
  
  const handleOverrideSearch = () => {
    setIgnoreFilter(true); 
    setUsedRelaxedCriteria(false); // Override should disable relaxed criteria.
    // useEffect will handle reloading from page 0.
    // Toast message for overrideFilter is now handled inside loadOffers if pageToLoad === 0
  };
  
  const handleRelaxCriteria = async () => {
    if (!tripId) return;
    setIgnoreFilter(false); // Relaxed criteria should respect normal filters.
    setUsedRelaxedCriteria(true);
    // useEffect will handle reloading from page 0.
    // Toast message for relaxCriteria is now handled inside loadOffers if pageToLoad === 0
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasMore) {
      setIsFetchingNextPage(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage); // Update current page state
      // Call loadOffers with the new page, respecting current filter states
      loadOffers(nextPage, ignoreFilter, usedRelaxedCriteria);
    }
  };

  if (hasError && offers.length === 0) { // Only show full error card if no offers are displayed
    console.error('Debug: Error state reached', {
      errorMessage,
      tripId,
      offersLength: offers.length,
      tripDetails
    });
    
    return (
      <TripErrorCard 
        message={errorMessage} 
        onOverrideSearch={handleOverrideSearch} 
        showOverrideButton={!ignoreFilter && errorMessage.toLowerCase().includes("no offers")}
        onRelaxCriteria={handleRelaxCriteria}
        showRelaxButton={!usedRelaxedCriteria && errorMessage.toLowerCase().includes("no offers")}
      />
    );
  }

  console.log('Render debug:', {
    isLoading,
    offersCount: offers.length,
    hasError,
    errorMessage,
    hasMore,
    isFetchingNextPage
  });
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary Card */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle>Your trip request details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {formatDate(new Date(tripDetails.earliest_departure), "MMM d, yyyy")} –{" "}
                {formatDate(new Date(tripDetails.latest_departure), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>
                {tripDetails.min_duration}–{tripDetails.max_duration} days
                {ignoreFilter && " (filter disabled)"}
                {usedRelaxedCriteria && " (using relaxed criteria)"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>${tripDetails.budget}{usedRelaxedCriteria && " (up to +20% with relaxed criteria)"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Header */}
      <Card className="w-full max-w-5xl mb-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Trip Offers</CardTitle>
              <CardDescription>
                {isLoading && offers.length === 0
                  ? "Searching for flights in the background..."
                  : `${offers.length} offers found for your trip`}
              </CardDescription>
          </div>
          <div className="flex gap-2">
            {!usedRelaxedCriteria && (
              <Button 
                variant="outline" 
                onClick={handleRelaxCriteria}
                disabled={isRefreshing || (isLoading && offers.length === 0)}
              >
                Try Relaxed Criteria
              </Button>
            )}
            {!ignoreFilter && (
              <Button 
                variant="outline" 
                onClick={handleOverrideSearch} 
                disabled={isRefreshing || (isLoading && offers.length === 0)}
              >
                Search Any Duration
              </Button>
            )}
            <Button 
              onClick={refreshOffers} 
              disabled={isRefreshing || (isLoading && offers.length === 0)}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Offers"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main content area */}
      <div className="w-full max-w-5xl space-y-4">
        {/* Show loading state only when no offers are available */}
        {isLoading && offers.length === 0 && (
          <>
            <TripOffersLoading />
            <div className="text-center text-gray-600">
              <p>Flight search in progress...</p>
              <p className="text-sm mt-1">This may take up to a minute. Results will appear automatically.</p>
            </div>
            <div className="w-full max-w-5xl px-4">
              <Progress value={searchDuration} className="h-2 w-full" />
              <p className="text-xs text-center mt-1 text-gray-500">
                {searchDuration < 100 ? "Searching for the best flights..." : "Search nearly complete..."}
              </p>
            </div>
          </>
        )}

        {/* Show offers if we have them, regardless of loading state */}
        {offers.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Found {offers.length} flights for your trip</h2>
            {offers.map((offer) => (
              <TripOfferCard key={offer.id} offer={offer} />
            ))}
            {hasMore && !isFetchingNextPage && (
              <div className="text-center mt-8">
                <Button onClick={handleLoadMore} disabled={isFetchingNextPage}>
                  Load More Offers
                </Button>
              </div>
            )}
            {isFetchingNextPage && (
              <div className="text-center mt-8">
                <p>Loading more offers...</p>
              </div>
            )}
          </>
        )}

        {/* Show "no offers" message only if not loading and no offers */}
        {!isLoading && offers.length === 0 && (
            // "No offers found" card
            <Card className="p-6 text-center">
              <p className="mb-4">
                {initialOffersCount > 0 
                  ? `Initial search found ${initialOffersCount} offers. Searching for more options...` 
                  : "No offers found yet. Flight search is still in progress."}
              </p>
              <p className="text-sm text-gray-500">
                Flight searches run asynchronously and may take a minute to complete.
                Results will appear automatically as they become available.
              </p>
              
              {searchDuration >= 100 && offers.length === 0 && (
                <div className="mt-6 p-4 bg-amber-50 rounded-md border border-amber-200">
                  <h3 className="text-amber-800 font-medium">No flights found</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    The search completed but no flights were found matching your criteria. This could be due to:
                  </p>
                  <ul className="text-sm text-amber-700 list-disc list-inside mt-2">
                    <li>Limited flight availability for your selected dates</li>
                    <li>Destination may have limited service</li>
                    <li>Budget constraints may be too restrictive</li>
                    <li>Duration requirements may be too specific</li>
                  </ul>
                  <p className="text-sm text-amber-700 mt-2">
                    Trip ID: {tripId}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm text-amber-700">Would you like to try:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        className="bg-amber-100 hover:bg-amber-200 border-amber-300"
                        onClick={() => {
                          const newBudget = Math.round((budget || 1000) * 1.25); // 25% higher budget
                          // Construct a new trip request with higher budget
                          toast({
                            title: "Increasing budget",
                            description: `Trying again with a budget of $${newBudget}`,
                          });
                          // This will trigger a re-search with the higher budget
                          setIgnoreFilter(true);
                          refreshOffers();
                        }}
                      >
                        Increase Budget
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-amber-100 hover:bg-amber-200 border-amber-300"
                        onClick={() => {
                          toast({
                            title: "Expanding date range",
                            description: "Trying again with a wider date range",
                          });
                          // This would ideally expand the date range in the trip request
                          handleRelaxCriteria();
                        }}
                      >
                        Expand Date Range
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 mb-4">
                <Progress value={searchDuration} className="h-2 w-full" />
                <p className="text-xs text-center mt-1 text-gray-500">
                  {searchDuration < 100 ? "Searching for the best flights..." : "Search nearly complete..."}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {usedRelaxedCriteria 
                  ? "We tried with relaxed criteria but still couldn't find any offers. Try adjusting your destination or dates."
                  : ignoreFilter 
                    ? "Try adjusting your budget or destination, or click Refresh Offers."
                    : "Try one of the search options above or adjust your trip criteria."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                {!usedRelaxedCriteria && (
                  <Button 
                    onClick={handleRelaxCriteria} 
                    variant="secondary"
                  >
                    Try Relaxed Criteria
                  </Button>
                )}
                {!ignoreFilter && (
                  <Button 
                    onClick={handleOverrideSearch}
                  >
                    Search Any Duration
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
