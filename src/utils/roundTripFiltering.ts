/**
 * @file DEPRECATED: Round-trip flight filtering utilities
 * 
 * ⚠️  DEPRECATED: This module is deprecated and will be removed in a future version.
 * Use the new FilterFactory from @/lib/filtering/FilterFactory instead.
 * 
 * This module provides legacy filtering functions that are now replaced by
 * the comprehensive filtering architecture in @/lib/filtering/
 */

import { LegacyFilterAdapter } from '@/lib/filtering/FilterFactory';

export interface FlightOffer {
  id: string;
  itineraries?: Array<{
    segments?: Array<{
      departure?: { iataCode?: string };
      arrival?: { iataCode?: string };
    }>;
  }>;
  slices?: Array<{
    segments?: Array<{
      origin?: { iata_code?: string };
      destination?: { iata_code?: string };
    }>;
  }>;
  oneWay?: boolean;
  return_dt?: string | null;
  price_total?: number;
  total_amount?: string;
}

export interface TripSearchParams {
  originLocationCode?: string;
  destinationLocationCode?: string;
  origin?: string;
  destination?: string;
  returnDate?: string;
  return_date?: string;
  isRoundTrip?: boolean;
}

/**
 * Enhanced round-trip filtering for Amadeus flight offers
 * 
 * This function implements multiple layers of filtering to ensure only true
 * round-trip flights are returned when searching for round-trip itineraries.
 */
export function filterAmadeusRoundTripOffers(
  offers: FlightOffer[],
  searchParams: TripSearchParams
): FlightOffer[] {
  LegacyFilterAdapter.deprecatedWarning('filterAmadeusRoundTripOffers');
  
  const isRoundTripSearch = !!(searchParams.returnDate || searchParams.return_date);
  
  if (!isRoundTripSearch) {
    // For one-way searches, ensure offers have only 1 itinerary
    return offers.filter(offer => {
      return offer.itineraries && offer.itineraries.length === 1;
    });
  }

  let filteredOffers = [...offers];
  const beforeFilter = filteredOffers.length;

  // Layer 1: Filter out offers explicitly marked as one-way
  filteredOffers = filteredOffers.filter(offer => {
    return !offer.oneWay;
  });

  // Layer 2: Ensure offers have exactly 2 itineraries (outbound + return)
  filteredOffers = filteredOffers.filter(offer => {
    return offer.itineraries && offer.itineraries.length === 2;
  });

  // Layer 3: Verify both itineraries have proper routing
  filteredOffers = filteredOffers.filter(offer => {
    if (!offer.itineraries || offer.itineraries.length !== 2) return false;

    const outbound = offer.itineraries[0];
    const inbound = offer.itineraries[1];

    // Verify outbound goes from origin to destination
    const outboundOrigin = outbound.segments?.[0]?.departure?.iataCode;
    const outboundDestination = outbound.segments?.[outbound.segments.length - 1]?.arrival?.iataCode;

    // Verify inbound goes from destination back to origin
    const inboundOrigin = inbound.segments?.[0]?.departure?.iataCode;
    const inboundDestination = inbound.segments?.[inbound.segments.length - 1]?.arrival?.iataCode;

    const expectedOrigin = searchParams.originLocationCode || searchParams.origin;
    const expectedDestination = searchParams.destinationLocationCode || searchParams.destination;

    return (
      outboundOrigin === expectedOrigin &&
      outboundDestination === expectedDestination &&
      inboundOrigin === expectedDestination &&
      inboundDestination === expectedOrigin
    );
  });

  console.log(`[RoundTripFilter] Amadeus filtering: ${beforeFilter} -> ${filteredOffers.length} offers (removed ${beforeFilter - filteredOffers.length} non-round-trip offers)`);
  
  return filteredOffers;
}

/**
 * Enhanced round-trip filtering for Duffel flight offers
 * 
 * This function implements the same filtering logic for Duffel API responses
 * which use a different data structure (slices instead of itineraries).
 */
export function filterDuffelRoundTripOffers(
  offers: FlightOffer[],
  searchParams: TripSearchParams
): FlightOffer[] {
  LegacyFilterAdapter.deprecatedWarning('filterDuffelRoundTripOffers');
  
  const isRoundTripSearch = !!(searchParams.returnDate || searchParams.return_date);
  
  if (!isRoundTripSearch) {
    // For one-way searches, ensure offers have only 1 slice
    return offers.filter(offer => {
      return offer.slices && offer.slices.length === 1;
    });
  }

  let filteredOffers = [...offers];
  const beforeFilter = filteredOffers.length;

  // Layer 1: Filter to ensure offers have both outbound and return slices
  filteredOffers = filteredOffers.filter(offer => {
    return offer.slices && offer.slices.length === 2;
  });

  // Layer 2: Verify proper routing for round-trip
  filteredOffers = filteredOffers.filter(offer => {
    if (!offer.slices || offer.slices.length !== 2) return false;

    const outbound = offer.slices[0];
    const inbound = offer.slices[1];

    // Verify outbound goes from origin to destination
    const outboundOrigin = outbound.segments?.[0]?.origin?.iata_code;
    const outboundDestination = outbound.segments?.[outbound.segments.length - 1]?.destination?.iata_code;

    // Verify inbound goes from destination back to origin
    const inboundOrigin = inbound.segments?.[0]?.origin?.iata_code;
    const inboundDestination = inbound.segments?.[inbound.segments.length - 1]?.destination?.iata_code;

    const expectedOrigin = searchParams.origin || searchParams.originLocationCode;
    const expectedDestination = searchParams.destination || searchParams.destinationLocationCode;

    return (
      outboundOrigin === expectedOrigin &&
      outboundDestination === expectedDestination &&
      inboundOrigin === expectedDestination &&
      inboundDestination === expectedOrigin
    );
  });

  console.log(`[RoundTripFilter] Duffel filtering: ${beforeFilter} -> ${filteredOffers.length} offers (removed ${beforeFilter - filteredOffers.length} non-round-trip offers)`);
  
  return filteredOffers;
}

/**
 * Database-level round-trip filtering for stored flight offers
 * 
 * This function filters flight offers stored in the database to ensure
 * only round-trip results are shown when appropriate.
 */
export function filterDatabaseRoundTripOffers(
  offers: FlightOffer[],
  isRoundTripRequest: boolean
): FlightOffer[] {
  if (!isRoundTripRequest) {
    // For one-way requests, no specific filtering needed
    return offers;
  }

  // For round-trip requests, filter out offers without return dates
  const filteredOffers = offers.filter(offer => {
    return offer.return_dt !== null && offer.return_dt !== undefined;
  });

  console.log(`[RoundTripFilter] Database filtering: ${offers.length} -> ${filteredOffers.length} offers (removed ${offers.length - filteredOffers.length} one-way offers)`);
  
  return filteredOffers;
}

/**
 * Validate that search parameters include return date for round-trip searches
 * 
 * This function ensures that API requests for round-trip flights always include
 * a return date parameter to prevent accidentally receiving one-way results.
 */
export function validateRoundTripSearchParams(searchParams: TripSearchParams): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const hasReturnDate = !!(searchParams.returnDate || searchParams.return_date);
  const isRoundTrip = searchParams.isRoundTrip;
  
  // If explicitly marked as round-trip but no return date provided
  if (isRoundTrip && !hasReturnDate) {
    errors.push('Round-trip search requires a return date');
  }
  
  // If return date provided but not marked as round-trip (warning)
  if (hasReturnDate && isRoundTrip === false) {
    errors.push('Return date provided but search marked as one-way');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get appropriate oneWay parameter for API calls
 * 
 * This function determines the correct oneWay parameter value based on
 * search criteria to ensure APIs return the correct type of flights.
 */
export function getOneWayParameter(searchParams: TripSearchParams): boolean {
  const hasReturnDate = !!(searchParams.returnDate || searchParams.return_date);
  const isRoundTrip = searchParams.isRoundTrip;
  
  // If explicitly set, use that
  if (isRoundTrip !== undefined) {
    return !isRoundTrip;
  }
  
  // Otherwise, determine from return date presence
  return !hasReturnDate;
}

/**
 * Log filtering results for debugging and monitoring
 */
export function logFilteringResults(
  beforeCount: number,
  afterCount: number,
  filterType: 'amadeus' | 'duffel' | 'database',
  isRoundTrip: boolean
): void {
  const tripType = isRoundTrip ? 'round-trip' : 'one-way';
  const removedCount = beforeCount - afterCount;
  
  console.log(`[RoundTripFilter] ${filterType} ${tripType} filtering: ${beforeCount} -> ${afterCount} offers (removed ${removedCount} invalid offers)`);
  
  if (removedCount > 0) {
    console.warn(`[RoundTripFilter] Filtered out ${removedCount} offers that didn't match ${tripType} criteria`);
  }
}
