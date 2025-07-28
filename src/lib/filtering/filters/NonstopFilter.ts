import * as React from 'react';
/**
 * Nonstop Filter Implementation
 *
 * This is a CORE APPLICATION FILTER that ensures ALL flights are non-stop.
 * This is NOT a user preference - it's a business requirement of the app.
 */

import {
  FlightOffer,
  FlightFilter,
  FilterContext,
  ValidationResult,
} from '../core/types';

export class NonstopFilter implements FlightFilter {
  readonly name = 'NonstopFilter';
  readonly priority = 15; // Core requirement - all flights must be non-stop

  apply(offers: FlightOffer[], context: FilterContext): FlightOffer[] {
    console.log(`[${this.name}] Starting nonstop filtering`);

    // Check if nonstop is required in this context
    if (!context.nonstop && !context.userPrefs.nonstopRequired) {
      console.log(`[${this.name}] Nonstop not required, skipping filter`);
      return offers;
    }

    console.log(
      `[${this.name}] Filtering for nonstop flights only (app requirement)`
    );

    const nonstopOffers = offers.filter(offer => {
      return this.isNonstopOffer(offer);
    });

    const removedCount = offers.length - nonstopOffers.length;
    console.log(
      `[${this.name}] Nonstop filtering complete: ${offers.length} → ${nonstopOffers.length} offers (removed ${removedCount} with stops)`
    );

    return nonstopOffers;
  }

  validate(context: FilterContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate layover preferences if specified
    const maxLayoverMinutes = context.userPrefs.maxLayoverMinutes;
    if (maxLayoverMinutes !== undefined) {
      if (maxLayoverMinutes < 0) {
        errors.push('Maximum layover time cannot be negative');
      }
      if (maxLayoverMinutes < 30 && maxLayoverMinutes > 0) {
        warnings.push(
          'Very short layover time may result in unrealistic connections'
        );
      }
      if (maxLayoverMinutes > 1440) {
        // 24 hours
        warnings.push(
          'Very long layover time may include overnight connections'
        );
      }
    }

    // Validate consistency
    if (context.userPrefs.nonstopRequired && maxLayoverMinutes !== undefined) {
      warnings.push(
        'Maximum layover time setting is ignored when nonstop is required'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Determine if an offer qualifies as nonstop
   */
  private isNonstopOffer(offer: FlightOffer): boolean {
    // Check if the offer has stop information in stopsCount
    if (offer.stopsCount !== undefined && offer.stopsCount === 0) {
      return true;
    }

    // Analyze itineraries for stops
    if (!offer.itineraries || offer.itineraries.length === 0) {
      console.log(`[${this.name}] Offer ${offer.id}: No itineraries found`);
      return false;
    }

    // Check each itinerary for stops
    for (const itinerary of offer.itineraries) {
      if (!this.isNonstopItinerary(itinerary)) {
        console.log(
          `[${this.name}] Offer ${offer.id}: Contains itinerary with stops`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Check if an individual itinerary is nonstop
   */
  private isNonstopItinerary(itinerary: {
    segments: { numberOfStops: number }[];
  }): boolean {
    if (!itinerary.segments || itinerary.segments.length === 0) {
      return false;
    }

    // For nonstop flights, there should be exactly 1 segment per itinerary
    if (itinerary.segments.length === 1) {
      const segment = itinerary.segments[0];
      // Additional check: segment should have 0 stops
      return segment.numberOfStops === 0;
    }

    // Multiple segments indicate connections
    return false;
  }

  /**
   * Alternative filtering method that considers layover time limits
   */
  applyWithLayoverLimits(
    offers: FlightOffer[],
    context: FilterContext
  ): FlightOffer[] {
    console.log(`[${this.name}] Starting layover-aware filtering`);

    const userPrefs = context.userPrefs;
    const maxLayoverMinutes = userPrefs.maxLayoverMinutes;

    // If nonstop is required, use standard nonstop filtering
    if (userPrefs.nonstopRequired) {
      return this.apply(offers, context);
    }

    // If no layover limit specified, return all offers
    if (maxLayoverMinutes === undefined) {
      console.log(
        `[${this.name}] No layover limits specified, returning all offers`
      );
      return offers;
    }

    console.log(
      `[${this.name}] Filtering for flights with layovers ≤ ${maxLayoverMinutes} minutes`
    );

    const filteredOffers = offers.filter(offer => {
      return this.meetsLayoverRequirements(offer, maxLayoverMinutes);
    });

    const removedCount = offers.length - filteredOffers.length;
    console.log(
      `[${this.name}] Layover filtering complete: ${offers.length} → ${filteredOffers.length} offers (removed ${removedCount} with long layovers)`
    );

    return filteredOffers;
  }

  /**
   * Check if an offer meets layover time requirements
   */
  private meetsLayoverRequirements(
    offer: FlightOffer,
    maxLayoverMinutes: number
  ): boolean {
    if (!offer.itineraries) {
      return true; // No itinerary data to analyze
    }

    for (const itinerary of offer.itineraries) {
      if (!this.itineraryMeetsLayoverLimit(itinerary, maxLayoverMinutes)) {
        console.log(
          `[${this.name}] Offer ${offer.id}: Contains itinerary exceeding layover limit`
        );
        return false;
      }
    }

    return true;
  }

  /**
   * Check if an itinerary meets layover time limits
   */
  private itineraryMeetsLayoverLimit(
    itinerary: {
      segments: { arrival: { at: string }; departure: { at: string } }[];
    },
    maxLayoverMinutes: number
  ): boolean {
    if (!itinerary.segments || itinerary.segments.length <= 1) {
      return true; // No connections, so no layover concerns
    }

    // Calculate layover times between segments
    for (let i = 0; i < itinerary.segments.length - 1; i++) {
      const currentSegment = itinerary.segments[i];
      const nextSegment = itinerary.segments[i + 1];

      const arrivalTime = new Date(currentSegment.arrival.at);
      const departureTime = new Date(nextSegment.departure.at);

      const layoverMinutes =
        (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60);

      if (layoverMinutes > maxLayoverMinutes) {
        console.log(
          `[${this.name}] Layover exceeds limit: ${layoverMinutes} > ${maxLayoverMinutes} minutes`
        );
        return false;
      }

      // Also check for unrealistically short layovers
      if (layoverMinutes < 30) {
        console.log(
          `[${this.name}] Warning: Very short layover detected: ${layoverMinutes} minutes`
        );
      }
    }

    return true;
  }

  /**
   * Get statistics about stop filtering
   */
  static getFilterStats(
    originalOffers: FlightOffer[],
    filteredOffers: FlightOffer[],
    nonstopRequired: boolean,
    maxLayoverMinutes?: number
  ): {
    removedCount: number;
    filterType: 'nonstop-only' | 'layover-limit' | 'none';
    stopDistribution: {
      nonstop: number;
      oneStop: number;
      twoPlus: number;
    };
  } {
    const removedCount = originalOffers.length - filteredOffers.length;

    let filterType: 'nonstop-only' | 'layover-limit' | 'none';
    if (nonstopRequired) {
      filterType = 'nonstop-only';
    } else if (maxLayoverMinutes !== undefined) {
      filterType = 'layover-limit';
    } else {
      filterType = 'none';
    }

    // Analyze stop distribution in filtered offers
    const stopDistribution = {
      nonstop: 0,
      oneStop: 0,
      twoPlus: 0,
    };

    filteredOffers.forEach(offer => {
      const stops = offer.stopsCount || 0;
      if (stops === 0) {
        stopDistribution.nonstop++;
      } else if (stops === 1) {
        stopDistribution.oneStop++;
      } else {
        stopDistribution.twoPlus++;
      }
    });

    return {
      removedCount,
      filterType,
      stopDistribution,
    };
  }
}
