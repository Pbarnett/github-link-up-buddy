# Deep Research Prompt for Day-2 Test Failures

## 1. Executive Summary

Parker Flight is completing a profile-wallet rollout on branch `feature/profile-completeness-tests-clean`. The critical blocker is 54 failed test suites with 29 individual test failures preventing CI from going green. Secrets have been successfully scrubbed from git history and Twilio production SMS is verified working with real phone number `+16466871851`. We need precise test fixes and mock patterns to achieve the required 90% coverage threshold and unblock Day-2 completion.

## 2. Tech Stack & Constraints

* **Framework**: Next.js 14 + React 18 (TypeScript), Vitest + React Testing Library v14
* **Backend**: Supabase Edge Functions, PostgreSQL with RLS policies
* **Testing**: Global coverage gate ≥ 90% statements/functions, single test-ci.sh pass
* **Compliance**: Must maintain PCI SAQ-A, GDPR, WCAG 2.2 AA standards
* **Architecture**: Config-driven components, feature flags, profile completeness system
* **Package Versions**: `vitest@3.2.4`, `@testing-library/react@14.x`, `@supabase/supabase-js@2.x`

## 3. Current Failure Snapshot

* **Test file failures**: 54 suites, 29 individual tests (Vitest output timestamp 18:14)
* **Key failing test files**:
  - `src/flightSearchV2/useFlightOffers.test.ts`
  - `src/lib/form-validation.test.ts` 
  - `src/serverActions/getFlightOffers.test.ts`
  - `src/pages/TripOffersV2.test.tsx`
  - `src/components/forms/FlightRuleForm.test.tsx`
  - `tests/unit/components/CampaignForm.test.tsx`
  - `supabase/functions/*/index.test.ts` (Edge Function tests)

* **Top recurring error patterns**:
  1. `Cannot find package '@/hooks/useFeatureFlag'` - path alias resolution failures
  2. `minPriceUSD` undefined errors in **ConfigDrivenTripRequestForm** config destructuring
  3. Supabase client mocks missing/broken in **PoolLayout** and `useTripOffersLegacy` hooks  
  4. `RangeError: Invalid time value` in date-fns `formatDate()` utility functions
  5. `target.hasPointerCapture is not a function` - JSDOM polyfill issues with Radix UI
  6. Toast/localStorage spy contamination causing `act()` warnings between test runs
  7. `Only URLs with a scheme in: file and data are supported` - ESM loader issues in Edge Functions

## 4. Code Context & Architecture Details

### 4.1 Current setupTests.ts Structure
```ts
// Key mocks already in place:
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient,
}));

vi.mock('@/hooks/useBusinessRules', () => ({
  useBusinessRules: vi.fn(() => ({
    config: { /* business rules config */ },
    loading: false, error: null, refetch: vi.fn(),
  })),
  BusinessRulesProvider: ({ children }) => children,
}));

// DOM polyfills for Radix UI
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: function() { return false; }, writable: true,
});
```

### 4.2 Vitest Configuration (vitest.config.ts)
```ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/tests/setupTests.ts'],
    coverage: {
      provider: 'v8',
      statements: 90, branches: 85, functions: 90, lines: 90,
      perFile: false  // Global thresholds only
    }
  }
});
```

### 4.3 Failing Component Examples

**ConfigDrivenTripRequestForm** structure:
```ts
interface BusinessRulesConfig {
  flightSearch: {
    minPriceUSD?: number;
    maxPriceUSD?: number;
    defaultNonstopRequired?: boolean;
  };
  autoBooking: { enabled: boolean };
}

// Component destructures config without defaults
const { minPriceUSD, maxPriceUSD } = config.flightSearch; // ERROR: config may be undefined
```

**Supabase Hook Pattern**:
```ts
// useTripOffersLegacy.ts
const { data, error } = await supabase
  .from('flight_offers_v2')
  .select('*')
  .eq('trip_request_id', tripId); // ERROR: mocks don't chain properly
```

**Date Formatting Issue**:
```ts
// formatDate utility
const formatDate = (dateString: string) => {
  return format(parseISO(dateString), 'MMM dd, yyyy'); // ERROR: invalid dateString causes RangeError
};
```

### 4.4 Edge Function Testing Environment
Edge Functions run in Deno runtime but tests run in Node.js with Vitest. Import resolution differs:
```ts
// Edge Function imports (work in Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Test environment needs different mocking strategy
```

## 5. Specific Error Messages & Stack Traces

### 5.1 Path Resolution Errors
```
Error: Cannot find package '@/hooks/useFeatureFlag' imported from 'src/flightSearchV2/useFlightOffers.ts'
Caused by: Failed to load url @/hooks/useFeatureFlag (resolved id: @/hooks/useFeatureFlag)
```

### 5.2 Supabase Mock Chain Errors  
```
TypeError: Cannot destructure property 'data' of '(intermediate value)' as it is undefined.
at /src/hooks/useTripOffers.ts:126:23
```

### 5.3 JSDOM Polyfill Errors
```
TypeError: target.hasPointerCapture is not a function
at HTMLUnknownElement.callCallback (react-dom/cjs/react-dom.development.js:4164:14)
```

### 5.4 Act() Warnings
```
Warning: An update to TestComponent inside a test was not wrapped in act(...)
When testing, code that causes React state updates should be wrapped into act(...)
```

### 5.5 Date Formatting Errors
```
RangeError: Invalid time value
at Date.toISOString (native)
at formatISO (date-fns/formatISO/index.js:52:17)
```

## 6. Research Questions

1. **Vitest Path Alias Resolution**: How to properly configure Vitest to resolve `@/*` path aliases when modules are missing, especially for hooks and utilities?

2. **Supabase Mock Chain Strategy**: Best pattern for mocking `supabase.from().select().eq()` method chains in Vitest with proper promise resolution, error states, and chainable methods?

3. **Config Default Props with TypeScript**: Safe destructuring patterns to avoid `undefined` errors when config objects are partial/missing in strongly-typed React components?

4. **JSDOM + Radix UI Compatibility**: Complete polyfill setup for `hasPointerCapture`, `setPointerCapture`, `scrollIntoView` that works with Radix UI components in JSDOM?

5. **Act() Wrapper Best Practices**: Idiomatic `act()` handling for async hooks, state updates, and Testing Library v14 with React 18's automatic batching and concurrent features?

6. **Date Validation Guards**: Robust input validation for date-fns functions to prevent `RangeError` on malformed ISO strings while maintaining TypeScript type safety?

7. **Edge Function Test Strategy**: How to test Supabase Edge Functions that use Deno imports in a Node.js Vitest environment without ESM loader conflicts?

8. **Global Test Environment Reset**: Template for setup/teardown that reliably resets vi.fn() spies, timers, localStorage, DOM state, and React component state between tests?

## 7. Desired Deliverables from External LLM

* **Drop-in code snippets** (TypeScript) that can be directly copied into test files
* **One-liner solutions** for each major failure cluster requiring minimal refactoring
* **Reusable utility functions** for common mocking patterns (Supabase, hooks, DOM APIs)
* **Configuration updates** for vitest.config.ts and setupTests.ts if needed
* **Documentation references** with specific links to Vitest, Testing Library, Supabase, or React 18 testing guides
* **Troubleshooting steps** for each error type with clear before/after examples
* **Migration patterns** for converting failing tests to working ones systematically

## 8. Current Working Examples

### 8.1 Successful Supabase Mock (from working tests)
```ts
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      data: [{ id: '123', name: 'TestData' }],
      error: null
    })),
    eq: vi.fn(() => ({
      data: [{ id: '123', name: 'TestData' }], 
      error: null
    }))
  })),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user' } }, error: null
    })
  }
};
```

### 8.2 Working DOM Polyfill Setup
```ts
// These polyfills work for some components
Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
  value: function() { return false; }, writable: true,
});
Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  value: function() {}, writable: true,
});
```

## 9. Format / Tone Guidelines

* Use fenced ````ts` blocks for all code examples with proper syntax highlighting
* Keep each solution ≤ 150 words focused on the specific problem
* No speculative refactors—work within current Next.js + Supabase + Vitest architecture  
* Include Markdown footnote links to official documentation when applicable
* Prioritize solutions that integrate with existing setupTests.ts and vitest.config.ts
* Show before/after code examples where the fix isn't obvious
* Include TypeScript type annotations for better integration

## 10. Success Criteria

The research should provide actionable solutions that help achieve:
- [ ] All 54 test suites passing
- [ ] 90%+ global coverage (statements, functions, lines, branches)
- [ ] Clean vitest run with no act() warnings
- [ ] Proper mock isolation between tests
- [ ] Edge Function tests working in Node.js environment
- [ ] Type-safe component testing without runtime errors

## 11. Example Response Format

```md
## Path Alias Resolution Fix
**Problem**: `Cannot find package '@/hooks/useFeatureFlag'`
**Solution**:
```ts
// In vitest.config.ts, add to resolve.alias:
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/hooks/useFeatureFlag': path.resolve(__dirname, './src/hooks/useFeatureFlag.ts')
  }
}
```
**Why it works**: Explicit path mapping helps Vitest resolve missing modules during test compilation.

## Supabase Chain Mock Pattern
**Problem**: `Cannot destructure property 'data' of undefined`
**Solution**:
```ts
const createChainableMock = () => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(), 
  then: vi.fn().mockResolvedValue({ data: [], error: null })
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => createChainableMock()) }
}));
```
**Why it works**: `mockReturnThis()` enables method chaining, final `then()` provides promise resolution.
```
