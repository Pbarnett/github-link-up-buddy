import { test, expect } from '@playwright/test';

test.describe('Basic Playwright Test', () => {
  test('should run without conflicts', async () => {
    expect(1 + 1).toBe(2);
    console.log('✅ Basic Playwright test runs successfully');
  });

  test('should have access to expect function', async () => {
    expect('hello').toBe('hello');
    expect(typeof expect).toBe('function');
    console.log('✅ Playwright expect function works correctly');
  });
});
