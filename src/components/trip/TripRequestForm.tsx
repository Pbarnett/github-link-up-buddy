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
import { Loader2, ArrowLeft } from "lucide-react";
import { TripRequestFromDB } from "@/hooks/useTripOffers";
import { PostgrestError } from "@supabase/supabase-js";
import logger from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import DateRangeField from "./DateRangeField";
import DurationRangeField from "./DurationRangeField";
import EnhancedDestinationSection from "./sections/EnhancedDestinationSection";
import EnhancedBudgetSection from "./sections/EnhancedBudgetSection";
import AdvancedOptionsPanel from "./AdvancedOptionsPanel";
import StickyFormActions from "./StickyFormActions";
import BookingMethodSection from "./sections/BookingMethodSection";

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
  const { userId } = useCurrentUser();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const isMobile = useIsMobile();
  
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
      let resultingTripRequest: TripRequestFromDB;

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

  // Check if required fields are filled for enabling submit button
  const watchedFields = form.watch();
  const isFormValid = Boolean(
    watchedFields.earliestDeparture &&
    watchedFields.latestDeparture &&
    watchedFields.budget &&
    watchedFields.min_duration &&
    watchedFields.max_duration &&
    ((watchedFields.nyc_airports && watchedFields.nyc_airports.length > 0) || watchedFields.other_departure_airport) &&
    (watchedFields.destination_airport || watchedFields.destination_other)
  );

  const buttonText = watchedFields.auto_book_enabled 
    ? (tripRequestId ? "Update Auto-Booking" : "Enable Auto-Booking")
    : (tripRequestId ? "Update Trip Request" : "Search Now");

  return isLoadingDetails ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading trip details...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mx-auto w-full max-w-6xl">
        {/* Header with back link */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </button>
          <div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              Plan Your Trip
            </h1>
            <p className="text-gray-600 mt-1">Enter the parameters for your trip below.</p>
          </div>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
              {/* Responsive Grid Layout */}
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2 lg:gap-8'}`}>
                {/* Left Column */}
                <div className={`space-y-${isMobile ? '6' : '4 lg:space-y-3'}`}>
                  <EnhancedDestinationSection control={form.control} watch={form.watch} />
                  <DateRangeField control={form.control} />
                  <EnhancedBudgetSection control={form.control} />
                </div>

                {/* Right Column */}
                <div className={`space-y-${isMobile ? '6' : '4 lg:space-y-3'}`}>
                  <DurationRangeField control={form.control} />
                  <AdvancedOptionsPanel control={form.control} watch={form.watch} />
                  <BookingMethodSection control={form.control} />
                </div>
              </div>

              {/* Regular Form Actions (Mobile + fallback) */}
              <div className="pt-8 border-t border-gray-200 mt-8">
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 h-11"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !isFormValid} 
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium disabled:opacity-50 min-w-[160px] h-11"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {tripRequestId ? "Updating..." : "Processing..."}
                      </>
                    ) : buttonText}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </FormProvider>

        {/* Sticky Actions for Desktop */}
        <StickyFormActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          buttonText={buttonText}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default TripRequestForm;
