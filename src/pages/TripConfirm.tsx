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
import { RealtimeChannel } from "@supabase/supabase-js";

type BookingRequestPayload = {
  new: Tables<'booking_requests'>;
  old: Tables<'booking_requests'>;
  // Include other properties from the Supabase payload if necessary,
  // but 'new' and 'old' are the most critical for this use case.
  // For example: commit_timestamp: string, errors: any[], table: string, schema: string, type: string
  commit_timestamp: string;
  errors: any[] | null;
  table: string;
  schema: string;
  type: 'INSERT' | 'UPDATE' | 'DELETE';
};

const TripConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<OfferProps | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const { user, userId, loading: userLoading } = useCurrentUser();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Parse query parameters
    try {
      if (sessionId) {
        // We're returning from Stripe checkout, show booking status
        setBookingStatus("Processing payment...");
        return;
      }
      
      // Parse offer details from query params
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
      // console.error("Error parsing offer details:", error); // Removed, existing toast handles this
      setHasError(true);
      toast({
        title: "Error",
        description: "Invalid flight information. Please select a flight again.",
        variant: "destructive",
      });
    }
  }, [location.search, sessionId]);

  // Subscribe to booking status updates if we have a session ID
  useEffect(() => {
    if (!sessionId) return;
    
    // Try to find the booking request with this session ID
    const fetchBookingRequest = async () => {
      try {
        const { data, error } = await supabase
          .from('booking_requests')
          .select('status')
          .eq('checkout_session_id', sessionId)
          .single();
          
        if (error) throw error;
        if (data) {
          updateBookingStatusMessage(data.status);
        }
      } catch (err: any) {
        toast({ title: "Error Fetching Booking Details", description: err.message || "Could not retrieve your booking status at this time.", variant: "destructive" });
        setError("Could not retrieve booking status.");
      }
    };
    
    fetchBookingRequest();
    
    // Subscribe to booking status updates using v2 channel API
    const channel = supabase
      .channel(`checkout:${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'booking_requests',
        filter: `checkout_session_id=eq.${sessionId}`,
      }, (payload: BookingRequestPayload) => {
        // console.log('[trip-confirm] booking status updated:', payload); // Commented out
        updateBookingStatusMessage(payload.new.status);
      })
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, [sessionId]);
  
  const updateBookingStatusMessage = (status: string) => {
    switch (status) {
      case 'pending_payment':
        setBookingStatus("Waiting for payment confirmation...");
        break;
      case 'pending_booking':
        setBookingStatus("Payment received! Booking your flight...");
        break;
      case 'processing':
        setBookingStatus("Finalizing your booking...");
        break;
      case 'done':
        setBookingStatus("✅ Your flight is booked!");
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        break;
      case 'failed':
        setBookingStatus("❌ Booking failed");
        setError("There was a problem with your booking. Please try again.");
        break;
      default:
        setBookingStatus(`Status: ${status}`);
    }
  };

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
      // Call the create-booking-request edge function
      const res = await supabase.functions.invoke<{ url: string }>("create-booking-request", {
        body: { userId, offerId: offer.id }
      });
      
      if (res.error) {
        throw new Error(res.error.message || "Failed to create booking request");
      }
      
      if (!res.data || !res.data.url) {
        throw new Error("No checkout URL received from server");
      }
      
      // Redirect to Stripe checkout
      window.location.href = res.data.url;
    } catch (err: any) {
      // console.error("Error creating booking request:", err); // Removed, existing toast handles this
      setError(err.message || "There was a problem setting up the booking");
      toast({
        title: "Booking Failed",
        description: err.message || "There was a problem setting up your booking. Please try again.",
        variant: "destructive",
      });
      setIsConfirming(false);
    }
  };

  // Show booking status if we're returning from checkout
  if (sessionId) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl">Booking Status</CardTitle>
            <CardDescription>
              Your flight booking is being processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6">
              {error ? (
                <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">{bookingStatus}</p>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">
                Please don't close this page while we're processing your booking.
                You'll be redirected to your dashboard when the booking is complete.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {error && (
              <Button onClick={() => navigate('/trip/offers')} variant="outline">
                <X className="mr-2 h-4 w-4" /> Return to Flight Offers
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

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
