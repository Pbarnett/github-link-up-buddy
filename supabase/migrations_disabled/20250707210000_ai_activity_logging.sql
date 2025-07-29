-- AI Activity Logging Table for Warp AI Agent Orchestration
-- Implements the audit trail requirement from the Development Playbook

CREATE TABLE IF NOT EXISTS ai_activity (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  agent_id VARCHAR NOT NULL,
  action TEXT NOT NULL,
  result TEXT,
  human_approved BOOLEAN DEFAULT FALSE,
  task_context JSONB DEFAULT '{}',
  execution_duration_ms INTEGER,
  error_details TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_activity_timestamp ON ai_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_activity_agent_id ON ai_activity(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_activity_human_approved ON ai_activity(human_approved);
CREATE INDEX IF NOT EXISTS idx_ai_activity_user_id ON ai_activity(user_id);

-- Enable Row Level Security
ALTER TABLE ai_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Only service role and authenticated users can view their own activities
CREATE POLICY "Service role can manage AI activity logs"
  ON ai_activity
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Users can view their own AI activities"
  ON ai_activity FOR SELECT
  USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE ai_activity TO authenticated;
GRANT ALL ON SEQUENCE ai_activity_id_seq TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE ai_activity IS 'Audit trail for all AI agent actions performed via Warp Agent Mode';
COMMENT ON COLUMN ai_activity.agent_id IS 'Unique identifier for the AI agent performing the action';
COMMENT ON COLUMN ai_activity.action IS 'Description of the action performed by the AI agent';
COMMENT ON COLUMN ai_activity.result IS 'Result or outcome of the AI action';
COMMENT ON COLUMN ai_activity.human_approved IS 'Whether this action was approved by a human (for HITL gates)';
COMMENT ON COLUMN ai_activity.task_context IS 'JSON context about the task being performed';
COMMENT ON COLUMN ai_activity.execution_duration_ms IS 'Time taken to execute the action in milliseconds';
