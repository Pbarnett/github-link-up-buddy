import { describe, it, expect } from 'vitest';
import { handleStripeWebhook } from '../stripe-webhook/index.ts';

function makeRequest(body: any, headers: Record<string, string>) {
  return new Request('http://localhost/stripe-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

// Skipped in Node due to https ESM import limitation when importing Edge (Deno) module.
// Follow-up: move to a Deno-compatible harness or mock esm.sh Stripe import.
describe.skip('stripe-webhook signature verification (skipped under Node harness)', () => {
  it('returns 400 when signature is missing or invalid', async () => {
    const req = makeRequest({ type: 'checkout.session.completed' }, { /* no Stripe-Signature */ });
    const res = await handleStripeWebhook(req as any);
    expect(res.status).toBe(400);
    const payload = await res.json();
    expect(payload.error).toBeDefined();
  });
});
