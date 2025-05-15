
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Offer {
  id: string;
  price: number;
  airline: string;
  departure_date: string;
}

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

    // In a real application, we would fetch real offers for the trip
    // For now, we'll simulate a delay and use mock data
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - in a real app, we would fetch this from an API
        const mockOffers: Offer[] = [
          { 
            id: 'offer-1', 
            price: 850, 
            airline: 'Mock Airlines', 
            departure_date: new Date().toISOString() 
          },
          { 
            id: 'offer-2', 
            price: 920, 
            airline: 'Test Airways', 
            departure_date: new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            ).toISOString()
          },
          { 
            id: 'offer-3', 
            price: 780, 
            airline: 'Budget Flights', 
            departure_date: new Date(
              new Date().getTime() + 48 * 60 * 60 * 1000
            ).toISOString()
          }
        ];
        
        setOffers(mockOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOffers();
    }
  }, [location]);

  if (!tripId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>No trip ID provided</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please submit a trip request to view offers.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Trip Offers</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading available offers for your trip..."
              : `${offers.length} offers found for trip ${tripId}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <h3 className="text-lg font-semibold">{offer.airline}</h3>
                      <p className="text-sm text-gray-500">
                        Departure: {new Date(offer.departure_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-6 flex flex-col justify-center items-end">
                      <p className="text-2xl font-bold">${offer.price}</p>
                      <button className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                        Select
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOffers;
