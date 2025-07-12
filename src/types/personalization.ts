// Types for personalization features based on research plan
// Following privacy-first approach with data minimization

export interface PersonalizationData {
  firstName?: string;
  nextTripCity?: string;
  loyaltyTier?: string;
}

// Allowed personalization keys for type safety
export type AllowedPersonalizationKey = keyof PersonalizationData;

// Context types for personalization greetings
export type GreetingContext = 
  | 'dashboard' 
  | 'bookingConfirmation' 
  | 'flightStatus' 
  | 'error'
  | 'profile'
  | 'welcome';

export interface GreetingBannerProps {
  context: GreetingContext;
  userId?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

// Feature flag types for controlled rollout
export interface PersonalizationFeatureFlags {
  personalizedGreetings: boolean;
  nextTripSuggestions: boolean;
  loyaltyBadges: boolean;
}

// Voice & tone configuration
export interface VoiceConfig {
  warmth: 'low' | 'medium' | 'high';
  competence: 'professional' | 'friendly' | 'expert';
  humor: 'none' | 'light' | 'playful';
}

// Analytics event types for personalization
export interface PersonalizationEvent {
  type: 'greeting_shown' | 'greeting_clicked' | 'profile_updated';
  context: GreetingContext;
  data?: {
    variant?: string;
    hasPersonalData?: boolean;
    interactionType?: string;
  };
  timestamp: Date;
  userId: string;
}

// Error handling for personalization features
export interface PersonalizationError {
  type: 'fetch_failed' | 'display_error' | 'privacy_violation';
  message: string;
  context?: string;
  fallbackUsed: boolean;
}
