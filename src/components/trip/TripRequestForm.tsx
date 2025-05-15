
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import TripDateField from "./TripDateField";
import TripNumberField from "./TripNumberField";

// Form schema with Zod validation
const formSchema = z.object({
  earliestDeparture: z.date({
    required_error: "Earliest departure date is required",
  }).refine((date) => date > new Date(), {
    message: "Earliest departure date must be in the future",
  }),
  latestDeparture: z.date({
    required_error: "Latest departure date is required",
  }).refine((date) => date > new Date(), {
    message: "Latest departure date must be in the future",
  }),
  duration: z.coerce.number().int().min(1, {
    message: "Duration must be at least 1 day",
  }).max(30, {
    message: "Duration cannot exceed 30 days",
  }),
  budget: z.coerce.number().min(100, {
    message: "Budget must be at least $100",
  }).max(10000, {
    message: "Budget cannot exceed $10,000",
  }),
}).refine((data) => data.latestDeparture > data.earliestDeparture, {
  message: "Latest departure date must be after earliest departure date",
  path: ["latestDeparture"],
});

type FormValues = z.infer<typeof formSchema>;

// Mock API response type
interface FlightSearchResponse {
  trip_request_id: string;
  offers: Array<any>;
}

const TripRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with React Hook Form and Zod resolver
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 7,
      budget: 1000,
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log("Sending form data:", data);
      
      // Mock implementation of API call
      // In a real application, this would be a fetch call to a real endpoint
      const response = await fetch('/api/search-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      // For development purposes, we'll simulate a successful response
      // Remove this mock implementation when connecting to a real API
      const mockResponse: FlightSearchResponse = {
        trip_request_id: `trip-${Date.now()}`,
        offers: [
          { 
            id: 'offer-1', 
            price: data.budget * 0.8, 
            airline: 'Mock Airlines', 
            departure_date: data.earliestDeparture.toISOString() 
          },
          { 
            id: 'offer-2', 
            price: data.budget * 0.9, 
            airline: 'Test Airways', 
            departure_date: new Date(
              data.earliestDeparture.getTime() + 24 * 60 * 60 * 1000
            ).toISOString() 
          }
        ],
      };
      
      // Simulate API response
      const responseData: FlightSearchResponse = mockResponse;
      
      // Log the offers from the response
      console.log('Received offers:', responseData?.offers);
      
      toast({
        title: "Trip request submitted",
        description: "Your trip request has been submitted successfully!",
      });
      
      // Navigate to the offers page with the trip ID
      navigate(`/trip/offers?id=${responseData.trip_request_id}`);
    } catch (error) {
      console.error("Error submitting trip request:", error);
      toast({
        title: "Error",
        description: "Failed to submit trip request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Plan Your Trip</CardTitle>
        <CardDescription>Enter your trip preferences below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TripDateField 
              name="earliestDeparture"
              label="Earliest Departure Date"
              description="The earliest date you can depart for your trip."
            />

            <TripDateField 
              name="latestDeparture"
              label="Latest Departure Date"
              description="The latest date you can depart for your trip."
            />

            <TripNumberField 
              name="duration"
              label="Duration (days)"
              description="How many days will your trip last? (1-30)"
              placeholder="Enter trip duration"
            />

            <TripNumberField 
              name="budget"
              label="Budget (USD)"
              description="Your budget for the trip ($100-$10,000)"
              placeholder="Enter your budget"
              prefix="$"
            />

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
