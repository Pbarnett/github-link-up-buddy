import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Calendar, Clock } from "lucide-react";

interface Offer {
  id: string;
  price: number;
  airline: string;
  flight_number: string;
  departure_date: string;
  departure_time: string;
  return_date: string;
  return_time: string;
  duration: string;
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

        // More detailed mock data - in a real app, we would fetch this from an API
        const mockOffers: Offer[] = [
          { 
            id: 'offer-1', 
            price: 850, 
            airline: 'Delta Airlines',
            flight_number: 'DL1234',
            departure_date: '2025-05-20',
            departure_time: '08:30',
            return_date: '2025-05-27',
            return_time: '14:45',
            duration: '2h 15m'
          },
          { 
            id: 'offer-2', 
            price: 920, 
            airline: 'United Airways',
            flight_number: 'UA5678',
            departure_date: '2025-05-21',
            departure_time: '10:15',
            return_date: '2025-05-28',
            return_time: '16:30',
            duration: '2h 45m'
          },
          { 
            id: 'offer-3', 
            price: 780, 
            airline: 'American Airlines',
            flight_number: 'AA2468',
            departure_date: '2025-05-20',
            departure_time: '13:45',
            return_date: '2025-05-27',
            return_time: '19:20',
            duration: '3h 05m'
          },
          { 
            id: 'offer-4', 
            price: 845, 
            airline: 'JetBlue',
            flight_number: 'JB7531',
            departure_date: '2025-05-22',
            departure_time: '06:20',
            return_date: '2025-05-29',
            return_time: '11:50',
            duration: '2h 30m'
          },
          { 
            id: 'offer-5', 
            price: 795, 
            airline: 'Southwest',
            flight_number: 'SW9753',
            departure_date: '2025-05-23',
            departure_time: '11:30',
            return_date: '2025-05-30',
            return_time: '15:45',
            duration: '1h 55m'
          },
          { 
            id: 'offer-6', 
            price: 1050, 
            airline: 'Alaska Airlines',
            flight_number: 'AS4682',
            departure_date: '2025-05-21',
            departure_time: '15:40',
            return_date: '2025-05-28',
            return_time: '20:15',
            duration: '3h 25m'
          },
          { 
            id: 'offer-7', 
            price: 925, 
            airline: 'British Airways',
            flight_number: 'BA8642',
            departure_date: '2025-05-22',
            departure_time: '09:50',
            return_date: '2025-05-29',
            return_time: '14:30',
            duration: '7h 10m'
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
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 flex-1">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-semibold">{offer.airline}</h3>
                    <Badge variant="outline" className="ml-2">{offer.flight_number}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Departure Info */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Departure</h4>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{new Date(offer.departure_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{offer.departure_time}</span>
                      </div>
                    </div>
                    
                    {/* Return Info */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-500">Return</h4>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{new Date(offer.return_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{offer.return_time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <PlaneTakeoff className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">Flight duration: {offer.duration}</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:items-end">
                  <p className="text-3xl font-bold mb-2">${offer.price}</p>
                  <p className="text-sm text-gray-500 mb-4">Round trip per person</p>
                  <Button className="w-full md:w-auto">
                    Select This Flight
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripOffers;
