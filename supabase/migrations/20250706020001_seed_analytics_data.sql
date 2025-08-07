-- Seed analytics data for testing the dashboard
-- This creates sample form analytics data to demonstrate the dashboard

-- Insert test analytics data for the last 30 days
INSERT INTO form_completion_analytics (
  form_name,
  total_views,
  total_submissions,
  date
) VALUES 
  -- Parker Flight Search form data
  ('Parker Flight Search', 150, 89, CURRENT_DATE - INTERVAL '1 day'),
  ('Parker Flight Search', 132, 78, CURRENT_DATE - INTERVAL '2 days'),
  ('Parker Flight Search', 168, 95, CURRENT_DATE - INTERVAL '3 days'),
  ('Parker Flight Search', 143, 82, CURRENT_DATE - INTERVAL '4 days'),
  ('Parker Flight Search', 157, 91, CURRENT_DATE - INTERVAL '5 days'),
  ('Parker Flight Search', 139, 76, CURRENT_DATE - INTERVAL '6 days'),
  ('Parker Flight Search', 171, 98, CURRENT_DATE - INTERVAL '7 days'),
  
  -- Contact form data (lower completion rate)
  ('Contact Form', 89, 23, CURRENT_DATE - INTERVAL '1 day'),
  ('Contact Form', 76, 19, CURRENT_DATE - INTERVAL '2 days'),
  ('Contact Form', 92, 28, CURRENT_DATE - INTERVAL '3 days'),
  ('Contact Form', 81, 21, CURRENT_DATE - INTERVAL '4 days'),
  ('Contact Form', 88, 24, CURRENT_DATE - INTERVAL '5 days'),
  ('Contact Form', 73, 17, CURRENT_DATE - INTERVAL '6 days'),
  ('Contact Form', 95, 31, CURRENT_DATE - INTERVAL '7 days'),
  
  -- Newsletter signup (high completion rate)
  ('Newsletter Signup', 45, 41, CURRENT_DATE - INTERVAL '1 day'),
  ('Newsletter Signup', 52, 48, CURRENT_DATE - INTERVAL '2 days'),
  ('Newsletter Signup', 39, 36, CURRENT_DATE - INTERVAL '3 days'),
  ('Newsletter Signup', 47, 43, CURRENT_DATE - INTERVAL '4 days'),
  ('Newsletter Signup', 51, 47, CURRENT_DATE - INTERVAL '5 days'),
  ('Newsletter Signup', 44, 40, CURRENT_DATE - INTERVAL '6 days'),
  ('Newsletter Signup', 49, 45, CURRENT_DATE - INTERVAL '7 days'),
  
  -- Trip Preferences form (medium completion rate)
  ('Trip Preferences', 67, 42, CURRENT_DATE - INTERVAL '1 day'),
  ('Trip Preferences', 71, 45, CURRENT_DATE - INTERVAL '2 days'),
  ('Trip Preferences', 58, 35, CURRENT_DATE - INTERVAL '3 days'),
  ('Trip Preferences', 64, 39, CURRENT_DATE - INTERVAL '4 days'),
  ('Trip Preferences', 69, 43, CURRENT_DATE - INTERVAL '5 days'),
  ('Trip Preferences', 61, 37, CURRENT_DATE - INTERVAL '6 days'),
  ('Trip Preferences', 73, 47, CURRENT_DATE - INTERVAL '7 days');

-- Insert some recent analytics events for today
INSERT INTO form_analytics_events (
  form_name,
  form_version,
  session_id,
  event_type,
  timestamp_ms,
  user_agent,
  created_at
) VALUES 
  ('Parker Flight Search', 1, 'sess_001', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '2 hours')) * 1000, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '2 hours'),
  ('Parker Flight Search', 1, 'sess_002', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1.5 hours')) * 1000, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW() - INTERVAL '1.5 hours'),
  ('Parker Flight Search', 1, 'sess_003', 'submit', EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 hour')) * 1000, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '1 hour'),
  ('Contact Form', 1, 'sess_004', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '45 minutes')) * 1000, 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', NOW() - INTERVAL '45 minutes'),
  ('Newsletter Signup', 1, 'sess_005', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '30 minutes')) * 1000, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '30 minutes'),
  ('Newsletter Signup', 1, 'sess_006', 'submit', EXTRACT(EPOCH FROM (NOW() - INTERVAL '25 minutes')) * 1000, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '25 minutes'),
  ('Trip Preferences', 1, 'sess_007', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '15 minutes')) * 1000, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW() - INTERVAL '15 minutes'),
  ('Parker Flight Search', 1, 'sess_008', 'view', EXTRACT(EPOCH FROM (NOW() - INTERVAL '10 minutes')) * 1000, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '10 minutes');
