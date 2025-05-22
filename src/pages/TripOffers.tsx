import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/services/tripOffersService";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format as formatDate } from "date-fns";
import TripOfferCard from "@/components/trip/TripOfferCard";
import TripOffersLoading from "@/components/trip/TripOffersLoading";
import TripErrorCard from "@/components/trip/TripErrorCard";

interface TripDetails {
  earliest_departure: string;
  latest_departure: string;
  min_duration: number;
  max_duration: number;
  budget: number;
}

export default function TripOffers() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const location = useLocation();
  const navigate = useNavigate();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('[flight-search-ui] useEffect start – tripId:', tripId);
    if (!tripId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    (async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // 1) Invoke the edge function
        console.log("[flight-search-ui] about to invoke flight-search edge function");
        const { data: invokeData, error: invokeError } = await supabase.functions.invoke(
          "flight-search",
          { body: { tripRequestId: tripId } }
        );
        console.log("[flight-search-ui] invoke result:", { invokeData, invokeError });
        if (invokeError) throw invokeError;

        // 2) Fetch trip details
        if (location.state?.tripDetails) {
          setTripDetails(location.state.tripDetails);
        } else {
          console.log("[flight-search-ui] fetching trip details");
          const { data: tripData, error: tripError } = await supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripId)
            .single();
          if (tripError || !tripData) throw tripError || new Error("No trip data");
          setTripDetails({
            earliest_departure: tripData.earliest_departure,
            latest_departure: tripData.latest_departure,
            min_duration: tripData.min_duration,
            max_duration: tripData.max_duration,
            budget: tripData.budget,
          });
        }

        // 3) Fetch the newly-written flight_offers
        console.log("[flight-search-ui] querying flight_offers for trip:", tripId);
        const { data: rows, error: fetchError } = await supabase
          .from("flight_offers")
          .select("*")
          .eq("trip_request_id", tripId);
        if (fetchError) throw fetchError;
        console.log("[flight-search-ui] rows fetched:", rows?.length, rows);
        setOffers(rows ?? []);
      } catch (err: any) {
        console.error("[flight-search-ui] error in load flow:", err);
        toast({
          title: "Error loading offers",
          description: err.message || "Something went wrong.",
          variant: "destructive",
        });
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [tripId]);

  const refreshOffers = async () => {
    if (!tripId) return;
    setIsRefreshing(true);
    try {
 HEAD
      console.log("[flight-search-ui] manually invoking flight-search edge function");
      const { error: invokeError } = await supabase.functions.invoke("flight-search", {
        body: { tripRequestId: tripId },
      });
      if (invokeError) throw invokeError;

      const { data: rows, error } = await supabase
        .from("flight_offers")
        .select("*")
        .eq("trip_request_id", tripId)
        .order("price", { ascending: true });
      if (error) throw error;
      console.log("[flight-search-ui] rows fetched on refresh:", rows?.length, rows);
      setOffers(rows ?? []);
      toast({ title: "Offers refreshed", description: `Found ${rows?.length ?? 0} offers.` });
    } catch (err: any) {
      console.error("[flight-search-ui] error refreshing offers:", err);

 origin/main
      toast({
        title: "Error refreshing offers",
        description: err.message || "Could not refresh.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

<<<<<<< HEAD
  // Final state check
  console.log('[flight-search-ui] final `offers` state:', offers);
=======
  useEffect(() => {
    if (!tripId) {
      setHasError(true);
      return;
    }

    (async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        // 1. Invoke the edge function
        console.log("[flight-search-ui] invoking edge-function for trip:", tripId);
        const { data: invokeData, error: invokeError } =
          await supabase.functions.invoke("flight-search", {
            body: { tripRequestId: tripId },
          });
        console.log("[flight-search-ui] invoke result:", {
          invokeData,
          invokeError,
        });
        if (invokeError) {
          console.error(
            "[flight-search-ui] error invoking flight-search:",
            invokeError
          );
          toast({
            title: "Error refreshing offers",
            description: invokeError.message,
            variant: "destructive",
          });
          setHasError(true);
          return;
        }

        // 2. Fetch trip details if needed
        if (!tripDetails) {
          // Check location state first
          if (location.state?.tripDetails) {
            setTripDetails(location.state.tripDetails);
          } else {
            console.log("[flight-search-ui] fetching trip details");
            const { data: tripData, error: tripError } = await supabase
              .from("trip_requests")
              .select("*")
              .eq("id", tripId)
              .single();
            if (tripError) {
              console.error(
                "[flight-search-ui] error fetching trip details:",
                tripError
              );
              toast({
                title: "Error loading trip",
                description: tripError.message,
                variant: "destructive",
              });
              setHasError(true);
              return;
            }
            setTripDetails({
              earliestDeparture: tripData.earliest_departure,
              latestDeparture: tripData.latest_departure,
              min_duration: tripData.min_duration,
              max_duration: tripData.max_duration,
              budget: tripData.budget,
            });
          }
        }

        // 3. Fetch flight_offers after edge function insertion
        console.log("[flight-search-ui] querying flight_offers table");
        const { data: rows, error: fetchError } = await supabase
          .from("flight_offers")
          .select("*")
          .eq("trip_request_id", tripId)
          .order("price", { ascending: true });
          
        if (fetchError) {
          console.error(
            "[flight-search-ui] error fetching offers:",
            fetchError
          );
          toast({
            title: "Error loading offers",
            description: fetchError.message,
            variant: "destructive",
          });
          setHasError(true);
          return;
        }
        console.log(
          "[flight-search-ui] rows fetched:",
          rows?.length ?? 0,
          rows
        );
        
        // Map the Supabase data to the Offer interface
        if (rows && rows.length > 0) {
          const formattedOffers: Offer[] = rows.map(offer => ({
            id: offer.id,
            airline: offer.airline,
            flight_number: offer.flight_number,
            departure_date: offer.departure_date,
            departure_time: offer.departure_time,
            return_date: offer.return_date,
            return_time: offer.return_time,
            duration: offer.duration,
            price: Number(offer.price)
          }));
          setOffers(formattedOffers);
        } else {
          setOffers([]);
        }
      } catch (err) {
        console.error("[flight-search-ui] unexpected error:", err);
        toast({
          title: "Something went wrong",
          description: String(err),
          variant: "destructive",
        });
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [tripId, location.state, tripDetails]);
>>>>>>> origin/main

  if (hasError) {
    return <TripErrorCard />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-4">
      {/* Trip Summary Card */}
      {tripDetails && (
        <Card className="w-full max-w-5xl mb-6">
          <CardHeader>
            <CardTitle>Your trip request details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Travel Window</p>
              <p>
                {formatDate(new Date(tripDetails.earliest_departure), "MMM d, yyyy")} –{" "}
                {formatDate(new Date(tripDetails.latest_departure), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p>{tripDetails.min_duration}–{tripDetails.max_duration} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p>${tripDetails.budget}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offers Header */}
      <Card className="w-full max-w-5xl mb-6">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Trip Offers</CardTitle>
            <CardDescription>
              {isLoading ? "Loading offers…" : `${offers.length} offers found for your trip`}
            </CardDescription>
          </div>
          <Button onClick={refreshOffers} disabled={isRefreshing || isLoading}>
            Refresh Offers
          </Button>
        </CardHeader>
      </Card>

      {isLoading ? (
        <TripOffersLoading />
      ) : (
        <div className="w-full max-w-5xl space-y-6">
          {offers.length > 0 ? (
            offers.map((offer) => <TripOfferCard key={offer.id} offer={offer} />)
          ) : (
            <Card className="p-6 text-center">
              No offers found. Try refreshing.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

