/**
 * Offer Validation Service
 * 
 * Handles Duffel offer expiration validation, refresh logic,
 * and offer lifecycle management for reliable booking.
 */

import { DuffelAPIError } from '../errors/duffelErrors';

export interface OfferValidationResult {
  isValid: boolean;
  timeRemaining: number; // milliseconds
  expiresAt: Date;
  needsRefresh: boolean;
  error?: string;
}

export interface DuffelOfferSummary {
  id: string;
  expires_at: string;
  total_amount: string;
  total_currency: string;
}

/**
 * Configuration for offer validation
 */
const OFFER_VALIDATION_CONFIG = {
  // Safety buffer before expiration (2 minutes)
  SAFETY_BUFFER_MS: 2 * 60 * 1000,
  
  // Refresh threshold - refresh if less than 5 minutes remaining
  REFRESH_THRESHOLD_MS: 5 * 60 * 1000,
  
  // Warning threshold - warn user if less than 10 minutes remaining
  WARNING_THRESHOLD_MS: 10 * 60 * 1000,
  
  // Maximum offer age before automatic refresh (15 minutes)
  MAX_OFFER_AGE_MS: 15 * 60 * 1000
};

/**
 * Validate a Duffel offer's expiration status
 */
export function validateOfferExpiration(offer: DuffelOfferSummary): OfferValidationResult {
  try {
    const now = new Date();
    const expiresAt = new Date(offer.expires_at);
    const timeRemaining = expiresAt.getTime() - now.getTime();
    
    // Check if offer has already expired
    if (timeRemaining <= 0) {
      return {
        isValid: false,
        timeRemaining: 0,
        expiresAt,
        needsRefresh: true,
        error: 'This flight offer has expired. Please search again for current availability.'
      };
    }
    
    // Check if offer expires within safety buffer
    if (timeRemaining <= OFFER_VALIDATION_CONFIG.SAFETY_BUFFER_MS) {
      return {
        isValid: false,
        timeRemaining,
        expiresAt,
        needsRefresh: true,
        error: 'This flight offer is about to expire. Please search again for current availability.'
      };
    }
    
    // Check if offer needs refresh (but is still technically valid)
    const needsRefresh = timeRemaining <= OFFER_VALIDATION_CONFIG.REFRESH_THRESHOLD_MS;
    
    return {
      isValid: true,
      timeRemaining,
      expiresAt,
      needsRefresh
    };
  } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return {
      isValid: false,
      timeRemaining: 0,
      expiresAt: new Date(),
      needsRefresh: true,
      error: 'Invalid offer expiration date format.'
    };
  }
}

/**
 * Check if offer should trigger a user warning
 */
export function shouldWarnUserAboutExpiration(offer: DuffelOfferSummary): {
  shouldWarn: boolean;
  message?: string;
  timeRemaining?: number;
} {
  const validation = validateOfferExpiration(offer);
  
  if (!validation.isValid) {
    return {
      shouldWarn: true,
      message: validation.error,
      timeRemaining: validation.timeRemaining
    };
  }
  
  if (validation.timeRemaining <= OFFER_VALIDATION_CONFIG.WARNING_THRESHOLD_MS) {
    const minutesRemaining = Math.floor(validation.timeRemaining / (60 * 1000));
    return {
      shouldWarn: true,
      message: `This offer expires in ${minutesRemaining} minutes. Please complete your booking soon.`,
      timeRemaining: validation.timeRemaining
    };
  }
  
  return { shouldWarn: false };
}

/**
 * Validate offer before booking attempt
 */
export async function validateOfferForBooking(
  offerId: string,
  getDuffelOffer: (id: string) => Promise<DuffelOfferSummary>
): Promise<OfferValidationResult> {
  try {
    // Fetch current offer data
    const offer = await getDuffelOffer(offerId);
    const validation = validateOfferExpiration(offer);
    
    if (!validation.isValid) {
      throw new DuffelAPIError({
        errors: [{
          type: 'offer_no_longer_available',
          title: 'Offer Expired',
          detail: validation.error || 'Offer has expired'
        }]
      });
    }
    
    return validation;
  } catch (error) {
    if (error instanceof DuffelAPIError) {
      throw error;
    }
    
    // Handle API errors (offer not found, network issues, etc.)
    throw new DuffelAPIError({
      errors: [{
        type: 'offer_not_found',
        title: 'Offer Not Available',
        detail: 'The selected flight offer is no longer available.'
      }]
    });
  }
}

/**
 * Format time remaining for user display
 */
export function formatTimeRemaining(timeRemainingMs: number): string {
  if (timeRemainingMs <= 0) {
    return 'Expired';
  }
  
  const totalMinutes = Math.floor(timeRemainingMs / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Get offer urgency level for UI styling
 */
export function getOfferUrgencyLevel(timeRemainingMs: number): 'normal' | 'warning' | 'critical' | 'expired' {
  if (timeRemainingMs <= 0) {
    return 'expired';
  } else if (timeRemainingMs <= OFFER_VALIDATION_CONFIG.SAFETY_BUFFER_MS) {
    return 'critical';
  } else if (timeRemainingMs <= OFFER_VALIDATION_CONFIG.WARNING_THRESHOLD_MS) {
    return 'warning';
  } else {
    return 'normal';
  }
}

/**
 * Create offer validation middleware for booking flows
 */
export function createOfferValidationMiddleware(
  getDuffelOffer: (id: string) => Promise<DuffelOfferSummary>
) {
  return async function validateOfferMiddleware(offerId: string): Promise<void> {
    const validation = await validateOfferForBooking(offerId, getDuffelOffer);
    
    if (!validation.isValid) {
      throw new DuffelAPIError({
        errors: [{
          type: 'offer_no_longer_available',
          title: 'Offer Expired',
          detail: validation.error || 'Offer is no longer valid for booking'
        }]
      });
    }
    
    // Log validation success for monitoring
    console.log(`[OfferValidation] Offer ${offerId} validated successfully. Time remaining: ${formatTimeRemaining(validation.timeRemaining)}`);
  };
}

/**
 * Batch validate multiple offers
 */
export async function validateMultipleOffers(
  offerIds: string[],
  getDuffelOffer: (id: string) => Promise<DuffelOfferSummary>
): Promise<{
  valid: string[];
  expired: string[];
  needRefresh: string[];
  results: Record<string, OfferValidationResult>;
}> {
  const results: Record<string, OfferValidationResult> = {};
  const valid: string[] = [];
  const expired: string[] = [];
  const needRefresh: string[] = [];
  
  await Promise.allSettled(
    offerIds.map(async (offerId) => {
      try {
        const offer = await getDuffelOffer(offerId);
        const validation = validateOfferExpiration(offer);
        results[offerId] = validation;
        
        if (validation.isValid) {
          valid.push(offerId);
          if (validation.needsRefresh) {
            needRefresh.push(offerId);
          }
        } else {
          expired.push(offerId);
        }
      } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
        results[offerId] = {
          isValid: false,
          timeRemaining: 0,
          expiresAt: new Date(),
          needsRefresh: true,
          error: 'Failed to validate offer'
        };
        expired.push(offerId);
      }
    })
  );
  
  return { valid, expired, needRefresh, results };
}
