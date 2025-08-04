/**
 * Booking Validation Service
 * 
 * Comprehensive validation service for flight booking safety and integrity.
 * Implements pre-booking validation, duplicate booking prevention, and input sanitization.
 */

import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { travelerDataSchema, validateJsonColumn } from '@/types/supabase-json-schemas';

// ===== VALIDATION SCHEMAS =====

const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be at most 20 characters');

const emailSchema = z.string()
  .email('Invalid email format')
  .max(254, 'Email must be at most 254 characters');

const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters');

const passportSchema = z.object({
  number: z.string()
    .min(6, 'Passport number must be at least 6 characters')
    .max(20, 'Passport number must be at most 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Passport number must contain only uppercase letters and numbers'),
  expiryDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const expiry = new Date(date);
      const now = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(now.getMonth() + 6);
      return expiry > sixMonthsFromNow;
    }, 'Passport must be valid for at least 6 months'),
  issuingCountry: z.string()
    .length(2, 'Country code must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country code must be uppercase letters'),
});

export const passengerValidationSchema = z.object({
  type: z.enum(['ADULT', 'CHILD', 'INFANT'], {
    errorMap: () => ({ message: 'Invalid passenger type' }),
  }),
  firstName: nameSchema,
  lastName: nameSchema,
  dateOfBirth: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine((date) => {
      const birthDate = new Date(date);
      const now = new Date();
      return birthDate < now;
    }, 'Birth date must be in the past'),
  gender: z.enum(['M', 'F'], {
    errorMap: () => ({ message: 'Gender must be M or F' }),
  }),
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema.optional().or(z.literal('')),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  nationality: z.string()
    .length(2, 'Nationality must be 2-letter country code')
    .regex(/^[A-Z]{2}$/, 'Nationality must be uppercase letters')
    .optional(),
}).superRefine((data, ctx) => {
  // Validate age matches passenger type
  const birthDate = new Date(data.dateOfBirth);
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const ageInYears = ageInDays / 365.25;

  if (data.type === 'ADULT' && ageInYears < 12) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Adult passengers must be at least 12 years old',
      path: ['dateOfBirth'],
    });
  }

  if (data.type === 'CHILD' && (ageInYears < 2 || ageInYears >= 12)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Child passengers must be between 2 and 11 years old',
      path: ['dateOfBirth'],
    });
  }

  if (data.type === 'INFANT' && ageInYears >= 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Infant passengers must be under 2 years old',
      path: ['dateOfBirth'],
    });
  }

  // Validate passport if provided
  if (data.passportNumber && data.passportExpiry && data.nationality) {
    const passportValidation = passportSchema.safeParse({
      number: data.passportNumber,
      expiryDate: data.passportExpiry,
      issuingCountry: data.nationality,
    });

    if (!passportValidation.success) {
      passportValidation.error.issues.forEach((issue) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: issue.message,
          path: issue.path.length > 0 ? [`passport${issue.path[0]}`] : ['passport'],
        });
      });
    }
  }
});

export const bookingValidationSchema = z.object({
  passengers: z.array(passengerValidationSchema).min(1, 'At least one passenger is required'),
  contactEmail: emailSchema,
  contactPhone: phoneSchema,
  selectedOfferId: z.string().min(1, 'Flight offer ID is required'),
  totalPrice: z.number().positive('Total price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters').regex(/^[A-Z]{3}$/, 'Currency must be uppercase'),
});

// ===== VALIDATION RESULT TYPES =====

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DuplicateCheckResult {
  hasDuplicate: boolean;
  duplicateBookingId?: string;
  duplicateCreatedAt?: string;
  confidence: number; // 0-1, how confident we are it's a duplicate
}

// ===== BOOKING VALIDATION SERVICE =====

export class BookingValidationService {
  /**
   * Comprehensive pre-booking validation
   */
  static async validatePreBooking(bookingData: {
    passengers: any[];
    contactEmail: string;
    contactPhone: string;
    selectedOfferId: string;
    totalPrice: number;
    currency: string;
    userId: string;
  }): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // 1. Schema validation
      const schemaValidation = bookingValidationSchema.safeParse(bookingData);
      if (!schemaValidation.success) {
        schemaValidation.error.issues.forEach((issue) => {
          errors.push({
            field: issue.path.join('.'),
            message: issue.message,
            code: 'SCHEMA_VALIDATION',
          });
        });
      }

      // 2. Offer validity check
      const offerValidation = await this.validateOfferAvailability(bookingData.selectedOfferId);
      if (!offerValidation.isValid) {
        errors.push({
          field: 'selectedOfferId',
          message: 'Selected offer is no longer available or has expired',
          code: 'OFFER_UNAVAILABLE',
        });
      }

      // 3. Payment method validation
      const paymentValidation = await this.validateUserPaymentMethods(bookingData.userId);
      if (!paymentValidation.hasValidPaymentMethod) {
        errors.push({
          field: 'paymentMethod',
          message: 'No valid payment method found',
          code: 'NO_PAYMENT_METHOD',
        });
      }

      // 4. Duplicate booking check
      const duplicateCheck = await this.checkDuplicateBooking(bookingData);
      if (duplicateCheck.hasDuplicate) {
        if (duplicateCheck.confidence > 0.8) {
          errors.push({
            field: 'booking',
            message: `Potential duplicate booking detected (ID: ${duplicateCheck.duplicateBookingId})`,
            code: 'DUPLICATE_BOOKING',
          });
        } else {
          warnings.push({
            field: 'booking',
            message: `Similar booking found - please verify this is not a duplicate`,
            severity: 'medium',
          });
        }
      }

      // 5. Business rules validation
      const businessRulesValidation = await this.validateBusinessRules(bookingData);
      errors.push(...businessRulesValidation.errors);
      warnings.push(...businessRulesValidation.warnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      console.error('Booking validation error:', error);
      return {
        isValid: false,
        errors: [{
          field: 'system',
          message: 'Internal validation error occurred',
          code: 'SYSTEM_ERROR',
        }],
        warnings: [],
      };
    }
  }

  /**
   * Check if flight offer is still available and valid
   */
  private static async validateOfferAvailability(offerId: string): Promise<{ isValid: boolean; reason?: string }> {
    try {
      const { data: offer, error } = await supabase
        .from('flight_offers')
        .select('expires_at, status')
        .eq('id', offerId)
        .single();

      if (error || !offer) {
        return { isValid: false, reason: 'Offer not found' };
      }

      // Check if offer has expired
      if (offer.expires_at && new Date(offer.expires_at) < new Date()) {
        return { isValid: false, reason: 'Offer has expired' };
      }

      // Check offer status
      if (offer.status && offer.status !== 'available') {
        return { isValid: false, reason: 'Offer is no longer available' };
      }

      return { isValid: true };
    } catch (error) {
      console.error('Error validating offer availability:', error);
      return { isValid: false, reason: 'Unable to validate offer' };
    }
  }

  /**
   * Validate user has valid payment methods
   */
  private static async validateUserPaymentMethods(userId: string): Promise<{ hasValidPaymentMethod: boolean }> {
    try {
      const { data: paymentMethods, error } = await supabase
        .from('payment_methods')
        .select('id, is_default, expires_at')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching payment methods:', error);
        return { hasValidPaymentMethod: false };
      }

      // Check if at least one payment method is valid and not expired
      const validPaymentMethods = paymentMethods?.filter(pm => {
        if (pm.expires_at) {
          return new Date(pm.expires_at) > new Date();
        }
        return true;
      }) || [];

      return { hasValidPaymentMethod: validPaymentMethods.length > 0 };
    } catch (error) {
      console.error('Error validating payment methods:', error);
      return { hasValidPaymentMethod: false };
    }
  }

  /**
   * Check for potential duplicate bookings
   */
  static async checkDuplicateBooking(bookingData: {
    passengers: any[];
    contactEmail: string;
    selectedOfferId: string;
    userId: string;
  }): Promise<DuplicateCheckResult> {
    try {
      // Look for recent bookings (last 24 hours) with similar characteristics
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      const { data: recentBookings, error } = await supabase
        .from('bookings')
        .select('id, created_at, passenger_data, flight_offer_id')
        .eq('user_id', bookingData.userId)
        .gte('created_at', oneDayAgo.toISOString())
        .neq('status', 'cancelled');

      if (error || !recentBookings) {
        return { hasDuplicate: false, confidence: 0 };
      }

      // Calculate confidence score for each booking
      let bestMatch: DuplicateCheckResult = { hasDuplicate: false, confidence: 0 };

      for (const booking of recentBookings) {
        let confidence = 0;

        // Same flight offer = high confidence
        if (booking.flight_offer_id === bookingData.selectedOfferId) {
          confidence += 0.5;
        }

        // Same number of passengers
        const existingPassengerData = booking.passenger_data as any[];
        if (existingPassengerData && existingPassengerData.length === bookingData.passengers.length) {
          confidence += 0.2;
        }

        // Match passenger names
        if (existingPassengerData && bookingData.passengers.length > 0) {
          const nameMatches = existingPassengerData.filter(existingPassenger => 
            bookingData.passengers.some(newPassenger => 
              existingPassenger.firstName?.toLowerCase() === newPassenger.firstName?.toLowerCase() &&
              existingPassenger.lastName?.toLowerCase() === newPassenger.lastName?.toLowerCase()
            )
          ).length;

          confidence += (nameMatches / bookingData.passengers.length) * 0.3;
        }

        if (confidence > bestMatch.confidence) {
          bestMatch = {
            hasDuplicate: confidence > 0.6,
            duplicateBookingId: booking.id,
            duplicateCreatedAt: booking.created_at,
            confidence,
          };
        }
      }

      return bestMatch;
    } catch (error) {
      console.error('Error checking duplicate bookings:', error);
      return { hasDuplicate: false, confidence: 0 };
    }
  }

  /**
   * Validate business rules and constraints
   */
  private static async validateBusinessRules(bookingData: any): Promise<{ errors: ValidationError[]; warnings: ValidationWarning[] }> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Rule 1: Maximum passengers per booking
    if (bookingData.passengers.length > 9) {
      errors.push({
        field: 'passengers',
        message: 'Maximum 9 passengers allowed per booking',
        code: 'MAX_PASSENGERS_EXCEEDED',
      });
    }

    // Rule 2: Infant to adult ratio
    const adults = bookingData.passengers.filter((p: any) => p.type === 'ADULT').length;
    const infants = bookingData.passengers.filter((p: any) => p.type === 'INFANT').length;
    
    if (infants > adults) {
      errors.push({
        field: 'passengers',
        message: 'Number of infants cannot exceed number of adults',
        code: 'INFANT_ADULT_RATIO',
      });
    }

    // Rule 3: Price reasonableness check
    const avgPricePerPassenger = bookingData.totalPrice / bookingData.passengers.length;
    if (avgPricePerPassenger > 10000) {
      warnings.push({
        field: 'totalPrice',
        message: 'Price per passenger is unusually high - please verify',
        severity: 'high',
      });
    }

    if (avgPricePerPassenger < 50) {
      warnings.push({
        field: 'totalPrice',
        message: 'Price per passenger is unusually low - please verify',
        severity: 'medium',
      });
    }

    // Rule 4: Contact information must belong to adult passenger
    const contactPassenger = bookingData.passengers.find((p: any) => 
      p.email === bookingData.contactEmail
    );
    
    if (contactPassenger && contactPassenger.type !== 'ADULT') {
      warnings.push({
        field: 'contactEmail',
        message: 'Contact email should belong to an adult passenger',
        severity: 'low',
      });
    }

    return { errors, warnings };
  }

  /**
   * Sanitize and clean input data
   */
  static sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential XSS characters
        .replace(/\s+/g, ' '); // Normalize whitespace
    }

    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item));
    }

    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return input;
  }

  /**
   * Validate and sanitize passenger data according to airline standards
   */
  static validatePassengerForAirline(passenger: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Sanitize input first
      const sanitizedPassenger = this.sanitizeInput(passenger);

      // Validate against schema
      const validation = passengerValidationSchema.safeParse(sanitizedPassenger);
      if (!validation.success) {
        validation.error.issues.forEach((issue) => {
          errors.push({
            field: issue.path.join('.'),
            message: issue.message,
            code: 'AIRLINE_VALIDATION',
          });
        });
      }

      // Additional airline-specific validations
      if (sanitizedPassenger.firstName && sanitizedPassenger.lastName) {
        // Check for common name issues
        if (sanitizedPassenger.firstName === sanitizedPassenger.lastName) {
          warnings.push({
            field: 'name',
            message: 'First name and last name are identical - please verify',
            severity: 'medium',
          });
        }

        // Check name length for airline systems
        const fullName = `${sanitizedPassenger.firstName} ${sanitizedPassenger.lastName}`;
        if (fullName.length > 60) {
          errors.push({
            field: 'name',
            message: 'Full name exceeds airline system limits (60 characters)',
            code: 'NAME_TOO_LONG',
          });
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'system',
          message: 'Passenger validation failed',
          code: 'VALIDATION_ERROR',
        }],
        warnings: [],
      };
    }
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Format validation errors for user display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  
  return errors
    .map(error => `${error.field}: ${error.message}`)
    .join('\n');
}

/**
 * Check if validation result is safe to proceed
 */
export function canProceedWithBooking(validation: ValidationResult): boolean {
  // No errors and no high-severity warnings
  const highSeverityWarnings = validation.warnings.filter(w => w.severity === 'high');
  return validation.isValid && highSeverityWarnings.length === 0;
}

export default BookingValidationService;
