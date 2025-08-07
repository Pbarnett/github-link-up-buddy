#!/usr/bin/env tsx

/**
 * Quick script to enable the personalization_greeting flag for testing
 * This will allow you to see your friend-test greetings in action
 */

import { config } from 'dotenv';
config();

console.log('🎯 Enabling personalization_greeting flag for testing...\n');

// Method 1: Add to localStorage (for development override)
const enableLocalOverride = () => {
  console.log('📝 Method 1: Local Development Override');
  console.log('Add this to your browser console or use the FlagOverridePanel:');
  console.log(`localStorage.setItem('launchDarkly_override_personalization_greeting', 'true');`);
  console.log('Then refresh your app.\n');
};

// Method 2: Check current LaunchDarkly flag status
const checkCurrentStatus = async () => {
  console.log('🔍 Method 2: Checking current LaunchDarkly status...');
  
  try {
    // Run the existing verification script to see current flag values
    const { execSync } = await import('child_process');
    const result = execSync('npx tsx scripts/verify-launchdarkly.ts', { encoding: 'utf8' });
    console.log(result);
  } catch (error) {
    console.error('Error checking LaunchDarkly status:', error);
  }
};

// Method 3: Instructions for LaunchDarkly dashboard
const dashboardInstructions = () => {
  console.log('🌐 Method 3: Enable in LaunchDarkly Dashboard');
  console.log('1. Go to your LaunchDarkly dashboard');
  console.log('2. Find the "personalization_greeting" flag');
  console.log('3. Set it to "true" for your environment');
  console.log('4. Save the changes\n');
};

// Method 4: Test with temporary override in code
const codeOverrideInstructions = () => {
  console.log('🧪 Method 4: Temporary Code Override');
  console.log('In src/lib/personalization/featureFlags.ts, temporarily return true:');
  console.log(`
export function enablePersonalizationForTesting(): boolean {
  return true; // ← Temporarily enable for testing
}
  `);
  console.log('Remember to revert this change before production!\n');
};

const main = async () => {
  enableLocalOverride();
  dashboardInstructions();
  codeOverrideInstructions();
  await checkCurrentStatus();
  
  console.log('✅ Next Steps:');
  console.log('1. Choose one of the methods above to enable the flag');
  console.log('2. Refresh your app');
  console.log('3. Look for your friend-test greetings like:');
  console.log('   - "Good to see you, [firstName]."');
  console.log('   - "Glad you\'re here, [firstName]. Let\'s pick somewhere fun."');
  console.log('   - "You\'re back, [firstName]. Let\'s browse a few options."');
  console.log('\n🎉 Your personalized messaging vision is ready to go live!');
};

main().catch(console.error);
