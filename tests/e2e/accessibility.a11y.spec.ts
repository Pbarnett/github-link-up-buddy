import { test, expect } from '../fixtures/extendedTest';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accessibility (WCAG 2.2 AA)', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await injectAxe(page);
    
    // Set up reduced motion preference for testing
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('homepage accessibility audit', async ({ page }) => {
    await test.step('Navigate and inject axe', async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });

    await test.step('Run comprehensive accessibility checks', async () => {
      await checkA11y(page, undefined, {
        detailedReport: true,
        detailedReportOptions: { html: true },
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
        rules: {
          // Enable WCAG 2.2 specific rules
          'target-size': { enabled: true }, // 2.5.5 Target Size (Enhanced)
          'focus-visible': { enabled: true }, // 2.4.7 Focus Visible
          'aria-command-name': { enabled: true }, // 4.1.3 Status Messages
        }
      });
    });
  });

  test('keyboard navigation compliance', async ({ page }) => {
    await page.goto('/');

    await test.step('Tab order and focus management', async () => {
      // Test tab navigation
      const tabbableElements = [];
      
      // Collect all focusable elements
      await page.keyboard.press('Tab');
      let currentElement = await page.locator(':focus');
      let previousTagName = '';
      
      for (let i = 0; i < 20; i++) { // Limit to prevent infinite loop
        if (await currentElement.isVisible()) {
          const tagName = await currentElement.evaluate(el => el.tagName.toLowerCase());
          const role = await currentElement.getAttribute('role');
          const ariaLabel = await currentElement.getAttribute('aria-label');
          
          tabbableElements.push({
            tagName,
            role,
            ariaLabel,
            index: i
          });
          
          // Verify focus is visible (WCAG 2.4.7, enhanced in 2.2)
          await expect(currentElement).toHaveCSS('outline-width', /[^0]/); // Not 0px
          
          if (tagName === previousTagName && i > 0) {
            break; // Likely cycling, stop
          }
          previousTagName = tagName;
        }
        
        await page.keyboard.press('Tab');
        currentElement = page.locator(':focus');
      }
      
      // Verify we have interactive elements
      expect(tabbableElements.length).toBeGreaterThan(0);
      console.log('Tab order:', tabbableElements);
    });

    await test.step('Escape key handling', async () => {
      // Test escape key closes modals/dialogs
      const modalTrigger = page.getByRole('button', { name: /menu|modal|dialog/i }).first();
      
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.waitForTimeout(500); // Brief wait for modal to open
        
        await page.keyboard.press('Escape');
        
        // Modal should close or focus should return to trigger
        await expect(modalTrigger).toBeFocused();
      }
    });
  });

  test('form accessibility', async ({ page }) => {
    await page.goto('/trip-request');

    await test.step('Form labels and descriptions', async () => {
      // Check all form inputs have labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputId = await input.getAttribute('id');
        const inputName = await input.getAttribute('name');
        
        // Should have either label, aria-label, or aria-labelledby
        const hasLabel = await page.locator(`label[for="${inputId}"]`).isVisible();
        const hasAriaLabel = await input.getAttribute('aria-label');
        const hasAriaLabelledby = await input.getAttribute('aria-labelledby');
        
        expect(
          hasLabel || hasAriaLabel || hasAriaLabelledby,
          `Input ${inputName || inputId} should have proper labeling`
        ).toBeTruthy();
      }
    });

    await test.step('Error message accessibility (WCAG 3.3.1, 3.3.3)', async () => {
      // Trigger form validation
      const submitButton = page.getByRole('button', { name: /submit|search/i }).first();
      await submitButton.click();
      
      // Wait for potential validation
      await page.waitForTimeout(1000);
      
      // Check for error messages
      const errorElements = page.locator('[role="alert"], .error, [aria-live="polite"], [aria-live="assertive"]');
      const errorCount = await errorElements.count();
      
      if (errorCount > 0) {
        for (let i = 0; i < errorCount; i++) {
          const error = errorElements.nth(i);
          
          // Error should be visible and have text
          await expect(error).toBeVisible();
          const errorText = await error.textContent();
          expect(errorText?.trim().length).toBeGreaterThan(0);
          
          // Check if error is associated with form field
          const ariaDescribedby = await error.getAttribute('id');
          if (ariaDescribedby) {
            const associatedInput = page.locator(`[aria-describedby*="${ariaDescribedby}"]`);
            expect(await associatedInput.count()).toBeGreaterThan(0);
          }
        }
      }
    });

    await test.step('Required field indicators', async () => {
      // Check required fields are properly marked
      const requiredInputs = page.locator('input[required], select[required], textarea[required]');
      const requiredCount = await requiredInputs.count();
      
      for (let i = 0; i < requiredCount; i++) {
        const input = requiredInputs.nth(i);
        
        // Should have aria-required or required attribute
        const hasAriaRequired = await input.getAttribute('aria-required');
        const hasRequired = await input.getAttribute('required');
        
        expect(
          hasAriaRequired === 'true' || hasRequired !== null,
          'Required field should be properly marked'
        ).toBeTruthy();
      }
    });
  });

  test('color contrast and visual accessibility', async ({ page }) => {
    await page.goto('/');

    await test.step('Color contrast ratios (WCAG 1.4.3)', async () => {
      // Run axe color contrast checks
      await checkA11y(page, undefined, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: true } // WCAG AAA level
        }
      });
    });

    await test.step('Focus indicators (WCAG 2.4.11 - new in 2.2)', async () => {
      const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const elementCount = Math.min(await focusableElements.count(), 10); // Test first 10
      
      for (let i = 0; i < elementCount; i++) {
        const element = focusableElements.nth(i);
        
        if (await element.isVisible()) {
          await element.focus();
          
          // Focus should be visible (not obscured)
          await expect(element).toBeFocused();
          
          // Check focus indicator exists and is visible
          const focusOutline = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              outlineWidth: computed.outlineWidth,
              outlineStyle: computed.outlineStyle,
              outlineColor: computed.outlineColor,
              boxShadow: computed.boxShadow
            };
          });
          
          const hasFocusIndicator = 
            focusOutline.outlineWidth !== '0px' ||
            focusOutline.boxShadow !== 'none';
          
          expect(hasFocusIndicator, 'Element should have visible focus indicator').toBeTruthy();
        }
      }
    });
  });

  test('responsive and mobile accessibility', async ({ page }) => {
    await test.step('Mobile viewport accessibility', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      // Check for mobile-specific accessibility issues
      await checkA11y(page, undefined, {
        rules: {
          'target-size': { enabled: true }, // WCAG 2.5.5 - minimum 44x44px touch targets
          'meta-viewport': { enabled: true }
        }
      });
    });

    await test.step('Touch target sizes (WCAG 2.5.5)', async () => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      const touchableElements = page.locator('button, a, input[type="button"], input[type="submit"], [role="button"]');
      const elementCount = await touchableElements.count();
      
      for (let i = 0; i < Math.min(elementCount, 10); i++) {
        const element = touchableElements.nth(i);
        
        if (await element.isVisible()) {
          const boundingBox = await element.boundingBox();
          
          if (boundingBox) {
            // Minimum touch target size should be 44x44 CSS pixels
            expect(
              boundingBox.width >= 44 && boundingBox.height >= 44,
              `Touch target ${i} should be at least 44x44px (actual: ${boundingBox.width}x${boundingBox.height})`
            ).toBeTruthy();
          }
        }
      }
    });
  });

  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/');

    await test.step('Semantic HTML structure', async () => {
      // Check for proper heading hierarchy
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      
      if (headingCount > 0) {
        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count, 'Page should have exactly one h1').toBe(1);
        
        // Check heading order (simplified check)
        const headingLevels = [];
        for (let i = 0; i < headingCount; i++) {
          const heading = headings.nth(i);
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
          const level = parseInt(tagName.replace('h', ''));
          headingLevels.push(level);
        }
        
        // First heading should be h1
        expect(headingLevels[0]).toBe(1);
      }
    });

    await test.step('ARIA landmarks and regions', async () => {
      // Check for main landmark
      await expect(page.locator('[role="main"], main')).toBeVisible();
      
      // Check for navigation landmark if nav exists
      const navElements = page.locator('nav, [role="navigation"]');
      if (await navElements.count() > 0) {
        await expect(navElements.first()).toBeVisible();
      }
      
      // Check banner/header
      const bannerElements = page.locator('header, [role="banner"]');
      if (await bannerElements.count() > 0) {
        await expect(bannerElements.first()).toBeVisible();
      }
    });

    await test.step('Dynamic content announcements', async () => {
      // Check for live regions
      const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
      const liveRegionCount = await liveRegions.count();
      
      console.log(`Found ${liveRegionCount} live regions for dynamic content`);
      
      // If there are dynamic updates, they should be announced
      for (let i = 0; i < liveRegionCount; i++) {
        const region = liveRegions.nth(i);
        const ariaLive = await region.getAttribute('aria-live');
        const role = await region.getAttribute('role');
        
        expect(
          ariaLive === 'polite' || ariaLive === 'assertive' || 
          role === 'status' || role === 'alert'
        ).toBeTruthy();
      }
    });
  });

  test('new WCAG 2.2 compliance checks', async ({ page }) => {
    await page.goto('/');

    await test.step('Dragging movements alternative (2.5.7)', async () => {
      // Look for drag-and-drop interfaces
      const draggableElements = page.locator('[draggable="true"], [data-draggable]');
      const draggableCount = await draggableElements.count();
      
      for (let i = 0; i < draggableCount; i++) {
        const draggable = draggableElements.nth(i);
        
        // Should have keyboard alternative or buttons for reordering
        const hasKeyboardAlternative = await page.locator('button:near(:nth-match([draggable], ' + (i+1) + '), 100)').count() > 0;
        const hasAriaKeyShortcuts = await draggable.getAttribute('aria-keyshortcuts');
        
        expect(
          hasKeyboardAlternative || hasAriaKeyShortcuts,
          'Draggable element should have keyboard alternative'
        ).toBeTruthy();
      }
    });

    await test.step('Redundant entry prevention (3.3.7)', async () => {
      await page.goto('/trip-request');
      
      // Look for forms that might ask for repeated information
      const inputs = page.locator('input[type="email"], input[type="tel"], input[name*="address"]');
      const inputCount = await inputs.count();
      
      // Check if there are mechanisms to avoid re-entry
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const inputName = await input.getAttribute('name');
        
        // Look for autocomplete attributes
        const autocomplete = await input.getAttribute('autocomplete');
        
        if (inputName?.includes('email') || inputName?.includes('phone') || inputName?.includes('address')) {
          expect(
            autocomplete !== null,
            `Input ${inputName} should have autocomplete attribute to prevent redundant entry`
          ).toBeTruthy();
        }
      }
    });

    await test.step('Accessible authentication (3.3.8)', async () => {
      // Check if login/auth forms avoid cognitive function tests
      const authForms = page.locator('form:has(input[type="password"]), [data-testid*="auth"], [data-testid*="login"]');
      
      if (await authForms.count() > 0) {
        // Should not require solving puzzles or remembering info not related to content
        const captchaElements = page.locator('[data-captcha], .captcha, .recaptcha');
        
        if (await captchaElements.count() > 0) {
          // Should provide alternative authentication method
          const altAuthMethods = page.locator('button:has-text("Alternative"), button:has-text("Audio"), [aria-label*="alternative"]');
          
          expect(
            await altAuthMethods.count(),
            'CAPTCHA should provide alternative authentication method'
          ).toBeGreaterThan(0);
        }
      }
    });
  });

  test('performance impact on accessibility', async ({ page }) => {
    await test.step('Animation and motion preferences', async () => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      
      // Check that animations respect reduced motion
      const animatedElements = page.locator('[data-animation], .animate-spin, .animate-pulse, .transition-all');
      const animatedCount = await animatedElements.count();
      
      for (let i = 0; i < animatedCount; i++) {
        const element = animatedElements.nth(i);
        
        if (await element.isVisible()) {
          const animations = await element.evaluate(el => {
            const computed = window.getComputedStyle(el);
            return {
              animationDuration: computed.animationDuration,
              transitionDuration: computed.transitionDuration
            };
          });
          
          // With reduced motion, animations should be minimal or disabled
          const respectsReducedMotion = 
            animations.animationDuration === '0s' || 
            animations.transitionDuration === '0s' ||
            animations.animationDuration === 'none';
          
          if (!respectsReducedMotion) {
            console.warn(`Element ${i} may not respect reduced motion preference`);
          }
        }
      }
    });
  });
});
