# Vitest Error Analysis & Resolution Guide

## Overview
This document provides comprehensive solutions for resolving Vitest test failures based on the official Vitest documentation and best practices.

## Summary of Issues
- **62 Failed Test Suites** with multiple categories of errors
- **Import Resolution Errors**: Path alias issues and missing modules
- **TestContainers Configuration Error**: Incorrect waitStrategy setup
- **Environment Configuration Issues**: Missing environment variables and setup files

---

## 🚨 **CRITICAL FIXES REQUIRED**

### 1. TestContainers Configuration Error

**Error**: `TypeError: this.waitStrategy.withStartupTimeout is not a function`

**Root Cause**: Incorrect TestContainers setup - the `withStartupTimeout` method doesn't exist on waitStrategy.

**Fix**: Update `src/tests/testcontainers/setup.ts`
```typescript
import { PostgreSqlContainer, Wait } from '@testcontainers/postgresql';

// ❌ INCORRECT:
// this.postgresContainer = await new PostgreSqlContainer('postgres:15')
//   .withStartupTimeout(60000)  // This method doesn't exist

// ✅ CORRECT:
this.postgresContainer = await new PostgreSqlContainer('postgres:15')
  .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
  .withStartupTimeout(60000)  // Use on the container, not waitStrategy
  .withDatabase('parker_flight_test')
  .withUsername('test_user')
  .withPassword('test_password')
  .start();
```

**Vitest Best Practice**: Use `vi.setConfig({ testTimeout: 30000 })` for long-running container tests.
 ❯ src/tests/integration/database.test.ts:7:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/74]⎯

 FAIL   1  src/tests/integration/launchdarkly-integration.test.ts [ src/tests/integration/launchdarkly-integration.test.ts ]
Error: Failed to resolve import "@/lib/featureFlags/launchDarklyService" from "src/tests/integration/launchdarkly-integration.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly-integration.test.ts:3:0
  1  |  vi.mock("launchdarkly-js-client-sdk");
  2  |  const __vi_import_0__ = await import("launchdarkly-js-client-sdk");
  3  |  const __vi_import_1__ = await import("@/lib/featureFlags/launchDarklyService");
     |                                       ^
  4  |  const __vi_import_2__ = await import("@/lib/launchdarkly/fallback-manager");
  5  |  const __vi_import_3__ = await import("@/lib/launchdarkly/context-manager");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/74]⎯

 FAIL   1  src/tests/integration/launchdarkly-network-resilience.test.ts [ src/tests/integration/launchdarkly-network-resilience.test.ts ]
Error: Failed to resolve import "@/lib/featureFlags/launchDarklyService" from "src/tests/integration/launchdarkly-network-resilience.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly-network-resilience.test.ts:3:0
  1  |  vi.mock("launchdarkly-js-client-sdk");
  2  |  const __vi_import_0__ = await import("launchdarkly-js-client-sdk");
  3  |  const __vi_import_1__ = await import("@/lib/featureFlags/launchDarklyService");
     |                                       ^
  4  |  const __vi_import_2__ = await import("@/lib/launchdarkly/fallback-manager");
  5  |  const __vi_import_3__ = await import("@/lib/launchdarkly/context-manager");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/74]⎯

 FAIL   1  src/tests/integration/launchdarkly.test.ts [ src/tests/integration/launchdarkly.test.ts ]
Error: Failed to resolve import "@/lib/feature-flags/manager" from "src/tests/integration/launchdarkly.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly.test.ts:3:0
  5  |    init: vi.fn(() => mockLDClientNode)
  6  |  }));
  7  |  const __vi_import_0__ = await import("@/lib/feature-flags/manager");
     |                                       ^
  8  |  const __vi_import_1__ = await import("@/lib/feature-flags/client");
  9  |  import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/74]⎯

 FAIL   1  src/tests/services/profileCompletenessService.test.ts [ src/tests/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/services/profileCompletenessService.test.ts:2:43
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  3  |  describe("ProfileCompletenessService", () => {
  4  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/74]⎯

 FAIL   2  supabase/functions/tests/carry-on-fee.test.ts [ supabase/functions/tests/carry-on-fee.test.ts ]
Error: Cannot find package '@/tests/utils/supabaseMockFactory' imported from '/Users/parkerbarnett/github-link-up-buddy/supabase/functions/tests/carry-on-fee.test.ts'
 ❯ supabase/functions/tests/carry-on-fee.test.ts:3:1
      1| // supabase/functions/tests/carry-on-fee.test.ts
      2| import { describe, it, expect, beforeEach, vi } from 'vitest';
      3| import { mockSupabaseClient } from '@/tests/utils/supabaseMockFactory';
       | ^
      4| import { computeCarryOnFee } from "./helpers/computeCarryOnFeeTestable.ts";
      5| 

Caused by: Error: Failed to load url @/tests/utils/supabaseMockFactory (resolved id: @/tests/utils/supabaseMockFactory) in /Users/parkerbarnett/github-link-up-buddy/supabase/functions/tests/carry-on-fee.test.ts. Does the file exist?
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/74]⎯

 FAIL   0  src/flightSearchV2/useFlightOffers.test.ts [ src/flightSearchV2/useFlightOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useFeatureFlag" from "src/flightSearchV2/useFlightOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/flightSearchV2/useFlightOffers.test.ts:4:0
  2  |  vi.mock("@/serverActions/getFlightOffers");
  3  |  const __vi_import_0__ = await import("@testing-library/react");
  4  |  const __vi_import_1__ = await import("@/hooks/useFeatureFlag");
     |                                       ^
  5  |  const __vi_import_2__ = await import("@/serverActions/getFlightOffers");
  6  |  const __vi_import_3__ = await import("./useFlightOffers");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/74]⎯

 FAIL   0  src/pages/TripOffersV2.test.tsx [ src/pages/TripOffersV2.test.tsx ]
Error: Failed to resolve import "@/flightSearchV2/useFlightOffers" from "src/pages/TripOffersV2.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/pages/TripOffersV2.test.tsx:4:0
  21 |  const __vi_import_1__ = await import("@testing-library/react");
  22 |  const __vi_import_2__ = await import("react-router-dom");
  23 |  const __vi_import_3__ = await import("@/flightSearchV2/useFlightOffers");
     |                                       ^
  24 |  const __vi_import_4__ = await import("./TripOffersV2");
  25 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/74]⎯

 FAIL   0  src/lib/form-validation.test.ts [ src/lib/form-validation.test.ts ]
Error: Failed to resolve import "@/tests/setup-dynamic-forms" from "src/lib/form-validation.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/form-validation.test.ts:8:74
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { createMockFormConfiguration, createMockFieldConfiguration } from "@/tests/setup-dynamic-forms";
     |                                                                             ^
  3  |  import {
  4  |    generateZodSchema,
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/74]⎯

 FAIL   0  src/serverActions/getFlightOffers.test.ts [ src/serverActions/getFlightOffers.test.ts ]
Error: Failed to resolve import "@/integrations/supabase/client" from "src/serverActions/getFlightOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/serverActions/getFlightOffers.test.ts:3:0
  2  |    invokeEdgeFn: vi.fn()
  3  |  }));
  4  |  const __vi_import_0__ = await import("@/integrations/supabase/client");
     |                                       ^
  5  |  const __vi_import_1__ = await import("./getFlightOffers");
  6  |  import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/74]⎯

 FAIL   0  tests/unit/featureFlag.test.ts [ tests/unit/featureFlag.test.ts ]
Error: Failed to resolve import "@shared/featureFlag" from "tests/unit/featureFlag.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/featureFlag.test.ts:2:93
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { isEnabled, getFeatureFlagHash, userInBucket, getUserBucket } from "@shared/featureFlag";
     |                                                                              ^
  3  |  describe("Feature Flag System", () => {
  4  |    const createTestFlag = (enabled, rolloutPercentage) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/74]⎯

 FAIL   0  src/components/forms/FlightRuleForm.test.tsx [ src/components/forms/FlightRuleForm.test.tsx ]
Error: Failed to resolve import "@/components/ui/button" from "src/components/forms/FlightRuleForm.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/forms/FlightRuleForm.tsx:10:23
  5  |  import { zodResolver } from "@hookform/resolvers/zod";
  6  |  import { z } from "zod";
  7  |  import { Button } from "@/components/ui/button";
     |                          ^
  8  |  import { Input } from "@/components/ui/input";
  9  |  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/74]⎯

 FAIL   0  src/hooks/__tests__/useFormAnalytics.test.ts [ src/hooks/__tests__/useFormAnalytics.test.ts ]
Error: Failed to resolve import "@/integrations/supabase/client" from "src/hooks/__tests__/useFormAnalytics.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/hooks/__tests__/useFormAnalytics.test.ts:3:0
  5  |  }));
  6  |  const __vi_import_0__ = await import("@testing-library/react");
  7  |  const __vi_import_1__ = await import("@/integrations/supabase/client");
     |                                       ^
  8  |  
  9  |  import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/74]⎯

 FAIL   0  src/tests/contexts/PersonalizationContext.test.tsx [ src/tests/contexts/PersonalizationContext.test.tsx ]
Error: Failed to resolve import "@/contexts/PersonalizationContext" from "src/tests/contexts/PersonalizationContext.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/contexts/PersonalizationContext.test.tsx:10:0
  51 |  const __vi_import_1__ = await import("@testing-library/react");
  52 |  const __vi_import_2__ = await import("@tanstack/react-query");
  53 |  const __vi_import_3__ = await import("@/contexts/PersonalizationContext");
     |                                       ^
  54 |  
  55 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/74]⎯

 FAIL   0  src/tests/components/ConstraintChips.refactored.test.tsx [ src/tests/components/ConstraintChips.refactored.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "src/tests/components/ConstraintChips.refactored.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/ConstraintChips.refactored.test.tsx:4:49
  3  |  import { screen } from "@testing-library/react";
  4  |  import userEvent from "@testing-library/user-event";
  5  |  import ConstraintChips, { formatDateRange } from "@/components/trip/ConstraintChips";
     |                                                    ^
  6  |  import { renderWithProviders } from "@/tests/__helpers";
  7  |  describe("ConstraintChips (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/74]⎯

 FAIL   0  src/tests/components/ConstraintChips.test.tsx [ src/tests/components/ConstraintChips.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "src/tests/components/ConstraintChips.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/ConstraintChips.test.tsx:4:28
  2  |  import { describe, it, expect, vi } from "vitest";
  3  |  import { render, screen, fireEvent } from "@testing-library/react";
  4  |  import ConstraintChips from "@/components/trip/ConstraintChips";
     |                               ^
  5  |  describe("ConstraintChips", () => {
  6  |    const mockProps = {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/74]⎯

 FAIL   0  src/tests/components/PoolOfferControls.test.tsx [ src/tests/components/PoolOfferControls.test.tsx ]
Error: Failed to resolve import "@/components/trip/PoolOfferControls" from "src/tests/components/PoolOfferControls.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/PoolOfferControls.test.tsx:5:0
  8  |  const __vi_import_1__ = await import("@testing-library/react");
  9  |  const __vi_import_2__ = await import("react-router-dom");
  10 |  const __vi_import_3__ = await import("@/components/trip/PoolOfferControls");
     |                                       ^
  11 |  const __vi_import_4__ = await import("@/hooks/useTripOffers");
  12 |  const __vi_import_5__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.best-practices.test.tsx [ src/tests/components/TripRequestForm.best-practices.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.best-practices.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.best-practices.test.tsx:5:0
  91 |  const __vi_import_2__ = await import("@testing-library/user-event");
  92 |  const __vi_import_3__ = await import("react-router-dom");
  93 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  94 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  95 |  const __vi_import_6__ = await import("@/hooks/useCurrentUser");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.debug.test.tsx [ src/tests/components/TripRequestForm.debug.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.debug.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.debug.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.isolated.test.tsx [ src/tests/components/TripRequestForm.isolated.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.isolated.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.isolated.test.tsx:5:0
  31 |  const __vi_import_2__ = await import("@testing-library/user-event");
  32 |  const __vi_import_3__ = await import("react-router-dom");
  33 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  34 |  const __vi_import_5__ = await import("@/hooks/useCurrentUser");
  35 |  const __vi_import_6__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.final.test.tsx [ src/tests/components/TripRequestForm.mode.final.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.final.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.final.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.fixed.test.tsx [ src/tests/components/TripRequestForm.mode.fixed.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.fixed.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.fixed.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.test.tsx [ src/tests/components/TripRequestForm.mode.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.test.tsx:6:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.simple.test.tsx [ src/tests/components/TripRequestForm.simple.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.simple.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.simple.test.tsx:4:0
  46 |  const __vi_import_1__ = await import("@testing-library/react");
  47 |  const __vi_import_2__ = await import("react-router-dom");
  48 |  const __vi_import_3__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  49 |  
  50 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.test.tsx [ src/tests/components/TripRequestForm.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.test.tsx:6:0
  145|  const __vi_import_2__ = await import("@testing-library/user-event");
  146|  const __vi_import_3__ = await import("react-router-dom");
  147|  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  148|  const __vi_import_5__ = await import("@/tests/utils/TestWrapper");
  149|  const __vi_import_6__ = await import("@/integrations/supabase/client");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.working-demo.test.tsx [ src/tests/components/TripRequestForm.working-demo.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.working-demo.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.working-demo.test.tsx:5:0
  28 |  const __vi_import_2__ = await import("@testing-library/user-event");
  29 |  const __vi_import_3__ = await import("react-router-dom");
  30 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  31 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  32 |  const __vi_import_6__ = await import("@/hooks/useCurrentUser");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/74]⎯

 FAIL   0  src/tests/feature-flags/userInBucket.test.ts [ src/tests/feature-flags/userInBucket.test.ts ]
Error: Failed to resolve import "@/shared/featureFlag" from "src/tests/feature-flags/userInBucket.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/feature-flags/userInBucket.test.ts:2:44
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { userInBucket, getUserBucket } from "@/shared/featureFlag";
     |                                               ^
  3  |  describe("userInBucket", () => {
  4  |    it("should produce consistent hash results (protect against algorithm changes)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/74]⎯

 FAIL   0  src/tests/hooks/usePoolsSafe.test.ts [ src/tests/hooks/usePoolsSafe.test.ts ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "src/tests/hooks/usePoolsSafe.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/usePoolsSafe.test.ts:4:0
  11 |  }));
  12 |  const __vi_import_0__ = await import("@testing-library/react");
  13 |  const __vi_import_1__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  14 |  const __vi_import_2__ = await import("@/hooks/useTripOffers");
  15 |  const __vi_import_3__ = await import("@/hooks/useTripOffersLegacy");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/74]⎯

 FAIL   0  src/tests/hooks/useTripOffers.test.ts [ src/tests/hooks/useTripOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "src/tests/hooks/useTripOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffers.test.ts:3:0
  25 |  }));
  26 |  const __vi_import_0__ = await import("@testing-library/react");
  27 |  const __vi_import_1__ = await import("@/hooks/useTripOffersLegacy");
     |                                       ^
  28 |  const __vi_import_2__ = await import("@/services/tripOffersService");
  29 |  const __vi_import_3__ = await import("@/services/api/flightSearchApi");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/74]⎯

 FAIL   0  src/tests/hooks/useTripOffersLegacy.helpers.test.ts [ src/tests/hooks/useTripOffersLegacy.helpers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "src/tests/hooks/useTripOffersLegacy.helpers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffersLegacy.helpers.test.ts:2:22
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { _test } from "@/hooks/useTripOffersLegacy";
     |                         ^
  3  |  describe("useTripOffersLegacy Helper Functions", () => {
  4  |    describe("validateDuration", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/74]⎯

 FAIL   0  src/tests/hooks/useTripOffersPools.test.ts [ src/tests/hooks/useTripOffersPools.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffers" from "src/tests/hooks/useTripOffersPools.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffersPools.test.ts:4:0
  26 |  }));
  27 |  const __vi_import_0__ = await import("@testing-library/react");
  28 |  const __vi_import_1__ = await import("@/hooks/useTripOffers");
     |                                       ^
  29 |  
  30 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/74]⎯

 FAIL   0  src/tests/pages/Dashboard.test.tsx [ src/tests/pages/Dashboard.test.tsx ]
Error: Failed to resolve import "@/pages/Dashboard" from "src/tests/pages/Dashboard.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/pages/Dashboard.test.tsx:11:0
  64 |  const __vi_import_4__ = await import("react-router-dom");
  65 |  const __vi_import_5__ = await import("@tanstack/react-query");
  66 |  const __vi_import_6__ = await import("@/pages/Dashboard");
     |                                       ^
  67 |  
  68 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/74]⎯

 FAIL   0  src/tests/pages/TripConfirm.test.tsx [ src/tests/pages/TripConfirm.test.tsx ]
Error: Failed to resolve import "@/pages/TripConfirm" from "src/tests/pages/TripConfirm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/pages/TripConfirm.test.tsx:9:0
  27 |  const __vi_import_2__ = await import("@testing-library/react");
  28 |  const __vi_import_3__ = await import("react-router-dom");
  29 |  const __vi_import_4__ = await import("@/pages/TripConfirm");
     |                                       ^
  30 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  31 |  const __vi_import_6__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/74]⎯

 FAIL   0  src/tests/serverActions/getFlightOffers.refactored.test.ts [ src/tests/serverActions/getFlightOffers.refactored.test.ts ]
Error: Failed to resolve import "@/serverActions/getFlightOffers" from "src/tests/serverActions/getFlightOffers.refactored.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/serverActions/getFlightOffers.refactored.test.ts:7:7
  4  |    transformLegacyToV2,
  5  |    transformLegacyOffers
  6  |  } from "@/serverActions/getFlightOffers";
     |          ^
  7  |  import { createMockSupabaseClient } from "@/tests/__helpers";
  8  |  describe("getFlightOffers (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/74]⎯

 FAIL   0  src/tests/services/profileCompletenessService.test.ts [ src/tests/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/services/profileCompletenessService.test.ts:2:43
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  3  |  describe("ProfileCompletenessService", () => {
  4  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/74]⎯

 FAIL   0  src/tests/utils/getPoolDisplayName.test.ts [ src/tests/utils/getPoolDisplayName.test.ts ]
Error: Failed to resolve import "@/utils/getPoolDisplayName" from "src/tests/utils/getPoolDisplayName.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/utils/getPoolDisplayName.test.ts:3:35
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { getPoolDisplayName } from "@/utils/getPoolDisplayName";
     |                                      ^
  3  |  describe("getPoolDisplayName", () => {
  4  |    it("returns correct names for manual mode", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/74]⎯

 FAIL   0  tests/unit/hooks/usePoolsSafe.test.ts [ tests/unit/hooks/usePoolsSafe.test.ts ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "tests/unit/hooks/usePoolsSafe.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/usePoolsSafe.test.ts:4:0
  11 |  }));
  12 |  const __vi_import_0__ = await import("@testing-library/react");
  13 |  const __vi_import_1__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  14 |  const __vi_import_2__ = await import("@/hooks/useTripOffers");
  15 |  const __vi_import_3__ = await import("@/hooks/useTripOffersLegacy");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffers.test.ts [ tests/unit/hooks/useTripOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "tests/unit/hooks/useTripOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffers.test.ts:3:0
  25 |  }));
  26 |  const __vi_import_0__ = await import("@testing-library/react");
  27 |  const __vi_import_1__ = await import("@/hooks/useTripOffersLegacy");
     |                                       ^
  28 |  const __vi_import_2__ = await import("@/services/tripOffersService");
  29 |  const __vi_import_3__ = await import("@/services/api/flightSearchApi");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffersLegacy.helpers.test.ts [ tests/unit/hooks/useTripOffersLegacy.helpers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "tests/unit/hooks/useTripOffersLegacy.helpers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffersLegacy.helpers.test.ts:2:22
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { _test } from "@/hooks/useTripOffersLegacy";
     |                         ^
  3  |  describe("useTripOffersLegacy Helper Functions", () => {
  4  |    describe("validateDuration", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffersPools.test.ts [ tests/unit/hooks/useTripOffersPools.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffers" from "tests/unit/hooks/useTripOffersPools.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffersPools.test.ts:4:0
  26 |  }));
  27 |  const __vi_import_0__ = await import("@testing-library/react");
  28 |  const __vi_import_1__ = await import("@/hooks/useTripOffers");
     |                                       ^
  29 |  
  30 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/74]⎯

 FAIL   0  tests/unit/components/CampaignForm.test.tsx [ tests/unit/components/CampaignForm.test.tsx ]
Error: Failed to resolve import "@/components/autobooking/CampaignForm" from "tests/unit/components/CampaignForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/CampaignForm.test.tsx:9:0
  8  |  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  9  |  const __vi_import_1__ = await import("@testing-library/react");
  10 |  const __vi_import_2__ = await import("@/components/autobooking/CampaignForm");
     |                                       ^
  11 |  
  12 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/74]⎯

 FAIL   0  tests/unit/components/ConstraintChips.refactored.test.tsx [ tests/unit/components/ConstraintChips.refactored.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "tests/unit/components/ConstraintChips.refactored.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/ConstraintChips.refactored.test.tsx:4:49
  3  |  import { screen } from "@testing-library/react";
  4  |  import userEvent from "@testing-library/user-event";
  5  |  import ConstraintChips, { formatDateRange } from "@/components/trip/ConstraintChips";
     |                                                    ^
  6  |  import { renderWithProviders } from "@/tests/__helpers";
  7  |  describe("ConstraintChips (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/74]⎯

 FAIL   0  tests/unit/components/ConstraintChips.test.tsx [ tests/unit/components/ConstraintChips.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "tests/unit/components/ConstraintChips.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/ConstraintChips.test.tsx:4:28
  2  |  import { describe, it, expect, vi } from "vitest";
  3  |  import { render, screen, fireEvent } from "@testing-library/react";
  4  |  import ConstraintChips from "@/components/trip/ConstraintChips";
     |                               ^
  5  |  describe("ConstraintChips", () => {
  6  |    const mockProps = {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/74]⎯

 FAIL   0  tests/unit/components/PoolOfferControls.test.tsx [ tests/unit/components/PoolOfferControls.test.tsx ]
Error: Failed to resolve import "@/components/trip/PoolOfferControls" from "tests/unit/components/PoolOfferControls.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/PoolOfferControls.test.tsx:5:0
  8  |  const __vi_import_1__ = await import("@testing-library/react");
  9  |  const __vi_import_2__ = await import("react-router-dom");
  10 |  const __vi_import_3__ = await import("@/components/trip/PoolOfferControls");
     |                                       ^
  11 |  const __vi_import_4__ = await import("@/hooks/useTripOffers");
  12 |  const __vi_import_5__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/74]⎯

 FAIL   0  tests/unit/components/TripRequestForm.test.tsx [ tests/unit/components/TripRequestForm.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "tests/unit/components/TripRequestForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/TripRequestForm.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/74]⎯

 FAIL   0  tests/unit/serverActions/getFlightOffers.refactored.test.ts [ tests/unit/serverActions/getFlightOffers.refactored.test.ts ]
Error: Failed to resolve import "@/serverActions/getFlightOffers" from "tests/unit/serverActions/getFlightOffers.refactored.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/serverActions/getFlightOffers.refactored.test.ts:7:7
  4  |    transformLegacyToV2,
  5  |    transformLegacyOffers
  6  |  } from "@/serverActions/getFlightOffers";
     |          ^
  7  |  import { createMockSupabaseClient } from "@/tests/__helpers";
  8  |  describe("getFlightOffers (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/74]⎯

 FAIL   0  tests/unit/pages/Dashboard.test.tsx [ tests/unit/pages/Dashboard.test.tsx ]
Error: Failed to resolve import "@/pages/Dashboard" from "tests/unit/pages/Dashboard.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/pages/Dashboard.test.tsx:7:0
  58 |  const __vi_import_2__ = await import("@testing-library/user-event");
  59 |  const __vi_import_3__ = await import("react-router-dom");
  60 |  const __vi_import_4__ = await import("@/pages/Dashboard");
     |                                       ^
  61 |  
  62 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/74]⎯

 FAIL   0  tests/unit/services/profileCompletenessService.test.ts [ tests/unit/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "tests/unit/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/services/profileCompletenessService.test.ts:1:43
  1  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  2  |  describe("ProfileCompletenessService", () => {
  3  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/74]⎯

 FAIL   0  tests/unit/utils/getPoolDisplayName.test.ts [ tests/unit/utils/getPoolDisplayName.test.ts ]
Error: Failed to resolve import "@/utils/getPoolDisplayName" from "tests/unit/utils/getPoolDisplayName.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/utils/getPoolDisplayName.test.ts:3:35
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { getPoolDisplayName } from "@/utils/getPoolDisplayName";
     |                                      ^
  3  |  describe("getPoolDisplayName", () => {
  4  |    it("returns correct names for manual mode", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/74]⎯

 FAIL   0  src/components/filtering/__tests__/frontend-integration.test.tsx [ src/components/filtering/__tests__/frontend-integration.test.tsx ]
Error: Failed to resolve import "@/hooks/useFilterState" from "src/components/filtering/__tests__/frontend-integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/filtering/__tests__/frontend-integration.test.tsx:15:0
  92 |  const __vi_import_2__ = await import("@testing-library/react");
  93 |  const __vi_import_3__ = await import("react-router-dom");
  94 |  const __vi_import_4__ = await import("@/hooks/useFilterState");
     |                                       ^
  95 |  const __vi_import_5__ = await import("../AdvancedFilterControls");
  96 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/74]⎯

 FAIL   0  src/lib/filtering/__tests__/integration-simple.test.ts [ src/lib/filtering/__tests__/integration-simple.test.ts ]
Error: Failed to resolve import "@/lib/filtering" from "src/lib/filtering/__tests__/integration-simple.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/filtering/__tests__/integration-simple.test.ts:7:51
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { FilterFactory, createFilterContext } from "@/lib/filtering";
     |                                                      ^
  3  |  function testNormalizeOffers(rawOffers, provider) {
  4  |    return rawOffers.map((offer) => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/74]⎯

 FAIL   0  src/lib/filtering/__tests__/integration.test.ts [ src/lib/filtering/__tests__/integration.test.ts ]
Error: Failed to resolve import "@/services/tripOffersService" from "src/lib/filtering/__tests__/integration.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/filtering/__tests__/integration.test.ts:7:0
  109|    }
  110|  }));
  111|  const __vi_import_0__ = await import("@/services/tripOffersService");
     |                                       ^
  112|  const __vi_import_1__ = await import("@/lib/filtering");
  113|  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/74]⎯

 FAIL   0  src/tests/components/dashboard/TripHistory.test.tsx [ src/tests/components/dashboard/TripHistory.test.tsx ]
Error: Failed to resolve import "@/components/dashboard/TripHistory" from "src/tests/components/dashboard/TripHistory.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/dashboard/TripHistory.test.tsx:10:0
  15 |  const __vi_import_1__ = await import("@testing-library/react");
  16 |  const __vi_import_2__ = await import("react-router-dom");
  17 |  const __vi_import_3__ = await import("@/components/dashboard/TripHistory");
     |                                       ^
  18 |  const __vi_import_4__ = await import("@/integrations/supabase/client");
  19 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/74]⎯

 FAIL   0  src/tests/components/personalization/GreetingBanner.test.tsx [ src/tests/components/personalization/GreetingBanner.test.tsx ]
Error: Failed to resolve import "@/components/personalization/GreetingBanner" from "src/tests/components/personalization/GreetingBanner.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/personalization/GreetingBanner.test.tsx:8:0
  62 |  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  63 |  const __vi_import_1__ = await import("@testing-library/react");
  64 |  const __vi_import_2__ = await import("@/components/personalization/GreetingBanner");
     |                                       ^
  65 |  
  66 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/74]⎯

 FAIL   0  src/tests/components/personalization/PersonalizedGreeting.test.tsx [ src/tests/components/personalization/PersonalizedGreeting.test.tsx ]
Error: Failed to resolve import "@/components/personalization/PersonalizedGreeting" from "src/tests/components/personalization/PersonalizedGreeting.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/personalization/PersonalizedGreeting.test.tsx:7:0
  5  |  const __vi_import_1__ = await import("@testing-library/react");
  6  |  const __vi_import_2__ = await import("@testing-library/jest-dom");
  7  |  const __vi_import_3__ = await import("@/components/personalization/PersonalizedGreeting");
     |                                       ^
  8  |  
  9  |  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/74]⎯

 FAIL   0  src/tests/components/profile/SimpleProfileStatus.test.tsx [ src/tests/components/profile/SimpleProfileStatus.test.tsx ]
Error: Failed to resolve import "@/components/profile/SimpleProfileStatus" from "src/tests/components/profile/SimpleProfileStatus.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/profile/SimpleProfileStatus.test.tsx:9:0
  109|  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  110|  const __vi_import_1__ = await import("@testing-library/react");
  111|  const __vi_import_2__ = await import("@/components/profile/SimpleProfileStatus");
     |                                       ^
  112|  
  113|  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/74]⎯

 FAIL   0  src/tests/unit/services/profileCompletenessService.enhanced.test.ts [ src/tests/unit/services/profileCompletenessService.enhanced.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/unit/services/profileCompletenessService.enhanced.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/unit/services/profileCompletenessService.enhanced.test.ts:9:0
  9  |          }
  10 |        }));
  11 |  const __vi_import_0__ = await import("@/services/profileCompletenessService");
     |                                       ^
  12 |  import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
  13 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/74]⎯

 FAIL   0  tests/unit/components/dashboard/TripHistory.test.tsx [ tests/unit/components/dashboard/TripHistory.test.tsx ]
Error: Failed to resolve import "@/components/dashboard/TripHistory" from "tests/unit/components/dashboard/TripHistory.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/dashboard/TripHistory.test.tsx:6:0
  15 |  const __vi_import_1__ = await import("@testing-library/react");
  16 |  const __vi_import_2__ = await import("react-router-dom");
  17 |  const __vi_import_3__ = await import("@/components/dashboard/TripHistory");
     |                                       ^
  18 |  const __vi_import_4__ = await import("@/integrations/supabase/client");
  19 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/74]⎯

 FAIL   0  tests/unit/components/profile/SimpleProfileStatus.test.tsx [ tests/unit/components/profile/SimpleProfileStatus.test.tsx ]
Error: Failed to resolve import "@/components/profile/SimpleProfileStatus" from "tests/unit/components/profile/SimpleProfileStatus.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/profile/SimpleProfileStatus.test.tsx:4:0
  109|  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  110|  const __vi_import_1__ = await import("@testing-library/react");
  111|  const __vi_import_2__ = await import("@/components/profile/SimpleProfileStatus");
     |                                       ^
  112|  
  113|  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolHeader.test.tsx [ src/components/trip/Pools/__tests__/PoolHeader.test.tsx ]
Error: Failed to resolve import "@/components/ui/badge" from "src/components/trip/Pools/PoolHeader.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/PoolHeader.tsx:6:22
  1  |  import { jsxDEV } from "react/jsx-dev-runtime";
  2  |  import { Badge } from "@/components/ui/badge";
     |                         ^
  3  |  const PoolHeader = ({ name, count }) => {
  4  |    return /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolLayout.test.tsx [ src/components/trip/Pools/__tests__/PoolLayout.test.tsx ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "src/components/trip/Pools/__tests__/PoolLayout.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/__tests__/PoolLayout.test.tsx:5:0
  26 |  const __vi_import_1__ = await import("@testing-library/react");
  27 |  const __vi_import_2__ = await import("react-router-dom");
  28 |  const __vi_import_3__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  29 |  const __vi_import_4__ = await import("../PoolLayout");
  30 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolSection.test.tsx [ src/components/trip/Pools/__tests__/PoolSection.test.tsx ]
Error: Failed to resolve import "@/components/ui/collapsible" from "src/components/trip/Pools/PoolSection.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/PoolSection.tsx:7:68
  1  |  import { jsxDEV } from "react/jsx-dev-runtime";
  2  |  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
     |                                                                       ^
  3  |  import PoolHeader from "./PoolHeader";
  4  |  const PoolSection = ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/74]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 12 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL   2  supabase/functions/tests/amadeusToken.test.ts > Amadeus Token Caching > should handle API errors
AssertionError: expected [Function] to throw error including 'Failed to get Amadeus access token: 4…' but got 'Authentication failed: AUTHENTICATION…'

Expected: "Failed to get Amadeus access token: 401"
Received: "Authentication failed: AUTHENTICATION - Unauthorized"

 ❯ supabase/functions/tests/amadeusToken.test.ts:127:5
    125|     const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    126|     
    127|     await expect(getAmadeusAccessToken()).rejects.toThrow('Failed to get Amadeus access token: 401');
       |     ^
    128|   });
    129| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/74]⎯

 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 1. should do nothing if no bookings are due for reminder
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 2. should send one reminder if one booking is due
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 3. should send multiple reminders if multiple bookings are due
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 4. should skip reminder if already sent (duplicate check active)
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 5. should return 500 if error querying bookings
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 6. should continue processing if one send-notification call fails
Error: Only URLs with a scheme in: file and data are supported by the default ESM loader. Received protocol 'https:'
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Error Handling > should handle rate limiting errors
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/tests/duffel-integration.test.ts:358:5
    356|     })
    357| 
    358|     it('should handle rate limiting errors', async () => {
       |     ^
    359|       const rateLimitError = {
    360|         errors: [{ type: 'rate_limit_exceeded' }],

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Error Handling > should provide default error message for unknown errors
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/tests/duffel-integration.test.ts:376:5
    374|     })
    375| 
    376|     it('should provide default error message for unknown errors', async () => {
       |     ^
    377|       const unknownError = {
    378|         errors: [{ type: 'unknown_error_type' }],

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Utility Functions > should map passenger data correctly
Error: Cannot find module '../services/duffelServiceGuided'
Require stack:
- /Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts
 ❯ src/tests/duffel-integration.test.ts:430:40
    428|   describe('Utility Functions', () => {
    429|     it('should map passenger data correctly', () => {
    430|       const { mapPassengerToDuffel } = require('../services/duffelServiceGuided')
       |                                        ^
    431|       
    432|       const passengerData = {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Utility Functions > should map trip requests to Duffel search parameters
Error: Cannot find module '../services/duffelServiceGuided'
Require stack:
- /Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts
 ❯ src/tests/duffel-integration.test.ts:465:48
    463| 
    464|     it('should map trip requests to Duffel search parameters', () => {
    465|       const { mapTripRequestToDuffelSearch } = require('../services/duffelServiceGuided')
       |                                                ^
    466|       
    467|       const tripRequest = {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/74]⎯

 FAIL   0  src/tests/duffel-performance.test.ts > Duffel Performance Tests > Error Recovery and Resilience > should handle malformed responses gracefully
AssertionError: expected 2 to be 6 // Object.is equality

- Expected
+ Received

- 6
+ 2

 ❯ src/tests/duffel-performance.test.ts:388:33
    386|       }
    387| 
    388|       expect(handledGracefully).toBe(malformedResponses.length)
       |                                 ^
    389|       console.log(`Malformed Response Test: ${handledGracefully} responses handled gracefully`)
    390|     })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/74]⎯

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Error: Only URLs with a scheme in: file and data are supported by the default ESM loader. Received protocol 'https:'
 ❯ getSource node:internal/modules/esm/load:47:11
 ❯ defaultLoad node:internal/modules/esm/load:113:40
 ❯ ModuleLoader.load node:internal/modules/esm/loader:800:12
 ❯ ModuleLoader.loadAndTranslate node:internal/modules/esm/loader:580:43
 ❯ ModuleLoader.#createModuleJob node:internal/modules/esm/loader:604:36
 ❯ ModuleLoader.#getJobFromResolveResult node:internal/modules/esm/loader:338:34
 ❯ ModuleLoader.getModuleJobForImport node:internal/modules/esm/loader:306:41
 ❯ processTicksAndRejections node:internal/process/task_queues:105:5
 ❯ onImport.tracePromise.__proto__ node:internal/modules/esm/loader:643:25

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'ERR_UNSUPPORTED_ESM_URL_SCHEME' }
This error originated in "supabase/functions/tests/send-reminder.test.ts" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
The latest test that might've caused the error is "2. should send one reminder if one booking is due". It might mean one of the following:
- The error was thrown, while Vitest was running this test.
- If the error occurred after the test had been completed, this was the last documented test before it was thrown.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  66 failed | 30 passed | 3 skipped (99)
      Tests  12 failed | 410 passed | 17 skipped (439)
     Errors  1 error
   Start at  15:18:26
   Duration  70.08s (transform 1.25s, setup 0ms, collect 4.50s, tests 77.71s, environment 139.33s, prepare 28.45s)


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 62 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL   1  src/tests/integration/database.test.ts > Database Integration Tests
TypeError: this.waitStrategy.withStartupTimeout is not a function
 ❯ PostgreSqlContainer.startContainer node_modules/testcontainers/src/generic-container/generic-container.ts:215:25
 ❯ PostgreSqlContainer.start node_modules/@testcontainers/postgresql/src/postgresql-container.ts:49:43
 ❯ TestEnvironment.setup src/tests/testcontainers/setup.ts:13:32
     11|       
     12|       // Start PostgreSQL container for database tests
     13|       this.postgresContainer = await new PostgreSqlContainer('postgres:15')
       |                                ^
     14|         .withDatabase('parker_flight_test')
     15|         .withUsername('test_user')
 ❯ src/tests/integration/database.test.ts:7:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/74]⎯

 FAIL   1  src/tests/integration/launchdarkly-integration.test.ts [ src/tests/integration/launchdarkly-integration.test.ts ]
Error: Failed to resolve import "@/lib/featureFlags/launchDarklyService" from "src/tests/integration/launchdarkly-integration.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly-integration.test.ts:3:0
  1  |  vi.mock("launchdarkly-js-client-sdk");
  2  |  const __vi_import_0__ = await import("launchdarkly-js-client-sdk");
  3  |  const __vi_import_1__ = await import("@/lib/featureFlags/launchDarklyService");
     |                                       ^
  4  |  const __vi_import_2__ = await import("@/lib/launchdarkly/fallback-manager");
  5  |  const __vi_import_3__ = await import("@/lib/launchdarkly/context-manager");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/74]⎯

 FAIL   1  src/tests/integration/launchdarkly-network-resilience.test.ts [ src/tests/integration/launchdarkly-network-resilience.test.ts ]
Error: Failed to resolve import "@/lib/featureFlags/launchDarklyService" from "src/tests/integration/launchdarkly-network-resilience.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly-network-resilience.test.ts:3:0
  1  |  vi.mock("launchdarkly-js-client-sdk");
  2  |  const __vi_import_0__ = await import("launchdarkly-js-client-sdk");
  3  |  const __vi_import_1__ = await import("@/lib/featureFlags/launchDarklyService");
     |                                       ^
  4  |  const __vi_import_2__ = await import("@/lib/launchdarkly/fallback-manager");
  5  |  const __vi_import_3__ = await import("@/lib/launchdarkly/context-manager");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/74]⎯

 FAIL   1  src/tests/integration/launchdarkly.test.ts [ src/tests/integration/launchdarkly.test.ts ]
Error: Failed to resolve import "@/lib/feature-flags/manager" from "src/tests/integration/launchdarkly.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/integration/launchdarkly.test.ts:3:0
  5  |    init: vi.fn(() => mockLDClientNode)
  6  |  }));
  7  |  const __vi_import_0__ = await import("@/lib/feature-flags/manager");
     |                                       ^
  8  |  const __vi_import_1__ = await import("@/lib/feature-flags/client");
  9  |  import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/74]⎯

 FAIL   1  src/tests/services/profileCompletenessService.test.ts [ src/tests/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/services/profileCompletenessService.test.ts:2:43
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  3  |  describe("ProfileCompletenessService", () => {
  4  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/74]⎯

 FAIL   2  supabase/functions/tests/carry-on-fee.test.ts [ supabase/functions/tests/carry-on-fee.test.ts ]
Error: Cannot find package '@/tests/utils/supabaseMockFactory' imported from '/Users/parkerbarnett/github-link-up-buddy/supabase/functions/tests/carry-on-fee.test.ts'
 ❯ supabase/functions/tests/carry-on-fee.test.ts:3:1
      1| // supabase/functions/tests/carry-on-fee.test.ts
      2| import { describe, it, expect, beforeEach, vi } from 'vitest';
      3| import { mockSupabaseClient } from '@/tests/utils/supabaseMockFactory';
       | ^
      4| import { computeCarryOnFee } from "./helpers/computeCarryOnFeeTestable.ts";
      5| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'ERR_MODULE_NOT_FOUND' }
Caused by: Caused by: Error: Failed to load url @/tests/utils/supabaseMockFactory (resolved id: @/tests/utils/supabaseMockFactory) in /Users/parkerbarnett/github-link-up-buddy/supabase/functions/tests/carry-on-fee.test.ts. Does the file exist?
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51968:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/74]⎯

 FAIL   0  src/flightSearchV2/useFlightOffers.test.ts [ src/flightSearchV2/useFlightOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useFeatureFlag" from "src/flightSearchV2/useFlightOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/flightSearchV2/useFlightOffers.test.ts:4:0
  2  |  vi.mock("@/serverActions/getFlightOffers");
  3  |  const __vi_import_0__ = await import("@testing-library/react");
  4  |  const __vi_import_1__ = await import("@/hooks/useFeatureFlag");
     |                                       ^
  5  |  const __vi_import_2__ = await import("@/serverActions/getFlightOffers");
  6  |  const __vi_import_3__ = await import("./useFlightOffers");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/74]⎯

 FAIL   0  src/pages/TripOffersV2.test.tsx [ src/pages/TripOffersV2.test.tsx ]
Error: Failed to resolve import "@/flightSearchV2/useFlightOffers" from "src/pages/TripOffersV2.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/pages/TripOffersV2.test.tsx:4:0
  21 |  const __vi_import_1__ = await import("@testing-library/react");
  22 |  const __vi_import_2__ = await import("react-router-dom");
  23 |  const __vi_import_3__ = await import("@/flightSearchV2/useFlightOffers");
     |                                       ^
  24 |  const __vi_import_4__ = await import("./TripOffersV2");
  25 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/74]⎯

 FAIL   0  src/lib/form-validation.test.ts [ src/lib/form-validation.test.ts ]
Error: Failed to resolve import "@/tests/setup-dynamic-forms" from "src/lib/form-validation.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/form-validation.test.ts:8:74
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { createMockFormConfiguration, createMockFieldConfiguration } from "@/tests/setup-dynamic-forms";
     |                                                                             ^
  3  |  import {
  4  |    generateZodSchema,
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/74]⎯

 FAIL   0  src/serverActions/getFlightOffers.test.ts [ src/serverActions/getFlightOffers.test.ts ]
Error: Failed to resolve import "@/integrations/supabase/client" from "src/serverActions/getFlightOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/serverActions/getFlightOffers.test.ts:3:0
  2  |    invokeEdgeFn: vi.fn()
  3  |  }));
  4  |  const __vi_import_0__ = await import("@/integrations/supabase/client");
     |                                       ^
  5  |  const __vi_import_1__ = await import("./getFlightOffers");
  6  |  import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/74]⎯

 FAIL   0  tests/unit/featureFlag.test.ts [ tests/unit/featureFlag.test.ts ]
Error: Failed to resolve import "@shared/featureFlag" from "tests/unit/featureFlag.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/featureFlag.test.ts:2:93
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { isEnabled, getFeatureFlagHash, userInBucket, getUserBucket } from "@shared/featureFlag";
     |                                                                              ^
  3  |  describe("Feature Flag System", () => {
  4  |    const createTestFlag = (enabled, rolloutPercentage) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[11/74]⎯

 FAIL   0  src/components/forms/FlightRuleForm.test.tsx [ src/components/forms/FlightRuleForm.test.tsx ]
Error: Failed to resolve import "@/components/ui/button" from "src/components/forms/FlightRuleForm.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/forms/FlightRuleForm.tsx:10:23
  5  |  import { zodResolver } from "@hookform/resolvers/zod";
  6  |  import { z } from "zod";
  7  |  import { Button } from "@/components/ui/button";
     |                          ^
  8  |  import { Input } from "@/components/ui/input";
  9  |  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[12/74]⎯

 FAIL   0  src/hooks/__tests__/useFormAnalytics.test.ts [ src/hooks/__tests__/useFormAnalytics.test.ts ]
Error: Failed to resolve import "@/integrations/supabase/client" from "src/hooks/__tests__/useFormAnalytics.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/hooks/__tests__/useFormAnalytics.test.ts:3:0
  5  |  }));
  6  |  const __vi_import_0__ = await import("@testing-library/react");
  7  |  const __vi_import_1__ = await import("@/integrations/supabase/client");
     |                                       ^
  8  |  
  9  |  import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[13/74]⎯

 FAIL   0  src/tests/contexts/PersonalizationContext.test.tsx [ src/tests/contexts/PersonalizationContext.test.tsx ]
Error: Failed to resolve import "@/contexts/PersonalizationContext" from "src/tests/contexts/PersonalizationContext.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/contexts/PersonalizationContext.test.tsx:10:0
  51 |  const __vi_import_1__ = await import("@testing-library/react");
  52 |  const __vi_import_2__ = await import("@tanstack/react-query");
  53 |  const __vi_import_3__ = await import("@/contexts/PersonalizationContext");
     |                                       ^
  54 |  
  55 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[14/74]⎯

 FAIL   0  src/tests/components/ConstraintChips.refactored.test.tsx [ src/tests/components/ConstraintChips.refactored.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "src/tests/components/ConstraintChips.refactored.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/ConstraintChips.refactored.test.tsx:4:49
  3  |  import { screen } from "@testing-library/react";
  4  |  import userEvent from "@testing-library/user-event";
  5  |  import ConstraintChips, { formatDateRange } from "@/components/trip/ConstraintChips";
     |                                                    ^
  6  |  import { renderWithProviders } from "@/tests/__helpers";
  7  |  describe("ConstraintChips (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[15/74]⎯

 FAIL   0  src/tests/components/ConstraintChips.test.tsx [ src/tests/components/ConstraintChips.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "src/tests/components/ConstraintChips.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/ConstraintChips.test.tsx:4:28
  2  |  import { describe, it, expect, vi } from "vitest";
  3  |  import { render, screen, fireEvent } from "@testing-library/react";
  4  |  import ConstraintChips from "@/components/trip/ConstraintChips";
     |                               ^
  5  |  describe("ConstraintChips", () => {
  6  |    const mockProps = {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[16/74]⎯

 FAIL   0  src/tests/components/PoolOfferControls.test.tsx [ src/tests/components/PoolOfferControls.test.tsx ]
Error: Failed to resolve import "@/components/trip/PoolOfferControls" from "src/tests/components/PoolOfferControls.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/PoolOfferControls.test.tsx:5:0
  8  |  const __vi_import_1__ = await import("@testing-library/react");
  9  |  const __vi_import_2__ = await import("react-router-dom");
  10 |  const __vi_import_3__ = await import("@/components/trip/PoolOfferControls");
     |                                       ^
  11 |  const __vi_import_4__ = await import("@/hooks/useTripOffers");
  12 |  const __vi_import_5__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[17/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.best-practices.test.tsx [ src/tests/components/TripRequestForm.best-practices.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.best-practices.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.best-practices.test.tsx:5:0
  91 |  const __vi_import_2__ = await import("@testing-library/user-event");
  92 |  const __vi_import_3__ = await import("react-router-dom");
  93 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  94 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  95 |  const __vi_import_6__ = await import("@/hooks/useCurrentUser");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[18/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.debug.test.tsx [ src/tests/components/TripRequestForm.debug.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.debug.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.debug.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[19/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.isolated.test.tsx [ src/tests/components/TripRequestForm.isolated.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.isolated.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.isolated.test.tsx:5:0
  31 |  const __vi_import_2__ = await import("@testing-library/user-event");
  32 |  const __vi_import_3__ = await import("react-router-dom");
  33 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  34 |  const __vi_import_5__ = await import("@/hooks/useCurrentUser");
  35 |  const __vi_import_6__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[20/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.final.test.tsx [ src/tests/components/TripRequestForm.mode.final.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.final.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.final.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[21/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.fixed.test.tsx [ src/tests/components/TripRequestForm.mode.fixed.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.fixed.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.fixed.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[22/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.mode.test.tsx [ src/tests/components/TripRequestForm.mode.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.mode.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.mode.test.tsx:6:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[23/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.simple.test.tsx [ src/tests/components/TripRequestForm.simple.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.simple.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.simple.test.tsx:4:0
  46 |  const __vi_import_1__ = await import("@testing-library/react");
  47 |  const __vi_import_2__ = await import("react-router-dom");
  48 |  const __vi_import_3__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  49 |  
  50 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[24/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.test.tsx [ src/tests/components/TripRequestForm.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.test.tsx:6:0
  145|  const __vi_import_2__ = await import("@testing-library/user-event");
  146|  const __vi_import_3__ = await import("react-router-dom");
  147|  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  148|  const __vi_import_5__ = await import("@/tests/utils/TestWrapper");
  149|  const __vi_import_6__ = await import("@/integrations/supabase/client");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[25/74]⎯

 FAIL   0  src/tests/components/TripRequestForm.working-demo.test.tsx [ src/tests/components/TripRequestForm.working-demo.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "src/tests/components/TripRequestForm.working-demo.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.working-demo.test.tsx:5:0
  28 |  const __vi_import_2__ = await import("@testing-library/user-event");
  29 |  const __vi_import_3__ = await import("react-router-dom");
  30 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  31 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  32 |  const __vi_import_6__ = await import("@/hooks/useCurrentUser");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[26/74]⎯

 FAIL   0  src/tests/feature-flags/userInBucket.test.ts [ src/tests/feature-flags/userInBucket.test.ts ]
Error: Failed to resolve import "@/shared/featureFlag" from "src/tests/feature-flags/userInBucket.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/feature-flags/userInBucket.test.ts:2:44
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { userInBucket, getUserBucket } from "@/shared/featureFlag";
     |                                               ^
  3  |  describe("userInBucket", () => {
  4  |    it("should produce consistent hash results (protect against algorithm changes)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[27/74]⎯

 FAIL   0  src/tests/hooks/usePoolsSafe.test.ts [ src/tests/hooks/usePoolsSafe.test.ts ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "src/tests/hooks/usePoolsSafe.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/usePoolsSafe.test.ts:4:0
  11 |  }));
  12 |  const __vi_import_0__ = await import("@testing-library/react");
  13 |  const __vi_import_1__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  14 |  const __vi_import_2__ = await import("@/hooks/useTripOffers");
  15 |  const __vi_import_3__ = await import("@/hooks/useTripOffersLegacy");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[28/74]⎯

 FAIL   0  src/tests/hooks/useTripOffers.test.ts [ src/tests/hooks/useTripOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "src/tests/hooks/useTripOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffers.test.ts:3:0
  25 |  }));
  26 |  const __vi_import_0__ = await import("@testing-library/react");
  27 |  const __vi_import_1__ = await import("@/hooks/useTripOffersLegacy");
     |                                       ^
  28 |  const __vi_import_2__ = await import("@/services/tripOffersService");
  29 |  const __vi_import_3__ = await import("@/services/api/flightSearchApi");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[29/74]⎯

 FAIL   0  src/tests/hooks/useTripOffersLegacy.helpers.test.ts [ src/tests/hooks/useTripOffersLegacy.helpers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "src/tests/hooks/useTripOffersLegacy.helpers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffersLegacy.helpers.test.ts:2:22
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { _test } from "@/hooks/useTripOffersLegacy";
     |                         ^
  3  |  describe("useTripOffersLegacy Helper Functions", () => {
  4  |    describe("validateDuration", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[30/74]⎯

 FAIL   0  src/tests/hooks/useTripOffersPools.test.ts [ src/tests/hooks/useTripOffersPools.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffers" from "src/tests/hooks/useTripOffersPools.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/hooks/useTripOffersPools.test.ts:4:0
  26 |  }));
  27 |  const __vi_import_0__ = await import("@testing-library/react");
  28 |  const __vi_import_1__ = await import("@/hooks/useTripOffers");
     |                                       ^
  29 |  
  30 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[31/74]⎯

 FAIL   0  src/tests/pages/Dashboard.test.tsx [ src/tests/pages/Dashboard.test.tsx ]
Error: Failed to resolve import "@/pages/Dashboard" from "src/tests/pages/Dashboard.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/pages/Dashboard.test.tsx:11:0
  64 |  const __vi_import_4__ = await import("react-router-dom");
  65 |  const __vi_import_5__ = await import("@tanstack/react-query");
  66 |  const __vi_import_6__ = await import("@/pages/Dashboard");
     |                                       ^
  67 |  
  68 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[32/74]⎯

 FAIL   0  src/tests/pages/TripConfirm.test.tsx [ src/tests/pages/TripConfirm.test.tsx ]
Error: Failed to resolve import "@/pages/TripConfirm" from "src/tests/pages/TripConfirm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/pages/TripConfirm.test.tsx:9:0
  27 |  const __vi_import_2__ = await import("@testing-library/react");
  28 |  const __vi_import_3__ = await import("react-router-dom");
  29 |  const __vi_import_4__ = await import("@/pages/TripConfirm");
     |                                       ^
  30 |  const __vi_import_5__ = await import("@/integrations/supabase/client");
  31 |  const __vi_import_6__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[33/74]⎯

 FAIL   0  src/tests/serverActions/getFlightOffers.refactored.test.ts [ src/tests/serverActions/getFlightOffers.refactored.test.ts ]
Error: Failed to resolve import "@/serverActions/getFlightOffers" from "src/tests/serverActions/getFlightOffers.refactored.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/serverActions/getFlightOffers.refactored.test.ts:7:7
  4  |    transformLegacyToV2,
  5  |    transformLegacyOffers
  6  |  } from "@/serverActions/getFlightOffers";
     |          ^
  7  |  import { createMockSupabaseClient } from "@/tests/__helpers";
  8  |  describe("getFlightOffers (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[34/74]⎯

 FAIL   0  src/tests/services/profileCompletenessService.test.ts [ src/tests/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/services/profileCompletenessService.test.ts:2:43
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  3  |  describe("ProfileCompletenessService", () => {
  4  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[35/74]⎯

 FAIL   0  src/tests/utils/getPoolDisplayName.test.ts [ src/tests/utils/getPoolDisplayName.test.ts ]
Error: Failed to resolve import "@/utils/getPoolDisplayName" from "src/tests/utils/getPoolDisplayName.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/utils/getPoolDisplayName.test.ts:3:35
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { getPoolDisplayName } from "@/utils/getPoolDisplayName";
     |                                      ^
  3  |  describe("getPoolDisplayName", () => {
  4  |    it("returns correct names for manual mode", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[36/74]⎯

 FAIL   0  tests/unit/hooks/usePoolsSafe.test.ts [ tests/unit/hooks/usePoolsSafe.test.ts ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "tests/unit/hooks/usePoolsSafe.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/usePoolsSafe.test.ts:4:0
  11 |  }));
  12 |  const __vi_import_0__ = await import("@testing-library/react");
  13 |  const __vi_import_1__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  14 |  const __vi_import_2__ = await import("@/hooks/useTripOffers");
  15 |  const __vi_import_3__ = await import("@/hooks/useTripOffersLegacy");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[37/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffers.test.ts [ tests/unit/hooks/useTripOffers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "tests/unit/hooks/useTripOffers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffers.test.ts:3:0
  25 |  }));
  26 |  const __vi_import_0__ = await import("@testing-library/react");
  27 |  const __vi_import_1__ = await import("@/hooks/useTripOffersLegacy");
     |                                       ^
  28 |  const __vi_import_2__ = await import("@/services/tripOffersService");
  29 |  const __vi_import_3__ = await import("@/services/api/flightSearchApi");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[38/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffersLegacy.helpers.test.ts [ tests/unit/hooks/useTripOffersLegacy.helpers.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffersLegacy" from "tests/unit/hooks/useTripOffersLegacy.helpers.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffersLegacy.helpers.test.ts:2:22
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { _test } from "@/hooks/useTripOffersLegacy";
     |                         ^
  3  |  describe("useTripOffersLegacy Helper Functions", () => {
  4  |    describe("validateDuration", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[39/74]⎯

 FAIL   0  tests/unit/hooks/useTripOffersPools.test.ts [ tests/unit/hooks/useTripOffersPools.test.ts ]
Error: Failed to resolve import "@/hooks/useTripOffers" from "tests/unit/hooks/useTripOffersPools.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/hooks/useTripOffersPools.test.ts:4:0
  26 |  }));
  27 |  const __vi_import_0__ = await import("@testing-library/react");
  28 |  const __vi_import_1__ = await import("@/hooks/useTripOffers");
     |                                       ^
  29 |  
  30 |  import { describe, it, expect, vi, beforeEach } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[40/74]⎯

 FAIL   0  tests/unit/components/CampaignForm.test.tsx [ tests/unit/components/CampaignForm.test.tsx ]
Error: Failed to resolve import "@/components/autobooking/CampaignForm" from "tests/unit/components/CampaignForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/CampaignForm.test.tsx:9:0
  8  |  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  9  |  const __vi_import_1__ = await import("@testing-library/react");
  10 |  const __vi_import_2__ = await import("@/components/autobooking/CampaignForm");
     |                                       ^
  11 |  
  12 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[41/74]⎯

 FAIL   0  tests/unit/components/ConstraintChips.refactored.test.tsx [ tests/unit/components/ConstraintChips.refactored.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "tests/unit/components/ConstraintChips.refactored.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/ConstraintChips.refactored.test.tsx:4:49
  3  |  import { screen } from "@testing-library/react";
  4  |  import userEvent from "@testing-library/user-event";
  5  |  import ConstraintChips, { formatDateRange } from "@/components/trip/ConstraintChips";
     |                                                    ^
  6  |  import { renderWithProviders } from "@/tests/__helpers";
  7  |  describe("ConstraintChips (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[42/74]⎯

 FAIL   0  tests/unit/components/ConstraintChips.test.tsx [ tests/unit/components/ConstraintChips.test.tsx ]
Error: Failed to resolve import "@/components/trip/ConstraintChips" from "tests/unit/components/ConstraintChips.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/ConstraintChips.test.tsx:4:28
  2  |  import { describe, it, expect, vi } from "vitest";
  3  |  import { render, screen, fireEvent } from "@testing-library/react";
  4  |  import ConstraintChips from "@/components/trip/ConstraintChips";
     |                               ^
  5  |  describe("ConstraintChips", () => {
  6  |    const mockProps = {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[43/74]⎯

 FAIL   0  tests/unit/components/PoolOfferControls.test.tsx [ tests/unit/components/PoolOfferControls.test.tsx ]
Error: Failed to resolve import "@/components/trip/PoolOfferControls" from "tests/unit/components/PoolOfferControls.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/PoolOfferControls.test.tsx:5:0
  8  |  const __vi_import_1__ = await import("@testing-library/react");
  9  |  const __vi_import_2__ = await import("react-router-dom");
  10 |  const __vi_import_3__ = await import("@/components/trip/PoolOfferControls");
     |                                       ^
  11 |  const __vi_import_4__ = await import("@/hooks/useTripOffers");
  12 |  const __vi_import_5__ = await import("@/components/ui/use-toast");
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[44/74]⎯

 FAIL   0  tests/unit/components/TripRequestForm.test.tsx [ tests/unit/components/TripRequestForm.test.tsx ]
Error: Failed to resolve import "@/components/trip/TripRequestForm" from "tests/unit/components/TripRequestForm.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/TripRequestForm.test.tsx:5:0
  20 |  const __vi_import_2__ = await import("react-router-dom");
  21 |  const __vi_import_3__ = await import("@tanstack/react-query");
  22 |  const __vi_import_4__ = await import("@/components/trip/TripRequestForm");
     |                                       ^
  23 |  
  24 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[45/74]⎯

 FAIL   0  tests/unit/serverActions/getFlightOffers.refactored.test.ts [ tests/unit/serverActions/getFlightOffers.refactored.test.ts ]
Error: Failed to resolve import "@/serverActions/getFlightOffers" from "tests/unit/serverActions/getFlightOffers.refactored.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/serverActions/getFlightOffers.refactored.test.ts:7:7
  4  |    transformLegacyToV2,
  5  |    transformLegacyOffers
  6  |  } from "@/serverActions/getFlightOffers";
     |          ^
  7  |  import { createMockSupabaseClient } from "@/tests/__helpers";
  8  |  describe("getFlightOffers (Refactored)", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[46/74]⎯

 FAIL   0  tests/unit/pages/Dashboard.test.tsx [ tests/unit/pages/Dashboard.test.tsx ]
Error: Failed to resolve import "@/pages/Dashboard" from "tests/unit/pages/Dashboard.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/pages/Dashboard.test.tsx:7:0
  58 |  const __vi_import_2__ = await import("@testing-library/user-event");
  59 |  const __vi_import_3__ = await import("react-router-dom");
  60 |  const __vi_import_4__ = await import("@/pages/Dashboard");
     |                                       ^
  61 |  
  62 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[47/74]⎯

 FAIL   0  tests/unit/services/profileCompletenessService.test.ts [ tests/unit/services/profileCompletenessService.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "tests/unit/services/profileCompletenessService.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/services/profileCompletenessService.test.ts:1:43
  1  |  import { profileCompletenessService } from "@/services/profileCompletenessService";
     |                                              ^
  2  |  describe("ProfileCompletenessService", () => {
  3  |    const createBasicProfile = (overrides = {}) => ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[48/74]⎯

 FAIL   0  tests/unit/utils/getPoolDisplayName.test.ts [ tests/unit/utils/getPoolDisplayName.test.ts ]
Error: Failed to resolve import "@/utils/getPoolDisplayName" from "tests/unit/utils/getPoolDisplayName.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/utils/getPoolDisplayName.test.ts:3:35
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { getPoolDisplayName } from "@/utils/getPoolDisplayName";
     |                                      ^
  3  |  describe("getPoolDisplayName", () => {
  4  |    it("returns correct names for manual mode", () => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[49/74]⎯

 FAIL   0  src/components/filtering/__tests__/frontend-integration.test.tsx [ src/components/filtering/__tests__/frontend-integration.test.tsx ]
Error: Failed to resolve import "@/hooks/useFilterState" from "src/components/filtering/__tests__/frontend-integration.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/filtering/__tests__/frontend-integration.test.tsx:15:0
  92 |  const __vi_import_2__ = await import("@testing-library/react");
  93 |  const __vi_import_3__ = await import("react-router-dom");
  94 |  const __vi_import_4__ = await import("@/hooks/useFilterState");
     |                                       ^
  95 |  const __vi_import_5__ = await import("../AdvancedFilterControls");
  96 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[50/74]⎯

 FAIL   0  src/lib/filtering/__tests__/integration-simple.test.ts [ src/lib/filtering/__tests__/integration-simple.test.ts ]
Error: Failed to resolve import "@/lib/filtering" from "src/lib/filtering/__tests__/integration-simple.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/filtering/__tests__/integration-simple.test.ts:7:51
  1  |  import { describe, it, expect } from "vitest";
  2  |  import { FilterFactory, createFilterContext } from "@/lib/filtering";
     |                                                      ^
  3  |  function testNormalizeOffers(rawOffers, provider) {
  4  |    return rawOffers.map((offer) => {
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[51/74]⎯

 FAIL   0  src/lib/filtering/__tests__/integration.test.ts [ src/lib/filtering/__tests__/integration.test.ts ]
Error: Failed to resolve import "@/services/tripOffersService" from "src/lib/filtering/__tests__/integration.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/lib/filtering/__tests__/integration.test.ts:7:0
  109|    }
  110|  }));
  111|  const __vi_import_0__ = await import("@/services/tripOffersService");
     |                                       ^
  112|  const __vi_import_1__ = await import("@/lib/filtering");
  113|  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[52/74]⎯

 FAIL   0  src/tests/components/dashboard/TripHistory.test.tsx [ src/tests/components/dashboard/TripHistory.test.tsx ]
Error: Failed to resolve import "@/components/dashboard/TripHistory" from "src/tests/components/dashboard/TripHistory.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/dashboard/TripHistory.test.tsx:10:0
  15 |  const __vi_import_1__ = await import("@testing-library/react");
  16 |  const __vi_import_2__ = await import("react-router-dom");
  17 |  const __vi_import_3__ = await import("@/components/dashboard/TripHistory");
     |                                       ^
  18 |  const __vi_import_4__ = await import("@/integrations/supabase/client");
  19 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[53/74]⎯

 FAIL   0  src/tests/components/personalization/GreetingBanner.test.tsx [ src/tests/components/personalization/GreetingBanner.test.tsx ]
Error: Failed to resolve import "@/components/personalization/GreetingBanner" from "src/tests/components/personalization/GreetingBanner.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/personalization/GreetingBanner.test.tsx:8:0
  62 |  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  63 |  const __vi_import_1__ = await import("@testing-library/react");
  64 |  const __vi_import_2__ = await import("@/components/personalization/GreetingBanner");
     |                                       ^
  65 |  
  66 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[54/74]⎯

 FAIL   0  src/tests/components/personalization/PersonalizedGreeting.test.tsx [ src/tests/components/personalization/PersonalizedGreeting.test.tsx ]
Error: Failed to resolve import "@/components/personalization/PersonalizedGreeting" from "src/tests/components/personalization/PersonalizedGreeting.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/personalization/PersonalizedGreeting.test.tsx:7:0
  5  |  const __vi_import_1__ = await import("@testing-library/react");
  6  |  const __vi_import_2__ = await import("@testing-library/jest-dom");
  7  |  const __vi_import_3__ = await import("@/components/personalization/PersonalizedGreeting");
     |                                       ^
  8  |  
  9  |  import { describe, it, expect, vi } from "vitest";
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[55/74]⎯

 FAIL   0  src/tests/components/profile/SimpleProfileStatus.test.tsx [ src/tests/components/profile/SimpleProfileStatus.test.tsx ]
Error: Failed to resolve import "@/components/profile/SimpleProfileStatus" from "src/tests/components/profile/SimpleProfileStatus.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/components/profile/SimpleProfileStatus.test.tsx:9:0
  109|  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  110|  const __vi_import_1__ = await import("@testing-library/react");
  111|  const __vi_import_2__ = await import("@/components/profile/SimpleProfileStatus");
     |                                       ^
  112|  
  113|  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[56/74]⎯

 FAIL   0  src/tests/unit/services/profileCompletenessService.enhanced.test.ts [ src/tests/unit/services/profileCompletenessService.enhanced.test.ts ]
Error: Failed to resolve import "@/services/profileCompletenessService" from "src/tests/unit/services/profileCompletenessService.enhanced.test.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/tests/unit/services/profileCompletenessService.enhanced.test.ts:9:0
  9  |          }
  10 |        }));
  11 |  const __vi_import_0__ = await import("@/services/profileCompletenessService");
     |                                       ^
  12 |  import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
  13 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[57/74]⎯

 FAIL   0  tests/unit/components/dashboard/TripHistory.test.tsx [ tests/unit/components/dashboard/TripHistory.test.tsx ]
Error: Failed to resolve import "@/components/dashboard/TripHistory" from "tests/unit/components/dashboard/TripHistory.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/dashboard/TripHistory.test.tsx:6:0
  15 |  const __vi_import_1__ = await import("@testing-library/react");
  16 |  const __vi_import_2__ = await import("react-router-dom");
  17 |  const __vi_import_3__ = await import("@/components/dashboard/TripHistory");
     |                                       ^
  18 |  const __vi_import_4__ = await import("@/integrations/supabase/client");
  19 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[58/74]⎯

 FAIL   0  tests/unit/components/profile/SimpleProfileStatus.test.tsx [ tests/unit/components/profile/SimpleProfileStatus.test.tsx ]
Error: Failed to resolve import "@/components/profile/SimpleProfileStatus" from "tests/unit/components/profile/SimpleProfileStatus.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/tests/unit/components/profile/SimpleProfileStatus.test.tsx:4:0
  109|  const __vi_import_0__ = await import("react/jsx-dev-runtime");
  110|  const __vi_import_1__ = await import("@testing-library/react");
  111|  const __vi_import_2__ = await import("@/components/profile/SimpleProfileStatus");
     |                                       ^
  112|  
  113|  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[59/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolHeader.test.tsx [ src/components/trip/Pools/__tests__/PoolHeader.test.tsx ]
Error: Failed to resolve import "@/components/ui/badge" from "src/components/trip/Pools/PoolHeader.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/PoolHeader.tsx:6:22
  1  |  import { jsxDEV } from "react/jsx-dev-runtime";
  2  |  import { Badge } from "@/components/ui/badge";
     |                         ^
  3  |  const PoolHeader = ({ name, count }) => {
  4  |    return /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-between", children: [
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[60/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolLayout.test.tsx [ src/components/trip/Pools/__tests__/PoolLayout.test.tsx ]
Error: Failed to resolve import "@/hooks/usePoolsSafe" from "src/components/trip/Pools/__tests__/PoolLayout.test.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/__tests__/PoolLayout.test.tsx:5:0
  26 |  const __vi_import_1__ = await import("@testing-library/react");
  27 |  const __vi_import_2__ = await import("react-router-dom");
  28 |  const __vi_import_3__ = await import("@/hooks/usePoolsSafe");
     |                                       ^
  29 |  const __vi_import_4__ = await import("../PoolLayout");
  30 |  
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[61/74]⎯

 FAIL   0  src/components/trip/Pools/__tests__/PoolSection.test.tsx [ src/components/trip/Pools/__tests__/PoolSection.test.tsx ]
Error: Failed to resolve import "@/components/ui/collapsible" from "src/components/trip/Pools/PoolSection.tsx". Does the file exist?
  Plugin: vite:import-analysis
  File: /Users/parkerbarnett/github-link-up-buddy/src/components/trip/Pools/PoolSection.tsx:7:68
  1  |  import { jsxDEV } from "react/jsx-dev-runtime";
  2  |  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
     |                                                                       ^
  3  |  import PoolHeader from "./PoolHeader";
  4  |  const PoolSection = ({
 ❯ TransformPluginContext._formatError node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49258:41
 ❯ TransformPluginContext.error node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49253:16
 ❯ normalizeUrl node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64291:23
 ❯ node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64423:39
 ❯ TransformPluginContext.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:64350:7
 ❯ PluginContainer.transform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:49099:18
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:51977:27

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[62/74]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 12 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL   2  supabase/functions/tests/amadeusToken.test.ts > Amadeus Token Caching > should handle API errors
AssertionError: expected [Function] to throw error including 'Failed to get Amadeus access token: 4…' but got 'Authentication failed: AUTHENTICATION…'

Expected: "Failed to get Amadeus access token: 401"
Received: "Authentication failed: AUTHENTICATION - Unauthorized"

 ❯ supabase/functions/tests/amadeusToken.test.ts:127:5
    125|     const { getAmadeusAccessToken } = await import('../lib/amadeus.ts');
    126|     
    127|     await expect(getAmadeusAccessToken()).rejects.toThrow('Failed to get Amadeus access token: 401');
       |     ^
    128|   });
    129| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[63/74]⎯

 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 1. should do nothing if no bookings are due for reminder
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 2. should send one reminder if one booking is due
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 3. should send multiple reminders if multiple bookings are due
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 4. should skip reminder if already sent (duplicate check active)
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 5. should return 500 if error querying bookings
 FAIL   2  supabase/functions/tests/send-reminder.test.ts > send-reminder Edge Function > 6. should continue processing if one send-notification call fails
Error: Only URLs with a scheme in: file and data are supported by the default ESM loader. Received protocol 'https:'
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'ERR_UNSUPPORTED_ESM_URL_SCHEME' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[64/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Error Handling > should handle rate limiting errors
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/tests/duffel-integration.test.ts:358:5
    356|     })
    357| 
    358|     it('should handle rate limiting errors', async () => {
       |     ^
    359|       const rateLimitError = {
    360|         errors: [{ type: 'rate_limit_exceeded' }],

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[65/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Error Handling > should provide default error message for unknown errors
Error: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ src/tests/duffel-integration.test.ts:376:5
    374|     })
    375| 
    376|     it('should provide default error message for unknown errors', async () => {
       |     ^
    377|       const unknownError = {
    378|         errors: [{ type: 'unknown_error_type' }],

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[66/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Utility Functions > should map passenger data correctly
Error: Cannot find module '../services/duffelServiceGuided'
Require stack:
- /Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts
 ❯ src/tests/duffel-integration.test.ts:430:40
    428|   describe('Utility Functions', () => {
    429|     it('should map passenger data correctly', () => {
    430|       const { mapPassengerToDuffel } = require('../services/duffelServiceGuided')
       |                                        ^
    431|       
    432|       const passengerData = {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'MODULE_NOT_FOUND', requireStack: [ '/Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts' ] }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[67/74]⎯

 FAIL   0  src/tests/duffel-integration.test.ts > Duffel Integration Tests > Utility Functions > should map trip requests to Duffel search parameters
Error: Cannot find module '../services/duffelServiceGuided'
Require stack:
- /Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts
 ❯ src/tests/duffel-integration.test.ts:465:48
    463| 
    464|     it('should map trip requests to Duffel search parameters', () => {
    465|       const { mapTripRequestToDuffelSearch } = require('../services/duffelServiceGuided')
       |                                                ^
    466|       
    467|       const tripRequest = {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'MODULE_NOT_FOUND', requireStack: [ '/Users/parkerbarnett/github-link-up-buddy/src/tests/duffel-integration.test.ts' ] }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[68/74]⎯

 FAIL   0  src/tests/duffel-performance.test.ts > Duffel Performance Tests > Error Recovery and Resilience > should handle malformed responses gracefully
AssertionError: expected 2 to be 6 // Object.is equality

- Expected
+ Received

- 6
+ 2

 ❯ src/tests/duffel-performance.test.ts:388:33
    386|       }
    387| 
    388|       expect(handledGracefully).toBe(malformedResponses.length)
       |                                 ^
    389|       console.log(`Malformed Response Test: ${handledGracefully} responses handled gracefully`)
    390|     })

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[69/74]⎯

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Error: Only URLs with a scheme in: file and data are supported by the default ESM loader. Received protocol 'https:'
 ❯ getSource node:internal/modules/esm/load:47:11
 ❯ defaultLoad node:internal/modules/esm/load:113:40
 ❯ ModuleLoader.load node:internal/modules/esm/loader:800:12
 ❯ ModuleLoader.loadAndTranslate node:internal/modules/esm/loader:580:43
 ❯ ModuleLoader.#createModuleJob node:internal/modules/esm/loader:604:36
 ❯ ModuleLoader.#getJobFromResolveResult node:internal/modules/esm/loader:338:34
 ❯ ModuleLoader.getModuleJobForImport node:internal/modules/esm/loader:306:41
 ❯ processTicksAndRejections node:internal/process/task_queues:105:5
 ❯ onImport.tracePromise.__proto__ node:internal/modules/esm/loader:643:25

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'ERR_UNSUPPORTED_ESM_URL_SCHEME' }
This error originated in "supabase/functions/tests/send-reminder.test.ts" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
The latest test that might've caused the error is "2. should send one reminder if one booking is due". It might mean one of the following:
- The error was thrown, while Vitest was running this test.
- If the error occurred after the test had been completed, this was the last documented test before it was thrown.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  66 failed | 30 passed | 3 skipped (99)
      Tests  12 failed | 410 passed | 17 skipped (439)
     Errors  1 error
   Start at  15:18:26
   Duration  70.13s (transform 1.25s, setup 0ms, collect 4.50s, tests 77.71s, environment 139.33s, prepare 28.45s)

Let me check a specific test that should show us the jest-dom integration working:
/Users/parkerbarnett/github-link-up-buddy/src/tests/components/TripRequestForm.minimal.test.tsx
Now let me run the unit tests specifically to check them:
Ah! There's the issue you mentioned - "No projects matched the filter 'unit'". This confirms the problem you described earlier. Let me look at the Vitest configuration more closely and compare the projects structure:
/Users/parkerbarnett/github-link-up-buddy/vitest.config.ts (36-235)
Now let's test the unit tests again to see if the project configuration is working:
The error persists. It seems there's an underlying issue unrelated to the Vitest configuration we've changed. Let's consider these possibilities:

1. Typo in Project Name: Ensure the project name in the configuration matches exactly what is used in the npm scripts.
2. File Structure: Verify that the file pattern defined in the unit project actually matches existing test files.
3. Dependency Issues: Check that all modules are properly installed and updated.