/**
 * @file Enhanced booking card specifically for Duffel flights
 * Battle-tested component that integrates with validated backend
 */

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, PlaneTakeoff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { createDuffelBooking, DuffelTraveler, DuffelBookingResponse } from "@/services/api/duffelBookingApi";
import { airportNames } from "@/data/airportLookup";
import { airlineNames } from "@/data/airlineLookup";
import OfferExpirationTimer from "./OfferExpirationTimer";

export interface DuffelFlightOffer {
  id: string;
  price: number;
  currency: string;
  airline_code: string;
  flight_number: string;
  origin_airport: string;
  destination_airport: string;
  departure_date: string;
  departure_time: string;
  return_date?: string;
  return_time?: string;
  duration: string;
  expires_at?: string;
  cabin_class?: string;
}

interface DuffelBookingCardProps {
  offer: DuffelFlightOffer;
  traveler: DuffelTraveler;
  onBookingComplete?: (result: DuffelBookingResponse) => void;
  onBookingError?: (error: string) => void;
}

export const DuffelBookingCard: React.FC<DuffelBookingCardProps> = ({
  offer,
  traveler,
  onBookingComplete,
  onBookingError
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<DuffelBookingResponse | null>(null);
  const [, setIsExpiredState] = useState(false);

  // Format currency
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  // Get airline name
  const getAirlineName = () => {
    return airlineNames[offer.airline_code] || offer.airline_code;
  };

  // Get airport names
  const getAirportName = (code: string) => {
    return airportNames[code] || code;
  };

  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return `${date} ${time}`;
    }
  };

  // Check if offer is expired
  const isExpired = () => {
    if (!offer.expires_at) return false;
    return new Date(offer.expires_at) < new Date();
  };

  const handleBookFlight = async () => {
    if (isExpired()) {
      toast({
        title: "Offer Expired",
        description: "This flight offer has expired. Please search for new flights.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);
    
    try {
      console.log('[DUFFEL-BOOKING-CARD] Starting booking process for offer:', offer.id);
      
      const bookingRequest = {
        offerId: offer.id,
        travelers: [traveler]
      };

      const result = await createDuffelBooking(bookingRequest);
      
      setBookingResult(result);

      if (result.success && result.order) {
        console.log('[DUFFEL-BOOKING-CARD] Booking successful:', result.order);
        
        toast({
          title: "Booking Confirmed! ✈️",
          description: `Your flight is booked! Reference: ${result.order.booking_reference}`,
        });

        onBookingComplete?.(result);
      } else {
        console.error('[DUFFEL-BOOKING-CARD] Booking failed:', result.error);
        
        const errorMessage = result.error?.message || 'Booking failed. Please try again.';
        
        toast({
          title: "Booking Failed",
          description: errorMessage,
          variant: "destructive",
        });

        onBookingError?.(errorMessage);
      }
    } catch (error: unknown) {
      console.error('[DUFFEL-BOOKING-CARD] Exception during booking:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during booking.';
      
      toast({
        title: "Booking Error",
        description: errorMessage,
        variant: "destructive",
      });

      onBookingError?.(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  // If booking was successful, show confirmation
  if (bookingResult?.success && bookingResult.order) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-700">Booking Confirmed!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your flight has been successfully booked. You should receive a confirmation email shortly.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Booking Reference:</span>
              <p className="text-lg font-mono">{bookingResult.order.booking_reference}</p>
            </div>
            <div>
              <span className="font-medium">Total Amount:</span>
              <p className="text-lg">{formatPrice(parseFloat(bookingResult.order.total_amount), bookingResult.order.total_currency)}</p>
            </div>
          </div>

          {bookingResult.order.tickets && bookingResult.order.tickets.length > 0 && (
            <div>
              <span className="font-medium">Tickets:</span>
              {bookingResult.order.tickets.map((ticket, idx) => (
                <p key={idx} className="font-mono text-sm">
                  {ticket.ticket_number} - {ticket.passenger}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlaneTakeoff className="h-5 w-5" />
          Confirm Your Flight
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Flight Details */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">
              {getAirportName(offer.origin_airport)} → {getAirportName(offer.destination_airport)}
            </h3>
            <Badge variant="secondary">{getAirlineName()}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Flight:</span>
              <p className="font-medium">{offer.flight_number}</p>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-medium">{offer.duration}</p>
            </div>
            <div>
              <span className="text-gray-600">Departure:</span>
              <p className="font-medium">
                {formatDateTime(offer.departure_date, offer.departure_time)}
              </p>
            </div>
            {offer.return_date && offer.return_time && (
              <div>
                <span className="text-gray-600">Return:</span>
                <p className="font-medium">
                  {formatDateTime(offer.return_date, offer.return_time)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Traveler Details */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Traveler Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{traveler.title} {traveler.given_name} {traveler.family_name}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium">{traveler.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{traveler.phone_number}</p>
            </div>
            <div>
              <span className="text-gray-600">Date of Birth:</span>
              <p className="font-medium">{traveler.born_on}</p>
            </div>
          </div>
        </div>

        {/* Price and Expiry */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600">Total Price:</span>
            <p className="text-2xl font-bold">{formatPrice(offer.price, offer.currency)}</p>
          </div>
          
          {offer.expires_at && (
            <div className="text-right">
              <span className="text-gray-600 text-sm">Offer expires:</span>
              <div className="flex flex-col items-end gap-1">
                <OfferExpirationTimer 
                  expiresAt={offer.expires_at}
                  onExpired={() => setIsExpiredState(true)}
                />
                <p className="text-xs text-gray-500">
                  {new Date(offer.expires_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Expiry Warning */}
        {isExpired() && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This offer has expired. Please search for new flights.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleBookFlight} 
          disabled={isBooking || isExpired()}
          className="w-full"
          size="lg"
        >
          {isBooking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking Flight...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DuffelBookingCard;
