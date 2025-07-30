#!/usr/bin/env node

/**
 * Performance Comparison Script
 * Compares baseline and rollout performance metrics to ensure rollout quality
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const baselineFile = args[0];
  const rolloutFile = args[1];
  
  let thresholdLatency = 20; // Default 20% increase threshold
  let thresholdError = 0.5;  // Default 0.5% error rate threshold
  
  // Parse optional arguments
  for (let i = 2; i < args.length; i++) {
    if (args[i] === '--thresholdLatency' && args[i + 1]) {
      thresholdLatency = parseFloat(args[i + 1].replace('%', ''));
      i++;
    } else if (args[i] === '--thresholdError' && args[i + 1]) {
      thresholdError = parseFloat(args[i + 1].replace('%', ''));
      i++;
    }
  }
  
  return { baselineFile, rolloutFile, thresholdLatency, thresholdError };
}

function loadTestData(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
  } catch (error) {
    console.error(`❌ Error loading test data from ${filePath}:`, error.message);
    process.exit(1);
  }
}

function extractMetrics(testData) {
  // Artillery results structure
  const aggregate = testData.aggregate || {};
  const latency = aggregate.summaries?.['http.response_time'] || {};
  const counters = aggregate.counters || {};
  const rates = aggregate.rates || {};
  
  return {
    p95Latency: latency.p95 || 0,
    p99Latency: latency.p99 || 0,
    medianLatency: latency.median || latency.p50 || 0,
    errorRate: calculateErrorRate(counters),
    totalRequests: counters['http.requests'] || 0,
    rps: rates['http.request_rate'] || 0,
    codes: extractStatusCodes(counters)
  };
}

function calculateErrorRate(counters) {
  const total = counters['http.requests'] || 0;
  if (total === 0) return 0;
  
  // Count various error types
  const errors = (
    (counters['errors.ETIMEDOUT'] || 0) +
    (counters['errors.ENOTFOUND'] || 0) +
    (counters['errors.Failed capture or match'] || 0) +
    (counters['http.codes.500'] || 0) +
    (counters['http.codes.502'] || 0) +
    (counters['http.codes.503'] || 0) +
    (counters['http.codes.504'] || 0)
  );
  
  return (errors / total) * 100;
}

function extractStatusCodes(counters) {
  const codes = {};
  Object.keys(counters).forEach(key => {
    if (key.startsWith('http.codes.')) {
      const code = key.replace('http.codes.', '');
      codes[code] = counters[key];
    }
  });
  return codes;
}

function compareMetrics(baseline, rollout, thresholds) {
  const results = {
    passed: true,
    issues: [],
    improvements: [],
    metrics: {
      baseline,
      rollout,
      deltas: {}
    }
  };
  
  // Calculate deltas
  const deltas = {
    p95Latency: ((rollout.p95Latency - baseline.p95Latency) / baseline.p95Latency) * 100,
    p99Latency: ((rollout.p99Latency - baseline.p99Latency) / baseline.p99Latency) * 100,
    errorRate: rollout.errorRate - baseline.errorRate,
    rps: ((rollout.rps - baseline.rps) / baseline.rps) * 100
  };
  
  results.metrics.deltas = deltas;
  
  // Check p95 latency threshold
  if (deltas.p95Latency > thresholds.thresholdLatency) {
    results.passed = false;
    results.issues.push(`P95 latency increased by ${deltas.p95Latency.toFixed(1)}% (threshold: ${thresholds.thresholdLatency}%)`);
  } else if (deltas.p95Latency < -5) {
    results.improvements.push(`P95 latency improved by ${Math.abs(deltas.p95Latency).toFixed(1)}%`);
  }
  
  // Check error rate threshold
  if (deltas.errorRate > thresholds.thresholdError) {
    results.passed = false;
    results.issues.push(`Error rate increased by ${deltas.errorRate.toFixed(2)}% (threshold: ${thresholds.thresholdError}%)`);
  } else if (deltas.errorRate < -0.1) {
    results.improvements.push(`Error rate improved by ${Math.abs(deltas.errorRate).toFixed(2)}%`);
  }
  
  // Check for significant RPS degradation
  if (deltas.rps < -15) {
    results.passed = false;
    results.issues.push(`RPS decreased significantly by ${Math.abs(deltas.rps).toFixed(1)}%`);
  } else if (deltas.rps > 5) {
    results.improvements.push(`RPS improved by ${deltas.rps.toFixed(1)}%`);
  }
  
  return results;
}

function printResults(comparison) {
  const { baseline, rollout, deltas } = comparison.metrics;
  
  console.log('\n🚀 PERFORMANCE COMPARISON RESULTS\n');
  
  console.log('📊 METRICS COMPARISON:');
  console.log(`   P95 Latency:    ${baseline.p95Latency.toFixed(0)}ms → ${rollout.p95Latency.toFixed(0)}ms (${deltas.p95Latency > 0 ? '+' : ''}${deltas.p95Latency.toFixed(1)}%)`);
  console.log(`   P99 Latency:    ${baseline.p99Latency.toFixed(0)}ms → ${rollout.p99Latency.toFixed(0)}ms (${deltas.p99Latency > 0 ? '+' : ''}${deltas.p99Latency.toFixed(1)}%)`);
  console.log(`   Error Rate:     ${baseline.errorRate.toFixed(2)}% → ${rollout.errorRate.toFixed(2)}% (${deltas.errorRate > 0 ? '+' : ''}${deltas.errorRate.toFixed(2)}%)`);
  console.log(`   RPS:            ${baseline.rps.toFixed(0)} → ${rollout.rps.toFixed(0)} (${deltas.rps > 0 ? '+' : ''}${deltas.rps.toFixed(1)}%)`);
  console.log(`   Total Requests: ${baseline.totalRequests} → ${rollout.totalRequests}`);
  
  if (comparison.improvements.length > 0) {
    console.log('\n✅ IMPROVEMENTS:');
    comparison.improvements.forEach(improvement => {
      console.log(`   • ${improvement}`);
    });
  }
  
  if (comparison.issues.length > 0) {
    console.log('\n⚠️  PERFORMANCE ISSUES:');
    comparison.issues.forEach(issue => {
      console.log(`   • ${issue}`);
    });
  }
  
  console.log(`\n${comparison.passed ? '✅ ROLLOUT APPROVED' : '❌ ROLLOUT REJECTED'}: Performance comparison ${comparison.passed ? 'passed' : 'failed'} thresholds`);
  
  if (!comparison.passed) {
    console.log('\n🛑 RECOMMENDATION: Do not proceed with rollout. Investigate performance degradation.');
    process.exit(1);
  } else {
    console.log('\n🎉 RECOMMENDATION: Safe to proceed with rollout.');
  }
}

function main() {
  const { baselineFile, rolloutFile, thresholdLatency, thresholdError } = parseArgs();
  
  if (!baselineFile || !rolloutFile) {
    console.error('Usage: node comparePerf.js <baseline.json> <rollout.json> [--thresholdLatency 20%] [--thresholdError 0.5%]');
    process.exit(1);
  }
  
  console.log(`🔍 Comparing performance: ${path.basename(baselineFile)} vs ${path.basename(rolloutFile)}`);
  console.log(`📏 Thresholds: Latency +${thresholdLatency}%, Error Rate +${thresholdError}%`);
  
  const baselineData = loadTestData(baselineFile);
  const rolloutData = loadTestData(rolloutFile);
  
  const baselineMetrics = extractMetrics(baselineData);
  const rolloutMetrics = extractMetrics(rolloutData);
  
  const comparison = compareMetrics(baselineMetrics, rolloutMetrics, { thresholdLatency, thresholdError });
  
  printResults(comparison);
}

if (require.main === module) {
  main();
}

module.exports = { compareMetrics, extractMetrics };
