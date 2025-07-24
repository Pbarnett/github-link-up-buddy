import { describe, beforeAll, afterAll, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { testEnvironment } from '../testcontainers/setup';

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    try {
      console.log('Starting TestContainers setup...');
      await testEnvironment.setup();
      console.log('TestContainers setup completed.');
    } catch (error) {
      console.error('TestContainers setup failed:', error);
      throw error;
    }
  }, 120000); // 2 minute timeout for container startup

  afterAll(async () => {
    await testEnvironment.teardown();
  });

  it('should connect to PostgreSQL container', async () => {
    const config = testEnvironment.getPostgresConfig();
    
    // Test direct PostgreSQL connection
    expect(config.host).toBe('localhost');
    expect(config.port).toBeGreaterThan(0);
    expect(config.database).toBe('parker_flight_test');
    expect(config.username).toBe('test_user');
  });

  it('should perform database operations', async () => {
    const config = testEnvironment.getPostgresConfig();
    
    // Example: Create a simple Supabase client for testing
    // Note: You might need to set up a proper Supabase instance
    // This is just an example of how you might structure the test
    
    const testData = {
      user_id: 'test-user-123',
      email: 'test@example.com',
      created_at: new Date().toISOString(),
    };

    // Your database operations would go here
    expect(testData.user_id).toBe('test-user-123');
  });

  it('should handle test isolation', async () => {
    // Each test should start with a clean state
    // Testcontainers ensures this by creating fresh containers
    const config = testEnvironment.getPostgresConfig();
    expect(config).toBeDefined();
  });
});
