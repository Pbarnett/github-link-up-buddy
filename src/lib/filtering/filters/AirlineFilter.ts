import * as React from 'react';
/**
 * Airline Filter - Phase 4.1 Implementation
 *
 * Filters flight offers based on user's preferred airlines.
 * Works with both Amadeus and Duffel data structures.
 */

import {
  FlightFilter,
  FlightOffer,
  FilterContext,
  _ValidationResult,
} from '../core/types';

export class AirlineFilter implements FlightFilter {
  readonly name = 'AirlineFilter';
  readonly priority = 20; // After core filters (budget=10, nonstop=15)

  /**
   * Apply airline filtering to flight offers
   */
  async apply(
    offers: FlightOffer[],
    context: FilterContext
  ): Promise<FlightOffer[]> {
    // Get preferred airlines from user preferences
    const preferredAirlines = context.userPrefs.preferredAirlines;

    // If no preferred airlines specified, return all offers
    if (!preferredAirlines || preferredAirlines.length === 0) {
      context.performanceLog?.log(this.name, offers.length, offers.length, 0);
      return offers;
    }

    const startTime = Date.now();

    try {
      const filteredOffers = offers.filter(offer => {
        return this.offerMatchesAirlinePreference(offer, preferredAirlines);
      });

      const duration = Date.now() - startTime;
      context.performanceLog?.log(
        this.name,
        offers.length,
        filteredOffers.length,
        duration
      );

      return filteredOffers;
    } catch (error) {
      context.performanceLog?.logError(this.name, error as Error, {
        originalCount: offers.length,
        preferredAirlines,
      });

      // On error, return original offers to avoid breaking the pipeline
      return offers;
    }
  }

  /**
   * Check if an offer matches airline preferences
   */
  private offerMatchesAirlinePreference(
    offer: FlightOffer,
    preferredAirlines: string[]
  ): boolean {
    // Extract airline codes from the offer
    const offerAirlines = this.extractAirlineCodesFromOffer(offer);

    // Check if any of the offer's airlines match user preferences
    return offerAirlines.some(airlineCode =>
      preferredAirlines.includes(airlineCode)
    );
  }

  /**
   * Extract airline codes from a flight offer
   * Handles both Amadeus and Duffel data structures
   */
  private extractAirlineCodesFromOffer(offer: FlightOffer): string[] {
    const airlineCodes = new Set<string>();

    try {
      // Method 1: Check validatingAirlines (common in both providers)
      if (offer.validatingAirlines && offer.validatingAirlines.length > 0) {
        offer.validatingAirlines.forEach(code => airlineCodes.add(code));
      }

      // Method 2: Extract from itineraries/segments
      if (offer.itineraries) {
        offer.itineraries.forEach(itinerary => {
          if (itinerary.segments) {
            itinerary.segments.forEach(segment => {
              // Amadeus format: carrierCode
              if (segment.carrierCode) {
                airlineCodes.add(segment.carrierCode);
              }

              // Check rawData for provider-specific formats
              if (offer.rawData) {
                this.extractFromRawData(offer.rawData, airlineCodes);
              }
            });
          }
        });
      }

      // Method 3: Fallback to rawData inspection
      if (airlineCodes.size === 0 && offer.rawData) {
        this.extractFromRawData(offer.rawData, airlineCodes);
      }
    } catch (error) {
      console.warn('[AirlineFilter] Error extracting airline codes:', error);
    }

    return Array.from(airlineCodes);
  }

  /**
   * Extract airline codes from raw provider data
   */
  private extractFromRawData(
    rawData: Record<string, unknown>,
    airlineCodes: Set<string>
  ): void {
    try {
      // Duffel format: marketing_carrier and operating_carrier
      if (rawData.slices) {
        (rawData.slices as unknown[]).forEach((slice: unknown) => {
          const sliceRecord = slice as Record<string, unknown>;
          if (sliceRecord.segments) {
            (sliceRecord.segments as unknown[]).forEach((segment: unknown) => {
              const segmentRecord = segment as Record<string, unknown>;
              const marketingCarrier = segmentRecord.marketing_carrier as
                | Record<string, unknown>
                | undefined;
              const operatingCarrier = segmentRecord.operating_carrier as
                | Record<string, unknown>
                | undefined;
              if (marketingCarrier?.iata_code) {
                airlineCodes.add(marketingCarrier.iata_code as string);
              }
              if (operatingCarrier?.iata_code) {
                airlineCodes.add(operatingCarrier.iata_code as string);
              }
            });
          }
        });
      }

      // Amadeus format: validatingAirlineCodes
      if (rawData.validatingAirlineCodes) {
        (rawData.validatingAirlineCodes as string[]).forEach((code: string) =>
          airlineCodes.add(code)
        );
      }

      // Amadeus itineraries
      if (rawData.itineraries) {
        (rawData.itineraries as unknown[]).forEach((itinerary: unknown) => {
          const itineraryRecord = itinerary as Record<string, unknown>;
          if (itineraryRecord.segments) {
            (itineraryRecord.segments as unknown[]).forEach(
              (segment: unknown) => {
                const segmentRecord = segment as Record<string, unknown>;
                if (segmentRecord.carrierCode) {
                  airlineCodes.add(segmentRecord.carrierCode as string);
                }
              }
            );
          }
        });
      }

      // Duffel owner (main airline)
      const owner = rawData.owner as Record<string, unknown> | undefined;
      if (owner?.iata_code) {
        airlineCodes.add(owner.iata_code as string);
      }
    } catch (error) {
      console.warn('[AirlineFilter] Error parsing raw data:', error);
    }
  }

  /**
   * Validate the filter context
   */
  validate(context: FilterContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const preferredAirlines = context.userPrefs.preferredAirlines;

    if (preferredAirlines) {
      // Check for valid IATA codes (2-letter format)
      const invalidCodes = preferredAirlines.filter(
        code => !code || typeof code !== 'string' || !/^[A-Z]{2}$/.test(code)
      );

      if (invalidCodes.length > 0) {
        errors.push(
          `Invalid airline codes: ${invalidCodes.join(', ')}. Must be 2-letter IATA codes.`
        );
      }

      // Warn if too many airlines selected (may reduce results significantly)
      if (preferredAirlines.length > 10) {
        warnings.push(
          `Many airlines selected (${preferredAirlines.length}). Consider reducing for better performance.`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Utility function to get airline name from IATA code
 * Can be expanded with a full airline lookup table
 */
export function getAirlineName(iataCode: string): string {
  const commonAirlines: Record<string, string> = {
    AA: 'American Airlines',
    DL: 'Delta Air Lines',
    UA: 'United Airlines',
    WN: 'Southwest Airlines',
    AS: 'Alaska Airlines',
    B6: 'JetBlue Airways',
    NK: 'Spirit Airlines',
    F9: 'Frontier Airlines',
    BA: 'British Airways',
    LH: 'Lufthansa',
    AF: 'Air France',
    KL: 'KLM',
    VS: 'Virgin Atlantic',
    EK: 'Emirates',
    QR: 'Qatar Airways',
    SQ: 'Singapore Airlines',
    CX: 'Cathay Pacific',
    JL: 'Japan Airlines',
    AC: 'Air Canada',
  };

  return commonAirlines[iataCode] || iataCode;
}

/**
 * Extract unique airlines from a list of flight offers
 * Useful for building airline selection UI
 */
export function getAvailableAirlinesFromOffers(
  offers: FlightOffer[]
): Array<{ code: string; name: string; count: number }> {
  const airlineCount = new Map<string, number>();
  const airlineFilter = new AirlineFilter();

  offers.forEach(offer => {
    // Use the same extraction logic as the filter
    const airlines = (
      airlineFilter as unknown as {
        extractAirlineCodesFromOffer: (offer: FlightOffer) => string[];
      }
    ).extractAirlineCodesFromOffer(offer);
    airlines.forEach(code => {
      airlineCount.set(code, (airlineCount.get(code) || 0) + 1);
    });
  });

  return Array.from(airlineCount.entries())
    .map(([code, count]) => ({
      code,
      name: getAirlineName(code),
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort by frequency
}
