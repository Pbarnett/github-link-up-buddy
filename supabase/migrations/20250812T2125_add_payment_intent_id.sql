-- adds booking_requests.payment_intent_id and index (idempotent)
-- NOTE: keep idempotent to safely apply across envs

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'booking_requests'
      AND column_name  = 'payment_intent_id'
  ) THEN
    ALTER TABLE public.booking_requests
      ADD COLUMN payment_intent_id text;
  END IF;
END $$;

-- non-unique index for lookup; safe if duplicates exist in historical data
CREATE INDEX IF NOT EXISTS idx_booking_requests_payment_intent_id
  ON public.booking_requests (payment_intent_id);

