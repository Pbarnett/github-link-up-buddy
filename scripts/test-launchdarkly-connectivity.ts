#!/usr/bin/env tsx
import { initialize, LDClient } from 'launchdarkly-js-client-sdk';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Test configuration
interface TestConfig {
  timeout: number;
  retryAttempts: number;
  simulateNetworkIssues: boolean;
  verbose: boolean;
}

const DEFAULT_CONFIG: TestConfig = {
  timeout: 10000,
  retryAttempts: 3,
  simulateNetworkIssues: false,
  verbose: false

// Known feature flags to test
const KNOWN_FLAGS = [
  'personalization_greeting',
  'show_opt_out_banner',
  'profile_ui_revamp',
  'wallet_ui'
];

class LaunchDarklyConnectivityTest {
  private config: TestConfig;
  private results: {
    initialization: boolean;
    flagEvaluations: Record<string, unknown>;
    contextUpdates: boolean;
    errors: string[];
    totalTime: number;
  };

  constructor(config: Partial<TestConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.results = {
      initialization: false,
      flagEvaluations: {},
      contextUpdates: false,
      errors: [],
      totalTime: 0
    };
  }

  private console.log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    if (!this.config.verbose && level === 'info') return;
    
    const timestamp = new Date().toISOString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number, operation: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }

  private async simulateNetworkDelay(): Promise<void> {
    if (!this.config.simulateNetworkIssues) return;
    
    // Simulate random network delays between 100ms and 2000ms
    const delay = Math.random() * 1900 + 100;
    this.log(`Simulating network delay: ${delay.toFixed(0)}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Randomly fail some operations (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Simulated network failure');
    }
  }

  async testInitialization(): Promise<boolean> {
    this.log('🔄 Testing LaunchDarkly initialization...');
    
    try {
      const clientId = process.env.VITE_LD_CLIENT_ID
      if (!clientId) {
        throw new Error('VITE_LD_CLIENT_ID is missing from environment variables');
      }

      this.log(`Using client ID: ${clientId.substring(0, 8)}...${clientId.substring(clientId.length - 8)}`);

      // Create test context
      const context = {
        key: 'connectivity-test-user',
        email: 'test@example.com',
        kind: 'user' as const,
        name: 'Connectivity Test User',
        testRun: true
      };

      let attempt = 0;
      let client;
      
      while (attempt < this.config.retryAttempts) {
        try {
          attempt++;
          this.log(`Initialization attempt ${attempt}/${this.config.retryAttempts}`);
          
          await this.simulateNetworkDelay();
          
          client = initialize(clientId, context);
          
          await this.withTimeout(
            client.waitForInitialization(),
            this.config.timeout,
            'LaunchDarkly initialization'
          );
          
          this.log('✅ LaunchDarkly client initialized successfully');
          this.results.initialization = true;
          return true;
          
        } catch {
          this.log(`Attempt ${attempt} failed: ${errorMessage}`, 'warn');
          this.results.errors.push(`Init attempt ${attempt}: ${errorMessage}`);
          
          if (attempt === this.config.retryAttempts) {
            throw error;
          }
          
          // Exponential backoff
          const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          this.log(`Retrying in ${backoffDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
        }
      }
      
      return false;
      
    } catch (error) {
      this.log(`❌ Initialization failed: ${errorMessage}`, 'error');
      this.results.errors.push(`Initialization: ${errorMessage}`);
      return false;
    }
  }

  async testFlagEvaluations(client: LDClient): Promise<Record<string, unknown>> {
    this.log('🚩 Testing feature flag evaluations...');
    const results: Record<string, unknown> = {};
    
    for (const flagKey of KNOWN_FLAGS) {
      try {
        await this.simulateNetworkDelay();
        
        const flagValue = client.variation(flagKey, false);
        results[flagKey] = flagValue;
        this.log(`  ${flagKey}: ${JSON.stringify(flagValue)}`);
        
      } catch {
        this.log(`  ${flagKey}: ERROR - ${errorMessage}`, 'error');
        results[flagKey] = { error: errorMessage };
        this.results.errors.push(`Flag ${flagKey}: ${errorMessage}`);
      }
    }
    
    // Test unknown flag
    try {
      const unknownFlag = client.variation('unknown_test_flag_' + Date.now(), 'default');
      results['unknown_flag_test'] = unknownFlag;
      this.log(`  unknown_flag_test: ${JSON.stringify(unknownFlag)}`);
    } catch {
      results['unknown_flag_test'] = { error: errorMessage };
    }
    
    this.results.flagEvaluations = results;
    return results;
  }

  async testContextUpdates(client: LDClient): Promise<boolean> {
    this.log('👤 Testing context updates...');
    
    try {
      await this.simulateNetworkDelay();
      
      const newContext = {
        key: 'updated-test-user',
        email: 'updated@example.com',
        kind: 'user' as const,
        name: 'Updated Test User',
        subscription: 'premium',
        testRun: true,
        updateTimestamp: Date.now()
      };
      
      await this.withTimeout(
        client.identify(newContext),
        this.config.timeout,
        'Context update'
      );
      
      this.log('✅ Context updated successfully');
      this.results.contextUpdates = true;
      return true;
      
    } catch (error) {
      this.log(`❌ Context update failed: ${errorMessage}`, 'error');
      this.results.errors.push(`Context update: ${errorMessage}`);
      return false;
    }
  }

  async testEventTracking(client: LDClient): Promise<boolean> {
    this.log('📊 Testing event tracking...');
    
    try {
      await this.simulateNetworkDelay();
      
      // Track a custom event
      client.track('connectivity_test', {
        testRun: true,
        timestamp: new Date().toISOString(),
        testConfig: this.config
      });
      
      // Flush events
      await this.withTimeout(
        client.flush(),
        this.config.timeout,
        'Event flush'
      );
      
      this.log('✅ Event tracking successful');
      return true;
      
    } catch (error) {
      this.log(`❌ Event tracking failed: ${errorMessage}`, 'error');
      this.results.errors.push(`Event tracking: ${errorMessage}`);
      return false;
    }
  }

  generateReport(): string {
    const report = [
      '═══════════════════════════════════════════',
      '    LaunchDarkly Connectivity Test Report',
      '═══════════════════════════════════════════',
      '',
      `Test Configuration:`,
      `  • Timeout: ${this.config.timeout}ms`,
      `  • Retry Attempts: ${this.config.retryAttempts}`,
      `  • Network Issues Simulation: ${this.config.simulateNetworkIssues ? 'ON' : 'OFF'}`,
      `  • Total Test Time: ${this.results.totalTime}ms`,
      '',
      `Results Summary:`,
      `  • Initialization: ${this.results.initialization ? '✅ PASS' : '❌ FAIL'}`,
      `  • Context Updates: ${this.results.contextUpdates ? '✅ PASS' : '❌ FAIL'}`,
      `  • Flag Evaluations: ${Object.keys(this.results.flagEvaluations).length} flags tested`,
      '',
      'Feature Flag Results:',
    ];
    
    for (const [flag, value] of Object.entries(this.results.flagEvaluations)) {
      if (typeof value === 'object' && 'error' in value) {
        report.push(`  • ${flag}: ❌ ERROR - ${value.error}`);
      } else {
        report.push(`  • ${flag}: ✅ ${JSON.stringify(value)}`);
      }
    }
    
    if (this.results.errors.length > 0) {
      report.push('', 'Errors Encountered:');
      this.results.errors.forEach(error => {
        report.push(`  • ${error}`);
      });
    }
    
    report.push('', '═══════════════════════════════════════════');
    
    return report.join('\n');
  }

  async runFullTest(): Promise<void> {
    const startTime = Date.now();
    
    console.log('🧪 Starting LaunchDarkly Connectivity Test...\n');
    
    // Test initialization
    const initSuccess = await this.testInitialization();
    
    if (!initSuccess) {
      console.log('\n❌ Cannot proceed with further tests - initialization failed');
      this.results.totalTime = Date.now() - startTime;
      console.log(this.generateReport());
      process.exit(1);
    }
    
    // Create a new client for the remaining tests
    const clientId = process.env.VITE_LD_CLIENT_ID!;
    const context = {
      key: 'connectivity-test-user',
      email: 'test@example.com',
      kind: 'user' as const,
      name: 'Connectivity Test User',
      testRun: true
    };
    
    const client = initialize(clientId, context);
    await client.waitForInitialization();
    
    try {
      // Test flag evaluations
      await this.testFlagEvaluations(client);
      
      // Test context updates
      await this.testContextUpdates(client);
      
      // Test event tracking
      await this.testEventTracking(client);
      
    } finally {
      // Clean up
      client.close();
      this.results.totalTime = Date.now() - startTime;
    }
    
    console.log(this.generateReport());
    
    // Exit with appropriate code
    const hasErrors = this.results.errors.length > 0;
    const allTestsPassed = this.results.initialization && this.results.contextUpdates
    
    if (hasErrors || !allTestsPassed) {
      console.log('\n❌ Some tests failed - check the report above');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed successfully!');
      process.exit(0);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const config: Partial<TestConfig> = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--timeout':
        config.timeout = parseInt(args[++i]) || DEFAULT_CONFIG.timeout
        break;
      case '--retries':
        config.retryAttempts = parseInt(args[++i]) || DEFAULT_CONFIG.retryAttempts
        break;
      case '--simulate-network-issues':
        config.simulateNetworkIssues = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--help':
        console.log(`
LaunchDarkly Connectivity Test Utility

Usage: npx tsx scripts/test-launchdarkly-connectivity.ts [options]

Options:
  --timeout <ms>              Set timeout for operations (default: 10000)
  --retries <count>           Number of retry attempts (default: 3)
  --simulate-network-issues   Simulate network delays and failures
  --verbose                   Enable verbose logging
  --help                      Show this help message

Environment Variables:
  VITE_LD_CLIENT_ID          LaunchDarkly client-side ID (required)

Examples:
  # Basic test
  npx tsx scripts/test-launchdarkly-connectivity.ts
  # Test with network simulation
  npx tsx scripts/test-launchdarkly-connectivity.ts --simulate-network-issues --verbose
  
  # Test with custom timeout and retries
  npx tsx scripts/test-launchdarkly-connectivity.ts --timeout 5000 --retries 5
        `);
        process.exit(0);
    }
  }
  
  const tester = new LaunchDarklyConnectivityTest(config);
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
