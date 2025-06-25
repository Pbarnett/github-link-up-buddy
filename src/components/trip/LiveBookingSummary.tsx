import { useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FormValues } from '@/types/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

interface LiveBookingSummaryProps {
  control: Control<FormValues>;
  isVisible: boolean;
}

const LiveBookingSummary = ({ control, isVisible }: LiveBookingSummaryProps) => {
  const { data: paymentMethods = [] } = usePaymentMethods();
  
  // Watch all relevant fields
  const watchedData = useWatch({
    control,
    name: [
      'nyc_airports',
      'other_departure_airport', 
      'destination_airport',
      'destination_other',
      'earliestDeparture',
      'latestDeparture',
      'min_duration',
      'max_duration',
      'max_price',
      'preferred_payment_method_id'
    ]
  });

  const [
    nycAirports,
    otherDepartureAirport,
    destinationAirport,
    destinationOther,
    earliestDeparture,
    latestDeparture,
    minDuration,
    maxDuration,
    maxPrice,
    preferredPaymentMethodId
  ] = watchedData;

  const summaryText = useMemo(() => {
    // Build departure airports string
    const departureAirports = [];
    if (nycAirports && nycAirports.length > 0) {
      if (nycAirports.length === 3) {
        departureAirports.push('NYC (JFK/LGA/EWR)');
      } else {
        departureAirports.push(`NYC (${nycAirports.join('/')})`);
      }
    }
    if (otherDepartureAirport) {
      departureAirports.push(otherDepartureAirport);
    }
    
    const departure = departureAirports.length > 0 ? departureAirports.join(' or ') : '—';
    const destination = destinationAirport || destinationOther || '—';
    
    // Format duration
    let duration = '—';
    if (minDuration && maxDuration) {
      if (minDuration === maxDuration) {
        duration = `${minDuration} day${minDuration === 1 ? '' : 's'}`;
      } else {
        duration = `${minDuration}–${maxDuration} days`;
      }
    }
    
    // Format date range
    let dateRange = '—';
    if (earliestDeparture && latestDeparture) {
      const start = format(earliestDeparture, 'dd MMM');
      const end = format(latestDeparture, 'dd MMM yyyy');
      dateRange = `${start} – ${end}`;
    }

    // Find selected payment method
    let paymentInfo = '—';
    if (preferredPaymentMethodId) {
      const method = paymentMethods.find(m => m.id === preferredPaymentMethodId);
      if (method) {
        paymentInfo = `${method.brand} ••${method.last4}`;
      }
    }

    return {
      departure,
      destination,
      duration,
      dateRange,
      maxPrice: maxPrice || '—',
      paymentInfo
    };
  }, [
    nycAirports,
    otherDepartureAirport,
    destinationAirport,
    destinationOther,
    earliestDeparture,
    latestDeparture,
    minDuration,
    maxDuration,
    maxPrice,
    preferredPaymentMethodId,
    paymentMethods
  ]);

  if (!isVisible) return null;

  return (
    <Card className="sticky top-6 bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-blue-900 flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Auto-Booking
          </Badge>
          What we'll book
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium text-blue-900">
              {summaryText.departure} → {summaryText.destination}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-blue-800">
              Any {summaryText.duration} trip
            </div>
            <div className="text-blue-600 text-xs">
              between {summaryText.dateRange}
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <DollarSign className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800">
            Price ≤ <span className="font-semibold">${summaryText.maxPrice}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <CreditCard className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800">
            Card: {summaryText.paymentInfo}
          </div>
        </div>
        
        <div className="pt-2 border-t border-blue-200">
          <p className="text-xs text-blue-700">
            We'll only buy if the fare meets all your criteria.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBookingSummary;
