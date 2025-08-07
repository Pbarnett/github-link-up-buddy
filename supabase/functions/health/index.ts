import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  duration: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  checks: HealthCheck[];
  metrics: Record<string, number>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  const checks: HealthCheck[] = [];

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check 1: Database connectivity
    const dbCheckStart = Date.now();
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('count')
        .limit(1);
      
      checks.push({
        name: 'database',
        status: error ? 'unhealthy' : 'healthy',
        duration: Date.now() - dbCheckStart,
        error: error?.message,
        metadata: { rowCount: data?.length || 0 }
      });
    } catch (error) {
      checks.push({
        name: 'database',
        status: 'unhealthy',
        duration: Date.now() - dbCheckStart,
        error: error.message
      });
    }

    // Check 2: Feature flags system
    const flagCheckStart = Date.now();
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('name, enabled')
        .limit(5);
      
      checks.push({
        name: 'feature_flags',
        status: error ? 'unhealthy' : 'healthy',
        duration: Date.now() - flagCheckStart,
        error: error?.message,
        metadata: { flagCount: data?.length || 0 }
      });
    } catch (error) {
      checks.push({
        name: 'feature_flags',
        status: 'unhealthy',
        duration: Date.now() - flagCheckStart,
        error: error.message
      });
    }

    // Check 3: Memory usage
    const memoryCheckStart = Date.now();
    try {
      const memoryUsage = Deno.memoryUsage();
      const memoryMB = memoryUsage.rss / (1024 * 1024);
      
      checks.push({
        name: 'memory',
        status: memoryMB > 512 ? 'degraded' : 'healthy',
        duration: Date.now() - memoryCheckStart,
        metadata: { 
          rss: Math.round(memoryMB),
          heapUsed: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memoryUsage.heapTotal / (1024 * 1024))
        }
      });
    } catch (error) {
      checks.push({
        name: 'memory',
        status: 'unhealthy',
        duration: Date.now() - memoryCheckStart,
        error: error.message
      });
    }

    // Check 4: KMS connectivity (if configured)
    if (Deno.env.get('AWS_KMS_KEY_ID')) {
      const kmsCheckStart = Date.now();
      try {
        // Basic KMS connectivity check - just verify env vars are set
        const kmsKeyId = Deno.env.get('AWS_KMS_KEY_ID');
        const awsRegion = Deno.env.get('AWS_REGION');
        
        checks.push({
          name: 'kms',
          status: kmsKeyId && awsRegion ? 'healthy' : 'degraded',
          duration: Date.now() - kmsCheckStart,
          metadata: { 
            keyConfigured: !!kmsKeyId,
            regionConfigured: !!awsRegion
          }
        });
      } catch (error) {
        checks.push({
          name: 'kms',
          status: 'unhealthy',
          duration: Date.now() - kmsCheckStart,
          error: error.message
        });
      }
    }

    // Determine overall status
    const hasUnhealthy = checks.some(check => check.status === 'unhealthy');
    const hasDegraded = checks.some(check => check.status === 'degraded');
    const overallStatus = hasUnhealthy ? 'unhealthy' : hasDegraded ? 'degraded' : 'healthy';

    // Calculate metrics for Prometheus
    const totalDuration = Date.now() - startTime;
    const avgCheckDuration = checks.reduce((sum, check) => sum + check.duration, 0) / checks.length;
    
    const metrics = {
      health_check_duration_ms: totalDuration,
      health_check_average_duration_ms: Math.round(avgCheckDuration),
      health_checks_total: checks.length,
      health_checks_healthy: checks.filter(c => c.status === 'healthy').length,
      health_checks_degraded: checks.filter(c => c.status === 'degraded').length,
      health_checks_unhealthy: checks.filter(c => c.status === 'unhealthy').length,
      timestamp: Date.now(),
    };

    const response: HealthResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      checks,
      metrics,
    };

    // Handle different response formats
    const url = new URL(req.url);
    const format = url.searchParams.get('format');

    if (format === 'prometheus') {
      // Return Prometheus metrics format
      const prometheusMetrics = Object.entries(metrics)
        .map(([key, value]) => `pf_${key} ${value}`)
        .join('\n');
      
      return new Response(prometheusMetrics, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/plain; charset=utf-8' 
        }
      });
    }

    // Return JSON health check
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                       overallStatus === 'degraded' ? 200 : 503;

    return new Response(JSON.stringify(response, null, 2), {
      status: httpStatus,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    const errorResponse: HealthResponse = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      checks: [{
        name: 'system',
        status: 'unhealthy',
        duration: Date.now() - startTime,
        error: error.message
      }],
      metrics: {
        health_check_duration_ms: Date.now() - startTime,
        health_check_average_duration_ms: 0,
        health_checks_total: 1,
        health_checks_healthy: 0,
        health_checks_degraded: 0,
        health_checks_unhealthy: 1,
        timestamp: Date.now(),
      }
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
