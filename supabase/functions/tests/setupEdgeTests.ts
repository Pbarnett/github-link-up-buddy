// supabase/functions/tests/setupEdgeTests.ts
import { afterEach, vi } from 'vitest';

// Global mock reset functions
const mockResetFunctions: Array<() => void> = [];

export function registerMockReset(resetFn: () => void) {
  mockResetFunctions.push(resetFn);
}

export function __resetMocks() {
  mockResetFunctions.forEach(resetFn => resetFn());
  vi.clearAllMocks();
  
  // Reset ID counters
  try {
    const { resetCounters } = require('../../tests/helpers/idGenerators.ts');
    resetCounters();
  } catch (e) {
    // Ignore if not available
  }
}

// Global setup - reset all mocks after each test
afterEach(() => {
  __resetMocks();
});

console.log('[EdgeTestSetup] Global edge function test setup initialized');
