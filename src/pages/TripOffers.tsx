
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/services/tripOffersService";
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

interface TripDetails {
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
}

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [ignoreFilter, setIgnoreFilter] = useState(false);
  const [usedRelaxedCriteria, setUsedRelaxedCriteria] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadOffers = async (pageToLoad = 0, overrideFilter = false, relaxCriteria = false, forceRefresh = false) => {
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

      // Fetch trip details if not already available
      let currentTripDetails = tripDetails;
      if (!currentTripDetails) {
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
      
      if (!currentTripDetails) {
        throw new Error("Trip details are not available to send to the server for filtering.");
      }
      
      // Call the flight-search function with proper mode detection
      const requestBody = {
        tripRequestId: tripId,
        relaxedCriteria: relaxCriteria,
        page: pageToLoad,
        pageSize: pageSize,
        bypassFilters: overrideFilter,
        // Include force refresh flag to trigger new search vs retrieval
        forceRefresh: forceRefresh
      };

      console.log('[TripOffers] Calling flight-search with:', requestBody);

      const { data: invokeResponse, error: invokeError } = await supabase.functions.invoke<{
        offers: Offer[];
        pagination: { totalFilteredOffers: number; currentPage: number; pageSize: number; hasMore: boolean };
        mode: string;
      }>("flight-search", {
        body: requestBody,
      });

      if (invokeError) throw invokeError;

      const newOffers = invokeResponse?.offers || [];
      const paginationData = invokeResponse?.pagination;
      const responseMode = invokeResponse?.mode;

      console.log(`[TripOffers] Response mode: ${responseMode}, offers: ${newOffers.length}, pagination:`, paginationData);

      // Update usedRelaxedCriteria state based on the actual criteria used for this load
      if (pageToLoad === 0) {
        setUsedRelaxedCriteria(relaxCriteria);
      }

      if (pageToLoad === 0) {
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
        if (forceRefresh) {
          toast({
            title: "Refreshing flight search",
            description: "Searching for new flight offers from airlines.",
          });
        }
      }
      
      if (newOffers.length === 0 && pageToLoad === 0) {
        const noOffersMessage = forceRefresh 
          ? "No new flight offers found. Try adjusting your search criteria."
          : "No stored flight offers found. Click 'Refresh Offers' to search for new flights.";
        
        toast({
          title: "No flight offers found",
          description: noOffersMessage,
          variant: "destructive",
        });
        setOffers([]);
      } else if (pageToLoad === 0) {
        setOffers(newOffers);
      } else {
        setOffers(prevOffers => [...prevOffers, ...newOffers]);
      }

      if (paginationData) {
        setHasMore(paginationData.hasMore || (paginationData.currentPage + 1) * paginationData.pageSize < paginationData.totalFilteredOffers);
      } else {
        setHasMore(newOffers.length === pageSize);
      }

    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err.message || "Something went wrong loading offers");
      toast({ 
        title: "Error Loading Flight Offers", 
        description: err.message || "An unexpected error occurred while trying to load flight offers. Please try again.", 
        variant: "destructive" 
      });
      setHasMore(false);
    } finally {
      if (pageToLoad === 0) setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  };
  
  // Main useEffect for loading offers when tripId or primary filters change
  useEffect(() => {
    if (tripId) {
      setCurrentPage(0); 
      setOffers([]); 
      setHasMore(true); 
      setTripDetails(null);
      // Load stored offers first (not force refresh)
      loadOffers(0, ignoreFilter, usedRelaxedCriteria, false);
    }
  }, [tripId, ignoreFilter, usedRelaxedCriteria]); 

  const refreshOffers = async () => {
    if (!tripId) return;
    setIsRefreshing(true); 
    setCurrentPage(0);
    setOffers([]);
    setHasMore(true);
    setTripDetails(null);
    try {
      // Force refresh = true to trigger new Amadeus search
      await loadOffers(0, ignoreFilter, usedRelaxedCriteria, true); 
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const handleOverrideSearch = () => {
    setIgnoreFilter(true); 
    setUsedRelaxedCriteria(false);
  };
  
  const handleRelaxCriteria = async () => {
    if (!tripId) return;
    setIgnoreFilter(false);
    setUsedRelaxedCriteria(true);
  };

  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasMore) {
      setIsFetchingNextPage(true);
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadOffers(nextPage, ignoreFilter, usedRelaxedCriteria, false);
    }
  };

  if (hasError && offers.length === 0) {
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
                ? "Loading offers…"
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

      {isLoading && offers.length === 0 ? (
        <TripOffersLoading />
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
                  <p>Loading more offers...</p>
                </div>
              )}
            </>
          ) : (
            <Card className="p-6 text-center">
              <p className="mb-4">No offers found that match your criteria.</p>
              <p className="text-sm text-gray-500">
                {usedRelaxedCriteria 
                  ? "We tried with relaxed criteria but still couldn't find any offers. Try clicking 'Refresh Offers' to search for new flights."
                  : ignoreFilter 
                    ? "Try clicking 'Refresh Offers' to search for new flights, or adjust your trip criteria."
                    : "Try one of the search options above or click 'Refresh Offers' to search for new flights."}
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
                <Button 
                  onClick={refreshOffers}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? "Searching..." : "Refresh Offers"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
