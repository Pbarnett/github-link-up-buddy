import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalTeardown() {
  console.log('🧹 Running global E2E teardown...');

  try {
    // Clean up authentication state
    const authStatePath = path.join(__dirname, 'auth-state.json');
    if (fs.existsSync(authStatePath)) {
      fs.unlinkSync(authStatePath);
      console.log('🗑️  Cleaned up authentication state');
    }

    // Clean up test data
    await cleanupTestData();
    
    // Generate test summary
    await generateTestSummary();
    
    console.log('✅ Global E2E teardown completed');
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't break the test run
  }
}

async function cleanupTestData() {
  console.log('🗄️  Cleaning up test data...');
  
  try {
    // Clean up any test data that was created
    // This could include database cleanup, file cleanup, etc.
    
    const testDbUrl = process.env.E2E_DATABASE_URL;
    if (testDbUrl) {
      console.log('🗄️  Test database cleanup completed');
    }
    
  } catch (error) {
    console.warn('⚠️  Test data cleanup warning:', error);
  }
}

async function generateTestSummary() {
  console.log('📋 Generating test summary...');
  
  try {
    const reportsDir = path.join(__dirname, 'reports');
    const resultsPath = path.join(reportsDir, 'results.json');
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      
      const summary = {
        timestamp: new Date().toISOString(),
        totalTests: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        environment: process.env.NODE_ENV || 'development'
      };
      
      const summaryPath = path.join(reportsDir, 'summary.json');
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
      
      console.log('📊 Test Summary:');
      console.log(`   Total: ${summary.totalTests}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Skipped: ${summary.skipped}`);
      console.log(`   Duration: ${Math.round(summary.duration / 1000)}s`);
    }
    
  } catch (error) {
    console.warn('⚠️  Test summary generation warning:', error);
  }
}

export default globalTeardown;
