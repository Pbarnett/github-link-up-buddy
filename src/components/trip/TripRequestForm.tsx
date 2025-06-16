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
import { invokeFlightSearch } from "@/services/api/flightSearchApi";
import { useIsMobile } from "@/hooks/use-mobile";
import DateRangeField from "./DateRangeField";
import EnhancedDestinationSection from "./sections/EnhancedDestinationSection";
import EnhancedBudgetSection from "./sections/EnhancedBudgetSection";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";
import TripDurationInputs from "./sections/TripDurationInputs";
import AutoBookingSection from "./sections/AutoBookingSection";
import StickyFormActions from "./StickyFormActions";
import FilterTogglesSection from "./sections/FilterTogglesSection";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { validateFormData, isFormValid } from "@/lib/tripFormValidation";
import { transformFormData } from "@/lib/tripFormTransformers";
import { categorizeAirports } from "@/lib/airportUtils";
import {
  fetchTripRequest,
  createTripRequest,
  updateTripRequest,
} from "@/services/tripService";

interface TripRequestFormProps {
  tripRequestId?: string;
  mode?: 'manual' | 'auto';
}

const TripRequestForm = ({ tripRequestId, mode = 'manual' }: TripRequestFormProps) => {
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
      nonstop_required: true,
      baggage_included_required: false,
      auto_book_enabled: mode === 'auto', // Set based on mode
      max_price: null,
      preferred_payment_method_id: null,
    },
  });

  // Helper function for navigation after submit
  function navigateToConfirmation(tripRequest: TripRequestFromDB) {
    if (tripRequest && tripRequest.id) {
      navigate(`/trip/confirm/${tripRequest.id}`);
    } else {
      navigate("/trip/confirm"); // fallback if id is missing
    }
  }

  useEffect(() => {
    if (tripRequestId) {
      const fetchData = async () => {
        setIsLoadingDetails(true);
        try {
          const tripData = await fetchTripRequest(tripRequestId);
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
              nonstop_required: tripData.nonstop_required ?? true,
              baggage_included_required: tripData.baggage_included_required ?? false,
              auto_book_enabled: tripData.auto_book_enabled ?? false,
              max_price: tripData.max_price,
              preferred_payment_method_id: tripData.preferred_payment_method_id,
            });
          }
        } catch (err) {
          // Error toast already handled in service
        } finally {
          setIsLoadingDetails(false);
        }
      };
      fetchData();
    } else {
      form.reset(form.formState.defaultValues);
    }
  }, [tripRequestId, form]);

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

      console.log("Form data before transform:", data);

      const action = tripRequestId ? "Updating" : "Creating";
      toast({
        title: `${action} trip request`,
        description: `Please wait while we ${action.toLowerCase()} your trip request...`,
      });

      const transformedData = transformFormData(data);
      let resultingTripRequest: TripRequestFromDB;

      if (tripRequestId) {
        // Use service function for update
        resultingTripRequest = await updateTripRequest(userId, tripRequestId, transformedData);
      } else {
        // Use service function for create
        resultingTripRequest = await createTripRequest(userId, transformedData);
        try {
          const timeDiff = transformedData.latestDeparture.getTime() - transformedData.earliestDeparture.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

          toast({
            title: "Searching for flights",
            description: `Analyzing ${daysDiff} days of flight options...`,
          });

          await invokeFlightSearch({
            tripRequestId: resultingTripRequest.id,
            relaxedCriteria: false
          });

          toast({
            title: "Flight search initiated",
            description: "We're finding the best flight options for your trip.",
          });

        } catch (err) {
          console.error('[invokeFlightSearch] raw error →', err);
          console.error('[invokeFlightSearch] typeof →', typeof err);
          console.error('[invokeFlightSearch] keys →', Object.keys(err || {}));
          if (err && typeof err === 'object' && 'status' in err) {
            // Supabase FunctionsHttpError exposes .status / .context
            // @ts-expect-error dynamic check
            console.error('[invokeFlightSearch] status →', err.status);
            // @ts-expect-error
            if (err.context) console.error('[invokeFlightSearch] context →', err.context);
          }
          toast({
            variant: 'destructive',
            title: 'Flight search failed',
            description: typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err),
          });
          throw err;
        }
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

  const watchedFields = form.watch();
  const isFormValidState = isFormValid(watchedFields, mode);

  const buttonText = mode === 'auto' 
    ? (tripRequestId ? "Update Auto-Booking" : "Enable Auto-Booking")
    : (watchedFields.auto_book_enabled 
        ? (tripRequestId ? "Update Auto-Booking" : "Enable Auto-Booking")
        : (tripRequestId ? "Update Trip Request" : "Search Now"));

  const getPageTitle = () => {
    if (mode === 'auto') return 'Set Up Auto-Booking';
    return 'Plan Your Trip';
  };

  const getPageDescription = () => {
    if (mode === 'auto') return 'Configure your travel preferences and booking criteria below.';
    return 'Enter the parameters for your trip below.';
  };

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
            onClick={() => navigate("/trip/new")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {mode === 'auto' ? 'Auto-Booking Setup' : 'New Search'}
          </button>
          <div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
              {/* Responsive Grid Layout */}
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2 lg:gap-8'}`}>
                {/* Left Column */}
                <div className="space-y-6 bg-white rounded-lg border border-gray-100 p-6">
                  <EnhancedDestinationSection control={form.control} watch={form.watch} />
                  <DepartureAirportsSection control={form.control} />
                  <DateRangeField control={form.control} />
                  <EnhancedBudgetSection control={form.control} />
                  <TripDurationInputs control={form.control} />
                </div>

                {/* Right Column */}
                <div className="space-y-6 bg-white rounded-lg border border-gray-100 p-6">
                  {/* Show AutoBookingSection for auto mode or when feature flag is disabled */}
                  {(mode === 'auto' || !useFeatureFlag("auto_booking_v2")) && (
                    <AutoBookingSection control={form.control} mode={mode} />
                  )}
                  {/* --- Filter Toggles Section --- */}
                  <FilterTogglesSection control={form.control} isLoading={isSubmitting || isLoadingDetails} />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200 mt-8">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/trip/new")} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 h-11"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !isFormValidState} 
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
          isFormValid={isFormValidState}
          buttonText={buttonText}
          onSubmit={form.handleSubmit(onSubmit)}
        />
      </div>
    </div>
  );
};

export default TripRequestForm;
