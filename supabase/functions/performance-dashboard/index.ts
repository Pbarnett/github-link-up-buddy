/**
 * Performance Dashboard for Flight Search Optimization
 * Monitors and reports on key performance metrics
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PerformanceMetrics {
  queryReduction: {
    before: number;
    after: number;
    reductionPercentage: number;
  };
  responseTime: {
    average: number;
    p95: number;
    p99: number;
  };
  cacheMetrics: {
    hitRate: number;
    totalRequests: number;
    cacheHits: number;
  };
  errorRate: {
    total: number;
    successful: number;
    errorPercentage: number;
  };
  throughput: {
    requestsPerSecond: number;
    peakRps: number;
  };
}

interface DashboardResponse {
  timestamp: string;
  metrics: PerformanceMetrics;
  status: 'healthy' | 'warning' | 'critical';
  recommendations: string[];
  alerts: string[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const timeRange = url.searchParams.get('range') || '24h';
    const includeAlerts = url.searchParams.get('alerts') === 'true';

    // Calculate time range for queries
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }[timeRange] || 24 * 60 * 60 * 1000;

    const startTime = new Date(now.getTime() - timeRangeMs);

    // Query performance metrics from database
    const metrics = await gatherPerformanceMetrics(supabase, startTime, now);
    const alerts = includeAlerts ? await checkPerformanceAlerts(metrics) : [];
    const recommendations = generateRecommendations(metrics);
    const status = determineSystemHealth(metrics, alerts);

    const response: DashboardResponse = {
      timestamp: now.toISOString(),
      metrics,
      status,
      recommendations,
      alerts,
    };

    return new Response(JSON.stringify(response, null, 2), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate performance dashboard',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

/**
 * Gather performance metrics from database
 */
async function gatherPerformanceMetrics(
  supabase: any,
  startTime: Date,
  endTime: Date
): Promise<PerformanceMetrics> {
  
  // Query database performance logs (would need to be created)
  const performanceQuery = `
    SELECT 
      operation,
      duration,
      query_count,
      cache_hit,
      error_occurred,
      created_at
    FROM performance_logs 
    WHERE created_at BETWEEN $1 AND $2
    AND operation = 'flight_search_optimized'
    ORDER BY created_at DESC;
  `;

  // Simulated metrics (in production, these would come from actual database)
  const simulatedMetrics: PerformanceMetrics = {
    queryReduction: {
      before: 32, // Average N+1 queries
      after: 6,   // Batch optimized queries
      reductionPercentage: 81
    },
    responseTime: {
      average: 89,
      p95: 150,
      p99: 250
    },
    cacheMetrics: {
      hitRate: 47,
      totalRequests: 1000,
      cacheHits: 470
    },
    errorRate: {
      total: 1000,
      successful: 995,
      errorPercentage: 0.5
    },
    throughput: {
      requestsPerSecond: 25,
      peakRps: 45
    }
  };

  // In production, replace with actual database queries:
  /*
  const { data: performanceLogs } = await supabase.rpc('get_performance_metrics', {
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString()
  });
  
  // Process real data to calculate metrics
  const metrics = processPerformanceLogs(performanceLogs);
  */

  return simulatedMetrics;
}

/**
 * Check for performance alerts
 */
async function checkPerformanceAlerts(metrics: PerformanceMetrics): Promise<string[]> {
  const alerts: string[] = [];

  // Query reduction alert
  if (metrics.queryReduction.reductionPercentage < 70) {
    alerts.push(`⚠️ Query reduction below target: ${metrics.queryReduction.reductionPercentage}% (target: 85%)`);
  }

  // Response time alert
  if (metrics.responseTime.average > 200) {
    alerts.push(`🐌 High response time: ${metrics.responseTime.average}ms (target: <200ms)`);
  }

  // Cache hit rate alert
  if (metrics.cacheMetrics.hitRate < 40) {
    alerts.push(`💾 Low cache hit rate: ${metrics.cacheMetrics.hitRate}% (target: >40%)`);
  }

  // Error rate alert
  if (metrics.errorRate.errorPercentage > 1) {
    alerts.push(`❌ High error rate: ${metrics.errorRate.errorPercentage}% (target: <1%)`);
  }

  return alerts;
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.queryReduction.reductionPercentage < 85) {
    recommendations.push('Consider optimizing batch sizes or implementing additional query caching');
  }

  if (metrics.responseTime.average > 100) {
    recommendations.push('Investigate database query performance and consider connection pool tuning');
  }

  if (metrics.cacheMetrics.hitRate < 50) {
    recommendations.push('Review cache TTL settings and implement better cache key strategies');
  }

  if (metrics.throughput.requestsPerSecond < 20) {
    recommendations.push('Consider scaling edge function instances or optimizing processing logic');
  }

  if (recommendations.length === 0) {
    recommendations.push('System performing optimally - continue monitoring');
  }

  return recommendations;
}

/**
 * Determine overall system health
 */
function determineSystemHealth(metrics: PerformanceMetrics, alerts: string[]): 'healthy' | 'warning' | 'critical' {
  if (alerts.length === 0 && 
      metrics.queryReduction.reductionPercentage >= 80 &&
      metrics.responseTime.average < 150 &&
      metrics.errorRate.errorPercentage < 1) {
    return 'healthy';
  }
  
  if (alerts.length > 2 || 
      metrics.errorRate.errorPercentage > 5 ||
      metrics.responseTime.average > 500) {
    return 'critical';
  }
  
  return 'warning';
}

/**
 * Example SQL queries for production monitoring
 */
const MONITORING_QUERIES = {
  // Create performance logs table
  createTable: `
    CREATE TABLE IF NOT EXISTS performance_logs (
      id SERIAL PRIMARY KEY,
      operation VARCHAR(100) NOT NULL,
      duration DECIMAL(10,2) NOT NULL,
      query_count INTEGER NOT NULL,
      cache_hit BOOLEAN DEFAULT FALSE,
      error_occurred BOOLEAN DEFAULT FALSE,
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_performance_logs_operation_time 
    ON performance_logs(operation, created_at DESC);
  `,
  
  // Query optimization metrics
  queryMetrics: `
    SELECT 
      AVG(duration) as avg_duration,
      AVG(query_count) as avg_queries,
      COUNT(CASE WHEN cache_hit THEN 1 END)::float / COUNT(*) * 100 as cache_hit_rate,
      COUNT(CASE WHEN error_occurred THEN 1 END)::float / COUNT(*) * 100 as error_rate
    FROM performance_logs 
    WHERE operation = 'flight_search_optimized'
    AND created_at >= $1;
  `,
  
  // Hourly performance trends
  hourlyTrends: `
    SELECT 
      DATE_TRUNC('hour', created_at) as hour,
      COUNT(*) as requests,
      AVG(duration) as avg_duration,
      AVG(query_count) as avg_queries
    FROM performance_logs 
    WHERE operation = 'flight_search_optimized'
    AND created_at >= $1
    GROUP BY hour
    ORDER BY hour DESC;
  `
};

/* Usage example in production:

// Create dashboard endpoint
GET /functions/v1/performance-dashboard?range=24h&alerts=true

// Response format:
{
  "timestamp": "2024-08-07T04:11:41Z",
  "metrics": {
    "queryReduction": {
      "before": 32,
      "after": 6,
      "reductionPercentage": 81
    },
    "responseTime": {
      "average": 89,
      "p95": 150,
      "p99": 250
    },
    "cacheMetrics": {
      "hitRate": 47,
      "totalRequests": 1000,
      "cacheHits": 470
    }
  },
  "status": "healthy",
  "recommendations": ["System performing optimally"],
  "alerts": []
}
*/
