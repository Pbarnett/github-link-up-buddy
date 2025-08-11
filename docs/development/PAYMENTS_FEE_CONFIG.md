# Payments Fee Configuration

Purpose
- Introduces a savings-based fee on bookings: fee = SAVINGS_FEE_PCT * max(0, threshold_price - actual_price).
- Threshold is derived from trip_requests: prefers max_price; falls back to budget.

Where it runs
- Edge functions:
  - supabase/functions/create-booking-request/index.ts (PaymentIntent or Checkout Session)
  - supabase/functions/create-payment-session/index.ts (Checkout Session)
  - supabase/functions/stripe-webhook/index.ts (persists fee breakdown to booking_requests.offer_data)
  - Helper: supabase/functions/lib/fees.ts

Configuration
- SAVINGS_FEE_PCT (string => float in [0,1])
  - Default: 0.05 (5%) if not set
  - Example values: "0.03" for 3%, "0" to disable
- STRIPE_WEBHOOK_SECRET must be set for the stripe-webhook function.
- Optional fee caps (in cents):
  - SAVINGS_FEE_MIN_CENTS (e.g., 99)
  - SAVINGS_FEE_MAX_CENTS (e.g., 1499)

Computation rules
- threshold_price = trip_requests.max_price if present and > 0, else trip_requests.budget if > 0, else undefined
- savings = max(0, threshold_price - actual_price)
- fee_major = savings * SAVINGS_FEE_PCT
- fee_cents = round(fee_major * 100)
- Apply optional min/max caps: fee_cents = clamp(fee_cents, SAVINGS_FEE_MIN_CENTS, SAVINGS_FEE_MAX_CENTS) if set
- total_cents = round(actual_price * 100) + fee_cents

Stripe metadata (strings)
- fee_model: "savings-based"
- threshold_price: threshold in major units if available
- actual_price: actual offer price in major units
- savings: computed savings in major units
- fee_pct: decimal (e.g., 0.05)
- fee_amount_cents: integer cents of the fee
- booking_request_id: present on PaymentIntent path (manual capture)
- For Checkout Sessions, order_id in metadata corresponds to booking_request_id

Persistence
- Webhook writes fee_breakdown into booking_requests.offer_data:
  - fee_model, threshold_price, actual_price, savings, fee_pct, fee_amount_cents
  - payment_intent_id or checkout_session_id
  - updated_at timestamp

Staging validation playbook
1) Enable fee (APPLY_SAVINGS_FEE=true, SAVINGS_FEE_PCT=0.05). Book a test flight.
   - Confirm Stripe total = actual + fee and metadata present
   - booking_requests.offer_data.fee_breakdown exists post-webhook
   - TripConfirm page shows the fee panel
2) Disable fee (APPLY_SAVINGS_FEE=false). Repeat; fee should be 0 and total should equal actual.

Observability recommendations
- Create a dashboard panel summing fee_amount_cents across booking_requests.offer_data.fee_breakdown.
- Emit additional logs if needed during computation.

Testing
- Unit tests in supabase/functions/lib/fees.test.ts cover core math and env override.
- Integration tests in supabase/functions/tests/create-booking-request.fee.test.ts verify amount and metadata for both flows.
- Disabled-flag edge-integration tests are currently skipped due to Node/Vitest vs Deno Edge ESM differences:
  - supabase/functions/tests/create-booking-request.fee-disabled.test.ts
  - supabase/functions/tests/create-payment-session.fee-disabled.test.ts
  - Validate flag behavior in staging using the playbook below.

