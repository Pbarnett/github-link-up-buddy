import * as React from 'react';
// A/B Testing Framework for Personalization Features
// Based on research recommendations for statistical rigor

export interface ABTestConfig {
  name: string;
  description: string;
  variants: ABTestVariant[];
  trafficAllocation: number; // 0-1, percentage of users in experiment
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  targetSampleSize: number;
  significance: number; // default 0.05
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, percentage of experiment traffic
  config: Record<string, unknown>;
}

export interface ABTestAssignment {
  experimentId: string;
  variantId: string;
  userId: string;
  assignedAt: Date;
  sessionId?: string;
}

export interface ABTestEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  eventType: 'exposure' | 'conversion' | 'engagement';
  eventName: string;
  timestamp: Date;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

// Personalization-specific AB test configurations
export const PERSONALIZATION_AB_TESTS: Record<string, ABTestConfig> = {
  personalizedGreetings: {
    name: 'Personalized Greetings Impact',
    description:
      'Test impact of personalized greetings vs generic on engagement',
    variants: [
      {
        id: 'control',
        name: 'Generic Greeting',
        description: 'Standard "Welcome back" greeting',
        weight: 0.5,
        config: {
          enablePersonalization: false,
          greetingType: 'generic',
        },
      },
      {
        id: 'treatment',
        name: 'Personalized Greeting',
        description: 'Name-based personalized greeting',
        weight: 0.5,
        config: {
          enablePersonalization: true,
          greetingType: 'personalized',
        },
      },
    ],
    trafficAllocation: 0.2, // Start with 20% of users
    startDate: new Date(),
    isActive: true,
    targetSampleSize: 1000, // Minimum sample size per variant
    significance: 0.05,
  },

  greetingVariants: {
    name: 'Greeting Tone Variants',
    description: 'Test different tones in personalized greetings',
    variants: [
      {
        id: 'warmth_high',
        name: 'High Warmth',
        description: 'Very friendly, enthusiastic tone',
        weight: 0.33,
        config: {
          voiceConfig: {
            warmth: 'high',
            competence: 'friendly',
            humor: 'light',
          },
        },
      },
      {
        id: 'competence_focus',
        name: 'Competence Focus',
        description: 'Professional, trustworthy tone',
        weight: 0.33,
        config: {
          voiceConfig: {
            warmth: 'medium',
            competence: 'expert',
            humor: 'none',
          },
        },
      },
      {
        id: 'balanced',
        name: 'Balanced Tone',
        description: 'Balanced warmth and competence',
        weight: 0.34,
        config: {
          voiceConfig: {
            warmth: 'medium',
            competence: 'friendly',
            humor: 'light',
          },
        },
      },
    ],
    trafficAllocation: 0.1, // 10% of users for this more specific test
    startDate: new Date(),
    isActive: false, // Will activate after initial test
    targetSampleSize: 500,
    significance: 0.05,
  },
};

// Hash-based consistent user assignment (ensures user stays in same variant)
export function getUserVariant(
  userId: string,
  experimentId: string
): string | null {
  const experiment = PERSONALIZATION_AB_TESTS[experimentId];
  if (!experiment || !experiment.isActive) {
    return null;
  }

  // Check if user should be in experiment (traffic allocation)
  const hashForTraffic = simpleHash(userId + experimentId + 'traffic');
  const trafficThreshold = experiment.trafficAllocation * 1000;
  if (hashForTraffic % 1000 >= trafficThreshold) {
    return null; // User not in experiment
  }

  // Assign to variant based on weights
  const hashForVariant = simpleHash(userId + experimentId + 'variant');
  const normalizedHash = (hashForVariant % 1000) / 1000; // 0-1

  let cumulativeWeight = 0;
  for (const variant of experiment.variants) {
    cumulativeWeight += variant.weight;
    if (normalizedHash <= cumulativeWeight) {
      return variant.id;
    }
  }

  // Fallback to first variant
  return experiment.variants[0]?.id || null;
}

// Simple hash function for consistent assignment
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Track A/B test events
export async function trackABTestEvent(event: ABTestEvent): Promise<void> {
  // In a real implementation, this would send to analytics service
  console.log('📊 AB Test Event:', {
    experiment: event.experimentId,
    variant: event.variantId,
    event: event.eventName,
    type: event.eventType,
    timestamp: event.timestamp,
    userId: event.userId.slice(0, 8) + '...', // Partial ID for privacy
  });

  // For now, store in localStorage for testing (in production, use proper analytics)
  const storageKey = 'ab_test_events';
  const existingEvents = JSON.parse(localStorage.getItem(storageKey) || '[]');
  existingEvents.push(event);
  localStorage.setItem(storageKey, JSON.stringify(existingEvents));
}

// Get user's current AB test assignments
export function getUserABTestAssignments(
  userId: string
): Record<string, string> {
  const assignments: Record<string, string> = {};

  Object.keys(PERSONALIZATION_AB_TESTS).forEach(experimentId => {
    const variant = getUserVariant(userId, experimentId);
    if (variant) {
      assignments[experimentId] = variant;
    }
  });

  return assignments;
}

// Helper to check if user is in specific experiment variant
export function isUserInVariant(
  userId: string,
  experimentId: string,
  variantId: string
): boolean {
  const _userVariant = getUserVariant(userId, experimentId);
  return _userVariant === variantId;
}

// Get experiment configuration for a user
export function getExperimentConfig(
  userId: string,
  experimentId: string
): Record<string, unknown> | null {
  const experiment = PERSONALIZATION_AB_TESTS[experimentId];
  const _userVariant = getUserVariant(userId, experimentId);

  if (!experiment || !_userVariant) {
    return null;
  }

  const variant = experiment.variants.find(v => v.id === _userVariant);
  return variant?.config || null;
}

// Statistical analysis helpers (basic implementation)
export interface ABTestResults {
  experimentId: string;
  variants: {
    id: string;
    name: string;
    sampleSize: number;
    conversionRate: number;
    sessionLength: number;
    events: ABTestEvent[];
  }[];
  winner?: string;
  confidence: number;
  isSignificant: boolean;
  recommendation: string;
}

export async function analyzeABTestResults(
  experimentId: string
): Promise<ABTestResults> {
  // In a real implementation, this would query the analytics database
  const events = JSON.parse(
    localStorage.getItem('ab_test_events') || '[]'
  ).filter((event: ABTestEvent) => event.experimentId === experimentId);

  const experiment = PERSONALIZATION_AB_TESTS[experimentId];
  if (!experiment) {
    throw new Error(`Experiment ${experimentId} not found`);
  }

  const results: ABTestResults = {
    experimentId,
    variants: experiment.variants.map(variant => {
      const variantEvents = events.filter(
        (e: ABTestEvent) => e.variantId === variant.id
      );
      const exposureEvents = variantEvents.filter(
        (e: ABTestEvent) => e.eventType === 'exposure'
      );
      const conversionEvents = variantEvents.filter(
        (e: ABTestEvent) => e.eventType === 'conversion'
      );

      return {
        id: variant.id,
        name: variant.name,
        sampleSize: exposureEvents.length,
        conversionRate:
          exposureEvents.length > 0
            ? conversionEvents.length / exposureEvents.length
            : 0,
        sessionLength: calculateAvgSessionLength(variantEvents),
        events: variantEvents,
      };
    }),
    winner: undefined,
    confidence: 0,
    isSignificant: false,
    recommendation: 'Insufficient data for analysis',
  };

  // Simple statistical significance check (in production, use proper statistical tests)
  if (
    results.variants.every(v => v.sampleSize >= experiment.targetSampleSize)
  ) {
    const controlVariant = results.variants.find(v => v.id === 'control');
    const treatmentVariant = results.variants.find(v => v.id === 'treatment');

    if (controlVariant && treatmentVariant) {
      const improvementRate =
        (treatmentVariant.conversionRate - controlVariant.conversionRate) /
        controlVariant.conversionRate;

      // Basic significance check (in production, use proper chi-square test)
      if (
        Math.abs(improvementRate) > 0.05 &&
        Math.min(controlVariant.sampleSize, treatmentVariant.sampleSize) >= 100
      ) {
        results.isSignificant = true;
        results.confidence = 0.95; // Simplified
        results.winner = improvementRate > 0 ? 'treatment' : 'control';
        results.recommendation =
          improvementRate > 0
            ? 'Personalization shows positive impact. Recommend full rollout.'
            : 'Personalization shows negative impact. Recommend keeping current approach.';
      }
    }
  }

  return results;
}

function calculateAvgSessionLength(events: ABTestEvent[]): number {
  // Simplified session length calculation
  const sessionEvents = events.filter(e => e.eventType === 'engagement');
  return sessionEvents.length > 0 ? sessionEvents.length * 60 : 0; // Mock calculation
}

// Export key metrics for dashboard
export function getABTestDashboardMetrics(experimentId: string): {
  totalUsers: number;
  activeUsers: number;
  conversionRate: number;
  averageSessionLength: number;
  status: 'active' | 'paused' | 'complete';
} {
  const events = JSON.parse(
    localStorage.getItem('ab_test_events') || '[]'
  ).filter((event: ABTestEvent) => event.experimentId === experimentId);

  const uniqueUsers = new Set(events.map((e: ABTestEvent) => e.userId));
  const conversionEvents = events.filter(
    (e: ABTestEvent) => e.eventType === 'conversion'
  );
  const exposureEvents = events.filter(
    (e: ABTestEvent) => e.eventType === 'exposure'
  );

  return {
    totalUsers: uniqueUsers.size,
    activeUsers: uniqueUsers.size, // Simplified
    conversionRate:
      exposureEvents.length > 0
        ? conversionEvents.length / exposureEvents.length
        : 0,
    averageSessionLength: calculateAvgSessionLength(events),
    status: PERSONALIZATION_AB_TESTS[experimentId]?.isActive
      ? 'active'
      : 'paused',
  };
}
