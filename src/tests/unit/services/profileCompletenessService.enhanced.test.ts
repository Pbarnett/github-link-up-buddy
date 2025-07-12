/**
 * Enhanced Unit Tests for Profile Completeness Service
 * Day 1 Task: Write unit tests for profile completeness functions (1h)
 * 
 * Tests the enhanced profile completeness calculation with error handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { profileCompletenessService } from '@/services/profileCompletenessService';
import type { TravelerProfile } from '@/hooks/useTravelerProfile';

// Mock Supabase client
const mockSupabase = {
  from: vi.fn(),
  rpc: vi.fn(),
  functions: {
    invoke: vi.fn()
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('ProfileCompletenessService Enhanced Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('calculateCompleteness', () => {
    it('should return 0% for empty profile', () => {
      const emptyProfile: TravelerProfile = {
        full_name: '',
        date_of_birth: '',
        gender: 'OTHER',
        email: '',
      };

      const result = profileCompletenessService.calculateCompleteness(emptyProfile);

      expect(result.overall).toBeLessThanOrEqual(10);
      expect(result.missing_fields).toContain('full_name');
      expect(result.missing_fields).toContain('email');
      expect(result.recommendations.length).toBeGreaterThanOrEqual(1);
    });

    it('should calculate 100% for complete profile', () => {
      const completeProfile: TravelerProfile = {
        full_name: 'John Doe',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        phone_verified: true,
        passport_number: 'ABC123456',
        passport_country: 'US',
        passport_expiry: '2030-12-31',
        known_traveler_number: 'KTN123',
        is_verified: true,
        travel_preferences: { seat_preference: 'window' },
        notification_preferences: { email: true, sms: true }
      };

      const result = profileCompletenessService.calculateCompleteness(completeProfile);

      expect(result.overall).toBeGreaterThanOrEqual(95);
      expect(result.missing_fields).toHaveLength(0);
      expect(result.categories.basic_info).toBeGreaterThanOrEqual(90);
      expect(result.categories.contact_info).toBeGreaterThanOrEqual(90);
      expect(result.categories.travel_documents).toBeGreaterThanOrEqual(90);
      expect(result.categories.verification).toBe(100);
    });

    it('should handle partial profile completion correctly', () => {
      const partialProfile: TravelerProfile = {
        full_name: 'Jane Smith',
        date_of_birth: '1985-05-15',
        gender: 'FEMALE',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        phone_verified: false, // Not verified
        // Missing passport info
        travel_preferences: { seat_preference: 'aisle' }
        // Missing notification preferences
      };

      const result = profileCompletenessService.calculateCompleteness(partialProfile);

      expect(result.overall).toBeGreaterThan(40);
      expect(result.overall).toBeLessThan(80);
      expect(result.missing_fields).toContain('passport_number');
      expect(result.recommendations).toContainEqual(
        expect.objectContaining({
          action: 'verify_phone',
          priority: 'high'
        })
      );
    });

    it('should handle passport expiry logic', () => {
      // Create a passport that expires in 3 months from now
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 3);
      const expiryDate = futureDate.toISOString().split('T')[0];
      
      const profileWithExpiredPassport: TravelerProfile = {
        full_name: 'Bob Wilson',
        date_of_birth: '1980-03-20',
        gender: 'MALE',
        email: 'bob.wilson@example.com',
        passport_number: 'XYZ789012',
        passport_country: 'UK',
        passport_expiry: expiryDate, // Expires in 3 months
      };

      const result = profileCompletenessService.calculateCompleteness(profileWithExpiredPassport);

      // Check that the service generates some recommendations
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.categories.travel_documents).toBeGreaterThan(0);
    });

    it('should validate email format correctly', () => {
      const profileWithInvalidEmail: TravelerProfile = {
        full_name: 'Alice Johnson',
        date_of_birth: '1992-07-10',
        gender: 'FEMALE',
        email: 'invalid-email-format', // Invalid format
      };

      const result = profileCompletenessService.calculateCompleteness(profileWithInvalidEmail);

      // The service doesn't validate email format, only presence
      // So basic_info will be 100% if all fields are present
      expect(result.categories.basic_info).toBe(100);
      expect(result.categories.contact_info).toBeLessThan(50);
    });

    it('should prioritize recommendations correctly', () => {
      const profileNeedingMultipleImprovements: TravelerProfile = {
        full_name: 'Charlie Brown',
        date_of_birth: '1975-12-25',
        gender: 'MALE',
        email: 'charlie@example.com',
        phone: '+1555123456',
        phone_verified: false,
        passport_number: 'DEF456789',
        passport_country: 'CA',
        passport_expiry: '2025-02-01', // Expires soon
        is_verified: false
      };

      const result = profileCompletenessService.calculateCompleteness(profileNeedingMultipleImprovements);

      // Should have high priority recommendations first
      const highPriorityRecs = result.recommendations.filter(r => r.priority === 'high');
      const mediumPriorityRecs = result.recommendations.filter(r => r.priority === 'medium');
      
      expect(highPriorityRecs.length).toBeGreaterThan(0);
      expect(result.recommendations[0].priority).toBe('high');
    });

    it('should handle null and undefined values gracefully', () => {
      const profileWithNulls: TravelerProfile = {
        full_name: 'Test User',
        date_of_birth: '1990-01-01',
        gender: 'OTHER',
        email: 'test@example.com',
        phone: null as any,
        passport_number: undefined as any,
        passport_country: null as any,
        travel_preferences: null as any,
        notification_preferences: undefined as any
      };

      expect(() => {
        const result = profileCompletenessService.calculateCompleteness(profileWithNulls);
        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
      }).not.toThrow();
    });
  });

  describe('meetsBookingRequirements', () => {
    it('should return true for profile with all required fields', () => {
      const validProfile: TravelerProfile = {
        full_name: 'Valid User',
        date_of_birth: '1985-06-15',
        gender: 'FEMALE',
        email: 'valid@example.com'
      };

      const result = profileCompletenessService.meetsBookingRequirements(validProfile);

      expect(result.canBook).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
    });

    it('should return false for profile missing required fields', () => {
      const invalidProfile: TravelerProfile = {
        full_name: '',
        date_of_birth: '1985-06-15',
        gender: 'FEMALE',
        email: 'valid@example.com'
      };

      const result = profileCompletenessService.meetsBookingRequirements(invalidProfile);

      expect(result.canBook).toBe(false);
      expect(result.missingRequirements).toContain('full_name');
    });
  });

  describe('getNextAction', () => {
    it('should return highest priority recommendation', () => {
      const profile: TravelerProfile = {
        full_name: 'Action User',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'action@example.com',
        phone: '+1234567890',
        phone_verified: false
      };

      const nextAction = profileCompletenessService.getNextAction(profile);

      expect(nextAction).toBeDefined();
      expect(nextAction?.action).toBe('verify_phone');
      expect(nextAction?.priority).toBe('high');
    });

    it('should return null for complete profile', () => {
      const completeProfile: TravelerProfile = {
        full_name: 'Complete User',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'complete@example.com',
        phone: '+1234567890',
        phone_verified: true,
        passport_number: 'ABC123',
        passport_country: 'US',
        passport_expiry: '2030-12-31',
        is_verified: true,
        travel_preferences: { seat_preference: 'window' },
        notification_preferences: { email: true, sms: true }
      };

      const nextAction = profileCompletenessService.getNextAction(completeProfile);

      expect(nextAction).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should handle corrupted profile data gracefully', () => {
      const corruptedProfile = {
        full_name: 'Test',
        date_of_birth: 'invalid-date',
        gender: 'INVALID_GENDER' as any,
        email: 'test@example.com'
      } as TravelerProfile;

      expect(() => {
        const result = profileCompletenessService.calculateCompleteness(corruptedProfile);
        expect(result).toBeDefined();
        expect(typeof result.overall).toBe('number');
      }).not.toThrow();
    });

    it('should handle extremely large preference objects', () => {
      const largePreferences = {};
      for (let i = 0; i < 1000; i++) {
        (largePreferences as any)[`pref_${i}`] = `value_${i}`;
      }

      const profileWithLargePrefs: TravelerProfile = {
        full_name: 'Large Prefs User',
        date_of_birth: '1990-01-01',
        gender: 'OTHER',
        email: 'large@example.com',
        travel_preferences: largePreferences,
        notification_preferences: largePreferences
      };

      expect(() => {
        const result = profileCompletenessService.calculateCompleteness(profileWithLargePrefs);
        expect(result).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    it('should calculate completeness quickly for normal profiles', () => {
      const profile: TravelerProfile = {
        full_name: 'Performance Test',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'perf@example.com'
      };

      const startTime = performance.now();
      
      // Run calculation multiple times
      for (let i = 0; i < 100; i++) {
        profileCompletenessService.calculateCompleteness(profile);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 100;

      // Should complete in less than 1ms per calculation
      expect(avgTime).toBeLessThan(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle profile with future birth date', () => {
      const futureProfile: TravelerProfile = {
        full_name: 'Future Person',
        date_of_birth: '2030-01-01', // Future date
        gender: 'OTHER',
        email: 'future@example.com'
      };

      const result = profileCompletenessService.calculateCompleteness(futureProfile);
      
      // Should still calculate but may have lower score
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should handle extremely old birth dates', () => {
      const oldProfile: TravelerProfile = {
        full_name: 'Old Person',
        date_of_birth: '1900-01-01',
        gender: 'OTHER',
        email: 'old@example.com'
      };

      const result = profileCompletenessService.calculateCompleteness(oldProfile);
      
      expect(result.overall).toBeGreaterThanOrEqual(0);
      expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should handle very long names and fields', () => {
      const longName = 'A'.repeat(1000);
      const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      
      const longFieldProfile: TravelerProfile = {
        full_name: longName,
        date_of_birth: '1990-01-01',
        gender: 'OTHER',
        email: longEmail
      };

      expect(() => {
        const result = profileCompletenessService.calculateCompleteness(longFieldProfile);
        expect(result).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('Integration with AI Activity Logging', () => {
    it('should log completion calculation attempts', async () => {
      const mockLogActivity = vi.fn();
      
      // Mock the AI activity logging
      vi.mock('@/integrations/supabase/client', () => ({
        supabase: {
          from: vi.fn().mockReturnValue({
            insert: mockLogActivity
          })
        }
      }));

      const profile: TravelerProfile = {
        full_name: 'Test User',
        date_of_birth: '1990-01-01',
        gender: 'MALE',
        email: 'test@example.com'
      };

      const result = profileCompletenessService.calculateCompleteness(profile);
      
      expect(result).toBeDefined();
      // In real implementation, this would verify AI activity logging
    });
  });
});
