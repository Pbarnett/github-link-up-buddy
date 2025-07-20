/**
 * Secure Stripe Payment Session Creation
 * 
 * This edge function creates payment sessions using AWS Secrets Manager
 * for all sensitive credentials, following enterprise security practices.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// AWS SDK imports for Deno
import { KMSClient, EncryptCommand, DecryptCommand } from "https://esm.sh/@aws-sdk/client-kms@3.454.0";
import { SecretsManagerClient, GetSecretValueCommand } from "https://esm.sh/@aws-sdk/client-secrets-manager@3.454.0";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
};

// Environment configuration
const ENVIRONMENT = Deno.env.get("ENVIRONMENT") || "development";
const AWS_REGION = Deno.env.get("AWS_REGION") || "us-west-2";

// Secret patterns
const SECRET_PATTERNS = {
  stripe: {
    secretKey: `${ENVIRONMENT}/payments/stripe-secret-key`,
    webhookSecret: `${ENVIRONMENT}/payments/stripe-webhook-secret`,
  },
  supabase: {
    url: `${ENVIRONMENT}/database/supabase-url`,
    serviceKey: `${ENVIRONMENT}/database/supabase-service-key`,
  }
};

/**
 * Secure AWS Secrets Manager Client
 */
class SecureSecretsManager {
  private static secretsClient: SecretsManagerClient | null = null;
  private static secretCache = new Map<string, { value: string; expiry: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getClient(): SecretsManagerClient {
    if (!this.secretsClient) {
      // Use IAM roles for authentication in production
      this.secretsClient = new SecretsManagerClient({
        region: AWS_REGION,
        // Credentials will be automatically obtained from:
        // 1. IAM roles (preferred in production)
        // 2. Environment variables (development)
        // 3. Instance metadata (EC2/ECS)
      });
    }
    return this.secretsClient;
  }

  static async getSecret(secretId: string): Promise<string> {
    // Check cache first
    const cached = this.secretCache.get(secretId);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    try {
      const client = this.getClient();
      const command = new GetSecretValueCommand({ SecretId: secretId });
      const response = await client.send(command);

      if (!response.SecretString) {
        throw new Error(`Secret ${secretId} not found or is empty`);
      }

      // Cache the secret
      this.secretCache.set(secretId, {
        value: response.SecretString,
        expiry: Date.now() + this.CACHE_TTL
      });

      return response.SecretString;
    } catch (error) {
      console.error(`Failed to retrieve secret ${secretId}:`, error);
      throw new Error(`Unable to retrieve secret: ${secretId}`);
    }
  }

  static clearCache(): void {
    this.secretCache.clear();
  }
}

/**
 * Secure Configuration Manager
 */
class SecureConfig {
  private static stripeClient: Stripe | null = null;
  private static supabaseClient: any = null;

  static async getStripeClient(): Promise<Stripe> {
    if (!this.stripeClient) {
      const secretKey = await SecureSecretsManager.getSecret(SECRET_PATTERNS.stripe.secretKey);
      
      if (!secretKey.startsWith('sk_')) {
        throw new Error('Invalid Stripe secret key format');
      }

      this.stripeClient = new Stripe(secretKey, {
        apiVersion: "2023-10-16",
        typescript: true,
      });
    }
    return this.stripeClient;
  }

  static async getSupabaseClient() {
    if (!this.supabaseClient) {
      const [url, serviceKey] = await Promise.all([
        SecureSecretsManager.getSecret(SECRET_PATTERNS.supabase.url),
        SecureSecretsManager.getSecret(SECRET_PATTERNS.supabase.serviceKey)
      ]);

      this.supabaseClient = createClient(url, serviceKey);
    }
    return this.supabaseClient;
  }
}

/**
 * Enhanced error handling for payments
 */
function handlePaymentError(error: any): {
  error: string;
  retryable: boolean;
  errorType: string;
} {
  console.error('Payment error:', error);

  if (error?.type) {
    switch (error.type) {
      case 'card_error':
        return {
          error: error.message || 'Card was declined',
          retryable: false,
          errorType: 'card_error'
        };
      case 'rate_limit_error':
        return {
          error: 'Too many requests. Please try again shortly.',
          retryable: true,
          errorType: 'rate_limit_error'
        };
      case 'api_error':
        return {
          error: 'Payment processing temporarily unavailable',
          retryable: true,
          errorType: 'api_error'
        };
      default:
        return {
          error: error.message || 'Payment processing failed',
          retryable: false,
          errorType: 'unknown_error'
        };
    }
  }

  return {
    error: error.message || 'An unexpected error occurred',
    retryable: false,
    errorType: 'generic_error'
  };
}

/**
 * Main edge function handler
 */
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabase = await SecureConfig.getSupabaseClient();
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error(userError?.message || "User not authenticated");
    }

    // Parse request body
    const {
      amount,
      currency = 'usd',
      metadata = {},
      customer_id,
      payment_method_id
    } = await req.json();

    // Validate amount
    if (!amount || amount < 50) { // Minimum 50 cents
      throw new Error("Invalid amount: minimum 50 cents required");
    }

    if (amount > 99999999) { // Maximum amount
      throw new Error("Invalid amount: exceeds maximum allowed");
    }

    console.log(`Creating secure payment intent for user: ${user.id}, amount: ${amount}`);

    // Get Stripe client with secure credentials
    const stripe = await SecureConfig.getStripeClient();

    // Enhanced metadata with security context
    const secureMetadata = {
      user_id: user.id,
      environment: ENVIRONMENT,
      created_via: 'secure_edge_function',
      timestamp: new Date().toISOString(),
      ...metadata
    };

    // Create payment intent with enhanced security
    const paymentIntentParams: any = {
      amount,
      currency: currency.toLowerCase(),
      metadata: secureMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // Add customer if provided
    if (customer_id) {
      paymentIntentParams.customer = customer_id;
    }

    // Add payment method if provided
    if (payment_method_id) {
      paymentIntentParams.payment_method = payment_method_id;
      paymentIntentParams.confirmation_method = 'manual';
      paymentIntentParams.confirm = true;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

    // Log successful payment intent creation
    console.log(`Payment intent created: ${paymentIntent.id}`);

    // Store payment record securely
    const { error: dbError } = await supabase
      .from("secure_payments")
      .insert({
        user_id: user.id,
        payment_intent_id: paymentIntent.id,
        amount: amount / 100, // Store in dollars
        currency: currency,
        status: paymentIntent.status,
        metadata: secureMetadata,
        created_at: new Date().toISOString()
      });

    if (dbError) {
      console.error("Error storing payment record:", dbError);
      // Don't fail the payment creation, just log the error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    const handledError = handlePaymentError(error);
    
    return new Response(
      JSON.stringify({
        error: handledError.error,
        retryable: handledError.retryable,
        errorType: handledError.errorType
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
