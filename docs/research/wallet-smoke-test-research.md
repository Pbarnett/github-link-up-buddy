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


Best Practices for LaunchDarkly Feature Flags in Playwright (Vite + React)
1. Overriding LaunchDarkly Feature Flags in Playwright Tests
Effective flag overrides in end-to-end tests require ensuring the application sees the desired flag values at runtime. Several approaches are recommended:
Use a LaunchDarkly test environment or controlled targeting: Allocate a separate LaunchDarkly environment or use context-based targeting rules for tests. For example, configure flags to return a specific variation when a test-specific user or context is provided. This lets you run tests with predictable flag values without modifying production settings
launchdarkly.com
. The downside is maintaining additional LaunchDarkly config and ensuring no conflicts between parallel tests.
Programmatically set flags via LaunchDarkly’s API: LaunchDarkly’s REST API allows toggling flags on the fly. In Playwright, you can use an API client (e.g. Axios) in test hooks to fetch and set flag values before running assertions
medium.com
medium.com
. For example, a Playwright beforeAll could record the current flag state and then send a PATCH request to enable the flag for the test run
medium.com
. After tests, reset the flag to its original state. This ensures the application under test actually receives the flag as “on” from LaunchDarkly’s service. (Be sure to use a LaunchDarkly API token and target a test project/environment to avoid impacting real users.) This approach directly manipulates flags and is robust, but requires network access and LaunchDarkly credentials in the test environment.
Intercept LaunchDarkly network requests in the test: Another practical strategy is to stub the flag-fetch calls that the front-end LaunchDarkly SDK makes. LaunchDarkly’s JavaScript client typically requests flag settings from a URL like app.launchdarkly.com/sdk/* (and opens an SSE stream for updates). In your Playwright test, you can intercept these calls and respond with a fake payload where the target flags are set to desired values. For example, a Cypress solution intercepts the GET request to LaunchDarkly and overrides the response JSON:
js
Copy
// Example from a Cypress test – similar concept can be applied in Playwright
cy.intercept(
  { method: "GET", hostname: /.*app.launchdarkly.com/ },
  (req) => req.reply(({ body }) => {
    body['wallet_ui'] = { value: true };    // force wallet_ui flag ON
    return body;
  })
);
cy.intercept(             // also stub streaming updates (EventSource)
  { method: "GET", hostname: /.*clientstream.launchdarkly.com/ },
  req => req.reply("data: no streaming feature flag data here\n\n", { 
    "content-type": "text/event-stream; charset=utf-8" 
  })
);
In Playwright, you can achieve the same with page.route() to intercept requests. This technique forces the app to receive a flag value of your choosing
dev.to
. It’s fast (no external call to LaunchDarkly) and keeps tests fully offline. Ensure you stub all relevant endpoints – e.g., return an empty response for any events.launchdarkly.com calls (analytics) and consider disabling the SSE stream if the SDK tries to open one
dev.to
. This approach essentially bypasses LaunchDarkly’s backend by fooling the SDK into using your provided values.
Use in-app overrides for test mode: If modifying the app code is feasible, you can add logic to detect a test running and override flags internally. For example, the app can check for a specific environment variable or marker (like VITE_PLAYWRIGHT_TEST=true) and then force certain flags on. In your React code, this might mean short-circuiting the LaunchDarkly flag hook to return true for wallet_ui when in a test environment. This is essentially a built-in backdoor for tests. It ensures that whenever tests run, the feature is enabled regardless of LaunchDarkly’s actual state. The snippet from the useFeatureFlag hook in the question is an example of this approach – it checks a Playwright test flag and, if set, simply returns true for the targeted flags before even calling LaunchDarkly. This method is straightforward and guarantees the UI is enabled in tests, but requires maintaining conditional logic in code (and care that it doesn’t affect production behavior).
Each approach has trade-offs. Using LaunchDarkly’s own API or environments keeps you closer to “real” usage of the SDK (good for end-to-end fidelity) but can slow tests or introduce complexity (especially if multiple tests run concurrently – you must avoid flag state conflicts
launchdarkly.com
). Stubbing network calls or using in-app overrides makes tests independent and fast, but you’re no longer exercising the LaunchDarkly integration itself. In practice, many teams combine these techniques: for broad end-to-end smoke tests, treat feature flags like configuration inputs – set them to known states at test start (via API or stubs) so the tests run deterministically
dev.to
. Reserve a smaller set of tests to specifically verify flagging logic (e.g. that the app hides/shows elements correctly given different flag values) using controlled toggling. Actionable recommendation: Given a Vite+React app, a pragmatic solution is to use Playwright to intercept LaunchDarkly calls or inject known flag values before app load. For example, you could build a helper that uses LaunchDarkly’s REST API to turn on wallet_ui at the start of the test suite
medium.com
, or configure Playwright’s page.route() to serve a local JSON with wallet_ui: true. This ensures the app renders the wallet UI during tests. In parallel, keep the in-app test override (as a fallback) but double-check it’s correctly detecting the test environment.
2. Vite Environment Variables in Test Environments (import.meta.env considerations)
When using Vite, environment variables with the VITE_ prefix are inlined at build time into the import.meta.env object. This means that for your tests to see those variables, they must be provided at build/serve time in the correct way. Key considerations include:
Define test mode env files or pass env vars explicitly: By default, Vite will load variables from files like .env.development or .env.test depending on the mode. If you run the dev server or build for testing, ensure you specify a mode (e.g. vite --mode test) or provide the needed vars. In the Playwright configuration shown, they set env: { VITE_PLAYWRIGHT_TEST: 'true', VITE_WALLET_UI_ENABLED: 'true' } for the dev server. This injects those variables into Vite’s process so that import.meta.env.VITE_PLAYWRIGHT_TEST will be "true" in the client code. Using a dedicated .env file (for example, .env.test with VITE_WALLET_UI_ENABLED=true) and running the server in that mode is an equivalent approach. The main point is that Playwright doesn’t magically share Node env vars with Vite’s client – you have to load them. One solution is to use a tool like dotenv in Playwright config to load a common .env file, and pass those values to both Playwright and Vite
stackoverflow.com
stackoverflow.com
. This ensures consistency between what your app was built with and what your tests expect.
Use import.meta.env in front-end code, not process.env: In a Vite+React app, any front-end code (like the LaunchDarkly provider initialization or feature flag hook) should use import.meta.env.VITE_* to access variables. process.env is only directly available in Node (or via Vite’s define plugin). For example, if your withLDProvider is using clientSideID: process.env.VITE_LD_CLIENT_ID, that might not work as expected in the browser – it likely should be import.meta.env.VITE_LD_CLIENT_ID. (Vite replaces import.meta.env.VITE_* with the literal values at compile time
v3.vitejs.dev
.) Double-check that the LaunchDarkly client ID and any test-specific flags (like VITE_WALLET_UI_ENABLED) are referenced via import.meta.env in the app code so they get the intended value.
Base URL and server config: Aside from env flags, ensure Playwright knows the correct URL to test and that the dev server starts with the right mode. In your case, the Playwright config’s baseURL: http://localhost:8080 and webServer command vite --port 8080 are set, which is correct. Just make sure the server actually runs with the env vars above. If you use reuseExistingServer, remember that changes to env vars might not take effect if the server was already running from a previous test run.
In summary, treat your Playwright test environment as a distinct deployment configuration. Load the same environment variables into Vite that you use to control flags in tests. A best practice is to have a .env.test (or similar) committed with things like VITE_PLAYWRIGHT_TEST=true and any API keys or client IDs needed for testing. Then start the app in “test mode” so that import.meta.env contains those values. This prevents surprises where import.meta.env is undefined or different in the test runtime. The Stack Overflow example below illustrates using a shared .env for Vite and Playwright, and extending Playwright’s test context to include those values (so both the app and test code know them)
stackoverflow.com
stackoverflow.com
:
Example:
.env file contains VITE_API_URL=https://someapi.com/api. Vite will expose import.meta.env.VITE_API_URL to the app. In Playwright, use dotenv.config() and pass process.env.VITE_API_URL through the Playwright config. Then your tests can use apiUrl and the app was built with the correct URL
stackoverflow.com
stackoverflow.com
.
For your specific case, verify that VITE_WALLET_UI_ENABLED and VITE_PLAYWRIGHT_TEST are indeed present in the import.meta.env seen by the React code. If not, adjust how the dev server is started (e.g., add --mode test or ensure those env vars are exported in the shell that launches Playwright).
3. Ensuring React Feature Flags Work Reliably in Test Environments
To make feature-flagged React components reliable under test, you need deterministic flag values and to avoid timing issues with flag loading. Common patterns and best practices include:
Wrap LaunchDarkly logic with a test-aware layer: Many teams create a small abstraction around flag checks (for example, a custom useFeatureFlag hook or context) that can be easily overridden in tests. Your project already has a useFeatureFlag hook that checks for test overrides before falling back to useFlags(). This is a good pattern. It allows central control: in tests you can tweak that hook (or the data it reads, like localStorage or env vars) to force flags on. LaunchDarkly’s documentation even suggests using “SDK wrappers” – essentially a layer around their client – to standardize flag usage and inject custom behavior (like fixed returns) in certain scenarios
launchdarkly.com
. By ensuring all components use your hook (and not directly the LaunchDarkly SDK), you can simulate any flag state in tests as needed.
Deterministic flag inputs: The overarching goal is that when running tests, the app already knows what value each feature flag should have. This can be achieved via configuration. For example, use a dedicated LaunchDarkly environment where the flag is enabled for all users, or use targeting rules that key off a test context attribute
launchdarkly.com
launchdarkly.com
. With that setup, whenever the test user (or a user with a special attribute like user.name = "e2e-test") is evaluated, LaunchDarkly will consistently return the variation you expect, without manual intervention. This approach was mentioned in LaunchDarkly’s docs as a way to avoid flakiness: supply a distinct context per test or suite and pre-configure flag targeting for those contexts
launchdarkly.com
launchdarkly.com
. It requires planning (and possibly multiple context IDs or attributes for different flag combinations), but once in place, your test just needs to use the right user identity and all flags resolve appropriately. This is highly reliable and supports running tests in parallel without state interference, though it involves more up-front LaunchDarkly config work.
Stubbing at component or network level: As discussed earlier, a simpler pattern for frontend tests is to stub out LaunchDarkly entirely when running in a test environment. For unit tests, LaunchDarkly provides a mocking library (e.g. jest-launchdarkly-mock) that lets you simulate flag values easily
launchdarkly.com
. In end-to-end tests, you can similarly stub network calls or use dependency injection to provide a fake flags client. The Cypress community solution we cited uses network stubs to ensure the React app always “sees” a specific flag state
dev.to
. Another variant is using Mock Service Worker (MSW) or a similar intercept in the browser to catch the SDK’s requests and return consistent responses (more on MSW below). The goal is to isolate the feature flag state from any external influence – the app thinks LaunchDarkly says “flag on” consistently, so the UI behaves accordingly.
Await flag readiness or bootstrap flags to avoid races: React applications might suffer from a flash of disabled content if flags load asynchronously. To combat this, you can use LaunchDarkly’s bootstrapping feature on the client, which provides initial flag values at SDK init
launchdarkly.com
. Bootstrapping can be done via localStorage (the SDK will read previously stored flags on startup) or by embedding flag data from the server. In practice, for testing, you might not need full bootstrapping, but you should at least wait until the LaunchDarkly client has initialized before asserting UI. The React SDK offers an asyncWithLDProvider to delay rendering until flags are ready
launchdarkly.com
. If your tests were flaking because the flag hadn’t been applied yet, wrapping your app with asyncWithLDProvider in test mode (or simply waiting on some flag-ready promise) could help. However, since you are forcing the flag on via overrides, it might be simpler: ensure those overrides are in place before the component tree mounts (so that on first render, useFeatureFlag returns the correct value, not the default). This ties into the next point on timing.
Test flags in isolation: A common pattern is to design your test suite to explicitly cover flag-enabled vs flag-disabled scenarios separately, rather than expecting one test run to handle both. For example, you might run the “wallet UI” tests with the flag on (and skip them when off), and conversely have a quick check that when the flag is off, the wallet UI is indeed absent (and skip any interactions specific to the feature)
thegreenreport.blog
thegreenreport.blog
. This way, each test run knows what state the app is in. It appears you already implemented skipping logic when the wallet tab is not visible – that’s an example of a toggle-aware test that adapts to the flag state. Ideally, you want fewer skips by ensuring the flag is enabled when you intend to test the feature, but keeping that conditional as a safety is fine. The guiding principle from a feature-flag testing strategy is: “test the feature flag variations in isolation with due diligence and stub it everywhere else”
dev.to
. In other words, when you’re testing the wallet feature, force it on; when you’re testing other functionality unrelated to it, you might run with it off or simply not assume its presence. This minimizes flaky tests due to unexpected flag states.
Actionable recommendations: Continue using your useFeatureFlag hook to centralize flag logic, but refine it if needed. Verify that the test override conditions (Playwright env var or userAgent detection) are indeed triggering in the test. If not, adjust those (for example, check the actual navigator.userAgent Playwright uses – ensure it contains HeadlessChrome or similar as you expect). Consider adding a log or console output in that hook for tests, e.g. console.log("Flag override:", flagName, flagValue) when in test mode, to gain insight during test runs (you can capture these logs via Playwright). In general, strive to initialize the LaunchDarkly client in a known state (or short-circuit it entirely) for tests, so that React components either always see the flag on or off as needed from the moment of first render. This will eliminate flicker and make tests predictable.
4. Timing Issues: LocalStorage Overrides vs React Component Render
Timing is critical when overriding flags via localStorage or other side-effects. If the React components mount (or the LaunchDarkly provider initializes) before your overrides are applied, the flags will still be in their default state on first render. Potential timing pitfalls and solutions:
Apply overrides before navigation or page load: Any localStorage value meant to influence LaunchDarkly should be set before the app’s code that reads it runs. In Playwright, that typically means using page.addInitScript() prior to page.goto(). Your _setup.ts shows you did exactly that – calling page.addInitScript to seed LD_PRESET_FLAGS in localStorage, then navigating to the page. This is correct. Make sure this script is indeed being added for every new context/page. (If you see the localStorage sometimes not set, double-check that the fixture or hook is applied globally. Playwright’s base.extend usage as shown should handle it for each test.) Essentially, by injecting a script via Playwright, you emulate what Cypress does with localStorage commands: ensuring that when the browser loads the app, the data is already there
stackoverflow.com
.
Verify LaunchDarkly reads the override: LaunchDarkly’s client-side SDK will check localStorage for cached flags if bootstrapping is enabled or if it had previous values. Simply setting an item like LD_PRESET_FLAGS may not automatically get read unless your code explicitly looks for it (which in your case, the custom hook does). Your useFeatureFlag does read localStorage.getItem('LD_PRESET_FLAGS') as a fallback. So the chain is: Playwright sets LD_PRESET_FLAGS before page load; React app starts, useFeatureFlag runs and finds the item, uses it to set the flag value. This should work as long as the key is correct and the code executes in that order. If timing is still off, consider that React might mount components before the LaunchDarkly flags arrive. However, since your override doesn’t wait for LaunchDarkly at all (it immediately pulls from localStorage), the only timing concern is ensuring that localStorage was populated first – which addInitScript addresses.
Check for asynchronous flag updates: If the LaunchDarkly provider later updates the flag (e.g., after connecting to the server), could it override your local override? In your hook, once flagValue is set from localStorage, you don’t override it with useFlags (because flagValue !== defaultValue). That means even if LaunchDarkly pushes an update, your logic will ignore it for that render. This is probably fine for a short-lived test. If you ever needed the app to respond to toggling mid-test, you’d have to reconsider that approach. But for now, the static override is acceptable. Just be aware that LaunchDarkly’s SDK might still fetch flags in the background – your intercept or the flag’s 0% rollout ensures it would fetch “off” anyway. No harm as long as your code prioritizes the override.
One-page vs multi-page tests: Note that localStorage is tied to the browser context (origin + storage state). If your tests navigate away or reload, the stored flag overrides should persist (as long as it’s the same context). Playwright by default uses a fresh context per test file unless configured otherwise. Since you set the items in the page fixture for each test, each test’s page starts with the flags. If you needed to verify something after a full page reload, ensure you don’t accidentally lose the override. A quick page.reload() should keep localStorage intact, but opening a new context would not. In case of any doubt, you could always re-set the overrides after a reload with another addInitScript (though usually not necessary with a single-page app).
Diagnosing timing issues: If you suspect a race condition, try adding a slight delay before asserting, or instrument the app to confirm when the flag value is set. For example, you could use page.waitForFunction to wait until window.localStorage.getItem('LD_PRESET_FLAGS') is seen by the app (or until a DOM element that only shows when the flag is on appears). However, the better solution is to avoid the race entirely by pre-setting data. The Stack Overflow discussion on Playwright global setup vs per-test setup echoes this: setting localStorage in a global context that isn’t used by the test page will have no effect on the test’s page, because it’s a different context. The fix is to do it in the page that will be used, via page.addInitScript, as you have done
stackoverflow.com
stackoverflow.com
. So the principle is: inject your overrides at the earliest possible point of the page lifecycle.
Actionable recommendations: You have already implemented the correct pattern (using page.addInitScript for localStorage). To further ensure timing alignment, you might do a quick sanity check in the test: after page.goto, retrieve the flag from localStorage or from the app to confirm it took effect. For example:
ts
Copy
await page.waitForLoadState('domcontentloaded');
const flagValue = await page.evaluate(() => localStorage.getItem('LD_PRESET_FLAGS'));
console.log('LD_PRESET_FLAGS in page:', flagValue);
This can confirm that the value is present during runtime. Additionally, consider simplifying the override mechanism if possible: since you already pass VITE_WALLET_UI_ENABLED=true into the app, you might not even need the localStorage in tests – the hook could just rely on the env var for that particular flag. Using one mechanism (either env or storage) consistently might reduce complexity. Regardless, the crucial part is inserting overrides before the React app evaluates flags, which you have achieved with the init script approach
stackoverflow.com
. If there is still an issue after these steps, it’s likely not timing but rather logic (e.g. the override code not running or not matching the flag name). In that case, add some console.debug messages in your app when in test mode to trace the code path. Playwright can capture these logs to help pinpoint if the override was skipped.
5. Alternative Approaches to Feature Flag Testing (Bypassing the Flag System)
Sometimes the easiest way to test features gated by flags is to avoid the flagging system entirely in tests. In other words, configure the application (just for testing) as if the feature flag didn’t exist and the feature is always on (or always off, depending on the scenario). Here are some alternative approaches to consider:
Build-time or runtime toggles: If a feature is under heavy development and testing, you can introduce a build-time flag or configuration for it. For example, using Vite’s define or an environment variable, you might compile a special test version of the app where FEATURE_WALLET_UI_ALWAYS_ON=true. The app can check this variable and render the wallet UI unconditionally in that case. This effectively bypasses LaunchDarkly. It’s similar to how one might use a compile-time toggle for debugging. In your case, VITE_WALLET_UI_ENABLED is acting like such a toggle – when true, your hook immediately returns true for wallet_ui without even querying LaunchDarkly. This is a valid approach. The test suite then just sets that var, and the feature is treated as enabled. The benefit is simplicity and no external dependencies; the downside is you aren’t testing the LaunchDarkly integration logic (just the feature itself). Still, for smoke tests that focus on UI functionality, this might be acceptable or even preferred.
Dependency injection / mocking LaunchDarkly: Another way to bypass the flag system is to replace the LaunchDarkly SDK in your app with a dummy implementation when in test mode. For example, if your launchDarklyService.ts or provider initialization is abstracted, you could swap it out. Some teams achieve this by checking an env var and using a different provider. Others use frontend dependency injection libraries or simply monkey-patch. As an illustration, you could do something like:
js
Copy
let ldClient: LDClient;
if (import.meta.env.VITE_PLAYWRIGHT_TEST) {
  ldClient = { variation: () => true, /* ...stub other methods...*/ };
} else {
  ldClient = LaunchDarkly.initialize(clientSideID, user);
}
And then use ldClient.variation in your feature checks. In React, a cleaner approach is wrapping the LaunchDarkly context. But since withLDProvider is a HOC outside your control, complete replacement is tricky without ejecting that logic. A simpler variant is to mock the network responses, which we covered (that’s effectively bypassing LaunchDarkly’s real backend). LaunchDarkly also provides an offline mode for its SDKs or a file-based approach for server SDKs
launchdarkly.com
launchdarkly.com
, but those don’t apply to the client-side React SDK. For client-side, if you truly don’t want LaunchDarkly involved, you either don’t include it in the test build or you override its outputs. Given that your current solution already intercepts the LaunchDarkly flow at the hook level, you might not need an outright SDK mock.
Testing the component directly with props: For isolated component testing (e.g., using Storybook or React Testing Library), one common technique is to structure components such that the feature can be controlled via props or context. Instead of the component calling useFeatureFlag internally, you could pass the flag value in as a prop in test. This is more relevant for unit tests or visual regression tests than Playwright, but it’s worth noting. If the wallet UI were a child component, you could render it in a test with a prop walletEnabled={true} to bypass feature gating. However, in an end-to-end scenario, you typically want to test it in the real app context, so this pattern is less applicable unless you write a special route or debug page that exposes the feature for testing purposes.
Manual toggling during test runs: An alternative outside of code changes is using the LaunchDarkly UI or CLI to set flags just for test runs. For example, LaunchDarkly has a CLI (ldctl) that can sync and override flag values or run a local proxy in offline mode
launchdarkly.com
launchdarkly.com
. You could script this in your test pipeline to ensure the flag is enabled in the LaunchDarkly project before Playwright starts. This is similar to using the API as mentioned in Q1, but via a CLI tool or relay proxy that serves static flag configs. It bypasses the normal evaluation by making LaunchDarkly always return your specified values (effectively disabling remote control for that test). This approach can be heavy and overkill for most UI tests, but it’s another way to guarantee a known flag state.
In summary, bypassing the flag system means treating the feature as if it’s a normal part of the app during tests. The primary method you’ve used is the environment-variable shortcut (VITE_WALLET_UI_ENABLED) which is a sound strategy. Continue to leverage that: it’s simple and doesn’t require network calls or complex mocks. Just ensure that this mechanism is well-isolated to tests (so it doesn’t accidentally get enabled elsewhere). As long as import.meta.env.VITE_WALLET_UI_ENABLED is only true in the Playwright context, you’re effectively running a special version of the app where the wallet feature is always on. That’s often the easiest path to test a feature thoroughly. One more idea: if for some reason the above strategies were not viable, you could consider a URL query param trigger for the feature (e.g., http://localhost:8080/profile?wallet_ui=1 that your app reads and enables the feature). This is not an official LaunchDarkly capability, but a custom hook for development/testing. Many apps have such “knobs” for debugging. It’s not the most elegant solution, but it’s an option to keep tests independent of LaunchDarkly entirely. Given your current setup, though, sticking with the env var override is preferable.
6. Specific: Mocking the LaunchDarkly SDK vs Overriding Flags in Tests
It’s a valid question whether you should mock LaunchDarkly entirely in tests rather than trying to coerce the real SDK into certain states. Mocking the SDK (for instance, replacing it with stub functions that return fixed values) can make tests simpler and faster by removing an external dependency. Here’s how to think about it:
Unit and integration tests: For lower-level tests, the official recommendation is to mock. LaunchDarkly provides a Jest mocking library to simplify this
launchdarkly.com
. The idea is to simulate ldClient.variation calls without making real connections. This is useful when testing individual components or hooks – you don’t want to hit the network or depend on LaunchDarkly for those. In those contexts, definitely mocking is the way to go (and you can test both flag true/false paths easily by controlling the mock).
End-to-end tests: For full Playwright tests, you have two options: use the real SDK (with controlled inputs as we’ve discussed) or stub it out. Mocking the SDK entirely in an E2E test would mean your application, when running under test, doesn’t even initialize the real LaunchDarkly client. Instead, it might use a fake. Achieving this usually requires a build switch or service injection (since in a running browser you can’t easily monkey-patch an already bundled SDK). If you can inject code via Playwright before LD initializes, you might hijack the global window.ldclient or window.LDClient if such exists – but the LaunchDarkly React SDK doesn’t expose a global by default. So a clean mock at E2E level likely needs to be built into the app (e.g., the environment variable approach we described effectively mocks the outcome of the SDK).
Stability vs realism: Mocking the SDK ensures absolute control (no flakiness from network calls, no delays). It is a bit like testing with a cheat code – you ensure the feature is on. For testing the UI and functionality of the feature, this is fine. You’re focusing on whether the wallet UI works, not whether LaunchDarkly works. Thus, mocking can be justified and is often simpler. The risk is that you might miss an integration issue (for example, if the app had a bug in how it identifies the user to LaunchDarkly, you wouldn’t catch it if you bypass LD entirely). If such integration tests are important, you could have a small number of them using the real SDK (maybe in a staging environment with real flags), separate from the main smoke tests.
Maintenance: If you decide to mock LD in Playwright, you need to maintain that mock logic. Right now, your useFeatureFlag test overrides serve as a partial mock. Another approach could be to initialize LaunchDarkly in “offline” mode if it supports it (some SDKs have an offline: true config where it will not connect and just use defaults or bootstrapped values). LaunchDarkly’s JavaScript SDK can be given an initial flags map (bootstrapping) which is akin to a mock because it won’t fetch from the server on start
launchdarkly.com
. You could leverage that: pass a hardcoded flag state object to withLDProvider during tests (if the library allows via an options.bootstrap parameter). That way the SDK initialises with your given flags and no network calls. This is a middle ground – you use the SDK, but it’s effectively pre-loaded with your fake data. It’s similar to a mock, but done via LaunchDarkly’s supported mechanism.
Recommendation: If you find your current override approach getting too complicated or brittle, don’t hesitate to mock more aggressively. The simplest form (as you have now) is to intercept the flag value at the hook – that’s effectively a partial mock of SDK output. You could take it further by preventing the SDK from even initializing (to save time and avoid any chance of interference). For instance, set the clientSideID to a dummy and bootstrap to your desired flags in a test config. This way, useFlags() will immediately return your values. That said, your current solution might be sufficient. It already ensures the SDK’s returned value is ignored in favor of your override. The key is that you trust the override path in tests more than the real SDK path. In conclusion, there’s nothing wrong with entirely mocking LaunchDarkly in E2E tests, especially for a feature that’s off by default globally (like your wallet_ui at 0% rollout). It’s often more efficient to simulate “flag ON” than to reconfigure the real service. Just document this in your testing strategy so it’s clear that when the flag system itself changes, you might need a different approach for those tests. For completeness, you might still want a separate test that does hit the real LaunchDarkly (e.g., a small test that verifies that when the flag is off, the UI is hidden – using the real LD client retrieving the 0% rollout). That ensures your integration wiring is correct. But for the bulk of UI checks behind the flag, a mock/override is perfectly fine and commonly used.
7. Specific: Playwright-Specific Configurations for Vite
Playwright itself doesn’t require special configuration for Vite, but there are a few settings to get right when testing a Vite-based application:
Starting the dev server with the correct mode/env: As discussed in Q2, ensure the Playwright webServer config starts Vite with the mode or env vars that enable your test settings. In the provided config snippet, they use env to pass variables and specify the port. This is good practice. Double-check if you need vite --mode test or if simply providing env vars is enough. If your Vite setup has any test-specific logic (for example, loading a .env.test or conditional code based on import.meta.env.MODE), use the mode flag to align with it.
Base URL / routing: Playwright’s baseURL should match the dev server’s address so you can do page.goto('/profile') without hardcoding the host. You have this set to http://localhost:8080, which is correct since Vite serves on 8080 in your config. Also, if your app uses client-side routing (e.g., React Router), ensure that direct navigation to /profile is supported (it likely is, given Vite’s dev server will serve the index.html for any route if configured properly). If not, you might need to instruct the dev server to fallback to index (Vite does this by default for spa, so probably fine).
Ensure consistent build between runs: One issue that can arise is if Playwright reuses a server or if Vite’s caching/hot-reload interferes. The config reuseExistingServer: !process.env.CI suggests that locally it won’t restart Vite on each run. That’s convenient, but be cautious: if you change the env vars or code and rerun tests without restarting, the app might not pick up new settings. In your iterative testing, if something isn’t working, try forcing a fresh start of the dev server. For CI, they wisely start a new instance each time.
Loading spinners or delayed content: Vite’s fast refresh and module reload shouldn’t affect Playwright, but if your app shows an interstitial loading state (maybe while LaunchDarkly initializes), you might need to account for that in tests (e.g., wait for an element to appear/disappear). This isn’t a config per se, but a test logic detail. If you use asyncWithLDProvider as mentioned, your app might delay rendering until flags are ready, which could actually simplify tests (no intermediate state). If not, you might see the UI appear disabled and then enable quickly – make sure your test waits appropriately. Using page.waitForSelector('data-testid=wallet-tab') before interacting is a good idea to ensure the element is present.
Developer tools / debugging: Sometimes in Vite apps, source maps are enabled in dev, which can help debug in Playwright by capturing console logs or errors with proper stack traces. There’s no special setup needed beyond running in development mode. If you run into issues, you can launch the browser in headed mode and open DevTools to inspect application state during the test. Vite’s config usually doesn’t need changes for this – just use PWDEBUG=1 or similar to pause on a failing test.
In essence, the main Playwright-specific config for Vite is making sure the dev server launches with test-friendly settings. You’ve done that by injecting env vars. You might also consider a slight timeout increase if the first load of the dev server is slow (the provided config uses 120 seconds which is generous). Another thing: if your app had any service workers or HMR websockets, Playwright might need to handle those (usually not an issue, but e.g. intercepting network calls might catch HMR pings – probably not applicable here). One more subtle point: process.env vs import.meta.env. Inside Playwright tests (Node context), you’ll use process.env (e.g., to read secrets or config). Inside the browser app (Vite context), it’s import.meta.env. Make sure not to confuse the two. For example, the withLDProvider snippet shows clientSideID: process.env.VITE_LD_CLIENT_ID – in a Vite app, process.env.X would be undefined unless Vite’s define plugin replaced it. If that code is actually running in the browser, it should be import.meta.env.VITE_LD_CLIENT_ID. This might be a documentation mix-up, but it’s worth verifying. If the LD clientSideID wasn’t injected properly, the SDK might not init at all. Ensuring that is correct is both a Vite and LaunchDarkly config issue. To summarize the Playwright+Vite config must-haves: proper env injection, correct baseURL, and coordinating server start/stop with tests. Your current config covers these. I would just add: consider using the vite preview (production build) for tests once in a while to mimic a real deployment. It’s not needed for everyday smoke tests (dev server is fine), but it can catch any differences in how import.meta.env is handled between dev and prod. In dev, import.meta.env includes all vars and HMR client, etc., whereas in a prod build it’s static. If your tests pass in dev but not in a prod build, that could indicate an env var wasn’t included correctly (for instance, Vite by default only inlines variables that start with VITE_ and are used in code at build time). So if you ever run npm run build and serve that for Playwright, make sure the build had the right mode. This is just a sanity check – since you specifically are focusing on a dev-server approach, you’re already using an environment that’s closest to local development with all flags injectable.
8. Specific: LaunchDarkly React Provider Initialization Considerations
The way the LaunchDarkly React SDK is initialized can indeed affect your test outcomes. The LaunchDarkly provider (withLDProvider or LDProvider) will start fetching flags as soon as it mounts, and by default it might render the app with default flag values until the real ones arrive. Here’s what to consider:
Client-side ID and user context: Ensure the clientSideID passed to withLDProvider is correct and corresponds to a LaunchDarkly environment you intend to use for testing. If this ID were missing or wrong, the SDK might be failing silently (or logging an error) and you’d get no flags. It sounds basic, but it’s worth verifying against your LaunchDarkly project settings. Also, the user (context) object provided – in your snippet it’s just { anonymous: true } – means all flag evaluations will use a single anonymous user. If your LaunchDarkly dashboard shows the flag off 100% for all users, then indeed that user will always get “off” for wallet_ui. Only your override logic can circumvent that. The provider itself won’t magically turn it on unless targeted. So there’s no conflict there: the provider likely initializes, fetches flags (gets wallet_ui=false), then your useFeatureFlag overrides it to true for rendering. This is fine, but be aware that the provider may emit a flag update event when it finishes initializing (with the off values). If your hook or components were listening to flag changes, they might process that. In your current code, you check if (flagValue === defaultValue) to decide whether to use flags[flagName]. If the override set flagValue=true, you never use flags[...]. So even if LaunchDarkly later provides false, you ignore it. That’s good for consistency. But if that condition was mishandled (say, the logic was slightly off), an incoming update could overwrite the UI state unexpectedly. So double-check that logic. As it stands, it appears correct.
Initialization timing: If using withLDProvider, your App component is wrapped and the SDK initializes after initial render by default. That means on the very first render, useFlags() might return an empty object or just default values. Your hook might treat that as flags === undefined (loading) or just missing the key. If your override didn’t trigger, the component might not see the flag and therefore not render the wallet UI initially. A moment later, if LaunchDarkly returns flags, React would re-render with the flag (which would still be false from LD). This could cause a flicker or a state where the wallet UI remains hidden. All of this underscores why your override must be in place immediately. Consider using the asyncWithLDProvider initialization in test mode, which would delay rendering until the LD client is ready (though if LD is returning “off”, that doesn’t solve it by itself – it just avoids flicker). Alternatively, as discussed, bootstrap the flag value. LaunchDarkly’s React SDK can accept an initial flags object via the flags prop in the provider config (older versions) or by using the bootstrap option in the underlying JS client. If there’s a config like:
tsx
Copy
export default withLDProvider({
  clientSideID: 'your-id',
  user: { anonymous: true },
  options: { bootstrap: { "wallet_ui": true, "profile_ui_revamp": true } }
})(App);
This might start the app with those flags = true until real values sync. Check LaunchDarkly’s docs for the exact syntax – the concept is to preload flag values. If you can inject that only for tests (perhaps via an environment check), the provider would initialize already “knowing” wallet_ui=true, and no flicker occurs. In fact, it may not even bother hitting the network if bootstrapped, or at least it will consider itself ready immediately
launchdarkly.com
launchdarkly.com
. This is an elegant solution if supported, because it uses the provider’s capabilities rather than external tricks.
Potential conflicts between provider and overrides: One thing to be careful of: if LaunchDarkly flags do arrive and your UI somehow decides to use them (for instance, if flags[flagName] becomes defined and your logic wasn’t guarding properly), the provider could override your intended state. To avoid that, ensure that when VITE_PLAYWRIGHT_TEST is true (or localStorage preset is set), you don’t even initialize the LaunchDarkly client or you always ignore its results. You could initialize LD in a “disabled” mode for tests (so it doesn’t connect). LaunchDarkly’s JS SDK has an evaluationReasons or offline mode for server SDKs – for client, a hacky way is to give it an empty user or set disableSync: true in options (if available) so it doesn’t fetch. This isn’t well-documented for the React SDK, but it might exist as an option. If not, what you have is okay since your code prioritizes the override.
Memory leaks or additional network calls: Another consideration with leaving the real provider in place (even though overridden) is that it will still attempt to stream or poll for flag updates, and send analytics events (like “flag evaluated”). These could be unnecessary in tests and even cause noise or slow things down (though likely minor). The Cypress stubs address this by also stubbing the events calls so no data is sent
dev.to
dev.to
. In Playwright, you might not worry about it unless it causes errors. If you see any LaunchDarkly-related errors in the console (for example, if it can’t connect to stream because of no network), you might need to stub or suppress those. It’s generally fine if the app is offline; the SDK will just retry or time out quietly. But be aware that the provider is doing work in the background unless fully disabled.
Actionable tips: Investigate if withLDProvider can take an initial flags object or if you can conditionally wrap the app differently in tests. If not, your current strategy of ignoring the provider’s values is acceptable. Just ensure that isTestEnv detection works as expected so the LaunchDarkly initialization doesn’t race ahead of your override. You could even set a short delay on LD init in test mode – e.g., don’t call withLDProvider until after a tick – but that’s getting complex and probably unnecessary. A simpler approach: if VITE_PLAYWRIGHT_TEST is true, you might configure the LaunchDarkly client with a dummy user that is targeted to always get true for wallet_ui. That way, even if it initializes, it would fetch “true”. This could be done by setting a custom context attribute (like { tags: ["e2e-test"] }) and having a LaunchDarkly rule “if user.tags contains e2e-test, wallet_ui true”. This is using LaunchDarkly’s targeting rather than overrides. It achieves similar effect without code changes, though it does require maintaining that rule in LD. In short, the LaunchDarkly React provider should be set up to accommodate test needs: correct clientSideID, possibly a special test user or bootstrap flags, and an understanding that in tests it might not need to do much. Your issues likely stem from the provider returning false (0%) and overriding not being applied early enough – we tackled the latter. So focusing on provider config: confirm the clientSideID and environment, and consider leveraging LaunchDarkly’s features (bootstrapping or context targeting) to make it feed the desired values during tests. If that’s not possible, continue to rely on your override in the hook, which effectively sidesteps the provider after initialization.
9. Specific: Using MSW (Mock Service Worker) to Intercept LaunchDarkly Calls
MSW is a popular tool for intercepting network requests in tests by running a service worker either in the browser or Node. In theory, you can use MSW to intercept LaunchDarkly’s HTTP requests in a Playwright test, but there are some nuances:
MSW in browser context: MSW can be applied by injecting a service worker script into the page that catches calls. This is typically done in development or storybook setups, where the app is configured to start MSW (e.g., via a conditional import in src/mocks/browser.js). For Playwright, you could have the app include MSW when import.meta.env.VITE_PLAYWRIGHT_TEST is true. That MSW script could intercept GET /sdk/eval/... or whatever endpoint LaunchDarkly uses and respond with preset flag JSON, similar to the Cypress stub approach. The benefit of MSW is that it works at the network level but within the context of the app’s execution, so it’s very flexible and can even handle multiple calls, etc. If you already have MSW set up for other API mocking in tests, it might make sense to add LaunchDarkly to its handlers.
MSW in Node context: MSW also has a Node version for unit tests. However, for E2E with a real browser, you’d use the service worker approach.
Comparison with Playwright’s built-in routing: Since Playwright can natively intercept network requests (page.route), using MSW is not strictly necessary for LaunchDarkly. Playwright’s intercept is simpler to activate (no need to register a service worker) and works well for fixed endpoints. MSW’s advantage would be if your app already relies on it or if you want to keep mocks closer to the app. For example, MSW could allow your app to run with mocked flags even when you open it manually in a browser (since the service worker would still intercept). Playwright’s page.route only affects the automated browser in the test.
Complexity: Introducing MSW for just LaunchDarkly might be an overkill if you can accomplish the same with a few lines of Playwright routing. On the other hand, MSW is very powerful if you have to mock complex sequences or want the mocks to be shared between testing frameworks.
If you consider MSW, the setup could be: in your _setup.ts or Playwright fixture, after setting localStorage, you inject the MSW worker script. MSW’s documentation provides a snippet to start the worker. You’d then define handlers for the LaunchDarkly endpoints. For example, a handler for the SDK flags endpoint returning a JSON with wallet_ui: true, and perhaps a handler to swallow events.launchdarkly.com posts. This approach is valid – essentially it’s doing what the Cypress plugin did, but in a technology-agnostic way. Recommendation: Given that you have a working solution now, adopting MSW isn’t necessary unless you plan to use it widely. It’s certainly possible to intercept LaunchDarkly with MSW, and some teams do use it to simulate feature flags in frontend tests. If you’re more comfortable writing interception logic declaratively (as MSW handlers) rather than imperative Playwright routes, you could try it. But keep in mind it adds an extra moving part (the service worker) to your test environment. One scenario where MSW shines is if you want to simulate toggling flags in the middle of a test. You could, for instance, have MSW initially return false for a flag, then during the test, programmatically change the handler to return true and reload the page or trigger a refetch. This would test that your app responds to flag changes. Playwright’s route can also fulfill dynamic responses but MSW might manage state more cleanly in that context. To sum up, using MSW to intercept LaunchDarkly is an alternative to Playwright’s network stubbing. Both achieve the same outcome: your app gets the flag data you want. MSW is more about setting up a mock server within the app. Playwright’s route is external control. If you already “bypass the flag system” via internal overrides, adding MSW doesn’t give much new benefit. It would be more relevant if you were trying to simulate LaunchDarkly’s real behavior in a controlled way (for example, testing a streaming update: MSW could push an EventSource message to flip a flag in real-time). In conclusion, it’s not necessary to introduce MSW just for this, but it’s a viable approach. The Cypress example we looked at is analogous to what an MSW handler would do: intercept LaunchDarkly endpoints and respond with specified data
dev.to
. If maintaining those mocks in code is easier for you with MSW’s API, it’s worth a try. Otherwise, Playwright’s built-in interception or the current env var override might suffice.
10. Specific: Debugging Techniques for Flag Values at Runtime
When tests aren’t behaving as expected, it’s crucial to verify what flag values the application is actually seeing at runtime. Here are some techniques to debug LaunchDarkly flags in a running app:
Use LaunchDarkly’s client methods in the console: LaunchDarkly’s JS SDK provides methods like ldClient.variation(<flagKey>) and ldClient.allFlags(). If you have access to the ldClient object, you can call allFlags() to get a snapshot of all flag keys and their values for the current user
launchdarkly.github.io
. In a React SDK scenario, you might need to get the underlying client. Often, the LD React SDK attaches the client to the context. If not easily accessible, you could temporarily add a line in your code (guarded by a test env check) like window.ldClient = ldClient right after initialization. This would allow you to open the browser console (or use Playwright’s page.evaluate) to call window.ldClient.allFlags(). Seeing that output will tell you definitively what the LaunchDarkly SDK believes each flag’s value is. For example, you might see { wallet_ui: false, profile_ui_revamp: false, ... } which would explain why the UI is hidden. If your overrides worked, ideally LaunchDarkly shouldn’t even list wallet_ui (if it wasn’t initialized) or it might still list it as false but your code ignored that. Either way, knowing the state helps.
Inspect localStorage and other storage: Since LaunchDarkly often caches flags in localStorage (especially if bootstrap: localStorage is used), check the storage keys. In the Stack Overflow thread, a user noticed flags stored under a composite key in localStorage
stackoverflow.com
. LaunchDarkly uses a key like LDFlags or a hash based on environment and user. You could do:
js
Copy
for(let key in localStorage) { 
  if(key.includes('LaunchDarkly')) console.log(key, localStorage.getItem(key)); 
}
to see if any LD entries exist. This can reveal if the SDK wrote something or read something. In your case, you set LD_PRESET_FLAGS – that’s your own key. Check that it remains present and correctly formatted (JSON string) at runtime. If it disappeared or wasn’t parsed, that’s a sign something went wrong (maybe the app cleared localStorage or navigated in a way that lost it).
Log within the app: The simplest yet often overlooked method: add console.log or console.debug in the code paths where flags are evaluated. For example, in useFeatureFlag, log the flagName and the decided flagValue along with which branch was taken (test override vs LaunchDarkly). Since Playwright can capture console output (page.on('console', msg => { ... })), you can assert on these messages or at least see them in the test logs. This is very insightful. In your provided output, you already print "Wallet elements found: { walletTab: false, ... }" after loading the page. That’s good – it told you the elements weren’t visible. You could augment this by printing what useFeatureFlag('wallet_ui') returned. Perhaps in the Profile page component, do something like:
jsx
Copy
const { data: walletEnabled } = useFeatureFlag('wallet_ui');
console.log('Wallet UI flag is', walletEnabled);
when in test mode. This would directly tell you if the app thinks the flag is true or false. Just remember to remove or guard these logs for production.
LaunchDarkly debugging tools: LaunchDarkly has a Debugger tab in their dashboard which shows incoming events. If your test runs are hitting the real LaunchDarkly environment, you can open the LD dashboard and see if any requests came in from your test user. The events would show flag evaluations. This is more useful if you suspect the SDK isn’t initializing or the user context is wrong. For instance, you might see that anonymous user abc123 evaluated wallet_ui = false. That confirms the flow. However, if you are mostly overriding, there might be no events or they all show false. The LD debugger won’t know about your overrides since those short-circuit the SDK.
Network inspection: Use Playwright’s network logging to see if a call to app.launchdarkly.com was made and what the response was. You can do page.on('response', response => { if(response.url().includes('launchdarkly')) console.log(await response.text()); }) to dump the body. This is essentially what the Cypress approach did by intercepting and logging
dev.to
. If you see the response JSON, verify if your flag was present and what its value was. This can tell you if maybe the flag wasn’t even included (LaunchDarkly might omit flags that are off and not used in code – though typically it sends all flags that the client has registered). If it’s not there, maybe the client never requested it (could happen if the flag key wasn’t known to the SDK initialization, but usually with client-side SDK, all flags are fetched). It’s more likely you’ll see "wallet_ui":{"value":false, ...} in the payload. That confirms the backend sent false.
Playwright’s screenshot or DOM snapshot: While not directly giving flag values, sometimes a screenshot of the page can be revealing. You might see a banner like “Network error” or some indication that LaunchDarkly failed to initialize (if such UI exists in your app). Or you might see that the wallet UI is truly not in the DOM at all vs just hidden. If hidden via CSS, maybe the flag was wired to CSS classes. If not present in DOM, the React conditional didn’t render it. All clues to trace back to the flag logic path.
Given your output logs, a key observation was that isWalletUIEnabled (from import.meta.env) and localStorage overrides were applied, yet you still got walletTab: false. This suggests the override code didn’t set the flag to true in time or at all. To debug that, I’d absolutely add a console in the useFeatureFlag hook to output something like: "Flag 'wallet_ui': isTestEnv=?, isPlaywrightTest=?, isWalletUIEnabled=?, finalValue=?". Then run the test and see the console output in the Playwright log. This will likely pinpoint the discrepancy (e.g., maybe import.meta.env.VITE_PLAYWRIGHT_TEST was false in the runtime, meaning the env injection didn’t work, which would cause the logic to skip to checking localStorage). Lastly, consider using a combination of these techniques. For instance, run one test with DEBUG logs on (you could set DEBUG=launchdarkly:* as an env var if LaunchDarkly uses debug logs – not sure if the JS SDK supports that, but the Node SDK does have a logging option). Or run the test in headed mode and manually open the devtools console to inspect global variables. The insight gained will direct you to the root cause. Summary of debugging tools: use ldClient.allFlags() to get all flag values
launchdarkly.github.io
, inspect localStorage for your preset and LD caches, sprinkle console.log in your flag logic, intercept network responses to LaunchDarkly to see what was delivered, and leverage LaunchDarkly’s own debugging (events or logs) if possible. By doing this, you can verify whether the test overrides are truly taking effect and trace any mismatch between expectation and reality. Once you identify, for example, “oh, the code didn’t think it was in a test environment, so it never set flagValue to true,” you can then fix the logic or config accordingly.
Sources:
LaunchDarkly Official Docs – Testing with feature flags (strategies for consistent flag configuration in tests)
launchdarkly.com
launchdarkly.com
LaunchDarkly Official Docs – SDK Wrappers and Bootstrapping (on providing initial flag values and custom SDK behavior)
launchdarkly.com
launchdarkly.com
Medium (Mahtab Nejad) – Controlling LaunchDarkly flags via API in Playwright (example of setting flag state in test setup)
medium.com
Dev.to (Murat Ozcan) – Feature flags testing in Cypress (stubbing LaunchDarkly network calls and strategies for flag state in tests)
dev.to
dev.to
Stack Overflow – Sharing env variables between Vite and Playwright (use of .env and Playwright config for import.meta.env)
stackoverflow.com
stackoverflow.com
Stack Overflow – Playwright localStorage in global setup (proper use of page.addInitScript to set localStorage for each page)
stackoverflow.com
LaunchDarkly JS SDK Reference – allFlags() (method to retrieve all flag values for debugging)
launchdarkly.github.io
(Additional inline code references from the provided project snippet and configuration for context)