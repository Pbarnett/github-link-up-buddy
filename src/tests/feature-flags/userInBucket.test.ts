import { userInBucket, getUserBucket } from '@shared/featureFlag';
import { describe, it, expect } from 'vitest';

describe('userInBucket', () => {
  // Test that verifies the hash algorithm produces consistent results
  // This test will fail if someone changes the hash algorithm
  it('should produce consistent hash results (protect against algorithm changes)', () => {
    // These are deterministic test cases based on MurmurHash3
    // If these fail, the hash algorithm has changed and will affect user bucketing
    const testCases = [
      { userId: 'user-1', expectedBucket: 59 },
      { userId: 'user-14', expectedBucket: 0 },
      { userId: 'test-user-123', expectedBucket: 8 },
      { userId: 'user-16', expectedBucket: 5 }
    ];

    testCases.forEach(({ userId, expectedBucket }) => {
      const actualBucket = getUserBucket(userId);
      expect(actualBucket).toBe(expectedBucket);
    });
  });

  it('should correctly determine 5% rollout', () => {
    // Based on our test data, only user-14 (bucket 0) should be in 5% rollout
    expect(userInBucket('user-14', 5)).toBe(true);
    expect(userInBucket('user-1', 5)).toBe(false);
    expect(userInBucket('user-16', 5)).toBe(false); // bucket 5 is not < 5
  });

  it('should handle edge cases', () => {
    expect(userInBucket('', 5)).toBe(false);
    expect(userInBucket('user-1', 0)).toBe(false);
    expect(userInBucket('user-1', 100)).toBe(true);
    expect(userInBucket('user-1', -1)).toBe(false);
  });

  it('should be deterministic', () => {
    const userId = 'consistent-user';
    const rollout = 25;
    
    const results = Array.from({ length: 10 }, () => userInBucket(userId, rollout));
    
    // All results should be the same
    expect(results.every(result => result === results[0])).toBe(true);
  });

  it('should distribute users across buckets', () => {
    const users = Array.from({ length: 100 }, (_, i) => `user-${i}`);
    const buckets = users.map(user => getUserBucket(user));
    
    // Should have buckets distributed across 0-99 range
    expect(Math.min(...buckets)).toBe(0);
    expect(Math.max(...buckets)).toBeLessThan(100);
    
    // Should have reasonable distribution (not all in same bucket)
    const uniqueBuckets = new Set(buckets);
    expect(uniqueBuckets.size).toBeGreaterThan(10);
  });
});
