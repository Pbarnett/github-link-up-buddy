#!/usr/bin/env tsx
/**
 * Phase 4 Day 13-14 Validation Smoke Test
 * 
 * Terminal-agnostic Node.js implementation that validates:
 * 1. AWS credentials and connectivity
 * 2. Business rules config API endpoint
 * 3. Feature flags API endpoint
 * 
 * Addresses Warp terminal signal handling issues by avoiding shell dependencies.
 */

import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';

interface SmokeTestResult {
  configEndpoint: { status: number; jsonValid: boolean; data?: unknown };
  flagEndpoint: { status: number; jsonValid: boolean; data?: unknown };
  passed: boolean;
  timestamp: string;
}

interface SmokeTestConfig {
  baseUrl: string;
  timeout: number;
  userId: string;
  flagName: string;
}

const config: SmokeTestConfig = {
  baseUrl: 'http://localhost:5001',
  timeout: 10000, // 10 second timeout
  userId: 'smoke-tester@example.com',
  flagName: 'ENABLE_CONFIG_DRIVEN_FORMS'

/**
 * Validate AWS credentials using STS GetCallerIdentity
 * This is the only reliable way to verify credentials work
 */
async function validateAWSCredentials(): Promise<void> {
  console.log('🔐 Validating AWS credentials...');
  
  // Check for environment variables (helpful error if completely missing)
  const requiredEnvVars = ['AWS_REGION'];
  const missing = requiredEnvVars.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required AWS environment variables:');
    missing.forEach(env => console.error(`   - ${env}`););
    console.error('');
    console.error('💡 Please set: export AWS_REGION=us-east-1');
    throw new Error('AWS environment not configured');
  }
  
  try {
    // Use STS to validate credentials - this works with env vars, profiles, or IAM roles
    const sts = new STSClient({ region: process.env.AWS_REGION });
    const identity = await sts.send(new GetCallerIdentityCommand({}));
    
    console.log(`✅ AWS credentials validated`);
    console.log(`   Account: ${identity.Account}`);
    console.log(`   Region: ${process.env.AWS_REGION}`);
    console.log(`   Identity: ${identity.Arn?.split('/').pop() || 'Unknown'}`);
    
  } catch (error: unknown) {
    console.error('❌ AWS credential validation failed:');
    console.error(`   ${error instanceof Error ? error.message : String(error);}`);
    console.error('');
    console.error('💡 Please configure AWS credentials:');
    console.error('   - Set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY');
    console.error('   - Or configure AWS profile: aws configure');
    console.error('   - Or use AWS SSO: aws sso login');
    throw new Error('Invalid or missing AWS credentials');
  }
}

/**
 * Make HTTP request with timeout and proper error handling
 */
async function makeRequest(url: string, options: RequestInit = {}): Promise<{ status: number; data: unknown; jsonValid: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    let data: unknown;
    let jsonValid = false;
    
    try {
      const text = await response.text();
      data = JSON.parse(text);
      jsonValid = true;
    } catch (error) {
      data = { error: 'Invalid JSON response', rawResponse: data };
      jsonValid = false;
    }
    
    return {
      status: response.status,
      data,
      jsonValid
    };
    
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${config.timeout}ms`);
    }
    throw error;
  }
}

/**
 * Test the business rules config endpoint
 */
async function testConfigEndpoint(): Promise<{ status: number; jsonValid: boolean; data?: unknown }> {
  console.log('🔍 Testing Business Rules Config endpoint...');
  
  try {
    const result = await makeRequest(`${config.baseUrl}/api/business-rules/config`);
    
    if (result.status === 200 && result.jsonValid) {
      console.log(`✅ Config endpoint: HTTP ${result.status}, JSON valid`);
      const dataObj = result.data as Record<string, unknown>;
      console.log(`   Version: ${dataObj?.version || 'unknown'}`);
      console.log(`   Environment: ${dataObj?.environment || 'unknown'}`);
    } else {
      console.log(`❌ Config endpoint: HTTP ${result.status}, JSON valid = ${result.jsonValid}`);
    }
    
    return result;
    
  } catch (error: unknown) {
    console.log(`❌ Config endpoint failed: ${error instanceof Error ? error.message : String(error)}`);
    return { status: 0, jsonValid: false, data: { error: error instanceof Error ? error.message : String(error) } };
  }
}

/**
 * Test the feature flags endpoint
 */
async function testFeatureFlagEndpoint(): Promise<{ status: number; jsonValid: boolean; data?: unknown }> {
  console.log('🔍 Testing Feature Flag endpoint...');
  
  try {
    const result = await makeRequest(
      `${config.baseUrl}/api/feature-flags/${config.flagName}`,
      {
        headers: {
          'x-user-id': config.userId,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (result.status === 200 && result.jsonValid) {
      console.log(`✅ Feature flag endpoint: HTTP ${result.status}, JSON valid`);
      const dataObj = result.data as Record<string, unknown>;
      console.log(`   Enabled: ${dataObj?.enabled !== undefined ? dataObj.enabled : 'unknown'}`);
      console.log(`   User in rollout: ${dataObj?.userInRollout !== undefined ? dataObj.userInRollout : 'unknown'}`);
    } else {
      console.log(`❌ Feature flag endpoint: HTTP ${result.status}, JSON valid = ${result.jsonValid}`);
    }
    
    return result;
    
  } catch (error: unknown) {
    console.log(`❌ Feature flag endpoint failed: ${error instanceof Error ? error.message : String(error)}`);
    return { status: 0, jsonValid: false, data: { error: error instanceof Error ? error.message : String(error) } };
  }
}

/**
 * Main smoke test execution
 */
async function runSmokeTests(): Promise<SmokeTestResult> {
  console.log('🚀 Running Phase 4 Day 13-14 Validation Results smoke test...');
  console.log(`📡 Target: ${config.baseUrl}`);
  console.log('');
  
  try {
    // Step 1: Validate AWS credentials
    await validateAWSCredentials();
    console.log('');
    
    // Step 2: Test both endpoints
    const [configResult, flagResult] = await Promise.all([
      testConfigEndpoint(),
      testFeatureFlagEndpoint()
    ]);
    
    // Step 3: Evaluate results
    const configOK = configResult.status === 200 && configResult.jsonValid
    const flagOK = flagResult.status === 200 && flagResult.jsonValid
    const passed = configOK && flagOK;
    
    // Step 4: Print summary
    console.log('');
    console.log('================ Smoke-Test Summary ================');
    console.log(`Config endpoint : HTTP ${configResult.status} , JSON valid = ${configOK}`);
    console.log(`Flag   endpoint : HTTP ${flagResult.status} , JSON valid = ${flagOK}`);
    console.log('====================================================');
    console.log('');
    
    if (passed) {
      console.log('✅ Smoke tests PASSED. Proceed to **Phase 4 Day 15 – Monitoring & Alerting setup**.');
    } else {
      console.log('❌ Smoke tests FAILED.');
      
      if (!configOK) {
        console.log('👉 /api/business-rules/config response:');
        console.log(JSON.stringify(configResult.data, null, 2));
      }
      
      if (!flagOK) {
        console.log('👉 /api/feature-flags/ENABLE_CONFIG_DRIVEN_FORMS response:');
        console.log(JSON.stringify(flagResult.data, null, 2));
      }
      
      console.log('💡 Please investigate the failing endpoint(s) and re-run the smoke tests.');
    }
    
    console.log('🏁 Phase 4 Day 13-14 Validation Results smoke test completed!');
    
    return {
      configEndpoint: configResult,
      flagEndpoint: flagResult,
      passed,
      timestamp: new Date().toISOString()
    };
    
  } catch (error: unknown) {
    console.error('❌ Smoke test failed with error:', error instanceof Error ? error.message : String(error););
    throw error;
  }
}

/**
 * Signal handling for graceful shutdown
 */
function setupSignalHandlers(): void {
  const signals = ['SIGINT', 'SIGTERM'] as const;
  
  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      process.exit(130); // Standard exit code for interrupted script
    });
  });
}

/**
 * Main execution when run as script
 */
async function main(): Promise<void> {
  setupSignalHandlers();
  
  try {
    const result = await runSmokeTests();
    process.exit(result.passed ? 0 : 1);
  } catch (error) {
    process.exit(1);
  }
}

// Export for testing, run if executed directly
module.exports = { runSmokeTests, validateAWSCredentials };

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
