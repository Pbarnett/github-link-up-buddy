-- Advanced Batch Operations & Performance Monitoring Migration
-- Optimized for the flight search optimization and KMS improvements
-- Created: 2024-12-07

-- Enable advanced monitoring extensions
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_buffercache; -- For monitoring buffer cache efficiency

-- ============================================================================
-- BATCH OPERATION OPTIMIZED INDEXES
-- Supporting the new OptimizedDatabaseService batch operations
-- ============================================================================

-- Optimized index for batch trip request fetching (IN queries)
-- Supports: WHERE id IN (uuid1, uuid2, ...)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trip_requests_batch_fetch
ON trip_requests (id) 
INCLUDE (user_id, origin_location_code, destination_location_code, departure_date, return_date, adults, budget, nonstop_required);

COMMENT ON INDEX idx_trip_requests_batch_fetch IS 
'Optimized for batch fetching of trip requests with included columns to avoid table lookups';

-- Optimized compound index for existing offers check (batch operations)
-- Supports: WHERE trip_request_id = ? AND created_at >= ?
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_recent_batch
ON flight_offers_v2 (trip_request_id, created_at DESC) 
WHERE created_at > (NOW() - INTERVAL '2 hours');

COMMENT ON INDEX idx_flight_offers_v2_recent_batch IS 
'Partial index for recent flight offers, optimized for batch duplicate checking';

-- UPSERT optimization index for flight_offers_v2
-- Supports: ON CONFLICT (trip_request_id, external_offer_id)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_upsert_key
ON flight_offers_v2 (trip_request_id, external_offer_id) 
INCLUDE (price_total, created_at);

COMMENT ON INDEX idx_flight_offers_v2_upsert_key IS 
'Optimized for UPSERT operations in batch flight offer insertion';

-- ============================================================================
-- CACHING OPTIMIZATION INDEXES
-- Supporting request deduplication and cache queries
-- ============================================================================

-- GIN index for search patterns (supports cache key lookups)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_search_gin
ON flight_offers_v2 USING GIN (
  to_tsvector('simple', origin_iata || ' ' || destination_iata || ' ' || mode)
);

COMMENT ON INDEX idx_flight_offers_v2_search_gin IS 
'GIN index for complex flight search queries and cache key generation';

-- Composite index for cache invalidation queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_offers_v2_cache_invalidation
ON flight_offers_v2 (trip_request_id, created_at DESC, mode)
WHERE mode IN ('AUTO', 'BATCH_OPTIMIZED');

-- ============================================================================
-- PERFORMANCE MONITORING TABLES
-- For tracking our optimization effectiveness
-- ============================================================================

-- Performance metrics table for batch operations
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  operation_type TEXT NOT NULL, -- 'batch_insert', 'batch_fetch', 'cache_hit', etc.
  trip_request_id UUID,
  records_processed INTEGER NOT NULL DEFAULT 0,
  records_affected INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER NOT NULL,
  cache_hit BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance metrics queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_timestamp_type
ON performance_metrics (timestamp DESC, operation_type);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_trip_request
ON performance_metrics (trip_request_id, timestamp DESC)
WHERE trip_request_id IS NOT NULL;

-- Partial index for error tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_performance_metrics_errors
ON performance_metrics (timestamp DESC, operation_type)
WHERE error_message IS NOT NULL;

COMMENT ON TABLE performance_metrics IS 
'Tracks performance metrics for batch operations and cache effectiveness';

-- ============================================================================
-- QUERY PERFORMANCE MONITORING VIEWS
-- Real-time monitoring of our optimizations
-- ============================================================================

-- View for monitoring slow queries specific to flight search
CREATE OR REPLACE VIEW flight_search_slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  min_time,
  max_time,
  stddev_time,
  rows,
  CASE 
    WHEN query ILIKE '%trip_requests%' THEN 'trip_request_query'
    WHEN query ILIKE '%flight_offers_v2%' THEN 'flight_offers_query'
    WHEN query ILIKE '%batch%' OR query ILIKE '%IN (%' THEN 'batch_operation'
    ELSE 'other'
  END as query_type
FROM pg_stat_statements 
WHERE query ILIKE ANY(ARRAY['%trip_requests%', '%flight_offers_v2%', '%batch%'])
  AND mean_time > 50 -- Queries taking more than 50ms on average
ORDER BY mean_time DESC;

COMMENT ON VIEW flight_search_slow_queries IS 
'Monitors slow queries related to flight search operations for performance optimization';

-- View for batch operation efficiency
CREATE OR REPLACE VIEW batch_operation_metrics AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  operation_type,
  COUNT(*) as operation_count,
  AVG(records_processed) as avg_records_processed,
  AVG(records_affected) as avg_records_affected,
  AVG(duration_ms) as avg_duration_ms,
  AVG(CASE WHEN records_processed > 0 THEN records_affected::FLOAT / records_processed ELSE 0 END) as efficiency_ratio,
  COUNT(*) FILTER (WHERE cache_hit = true) as cache_hits,
  COUNT(*) FILTER (WHERE error_message IS NOT NULL) as error_count
FROM performance_metrics
WHERE timestamp >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', timestamp), operation_type
ORDER BY hour DESC, operation_type;

COMMENT ON VIEW batch_operation_metrics IS 
'Hourly performance metrics for batch operations showing efficiency and cache effectiveness';

-- View for cache hit ratio analysis
CREATE OR REPLACE VIEW cache_performance_summary AS
SELECT 
  DATE_TRUNC('day', timestamp) as day,
  operation_type,
  COUNT(*) as total_operations,
  COUNT(*) FILTER (WHERE cache_hit = true) as cache_hits,
  ROUND(
    (COUNT(*) FILTER (WHERE cache_hit = true)::FLOAT / COUNT(*)) * 100, 2
  ) as cache_hit_percentage,
  AVG(duration_ms) FILTER (WHERE cache_hit = true) as avg_cache_duration_ms,
  AVG(duration_ms) FILTER (WHERE cache_hit = false) as avg_miss_duration_ms
FROM performance_metrics
WHERE timestamp >= NOW() - INTERVAL '30 days'
  AND operation_type IN ('flight_search', 'trip_request_fetch')
GROUP BY DATE_TRUNC('day', timestamp), operation_type
ORDER BY day DESC, operation_type;

COMMENT ON VIEW cache_performance_summary IS 
'Daily cache performance summary showing hit ratios and performance impact';

-- ============================================================================
-- BATCH OPERATION HELPER FUNCTIONS
-- Supporting the optimized database service
-- ============================================================================

-- Function to log batch operation metrics (called from edge functions)
CREATE OR REPLACE FUNCTION log_batch_performance(
  p_operation_type TEXT,
  p_trip_request_id UUID DEFAULT NULL,
  p_records_processed INTEGER DEFAULT 0,
  p_records_affected INTEGER DEFAULT 0,
  p_duration_ms INTEGER DEFAULT 0,
  p_cache_hit BOOLEAN DEFAULT FALSE,
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_metric_id UUID;
BEGIN
  INSERT INTO performance_metrics (
    operation_type,
    trip_request_id,
    records_processed,
    records_affected,
    duration_ms,
    cache_hit,
    error_message,
    metadata
  ) VALUES (
    p_operation_type,
    p_trip_request_id,
    p_records_processed,
    p_records_affected,
    p_duration_ms,
    p_cache_hit,
    p_error_message,
    p_metadata
  ) RETURNING id INTO v_metric_id;
  
  RETURN v_metric_id;
END;
$$;

COMMENT ON FUNCTION log_batch_performance IS 
'Logs performance metrics for batch operations from edge functions';

-- Function to cleanup old performance metrics (prevent table bloat)
CREATE OR REPLACE FUNCTION cleanup_old_performance_metrics()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Keep only last 90 days of performance metrics
  DELETE FROM performance_metrics 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO performance_metrics (
    operation_type,
    records_affected,
    duration_ms,
    metadata
  ) VALUES (
    'cleanup_metrics',
    v_deleted_count,
    0,
    jsonb_build_object('deleted_records', v_deleted_count)
  );
  
  RETURN v_deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_performance_metrics IS 
'Cleanup function for performance metrics table to prevent unbounded growth';

-- ============================================================================
-- VACUUM AND MAINTENANCE OPTIMIZATION
-- Tuned for high-frequency batch operations
-- ============================================================================

-- Optimize autovacuum settings for performance_metrics table (high insert volume)
ALTER TABLE performance_metrics SET (
  autovacuum_vacuum_scale_factor = 0.05,    -- More frequent vacuuming
  autovacuum_analyze_scale_factor = 0.02,   -- More frequent statistics updates
  autovacuum_vacuum_cost_delay = 10,        -- Faster vacuum operations
  autovacuum_vacuum_cost_limit = 2000       -- Higher cost limit for faster cleanup
);

-- Optimize flight_offers_v2 for batch inserts
ALTER TABLE flight_offers_v2 SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05,
  fillfactor = 90  -- Leave 10% space for updates/upserts
);

-- Optimize trip_requests for batch reads
ALTER TABLE trip_requests SET (
  autovacuum_analyze_scale_factor = 0.05  -- Keep statistics current for batch queries
);

-- ============================================================================
-- PERFORMANCE ALERT FUNCTIONS
-- Monitoring critical performance thresholds
-- ============================================================================

-- Function to check if batch operations are performing within acceptable limits
CREATE OR REPLACE FUNCTION check_batch_performance_health()
RETURNS TABLE (
  metric_name TEXT,
  current_value NUMERIC,
  threshold_value NUMERIC,
  status TEXT,
  recommendation TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Cache hit ratio check (should be > 40%)
  RETURN QUERY
  SELECT 
    'cache_hit_ratio'::TEXT,
    COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE cache_hit = true)::FLOAT / COUNT(*)) * 100, 2
      ), 0
    ),
    40.0,
    CASE 
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE cache_hit = true)::FLOAT / COUNT(*)) * 100, 0
      ) >= 40 THEN 'HEALTHY'
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE cache_hit = true)::FLOAT / COUNT(*)) * 100, 0
      ) >= 20 THEN 'WARNING' 
      ELSE 'CRITICAL'
    END,
    CASE 
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE cache_hit = true)::FLOAT / COUNT(*)) * 100, 0
      ) < 40 THEN 'Increase cache TTL or check cache invalidation logic'
      ELSE 'Cache performance is healthy'
    END
  FROM performance_metrics
  WHERE timestamp >= NOW() - INTERVAL '1 hour'
    AND operation_type IN ('flight_search', 'trip_request_fetch');

  -- Average response time check (should be < 300ms)
  RETURN QUERY
  SELECT 
    'avg_response_time_ms'::TEXT,
    COALESCE(ROUND(AVG(duration_ms), 2), 0),
    300.0,
    CASE 
      WHEN COALESCE(AVG(duration_ms), 0) <= 300 THEN 'HEALTHY'
      WHEN COALESCE(AVG(duration_ms), 0) <= 500 THEN 'WARNING'
      ELSE 'CRITICAL'
    END,
    CASE 
      WHEN COALESCE(AVG(duration_ms), 0) > 300 THEN 'Consider database tuning or index optimization'
      ELSE 'Response time is healthy'
    END
  FROM performance_metrics
  WHERE timestamp >= NOW() - INTERVAL '1 hour';

  -- Error rate check (should be < 5%)
  RETURN QUERY
  SELECT 
    'error_rate_percentage'::TEXT,
    COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE error_message IS NOT NULL)::FLOAT / COUNT(*)) * 100, 2
      ), 0
    ),
    5.0,
    CASE 
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE error_message IS NOT NULL)::FLOAT / COUNT(*)) * 100, 0
      ) <= 5 THEN 'HEALTHY'
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE error_message IS NOT NULL)::FLOAT / COUNT(*)) * 100, 0
      ) <= 10 THEN 'WARNING'
      ELSE 'CRITICAL'
    END,
    CASE 
      WHEN COALESCE(
        (COUNT(*) FILTER (WHERE error_message IS NOT NULL)::FLOAT / COUNT(*)) * 100, 0
      ) > 5 THEN 'Investigate error patterns and implement fixes'
      ELSE 'Error rate is healthy'
    END
  FROM performance_metrics
  WHERE timestamp >= NOW() - INTERVAL '1 hour';
END;
$$;

COMMENT ON FUNCTION check_batch_performance_health IS 
'Health check function for batch operation performance metrics';

-- ============================================================================
-- SCHEDULED MAINTENANCE
-- Automated cleanup and maintenance tasks
-- ============================================================================

-- Create a function to be called by pg_cron for regular maintenance
CREATE OR REPLACE FUNCTION scheduled_performance_maintenance()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_cleanup_count INTEGER;
  v_result TEXT;
BEGIN
  -- Cleanup old performance metrics
  SELECT cleanup_old_performance_metrics() INTO v_cleanup_count;
  
  -- Update table statistics for better query planning
  ANALYZE trip_requests;
  ANALYZE flight_offers_v2;
  ANALYZE performance_metrics;
  
  -- Build result summary
  v_result := FORMAT(
    'Maintenance completed at %s. Cleaned up %s old performance records. Statistics updated.',
    NOW()::TEXT,
    v_cleanup_count
  );
  
  -- Log maintenance completion
  INSERT INTO performance_metrics (
    operation_type,
    records_affected,
    duration_ms,
    metadata
  ) VALUES (
    'scheduled_maintenance',
    v_cleanup_count,
    0,
    jsonb_build_object('maintenance_summary', v_result)
  );
  
  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION scheduled_performance_maintenance IS 
'Scheduled maintenance function for performance optimization tables and indexes';

-- ============================================================================
-- GRANT PERMISSIONS
-- Ensure edge functions can use performance logging
-- ============================================================================

-- Grant permissions for edge functions to log performance metrics
GRANT INSERT ON performance_metrics TO authenticated, service_role;
GRANT SELECT ON performance_metrics TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION log_batch_performance TO authenticated, service_role;

-- Grant permissions for monitoring views
GRANT SELECT ON flight_search_slow_queries TO authenticated, service_role;
GRANT SELECT ON batch_operation_metrics TO authenticated, service_role;
GRANT SELECT ON cache_performance_summary TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_batch_performance_health TO authenticated, service_role;

-- ============================================================================
-- COMPLETION LOG
-- ============================================================================

DO $$ 
BEGIN 
  RAISE NOTICE 'Advanced batch optimization migration completed successfully at %', NOW();
  RAISE NOTICE 'Created % new indexes for batch operations', 4;
  RAISE NOTICE 'Created performance_metrics table with monitoring views';
  RAISE NOTICE 'Configured automated maintenance and health check functions';
  RAISE NOTICE 'Ready for optimized flight search deployment';
END $$;
