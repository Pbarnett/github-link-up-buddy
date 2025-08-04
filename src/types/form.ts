import * as React from 'react';
import { z } from 'zod';
import { Tables } from '@/integrations/supabase/types';
import {
  commonErrorMessages,
  createLocalizedErrorMap,
} from '@/lib/validation/error-formatting';
import {
  globalRegistry,
  createEnhancedSchema,
  type GlobalMeta,
} from '@/lib/validation/schema-registry';

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

// Form schema with Zod validation for the trip request form
export const tripFormSchema = z
  .object({
    earliestDeparture: z
      .date({
        required_error: 'dates.earliestDepartureRequired',
      })
      .refine(date => date > new Date(), {
        message: 'dates.earliestDepartureInPast',
      }),
    latestDeparture: z
      .date({
        required_error: 'dates.latestDepartureRequired',
      })
      .refine(date => date > new Date(), {
        message: 'dates.latestDepartureInPast',
      }),
    min_duration: z.coerce
      .number()
      .int()
      .min(1, {
        message: 'duration.minDurationTooShort',
      })
      .max(30, {
        message: 'duration.maxDurationTooLong',
      }),
    max_duration: z.coerce
      .number()
      .int()
      .min(1, {
        message: 'duration.minDurationTooShort',
      })
      .max(30, {
        message: 'duration.maxDurationTooLong',
      }),
    max_price: z.coerce
      .number()
      .min(100, {
        message: 'pricing.budgetTooLow',
      })
      .max(10000, {
        message: 'pricing.budgetTooHigh',
      })
      .optional(),
    nyc_airports: z.array(z.string()).optional(),
    other_departure_airport: z.string().optional(),
    destination_airport: z.string().optional(),
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
    // Consolidated validation using superRefine for better performance

    // 1. Date sequence validation
    if (data.latestDeparture <= data.earliestDeparture) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'dates.dateRangeInvalid',
        path: ['latestDeparture'],
      });
    }

    // 2. Date range validation - prevent overly wide ranges that cause timeouts
    const timeDiff =
      data.latestDeparture.getTime() - data.earliestDeparture.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (daysDiff > 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'dates.dateRangeTooWide',
        path: ['latestDeparture'],
        // Pass additional context for the error message
        params: { daysDiff },
      });
    }

    // 3. Duration validation
    if (data.max_duration < data.min_duration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'duration.durationRangeInvalid',
        path: ['max_duration'],
      });
    }

    // 4. Departure airport validation
    const hasNycAirports = data.nyc_airports && data.nyc_airports.length > 0;
    const hasOtherAirport = !!data.other_departure_airport;
    if (!hasNycAirports && !hasOtherAirport) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'location.departureAirportRequired',
        path: ['nyc_airports'],
      });
    }

    // 5. Destination validation
    if (!data.destination_airport && !data.destination_other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'location.destinationRequired',
        path: ['destination_airport'],
      });
    }

    // 6. Auto-booking validation
    if (data.auto_book_enabled) {
      if (!data.max_price) {
        ctx.addIssue({
          path: ['max_price'],
          code: z.ZodIssueCode.custom,
          message: 'autoBooking.maxPriceRequired',
        });
      }
      if (!data.preferred_payment_method_id) {
        ctx.addIssue({
          path: ['preferred_payment_method_id'],
          code: z.ZodIssueCode.custom,
          message: 'autoBooking.paymentMethodRequired',
        });
      }

      // Auto-booking consent validation
      if (data.auto_book_consent === false) {
        ctx.addIssue({
          path: ['auto_book_consent'],
          code: z.ZodIssueCode.custom,
          message: 'autoBooking.consentRequired',
        });
      }
    }
  });

// Form values type derived from the schema
export type FormValues = z.infer<typeof tripFormSchema>;

// Enhanced trip form schema with metadata (Zod v4-inspired)
export const enhancedTripFormSchema = createEnhancedSchema(tripFormSchema, {
  id: 'trip_form_schema',
  title: 'Trip Request Form Schema',
  description:
    'Comprehensive validation schema for trip request forms with advanced cross-field validation',
  category: 'forms',
  tags: ['trip', 'form', 'validation', 'travel'],
  version: '2.0.0',
  examples: [
    {
      earliestDeparture: new Date('2024-03-01'),
      latestDeparture: new Date('2024-03-15'),
      min_duration: 3,
      max_duration: 7,
      max_price: 1500,
      nyc_airports: ['JFK', 'LGA'],
      destination_airport: 'LAX',
    },
  ],
});

// Register the schema in the global registry
globalRegistry.add(tripFormSchema, {
  id: 'trip_form_validation',
  title: 'Trip Form Validation',
  description: 'Main validation schema for trip request forms',
  category: 'forms',
  tags: ['validation', 'forms', 'travel'],
});

// Enhanced validation functions with Zod v4-inspired features
export const validateTripForm = {
  /**
   * Validate with enhanced error formatting
   */
  enhanced: (values: unknown, locale?: string) => {
    let schema = tripFormSchema;

    // Apply localization if requested (Zod v3 compatible approach)
    if (locale) {
      const localizedErrorMap = createLocalizedErrorMap(locale);
      // Create new schema instance with error map by properly setting the error map
      try {
        // In Zod v3, we need to use setErrorMap on the schema directly
        // The refine method doesn't accept errorMap parameter
        schema = tripFormSchema;
        // Apply the localized error map using a different approach
        // For now, we'll use the original schema and handle localization differently
        console.info('Localized error mapping would be applied here in production');
      } catch (error) {
        // Fallback to original schema if error map setup fails
        console.warn('Failed to apply localized error map, using default schema');
        schema = tripFormSchema;
      }
    }

    return schema.safeParse(values);
  },

  /**
   * Validate specific field with context
   */
  field: (
    fieldName: keyof FormValues,
    value: unknown,
    formData?: Partial<FormValues>
  ) => {
    // Extract the specific field schema for targeted validation
    // Handle ZodEffects by accessing the underlying schema
    let fieldSchema: any;
    
    try {
      // Check if tripFormSchema has a shape property (ZodObject)
      if ('shape' in tripFormSchema) {
        fieldSchema = (tripFormSchema as any).shape[fieldName];
      } else if ('_def' in tripFormSchema && tripFormSchema._def.schema) {
        // Handle ZodEffects by accessing the underlying schema
        const underlyingSchema = tripFormSchema._def.schema;
        if ('shape' in underlyingSchema) {
          fieldSchema = underlyingSchema.shape[fieldName];
        }
      }
      
      if (!fieldSchema) {
        throw new Error(`Unknown field: ${String(fieldName)}`);
      }
    } catch (error) {
      // Fallback: validate against the full form and extract field-specific errors
      const fullFormResult = tripFormSchema.safeParse({
        ...formData,
        [fieldName]: value,
      });
      
      const fieldErrors = fullFormResult.error?.errors.filter(err =>
        err.path.includes(String(fieldName))
      ) || [];
      
      return {
        success: fieldErrors.length === 0,
        error: fieldErrors.length > 0 ? { errors: fieldErrors } : undefined,
      };
    }

    const result = fieldSchema.safeParse(value);

    // For cross-field validation, we need to validate against the full form
    if (formData && !result.success) {
      const fullFormResult = tripFormSchema.safeParse({
        ...formData,
        [fieldName]: value,
      });

      // Return errors specific to this field
      const fieldErrors =
        fullFormResult.error?.errors.filter(err =>
          err.path.includes(String(fieldName))
        ) || [];

      if (fieldErrors.length > 0) {
        return {
          success: false,
          error: { errors: fieldErrors },
        };
      }
    }

    return result;
  },

  /**
   * Async validation for complex scenarios
   */
  async: async (values: unknown) => {
    // For now, just wrap the sync validation
    // In the future, this could include API calls for validation
    return Promise.resolve(tripFormSchema.safeParse(values));
  },
};

// Common field schemas that can be reused (inspired by Zod v4 top-level functions)
export const tripFormFields = {
  email: () => z.string().email(commonErrorMessages.email),
  positivePrice: () =>
    z
      .number()
      .positive('Price must be positive')
      .max(50000, 'Price seems unreasonably high'),
  airportCode: () =>
    z
      .string()
      .length(3, 'Airport code must be 3 characters')
      .transform(val => val.toUpperCase()) // Transform to uppercase since .toUpperCase() doesn't exist in v3
      .refine(
        val => /^[A-Z]{3}$/.test(val),
        'Must be a valid 3-letter airport code'
      ),
  dateInFuture: () =>
    z.date().refine(date => date > new Date(), 'Date must be in the future'),
  duration: () =>
    z
      .number()
      .int()
      .min(1, 'Duration must be at least 1 day')
      .max(365, 'Duration cannot exceed 1 year'),
  boolean: () => z.boolean(),
  optionalString: () => z.string().optional(),
  requiredString: () => z.string().min(1, 'This field is required'),
};

// Interface for trip request creation result - simplified to match actual response
export interface TripRequestResult {
  tripRequest: Tables<'trip_requests'>;
  offers: Tables<'flight_offers'>[];
  offersCount: number;
}

// Enhanced form validation result with better error handling
export interface EnhancedValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: {
    fieldErrors: Record<string, string[]>;
    formErrors: string[];
    formattedError?: string;
  };
  metadata?: {
    validationTime: number;
    schemaVersion: string;
    locale?: string;
  };
}
