
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTripOffers } from "@/hooks/useTripOffers";
import { TripDetails } from "@/hooks/useTripOffers";
import { TooltipProvider } from "@/components/ui/tooltip";
import TripOfferDetailsCard from "@/components/trip/TripOfferDetailsCard";
import TripOfferList from "@/components/trip/TripOfferList";
import TripOfferControls from "@/components/trip/TripOfferControls";
import TripErrorCard from "@/components/trip/TripErrorCard";

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const initialTripDetails = location.state?.tripDetails as TripDetails | undefined;

  const {
    offers,
    tripDetails,
    isLoading,
    isRefreshing,
    hasError,
    errorMessage,
    ignoreFilter,
    usedRelaxedCriteria,
    refreshOffers,
    handleOverrideSearch,
    handleRelaxCriteria,
  } = useTripOffers({ tripId, initialTripDetails });

  if (!tripId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Trip ID not found</h2>
          <p className="text-gray-600">Please provide a valid trip ID.</p>
        </div>
      </div>
    );
  }

  if (hasError && !isLoading && offers.length === 0) {
    return (
      <TooltipProvider>
        <TripErrorCard
          message={errorMessage}
          onOverrideSearch={handleOverrideSearch}
          showOverrideButton={!ignoreFilter && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
          onRelaxCriteria={handleRelaxCriteria}
          showRelaxButton={!usedRelaxedCriteria && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
        />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
        <TripOfferDetailsCard
          tripDetails={tripDetails}
          ignoreFilter={ignoreFilter}
          usedRelaxedCriteria={usedRelaxedCriteria}
        />

        <TripOfferControls
          onRefreshOffers={refreshOffers}
          onRelaxCriteria={handleRelaxCriteria}
          onOverrideSearch={handleOverrideSearch}
          isRefreshing={isRefreshing}
          isLoading={isLoading}
          offers={offers}
          usedRelaxedCriteria={usedRelaxedCriteria}
          ignoreFilter={ignoreFilter}
          hasError={hasError || (!isLoading && offers.length === 0)}
        />

        <TripOfferList
          offers={offers}
          isLoading={isLoading}
          usedRelaxedCriteria={usedRelaxedCriteria}
          ignoreFilter={ignoreFilter}
        />
      </div>
    </TooltipProvider>
  );
}
