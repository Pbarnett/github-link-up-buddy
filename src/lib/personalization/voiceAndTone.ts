// Voice & Tone Guidelines and Content Library for Parker Flight Personalization
// Based on research: Warmth, Competence, Light Humor

import { GreetingContext, VoiceConfig } from '@/types/personalization';

// Default voice configuration - matches research recommendations
export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  warmth: 'high',
  competence: 'friendly',
  humor: 'light',
};

// Voice & Tone Guidelines
export const VOICE_GUIDELINES = {
  warmth: {
    description: 'Be welcoming and human - like a friendly travel concierge',
    do: [
      'Use second-person ("you") and casual phrasing',
      'Show empathy and positive sentiment',
      'Write as if inviting the user into your home',
      'Use inclusive language that makes all users feel comfortable',
    ],
    dont: [
      'Use stiff or generic language',
      'Be overly formal or corporate',
      'Assume gender or personal details not provided',
      'Use language that might exclude any user group',
    ],
    examples: {
      good: '✈️ Welcome back, John! Ready for your next adventure?',
      bad: 'User 42, your session is active.',
    },
  },
  competence: {
    description: 'Convey trust and expertise through clarity',
    do: [
      'Use clear, concise language',
      'Ensure data accuracy when personalizing',
      'Show system reliability and knowledge',
      'Be confident but not arrogant',
    ],
    dont: [
      'Use slang or jokes that undermine confidence',
      'Be overly casual when clarity is needed',
      'Make errors with personal data',
      'Use confusing terminology',
    ],
    examples: {
      good: 'Safe travels to Paris tomorrow – we\'ve got your itinerary ready.',
      bad: 'Yo John, we fixed ya flights',
    },
  },
  humor: {
    description: 'Delight with light playfulness when appropriate',
    do: [
      'Use mild travel-related puns in low-stakes moments',
      'Add joyful exclamations when celebrating',
      'Use humor as seasoning, not the main course',
      'Match user\'s likely emotional state',
    ],
    dont: [
      'Force humor in serious contexts (errors, payments)',
      'Use humor that could be misinterpreted',
      'Rely on very localized jokes',
      'Use humor when efficiency is needed',
    ],
    examples: {
      good: 'Happy Friday, Anna – the weekend is plane sailing from here! ✈️',
      bad: 'Looks like we lost your booking in the Bermuda Triangle! 😱',
    },
  },
};

// Greeting content library with variants for different contexts
export const GREETING_LIBRARY = {
  dashboard: {
    withFirstName: [
      '✈️ Welcome back, {firstName}!',
      'Good to see you, {firstName}!',
      'Hello {firstName}! Ready to find your next adventure?',
      'Hey {firstName}! What\'s your next destination?',
      'Welcome back, {firstName}! Let\'s find some great flights.',
    ],
    withFirstNameAndTrip: [
      '✈️ Welcome back, {firstName}! Still planning that trip to {nextTripCity}?',
      'Hello {firstName}! Ready for {nextTripCity}?',
      'Good to see you, {firstName}! How\'s that {nextTripCity} trip coming along?',
      'Hey {firstName}! Let\'s get you to {nextTripCity}!',
      'Welcome back, {firstName}! {nextTripCity} is calling! 🌎',
    ],
    generic: [
      '✈️ Welcome back! Ready for your next adventure?',
      'Hello! What\'s your next destination?',
      'Welcome back! Let\'s find some great flights.',
      'Ready to explore the world?',
      'Welcome back, traveler! Where to next?',
    ],
  },
  bookingConfirmation: {
    withFirstName: [
      '🎉 Congratulations {firstName}! Your flight is booked.',
      'All set, {firstName}! Have an amazing trip.',
      'Perfect, {firstName}! Your journey begins soon.',
      'Excellent choice, {firstName}! Safe travels ahead.',
    ],
    withFirstNameAndTrip: [
      '🎉 {firstName}, you\'re all set for {nextTripCity}!',
      'Perfect! {firstName}, {nextTripCity} here you come!',
      '{firstName}, your {nextTripCity} adventure is confirmed! ✈️',
    ],
    generic: [
      '🎉 Your flight is booked! Have an amazing trip.',
      'All set! Safe travels ahead.',
      'Perfect! Your journey begins soon.',
    ],
  },
  profile: {
    withFirstName: [
      'Hi {firstName}! Let\'s keep your profile up to date.',
      'Hello {firstName}! Managing your travel preferences?',
      'Hey {firstName}! Your profile, your way.',
    ],
    generic: [
      'Let\'s keep your profile up to date.',
      'Managing your travel preferences?',
      'Your profile, your way.',
    ],
  },
  error: {
    withFirstName: [
      'Sorry {firstName}, we hit a small turbulence. Let\'s try again.',
      '{firstName}, something went wrong. We\'re on it!',
      'Oops {firstName}! Let\'s get this sorted.',
    ],
    generic: [
      'Sorry, we hit a small turbulence. Let\'s try again.',
      'Something went wrong. We\'re on it!',
      'Oops! Let\'s get this sorted.',
    ],
  },
};

// Helper function to get appropriate greeting based on context and available data
export function getGreeting(
  context: GreetingContext,
  personalizationData?: { firstName?: string; nextTripCity?: string } | null,
  variant?: string
): string {
  const contextGreetings = GREETING_LIBRARY[context as keyof typeof GREETING_LIBRARY];
  if (!contextGreetings) {
    return 'Welcome back!'; // Fallback for unknown contexts
  }

  const { firstName, nextTripCity } = personalizationData || {};

  // Determine which greeting array to use
  let greetingArray: string[];
  if (firstName && nextTripCity && contextGreetings.withFirstNameAndTrip) {
    greetingArray = contextGreetings.withFirstNameAndTrip;
  } else if (firstName && contextGreetings.withFirstName) {
    greetingArray = contextGreetings.withFirstName;
  } else {
    greetingArray = contextGreetings.generic;
  }

  // Select greeting (random or specified variant)
  let selectedGreeting: string;
  if (variant && parseInt(variant) < greetingArray.length) {
    selectedGreeting = greetingArray[parseInt(variant)];
  } else {
    // Use deterministic selection based on user data to ensure consistency
    const seed = (firstName || 'anonymous').length + (nextTripCity || '').length;
    selectedGreeting = greetingArray[seed % greetingArray.length];
  }

  // Replace placeholders with actual data
  return selectedGreeting
    .replace('{firstName}', firstName || '')
    .replace('{nextTripCity}', nextTripCity || '');
}

// Function to validate content against voice guidelines
export function validateContent(content: string, context: GreetingContext): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for overly formal language
  if (content.includes('esteemed') || content.includes('greetings')) {
    issues.push('Content appears overly formal');
    suggestions.push('Try more casual, friendly language');
  }

  // Check for inappropriate humor in serious contexts
  if ((context === 'error' || context === 'bookingConfirmation') && 
      (content.includes('😱') || content.includes('joke'))) {
    issues.push('Humor may be inappropriate for this context');
    suggestions.push('Focus on clarity and helpfulness');
  }

  // Check for inclusivity
  if (content.includes('man') || content.includes('guy')) {
    issues.push('Language may not be inclusive');
    suggestions.push('Use gender-neutral alternatives');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
}

// Export greeting categories for easy reference
export const GREETING_CONTEXTS = Object.keys(GREETING_LIBRARY) as GreetingContext[];
