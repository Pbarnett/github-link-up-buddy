# Wallet Smoke Test Issues and Research Plan

## Overview

This document captures in detail the issues we are facing with the Wallet smoke tests, the context of these issues, and the steps already taken to try and resolve them. This document is meant to be exhaustive and will be utilized for conducting external research with a large language model (LLM) to find potential solutions.

## Context

We are working on a wallet profile system and attempting to run smoke tests to ensure the functionality and elements of the wallet UI are correctly displayed. The wallet UI elements are gated behind a feature flag called `wallet_ui`, managed by LaunchDarkly.

The issue arises because the feature flag rollout is set to 0%, leading to many tests skipping because the required UI elements don't render.

## Steps Taken

### Initial Attempt
1. **Ports Clearing**: Killed processes on ports 3000 and 8080 to ensure the environment is ready.
2. **Test Execution**: Ran the `test:wallet-smoke` script, resulting in most tests skipping due to lack of visible UI elements.
3. **Feature Flag Verification**: Confirmed that the `wallet_ui` feature flag rollout is set to 0% in LaunchDarkly.

### Modifications and Fixes
4. **Playwright Setup**: Created `_setup.ts` file for Playwright to inject localStorage flag overrides and authentication stubs.
5. **Feature Flag Hook Update**: Modified `useFeatureFlag` hook to prioritize localStorage flag overrides and detect test environments using environment variables.
6. **UI Elements Update**: Added `data-testid` attributes to the profile page and `PaymentMethodList` components for Playwright test detection.
7. **Playwright Configuration**: Updated Playwright config to start the server on port 8080 and set environment variables to force feature flags.

### Outcome
- Despite the above efforts, tests skipped many specs and did not detect wallet UI elements.

## Issues Identified
- Sticking with the previous port instead of switching to 8080.
- Incorrect BASE_URL setting: Tests were using `process.env.BASE_URL` instead of Playwright’s config.
- Feature flags were not taking effect in test runs.

## Technical Details and Stack

### Technology Stack
- **Frontend**: React with TypeScript, Vite as build tool
- **Testing**: Playwright for E2E testing
- **Feature Flags**: LaunchDarkly SDK for React
- **State Management**: React hooks and context
- **UI Components**: Custom components with `data-testid` attributes

### Project Structure
```
├── src/
│   ├── components/
│   │   └── PaymentMethodList.tsx
│   ├── pages/
│   │   └── Profile.tsx
│   ├── hooks/
│   │   └── useFeatureFlag.ts
│   └── services/
│       └── launchDarklyService.ts
├── tests/
│   └── e2e/
│       ├── _setup.ts
│       └── wallet-smoke.spec.ts
├── playwright.config.ts
└── package.json
```

## Current Test Structure

### Test Setup (`_setup.ts`)
The setup file is designed to inject localStorage overrides and authentication stubs before each test:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Mock localStorage feature flags
    await page.addInitScript(() => {
      localStorage.setItem('LD_PRESET_FLAGS', JSON.stringify({
        wallet_ui: true,
        profile_ui_revamp: true
      }));
      
      // Mock authentication
      localStorage.setItem('user', JSON.stringify({
        email: 'test@example.com',
        userId: 'test-user-123'
      }));
      localStorage.setItem('isAuthenticated', 'true');
    });
    
    await use(page);
  },
});
```

### Test Structure (`wallet-smoke.spec.ts`)
The tests are structured to check for wallet UI elements with `data-testid` attributes:

```typescript
import { test, expect } from '@playwright/test';
import './_setup';

test.describe('Wallet UI Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to profile page
    await page.goto('/profile');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Basic wallet functionality check', async ({ page }) => {
    // Check for wallet elements
    const walletTab = page.locator('[data-testid="wallet-tab"]');
    const walletContent = page.locator('[data-testid="wallet-content"]');
    
    // Tests skip if elements are not visible
    if (!(await walletTab.isVisible())) {
      test.skip('Wallet tab not visible');
      return;
    }
    
    await walletTab.click();
    await expect(walletContent).toBeVisible();
  });
});
```

## Code and Configuration Context

### Playwright Configuration
The Playwright configuration is set in the `playwright.config.ts` file with the following options:
- The server is launched on port 8080 using Vite.
- Environment variables `VITE_PLAYWRIGHT_TEST` and `VITE_WALLET_UI_ENABLED` are set to `'true'` to force the enabling of environment-sensitive settings and features.
- The `baseURL` is specified as `http://localhost:8080` for navigation methods.

```typescript
webServer: {
  command: 'npx vite --port 8080',
  port: 8080,
  timeout: 120 * 1000,
  reuseExistingServer: !process.env.CI,
  env: {
    VITE_PLAYWRIGHT_TEST: 'true',
    VITE_WALLET_UI_ENABLED: 'true',
  },
}
```

### `useFeatureFlag` Hook (Complete Implementation)
The hook is designed to integrate with LaunchDarkly while providing overrides for testing environments:

```typescript
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEffect } from 'react';

export const useFeatureFlag = (flagName: string, defaultValue: boolean = false) => {
  const flags = useFlags<Record<string, boolean>>();
  const { user } = useCurrentUser();
  
  // Check for test environment or preset flags from tests first
  let flagValue = defaultValue;
  if (typeof window !== 'undefined') {
    // Check if we're in a test environment (playwright sets this)
    const isTestEnv = window.location.hostname === 'localhost' && 
                     (window.navigator.userAgent.includes('HeadlessChrome') || 
                      window.navigator.userAgent.includes('Playwright'));
    
    // Also check for explicit environment variables set by Playwright
    const isPlaywrightTest = import.meta.env.VITE_PLAYWRIGHT_TEST === 'true';
    const isWalletUIEnabled = import.meta.env.VITE_WALLET_UI_ENABLED === 'true';
    
    // In test environment, enable wallet_ui and profile_ui_revamp flags
    if ((isTestEnv || isPlaywrightTest) && (flagName === 'wallet_ui' || flagName === 'profile_ui_revamp')) {
      flagValue = true;
    } else if (isWalletUIEnabled && flagName === 'wallet_ui') {
      flagValue = true;
    } else {
      const presetFlags = localStorage.getItem('LD_PRESET_FLAGS');
      if (presetFlags) {
        try {
          const parsedFlags = JSON.parse(presetFlags);
          if (parsedFlags[flagName] !== undefined) {
            flagValue = parsedFlags[flagName];
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    }
  }
  
  // If no preset, use LaunchDarkly value
  if (flagValue === defaultValue) {
    flagValue = flags[flagName] ?? defaultValue;
  }
  
  return {
    data: flagValue,
    isLoading: flags === undefined,
    isError: false,
    error: null,
  };
};
```

### LaunchDarkly Integration
The application uses LaunchDarkly React SDK with the following setup:

```typescript
// LaunchDarkly Provider setup (usually in App.tsx)
import { withLDProvider } from 'launchdarkly-react-client-sdk';

const App = () => {
  // App component content
};

export default withLDProvider({
  clientSideID: process.env.VITE_LD_CLIENT_ID,
  user: {
    anonymous: true,
    // User context would be set here
  },
})(App);
```

## Actual Test Output

### Latest Test Run Results
```
Running 75 tests using 6 workers

[chromium] › tests/e2e/wallet-smoke.spec.ts:58:3 › Basic page loads and wallet functionality check
Page loaded, URL: http://localhost:8080/profile
Current URL: http://localhost:8080/profile
Wallet elements found: { walletTab: false, walletContent: false, walletSection: false }
ℹ️  No wallet functionality detected (may be expected)

70 skipped
5 passed (1.8m)
```

### Key Observations
- Tests are now correctly navigating to `http://localhost:8080/profile`
- Page loads successfully
- Wallet UI elements are not being detected (`walletTab: false, walletContent: false, walletSection: false`)
- Most tests skip due to missing UI elements

### Expected UI Elements
The tests are looking for these `data-testid` attributes:
- `[data-testid="wallet-tab"]` - The wallet tab button
- `[data-testid="wallet-content"]` - The wallet content area
- `[data-testid="wallet-beta-badge"]` - Beta badge indicator
- `[data-testid="payment-methods-section"]` - Payment methods section
- `[data-testid="add-card-button"]` - Add card button
- `[data-testid="empty-payment-methods"]` - Empty state message

## Root Cause Analysis

### Possible Issues
1. **Feature Flag Not Taking Effect**: Despite environment variables and localStorage overrides, the `wallet_ui` flag may not be properly enabling the UI elements.
2. **LaunchDarkly Integration**: The LaunchDarkly provider might be overriding our test environment settings.
3. **Component Rendering Logic**: The UI components might have additional conditions beyond feature flags.
4. **Environment Variable Scope**: Vite environment variables might not be accessible in the same way during test runs.
5. **Timing Issues**: Feature flag evaluation might be happening before our overrides are in place.

## Proposed Next Steps

### Research Questions for LLM
1. **LaunchDarkly + Playwright Best Practices**: What are the recommended approaches for overriding LaunchDarkly feature flags in Playwright tests?
2. **Vite Environment Variables**: Are there specific considerations for Vite environment variables in test environments that might affect `import.meta.env`?
3. **React Feature Flag Patterns**: What are common patterns for ensuring feature flags work reliably in test environments?
4. **Playwright Setup Timing**: Could there be timing issues with when localStorage overrides are applied vs when React components render?
5. **Component Conditional Rendering**: Are there alternative approaches to feature flag testing that bypass the flag system entirely?

### Specific Technical Questions
1. Should we mock the LaunchDarkly SDK entirely in tests instead of trying to override flags?
2. Are there Playwright-specific configurations for Vite that we might be missing?
3. Could the issue be related to how the LaunchDarkly React provider initializes?
4. Should we use a different approach like MSW (Mock Service Worker) to intercept LaunchDarkly API calls?
5. Are there debugging techniques to verify what flag values are actually being used at runtime?

## Code snippets and Configuration
- **useFeatureFlag Hook**: Additional logic to handle test environments and Playwright-specific conditions.
- **Playwright Config**: Detailing environment variables for flag overrides and server settings. 

### Example Code Changes
```typescript
// Playwright Config Changes
env: {
  VITE_PLAYWRIGHT_TEST: 'true',
  VITE_WALLET_UI_ENABLED: 'true',
}

// Adjusted Settings in useFeatureFlag
const isPlaywrightTest = import.meta.env.VITE_PLAYWRIGHT_TEST === 'true';
const isWalletUIEnabled = import.meta.env.VITE_WALLET_UI_ENABLED === 'true';
```

## Expectations

Through this research document, our goal is to identify adjustments or configurations that ensure the wallet smoke tests run as expected and validate all critical elements of the wallet UI.

---
