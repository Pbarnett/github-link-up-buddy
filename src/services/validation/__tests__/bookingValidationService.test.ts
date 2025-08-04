/**
 * Unit tests for BookingValidationService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import BookingValidationService, {
  ValidationResult,
  formatValidationErrors,
  canProceedWithBooking,
  passengerValidationSchema,
  bookingValidationSchema,
} from '../bookingValidationService';

// Mock Supabase client to avoid hoisting issues
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          gte: vi.fn(() => ({
            neq: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Import the mocked supabase to use in tests
import { supabase as mockSupabase } from '@/integrations/supabase/client';

describe('BookingValidationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('passengerValidationSchema', () => {
    it('should validate valid adult passenger', () => {
      const validPassenger = {
        type: 'ADULT',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'M',
        email: 'john@example.com',
        phone: '+1234567890',
        nationality: 'US',
      };

      const result = passengerValidationSchema.safeParse(validPassenger);
      expect(result.success).toBe(true);
    });

    it('should reject passenger with invalid age for type', () => {
      const invalidPassenger = {
        type: 'ADULT',
        firstName: 'Child',
        lastName: 'Passenger',
        dateOfBirth: '2020-01-01', // Too young for adult
        gender: 'M',
      };

      const result = passengerValidationSchema.safeParse(invalidPassenger);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(issue => 
          issue.message.includes('Adult passengers must be at least 12 years old')
        )).toBe(true);
      }
    });

    it('should validate child passenger with correct age', () => {
      const childPassenger = {
        type: 'CHILD',
        firstName: 'Child',
        lastName: 'Passenger',
        dateOfBirth: '2018-01-01', // 6 years old
        gender: 'F',
      };

      const result = passengerValidationSchema.safeParse(childPassenger);
      expect(result.success).toBe(true);
    });

    it('should validate infant passenger with correct age', () => {
      const infantPassenger = {
        type: 'INFANT',
        firstName: 'Baby',
        lastName: 'Passenger',
        dateOfBirth: '2023-12-01', // 1 month old (assuming test runs in 2024)
        gender: 'M',
      };

      const result = passengerValidationSchema.safeParse(infantPassenger);
      expect(result.success).toBe(true);
    });

    it('should reject invalid name characters', () => {
      const invalidPassenger = {
        type: 'ADULT',
        firstName: 'John123',
        lastName: 'Doe@#$',
        dateOfBirth: '1990-01-01',
        gender: 'M',
      };

      const result = passengerValidationSchema.safeParse(invalidPassenger);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const invalidPassenger = {
        type: 'ADULT',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'M',
        email: 'invalid-email',
      };

      const result = passengerValidationSchema.safeParse(invalidPassenger);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone format', () => {
      const invalidPassenger = {
        type: 'ADULT',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'M',
        phone: 'abc-def-ghij',
      };

      const result = passengerValidationSchema.safeParse(invalidPassenger);
      expect(result.success).toBe(false);
    });
  });

  describe('bookingValidationSchema', () => {
    it('should validate complete booking data', () => {
      const validBooking = {
        passengers: [{
          type: 'ADULT',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'M',
        }],
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 500,
        currency: 'USD',
      };

      const result = bookingValidationSchema.safeParse(validBooking);
      expect(result.success).toBe(true);
    });

    it('should reject booking without passengers', () => {
      const invalidBooking = {
        passengers: [],
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 500,
        currency: 'USD',
      };

      const result = bookingValidationSchema.safeParse(invalidBooking);
      expect(result.success).toBe(false);
    });

    it('should reject invalid currency format', () => {
      const invalidBooking = {
        passengers: [{
          type: 'ADULT',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'M',
        }],
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 500,
        currency: 'usd', // Should be uppercase
      };

      const result = bookingValidationSchema.safeParse(invalidBooking);
      expect(result.success).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize string input', () => {
      const input = '  John <script>alert("xss")</script> Doe  ';
      const result = BookingValidationService.sanitizeInput(input);
      expect(result).toBe('John scriptalert("xss")/script Doe');
    });

    it('should sanitize nested objects', () => {
      const input = {
        name: '  John <script>  ',
        details: {
          email: '  test@example.com  ',
        },
      };

      const result = BookingValidationService.sanitizeInput(input);
      expect(result.name).toBe('John script');
      expect(result.details.email).toBe('test@example.com');
    });

    it('should sanitize arrays', () => {
      const input = ['  test1  ', '  test2<script>  '];
      const result = BookingValidationService.sanitizeInput(input);
      expect(result).toEqual(['test1', 'test2script']);
    });

    it('should handle non-string values', () => {
      const input = {
        number: 123,
        boolean: true,
        null: null,
        undefined: undefined,
      };

      const result = BookingValidationService.sanitizeInput(input);
      expect(result.number).toBe(123);
      expect(result.boolean).toBe(true);
      expect(result.null).toBe(null);
      expect(result.undefined).toBe(undefined);
    });
  });

  describe('validatePassengerForAirline', () => {
    it('should validate passenger with airline-specific rules', () => {
      const passenger = {
        type: 'ADULT',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'M',
      };

      const result = BookingValidationService.validatePassengerForAirline(passenger);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn about identical first and last names', () => {
      const passenger = {
        type: 'ADULT',
        firstName: 'John',
        lastName: 'John',
        dateOfBirth: '1990-01-01',
        gender: 'M',
      };

      const result = BookingValidationService.validatePassengerForAirline(passenger);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].message).toContain('First name and last name are identical');
    });

    it('should reject names exceeding airline limits', () => {
      const passenger = {
        type: 'ADULT',
        firstName: 'VeryLongFirstNameThatExceedsAirlineSystemLimits',
        lastName: 'VeryLongLastNameThatExceedsAirlineSystemLimits',
        dateOfBirth: '1990-01-01',
        gender: 'M',
      };

      const result = BookingValidationService.validatePassengerForAirline(passenger);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.message.includes('exceeds airline system limits'))).toBe(true);
    });
  });

  describe('checkDuplicateBooking', () => {
    it('should detect no duplicate when no recent bookings exist', async () => {
      const mockQuery = vi.fn().mockResolvedValue({ data: [], error: null });
      (mockSupabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              neq: mockQuery,
            }),
          }),
        }),
      });

      const bookingData = {
        passengers: [{ firstName: 'John', lastName: 'Doe' }],
        contactEmail: 'john@example.com',
        selectedOfferId: 'offer_123',
        userId: 'user_123',
      };

      const result = await BookingValidationService.checkDuplicateBooking(bookingData);
      expect(result.hasDuplicate).toBe(false);
      expect(result.confidence).toBe(0);
    });

    it('should detect high confidence duplicate', async () => {
      const mockQuery = vi.fn().mockResolvedValue({
        data: [{
          id: 'booking_123',
          created_at: '2024-01-01T00:00:00Z',
          flight_offer_id: 'offer_123',
          passenger_data: [{ firstName: 'John', lastName: 'Doe' }],
        }],
        error: null,
      });

      (mockSupabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              neq: mockQuery,
            }),
          }),
        }),
      });

      const bookingData = {
        passengers: [{ firstName: 'John', lastName: 'Doe' }],
        contactEmail: 'john@example.com',
        selectedOfferId: 'offer_123',
        userId: 'user_123',
      };

      const result = await BookingValidationService.checkDuplicateBooking(bookingData);
      expect(result.hasDuplicate).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.duplicateBookingId).toBe('booking_123');
    });

    it('should handle database errors gracefully', async () => {
      const mockQuery = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error'),
      });

      (mockSupabase.from as any).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              neq: mockQuery,
            }),
          }),
        }),
      });

      const bookingData = {
        passengers: [{ firstName: 'John', lastName: 'Doe' }],
        contactEmail: 'john@example.com',
        selectedOfferId: 'offer_123',
        userId: 'user_123',
      };

      const result = await BookingValidationService.checkDuplicateBooking(bookingData);
      expect(result.hasDuplicate).toBe(false);
      expect(result.confidence).toBe(0);
    });
  });

  describe('validatePreBooking', () => {
    beforeEach(() => {
      // Reset all mocks
      vi.clearAllMocks();
      
      // Mock successful responses
      (mockSupabase.from as any).mockImplementation((table) => {
        if (table === 'flight_offers') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { expires_at: null, status: 'available' },
                  error: null,
                }),
              }),
            }),
          };
        }
        
        if (table === 'payment_methods') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({
                  data: [{ id: 'pm_123', expires_at: null }],
                  error: null,
                }),
              }),
            }),
          };
        }
        
        if (table === 'bookings') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                gte: vi.fn().mockReturnValue({
                  neq: vi.fn().mockResolvedValue({
                    data: [],
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        
        // Default mock
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        };
      });
    });

    it('should pass validation for valid booking data', async () => {
      const validBookingData = {
        passengers: [{
          type: 'ADULT',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'M',
        }],
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 500,
        currency: 'USD',
        userId: 'user_123',
      };

      const result = await BookingValidationService.validatePreBooking(validBookingData);
      if (!result.isValid) {
        console.log('Validation failed with errors:', result.errors);
        console.log('Validation warnings:', result.warnings);
      }
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect schema validation errors', async () => {
      const invalidBookingData = {
        passengers: [], // Invalid: no passengers
        contactEmail: 'invalid-email', // Invalid: bad email format
        contactPhone: 'abc', // Invalid: bad phone format
        selectedOfferId: '',
        totalPrice: -100, // Invalid: negative price
        currency: 'usd', // Invalid: lowercase
        userId: 'user_123',
      };

      const result = await BookingValidationService.validatePreBooking(invalidBookingData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.code === 'SCHEMA_VALIDATION')).toBe(true);
    });

    it('should detect business rule violations', async () => {
      const bookingData = {
        passengers: [
          // 2 infants, 1 adult - violates infant/adult ratio
          { type: 'INFANT', firstName: 'Baby1', lastName: 'Doe', dateOfBirth: '2023-01-01', gender: 'M' },
          { type: 'INFANT', firstName: 'Baby2', lastName: 'Doe', dateOfBirth: '2023-06-01', gender: 'F' },
          { type: 'ADULT', firstName: 'Parent', lastName: 'Doe', dateOfBirth: '1990-01-01', gender: 'M' },
        ],
        contactEmail: 'parent@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 50, // Unusually low price
        currency: 'USD',
        userId: 'user_123',
      };

      const result = await BookingValidationService.validatePreBooking(bookingData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INFANT_ADULT_RATIO')).toBe(true);
      expect(result.warnings.some(w => w.message.includes('unusually low'))).toBe(true);
    });

    it('should handle system errors gracefully', async () => {
      // Mock the schema validation to throw an unexpected error
      // This will bypass individual method error handling and trigger the main catch block
      const originalParse = bookingValidationSchema.safeParse;
      vi.spyOn(bookingValidationSchema, 'safeParse').mockImplementation(() => {
        throw new Error('Unexpected validation system failure');
      });

      const bookingData = {
        passengers: [{
          type: 'ADULT',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          gender: 'M',
        }],
        contactEmail: 'john@example.com',
        contactPhone: '+1234567890',
        selectedOfferId: 'offer_123',
        totalPrice: 500,
        currency: 'USD',
        userId: 'user_123',
      };

      const result = await BookingValidationService.validatePreBooking(bookingData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'SYSTEM_ERROR')).toBe(true);
      
      // Restore original method
      vi.restoreAllMocks();
    });
  });

  describe('utility functions', () => {
    describe('formatValidationErrors', () => {
      it('should format errors correctly', () => {
        const errors = [
          { field: 'firstName', message: 'Name is required', code: 'REQUIRED' },
          { field: 'email', message: 'Invalid email format', code: 'FORMAT' },
        ];

        const result = formatValidationErrors(errors);
        expect(result).toBe('firstName: Name is required\nemail: Invalid email format');
      });

      it('should return empty string for no errors', () => {
        const result = formatValidationErrors([]);
        expect(result).toBe('');
      });
    });

    describe('canProceedWithBooking', () => {
      it('should allow booking with valid result and no high warnings', () => {
        const validation: ValidationResult = {
          isValid: true,
          errors: [],
          warnings: [
            { field: 'test', message: 'Low warning', severity: 'low' },
            { field: 'test', message: 'Medium warning', severity: 'medium' },
          ],
        };

        const result = canProceedWithBooking(validation);
        expect(result).toBe(true);
      });

      it('should prevent booking with validation errors', () => {
        const validation: ValidationResult = {
          isValid: false,
          errors: [{ field: 'test', message: 'Error', code: 'ERROR' }],
          warnings: [],
        };

        const result = canProceedWithBooking(validation);
        expect(result).toBe(false);
      });

      it('should prevent booking with high severity warnings', () => {
        const validation: ValidationResult = {
          isValid: true,
          errors: [],
          warnings: [
            { field: 'test', message: 'High warning', severity: 'high' },
          ],
        };

        const result = canProceedWithBooking(validation);
        expect(result).toBe(false);
      });
    });
  });
});
