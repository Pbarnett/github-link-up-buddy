
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Calendar, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export interface OfferProps {
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

// Renamed original component
const TripOfferCardComponent = ({ offer }: { offer: OfferProps }) => {
  const navigate = useNavigate();

  const handleSelect = () => {
    console.log('Selected offer', offer.id);
    
    // Create query parameters from the offer
    const params = new URLSearchParams();
    params.set('id', offer.id);
    params.set('airline', offer.airline);
    params.set('flight_number', offer.flight_number);
    params.set('price', offer.price.toString());
    params.set('departure_date', offer.departure_date);
    params.set('departure_time', offer.departure_time);
    params.set('return_date', offer.return_date);
    params.set('return_time', offer.return_time);
    params.set('duration', offer.duration);
    
    // Navigate to confirm page with offer details in query string
    navigate(`/trip/confirm?${params.toString()}`);
    
    toast({
      title: "Flight Selected",
      description: `You've selected ${offer.airline} flight ${offer.flight_number}`,
    });
  };

  return (
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
          <Button className="w-full md:w-auto" onClick={handleSelect}>
            Select This Flight
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Memoize the component
const TripOfferCard = React.memo(TripOfferCardComponent);

export default TripOfferCard;
