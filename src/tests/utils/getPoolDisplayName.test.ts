
import { describe, it, expect } from 'vitest';
import { getPoolDisplayName } from '@/utils/getPoolDisplayName';

describe('getPoolDisplayName', () => {
  it('returns correct names for manual mode', () => {
    expect(getPoolDisplayName('manual', 1)).toBe('Best Value');
    expect(getPoolDisplayName('manual', 2)).toBe('Low Cost');
    expect(getPoolDisplayName('manual', 3)).toBe('Premium');
  });

  it('returns correct names for auto mode', () => {
    expect(getPoolDisplayName('auto', 1)).toBe('Perfect');
    expect(getPoolDisplayName('auto', 2)).toBe('Close');
    expect(getPoolDisplayName('auto', 3)).toBe('Backup');
  });
});
