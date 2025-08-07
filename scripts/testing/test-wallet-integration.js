#!/usr/bin/env node
/**
 * Integration test for wallet system changes
 * Tests:
 * 1. Wallet context is globally available
 * 2. Feature flag rollout is set to 5%
 * 3. No duplicate WalletProvider wrapping
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();

function runTest(testName, testFn) {
  try {
    console.log(`🧪 Testing: ${testName}`);
    testFn();
    console.log(`✅ PASSED: ${testName}`);
  } catch (error) {
    console.log(`❌ FAILED: ${testName}`);
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Test 1: Check App.tsx has WalletProvider at global level
runTest("WalletProvider is at global level in App.tsx", () => {
  const appContent = readFileSync(join(rootDir, 'src/App.tsx'), 'utf8');
  
  // Should have WalletProvider wrapping the router
  if (!appContent.includes('<PersonalizationWrapper>')) {
    throw new Error('PersonalizationWrapper not found');
  }
  
  if (!appContent.includes('<WalletProvider>')) {
    throw new Error('WalletProvider not found at global level');
  }
  
  // Should NOT have WalletProvider in wallet route anymore
  const walletRouteMatch = appContent.match(/<Route[^>]*path="\/wallet"[^>]*element=\{[^}]*\}/);
  if (walletRouteMatch && walletRouteMatch[0].includes('WalletProvider')) {
    throw new Error('WalletProvider still exists in wallet route');
  }
});

// Test 2: Check feature flag rollout is updated
runTest("wallet_ui feature flag is set to 5% rollout", () => {
  const flagContent = readFileSync(join(rootDir, 'src/shared/featureFlag.ts'), 'utf8');
  
  // Check for wallet_ui flag with 5% rollout
  if (!flagContent.includes('wallet_ui')) {
    throw new Error('wallet_ui flag not found');
  }
  
  if (!flagContent.includes('rolloutPercentage: 5')) {
    throw new Error('wallet_ui rollout not set to 5%');
  }
  
  if (!flagContent.includes('enabled: true')) {
    throw new Error('wallet_ui flag not enabled');
  }
});

// Test 3: Check Profile.tsx no longer has local WalletProvider
runTest("Profile.tsx no longer has redundant WalletProvider", () => {
  const profileContent = readFileSync(join(rootDir, 'src/pages/Profile.tsx'), 'utf8');
  
  // Should import useWallet but not WalletProvider
  if (!profileContent.includes('import { useWallet }')) {
    throw new Error('useWallet import not found');
  }
  
  // Should NOT import WalletProvider locally
  if (profileContent.includes('import { WalletProvider,')) {
    throw new Error('WalletProvider is still imported locally in Profile.tsx');
  }
  
  // Should NOT wrap WalletTab with WalletProvider
  const walletTabMatch = profileContent.match(/<TabsContent value="wallet"[^>]*>[\s\S]*?<\/TabsContent>/);
  if (walletTabMatch && walletTabMatch[0].includes('<WalletProvider>')) {
    throw new Error('WalletProvider still wraps WalletTab in Profile.tsx');
  }
});

// Test 4: Check build passes
runTest("Build passes without errors", () => {
  try {
    execSync('npm run build', { stdio: 'pipe', cwd: rootDir });
  } catch (error) {
    throw new Error('Build failed');
  }
});

// Test 5: Check TypeScript compilation
runTest("TypeScript compilation passes", () => {
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: rootDir });
  } catch (error) {
    throw new Error('TypeScript compilation failed');
  }
});

console.log('\n🎉 All integration tests passed!');
console.log('\n📋 Summary of changes:');
console.log('  ✅ WalletProvider moved to global context in App.tsx');
console.log('  ✅ wallet_ui feature flag enabled with 5% rollout');
console.log('  ✅ Redundant WalletProvider instances removed');
console.log('  ✅ Build and TypeScript compilation successful');
console.log('\n🚀 The wallet system is now integrated globally and ready for testing!');
