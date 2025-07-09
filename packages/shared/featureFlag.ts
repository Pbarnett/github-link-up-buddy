// packages/shared/featureFlag.ts
import murmur from 'murmurhash-js';

/**
 * Deterministic user bucketing using MurmurHash for consistent feature flag rollouts
 * @param userId - The user ID to hash
 * @param rollout - The rollout percentage (0-100)
 * @returns true if user should see the feature, false otherwise
 */
export function userInBucket(userId: string, rollout: number): boolean {
  if (!userId) return false;
  if (rollout <= 0) return false;
  if (rollout >= 100) return true;
  
  // Use MurmurHash to create consistent bucket assignment
  const bucket = murmur.murmur3(userId) % 100; // 0-99
  return bucket < rollout; // 5 → first five buckets (0-4)
}

/**
 * Check if a user is in a specific bucket range
 * @param userId - The user ID to hash
 * @param minBucket - Minimum bucket (inclusive)
 * @param maxBucket - Maximum bucket (inclusive)
 * @returns true if user is in the bucket range
 */
export function userInBucketRange(userId: string, minBucket: number, maxBucket: number): boolean {
  if (!userId) return false;
  const bucket = murmur.murmur3(userId) % 100;
  return bucket >= minBucket && bucket <= maxBucket;
}

/**
 * Get the bucket number for a user (0-99)
 * @param userId - The user ID to hash
 * @returns bucket number (0-99)
 */
export function getUserBucket(userId: string): number {
  if (!userId) return 0;
  return murmur.murmur3(userId) % 100;
}

/**
 * Feature flag configuration interface
 */
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rollout_percentage: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * Feature flag response interface
 */
export interface FeatureFlagResponse {
  enabled: boolean;
  bucket?: number;
  rollout_percentage?: number;
}
