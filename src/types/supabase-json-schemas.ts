/**
 * Type-safe schemas for Supabase JSON columns
 * 
 * This file provides Zod schemas and TypeScript types for all JSON columns
 * in your Supabase database, enabling both runtime validation and compile-time
 * type safety.
 */

import { z } from 'zod';
// ===== TRAVELER DATA SCHEMAS =====

export const travelerDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  gender: z.enum(['male', 'female', 'other']),
  title: z.enum(['Mr', 'Ms', 'Mrs', 'Dr']),
  // Identity documents for international travel
  passport: z.object({
    number: z.string().min(1),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    issuingCountry: z.string().length(2), // ISO country code
  }).optional(),
  // Known traveler numbers
  knownTravelerNumber: z.string().optional(),
  redressNumber: z.string().optional(),
});

export type TravelerData = z.infer<typeof travelerDataSchema>;

// Support for multiple travelers
export const multiTravelerDataSchema = z.array(travelerDataSchema).min(1).max(9);
export type MultiTravelerData = z.infer<typeof multiTravelerDataSchema>;

// ===== OFFER DATA SCHEMAS =====

export const flightSegmentSchema = z.object({
  departure: z.object({
    airport: z.string().length(3), // IATA code
    city: z.string(),
    datetime: z.string(),
    terminal: z.string().optional(),
  }),
  arrival: z.object({
    airport: z.string().length(3), // IATA code
    city: z.string(),
    datetime: z.string(),
    terminal: z.string().optional(),
  }),
  airline: z.object({
    code: z.string(),
    name: z.string(),
  }),
  aircraft: z.object({
    code: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  flightNumber: z.string(),
  duration: z.string(), // ISO 8601 duration format
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']),
});

export const flightSliceSchema = z.object({
  segments: z.array(flightSegmentSchema).min(1),
  duration: z.string(), // Total slice duration
});

export const offerDataSchema = z.object({
  // Core offer identification
  id: z.string(),
  provider: z.enum(['DUFFEL', 'AMADEUS']),
  
  // Pricing information
  pricing: z.object({
    totalAmount: z.number().positive(),
    currency: z.string().length(3), // ISO currency code
    breakdown: z.object({
      baseFare: z.number().nonnegative(),
      taxes: z.number().nonnegative(),
      fees: z.number().nonnegative(),
      carryOnFee: z.number().nonnegative().optional(),
    }),
  }),
  
  // Flight details
  slices: z.array(flightSliceSchema).min(1).max(2), // Outbound + optional return
  
  // Passenger restrictions
  passengerRestrictions: z.object({
    maxAdults: z.number().int().positive().default(9),
    maxChildren: z.number().int().nonnegative().default(0),
    maxInfants: z.number().int().nonnegative().default(0),
  }).optional(),
  
  // Baggage information
  baggage: z.object({
    carryOnIncluded: z.boolean(),
    checkedBagIncluded: z.boolean(),
    carryOnSize: z.string().optional(),
    checkedBagWeight: z.string().optional(),
  }).optional(),
  
  // Booking conditions
  conditions: z.object({
    refundable: z.boolean(),
    changeable: z.boolean(),
    expiresAt: z.string(), // ISO datetime
  }),
  
  // Provider-specific data
  providerData: z.record(z.unknown()).optional(),
});

export type OfferData = z.infer<typeof offerDataSchema>;

// ===== CAMPAIGN CRITERIA SCHEMAS =====

export const campaignCriteriaSchema = z.object({
  // Trip parameters
  trip: z.object({
    departureAirports: z.array(z.string().length(3)).min(1),
    destinationAirport: z.string().length(3),
    earliestDeparture: z.string(), // ISO date
    latestDeparture: z.string(), // ISO date
    minDuration: z.number().int().positive(),
    maxDuration: z.number().int().positive(),
  }),
  
  // Budget constraints
  budget: z.object({
    maxPrice: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    includeFees: z.boolean().default(true),
  }),
  
  // Flight preferences
  preferences: z.object({
    nonstopOnly: z.boolean().default(false),
    preferredAirlines: z.array(z.string()).optional(),
    excludedAirlines: z.array(z.string()).optional(),
    cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).default('economy'),
    carryOnRequired: z.boolean().default(false),
  }),
  
  // Auto-booking settings
  autoBooking: z.object({
    enabled: z.boolean(),
    maxAttempts: z.number().int().positive().default(3),
    retryInterval: z.number().int().positive().default(300), // seconds
    requireConfirmation: z.boolean().default(true),
  }),
});

export type CampaignCriteria = z.infer<typeof campaignCriteriaSchema>;

// ===== PRICE HISTORY SCHEMAS =====

export const pricePointSchema = z.object({
  timestamp: z.string(), // ISO datetime
  price: z.number().positive(),
  currency: z.string().length(3),
  offerId: z.string(),
  provider: z.enum(['DUFFEL', 'AMADEUS']),
  availability: z.boolean(),
});

export const priceHistorySchema = z.array(pricePointSchema);
export type PriceHistory = z.infer<typeof priceHistorySchema>;

// ===== FLIGHT DETAILS SCHEMAS =====

export const flightDetailsSchema = z.object({
  // Booking reference
  pnr: z.string(),
  bookingReference: z.string(),
  
  // Ticket information
  tickets: z.array(z.object({
    ticketNumber: z.string(),
    passenger: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    status: z.enum(['issued', 'void', 'refunded']),
  })),
  
  // Flight segments with actual details
  segments: z.array(z.object({
    flightNumber: z.string(),
    airline: z.object({
      code: z.string(),
      name: z.string(),
    }),
    departure: z.object({
      airport: z.string(),
      datetime: z.string(),
      terminal: z.string().optional(),
      gate: z.string().optional(),
    }),
    arrival: z.object({
      airport: z.string(),
      datetime: z.string(),
      terminal: z.string().optional(),
      gate: z.string().optional(),
    }),
    seatAssignments: z.array(z.object({
      passenger: z.string(),
      seatNumber: z.string(),
    })).optional(),
    status: z.enum(['confirmed', 'cancelled', 'delayed']),
  })),
  
  // Additional services
  services: z.object({
    meals: z.array(z.object({
      passenger: z.string(),
      type: z.string(),
    })).optional(),
    baggage: z.array(z.object({
      passenger: z.string(),
      type: z.enum(['carry_on', 'checked']),
      weight: z.string().optional(),
    })).optional(),
    seats: z.array(z.object({
      passenger: z.string(),
      seatNumber: z.string(),
      fee: z.number().optional(),
    })).optional(),
  }).optional(),
});

export type FlightDetails = z.infer<typeof flightDetailsSchema>;

// ===== VALIDATION HELPERS =====

/**
 * Safely parse and validate JSON column data
 */
export function parseJsonColumn<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  columnName: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      
      throw new Error(
        `Invalid data in ${columnName}: ${issues}`
      );
    }
    throw error;
  }
}

/**
 * Safely validate JSON column data without throwing
 */
export function validateJsonColumn<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join(', ');
      return { success: false, error: issues };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

// ===== TYPE GUARDS =====

export function isTravelerData(data: unknown): data is TravelerData {
  return validateJsonColumn(travelerDataSchema, data).success;
}

export function isOfferData(data: unknown): data is OfferData {
  return validateJsonColumn(offerDataSchema, data).success;
}

export function isCampaignCriteria(data: unknown): data is CampaignCriteria {
  return validateJsonColumn(campaignCriteriaSchema, data).success;
}

export function isPriceHistory(data: unknown): data is PriceHistory {
  return validateJsonColumn(priceHistorySchema, data).success;
}

export function isFlightDetails(data: unknown): data is FlightDetails {
  return validateJsonColumn(flightDetailsSchema, data).success;
}
