/**
 * Test Suite for Enhanced Error Messages System
 */

import { describe, it, expect } from 'vitest';
import {
  getEnhancedErrorMessage,
  formatErrorForDisplay,
  getProgressiveErrorSeverity,
  type ErrorMessageContext,
} from '@/lib/validation/error-messages';

describe('Enhanced Error Messages', () => {
  describe('getEnhancedErrorMessage', () => {
    it('should return contextual date error messages', () => {
      const context: ErrorMessageContext = {
        fieldName: 'earliestDeparture',
        value: new Date('2023-01-01'),
        formData: {},
      };

      const error = getEnhancedErrorMessage('dates.earliestDepartureInPast', context);
      
      expect(error.title).toBe('Past date selected');
      expect(error.message).toBe('Your departure date must be in the future');
      expect(error.suggestion).toBe('Select a date starting tomorrow or later');
      expect(error.severity).toBe('error');
      expect(error.category).toBe('validation');
    });

    it('should return contextual budget error messages with dynamic values', () => {
      const context: ErrorMessageContext = {
        fieldName: 'max_price',
        value: 50,
        formData: {},
      };

      const error = getEnhancedErrorMessage('pricing.budgetTooLow', context);
      
      expect(error.title).toBe('Budget quite low');
      expect(error.message).toBe('$50 might be too low for most flight options');
      expect(error.suggestion).toBe('Consider increasing your budget to $300+ for better availability');
      expect(error.severity).toBe('warning');
    });

    it('should return date range error with calculated days', () => {
      const context: ErrorMessageContext = {
        fieldName: 'latestDeparture',
        value: new Date(),
        formData: { daysDiff: 75 },
      };

      const error = getEnhancedErrorMessage('dates.dateRangeTooWide', context);
      
      expect(error.title).toBe('Date range too wide');
      expect(error.message).toBe('Your 75-day search window is too large and may cause timeouts');
      expect(error.helpLink).toBe('/help/search-tips#date-ranges');
    });

    it('should return payment method error with help link', () => {
      const context: ErrorMessageContext = {
        fieldName: 'preferred_payment_method_id',
        value: null,
        formData: {},
      };

      const error = getEnhancedErrorMessage('autoBooking.paymentMethodRequired', context);
      
      expect(error.title).toBe('Payment method needed');
      expect(error.helpLink).toBe('/wallet');
      expect(error.severity).toBe('error');
    });

    it('should return generic error for unknown error types', () => {
      const context: ErrorMessageContext = {
        fieldName: 'unknown',
        value: 'test',
        formData: {},
      };

      const error = getEnhancedErrorMessage('unknown.error', context);
      
      expect(error.title).toBe('Input needed');
      expect(error.message).toBe('Please check this field and try again');
      expect(error.severity).toBe('error');
    });
  });

  describe('formatErrorForDisplay', () => {
    it('should format error messages for UI display', () => {
      const errorConfig = {
        title: 'Test Error',
        message: 'This is a test error',
        suggestion: 'Try this instead',
        severity: 'error' as const,
        category: 'validation' as const,
      };

      const formatted = formatErrorForDisplay(errorConfig);
      
      expect(formatted.title).toBe('Test Error');
      expect(formatted.description).toBe('This is a test error Try this instead');
      expect(formatted.variant).toBe('destructive');
    });

    it('should include action button for help links', () => {
      const errorConfig = {
        title: 'Test Error',
        message: 'This is a test error',
        helpLink: '/help/test',
        severity: 'warning' as const,
        category: 'validation' as const,
      };

      const formatted = formatErrorForDisplay(errorConfig);
      
      expect(formatted.action).toBeDefined();
      expect(formatted.action?.label).toBe('Learn more');
      expect(formatted.action?.href).toBe('/help/test');
    });
  });

  describe('getProgressiveErrorSeverity', () => {
    it('should return none for untouched fields', () => {
      const severity = getProgressiveErrorSeverity(
        'test_field',
        'test_value',
        false, // hasBlurred
        false  // hasAttemptedSubmit
      );
      
      expect(severity).toBe('none');
    });

    it('should return warning for blurred but not submitted fields', () => {
      const severity = getProgressiveErrorSeverity(
        'test_field',
        'test_value',
        true,  // hasBlurred
        false  // hasAttemptedSubmit
      );
      
      expect(severity).toBe('warning');
    });

    it('should return error for submitted fields', () => {
      const severity = getProgressiveErrorSeverity(
        'test_field',
        'test_value',
        true, // hasBlurred
        true  // hasAttemptedSubmit
      );
      
      expect(severity).toBe('error');
    });

    it('should return error for unblurred but submitted fields', () => {
      const severity = getProgressiveErrorSeverity(
        'test_field',
        'test_value',
        false, // hasBlurred
        true   // hasAttemptedSubmit
      );
      
      expect(severity).toBe('error');
    });
  });
});

describe('Error Message Categories', () => {
  it('should handle all date error categories', () => {
    const dateErrors = [
      'dates.earliestDepartureRequired',
      'dates.earliestDepartureInPast',
      'dates.latestDepartureRequired',
      'dates.dateRangeInvalid',
      'dates.dateRangeTooWide',
    ];

    dateErrors.forEach(errorType => {
      const context: ErrorMessageContext = {
        fieldName: 'test',
        value: new Date(),
        formData: { daysDiff: 30 },
      };
      
      const error = getEnhancedErrorMessage(errorType, context);
      expect(error.category).toBe('validation');
      expect(error.title).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  it('should handle all duration error categories', () => {
    const durationErrors = [
      'duration.minDurationRequired',
      'duration.minDurationTooShort',
      'duration.maxDurationTooLong',
      'duration.durationRangeInvalid',
    ];

    durationErrors.forEach(errorType => {
      const context: ErrorMessageContext = {
        fieldName: 'min_duration',
        value: 0,
        formData: {},
      };
      
      const error = getEnhancedErrorMessage(errorType, context);
      expect(error.category).toBe('validation');
      expect(error.title).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  it('should handle all location error categories', () => {
    const locationErrors = [
      'location.destinationRequired',
      'location.departureAirportRequired',
      'location.invalidAirportCode',
    ];

    locationErrors.forEach(errorType => {
      const context: ErrorMessageContext = {
        fieldName: 'destination_airport',
        value: 'INVALID',
        formData: {},
      };
      
      const error = getEnhancedErrorMessage(errorType, context);
      expect(error.category).toBe('validation');
      expect(error.title).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });

  it('should handle network error categories', () => {
    const networkErrors = [
      'network.searchTimeout',
      'network.apiError',
      'network.rateLimitError',
    ];

    networkErrors.forEach(errorType => {
      const context: ErrorMessageContext = {
        fieldName: 'api_request',
        value: null,
        formData: {},
      };
      
      const error = getEnhancedErrorMessage(errorType, context);
      expect(error.category).toBe('network');
      expect(error.title).toBeDefined();
      expect(error.message).toBeDefined();
    });
  });
});
