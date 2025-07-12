# Infinite Personalization Loop Investigation

**🎯 Purpose**: Research document for investigating and resolving infinite personalization loop issues in Wallet UI tests and related Supabase mocking problems.

**📅 Created**: 2025-07-12  
**🏷️ Priority**: Critical  
**📋 Status**: Research Needed  

---

## 🚨 Problem Summary

The Wallet UI e2e tests are experiencing multiple critical issues:

1. **Infinite Personalization Loop**: PersonalizationProvider causes thousands of rapid API calls
2. **Supabase Mock Incompleteness**: Missing proper channel subscription chain methods
3. **Test Failures**: Wallet content not rendering due to mock issues
4. **React Re-render Cascade**: Component dependency cycles causing infinite re-renders

---

## 📋 LLM Research Prompt

### Context for Investigation

You are investigating critical test failures in a React application with TypeScript, Playwright e2e tests, Supabase integration, and personalization features. 

**Your Task**: Research and analyze the root causes of these issues, then propose comprehensive solutions to resolve all problems. Do not assume any specific solutions - investigate the fundamental problems and determine the best approaches.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Testing**: Playwright e2e tests
- **Backend**: Supabase (auth, database, edge functions)
- **Personalization**: Custom PersonalizationContext with edge function calls
- **State Management**: React Context API
- **Feature Flags**: LaunchDarkly integration
- **Build Tool**: Vite
- **Package Manager**: npm
- **Node Version**: Likely 18+ (modern React app)

### Application Architecture Overview
This appears to be a user profile/wallet application with:
- **Profile page** with tabbed interface including a Wallet tab
- **Personalization system** that fetches user-specific data via Supabase edge functions
- **Feature flagging** to control which users see which features
- **Real-time subscriptions** for wallet/payment method changes
- **A/B testing integration** within the personalization system
- **Multiple React contexts** providing different data layers

### Primary Issues to Investigate

#### 1. Infinite Personalization Loop Root Cause

**Symptoms**:
- PersonalizationProvider making 1000+ rapid calls to `get-personalization-data` edge function
- React components re-rendering infinitely
- Tests timing out due to continuous network activity
- Console showing repeated personalization invocations

**Key Files to Analyze**:
```
src/contexts/PersonalizationContext.tsx
src/lib/personalization/featureFlags.ts
tests/e2e/_setup.ts
tests/e2e/wallet-smoke.spec.ts
```

**Specific Questions**:
1. What is causing the PersonalizationProvider to continuously re-trigger?
2. Are there dependency cycles in React hooks (useEffect, useCallback, useMemo)?
3. Is the memoization strategy correct for preventing re-renders?
4. How should the test environment properly disable personalization?

#### 2. Supabase Mock Implementation Issues

**Symptoms**:
- Error: `supabase.channel(...).on(...).subscribe is not a function`
- WalletContext failing to initialize properly
- Missing wallet content elements in test environment

**Key Files to Analyze**:
```
tests/e2e/_setup.ts (Supabase mock)
src/contexts/WalletContext.tsx
src/integrations/supabase/client.ts
```

**Specific Questions**:
1. What is the complete Supabase client API surface that needs mocking?
2. How should the channel subscription chain be properly mocked?
3. What other Supabase methods are the contexts trying to use?
4. How can we create a comprehensive mock that satisfies all contexts?

#### 3. React Context Dependencies and Lifecycle

**Symptoms**:
- Multiple contexts (PersonalizationProvider, WalletProvider) interfering
- Component re-render cascades
- useEffect dependency issues

**Key Files to Analyze**:
```
src/contexts/PersonalizationContext.tsx
src/contexts/WalletContext.tsx
src/TestApp.tsx (context providers hierarchy)
src/pages/Profile.tsx (context consumers)
```

**Specific Questions**:
1. What is the correct context provider hierarchy?
2. Are there circular dependencies between contexts?
3. How should context value memoization be implemented?
4. What are the optimal useEffect dependency arrays?

### Code Snippets for Analysis

#### Current PersonalizationContext (Problematic)
```typescript
// From src/contexts/PersonalizationContext.tsx
export const PersonalizationProvider: React.FC<PersonalizationProviderProps> = ({ 
  children, 
  userId 
}) => {
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PersonalizationError | null>(null);
  
  // A/B testing integration
  const abTestVariant = userId ? getUserVariant(userId, 'personalizedGreetings') : null;
  const experimentConfig = userId ? getExperimentConfig(userId, 'personalizedGreetings') : null;
  
  // Feature flag check for controlled rollout (Alpha/Beta phases)
  const featureFlagEnabled = useFeatureFlag('personalizedGreetings') ?? false;
  const temporaryFlagEnabled = enablePersonalizationForTesting();
  const abTestPersonalizationEnabled = experimentConfig?.enablePersonalization ?? false;
  const isPersonalizationEnabled = featureFlagEnabled || temporaryFlagEnabled || abTestPersonalizationEnabled;

  // A/B testing event tracking function
  const trackPersonalizationEvent = useCallback(async (
    eventType: 'exposure' | 'conversion' | 'engagement',
    eventName: string,
    metadata?: Record<string, any>
  ) => {
    if (!userId || !abTestVariant) return;

    const event: ABTestEvent = {
      experimentId: 'personalizedGreetings',
      variantId: abTestVariant,
      userId,
      eventType,
      eventName,
      timestamp: new Date(),
      metadata,
    };

    await trackABTestEvent(event);
  }, [userId, abTestVariant]);

  const fetchPersonalizationData = useCallback(async (): Promise<void> => {
    if (!userId || !isPersonalizationEnabled) {
      setPersonalizationData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the deployed edge function for personalization data
      const { data: personalizationResult, error: functionError } = await supabase.functions.invoke(
        'get-personalization-data',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (functionError) {
        throw new Error(`Edge function failed: ${functionError.message}`);
      }

      if (!personalizationResult) {
        throw new Error('No personalization data returned from edge function');
      }

      // Edge function returns: { firstName, nextTripCity, personalizationEnabled }
      const personalizationData: PersonalizationData = {
        firstName: personalizationResult.firstName || undefined,
        nextTripCity: personalizationResult.nextTripCity || undefined,
        // loyaltyTier: undefined, // Can be added later
      };

      setPersonalizationData(personalizationData);
      
      // Log analytics event (without exposing personal data)
      console.log('🎯 Personalization data loaded from edge function:', {
        hasFirstName: !!personalizationData.firstName,
        hasNextTrip: !!personalizationData.nextTripCity,
        userId: userId.slice(0, 8), // Log only partial ID for debugging
        functionResponse: {
          personalizationEnabled: personalizationResult.personalizationEnabled,
        },
      });

      // Track successful data fetch
      await trackPersonalizationEvent('exposure', 'data_fetched', {
        hasFirstName: !!personalizationData.firstName,
        hasNextTrip: !!personalizationData.nextTripCity,
        source: 'edge_function',
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const personalizationError: PersonalizationError = {
        type: 'fetch_failed',
        message: errorMessage,
        context: 'PersonalizationProvider.fetchPersonalizationData',
        fallbackUsed: true,
      };
      
      setError(personalizationError);
      setPersonalizationData(null);
      
      console.error('❌ Personalization fetch failed:', personalizationError);
      
      // Track error event
      await trackPersonalizationEvent('exposure', 'data_fetch_failed', {
        error: errorMessage,
        source: 'edge_function',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, isPersonalizationEnabled, trackPersonalizationEvent]);

  // Memoized value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    personalizationData,
    loading,
    error,
    refreshPersonalizationData: fetchPersonalizationData,
    isPersonalizationEnabled,
    abTestVariant,
    experimentConfig,
    trackPersonalizationEvent,
  }), [personalizationData, loading, error, fetchPersonalizationData, isPersonalizationEnabled, abTestVariant, experimentConfig, trackPersonalizationEvent]);

  // Fetch data when userId changes or feature is enabled
  useEffect(() => {
    if (userId && isPersonalizationEnabled) {
      fetchPersonalizationData();
    } else {
      setPersonalizationData(null);
      setLoading(false);
      setError(null);
    }
  }, [userId, isPersonalizationEnabled, fetchPersonalizationData]);

  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};
```

#### Feature Flag Implementation
```typescript
// From src/lib/personalization/featureFlags.ts
export const PERSONALIZATION_FEATURE_FLAGS = {
  personalizedGreetings: true, // Enable for testing
  nextTripSuggestions: false,
  loyaltyBadges: false,
};

export const isPersonalizationEnabled = (): boolean => {
  const isAlphaUser = true; // Set to true for testing
  const isFeatureEnabled = PERSONALIZATION_FEATURE_FLAGS.personalizedGreetings;
  return isAlphaUser && isFeatureEnabled;
};

export const enablePersonalizationForTesting = () => {
  // Check if we're in a test environment
  if (typeof window !== 'undefined' && (window as any).DISABLE_PERSONALIZATION_FOR_TESTS) {
    console.log('🚫 Personalization disabled for testing');
    return false;
  }
  console.log('🎯 Personalization enabled for testing');
  return true;
};
```

#### Current WalletContext (Complete Implementation)
```typescript
// From src/contexts/WalletContext.tsx
export function WalletProvider({ children }: WalletProviderProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment methods from the database
  const refreshPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('manage-payment-methods', {
        body: { action: 'list' },
      });

      if (error) {
        throw new Error(`Failed to fetch payment methods: ${error.message}`);
      }

      const response: PaymentMethodsResponse = data;
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payment methods');
      }

      setPaymentMethods(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load payment methods';
      setError(errorMessage);
      console.error('Error refreshing payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load payment methods on mount
  useEffect(() => {
    refreshPaymentMethods();
  }, []);

  // Listen for payment method changes via Supabase realtime
  useEffect(() => {
    const channel = supabase
      .channel('payment-methods-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'payment_methods' 
        }, 
        (payload) => {
          console.log('Payment method changed:', payload);
          refreshPaymentMethods();
        }
      )
      .subscribe(); // THIS IS WHERE THE ERROR OCCURS

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ... other methods (createSetupIntent, deletePaymentMethod, etc.)

  const value: WalletContextType = {
    paymentMethods,
    loading,
    error,
    refreshPaymentMethods,
    createSetupIntent,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    updatePaymentMethodNickname,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
```

#### Current Supabase Mock (Incomplete)
```typescript
// From tests/e2e/_setup.ts
const supabaseMock = {
  auth: {
    getSession: async () => ({
      data: { session: mockSession },
      error: null
    }),
    getUser: async () => ({
      data: { user: mockUser },
      error: null
    }),
    onAuthStateChange: (callback) => {
      // Immediately call with signed in state
      setTimeout(() => callback('SIGNED_IN', mockSession), 0);
      return { 
        data: { subscription: { unsubscribe: () => {} } }
      };
    },
    signOut: async () => ({ error: null }),
    signInWithOAuth: async () => ({ data: { provider: 'google', url: null }, error: null })
  },
  from: (table) => makeQueryBuilder(),
  channel: (channelName) => ({
    on: () => ({ on: () => {} }),
    subscribe: async () => ({ status: 'SUBSCRIBED' }),
    unsubscribe: async () => ({ status: 'UNSUBSCRIBED' })
  }),
  functions: {
    invoke: async (functionName, params = {}) => {
      console.log('🎯 Supabase function called:', functionName, params);
      
      // Track personalization call counts for assertions
      if (functionName === 'get-personalization-data') {
        (window as any).__PERSONALIZATION_INVOKES__ = 
          ((window as any).__PERSONALIZATION_INVOKES__ ?? 0) + 1;
        console.log('📊 Personalization invokes count:', (window as any).__PERSONALIZATION_INVOKES__);
      }
      
      // Add simple cache to prevent multiple calls
      const cacheKey = `${functionName}_${JSON.stringify(params)}`;
      if (!(window as any).__FUNCTION_CACHE__) {
        (window as any).__FUNCTION_CACHE__ = {};
      }
      
      if ((window as any).__FUNCTION_CACHE__[cacheKey]) {
        console.log('💾 Returning cached result for:', functionName);
        return (window as any).__FUNCTION_CACHE__[cacheKey];
      }
      
      let result;
      
      // Mock get-personalization-data function specifically with realistic response
      if (functionName === 'get-personalization-data') {
        result = {
          data: {
            greeting: 'Welcome back, Test User!',
            hasFirstName: true,  // Changed to true to satisfy conditions
            hasNextTrip: true,   // Changed to true to satisfy conditions  
            userId: 'user_test_123',
            recommendations: [
              { id: 1, title: 'Test Recommendation', type: 'test' }
            ],
            success: true,
            loading: false,      // Explicitly set loading to false
            error: null,         // Explicitly set error to null
            isComplete: true     // Add completion flag
          },
          error: null
        };
      }
      // Mock other personalization functions
      else if (functionName === 'personalization' || functionName === 'get-personalization') {
        result = {
          data: {
            hasFirstName: true,
            hasNextTrip: true,
            userId: 'user_test_123',
            loading: false,
            error: null,
            isComplete: true
          },
          error: null
        };
      }
      // Default mock response
      else {
        result = { data: {}, error: null };
      }
      
      // Cache the result
      (window as any).__FUNCTION_CACHE__[cacheKey] = result;
      
      return result;
    }
  },
  rpc: async () => ({ data: [], error: null })
};
```

#### WalletContext Channel Usage (Failing)
```typescript
// From src/contexts/WalletContext.tsx (approximate, analyze actual file)
useEffect(() => {
  if (!session?.user?.id) return;

  const channel = supabase
    .channel('payment_methods_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payment_methods' },
      (payload) => {
        console.log('Payment methods changed:', payload);
        refreshPaymentMethods();
      }
    )
    .subscribe(); // This is where the error occurs

  return () => {
    supabase.removeChannel(channel);
  };
}, [session?.user?.id, refreshPaymentMethods]);
```

#### TestApp Context Provider Hierarchy
```typescript
// From src/TestApp.tsx - Shows the complete provider nesting
const TestApp = () => {
  return (
    <SmartErrorBoundary level="global">
      <TestLaunchDarklyProvider testFlags={{wallet_ui: true, profile_ui_revamp: true}}>
        <QueryClientProvider client={queryClient}>
          <BusinessRulesProvider>
            <TooltipProvider>
              <GlobalMiddleware>
                <BrowserRouter>
                  <PersonalizationWrapper> {/* This wraps PersonalizationProvider */}
                    <NavigationWrapper />
                    <BreadcrumbsWrapper />
                    <main>
                      <Routes>
                        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                        {/* Profile component consumes PersonalizationContext */}
                      </Routes>
                    </main>
                  </PersonalizationWrapper>
                </BrowserRouter>
              </GlobalMiddleware>
            </TooltipProvider>
          </BusinessRulesProvider>
        </QueryClientProvider>
      </TestLaunchDarklyProvider>
    </SmartErrorBoundary>
  );
};

// PersonalizationWrapper component
const PersonalizationWrapper = ({ children }) => {
  const { userId } = useCurrentUser();
  
  return (
    <PersonalizationProvider userId={userId || undefined}>
      {children}
    </PersonalizationProvider>
  );
};
```

### Test Failure Logs
```
BROWSER: 🚫 Personalization disabled for testing
BROWSER: 🎯 Supabase function called: get-personalization-data {headers: Object}
BROWSER: 📊 Personalization invokes count: 162
BROWSER: 💾 Returning cached result for: get-personalization-data
BROWSER: 🎯 Personalization data loaded from edge function: {hasFirstName: false, hasNextTrip: false, userId: user_tes, functionResponse: Object}
[...repeats hundreds of times...]

PAGE ERROR: Error [TypeError]: supabase.channel(...).on(...).subscribe is not a function
    at http://localhost:8080/src/contexts/WalletContext.tsx:196:12

Error: No wallet content found after clicking wallet tab
Available data-testid elements: []
```

### Critical Analysis Points

#### Infinite Loop Root Cause Investigation
1. **Dependency Chain Analysis**: The PersonalizationContext has a complex dependency chain:
   - `fetchPersonalizationData` depends on `[userId, isPersonalizationEnabled, trackPersonalizationEvent]`
   - `trackPersonalizationEvent` depends on `[userId, abTestVariant]`
   - `contextValue` depends on `[...fetchPersonalizationData, ...trackPersonalizationEvent, ...]`
   - `useEffect` depends on `[userId, isPersonalizationEnabled, fetchPersonalizationData]`
   - **Key Question**: Are any of these dependencies changing on every render?

2. **Feature Flag Evaluation**: The `isPersonalizationEnabled` calculation involves:
   - `useFeatureFlag('personalizedGreetings')` (LaunchDarkly)
   - `enablePersonalizationForTesting()` (checks window.DISABLE_PERSONALIZATION_FOR_TESTS)
   - `experimentConfig?.enablePersonalization` (A/B testing)
   - **Key Question**: Are these values stable, or do they change on every render?

3. **Test Environment Paradox**: The logs show:
   - "🚫 Personalization disabled for testing" (from `enablePersonalizationForTesting()`)
   - But also "🎯 Supabase function called: get-personalization-data"
   - This suggests the disabling mechanism is not working properly

#### Supabase Mock Chain Analysis
4. **Channel Method Chaining**: The current mock returns:
   ```typescript
   channel: (channelName) => ({
     on: () => ({ on: () => {} }),  // This breaks the chain!
     subscribe: async () => ({ status: 'SUBSCRIBED' }),
     unsubscribe: async () => ({ status: 'UNSUBSCRIBED' })
   })
   ```
   - **Problem**: `.on()` should return `this` to allow chaining `.on().subscribe()`
   - **Missing**: `removeChannel()` method that WalletContext cleanup tries to call

#### Test Environment Setup Issues
5. **Context Provider Hierarchy**: PersonalizationWrapper depends on `useCurrentUser()` which might:
   - Return different values on different renders
   - Trigger re-renders when userId changes
   - **Key Question**: Is `useCurrentUser()` stable in test environment?

6. **Test Initialization Order**: The test setup involves:
   - Mock user authentication in `beforeEach`
   - Navigate to `/profile` which renders PersonalizationWrapper
   - PersonalizationWrapper calls `useCurrentUser()` to get userId
   - PersonalizationProvider initializes with userId
   - **Key Question**: Is there a race condition in this sequence?

### Research Questions

#### Critical Path Analysis
1. **What is the exact sequence of React renders** that causes the infinite loop?
2. **Which useEffect dependencies** are changing on every render?
3. **How can we trace the re-render cycle** to identify the root cause?
4. **Is `useCurrentUser()` returning a stable userId** in test environments?
5. **Are the feature flag functions** (`useFeatureFlag`, `enablePersonalizationForTesting`) returning consistent values?

#### Mocking Strategy 
1. **What is the complete Supabase client API** that needs to be mocked for tests?
2. **How should real-time subscriptions be mocked** without causing side effects?
3. **What is the proper pattern** for mocking chained API calls like `.channel().on().subscribe()`?
4. **How can we mock `removeChannel()`** and other missing Supabase methods?

#### Test Environment Design
1. **How should personalization be completely disabled** in test environments?
2. **What is the proper way to mock edge functions** without triggering real network calls?
3. **How can we ensure context providers initialize properly** in test environments?
4. **Should PersonalizationProvider be completely bypassed** in test mode?
5. **How can we make `useCurrentUser()` stable** during test execution?

### Expected Deliverables

#### 1. Root Cause Analysis
- **Detailed explanation** of what's causing the infinite personalization loop
- **Component dependency graph** showing the re-render cycle
- **Specific code locations** where the issue originates

#### 2. Comprehensive Solution Strategy
- **PersonalizationContext refactoring** to prevent infinite loops
- **Complete Supabase mock implementation** that satisfies all contexts
- **Test environment configuration** that properly disables problematic features

#### 3. Implementation Guidance
- **Specific code changes** needed in each file
- **Step-by-step implementation plan** to resolve all issues
- **Testing strategy** to verify the fixes work correctly

#### 4. Prevention Measures
- **Coding patterns** to avoid similar issues in the future
- **Test assertions** to catch infinite loops early
- **Context design guidelines** to prevent dependency cycles

### Files to Analyze

**Primary Context Files**:
- `src/contexts/PersonalizationContext.tsx`
- `src/contexts/WalletContext.tsx`
- `src/TestApp.tsx`

**Test Infrastructure**:
- `tests/e2e/_setup.ts`
- `tests/e2e/wallet-smoke.spec.ts`

**Integration Files**:
- `src/integrations/supabase/client.ts`
- `src/lib/personalization/featureFlags.ts`

**Component Files**:
- `src/pages/Profile.tsx`
- `src/components/ui/tabs.tsx` (if relevant)

### Success Criteria

✅ **Personalization loop resolved**: No more than 1-2 personalization calls per test  
✅ **Supabase mock complete**: All context providers initialize without errors  
✅ **Wallet UI renders**: Test can find and interact with wallet content elements  
✅ **Tests pass consistently**: No timeout or infinite loop errors  
✅ **Performance maintained**: No degradation in real application performance  

---

## 🎯 Investigation Focus Areas

### 1. React Hook Dependencies
- Analyze all useEffect, useCallback, useMemo dependency arrays
- Check for objects/functions being recreated on every render
- Identify missing or incorrect dependencies

### 2. Context Value Memoization
- Verify that context values are properly memoized
- Check if providers are creating new objects unnecessarily
- Analyze the impact of context consumer re-renders

### 3. Test Environment Isolation
- Ensure test mocks don't interfere with each other
- Verify proper cleanup between tests
- Check for global state pollution

### 4. Supabase Integration Patterns
- Document the complete Supabase client API surface used
- Create comprehensive mocks for all used methods
- Ensure real-time features are properly mocked

---

**🔍 Next Steps**: Once research is complete, create implementation plan in `docs/development/PERSONALIZATION_LOOP_FIX_PLAN.md`
Resolving the Infinite Personalization Loop and Test Failures in the Profile+Wallet System
Overview of Issues
1. Infinite Personalization Loop: The PersonalizationProvider was triggering an endless cycle of API calls to the Supabase edge function get-personalization-data. In Playwright tests, over a thousand calls were observed in rapid succession, causing test timeouts and flooding the console. This loop indicated a React effect running continuously due to unstable dependencies or misconfigured hooks. 2. Supabase Mock Errors: The test environment’s Supabase client mock was incomplete. In particular, the real-time channel subscription API (supabase.channel(...).on(...).subscribe()) was not fully mocked, leading to a runtime error: “supabase.channel(...).on(...).subscribe is not a function”. This broke the WalletContext subscription logic and prevented the wallet UI from rendering in tests. 3. Wallet Content Rendering Failure: Because of the above issues, the Wallet section of the profile did not render during e2e tests. The infinite loop kept the app busy, and the missing mock caused a TypeError that likely triggered an error boundary or prevented the Wallet context from providing data. The Playwright test could not find expected wallet elements, causing failures. 4. React Re-render Cascade: Underlying these problems were React 18 behaviors around context and effects. Frequent state changes and context value updates in PersonalizationProvider were causing repeated re-renders of consumers. Unstable hook dependencies (functions or objects recreated each render) can lead to continuous effect triggers
dev.to
dev.to
. Combined with feature flag updates and A/B test logic, this created a cascade of re-renders and API calls.
Root Cause Analysis
1. Personalization Loop – React Hook Dependency Cycle
The infinite loop was traced to the effect inside PersonalizationProvider. The code was roughly:
tsx
Copy
useEffect(() => {
  if (userId && isPersonalizationEnabled) {
    fetchPersonalizationData();
  } else {
    // reset state
  }
}, [userId, isPersonalizationEnabled, fetchPersonalizationData]);
Here, fetchPersonalizationData is defined with useCallback and depends on [userId, isPersonalizationEnabled, trackPersonalizationEvent]. Likewise, trackPersonalizationEvent is a callback depending on [userId, abTestVariant]. Several issues in this chain caused repeated invocations:
Unstable Function Dependency: Including the callback fetchPersonalizationData in the effect’s dependency array made the effect run anytime that function’s identity changed. In React, a function is a reference type that changes on each render unless memoized
dev.to
dev.to
. Although fetchPersonalizationData was wrapped in useCallback, its dependencies (notably trackPersonalizationEvent) might have changed during the initial renders (e.g., when userId became available or when an A/B variant was assigned). This would create a new fetchPersonalizationData reference, retriggering the effect continuously. Essentially, the effect was indirectly depending on values (like abTestVariant) that fluctuated and caused an infinite re-render loop
dev.to
.
Feature Flag & A/B Test Volatility: The value of isPersonalizationEnabled was composed of multiple factors – a LaunchDarkly feature flag, a test override flag, and an experiment config toggle. In the test environment, we expected personalization to be off (the code logs “🚫 Personalization disabled for testing” when window.DISABLE_PERSONALIZATION_FOR_TESTS is set). However, the loop still ran, meaning something was enabling personalization despite the test flag. Likely causes:
The LaunchDarkly hook useFeatureFlag('personalizedGreetings') might have returned true (perhaps a default or misconfiguration) or toggled during runtime.
The experimentConfig?.enablePersonalization from the A/B test may have been true for the test user, overriding the disable. If abTestPersonalizationEnabled was true, it would force isPersonalizationEnabled true via the logical OR, even if the test override returned false.
The result: isPersonalizationEnabled oscillated or stayed true unexpectedly in tests, so the effect kept calling fetchPersonalizationData. This “test environment paradox” is evidenced by logs showing the test-disable message and then the function being invoked hundreds of times.
useCurrentUser Timing: The PersonalizationWrapper provides userId to the provider via useCurrentUser(). On initial mount, userId might be undefined until Supabase auth returns the user (the mock triggers a sign-in event asynchronously). This means the effect likely ran once with userId falsy (doing nothing but setting state to null), then ran again when userId became available. That alone is expected. However, if useCurrentUser or Auth context updated the user multiple times (e.g., session fetch then auth event), it could cause multiple re-renders. Each time userId changed from undefined to value (even if the same value set twice), the effect would consider it a change. If combined with the flag logic above, this could initiate the loop. In summary, the userId stabilizes after login, but initial rapid updates could have contributed to the first few fetch calls (after that, the loop was sustained by the dependency issues described).
Context Value Changes: Every state update in PersonalizationProvider (loading, error, personalizationData) leads to a new context value object via useMemo. When the provider’s value changes, all consumer components re-render
medium.com
. In an infinite loop scenario, this means the Profile page (and any components consuming personalization data) re-render endlessly, compounding the performance issue. The context value included objects like experimentConfig and functions that could be new on each render, even if the underlying flags didn’t materially change. This created a cascade of renders across the app, amplifying the loop’s impact (though not the root cause, it worsened the symptoms).
2. Supabase Mock – Missing Channel Chaining
Supabase’s real-time API uses a chaining pattern: e.g. supabase.channel('name').on('postgres_changes', {...}, callback).subscribe(). In our code, the WalletContext subscribes to a Postgres changes channel for payment_methods updates. The test mock for Supabase did not correctly implement this chain:
ts
Copy
// Before: incomplete mock snippet
supabaseMock.channel = (channelName: string) => ({
  on: () => ({ on: () => {} }),        // returns a new object without subscribe
  subscribe: async () => ({ status: 'SUBSCRIBED' }),
  unsubscribe: async () => ({ status: 'UNSUBSCRIBED' })
});
Instead of returning the same channel object from .on(), it returned a new object that had its own .on but no .subscribe. As a result, calling .subscribe() on the return of .on() caused a TypeError. The log clearly shows the error thrown in WalletContext.tsx:196 where .subscribe() was called. Additionally, the mock did not define supabase.removeChannel, which the WalletContext calls during cleanup (removeChannel(channel)). This method was undefined, which would throw an error if the code reached the cleanup (though in our case it likely never got that far due to the earlier failure). Impact: The broken mock meant the WalletContext’s useEffect failed at runtime. The wallet subscription was never established, and the error likely prevented the WalletProvider from completing its render or state setup. Consequently, when the test clicked the "Wallet" tab, none of the expected content (payment method list, add button, etc.) was present – the context was effectively not providing data. The test failure “No wallet content found after clicking wallet tab” aligns with this problem.
3. Context Hierarchy and Re-render Triggers
We examined whether the arrangement of context providers or any circular dependencies might contribute to these issues:
Provider Order: In TestApp, PersonalizationProvider wraps the application routes (including the Profile page inside an AuthGuard). This means PersonalizationContext is initialized even for the /profile route’s guarded content. If the user were not authenticated, the AuthGuard would redirect, but the PersonalizationProvider still mounts (with no userId). This is mostly benign (it will no-op since userId is falsy), but it’s an unnecessary initialization when the user isn’t signed in. It did not directly cause the loop (the loop occurred when a user was signed in), but it points to a potential improvement: we should only mount personalization logic when a user is present or after auth to avoid any race conditions.
RefreshPaymentMethods dependency: In WalletContext, the effect subscribing to changes had a dependency array [session?.user?.id, refreshPaymentMethods]. The refreshPaymentMethods function is defined inside the provider and not memoized, so it is a new function on every render. This is another instance of a function dependency that changes every time, which could retrigger the effect needlessly
dev.to
dev.to
. In practice, after initial mount, session.user.id is stable and the effect should ideally run only once. But because refreshPaymentMethods’ reference changes each render, React’s exhaustive-deps rule led to its inclusion, and thus the effect might re-run on every context re-render. That could open multiple redundant channels or at least cause repeated unsubscribe/subscribe cycles. It’s not an infinite loop, but it’s inefficient and could contribute to test instability (opening extra connections or resetting state).
Context Consumer Re-renders: As noted, any frequent changes in context provider value will re-render consumers
medium.com
. In our case, the Profile page likely consumes PersonalizationContext (e.g., to display a greeting). If personalization data was being set to a new object repeatedly, the Profile page would constantly re-render. Similarly, WalletContext changes (loading states, etc.) re-render the Wallet UI. These rapid re-renders could interfere with Playwright’s ability to find elements in time or cause tests to flakily fail if the DOM is in flux. Ensuring context values and state changes stabilize is important for test and production performance.
Implementation Plan and Solutions
To address the above issues, we will refactor the Personalization system for stability, complete the Supabase mock, and adjust context usage. The focus is on breaking the infinite loop, ensuring one-time initialization of personalization in tests, fixing the Supabase real-time mocks, and tightening our React effect dependencies.
A. Fixing the PersonalizationProvider Loop
1. Prevent Continuous Effect Triggers: We will modify the useEffect in PersonalizationProvider to remove unstable dependencies and guard against repeated calls. The fetchPersonalizationData function should not be in the dependency array because it’s already tied to userId and the enable flag. We will rely solely on [userId, isPersonalizationEnabled] as the effect dependencies, ensuring it runs only when the user logs in/out or when the feature is toggled on/off – not on every re-render. In code:
diff
Copy
- useEffect(() => {
-   if (userId && isPersonalizationEnabled) {
-     fetchPersonalizationData();
-   } else {
-     setPersonalizationData(null);
-     setLoading(false);
-     setError(null);
-   }
- }, [userId, isPersonalizationEnabled, fetchPersonalizationData]);
+ useEffect(() => {
+   if (!userId || !isPersonalizationEnabled) {
+     // Reset if no personalization
+     setPersonalizationData(null);
+     setLoading(false);
+     setError(null);
+     return;
+   }
+   // Only fetch once per userId/enable change
+   fetchPersonalizationData();
+ }, [userId, isPersonalizationEnabled]);
This change means once personalization data is fetched for a given user under the enabled conditions, the effect won’t run again unless those high-level inputs change. We deliberately ignore the fetchPersonalizationData function’s identity here (and will ensure it doesn’t change unnecessarily). This is acceptable because the function closes over the latest values of userId and flags on each render anyway. We will add an ESLint ignore comment for the exhaustive-deps warning in this case, with rationale documented (i.e., to avoid false dependency on a stable callback). This approach stops React from re-running the effect due to internal function changes. 2. Strengthen Feature Flag Overrides: We will ensure that the test override truly disables personalization. Currently, enablePersonalizationForTesting() returns false (and logs) if window.DISABLE_PERSONALIZATION_FOR_TESTS is set, but our logic combined it with an OR of other flags. To fix this:
Short-circuit logic: If the test override returns false (meaning tests requested disable), we should force isPersonalizationEnabled to false regardless of any other flag. In practice, we can restructure:
ts
Copy
const temporaryFlagEnabled = enablePersonalizationForTesting(); // false in tests
const isPersonalizationEnabled = temporaryFlagEnabled && (featureFlagEnabled || abTestPersonalizationEnabled);
This way, when temporaryFlagEnabled is false, it will make isPersonalizationEnabled false, period. Only if the testing override isn’t present (or returns true) do we consider the LaunchDarkly flag or experiment. This change ensures the test environment can reliably turn off personalization calls.
Double-check LaunchDarkly usage: In the test setup, we use a TestLaunchDarklyProvider with certain flags. We should explicitly set the personalization flag to false in this provider for clarity (e.g., testFlags={{ personalizedGreetings: false, wallet_ui: true, ... }}), so that useFeatureFlag('personalizedGreetings') yields a stable false in tests. Although the code falls back to a static flag object in some cases, being explicit avoids any race condition where the LaunchDarkly client might initialize and flip the value. This aligns with our rollback readiness: by default, the personalized greeting feature is off unless explicitly enabled for a test or user.
Deterministic A/B Variant: We will review getUserVariant / getExperimentConfig to ensure they return consistent results for a given user (e.g., based on a hash or fixed seed). If, for example, getUserVariant was non-deterministic or changed on each call, it would change abTestVariant every render, constantly altering trackPersonalizationEvent’s dependency. We suspect the variant is stable (likely hashed by userId), but we will document that assumption or implement a stable variant assignment for tests (perhaps always assigning “Control” variant for test users). A stable variant ensures trackPersonalizationEvent (which depends on [userId, abTestVariant]) remains the same function after the first assignment, rather than changing and causing re-renders.
3. Optimize the Personalization Fetch: We will add a test-mode guard inside fetchPersonalizationData itself to be doubly safe. Before making the Supabase call, check the test flag:
ts
Copy
const fetchPersonalizationData = useCallback(async () => {
  if (typeof window !== 'undefined' && (window as any).DISABLE_PERSONALIZATION_FOR_TESTS) {
    console.log('⚠️ Skipping personalization fetch in test mode');
    return;
  }
  if (!userId || !isPersonalizationEnabled) return;
  // ... proceed to call supabase.functions.invoke ...
}, [userId, isPersonalizationEnabled, /* trackPersonalizationEvent */]);
This ensures that even if isPersonalizationEnabled were somehow true, we will not call the API in test mode. It’s an extra safety net that costs little. (We include the test flag check here because our earlier logic OR could theoretically be bypassed by the experiment flag; this double-check guarantees no calls in tests.) The console log helps us confirm in CI output that the fetch was indeed skipped, and it complements the existing “disabled for testing” log. 4. Reduce State Change Noise: We will ensure that we only set state when necessary to avoid needless re-renders:
After a successful personalization fetch, personalizationData is set to an object with the fetched fields. We should consider if we can avoid setting it multiple times with identical data. Given our effect will only call fetch once per conditions, this is less of an issue now. But as a precaution, if the edge function returns the same data as already stored, we might avoid calling setPersonalizationData again. (In practice, our caching in the mock prevents repeated different calls, but this could help if a similar effect re-runs in the future.)
We will remove experimentConfig from the context value if consumers don’t need it. Currently, we pass the whole experiment config object in contextValue, but likely only the variant or a boolean is needed externally. By excluding large objects, we keep the context value simpler and avoid changing it every render. For example, we might omit experimentConfig and only expose abTestVariant and a boolean like isPersonalizationEnabled (which we already have).
trackPersonalizationEvent is included in context value. It’s stable after initial load, but if not needed by other components, we could choose not to expose it either (the provider itself can handle tracking on fetch and maybe on conversion events internally). If we do need it (say, a component triggers a “conversion” event), it’s okay as it's memoized.
5. Documentation & Monitoring: We will update comments in the code to explain the dependency reasoning – this helps future maintainers (and code reviewers/linter exceptions) understand that we intentionally left out fetchPersonalizationData from dependencies to avoid loops
dev.to
. Additionally, we’ll keep the console logs for now (Personalization data loaded…, error logs, etc.) to monitor behavior during development and tests. After confirming the loop is fixed (seeing only one fetch in logs), we might tone down the logging if noisy, but given our observability goals it’s good to log at least once when personalization fetch happens.
B. Completing the Supabase Mock (Real-time Channels)
1. Fix .on().subscribe() Chaining: We will refactor the supabaseMock.channel method to properly return a channel object that supports chaining. The .on function should return the same object that has the .subscribe method. For example:
ts
Copy
supabaseMock.channel = (channelName: string) => {
  const channel = {
    on: (eventType: string, filter: object, callback: Function) => {
      console.log(`Subscribed to realtime channel '${channelName}' (event: ${eventType})`);
      // (We can store callback and filter in an array here if we want to simulate events later)
      return channel; // return itself to allow chaining
    },
    subscribe: () => {
      console.log(`✅ Channel '${channelName}' subscription activated`);
      return { data: { status: 'SUBSCRIBED' } };  // mimicking Supabase v2 style response
    },
    unsubscribe: () => {
      console.log(`🛑 Channel '${channelName}' unsubscribed`);
      return { data: { status: 'UNSUBSCRIBED' } };
    }
  };
  return channel;
};
With this implementation, a call to supabase.channel('payment-methods-changes').on('postgres_changes', {...}, cb).subscribe() will work correctly: .on logs and returns the channel object, and then .subscribe() can be called on it without error. This mirrors the fluent API of Supabase’s real-time client. The exact return value of .subscribe() in Supabase v2 is a { data: { subscription: RealtimeChannel } } or similar; returning { status: 'SUBSCRIBED' } or a simple object is sufficient for tests since we aren’t checking it. The key is that it doesn’t throw. We included console logs to aid debugging if needed (they will appear in test output, indicating the subscription step was reached, confirming that our fix is being exercised). 2. Implement removeChannel: We add supabaseMock.removeChannel = (channel) => { console.log('Removed channel', channel); return { data: { success: true } }; }. In our WalletContext cleanup, we call supabase.removeChannel(channel), so this prevents a crash on unmount. It simply logs and returns a success. (In a real scenario, Supabase would stop receiving messages on that channel. In tests, there are no real messages, so a no-op is fine.) This change aligns with Supabase best practices to remove channels when done
stackoverflow.com
 – now our tests will mirror production behavior by cleaning up the subscription without errors. 3. Cover Other Supabase Methods: We’ll double-check what else the contexts or components use:
The supabase.from(...).select(...) query builder might be used elsewhere (perhaps to load profile or other data). The mock currently returns a dummy makeQueryBuilder() for .from(). We should ensure that makeQueryBuilder() is defined in the test setup or adjust it to return an object with chainable .select, .eq, etc., that ultimately returns a resolved Promise. If the wallet or profile uses any direct .from queries, we need to return appropriate fake data. (From the context code provided, most data fetching was via edge functions, not direct RPC, but we should verify).
The supabase.functions.invoke mock is already in place for get-personalization-data. We will extend this to handle the wallet's manage-payment-methods function. Currently, any function name not matched falls through to result = { data: {}, error: null }. In WalletProvider, after invoking 'manage-payment-methods' with { action: 'list' }, the code expects a structure like { data: PaymentMethodsResponse, error: null } where PaymentMethodsResponse has a success flag and possibly a data array. Our generic {} would lead to response.success being undefined (falsy), causing the Wallet to throw “Failed to fetch payment methods”. To prevent the wallet from thinking the API failed, we will mock a successful response:
ts
Copy
if (functionName === 'manage-payment-methods') {
  // Simulate a successful list action with no payment methods
  result = { data: { success: true, data: [] }, error: null };
}
This way, refreshPaymentMethods() in the WalletContext will set an empty array without error. The wallet UI will simply show “no payment methods” (or whatever empty state is defined) instead of erroring out. This addresses the possibility that, after fixing the subscribe error, the test could still fail if the wallet content is not appearing due to an error state. Now, the wallet should render normally (with zero items but the UI for adding methods visible).
Ensure supabase.auth mocks cover all usage (already did for getSession, getUser, onAuthStateChange, etc.). Those seemed complete in the snippet.
After these changes, rerunning tests should show that:
The subscribe is not a function error is gone (the chain works).
The console will log the subscription activation, and then the removal on test teardown, confirming the flow.
The wallet tab will load its content (even if empty), allowing the test to find the wallet component by its test ID.
C. Stabilizing React Contexts and Dependencies
1. Memoize WalletContext Refresh: We will wrap refreshPaymentMethods (and any similar state-mutating callbacks) in useCallback. In WalletContext.tsx, refreshPaymentMethods is defined as an async function but not memoized. We can do:
diff
Copy
- const refreshPaymentMethods = async () => {
+ const refreshPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.functions.invoke('manage-payment-methods', { body: { action: 'list' } });
      ...
      setPaymentMethods(response.data || []);
    } catch (err) {
      ...
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
- };
+ }, []);
By adding useCallback([], []), the refreshPaymentMethods reference will remain constant throughout the component’s life (since it has no external dependencies, an empty array is appropriate). This prevents the effect that subscribes to changes from re-running on every render. Now the WalletContext’s subscription effect [session?.user?.id, refreshPaymentMethods] will trigger only when session.user.id changes (i.e., user logs in or out)
dev.to
dev.to
. This means we open one channel per user session and close it on unmount, exactly as intended. No more repeated subscriptions or unnecessary re-fetch calls due to this dependency. 2. Context Provider Hierarchy: We will make a minor adjustment to when PersonalizationProvider is mounted. Ideally, it should mount after the user is known, to avoid running when no user is present. Currently, it wraps the route including AuthGuard. We have a couple of options:
Move inside AuthGuard/Profile: We could move the <PersonalizationProvider> inside the Profile component (or inside AuthGuard once authenticated). For example, render it in Profile.tsx around the portion that needs personalization. This ensures it’s only active for logged-in users on the profile page. This change requires coordination with how the Profile page is structured (and ensuring the provider is not duplicatively mounted).
Lazy-init via userId prop: Alternatively, we keep it where it is but rely on the userId prop being undefined until login. Our effect already handles the !userId case by resetting state and not calling anything. So it’s mostly fine as is. The main downside was the initial mount with no user doing a useless render. Given time constraints, we might leave it as is, since our guards prevent any real calls if userId is falsy. We have effectively handled the race by not calling fetch until userId is set and stable.
We will document this in code: e.g., in PersonalizationWrapper, a comment “PersonalizationProvider is mounted regardless of auth state; it will remain idle until a userId is provided.” 3. Avoiding Circular Context Dependency: We confirmed there's no direct circular dependency (Personalization uses user context, but user context doesn’t use personalization). The LaunchDarkly context (TestLaunchDarklyProvider) is at the top, and doesn’t depend on others. So no changes needed there beyond flags input. 4. Ensure Single Source of Truth for Flags: We will double-check that useFeatureFlag('personalizedGreetings') is consistent. If the app is using LaunchDarkly’s React SDK, the LDProvider (or our Test provider) should supply a stable flag value. In production, LaunchDarkly might update flags at runtime (e.g., toggling the flag could re-render components). Our code already handles that by reading the hook each render. In tests, we’ll keep it static. This means during tests, featureFlagEnabled will remain false (unless we explicitly toggle it for a specific test). Combined with our test override, personalization will remain off, eliminating the flicker of calls. 5. Testing the Changes in Isolation: We will write or update unit tests for the personalization logic:
A test for PersonalizationProvider with a fake Supabase client that counts calls (using the same __PERSONALIZATION_INVOKES__ counter) to assert that when mounted with a user, it calls the function once and not repeatedly. We can simulate toggling the feature flag or experiment flag off and on to ensure the effect responds correctly (calls on enable, doesn’t call when disabled).
A test for WalletContext could simulate a sequence: mount -> ensure supabase.channel.subscribe was called once and removeChannel on unmount. Also verify that if refreshPaymentMethods is called and then state updates, it doesn’t cause an extra subscribe. This may be too deep for a unit test without a lot of mocking, so it might be covered by integration tests primarily.
D. File-by-File Summary of Changes
Below is a breakdown of what files to modify and how:
src/contexts/PersonalizationContext.tsx:
Dependency Array in useEffect: Remove fetchPersonalizationData from the dependencies. After this, add an inline comment disabling the ESLint rule for exhaustive deps on that line, with explanation. This stops the infinite loop trigger.
Test Override Logic: Refactor how isPersonalizationEnabled is computed so that the test flag can disable all calls. Ensure temporaryFlagEnabled (from enablePersonalizationForTesting()) acts as a master switch. If it’s false, set isPersonalizationEnabled = false outright, or use the && pattern described. Also, call enablePersonalizationForTesting() before using other flag values so the console log ordering makes sense (not critical, but for clarity).
In-Code Guard: Add the if (window.DISABLE_PERSONALIZATION_FOR_TESTS) return; check at the top of fetchPersonalizationData as a safeguard. This is especially useful if someone calls refreshPersonalizationData() manually in a test – it will early-out.
Context Value Cleanup: Remove experimentConfig from the context value unless needed. It was only used to derive flags internally. If no component uses it directly, we can stop providing it. (If some component does, we could instead provide a derived boolean like personalizationExperimentEnabled if needed.) This avoids passing a new object each render.
Memoization: Ensure trackPersonalizationEvent is still wrapped in useCallback (it is) and consider if we need to include isPersonalizationEnabled or other stable values in its deps to avoid stale closures. It primarily uses userId and abTestVariant which are fine. We might include an invariant: it does nothing if called when personalization is disabled, but that’s minor.
Comments/Logging: Update the console log that prints “Personalization enabled/disabled for testing” to clearly indicate the final decision. For instance, log the value of isPersonalizationEnabled after computation for transparency. Keep the partial userId logging for privacy (that’s good practice).
src/contexts/WalletContext.tsx:
Memoize refreshPaymentMethods: Wrap it in useCallback (no dependencies, or [supabase] if we consider the client a dep, but the supabase instance is a singleton and can be treated as constant). This prevents it from changing on re-renders
dev.to
dev.to
.
Fix Effect Dependencies: After memoizing, the effect for realtime updates can depend on just [session?.user?.id] (and maybe [refreshPaymentMethods] if linter insists, but now it’s stable). So the effect effectively runs once per user session. We will verify that the effect’s callback (subscribe/unsubscribe) doesn’t need to run again unnecessarily. If the linter still flags it, we include refreshPaymentMethods but it won’t cause re-runs.
Error Handling: Confirm that if the invoke returns an error or empty data, we handle it gracefully. We have a setError which might display a message. Since we improved the mock to return success, tests should see a non-error scenario. But we ensure the error state doesn’t break rendering (it shouldn’t; probably the UI still shows the wallet frame with an error message).
Other Functions: If WalletContext has other methods like createSetupIntent, deletePaymentMethod, etc., we should consider mocking those if tests invoke them. Possibly not in these smoke tests, but for completeness, we might add basic implementations or at least log and pretend success for those as well in the mock (e.g., return success immediately). This ensures any user action in tests (if any) won’t break due to unmocked calls.
Subscription Cleanup: Our removeChannel mock is in place; just verify we call it in the cleanup (we do). Everything should match Supabase’s recommended pattern of unsubscribing to avoid memory leaks
stackoverflow.com
.
tests/e2e/_setup.ts (or wherever the Supabase client is mocked for Playwright):
Channel Chain Fix: Implement the revised supabaseMock.channel as described, returning a chainable object. Test it manually by running a snippet in the test env to ensure supabase.channel('x').on(...).subscribe() doesn’t throw.
RemoveChannel: Add supabaseMock.removeChannel as discussed.
functions.invoke enhancements: Add the conditional for 'manage-payment-methods' to return a realistic success response. Also handle any other edge functions that might be called during tests. For instance, if profile page calls an edge function to fetch profile data or update something, ensure those are caught. The investigation didn’t mention others, so likely it's just these two (personalization and payment methods). Our mock already covers personalization calls with caching to simulate idempotency. We will maintain that caching – it’s useful to prevent multiple identical calls from doing work. (In fact, with our loop fix, the cache counter will let us assert only 1 call was made, which is great for verifying the fix.)
Log Reduction (Optional): The mock currently logs every Supabase function call and the personalization count. This was helpful for debugging, but it can produce a lot of output. After confirming the fix, we might remove or tone down these logs to keep CI output clean. Perhaps keep the count but remove the detailed console logs, or only log if the count is beyond a threshold. This is not strictly necessary, but worth noting for test cleanliness.
Test LaunchDarkly Flags: Ensure that the test setup sets window.DISABLE_PERSONALIZATION_FOR_TESTS = true before the React app is mounted. Possibly in beforeAll or beforeEach of the Playwright spec, or in the fixture that launches the app, make sure to inject that flag into the window (or perhaps the app reads it from an environment variable; if so, set that env). This guarantees that by the time PersonalizationProvider runs, the flag is in place. The logs showed it working (it printed the message), so likely it’s already done. We’ll just double-check the ordering. If needed, one can also start the app with something like DISABLE_PERSONALIZATION_FOR_TESTS=1 in the environment to have it set at launch.
src/TestApp.tsx / LaunchDarkly Test Provider:
When rendering TestLaunchDarklyProvider, include the personalization flag off by default as mentioned. For example: <TestLaunchDarklyProvider testFlags={{ wallet_ui: true, profile_ui_revamp: true, personalizedGreetings: false }}>. Ensure the useFeatureFlag hook in our app will get false. This solidifies that in test runs, featureFlagEnabled is consistently false. In production, of course, the real LDProvider will control it.
No other changes here, since it's just test configuration.
E. Validation Strategy (CI-Safe Tests)
With the above changes implemented, we will verify the issues are resolved through both automated tests and manual observation:
Playwright E2E Tests: Re-run the profile/wallet E2E tests. We expect:
No infinite loop: The log counter __PERSONALIZATION_INVOKES__ should report a small number. For instance, it might log “Personalization invokes count: 1” once and then stop, instead of climbing into the hundreds. The test should no longer time out waiting for network silence. If possible, we can add an assertion in the test after loading the profile page to check that window.__PERSONALIZATION_INVOKES__ <= 1 to catch regressions early.
Wallet content renders: After clicking the Wallet tab, the test should find the wallet content elements. The .subscribe error will be gone, and our mock returns a success for the list, so the WalletContext should quickly set paymentMethods to an empty array (and loading to false). The UI will render an empty state (which presumably contains identifiable elements, like an “Add Payment Method” button or a message, which the test can detect). We will verify the test now passes this step.
No runtime errors: The browser console in tests should be free of uncaught exceptions. Specifically, no "TypeError" about .subscribe, and no React act warnings about state updates in an unmounted component (which could have happened during the previous loop).
Timing: The test run should be faster. The infinite loop was likely slowing or blocking the test; without it, the profile page should load promptly and move on. If we had test timeouts or slow DOM updates, those should resolve.
Unit Tests: We will add or update a unit test for PersonalizationProvider if not already present. For example, simulate enabling personalization (with a fake userId and a stubbed supabase.functions.invoke that returns test data) and ensure that:
fetchPersonalizationData is called exactly once on mount.
If isPersonalizationEnabled is false initially or becomes false, no calls are made.
Toggling the prop userId from one value to another triggers exactly one more fetch (to cover a user switch scenario).
These tests will help guard against future regressions in hook dependencies.
Manual QA in Dev Environment: Run the app in development mode:
Log in as a user who should get personalization (e.g., an internal user if the flag targeting is by user key). Verify that the greeting or personalized content appears and that the network tab shows the get-personalization-data function being called only once. Also, toggling the feature flag off (via LaunchDarkly’s UI or an override) should stop further calls – possibly even cause the PersonalizationContext to reset to null on the next re-render.
Test switching between profile sub-tabs (Profile info ↔ Wallet) to ensure no errors and contexts operate independently as expected.
If possible, trigger a change to payment_methods in the database while the wallet is open (for example, add a payment method in the app or via a script) and confirm the realtime subscription causes refreshPaymentMethods() to run and update the UI. This will confirm our mock didn’t break the real integration and that our useEffect in WalletContext still works in production. (In tests we can’t easily simulate Postgres events, but in dev we can at least ensure the subscription stays active and doesn’t duplicate.)
Performance and Observability: Monitor the console and network:
In test logs, confirm that we see “🚫 Personalization disabled for testing” once, and maybe “⚠️ Skipping personalization fetch in test mode” (if we kept that log) – and no “🎯 Supabase function called: get-personalization-data” repeated messages. This indicates the loop is truly gone.
In application logs (if any analytics are collected for personalization events), ensure we don’t see an abnormal number of events. Previously, trackPersonalizationEvent would have fired an 'exposure' event repeatedly. After the fix, it should fire at most once per relevant event (initial exposure, maybe conversion if triggered).
Check memory or CPU usage if possible: infinite loops can spike CPU. With it resolved, the profile page should be idle after load, which is important for good UX and not draining device battery (if this were a mobile web scenario).
CI Pipeline: The continuous integration should now consistently pass the tests. The target of “CI green < 10 min” should be easier to meet without a spinning loop. We can also consider adding a specific CI step that runs the profile page in a headless browser for a short time and monitors for excessive network calls or console errors, as a proactive check.
Prevention and Best Practices
To avoid similar issues in the future and maintain compliance with our system standards, consider the following guidelines:
Careful useEffect Dependencies: Always scrutinize dependencies in useEffect and other hooks. Avoid using values that change every render (such as non-memoized functions or objects) as dependencies, as this will cause the effect to run repeatedly
dev.to
dev.to
. If a function (like our fetchPersonalizationData) needs to be called on certain state changes, prefer to depend on the state (e.g., userId and a flag) rather than the function itself. Use useCallback to stabilize function identities when needed, and document any intentional deviations from the linter recommendations.
Memoization of Callbacks and Values: Use useCallback and useMemo liberally to preserve the identity of functions and complex objects between renders when their content doesn’t change. In contexts, provide primitive values or stable references whenever possible. For example, we memoized refreshPaymentMethods so that a re-render (due to, say, adding a payment method) doesn’t count as a “new function” that re-triggers subscriptions. Memoization prevents many accidental infinite loops and reduces re-render noise, improving performance.
Minimize Context Value Changes: Design context providers such that their value prop changes infrequently. Each change triggers all consumers to re-render
medium.com
. Therefore, don’t put unnecessary or volatile data in context. In our case, we removed experiment details that weren’t needed externally. If a context needs to expose a frequently changing value, consider splitting that into a separate context or using a state management solution that can target updates (e.g., Redux or Zustand) to avoid re-rendering everything.
Feature Flag Strategy in Tests: For any feature flagged functionality, build a mechanism to force it on or off in tests deterministically. Our introduction of window.DISABLE_PERSONALIZATION_FOR_TESTS and the test LaunchDarkly provider is a model for this. This ensures test environment isolation: tests will not unpredictably execute code paths based on feature flags unless explicitly intended. It also aligns with the rollback readiness principle – we can simulate a flag-off state easily. Extend this approach to new flags: e.g., if a new UI revamp flag is added, make sure tests either run with it on or off consistently, or account for both cases.
Comprehensive Mocks: When mocking third-party services like Supabase, ensure the mock covers the full API surface used by the app. A partial mock can lead to TypeErrors that are hard to trace (as we saw). In particular, watch out for chainable APIs or fluent interfaces – you must return an object that continues the chain. If unsure, consult the library docs or mimic the real implementation’s behavior. In our case, referencing Supabase’s documentation or community examples made it clear that .on() returns the channel itself. We also saw from Supabase docs that you should removeChannel when done
stackoverflow.com
, so we included that. Always test your mocks by writing a small snippet that uses them as the app does (for instance, we could write a quick test of our supabaseMock: expect(() => supabaseMock.channel('x').on('event', {}, () => {}).subscribe()).not.toThrow()).
Fail Fast on Infinite Loops: It’s wise to detect infinite loop scenarios early. We leveraged a counter in the personalization mock to notice an abnormal number of calls. In the future, we can embed similar safeguards: for example, if an effect calls an API, you might increment a counter on window or in a context, and if it exceeds some threshold in a short time, log a warning or even throw in test mode. This way, instead of timing out after 30 seconds of heavy activity, a test can fail fast with a clearer error. For React, there’s no built-in infinite render protection (other than a lagging UI and eventual out-of-memory), so developer vigilance is key.
Use of Error Boundaries: We have a SmartErrorBoundary wrapping the app in TestApp. Ensure that it’s configured not to swallow errors silently in tests. In this situation, it likely caught the WalletContext error and prevented a crash, but that made the test fail only by missing content, not by an obvious error. For test environments, it might be useful to have the error boundary rethrow errors or at least log them explicitly to the console so tests can pick them up. This can make debugging easier when something does go wrong.
Observability in Production: Maintain logs and metrics for personalization and critical flows. For example, keep an eye on how many times the personalization edge function is called per user session. Our fix reduces it drastically (initial page load only), so if a regression causes it to spike, that should be an alert. Similarly, monitor real-time connections count; our removal of redundant subscriptions helps ensure we don’t leak connections. Supabase automatically cleans up inactive channels, but if our code ever failed to remove a channel, it could accumulate – having a metric or log for active channel count could catch that.
Documentation & Knowledge Sharing: Document these fixes and patterns for the team. Future developers should understand why we did not include certain deps in the effect, or why the mock is implemented in a particular way. A short comment referencing this analysis or the loop issue will prevent someone from “fixing” the dependency array and unintentionally reintroducing a loop.
By implementing the above changes, we expect the Profile + Wallet system to be stable and testable. The infinite loop will be resolved, eliminating the flood of edge function calls and ensuring that personalization can be toggled safely via flags. The Supabase mock will fully support real-time features, so our tests can cover those code paths without errors. Overall, these fixes uphold the project’s standards for performance (no needless load), security (no leaking connections or data), and observability (clear logs and flag controls), moving us closer to the Definition of Done criteria (e.g., all tests passing in CI).