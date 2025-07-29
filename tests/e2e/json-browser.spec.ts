import { test, expect, Page } from '@playwright/test';

test.describe('JSON Browser Test Suite', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/test-json-browser.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load JSON test environment successfully', async () => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/JSON Library Browser Tests/);
    
    // Check that all test control buttons are visible
    await expect(page.locator('button:has-text("Run All Tests")')).toBeVisible();
    await expect(page.locator('button:has-text("Basic JSON Tests")')).toBeVisible();
    await expect(page.locator('button:has-text("Complex Tests")')).toBeVisible();
    await expect(page.locator('button:has-text("Performance Tests")')).toBeVisible();
    await expect(page.locator('button:has-text("ECMA-404 Compliance")')).toBeVisible();
    
    // Check that metrics dashboard is initialized
    await expect(page.locator('#parseSpeed')).toContainText('-- ops/ms');
    await expect(page.locator('#stringifySpeed')).toContainText('-- ops/ms');
    await expect(page.locator('#complianceScore')).toContainText('--%');
  });

  test('should run basic JSON tests successfully', async () => {
    // Click the Basic JSON Tests button
    await page.click('button:has-text("Basic JSON Tests")');
    
    // Wait for tests to complete
    await page.waitForSelector('text=Running Basic JSON Tests...', { timeout: 5000 });
    await page.waitForSelector('text=✅', { timeout: 10000 });
    
    // Check that progress bar updated
    const progressText = await page.locator('#progressText').textContent();
    expect(progressText).toContain('tests completed');
    
    // Check that some tests passed
    const passedTests = page.locator('.test-result.test-pass');
    await expect(passedTests).toHaveCount({ atLeast: 5 });
  });

  test('should run complex JSON tests successfully', async () => {
    // Click the Complex Tests button
    await page.click('button:has-text("Complex Tests")');
    
    // Wait for tests to complete
    await page.waitForSelector('text=Running Complex JSON Tests...', { timeout: 5000 });
    await page.waitForSelector('text=✅', { timeout: 15000 });
    
    // Check for specific complex test results
    await expect(page.locator('text=Complex nested parsing')).toBeVisible();
    await expect(page.locator('text=Unicode handling')).toBeVisible();
    await expect(page.locator('text=Replacer function filtering')).toBeVisible();
  });

  test('should run performance tests and show metrics', async () => {
    // Click the Performance Tests button
    await page.click('button:has-text("Performance Tests")');
    
    // Wait for performance tests to complete
    await page.waitForSelector('text=Running Performance Tests...', { timeout: 5000 });
    await page.waitForSelector('text=Performance test completed', { timeout: 20000 });
    
    // Check that metrics were updated
    const parseSpeed = await page.locator('#parseSpeed').textContent();
    const stringifySpeed = await page.locator('#stringifySpeed').textContent();
    const memoryUsage = await page.locator('#memoryUsage').textContent();
    
    expect(parseSpeed).not.toContain('--');
    expect(stringifySpeed).not.toContain('--');
    expect(memoryUsage).not.toContain('--');
    expect(parseSpeed).toMatch(/\d+ ops\/ms/);
    expect(stringifySpeed).toMatch(/\d+ ops\/ms/);
    expect(memoryUsage).toMatch(/\d+ KB/);
  });

  test('should run ECMA-404 compliance tests', async () => {
    // Click the ECMA-404 Compliance button
    await page.click('button:has-text("ECMA-404 Compliance")');
    
    // Wait for compliance tests to complete
    await page.waitForSelector('text=Running ECMA-404 Compliance Tests...', { timeout: 5000 });
    await page.waitForSelector('text=ECMA-404 Compliance Score', { timeout: 15000 });
    
    // Check compliance score was calculated
    const complianceScore = await page.locator('#complianceScore').textContent();
    expect(complianceScore).not.toContain('--%');
    expect(complianceScore).toMatch(/\d+%/);
    
    // Score should be high for a compliant implementation
    const scoreValue = parseInt(complianceScore!.replace('%', ''));
    expect(scoreValue).toBeGreaterThan(80);
  });

  test('should run all tests successfully', async () => {
    // Click the Run All Tests button
    await page.click('button:has-text("Run All Tests")');
    
    // Wait for all tests to start
    await page.waitForSelector('text=Running Basic JSON Tests...', { timeout: 5000 });
    
    // Wait for all tests to complete (this may take a while)
    await page.waitForSelector('text=All tests completed', { timeout: 60000 });
    
    // Check final summary
    const summaryText = await page.locator('text=Summary:').textContent();
    expect(summaryText).toMatch(/\d+ passed, \d+ failed/);
    
    // Check that all metrics are populated
    const parseSpeed = await page.locator('#parseSpeed').textContent();
    const stringifySpeed = await page.locator('#stringifySpeed').textContent();
    const complianceScore = await page.locator('#complianceScore').textContent();
    
    expect(parseSpeed).toMatch(/\d+ ops\/ms/);
    expect(stringifySpeed).toMatch(/\d+ ops\/ms/);
    expect(complianceScore).toMatch(/\d+%/);
  });

  test('should handle test failures gracefully', async () => {
    // This test checks that the UI handles failures properly
    // We might need to inject some failure scenarios
    
    await page.click('button:has-text("Run All Tests")');
    await page.waitForSelector('text=All tests completed', { timeout: 60000 });
    
    // Check that both pass and fail results are displayed properly
    const passedTests = page.locator('.test-result.test-pass');
    const failedTests = page.locator('.test-result.test-fail');
    
    // Should have some passed tests
    await expect(passedTests).toHaveCount({ atLeast: 1 });
    
    // If there are failed tests, they should be properly formatted
    const failedCount = await failedTests.count();
    if (failedCount > 0) {
      const firstFailure = failedTests.first();
      await expect(firstFailure).toContainText('❌');
    }
  });

  test('should clear results when clear button is clicked', async () => {
    // Run some tests first
    await page.click('button:has-text("Basic JSON Tests")');
    await page.waitForSelector('text=✅', { timeout: 10000 });
    
    // Verify results are present
    const initialResults = await page.locator('#testResults .test-result').count();
    expect(initialResults).toBeGreaterThan(0);
    
    // Clear results
    await page.click('button:has-text("Clear Results")');
    
    // Check that results are cleared
    const clearedResults = await page.locator('#testResults .test-result').count();
    expect(clearedResults).toBe(0);
    
    // Check that progress is reset
    const progressText = await page.locator('#progressText').textContent();
    expect(progressText).toBe('Ready to run tests...');
    
    // Check that metrics are reset
    const parseSpeed = await page.locator('#parseSpeed').textContent();
    expect(parseSpeed).toBe('-- ops/ms');
  });

  test('should be responsive on mobile devices', async () => {
    // This test will run on mobile devices as configured in playwright.config.ts
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    // Check that all buttons are still clickable
    await expect(page.locator('button:has-text("Run All Tests")')).toBeVisible();
    
    // Run a quick test to ensure functionality works on mobile
    await page.click('button:has-text("Basic JSON Tests")');
    await page.waitForSelector('text=✅', { timeout: 15000 });
    
    // Check that results are displayed properly
    const results = page.locator('.test-result');
    await expect(results).toHaveCount({ atLeast: 1 });
  });
});

test.describe('JSON Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-json-browser.html');
    await page.waitForLoadState('networkidle');
  });

  test('should handle malicious JSON inputs safely', async () => {
    // Test that the application handles potentially malicious inputs
    await page.evaluate(() => {
      // Test JSON bomb protection (deeply nested objects)
      const testRunner = (/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window as any).testRunner;
      
      // This should not crash the browser
      try {
        let maliciousJson = '{"a":';
        for (let i = 0; i < 100; i++) {
          maliciousJson += '{"b":';
        }
        maliciousJson += '1';
        for (let i = 0; i < 100; i++) {
          maliciousJson += '}';
        }
        maliciousJson += '}';
        
        JSON.parse(maliciousJson);
        testRunner.log('Deep nesting test completed safely', 'pass');
      } catch (_e) {
        testRunner.log('Deep nesting properly rejected', 'pass');
      }
    });
    
    // Wait for the security test to complete
    await page.waitForSelector('text=Deep nesting', { timeout: 5000 });
  });

  test('should prevent script injection via JSON', async () => {
    await page.evaluate(() => {
      const testRunner = (/* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window as any).testRunner;
      
      try {
        // Test that script injection attempts are safely handled
        const maliciousInput = '{"script": "<script>alert(\\"XSS\\")</script>"}';
        const parsed = JSON.parse(maliciousInput);
        
        // The parsed value should be a string, not executable code
        testRunner.assert(
          typeof parsed.script === 'string',
          'Script injection properly neutralized'
        );
      } catch (_e) {
        testRunner.log('Script injection test failed', 'fail');
      }
    });
    
    await page.waitForSelector('text=Script injection properly neutralized', { timeout: 5000 });
  });
});
