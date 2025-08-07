#!/usr/bin/env -S npx tsx

/**
 * Auto-Booking Production Monitoring & Scaling Setup
 * 
 * This script configures comprehensive monitoring, alerting, and scaling
 * infrastructure for the auto-booking system deployment.
 */

import { createClient } from '@supabase/supabase-js';

interface MetricConfig {
  name: string;
  description: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  unit?: string;
  labels?: string[];
  alertThresholds?: {
    critical: number;
    warning: number;
    operator: 'gt' | 'lt' | 'eq';
  };
}

interface AlertConfig {
  name: string;
  description: string;
  condition: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  channels: string[];
  cooldown: string;
}

const AUTO_BOOKING_METRICS: MetricConfig[] = [
  {
    name: 'auto_booking_requests_total',
    description: 'Total number of auto-booking requests',
    type: 'counter',
    labels: ['status', 'airline', 'route_type'],
    alertThresholds: {
      critical: 1000,
      warning: 500,
      operator: 'gt'
    }
  },
  {
    name: 'auto_booking_success_rate',
    description: 'Success rate of auto-booking operations (percentage)',
    type: 'gauge',
    unit: 'percent',
    alertThresholds: {
      critical: 85,
      warning: 90,
      operator: 'lt'
    }
  },
  {
    name: 'auto_booking_duration_seconds',
    description: 'Duration of auto-booking operations',
    type: 'histogram',
    unit: 'seconds',
    labels: ['operation', 'status'],
    alertThresholds: {
      critical: 30,
      warning: 20,
      operator: 'gt'
    }
  },
  {
    name: 'auto_booking_payment_failures',
    description: 'Number of payment failures in auto-booking',
    type: 'counter',
    labels: ['payment_method', 'error_code'],
    alertThresholds: {
      critical: 10,
      warning: 5,
      operator: 'gt'
    }
  },
  {
    name: 'duffel_api_response_time',
    description: 'Duffel API response time',
    type: 'histogram',
    unit: 'milliseconds',
    labels: ['endpoint', 'status_code'],
    alertThresholds: {
      critical: 5000,
      warning: 3000,
      operator: 'gt'
    }
  },
  {
    name: 'duffel_api_rate_limit_remaining',
    description: 'Remaining Duffel API rate limit',
    type: 'gauge',
    alertThresholds: {
      critical: 10,
      warning: 50,
      operator: 'lt'
    }
  },
  {
    name: 'database_connection_pool_usage',
    description: 'Database connection pool usage percentage',
    type: 'gauge',
    unit: 'percent',
    alertThresholds: {
      critical: 90,
      warning: 75,
      operator: 'gt'
    }
  },
  {
    name: 'edge_function_cold_starts',
    description: 'Number of edge function cold starts',
    type: 'counter',
    labels: ['function_name', 'region'],
    alertThresholds: {
      warning: 100,
      critical: 200,
      operator: 'gt'
    }
  },
  {
    name: 'auto_booking_cost_per_transaction',
    description: 'Average cost per auto-booking transaction',
    type: 'gauge',
    unit: 'usd',
    labels: ['airline', 'route_type'],
    alertThresholds: {
      warning: 5.00,
      critical: 10.00,
      operator: 'gt'
    }
  }
];

const ALERT_CONFIGS: AlertConfig[] = [
  {
    name: 'AutoBooking High Failure Rate',
    description: 'Auto-booking success rate has dropped below acceptable threshold',
    condition: 'auto_booking_success_rate < 85',
    severity: 'critical',
    channels: ['slack-critical', 'pagerduty', 'email-oncall'],
    cooldown: '5m'
  },
  {
    name: 'AutoBooking Payment Failures Spike',
    description: 'Unusual spike in payment failures for auto-booking',
    condition: 'rate(auto_booking_payment_failures[5m]) > 5',
    severity: 'high',
    channels: ['slack-alerts', 'email-team'],
    cooldown: '10m'
  },
  {
    name: 'Duffel API Rate Limit Critical',
    description: 'Approaching Duffel API rate limits',
    condition: 'duffel_api_rate_limit_remaining < 10',
    severity: 'critical',
    channels: ['slack-critical', 'pagerduty'],
    cooldown: '1m'
  },
  {
    name: 'Edge Function Performance Degradation',
    description: 'Edge functions experiencing high latency',
    condition: 'auto_booking_duration_seconds{quantile="0.95"} > 20',
    severity: 'medium',
    channels: ['slack-alerts'],
    cooldown: '15m'
  },
  {
    name: 'Database Connection Pool Exhaustion',
    description: 'Database connection pool usage is critically high',
    condition: 'database_connection_pool_usage > 90',
    severity: 'critical',
    channels: ['slack-critical', 'pagerduty'],
    cooldown: '2m'
  },
  {
    name: 'Auto-Booking Cost Anomaly',
    description: 'Unusually high costs detected for auto-booking transactions',
    condition: 'auto_booking_cost_per_transaction > 10',
    severity: 'medium',
    channels: ['slack-alerts', 'email-finance'],
    cooldown: '30m'
  }
];

const DASHBOARD_PANELS = [
  {
    title: 'Auto-Booking Overview',
    panels: [
      {
        title: 'Success Rate',
        query: 'auto_booking_success_rate',
        type: 'stat',
        unit: 'percent'
      },
      {
        title: 'Request Volume',
        query: 'rate(auto_booking_requests_total[5m])',
        type: 'graph',
        unit: 'reqps'
      },
      {
        title: 'Response Time P95',
        query: 'histogram_quantile(0.95, auto_booking_duration_seconds_bucket)',
        type: 'graph',
        unit: 'seconds'
      },
      {
        title: 'Error Rate by Status',
        query: 'rate(auto_booking_requests_total{status!="success"}[5m])',
        type: 'graph',
        unit: 'reqps'
      }
    ]
  },
  {
    title: 'Duffel API Monitoring',
    panels: [
      {
        title: 'API Response Time',
        query: 'duffel_api_response_time',
        type: 'graph',
        unit: 'ms'
      },
      {
        title: 'Rate Limit Status',
        query: 'duffel_api_rate_limit_remaining',
        type: 'gauge'
      },
      {
        title: 'API Errors by Endpoint',
        query: 'rate(duffel_api_errors_total[5m]) by (endpoint)',
        type: 'graph'
      }
    ]
  },
  {
    title: 'Infrastructure Health',
    panels: [
      {
        title: 'Database Connections',
        query: 'database_connection_pool_usage',
        type: 'gauge',
        unit: 'percent'
      },
      {
        title: 'Edge Function Cold Starts',
        query: 'rate(edge_function_cold_starts[5m])',
        type: 'graph'
      },
      {
        title: 'Memory Usage',
        query: 'process_memory_usage_bytes',
        type: 'graph',
        unit: 'bytes'
      }
    ]
  },
  {
    title: 'Business Metrics',
    panels: [
      {
        title: 'Revenue Per Hour',
        query: 'sum(rate(auto_booking_revenue_total[1h]))',
        type: 'stat',
        unit: 'usd'
      },
      {
        title: 'Cost Per Transaction',
        query: 'auto_booking_cost_per_transaction',
        type: 'graph',
        unit: 'usd'
      },
      {
        title: 'Bookings by Airline',
        query: 'sum by (airline)(rate(auto_booking_requests_total{status="success"}[1h]))',
        type: 'pie'
      }
    ]
  }
];

class MonitoringManager {
  private supabaseUrl: string;
  private supabaseKey: string;
  private supabase: any;

  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!this.supabaseUrl || !this.supabaseKey) {
      console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
      process.exit(1);
    }

    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async setupMetricsTables(): Promise<boolean> {
    try {
      console.log('📊 Setting up metrics tables...');

      // Create metrics table for storing custom metrics
      const { error: metricsError } = await this.supabase.rpc('create_metrics_table', {
        sql: `
          CREATE TABLE IF NOT EXISTS auto_booking_metrics (
            id BIGSERIAL PRIMARY KEY,
            metric_name VARCHAR(255) NOT NULL,
            metric_value NUMERIC NOT NULL,
            labels JSONB DEFAULT '{}',
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            
            INDEX idx_metrics_name_timestamp (metric_name, timestamp),
            INDEX idx_metrics_labels (labels)
          );

          CREATE TABLE IF NOT EXISTS auto_booking_alerts (
            id BIGSERIAL PRIMARY KEY,
            alert_name VARCHAR(255) NOT NULL,
            severity VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            labels JSONB DEFAULT '{}',
            resolved_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            
            INDEX idx_alerts_created (created_at),
            INDEX idx_alerts_severity (severity)
          );

          CREATE OR REPLACE FUNCTION record_metric(
            p_metric_name VARCHAR(255),
            p_metric_value NUMERIC,
            p_labels JSONB DEFAULT '{}'
          ) RETURNS VOID AS $$
          BEGIN
            INSERT INTO auto_booking_metrics (metric_name, metric_value, labels)
            VALUES (p_metric_name, p_metric_value, p_labels);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;

          CREATE OR REPLACE FUNCTION trigger_alert(
            p_alert_name VARCHAR(255),
            p_severity VARCHAR(50),
            p_message TEXT,
            p_labels JSONB DEFAULT '{}'
          ) RETURNS VOID AS $$
          BEGIN
            INSERT INTO auto_booking_alerts (alert_name, severity, message, labels)
            VALUES (p_alert_name, p_severity, p_message, p_labels);
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `
      });

      if (metricsError) {
        console.error('❌ Failed to create metrics tables:', metricsError);
        return false;
      }

      console.log('✅ Metrics tables created successfully');
      return true;
    } catch (error) {
      console.error('❌ Error setting up metrics tables:', error);
      return false;
    }
  }

  async createAlertingRules(): Promise<boolean> {
    try {
      console.log('🚨 Setting up alerting rules...');

      for (const alertConfig of ALERT_CONFIGS) {
        const { error } = await this.supabase
          .from('alert_rules')
          .upsert({
            name: alertConfig.name,
            description: alertConfig.description,
            condition: alertConfig.condition,
            severity: alertConfig.severity,
            channels: alertConfig.channels,
            cooldown: alertConfig.cooldown,
            enabled: true
          }, {
            onConflict: 'name'
          });

        if (error) {
          console.error(`❌ Failed to create alert rule ${alertConfig.name}:`, error);
          return false;
        }

        console.log(`✅ Created alert rule: ${alertConfig.name}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error creating alerting rules:', error);
      return false;
    }
  }

  async setupDashboards(): Promise<boolean> {
    try {
      console.log('📈 Setting up monitoring dashboards...');

      const dashboardConfig = {
        name: 'Auto-Booking Production Dashboard',
        description: 'Comprehensive monitoring for auto-booking system',
        panels: DASHBOARD_PANELS,
        refresh_interval: '30s',
        time_range: '1h'
      };

      // Store dashboard configuration
      const { error } = await this.supabase
        .from('dashboards')
        .upsert(dashboardConfig, {
          onConflict: 'name'
        });

      if (error) {
        console.error('❌ Failed to create dashboard:', error);
        return false;
      }

      console.log('✅ Dashboard configuration saved');
      return true;
    } catch (error) {
      console.error('❌ Error setting up dashboards:', error);
      return false;
    }
  }

  async configureScaling(): Promise<boolean> {
    try {
      console.log('🔄 Configuring auto-scaling policies...');

      const scalingPolicies = [
        {
          resource: 'edge-functions',
          metric: 'auto_booking_requests_total',
          threshold: 100, // requests per minute
          scale_up: {
            instances: 2,
            cooldown: '5m'
          },
          scale_down: {
            instances: 1,
            cooldown: '10m'
          }
        },
        {
          resource: 'database-connections',
          metric: 'database_connection_pool_usage',
          threshold: 70, // percentage
          scale_up: {
            connections: 10,
            cooldown: '2m'
          },
          scale_down: {
            connections: 5,
            cooldown: '15m'
          }
        }
      ];

      for (const policy of scalingPolicies) {
        const { error } = await this.supabase
          .from('scaling_policies')
          .upsert(policy, {
            onConflict: 'resource'
          });

        if (error) {
          console.error(`❌ Failed to create scaling policy for ${policy.resource}:`, error);
          return false;
        }

        console.log(`✅ Created scaling policy for: ${policy.resource}`);
      }

      return true;
    } catch (error) {
      console.error('❌ Error configuring scaling:', error);
      return false;
    }
  }

  async installMetricsCollector(): Promise<boolean> {
    try {
      console.log('🔧 Installing metrics collection endpoints...');

      // Create edge function for metrics collection
      const metricsCollectorCode = `
        import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
        import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        serve(async (req) => {
          if (req.method === 'POST') {
            const metrics = await req.json();
            
            for (const metric of metrics) {
              await supabase.rpc('record_metric', {
                p_metric_name: metric.name,
                p_metric_value: metric.value,
                p_labels: metric.labels || {}
              });
            }

            return new Response(JSON.stringify({ status: 'recorded' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          // Health check endpoint
          if (req.method === 'GET') {
            return new Response(JSON.stringify({ 
              status: 'healthy',
              timestamp: new Date().toISOString()
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response('Method not allowed', { status: 405 });
        });
      `;

      // Store the metrics collector function code
      console.log('📝 Metrics collector code prepared for deployment');
      console.log('   Deploy to Supabase Edge Functions: supabase functions deploy metrics-collector');

      return true;
    } catch (error) {
      console.error('❌ Error installing metrics collector:', error);
      return false;
    }
  }

  async validateMonitoring(): Promise<boolean> {
    try {
      console.log('✅ Validating monitoring setup...');

      // Test metrics recording
      const testMetric = {
        name: 'monitoring_test',
        value: 1,
        labels: { test: 'validation' }
      };

      const { error: metricError } = await this.supabase.rpc('record_metric', {
        p_metric_name: testMetric.name,
        p_metric_value: testMetric.value,
        p_labels: testMetric.labels
      });

      if (metricError) {
        console.error('❌ Failed to record test metric:', metricError);
        return false;
      }

      // Test alert triggering
      const { error: alertError } = await this.supabase.rpc('trigger_alert', {
        p_alert_name: 'Test Alert',
        p_severity: 'low',
        p_message: 'Monitoring validation test',
        p_labels: { test: 'validation' }
      });

      if (alertError) {
        console.error('❌ Failed to trigger test alert:', alertError);
        return false;
      }

      console.log('✅ Monitoring validation successful');
      return true;
    } catch (error) {
      console.error('❌ Error validating monitoring:', error);
      return false;
    }
  }
}

// Performance benchmarks and SLAs
const PERFORMANCE_SLAS = {
  auto_booking_success_rate: '≥ 95%',
  auto_booking_response_time_p95: '≤ 15 seconds',
  duffel_api_response_time_p95: '≤ 3 seconds',
  system_uptime: '≥ 99.9%',
  data_consistency: '100%',
  cost_per_successful_booking: '≤ $2.50'
};

async function main() {
  console.log('🚀 Auto-Booking Monitoring & Scaling Setup\n');

  const monitoringManager = new MonitoringManager();

  console.log('📋 Setup Steps:');
  console.log('=====================================');
  
  // Step 1: Create metrics infrastructure
  const metricsSetup = await monitoringManager.setupMetricsTables();
  if (!metricsSetup) {
    console.error('\n❌ Failed to set up metrics tables');
    process.exit(1);
  }

  // Step 2: Configure alerting
  const alertingSetup = await monitoringManager.createAlertingRules();
  if (!alertingSetup) {
    console.error('\n❌ Failed to set up alerting rules');
    process.exit(1);
  }

  // Step 3: Create dashboards
  const dashboardsSetup = await monitoringManager.setupDashboards();
  if (!dashboardsSetup) {
    console.error('\n❌ Failed to set up dashboards');
    process.exit(1);
  }

  // Step 4: Configure scaling
  const scalingSetup = await monitoringManager.configureScaling();
  if (!scalingSetup) {
    console.error('\n❌ Failed to configure scaling');
    process.exit(1);
  }

  // Step 5: Install metrics collector
  const collectorSetup = await monitoringManager.installMetricsCollector();
  if (!collectorSetup) {
    console.error('\n❌ Failed to install metrics collector');
    process.exit(1);
  }

  // Step 6: Validate setup
  const validationSuccess = await monitoringManager.validateMonitoring();
  if (!validationSuccess) {
    console.error('\n❌ Monitoring validation failed');
    process.exit(1);
  }

  console.log('\n✅ Monitoring & Scaling Setup Complete!');
  console.log('\n📊 Key Metrics Tracked:');
  AUTO_BOOKING_METRICS.forEach(metric => {
    console.log(`   • ${metric.name}: ${metric.description}`);
  });

  console.log('\n🚨 Alert Rules Configured:');
  ALERT_CONFIGS.forEach(alert => {
    console.log(`   • ${alert.name} (${alert.severity})`);
  });

  console.log('\n🎯 Performance SLAs:');
  Object.entries(PERFORMANCE_SLAS).forEach(([metric, target]) => {
    console.log(`   • ${metric}: ${target}`);
  });

  console.log('\n🔧 Next Actions:');
  console.log('1. Deploy metrics-collector edge function');
  console.log('2. Configure notification channels (Slack, PagerDuty)');
  console.log('3. Set up external monitoring (Uptime Robot, Pingdom)');
  console.log('4. Review and adjust alert thresholds based on baseline');
  console.log('5. Schedule regular monitoring reviews');

  console.log('\n📈 Access your monitoring dashboard at:');
  console.log(`   ${process.env.SUPABASE_URL}/dashboard/monitoring`);
}

if (import.meta.main) {
  main().catch(console.error);
}

export { MonitoringManager, AUTO_BOOKING_METRICS, ALERT_CONFIGS, PERFORMANCE_SLAS };
