/**
 * Flight Filtering System - Main Export
 *
 * This module exports all the components of the comprehensive flight filtering
 * system, providing a clean API for use throughout the application.
 */

// Import FilterFactory for use in convenience functions
import FilterFactoryClass from './FilterFactory';

// Main factory for creating filtering pipelines
export { default as FilterFactory, LegacyFilterAdapter } from './FilterFactory';

// Core filtering infrastructure
export {
  DefaultFilterPipeline,
  ConsolePerformanceLogger,
} from './core/FilterPipeline';

// Individual filter implementations
export { BudgetFilter, SimpleCurrencyConverter } from './filters/BudgetFilter';
export { RoundTripFilter } from './filters/RoundTripFilter';
export { NonstopFilter } from './filters/NonstopFilter';

// Provider adapters for normalizing API responses
export {
  AmadeusAdapter,
  DuffelAdapter,
  getProviderAdapter,
  normalizeOffers,
} from './adapters/ProviderAdapters';

// Type definitions
export type {
  FlightOffer,
  FlightFilter,
  FilterContext,
  FilterPipeline,
  FilterPipelineResult,
  FilterConfig,
  UserPreferences,
  PerformanceLogger,
  _ValidationResult,
  ProviderAdapter,
  CurrencyConverter,
  BagageeFeeProvider,
  Itinerary,
  Segment,
  Airport,
  SearchParams,
} from './core/types';

// Convenience functions for common use cases
export const createStandardFilterPipeline = () =>
  FilterFactoryClass.createPipeline('standard');
export const createBudgetFilterPipeline = () =>
  FilterFactoryClass.createPipeline('budget');
export const createFastFilterPipeline = () =>
  FilterFactoryClass.createPipeline('fast');
export const createFilterContext =
  FilterFactoryClass.createFilterContext.bind(FilterFactoryClass);
export const validateSearchParams =
  FilterFactoryClass.validateSearchParams.bind(FilterFactoryClass);
