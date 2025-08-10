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
  destination_location_code?: string; // Add this field
  returnDate?: string; // ✅ FIX: Add return date for round-trip detection
  // Filter fields
  nonstop_required?: boolean;
  baggage_included_required?: boolean;
  // Auto-booking fields
  auto_book_enabled?: boolean;
  max_price?: number | null; // This replaces budget for auto-booking
  preferred_payment_method_id?: string | null;
}

// Helper regex for IATA codes
const IATA_REGEX = /^[A-Z]{3}$/;

// Form schema with Zod validation for the trip request form
export const tripFormSchema = z
  .object({
    // Explicitly include form mode so validation can branch correctly
    form_mode: z.enum(["manual", "auto"]).default("manual"),

    earliestDeparture: z.preprocess((val) =>
      typeof val === "string" ? new Date(val) : val,
      z.date({ required_error: "Earliest departure date is required" })
    ).refine((date) => date > new Date(), {
      message: "Earliest departure date must be in the future",
    }),

    latestDeparture: z.preprocess((val) =>
      typeof val === "string" ? new Date(val) : val,
      z.date({ required_error: "Latest departure date is required" })
    ).refine((date) => date > new Date(), {
      message: "Latest departure date must be in the future",
    }),

    min_duration: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.number().int().min(1, {
      message: "Minimum duration must be at least 1 day",
    }).max(30, {
      message: "Minimum duration cannot exceed 30 days",
    })),

    max_duration: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.number().int().min(1, {
      message: "Maximum duration must be at least 1 day",
    }).max(30, {
      message: "Maximum duration cannot exceed 30 days",
    })),

    max_price: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.number().min(100, {
      message: "Maximum price must be at least $100",
    }).max(10000, {
      message: "Maximum price cannot exceed $10,000",
    })),

    nyc_airports: z.array(z.string()).optional(),
    other_departure_airport: z.string().optional(),

    destination_airport: z
      .preprocess((v) => (typeof v === 'string' ? v.trim().toUpperCase() : v), z.string().optional())
      .refine((val) => !val || IATA_REGEX.test(val), {
        message: "Destination airport must be a 3-letter IATA code (e.g., LAX)",
      }),
    destination_other: z.string().optional(),

    // New filter fields
    nonstop_required: z.boolean().default(true),
    baggage_included_required: z.boolean().default(false),

    // Auto-booking fields
    auto_book_enabled: z.boolean().default(false).optional(),
    preferred_payment_method_id: z.string().optional().nullable(),
    auto_book_consent: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    // Cross-field validations
    if (data.latestDeparture <= data.earliestDeparture) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latest departure date must be after earliest departure date",
        path: ["latestDeparture"],
      });
    }

    // Intelligent date range validation - prevent overly wide ranges that cause timeouts
    const timeDiff = data.latestDeparture.getTime() - data.earliestDeparture.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Date range cannot exceed 60 days. For longer searches, please create multiple trips.",
        path: ["latestDeparture"],
      });
    }

    if (data.max_duration < data.min_duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum duration must be greater than or equal to minimum duration",
        path: ["max_duration"],
      });
    }

    const hasNycAirports = !!(data.nyc_airports && data.nyc_airports.length > 0);
    const hasOtherAirport = !!data.other_departure_airport;
    if (!hasNycAirports && !hasOtherAirport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one departure airport must be selected",
        path: ["nyc_airports"],
      });
    }

    // Require exactly one of destination_airport or destination_other
    const hasIata = !!data.destination_airport;
    const hasOther = !!data.destination_other && data.destination_other.trim().length > 0;
    if (!hasIata && !hasOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a destination or enter a custom one",
        path: ["destination_airport"],
      });
    }
    if (hasIata && hasOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Choose either an airport code or a custom destination, not both",
        path: ["destination_other"],
      });
    }

    // Auto-booking validation: require max_price and payment method and consent when enabled
    if (data.auto_book_enabled) {
      if (!data.max_price || !data.preferred_payment_method_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum price and payment method are required for auto-booking",
          path: ["preferred_payment_method_id"],
        });
      }
      if (data.form_mode === 'auto' && data.auto_book_consent !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "You must authorize auto-booking to continue",
          path: ["auto_book_consent"],
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
