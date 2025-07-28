import * as React from 'react';
/**
 * Duffel Service Implementation - Following DUFFEL_IMPLEMENTATION_GUIDE.md
 *
 * This service implements all patterns and best practices from the guide:
 * - Official @duffel/api client library
 * - Proper workflow: Search → Book → Pay → Monitor
 * - Rate limiting (120/min search, 60/min orders, 300/min other)
 * - Comprehensive error handling with user-friendly messages
 * - Offer expiration validation with 2-minute buffer
 * - Idempotent order creation
 * - Fallback strategies
 */

import { Duffel } from '@duffel/api';
import type {
  OfferRequest,
  OfferRequestCreate,
  Offer,
  Order,
  OrderCreate,
  OrderPassenger,
  CreatePayment,
} from '@duffel/api/types';

// Rate Limiting Configuration per Implementation Guide
const RATE_LIMITS = {
  search: 120, // requests per minute
  orders: 60, // requests per minute
  other: 300, // requests per minute
} as const;

// Error Mapping per Implementation Guide
const DUFFEL_ERROR_MESSAGES = {
  offer_no_longer_available:
    'This flight is no longer available. Please search again.',
  validation_error: 'Please check your travel details and try again.',
  payment_required: 'Payment is required to complete this booking.',
  insufficient_funds: 'Payment was declined. Please try a different card.',
  rate_limit_exceeded: 'Too many requests. Please wait a moment and try again.',
  offer_expired: 'This offer has expired. Please search for flights again.',
  invalid_passenger_data: 'Please check passenger details and try again.',
  booking_failed:
    'Unable to complete booking. Please try again or contact support.',
} as const;

// Rate Limiter Implementation
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(operation: keyof typeof RATE_LIMITS): boolean {
    const now = Date.now();
    const limit = RATE_LIMITS[operation];
    const windowMs = 60 * 1000; // 1 minute

    const operationRequests = this.requests.get(operation) || [];
    const validRequests = operationRequests.filter(
      time => now - time < windowMs
    );

    if (validRequests.length >= limit) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(operation, validRequests);
    return true;
  }

  async waitForCapacity(operation: keyof typeof RATE_LIMITS): Promise<void> {
    while (!this.isAllowed(operation)) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Retry Configuration per Implementation Guide
const RETRY_CONFIG = {
  maxRetries: 3,
  backoffMs: [1000, 2000, 4000], // Exponential backoff
  retryableStatuses: [429, 500, 502, 503, 504],
};

export class DuffelServiceGuided {
  private duffel: Duffel;
  private rateLimiter = new RateLimiter();
  private isLive: boolean;

  constructor() {
    // Environment Configuration per Implementation Guide
    this.isLive = process.env.DUFFEL_LIVE_ENABLED === 'true';
    const apiToken = this.isLive
      ? process.env.DUFFEL_API_TOKEN_LIVE
      : process.env.DUFFEL_API_TOKEN_TEST;

    if (!apiToken) {
      throw new Error(`Missing Duffel ${this.isLive ? 'live' : 'test'} token`);
    }

    // Initialize Official Duffel Client per Implementation Guide
    this.duffel = new Duffel({
      token: apiToken,
    });

    console.log(
      `[DuffelService] Initialized in ${this.isLive ? 'LIVE' : 'TEST'} mode`
    );
  }

  /**
   * WORKFLOW STEP 1: Create Offer Request (Flight Search)
   * Following Implementation Guide Pattern
   */
  async createOfferRequest(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }>;
    cabinClass?: 'first' | 'business' | 'premium_economy' | 'economy';
    maxConnections?: number;
  }): Promise<OfferRequest> {
    await this.rateLimiter.waitForCapacity('search');

    const slices = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
      },
    ];

    // Add return slice if round-trip
    if (params.returnDate) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate,
      });
    }

    const requestData: OfferRequestCreate = {
      slices,
      passengers: params.passengers,
      cabin_class: params.cabinClass || 'economy',
      max_connections: params.maxConnections || 1,
    };

    try {
      console.log(
        '[DuffelService] Creating offer request:',
        JSON.stringify(requestData, null, 2)
      );

      const offerRequest = await this.withRetry('search', async () => {
        return await this.duffel.offerRequests.create(requestData);
      });

      console.log(`[DuffelService] Offer request created: ${offerRequest.id}`);
      return offerRequest;
    } catch (error) {
      throw this.handleError(error, 'Failed to search for flights');
    }
  }

  /**
   * WORKFLOW STEP 2: Get Offers from Offer Request
   * Following Implementation Guide Pattern
   */
  async getOffers(offerRequestId: string, limit = 50): Promise<Offer[]> {
    await this.rateLimiter.waitForCapacity('other');

    try {
      console.log(
        `[DuffelService] Retrieving offers for request: ${offerRequestId}`
      );

      const offers = await this.withRetry('other', async () => {
        return await this.duffel.offers.list({
          offer_request_id: offerRequestId,
          limit,
        });
      });

      // Filter out expired offers per Implementation Guide
      const validOffers = offers.data.filter(offer => this.isOfferValid(offer));

      console.log(
        `[DuffelService] Retrieved ${validOffers.length}/${offers.data.length} valid offers`
      );
      return validOffers;
    } catch (error) {
      throw this.handleError(error, 'Failed to retrieve flight offers');
    }
  }

  /**
   * Get Single Offer with Validation - Implementation Guide Pattern
   */
  async getOffer(offerId: string): Promise<Offer | null> {
    await this.rateLimiter.waitForCapacity('other');

    try {
      const offer = await this.withRetry('other', async () => {
        return await this.duffel.offers.get(offerId);
      });

      const validation = this.validateOffer(offer);
      if (!validation.valid) {
        console.warn(
          `[DuffelService] Offer ${offerId} expired (${validation.minutesLeft} minutes left)`
        );
        return null;
      }

      return offer;
    } catch (error) {
      console.error(`[DuffelService] Failed to get offer ${offerId}:`, error);
      return null;
    }
  }

  /**
   * WORKFLOW STEP 3: Create Order (Book Flight)
   * Following Implementation Guide Pattern with Idempotency
   */
  async createOrder(params: {
    offerId: string;
    passengers: OrderPassenger[];
    idempotencyKey: string;
    paymentType?: 'balance' | 'card';
    metadata?: Record<string, unknown>;
  }): Promise<Order> {
    await this.rateLimiter.waitForCapacity('orders');

    // Validate offer before booking per Implementation Guide
    const offer = await this.getOffer(params.offerId);
    if (!offer) {
      throw new Error('Offer is no longer valid or has expired');
    }

    const orderData: OrderCreate = {
      selected_offers: [params.offerId],
      passengers: params.passengers,
      payments: [
        {
          type: params.paymentType || 'balance',
          amount: offer.total_amount,
          currency: offer.total_currency,
        },
      ],
      metadata: {
        ...params.metadata,
        idempotency_key: params.idempotencyKey,
        created_by: 'parker-flight-guided',
        integration_version: 'v2.0.0',
      },
    };

    try {
      console.log(
        `[DuffelService] Creating order with idempotency key: ${params.idempotencyKey}`
      );

      const order = await this.withRetry('orders', async () => {
        return await this.duffel.orders.create(orderData, {
          headers: {
            'Idempotency-Key': params.idempotencyKey,
          },
        });
      });

      console.log(
        `[DuffelService] Order created: ${order.id}, Status: ${order.booking_reference}`
      );
      return order;
    } catch (error) {
      throw this.handleError(error, 'Failed to create booking');
    }
  }

  /**
   * Get Order Details
   */
  async getOrder(orderId: string): Promise<Order> {
    await this.rateLimiter.waitForCapacity('other');

    try {
      return await this.withRetry('other', async () => {
        return await this.duffel.orders.get(orderId);
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to retrieve order');
    }
  }

  /**
   * Cancel Order (if supported)
   */
  async cancelOrder(
    orderId: string
  ): Promise<{ success: boolean; refund?: any }> {
    await this.rateLimiter.waitForCapacity('orders');

    try {
      const cancellation = await this.withRetry('orders', async () => {
        return await this.duffel.orders.cancel(orderId);
      });

      return { success: true, refund: cancellation };
    } catch (error) {
      console.error(
        `[DuffelService] Failed to cancel order ${orderId}:`,
        error
      );
      return { success: false };
    }
  }

  /**
   * Offer Validation with Safety Buffer - Implementation Guide Pattern
   */
  validateOffer(offer: Offer): { valid: boolean; minutesLeft: number } {
    const now = new Date();
    const expires = new Date(offer.expires_at);
    const timeLeft = expires.getTime() - now.getTime();
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    const safetyBuffer = 2; // 2-minute safety buffer per Implementation Guide

    return {
      valid: minutesLeft > safetyBuffer,
      minutesLeft,
    };
  }

  /**
   * Simple offer validation check
   */
  private isOfferValid(offer: Offer): boolean {
    return this.validateOffer(offer).valid;
  }

  /**
   * Retry Logic with Exponential Backoff - Implementation Guide Pattern
   */
  private async withRetry<T>(
    operation: keyof typeof RATE_LIMITS,
    fn: () => Promise<T>
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry client errors (4xx) except rate limits
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        // Don't retry if max attempts reached
        if (attempt === RETRY_CONFIG.maxRetries) {
          break;
        }

        // Wait with exponential backoff
        const delay =
          RETRY_CONFIG.backoffMs[attempt] ||
          RETRY_CONFIG.backoffMs[RETRY_CONFIG.backoffMs.length - 1];
        console.log(
          `[DuffelService] Attempt ${attempt + 1} failed, retrying in ${delay}ms`
        );
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Error Handling with User-Friendly Messages - Implementation Guide Pattern
   */
  private handleError(error: any, defaultMessage: string): Error {
    console.error('[DuffelService] API Error:', error);

    // Extract error type from Duffel API response
    const errorType =
      error?.errors?.[0]?.type || error?.type || 'unknown_error';
    const errorDetail =
      error?.errors?.[0]?.detail || error?.message || defaultMessage;

    // Map to user-friendly message per Implementation Guide
    const userMessage =
      DUFFEL_ERROR_MESSAGES[errorType as keyof typeof DUFFEL_ERROR_MESSAGES] ||
      `${defaultMessage}. Please try again or contact support.`;

    const enhancedError = new Error(userMessage);
    (enhancedError as any).originalError = error;
    (enhancedError as any).errorType = errorType;
    (enhancedError as any).status = error?.status;

    return enhancedError;
  }

  /**
   * Test Connection - Utility Method
   */
  async testConnection(): Promise<boolean> {
    try {
      // Simple connectivity test using airports endpoint
      await this.duffel.airports.list({ limit: 1 });
      console.log('✅ Duffel API connection successful');
      return true;
    } catch (error) {
      console.error('❌ Duffel API connection failed:', error);
      return false;
    }
  }

  /**
   * Get Integration Status
   */
  getStatus() {
    return {
      mode: this.isLive ? 'LIVE' : 'TEST',
      rateLimits: RATE_LIMITS,
      retryConfig: RETRY_CONFIG,
      version: '2.0.0-guided',
    };
  }
}

/**
 * Factory function following Implementation Guide pattern
 */
export function createDuffelServiceGuided(): DuffelServiceGuided {
  return new DuffelServiceGuided();
}

/**
 * Utility Functions per Implementation Guide
 */

// Convert Parker Flight passenger data to Duffel format
export function mapPassengerToDuffel(passenger: {
  firstName: string;
  lastName: string;
  title?: string;
  gender?: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
}): OrderPassenger {
  const duffelPassenger: OrderPassenger = {
    title: (passenger.title as any) || 'mr',
    given_name: passenger.firstName,
    family_name: passenger.lastName,
    gender: passenger.gender === 'female' ? 'f' : 'm',
    born_on: passenger.dateOfBirth, // YYYY-MM-DD format
    email: passenger.email,
    phone_number: passenger.phoneNumber,
  };

  // Add passport if provided (required for international travel)
  if (passenger.passportNumber) {
    duffelPassenger.identity_documents = [
      {
        type: 'passport',
        unique_identifier: passenger.passportNumber,
        issuing_country_code: passenger.passportCountry || 'US',
        expires_on: passenger.passportExpiry,
      },
    ];
  }

  return duffelPassenger;
}

// Convert trip request to Duffel search parameters
export function mapTripRequestToDuffelSearch(tripRequest: {
  departure_airports?: string[];
  origin_location_code?: string;
  destination_location_code: string;
  departure_date: string;
  return_date?: string;
  adults?: number;
  children?: number;
  infants?: number;
  travel_class?: string;
}) {
  const passengers = [];

  // Add adults
  for (let i = 0; i < (tripRequest.adults || 1); i++) {
    passengers.push({ type: 'adult' as const });
  }

  // Add children
  for (let i = 0; i < (tripRequest.children || 0); i++) {
    passengers.push({ type: 'child' as const });
  }

  // Add infants
  for (let i = 0; i < (tripRequest.infants || 0); i++) {
    passengers.push({ type: 'infant_without_seat' as const });
  }

  return {
    origin:
      tripRequest.departure_airports?.[0] || tripRequest.origin_location_code!,
    destination: tripRequest.destination_location_code,
    departureDate: tripRequest.departure_date,
    returnDate: tripRequest.return_date,
    passengers,
    cabinClass: (tripRequest.travel_class?.toLowerCase() as any) || 'economy',
    maxConnections: 1,
  };
}

export default DuffelServiceGuided;
