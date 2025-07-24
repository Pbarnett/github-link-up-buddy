/**
 * Feature Flag Client for Client-side LaunchDarkly Integration
 */

import { User } from '@supabase/supabase-js';

// Mock implementation for testing purposes
export class FeatureFlagClient {
  private initialized = false;

  async initialize(user: User): Promise<any> {
    // Mock initialization
    this.initialized = true;
    console.log('FeatureFlagClient initialized (mock)');
    
    // Return a mock client
    return {
      waitForInitialization: () => Promise.resolve(),
      variation: (flagKey: string, fallback: any) => fallback,
      identify: () => Promise.resolve(),
    };
  }

  async getBooleanFlag(flagKey: string, fallback: boolean): Promise<boolean> {
    if (!this.initialized) {
      return fallback;
    }
    
    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getStringFlag(flagKey: string, fallback: string): Promise<string> {
    if (!this.initialized) {
      return fallback;
    }
    
    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getNumberFlag(flagKey: string, fallback: number): Promise<number> {
    if (!this.initialized) {
      return fallback;
    }
    
    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getJSONFlag(flagKey: string, fallback: any): Promise<any> {
    if (!this.initialized) {
      return fallback;
    }
    
    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async identify(user: User): Promise<void> {
    console.log('FeatureFlagClient identify called (mock)');
  }
}
