
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlaneTakeoff, ExternalLink, Calendar, Info } from "lucide-react";
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
  // New pricing structure fields
  priceStructure?: {
    base: number;
    carryOnFee: number;
    total: number;
  };
  carryOnIncluded?: boolean;
  reasons?: string[];
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

const TripOfferCard = ({ offer }: { offer: OfferProps }) => {
  const navigate = useNavigate();

  // Calculate display price with fallback
  const total = offer.priceStructure?.total ?? offer.price;

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

  // Calculate trip duration in days
  const departureDate = new Date(offer.departure_date);
  const returnDate = new Date(offer.return_date);
  const tripDays = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleSelect = () => {
    if (offer.booking_url) {
      console.log(`[ANALYTICS] External booking clicked:`, {
        offerId: offer.id,
        airline: offer.airline,
        price: total,
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
    params.set('price', total.toString());
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row justify-between transition-shadow duration-200 hover:shadow-md">
      {/* LEFT SIDE: Flight Details */}
      <div className="flex-1 space-y-1">
        {/* Airline + Flight Number */}
        <h2 className="text-xl font-semibold text-gray-900">
          {friendlyAirline} flight {offer.flight_number}
        </h2>

        {/* Route - Enhanced with bold city names */}
        <p className="mt-1 text-gray-700 text-base">
          <span className="font-medium">{originLabel}</span>
          <span className="text-gray-500"> ({offer.origin_airport}) → </span>
          <span className="font-medium">{destLabel}</span>
          <span className="text-gray-500"> ({offer.destination_airport})</span>
        </p>

        {/* Dates - Consolidated into one line */}
        <div className="mt-2">
          <p className="text-gray-700 text-base font-medium flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10m-9 4h9m-9 4h9M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {depLocal} → {retLocal}
            <span className="ml-2 text-xs text-gray-500">Departure ↔ Return</span>
          </p>
        </div>

        {/* Flight Duration */}
        <p className="mt-2 text-gray-600 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Flight duration: {humanDuration}
        </p>

        {/* Carry-on Badge */}
        <div className="mt-2">
          {offer.carryOnIncluded ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Carry-on included
            </Badge>
          ) : (
            offer.priceStructure?.carryOnFee && (
              <Badge variant="outline">
                + {formatCurrency(offer.priceStructure.carryOnFee)} carry-on
              </Badge>
            )
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Days Pill, Price, & Booking - Horizontally aligned */}
      <div className="mt-4 md:mt-0 md:ml-6 flex flex-wrap items-center justify-end gap-6">
        {/* Days Pill - Enhanced with blue background */}
        <span className="inline-block bg-blue-50 text-blue-700 text-lg font-semibold rounded-full px-3 py-1.5">
          {tripDays} Days
        </span>

        {/* Price with tooltip for reasons */}
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-900 leading-none">
            {formatCurrency(total)}
          </span>
          {offer.reasons && offer.reasons.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{offer.reasons[0]}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* "Book on X" Button - Enhanced alignment */}
        <button
          onClick={handleSelect}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Book on ${friendlyAirline} (flight ${offer.flight_number})`}
        >
          Book on {carrierCode || friendlyAirline}
          <svg
            className="w-4 h-4 ml-1 -mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 3l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TripOfferCard;
