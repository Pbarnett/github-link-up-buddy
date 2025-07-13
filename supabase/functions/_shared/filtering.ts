/**
 * Deno-Compatible Filtering System for Edge Functions
 * 
 * This module provides a lightweight version of the main filtering architecture
 * specifically designed to work in Supabase Edge Functions (Deno environment).
 * 
 * It follows the same architectural principles as the main filtering system
 * but is self-contained and doesn't rely on external imports.
 */

// =============================================
// Core Types (Mirror of main filtering system)
// =============================================

export interface FlightOffer {
  provider: 'Amadeus' | 'Duffel';
  id: string;
  itineraries: Itinerary[];
  totalBasePrice: number;
  currency: string;
  carryOnIncluded: boolean;
  carryOnFee?: number;
  totalPriceWithCarryOn: number;
  stopsCount: number;
  validatingAirlines: string[];
  rawData?: Record<string, unknown>;
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Segment {
  departure: Airport;
  arrival: Airport;
  carrierCode: string;
  flightNumber: string;
  duration: string;
  numberOfStops: number;
}

export interface Airport {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface FilterContext {
  budget: number;
  currency: string;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'roundtrip' | 'oneway';
  nonstop: boolean;
  passengers: number;
  userPrefs: {
    preferredAirlines?: string[];
    excludedAirlines?: string[];
  };
}

export interface FilterResult {
  filteredOffers: FlightOffer[];
  originalCount: number;
  finalCount: number;
  executionTimeMs: number;
  filterResults: FilterExecutionResult[];
}

export interface FilterExecutionResult {
  filterName: string;
  beforeCount: number;
  afterCount: number;
  executionTimeMs: number;
  removedOffers: number;
}

// =============================================
// Provider Adapters
// =============================================

export class AmadeusEdgeAdapter {
  static normalize(rawOffer: Record<string, unknown>, /* _context: FilterContext */): FlightOffer {
    const id = rawOffer.id || `amadeus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const price = this.extractPrice(rawOffer);
    const carryOnInfo = this.extractCarryOnInfo(rawOffer);
    const itineraries = this.normalizeItineraries((rawOffer.itineraries as unknown[]) || []);
    
    return {
      provider: 'Amadeus',
      id: String(id),
      itineraries,
      totalBasePrice: price.base,
      currency: price.currency,
      carryOnIncluded: carryOnInfo.included,
      carryOnFee: carryOnInfo.fee,
      totalPriceWithCarryOn: price.base + (carryOnInfo.fee || 0),
      stopsCount: this.calculateStopsCount(itineraries),
      validatingAirlines: (rawOffer.validatingAirlineCodes as string[]) || [],
      rawData: rawOffer
    };
  }

  private static extractPrice(rawOffer: Record<string, unknown>): { base: number; currency: string } {
    const price = (rawOffer.price as Record<string, unknown>) || {};
    return {
      base: parseFloat(String(price.total || price.base || '0')),
      currency: String(price.currency || 'USD')
    };
  }

  private static extractCarryOnInfo(rawOffer: Record<string, unknown>): { included: boolean; fee?: number } {
    // Simplified carry-on detection for edge function
    // Default to included for most airlines unless explicitly marked as basic economy
    const travelerPricings = (rawOffer.travelerPricings as unknown[]) || [];
    
    for (const pricing of travelerPricings) {
      const pricingObj = pricing as Record<string, unknown>;
      const fareDetails = (pricingObj.fareDetailsBySegment as unknown[]) || [];
      for (const segment of fareDetails) {
        const segmentObj = segment as Record<string, unknown>;
        // Check for basic economy markers
        if (segmentObj.cabin === 'ECONOMY' && 
            (String(segmentObj.fareBasis || '').includes('BASIC') || String(segmentObj.brandedFare || '').includes('BASIC'))) {
          return { included: false, fee: 50 }; // Default carry-on fee
        }
      }
    }
    
    return { included: true, fee: undefined };
  }

  private static normalizeItineraries(rawItineraries: unknown[]): Itinerary[] {
    return rawItineraries.map(itinerary => {
      const itineraryObj = itinerary as Record<string, unknown>;
      return {
        duration: String(itineraryObj.duration || ''),
        segments: this.normalizeSegments((itineraryObj.segments as unknown[]) || [])
      };
    });
  }

  private static normalizeSegments(rawSegments: unknown[]): Segment[] {
    return rawSegments.map(segment => {
      const segmentObj = segment as Record<string, unknown>;
      const departure = (segmentObj.departure as Record<string, unknown>) || {};
      const arrival = (segmentObj.arrival as Record<string, unknown>) || {};
      
      return {
        departure: {
          iataCode: String(departure.iataCode || ''),
          terminal: departure.terminal ? String(departure.terminal) : undefined,
          at: String(departure.at || '')
        },
        arrival: {
          iataCode: String(arrival.iataCode || ''),
          terminal: arrival.terminal ? String(arrival.terminal) : undefined,
          at: String(arrival.at || '')
        },
        carrierCode: String(segmentObj.carrierCode || ''),
        flightNumber: String(segmentObj.number || ''),
        duration: String(segmentObj.duration || ''),
        numberOfStops: Number(segmentObj.numberOfStops || 0)
      };
    });
  }

  private static calculateStopsCount(itineraries: Itinerary[]): number {
    return itineraries.reduce((total, itinerary) => {
      return total + itinerary.segments.reduce((stops, segment) => stops + segment.numberOfStops, 0);
    }, 0);
  }
}

// =============================================
// Individual Filters
// =============================================

abstract class BaseFilter {
  abstract name: string;
  abstract priority: number;
  abstract apply(offers: FlightOffer[], context: FilterContext): FlightOffer[];
}

export class RoundTripFilter extends BaseFilter {
  name = 'RoundTripFilter';
  priority = 5;

  apply(offers: FlightOffer[], context: FilterContext): FlightOffer[] {
    console.log(`[${this.name}] Filtering for ${context.tripType} search`);
    
    if (context.tripType === 'oneway') {
      return offers.filter(offer => offer.itineraries.length === 1);
    }
    
    // Round-trip filtering
    const filtered = offers.filter(offer => {
      if (!offer.itineraries || offer.itineraries.length !== 2) {
        return false;
      }
      
      // Validate proper routing
      const outbound = offer.itineraries[0];
      const inbound = offer.itineraries[1];
      
      if (!outbound.segments?.length || !inbound.segments?.length) {
        return false;
      }
      
      const outboundOrigin = outbound.segments[0]?.departure?.iataCode;
      const outboundDestination = outbound.segments[outbound.segments.length - 1]?.arrival?.iataCode;
      const inboundOrigin = inbound.segments[0]?.departure?.iataCode;
      const inboundDestination = inbound.segments[inbound.segments.length - 1]?.arrival?.iataCode;
      
      return (
        outboundOrigin === context.originCode &&
        outboundDestination === context.destinationCode &&
        inboundOrigin === context.destinationCode &&
        inboundDestination === context.originCode
      );
    });
    
    console.log(`[${this.name}] Filtered: ${offers.length} → ${filtered.length} offers`);
    return filtered;
  }
}

export class NonstopFilter extends BaseFilter {
  name = 'NonstopFilter';
  priority = 15;

  apply(offers: FlightOffer[], context: FilterContext): FlightOffer[] {
    if (!context.nonstop) {
      console.log(`[${this.name}] Nonstop not required, skipping filter`);
      return offers;
    }
    
    console.log(`[${this.name}] Filtering for nonstop flights only`);
    
    const filtered = offers.filter(offer => {
      // Check if offer has stops
      if (offer.stopsCount > 0) {
        return false;
      }
      
      // Additional check: ensure all segments have 0 stops
      return offer.itineraries.every(itinerary =>
        itinerary.segments.every(segment => segment.numberOfStops === 0)
      );
    });
    
    console.log(`[${this.name}] Filtered: ${offers.length} → ${filtered.length} offers`);
    return filtered;
  }
}

export class BudgetFilter extends BaseFilter {
  name = 'BudgetFilter';
  priority = 10;

  apply(offers: FlightOffer[], context: FilterContext): FlightOffer[] {
    if (!context.budget || context.budget <= 0) {
      console.log(`[${this.name}] No budget specified, skipping filter`);
      return offers;
    }
    
    console.log(`[${this.name}] Filtering for budget: ${context.budget} ${context.currency}`);
    
    const filtered = offers.filter(offer => {
      // Use total price with carry-on for budget comparison
      const effectivePrice = offer.totalPriceWithCarryOn;
      
      // Simple currency check (assume same currency for edge function simplicity)
      if (offer.currency === context.currency) {
        return effectivePrice <= context.budget;
      }
      
      // For different currencies, be conservative and exclude
      // (Real implementation would use currency conversion)
      console.warn(`[${this.name}] Currency mismatch: offer ${offer.currency} vs budget ${context.currency}, excluding offer`);
      return false;
    });
    
    console.log(`[${this.name}] Filtered: ${offers.length} → ${filtered.length} offers`);
    return filtered;
  }
}

export class CarryOnFilter extends BaseFilter {
  name = 'CarryOnFilter';
  priority = 12;

  apply(offers: FlightOffer[], /* _context: FilterContext */): FlightOffer[] {
    console.log(`[${this.name}] Ensuring all offers include carry-on (app requirement)`);
    
    // Update prices with carry-on fees and filter out non-compliant offers
    const processed = offers.map(offer => {
      if (!offer.carryOnIncluded && offer.carryOnFee !== undefined) {
        // Add carry-on fee to total price
        offer.totalPriceWithCarryOn = offer.totalBasePrice + offer.carryOnFee;
      }
      return offer;
    });
    
    // Filter out offers where carry-on cannot be guaranteed
    const filtered = processed.filter(offer => {
      // Must either include carry-on or have a reasonable fee
      if (offer.carryOnIncluded) {
        return true;
      }
      
      if (offer.carryOnFee !== undefined && offer.carryOnFee >= 0 && offer.carryOnFee <= 200) {
        return true; // Reasonable carry-on fee
      }
      
      console.log(`[${this.name}] Excluding offer ${offer.id}: carry-on not guaranteed`);
      return false;
    });
    
    console.log(`[${this.name}] Filtered: ${offers.length} → ${filtered.length} offers`);
    return filtered;
  }
}

// =============================================
// Filter Pipeline
// =============================================

export class EdgeFilterPipeline {
  private filters: BaseFilter[] = [];

  constructor(type: 'standard' | 'budget' | 'fast' = 'standard') {
    this.initializeFilters(type);
  }

  private initializeFilters(type: string) {
    switch (type) {
      case 'budget':
        this.filters = [
          new RoundTripFilter(),
          new BudgetFilter()
        ];
        break;
      case 'fast':
        this.filters = [
          new RoundTripFilter(),
          new BudgetFilter()
        ];
        break;
      case 'standard':
      default:
        this.filters = [
          new RoundTripFilter(),
          new BudgetFilter(),
          new CarryOnFilter(),
          new NonstopFilter()
        ];
        break;
    }
    
    // Sort by priority
    this.filters.sort((a, b) => a.priority - b.priority);
    console.log(`[EdgeFilterPipeline] Initialized ${type} pipeline with filters:`, 
      this.filters.map(f => `${f.name}(${f.priority})`));
  }

  async execute(offers: FlightOffer[], context: FilterContext): Promise<FilterResult> {
    const startTime = Date.now();
    const originalCount = offers.length;
    
    console.log(`[EdgeFilterPipeline] Starting execution with ${originalCount} offers`);
    
    if (offers.length === 0) {
      return this.createResult([], originalCount, startTime, []);
    }

    let currentOffers = offers;
    const filterResults: FilterExecutionResult[] = [];

    for (const filter of this.filters) {
      const filterStartTime = Date.now();
      const beforeCount = currentOffers.length;
      
      try {
        currentOffers = filter.apply(currentOffers, context);
        const afterCount = currentOffers.length;
        const executionTime = Date.now() - filterStartTime;
        
        filterResults.push({
          filterName: filter.name,
          beforeCount,
          afterCount,
          executionTimeMs: executionTime,
          removedOffers: beforeCount - afterCount
        });
        
        if (currentOffers.length === 0) {
          console.warn(`[EdgeFilterPipeline] All offers filtered out by ${filter.name}`);
          break;
        }
      } catch (error) {
        console.error(`[EdgeFilterPipeline] Filter ${filter.name} failed:`, error);
        // Continue with next filter instead of failing entirely
      }
    }

    const result = this.createResult(currentOffers, originalCount, startTime, filterResults);
    console.log(`[EdgeFilterPipeline] Execution completed: ${originalCount} → ${result.finalCount} (${result.executionTimeMs}ms)`);
    
    return result;
  }

  private createResult(
    filteredOffers: FlightOffer[],
    originalCount: number,
    startTime: number,
    filterResults: FilterExecutionResult[]
  ): FilterResult {
    return {
      filteredOffers,
      originalCount,
      finalCount: filteredOffers.length,
      executionTimeMs: Date.now() - startTime,
      filterResults
    };
  }
}

// =============================================
// Convenience Functions
// =============================================

export function createFilterContext(params: {
  budget?: number;
  currency?: string;
  originLocationCode?: string;
  destinationLocationCode?: string;
  departureDate?: string;
  returnDate?: string;
  nonstopRequired?: boolean;
  passengers?: number;
  preferredAirlines?: string[];
}): FilterContext {
  const isRoundTrip = !!(params.returnDate);
  
  return {
    budget: params.budget || 0,
    currency: params.currency || 'USD',
    originCode: params.originLocationCode || '',
    destinationCode: params.destinationLocationCode || '',
    departureDate: params.departureDate || '',
    returnDate: params.returnDate,
    tripType: isRoundTrip ? 'roundtrip' : 'oneway',
    nonstop: params.nonstopRequired || false,
    passengers: params.passengers || 1,
    userPrefs: {
      preferredAirlines: params.preferredAirlines
    }
  };
}

export function normalizeOffers(
  rawOffers: Array<{ data: Record<string, unknown>; provider: 'Amadeus' | 'Duffel' }>,
  context: FilterContext
): FlightOffer[] {
  const normalizedOffers: FlightOffer[] = [];
  
  for (const { data: rawOffer, provider } of rawOffers) {
    try {
      if (provider === 'Amadeus') {
        const normalizedOffer = AmadeusEdgeAdapter.normalize(rawOffer, context);
        normalizedOffers.push(normalizedOffer);
      }
      // Add Duffel adapter when needed
    } catch (error) {
      console.error(`[EdgeFilter] Error normalizing ${provider} offer:`, error);
    }
  }
  
  console.log(`[EdgeFilter] Normalized ${normalizedOffers.length} offers from ${rawOffers.length} raw offers`);
  return normalizedOffers;
}

export class FilterFactory {
  static createPipeline(type: 'standard' | 'budget' | 'fast' = 'standard'): EdgeFilterPipeline {
    return new EdgeFilterPipeline(type);
  }
  
  static recommendPipelineType(params: {
    budget?: number;
    preferredAirlines?: string[];
    nonstopRequired?: boolean;
  }): 'standard' | 'budget' | 'fast' {
    if (params.budget && params.budget < 500) {
      return 'budget';
    }
    
    const isSimpleSearch = !params.preferredAirlines && !params.nonstopRequired;
    if (isSimpleSearch) {
      return 'fast';
    }
    
    return 'standard';
  }
}
