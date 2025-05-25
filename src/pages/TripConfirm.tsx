import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PlaneTakeoff, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OfferProps } from "@/components/trip/TripOfferCard";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import TravelerDataForm, { TravelerData } from "@/components/TravelerDataForm";

const TripConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<OfferProps | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [showTravelerForm, setShowTravelerForm] = useState(true);
  const [travelerData, setTravelerData] = useState<TravelerData | null>(null);
  const [bookingRequestId, setBookingRequestId] = useState<string | null>(null);
  const [isSavingTravelerData, setIsSavingTravelerData] = useState(false);
  const { user, userId, loading: userLoading } = useCurrentUser();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    console.log("[TripConfirm] Component mounted with location:", location.search);
    
    try {
      if (sessionId) {
        console.log("[TripConfirm] Returning from Stripe checkout with sessionId:", sessionId);
        setBookingStatus("Processing payment...");
        setShowTravelerForm(false);
        
        // Trigger process-booking for completed checkout sessions
        const processCompletedBooking = async () => {
          try {
            console.log("[TripConfirm] Invoking process-booking for sessionId:", sessionId);
            const { data, error } = await supabase.functions.invoke("process-booking", {
              body: { sessionId }
            });
            
            if (error) {
              console.error("[TripConfirm] Error processing booking:", error);
              setError(`Booking processing failed: ${error.message}`);
              setBookingStatus("❌ Booking failed");
            } else {
              console.log("[TripConfirm] Process-booking response:", data);
            }
          } catch (err: any) {
            console.error("[TripConfirm] Exception processing booking:", err);
            setError(`Booking processing error: ${err.message}`);
            setBookingStatus("❌ Booking failed");
          }
        };
        
        processCompletedBooking();
        return;
      }
      
      // Parse offer details from query params
      const searchParams = new URLSearchParams(location.search);
      
      if (!searchParams.has('id')) {
        console.error("[TripConfirm] Missing flight ID in URL params");
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

      console.log("[TripConfirm] Parsed offer:", parsedOffer);

      if (!parsedOffer.id || !parsedOffer.airline || !parsedOffer.price) {
        throw new Error("Incomplete flight information");
      }

      setOffer(parsedOffer);
    } catch (error: any) {
      console.error("[TripConfirm] Error parsing offer details:", error);
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
    
    console.log("[TripConfirm] Setting up realtime subscription for sessionId:", sessionId);
    
    const fetchBookingRequest = async () => {
      try {
        console.log("[TripConfirm] Fetching booking request status for sessionId:", sessionId);
        const { data, error } = await supabase
          .from('booking_requests')
          .select('status')
          .eq('checkout_session_id', sessionId)
          .single();
          
        if (error) {
          console.error("[TripConfirm] Error fetching booking request:", error);
          throw error;
        }
        
        if (data) {
          console.log("[TripConfirm] Found booking request with status:", data.status);
          updateBookingStatusMessage(data.status);
        }
      } catch (err: any) {
        console.error("[TripConfirm] Exception fetching booking request:", err);
        toast({ 
          title: "Error Fetching Booking Details", 
          description: err.message || "Could not retrieve your booking status at this time.", 
          variant: "destructive" 
        });
        setError("Could not retrieve booking status.");
      }
    };
    
    fetchBookingRequest();
    
    // Subscribe to booking status updates
    const channel = supabase
      .channel(`checkout:${sessionId}`)
      .on(
        'postgres_changes' as const,
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'booking_requests',
          filter: `checkout_session_id=eq.${sessionId}`,
        },
        (payload: any) => {
          console.log("[TripConfirm] Received booking status update:", payload);
          updateBookingStatusMessage(payload.new.status);
        }
      )
      .subscribe();
      
    return () => {
      console.log("[TripConfirm] Unsubscribing from realtime channel");
      channel.unsubscribe();
    };
  }, [sessionId]);
  
  const updateBookingStatusMessage = (status: string) => {
    console.log("[TripConfirm] Updating booking status message for status:", status);
    
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
        toast({
          title: "Booking Confirmed!",
          description: "Your flight has been successfully booked. Redirecting to dashboard...",
        });
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

  const handleTravelerDataSubmit = async (data: TravelerData) => {
    if (!offer || !userId) {
      console.error("[TripConfirm] Missing offer or userId for traveler data submit");
      toast({
        title: "Error",
        description: "Missing required information to save traveler data.",
        variant: "destructive",
      });
      return;
    }

    console.log("[TripConfirm] Saving traveler data:", data);
    setIsSavingTravelerData(true);
    setError(null);

    try {
      // Create the booking request data object with proper typing
      const bookingRequestData = {
        user_id: userId,
        offer_id: offer.id,
        offer_data: offer as any, // Cast to any to avoid type conflicts
        traveler_data: data as any, // Cast to any to avoid type conflicts
        status: 'new' as const
      };

      const { data: bookingRequest, error: bookingError } = await supabase
        .from("booking_requests")
        .insert(bookingRequestData)
        .select()
        .single();

      if (bookingError) {
        console.error("[TripConfirm] Error creating booking request:", bookingError);
        throw bookingError;
      }

      console.log("[TripConfirm] Created booking request:", bookingRequest);
      setBookingRequestId(bookingRequest.id);
      setTravelerData(data);
      setShowTravelerForm(false);

      toast({
        title: "Traveler Information Saved",
        description: "You can now proceed to payment.",
      });
    } catch (err: any) {
      console.error("[TripConfirm] Exception saving traveler data:", err);
      setError(err.message || "Failed to save traveler information");
      toast({
        title: "Error",
        description: err.message || "Failed to save traveler information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingTravelerData(false);
    }
  };

  const onConfirm = async () => {
    if (!offer || !offer.id) {
      console.error("[TripConfirm] Missing offer for confirmation");
      toast({
        title: "Error",
        description: "Invalid flight information. Cannot complete booking.",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      console.error("[TripConfirm] User not authenticated");
      toast({
        title: "Authentication Error",
        description: "You must be logged in to book a flight.",
        variant: "destructive",
      });
      return;
    }

    if (!bookingRequestId) {
      console.error("[TripConfirm] Missing booking request ID");
      toast({
        title: "Error",
        description: "Please complete traveler information first.",
        variant: "destructive",
      });
      return;
    }

    console.log("[TripConfirm] Starting payment confirmation for booking request:", bookingRequestId);
    setIsConfirming(true);
    setError(null);

    try {
      console.log(
        "[TripConfirm] Invoking create-booking-request with:", 
        { userId, offerId: offer.id, bookingRequestId }
      );

      const res = await supabase.functions.invoke<{ url: string }>(
        "create-booking-request",
        { body: { userId, offerId: offer.id, bookingRequestId } }
      );
      
      console.log("[TripConfirm] Create-booking-request response:", res);
      
      if (res.error) {
        console.error("[TripConfirm] Edge function error:", res.error);
        throw new Error(res.error.message || "Failed to create booking request");
      }
      
      if (!res.data || !res.data.url) {
        console.error("[TripConfirm] No checkout URL received:", res.data);
        throw new Error("No checkout URL received from server");
      }
      
      console.log("[TripConfirm] Redirecting to Stripe checkout:", res.data.url);
      window.location.href = res.data.url;
    } catch (err: any) {
      console.error("[TripConfirm] Exception during confirmation:", err);
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
      <div className="w-full max-w-3xl space-y-6">
        {/* Flight Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Confirm Your Flight</CardTitle>
            <CardDescription>
              Please review your selected flight details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
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
          </CardContent>
        </Card>

        {/* Traveler Data Form */}
        {showTravelerForm && (
          <TravelerDataForm
            onSubmit={handleTravelerDataSubmit}
            isLoading={isSavingTravelerData}
          />
        )}

        {/* Traveler Data Summary (when form is completed) */}
        {!showTravelerForm && travelerData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Passenger Information
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTravelerForm(true)}
                  disabled={isConfirming}
                >
                  Edit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {travelerData.firstName} {travelerData.lastName}
                </div>
                <div>
                  <span className="font-medium">Date of Birth:</span> {new Date(travelerData.dateOfBirth).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {travelerData.gender}
                </div>
                <div>
                  <span className="font-medium">Document:</span> {travelerData.passportNumber}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-500">
                By confirming this booking, you agree to the terms and conditions of the airline.
                This booking is non-refundable after 24 hours.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleCancel} variant="outline" disabled={isConfirming || isSavingTravelerData}>
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              onClick={onConfirm} 
              disabled={isConfirming || showTravelerForm || !!error || isSavingTravelerData}
            >
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
    </div>
  );
};

export default TripConfirm;
