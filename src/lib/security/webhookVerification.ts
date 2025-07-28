import * as React from 'react';
/**
 * Webhook Signature Verification
 *
 * Provides secure webhook signature verification for Duffel and other
 * external service webhooks to prevent spoofing and ensure authenticity.
 */

/**
 * Verify Duffel webhook signature using HMAC-SHA256
 */
export async function verifyDuffelSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Remove any prefix from signature (e.g., "sha256=")
    const cleanSignature = signature.replace(/^sha256=/, '');

    // Create HMAC key from secret
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Sign the payload
    const computedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    );

    // Convert to hex string
    const computedHex = Array.from(new Uint8Array(computedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Use constant-time comparison to prevent timing attacks
    return constantTimeStringComparison(cleanSignature, computedHex);
  } catch (error) {
    console.error(
      '[WebhookVerification] Error verifying Duffel signature:',
      error
    );
    return false;
  }
}

/**
 * Verify Stripe webhook signature
 */
export async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300 // 5 minutes
): Promise<boolean> {
  try {
    // Parse Stripe signature header format: t=timestamp,v1=signature
    const elements = signature.split(',');
    const signatureData: { timestamp?: number; signatures: string[] } = {
      signatures: [],
    };

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        signatureData.timestamp = parseInt(value, 10);
      } else if (key.startsWith('v')) {
        signatureData.signatures.push(value);
      }
    }

    if (!signatureData.timestamp || signatureData.signatures.length === 0) {
      return false;
    }

    // Check timestamp tolerance
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - signatureData.timestamp) > tolerance) {
      console.warn(
        '[WebhookVerification] Stripe webhook timestamp outside tolerance'
      );
      return false;
    }

    // Create signed payload
    const signedPayload = `${signatureData.timestamp}.${payload}`;

    // Verify at least one signature matches
    for (const sig of signatureData.signatures) {
      const _isValid = await verifyHmacSha256(signedPayload, sig, secret);
      if (isValid) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(
      '[WebhookVerification] Error verifying Stripe signature:',
      error
    );
    return false;
  }
}

/**
 * Generic HMAC-SHA256 signature verification
 */
export async function verifyHmacSha256(
  payload: string,
  expectedSignature: string,
  secret: string
): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(payload)
    );

    const computedHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return constantTimeStringComparison(expectedSignature, computedHex);
  } catch (error) {
    console.error('[WebhookVerification] Error in HMAC verification:', error);
    return false;
  }
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeStringComparison(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Extract signature from various header formats
 */
export function extractSignatureFromHeader(
  header: string,
  provider: 'duffel' | 'stripe'
): string {
  if (!header) {
    throw new Error('Missing signature header');
  }

  switch (provider) {
    case 'duffel':
      // Duffel sends signature directly in header
      return header.trim();

    case 'stripe':
      // Stripe uses t=timestamp,v1=signature format - return as-is for parsing
      return header.trim();

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Webhook verification result interface
 */
export interface WebhookVerificationResult {
  isValid: boolean;
  error?: string;
  provider: string;
}

/**
 * Comprehensive webhook verification function
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  provider: 'duffel' | 'stripe',
  options: { tolerance?: number } = {}
): Promise<WebhookVerificationResult> {
  try {
    const extractedSignature = extractSignatureFromHeader(signature, provider);

    let isValid: boolean;

    switch (provider) {
      case 'duffel':
        isValid = await verifyDuffelSignature(
          payload,
          extractedSignature,
          secret
        );
        break;

      case 'stripe':
        isValid = await verifyStripeSignature(
          payload,
          extractedSignature,
          secret,
          options.tolerance
        );
        break;

      default:
        return {
          isValid: false,
          error: `Unsupported provider: ${provider}`,
          provider,
        };
    }

    return {
      isValid,
      provider,
      ...(isValid ? {} : { error: 'Signature verification failed' }),
    };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : 'Unknown verification error',
      provider,
    };
  }
}

/**
 * Middleware factory for webhook verification
 */
export function createWebhookVerificationMiddleware(
  getSecret: (provider: string) => string | undefined,
  provider: 'duffel' | 'stripe',
  options: { tolerance?: number } = {}
) {
  return async function verifyWebhook(
    payload: string,
    signature: string
  ): Promise<void> {
    const secret = getSecret(provider);

    if (!secret) {
      throw new Error(`Missing webhook secret for provider: ${provider}`);
    }

    const result = await verifyWebhookSignature(
      payload,
      signature,
      secret,
      provider,
      options
    );

    if (!result.isValid) {
      throw new Error(
        `Webhook verification failed: ${result.error || 'Invalid signature'}`
      );
    }

    console.log(
      `[WebhookVerification] Successfully verified ${provider} webhook`
    );
  };
}
