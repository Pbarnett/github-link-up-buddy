
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTripOffers, TripDetails } from "@/hooks/useTripOffers";
import { ConstraintProvider } from "@/hooks/useConstraintState";
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

  const tripBudget = tripDetails?.budget ?? 1000;

  if (hasError && !isLoading && offers.length === 0) {
    return (
      <ConstraintProvider initialBudget={tripBudget}>
        <TripErrorCard
          message={errorMessage}
          onOverrideSearch={handleOverrideSearch}
          showOverrideButton={!ignoreFilter && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
          onRelaxCriteria={handleRelaxCriteria}
          showRelaxButton={!usedRelaxedCriteria && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
        />
      </ConstraintProvider>
    );
  }

  return (
    <ConstraintProvider initialBudget={tripBudget}>
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

        <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-30' : 'opacity-100'}`}>
          <TripOfferList
            offers={offers}
            isLoading={isLoading}
            usedRelaxedCriteria={usedRelaxedCriteria}
            ignoreFilter={ignoreFilter}
          />
        </div>
      </div>
    </ConstraintProvider>
  );
}
