

import * as React from 'react';
type FC<T = {}> = React.FC<T>;

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { format as formatDate } from "date-fns";
import { TripDetails } from "@/hooks/useTripOffers"; // Import TripDetails

// Remove local TripDetails definition

interface TripOfferDetailsCardProps {
  tripDetails: TripDetails | null; // Use imported TripDetails
  ignoreFilter: boolean;
  usedRelaxedCriteria: boolean;
}

const TripOfferDetailsCard: FC<TripOfferDetailsCardProps> = ({
  tripDetails,
  ignoreFilter,
  usedRelaxedCriteria,
}) => {
  if (!tripDetails) {
    return null;
  }

  // Ensure tripDetails has the necessary fields before formatting dates
  // This check is more for robustness if TripDetails type allows undefined for these
  if (!tripDetails.earliest_departure || !tripDetails.latest_departure) {
    return (
        <Card className="w-full max-w-5xl mb-6 bg-white rounded-lg pt-6 pb-4 px-6 shadow-sm border border-gray-200">
            <CardHeader><CardTitle>Trip Details</CardTitle></CardHeader>
            <CardContent><p>Departure dates are missing.</p></CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-5xl mb-6 bg-white rounded-lg pt-6 pb-4 px-6 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
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
        {tripDetails.destination_airport && ( // Conditionally render if destination_airport exists
          <div>
            <p className="text-sm font-medium text-gray-500">Destination</p>
            <p>{tripDetails.destination_airport}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripOfferDetailsCard;
