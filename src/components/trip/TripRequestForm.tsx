
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

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

const TripRequestForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Get the current user ID when component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);
  
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
      
      if (!userId) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a trip request.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Sending form data:", data);
      
      // Create a typed insert object for trip_requests
      const tripRequestData: TablesInsert<"trip_requests"> = {
        user_id: userId,
        earliest_departure: data.earliestDeparture.toISOString(),
        latest_departure: data.latestDeparture.toISOString(),
        duration: data.duration,
        budget: data.budget
      };
      
      // Insert trip request into Supabase with proper types
      const { data: tripRequest, error } = await supabase
        .from("trip_requests")
        .insert(tripRequestData)
        .select()
        .single();
      
      if (error) {
        console.error("Error submitting trip request:", error);
        toast({
          title: "Error",
          description: `Failed to submit trip request: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log("Trip request created:", tripRequest);
      
      // Generate mock offers for now (will be replaced with real offers in the future)
      const mockOffers = [
        { 
          id: 'offer-1', 
          price: data.budget * 0.8, 
          airline: 'Mock Airlines',
          flight_number: 'MA1234',
          departure_date: data.earliestDeparture.toISOString().split('T')[0],
          departure_time: '08:30',
          return_date: new Date(data.earliestDeparture.getTime() + data.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          return_time: '10:45',
          duration: '2h 15m'
        },
        { 
          id: 'offer-2', 
          price: data.budget * 0.9, 
          airline: 'Test Airways',
          flight_number: 'TA5678',
          departure_date: new Date(
            data.earliestDeparture.getTime() + 24 * 60 * 60 * 1000
          ).toISOString().split('T')[0],
          departure_time: '14:20',
          return_date: new Date(data.earliestDeparture.getTime() + (data.duration + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          return_time: '16:30',
          duration: '2h 45m'
        }
      ];
      
      toast({
        title: "Trip request submitted",
        description: "Your trip request has been submitted successfully!",
      });
      
      // Navigate to the offers page with the trip ID and trip details
      // Added null check for tripRequest
      navigate(`/trip/offers?id=${tripRequest?.id || ''}`, { 
        state: { 
          tripDetails: {
            earliestDeparture: data.earliestDeparture.toISOString(),
            latestDeparture: data.latestDeparture.toISOString(),
            duration: data.duration,
            budget: data.budget
          },
          offers: mockOffers
        } 
      });
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
