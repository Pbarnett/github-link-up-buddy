
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Calendar, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

const TripOfferCard = ({ offer }: { offer: OfferProps }) => {
  const handleSelect = () => {
    console.log('Selected offer', offer.id);
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

export default TripOfferCard;
