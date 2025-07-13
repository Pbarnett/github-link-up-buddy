/**
 * Profile Completeness Service
 * Calculates completion scores and provides recommendations for profile enhancement
 * Enhanced with database integration and unified profile architecture
 */

// import { supabase } from '@/integrations/supabase/client';
import { TravelerProfile } from '@/hooks/useTravelerProfile';

export interface ProfileCompletenessScore {
  overall: number; // 0-100
  categories: {
    basic_info: number;
    contact_info: number;
    travel_documents: number;
    preferences: number;
    verification: number;
  };
  missing_fields: string[];
  recommendations: ProfileRecommendation[];
}

export interface ProfileRecommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  points_value: number;
}

export interface UnifiedProfile {
  // Core identity (always required)
  basic_info: {
    full_name: string;
    email: string;
    phone?: string;
    phone_verified: boolean;
  };
  
  // Travel details (collected progressively)
  travel_info?: {
    date_of_birth: Date;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    passport_number_encrypted?: string;
    passport_country?: string;
    passport_expiry?: Date;
    known_traveler_number?: string;
  };
  
  // Preferences (enhanced from current system)
  preferences: {
    notifications: NotificationPreferences;
    travel: TravelPreferences;
  };
  
  // Metadata
  profile_completeness_score: number;
  is_verified: boolean;
  verification_level: 'basic' | 'enhanced' | 'premium';
}

export interface NotificationPreferences {
  transactional: {
    booking_confirmations: ChannelPreferences;
    booking_failures: ChannelPreferences;
    payment_receipts: ChannelPreferences;
  };
  informational: {
    flight_status: ChannelPreferences;
    check_in_reminders: ChannelPreferences;
    price_alerts: ChannelPreferences;
  };
  marketing: {
    promotions: ChannelPreferences;
    newsletters: ChannelPreferences;
  };
  preferences: {
    quiet_hours: { start: number; end: number };
    timezone: string;
    digest_frequency: 'immediate' | 'daily' | 'weekly';
  };
}

export interface ChannelPreferences {
  email: boolean;
  sms: boolean;
  push?: boolean;
  in_app?: boolean;
}

export interface TravelPreferences {
  preferred_airports?: string[];
  preferred_airlines?: string[];
  seat_preference?: 'window' | 'aisle' | 'middle' | 'any';
  meal_preference?: string;
  accessibility_needs?: string[];
  frequent_flyer_programs?: Array<{ 
    airline: string; 
    number: string; 
    tier?: string; 
  }>; 
}

class ProfileCompletenessService {
  
  /**
   * Calculate comprehensive profile completeness score
   */
  calculateCompleteness(profile: TravelerProfile): ProfileCompletenessScore {
    const scores = {
      basic_info: this.calculateBasicInfoScore(profile),
      contact_info: this.calculateContactInfoScore(profile),
      travel_documents: this.calculateTravelDocumentsScore(profile),
      preferences: this.calculatePreferencesScore(profile),
      verification: this.calculateVerificationScore(profile)
    };

    const overall = Math.round(
      (scores.basic_info * 0.3) +
      (scores.contact_info * 0.2) +
      (scores.travel_documents * 0.2) +
      (scores.preferences * 0.15) +
      (scores.verification * 0.15)
    );

    const missing_fields = this.identifyMissingFields(profile);
    const recommendations = this.generateRecommendations(profile, scores);

    return {
      overall,
      categories: scores,
      missing_fields,
      recommendations
    };
  }

  private calculateBasicInfoScore(profile: TravelerProfile): number {
    let score = 0;
    const fields = [
      { field: 'full_name', weight: 30, required: true },
      { field: 'date_of_birth', weight: 30, required: true },
      { field: 'gender', weight: 20, required: true },
      { field: 'email', weight: 20, required: true }
    ];

    fields.forEach(({ field, weight, required }) => {
      const value = profile[field as keyof TravelerProfile];
      if (value && value !== '') {
        score += weight;
      } else if (required) {
        score = 0; // Required fields must be present
        return;
      }
    });

    return Math.min(score, 100);
  }

  private calculateContactInfoScore(profile: TravelerProfile): number {
    let score = 0;
    
    // Email (already counted in basic info, but verify format)
    if (profile.email && this.isValidEmail(profile.email)) {
      score += 40;
    }

    // Phone number
    if (profile.phone) {
      score += 30;
      // Bonus for verified phone
      if (profile.phone_verified) {
        score += 30;
      }
    }

    return Math.min(score, 100);
  }

  private calculateTravelDocumentsScore(profile: TravelerProfile): number {
    let score = 0;

    // Passport information
    if (profile.passport_number) {
      score += 40;
    }
    if (profile.passport_country) {
      score += 20;
    }
    if (profile.passport_expiry) {
      const expiry = new Date(profile.passport_expiry);
      const now = new Date();
      const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilExpiry > 6) {
        score += 20; // Valid passport
      } else if (monthsUntilExpiry > 0) {
        score += 10; // Expires soon
      }
    }

    // Known traveler programs
    if (profile.known_traveler_number) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  private calculatePreferencesScore(profile: TravelerProfile): number {
    let score = 0;

    // Notification preferences
    if (profile.notification_preferences) {
      score += 40;
    }

    // Travel preferences (if implemented)
    if (profile.travel_preferences) {
      score += 60;
    } else {
      // Basic travel preferences
      score += 30; // Partial score for basic setup
    }

    return Math.min(score, 100);
  }

  private calculateVerificationScore(profile: TravelerProfile): number {
    let score = 0;

    if (profile.is_verified) {
      score += 100;
    } else {
    // Partial credit for having verification-ready information
      if (profile.passport_number && profile.passport_country) {
        score += 30;
      }
      if (profile.phone_verified) {
        score += 20;
      }
    }

    return Math.min(score, 100);
  }

  private identifyMissingFields(profile: TravelerProfile): string[] {
    const missing: string[] = [];

    // Required fields
    if (!profile.full_name) missing.push('full_name');
    if (!profile.date_of_birth) missing.push('date_of_birth');
    if (!profile.gender) missing.push('gender');
    if (!profile.email) missing.push('email');

    // Important fields
    if (!profile.phone) missing.push('phone');
    if (!profile.passport_number) missing.push('passport_number');
    if (!profile.passport_country) missing.push('passport_country');
    if (!profile.passport_expiry) missing.push('passport_expiry');

    return missing;
  }

  private generateRecommendations(
    profile: TravelerProfile, 
    _scores: Record<string, number>
  ): ProfileRecommendation[] {
    const recommendations: ProfileRecommendation[] = [];

    // Phone verification
    if (profile.phone && !profile.phone_verified) {
      recommendations.push({
        category: 'contact_info',
        priority: 'high',
        title: 'Verify your phone number',
        description: 'Verify your phone number to receive important booking updates via SMS',
        action: 'verify_phone',
        points_value: 15
      });
    }

    // Missing phone
    if (!profile.phone) {
      recommendations.push({
        category: 'contact_info',
        priority: 'medium',
        title: 'Add phone number',
        description: 'Add your phone number for SMS notifications and account security',
        action: 'add_phone',
        points_value: 10
      });
    }

    // Travel documents
    if (!profile.passport_number) {
      recommendations.push({
        category: 'travel_documents',
        priority: 'medium',
        title: 'Add passport information',
        description: 'Add your passport details for faster international booking',
        action: 'add_passport',
        points_value: 20
      });
    }

    // Identity verification
    if (!profile.is_verified && profile.passport_number) {
      recommendations.push({
        category: 'verification',
        priority: 'low',
        title: 'Verify your identity',
        description: 'Complete identity verification for higher booking limits and security',
        action: 'verify_identity',
        points_value: 25
      });
    }

    // Expiring passport
    if (profile.passport_expiry) {
      const expiry = new Date(profile.passport_expiry);
      const now = new Date();
      const monthsUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilExpiry < 6 && monthsUntilExpiry > 0) {
        recommendations.push({
          category: 'travel_documents',
          priority: 'high',
          title: 'Passport expires soon',
          description: 'Your passport expires soon. Update your passport information.',
          action: 'update_passport',
          points_value: 10
        });
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get profile completion percentage for display
   */
  getCompletionPercentage(profile: TravelerProfile): number {
    return this.calculateCompleteness(profile).overall;
  }

  /**
   * Get next recommended action for profile improvement
   */
  getNextAction(profile: TravelerProfile): ProfileRecommendation | null {
    const recommendations = this.generateRecommendations(profile, {});
    return recommendations.length > 0 ? recommendations[0] : null;
  }

  /**
   * Check if profile meets minimum requirements for booking
   */
  meetsBookingRequirements(profile: TravelerProfile): {
    canBook: boolean;
    missingRequirements: string[];
  } {
    const required = ['full_name', 'date_of_birth', 'gender', 'email'];
    const missing = required.filter(field => !profile[field as keyof TravelerProfile]);

    return {
      canBook: missing.length === 0,
      missingRequirements: missing
    };
  }
}

// Export singleton instance
export const profileCompletenessService = new ProfileCompletenessService();
export default profileCompletenessService;
