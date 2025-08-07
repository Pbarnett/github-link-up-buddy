import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: string;
}

interface Alert {
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  labels?: Record<string, string>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname;

    // Health check endpoint
    if (req.method === 'GET' && path === '/') {
      return new Response(JSON.stringify({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Record metrics endpoint
    if (req.method === 'POST' && path === '/metrics') {
      const body = await req.json();
      const metrics: Metric[] = Array.isArray(body) ? body : [body];

      console.log(`Recording ${metrics.length} metrics`);

      for (const metric of metrics) {
        try {
          const { error } = await supabase.rpc('record_metric', {
            p_metric_name: metric.name,
            p_metric_value: metric.value,
            p_labels: metric.labels || {}
          });

          if (error) {
            console.error(`Failed to record metric ${metric.name}:`, error);
          }
        } catch (err) {
          console.error(`Error recording metric ${metric.name}:`, err);
        }
      }

      return new Response(JSON.stringify({ 
        status: 'recorded',
        count: metrics.length,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Trigger alert endpoint
    if (req.method === 'POST' && path === '/alerts') {
      const alert: Alert = await req.json();

      console.log(`Triggering alert: ${alert.name} (${alert.severity})`);

      const { error } = await supabase.rpc('trigger_alert', {
        p_alert_name: alert.name,
        p_severity: alert.severity,
        p_message: alert.message,
        p_labels: alert.labels || {}
      });

      if (error) {
        console.error(`Failed to trigger alert:`, error);
        return new Response(JSON.stringify({ 
          error: 'Failed to trigger alert',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        status: 'alert_triggered',
        alert: alert.name,
        severity: alert.severity,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get metrics endpoint
    if (req.method === 'GET' && path === '/metrics') {
      const timeRange = url.searchParams.get('range') || '1h';
      const metricName = url.searchParams.get('name');

      let query = supabase
        .from('auto_booking_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (metricName) {
        query = query.eq('metric_name', metricName);
      }

      // Add time range filter
      const now = new Date();
      let startTime = new Date();
      
      switch (timeRange) {
        case '5m':
          startTime.setMinutes(now.getMinutes() - 5);
          break;
        case '1h':
          startTime.setHours(now.getHours() - 1);
          break;
        case '24h':
          startTime.setHours(now.getHours() - 24);
          break;
        case '7d':
          startTime.setDate(now.getDate() - 7);
          break;
        default:
          startTime.setHours(now.getHours() - 1);
      }

      query = query.gte('timestamp', startTime.toISOString());

      const { data, error } = await query.limit(1000);

      if (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch metrics',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ 
        metrics: data,
        count: data?.length || 0,
        timeRange,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Auto-booking specific metrics endpoint
    if (req.method === 'GET' && path === '/auto-booking/health') {
      const { data: metrics, error } = await supabase
        .from('auto_booking_metrics')
        .select('*')
        .in('metric_name', [
          'auto_booking_success_rate',
          'auto_booking_requests_total',
          'auto_booking_duration_seconds',
          'auto_booking_payment_failures'
        ])
        .gte('timestamp', new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order('timestamp', { ascending: false });

      if (error) {
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch auto-booking health metrics',
          details: error.message 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Calculate health status
      const healthStatus = {
        healthy: true,
        timestamp: new Date().toISOString(),
        metrics: {},
        issues: [] as string[]
      };

      // Group metrics by name and get latest values
      const latestMetrics = (metrics || []).reduce((acc, metric) => {
        if (!acc[metric.metric_name] || new Date(metric.timestamp) > new Date(acc[metric.metric_name].timestamp)) {
          acc[metric.metric_name] = metric;
        }
        return acc;
      }, {} as Record<string, any>);

      // Check health thresholds
      const successRate = latestMetrics['auto_booking_success_rate'];
      if (successRate && successRate.metric_value < 95) {
        healthStatus.healthy = false;
        healthStatus.issues.push(`Low success rate: ${successRate.metric_value}%`);
      }

      const paymentFailures = latestMetrics['auto_booking_payment_failures'];
      if (paymentFailures && paymentFailures.metric_value > 5) {
        healthStatus.healthy = false;
        healthStatus.issues.push(`High payment failures: ${paymentFailures.metric_value}`);
      }

      healthStatus.metrics = latestMetrics;

      return new Response(JSON.stringify(healthStatus), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Not Found',
      availableEndpoints: [
        'GET / - Health check',
        'POST /metrics - Record metrics',
        'GET /metrics - Get metrics',
        'POST /alerts - Trigger alerts',
        'GET /auto-booking/health - Auto-booking health status'
      ]
    }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Metrics collector error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
