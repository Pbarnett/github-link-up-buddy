import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TripOfferCard from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";
import { fetchTripOffers, Offer } from "@/services/tripOffersService";
import { toast } from "@/components/ui/use-toast";
import { format as formatDate } from "date-fns";

interface TripDetails {
  earliestDeparture: string;
  latestDeparture: string;
  duration: number;
  budget: number;
}

const TripOffers = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripId, setTripId] = useState<string | null>(null);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);

  useEffect(() => {
    // Get trip ID from URL query parameter
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    setTripId(id);

    // Get trip details from location state if available
    if (location.state?.tripDetails) {
      setTripDetails(location.state.tripDetails);
    }

    // Fetch offers for the trip
    const loadOffers = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const offerData = await fetchTripOffers();
        setOffers(offerData);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setHasError(true);
        toast({
          title: "Error loading offers",
          description: "We couldn't load flight offers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadOffers();
    }
  }, [location]);

  if (!tripId) {
    return <TripErrorCard />;
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Trip Offers</CardTitle>
            <CardDescription>
              There was an error loading the offers. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary Card */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Trip Summary</CardTitle>
            <CardDescription>Your trip request details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {tripDetails.earliestDeparture ? formatDate(new Date(tripDetails.earliestDeparture), 'MMM d, yyyy') : 'Not specified'} - {tripDetails.latestDeparture ? formatDate(new Date(tripDetails.latestDeparture), 'MMM d, yyyy') : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>{tripDetails.duration} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>${tripDetails.budget}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Header Card */}
      <Card className="w-full max-w-5xl mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Trip Offers</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading available offers for your trip..."
              : `${offers.length} offers found for trip ${tripId}`}
          </CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <TripOffersLoading />
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.map((offer) => (
            <TripOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripOffers;
