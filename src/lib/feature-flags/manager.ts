/**
 * Feature Flag Manager for Server-side LaunchDarkly Integration
 */

import { User } from '@supabase/supabase-js';

// Mock implementation for testing purposes
export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private initialized = false;

  static getInstance(): FeatureFlagManager {
    if (!this.instance) {
      this.instance = new FeatureFlagManager();
    }
    return this.instance;
  }

  async initialize(): Promise<void> {
    // Mock initialization
    this.initialized = true;
    console.log('FeatureFlagManager initialized (mock)');
  }

  async cleanup(): Promise<void> {
    this.initialized = false;
    console.log('FeatureFlagManager cleaned up (mock)');
  }

  async getBooleanFlag(
    flagKey: string,
    user: User,
    fallback: boolean
  ): Promise<boolean> {
    if (!this.initialized) {
      return fallback;
    }

    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getStringFlag(
    flagKey: string,
    user: User,
    fallback: string
  ): Promise<string> {
    if (!this.initialized) {
      return fallback;
    }

    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getNumberFlag(
    flagKey: string,
    user: User,
    fallback: number
  ): Promise<number> {
    if (!this.initialized) {
      return fallback;
    }

    // Mock implementation - always return fallback for tests
    return fallback;
  }

  async getAllFlags(user: User): Promise<Record<string, any>> {
    if (!this.initialized) {
      return {};
    }

    // Mock implementation - return empty flags
    return {};
  }
}
