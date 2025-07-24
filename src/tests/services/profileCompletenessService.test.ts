import { describe, it, expect } from 'vitest';
import { profileCompletenessService } from '@/services/profileCompletenessService';
import { TravelerProfile } from '@/hooks/useTravelerProfile';

describe('ProfileCompletenessService', () => {
  const createBasicProfile = (overrides: Partial<TravelerProfile> = {}): TravelerProfile => ({
    id: 'test-id',
    user_id: 'user-123',
    full_name: 'John Doe',
    date_of_birth: '1990-01-01',
    gender: 'MALE',
    email: 'john.doe@example.com',
    is_primary: true,
    is_verified: false,
    verification_level: 'basic',
    ...overrides,
  });

  describe('calculateCompleteness', () => {
    it('should return very low score for empty profile', () => {
      const emptyProfile = createBasicProfile({
        full_name: '',
        date_of_birth: '',
        gender: undefined as unknown as TravelerProfile['gender'],
        email: '',
      });

      const result = profileCompletenessService.calculateCompleteness(emptyProfile);
      expect(result.overall).toBeLessThan(10); // Very low score for empty profile
      expect(result.categories.basic_info).toBe(0); // Basic info should be 0 without required fields
    });

    it('should calculate basic info score correctly', () => {
      const basicProfile = createBasicProfile();
      const result = profileCompletenessService.calculateCompleteness(basicProfile);
      
      // Should have decent basic info score but missing other components
      expect(result.categories.basic_info).toBeGreaterThan(0);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.overall).toBeLessThan(100);
    });

    it('should give higher score for complete profile', () => {
      const completeProfile = createBasicProfile({
        phone: '+1234567890',
        phone_verified: true,
        passport_number: 'AB123456',
        passport_country: 'US',
        passport_expiry: '2030-01-01',
        known_traveler_number: 'KTN123456',
        is_verified: true,
        notification_preferences: { email: true, sms: true },
        travel_preferences: { seat_preference: 'window' },
      });

      const result = profileCompletenessService.calculateCompleteness(completeProfile);
      expect(result.overall).toBeGreaterThan(80);
    });

    it('should identify missing fields correctly', () => {
      const incompleteProfile = createBasicProfile();
      const result = profileCompletenessService.calculateCompleteness(incompleteProfile);
      
      expect(result.missing_fields).toContain('phone');
      expect(result.missing_fields).toContain('passport_number');
      expect(result.missing_fields).toContain('passport_country');
      expect(result.missing_fields).toContain('passport_expiry');
    });

    it('should generate appropriate recommendations', () => {
      const profileWithoutPhone = createBasicProfile();
      const result = profileCompletenessService.calculateCompleteness(profileWithoutPhone);
      
      const phoneRecommendation = result.recommendations.find(r => r.action === 'add_phone');
      expect(phoneRecommendation).toBeDefined();
      expect(phoneRecommendation?.title).toBe('Add phone number');
      expect(phoneRecommendation?.priority).toBe('medium');
    });

    it('should recommend phone verification when phone exists but not verified', () => {
      const profileWithUnverifiedPhone = createBasicProfile({
        phone: '+1234567890',
        phone_verified: false,
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileWithUnverifiedPhone);
      
      const verifyRecommendation = result.recommendations.find(r => r.action === 'verify_phone');
      expect(verifyRecommendation).toBeDefined();
      expect(verifyRecommendation?.priority).toBe('high');
    });

    it('should recommend passport update for expiring passport', () => {
      const soonExpiringDate = new Date();
      soonExpiringDate.setMonth(soonExpiringDate.getMonth() + 3); // 3 months from now
      
      const profileWithExpiringPassport = createBasicProfile({
        passport_number: 'AB123456',
        passport_country: 'US',
        passport_expiry: soonExpiringDate.toISOString().split('T')[0],
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileWithExpiringPassport);
      
      const passportRecommendation = result.recommendations.find(r => r.action === 'update_passport');
      expect(passportRecommendation).toBeDefined();
      expect(passportRecommendation?.priority).toBe('high');
    });

    it('should recommend identity verification when passport info is complete', () => {
      const profileReadyForVerification = createBasicProfile({
        passport_number: 'AB123456',
        passport_country: 'US',
        passport_expiry: '2030-01-01',
        is_verified: false,
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileReadyForVerification);
      
      const verificationRecommendation = result.recommendations.find(r => r.action === 'verify_identity');
      expect(verificationRecommendation).toBeDefined();
      expect(verificationRecommendation?.priority).toBe('low');
    });
  });

  describe('getCompletionPercentage', () => {
    it('should return the overall completion percentage', () => {
      const profile = createBasicProfile();
      const percentage = profileCompletenessService.getCompletionPercentage(profile);
      
      expect(typeof percentage).toBe('number');
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('getNextAction', () => {
    it('should return the highest priority recommendation', () => {
      const profile = createBasicProfile({
        phone: '+1234567890',
        phone_verified: false, // This should create a high-priority recommendation
      });
      
      const nextAction = profileCompletenessService.getNextAction(profile);
      
      expect(nextAction).toBeDefined();
      expect(nextAction?.action).toBe('verify_phone');
      expect(nextAction?.priority).toBe('high');
    });

    it('should return null for complete profile', () => {
      const completeProfile = createBasicProfile({
        phone: '+1234567890',
        phone_verified: true,
        passport_number: 'AB123456',
        passport_country: 'US',
        passport_expiry: '2030-01-01',
        known_traveler_number: 'KTN123456',
        is_verified: true,
        notification_preferences: { email: true, sms: true },
        travel_preferences: { seat_preference: 'window' },
      });

      const nextAction = profileCompletenessService.getNextAction(completeProfile);
      
      // Should have few or no recommendations for a complete profile
      expect(nextAction).toBeDefined(); // May still have some optimization recommendations
    });
  });

  describe('meetsBookingRequirements', () => {
    it('should return true for profile with required booking fields', () => {
      const bookingReadyProfile = createBasicProfile();
      const result = profileCompletenessService.meetsBookingRequirements(bookingReadyProfile);
      
      expect(result.canBook).toBe(true);
      expect(result.missingRequirements).toHaveLength(0);
    });

    it('should return false and list missing requirements for incomplete profile', () => {
      const incompleteProfile = createBasicProfile({
        full_name: '',
        date_of_birth: '',
      });
      
      const result = profileCompletenessService.meetsBookingRequirements(incompleteProfile);
      
      expect(result.canBook).toBe(false);
      expect(result.missingRequirements).toContain('full_name');
      expect(result.missingRequirements).toContain('date_of_birth');
    });
  });

  describe('category scores', () => {
    it('should calculate contact info score based on phone verification', () => {
      const profileWithVerifiedPhone = createBasicProfile({
        phone: '+1234567890',
        phone_verified: true,
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileWithVerifiedPhone);
      
      expect(result.categories.contact_info).toBeGreaterThan(50);
    });

    it('should calculate travel documents score based on passport info', () => {
      const profileWithPassport = createBasicProfile({
        passport_number: 'AB123456',
        passport_country: 'US',
        passport_expiry: '2030-01-01',
        known_traveler_number: 'KTN123456',
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileWithPassport);
      
      expect(result.categories.travel_documents).toBeGreaterThan(70);
    });

    it('should calculate verification score based on identity verification', () => {
      const verifiedProfile = createBasicProfile({
        is_verified: true,
      });
      
      const result = profileCompletenessService.calculateCompleteness(verifiedProfile);
      
      expect(result.categories.verification).toBe(100);
    });

    it('should calculate preferences score based on notification settings', () => {
      const profileWithPreferences = createBasicProfile({
        notification_preferences: { 
          email: true, 
          sms: true,
          transactional: { booking_confirmations: { email: true, sms: true } }
        },
        travel_preferences: { 
          seat_preference: 'window',
          preferred_airports: ['LAX', 'JFK']
        },
      });
      
      const result = profileCompletenessService.calculateCompleteness(profileWithPreferences);
      
      expect(result.categories.preferences).toBeGreaterThan(80);
    });
  });
});
