#!/usr/bin/env node

/**
 * Duffel Environment Test Script
 * 
 * This script tests the Duffel API environment configuration
 * and validates connectivity before proceeding with integration.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 DUFFEL ENVIRONMENT TEST SCRIPT');
console.log('=====================================\n');

// Test 1: Check environment files exist
console.log('1️⃣ Checking environment files...');

const envFiles = [
  'supabase/.env.example',
  'supabase/.env',
  '.env.example'
];

envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file} ${exists ? 'exists' : 'missing'}`);
  
  if (exists && file.includes('.env') && !file.includes('example')) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasDuffelKey = content.includes('DUFFEL_API_KEY=duffel_');
      const hasWebhookSecret = content.includes('DUFFEL_WEBHOOK_SECRET=');
      
      console.log(`      ${hasDuffelKey ? '✅' : '❌'} Contains Duffel API key`);
      console.log(`      ${hasWebhookSecret ? '✅' : '❌'} Contains webhook secret`);
    } catch (err) {
      console.log(`      ❌ Error reading file: ${err.message}`);
    }
  }
});

console.log();

// Test 2: Check for API key in environment
console.log('2️⃣ Checking environment variables...');

const envVars = [
  'DUFFEL_API_KEY',
  'DUFFEL_WEBHOOK_SECRET',
  'DUFFEL_LIVE'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  const exists = !!value;
  console.log(`   ${exists ? '✅' : '❌'} ${varName} ${exists ? 'set' : 'not set'}`);
  
  if (exists && varName === 'DUFFEL_API_KEY') {
    const isValidFormat = value.startsWith('duffel_test_') || value.startsWith('duffel_live_');
    console.log(`      ${isValidFormat ? '✅' : '❌'} Valid format ${isValidFormat ? '(duffel_test_* or duffel_live_*)' : '(should start with duffel_test_ or duffel_live_)'}`);
  }
});

console.log();

// Test 3: Test API connectivity (if running locally)
console.log('3️⃣ Testing API connectivity...');

async function testDuffelConnectivity() {
  try {
    // Check if Supabase functions are running
    const testUrl = 'http://localhost:54321/functions/v1/duffel-test';
    
    console.log('   📡 Attempting to connect to Duffel test function...');
    console.log(`   URL: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Duffel test function responding');
      console.log(`   📊 Test result: ${data.success ? 'SUCCESS' : 'FAILED'}`);
      
      if (data.tests) {
        console.log(`   🔗 Connectivity: ${data.tests.connectivity ? 'OK' : 'FAILED'}`);
        if (data.tests.offers) {
          console.log(`   🎫 Offers found: ${data.tests.offers.count || 0}`);
        }
      }
    } else {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`);
      console.log('   💡 Make sure Supabase functions are running: npx supabase functions serve');
    }
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    console.log('   💡 Make sure Supabase functions are running: npx supabase functions serve');
  }
}

// Only test connectivity if fetch is available (Node 18+)
if (typeof fetch !== 'undefined') {
  testDuffelConnectivity();
} else {
  console.log('   ⏭️  Skipping connectivity test (Node.js version < 18)');
  console.log('   💡 To test manually, run: curl -X POST http://localhost:54321/functions/v1/duffel-test');
}

console.log();

// Test 4: Provide next steps
console.log('4️⃣ Next Steps:');
console.log();

// Check what needs to be done
const supabaseEnvExists = fs.existsSync(path.join(__dirname, 'supabase/.env'));
let needsApiKey = true;

if (supabaseEnvExists) {
  try {
    const content = fs.readFileSync(path.join(__dirname, 'supabase/.env'), 'utf8');
    needsApiKey = !content.includes('DUFFEL_API_KEY=duffel_');
  } catch (err) {
    // File exists but can't read it
  }
}

if (!supabaseEnvExists) {
  console.log('   📋 STEP 1: Create supabase/.env file');
  console.log('      cp supabase/.env.example supabase/.env');
  console.log();
}

if (needsApiKey) {
  console.log('   🔑 STEP 2: Get Duffel API Key');
  console.log('      1. Sign up at: https://app.duffel.com/signup');
  console.log('      2. Go to Settings → API Keys');
  console.log('      3. Create test API key');
  console.log('      4. Add to supabase/.env: DUFFEL_API_KEY=duffel_test_YOUR_KEY');
  console.log();
}

console.log('   🚀 STEP 3: Start Supabase functions');
console.log('      npx supabase functions serve');
console.log();

console.log('   🧪 STEP 4: Test the setup');
console.log('      node test-duffel-environment.js');
console.log();

console.log('   📖 STEP 5: Read the full setup guide');
console.log('      docs/DUFFEL_ENVIRONMENT_SETUP.md');
console.log();

console.log('✨ Environment test complete!');
console.log('=====================================');
