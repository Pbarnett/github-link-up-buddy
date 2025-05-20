import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PlaneTakeoff, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OfferProps } from "@/components/trip/TripOfferCard";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { safeQuery } from "@/lib/supabaseUtils";

const TripConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<OfferProps | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, userId, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    // Parse query parameters
    try {
      const searchParams = new URLSearchParams(location.search);
      
      if (!searchParams.has('id')) {
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
  }, [location.search]);

  const handleCancel = () => {
    navigate('/trip/offers');
  };

  const onConfirm = async () => {
    if (!offer || !offer.id) {
      toast({
        title: "Error",
        description: "Invalid flight information. Cannot complete booking.",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to book a flight.",
        variant: "destructive",
      });
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      // Get the trip_request_id from flight_offers using the flight offer ID
      const flightOfferResult = await safeQuery<{ trip_request_id: string }>(() => 
        Promise.resolve(
          supabase
            .from('flight_offers')
            .select('trip_request_id')
            .eq('id', offer.id)
            .single()
        )
      );

      if (flightOfferResult.error || !flightOfferResult.data) {
        throw new Error(flightOfferResult.error?.message || "Could not find flight offer details");
      }
      
      const flightOffer = flightOfferResult.data;
      
      // Security check: Verify that the trip request belongs to the current user
      const tripRequestResult = await safeQuery<{ user_id: string, id: string }>(() => 
        Promise.resolve(
          supabase
            .from('trip_requests')
            .select('user_id, id')
            .eq('id', flightOffer.trip_request_id)
            .single()
        )
      );
        
      if (tripRequestResult.error || !tripRequestResult.data) {
        throw new Error("Could not verify trip ownership");
      }
      
      const tripRequest = tripRequestResult.data;
      
      // Verify the trip belongs to the logged-in user
      if (tripRequest.user_id !== userId) {
        setError("Security error: You don't have permission to book this flight");
        toast({
          title: "Security Error",
          description: "You don't have permission to book this flight. It belongs to another user.",
          variant: "destructive",
        });
        return;
      }

      // Call payment session endpoint
      const res = await fetch("/functions/v1/create-payment-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_request_id: tripRequest.id,
          offer_id: offer.id,
          user_id: userId,
          flight_offer_id: offer.id,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create payment session");
      }
      
      const { url } = await res.json();
      window.location.href = url;

    } catch (err: any) {
      console.error("Error creating payment session:", err);
      setError(err.message || "There was a problem with the payment process");
      toast({
        title: "Payment Session Failed",
        description: err.message || "There was a problem setting up payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
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

  if (userLoading || !offer) {
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
          {/* Security Error Message */}
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
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
          
          {/* Duration */}
          <div className="flex items-center">
            <PlaneTakeoff className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-500">Flight duration: {offer.duration}</span>
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
          <Button onClick={handleCancel} variant="outline" disabled={isConfirming}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isConfirming || !!error}>
            {isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Pay & Book
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TripConfirm;
