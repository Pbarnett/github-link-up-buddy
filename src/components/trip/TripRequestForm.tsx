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
import AutoBookingSection from "./sections/AutoBookingSection.tsx";
import StickyFormActions from "./StickyFormActions";
import FilterTogglesSection from "./sections/FilterTogglesSection";
import LiveBookingSummary from "./LiveBookingSummary";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

interface TripRequestFormProps {
  tripRequestId?: string;
  mode?: 'manual' | 'auto';
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

const TripRequestForm = ({ tripRequestId, mode = 'manual' }: TripRequestFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useCurrentUser();
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      min_duration: 3,
      max_duration: 7,
      max_price: 1000, // Consolidated from budget
      nyc_airports: [],
      other_departure_airport: "",
      destination_airport: "",
      destination_other: "",
      nonstop_required: true,
      baggage_included_required: false,
      auto_book_enabled: mode === 'auto', // Set based on mode
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
              max_price: tripData.max_price || tripData.budget || 1000, // Use max_price, fallback to budget for backward compatibility
              nyc_airports: nycAirports,
              other_departure_airport: otherAirport,
              destination_airport: tripData.destination_airport?.length === 3 && tripData.destination_airport === tripData.destination_airport?.toUpperCase() ? tripData.destination_airport : "",
              destination_other: tripData.destination_airport?.length !== 3 || tripData.destination_airport !== tripData.destination_airport?.toUpperCase() ? tripData.destination_airport : "",
              nonstop_required: tripData.nonstop_required ?? true,
              baggage_included_required: tripData.baggage_included_required ?? false,
              auto_book_enabled: tripData.auto_book_enabled ?? false, // Use nullish coalescing
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
      budget: data.max_price, // Map max_price to budget field for backend compatibility
      departure_airports: departureAirports,
      destination_airport: destinationAirport,
      destination_location_code: destinationAirport, // Same as destination_airport for now
      nonstop_required: data.nonstop_required,
      baggage_included_required: data.baggage_included_required,
      auto_book_enabled: data.auto_book_enabled,
      max_price: data.max_price,
      preferred_payment_method_id: data.preferred_payment_method_id,
    };
  };

  const createTripRequest = async (formData: ExtendedTripFormValues): Promise<TripRequestFromDB> => {
    if (!userId) throw new Error("You must be logged in to create a trip request.");
    const tripRequestData = {
      user_id: userId,
      destination_airport: formData.destination_airport,
      destination_location_code: formData.destination_airport, // Add this field
      departure_airports: formData.departure_airports || [],
      earliest_departure: formData.earliestDeparture.toISOString(),
      latest_departure: formData.latestDeparture.toISOString(),
      min_duration: formData.min_duration,
      max_duration: formData.max_duration,
      budget: formData.budget,
      nonstop_required: formData.nonstop_required ?? true,
      baggage_included_required: formData.baggage_included_required ?? false,
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
    const tripRequestData = {
      destination_airport: formData.destination_airport,
      destination_location_code: formData.destination_airport, // Add this field
      departure_airports: formData.departure_airports || [],
      earliest_departure: formData.earliestDeparture.toISOString(),
      latest_departure: formData.latestDeparture.toISOString(),
      min_duration: formData.min_duration,
      max_duration: formData.max_duration,
      budget: formData.budget,
      nonstop_required: formData.nonstop_required ?? true,
      baggage_included_required: formData.baggage_included_required ?? false,
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
    navigate(`/trip/offers?id=${tripRequest.id}&mode=${mode}`);
  };

  const handleContinueToPricing = async () => {
    // Validate only Step 1 fields
    const step1Fields = [
      'destination_airport',
      'destination_other', 
      'nyc_airports',
      'other_departure_airport',
      'earliestDeparture',
      'latestDeparture',
      'min_duration',
      'max_duration'
    ];
    
    const isStep1Valid = await form.trigger(step1Fields);
    
    if (!isStep1Valid) {
      // Validation failed - errors will be displayed automatically
      return;
    }
    
    // Advance to step 2
    setCurrentStep(2);
    
    // Scroll to top and focus on max price field
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Give DOM time to paint, then move focus
    requestAnimationFrame(() => {
      const maxPriceInput = document.querySelector('input[name="max_price"]') as HTMLInputElement;
      if (maxPriceInput) {
        maxPriceInput.focus();
      }
    });
  };

  const handleStepSubmit = async (data: FormValues) => {
    // For auto mode step 1, use the new continue handler
    if (mode === 'auto' && currentStep === 1) {
      await handleContinueToPricing();
      return;
    }
    
    // Otherwise, proceed with actual submission
    await onSubmit(data);
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

      console.log("Form data before transform:", data);
      // Specifically to check data.preferred_payment_method_id when auto_book_enabled is true
      
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
        
        // 🎯 INTELLIGENT FLIGHT SEARCH TRIGGER for new trips
        try {
          // Calculate date range to determine search strategy
          const timeDiff = transformedData.latestDeparture.getTime() - transformedData.earliestDeparture.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
          
          toast({
            title: "Searching for flights",
            description: `Analyzing ${daysDiff} days of flight options...`,
          });
          
          // Trigger flight search with appropriate strategy
          await invokeFlightSearch({
            tripRequestId: resultingTripRequest.id,
            relaxedCriteria: false
          });
          
          toast({
            title: "Flight search initiated",
            description: "We're finding the best flight options for your trip.",
          });
          
        } catch (searchError) {
          // Don't block navigation if search fails - user can retry on offers page
          console.warn('Flight search failed during form submission:', searchError);
          toast({
            title: "Search in progress",
            description: "Flight search will continue on the next page.",
          });
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

  // Check if required fields are filled for enabling submit button
  const watchedFields = form.watch();
  
  const isStep1Valid = Boolean(
    watchedFields.earliestDeparture &&
    watchedFields.latestDeparture &&
    watchedFields.min_duration &&
    watchedFields.max_duration &&
    ((watchedFields.nyc_airports && watchedFields.nyc_airports.length > 0) || watchedFields.other_departure_airport) &&
    (watchedFields.destination_airport || watchedFields.destination_other)
  );
  
  const isStep2Valid = Boolean(
    watchedFields.max_price &&
    watchedFields.preferred_payment_method_id &&
    (mode !== 'auto' || watchedFields.auto_book_consent)
  );
  
  const isFormValid = mode === 'auto' 
    ? (currentStep === 1 ? isStep1Valid : isStep1Valid && isStep2Valid)
    : isStep1Valid && (mode === 'manual' || isStep2Valid);

  const buttonText = () => {
    if (mode === 'auto') {
      if (currentStep === 1) return "Continue → Pricing";
      return tripRequestId ? "Update Auto-Booking" : "Start Auto-Booking";
    }
    return watchedFields.auto_book_enabled 
      ? (tripRequestId ? "Update Auto-Booking" : "Start Auto-Booking")
      : (tripRequestId ? "Update Trip Request" : "Search Now");
  };

  const getPageTitle = () => {
    if (mode === 'auto') {
      if (currentStep === 1) return 'Trip Basics';
      return 'Price & Payment';
    }
    return 'Plan Your Trip';
  };

  const getPageDescription = () => {
    if (mode === 'auto') {
      if (currentStep === 1) return 'Tell us where and when you want to travel.';
      return 'Set your price limit and payment method.';
    }
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
      <div className="mx-auto w-full max-w-7xl">
        <div className={`grid gap-6 ${mode === 'auto' && !isMobile ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
          {/* Main Form Column */}
          <div className={`${mode === 'auto' && !isMobile ? 'lg:col-span-2' : 'col-span-1'}`}>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
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
            <form onSubmit={form.handleSubmit(handleStepSubmit)} className="p-6">
              {/* Step Indicator for Auto Mode */}
              {mode === 'auto' && (
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      1
                    </div>
                    <div className="text-sm text-gray-500">Trip Basics</div>
                    <div className="w-12 h-px bg-gray-300"></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      2
                    </div>
                    <div className="text-sm text-gray-500">Price & Payment</div>
                  </div>
                </div>
              )}

              {/* Step 1: Trip Basics (for auto mode) or All fields (for manual mode) */}
              {(mode === 'manual' || currentStep === 1) && (
                <>
                  {/* Primary Travel Details */}
                  <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {mode === 'auto' ? 'Where & When' : 'Travel Details'}
                    </h2>
                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2 lg:gap-8'}`}>
                      <EnhancedDestinationSection control={form.control} watch={form.watch} />
                      <DepartureAirportsSection control={form.control} />
                    </div>
                    <div className="mt-6">
                      <DateRangeField control={form.control} />
                    </div>
                  </div>

                  {/* Trip Duration for Step 1 */}
                  <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Trip Length
                    </h2>
                    <TripDurationInputs control={form.control} />
                  </div>
                </>
              )}

              {/* Step 2: Price & Payment (auto mode only) */}
              {mode === 'auto' && currentStep === 2 && (
                <>
                  <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Maximum Price
                    </h2>
                    <EnhancedBudgetSection control={form.control} />
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Payment & Authorization
                    </h2>
                    <AutoBookingSection control={form.control} mode={mode} />
                  </div>
                </>
              )}

              {/* Manual mode: Show budget in Trip Preferences */}
              {mode === 'manual' && (
                <div className="bg-slate-50 rounded-lg border border-gray-200 p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Budget
                  </h2>
                  <EnhancedBudgetSection control={form.control} />
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200 mt-8">
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      if (mode === 'auto' && currentStep === 2) {
                        setCurrentStep(1);
                      } else {
                        navigate("/trip/new");
                      }
                    }} 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 h-11"
                  >
                    {mode === 'auto' && currentStep === 2 ? '← Back to Basics' : 'Back'}
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
                    ) : buttonText()}
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
              buttonText={buttonText()}
              onSubmit={form.handleSubmit(handleStepSubmit)}
            />
            </div>
          </div>

          {/* Right Column: Live Summary (Auto Mode Only) */}
          {mode === 'auto' && (
            <div className={`${isMobile ? 'order-first' : 'lg:col-span-1'}`}>
              <LiveBookingSummary 
                control={form.control} 
                isVisible={mode === 'auto'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripRequestForm;
