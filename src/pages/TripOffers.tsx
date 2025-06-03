import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTripOffers, TripDetails } from "@/hooks/useTripOffers";
import TripOfferDetailsCard from "@/components/trip/TripOfferDetailsCard";
import TripOfferList from "@/components/trip/TripOfferList";
import TripOfferControls from "@/components/trip/TripOfferControls";
import TripErrorCard from "@/components/trip/TripErrorCard";
// Removed unused imports: supabase, Offer, Card components (now in sub-components), Button, toast, formatDate, TripOfferCard, TripOffersLoading, Link (now in TripOfferControls)
// Removed useMemo, useEffect, useState from react imports as they are now in the hook

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

  if (hasError && !isLoading && offers.length === 0) { // Only show full page error if truly critical and no offers to show
    return (
      <TripErrorCard
        message={errorMessage}
        onOverrideSearch={handleOverrideSearch}
        showOverrideButton={!ignoreFilter && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
        onRelaxCriteria={handleRelaxCriteria}
        showRelaxButton={!usedRelaxedCriteria && (errorMessage.toLowerCase().includes("no offers") || offers.length === 0)}
      />
    );
  }

  return (
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
        hasError={hasError || (!isLoading && offers.length === 0)} // Controls should appear if error OR no offers
      />

      {/*
        The main error display is handled by TripErrorCard above.
        TripOfferList will show a "no offers" message if offers array is empty.
        If there's an error but some offers were previously loaded, we might still want to show them.
        The hasError prop for TripOfferControls ensures buttons are shown.
        The main TripErrorCard is for when fetching completely fails and no offers can be displayed.
      */}
      <TripOfferList
        offers={offers}
        isLoading={isLoading}
        usedRelaxedCriteria={usedRelaxedCriteria}
        ignoreFilter={ignoreFilter}
      />
    </div>
  );
}
