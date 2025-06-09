
import { z } from "zod";
import { Tables } from "@/integrations/supabase/types";

// Base trip form values interface for core trip parameters
export interface TripFormValues {
  earliestDeparture: Date;
  latestDeparture: Date;
  min_duration: number;
  max_duration: number;
  budget: number;
}

// Extended trip form values with additional fields needed for API
export interface ExtendedTripFormValues extends TripFormValues {
  departure_airports?: string[];
  destination_airport?: string;
  // Auto-booking fields
  auto_book_enabled?: boolean;
  max_price?: number | null;
  preferred_payment_method_id?: string | null;
}

// Form schema with Zod validation for the trip request form
export const tripFormSchema = z.object({
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
  // New filter fields
  nonstop_required: z.boolean().default(true),
  baggage_included_required: z.boolean().default(false),
  // Auto-booking fields
  auto_book_enabled: z.boolean().default(false),
  max_price: z.coerce.number().min(100).max(10000).optional().nullable(),
  preferred_payment_method_id: z.string().optional().nullable(),
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
}).superRefine((data, ctx) => {
  if (data.auto_book_enabled) {
    if (!data.max_price) {
      ctx.addIssue({
        path: ["max_price"],
        message: "Maximum price is required for auto-booking",
      });
    }
    if (!data.preferred_payment_method_id) {
      ctx.addIssue({
        path: ["preferred_payment_method_id"],
        message: "Payment method is required for auto-booking",
      });
    }
  }
});

// Form values type derived from the schema
export type FormValues = z.infer<typeof tripFormSchema>;

// Interface for trip request creation result - simplified to match actual response
export interface TripRequestResult {
  tripRequest: Tables<"trip_requests">;
  offers: Tables<"flight_offers">[];
  offersCount: number;
}
