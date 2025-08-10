import { BusinessRulesConfigSchema, type BusinessRulesConfig, DEFAULT_CONFIGS } from './schema';

class ConfigLoader {
  private cache: Map<string, BusinessRulesConfig> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private async fetchJson(url: string): Promise<unknown> {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get('Content-Type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      // Try to read a small preview to aid debugging
      const preview = (await res.text()).slice(0, 120);
      throw new Error(`Non-JSON response from ${url}. Preview: ${preview}`);
    }
    return res.json();
  }

  async loadConfig(environment: string = 'production'): Promise<BusinessRulesConfig> {
    const cacheKey = `config-${environment}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Prefer API endpoint, then fallback to a static public file, then fallback defaults
    const apiUrl = `/api/business-rules/config?env=${environment}`;
    const publicUrl = `/config/business-rules.json`;

    try {
      const rawConfig = await this.fetchJson(apiUrl);
      const validatedConfig = BusinessRulesConfigSchema.parse(rawConfig);
      this.cache.set(cacheKey, validatedConfig);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
      return validatedConfig;
    } catch (apiError) {
      console.warn('Business rules API not available or returned non-JSON. Trying static config...', apiError);
      try {
        const rawConfig = await this.fetchJson(publicUrl);
        const validatedConfig = BusinessRulesConfigSchema.parse(rawConfig);
        this.cache.set(cacheKey, validatedConfig);
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
        return validatedConfig;
      } catch (staticError) {
        console.error('Failed to load static business rules config:', staticError);
        const fallback = this.getFallbackConfig(environment);
        this.cache.set(cacheKey, fallback);
        setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
        return fallback;
      }
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
        travelerInfo: true
      },
      flightSearch: {
        forceRoundTrip: true,
        defaultNonstopRequired: true,
        maxAdvanceBookingDays: 365,
        minAdvanceBookingDays: 1,
        allowedCabinClasses: ['economy', 'business'] as const,
        maxPriceUSD: 5000,
        minPriceUSD: 50
      },
      autoBooking: {
        enabled: true,
        maxConcurrentCampaigns: 3,
        cooldownPeriodHours: 24,
        requiresPaymentMethodVerification: true,
        maxMonthlySpend: 2000
      },
      filters: [],
      emergencyDisable: false,
      emergencyMessage: undefined
    };

    return BusinessRulesConfigSchema.parse(baseConfig);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const configLoader = new ConfigLoader();
