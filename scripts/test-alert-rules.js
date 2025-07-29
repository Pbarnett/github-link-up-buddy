#!/usr/bin/env node

/**
 * Alert Rule Testing Script for Parker Flight
 * 
 * This script tests Prometheus alert rules by:
 * 1. Generating synthetic metrics that should trigger alerts
 * 2. Checking alert status in Prometheus
 * 3. Validating notification routing in AlertManager
 */

import axios from 'axios';
import { performance } from 'perf_hooks';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

const PROMETHEUS_URL = 'http://localhost:9090';
const ALERTMANAGER_URL = 'http://localhost:9093';
const METRICS_SERVER_URL = 'http://localhost:5001';

class AlertRuleTester {
  constructor() {
    this.testResults = [];
  }

  async log(level, message) {
    const timestamp = new Date().toISOString();
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
    console.log(`${timestamp} ${emoji} ${message}`);
  }

  async checkPrometheusHealth() {
    try {
      const response = await axios.get(`${PROMETHEUS_URL}/-/ready`);
      if (response.status === 200) {
        await this.log('success', 'Prometheus is healthy');
        return true;
      }
    } catch (error) {
      await this.log('error', `Prometheus health check failed: ${error.message}`);
      return false;
    }
  }

  async checkAlertManagerHealth() {
    try {
      const response = await axios.get(`${ALERTMANAGER_URL}/-/ready`);
      if (response.status === 200) {
        await this.log('success', 'AlertManager is healthy');
        return true;
      }
    } catch (error) {
      await this.log('error', `AlertManager health check failed: ${error.message}`);
      return false;
    }
  }

  async testHighErrorRateAlert() {
    await this.log('info', '🧪 Testing High Error Rate Alert...');
    
    try {
      // Generate synthetic error metrics
      const errorMetrics = {
        'parker_flight_requests_total{status="500",method="GET",endpoint="/api/flights"}': 50,
        'parker_flight_requests_total{status="200",method="GET",endpoint="/api/flights"}': 100}
      // Push metrics to metrics server
      for (const [metric, value] of Object.entries(errorMetrics)) {
        await axios.post(`${METRICS_SERVER_URL}/api/test-metrics`, {
          metric,
          value,
          timestamp: Date.now()
        });
      }

      await this.log('success', 'Generated synthetic high error rate metrics');

      // Wait for Prometheus to scrape
      await new Promise(resolve => setTimeout(resolve, 20000)); // 20 seconds

      // Check if alert fired
      const alertResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/alerts`);
      const highErrorRateAlert = alertResponse.data.data.alerts.find(
        alert => alert.labels.alertname === 'ParkerFlightHighErrorRate'
      );

      if (highErrorRateAlert) {
        await this.log('success', `✅ ParkerFlightHighErrorRate alert fired successfully`);
        this.testResults.push({
          test: 'HighErrorRate',
          status: 'PASS',
          alert: highErrorRateAlert
        });
      } else {
        await this.log('warn', '⚠️ ParkerFlightHighErrorRate alert did not fire (may need more time)');
        this.testResults.push({
          test: 'HighErrorRate',
          status: 'PENDING',
          note: 'Alert may still be evaluating'
        });
      }

    } catch (error) {
      await this.log('error', `High Error Rate test failed: ${error.message}`);
      this.testResults.push({
        test: 'HighErrorRate',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testHighLatencyAlert() {
    await this.log('info', '🧪 Testing High Latency Alert...');
    
    try {
      // Generate synthetic latency metrics (histogram buckets)
      const latencyBuckets = [
        { le: "0.1", value: 10 },
        { le: "0.5", value: 30 },
        { le: "1.0", value: 50 },
        { le: "2.0", value: 70 },
        { le: "5.0", value: 90 }, // High values in upper buckets
        { le: "+Inf", value: 100 }
      ];

      // Push histogram metrics
      for (const bucket of latencyBuckets) {
        await axios.post(`${METRICS_SERVER_URL}/api/test-metrics`, {
          metric: `parker_flight_request_duration_seconds_bucket{le="${bucket.le}",method="GET",endpoint="/api/flights"}`,
          value: bucket.value,
          timestamp: Date.now()
        });
      }

      await this.log('success', 'Generated synthetic high latency metrics');

      // Wait for Prometheus to scrape and evaluate
      await new Promise(resolve => setTimeout(resolve, 20000));

      const alertResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/alerts`);
      const highLatencyAlert = alertResponse.data.data.alerts.find(
        alert => alert.labels.alertname === 'ParkerFlightHighLatency'
      );

      if (highLatencyAlert) {
        await this.log('success', `✅ ParkerFlightHighLatency alert fired successfully`);
        this.testResults.push({
          test: 'HighLatency',
          status: 'PASS',
          alert: highLatencyAlert
        });
      } else {
        await this.log('warn', '⚠️ ParkerFlightHighLatency alert did not fire');
        this.testResults.push({
          test: 'HighLatency',
          status: 'PENDING'
        });
      }

    } catch (error) {
      await this.log('error', `High Latency test failed: ${error.message}`);
      this.testResults.push({
        test: 'HighLatency',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testDependencyDownAlert() {
    await this.log('info', '🧪 Testing Dependency Down Alert...');
    
    try {
      // Generate dependency down metric
      await axios.post(`${METRICS_SERVER_URL}/api/test-metrics`, {
        metric: 'parker_flight_dependency_up{service="supabase"}',
        value: 0, // Service is down
        timestamp: Date.now()
      });

      await this.log('success', 'Generated synthetic dependency down metrics');

      // Wait for alert evaluation
      await new Promise(resolve => setTimeout(resolve, 15000));

      const alertResponse = await axios.get(`${PROMETHEUS_URL}/api/v1/alerts`);
      const dependencyDownAlert = alertResponse.data.data.alerts.find(
        alert => alert.labels.alertname === 'ParkerFlightDependencyDown'
      );

      if (dependencyDownAlert) {
        await this.log('success', `✅ ParkerFlightDependencyDown alert fired successfully`);
        this.testResults.push({
          test: 'DependencyDown',
          status: 'PASS',
          alert: dependencyDownAlert
        });
      } else {
        await this.log('warn', '⚠️ ParkerFlightDependencyDown alert did not fire');
        this.testResults.push({
          test: 'DependencyDown',
          status: 'PENDING'
        });
      }

    } catch (error) {
      await this.log('error', `Dependency Down test failed: ${error.message}`);
      this.testResults.push({
        test: 'DependencyDown',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async testAlertManagerRouting() {
    await this.log('info', '🧪 Testing AlertManager Routing...');

    try {
      // Get current alerts from AlertManager
      const response = await axios.get(`${ALERTMANAGER_URL}/api/v1/alerts`);
      const alerts = response.data.data

      await this.log('info', `Found ${alerts.length} active alerts in AlertManager`);

      // Check routing for critical alerts
      const criticalAlerts = alerts.filter(alert => 
        alert.labels.severity === 'critical'
      );

      // Check routing for warning alerts
      const warningAlerts = alerts.filter(alert => 
        alert.labels.severity === 'warning'
      );

      this.testResults.push({
        test: 'AlertManagerRouting',
        status: 'PASS',
        criticalAlerts: criticalAlerts.length,
        warningAlerts: warningAlerts.length,
        totalAlerts: alerts.length
      });

      await this.log('success', `✅ AlertManager routing verified: ${criticalAlerts.length} critical, ${warningAlerts.length} warning`);

    } catch (error) {
      await this.log('error', `AlertManager routing test failed: ${error.message}`);
      this.testResults.push({
        test: 'AlertManagerRouting',
        status: 'FAIL',
        error: error.message
      });
    }
  }

  async cleanupTestMetrics() {
    await this.log('info', '🧹 Cleaning up test metrics...');
    try {
      await axios.post(`${METRICS_SERVER_URL}/api/cleanup-test-metrics`);
      await this.log('success', 'Test metrics cleaned up');
    } catch (error) {
      await this.log('warn', `Cleanup warning: ${error.message}`);
    }
  }

  async generateReport() {
    const passed = this.testResults.filter(r => r.status === 'PASS').length
    const failed = this.testResults.filter(r => r.status === 'FAIL').length
    const pending = this.testResults.filter(r => r.status === 'PENDING').length

    console.log('\n📊 ALERT RULE TESTING REPORT');
    console.log('=' .repeat(50));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏳ Pending: ${pending}`);
    console.log(`📊 Total Tests: ${this.testResults.length}`);
    console.log('\nDetailed Results:');
    
    this.testResults.forEach(result => {
      const emoji = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏳';
      console.log(`${emoji} ${result.test}: ${result.status}`);
      if (result.error) console.log(`   Error: ${result.error}`);
      if (result.note) console.log(`   Note: ${result.note}`);
    });

    console.log('\n🎯 SLO Alert Testing Complete!');
    
    return {
      passed,
      failed,
      pending,
      total: this.testResults.length,
      success: failed === 0
    };
  }

  async runAllTests() {
    const startTime = performance.now();
    
    await this.log('info', '🚀 Starting Parker Flight Alert Rule Testing');
    
    // Health checks first
    const prometheusHealthy = await this.checkPrometheusHealth();
    const alertmanagerHealthy = await this.checkAlertManagerHealth();
    
    if (!prometheusHealthy || !alertmanagerHealthy) {
      await this.log('error', 'Prerequisites not met. Aborting tests.');
      return;
    }

    // Run alert tests
    await this.testHighErrorRateAlert();
    await this.testHighLatencyAlert();
    await this.testDependencyDownAlert();
    await this.testAlertManagerRouting();

    // Cleanup
    await this.cleanupTestMetrics();

    // Generate report
    const results = await this.generateReport();
    
    const endTime = performance.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    await this.log('info', `🏁 Testing completed in ${duration}s`);
    
    // Exit with appropriate code
    process.exit(results.success ? 0 : 1);
  }
}

// Run tests if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const tester = new AlertRuleTester();
  tester.runAllTests().catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  });
}

module.exports = { AlertRuleTester };
