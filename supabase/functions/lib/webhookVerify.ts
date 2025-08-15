// Pure helper to verify Stripe webhook signatures without importing network ESM modules.
// The caller injects Stripe's constructEvent function at runtime (in Edge) or a mock in tests.

export type ConstructEventFn = (payload: string | Uint8Array, signature: string, secret: string) => any;

export interface VerifyResult {
  valid: boolean;
  event?: any;
  error?: string;
}

export function verifyStripeSignature(
  payload: string | Uint8Array,
  signature: string | null,
  secret: string | undefined,
  constructEvent: ConstructEventFn
): VerifyResult {
  if (!signature || !secret) {
    return { valid: false, error: 'Missing signature or webhook secret' };
  }
  try {
    const event = constructEvent(payload, signature, secret);
    return { valid: true, event };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return { valid: false, error: message };
  }
}
