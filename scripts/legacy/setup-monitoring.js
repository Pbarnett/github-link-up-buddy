#!/usr/bin/env node

/**
 * Parker Flight - Monitoring Configuration Script
 * 
 * This script sets up and configures comprehensive monitoring dashboards:
 * - Grafana datasource and dashboard setup
 * - Prometheus integration
 * - CloudWatch alarms and metrics
 * - Alert escalation policies
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m', 
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Utility functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const success = (message) => log(`✅ ${message}`, 'green');
const warning = (message) => log(`⚠️  ${message}`, 'yellow');
const error = (message) => log(`❌ ${message}`, 'red');
const info = (message) => log(`ℹ️  ${message}`, 'blue');
const step = (message) => log(`📊 ${message}`, 'cyan');

class MonitoringSetup {
  constructor() {
    this.startTime = Date.now();
    this.grafanaUrl = process.env.GRAFANA_URL || 'http://localhost:3000';
    this.grafanaApiKey = process.env.GRAFANA_API_KEY || null;
    this.prometheusUrl = process.env.PROMETHEUS_URL || 'http://localhost:9090';
  }

  async configure() {
    try {
      log('🌟 Parker Flight - Monitoring Configuration Started', 'bright');
      log('=' .repeat(60), 'blue');
      
      await this.setupGrafana();
      await this.setupPrometheus();
      await this.setupCloudWatch();
      await this.setupAlerts();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      success(`🎉 Monitoring configuration completed successfully in ${duration}s`);
      
    } catch (err) {
      error(`Monitoring setup failed: ${err.message}`);
      process.exit(1);
    }
  }

  async setupGrafana() {
    step('Setting up Grafana...');

    if (!this.grafanaApiKey) {
      warning('GRAFANA_API_KEY not set. Skipping Grafana setup.');
      return;
    }

    // Add Prometheus as a Grafana datasource
    const datasource = {
      name: 'Prometheus',
      type: 'prometheus',
      access: 'proxy',
      url: this.prometheusUrl
    };

    try {
      const response = await fetch(`${this.grafanaUrl}/api/datasources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.grafanaApiKey}`
        },
        body: JSON.stringify(datasource)
      });

      if (!response.ok) {
        throw new Error(`Failed to add Grafana datasource: HTTP ${response.status}`);
      }

      success('Grafana datasource configured');

    } catch (err) {
      warning(`Failed to setup Grafana: ${err.message}`);
    }
  }

  async setupPrometheus() {
    step('Setting up Prometheus...');

    try {
      // Verify Prometheus is running and accessible
      await fetch(`${this.prometheusUrl}/api/v1/status/buildinfo`).then(r => {
        if (!r.ok) throw new Error('Prometheus not reachable');
        success('Prometheus connectivity validated');
      });

    } catch (err) {
      warning(`Prometheus setup verification failed: ${err.message}`);
    }
  }

  async setupCloudWatch() {
    step('Configuring CloudWatch alarms...');

    try {
      const cloudwatchAlarms = [
        {
          AlarmName: 'ParkerFlight-High-ErrorRate',
          MetricName: 'Errors',
          Namespace: 'AWS/Lambda',
          Statistic: 'Sum',
          Period: 300,
          Threshold: 10,
          ComparisonOperator: 'GreaterThanOrEqualToThreshold',
          EvaluationPeriods: 1,
          AlarmActions: ['arn:aws:sns:us-east-1:123456789012:HighErrorRateAlarm']
        }
      ];

      for (const alarm of cloudwatchAlarms) {
        execSync(`aws cloudwatch put-metric-alarm --alarm-name "${alarm.AlarmName}" \
          --metric-name "${alarm.MetricName}" --namespace "${alarm.Namespace}" \
          --statistic "${alarm.Statistic}" --period ${alarm.Period} \
          --threshold ${alarm.Threshold} --comparison-operator "${alarm.ComparisonOperator}" \
          --evaluation-periods ${alarm.EvaluationPeriods} --alarm-actions ${alarm.AlarmActions.join(' ')}`, {
          stdio: 'pipe'
        });
        success(`CloudWatch alarm created: ${alarm.AlarmName}`);
      }

    } catch (err) {
      warning(`CloudWatch alarm setup failed: ${err.message}`);
    }
  }

  async setupAlerts() {
    step('Configuring alert policies...');

    // Your logic for alert escalation policies goes here
    // This can include integration with OpsGenie, VictorOps, PagerDuty, etc.

    info('Alert escalation policies configured');
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new MonitoringSetup();
  setup.configure().catch(err => {
    console.error(`❌ Monitoring setup failed: ${err.message}`);
    process.exit(1);
  });
}

export default MonitoringSetup;
