/**
 * Round-Trip Filter Implementation
 * 
 * This filter replaces the old round-trip filtering logic with a comprehensive
 * implementation that ensures only true round-trip flights are returned when
 * users search for round-trip travel.
 */

import {
  FlightOffer,
  FlightFilter,
  FilterContext,
  ValidationResult
} from '../core/types';

export class RoundTripFilter implements FlightFilter {
  readonly name = 'RoundTripFilter';
  readonly priority = 5; // Early priority - basic validation

  apply(offers: FlightOffer[], context: FilterContext): FlightOffer[] {
    console.log(`[${this.name}] Starting round-trip filtering`);
    
    // Determine if this is a round-trip search
    const isRoundTripSearch = this.isRoundTripSearch(context);
    
    console.log(`[${this.name}] Search type: ${isRoundTripSearch ? 'round-trip' : 'one-way'}`);
    
    if (!isRoundTripSearch) {
      // For one-way searches, filter to ensure offers have only 1 itinerary
      const oneWayOffers = offers.filter(offer => {
        const hasOneItinerary = offer.itineraries && offer.itineraries.length === 1;
        if (!hasOneItinerary) {
          console.log(`[${this.name}] Filtered out multi-itinerary offer for one-way search: ${offer.id}`);
        }
        return hasOneItinerary;
      });
      
      console.log(`[${this.name}] One-way filtering: ${offers.length} → ${oneWayOffers.length} offers`);
      return oneWayOffers;
    }

    // Round-trip filtering logic
    let filteredOffers = [...offers];
    const beforeCount = filteredOffers.length;

    // Layer 1: Ensure offers have exactly 2 itineraries (outbound + return)
    filteredOffers = filteredOffers.filter(offer => {
      const hasTwoItineraries = offer.itineraries && offer.itineraries.length === 2;
      if (!hasTwoItineraries) {
        console.log(`[${this.name}] Filtered out offer without 2 itineraries: ${offer.id} (has ${offer.itineraries?.length || 0})`);
      }
      return hasTwoItineraries;
    });

    console.log(`[${this.name}] After itinerary count filter: ${beforeCount} → ${filteredOffers.length} offers`);

    // Layer 2: Verify proper routing for round-trip
    const routingFilteredOffers = filteredOffers.filter(offer => {
      return this.validateRoundTripRouting(offer, context);
    });

    console.log(`[${this.name}] After routing validation: ${filteredOffers.length} → ${routingFilteredOffers.length} offers`);

    // Layer 3: Provider-specific validation
    const providerFilteredOffers = routingFilteredOffers.filter(offer => {
      return this.validateProviderSpecificRoundTrip(offer, context);
    });

    console.log(`[${this.name}] After provider-specific validation: ${routingFilteredOffers.length} → ${providerFilteredOffers.length} offers`);

    const removedCount = beforeCount - providerFilteredOffers.length;
    console.log(`[${this.name}] Round-trip filtering complete: ${beforeCount} → ${providerFilteredOffers.length} offers (removed ${removedCount})`);

    return providerFilteredOffers;
  }

  validate(context: FilterContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate search parameters
    if (!context.originCode && !context.destinationCode) {
      errors.push('Origin and destination codes are required for round-trip filtering');
    }

    if (context.returnDate && !context.departureDate) {
      errors.push('Departure date is required when return date is specified');
    }

    // Validate date logic
    if (context.returnDate && context.departureDate) {
      const departureDate = new Date(context.departureDate);
      const returnDate = new Date(context.returnDate);
      
      if (returnDate <= departureDate) {
        errors.push('Return date must be after departure date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Determine if this is a round-trip search based on context
   */
  private isRoundTripSearch(context: FilterContext): boolean {
    // Check if return date is provided
    return !!(context.returnDate);
  }

  /**
   * Validate that the offer has proper round-trip routing
   */
  private validateRoundTripRouting(offer: FlightOffer, context: FilterContext): boolean {
    if (!offer.itineraries || offer.itineraries.length !== 2) {
      return false;
    }

    const outbound = offer.itineraries[0];
    const inbound = offer.itineraries[1];

    if (!outbound.segments || !inbound.segments || 
        outbound.segments.length === 0 || inbound.segments.length === 0) {
      console.log(`[${this.name}] Offer ${offer.id}: Missing segments in itineraries`);
      return false;
    }

    // Get origin and destination from segments
    const outboundOrigin = outbound.segments[0]?.departure?.iataCode;
    const outboundDestination = outbound.segments[outbound.segments.length - 1]?.arrival?.iataCode;
    
    const inboundOrigin = inbound.segments[0]?.departure?.iataCode;
    const inboundDestination = inbound.segments[inbound.segments.length - 1]?.arrival?.iataCode;

    const expectedOrigin = context.originCode;
    const expectedDestination = context.destinationCode;

    // Verify round-trip routing: A→B then B→A
    const validRouting = (
      outboundOrigin === expectedOrigin &&
      outboundDestination === expectedDestination &&
      inboundOrigin === expectedDestination &&
      inboundDestination === expectedOrigin
    );

    if (!validRouting) {
      console.log(`[${this.name}] Offer ${offer.id}: Invalid routing - expected ${expectedOrigin}→${expectedDestination}→${expectedOrigin}, got ${outboundOrigin}→${outboundDestination}→${inboundDestination}`);
    }

    return validRouting;
  }

  /**
   * Provider-specific round-trip validation
   */
  private validateProviderSpecificRoundTrip(offer: FlightOffer, context: FilterContext): boolean {
    if (offer.provider === 'Amadeus') {
      return this.validateAmadeusRoundTrip(offer, context);
    } else if (offer.provider === 'Duffel') {
      return this.validateDuffelRoundTrip(offer, context);
    }
    
    // For unknown providers, assume valid if basic validation passed
    return true;
  }

  /**
   * Amadeus-specific round-trip validation
   */
  private validateAmadeusRoundTrip(offer: FlightOffer, context: FilterContext): boolean {
    // Check if the raw data indicates this is a one-way offer
    const rawData = offer.rawData;
    if (rawData?.oneWay === true) {
      console.log(`[${this.name}] Amadeus offer ${offer.id}: Marked as one-way in raw data`);
      return false;
    }

    // Amadeus round-trip offers should have exactly 2 itineraries
    if (!offer.itineraries || offer.itineraries.length !== 2) {
      return false;
    }

    // Additional Amadeus-specific validations can be added here
    return true;
  }

  /**
   * Duffel-specific round-trip validation  
   */
  private validateDuffelRoundTrip(offer: FlightOffer, context: FilterContext): boolean {
    // Duffel uses "slices" - should have exactly 2 for round-trip
    const rawData = offer.rawData;
    if (rawData?.slices && rawData.slices.length !== 2) {
      console.log(`[${this.name}] Duffel offer ${offer.id}: Expected 2 slices, got ${rawData.slices.length}`);
      return false;
    }

    // Additional Duffel-specific validations can be added here
    return true;
  }

  /**
   * Get detailed statistics about round-trip filtering
   */
  static getFilterStats(
    originalOffers: FlightOffer[],
    filteredOffers: FlightOffer[],
    isRoundTripSearch: boolean
  ): {
    removedCount: number;
    filterType: 'round-trip' | 'one-way';
    validationFailures: {
      itineraryCount: number;
      routingValidation: number;
      providerSpecific: number;
    };
  } {
    const removedCount = originalOffers.length - filteredOffers.length;
    
    // This is a simplified version - in a real implementation,
    // you'd track these statistics during filtering
    return {
      removedCount,
      filterType: isRoundTripSearch ? 'round-trip' : 'one-way',
      validationFailures: {
        itineraryCount: 0, // Would be tracked during filtering
        routingValidation: 0, // Would be tracked during filtering  
        providerSpecific: 0 // Would be tracked during filtering
      }
    };
  }

  /**
   * Validate search parameters for round-trip requirements
   */
  static validateSearchParams(searchParams: {
    originLocationCode?: string;
    destinationLocationCode?: string;
    origin?: string;
    destination?: string;
    returnDate?: string;
    return_date?: string;
    isRoundTrip?: boolean;
  }): {
    isValid: boolean;
    errors: string[];
    isRoundTripSearch: boolean;
  } {
    const errors: string[] = [];
    
    const hasReturnDate = !!(searchParams.returnDate || searchParams.return_date);
    const isRoundTrip = searchParams.isRoundTrip;
    const isRoundTripSearch = hasReturnDate || isRoundTrip;
    
    // If explicitly marked as round-trip but no return date provided
    if (isRoundTrip && !hasReturnDate) {
      errors.push('Round-trip search requires a return date');
    }
    
    // If return date provided but not marked as round-trip (warning case)
    if (hasReturnDate && isRoundTrip === false) {
      errors.push('Return date provided but search marked as one-way');
    }
    
    // Validate required fields for any search
    const origin = searchParams.originLocationCode || searchParams.origin;
    const destination = searchParams.destinationLocationCode || searchParams.destination;
    
    if (!origin) {
      errors.push('Origin location is required');
    }
    
    if (!destination) {
      errors.push('Destination location is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      isRoundTripSearch
    };
  }
}
