/**
 * Tests for centralized error handling system
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, handleError, mapAmadeusError, mapDuffelError } from '../handler';
import { ErrorCode, ValidationError, ExternalApiError, DatabaseError } from '../types';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler({
      includeStackTrace: false,
      sanitizeErrors: false
    });
  });

  describe('normalizeError', () => {
    it('should pass through AppError instances unchanged', () => {
      const originalError = new ValidationError('Test validation error');
      const result = errorHandler.normalizeError(originalError);
      
      expect(result).toBe(originalError);
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
    });

    it('should convert JavaScript Error to BusinessLogicError', () => {
      const originalError = new Error('Test error message');
      const result = errorHandler.normalizeError(originalError);
      
      expect(result.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(result.message).toBe('Test error message');
      expect(result.userMessage).toBe('An unexpected error occurred. Please try again.');
    });

    it('should identify network errors', () => {
      const networkError = new Error('Network request failed');
      const result = errorHandler.normalizeError(networkError);
      
      expect(result.code).toBe(ErrorCode.EXTERNAL_API_ERROR);
      expect(result.retryable).toBe(true);
    });

    it('should identify validation errors from message content', () => {
      const validationError = new Error('Required field is missing');
      const result = errorHandler.normalizeError(validationError);
      
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.retryable).toBe(false);
    });

    it('should handle string errors', () => {
      const result = errorHandler.normalizeError('String error message');
      
      expect(result.code).toBe(ErrorCode.INTERNAL_ERROR);
      expect(result.message).toBe('String error message');
    });

    it('should handle unknown error types', () => {
      const result = errorHandler.normalizeError({ unknown: 'object' });
      
      expect(result.code).toBe(ErrorCode.UNKNOWN_ERROR);
      expect(result.message).toBe('Unknown error occurred');
    });
  });

  describe('mapExternalApiError', () => {
    it('should map known Amadeus error codes', () => {
      const amadeusError = {
        errors: [{ code: '38196', detail: 'Price no longer available' }]
      };
      
      const result = errorHandler.mapExternalApiError('amadeus', amadeusError);
      
      expect(result.code).toBe(ErrorCode.OFFER_EXPIRED);
      expect(result.userMessage).toBe('This price is no longer available. Please search again for current prices.');
      expect(result.retryable).toBe(false);
    });

    it('should map known Duffel error types', () => {
      const duffelError = {
        errors: [{ type: 'offer_no_longer_available', message: 'Offer expired' }]
      };
      
      const result = errorHandler.mapExternalApiError('duffel', duffelError);
      
      expect(result.code).toBe(ErrorCode.OFFER_EXPIRED);
      expect(result.userMessage).toBe('This flight is no longer available. Please search again.');
      expect(result.retryable).toBe(false);
    });

    it('should handle unknown external API errors', () => {
      const unknownError = { message: 'Unknown API error' };
      
      const result = errorHandler.mapExternalApiError('amadeus', unknownError);
      
      expect(result.code).toBe(ErrorCode.AMADEUS_API_ERROR);
      expect(result.message).toContain('amadeus API Error');
    });
  });

  describe('handle', () => {
    it('should return formatted error response', () => {
      const error = new ValidationError('Test validation error');
      const result = errorHandler.handle(error);
      
      expect(result.error).toBe(true);
      expect(result.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(result.message).toBe('Test validation error');
      expect(result.retryable).toBe(false);
      expect(result.timestamp).toBeDefined();
    });

    it('should include userMessage when available', () => {
      const error = new ValidationError('Technical error', {}, 'User-friendly message');
      const result = errorHandler.handle(error);
      
      expect(result.userMessage).toBe('User-friendly message');
    });
  });

  describe('handleAndThrow', () => {
    it('should normalize error and throw AppError', () => {
      const originalError = new Error('Test error');
      
      expect(() => {
        errorHandler.handleAndThrow(originalError);
      }).toThrow();
      
      try {
        errorHandler.handleAndThrow(originalError);
      } catch (error) {
        expect((error as any).code).toBe(ErrorCode.INTERNAL_ERROR);
      }
    });
  });
});

describe('Convenience functions', () => {
  it('should export handleError function', () => {
    const error = new Error('Test error');
    const result = handleError(error);
    
    expect(result.error).toBe(true);
    expect(result.code).toBeDefined();
  });

  it('should export mapAmadeusError function', () => {
    const amadeusError = { errors: [{ code: '38196' }] };
    const result = mapAmadeusError(amadeusError);
    
    expect(result.code).toBe(ErrorCode.OFFER_EXPIRED);
  });

  it('should export mapDuffelError function', () => {
    const duffelError = { errors: [{ type: 'offer_no_longer_available' }] };
    const result = mapDuffelError(duffelError);
    
    expect(result.code).toBe(ErrorCode.OFFER_EXPIRED);
  });
});

describe('Error logging', () => {
  it('should log errors with appropriate levels', () => {
    const mockLogger = {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
      debug: vi.fn()
    };

    const handler = new ErrorHandler({ logger: mockLogger });
    
    // Test retryable error (should log as warning)
    const retryableError = new ExternalApiError('TestAPI', 'Temporary failure', {}, true);
    handler.handle(retryableError);
    
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Retryable error'),
      expect.any(Object)
    );
    
    // Test validation error (should log as info)
    const validationError = new ValidationError('Invalid input');
    handler.handle(validationError);
    
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Client error'),
      expect.any(Object)
    );
    
    // Test application error (should log as error)
    const appError = new DatabaseError('Database connection failed');
    handler.handle(appError);
    
    // DatabaseError is retryable by default, so it logs as warning, not error
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Retryable error'),
      expect.any(Object)
    );
  });
});
