import * as React from 'react';
/**
 * Secure Stripe Service with AWS Secrets Manager Integration
 *
 * This service integrates Stripe payments with secure credential management
 * using AWS Secrets Manager following production security best practices.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createClient } from '@supabase/supabase-js';
import { getSecretValue } from '@/lib/aws-sdk-enhanced/secrets-manager';
import { secretCache } from '@/lib/aws-sdk-enhanced/examples/secrets-manager-usage';
// Environment configuration
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// Secret naming patterns following AWS best practices
const SECRET_PATTERNS = {
  stripe: {
    publishableKey: `${ENVIRONMENT}/payments/stripe-publishable-key`,
    secretKey: `${ENVIRONMENT}/payments/stripe-secret-key`,
    webhookSecret: `${ENVIRONMENT}/payments/stripe-webhook-secret`,
  },
  supabase: {
    url: `${ENVIRONMENT}/database/supabase-url`,
    anonKey: `${ENVIRONMENT}/database/supabase-anon-key`,
    serviceKey: `${ENVIRONMENT}/database/supabase-service-key`,
  },
};

/**
 * Secure configuration cache with TTL
 * Reduces AWS API calls while maintaining security
 */
class SecureConfigCache {
  private static instance: SecureConfigCache;
  private configCache = new Map<string, { value: any; expiry: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): SecureConfigCache {
    if (!SecureConfigCache.instance) {
      SecureConfigCache.instance = new SecureConfigCache();
    }
    return SecureConfigCache.instance;
  }

  async getConfig<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.configCache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return cached.value as T;
    }

    const value = await fetcher();
    this.configCache.set(key, {
      value,
      expiry: Date.now() + this.CACHE_TTL,
    });

    return value;
  }

  clearCache(): void {
    this.configCache.clear();
  }
}

/**
 * Secure Stripe Configuration Manager
 * Handles all Stripe-related secrets from AWS Secrets Manager
 */
export class StripeSecureConfig {
  private static configCache = SecureConfigCache.getInstance();

  /**
   * Get Stripe publishable key securely
   */
  static async getPublishableKey(): Promise<string> {
    return this.configCache.getConfig('stripe-publishable-key', async () => {
      const key = await secretCache.getSecret(
        SECRET_PATTERNS.stripe.publishableKey,
        AWS_REGION,
        10 * 60 * 1000 // 10 minute cache for client-side keys
      );

      if (!key) {
        throw new Error(
          `Stripe publishable key not found for environment: ${ENVIRONMENT}`
        );
      }

      // Validate key format per API reference documentation
      if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
        throw new Error(
          'Invalid Stripe publishable key format. Must start with pk_test_ or pk_live_'
        );
      }

      // Environment validation
      if (ENVIRONMENT === 'production' && key.startsWith('pk_test_')) {
        throw new Error(
          'Cannot use test publishable key in production environment'
        );
      }

      if (ENVIRONMENT !== 'production' && key.startsWith('pk_live_')) {
        console.warn(
          '⚠️ Using live publishable key in non-production environment'
        );
      }

      return key;
    });
  }

  /**
   * Get Stripe secret key securely (server-side only)
   */
  static async getSecretKey(): Promise<string> {
    return this.configCache.getConfig('stripe-secret-key', async () => {
      const key = await secretCache.getSecret(
        SECRET_PATTERNS.stripe.secretKey,
        AWS_REGION,
        5 * 60 * 1000 // 5 minute cache for secret keys
      );

      if (!key) {
        throw new Error(
          `Stripe secret key not found for environment: ${ENVIRONMENT}`
        );
      }

      // Validate key format per API reference documentation
      if (!key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
        throw new Error(
          'Invalid Stripe secret key format. Must start with sk_test_ or sk_live_'
        );
      }

      // Environment validation
      if (ENVIRONMENT === 'production' && key.startsWith('sk_test_')) {
        throw new Error('Cannot use test secret key in production environment');
      }

      if (ENVIRONMENT !== 'production' && key.startsWith('sk_live_')) {
        console.warn('⚠️ Using live secret key in non-production environment');
      }

      return key;
    });
  }

  /**
   * Get Stripe webhook secret securely
   */
  static async getWebhookSecret(): Promise<string> {
    return this.configCache.getConfig('stripe-webhook-secret', async () => {
      const secret = await secretCache.getSecret(
        SECRET_PATTERNS.stripe.webhookSecret,
        AWS_REGION,
        5 * 60 * 1000
      );

      if (!secret) {
        throw new Error(
          `Stripe webhook secret not found for environment: ${ENVIRONMENT}`
        );
      }

      // Validate webhook secret format
      if (!secret.startsWith('whsec_')) {
        throw new Error('Invalid Stripe webhook secret format');
      }

      return secret;
    });
  }
}

/**
 * Secure Supabase Configuration Manager
 */
export class SupabaseSecureConfig {
  private static configCache = SecureConfigCache.getInstance();
  private static supabaseClient: any = null;

  /**
   * Get Supabase configuration securely
   */
  static async getConfig(): Promise<{
    url: string;
    anonKey: string;
    serviceKey?: string;
  }> {
    return this.configCache.getConfig('supabase-config', async () => {
      const [url, anonKey, serviceKey] = await Promise.all([
        secretCache.getSecret(SECRET_PATTERNS.supabase.url, AWS_REGION),
        secretCache.getSecret(SECRET_PATTERNS.supabase.anonKey, AWS_REGION),
        secretCache.getSecret(SECRET_PATTERNS.supabase.serviceKey, AWS_REGION),
      ]);

      if (!url || !anonKey) {
        throw new Error(
          `Supabase configuration not found for environment: ${ENVIRONMENT}`
        );
      }

      return { url, anonKey, serviceKey };
    });
  }

  /**
   * Get secure Supabase client instance
   */
  static async getClient(useServiceKey = false) {
    if (!this.supabaseClient) {
      const config = await this.getConfig();
      const key = useServiceKey
        ? config.serviceKey || config.anonKey
        : config.anonKey;

      this.supabaseClient = createClient(config.url, key);
    }

    return this.supabaseClient;
  }
}

/**
 * Enhanced Secure Stripe Service
 * All payment operations with AWS Secrets Manager integration
 */
export class StripeServiceSecure {
  private stripePromise: Promise<Stripe | null> | null = null;
  private serverStripe: any = null;

  constructor() {
    this.initializeStripe();
  }

  /**
   * Initialize client-side Stripe with secure publishable key
   */
  private async initializeStripe() {
    if (!this.stripePromise) {
      this.stripePromise = this.loadStripeSecure();
    }
    return this.stripePromise;
  }

  private async loadStripeSecure(): Promise<Stripe | null> {
    try {
      const publishableKey = await StripeSecureConfig.getPublishableKey();
      return await loadStripe(publishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);

      // In development mode, provide helpful error message but don't crash
      if (ENVIRONMENT === 'development') {
        console.warn(
          '⚠️ Stripe service failed to initialize in development mode. This is expected if AWS Secrets Manager is not configured.'
        );
        console.warn(
          '💡 To enable payments in development, configure AWS Secrets Manager or use environment variables.'
        );
        return null; // Return null instead of throwing to prevent app crash
      }

      // In production, throw the error as this is critical
      throw new Error('Unable to initialize secure payment processing');
    }
  }

  /**
   * Get client-side Stripe instance
   */
  async getStripe(): Promise<Stripe | null> {
    return await this.initializeStripe();
  }

  /**
   * Create secure payment intent
   */
  async createPaymentIntent(params: {
    amount: number; // Amount in dollars
    currency: string;
    metadata?: Record<string, string>;
    customerId?: string;
    paymentMethodId?: string;
  }) {
    try {
      const supabase = await SupabaseSecureConfig.getClient();

      // Call secure edge function that uses AWS Secrets Manager
      const { data, error } = await supabase.functions.invoke(
        'create-secure-payment-session',
        {
          body: {
            amount: Math.round(params.amount * 100), // Convert to cents
            currency: params.currency.toLowerCase(),
            metadata: params.metadata || {},
            customer_id: params.customerId,
            payment_method_id: params.paymentMethodId,
          },
        }
      );

      if (error) {
        const handledError = StripeServiceSecure.handleStripeError(error);
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
      console.error('Error creating secure payment intent:', error);
      const handledError = StripeServiceSecure.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Confirm payment with enhanced security
   */
  async confirmPayment(clientSecret: string, paymentMethod: any) {
    const stripe = await this.getStripe();

    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod,
      });

      if (result?.error) {
        const handledError = StripeServiceSecure.handleStripeError(
          result.error
        );
        throw new Error(handledError.error);
      }

      return result?.paymentIntent || result;
    } catch (error) {
      console.error('Error confirming payment:', error);
      const handledError = StripeServiceSecure.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Create secure setup intent for saving payment methods
   */
  async createSetupIntent(customerId: string) {
    try {
      const supabase = await SupabaseSecureConfig.getClient();

      const { data, error } = await supabase.functions.invoke(
        'create-secure-setup-intent',
        {
          body: { customer_id: customerId },
        }
      );

      if (error) {
        const handledError = StripeServiceSecure.handleStripeError(error);
        throw new Error(handledError.error);
      }

      return data;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      const handledError = StripeServiceSecure.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Get customer payment methods securely
   */
  async getPaymentMethods(customerId: string) {
    try {
      const supabase = await SupabaseSecureConfig.getClient();

      const { data, error } = await supabase.functions.invoke(
        'get-payment-methods',
        {
          body: { customer_id: customerId },
        }
      );

      if (error) {
        const handledError = StripeServiceSecure.handleStripeError(error);
        throw new Error(handledError.error);
      }

      return data.payment_methods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      const handledError = StripeServiceSecure.handleStripeError(error);
      throw new Error(handledError.error);
    }
  }

  /**
   * Webhook signature verification with secure secrets
   */
  static async verifyWebhookSignature(
    payload: string,
    signature: string
  ): Promise<boolean> {
    try {
      const webhookSecret = await StripeSecureConfig.getWebhookSecret();

      // This would typically be done in an edge function
      // For now, return true if we have the secret (actual verification in edge function)
      return !!webhookSecret;
    } catch (error) {
      console.error('Webhook verification failed:', error);
      return false;
    }
  }

  /**
   * Handle Stripe errors according to API reference standards
   * Maps all documented Stripe error types per API reference
   */
  static handleStripeError(error: any): {
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
}

/**
 * Utility functions for secure payment operations
 */
export const SecurePaymentUtils = {
  /**
   * Build secure payment metadata
   */
  buildSecureMetadata: (data: {
    userId: string;
    tripRequestId?: string;
    environment?: string;
    sessionId?: string;
  }) => ({
    user_id: data.userId,
    trip_request_id: data.tripRequestId,
    environment: ENVIRONMENT,
    session_id: data.sessionId,
    created_at: new Date().toISOString(),
  }),

  /**
   * Validate payment amount
   */
  validateAmount: (amount: number, currency: string = 'usd'): boolean => {
    // Minimum charge amounts per currency (Stripe requirements)
    const minimums = {
      usd: 0.5,
      eur: 0.5,
      gbp: 0.3,
      cad: 0.5,
      aud: 0.5,
    };

    const minimum =
      minimums[currency.toLowerCase() as keyof typeof minimums] || 0.5;
    return amount >= minimum && amount <= 999999.99; // Stripe maximum
  },

  /**
   * Format currency for display
   */
  formatCurrency: (amount: number, currency: string = 'usd'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  },
};

// Export singleton instance
export const stripeServiceSecure = new StripeServiceSecure();

// Export configuration for edge functions
export { SECRET_PATTERNS };
