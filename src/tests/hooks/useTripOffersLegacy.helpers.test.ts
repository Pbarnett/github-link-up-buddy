import { describe, it, expect } from 'vitest';
import { _test } from '@/hooks/useTripOffersLegacy';
import type { Offer } from '@/services/tripOffersService';

describe('useTripOffersLegacy Helper Functions', () => {
  describe('validateDuration', () => {
    const { validateDuration } = _test;

    it('should return true for offers within duration range', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: '2024-01-20', // 5 days
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(true);
    });

    it('should return false for offers outside duration range', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: '2024-01-25', // 10 days
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(false);
    });

    it('should return true for offers at exact minimum duration', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: '2024-01-18', // 3 days
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(true);
    });

    it('should return true for offers at exact maximum duration', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: '2024-01-22', // 7 days
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(true);
    });

    it('should return false for offers with missing departure_date', () => {
      const offer: Partial<Offer> = {
        departure_date: undefined,
        return_date: '2024-01-20',
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(false);
    });

    it('should return false for offers with missing return_date', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: undefined,
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(false);
    });

    it('should return false for offers with invalid dates', () => {
      const offer: Partial<Offer> = {
        departure_date: 'invalid-date',
        return_date: '2024-01-20',
      };

      const result = validateDuration(offer as Offer, 3, 7);
      expect(result).toBe(false);
    });

    it('should handle edge case of same day return (0 days)', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-15',
        return_date: '2024-01-15', // Same day
      };

      const result = validateDuration(offer as Offer, 0, 1);
      expect(result).toBe(true);
    });

    it('should calculate duration correctly across months', () => {
      const offer: Partial<Offer> = {
        departure_date: '2024-01-30',
        return_date: '2024-02-05', // 6 days
      };

      const result = validateDuration(offer as Offer, 5, 8);
      expect(result).toBe(true);
    });
  });

  describe('buildCacheKey', () => {
    const { buildCacheKey } = _test;

    it('should build cache key with correct format', () => {
      const result = buildCacheKey('trip-123', true, false);
      expect(result).toBe('legacy-trip-123-true-false');
    });

    it('should handle different parameter combinations', () => {
      expect(buildCacheKey('trip-456', false, true)).toBe('legacy-trip-456-false-true');
      expect(buildCacheKey('trip-789', true, true)).toBe('legacy-trip-789-true-true');
      expect(buildCacheKey('trip-000', false, false)).toBe('legacy-trip-000-false-false');
    });

    it('should include legacy prefix to distinguish from other cache keys', () => {
      const result = buildCacheKey('trip-123', false, false);
      expect(result).toMatch(/^legacy-/);
    });

    it('should handle special characters in trip ID', () => {
      const result = buildCacheKey('trip-123-special_chars', true, false);
      expect(result).toBe('legacy-trip-123-special_chars-true-false');
    });
  });
});
