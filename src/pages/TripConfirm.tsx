import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PlaneTakeoff, Check, X, Loader2, AlertCircle, Plane } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OfferProps } from "@/components/trip/TripOfferCard";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert, Tables } from "@/integrations/supabase/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { safeQuery } from "@/lib/supabaseUtils";
import { formatDuration } from "@/utils/formatDuration";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";

// Extended interface to include new database fields
interface ExtendedOffer extends OfferProps {
  auto_book: boolean;
  booking_url: string | null;
  stops: number;
  layover_airports: string[] | null;
}

const TripConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [offer, setOffer] = useState<ExtendedOffer | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [loadingFullOffer, setLoadingFullOffer] = useState(false);
  const { user, userId, loading: userLoading } = useCurrentUser();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id');
  const [bookingProcessingInvoked, setBookingProcessingInvoked] = useState(false);

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

      // Fetch full offer details from database
      fetchFullOfferDetails(parsedOffer.id);
    } catch (error) {
      setHasError(true);
      toast({
        title: "Error",
        description: "Invalid flight information. Please select a flight again.",
        variant: "destructive",
      });
    }
  }, [location.search, sessionId]);

  const fetchFullOfferDetails = async (offerId: string) => {
    setLoadingFullOffer(true);
    try {
      const { data: fullOffer, error } = await supabase
        .from('flight_offers')
        .select('*')
        .eq('id', offerId)
        .single();

      if (error || !fullOffer) {
        throw new Error('Could not fetch flight details');
      }

      // Transform database result to our extended offer interface
      const extendedOffer: ExtendedOffer = {
        id: fullOffer.id,
        airline: fullOffer.airline,
        flight_number: fullOffer.flight_number,
        price: Number(fullOffer.price),
        departure_date: fullOffer.departure_date,
        departure_time: fullOffer.departure_time,
        return_date: fullOffer.return_date,
        return_time: fullOffer.return_time,
        duration: fullOffer.duration,
        auto_book: fullOffer.auto_book,
        booking_url: fullOffer.booking_url,
        stops: fullOffer.stops,
        layover_airports: fullOffer.layover_airports,
      };

      setOffer(extendedOffer);
    } catch (error) {
      console.error('Error fetching full offer details:', error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Could not load flight details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingFullOffer(false);
    }
  };

  // Subscribe to booking status updates if we have a session ID
  useEffect(() => {
    if (!sessionId) {
      setBookingProcessingInvoked(false);
      return;
    }

    const invokeProcessBooking = async () => {
      if (!bookingProcessingInvoked) {
        setBookingProcessingInvoked(true);
        setBookingStatus("Finalizing your booking details...");

        try {
          const { error: processError } = await supabase.functions.invoke("process-booking", {
            body: { sessionId }
          });

          if (processError) {
            throw processError;
          }
          
          updateBookingStatusMessage("done"); 
          toast({
            title: "Booking Confirmed!",
            description: "Your flight booking has been successfully processed. Redirecting to dashboard...",
            variant: "default", 
          });

        } catch (err: any) {
          setError(err.message || "An error occurred while finalizing your booking.");
          updateBookingStatusMessage("failed");
          toast({
            title: "Booking Finalization Error",
            description: err.message || "Could not finalize your booking. Please check for updates or contact support.",
            variant: "destructive",
          });
        }
      }
    };

    invokeProcessBooking();
    
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
    
    // Subscribe to booking status updates using the simplified table subscription
    const subscription = supabase
      .from(`booking_requests:checkout_session_id=eq.${sessionId}`)
      .on('UPDATE', (payload: RealtimePostgresUpdatePayload<Tables<'booking_requests'>>) => {
        updateBookingStatusMessage(payload.new.status);
      })
      .subscribe();
      
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [sessionId, bookingProcessingInvoked]);
  
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

  const handleContinueToAirline = () => {
    if (offer?.booking_url) {
      window.open(offer.booking_url, '_blank');
    } else {
      toast({
        title: "Error",
        description: "Booking URL not available. Please try again or contact support.",
        variant: "destructive",
      });
    }
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
      try {
        const tripIdFromParams = searchParams.get("id"); 

        // Call the create-booking-request edge function
        const res = await supabase.functions.invoke<{ url: string }>("create-booking-request", {
          body: { 
            userId, 
            offerId: offer!.id,
            bookingRequestId: tripIdFromParams
          }
        });
        
        if (res.error || !res.data?.url) {
          throw new Error(res.error?.message ?? "No URL found in response");
        }
        
        // If we reach here, it's a success with a URL
        window.location.href = res.data.url;
      } catch (e: unknown) {
        let errorMessage = "There was a problem setting up your booking. Please try again.";
        if (e instanceof Error) {
          errorMessage = e.message;
        } else if (typeof e === 'string') {
          errorMessage = e;
        }
        else if (typeof e === 'object' && e !== null && 'message' in e && typeof (e as any).message === 'string') {
           errorMessage = (e as any).message || errorMessage;
        }

        setError(errorMessage);
        toast({
          title: "Booking Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
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

  if (userLoading || !offer || loadingFullOffer) {
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
          
          {/* Enhanced Flight Details */}
          <div className="space-y-4 border-b pb-4">
            {/* Duration */}
            <div className="flex items-center">
              <PlaneTakeoff className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">
                Flight duration: {formatDuration(offer.duration)}
              </span>
            </div>
            
            {/* Stops and Layovers */}
            <div className="flex items-center">
              <Plane className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-500">
                {offer.stops === 0 
                  ? 'Direct flight' 
                  : `${offer.stops} stop${offer.stops > 1 ? 's' : ''}${
                      offer.layover_airports && offer.layover_airports.length > 0 
                        ? ` (${offer.layover_airports.join(', ')})` 
                        : ''
                    }`
                }
              </span>
            </div>
          </div>
          
          {/* Notes */}
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">
              {offer.auto_book 
                ? "By confirming this booking, you agree to the terms and conditions of the airline. This booking is non-refundable after 24 hours."
                : "You will be redirected to the airline's website to complete your booking. Please review their terms and conditions before purchasing."
              }
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleCancel} variant="outline" disabled={isConfirming}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          
          {/* Conditional Button Based on auto_book */}
          {offer.auto_book ? (
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
          ) : (
            <Button 
              onClick={handleContinueToAirline}
              disabled={!offer.booking_url}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlaneTakeoff className="mr-2 h-4 w-4" /> Continue to Airline
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TripConfirm;
