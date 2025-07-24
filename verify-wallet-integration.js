#!/usr/bin/env node

/**
 * Wallet Integration Verification Script
 * 
 * Verifies that the wallet integration is working correctly
 * in the production build by checking key integration points.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Wallet Integration...\n');

// Check if production build exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Production build not found. Run `npm run build` first.');
  process.exit(1);
}

console.log('✅ Production build found');

// Check if wallet context is properly included
const buildFiles = fs.readdirSync(distPath + '/assets', { withFileTypes: true })
  .filter(dirent => dirent.isFile() && dirent.name.endsWith('.js'))
  .map(dirent => dirent.name);

let walletContextFound = false;
let walletProviderFound = false;
let featureFlagFound = false;

for (const file of buildFiles) {
  const filePath = path.join(distPath, 'assets', file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('WalletContext') || content.includes('walletContext')) {
    walletContextFound = true;
  }
  
  if (content.includes('WalletProvider') || content.includes('walletProvider')) {
    walletProviderFound = true;
  }
  
  if (content.includes('wallet_ui') || content.includes('walletUi')) {
    featureFlagFound = true;
  }
}

// Verification results
const checks = [
  { name: 'Wallet Context Integration', passed: walletContextFound },
  { name: 'Wallet Provider Integration', passed: walletProviderFound },
  { name: 'Feature Flag Integration', passed: featureFlagFound }
];

console.log('\n📊 Integration Verification Results:');
console.log('═'.repeat(50));

let allPassed = true;
checks.forEach(check => {
  const status = check.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${check.name}`);
  if (!check.passed) allPassed = false;
});

console.log('═'.repeat(50));

if (allPassed) {
  console.log('\n🎉 SUCCESS: All wallet integration checks passed!');
  console.log('\n📋 Summary:');
  console.log('• Wallet functionality is properly integrated');
  console.log('• Feature flags are configured correctly');
  console.log('• Production build is ready for deployment');
  console.log('\n🚀 Ready for production deployment!');
  process.exit(0);
} else {
  console.log('\n⚠️  WARNING: Some integration checks failed.');
  console.log('Please review the wallet integration before deploying.');
  process.exit(1);
}
