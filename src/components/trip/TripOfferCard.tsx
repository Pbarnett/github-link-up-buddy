
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, Calendar, Clock, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Lookups
import { airportNames } from "@/data/airportLookup";
import { airlineNames } from "@/data/airlineLookup";

// Utils
import { combineDateTime } from "@/utils/combineDateTime";
import { formatLocalDateTime } from "@/utils/formatDateTime";
import { parseDuration } from "@/utils/parseDuration";

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
  booking_url?: string;
  // New optional fields for enhanced display
  carrier_code?: string;
  origin_airport?: string;
  destination_airport?: string;
}

const TripOfferCard = ({ offer }: { offer: OfferProps }) => {
  const navigate = useNavigate();

  // 1. Determine the IATA carrier code
  const rawFlightNum = offer.flight_number || "";
  const extractedCarrier = rawFlightNum.match(/^([A-Z]{1,3})/)?.[1] || "";
  const carrierCode = offer.carrier_code || extractedCarrier.toUpperCase();

  // 2. Determine friendly airline name
  const friendlyAirline = 
    (carrierCode && airlineNames[carrierCode]) || offer.airline;

  // 3. Airport display with fallbacks
  const originLabel =
    (offer.origin_airport && airportNames[offer.origin_airport]) || offer.origin_airport || "";
  const destLabel =
    (offer.destination_airport && airportNames[offer.destination_airport]) || offer.destination_airport || "";

  // 4. Combine date + time into ISO strings
  const departureISO = combineDateTime(offer.departure_date, offer.departure_time);
  const returnISO = combineDateTime(offer.return_date, offer.return_time);

  // 5. Convert to local, 12-hour format
  const depLocal = formatLocalDateTime(departureISO);
  const retLocal = formatLocalDateTime(returnISO);

  // 6. Parse duration if ISO format, otherwise show as-is
  const humanDuration = offer.duration.startsWith("PT")
    ? parseDuration(offer.duration)
    : offer.duration;

  const handleSelect = () => {
    if (offer.booking_url) {
      console.log(`[ANALYTICS] External booking clicked:`, {
        offerId: offer.id,
        airline: offer.airline,
        price: offer.price,
        bookingUrl: offer.booking_url,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Redirecting to " + offer.airline,
        description: "Opening airline website to complete your booking...",
        duration: 3000,
      });

      // Redirect immediately to the airline website for external bookings
      setTimeout(() => {
        window.open(offer.booking_url, '_blank');
      }, 500);

      return;
    }

    // Internal booking flow - navigate to confirmation page
    console.log('Selected offer for internal booking:', offer.id);
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
    
    navigate(`/trip/confirm?${params.toString()}`);
    
    toast({
      title: "Flight Selected",
      description: `You've selected ${offer.airline} flight ${offer.flight_number} for booking.`,
    });
  };

  return (
    <Card key={offer.id} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 flex-1">
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-semibold">
              {friendlyAirline}
              {offer.flight_number ? ` flight ${offer.flight_number}` : ""}
            </h3>
            <Badge variant="outline" className="ml-2">{offer.flight_number}</Badge>
          </div>
          
          {/* Route display if we have airport codes */}
          {(originLabel || destLabel) && (
            <div className="text-sm text-gray-700 mb-3">
              <span className="font-medium">{originLabel || "Origin"}</span> → {" "}
              <span className="font-medium">{destLabel || "Destination"}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Departure</h4>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{depLocal}</span>
              </div>
            </div>
            
            {/* Return Info */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Return</h4>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{retLocal}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center">
            <PlaneTakeoff className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-500">Flight duration: {humanDuration}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex flex-col justify-center items-center md:items-end">
          <p className="text-3xl font-bold mb-2">${offer.price}</p>
          <p className="text-sm text-gray-500 mb-4">Round trip per person</p>
          <Button 
            className="w-full md:w-auto" 
            onClick={handleSelect}
            variant={offer.booking_url ? "default" : "outline"}
          >
            {offer.booking_url ? (
              <>
                Book on {carrierCode || offer.airline}
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Select This Flight"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripOfferCard;
