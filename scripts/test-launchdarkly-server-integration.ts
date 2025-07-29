#!/usr/bin/env tsx
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env' });

interface LaunchDarklyRequest {
  context: {
    key: string;
    kind: string;
    [key: string]: any;
  };
  flagKey: string;
  defaultValue?: any;
  includeReason?: boolean;
}

interface LaunchDarklyResponse {
  value: any;
  variationIndex?: number;
  reason?: any;
  flagKey: string;
  timestamp: string;
}

class LaunchDarklyServerIntegrationTest {
  private baseUrl: string;
  private authToken: string;

  constructor() {
    this.baseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
    this.authToken = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
  }

  private async makeRequest(method: string, body?: LaunchDarklyRequest): Promise<Response> {
    const url = `${this.baseUrl}/functions/v1/launchdarkly-server`;
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json'}
    const requestConfig: RequestInit = {
      method,
      headers}
    if (body) {
      requestConfig.body = JSON.stringify(body);
    }

    console.log(`Making ${method} request to: ${url}`);
    if (body) {
      console.log('Request body:', JSON.stringify(body, null, 2));
    }

    return fetch(url, requestConfig);
  }

  async testHealthCheck(): Promise<boolean> {
    console.log('\n🔍 Testing LaunchDarkly server health check...');
    
    try {
      const response = await this.makeRequest('GET');
      
      if (!response.ok) {
        console.error(`❌ Health check failed with status: ${response.status}`);
        const errorText = await response.text();
        console.error('Response:', errorText);
        return false;
      }

      const health = await response.json();
      console.log('✅ Health check response:', JSON.stringify(health, null, 2));
      
      return health.status === 'healthy' && health.initialized === true;
    } catch (error) {
      console.error('❌ Health check request failed:', error);
      return false;
    }
  }

  async testFlagEvaluation(flagKey: string, userContext: object, defaultValue: any = false): Promise<boolean> {
    console.log(`\n🚩 Testing flag evaluation for: ${flagKey}`);
    
    try {
      const request: LaunchDarklyRequest = {
        context: {
          key: 'test-user-integration',
          kind: 'user',
          ...userContext,
        },
        flagKey,
        defaultValue,
        includeReason: true}
      const response = await this.makeRequest('POST', request);
      
      if (!response.ok) {
        console.error(`❌ Flag evaluation failed with status: ${response.status}`);
        const errorText = await response.text();
        console.error('Response:', errorText);
        return false;
      }

      const result: LaunchDarklyResponse = await response.json();
      console.log('✅ Flag evaluation response:', JSON.stringify(result, null, 2));
      
      // Check response headers
      console.log('Response headers:');
      response.headers.forEach((value, key) => {
        if (key.startsWith('x-')) {
          console.log(`  ${key}: ${value}`);
        }
      });

      return true;
    } catch (error) {
      console.error('❌ Flag evaluation request failed:', error);
      return false;
    }
  }

  async testMultipleFlags(): Promise<boolean> {
    console.log('\n🎯 Testing multiple feature flags...');
    
    const flags = [
      { key: 'wallet_ui', defaultValue: false },
      { key: 'profile_ui_revamp', defaultValue: false },
      { key: 'personalization_greeting', defaultValue: false },
      { key: 'sample-feature', defaultValue: false },
      { key: 'unknown-flag-test', defaultValue: 'default-fallback' }]
    let allPassed = true;

    for (const flag of flags) {
      const userContext = {
        email: 'integration-test@example.com',
        name: 'Integration Test User',
        testFlag: flag.key,
        timestamp: new Date().toISOString()}
      const success = await this.testFlagEvaluation(flag.key, userContext, flag.defaultValue);
      if (!success) {
        allPassed = false;
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allPassed;
  }

  async testDifferentContextTypes(): Promise<boolean> {
    console.log('\n👥 Testing different context types...');
    
    const contexts = [
      {
        name: 'User Context',
        context: {
          key: 'user-123',
          kind: 'user',
          email: 'user@example.com',
          subscription: 'premium',
        },
      },
      {
        name: 'Organization Context', 
        context: {
          key: 'org-456',
          kind: 'organization',
          name: 'Test Org',
          plan: 'enterprise',
        },
      },
      {
        name: 'Device Context',
        context: {
          key: 'device-789',
          kind: 'device',
          platform: 'ios',
          version: '16.0',
        },
      }]
    let allPassed = true;

    for (const { name, context } of contexts) {
      console.log(`\n  Testing ${name}...`);
      
      const request: LaunchDarklyRequest = {
        context,
        flagKey: 'wallet_ui',
        defaultValue: false,
        includeReason: true}
      try {
        const response = await this.makeRequest('POST', request);
        
        if (!response.ok) {
          console.error(`❌ ${name} failed with status: ${response.status}`);
          allPassed = false;
          continue;
        }

        const result = await response.json();
        console.log(`✅ ${name} result:`, JSON.stringify(result, null, 2));
      } catch (error) {
        console.error(`❌ ${name} request failed:`, error);
        allPassed = false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allPassed;
  }

  async testErrorHandling(): Promise<boolean> {
    console.log('\n⚠️ Testing error handling...');
    
    const errorTests = [
      {
        name: 'Missing context',
        request: {
          flagKey: 'wallet_ui',
          defaultValue: false,
        },
      },
      {
        name: 'Invalid context format',
        request: {
          context: {
            // Missing required 'key' field
            kind: 'user',
          },
          flagKey: 'wallet_ui',
          defaultValue: false,
        },
      },
      {
        name: 'Missing flag key',
        request: {
          context: {
            key: 'test-user',
            kind: 'user',
          },
          defaultValue: false,
        },
      }]
    let allPassed = true;

    for (const { name, request } of errorTests) {
      console.log(`\n  Testing ${name}...`);
      
      try {
        const response = await this.makeRequest('POST', request as any);
        
        if (response.ok) {
          console.error(`❌ ${name} should have failed but returned OK`);
          allPassed = false;
        } else {
          console.log(`✅ ${name} correctly returned error status: ${response.status}`);
          const errorText = await response.text();
          console.log(`   Error response: ${errorText}`);
        }
      } catch (error) {
        console.log(`✅ ${name} correctly threw error:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return allPassed;
  }

  async runFullTest(): Promise<void> {
    console.log('🧪 Starting LaunchDarkly Server Integration Test...');
    console.log(`Base URL: ${this.baseUrl}`);
    console.log(`Auth Token: ${this.authToken.substring(0, 20)}...`);
    
    // Check environment variables
    console.log('\n🔧 Environment Check:');
    console.log(`  LAUNCHDARKLY_SDK_KEY: ${process.env.LAUNCHDARKLY_SDK_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`  SUPABASE_URL: ${process.env.SUPABASE_URL || 'Using default local URL'}`);
    console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : 'Using default local key'}`);

    const startTime = Date.now();
    let testsPassed = 0;
    let totalTests = 0;

    // Test 1: Health Check
    totalTests++;
    if (await this.testHealthCheck()) {
      testsPassed++;
    }

    // Test 2: Basic Flag Evaluation
    totalTests++;
    if (await this.testFlagEvaluation('wallet_ui', { email: 'test@example.com' })) {
      testsPassed++;
    }

    // Test 3: Multiple Flags
    totalTests++;
    if (await this.testMultipleFlags()) {
      testsPassed++;
    }

    // Test 4: Different Context Types
    totalTests++;
    if (await this.testDifferentContextTypes()) {
      testsPassed++;
    }

    // Test 5: Error Handling
    totalTests++;
    if (await this.testErrorHandling()) {
      testsPassed++;
    }

    const totalTime = Date.now() - startTime;

    // Final Report
    console.log('\n═══════════════════════════════════════════');
    console.log('    LaunchDarkly Server Integration Report');
    console.log('═══════════════════════════════════════════');
    console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Success Rate: ${((testsPassed / totalTests) * 100).toFixed(1)}%`);
    
    if (testsPassed === totalTests) {
      console.log('✅ All tests passed! LaunchDarkly server integration is working correctly.');
      process.exit(0);
    } else {
      console.log('❌ Some tests failed. Check the output above for details.');
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const tester = new LaunchDarklyServerIntegrationTest();
  await tester.runFullTest();
}

// Handle cleanup on process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted by user');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Test terminated');
  process.exit(143);
});

// Run the tests
main().catch((_error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});
