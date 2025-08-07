#!/usr/bin/env node

/**
 * Parker Flight - Load Testing Script
 * 
 * This script performs load testing and performance validation.
 * - Simulates concurrent requests to critical endpoints.
 * - Analyzes response times and error rates.
 * - Generates performance reports.
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
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

// Utility function for logging
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const success = (message) => log(`✅ ${message}`, 'green');
const warning = (message) => log(`⚠️  ${message}`, 'yellow');
const error = (message) => log(`❌ ${message}`, 'red');
const step = (message) => log(`🚀 ${message}`, 'cyan');

// Endpoints to test
const endpoints = [
  '/rest/v1/',
  '/functions/v1/encrypt-data',
  '/functions/v1/create-payment-method'
];

// Concurrent configuration
const concurrency = 50;
const requestsPerEndpoint = 200;

// API Key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

class LoadTester {
  constructor() {
    this.startTime = Date.now();
    this.results = {};
  }

  async run() {
    step('Starting load testing...');

    for (const endpoint of endpoints) {
      const fullUrl = `${supabaseUrl}${endpoint}`;
      log(`Testing endpoint: ${fullUrl}`, 'blue');

      try {
        const abResult = execSync(
          `ab -n ${requestsPerEndpoint} -c ${concurrency} -H "Authorization: Bearer ${supabaseAnonKey}" "${fullUrl}"`,
          { encoding: 'utf8' }
        );

        this.results[endpoint] = this.parseAbResult(abResult);
        success(`Load test completed for ${endpoint}`);

      } catch (err) {
        error(`Error testing ${endpoint}: ${err.message}`);
      }
    }

    this.generateReport();
  }

  parseAbResult(output) {
    const lines = output.split('\n');
    const summary = {};

    lines.forEach((line) => {
      if (line.includes('Failed requests:')) {
        summary.failedRequests = line.split(':')[1].trim();
      }
      if (line.includes('Time per request:')) {
        summary.timePerRequest = line.split(':')[1].split('[')[0].trim();
      }
      if (line.includes('Requests per second:')) {
        summary.requestsPerSecond = line.split(':')[1].split('[')[0].trim();
      }
    });

    return summary;
  }

  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const reportPath = path.join(__dirname, `load-test-report-${Date.now()}.json`);

    writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      concurrency,
      requestsPerEndpoint,
      results: this.results
    }, null, 2));

    success(`Load test report generated: ${reportPath}`);
  }
}

// Execute script
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new LoadTester();
  tester.run();
}

export default LoadTester;

