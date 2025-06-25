// supabase/functions/lib/config.ts

// Feature flag for Stripe payment flow
// true: Use manual capture PaymentIntents (new flow)
// false: Use Stripe Checkout Sessions (old flow, for backward compatibility if needed)
export const USE_MANUAL_CAPTURE: boolean = true;

// Amadeus API Configuration
export const useMock = Deno.env.get("AMADEUS_LIVE") !== '1';
export const amadeusHost = Deno.env.get("AMADEUS_BASE_URL") ?? 'https://test.api.amadeus.com';

// Add other shared configuration variables here if any exist or are needed in the future.
// For example:
// export const DEFAULT_CURRENCY: string = 'usd';
