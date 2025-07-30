#!/usr/bin/env node

/**
 * Performance Summary Script
 * Prints a comprehensive summary of load test results
 */

const fs = require('fs');
const path = require('path');

function loadTestData(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
  } catch (error) {
    console.error(`❌ Error loading test data from ${filePath}:`, error.message);
    process.exit(1);
  }
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function printSummary(testData) {
  const aggregate = testData.aggregate || {};
  const latency = aggregate.summaries['http.response_time'] || {};
  
  console.log('\n🚀 LOAD TEST PERFORMANCE SUMMARY\n');
  
  // Test Overview
  console.log('📊 TEST OVERVIEW:');
  console.log(`   Duration:       ${formatDuration(aggregate.period || 0)}`);
  console.log(`   Total Users:    ${aggregate.scenariosCreated || 0}`);
  console.log(`   Completed:      ${aggregate.scenariosCompleted || 0}`);
  console.log(`   Requests:       ${aggregate.requestsCompleted || 0}`);
  console.log(`   Avg RPS:        ${(aggregate.rps?.mean || 0).toFixed(1)}`);
  console.log(`   Data Transfer:  ${formatBytes(aggregate.bytesReceived || 0)}`);
  
  // Latency Metrics
  console.log('\n⏱️  LATENCY METRICS:');
  const latency = aggregate.latency || {};
  console.log(`   Median (p50):   ${(latency.median || 0).toFixed(0)}ms`);
  console.log(`   95th Percentile: ${(latency.p95 || 0).toFixed(0)}ms`);
  console.log(`   99th Percentile: ${(latency.p99 || 0).toFixed(0)}ms`);
  console.log(`   Max Latency:    ${(latency.max || 0).toFixed(0)}ms`);
  console.log(`   Min Latency:    ${(latency.min || 0).toFixed(0)}ms`);
  
  // Error Analysis
  const totalRequests = aggregate.requestsCompleted || 0;
  const errors = aggregate.errors || 0;
  const errorRate = totalRequests > 0 ? ((errors / totalRequests) * 100) : 0;
  
  console.log('\n🚨 ERROR ANALYSIS:');
  console.log(`   Total Errors:   ${errors}`);
  console.log(`   Error Rate:     ${errorRate.toFixed(2)}%`);
  
  // HTTP Status Codes
  const codes = aggregate.codes || {};
  if (Object.keys(codes).length > 0) {
    console.log('\n📈 HTTP STATUS CODES:');
    Object.entries(codes)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([code, count]) => {
        const percentage = totalRequests > 0 ? ((count / totalRequests) * 100).toFixed(1) : '0.0';
        const icon = code.startsWith('2') ? '✅' : code.startsWith('4') ? '⚠️' : code.startsWith('5') ? '❌' : '🔵';
        console.log(`   ${icon} ${code}:         ${count} (${percentage}%)`);
      });
  }
  
  // Performance Assessment
  console.log('\n🎯 PERFORMANCE ASSESSMENT:');
  
  const p95 = latency.p95 || 0;
  const p99 = latency.p99 || 0;
  
  // Latency assessment
  let latencyStatus = '✅ Excellent';
  if (p95 > 2000) latencyStatus = '❌ Poor';
  else if (p95 > 1000) latencyStatus = '⚠️ Needs Improvement';
  else if (p95 > 500) latencyStatus = '🟡 Good';
  
  console.log(`   Latency (p95):  ${latencyStatus} (${p95.toFixed(0)}ms)`);
  
  // Error rate assessment
  let errorStatus = '✅ Excellent';
  if (errorRate > 5) errorStatus = '❌ Poor';
  else if (errorRate > 1) errorStatus = '⚠️ Needs Improvement';
  else if (errorRate > 0.1) errorStatus = '🟡 Good';
  
  console.log(`   Error Rate:     ${errorStatus} (${errorRate.toFixed(2)}%)`);
  
  // Throughput assessment
  const avgRps = aggregate.rps?.mean || 0;
  let throughputStatus = '✅ Excellent';
  if (avgRps < 10) throughputStatus = '❌ Poor';
  else if (avgRps < 50) throughputStatus = '⚠️ Needs Improvement';
  else if (avgRps < 100) throughputStatus = '🟡 Good';
  
  console.log(`   Throughput:     ${throughputStatus} (${avgRps.toFixed(1)} RPS)`);
  
  // Overall recommendation
  console.log('\n🏆 OVERALL RECOMMENDATION:');
  const hasHighErrors = errorRate > 1;
  const hasHighLatency = p95 > 1000;
  const hasLowThroughput = avgRps < 50;
  
  if (hasHighErrors || hasHighLatency || hasLowThroughput) {
    console.log('❌ PERFORMANCE ISSUES DETECTED');
    if (hasHighErrors) console.log('   • Error rate is too high for production');
    if (hasHighLatency) console.log('   • Latency exceeds acceptable thresholds');
    if (hasLowThroughput) console.log('   • Throughput is below expected levels');
    console.log('\n🛑 RECOMMENDATION: Investigate and resolve performance issues before rollout');
  } else if (errorRate > 0.1 || p95 > 500 || avgRps < 100) {
    console.log('🟡 ADEQUATE PERFORMANCE');
    console.log('🚦 RECOMMENDATION: Monitor closely during rollout');
  } else {
    console.log('✅ EXCELLENT PERFORMANCE');
    console.log('🎉 RECOMMENDATION: Safe to proceed with confidence');
  }
  
  // Timeline Analysis (if intermediate data available)
  if (intermediate.length > 0) {
    console.log('\n📊 PERFORMANCE TIMELINE:');
    const timelineData = intermediate.slice(-5); // Last 5 intervals
    timelineData.forEach((interval, index) => {
      const timestamp = new Date(interval.timestamp).toLocaleTimeString();
      const rps = (interval.rps?.mean || 0).toFixed(1);
      const p95 = (interval.latency?.p95 || 0).toFixed(0);
      const errors = interval.errors || 0;
      console.log(`   ${timestamp}: ${rps} RPS, ${p95}ms p95, ${errors} errors`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

function main() {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.error('Usage: node printPerfSummary.js <test-results.json>');
    process.exit(1);
  }
  
  console.log(`📋 Loading performance data from: ${path.basename(filePath)}`);
  
  const testData = loadTestData(filePath);
  printSummary(testData);
}

if (require.main === module) {
  main();
}

module.exports = { printSummary };
