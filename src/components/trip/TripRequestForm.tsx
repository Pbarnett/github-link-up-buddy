
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { createTripRequest } from "@/services/tripService";
import { TripFormValues } from "@/services/mockOffers";

// Import the section components
import DateRangeSection from "./sections/DateRangeSection";
import DepartureAirportsSection from "./sections/DepartureAirportsSection";
import DestinationSection from "./sections/DestinationSection";
import TripDurationSection from "./sections/TripDurationSection";
import BudgetSection from "./sections/BudgetSection";

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
  min_duration: z.coerce.number().int().min(1, {
    message: "Minimum duration must be at least 1 day",
  }).max(30, {
    message: "Minimum duration cannot exceed 30 days",
  }),
  max_duration: z.coerce.number().int().min(1, {
    message: "Maximum duration must be at least 1 day",
  }).max(30, {
    message: "Maximum duration cannot exceed 30 days",
  }),
  budget: z.coerce.number().min(100, {
    message: "Budget must be at least $100",
  }).max(10000, {
    message: "Budget cannot exceed $10,000",
  }),
  nyc_airports: z.array(z.string()).optional(),
  other_departure_airport: z.string().optional(),
  destination_airport: z.string().optional(),
  destination_other: z.string().optional(),
}).refine((data) => data.latestDeparture > data.earliestDeparture, {
  message: "Latest departure date must be after earliest departure date",
  path: ["latestDeparture"],
}).refine((data) => data.max_duration >= data.min_duration, {
  message: "Maximum duration must be greater than or equal to minimum duration",
  path: ["max_duration"],
}).refine((data) => {
  const hasNycAirports = data.nyc_airports && data.nyc_airports.length > 0;
  const hasOtherAirport = !!data.other_departure_airport;
  return hasNycAirports || hasOtherAirport;
}, {
  message: "At least one departure airport must be selected",
  path: ["nyc_airports"],
}).refine((data) => {
  return !!data.destination_airport || !!data.destination_other;
}, {
  message: "Please select a destination or enter a custom one",
  path: ["destination_airport"],
});

type FormValues = z.infer<typeof formSchema>;

const TripRequestForm = () => {
  console.log("TripRequestForm rendering");
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
      min_duration: 3,
      max_duration: 7,
      budget: 1000,
      nyc_airports: [],
      other_departure_airport: "",
      destination_airport: "",
      destination_other: "",
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
      
      console.log("Sending form data:", {
        ...data,
        departure_airports: departureAirports,
        destination_airport: destinationAirport
      });
      
      // Construct a valid TripFormValues object for backward compatibility
      const tripFormData: TripFormValues = {
        earliestDeparture: data.earliestDeparture,
        latestDeparture: data.latestDeparture,
        min_duration: data.min_duration,
        max_duration: data.max_duration,
        budget: data.budget
      };
      
      // Use the tripService to create the trip request with new fields
      const result = await createTripRequest(userId, {
        ...tripFormData,
        departure_airports: departureAirports,
        destination_airport: destinationAirport,
      });
      
      // Show success toast with count of offers saved
      toast({
        title: "Trip request submitted",
        description: `Your trip request has been submitted with ${result.offersCount} flight offers!`,
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

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Plan Your Trip</CardTitle>
        <CardDescription>Enter your trip preferences below.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Temporary div to verify rendering */}
        <div>hello - form is rendering</div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date range section */}
            <DateRangeSection control={form.control} />
            
            {/* Departure airports section */}
            <DepartureAirportsSection control={form.control} />
            
            {/* Destination section - now with watch prop */}
            <DestinationSection control={form.control} watch={form.watch} />

            {/* Trip duration section */}
            <TripDurationSection control={form.control} />

            {/* Budget section */}
            <BudgetSection control={form.control} />

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
