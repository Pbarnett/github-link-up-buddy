#!/usr/bin/env node
/**
 * Validation script for wallet system integration changes
 * This script validates the key changes without requiring full TypeScript compilation
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const rootDir = process.cwd();

function validateChange(description, validateFn) {
  try {
    console.log(`🔍 Validating: ${description}`);
    validateFn();
    console.log(`✅ VALID: ${description}`);
  } catch (error) {
    console.log(`❌ INVALID: ${description}`);
    console.log(`   Reason: ${error.message}`);
    return false;
  }
  return true;
}

let allValid = true;

// Validate 1: WalletProvider is now global in App.tsx
allValid &= validateChange("WalletProvider moved to global scope", () => {
  const appContent = readFileSync(join(rootDir, 'src/App.tsx'), 'utf8');
  
  if (!appContent.includes('<PersonalizationWrapper>')) {
    throw new Error('PersonalizationWrapper not found');
  }
  
  if (!appContent.includes('<WalletProvider>')) {
    throw new Error('WalletProvider not found at global level');
  }
  
  // Check that WalletProvider is wrapped around the navigation/routes
  const walletProviderIndex = appContent.indexOf('<WalletProvider>');
  const navigationIndex = appContent.indexOf('<NavigationWrapper />');
  const routesIndex = appContent.indexOf('<Routes>');
  
  if (walletProviderIndex === -1 || navigationIndex === -1 || routesIndex === -1) {
    throw new Error('Could not find required components');
  }
  
  if (walletProviderIndex > navigationIndex || walletProviderIndex > routesIndex) {
    throw new Error('WalletProvider is not wrapping navigation and routes');
  }
});

// Validate 2: wallet_ui feature flag is set to 5%
allValid &= validateChange("wallet_ui feature flag updated to 5%", () => {
  const flagContent = readFileSync(join(rootDir, 'src/shared/featureFlag.ts'), 'utf8');
  
  if (!flagContent.includes('wallet_ui')) {
    throw new Error('wallet_ui flag not found');
  }
  
  // Look for the wallet_ui flag configuration
  const walletUiRegex = /wallet_ui:\s*{[\s\S]*?}/;
  const walletUiMatch = flagContent.match(walletUiRegex);
  
  if (!walletUiMatch) {
    throw new Error('wallet_ui flag configuration not found');
  }
  
  const walletUiConfig = walletUiMatch[0];
  
  if (!walletUiConfig.includes('enabled: true')) {
    throw new Error('wallet_ui flag is not enabled');
  }
  
  if (!walletUiConfig.includes('rolloutPercentage: 5')) {
    throw new Error('wallet_ui rollout is not set to 5%');
  }
});

// Validate 3: Redundant WalletProvider removed from /wallet route
allValid &= validateChange("Redundant WalletProvider removed from wallet route", () => {
  const appContent = readFileSync(join(rootDir, 'src/App.tsx'), 'utf8');
  
  // Look for the wallet route
  const walletRouteRegex = /<Route[^>]*path="\/wallet"[^>]*element=\{[^}]*\}/;
  const walletRouteMatch = appContent.match(walletRouteRegex);
  
  if (!walletRouteMatch) {
    throw new Error('Wallet route not found');
  }
  
  const walletRoute = walletRouteMatch[0];
  
  if (walletRoute.includes('WalletProvider')) {
    throw new Error('WalletProvider still exists in wallet route');
  }
  
  if (!walletRoute.includes('<Wallet />')) {
    throw new Error('Wallet component not found in route');
  }
});

// Validate 4: Profile.tsx no longer has local WalletProvider
allValid &= validateChange("Profile.tsx cleaned up from local WalletProvider", () => {
  const profileContent = readFileSync(join(rootDir, 'src/pages/Profile.tsx'), 'utf8');
  
  // Should import useWallet but not WalletProvider
  if (!profileContent.includes('import { useWallet }')) {
    throw new Error('useWallet import not found');
  }
  
  // Should NOT import WalletProvider locally
  if (profileContent.includes('import { WalletProvider')) {
    throw new Error('WalletProvider is still imported locally');
  }
  
  // Check that WalletTab is not wrapped with WalletProvider
  const walletTabRegex = /<WalletTab[\s\S]*?\/>/;
  const walletTabMatch = profileContent.match(walletTabRegex);
  
  if (walletTabMatch) {
    const beforeWalletTab = profileContent.substring(0, walletTabMatch.index);
    const afterWalletTabIndex = walletTabMatch.index + walletTabMatch[0].length;
    const afterWalletTab = profileContent.substring(afterWalletTabIndex, afterWalletTabIndex + 200);
    
    // Check that there's no WalletProvider wrapper around WalletTab
    if (beforeWalletTab.includes('<WalletProvider>') && afterWalletTab.includes('</WalletProvider>')) {
      const walletProviderStartIndex = beforeWalletTab.lastIndexOf('<WalletProvider>');
      const walletProviderEndIndex = afterWalletTab.indexOf('</WalletProvider>') + afterWalletTabIndex;
      
      if (walletProviderStartIndex > beforeWalletTab.lastIndexOf('<TabsContent')) {
        throw new Error('WalletProvider still wraps WalletTab');
      }
    }
  }
});

// Validate 5: WalletContext import structure is correct
allValid &= validateChange("WalletContext import is consistent", () => {
  const contextContent = readFileSync(join(rootDir, 'src/contexts/WalletContext.tsx'), 'utf8');
  
  if (!contextContent.includes('export function WalletProvider')) {
    throw new Error('WalletProvider export not found');
  }
  
  if (!contextContent.includes('export function useWallet')) {
    throw new Error('useWallet export not found');
  }
  
  // Verify the context structure is intact
  if (!contextContent.includes('WalletContext.Provider')) {
    throw new Error('WalletContext.Provider not found');
  }
});

console.log('\n' + '='.repeat(60));
if (allValid) {
  console.log('🎉 ALL WALLET INTEGRATION CHANGES VALIDATED SUCCESSFULLY!');
  console.log('\n📋 Changes Summary:');
  console.log('  ✅ WalletProvider moved to global scope in App.tsx');
  console.log('  ✅ wallet_ui feature flag enabled with 5% rollout');
  console.log('  ✅ Redundant WalletProvider instances removed');
  console.log('  ✅ Clean import structure maintained');
  console.log('\n🚀 Ready for testing!');
  console.log('\nNext steps:');
  console.log('  1. Start the dev server: npm run dev');
  console.log('  2. Navigate to /profile and check if wallet tab appears');
  console.log('  3. Test wallet functionality across different pages');
  console.log('  4. Verify feature flag rollout is working');
} else {
  console.log('❌ SOME VALIDATIONS FAILED');
  console.log('Please review and fix the issues above before proceeding.');
  process.exit(1);
}
