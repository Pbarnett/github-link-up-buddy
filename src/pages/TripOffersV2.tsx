import React from 'react';
import { useFlightOffers } from '@/flightSearchV2/useFlightOffers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Placeholder for a component to show when the feature flag is disabled
const FlagDisabledPlaceholder: React.FC = () => (
  <Alert variant="destructive">
    <Terminal className="h-4 w-4" />
    <AlertTitle>Feature Disabled</AlertTitle>
    <AlertDescription>
      The Flight Search V2 feature is currently disabled. Please contact support if you believe this is an error.
    </AlertDescription>
  </Alert>
);

// Placeholder for Trip ID - in a real app, this would come from props, context, or URL params
const MOCK_TRIP_REQUEST_ID = 'default-trip-id'; // TODO: Replace with actual ID source

const TripOffersV2: React.FC = () => {
  // In a real scenario, tripRequestId would likely come from useParams() or similar
  const { offers, isLoading, error, isFeatureEnabled, refetch } = useFlightOffers(MOCK_TRIP_REQUEST_ID);

  if (!isFeatureEnabled) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <FlagDisabledPlaceholder />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Flight Offers V2</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Loading flight offers...</p>}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Offers</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred.'}
                <button onClick={refetch} className="ml-2 p-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm">Retry</button>
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && offers.length === 0 && (
            <p>No flight offers found for this trip request.</p>
          )}
          {!isLoading && !error && offers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.id}</TableCell>
                    <TableCell>${offer.priceTotal.toFixed(2)}</TableCell>
                    <TableCell>{offer.originIata}</TableCell>
                    <TableCell>{offer.destinationIata}</TableCell>
                    <TableCell>{new Date(offer.departDt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && <button onClick={refetch} className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-600">Refresh Offers</button>}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOffersV2;
