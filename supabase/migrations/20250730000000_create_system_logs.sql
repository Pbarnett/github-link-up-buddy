-- Create system_logs table for application logging
-- This table supports audit trails and system monitoring

CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operation text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  level text DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error', 'critical')),
  user_id uuid REFERENCES auth.users(id),
  correlation_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Service role has full access for logging
CREATE POLICY "Service role full access" ON public.system_logs
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (true);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS system_logs_operation_idx ON public.system_logs (operation);
CREATE INDEX IF NOT EXISTS system_logs_level_idx ON public.system_logs (level);
CREATE INDEX IF NOT EXISTS system_logs_created_at_idx ON public.system_logs (created_at);
CREATE INDEX IF NOT EXISTS system_logs_user_id_idx ON public.system_logs (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS system_logs_correlation_id_idx ON public.system_logs (correlation_id) WHERE correlation_id IS NOT NULL;

-- Comments for documentation
COMMENT ON TABLE public.system_logs IS 'System-wide logging table for audit trails and monitoring';
COMMENT ON COLUMN public.system_logs.operation IS 'Type of operation being logged';
COMMENT ON COLUMN public.system_logs.metadata IS 'Additional structured data for the log entry';
COMMENT ON COLUMN public.system_logs.level IS 'Log level: debug|info|warn|error|critical';
COMMENT ON COLUMN public.system_logs.correlation_id IS 'Correlation ID for tracking related operations';
