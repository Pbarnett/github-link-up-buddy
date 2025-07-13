/**
 * Provider Adapters for Flight Offer Normalization
 * 
 * These adapters convert raw flight offers from different providers
 * (Amadeus, Duffel) into a standardized format for filtering.
 */

import {
  FlightOffer,
  ProviderAdapter,
  FilterContext,
  ValidationResult,
  Itinerary,
  Segment,
  Airport
} from '../core/types';

// Amadeus API interfaces
interface AmadeusPrice {
  total?: string;
  base?: string;
  currency?: string;
}

interface AmadeusAircraft {
  code?: string;
}

interface AmadeusAirport {
  iataCode?: string;
  terminal?: string;
  at?: string;
}

interface AmadeusSegment {
  departure?: AmadeusAirport;
  arrival?: AmadeusAirport;
  carrierCode?: string;
  number?: string;
  aircraft?: AmadeusAircraft;
  duration?: string;
  numberOfStops?: number;
  operating?: {
    carrierCode?: string;
  };
}

interface AmadeusItinerary {
  duration?: string;
  segments?: AmadeusSegment[];
}

interface AmadeusTravelerPricing {
  fareDetailsBySegment?: Array<{
    includedCheckedBags?: {
      quantity?: number;
      weight?: number;
    };
  }>;
}

interface AmadeusRawOffer {
  id?: string;
  price?: AmadeusPrice;
  itineraries?: AmadeusItinerary[];
  validatingAirlineCodes?: string[];
  booking_url?: string;
  travelerPricings?: AmadeusTravelerPricing[];
}

// Duffel API interfaces
interface DuffelAircraft {
  iata_code?: string;
}

interface DuffelAirport {
  iata_code?: string;
  terminal?: string;
}

interface DuffelCarrier {
  iata_code?: string;
}

interface DuffelSegment {
  origin?: DuffelAirport;
  destination?: DuffelAirport;
  marketing_carrier?: DuffelCarrier;
  operating_carrier?: DuffelCarrier;
  flight_number?: string;
  aircraft?: DuffelAircraft;
  duration?: string;
  departing_at?: string;
  arriving_at?: string;
}

interface DuffelSlice {
  duration?: string;
  segments?: DuffelSegment[];
}

interface DuffelService {
  type?: string;
  total_amount?: string | number;
}

interface DuffelPassenger {
  services?: DuffelService[];
}

interface DuffelRawOffer {
  id?: string;
  total_amount?: string;
  base_amount?: string;
  total_currency?: string;
  currency?: string;
  slices?: DuffelSlice[];
  validating_carrier?: DuffelCarrier;
  booking_url?: string;
  available_services?: DuffelService[];
  passengers?: DuffelPassenger[];
}

/**
 * Amadeus API adapter
 */
export class AmadeusAdapter implements ProviderAdapter {
  readonly providerName = 'Amadeus' as const;

  normalize(rawOffer: AmadeusRawOffer, context: FilterContext): FlightOffer {
    // Extract basic offer information
    const id = rawOffer.id || `amadeus-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const price = this.extractPrice(rawOffer);
    const carryOnInfo = this.extractCarryOnInfo(rawOffer);
    const itineraries = this.normalizeItineraries(rawOffer.itineraries || []);
    
    return {
      provider: 'Amadeus',
      id,
      itineraries,
      totalBasePrice: price.base,
      currency: price.currency,
      carryOnIncluded: carryOnInfo.included,
      carryOnFee: carryOnInfo.fee,
      totalPriceWithCarryOn: price.base + (carryOnInfo.fee || 0),
      stopsCount: this.calculateStopsCount(itineraries),
      validatingAirlines: this.extractValidatingAirlines(rawOffer),
      bookingUrl: rawOffer.booking_url,
      rawData: rawOffer
    };
  }

  validate(rawOffer: AmadeusRawOffer): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!rawOffer.price?.total && !rawOffer.price?.base) {
      errors.push('Missing price information');
    }

    if (!rawOffer.itineraries || !Array.isArray(rawOffer.itineraries)) {
      errors.push('Missing or invalid itineraries');
    } else if (rawOffer.itineraries.length === 0) {
      errors.push('No itineraries found');
    }

    // Validate each itinerary
    rawOffer.itineraries?.forEach((itinerary: AmadeusItinerary, index: number) => {
      if (!itinerary.segments || !Array.isArray(itinerary.segments)) {
        errors.push(`Itinerary ${index + 1}: Missing or invalid segments`);
      } else if (itinerary.segments.length === 0) {
        errors.push(`Itinerary ${index + 1}: No segments found`);
      }

      // Validate segments
      itinerary.segments?.forEach((segment: AmadeusSegment, segIndex: number) => {
        if (!segment.departure?.iataCode) {
          errors.push(`Itinerary ${index + 1}, Segment ${segIndex + 1}: Missing departure IATA code`);
        }
        if (!segment.arrival?.iataCode) {
          errors.push(`Itinerary ${index + 1}, Segment ${segIndex + 1}: Missing arrival IATA code`);
        }
        if (!segment.carrierCode) {
          warnings.push(`Itinerary ${index + 1}, Segment ${segIndex + 1}: Missing carrier code`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  extractCarryOnInfo(rawOffer: AmadeusRawOffer): { included: boolean; fee?: number } {
    // Amadeus typically includes baggage info in travelerPricings
    const travelerPricings = rawOffer.travelerPricings || [];
    
    for (const pricing of travelerPricings) {
      const fareDetailsBySegment = pricing.fareDetailsBySegment || [];
      
      for (const fareDetails of fareDetailsBySegment) {
        const includedCheckedBags = fareDetails.includedCheckedBags;
        
        // If carry-on information is explicitly provided
        if (includedCheckedBags?.weight !== undefined || includedCheckedBags?.quantity !== undefined) {
          return {
            included: (includedCheckedBags.quantity || 0) > 0 || (includedCheckedBags.weight || 0) > 0,
            fee: undefined // Amadeus typically doesn't provide carry-on fees directly
          };
        }
      }
    }

    // Default assumption for most airlines
    return { included: true, fee: undefined };
  }

  extractAirlineInfo(rawOffer: AmadeusRawOffer): { validatingAirlines: string[]; operatingAirlines: string[] } {
    const validatingAirlines = rawOffer.validatingAirlineCodes || [];
    const operatingAirlines: string[] = [];

    // Extract operating airlines from segments
    rawOffer.itineraries?.forEach((itinerary: AmadeusItinerary) => {
      itinerary.segments?.forEach((segment: AmadeusSegment) => {
        if (segment.carrierCode && !operatingAirlines.includes(segment.carrierCode)) {
          operatingAirlines.push(segment.carrierCode);
        }
        if (segment.operating?.carrierCode && !operatingAirlines.includes(segment.operating.carrierCode)) {
          operatingAirlines.push(segment.operating.carrierCode);
        }
      });
    });

    return { validatingAirlines, operatingAirlines };
  }

  private extractPrice(rawOffer: AmadeusRawOffer): { base: number; currency: string } {
    const price = rawOffer.price || {};
    return {
      base: parseFloat(price.total || price.base || '0'),
      currency: price.currency || 'USD'
    };
  }

  private extractValidatingAirlines(rawOffer: AmadeusRawOffer): string[] {
    return rawOffer.validatingAirlineCodes || [];
  }

  private normalizeItineraries(rawItineraries: AmadeusItinerary[]): Itinerary[] {
    return rawItineraries.map(itinerary => ({
      duration: itinerary.duration || '',
      segments: this.normalizeSegments(itinerary.segments || [])
    }));
  }

  private normalizeSegments(rawSegments: AmadeusSegment[]): Segment[] {
    return rawSegments.map(segment => ({
      departure: this.normalizeAirport(segment.departure),
      arrival: this.normalizeAirport(segment.arrival),
      carrierCode: segment.carrierCode || '',
      flightNumber: segment.number || '',
      aircraft: segment.aircraft ? { code: segment.aircraft.code } : undefined,
      duration: segment.duration || '',
      numberOfStops: segment.numberOfStops || 0
    }));
  }

  private normalizeAirport(rawAirport: AmadeusAirport | undefined): Airport {
    return {
      iataCode: rawAirport?.iataCode || '',
      terminal: rawAirport?.terminal,
      at: rawAirport?.at || ''
    };
  }

  private calculateStopsCount(itineraries: Itinerary[]): number {
    return itineraries.reduce((total, itinerary) => {
      return total + itinerary.segments.reduce((stops, segment) => stops + segment.numberOfStops, 0);
    }, 0);
  }
}

/**
 * Duffel API adapter
 */
export class DuffelAdapter implements ProviderAdapter {
  readonly providerName = 'Duffel' as const;

  normalize(rawOffer: DuffelRawOffer, context: FilterContext): FlightOffer {
    const id = rawOffer.id || `duffel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const price = this.extractPrice(rawOffer);
    const carryOnInfo = this.extractCarryOnInfo(rawOffer);
    const itineraries = this.normalizeSlicesToItineraries(rawOffer.slices || []);
    
    return {
      provider: 'Duffel',
      id,
      itineraries,
      totalBasePrice: price.base,
      currency: price.currency,
      carryOnIncluded: carryOnInfo.included,
      carryOnFee: carryOnInfo.fee,
      totalPriceWithCarryOn: price.base + (carryOnInfo.fee || 0),
      stopsCount: this.calculateStopsCount(itineraries),
      validatingAirlines: this.extractValidatingAirlines(rawOffer),
      bookingUrl: rawOffer.booking_url,
      rawData: rawOffer
    };
  }

  validate(rawOffer: DuffelRawOffer): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!rawOffer.total_amount && !rawOffer.base_amount) {
      errors.push('Missing price information');
    }

    if (!rawOffer.slices || !Array.isArray(rawOffer.slices)) {
      errors.push('Missing or invalid slices');
    } else if (rawOffer.slices.length === 0) {
      errors.push('No slices found');
    }

    // Validate each slice
    rawOffer.slices?.forEach((slice: DuffelSlice, index: number) => {
      if (!slice.segments || !Array.isArray(slice.segments)) {
        errors.push(`Slice ${index + 1}: Missing or invalid segments`);
      } else if (slice.segments.length === 0) {
        errors.push(`Slice ${index + 1}: No segments found`);
      }

      // Validate segments
      slice.segments?.forEach((segment: DuffelSegment, segIndex: number) => {
        if (!segment.origin?.iata_code) {
          errors.push(`Slice ${index + 1}, Segment ${segIndex + 1}: Missing origin IATA code`);
        }
        if (!segment.destination?.iata_code) {
          errors.push(`Slice ${index + 1}, Segment ${segIndex + 1}: Missing destination IATA code`);
        }
        if (!segment.marketing_carrier?.iata_code) {
          warnings.push(`Slice ${index + 1}, Segment ${segIndex + 1}: Missing marketing carrier code`);
        }
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  extractCarryOnInfo(rawOffer: DuffelRawOffer): { included: boolean; fee?: number } {
    // Duffel provides cabin bag information in available_services
    const availableServices = rawOffer.available_services || [];
    
    for (const service of availableServices) {
      if (service.type === 'cabin_bag' || service.type === 'carry_on') {
        return {
          included: service.total_amount === '0.00' || service.total_amount === 0,
          fee: service.total_amount ? parseFloat(service.total_amount.toString()) : undefined
        };
      }
    }

    // Check passengers for included baggage
    const passengers = rawOffer.passengers || [];
    for (const passenger of passengers) {
      const services = passenger.services || [];
      const cabinBagService = services.find((s: DuffelService) => s.type === 'cabin_bag');
      if (cabinBagService) {
        return {
          included: cabinBagService.total_amount === '0.00' || cabinBagService.total_amount === 0,
          fee: cabinBagService.total_amount ? parseFloat(cabinBagService.total_amount.toString()) : undefined
        };
      }
    }

    // Default assumption
    return { included: true, fee: undefined };
  }

  extractAirlineInfo(rawOffer: DuffelRawOffer): { validatingAirlines: string[]; operatingAirlines: string[] } {
    const validatingAirlines = rawOffer.validating_carrier?.iata_code ? [rawOffer.validating_carrier.iata_code] : [];
    const operatingAirlines: string[] = [];

    // Extract operating airlines from segments
    rawOffer.slices?.forEach((slice: DuffelSlice) => {
      slice.segments?.forEach((segment: DuffelSegment) => {
        if (segment.marketing_carrier?.iata_code && !operatingAirlines.includes(segment.marketing_carrier.iata_code)) {
          operatingAirlines.push(segment.marketing_carrier.iata_code);
        }
        if (segment.operating_carrier?.iata_code && !operatingAirlines.includes(segment.operating_carrier.iata_code)) {
          operatingAirlines.push(segment.operating_carrier.iata_code);
        }
      });
    });

    return { validatingAirlines, operatingAirlines };
  }

  private extractPrice(rawOffer: DuffelRawOffer): { base: number; currency: string } {
    return {
      base: parseFloat(rawOffer.total_amount || rawOffer.base_amount || '0'),
      currency: rawOffer.total_currency || rawOffer.currency || 'USD'
    };
  }

  private extractValidatingAirlines(rawOffer: DuffelRawOffer): string[] {
    return rawOffer.validating_carrier?.iata_code ? [rawOffer.validating_carrier.iata_code] : [];
  }

  private normalizeSlicesToItineraries(rawSlices: DuffelSlice[]): Itinerary[] {
    return rawSlices.map(slice => ({
      duration: slice.duration || '',
      segments: this.normalizeSegments(slice.segments || [])
    }));
  }

  private normalizeSegments(rawSegments: DuffelSegment[]): Segment[] {
    return rawSegments.map(segment => ({
      departure: this.normalizeAirport(segment.origin, segment.departing_at),
      arrival: this.normalizeAirport(segment.destination, segment.arriving_at),
      carrierCode: segment.marketing_carrier?.iata_code || '',
      flightNumber: segment.flight_number || '',
      aircraft: segment.aircraft ? { code: segment.aircraft.iata_code } : undefined,
      duration: segment.duration || '',
      numberOfStops: 0 // Duffel segments are direct by definition
    }));
  }

  private normalizeAirport(rawAirport: DuffelAirport | undefined, dateTime?: string): Airport {
    return {
      iataCode: rawAirport?.iata_code || '',
      terminal: rawAirport?.terminal,
      at: dateTime || ''
    };
  }

  private calculateStopsCount(itineraries: Itinerary[]): number {
    // For Duffel, calculate stops as segments - 1 per itinerary (slice)
    return itineraries.reduce((total, itinerary) => {
      return total + Math.max(0, itinerary.segments.length - 1);
    }, 0);
  }
}

/**
 * Factory function to get the appropriate adapter
 */
export function getProviderAdapter(provider: 'Amadeus' | 'Duffel'): ProviderAdapter {
  switch (provider) {
    case 'Amadeus':
      return new AmadeusAdapter();
    case 'Duffel':
      return new DuffelAdapter();
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Normalize a batch of raw offers from different providers
 */
export function normalizeOffers(
  rawOffers: Array<{ data: unknown; provider: 'Amadeus' | 'Duffel' }>,
  context: FilterContext
): FlightOffer[] {
  const normalizedOffers: FlightOffer[] = [];
  const errors: Array<{ provider: string; error: string; rawOffer: unknown }> = [];

  for (const { data: rawOffer, provider } of rawOffers) {
    try {
      const adapter = getProviderAdapter(provider);
      
      // Validate first - need to type cast since we're working with unknown data
      const validation = adapter.validate(rawOffer as AmadeusRawOffer | DuffelRawOffer);
      if (!validation.isValid) {
        console.warn(`[ProviderAdapter] Skipping invalid ${provider} offer:`, validation.errors);
        errors.push({
          provider,
          error: validation.errors.join(', '),
          rawOffer
        });
        continue;
      }

      // Normalize and add to results
      const normalizedOffer = adapter.normalize(rawOffer as AmadeusRawOffer | DuffelRawOffer, context);
      normalizedOffers.push(normalizedOffer);

      // Log warnings if any
      if (validation.warnings.length > 0) {
        console.warn(`[ProviderAdapter] ${provider} offer warnings:`, validation.warnings);
      }

    } catch (error) {
      console.error(`[ProviderAdapter] Error normalizing ${provider} offer:`, error);
      errors.push({
        provider,
        error: error instanceof Error ? error.message : String(error),
        rawOffer
      });
    }
  }

  if (errors.length > 0) {
    console.warn(`[ProviderAdapter] Failed to normalize ${errors.length} offers:`, errors);
  }

  console.log(`[ProviderAdapter] Successfully normalized ${normalizedOffers.length} offers from ${rawOffers.length} raw offers`);
  
  return normalizedOffers;
}
