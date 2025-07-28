import * as React from 'react';
/**
 * Business Rules Configuration Schema
 *
 * Production-ready schema with versioning, validation, and type safety
 * Based on enterprise patterns from Spotify, Airbnb, and Netflix
 */

import { z } from 'zod';

// Schema version for backward compatibility
export const SCHEMA_VERSION = '1.0.0';

// Base filter configuration
const FilterConfigSchema = z.object({
  id: z.string(),
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(100),
  parameters: z.record(z.unknown()).optional(),
});

// UI section visibility rules
const UISectionConfigSchema = z.object({
  destination: z.boolean().default(true),
  departure: z.boolean().default(true),
  dates: z.boolean().default(true),
  budget: z.boolean().default(true),
  advancedFilters: z.boolean().default(false),
  paymentMethod: z.boolean().default(true),
  travelerInfo: z.boolean().default(true),
});

// Flight search behavior rules
const FlightSearchConfigSchema = z.object({
  // Core business rules
  forceRoundTrip: z.boolean().default(true),
  defaultNonstopRequired: z.boolean().default(true),
  maxAdvanceBookingDays: z.number().min(1).max(365).default(365),
  minAdvanceBookingDays: z.number().min(0).max(30).default(1),

  // Allowed values
  allowedCabinClasses: z
    .array(z.enum(['economy', 'premium_economy', 'business', 'first']))
    .default(['economy']),
  allowedAirlines: z.array(z.string()).optional(),
  blockedAirlines: z.array(z.string()).optional(),

  // Price constraints
  maxPriceUSD: z.number().min(50).max(50000).default(5000),
  minPriceUSD: z.number().min(0).max(1000).default(50),

  // Geographic restrictions
  allowedOriginCountries: z.array(z.string()).optional(),
  allowedDestinationCountries: z.array(z.string()).optional(),
});

// Auto-booking specific rules
const AutoBookingConfigSchema = z.object({
  enabled: z.boolean().default(true),
  maxConcurrentCampaigns: z.number().min(1).max(10).default(3),
  cooldownPeriodHours: z.number().min(1).max(168).default(24),
  requiresPaymentMethodVerification: z.boolean().default(true),
  maxMonthlySpend: z.number().min(100).max(10000).default(2000),
});

// A/B testing configuration
const ABTestConfigSchema = z.object({
  testId: z.string(),
  variant: z.enum(['control', 'treatment_a', 'treatment_b']),
  trafficPercentage: z.number().min(0).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Main business rules configuration
export const BusinessRulesConfigSchema = z.object({
  // Metadata
  version: z.string().default(SCHEMA_VERSION),
  environment: z.enum(['development', 'staging', 'production', 'test']),
  lastUpdated: z.string().datetime(),
  updatedBy: z.string(),

  // Feature context
  context: z.enum(['flight-search', 'auto-booking', 'manual-search']),

  // Configuration sections
  ui: UISectionConfigSchema,
  flightSearch: FlightSearchConfigSchema,
  autoBooking: AutoBookingConfigSchema,
  filters: z.array(FilterConfigSchema),

  // A/B testing (optional)
  abTest: ABTestConfigSchema.optional(),

  // Emergency overrides
  emergencyDisable: z.boolean().default(false),
  emergencyMessage: z.string().optional(),
});

export type BusinessRulesConfig = z.infer<typeof BusinessRulesConfigSchema>;

// Default configurations for each environment
export const DEFAULT_CONFIGS: Record<string, Partial<BusinessRulesConfig>> = {
  test: {
    environment: 'test',
    flightSearch: {
      forceRoundTrip: false,
      defaultNonstopRequired: false,
      maxAdvanceBookingDays: 30,
      minAdvanceBookingDays: 1,
      allowedCabinClasses: ['economy', 'business', 'first'],
      maxPriceUSD: 3000,
      minPriceUSD: 50,
    },
    ui: {
      destination: true,
      departure: true,
      dates: true,
      budget: true,
      advancedFilters: true,
      paymentMethod: true,
      travelerInfo: true,
    },
    autoBooking: {
      enabled: true,
      maxConcurrentCampaigns: 3,
      cooldownPeriodHours: 24,
      requiresPaymentMethodVerification: true,
      maxMonthlySpend: 1000,
    },
  },

  development: {
    environment: 'development',
    flightSearch: {
      forceRoundTrip: false, // More flexibility in dev
      defaultNonstopRequired: false,
      maxAdvanceBookingDays: 30,
      minAdvanceBookingDays: 1,
      allowedCabinClasses: ['economy', 'premium_economy', 'business', 'first'],
      maxPriceUSD: 10000,
      minPriceUSD: 50,
    },
    ui: {
      destination: true,
      departure: true,
      dates: true,
      budget: true,
      advancedFilters: true, // Show all options in dev
      paymentMethod: true,
      travelerInfo: true,
    },
  },

  staging: {
    environment: 'staging',
    flightSearch: {
      forceRoundTrip: true,
      defaultNonstopRequired: true,
      maxAdvanceBookingDays: 180,
      minAdvanceBookingDays: 1,
      allowedCabinClasses: ['economy', 'premium_economy', 'business', 'first'],
      maxPriceUSD: 8000,
      minPriceUSD: 50,
    },
  },

  production: {
    environment: 'production',
    flightSearch: {
      forceRoundTrip: true,
      defaultNonstopRequired: true,
      maxAdvanceBookingDays: 365,
      minAdvanceBookingDays: 1,
      allowedCabinClasses: ['economy', 'premium_economy', 'business', 'first'],
      maxPriceUSD: 5000,
      minPriceUSD: 50,
    },
    ui: {
      destination: true,
      departure: true,
      dates: true,
      budget: true,
      advancedFilters: false, // Simplified for users
      paymentMethod: true,
      travelerInfo: true,
    },
    autoBooking: {
      enabled: true,
      maxConcurrentCampaigns: 3,
      cooldownPeriodHours: 24,
      requiresPaymentMethodVerification: true,
      maxMonthlySpend: 2000,
    },
  },
};

// Configuration validation helper with optimized error reporting
export function validateBusinessRulesConfig(
  config: unknown
): BusinessRulesConfig {
  const result = BusinessRulesConfigSchema.safeParse(config);

  if (!result.success) {
    // Create more detailed error message
    const errorDetails = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join('; ');

    throw new Error(`Invalid business rules configuration: ${errorDetails}`);
  }

  return result.data;
}

// Configuration merger for environment-specific overrides
export function mergeConfigs(
  base: Partial<BusinessRulesConfig>,
  override: Partial<BusinessRulesConfig>
): BusinessRulesConfig {
  const merged = {
    ...base,
    ...override,
    ui: { ...base.ui, ...override.ui },
    flightSearch: { ...base.flightSearch, ...override.flightSearch },
    autoBooking: { ...base.autoBooking, ...override.autoBooking },
    filters: override.filters || base.filters || [],
  };

  return validateBusinessRulesConfig(merged);
}

// Type guards for configuration contexts
export function isFlightSearchConfig(config: BusinessRulesConfig): boolean {
  return ['flight-search', 'manual-search'].includes(config.context);
}

export function isAutoBookingConfig(config: BusinessRulesConfig): boolean {
  return config.context === 'auto-booking';
}
