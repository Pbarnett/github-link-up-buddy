
import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import PoolLayout from "@/components/trip/Pools/PoolLayout";
import TripOfferDetailsCard from "@/components/trip/TripOfferDetailsCard";
import { TripDetails } from "@/hooks/useTripOffers";

export default function TripOffersWithPools() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const initialTripDetails = location.state?.tripDetails as TripDetails | undefined;

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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <TripOfferDetailsCard
        tripDetails={initialTripDetails}
        ignoreFilter={false}
        usedRelaxedCriteria={false}
      />
      
      <div className="w-full max-w-4xl mt-6">
        <PoolLayout tripId={tripId} />
      </div>
    </div>
  );
}
