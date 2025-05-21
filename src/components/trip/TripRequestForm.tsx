
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
import { FormValues, tripFormSchema } from "@/types/form";

// Import the section components
import DateRangeSection from "./sections/DateRangeSection";
import BudgetSection from "./sections/BudgetSection";
import TripDurationSection from "./sections/TripDurationSection";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";
import DestinationSection from "./sections/DestinationSection";
import AutoBookingSection from "./sections/AutoBookingSection";

const TripRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userId, loading: userLoading, error: userError } = useCurrentUser();
  
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
      auto_book_enabled: false,
      max_price: null,
      preferred_payment_method_id: null,
    },
  });

  // Form submission handler
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
      
      if (!destinationAirport) {
        toast({
          title: "Validation error",
          description: "Please select a destination or enter a custom one.",
          variant: "destructive",
        });
        return;
      }
      
      // Use the tripService to create the trip request with new fields
      const result = await createTripRequest(userId, {
        earliestDeparture: data.earliestDeparture,
        latestDeparture: data.latestDeparture,
        min_duration: data.min_duration,
        max_duration: data.max_duration,
        budget: data.budget,
        departure_airports: departureAirports,
        destination_airport: destinationAirport,
        // Add auto-booking fields
        auto_book_enabled: data.auto_book_enabled,
        max_price: data.max_price,
        preferred_payment_method_id: data.preferred_payment_method_id,
      });
      
      // Show success toast with count of offers saved
      toast({
        title: "Trip request submitted",
        description: `Your trip request has been submitted with ${result.offersCount} flight offers!${
          data.auto_book_enabled ? ' Auto-booking is enabled.' : ''
        }`,
      });
      
      // Navigate to the offers page with the trip ID
      navigate(`/trip/offers?id=${result.tripRequest.id}`);
      
    } catch (error: any) {
      console.error("Error submitting trip request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit trip request. Please try again.",
        variant: "destructive",
      });
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
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TripRequestForm;
