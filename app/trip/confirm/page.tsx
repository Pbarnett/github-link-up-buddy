
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PlaneTakeoff, Check, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OfferProps } from "@/components/trip/TripOfferCard";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { safeQuery } from "@/lib/supabaseUtils";

const TripConfirm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [offer, setOffer] = useState<OfferProps | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    // Parse query parameters
    try {
      if (!searchParams || !searchParams.get('id')) {
        setHasError(true);
        toast({
          title: "Error",
          description: "Missing flight information. Please select a flight first.",
          variant: "destructive",
        });
        return;
      }

      const parsedOffer: OfferProps = {
        id: searchParams.get('id') || '',
        airline: searchParams.get('airline') || '',
        flight_number: searchParams.get('flight_number') || '',
        price: parseFloat(searchParams.get('price') || '0'),
        departure_date: searchParams.get('departure_date') || '',
        departure_time: searchParams.get('departure_time') || '',
        return_date: searchParams.get('return_date') || '',
        return_time: searchParams.get('return_time') || '',
        duration: searchParams.get('duration') || '',
      };

      // Validate the parsed offer
      if (!parsedOffer.id || !parsedOffer.airline || !parsedOffer.price) {
        throw new Error("Incomplete flight information");
      }

      setOffer(parsedOffer);
    } catch (error) {
      console.error("Error parsing offer details:", error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Invalid flight information. Please select a flight again.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  const handleCancel = () => {
    router.push('/trip/offers');
  };

  const handleConfirm = async () => {
    if (!offer || !offer.id) {
      toast({
        title: "Error",
        description: "Invalid flight information. Cannot complete booking.",
        variant: "destructive",
      });
      return;
    }

    setIsBooking(true);

    try {
      // 1. Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error(userError?.message || "User not authenticated");
      }

      // 2. Get the trip_request_id from flight_offers using the flight offer ID
      const flightOfferResult = await safeQuery<{ trip_request_id: string }>(() =>
        supabase
          .from('flight_offers')
          .select('trip_request_id')
          .eq('id', offer.id)
          .single()
      );

      if (flightOfferResult.error || !flightOfferResult.data) {
        throw new Error(flightOfferResult.error?.message || "Could not find flight offer details");
      }

      // 3. Create booking record
      const bookingData: TablesInsert<"bookings"> = {
        user_id: user.id,
        trip_request_id: flightOfferResult.data.trip_request_id,
        flight_offer_id: offer.id,
      };

      const bookingResult = await safeQuery<Tables<"bookings">>(() =>
        supabase
          .from('bookings')
          .insert(bookingData)
          .select()
      );

      if (bookingResult.error) {
        throw new Error(bookingResult.error.message || "Failed to create booking");
      }

      // Success
      toast({
        title: "Booking Confirmed",
        description: `You've successfully booked ${offer.airline} flight ${offer.flight_number}`,
      });

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (error: unknown) {
      console.error("Error creating booking:", error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem creating your booking. Please try again.";
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">Error</CardTitle>
            <CardDescription>
              There was a problem with your selected flight
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Unable to retrieve flight details. Please go back and select a flight again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCancel} variant="outline">
              <X className="mr-2 h-4 w-4" /> Return to Offers
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-pulse">
          <p className="text-gray-500">Loading flight details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Confirm Your Flight</CardTitle>
          <CardDescription>
            Please review your selected flight details before confirming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Airline and Flight Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold">{offer.airline}</h3>
              <Badge variant="outline" className="ml-2">{offer.flight_number}</Badge>
            </div>
            <p className="text-2xl font-bold">${offer.price}</p>
          </div>
          
          {/* Flight Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b py-4">
            {/* Departure Info */}
            <div className="space-y-3">
              <h4 className="font-medium">Departure</h4>
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
            <div className="space-y-3">
              <h4 className="font-medium">Return</h4>
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
          
          {/* Duration and Trip Length */}
          <div className="space-y-2">
            <div className="flex items-center">
              <PlaneTakeoff className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">Flight duration: {offer.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span className="inline-block bg-blue-50 text-blue-700 text-sm font-semibold rounded-full px-2 py-1">
                {Math.ceil((new Date(offer.return_date).getTime() - new Date(offer.departure_date).getTime()) / (1000 * 60 * 60 * 24))} Days Trip
              </span>
            </div>
          </div>
          
          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">
              By confirming this booking, you agree to the terms and conditions of the airline.
              This booking is non-refundable after 24 hours.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleCancel} variant="outline" disabled={isBooking}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isBooking}>
            {isBooking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Confirm Booking
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TripConfirm;
