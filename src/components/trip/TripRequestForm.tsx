
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { createTripRequest } from "@/services/tripService";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Import type definitions
import { FormValues, tripFormSchema, ExtendedTripFormValues, TripRequestResult } from "@/types/form";

// Import the section components
import DateRangeSection from "./sections/DateRangeSection";
import BudgetSection from "./sections/BudgetSection";
import TripDurationSection from "./sections/TripDurationSection";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";
import DestinationSection from "./sections/DestinationSection";
import AutoBookingSection from "./sections/AutoBookingSection";
import { Loader2 } from "lucide-react";

const TripRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId, loading: userLoading, error: userError } = useCurrentUser();
  
  // Initialize form with React Hook Form and Zod resolver
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
      // Auto-booking defaults
      auto_book: false,
      max_price: null,
      preferred_payment_method_id: null,
    },
  });

  // Validate form data and handle any custom validations
  const validateFormData = (data: FormValues): boolean => {
    // Check if destination airport is provided
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

  // Transform form data into the extended format needed by the API
  const transformFormData = (data: FormValues): ExtendedTripFormValues => {
    // Combine NYC airports and other departure airports
    const departureAirports: string[] = [];
    
    if (data.nyc_airports && data.nyc_airports.length > 0) {
      departureAirports.push(...data.nyc_airports);
    }
    
    if (data.other_departure_airport) {
      departureAirports.push(data.other_departure_airport);
    }
    
    // Use destination_airport or fallback to destination_other
    const destinationAirport = data.destination_airport || data.destination_other || "";
    
    return {
      earliestDeparture: data.earliestDeparture,
      latestDeparture: data.latestDeparture,
      min_duration: data.min_duration,
      max_duration: data.max_duration,
      budget: data.budget,
      departure_airports: departureAirports,
      destination_airport: destinationAirport,
      // Add auto-booking fields
      auto_book: data.auto_book,
65veya-codex/fix-edge-function-import-issue
      max_price: data.max_price ?? null,
      preferred_payment_method_id: data.preferred_payment_method_id ?? null,
    };
  };

  // Submit the trip request to the API
  const submitTripRequest = async (formData: ExtendedTripFormValues): Promise<TripRequestResult> => {
    if (!userId) {
      throw new Error("You must be logged in to create a trip request.");
    }
    
    return await createTripRequest(userId, formData);
  };

  // Navigate to the confirmation page with the trip ID
  const navigateToConfirmation = (result: TripRequestResult): void => {
    // Show success toast informing the user about asynchronous flight search
    toast({
      title: "Trip request submitted",
      description: `Your trip request has been submitted successfully. Flight search is now in progress.${
        result.tripRequest.auto_book ? ' Auto-booking is enabled.' : ''
      }`,
    });

    // Navigate to the offers page with the trip ID and any immediate offers
    navigate(`/trip/offers?id=${result.tripRequest.id}`, { state: { offers: result.offers } });
  };

  // Main form submission handler that orchestrates the process
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a trip request.",
          variant: "destructive",
        });
        return;
      }
      
      // Step 1: Validate form data
      if (!validateFormData(data)) {
        setIsSubmitting(false);
        return;
      }
      
      // Display an initial toast notification
      toast({
        title: "Processing your request",
        description: "Creating your trip request and initiating flight search...",
      });
      
      // Step 2: Transform form data
      const transformedData = transformFormData(data);
      
      // Step 3: Submit trip request
      const result = await submitTripRequest(transformedData);
      
      // Step 4: Navigate to confirmation page
      navigateToConfirmation(result);
      
    } catch (error: any) {
      toast({ title: "Submission Failed", description: error.message || "Could not submit your trip request. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if user authentication fails
  if (userError && !userLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>There was a problem authenticating your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{userError.message}</p>
          <div className="pt-4">
            <Button onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Plan Your Trip</CardTitle>
        <CardDescription>Enter your trip preferences below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* DateRangeSection */}
            <DateRangeSection control={form.control} />
            
            {/* BudgetSection */}
            <BudgetSection control={form.control} />
            
            {/* TripDurationSection */}
            <TripDurationSection control={form.control} />
            
            {/* DepartureAirportsSection */}
            <DepartureAirportsSection control={form.control} />
            
            {/* DestinationSection */}
            <DestinationSection control={form.control} watch={form.watch} />
            
            {/* Auto-booking section */}
            <AutoBookingSection control={form.control} watch={form.watch} />
            
            <div className="pt-4 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : "Create Trip Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TripRequestForm;
