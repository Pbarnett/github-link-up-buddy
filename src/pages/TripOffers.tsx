import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as { offers?: Offer[] } | null;
  const initialOffers = locationState?.offers ?? [];
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(initialOffers.length === 0);
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

  // Client-side validateOfferDuration is removed.

  const loadOffers = async (pageToLoad = 0, overrideFilter = false, relaxCriteria = false) => {
    if (pageToLoad === 0) {
      setIsLoading(true);
    } else {
      setIsFetchingNextPage(true);
    }
    setHasError(false);

    const pageSize = 20;

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
      if (!currentTripDetails) {
          throw new Error("Trip details are not available to send to the server for filtering.");
      }
      
      const { offers: newOffers, total } = await fetchTripOffers(tripId, pageToLoad, pageSize);
      const paginationData = { totalFilteredOffers: total, currentPage: pageToLoad, pageSize };

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
      
      if (newOffers.length === 0 && pageToLoad === 0) {
        toast({
          title: "No flight offers found",
          description: "Try relaxing your search criteria or refreshing.",
          variant: "destructive",
        });
        setOffers([]);
      } else if (pageToLoad === 0) {
        setOffers(newOffers);
      } else {
        setOffers(prevOffers => [...prevOffers, ...newOffers]);
      }

      if (paginationData) {
        setHasMore((paginationData.currentPage + 1) * paginationData.pageSize < paginationData.totalFilteredOffers);
      } else {
        // Fallback if paginationData is not available from the server
        setHasMore(newOffers.length === pageSize);
      }

    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err.message || "Something went wrong loading offers");
      toast({ title: "Error Loading Flight Offers", description: err.message || "An unexpected error occurred while trying to load flight offers. Please try again.", variant: "destructive" });
      setHasMore(false);
    } finally {
      if (pageToLoad === 0) setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };
  
  // Main useEffect for loading offers when tripId or primary filters change.
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (tripId) {
        setCurrentPage(0);
        setHasMore(true);
        setSearchDuration(0);
        searchStartTimeRef.current = Date.now();
        setTripDetails(null);

        if (initialLoadRef.current && initialOffers.length > 0) {
          startAutoRefresh();
        } else {
          setOffers([]);
          loadOffers(0, ignoreFilter, usedRelaxedCriteria);
        }

        initialLoadRef.current = false;
    }
    
    // Cleanup function to clear the interval when component unmounts or tripId changes
    return () => {
      stopAutoRefresh();
    };
  // ignoreFilter and usedRelaxedCriteria changes will trigger a page 0 reload.
  }, [tripId, ignoreFilter, usedRelaxedCriteria]); 
  
  // Setup auto-refresh interval
  const startAutoRefresh = () => {
    // Clear any existing interval first
    stopAutoRefresh();
    
    // Set a new interval - refresh every 10 seconds
    refreshIntervalRef.current = window.setInterval(() => {
      // Only auto-refresh if we're not already loading or refreshing
      if (!isLoading && !isRefreshing && !isFetchingNextPage) {
        // Update search duration for progress indicator
        const currentDuration = Math.min(100, Math.floor((Date.now() - searchStartTimeRef.current) / 600));
        setSearchDuration(currentDuration);
        
        console.log("Auto-refreshing offers...");
        refreshOffers();
        
        // If we've found offers or search has been going for over a minute, slow down the refresh rate
        if (offers.length > 0 || currentDuration >= 100) {
          console.log("Slowing down refresh rate...");
          stopAutoRefresh();
          refreshIntervalRef.current = window.setInterval(() => {
            if (!isLoading && !isRefreshing && !isFetchingNextPage) {
              refreshOffers();
            }
          }, 30000); // Slow down to every 30 seconds once we have results
        }
      }
    }, 10000); // Initial polling every 10 seconds
  };
  
  // Clean up the interval
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current !== null) {
      window.clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };


  const refreshOffers = async () => {
    if (!tripId) return;
    setIsRefreshing(true); 
    setCurrentPage(0);
    setOffers([]);
    setHasMore(true);
    setTripDetails(null); // Force re-fetch of trip details
    try {
      // When refreshing, use the current state of ignoreFilter and usedRelaxedCriteria
      await loadOffers(0, ignoreFilter, usedRelaxedCriteria); 
    } finally {
      setIsRefreshing(false);
    }
  };
  
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

      {isLoading && offers.length === 0 ? ( // Show main loader only if it's initial load and no offers yet
        <div className="w-full max-w-5xl space-y-4">
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
        </div>
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.length > 0 ? (
            <>
              {offers.map((offer) => <TripOfferCard key={offer.id} offer={offer} />)}
              {hasMore && !isFetchingNextPage && (
                <div className="text-center mt-8">
                  <Button onClick={handleLoadMore} disabled={isFetchingNextPage}>
                    Load More Offers
                  </Button>
                </div>
              )}
              {isFetchingNextPage && (
                <div className="text-center mt-8">
                  <p>Loading more offers...</p> {/* Or a spinner */}
                </div>
              )}
            </>
          ) : (
            // "No offers found" card (existing logic)
            <Card className="p-6 text-center">
              <p className="mb-4">No offers found yet. Flight search is still in progress.</p>
              <p className="text-sm text-gray-500">
                Flight searches run asynchronously and may take a minute to complete.
                Results will appear automatically as they become available.
              </p>
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
      )}
    </div>
  );
}
