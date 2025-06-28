/**
 * Filter Factory - Central Configuration Point
 * 
 * This factory creates and configures the comprehensive filtering system,
 * replacing the old ad-hoc filtering logic throughout the application.
 */

import {
  FilterPipeline,
  FilterContext,
  FilterConfig,
  UserPreferences,
  PerformanceLogger
} from './core/types';

import { DefaultFilterPipeline, ConsolePerformanceLogger } from './core/FilterPipeline';
import { BudgetFilter, SimpleCurrencyConverter } from './filters/BudgetFilter';
import { RoundTripFilter } from './filters/RoundTripFilter';
import { CarryOnFilter } from './filters/CarryOnFilter';
import { NonstopFilter } from './filters/NonstopFilter';
import { AirlineFilter } from './filters/AirlineFilter';

/**
 * Pre-configured filter pipeline factory
 */
export class FilterFactory {
  private static defaultConfig: FilterConfig = {
    enabledFilters: [], // Empty means all filters enabled
    budgetTolerance: 50,
    carryOnFeeTimeoutMs: 5000,
    exchangeRateBuffer: 0.05,
    baseCurrency: 'USD',
    maxOffersToProcess: 1000,
    enableParallelProcessing: false
  };

  /**
   * Create a filtering pipeline by type
   */
  static createPipeline(
    type: 'standard' | 'budget' | 'fast',
    config?: Partial<FilterConfig>,
    logger?: PerformanceLogger
  ): FilterPipeline {
    switch (type) {
      case 'standard':
        return FilterFactory.createStandardPipeline(config, logger);
      case 'budget':
        return FilterFactory.createBudgetPipeline(config, logger);
      case 'fast':
        return FilterFactory.createFastPipeline(config, logger);
      default:
        throw new Error(`Unknown pipeline type: ${type}`);
    }
  }

  /**
   * Create a standard filtering pipeline with all common filters
   */
  static createStandardPipeline(
    config?: Partial<FilterConfig>,
    logger?: PerformanceLogger
  ): FilterPipeline {
    const finalConfig = { ...FilterFactory.defaultConfig, ...config };
    const finalLogger = logger || new ConsolePerformanceLogger();
    
    console.log('[FilterFactory] Creating standard filtering pipeline');
    
    const pipeline = new DefaultFilterPipeline(finalConfig, finalLogger);
    
    // Add filters in priority order (lower numbers = higher priority)
    pipeline.addFilter(new RoundTripFilter());                    // Priority 5
    pipeline.addFilter(new BudgetFilter(new SimpleCurrencyConverter())); // Priority 10
    pipeline.addFilter(new CarryOnFilter());                     // Priority 12
    pipeline.addFilter(new NonstopFilter());                      // Priority 15
    pipeline.addFilter(new AirlineFilter());                      // Priority 20
    
    console.log('[FilterFactory] Standard pipeline created with filters:', 
      pipeline.getFilters().map(f => `${f.name}(${f.priority})`).join(', '));
    
    return pipeline;
  }

  /**
   * Create a budget-focused pipeline for price-sensitive searches
   */
  static createBudgetPipeline(
    config?: Partial<FilterConfig>,
    logger?: PerformanceLogger
  ): FilterPipeline {
    const budgetConfig = {
      ...FilterFactory.defaultConfig,
      budgetTolerance: 25, // Stricter budget tolerance
      enabledFilters: ['RoundTripFilter', 'BudgetFilter'], // Only essential filters
      ...config
    };
    
    console.log('[FilterFactory] Creating budget-focused pipeline');
    
    const pipeline = new DefaultFilterPipeline(budgetConfig, logger);
    
    pipeline.addFilter(new RoundTripFilter());
    pipeline.addFilter(new BudgetFilter(new SimpleCurrencyConverter()));
    
    return pipeline;
  }

  /**
   * Create a fast pipeline for real-time filtering
   */
  static createFastPipeline(
    config?: Partial<FilterConfig>,
    logger?: PerformanceLogger
  ): FilterPipeline {
    const fastConfig = {
      ...FilterFactory.defaultConfig,
      maxOffersToProcess: 500, // Limit for speed
      carryOnFeeTimeoutMs: 2000, // Faster timeout
      ...config
    };
    
    console.log('[FilterFactory] Creating fast filtering pipeline');
    
    const pipeline = new DefaultFilterPipeline(fastConfig, logger);
    
    // Only the most essential filters for speed
    pipeline.addFilter(new RoundTripFilter());
    pipeline.addFilter(new BudgetFilter(new SimpleCurrencyConverter()));
    
    return pipeline;
  }

  /**
   * Create context from search parameters - replaces old parameter handling
   */
  static createFilterContext(searchParams: {
    // Core search parameters
    budget?: number;
    currency?: string;
    originLocationCode?: string;
    origin?: string;
    destinationLocationCode?: string;
    destination?: string;
    departureDate?: string;
    returnDate?: string;
    return_date?: string;
    tripType?: 'roundtrip' | 'oneway';
    
    // User preferences
    nonstopRequired?: boolean;
    nonstop_required?: boolean;
    nonstop?: boolean;
    carryOnRequired?: boolean;
    baggage_included_required?: boolean;
    maxLayoverMinutes?: number;
    preferredAirlines?: string[];
    excludedAirlines?: string[];
    preferredCabinClass?: string;
    maxTotalTripTime?: string;
    passengers?: number;
    
    // Feature flags
    featureFlags?: Record<string, boolean>;
    
    // Configuration overrides
    configOverrides?: Partial<FilterConfig>;
  }): FilterContext {
    
    // Normalize parameters
    const originCode = searchParams.originLocationCode || searchParams.origin || '';
    const destinationCode = searchParams.destinationLocationCode || searchParams.destination || '';
    const returnDate = searchParams.returnDate || searchParams.return_date;
    const nonstopRequired = searchParams.nonstopRequired || searchParams.nonstop_required || false;
    
    const carryOnRequired = searchParams.carryOnRequired || searchParams.baggage_included_required || false;
    
    const userPrefs: UserPreferences = {
      nonstopRequired,
      maxLayoverMinutes: searchParams.maxLayoverMinutes,
      preferredAirlines: searchParams.preferredAirlines,
      excludedAirlines: searchParams.excludedAirlines,
      preferredCabinClass: searchParams.preferredCabinClass,
      maxTotalTripTime: searchParams.maxTotalTripTime
    };

    // Determine trip type
    const isRoundTrip = !!(returnDate || searchParams.tripType === 'roundtrip');
    const tripType = searchParams.tripType || (isRoundTrip ? 'roundtrip' : 'oneway');
    
    // Normalize nonstop preference
    const nonstop = searchParams.nonstop ?? searchParams.nonstopRequired ?? searchParams.nonstop_required ?? false;

    const context: FilterContext = {
      budget: searchParams.budget || 0,
      currency: searchParams.currency || 'USD',
      originCode,
      destinationCode,
      origin: originCode,
      destination: destinationCode,
      departureDate: searchParams.departureDate || '',
      returnDate,
      tripType: tripType as 'roundtrip' | 'oneway',
      nonstop,
      passengers: searchParams.passengers || 1,
      userPrefs,
      featureFlags: searchParams.featureFlags || {},
      config: {
        ...FilterFactory.defaultConfig,
        ...searchParams.configOverrides
      }
    };

    console.log('[FilterFactory] Created filter context:', {
      budget: context.budget,
      currency: context.currency,
      route: `${originCode} → ${destinationCode}`,
      roundTrip: !!returnDate,
      nonstopRequired: userPrefs.nonstopRequired
    });

    return context;
  }

  /**
   * Validation helper for search parameters
   */
  static validateSearchParams(searchParams: any): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    const origin = searchParams.originLocationCode || searchParams.origin;
    const destination = searchParams.destinationLocationCode || searchParams.destination;
    
    if (!origin) {
      errors.push('Origin location is required');
    }
    
    if (!destination) {
      errors.push('Destination location is required');
    }
    
    if (!searchParams.departureDate) {
      errors.push('Departure date is required');
    }

    // Budget validation
    if (searchParams.budget !== undefined) {
      if (typeof searchParams.budget !== 'number' || searchParams.budget <= 0) {
        errors.push('Budget must be a positive number');
      }
    }

    // Date validation
    if (searchParams.departureDate && searchParams.returnDate) {
      const depDate = new Date(searchParams.departureDate);
      const retDate = new Date(searchParams.returnDate);
      
      if (retDate <= depDate) {
        errors.push('Return date must be after departure date');
      }
    }

    // Preferences validation
    if (searchParams.maxLayoverMinutes !== undefined) {
      if (typeof searchParams.maxLayoverMinutes !== 'number' || searchParams.maxLayoverMinutes < 0) {
        errors.push('Maximum layover time must be a non-negative number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Helper to determine the best pipeline type for given search parameters
   */
  static recommendPipelineType(searchParams: any): 'standard' | 'budget' | 'fast' {
    // Budget-focused if budget is specified and relatively low
    if (searchParams.budget && searchParams.budget < 500) {
      return 'budget';
    }

    // Fast pipeline for simple searches
    const isSimpleSearch = !searchParams.preferredAirlines && 
                          !searchParams.excludedAirlines &&
                          !searchParams.maxLayoverMinutes;
    
    if (isSimpleSearch) {
      return 'fast';
    }

    // Default to standard
    return 'standard';
  }

  /**
   * Get default configuration
   */
  static getDefaultConfig(): FilterConfig {
    return { ...FilterFactory.defaultConfig };
  }

  /**
   * Update default configuration
   */
  static updateDefaultConfig(updates: Partial<FilterConfig>): void {
    FilterFactory.defaultConfig = { ...FilterFactory.defaultConfig, ...updates };
    console.log('[FilterFactory] Updated default configuration');
  }
}

/**
 * Legacy adapter for backward compatibility with existing filtering code
 */
export class LegacyFilterAdapter {
  /**
   * Replace old roundTripFiltering.ts functions
   */
  static async filterRoundTripOffers(
    offers: any[],
    searchParams: any,
    provider: 'Amadeus' | 'Duffel' = 'Amadeus'
  ): Promise<any[]> {
    console.log('[LegacyFilterAdapter] Migrating old round-trip filtering to new system');
    
    // Create new filtering system
    const pipeline = FilterFactory.createFastPipeline();
    const context = FilterFactory.createFilterContext(searchParams);
    
    // For legacy compatibility, we need to adapt the offers format
    // This will be provider-specific
    const normalizedOffers = this.adaptLegacyOffers(offers, provider);
    
    // Execute new filtering
    const result = await pipeline.execute(normalizedOffers, context);
    
    console.log('[LegacyFilterAdapter] Legacy filtering migration complete:', 
      `${offers.length} → ${result.filteredOffers.length} offers`);
    
    // Convert back to legacy format if needed
    return result.filteredOffers.map(offer => offer.rawData || offer);
  }

  /**
   * Adapt legacy offer formats to new normalized format
   */
  private static adaptLegacyOffers(offers: any[], provider: 'Amadeus' | 'Duffel'): any[] {
    // This would use the provider adapters to normalize
    // For now, return as-is with provider info
    return offers.map(offer => ({
      ...offer,
      provider,
      // Add any missing required fields with defaults
      id: offer.id || `legacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      itineraries: offer.itineraries || offer.slices || [],
      totalBasePrice: offer.price?.total || offer.total_amount || 0,
      currency: offer.price?.currency || offer.total_currency || 'USD',
      carryOnIncluded: true, // Default assumption
      totalPriceWithCarryOn: offer.price?.total || offer.total_amount || 0,
      stopsCount: 0, // Will be calculated by filters
      validatingAirlines: offer.validatingAirlineCodes || [],
      rawData: {
        ...offer,
        // Ensure oneWay is properly set for round-trip filtering
        oneWay: offer.oneWay || (offer.itineraries && offer.itineraries.length === 1)
      }
    }));
  }

  /**
   * Mark old filtering functions as deprecated
   */
  static deprecatedWarning(functionName: string): void {
    console.warn(`[DEPRECATED] ${functionName} is deprecated. Use FilterFactory.createStandardPipeline() instead.`);
  }
}

export default FilterFactory;
