
import React, { useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useTripOffers } from "@/hooks/useTripOffersLegacy";
import { TripDetails } from "@/hooks/useTripOffers";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { TooltipProvider } from "@/components/ui/tooltip";
import TripOfferDetailsCard from "@/components/trip/TripOfferDetailsCard";
import TripOfferList from "@/components/trip/TripOfferList";
import TripOfferControls from "@/components/trip/TripOfferControls";
import TripErrorCard from "@/components/trip/TripErrorCard";
import TripOffersWithPools from "./TripOffersWithPools";
import DebugInfo from "@/components/debug/DebugInfo";

// Legacy component wrapper for the existing functionality
const LegacyTripOffers = ({ tripId, initialTripDetails }: { tripId: string; initialTripDetails?: TripDetails }) => {
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

  if (hasError && !isLoading && offers.length === 0) {
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
        hasError={hasError || (!isLoading && offers.length === 0)}
      />

      <TripOfferList
        offers={offers}
        isLoading={isLoading}
        usedRelaxedCriteria={usedRelaxedCriteria}
        ignoreFilter={ignoreFilter}
      />
    </div>
  );
};

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const navigate = useNavigate();
  const initialTripDetails = location.state?.tripDetails as TripDetails | undefined;
  
  // Feature flag for V2 UI
  const flightSearchV2Enabled = useFeatureFlag('flight_search_v2_enabled', false);
  // Feature flag to determine which UI to show for legacy path
  const enablePools = useFeatureFlag('use_new_pools_ui', false);
  
  // Debug logging to track which implementation is being used
  console.log('[🔍 TRIP-OFFERS-DEBUG] Feature flag enablePools:', enablePools);
  console.log('[🔍 TRIP-OFFERS-DEBUG] Will use:', enablePools ? 'TripOffersWithPools' : 'LegacyTripOffers');

  useEffect(() => {
    if (flightSearchV2Enabled && tripId) {
      // Preserve existing search params if any, though V2 might not use them
      const currentSearchParams = new URLSearchParams(searchParams);
      navigate(`/trips/${tripId}/v2?${currentSearchParams.toString()}`, { replace: true, state: location.state });
    }
  }, [flightSearchV2Enabled, tripId, navigate, searchParams, location.state]);

  // If flightSearchV2Enabled is true, the useEffect will trigger navigation.
  // We should render null or a loading indicator while waiting for navigation,
  // or if tripId is not yet available.
  if (flightSearchV2Enabled || !tripId) {
    // If flightSearchV2Enabled is true, navigation will occur. Show minimal UI.
    // If !tripId, show error or loading.
    if (!tripId && !flightSearchV2Enabled) { // Only show error if V2 is not going to take over
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">Trip ID not found</h2>
                <p className="text-gray-600">Please provide a valid trip ID.</p>
                </div>
            </div>
        );
    }
    // Render minimal content or null if V2 is enabled and navigation is pending, or if tripId is missing initially.
    // This prevents rendering legacy UI flashes before navigation.
    return null;
  }

  // Render legacy UI only if flightSearchV2Enabled is false and tripId is present.
  return (
    <TooltipProvider>
      <DebugInfo tripId={tripId} />
      {enablePools ? (
        <TripOffersWithPools />
      ) : (
        <LegacyTripOffers tripId={tripId} initialTripDetails={initialTripDetails} />
      )}
    </TooltipProvider>
  );
}
