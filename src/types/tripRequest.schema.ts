import { z } from "zod";

// Branded types for stronger domain safety
export type Iata = z.infer<typeof Iata>;
export const Iata = z
  .string()
  .trim()
  .transform((s) => s.toUpperCase())
  .refine((s) => /^[A-Z]{3}$/.test(s), {
    message: "Must be a 3-letter IATA code (e.g., LAX)",
  }) as unknown as z.ZodType<string, any, string>;

export type IsoDate = z.infer<typeof IsoDate>;
export const IsoDate = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid ISO date" });

export const PositiveInt = z.number().int().positive();

// Domain schema for a Trip Request (UI-agnostic)
export const TripRequestSchema = z
  .object({
    schemaVersion: z.literal(1),
    earliestDeparture: z.date(),
    latestDeparture: z.date(),
    min_duration: PositiveInt.min(1).max(30),
    max_duration: PositiveInt.min(1).max(30),
    departure_airports: z.array(Iata).min(1, "At least one departure airport is required"),
    destination_airport: Iata,
    nonstop_required: z.boolean().default(true),
    baggage_included_required: z.boolean().default(false),
    // Auto-booking fields
    auto_book_enabled: z.boolean().default(false),
    max_price: z.number().min(100).max(10000).nullable().optional(),
    preferred_payment_method_id: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.latestDeparture <= data.earliestDeparture) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["latestDeparture"],
        message: "Latest departure must be after earliest departure",
      });
    }
    if (data.max_duration < data.min_duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_duration"],
        message: "Max duration must be >= min duration",
      });
    }
    // If auto-book is enabled, require pricing + payment method
    if (data.auto_book_enabled) {
      if (!data.max_price || !data.preferred_payment_method_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["preferred_payment_method_id"],
          message: "Max price and payment method required for auto-booking",
        });
      }
    }
  });

export type TripRequest = z.infer<typeof TripRequestSchema>;

