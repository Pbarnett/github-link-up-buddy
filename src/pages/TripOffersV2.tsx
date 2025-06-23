import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlightOffers } from '@/flightSearchV2/useFlightOffers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, PlaneTakeoff, PlaneLanding, ShoppingBag, CalendarDays, AlertCircle, ExternalLink } from "lucide-react";
import TripOffersV2Skeleton from '@/components/TripOffersV2Skeleton';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

// Placeholder for a component to show when the feature flag is disabled
const FlagDisabledPlaceholder: React.FC = () => (
  <Alert variant="destructive">
    <Terminal className="h-4 w-4" />
    <AlertTitle>Feature Disabled</AlertTitle>
    <AlertDescription>
      The Flight Search V2 feature is currently disabled. Please contact support if you believe this is an error.
    </AlertDescription>
  </Alert>
);

const EmptyStateCard: React.FC = () => (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="flex items-center">
        <AlertCircle className="mr-2 h-6 w-6 text-yellow-500" />
        No Offers Found Yet
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">
        We couldn't find any flight offers matching your criteria at the moment.
        Please try adjusting your search or check back later.
      </p>
    </CardContent>
  </Card>
);


const TripOffersV2: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { offers, isLoading, error, isFeatureEnabled, refetch } = useFlightOffers(tripId || 'default-trip-id');
  
  // Debug logging
  console.log('[TripOffersV2] Debug info:', {
    tripId,
    offers: offers?.length || 0,
    offersData: offers,
    isLoading,
    error: error?.message,
    isFeatureEnabled
  });

  if (!isFeatureEnabled) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <FlagDisabledPlaceholder />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <TripOffersV2Skeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error Loading Offers</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred.'}
                <button onClick={refetch} className="ml-2 mt-2 p-1 border rounded bg-gray-100 hover:bg-gray-200 text-sm">Retry</button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Flight Offers V2</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateCard />
            <button onClick={refetch} className="mt-4 p-2 border rounded bg-blue-500 text-white hover:bg-blue-600">Refresh Offers</button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return 'Invalid Date';
    }
  };

  const calculateTripDuration = (departDt: string, returnDt: string | null) => {
    if (!returnDt) return '1 day';
    try {
      const departDate = new Date(departDt);
      const returnDate = new Date(returnDt);
      const diffInMs = returnDate.getTime() - departDate.getTime();
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'}`;
    } catch (e) {
      console.error("Error calculating duration:", e);
      return 'N/A';
    }
  };

  const handleBookOffer = (offer: any) => {
    console.log('Booking offer:', offer.id, 'Booking URL:', offer.bookingUrl);
    
    // If offer has external booking URL (like Google Flights), redirect to airline website
    if (offer.bookingUrl) {
      console.log(`[ANALYTICS] External booking clicked:`, {
        offerId: offer.id,
        route: `${offer.originIata} → ${offer.destinationIata}`,
        price: offer.priceTotal,
        bookingUrl: offer.bookingUrl,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: `Redirecting to Airline Website`,
        description: "Opening airline website to complete your booking...",
        duration: 3000,
      });

      // Redirect to the airline website for external bookings (like Google Flights)
      setTimeout(() => {
        window.open(offer.bookingUrl, '_blank');
      }, 500);

      return;
    }
    
    // If no external booking URL, fall back to internal booking flow
    console.log('No external booking URL found, using internal booking flow');
    
    // Convert V2 offer format to legacy format for internal booking
    const params = new URLSearchParams();
    params.set('id', offer.id);
    params.set('airline', offer.originIata + '-' + offer.destinationIata); // Placeholder airline
    params.set('flight_number', 'V2-' + offer.id.slice(0, 6));
    params.set('price', offer.priceTotal.toString());
    params.set('departure_date', offer.departDt.split('T')[0]);
    params.set('departure_time', new Date(offer.departDt).toLocaleTimeString());
    params.set('return_date', offer.returnDt ? offer.returnDt.split('T')[0] : offer.departDt.split('T')[0]);
    params.set('return_time', offer.returnDt ? new Date(offer.returnDt).toLocaleTimeString() : new Date(offer.departDt).toLocaleTimeString());
    params.set('duration', offer.returnDt ? 
      Math.ceil((new Date(offer.returnDt).getTime() - new Date(offer.departDt).getTime()) / (1000 * 60 * 60 * 24)) + ' days' : 
      '1 day'
    );
    
    navigate(`/trip/confirm?${params.toString()}`);
    
    toast({
      title: "Flight Selected",
      description: `You've selected flight ${offer.originIata} → ${offer.destinationIata} for booking.`,
    });
  };


  // Sort offers by price (cheapest first)
  const sortedOffers = [...offers].sort((a, b) => a.priceTotal - b.priceTotal);

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Available Flight Offers</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Sorted by price (lowest to highest)</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Route</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="w-[100px]">Duration</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="w-[140px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOffers.map((offer) => (
                <TableRow key={offer.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center font-medium">
                      <PlaneTakeoff className="mr-2 h-5 w-5 text-blue-500" />
                      {offer.originIata} → {offer.destinationIata}
                      <PlaneLanding className="ml-2 h-5 w-5 text-green-500" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-700 flex items-center">
                        <CalendarDays className="mr-1 h-4 w-4 text-gray-500" /> Depart: {formatDate(offer.departDt)}
                      </span>
                      {offer.returnDt && (
                        <span className="text-sm text-gray-700 flex items-center">
                          <CalendarDays className="mr-1 h-4 w-4 text-gray-500" /> Return: {formatDate(offer.returnDt)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-medium">
                      {calculateTripDuration(offer.departDt, offer.returnDt)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {offer.cabinClass && <Badge variant="outline">{offer.cabinClass}</Badge>}
                      {offer.nonstop && <Badge variant="secondary" className="bg-green-100 text-green-700">Nonstop</Badge>}
                      {offer.bagsIncluded && (
                        <Badge variant="outline" className="flex items-center">
                          <ShoppingBag className="mr-1 h-3 w-3" /> Bags Included
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-lg text-green-600">
                    {formatCurrency(offer.priceTotal, offer.priceCurrency || 'USD')}
                  </TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => handleBookOffer(offer)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <button
              onClick={refetch}
              className="p-2 border rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out flex items-center"
            >
              <Terminal className="mr-2 h-4 w-4" />
              Refresh Offers
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOffersV2;
