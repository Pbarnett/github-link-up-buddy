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
import { Input } from "@/components/ui/input";
import TripDateField from "./TripDateField";
import TripNumberField from "./TripNumberField";
import { supabase } from "@/integrations/supabase/client";
import { createTripRequest } from "@/services/tripService";
import { TripFormValues } from "@/services/mockOffers";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, MapPin, Plane } from "lucide-react";

// Available airports data
const NYC_AIRPORTS = [
  { id: "JFK", label: "New York JFK" },
  { id: "LGA", label: "New York LaGuardia" },
  { id: "EWR", label: "Newark" },
];

const OTHER_AIRPORTS = [
  { code: "BOS", name: "Boston (BOS)" },
  { code: "LAX", name: "Los Angeles (LAX)" },
  { code: "SFO", name: "San Francisco (SFO)" },
  { code: "ORD", name: "Chicago (ORD)" },
  { code: "MIA", name: "Miami (MIA)" },
  { code: "ATL", name: "Atlanta (ATL)" },
  { code: "DFW", name: "Dallas (DFW)" },
  { code: "DEN", name: "Denver (DEN)" },
  { code: "SEA", name: "Seattle (SEA)" },
  { code: "PHX", name: "Phoenix (PHX)" },
];

const POPULAR_DESTINATIONS = [
  { code: "LHR", name: "London (LHR)" },
  { code: "CDG", name: "Paris (CDG)" },
  { code: "FCO", name: "Rome (FCO)" },
  { code: "MAD", name: "Madrid (MAD)" },
  { code: "TYO", name: "Tokyo (TYO)" },
  { code: "HKG", name: "Hong Kong (HKG)" },
  { code: "SYD", name: "Sydney (SYD)" },
  { code: "MEX", name: "Mexico City (MEX)" },
  { code: "GRU", name: "São Paulo (GRU)" },
  { code: "DXB", name: "Dubai (DXB)" },
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
        duration: data.max_duration, // Use max_duration for compatibility with existing code
        budget: data.budget
      };
      
      // Use the tripService to create the trip request with new fields
      const result = await createTripRequest(userId, {
        ...tripFormData,
        departure_airports: departureAirports,
        destination_airport: destinationAirport,
        min_duration: data.min_duration,
        max_duration: data.max_duration
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
            
            {/* NYC Airports Checkboxes */}
            <FormField
              control={form.control}
              name="nyc_airports"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>NYC Area Airports</FormLabel>
                    <FormDescription>Select the NYC area airports you can depart from.</FormDescription>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {NYC_AIRPORTS.map((airport) => (
                      <FormItem
                        key={airport.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(airport.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), airport.id]
                                : (field.value || []).filter((value) => value !== airport.id);
                              field.onChange(updatedValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{airport.label}</FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Other Departure Airport Dropdown */}
            <FormField
              control={form.control}
              name="other_departure_airport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Departure Airport</FormLabel>
                  <FormDescription>If you're not departing from NYC, select another airport.</FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select another airport (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64 overflow-auto">
                      <SelectItem value="">None</SelectItem>
                      {OTHER_AIRPORTS.map((airport) => (
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
            
            {/* Destination Airport Dropdown */}
            <FormField
              control={form.control}
              name="destination_airport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormDescription>Select a popular destination.</FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-64 overflow-auto">
                      <SelectItem value="">None (I'll enter my own)</SelectItem>
                      {POPULAR_DESTINATIONS.map((airport) => (
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
            
            {/* Custom Destination Field */}
            <FormField
              control={form.control}
              name="destination_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Destination</FormLabel>
                  <FormDescription>If your destination isn't listed above, enter it here.</FormDescription>
                  <FormControl>
                    <Input 
                      placeholder="Enter destination airport code" 
                      {...field} 
                      disabled={!!form.watch("destination_airport")}
                    />
                  </FormControl>
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
