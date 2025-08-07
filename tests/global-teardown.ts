import fs from 'fs';
import { FullConfig } from '@playwright/test';

/**
 * Global teardown executed after all tests
 */
async function globalTeardown(config: FullConfig) {
  console.log('🔄 Performing global teardown...');

  try {
    // Cleanup operations (e.g., remove temporary files, close services, release resources)
    await cleanUpAuthState();

    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown encountered an error:', error);
  }
}

/**
 * Clean up authentication state if needed
 */
async function cleanUpAuthState() {
  const authFile = 'tests/.auth/user.json';

  // Check if auth state file exists
  if (fs.existsSync(authFile)) {
    fs.unlinkSync(authFile);
    console.log(`  🗑️  Removed auth state file: ${authFile}`);
  } else {
    console.log(`  🔍 No auth state to clean up`);
  }
}

export default globalTeardown;

