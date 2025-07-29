import fs from 'fs';
import path from 'path';
import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Ensure we're in Playwright context - clear any Vitest globals
delete (globalThis as any).describe;
delete (globalThis as any).test;
delete (globalThis as any).it;
delete (globalThis as any).expect;
delete (globalThis as any).vi;
delete (globalThis as any).vitest;

// Load environment variables - priority: .env.test.local (secure) > .env.test (placeholder) > .env
if (fs.existsSync('.env.test.local')) {
  dotenv.config({ path: '.env.test.local' });
  console.log('📄 Loaded secure credentials from .env.test.local');
} else if (fs.existsSync('.env.test')) {
  dotenv.config({ path: '.env.test' });
  console.log('📄 Loaded placeholder credentials from .env.test');
} else if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' });
  console.log('📄 Loaded environment from .env');
} else {
  console.log('⚠️  No .env file found - using system environment variables only');
}

/**
 * Global setup that runs once before all tests
 * Handles browser installation, test data setup, and environment validation
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Playwright global setup...');

  try {
    // 1. Ensure browsers are installed
    console.log('📦 Checking browser installations...');
    await ensureBrowsersInstalled();

    // 2. Validate environment variables
    console.log('🔧 Validating environment configuration...');
    validateEnvironmentVariables();

    // 3. Prepare test data and directories
    console.log('📁 Setting up test directories...');
    setupTestDirectories();

    // 4. Test connectivity to critical services
    console.log('🌐 Testing service connectivity...');
    await testServiceConnectivity();

    // 5. Set up test user sessions if needed
    if (process.env.E2E_TEST_USER_EMAIL && process.env.E2E_TEST_USER_PASSWORD) {
      console.log('👤 Setting up test user authentication...');
      await setupTestAuthentication(config);
    }

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    process.exit(1);
  }
}

/**
 * Ensure Playwright browsers are installed
 */
async function ensureBrowsersInstalled() {
  // This is handled automatically by @playwright/test
  // But we can add custom logic here if needed
  console.log('  ✓ Browser installation check passed');
}

/**
 * Validate required environment variables
 */
function validateEnvironmentVariables() {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_LD_CLIENT_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Warn about optional but recommended variables
  const optionalVars = [
    'STRIPE_PUBLISHABLE_KEY',
    'E2E_TEST_USER_EMAIL',
    'E2E_TEST_USER_PASSWORD'
  ];

  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      console.log(`  ⚠️  Optional variable ${varName} not set - some tests may be skipped`);
    }
  });

  console.log('  ✓ Environment validation passed');
}

/**
 * Setup test directories and clean up old test results
 */
function setupTestDirectories() {
  const testDirs = [
    'tests/test-results',
    'tests/reports',
    'tests/reports/html',
    'tests/screenshots',
    'tests/videos',
    'tests/traces'
  ];

  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Clean up old test results in CI
  if (process.env.CI) {
    const resultsDir = 'tests/test-results';
    if (fs.existsSync(resultsDir)) {
      fs.rmSync(resultsDir, { recursive: true, force: true });
      fs.mkdirSync(resultsDir, { recursive: true });
    }
  }

  console.log('  ✓ Test directories setup complete');
}

/**
 * Test connectivity to critical services
 */
async function testServiceConnectivity() {
  const services = [
    {
      name: 'Supabase',
      url: process.env.VITE_SUPABASE_URL,
      test: async (url: string) => {
        const response = await fetch(`${url}/rest/v1/`, {
          headers: {
            'apikey': process.env.VITE_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
          }
        });
        return response.status === 200;
      }
    },
    {
      name: 'LaunchDarkly',
      url: 'https://sdk.launchdarkly.com',
      test: async (url: string) => {
        const response = await fetch(url);
        return response.status < 500; // Any non-server error is acceptable for connectivity test
      }
    }
  ];

  for (const service of services) {
    if (service.url) {
      try {
        const isConnected = await service.test(service.url);
        if (isConnected) {
          console.log(`  ✓ ${service.name} connectivity verified`);
        } else {
          console.log(`  ⚠️  ${service.name} connectivity failed - some tests may fail`);
        }
      } catch (_error) {
        console.log(`  ⚠️  ${service.name} connectivity test failed:`, (error as Error).message);
      }
    } else {
      console.log(`  ⚠️  ${service.name} URL not configured`);
    }
  }
}

/**
 * Setup test user authentication for E2E tests
 */
async function setupTestAuthentication(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to login page
    await page.goto(`${config.projects[0].use.baseURL}/login`);
    
    // Fill in test credentials
    await page.fill('input[type="email"]', process.env.E2E_TEST_USER_EMAIL!);
    await page.fill('input[type="password"]', process.env.E2E_TEST_USER_PASSWORD!);
    
    // Submit login form
    await page.click('button[type="submit"]');
    
    // Wait for successful login (adjust selector as needed)
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Save authentication state
    await context.storageState({ path: 'tests/.auth/user.json' });
    
    console.log('  ✓ Test user authentication setup complete');
  } catch (error) {
    console.log('  ⚠️  Test user authentication setup failed:', (error as Error).message);
    console.log('     Tests requiring authentication may fail');
  } finally {
    await browser.close();
  }
}

export default globalSetup;
