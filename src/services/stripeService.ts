import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';
import StripeServerModule from 'stripe';
import { rateLimiter, exponentialBackoff } from '../../packages/shared/stripe';
// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface PaymentIntentParams {
  amount: number; // Amount in dollars (will be converted to cents)
  currency: string;
  metadata?: Record<string, string>;
  automatic_payment_methods?: {
    enabled: boolean;
  };
}

/**
 * Enhanced metadata builder for comprehensive business intelligence
 * Follows Stripe API reference: up to 50 keys, 40 char key names, 500 char values
 */
export const buildPaymentMetadata = ({
  userId,
  flightRoute,
  bookingType = 'standard',
  campaignId,
  marketingSource,
  deviceInfo,
  additionalData = {},
}: {
  userId: string;
  flightRoute?: string;
  bookingType?: 'standard' | 'premium' | 'business' | 'auto_booking';
  campaignId?: string;
  marketingSource?: string;
  deviceInfo?: {
    platform?: string;
    userAgent?: string;
    screenResolution?: string;
  };
  additionalData?: Record<string, string>;
}): Record<string, string> => {
  const metadata: Record<string, string> = {
    // Core user data
    user_id: userId.slice(0, 500),
    booking_type: bookingType,
    created_via: 'parker_flight_platform',
    timestamp: new Date().toISOString(),

    // Flight-specific data
    ...(flightRoute && { flight_route: flightRoute.slice(0, 500) }),

    // Marketing attribution
    ...(campaignId && { campaign_id: campaignId.slice(0, 500) }),
    ...(marketingSource && { marketing_source: marketingSource.slice(0, 500) }),

    // Technical metadata
    ...(deviceInfo?.platform && {
      device_platform: deviceInfo.platform.slice(0, 500),
    }),
    ...(deviceInfo?.userAgent && {
      user_agent: deviceInfo.userAgent.slice(0, 500),
    }),
    ...(deviceInfo?.screenResolution && {
      screen_resolution: deviceInfo.screenResolution.slice(0, 500),
    }),

    // Additional business data (ensure we don't exceed 50 key limit)
    ...Object.fromEntries(
      Object.entries(additionalData)
        .slice(0, 50 - 10) // Reserve space for core metadata
        .map(([key, value]) => [
          key.slice(0, 40), // Max 40 chars for key
          String(value).slice(0, 500), // Max 500 chars for value
        ])
    ),
  };

  // Ensure we don't exceed 50 keys total
  const entries = Object.entries(metadata).slice(0, 50);
  return Object.fromEntries(entries);
};

export interface PaymentMethodParams {
  type:
    | 'card'
    | 'us_bank_account'
    | 'sepa_debit'
    | 'ideal'
    | 'sofort'
    | 'bancontact'
    | 'giropay'
    | 'eps'
    | 'p24'
    | 'alipay'
    | 'wechat_pay';
  card?: unknown; // Stripe card element
  us_bank_account?: {
    routing_number: string;
    account_number: string;
    account_holder_type: 'individual' | 'company';
    account_type: 'checking' | 'savings';
  };
  sepa_debit?: {
    iban: string;
  };
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

/**
 * Enhanced payment method configuration per API reference
 * Supports all major payment methods and regional preferences
 */
export interface PaymentMethodConfiguration {
  enabled_payment_methods: PaymentMethodType[];
  automatic_payment_methods?: {
    enabled: boolean;
    allow_redirects?: 'always' | 'never';
  };
  payment_method_options?: {
    card?: {
      setup_future_usage?: 'off_session' | 'on_session';
      request_three_d_secure?: 'automatic' | 'any' | 'challenge';
    };
    us_bank_account?: {
      verification_method?: 'automatic' | 'instant';
      setup_future_usage?: 'off_session' | 'on_session';
    };
    sepa_debit?: {
      setup_future_usage?: 'off_session' | 'on_session';
    };
  };
}

type PaymentMethodType =
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'link'
  | 'us_bank_account'
  | 'sepa_debit'
  | 'ideal'
  | 'sofort'
  | 'bancontact'
  | 'giropay'
  | 'eps'
  | 'p24'
  | 'alipay'
  | 'wechat_pay'
  | 'klarna'
  | 'afterpay_clearpay'
  | 'affirm';

/**
 * Get optimal payment methods based on customer location and preferences
 * Per API reference recommendations for international payments
 */
export const getOptimalPaymentMethods = (
  country: string,
  currency: string,
  amount: number
): PaymentMethodType[] => {
  const baseMethods: PaymentMethodType[] = ['card'];

  // Add digital wallets (high conversion)
  baseMethods.push('apple_pay', 'google_pay', 'link');

  // Add region-specific methods per API reference
  switch (country.toUpperCase()) {
    case 'US':
      baseMethods.push('us_bank_account');
      if (amount >= 5000) {
        // $50+ for BNPL
        baseMethods.push('klarna', 'afterpay_clearpay', 'affirm');
      }
      break;
    case 'DE':
    case 'AT':
    case 'NL':
    case 'BE':
      baseMethods.push('sepa_debit');
      if (country === 'DE') baseMethods.push('sofort', 'giropay');
      if (country === 'NL') baseMethods.push('ideal');
      if (country === 'BE') baseMethods.push('bancontact');
      if (country === 'AT') baseMethods.push('eps');
      break;
    case 'PL':
      baseMethods.push('p24');
      break;
    case 'CN':
      baseMethods.push('alipay', 'wechat_pay');
      break;
    // Add more regions as needed
  }

  return baseMethods;
};

export interface DuffelPaymentSession {
  card_id: string;
  three_d_secure_session_id: string;
  status: 'ready_for_payment' | 'failed' | 'requires_action';
}

/**
 * Stripe Service for handling payment operations
 * Integrates with Supabase edge functions for secure server-side operations
 */
export class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await getStripe();
  }

  /**
   * Create a payment intent via Supabase edge function
   * This ensures sensitive operations happen server-side
   */
  async createPaymentIntent(params: PaymentIntentParams) {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-payment-session',
        {
          body: {
            amount: Math.round(params.amount * 100), // Convert to cents
            currency: params.currency.toLowerCase(),
            metadata: params.metadata || {},
            automatic_payment_methods: params.automatic_payment_methods || {
              enabled: true,
            },
          },
        }
      );

      if (error) {
        const handledError = StripeService.handleStripeError(error);
        throw new Error(handledError.error);
      }

      return {
        client_secret: data.client_secret,
        id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      const handledError = StripeService.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Confirm a payment with 3D Secure authentication for Duffel
   * This method handles the complete flow including Duffel card creation and 3DS
   */
  async confirmPaymentWithDuffel({
    clientSecret,
    paymentMethod,
    offerId,
    passengers,
    returnUrl,
  }: {
    clientSecret: string;
    paymentMethod: PaymentMethodParams;
    offerId: string;
    passengers: Record<string, unknown>[];
    returnUrl?: string;
  }) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      // Step 1: Create Duffel payment session (card + 3DS)
      const duffelSession = await this.createDuffelPaymentSession({
        offerId,
        paymentMethod,
        passengers,
      });

      if (duffelSession.status !== 'ready_for_payment') {
        throw new Error('Payment verification failed. Please try again.');
      }

      // Step 2: Confirm payment with Stripe, enforce 3DS
      const confirmResult = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod as any,
        return_url: returnUrl,
        setup_future_usage: 'off_session',
      });

      if (confirmResult.error) {
        const handledError = StripeService.handleStripeError(
          confirmResult.error
        );
        throw new Error(handledError.error);
      }

      // Step 3: Return combined result
      return {
        paymentIntent: confirmResult.paymentIntent,
        duffelSession,
        success: true,
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      const handledError = StripeService.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Create Duffel payment session (card creation + 3D Secure)
   * This handles the Duffel-specific payment flow
   */
  private async createDuffelPaymentSession({
    offerId,
    paymentMethod,
    passengers,
  }: {
    offerId: string;
    paymentMethod: PaymentMethodParams;
    passengers: Record<string, unknown>[];
  }): Promise<DuffelPaymentSession> {
    try {
      // Create temporary card with Duffel
      const { data: cardData, error: cardError } =
        await supabase.functions.invoke('duffel-create-card', {
          body: {
            payment_method: paymentMethod,
            cardholder_name: `${passengers[0]?.given_name} ${passengers[0]?.family_name}`,
            cardholder_email: passengers[0]?.email,
          },
        });

      if (cardError) {
        throw new Error(`Card creation failed: ${cardError.message}`);
      }

      // Create 3D Secure session
      const { data: sessionData, error: sessionError } =
        await supabase.functions.invoke('duffel-3ds-session', {
          body: {
            card_id: cardData.card_id,
            offer_id: offerId,
            cardholder_present: true,
          },
        });

      if (sessionError) {
        throw new Error(
          `3D Secure session creation failed: ${sessionError.message}`
        );
      }

      return {
        card_id: cardData.card_id,
        three_d_secure_session_id: sessionData.session_id,
        status: sessionData.status,
      };
    } catch (error) {
      console.error('Error creating Duffel payment session:', error);
      throw error;
    }
  }

  /**
   * Retrieve payment intent details
   */
  async retrievePaymentIntent(clientSecret: string) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const { paymentIntent, error } =
        await this.stripe.retrievePaymentIntent(clientSecret);

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw error;
    }
  }

  /**
   * Handle webhook verification (used in edge functions)
   */
  static async verifyWebhookSignature(
    payload: string,
    signature: string,
    endpointSecret: string
  ) {
    const stripe = new StripeServerModule(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-06-30.basil',
      maxNetworkRetries: 3,
    });

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );
      return { event, valid: true };
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return {
        event: null,
        valid: false,
        error:
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
            ? error.message
            : 'Unknown error',
      };
    }
  }

  /**
   * Handle Stripe errors according to API reference standards
   */
  private static handleStripeError(error: any): {
    success: false;
    error: string;
    retryable: boolean;
    errorType: string;
  } {
    // Handle different Stripe error types per API reference documentation
    if (error.type) {
      switch (error.type) {
        case 'StripeCardError':
        case 'card_error':
          // Handle card-specific errors (declined, insufficient funds, etc.)
          return {
            success: false,
            error: error.message || 'Card was declined',
            retryable: false,
            errorType: 'card_error',
          };

        case 'StripeRateLimitError':
        case 'rate_limit_error':
          // Handle rate limiting - should retry with exponential backoff
          return {
            success: false,
            error: 'Too many requests. Please try again shortly.',
            retryable: true,
            errorType: 'rate_limit_error',
          };

        case 'StripeInvalidRequestError':
        case 'invalid_request_error':
          // Handle malformed requests - don't retry
          return {
            success: false,
            error: error.message || 'Invalid request parameters',
            retryable: false,
            errorType: 'invalid_request_error',
          };

        case 'StripeAPIError':
        case 'api_error':
          // Handle Stripe API errors - can retry
          return {
            success: false,
            error: 'Payment processing temporarily unavailable',
            retryable: true,
            errorType: 'api_error',
          };

        case 'StripeConnectionError':
        case 'connection_error':
          // Handle network errors - can retry
          return {
            success: false,
            error: 'Network error. Please check your connection and try again.',
            retryable: true,
            errorType: 'connection_error',
          };

        case 'StripeAuthenticationError':
        case 'authentication_error':
          // Handle authentication errors - don't retry
          return {
            success: false,
            error: 'Authentication failed',
            retryable: false,
            errorType: 'authentication_error',
          };

        case 'idempotency_error':
        case 'StripeIdempotencyError':
          // Handle idempotency errors - per API reference lines 509-510
          return {
            success: false,
            error:
              'Duplicate request detected. Please use a new idempotency key.',
            retryable: false,
            errorType: 'idempotency_error',
          };

        case 'StripePermissionError':
        case 'permission_error':
          // Handle permission errors
          return {
            success: false,
            error: 'Insufficient permissions for this operation',
            retryable: false,
            errorType: 'permission_error',
          };

        case 'StripeSignatureVerificationError':
        case 'signature_verification_error':
          // Handle webhook signature verification errors
          return {
            success: false,
            error: 'Webhook signature verification failed',
            retryable: false,
            errorType: 'signature_verification_error',
          };

        default:
          return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            retryable: false,
            errorType: 'unknown_error',
          };
      }
    }

    // Handle HTTP status codes
    if (error.statusCode) {
      switch (error.statusCode) {
        case 400:
          return {
            success: false,
            error: 'Bad request - please check your payment information',
            retryable: false,
            errorType: 'bad_request',
          };
        case 401:
          return {
            success: false,
            error: 'Authentication failed',
            retryable: false,
            errorType: 'unauthorized',
          };
        case 402:
          return {
            success: false,
            error: 'Payment required',
            retryable: false,
            errorType: 'payment_required',
          };
        case 403:
          return {
            success: false,
            error: 'Forbidden - insufficient permissions',
            retryable: false,
            errorType: 'forbidden',
          };
        case 404:
          return {
            success: false,
            error: 'Resource not found',
            retryable: false,
            errorType: 'not_found',
          };
        case 409:
          return {
            success: false,
            error: 'Conflict - request conflicts with existing resource',
            retryable: false,
            errorType: 'conflict',
          };
        case 429:
          return {
            success: false,
            error: 'Rate limited - please try again shortly',
            retryable: true,
            errorType: 'rate_limited',
          };
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            success: false,
            error: 'Server error - please try again',
            retryable: true,
            errorType: 'server_error',
          };
        default:
          return {
            success: false,
            error: error.message || 'An unexpected error occurred',
            retryable: false,
            errorType: 'unknown_error',
          };
      }
    }

    // Generic error handling
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      retryable: false,
      errorType: 'generic_error',
    };
  }

  /**
   * Process refund (server-side via edge function)
   */
  async processRefund({
    paymentIntentId,
    amount,
    reason,
  }: {
    paymentIntentId: string;
    amount?: number;
    reason?: string;
  }) {
    try {
      const { data, error } = await supabase.functions.invoke(
        'process-refund',
        {
          body: {
            payment_intent_id: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
            reason: reason || 'requested_by_customer',
          },
        }
      );

      if (error) {
        const handledError = StripeService.handleStripeError(error);
        throw new Error(handledError.error);
      }

      return data;
    } catch (error) {
      console.error('Error processing refund:', error);
      const handledError = StripeService.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        'get-payment-methods',
        {
          body: { customer_id: customerId },
        }
      );

      if (error) {
        throw new Error(`Failed to retrieve payment methods: ${error.message}`);
      }

      return data.payment_methods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(paymentMethodId: string) {
    try {
      const { data, error } = await supabase.functions.invoke(
        'delete-payment-method',
        {
          body: { payment_method_id: paymentMethodId },
        }
      );

      if (error) {
        throw new Error(`Failed to delete payment method: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const stripeService = new StripeService();

// Export utility functions
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
  };

  return symbols[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Performance and Caching Utilities per API Reference
 */
class StripeCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const stripeCache = new StripeCache();

/**
 * Cursor-based pagination helper per API reference
 */
export interface PaginationParams {
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  has_more: boolean;
  url: string;
}

/**
 * Batch operations helper
 * Optimizes multiple API calls per API reference recommendations
 */
export class StripeBatch {
  private operations: Array<() => Promise<any>> = [];
  private readonly batchSize = 10;

  add(operation: () => Promise<any>): void {
    this.operations.push(operation);
  }

  async execute(): Promise<any[]> {
    const results: any[] = [];

    // Process operations in batches to respect rate limits
    for (let i = 0; i < this.operations.length; i += this.batchSize) {
      const batch = this.operations.slice(i, i + this.batchSize);

      // Wait for rate limit slot before processing batch
      await rateLimiter.waitForSlot();

      const batchResults = await Promise.allSettled(
        batch.map(operation => exponentialBackoff(operation))
      );

      results.push(...batchResults);
    }

    return results;
  }

  clear(): void {
    this.operations = [];
  }
}

/**
 * Enhanced search with query optimization per API reference
 */
export const searchCharges = async (params: {
  query: string;
  limit?: number;
  expand?: string[];
}): Promise<PaginatedResponse<any>> => {
  const cacheKey = `search_charges_${JSON.stringify(params)}`;

  // Try cache first
  const cached = stripeCache.get<PaginatedResponse<any>>(cacheKey);
  if (cached) {
    return cached;
  }

  await rateLimiter.waitForSlot();

  const { data, error } = await supabase.functions.invoke('search-charges', {
    body: {
      query: params.query,
      limit: params.limit || 10,
      expand: params.expand || [],
    },
  });

  if (error) {
    throw error;
  }

  // Cache results
  stripeCache.set(cacheKey, data, 2 * 60 * 1000); // 2 minutes

  return data;
};

/**
 * Multi-currency conversion with caching
 * Optimizes currency lookups per API reference
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<{ amount: number; rate: number; converted_amount: number }> => {
  const cacheKey = `fx_rate_${fromCurrency}_${toCurrency}`;

  // Try cache first (rates change infrequently)
  const cached = stripeCache.get<{ rate: number; timestamp: number }>(cacheKey);
  if (cached) {
    return {
      amount,
      rate: cached.rate,
      converted_amount: Math.round(amount * cached.rate),
    };
  }

  const { data, error } = await supabase.functions.invoke('get-fx-rate', {
    body: {
      from: fromCurrency.toLowerCase(),
      to: toCurrency.toLowerCase(),
    },
  });

  if (error) {
    throw error;
  }

  // Cache exchange rate for 1 hour
  stripeCache.set(
    cacheKey,
    {
      rate: data.rate,
      timestamp: Date.now(),
    },
    60 * 60 * 1000
  );

  return {
    amount,
    rate: data.rate,
    converted_amount: Math.round(amount * data.rate),
  };
};

export default stripeService;
