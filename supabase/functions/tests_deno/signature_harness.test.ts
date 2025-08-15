// Deno-native harness placeholder for validating Stripe.webhooks.constructEvent end-to-end.
// Skipped in Node CI; intended to run in a Deno test environment where Stripe SDK ESM is available.
// TODO: Implement with Deno.test and a minimal Request/Response shim invoking the Edge function directly.

import { describe, it } from 'vitest'

describe.skip('deno signature verification harness', () => {
  it('constructEvent verifies signed payload end-to-end in Deno runtime', () => {
    // Placeholder. Future: spin up a minimal Deno server or call the handler with a real signed payload.
  })
})
