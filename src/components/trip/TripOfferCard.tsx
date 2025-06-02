
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaneTakeoff, ExternalLink } from "lucide-react";
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
  // Enhanced fields for better display
  carrier_code?: string;
  origin_airport?: string;
  destination_airport?: string;
}

const TripOfferCard = ({ offer }: { offer: OfferProps }) => {
  const navigate = useNavigate();

  // 1. Determine the IATA carrier code
  const rawFlightNum = offer.flight_number || "";
  const extractedCarrier = rawFlightNum.match(/^([A-Z]{1,3})/)?.[1] || "";
  const carrierCode = offer.carrier_code || extractedCarrier.toUpperCase() || offer.airline;

  // 2. Determine friendly airline name
  const friendlyAirline = 
    (carrierCode && airlineNames[carrierCode]) || offer.airline || carrierCode;

  // 3. Airport display with fallbacks
  const originLabel =
    (offer.origin_airport && airportNames[offer.origin_airport]) || 
    offer.origin_airport || 
    "Origin";
  const destLabel =
    (offer.destination_airport && airportNames[offer.destination_airport]) || 
    offer.destination_airport || 
    "Destination";

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
        title: "Redirecting to " + friendlyAirline,
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
      description: `You've selected ${friendlyAirline} flight ${offer.flight_number} for booking.`,
    });
  };

  return (
    <Card key={offer.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow">
      {/* Header Row: Flight Info & Dates */}
      <div className="flex justify-between items-start">
        {/* Left: Flight Number & Airline */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900">
            {friendlyAirline} flight {offer.flight_number}
          </h2>
        </div>

        {/* Right: Departure → Return */}
        <div className="text-right flex flex-col">
          <p className="text-lg font-semibold text-gray-800">
            {depLocal} → {retLocal}
          </p>
          <p className="text-sm text-gray-500">Departure ↔ Return</p>
        </div>
      </div>

      {/* Middle Row: Route & Price/Book */}
      <div className="flex justify-between items-center">
        {/* Left: Route */}
        <p className="text-base font-medium text-gray-700">
          {originLabel} → {destLabel}
          {(offer.origin_airport || offer.destination_airport) && (
            <span className="text-sm text-gray-500 ml-1">
              ({offer.origin_airport} → {offer.destination_airport})
            </span>
          )}
        </p>

        {/* Right: Price + Book Button */}
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xl font-bold text-gray-900">
            ${offer.price}
          </span>
          <Button 
            className="px-4 py-2 text-sm font-semibold" 
            onClick={handleSelect}
            variant={offer.booking_url ? "default" : "outline"}
          >
            {offer.booking_url ? (
              <>
                Book on {carrierCode || friendlyAirline}
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Select This Flight"
            )}
          </Button>
        </div>
      </div>

      {/* Footer Row: Duration */}
      <div className="flex items-center text-gray-500 text-sm">
        <PlaneTakeoff className="w-5 h-5 mr-1 text-gray-400" />
        <span>Flight duration: {humanDuration}</span>
      </div>
    </Card>
  );
};

export default TripOfferCard;
