import * as React from 'react';
/**
 * Duffel API Service for Parker Flight
 * Handles flight booking through Duffel as Merchant of Record
 *
 * Enhanced with:
 * - Comprehensive error handling and user-friendly messages
 * - Circuit breaker pattern for resilience
 * - Offer validation and expiration management
 * - Performance monitoring and logging
 */

import { DuffelAPIError, throwDuffelError } from '../lib/errors/duffelErrors';
import {
  withCircuitBreaker,
  CIRCUIT_BREAKER_CONFIGS,
} from '../lib/resilience/circuitBreaker';
import {
  validateOfferForBooking,
  type DuffelOfferSummary,
} from '../lib/services/offerValidation';

// Duffel API Types
export interface DuffelPassenger {
  title: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
  gender: 'male' | 'female';
  given_name: string;
  family_name: string;
  born_on: string; // YYYY-MM-DD format
  email: string;
  phone_number: string;
  identity_documents?: Array<{
    type: 'passport' | 'national_id';
    number: string;
    issuing_country_code: string;
    expires_on?: string;
  }>;
}

export interface DuffelOfferRequest {
  slices: Array<{
    origin: string; // IATA code
    destination: string; // IATA code
    departure_date: string; // YYYY-MM-DD
  }>;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant_without_seat';
  }>;
  cabin_class?: 'first' | 'business' | 'premium_economy' | 'economy';
  max_connections?: number;
}

export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: Record<string, unknown>[];
  expires_at: string;
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: {
    awaiting_payment: boolean;
    payment_required_by?: string;
    price_guarantee_expires_at?: string;
  };
  tickets?: Array<{
    id: string;
    number: string;
    passenger_id: string;
  }>;
}

export interface DuffelOrderRequest {
  offer_id: string;
  passengers: DuffelPassenger[];
  payments: Array<{
    type: 'balance' | 'card';
    amount: string;
    currency: string;
  }>;
}

// Environment configuration
const DUFFEL_API_URL = 'https://api.duffel.com/air';
const DUFFEL_VERSION = 'v2';

function getDuffelToken(): string {
  // Check for live vs test mode via environment or feature flag
  const isLive = process.env.DUFFEL_LIVE_ENABLED === 'true';
  const token = isLive
    ? process.env.DUFFEL_LIVE_TOKEN
    : process.env.DUFFEL_TEST_TOKEN;

  if (!token) {
    throw new Error(
      `Missing Duffel ${isLive ? 'live' : 'test'} token in environment`
    );
  }

  return token;
}

/**
 * Enhanced Duffel API request with comprehensive error handling,
 * performance monitoring, and circuit breaker protection
 */
async function duffelRequest<T>(
  endpoint: string,
  options: RequestInit & { idempotencyKey?: string } = {}
): Promise<T> {
  const { idempotencyKey, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Duffel-Version': DUFFEL_VERSION,
    Authorization: `Bearer ${getDuffelToken()}`,
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  // Determine circuit breaker config based on endpoint type
  const isBookingEndpoint =
    endpoint.includes('/orders') || endpoint.includes('/payment');
  const circuitBreakerConfig = isBookingEndpoint
    ? CIRCUIT_BREAKER_CONFIGS.CRITICAL_API
    : CIRCUIT_BREAKER_CONFIGS.SEARCH_API;

  // Create protected function with circuit breaker
  const protectedFetch = withCircuitBreaker(
    `duffel-${isBookingEndpoint ? 'booking' : 'search'}`,
    circuitBreakerConfig,
    async () => {
      const startTime = performance.now();

      try {
        // Add timeout for requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        const response = await fetch(`${DUFFEL_API_URL}${endpoint}`, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Log performance metrics
        const duration = performance.now() - startTime;
        console.log(
          `[DuffelService] ${fetchOptions.method || 'GET'} ${endpoint} - ${response.status} (${duration.toFixed(2)}ms)`
        );

        // Log slow requests
        if (duration > 5000) {
          console.warn(
            `[DuffelService] Slow request detected: ${duration.toFixed(2)}ms for ${endpoint}`
          );
        }

        const responseText = await response.text();

        if (!response.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch {
            // Response is not JSON, create error structure
            errorData = {
              errors: [
                {
                  type: 'api_error',
                  title: `HTTP ${response.status}`,
                  detail: `Request failed with status ${response.status}`,
                },
              ],
            };
          }

          console.error('[DuffelService] API Error:', {
            status: response.status,
            endpoint,
            method: fetchOptions.method || 'GET',
            response: responseText.substring(0, 500), // Limit log size
          });

          throwDuffelError(errorData, response.status);
        }

        try {
          return JSON.parse(responseText);
        } catch {
          throw new DuffelAPIError({
            errors: [
              {
                type: 'invalid_response',
                title: 'Invalid Response',
                detail: 'Received invalid JSON response from Duffel API',
              },
            ],
          });
        }
      } catch (error) {
        // Handle timeout and network errors
        if (
          error &&
          typeof error === 'object' &&
          'name' in error &&
          error.name === 'AbortError'
        ) {
          throw new DuffelAPIError({
            errors: [
              {
                type: 'timeout_error',
                title: 'Request Timeout',
                detail: 'Request to Duffel API timed out',
              },
            ],
          });
        }

        if (error instanceof DuffelAPIError) {
          throw error;
        }

        // Handle other network errors
        throw new DuffelAPIError({
          errors: [
            {
              type: 'network_error',
              title: 'Network Error',
              detail:
                error &&
                typeof error === 'object' &&
                'message' in error &&
                typeof error.message === 'string'
                  ? error.message
                  : 'Failed to connect to Duffel API',
            },
          ],
        });
      }
    }
  );

  return protectedFetch();
}

/**
 * Create an offer request to get bookable offers from Duffel
 */
export async function createOfferRequest(
  request: DuffelOfferRequest
): Promise<DuffelOffer[]> {
  const response = await duffelRequest<{ data: { offers: DuffelOffer[] } }>(
    '/offer_requests?return_offers=true',
    {
      method: 'POST',
      body: JSON.stringify({ data: request }),
    }
  );

  return response.data.offers;
}

/**
 * Get a Duffel offer by ID for validation
 */
export async function getDuffelOffer(
  offerId: string
): Promise<DuffelOfferSummary> {
  const response = await duffelRequest<{ data: DuffelOfferSummary }>(
    `/air/offers/${offerId}`
  );
  return response.data;
}

/**
 * Create a booking order with Duffel
 * Includes offer validation before booking attempt
 */
export async function createOrder(
  orderRequest: DuffelOrderRequest,
  idempotencyKey: string
): Promise<DuffelOrder> {
  // Validate offer before attempting to book
  await validateOfferForBooking(orderRequest.offer_id, getDuffelOffer);

  console.log(
    `[DuffelService] Creating order for offer ${orderRequest.offer_id} with idempotency key ${idempotencyKey}`
  );

  const response = await duffelRequest<{ data: DuffelOrder }>('/orders', {
    method: 'POST',
    body: JSON.stringify({ data: orderRequest }),
    idempotencyKey,
  });

  console.log(
    `[DuffelService] Order created successfully: ${response.data.id}`
  );
  return response.data;
}

/**
 * Get an existing order by ID
 */
export async function getOrder(orderId: string): Promise<DuffelOrder> {
  const response = await duffelRequest<{ data: DuffelOrder }>(
    `/orders/${orderId}`
  );

  return response.data;
}

/**
 * Cancel an order (if possible)
 */
export async function cancelOrder(orderId: string): Promise<DuffelOrder> {
  const response = await duffelRequest<{ data: DuffelOrder }>(
    `/orders/${orderId}/actions/cancel`,
    { method: 'POST' }
  );

  return response.data;
}

/**
 * Convert Parker Flight passenger data to Duffel format
 */
export function mapPassengerToDuffel(
  passenger: Record<string, unknown>
): DuffelPassenger {
  return {
    title: (passenger.title as 'ms' | 'mr' | 'mrs' | 'miss' | 'dr') || 'mr',
    gender: (passenger.gender as 'male' | 'female') || 'male',
    given_name: String(passenger.first_name || ''),
    family_name: String(passenger.last_name || ''),
    born_on: String(passenger.date_of_birth || ''), // Should be YYYY-MM-DD
    email: String(passenger.email || ''),
    phone_number: String(passenger.phone_number || ''),
    identity_documents: passenger.passport_number
      ? [
          {
            type: 'passport',
            number: String(passenger.passport_number),
            issuing_country_code: String(passenger.passport_country || 'US'),
            expires_on: String(passenger.passport_expiry || ''),
          },
        ]
      : undefined,
  };
}

/**
 * Convert Amadeus search results to Duffel offer request format
 */
export function mapAmadeusSearchToDuffelRequest(
  searchParams: Record<string, unknown>,
  passengerCount: { adults: number; children?: number; infants?: number }
): DuffelOfferRequest {
  const passengers: Array<{ type: 'adult' | 'child' | 'infant_without_seat' }> =
    [];

  // Add adults
  for (let i = 0; i < passengerCount.adults; i++) {
    passengers.push({ type: 'adult' });
  }

  // Add children
  for (let i = 0; i < (passengerCount.children || 0); i++) {
    passengers.push({ type: 'child' });
  }

  // Add infants
  for (let i = 0; i < (passengerCount.infants || 0); i++) {
    passengers.push({ type: 'infant_without_seat' });
  }

  return {
    slices: [
      {
        origin: String(searchParams.origin || ''),
        destination: String(searchParams.destination || ''),
        departure_date: String(searchParams.departure_date || ''),
      },
    ],
    passengers,
    cabin_class:
      (searchParams.cabin_class as
        | 'first'
        | 'business'
        | 'premium_economy'
        | 'economy') || 'economy',
    max_connections: Number(searchParams.max_connections) || undefined,
  };
}
