import { describe, it, expect } from 'vitest';
import { isEnabled, getFeatureFlagHash, userInBucket, getUserBucket, type FeatureFlag } from '@shared/featureFlag';

describe('Feature Flag System', () => {
  const createTestFlag = (enabled: boolean, rolloutPercentage: number): FeatureFlag => ({
    name: 'test_flag',
    enabled,
    rollout_percentage: rolloutPercentage,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  describe('isEnabled', () => {
    it('returns false for disabled flags regardless of rollout percentage', () => {
      const flag = createTestFlag(false, 100);
      expect(isEnabled(flag, 'user123')).toBe(false);
    });

    it('returns true for 100% rollout when enabled', () => {
      const flag = createTestFlag(true, 100);
      expect(isEnabled(flag, 'user123')).toBe(true);
    });

    it('returns false for 0% rollout when enabled', () => {
      const flag = createTestFlag(true, 0);
      expect(isEnabled(flag, 'user123')).toBe(false);
    });

    it('handles null/undefined rollout percentage as 100%', () => {
      const flag = { ...createTestFlag(true, 100), rollout_percentage: null } as FeatureFlag;
      expect(isEnabled(flag, 'user123')).toBe(true);
    });

    it('provides consistent results for the same user', () => {
      const flag = createTestFlag(true, 50);
      const userId = 'consistent_user';
      
      const result1 = isEnabled(flag, userId);
      const result2 = isEnabled(flag, userId);
      const result3 = isEnabled(flag, userId);
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it('distributes users approximately according to rollout percentage', () => {
      const flag = createTestFlag(true, 25); // 25% rollout
      let enabledCount = 0;
      const totalUsers = 1000;
      
      for (let i = 0; i < totalUsers; i++) {
        if (isEnabled(flag, `user${i}`)) {
          enabledCount++;
        }
      }
      
      const enabledPercentage = (enabledCount / totalUsers) * 100;
      
      // Should be approximately 25% with some tolerance
      expect(enabledPercentage).toBeGreaterThan(20);
      expect(enabledPercentage).toBeLessThan(30);
    });
  });

  describe('userInBucket', () => {
    it('returns false for empty user ID', () => {
      expect(userInBucket('', 50)).toBe(false);
    });

    it('returns false for 0% rollout', () => {
      expect(userInBucket('user123', 0)).toBe(false);
    });

    it('returns true for 100% rollout', () => {
      expect(userInBucket('user123', 100)).toBe(true);
    });

    it('returns true for rollout >= 100', () => {
      expect(userInBucket('user123', 150)).toBe(true);
    });

    it('returns false for negative rollout', () => {
      expect(userInBucket('user123', -10)).toBe(false);
    });

    it('provides deterministic results', () => {
      const userId = 'deterministic_user';
      const rollout = 50;
      
      const result1 = userInBucket(userId, rollout);
      const result2 = userInBucket(userId, rollout);
      
      expect(result1).toBe(result2);
    });
  });

  describe('getUserBucket', () => {
    it('returns 0 for empty user ID', () => {
      expect(getUserBucket('')).toBe(0);
    });

    it('returns a number between 0 and 99', () => {
      const bucket = getUserBucket('user123');
      expect(bucket).toBeGreaterThanOrEqual(0);
      expect(bucket).toBeLessThan(100);
    });

    it('returns consistent buckets for the same user', () => {
      const userId = 'consistent_user';
      const bucket1 = getUserBucket(userId);
      const bucket2 = getUserBucket(userId);
      
      expect(bucket1).toBe(bucket2);
    });

    it('distributes users across all buckets', () => {
      const buckets = new Set<number>();
      
      for (let i = 0; i < 10000; i++) {
        const bucket = getUserBucket(`user${i}`);
        buckets.add(bucket);
      }
      
      // Should have good distribution across buckets
      expect(buckets.size).toBeGreaterThan(90); // At least 90% of buckets used
    });
  });

  describe('getFeatureFlagHash', () => {
    it('returns consistent hash for the same user', () => {
      const userId = 'hash_user';
      const hash1 = getFeatureFlagHash(userId);
      const hash2 = getFeatureFlagHash(userId);
      
      expect(hash1).toBe(hash2);
    });

    it('returns different hashes for different users', () => {
      const hash1 = getFeatureFlagHash('user1');
      const hash2 = getFeatureFlagHash('user2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('returns values in expected range', () => {
      const hash = getFeatureFlagHash('user123');
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThan(100);
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in user IDs', () => {
      const specialUsers = [
        'user@example.com',
        'user-123_456',
        'user with spaces',
        'user!@#$%^&*()',
        'user/with/slashes',
      ];
      
      const flag = createTestFlag(true, 50);
      
      specialUsers.forEach(userId => {
        const result = isEnabled(flag, userId);
        expect(typeof result).toBe('boolean');
      });
    });

    it('handles very long user IDs', () => {
      const longUserId = 'a'.repeat(1000);
      const flag = createTestFlag(true, 50);
      
      const result = isEnabled(flag, longUserId);
      expect(typeof result).toBe('boolean');
    });

    it('handles unicode characters in user IDs', () => {
      const unicodeUsers = [
        'user_文字',
        'user_😀',
        'user_ñáéíóú',
        'user_العربية',
        'user_中文',
      ];
      
      const flag = createTestFlag(true, 50);
      
      unicodeUsers.forEach(userId => {
        const result = isEnabled(flag, userId);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('5% Canary Rollout Simulation', () => {
    it('correctly implements 5% canary rollout', () => {
      const flag = createTestFlag(true, 5);
      let enabledCount = 0;
      const totalUsers = 10000;
      
      for (let i = 0; i < totalUsers; i++) {
        if (isEnabled(flag, `user${i}`)) {
          enabledCount++;
        }
      }
      
      const enabledPercentage = (enabledCount / totalUsers) * 100;
      
      // Should be approximately 5% with tolerance
      expect(enabledPercentage).toBeGreaterThan(3);
      expect(enabledPercentage).toBeLessThan(7);
    });

    it('maintains consistency across multiple checks', () => {
      const flag = createTestFlag(true, 5);
      const sampleUsers = Array.from({ length: 1000 }, (_, i) => `user${i}`);
      
      // Check each user multiple times
      sampleUsers.forEach(userId => {
        const results = Array.from({ length: 10 }, () => isEnabled(flag, userId));
        const firstResult = results[0];
        
        // All results should be the same
        results.forEach(result => {
          expect(result).toBe(firstResult);
        });
      });
    });
  });
});
