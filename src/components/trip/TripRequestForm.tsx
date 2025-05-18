
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

// Generate mock flight offers based on trip details
const generateMockOffers = (tripData: FormValues, tripRequestId: string): TablesInsert<"flight_offers">[] => {
  // Generate dates for departures and returns based on the trip parameters
  const startDate = new Date(tripData.earliestDeparture);
  const endDate = new Date(tripData.latestDeparture);
  const dayDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Airlines and flight durations for mock data
  const airlines = [
    "Delta Airlines",
    "United Airways", 
    "American Airlines",
    "JetBlue",
    "Southwest",
    "Alaska Airlines",
    "British Airways"
  ];
  
  const durations = ["1h 45m", "2h 15m", "2h 30m", "2h 45m", "3h 05m", "3h 25m"];
  
  // Generate 5-8 mock offers
  const numOffers = Math.floor(Math.random() * 4) + 5;
  const offers: TablesInsert<"flight_offers">[] = [];
  
  for (let i = 0; i < numOffers; i++) {
    // Random departure date between earliest and latest departure
    const departDaysOffset = Math.floor(Math.random() * (dayDiff + 1));
    const departDate = new Date(startDate);
    departDate.setDate(departDate.getDate() + departDaysOffset);
    
    // Return date based on duration
    const returnDate = new Date(departDate);
    returnDate.setDate(returnDate.getDate() + tripData.duration);
    
    // Random price around budget with some variation
    const priceVariation = Math.random() * 0.3 - 0.15; // -15% to +15%
    const price = Math.round(tripData.budget * (1 + priceVariation));
    
    // Random airline and flight duration
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    
    // Random flight number
    const flightCode = airline.substring(0, 2).toUpperCase();
    const flightNumber = `${flightCode}${1000 + Math.floor(Math.random() * 9000)}`;
    
    // Random departure and return times
    const hours = ["06", "08", "10", "12", "14", "16", "18", "20"];
    const minutes = ["00", "15", "30", "45"];
    const departureTime = `${hours[Math.floor(Math.random() * hours.length)]}:${minutes[Math.floor(Math.random() * minutes.length)]}`;
    const returnTime = `${hours[Math.floor(Math.random() * hours.length)]}:${minutes[Math.floor(Math.random() * minutes.length)]}`;
    
    offers.push({
      trip_request_id: tripRequestId,
      airline,
      flight_number: flightNumber,
      departure_date: departDate.toISOString().split('T')[0],
      departure_time: departureTime,
      return_date: returnDate.toISOString().split('T')[0],
      return_time: returnTime,
      duration,
      price
    });
  }
  
  return offers;
};

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
      
      // Generate mock offers based on the trip details
      const mockOffers = generateMockOffers(data, tripRequest.id);
      
      // Store the offers in Supabase and explicitly await the response
      const { data: offersData, error: offersError } = await supabase
        .from("flight_offers")
        .insert(mockOffers)
        .select();
      
      if (offersError) {
        console.error("Error storing flight offers:", offersError);
        toast({
          title: "Error",
          description: `Failed to save flight offers: ${offersError.message}`,
          variant: "destructive",
        });
        // Don't navigate since the offers insert failed
        return;
      } else {
        // Log the inserted offers to console
        console.log("Inserted offers:", offersData);
        
        // Show success toast with count of offers saved
        toast({
          title: "Trip request submitted",
          description: `Your trip request has been submitted with ${offersData?.length || 0} flight offers!`,
        });
        
        // Navigate to the offers page with only the trip ID
        navigate(`/trip/offers?id=${tripRequest.id}`);
      }
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
