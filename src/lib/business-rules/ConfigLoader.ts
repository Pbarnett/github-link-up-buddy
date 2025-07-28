import * as React from 'react';
import { BusinessRulesConfigSchema, type BusinessRulesConfig } from './schema';

class ConfigLoader {
  private cache: Map<string, BusinessRulesConfig> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async loadConfig(
    environment: string = 'production'
  ): Promise<BusinessRulesConfig> {
    const cacheKey = `config-${environment}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // In development, skip API call and use fallback config directly
    if (environment === 'development' || import.meta.env.DEV) {
      console.log('🔧 Using fallback business rules config for development');
      return this.getFallbackConfig(environment);
    }

    try {
      const response = await fetch(
        `/api/business-rules/config?env=${environment}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawConfig = await response.json();

      // Validate with Zod
      const validatedConfig = BusinessRulesConfigSchema.parse(rawConfig);

      // Cache the validated config
      this.cache.set(cacheKey, validatedConfig);

      // Auto-expire cache
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

      return validatedConfig;
    } catch (error) {
      console.warn(
        'Failed to load business rules config, using fallback:',
        error
      );
      return this.getFallbackConfig(environment);
    }
  }

  private getFallbackConfig(environment: string): BusinessRulesConfig {
    const baseConfig = {
      version: '1.0.0',
      environment: environment as 'development' | 'staging' | 'production',
      context: 'flight-search' as const,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'system@fallback.com',
      ui: {
        destination: true,
        departure: true,
        dates: true,
        budget: true,
        advancedFilters: false,
        paymentMethod: true,
        travelerInfo: true,
      },
      flightSearch: {
        forceRoundTrip: true,
        defaultNonstopRequired: true,
        maxAdvanceBookingDays: 365,
        minAdvanceBookingDays: 1,
        allowedCabinClasses: ['economy', 'business'] as const,
        maxPriceUSD: 5000,
        minPriceUSD: 50,
      },
      autoBooking: {
        enabled: true,
        maxConcurrentCampaigns: 3,
        cooldownPeriodHours: 24,
        requiresPaymentMethodVerification: true,
        maxMonthlySpend: 2000,
      },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined,
    };

    return BusinessRulesConfigSchema.parse(baseConfig);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const configLoader = new ConfigLoader();
