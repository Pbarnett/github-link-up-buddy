/**
 * CarryOn Filter - Phase 4.1 Implementation
 *
 * This is a CORE APPLICATION FILTER that ensures ALL flights include carry-on baggage.
 * This is NOT a user preference - it's a business requirement of the app.
 */

import {
  FlightFilter,
  FlightOffer,
  FilterContext,
  ValidationResult,
} from '../core/types';

export class CarryOnFilter implements FlightFilter {
  readonly name = 'CarryOnFilter';
  readonly priority = 12; // Core requirement - all flights must include carry-on

  /**
   * Apply carry-on filtering to flight offers
   */
  async apply(
    offers: FlightOffer[],
    context: FilterContext
  ): Promise<FlightOffer[]> {
    const startTime = Date.now();

    try {
      console.log(`[CarryOnFilter] Starting carry-on filtering`);
      console.log(
        `[CarryOnFilter] Filtering for carry-on included offers only (app requirement)`
      );

      const filteredOffers = offers.filter(offer => {
        return this.offerIncludesCarryOn(offer);
      });

      const removedCount = offers.length - filteredOffers.length;
      console.log(
        `[CarryOnFilter] Carry-on filtering complete: ${offers.length} → ${filteredOffers.length} offers (removed ${removedCount} without carry-on)`
      );

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
        appRequirement: 'carry-on-included',
      });

      // On error, return original offers to avoid breaking the pipeline
      return offers;
    }
  }

  /**
   * Check if an offer includes carry-on baggage
   */
  private offerIncludesCarryOn(offer: FlightOffer): boolean {
    try {
      // Method 1: Check the normalized carryOnIncluded field
      if (offer.carryOnIncluded === true) {
        return true;
      }

      // Method 2: If carryOnIncluded is false but no fee, it might still be included
      if (
        offer.carryOnIncluded === false &&
        (offer.carryOnFee === undefined || offer.carryOnFee === 0)
      ) {
        // Some providers mark carry-on as false but don't charge a fee
        // This could indicate it's actually included
        return true;
      }

      // Method 3: Check if total price includes carry-on (no additional fee)
      if (offer.totalPriceWithCarryOn <= offer.totalBasePrice) {
        return true;
      }

      // Method 4: Check raw data for provider-specific carry-on information
      if (offer.rawData) {
        const hasCarryOnInRawData = this.checkRawDataForCarryOn(
          offer.rawData,
          offer.provider
        );
        if (hasCarryOnInRawData) {
          return true;
        }
      }

      // If we reach here, carry-on is likely not included or has a fee
      console.log(
        `[CarryOnFilter] Offer ${offer.id}: Carry-on not included or has fee`
      );
      return false;
    } catch (error) {
      console.warn(
        `[CarryOnFilter] Error checking carry-on for offer ${offer.id}:`,
        error
      );
      // On error, be conservative and exclude the offer
      return false;
    }
  }

  /**
   * Check raw provider data for carry-on information
   */
  private checkRawDataForCarryOn(
    rawData: Record<string, unknown>,
    provider: string
  ): boolean {
    try {
      if (provider === 'Amadeus') {
        return this.checkAmadeusCarryOn(rawData);
      } else if (provider === 'Duffel') {
        return this.checkDuffelCarryOn(rawData);
      }
    } catch (error) {
      console.warn('[CarryOnFilter] Error parsing raw data:', error);
    }

    return false;
  }

  /**
   * Check Amadeus raw data for carry-on information
   */
  private checkAmadeusCarryOn(rawData: Record<string, unknown>): boolean {
    // Check travelerPricings for baggage information
    if (rawData.travelerPricings && Array.isArray(rawData.travelerPricings)) {
      for (const travelerPricing of rawData.travelerPricings) {
        if (
          travelerPricing.fareDetailsBySegment &&
          Array.isArray(travelerPricing.fareDetailsBySegment)
        ) {
          for (const segmentDetail of travelerPricing.fareDetailsBySegment) {
            // Check for cabin baggage allowance
            if (segmentDetail.includedCabinBags) {
              const cabinBags = segmentDetail.includedCabinBags;
              if (cabinBags.quantity && cabinBags.quantity > 0) {
                return true;
              }
            }

            // Check additional services for carry-on fees
            if (
              segmentDetail.additionalServices &&
              Array.isArray(segmentDetail.additionalServices)
            ) {
              const carryOnService = segmentDetail.additionalServices.find(
                (service: unknown) =>
                  typeof service === 'object' &&
                  service !== null &&
                  (service as { type?: string }).type === 'BAGGAGE' &&
                  /CARRY ON|CABIN BAG|HAND BAG/i.test(
                    (service as { description?: string }).description || ''
                  )
              );

              // If carry-on service exists with no fee, it's included
              if (
                carryOnService &&
                (!(carryOnService as { amount?: string }).amount ||
                  parseFloat(
                    (carryOnService as { amount?: string }).amount || '0'
                  ) === 0)
              ) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Check Duffel raw data for carry-on information
   */
  private checkDuffelCarryOn(rawData: Record<string, unknown>): boolean {
    // Check slices for baggage information
    if (rawData.slices && Array.isArray(rawData.slices)) {
      for (const slice of rawData.slices) {
        if (slice.segments && Array.isArray(slice.segments)) {
          for (const segment of slice.segments) {
            // Check passenger details for baggage allowances
            if (segment.passengers && Array.isArray(segment.passengers)) {
              for (const passenger of segment.passengers) {
                if (passenger.cabin_bag) {
                  const cabinBag = passenger.cabin_bag;
                  if (cabinBag.quantity && cabinBag.quantity > 0) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Check services for carry-on information
    if (rawData.services && Array.isArray(rawData.services)) {
      const carryOnService = rawData.services.find(
        (service: unknown) =>
          typeof service === 'object' &&
          service !== null &&
          (service as { type?: string }).type === 'baggage' &&
          /cabin|carry.on|hand.bag/i.test(
            (service as { metadata?: { title?: string; description?: string } })
              .metadata?.title ||
              (
                service as {
                  metadata?: { title?: string; description?: string };
                }
              ).metadata?.description ||
              ''
          )
      );

      if (
        carryOnService &&
        (carryOnService as { total_amount?: string }).total_amount === '0.00'
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate the filter context
   */
  validate(context: FilterContext): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // This is a core app requirement - no user validation needed
    // Warn if budget is very low since carry-on is always required
    if (context.budget > 0 && context.budget < 100) {
      warnings.push(
        'Very low budget may result in no available flights with carry-on included.'
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
