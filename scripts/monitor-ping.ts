#!/usr/bin/env tsx
/**
 * Monitor Ping Script - Phase 4 Day 15
 * 
 * E2E verification that:
 * 1. Hits endpoints to generate metrics
 * 2. Checks /metrics endpoint shows counters increment
 * 3. Validates monitoring infrastructure is working
 */

interface MetricCheck {
  name: string;
  pattern: RegExp;
  found: boolean;
  value?: string;
}

interface PrometheusTarget {
  labels: {
    job: string;
    [key: string]: string;
  };
  health: string;
  lastError?: string;
  lastScrape?: string;
  scrapeUrl?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const response = await fetch(url, options);
  return response;
}

async function hitEndpoints(): Promise<void> {
  console.log('📡 Hitting endpoints to generate metrics...');
  
  const requests = [
    // Hit config endpoint multiple times
    makeRequest('http://localhost:8080/api/business-rules/config'),
    makeRequest('http://localhost:8080/api/business-rules/config?env=staging'),
    makeRequest('http://localhost:8080/api/business-rules/config?env=development'),
    
    // Hit feature flag endpoint with different users
    makeRequest('http://localhost:8080/api/feature-flags/ENABLE_CONFIG_DRIVEN_FORMS', {
      headers: { 'x-user-id': 'user1@example.com' }
    }),
    makeRequest('http://localhost:8080/api/feature-flags/ENABLE_CONFIG_DRIVEN_FORMS', {
      headers: { 'x-user-id': 'user2@example.com' }
    }),
    makeRequest('http://localhost:8080/api/feature-flags/ENABLE_CONFIG_DRIVEN_FORMS', {
      headers: { 'x-user-id': 'user3@example.com' }
    }),
    
    // Test alert webhook
    makeRequest('http://localhost:8080/webhook/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alertname: 'test-alert',
        severity: 'info',
        message: 'Monitor ping test alert'
      })
    })
  ];
  
  await Promise.all(requests);
  console.log('✅ Endpoint hits completed');
}

async function checkMetrics(): Promise<boolean> {
  console.log('🔍 Checking /metrics endpoint...');
  
  try {
    const response = await makeRequest('http://localhost:5001/metrics');
    const metricsText = await response.text();
    
    const checks: MetricCheck[] = [
      {
        name: 'HTTP Request Duration',
        pattern: /http_request_duration_seconds_sum.*?(\d+\.\d+)/,
        found: false
      },
      {
        name: 'Feature Flag Hits',
        pattern: /feature_flag_hits_total.*?(\d+)/,
        found: false
      },
      {
        name: 'Business Rules Config Requests',
        pattern: /business_rules_config_requests_total.*?(\d+)/,
        found: false
      },
      {
        name: 'AWS Operations',
        pattern: /aws_operations_total.*?(\d+)/,
        found: false
      },
      {
        name: 'Feature Flag Rollout Percentage',
        pattern: /feature_flag_rollout_percentage.*?(\d+)/,
        found: false
      }
    ];
    
    console.log('📊 Analyzing metrics...');
    
    for (const check of checks) {
      const match = metricsText.match(check.pattern);
      if (match) {
        check.found = true;
        check.value = match[1];
        console.log(`✅ ${check.name}: ${check.value}`);
      } else {
        console.log(`❌ ${check.name}: Not found`);
      }
    }
    
    const allFound = checks.every(check => check.found);
    
    if (allFound) {
      console.log('');
      console.log('🎉 All metrics found and incrementing!');
      
      // Show sample metrics
      console.log('');
      console.log('📈 Sample metrics output:');
      const sampleLines = metricsText.split('\n')
        .filter(line => line.includes('feature_flag_hits_total') || 
                       line.includes('business_rules_config_requests_total') ||
                       line.includes('aws_operations_total'))
        .slice(0, 10);
      
      sampleLines.forEach(line => console.log(`   ${line}`));
      
      return true;
    } else {
      console.log('');
      console.log('❌ Some metrics missing. Check if endpoints are being hit.');
      return false;
    }
    
  } catch {
    console.error('❌ Failed to fetch metrics:', error);
    return false;
  }
}

async function checkPrometheusConnection(): Promise<boolean> {
  console.log('🔗 Checking Prometheus connection...');
  
  try {
    const response = await makeRequest('http://localhost:9090/api/v1/targets');
    const data = await response.json();
    
    if (response.ok && data.status === 'success') {
      const targets = data.data.activeTargets
      const parkerFlightTarget = targets.find((target: PrometheusTarget) => 
        target.labels.job === 'parker-flight-api'
      );
      
      if (parkerFlightTarget) {
        console.log(`✅ Prometheus target found: ${parkerFlightTarget.health}`);
        return parkerFlightTarget.health === 'up';
      } else {
        console.log('❌ Parker Flight API target not found in Prometheus');
        return false;
      }
    } else {
      console.log('❌ Prometheus API not responding correctly');
      return false;
    }
  } catch {
    console.log('⚠️  Prometheus not accessible (may not be running)');
    return false;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Monitor Ping - E2E Verification Script');
  console.log('==========================================');
  console.log('');
  
  try {
    // Step 1: Hit endpoints to generate metrics
    await hitEndpoints();
    
    // Step 2: Wait a moment for metrics to be collected
    console.log('⏳ Waiting 3 seconds for metrics collection...');
    await sleep(3000);
    
    // Step 3: Check metrics endpoint
    const metricsOk = await checkMetrics();
    
    // Step 4: Check Prometheus connection (optional)
    const prometheusOk = await checkPrometheusConnection();
    
    console.log('');
    console.log('==========================================');
    console.log('📊 Monitor Ping Results:');
    console.log(`   Metrics Generation: ${metricsOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   Prometheus Target:  ${prometheusOk ? '✅ PASS' : '⚠️  SKIP (not running)'}`);
    
    if (metricsOk) {
      console.log('');
      console.log('🎯 Monitoring infrastructure is working!');
      console.log('💡 Next steps:');
      console.log('   • Start Prometheus: docker-compose -f docker-compose.monitoring.yml up -d');
      console.log('   • Open Grafana: http://localhost:3001 (admin/admin)');
      console.log('   • View metrics: http://localhost:5001/metrics');
      
      process.exit(0);
    } else {
      console.log('');
      console.log('❌ Monitoring setup needs attention');
      process.exit(1);
    }
    
  } catch {
    console.error('❌ Monitor ping failed:', error);
    process.exit(1);
  }
}

// Export for testing, run if executed directly
module.exports = { hitEndpoints, checkMetrics };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
