#!/usr/bin/env tsx
/**
 * Server Integration Test for Enhanced AWS SDK
 * 
 * Tests the enhanced AWS SDK integration by making HTTP requests
 * to the running Parker Flight server.
 */

import { performance } from 'perf_hooks';

interface TestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
  response?: any;
  error?: string;
}

class ServerAWSIntegrationTest {
  private baseUrl: string;
  private results: TestResult[] = [];
  
  constructor(baseUrl = 'http://localhost:5001') {
    this.baseUrl = baseUrl;
  }

  async runTest(endpoint: string, method = 'GET', body?: any): Promise<TestResult> {
    const startTime = performance.now();
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(method !== 'GET' && { 'X-Admin-Token': process.env.ADMIN_TOKEN || 'test-admin-token' })
        },
        ...(body && { body: JSON.stringify(body) })
      });
      
      const duration = Math.round(performance.now() - startTime);
      let responseData;
      
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }
      
      const result: TestResult = {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        duration,
        response: responseData
      };
      
      this.results.push(result);
      return result;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      const result: TestResult = {
        endpoint,
        method,
        status: 0,
        success: false,
        duration,
        error: (error as Error).message
      };
      
      this.results.push(result);
      return result;
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Parker Flight Server - Enhanced AWS Integration Tests');
    console.log(`📍 Server URL: ${this.baseUrl}`);
    console.log('='.repeat(80));

    // Test 1: Server Health Check
    console.log('\n🔹 Testing Server Health...');
    const healthResult = await this.runTest('/health');
    this.logResult(healthResult);

    // Test 2: Enhanced AWS Health
    console.log('\n🔹 Testing Enhanced AWS Health...');
    const awsHealthResult = await this.runTest('/api/aws-enhanced/health');
    this.logResult(awsHealthResult);

    // Test 3: AWS Status
    console.log('\n🔹 Testing AWS Status...');
    const statusResult = await this.runTest('/api/aws-enhanced/status');
    this.logResult(statusResult);

    // Test 4: Cache Stats
    console.log('\n🔹 Testing Cache Statistics...');
    const cacheResult = await this.runTest('/api/aws-enhanced/cache/stats');
    this.logResult(cacheResult);

    // Test 5: Connection Status
    console.log('\n🔹 Testing Connection Status...');
    const connResult = await this.runTest('/api/aws-enhanced/connections');
    this.logResult(connResult);

    // Test 6: Metrics
    console.log('\n🔹 Testing Metrics Collection...');
    const metricsResult = await this.runTest('/api/aws-enhanced/metrics');
    this.logResult(metricsResult);

    // Test 7: Connectivity Test
    console.log('\n🔹 Testing AWS Connectivity...');
    const connectivityResult = await this.runTest('/api/aws-enhanced/test/connectivity');
    this.logResult(connectivityResult);

    // Test 8: Monitoring Report
    console.log('\n🔹 Testing Monitoring Report...');
    const reportResult = await this.runTest('/api/aws-enhanced/report');
    this.logResult(reportResult);

    // Test 9: Feature Flags (existing endpoint)
    console.log('\n🔹 Testing Feature Flags...');
    const flagResult = await this.runTest('/api/feature-flags/WALLET_UI');
    this.logResult(flagResult);

    // Test 10: Legacy AWS endpoint compatibility
    console.log('\n🔹 Testing Legacy AWS Endpoints...');
    const legacyResult = await this.runTest('/api/aws/secrets/health');
    this.logResult(legacyResult);

    // Test 11: Server endpoint listing
    console.log('\n🔹 Testing Endpoint Listing...');
    const rootResult = await this.runTest('/');
    this.logResult(rootResult);

    // Admin Tests (if admin token is available)
    if (process.env.ADMIN_TOKEN) {
      console.log('\n🔐 Running Admin-Only Tests...');
      
      console.log('\n🔹 Testing Cache Warmup...');
      const warmupResult = await this.runTest('/api/aws-enhanced/cache/warmup', 'POST', {
        environment: 'development'
      });
      this.logResult(warmupResult);

      console.log('\n🔹 Testing Secret Access Test...');
      const secretTestResult = await this.runTest('/api/aws-enhanced/test/secret-access', 'POST', {
        secretName: 'development/test/integration-test',
        secretType: 'config'
      });
      this.logResult(secretTestResult);
    } else {
      console.log('\n⚠️  Skipping admin tests (ADMIN_TOKEN not set)');
    }

    // Summary
    this.printSummary();
  }

  private logResult(result: TestResult): void {
    const status = result.success ? '✅' : '❌';
    const statusCode = result.status || 'ERR';
    console.log(`${status} ${result.method} ${result.endpoint} - ${statusCode} (${result.duration}ms)`);
    
    if (!result.success) {
      console.log(`   Error: ${result.error || 'HTTP ' + result.status}`);
    } else if (result.response && typeof result.response === 'object') {
      // Log interesting parts of successful responses
      if (result.response.status) {
        console.log(`   Status: ${result.response.status}`);
      }
      if (result.response.services) {
        console.log(`   Services: ${Object.keys(result.response.services).join(', ')}`);
      }
      if (result.response.cache && result.response.cache.hit_rate !== undefined) {
        console.log(`   Cache Hit Rate: ${result.response.cache.hit_rate}%`);
      }
      if (result.response.connections && result.response.connections.total !== undefined) {
        console.log(`   Connections: ${result.response.connections.active}/${result.response.connections.total}`);
      }
    }
  }

  private printSummary(): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 Test Results Summary');
    console.log('='.repeat(80));

    const totalTests = this.results.length;
    const successfulTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - successfulTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = Math.round(totalDuration / totalTests);

    console.log(`📈 Total Tests: ${totalTests}`);
    console.log(`✅ Successful: ${successfulTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    console.log(`⚡ Average Response Time: ${avgDuration}ms`);

    const successRate = (successfulTests / totalTests) * 100;
    console.log(`🎯 Success Rate: ${successRate.toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   • ${r.method} ${r.endpoint}: ${r.error || 'HTTP ' + r.status}`);
        });
    }

    console.log('\n🚀 Performance Breakdown:');
    this.results
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .forEach((r, i) => {
        const status = r.success ? '✅' : '❌';
        console.log(`   ${i + 1}. ${status} ${r.endpoint}: ${r.duration}ms`);
      });

    if (successRate >= 90) {
      console.log('\n🎉 Integration tests passed! Enhanced AWS SDK is working correctly.');
    } else if (successRate >= 70) {
      console.log('\n⚠️  Most tests passed, but some issues detected. Check failed tests above.');
    } else {
      console.log('\n💥 Multiple test failures detected. Check server status and configuration.');
    }

    console.log('='.repeat(80));
  }
}

// Main execution
async function main() {
  const serverUrl = process.argv[2] || 'http://localhost:5001';
  const tester = new ServerAWSIntegrationTest(serverUrl);
  
  try {
    await tester.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error('\n💀 Test suite failed:', error);
    process.exit(1);
  }
}

// Check if server is running first
async function checkServerHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Startup check
(async () => {
  const serverUrl = process.argv[2] || 'http://localhost:5001';
  
  console.log('🔍 Checking if server is running...');
  const isServerRunning = await checkServerHealth(serverUrl);
  
  if (!isServerRunning) {
    console.error(`❌ Server is not running at ${serverUrl}`);
    console.log('💡 Start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Server is running, proceeding with tests...\n');
  await main();
})();
