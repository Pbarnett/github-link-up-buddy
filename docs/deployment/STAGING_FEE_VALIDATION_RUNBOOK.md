# Staging Validation Runbook — Savings-Based Fee

Scope
- Validate end-to-end behavior of savings-based fee in staging: totals, metadata, DB persistence, UI panel.

Prereqs
- Deployed latest edge functions:
  - supabase/functions/create-booking-request
  - supabase/functions/create-payment-session
  - supabase/functions/stripe-webhook
- Stripe webhook endpoint configured to staging stripe-webhook function with STRIPE_WEBHOOK_SECRET.
- Migration applied: public.fee_metrics_daily (supabase/migrations/20250811214000_create_fee_metrics_view.sql)

Environment variables (staging)
- STRIPE_SECRET_KEY={{staging_stripe_key}}
- STRIPE_WEBHOOK_SECRET={{staging_webhook_secret}}
- SAVINGS_FEE_PCT=0.05
- APPLY_SAVINGS_FEE=true
- Optional caps (recommend initially):
  - SAVINGS_FEE_MIN_CENTS=99
  - SAVINGS_FEE_MAX_CENTS=1499

Phase A — Fee enabled
1) Book a test flight via UI (standard flow)
   - Choose a case where threshold (max_price/budget) > actual price to ensure fee applies.
2) Verify Stripe
   - Locate the PaymentIntent or Checkout Session.
   - Confirm amount = actual + fee.
   - Check metadata:
     - fee_model, threshold_price, actual_price, savings, fee_pct, fee_amount_cents
3) Verify DB
   - Run (Supabase SQL editor or psql):
     - select * from public.fee_metrics_daily order by day desc limit 14;
     - scripts/sql/fee_metrics_quickcheck.sql
   - Confirm booking_requests row has offer_data.fee_breakdown with the same fields above, and PI/Session ID.
4) Verify UI
   - On TripConfirm (post-checkout), confirm the "Booking Savings and Service Fee" panel shows savings and fee.

Phase B — Fee disabled
1) Set APPLY_SAVINGS_FEE=false in staging.
2) Repeat a test booking.
3) Verify Stripe
   - Amount = actual.
   - metadata.fee_amount_cents = 0 (or fee metadata may be minimal depending on flow).
4) Verify DB
   - Check fee_breakdown reflects zero fee or is omitted.

Notes / Tips
- Threshold source: trip_requests.max_price preferred; falls back to budget if available.
- Fee math: fee = pct * max(0, threshold - actual); rounded to cents; min/max caps applied if set.
- UI panel only displays if webhook wrote fee_breakdown into booking_requests.

Troubleshooting
- If webhook fails: check stripe-webhook logs and STRIPE_WEBHOOK_SECRET.
- If amounts don’t match: confirm SAVINGS_FEE_PCT and caps, and check the derived threshold in trip_requests.
- If UI panel not visible: confirm booking_requests.offer_data.fee_breakdown exists after payment.

Rollout
- Keep APPLY_SAVINGS_FEE as a kill switch.
- Consider adding a feature flag for gradual rollout (while retaining env kill switch).

Sign-off checklist
- [ ] Stripe totals and metadata correct (fee enabled)
- [ ] DB fee_breakdown present and accurate (fee enabled)
- [ ] TripConfirm fee panel present (fee enabled)
- [ ] Stripe totals fall back to actual, fee disabled scenario confirmed
- [ ] fee_metrics_daily shows recent data and reasonable fee_application_rate

