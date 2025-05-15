
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import TripOfferCard, { OfferProps } from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";
import { fetchTripOffers, Offer } from "@/services/tripOffersService";

const TripOffers = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripId, setTripId] = useState<string | null>(null);

  useEffect(() => {
    // Get trip ID from URL query parameter
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    setTripId(id);

    // Fetch offers for the trip
    const loadOffers = async () => {
      setIsLoading(true);
      try {
        const offerData = await fetchTripOffers();
        setOffers(offerData);
      } catch (error) {
        console.error("Error fetching offers:", error);
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
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
