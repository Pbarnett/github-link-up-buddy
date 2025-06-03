
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { FormValues, tripFormSchema, ExtendedTripFormValues } from "@/types/form";
import DateRangeSection from "./sections/DateRangeSection";
import BudgetSection from "./sections/BudgetSection";
import TripDurationSection from "./sections/TripDurationSection";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";
import DestinationSection from "./sections/DestinationSection";
import AutoBookingSection from "./sections/AutoBookingSection";
import { Loader2 } from "lucide-react";
import { TripRequestFromDB } from "@/hooks/useTripOffers";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger"; // Import logger

interface TripRequestFormProps {
  tripRequestId?: string;
}

const categorizeAirports = (airports: string[] | null | undefined): { nycAirports: string[], otherAirport: string } => {
  if (!airports) return { nycAirports: [], otherAirport: "" };
  const nyc = ["JFK", "LGA", "EWR"];
  const nycSelected: string[] = [];
  let other = "";
  airports.forEach(ap => {
    if (nyc.includes(ap.toUpperCase())) {
      nycSelected.push(ap.toUpperCase());
    } else if (!other) {
      other = ap.toUpperCase();
    }
  });
  return { nycAirports: nycSelected, otherAirport: other };
};

const TripRequestForm = ({ tripRequestId }: TripRequestFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useCurrentUser(); // Removed unused user, userLoading, userError
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      min_duration: 3,
      max_duration: 7,
      budget: 1000,
      nyc_airports: [],
      other_departure_airport: "",
      destination_airport: "",
      destination_other: "",
      auto_book_enabled: false,
      max_price: null,
      preferred_payment_method_id: null,
    },
  });

  useEffect(() => {
    if (tripRequestId) {
      const fetchTripDetails = async () => {
        setIsLoadingDetails(true);
        try {
          // Use TripRequestFromDB for typing the response
          const { data: tripData, error } = await supabase
            .from("trip_requests")
            .select("*")
            .eq("id", tripRequestId)
            .single<TripRequestFromDB>(); // Specify the type here

          if (error) throw error;

          if (tripData) {
            const { nycAirports, otherAirport } = categorizeAirports(tripData.departure_airports);
            form.reset({
              earliestDeparture: tripData.earliest_departure ? parseISO(tripData.earliest_departure) : undefined,
              latestDeparture: tripData.latest_departure ? parseISO(tripData.latest_departure) : undefined,
              min_duration: tripData.min_duration,
              max_duration: tripData.max_duration,
              budget: tripData.budget,
              nyc_airports: nycAirports,
              other_departure_airport: otherAirport,
              destination_airport: tripData.destination_airport?.length === 3 && tripData.destination_airport === tripData.destination_airport?.toUpperCase() ? tripData.destination_airport : "",
              destination_other: tripData.destination_airport?.length !== 3 || tripData.destination_airport !== tripData.destination_airport?.toUpperCase() ? tripData.destination_airport : "",
              auto_book_enabled: tripData.auto_book_enabled ?? false, // Use nullish coalescing
              max_price: tripData.max_price,
              preferred_payment_method_id: tripData.preferred_payment_method_id,
            });
          }
        } catch (err) {
          const error = err as Error | PostgrestError;
          toast({
            title: "Error fetching trip details",
            description: error.message || "Failed to load existing trip data.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchTripDetails();
    } else {
      form.reset(form.formState.defaultValues);
    }
  }, [tripRequestId, form]);

  const validateFormData = (data: FormValues): boolean => {
    const destinationAirport = data.destination_airport || data.destination_other || "";
    if (!destinationAirport) {
      toast({
        title: "Validation error",
        description: "Please select a destination or enter a custom one.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const transformFormData = (data: FormValues): ExtendedTripFormValues => {
    const departureAirports: string[] = [];
    if (data.nyc_airports && data.nyc_airports.length > 0) {
      departureAirports.push(...data.nyc_airports);
    }
    if (data.other_departure_airport) {
      departureAirports.push(data.other_departure_airport);
    }
    const destinationAirport = data.destination_airport || data.destination_other || "";
    return {
      earliestDeparture: data.earliestDeparture,
      latestDeparture: data.latestDeparture,
      min_duration: data.min_duration,
      max_duration: data.max_duration,
      budget: data.budget,
      departure_airports: departureAirports,
      destination_airport: destinationAirport,
      auto_book_enabled: data.auto_book_enabled,
      max_price: data.max_price,
      preferred_payment_method_id: data.preferred_payment_method_id,
    };
  };

  const createTripRequest = async (formData: ExtendedTripFormValues): Promise<TripRequestFromDB> => {
    if (!userId) throw new Error("You must be logged in to create a trip request.");
    const tripRequestData = { /* ... same as before ... */
      user_id: userId,
      destination_airport: formData.destination_airport,
      departure_airports: formData.departure_airports || [],
      earliest_departure: formData.earliestDeparture.toISOString(),
      latest_departure: formData.latestDeparture.toISOString(),
      min_duration: formData.min_duration,
      max_duration: formData.max_duration,
      budget: formData.budget,
      auto_book_enabled: formData.auto_book_enabled ?? false,
      max_price: formData.max_price,
      preferred_payment_method_id: formData.preferred_payment_method_id,
    };
    const { data, error } = await supabase
      .from("trip_requests")
      .insert([tripRequestData])
      .select()
      .single<TripRequestFromDB>();
    if (error) throw error;
    if (!data) throw new Error("Failed to create trip request or retrieve its data.");
    return data;
  };

  const updateTripRequest = async (formData: ExtendedTripFormValues): Promise<TripRequestFromDB> => {
    if (!userId || !tripRequestId) throw new Error("User ID or Trip Request ID is missing for update.");
    const tripRequestData = { /* ... same as before ... */
      destination_airport: formData.destination_airport,
      departure_airports: formData.departure_airports || [],
      earliest_departure: formData.earliestDeparture.toISOString(),
      latest_departure: formData.latestDeparture.toISOString(),
      min_duration: formData.min_duration,
      max_duration: formData.max_duration,
      budget: formData.budget,
      auto_book_enabled: formData.auto_book_enabled ?? false,
      max_price: formData.max_price,
      preferred_payment_method_id: formData.preferred_payment_method_id,
    };
    const { data, error } = await supabase
      .from("trip_requests")
      .update(tripRequestData)
      .eq("id", tripRequestId)
      .select()
      .single<TripRequestFromDB>();
    if (error) throw error;
    if (!data) throw new Error("Failed to update trip request or retrieve its data.");
    return data;
  };

  const navigateToConfirmation = (tripRequest: TripRequestFromDB): void => { // Typed parameter
    const actionText = tripRequestId ? "updated" : "submitted";
    const autoBookText = tripRequest.auto_book_enabled ? (tripRequestId ? ' Auto-booking settings updated.' : ' Auto-booking is enabled.') : '';
    toast({
      title: `Trip request ${actionText}`,
      description: `Your trip request has been successfully ${actionText}!${autoBookText}`,
    });
    navigate(`/trip/offers?id=${tripRequest.id}`);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (!userId) {
        toast({ title: "Authentication error", description: "You must be logged in.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      if (!validateFormData(data)) {
        setIsSubmitting(false);
        return;
      }
      
      const action = tripRequestId ? "Updating" : "Creating";
      toast({
        title: `${action} trip request`,
        description: `Please wait while we ${action.toLowerCase()} your trip request...`,
      });
      
      const transformedData = transformFormData(data);
      let resultingTripRequest: TripRequestFromDB; // Typed variable

      if (tripRequestId) {
        resultingTripRequest = await updateTripRequest(transformedData);
      } else {
        resultingTripRequest = await createTripRequest(transformedData);
      }
      
      navigateToConfirmation(resultingTripRequest);
      
    } catch (err) {
      const error = err as Error | PostgrestError;
      logger.error(`Error ${tripRequestId ? "updating" : "creating"} trip request:`, { tripRequestId, errorDetails: error });
      toast({
        title: "Error",
        description: error.message || `Failed to ${tripRequestId ? "update" : "create"} trip request. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed userLoading and userError handling for brevity, assume it's handled by a layout component or similar
  // if (userError && !userLoading) { ... }
  
  return isLoadingDetails ? (<div>Loading trip details...</div>) : (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Plan Your Trip</CardTitle>
        <CardDescription>Enter your trip preferences below.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <DateRangeSection control={form.control} />
              <BudgetSection control={form.control} />
              <TripDurationSection control={form.control} />
              <DepartureAirportsSection control={form.control} />
              <DestinationSection control={form.control} watch={form.watch} />
              <AutoBookingSection control={form.control} />

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tripRequestId ? "Updating..." : "Creating..."}
                    </>
                  ) : (tripRequestId ? "Update Trip Request" : "Create Trip Request")}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default TripRequestForm;
