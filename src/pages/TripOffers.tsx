import React, { useEffect, useState, useMemo } from "react";
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

// Simple in-memory cache for search results (optional)
const searchCache = new Map<
  string,
  { offers: Offer[]; timestamp: number; tripDetails: TripDetails }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

  // ─── Pagination state ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // ─── loadOffers with server-side pagination ────────
  const loadOffers = async (
    pageToLoad = 0,
    overrideFilter = false,
    relaxCriteria = false
  ) => {
    // 1) loading flags
    if (pageToLoad === 0) setIsLoading(true);
    else setIsFetchingNextPage(true);
    setHasError(false);

    const pageSize = 20;
    try {
      if (!tripId) throw new Error("No trip ID provided");

      // 2) ensure tripDetails exist
      if (!tripDetails) {
        const { data, error } = await supabase
          .from("trip_requests")
          .select("min_duration,max_duration,budget")
          .eq("id", tripId)
          .single();
        if (error || !data) throw error || new Error("Missing trip details");
        setTripDetails(data);
      }

      // 3) invoke the edge function
      const { data: invokeData, error: invokeError } =
        await supabase.functions.invoke<{
          offers: Offer[];
          pagination: {
            totalFilteredOffers: number;
            pageSize: number;
            currentPage: number;
          };
        }>("flight-search", {
          body: {
            tripRequestId: tripId,
            relaxedCriteria,
            page: pageToLoad,
            pageSize,
            minDuration: overrideFilter
              ? undefined
              : tripDetails!.min_duration,
            maxDuration: overrideFilter
              ? undefined
              : tripDetails!.max_duration,
            maxPrice: overrideFilter ? undefined : tripDetails!.budget,
          },
        });
      if (invokeError) throw invokeError;

      // 4) replace or append results
      const newOffers = invokeData!.offers || [];
      const { pagination } = invokeData!;
      if (pageToLoad === 0) setOffers(newOffers);
      else setOffers((prev) => [...prev, ...newOffers]);

      // 5) set hasMore flag
      setHasMore(
        (pagination.currentPage + 1) * pagination.pageSize <
          pagination.totalFilteredOffers
      );
    } catch (err: any) {
      console.error("Error loading offers:", err);
      setHasError(true);
      setErrorMessage(err.message || "Failed to load offers");
      toast({
        title: "Error loading offers",
        description: err.message,
        variant: "destructive",
      });
      setHasMore(false);
    } finally {
      if (pageToLoad === 0) setIsLoading(false);
      else setIsFetchingNextPage(false);
    }
  };

  // ─── Load More handler ─────────────────────────
  const handleLoadMore = () => {
    if (!isFetchingNextPage && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadOffers(nextPage, ignoreFilter, usedRelaxedCriteria);
    }
  };

  // ─── Refresh & filter toggles ───────────────────
  const refreshOffers = async () => {
    if (!tripId) return;
    setIsRefreshing(true);
    try {
      await loadOffers(0, ignoreFilter, usedRelaxedCriteria);
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
    setIsRefreshing(true);
    try {
      await loadOffers(0, false, true);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ─── Initial load & re-load on filter change ────
  useEffect(() => {
    if (tripId) {
      setCurrentPage(0);
      setOffers([]);
      setHasMore(true);
      setTripDetails(null);
      loadOffers(0, ignoreFilter, usedRelaxedCriteria);
    }
  }, [tripId, ignoreFilter, usedRelaxedCriteria]);

  // ─── Error state (when no offers at all) ───────
  if (hasError && offers.length === 0) {
    return (
      <TripErrorCard
        message={errorMessage}
        onOverrideSearch={handleOverrideSearch}
        showOverrideButton={
          !ignoreFilter && errorMessage.toLowerCase().includes("no offers")
        }
        onRelaxCriteria={handleRelaxCriteria}
        showRelaxButton={
          !usedRelaxedCriteria && errorMessage.toLowerCase().includes("no offers")
        }
      />
    );
  }

  // ─── Main UI ────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle>Your trip request details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {formatDate(
                  new Date(tripDetails.earliest_departure),
                  "MMM d, yyyy"
                )}{" "}
                –{" "}
                {formatDate(
                  new Date(tripDetails.latest_departure),
                  "MMM d, yyyy"
                )}
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
              <p>
                ${tripDetails.budget}
                {usedRelaxedCriteria && " (up to +20% with relaxed criteria)"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header with filter & refresh buttons */}
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

      {/* Offer list, loader, and “Load More” */}
      {isLoading && offers.length === 0 ? (
        <TripOffersLoading />
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.length > 0 ? (
            <>
              {offers.map((offer) => (
                <TripOfferCard key={offer.id} offer={offer} />
              ))}

              {hasMore && (
                <div className="text-center mt-8">
                  {isFetchingNextPage ? (
                    <p>Loading more offers…</p>
                  ) : (
                    <Button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                    >
                      Load More Offers
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <Card className="p-6 text-center">
              <p className="mb-4">
                No offers found that match your criteria.
              </p>
              <p className="text-sm text-gray-500">
                {usedRelaxedCriteria
                  ? "We tried with relaxed criteria but still couldn’t find any offers. Try adjusting your dates or budget."
                  : ignoreFilter
                  ? "Try adjusting your dates or budget, or click Refresh Offers."
                  : "Try one of the search options above or adjust your trip criteria."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                {!usedRelaxedCriteria && (
                  <Button onClick={handleRelaxCriteria} variant="secondary">
                    Try Relaxed Criteria
                  </Button>
                )}
                {!ignoreFilter && (
                  <Button onClick={handleOverrideSearch}>
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
