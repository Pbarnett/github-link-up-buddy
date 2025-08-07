

// Lookups

// Utils

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
  const rawFlightNum = offer.flight_number || '';
  const extractedCarrier = rawFlightNum.match(/^([A-Z]{1,3})/)?.[1] || '';
  const carrierCode =
    offer.carrier_code || extractedCarrier.toUpperCase() || offer.airline;

  // 2. Determine friendly airline name
  const friendlyAirline =
    (carrierCode && airlineNames[carrierCode]) || offer.airline || carrierCode;

  // 3. Airport display with fallbacks
  const originLabel =
    (offer.origin_airport && airportNames[offer.origin_airport]) ||
    offer.origin_airport ||
    'Origin';
  const destLabel =
    (offer.destination_airport && airportNames[offer.destination_airport]) ||
    offer.destination_airport ||
    'Destination';

  // 4. Combine date + time into ISO strings
  const departureISO = combineDateTime(
    offer.departure_date,
    offer.departure_time
  );
  const returnISO = combineDateTime(offer.return_date, offer.return_time);

  // 5. Convert to local, 12-hour format
  const depLocal = formatLocalDateTime(departureISO);
  const retLocal = formatLocalDateTime(returnISO);

  // 6. Parse duration if ISO format, otherwise show as-is
  const humanDuration = offer.duration.startsWith('PT')
    ? parseDuration(offer.duration)
    : offer.duration;

  // Calculate trip duration in days
  const departureDate = new Date(offer.departure_date);
  const returnDate = new Date(offer.return_date);
  const tripDays = Math.ceil(
    (returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSelect = () => {
    if (offer.booking_url) {
      console.log(`[ANALYTICS] External booking clicked:`, {
        offerId: offer.id,
        airline: offer.airline,
        price: total,
        bookingUrl: offer.booking_url,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: 'Redirecting to ' + friendlyAirline,
        description: 'Opening airline website to complete your booking...',
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
      title: 'Flight Selected',
      description: `You've selected ${friendlyAirline} flight ${offer.flight_number} for booking.`,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
      <div className="flex items-center justify-between">
        {/* LEFT: Flight Details */}
        <div className="flex-1 space-y-2">
          {/* Route and Airline */}
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {originLabel} → {destLabel}
            </h3>
            <span className="text-sm text-gray-500">
              {friendlyAirline} {offer.flight_number}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              {tripDays} day{tripDays === 1 ? '' : 's'}
            </span>
          </div>

          {/* Times and Duration */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-500">Depart:</span>
              <span className="ml-1 font-medium text-gray-900">{depLocal}</span>
            </div>
            <div>
              <span className="text-gray-500">Return:</span>
              <span className="ml-1 font-medium text-gray-900">{retLocal}</span>
            </div>
            <div>
              <span className="text-gray-500">Flight:</span>
              <span className="ml-1 font-medium text-gray-900">
                {humanDuration}
              </span>
            </div>
            {offer.carryOnIncluded && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                Carry-on included
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Price and Book Button */}
        <div className="flex items-center gap-4 ml-6">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(total)}
            </div>
          </div>
          <button
            onClick={handleSelect}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`Book flight with ${friendlyAirline}`}
          >
            Book Flight
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripOfferCard;
