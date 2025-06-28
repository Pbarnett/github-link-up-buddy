/**
 * Core types for the flight offer filtering system
 * 
 * This module defines the fundamental interfaces and types used throughout
 * the filtering pipeline to ensure consistency across all filter implementations.
 */

// Normalized flight offer interface that works across providers
export interface FlightOffer {
  // Provider identification
  provider: 'Amadeus' | 'Duffel';
  id: string;
  
  // Flight structure - normalized across providers
  itineraries: Itinerary[];
  
  // Pricing information
  totalBasePrice: number;
  currency: string;
  
  // Baggage information
  carryOnIncluded: boolean;
  carryOnFee?: number;
  
  // Derived/computed fields
  totalPriceWithCarryOn: number;
  stopsCount: number;
  
  // Additional metadata
  validatingAirlines: string[];
  bookingUrl?: string;
  
  // Raw data preservation
  rawData?: Record<string, any>;
}

// Flight itinerary structure
export interface Itinerary {
  duration: string;
  segments: Segment[];
}

// Flight segment structure
export interface Segment {
  departure: Airport;
  arrival: Airport;
  carrierCode: string;
  flightNumber: string;
  aircraft?: { code: string };
  duration: string;
  numberOfStops: number;
}

// Airport information
export interface Airport {
  iataCode: string;
  terminal?: string;
  at: string; // ISO datetime
}

// Context passed to filters containing search parameters and user preferences
export interface FilterContext {
  // Core search parameters
  budget: number;
  currency: string;
  
  // Trip details
  originCode: string;
  destinationCode: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'roundtrip' | 'oneway';
  
  // Passenger details
  passengers: number;
  
  // Flight preferences
  nonstop: boolean;
  
  // User preferences
  userPrefs: UserPreferences;
  
  // Feature flags and A/B testing
  featureFlags: Record<string, boolean>;
  
  // Performance monitoring
  performanceLog?: PerformanceLogger;
  
  // Configuration overrides
  config?: FilterConfig;
}

// User preferences structure (optional preferences, not core requirements)
export interface UserPreferences {
  // Optional airline preferences
  preferredAirlines?: string[];
  excludedAirlines?: string[];
  
  // Optional comfort preferences
  preferredCabinClass?: string;
  maxTotalTripTime?: string; // ISO duration
  maxLayoverMinutes?: number; // Only applies if app allows connections in future
  
  // Legacy compatibility field
  nonstopRequired?: boolean;
  
  // Note: nonstop, carry-on, and trip-type are CORE APP REQUIREMENTS,
  // not user preferences, so they're handled by core filters
}

// Filter configuration for dynamic rule management
export interface FilterConfig {
  // Global filter toggles
  enabledFilters: string[];
  
  // Filter-specific parameters
  budgetTolerance: number; // Allow small budget overruns (in currency units)
  carryOnFeeTimeoutMs: number; // Timeout for baggage fee lookups
  
  // Currency conversion settings
  exchangeRateBuffer: number; // Percentage buffer for FX rate changes
  baseCurrency: string;
  
  // Performance settings
  maxOffersToProcess: number;
  enableParallelProcessing: boolean;
}

// Performance logging interface
export interface PerformanceLogger {
  log(filterName: string, beforeCount: number, afterCount: number, durationMs: number): void;
  logError(filterName: string, error: Error, context?: Record<string, any>): void;
  logWarning(filterName: string, message: string, context?: Record<string, any>): void;
}

// Base filter interface that all filters must implement
export interface FlightFilter {
  readonly name: string;
  readonly priority: number; // Lower numbers run first
  
  // Main filter method
  apply(offers: FlightOffer[], context: FilterContext): Promise<FlightOffer[]> | FlightOffer[];
  
  // Optional validation method
  validate?(context: FilterContext): ValidationResult;
  
  // Optional configuration method
  configure?(config: Partial<FilterConfig>): void;
}

// Validation result structure
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Filter pipeline interface for managing the entire filtering process
export interface FilterPipeline {
  // Add/remove filters
  addFilter(filter: FlightFilter): void;
  removeFilter(filterName: string): boolean;
  
  // Execute the pipeline
  execute(offers: FlightOffer[], context: FilterContext): Promise<FilterPipelineResult>;
  
  // Get pipeline configuration
  getFilters(): FlightFilter[];
  getConfig(): FilterConfig;
}

// Result of filter pipeline execution
export interface FilterPipelineResult {
  filteredOffers: FlightOffer[];
  originalCount: number;
  finalCount: number;
  executionTimeMs: number;
  filterResults: FilterExecutionResult[];
  errors: FilterError[];
  warnings: FilterWarning[];
}

// Individual filter execution result
export interface FilterExecutionResult {
  filterName: string;
  beforeCount: number;
  afterCount: number;
  executionTimeMs: number;
  removedOffers: number;
}

// Filter error structure
export interface FilterError {
  filterName: string;
  error: Error;
  context?: Record<string, any>;
  timestamp: Date;
}

// Filter warning structure
export interface FilterWarning {
  filterName: string;
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
}

// Search parameters for different providers
export interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  nonStop?: boolean;
  maxPrice?: number;
  currency?: string;
}

// Provider adapter interface for normalizing different API responses
export interface ProviderAdapter<TRawOffer = any> {
  readonly providerName: 'Amadeus' | 'Duffel';
  
  // Convert raw provider data to normalized FlightOffer
  normalize(rawOffer: TRawOffer, context: FilterContext): FlightOffer;
  
  // Validate raw offer data
  validate(rawOffer: TRawOffer): ValidationResult;
  
  // Extract specific fields for advanced filtering
  extractCarryOnInfo?(rawOffer: TRawOffer): { included: boolean; fee?: number };
  extractAirlineInfo?(rawOffer: TRawOffer): { validatingAirlines: string[]; operatingAirlines: string[] };
}

// Currency conversion interface
export interface CurrencyConverter {
  convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
  getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number>;
  getSupportedCurrencies(): string[];
}

// Baggage fee lookup interface
export interface BagageeFeeProvider {
  getCarryOnFee(airline: string, fareClass: string, route?: string): Promise<number | null>;
  isCarryOnIncluded(airline: string, fareClass: string, route?: string): Promise<boolean>;
  getCachedFee(cacheKey: string): number | null;
  setCachedFee(cacheKey: string, fee: number, ttlMs?: number): void;
}
