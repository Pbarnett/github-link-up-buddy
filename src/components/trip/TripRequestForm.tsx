
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TripDateField from "./TripDateField";
import TripNumberField from "./TripNumberField";
import { supabase } from "@/integrations/supabase/client";
import { createTripRequest } from "@/services/tripService";
import { TripFormValues } from "@/services/mockOffers";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, MapPin, Plane } from "lucide-react";

// Available airports data
const AIRPORTS = [
  { code: "JFK", name: "New York (JFK)" },
  { code: "LAX", name: "Los Angeles (LAX)" },
  { code: "SFO", name: "San Francisco (SFO)" },
  { code: "ORD", name: "Chicago (ORD)" },
  { code: "MIA", name: "Miami (MIA)" },
  { code: "LHR", name: "London (LHR)" },
  { code: "CDG", name: "Paris (CDG)" },
  { code: "FCO", name: "Rome (FCO)" },
  { code: "MAD", name: "Madrid (MAD)" },
  { code: "TYO", name: "Tokyo (TYO)" },
];

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
  departure_airports: z.array(z.string()).min(1, {
    message: "Select at least one departure airport",
  }),
  destination_airport: z.string({
    required_error: "Destination airport is required",
  }),
}).refine((data) => data.latestDeparture > data.earliestDeparture, {
  message: "Latest departure date must be after earliest departure date",
  path: ["latestDeparture"],
}).refine((data) => data.max_duration >= data.min_duration, {
  message: "Maximum duration must be greater than or equal to minimum duration",
  path: ["max_duration"],
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
      min_duration: 3,
      max_duration: 7,
      budget: 1000,
      departure_airports: [],
      destination_airport: "",
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
      
      // Construct a valid TripFormValues object for backward compatibility
      const tripFormData: TripFormValues = {
        earliestDeparture: data.earliestDeparture,
        latestDeparture: data.latestDeparture,
        duration: data.max_duration, // Use max_duration for compatibility with existing code
        budget: data.budget
      };
      
      // Use the tripService to create the trip request with new fields
      const result = await createTripRequest(userId, {
        ...tripFormData,
        departure_airports: data.departure_airports,
        destination_airport: data.destination_airport,
        min_duration: data.min_duration,
        max_duration: data.max_duration
      });
      
      // Log the inserted offers to console
      console.log("Inserted offers:", result.offers);
      
      // Show success toast with count of offers saved
      toast({
        title: "Trip request submitted",
        description: `Your trip request has been submitted with ${result.offersCount} flight offers!`,
      });
      
      // Navigate to the offers page with only the trip ID
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

  // Get selected departure airport names for display
  const getSelectedDepartureAirportsText = () => {
    const selectedAirports = form.watch("departure_airports");
    if (selectedAirports.length === 0) return "Select departure airports";
    if (selectedAirports.length === 1) return AIRPORTS.find(a => a.code === selectedAirports[0])?.name || selectedAirports[0];
    return `${selectedAirports.length} airports selected`;
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
            
            {/* Departure Airports Multi-select */}
            <FormField
              control={form.control}
              name="departure_airports"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Airports</FormLabel>
                  <FormDescription>Select one or more airports you're willing to depart from.</FormDescription>
                  <DropdownMenu>
                    <FormControl>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4" />
                            <span>{getSelectedDepartureAirportsText()}</span>
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                    </FormControl>
                    <DropdownMenuContent className="w-full max-h-64 overflow-auto">
                      {AIRPORTS.map((airport) => (
                        <DropdownMenuCheckboxItem
                          key={airport.code}
                          checked={field.value?.includes(airport.code)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, airport.code]
                              : field.value.filter((value) => value !== airport.code);
                            field.onChange(updatedValue);
                          }}
                        >
                          {airport.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Destination Airport Single-select */}
            <FormField
              control={form.control}
              name="destination_airport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Airport</FormLabel>
                  <FormDescription>Where would you like to travel to?</FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <SelectValue placeholder="Select a destination" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64 overflow-auto">
                      {AIRPORTS.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          {airport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <TripNumberField 
                name="min_duration"
                label="Min Duration (days)"
                description="Minimum length of your trip (1-30)"
                placeholder="Min days"
              />

              <TripNumberField 
                name="max_duration"
                label="Max Duration (days)"
                description="Maximum length of your trip (1-30)"
                placeholder="Max days"
              />
            </div>

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
