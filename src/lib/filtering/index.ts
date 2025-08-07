/**
 * Flight Filtering System - Main Export
 *
 * This module exports all the components of the comprehensive flight filtering
 * system, providing a clean API for use throughout the application.
 */

// Import FilterFactory for use in convenience functions
import FilterFactoryClass from './FilterFactory';

// Main factory for creating filtering pipelines
./FilterFactory';

// Core filtering infrastructure
export {
  DefaultFilterPipeline,
  ConsolePerformanceLogger,
./core/FilterPipeline';

// Individual filter implementations
./filters/BudgetFilter';
./filters/RoundTripFilter';
./filters/NonstopFilter';

// Provider adapters for normalizing API responses
export {
  AmadeusAdapter,
  DuffelAdapter,
  getProviderAdapter,
  normalizeOffers,
./adapters/ProviderAdapters';

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
./core/types';

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
