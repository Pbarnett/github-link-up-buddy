-- Create comprehensive audit trail system for booking state transitions
-- Addresses Gap #52: Audit-trail logs state transitions

-- 1. Create booking_audits table for comprehensive state tracking
CREATE TABLE IF NOT EXISTS public.booking_audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid, -- Can be flight_booking.id or booking_attempt.id
  booking_type text NOT NULL DEFAULT 'flight_booking', -- 'flight_booking', 'booking_attempt', 'trip_request'
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- State information
  previous_state text,
  new_state text NOT NULL,
  transition_type text NOT NULL, -- 'status_change', 'payment', 'booking', 'cancellation', 'refund'
  
  -- Context and metadata
  event_source text NOT NULL, -- 'auto_book_production', 'stripe_webhook', 'user_action', 'cron_job'
  correlation_id text, -- For tracing across services
  session_id text, -- User session if applicable
  
  -- Additional data
  metadata jsonb DEFAULT '{}', -- Flexible storage for context-specific data
  error_details jsonb, -- If transition was due to error
  
  -- Timing
  created_at timestamptz NOT NULL DEFAULT now(),
  event_timestamp timestamptz NOT NULL DEFAULT now(), -- When the actual event occurred
  
  -- Performance tracking
  processing_duration_ms integer, -- How long the transition took
  
  -- External references
  payment_intent_id text, -- Stripe PaymentIntent ID
  duffel_order_id text, -- Duffel order ID
  external_reference text -- Any other external system reference
);

-- 2. Enable RLS on audit table
ALTER TABLE public.booking_audits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own audit records" ON public.booking_audits
  FOR SELECT USING (user_id = auth.uid());

-- Service role has full access for system operations
CREATE POLICY "Service role full access" ON public.booking_audits
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS booking_audits_booking_id_idx ON public.booking_audits (booking_id);
CREATE INDEX IF NOT EXISTS booking_audits_user_id_idx ON public.booking_audits (user_id);
CREATE INDEX IF NOT EXISTS booking_audits_correlation_id_idx ON public.booking_audits (correlation_id) WHERE correlation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS booking_audits_event_timestamp_idx ON public.booking_audits (event_timestamp DESC);
CREATE INDEX IF NOT EXISTS booking_audits_transition_type_idx ON public.booking_audits (transition_type);
CREATE INDEX IF NOT EXISTS booking_audits_event_source_idx ON public.booking_audits (event_source);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS booking_audits_user_booking_time_idx 
  ON public.booking_audits (user_id, booking_id, event_timestamp DESC);

-- 4. Create function to log audit events
CREATE OR REPLACE FUNCTION log_booking_audit(
  p_booking_id uuid,
  p_booking_type text,
  p_user_id uuid,
  p_previous_state text,
  p_new_state text,
  p_transition_type text,
  p_event_source text,
  p_correlation_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}',
  p_error_details jsonb DEFAULT NULL,
  p_processing_duration_ms integer DEFAULT NULL,
  p_payment_intent_id text DEFAULT NULL,
  p_duffel_order_id text DEFAULT NULL,
  p_external_reference text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.booking_audits (
    booking_id,
    booking_type,
    user_id,
    previous_state,
    new_state,
    transition_type,
    event_source,
    correlation_id,
    metadata,
    error_details,
    processing_duration_ms,
    payment_intent_id,
    duffel_order_id,
    external_reference
  ) VALUES (
    p_booking_id,
    p_booking_type,
    p_user_id,
    p_previous_state,
    p_new_state,
    p_transition_type,
    p_event_source,
    p_correlation_id,
    p_metadata,
    p_error_details,
    p_processing_duration_ms,
    p_payment_intent_id,
    p_duffel_order_id,
    p_external_reference
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- 5. Create triggers to automatically log state changes
CREATE OR REPLACE FUNCTION trigger_log_flight_booking_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log state changes for flight_bookings
  IF TG_OP = 'INSERT' THEN
    PERFORM log_booking_audit(
      NEW.id,
      'flight_booking',
      NEW.user_id,
      NULL,
      NEW.status,
      'booking_created',
      'system',
      NULL,
      jsonb_build_object(
        'total_amount', NEW.total_amount,
        'currency', NEW.currency,
        'passenger_count', NEW.passenger_count,
        'offer_id', NEW.offer_id
      )
    );
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    -- Only log if status actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM log_booking_audit(
        NEW.id,
        'flight_booking',
        NEW.user_id,
        OLD.status,
        NEW.status,
        'status_change',
        'system',
        NULL,
        jsonb_build_object(
          'order_id', NEW.order_id,
          'booking_reference', NEW.booking_reference,
          'payment_intent_id', NEW.payment_intent_id,
          'failure_reason', NEW.failure_reason
        )
      );
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS flight_booking_audit_trigger ON public.flight_bookings;
CREATE TRIGGER flight_booking_audit_trigger
  AFTER INSERT OR UPDATE ON public.flight_bookings
  FOR EACH ROW EXECUTE FUNCTION trigger_log_flight_booking_audit();

-- 6. Create trigger for booking_attempts
CREATE OR REPLACE FUNCTION trigger_log_booking_attempt_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_user_id uuid;
BEGIN
  -- Get user_id from trip_request
  SELECT tr.user_id INTO attempt_user_id
  FROM public.trip_requests tr
  WHERE tr.id = COALESCE(NEW.trip_request_id, OLD.trip_request_id);

  IF TG_OP = 'INSERT' THEN
    PERFORM log_booking_audit(
      NEW.id,
      'booking_attempt',
      attempt_user_id,
      NULL,
      NEW.status,
      'attempt_created',
      'auto_book_production',
      NULL,
      jsonb_build_object(
        'idempotency_key', NEW.idempotency_key,
        'offer_id', NEW.offer_id
      )
    );
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      PERFORM log_booking_audit(
        NEW.id,
        'booking_attempt',
        attempt_user_id,
        OLD.status,
        NEW.status,
        'attempt_status_change',
        'auto_book_production',
        NULL,
        jsonb_build_object(
          'error_message', NEW.error_message,
          'finished_at', NEW.finished_at
        ),
        CASE WHEN NEW.error_message IS NOT NULL THEN
          jsonb_build_object('error', NEW.error_message)
        ELSE NULL END
      );
    END IF;
    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS booking_attempt_audit_trigger ON public.booking_attempts;
CREATE TRIGGER booking_attempt_audit_trigger
  AFTER INSERT OR UPDATE ON public.booking_attempts
  FOR EACH ROW EXECUTE FUNCTION trigger_log_booking_attempt_audit();

-- 7. Create views for common audit queries
CREATE OR REPLACE VIEW booking_audit_summary AS
SELECT 
  ba.booking_id,
  ba.booking_type,
  ba.user_id,
  ba.new_state as current_state,
  ba.transition_type,
  ba.event_source,
  ba.created_at,
  ba.correlation_id,
  ba.metadata,
  ba.payment_intent_id,
  ba.duffel_order_id,
  -- Identify the latest state for each booking
  ROW_NUMBER() OVER (PARTITION BY ba.booking_id, ba.booking_type ORDER BY ba.event_timestamp DESC) as recency_rank
FROM public.booking_audits ba
ORDER BY ba.event_timestamp DESC;

-- View for booking state transitions timeline
CREATE OR REPLACE VIEW booking_state_timeline AS
SELECT 
  ba.booking_id,
  ba.booking_type,
  ba.user_id,
  ba.previous_state,
  ba.new_state,
  ba.transition_type,
  ba.event_source,
  ba.event_timestamp,
  ba.correlation_id,
  ba.processing_duration_ms,
  -- Calculate time between state changes
  LAG(ba.event_timestamp) OVER (
    PARTITION BY ba.booking_id, ba.booking_type 
    ORDER BY ba.event_timestamp
  ) as previous_event_time,
  ba.event_timestamp - LAG(ba.event_timestamp) OVER (
    PARTITION BY ba.booking_id, ba.booking_type 
    ORDER BY ba.event_timestamp
  ) as time_in_previous_state
FROM public.booking_audits ba
ORDER BY ba.booking_id, ba.event_timestamp;

-- 8. Grant permissions
GRANT SELECT ON public.booking_audits TO authenticated;
GRANT SELECT ON booking_audit_summary TO authenticated;
GRANT SELECT ON booking_state_timeline TO authenticated;
GRANT EXECUTE ON FUNCTION log_booking_audit TO service_role;

-- 9. Comments for documentation
COMMENT ON TABLE public.booking_audits IS 'Comprehensive audit trail for all booking state transitions';
COMMENT ON FUNCTION log_booking_audit IS 'Function to manually log booking audit events with full context';
COMMENT ON VIEW booking_audit_summary IS 'Latest state summary for all bookings with audit context';
COMMENT ON VIEW booking_state_timeline IS 'Complete timeline of state transitions with duration analysis';

-- 10. Log successful migration
INSERT INTO public.system_logs (
  operation,
  message,
  metadata,
  created_at
)
VALUES (
  'migration_booking_audit_trail',
  'Successfully created booking audit trail system',
  jsonb_build_object(
    'tables_created', 1,
    'functions_created', 3,
    'triggers_created', 2,
    'views_created', 2,
    'migration_time', NOW()
  ),
  NOW()
);
