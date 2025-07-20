# Comprehensive Plan for Resolving Integration Issues and Zod Performance Optimizations

## Zod Performance Optimizations Plan

### 🎯 **What "Production-Ready" Means**

#### **Production Environment**
- **Real users** accessing your application
- **Live data** being processed and stored
- **High availability** requirements (99.9%+ uptime)
- **Performance at scale** (hundreds/thousands of concurrent users)
- **Data integrity** and security critical
- **Zero tolerance** for breaking changes

#### **Production-Ready Criteria**
✅ **Thoroughly tested** (unit, integration, end-to-end)  
✅ **Performance validated** under load  
✅ **Error handling** for all edge cases  
✅ **Monitoring and logging** implemented  
✅ **Rollback plan** in place  
✅ **Security review** completed  
✅ **Documentation** for maintenance  
✅ **Backward compatibility** ensured  


---

### 🚀 **Deployment Strategy: Phased Rollout**

#### **Phase 1: Development & Testing (Week 1-2)**
##### **Integration Steps:**

1. **Code Integration**
   ```bash
   # Create feature branch
   git checkout -b feature/zod-performance-optimization
   
   # Integrate new validation system
   git add src/lib/validation/
   git commit -m "feat: add advanced Zod schema caching system"
   ```

2. **Update Existing Components**
   ```typescript
   // Replace existing validation with optimized version
   - import { generateZodSchema } from '@/lib/form-validation';
   + import { useCachedSchema } from '@/lib/validation/schema-cache';
   
   const MyForm = ({ config }) => {
   -  const schema = generateZodSchema(config);
   +  const schema = useCachedSchema(config);
     
     return <Form schema={schema} />;
   };
   ```

3. **Testing Checklist**
   - [ ] Unit tests pass for all validation functions
   - [ ] Integration tests with React Hook Form
   - [ ] Performance tests with 100+ field forms
   - [ ] Memory leak tests for long-running sessions
   - [ ] Cross-browser compatibility testing

#### **Phase 2: Staging Deployment (Week 3)**
##### **Pre-Production Environment**

1. **Deploy to Staging**
   ```bash
   # Deploy to staging environment
   npm run build:staging
   npm run deploy:staging
   ```

2. **Staging Tests**
   - Load testing with realistic data volumes
   - User acceptance testing (UAT)
   - Performance monitoring setup
   - Error tracking validation

3. **Metrics to Monitor**
   ```typescript
   // Performance metrics to track
   const productionMetrics = {
     schemaGenerationTime: 'avg < 5ms per field',
     cacheHitRate: 'target > 80%',
     memoryUsage: 'stable over 24h',
     formRenderTime: 'avg < 100ms',
     validationLatency: 'p95 < 50ms'
   };
   ```

#### **Phase 3: Production Rollout (Week 4)**
##### **Gradual Production Deployment**

1. **Feature Flag Rollout**
   ```typescript
   // Use feature flags for controlled rollout
   const useOptimizedValidation = useFeatureFlag('zod-performance-v2');
   
   const schema = useOptimizedValidation 
     ? useCachedSchema(config)
     : generateZodSchema(config); // fallback
   ```

2. **Rollout Schedule**
   - **5% of users** (Day 1-2) - Monitor for issues
   - **25% of users** (Day 3-4) - Validate performance gains
   - **50% of users** (Day 5-6) - Confirm stability
   - **100% of users** (Day 7+) - Full rollout

---

## Playwright Testing Infrastructure Improvements

Based on comprehensive analysis of Playwright documentation (v1.53.2), the following critical updates have been implemented:

### ✅ **Completed Playwright Updates**

#### **1. Modern Configuration Enhancements**
- **Enhanced `playwright.config.ts`** with modern features:
  - Test step timeouts and enhanced tracing
  - Path templates for screenshots/snapshots
  - Mobile device testing projects (Pixel 5, iPhone 12)
  - Accessibility-specific test configuration
  - Health checks and graceful shutdown for web servers
  - Git information capture for CI reports
  - Blob reporter for trace storage in CI

#### **2. Global Setup & Teardown**
- **`tests/global-setup.ts`**: Browser installation validation, environment checks, service connectivity tests
- **`tests/global-teardown.ts`**: Authentication state cleanup and resource management
- Automatic directory creation and CI cleanup

#### **3. Test Pattern Modernization**
- **Replaced deprecated patterns**:
  - `waitForTimeout` → `waitForRequest`/`waitForResponse` with specific conditions
  - Generic text selectors → semantic `getByRole`, `getByTestId` locators
  - Added proper `test.step()` organization for better error tracing

#### **4. Accessibility Testing (WCAG 2.2 AA)**
- **New `accessibility.a11y.spec.ts`** implementing:
  - WCAG 2.2 specific tests (Focus indicators 2.4.11, Target sizes 2.5.5)
  - New criteria: Dragging movements (2.5.7), Redundant entry (3.3.7), Accessible auth (3.3.8)
  - Touch target validation for mobile (44x44px minimum)
  - Keyboard navigation and screen reader compatibility
  - Color contrast and reduced motion preference testing

#### **5. Visual Regression Improvements**
- **Modern screenshot testing** with:
  - Element masking instead of hiding for consistent visuals
  - Clip regions and animation disabling
  - Test step organization for better debugging
  - Mobile/desktop viewport testing

#### **6. Enhanced CLI Scripts**
New npm scripts added:
```json
"test:e2e-debug": "playwright test --debug",
"test:e2e-trace": "playwright test --trace on",
"test:a11y": "playwright test tests/e2e/accessibility.a11y.spec.ts",
"test:e2e-mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
"test:e2e-changed": "playwright test --only-changed",
"test:visual-update": "playwright test tests/e2e/visual/ --update-snapshots"
```

### 🔧 **Key Technical Improvements**

#### **Network Handling**
- Replaced arbitrary timeouts with specific request/response waiters
- Enhanced request interception with proper route handling
- Added offline/online state testing capabilities

#### **Error Handling & Debugging**
- Test steps provide granular failure points
- Enhanced trace collection and attachment system
- Better error messages with context preservation

#### **Performance & Reliability**
- Headless mode optimization for CI (new Chrome headless)
- Reduced motion preferences for consistent testing
- Proper focus management and accessibility compliance
- Element masking for consistent visual comparisons

### 🚨 **Deprecated Features Removed**
- `noWaitAfter` option usage eliminated
- Old-style `text=` selectors replaced with semantic alternatives
- Fixed use of deprecated element selection methods

### 📈 **CI/CD Integration Ready**
- Global setup validates environment and connectivity
- Health checks ensure web server readiness
- Graceful shutdown procedures implemented
- Git information capture for deployment tracking
- Blob reporting for trace storage and analysis

### 🎯 **Next Steps for Production Deployment**
1. **Environment Variables**: Ensure all test environment variables are configured in CI
2. **Browser Installation**: CI pipeline includes `npx playwright install`
3. **Parallel Execution**: Configure appropriate worker counts for CI environment
4. **Report Storage**: Set up blob storage for trace files and reports
5. **Accessibility Gates**: Integrate a11y tests into PR/merge requirements

This modernized Playwright setup ensures:
- ✅ WCAG 2.2 AA compliance testing
- ✅ Modern browser compatibility (Chrome, Firefox, Safari + mobile)
- ✅ Visual regression prevention
- ✅ Performance optimization
- ✅ CI/CD pipeline readiness
- ✅ Developer experience improvements

---

## Project Context
**Application**: GitHub Link-Up Buddy - A flight booking and travel personalization platform
**Current Status**: ~75% complete with LaunchDarkly integration issues and partial wallet system implementation
**Architecture**: React 18 + TypeScript frontend, Supabase Edge Functions backend, Stripe payments, LaunchDarkly feature flags
**Tech Stack**: Vite, shadcn/ui, Tailwind CSS, Supabase, Stripe, LaunchDarkly, Amadeus API

## Current State Analysis
### LaunchDarkly Integration Issues
- **Client ID Configuration**: Currently configured with `VITE_LD_CLIENT_ID=686f3ab8ed094f0948726002`
- **Missing Server SDK**: `LAUNCHDARKLY_SDK_KEY` is referenced in plan but not configured in `.env.local`
- **Service Implementation**: Existing `LaunchDarklyService` class handles client-side SDK initialization but lacks robust error handling
- **Feature Flags in Use**: `personalization_greeting`, `show_opt_out_banner`, `profile_ui_revamp`, `wallet_ui`

### Wallet System Status
- **Database Schema**: Complete with `payment_methods` table, KMS encryption, RLS policies
- **Edge Functions**: Implemented for payment method CRUD operations
- **UI Components**: 75% complete with `PaymentMethodList`, `AddCardModal`, `WalletTab` components
- **Feature Flag**: `wallet_ui` configured at 0% rollout, gated behind `profile_ui_revamp` (5% rollout)

### Profile System Status
- **Enhanced Profile**: Behind `profile_ui_revamp` feature flag (5% rollout)
- **Completeness Scoring**: Backend logic implemented but UI needs enhancement
- **Multi-traveler Support**: Database schema supports it but UI not implemented

## Introduction
This document outlines a step-by-step approach to resolving the current challenges in integrating LaunchDarkly and Amadeus with your application. The objective is to ensure a seamless integration that is reliable, maintainable, and scales efficiently as the application grows.

## Phase 1: AWS Integration and Deployment Enhancements

### 6. AWS Integration and Deployment Enhancements

This section adds AWS-specific best practices and setup based on detailed study of AWS KMS, SDK, and tools documentation, focused on your current app architecture and production readiness criteria.

#### 6.1 AWS KMS

- **Key Management Usage**: Use AWS KMS to securely manage encryption keys for sensitive data like wallet payment methods or profile information.
- **API Integration**: Utilize AWS KMS SDK calls (encrypt, decrypt, generate data keys) via the AWS SDK for JavaScript in Node.js backend and Edge Functions.
- **Security Best Practices**: Ensure KMS key policies use least privilege access, condition keys (e.g., kms:EncryptionContext) to tightly control usage.
- **Region and Endpoint Configuration**: Configure SDK clients with region-specific KMS endpoints and, where applicable, use VPC endpoints for private connectivity.
- **Error Handling and Retries**: Implement retry logic on failed KMS calls, respecting eventual consistency (delays in state propagation).
- **Decryption and Data Key Usage**: For performance and security, use enveloped encryption where data keys are generated, encrypted with KMS keys, and used locally for encrypt/decrypt of data.
- **Advanced Features**: Consider multi-Region keys if your app requires geographic redundancy or failover.
- **Developer Tools**: Use IAM conditions (e.g., kms:EncryptionContextKeys) in policies to enforce proper encryption context is applied for operations.

#### 6.2 AWS SDK for JavaScript (Node.js & Browser)

- **Credential Management**: Configure the SDK to use IAM Identity Center authentication during development and production as recommended.
- **Environment Configuration**: Use shared config and credentials files or environment variables to supply AWS region, credentials, and other SDK settings.
- **Client Initialization**: Instantiate AWS service clients (S3, KMS, Cognito) explicitly setting region and credentials providers appropriate for the runtime environment.
- **Error Handling**: Use promises, async/await with try/catch; add retry and backoff strategies for robustness.
- **Browser Usage**: Bundle SDK modules efficiently with tools like webpack; implement CORS-safe requests; access AWS services with Cognito Identity Pools for authentication.
- **React Native**: Use '@aws-sdk/client-*' packages with React Native; configure Cognito identity pools properly.

#### 6.3 AWS IAM and Authentication

- **IAM Identity Center**: Adopt IAM Identity Center as the primary method for developer and deployer authentication to AWS services.
- **Role Assumption**: Use AssumeRole delegation for cross-account or elevated privileges, configured via shared config or environment variables.
- **Credentials Refresh**: Handle token expiration and refresh automatically using built-in SDK features.
- **Least Privilege**: Follow AWS IAM best practices by limiting key policies, roles, and permissions strictly to necessary actions and resources.

#### 6.4 AWS CLI and Tooling

- Limited doc coverage; however:
- Use AWS CLI for IAM Identity Center login (`aws sso login`), configuration, and deployment scripting.
- Automate environment setup with CLI scripts and leverage AWS CLI profiles in CI/CD pipelines.
- Use CLI to verify connectivity to KMS and other AWS services.

#### 6.5 Gaps to Address Separately

The following critical AWS services are not covered in the provided documentation and should be integrated into your plan using official AWS resources or separate investigations:

- **AWS Secrets Manager**: For secret rotation, injection into containers, and secure secret retrieval at runtime.
- **Amazon ECS/Fargate**: For container orchestration, deployment configuration, health checks, autoscaling.
- **AWS CloudFormation/CDK**: For IaC-based infrastructure deployment and versioning.
- **Amazon RDS/Aurora**: For managing your relational database backend, connection pooling, backups.
- **AWS ALB**: For SSL termination, CORS handling, routing.
- **Amazon CloudWatch**: For metrics, logging, alerting, dashboarding integration.

### Summary

This update enriches the integration and deployment plan with detailed, actionable instructions and best practices around your immediate AWS integration components: KMS encryption, SDK usage, IAM, and CLI tooling. You should source additional docs for the missing AWS services to further complete your plan.

If you want, I can assist in drafting specific code snippets, IAM policies, or CI/CD pipeline steps based on this analysis.

## Phase 2: LaunchDarkly Integration

### Objective
The primary goal is to ensure both the client-side and server-side LaunchDarkly SDKs are correctly integrated, configured, and functioning as expected.

### Step 1: Environment Configuration
**Why?** Environment variables are crucial for configuring API client keys securely, to avoid hardcoding sensitive information directly into the application code.

**Current Configuration Status:**
- ✅ `VITE_LD_CLIENT_ID=686f3ab8ed094f0948726002` is configured
- ❌ `LAUNCHDARKLY_SDK_KEY` is missing (needed for server-side operations)
- ❌ `LAUNCHDARKLY_API_TOKEN` is missing (needed for programmatic flag management)

**Action Required:**
1. Add missing environment variables to `.env.local`:

```plaintext
# Existing (verified working)
VITE_LD_CLIENT_ID=686f3ab8ed094f0948726002

# Missing - Add these from LaunchDarkly dashboard
LAUNCHDARKLY_SDK_KEY=sdk-<your-server-side-key>
LAUNCHDARKLY_API_TOKEN=api-<your-api-token>
```

**Key Distinction:**
- `VITE_LD_CLIENT_ID`: Client-side ID (safe to expose in frontend, prefixed with VITE_)
- `LAUNCHDARKLY_SDK_KEY`: Server-side SDK key (private, used in Edge Functions)
- `LAUNCHDARKLY_API_TOKEN`: API token (private, used for programmatic flag management)

**Decision Explanation:**
Environment variables allow safe storage and usage of sensitive information like API keys, which should never be hardcoded. The client-side ID is intentionally different from server-side keys and is safe to expose in the frontend bundle.

**🤔 Questions to Consider:**
- Do we actually need server-side LaunchDarkly operations, or is client-side sufficient for our use case?
- Are we planning to programmatically manage feature flags, or will manual dashboard management suffice?
- Should we implement fallback behavior when LaunchDarkly is unreachable?

### Step 2: Verification Script

**Why?** To quickly verify that the LaunchDarkly setup is correct and that all required components can connect and function correctly.

**Current LaunchDarkly Service Analysis:**
The existing `LaunchDarklyService` class has several limitations:
- Error handling is basic (console.error only)
- No retry logic for network failures
- No graceful degradation when LaunchDarkly is unreachable
- Hard-coded user context for system checks

**Enhanced Verification Script:**
1. Create `scripts/verify-launchdarkly.ts`:

```typescript
#!/usr/bin/env tsx
import { initialize } from 'launchdarkly-js-client-sdk'; 

// Test all known feature flags from the application
const KNOWN_FLAGS = [
  'personalization_greeting',
  'show_opt_out_banner', 
  'profile_ui_revamp',
  'wallet_ui'
];

async function main() {
  try {
    const clientId = process.env.VITE_LD_CLIENT_ID;
    if (!clientId) throw new Error("VITE_LD_CLIENT_ID is missing");

    console.log('🔍 Testing LaunchDarkly integration...');
    console.log(`Client ID: ${clientId}`);

    // Initialize with a test user context
    const client = initialize(clientId, { 
      key: 'verification-test-user',
      email: 'test@example.com',
      kind: 'user'
    });

    await client.waitForInitialization();
    console.log("✅ Client SDK initialized successfully");

    // Test each known flag
    console.log('\n🚩 Testing feature flags:');
    for (const flagKey of KNOWN_FLAGS) {
      const flagValue = client.variation(flagKey, false);
      console.log(`  ${flagKey}: ${flagValue}`);
    }

    // Test flag change listeners
    console.log('\n🔄 Testing flag change listeners...');
    client.on('change:profile_ui_revamp', (value) => {
      console.log(`Flag change detected: profile_ui_revamp = ${value}`);
    });

    client.close();
    console.log('\n✅ LaunchDarkly verification completed successfully');
    
  } catch (error) {
    console.error(`❌ LaunchDarkly verification failed: ${error.message}`);
    console.error('💡 Common issues:');
    console.error('  - Check if VITE_LD_CLIENT_ID is correct');
    console.error('  - Verify network connectivity to LaunchDarkly');
    console.error('  - Ensure client ID has proper permissions');
    process.exit(1);
  }
}

main();
```

**Usage:**
```bash
# Run verification script
npx tsx scripts/verify-launchdarkly.ts

# Or add to package.json scripts
npm run verify:launchdarkly
```

**Decision Explanation:**
Creating a comprehensive verification script allows for systematic testing of all LaunchDarkly integration points. This script tests actual feature flags used in the application, provides detailed error messages, and helps identify configuration issues early in development.

**🤔 Questions to Consider:**
- Should we implement retry logic in the LaunchDarkly service for network failures?
- Do we need offline mode support with local flag fallbacks?
- Should we add monitoring/alerting for LaunchDarkly connection issues in production?

## Phase 2: Address Network and API Issues

### Objective
Resolve communication issues between the application and external services due to CORS and network configuration.

### Current Network Architecture
**Frontend**: React app served via Vite dev server (http://localhost:5173)
**Backend**: Supabase Edge Functions (https://your-project.supabase.co/functions/v1/)
**External APIs**: LaunchDarkly, Amadeus, Stripe, Twilio, Resend

### Step 1: Resolve CORS and Network Errors

**Why?** Misconfigured CORS headers can prevent the browser from making requests to your backend that result in blocked functionality.

**Current CORS Issues Analysis:**
- Supabase Edge Functions have built-in CORS handling but may need custom headers
- LaunchDarkly client-side SDK should not have CORS issues (uses streaming)
- Amadeus API calls likely go through Edge Functions (server-side)
- Stripe Elements handled client-side with proper domain configuration

**Specific CORS Configuration:**
1. For Supabase Edge Functions, ensure headers include:

```typescript
// In Edge Function responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Example Edge Function structure
export default async function handler(req: Request) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Your function logic here...
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
```

2. For local development, ensure Vite is configured properly in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-project.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/functions/v1')
      }
    }
  }
});
```

**Decision Explanation:**
Proper CORS configuration permits the frontend to communicate securely with the backend without restrictions, vital for functionality that relies on cross-origin requests. The specific headers listed are required for Supabase authentication and custom user identification.

**🤔 Questions to Consider:**
- Are we experiencing specific CORS errors in browser dev tools?
- Should we restrict CORS origins in production for security?
- Do we need to handle preflight OPTIONS requests in all Edge Functions?

### Step 2: Local Flag Overrides for Development

**Why?** When developing, it can be useful to have direct control over feature flags without needing full LaunchDarkly connectivity.

**Current Feature Flag Usage:**
- `profile_ui_revamp`: 5% rollout (enhanced profile UI)
- `wallet_ui`: 0% rollout (wallet management UI)
- `personalization_greeting`: Status unknown
- `show_opt_out_banner`: Status unknown

**Local Override Implementation:**
1. Create a development utility for flag overrides:

```typescript
// utils/devFlags.ts
export const setDevFlags = () => {
  if (process.env.NODE_ENV === 'development') {
    // Override specific flags for development
    localStorage.setItem('LD_FLAG__profile_ui_revamp', 'true');
    localStorage.setItem('LD_FLAG__wallet_ui', 'true');
    localStorage.setItem('LD_FLAG__personalization_greeting', 'true');
    
    console.log('🚩 Development flags set:', {
      profile_ui_revamp: true,
      wallet_ui: true,
      personalization_greeting: true
    });
  }
};

// Clear dev flags
export const clearDevFlags = () => {
  const flagKeys = [
    'LD_FLAG__profile_ui_revamp',
    'LD_FLAG__wallet_ui',
    'LD_FLAG__personalization_greeting'
  ];
  
  flagKeys.forEach(key => localStorage.removeItem(key));
  console.log('🧹 Development flags cleared');
};
```

2. Add to your LaunchDarkly service to check localStorage first:

```typescript
// In LaunchDarklyService.ts
getVariation<T>(flagKey: string, defaultValue: T): T {
  // Check for local override first (development only)
  if (process.env.NODE_ENV === 'development') {
    const localOverride = localStorage.getItem(`LD_FLAG__${flagKey}`);
    if (localOverride !== null) {
      console.log(`🔧 Using local override for ${flagKey}: ${localOverride}`);
      return localOverride === 'true' ? true : localOverride as T;
    }
  }
  
  // Fall back to LaunchDarkly
  if (!this.client || !this.isInitialized) {
    return defaultValue;
  }
  
  return this.client.variation(flagKey, defaultValue);
}
```

**Usage:**
```bash
# In browser console during development
import { setDevFlags } from './utils/devFlags';
setDevFlags(); // Enable all flags for testing

# Or add to package.json scripts
"scripts": {
  "dev:with-flags": "npm run dev && node -e \"console.log('Set localStorage flags manually')\""
}
```

**Decision Explanation:**
This approach allows development and testing to proceed independently of API connectivity and provides a quick debugging method. The localStorage overrides only work in development mode, ensuring they don't affect production behavior.

**🤔 Questions to Consider:**
- Should we create a debug panel in the UI for toggling feature flags during development?
- How do we ensure local overrides don't accidentally get committed or affect production?
- Should we implement a fallback mechanism when LaunchDarkly is completely unreachable?

## Phase 3: Complete Profile and Wallet System (75% Complete)

### Objective
Finalize the remaining components of the profile and wallet systems to reach production readiness.

### Step 1: Complete UI and Functional Components

- Finish implementing missing UI components such as completeness widgets and identity verifications.
- Ensure that all business logic is correctly implemented.

**Decision Explanation:**
Completing the UI and logic ensures the end-user gets full application functionality, improving user satisfaction.

### Step 2: Enhance Monitoring and Observability

- Implement Grafana dashboards for better visibility into system operations.

**Decision Explanation:**
Insight into system performance through real-time monitoring is key to maintaining reliable service and quick issue resolution.

### Step 3: QA and Staged Rollouts

- Conduct thorough QA testing to validate functionality.
- Use feature flags for controlled rollouts to progressively introduce new features.

**Decision Explanation:**
Staged rollouts and rigorous QA testing help catch potential issues early and ensure a smooth user experience.

## Conclusion
By following these phased steps, focused primarily on system robustness and expanded functionality, your application will be better equipped to handle real-world usage scenarios reliably. By solving network issues, ensuring proper integration, and completing critical system components, the groundwork is laid for a successful deployment and an adaptable future development process.



Production-Grade Integration & Deployment Improvement Plan
Introduction & Context
Application Overview: We are improving a React 18 + TypeScript single-page application (SPA) using Vite and Tailwind CSS (with shadcn/ui components). The backend relies on Supabase (Edge Functions with Row-Level Security), Stripe payments, and LaunchDarkly for feature flags. The app is deployed via Docker containers, and uses Supabase Auth for authentication. Testing is done with Vitest (unit tests) and Playwright (end-to-end tests). Current Challenges: Several integration issues and incomplete features are impeding a robust production release. Key problems include:
LaunchDarkly Integration: Missing server-side keys, no graceful fallback when the feature-flag service fails, and static user context that doesn’t update on login/logout events.
Wallet System: A new Wallet UI is feature-flagged behind a Profile Revamp flag (both on partial rollout), but the wallet’s state management is too localized and Supabase Edge Function calls sometimes fail without retries.
Profile System: The backend supports multiple traveler profiles and computes a profile completeness score, but the current UI exposes only one profile and lacks any completeness indicator.
CI/CD Pipeline & Tests: The continuous integration/deployment pipeline is minimal – lacking automated tests in CI, proper build/deploy steps, and integration testing for external services. The Docker build may not be injecting environment variables correctly, and health checks/CORS need attention.
Production Readiness: We need stronger security for secrets (e.g., using KMS), performance monitoring (SLO: 95th percentile latency <200ms, 99.9% uptime), a staged rollout plan for new features, and adherence to WCAG 2.2 AA accessibility and responsive design.
This plan addresses each of these areas with concrete improvements, configuration snippets, and best practices backed by industry references. The goal is to integrate all systems reliably, harden error handling, improve state management, and establish a deployment pipeline that safely rolls out changes without regressing the user experience.
1. LaunchDarkly Integration Enhancements
LaunchDarkly feature flags should be integrated in a fault-tolerant way, both on the client (React app) and optionally on the server (Supabase Edge Functions), with secure key management and dynamic user contexts.
1.1 Secure Configuration of LaunchDarkly Keys
Issue: The app currently only sets the LaunchDarkly client-side ID (VITE_LD_CLIENT_ID) for the front-end, but is missing the server-side SDK key and API access token for LaunchDarkly. This prevents any server-side flag evaluation or admin API usage. Moreover, using only the client ID means all flag evaluations happen in the browser, and there’s no backup if we wanted to evaluate flags in edge functions. Plan: Add the missing keys as environment variables and ensure they’re kept secret. In LaunchDarkly’s model, the client-side ID is safe to expose (intended for front-end SDK initialization), whereas the SDK key is secret and must never be embedded in client-side code
launchdarkly.com
. We will:
Store Keys in Env Variables: Update the environment config (e.g., .env.local or CI secrets) to include:
plaintext
Copy
VITE_LD_CLIENT_ID=<client-side-id>        # already configured
LAUNCHDARKLY_SDK_KEY=<server-side-sdk-key>
LAUNCHDARKLY_API_TOKEN=<api-access-token>
This ensures the front-end uses only the public client ID, and any server-side code (like in Supabase Edge Functions) can use LAUNCHDARKLY_SDK_KEY for secure connections to LaunchDarkly. Never expose the SDK key in front-end code
launchdarkly.com
. The API token is only needed if programmatic flag management is required (e.g., to use LaunchDarkly’s REST API for creating or toggling flags from scripts).
Usage of Server-Side SDK (if needed): Determine if server-side flag evaluation is required. If yes, use LaunchDarkly’s Node SDK in Supabase Edge Functions with LAUNCHDARKLY_SDK_KEY. This could allow evaluating flags securely for scenarios like gating an edge function’s logic. If not needed, we may skip server-side usage and rely purely on the client-side SDK. (It’s generally fine for a frontend-focused app to use only the client SDK, as long as we handle client-side failure modes gracefully.)
Justification: Proper separation of keys prevents sensitive data from leaking. LaunchDarkly documentation emphasizes not to embed server SDK keys in web apps
launchdarkly.com
. Keeping these in environment config (and using deployment-time injection for production) aligns with security best practices.
1.2 Graceful Fallback and Error Handling for Flags
Issue: The current LaunchDarklyService in the app lacks robust error handling – if LaunchDarkly is unreachable (e.g., network issues or service outage), the app might just log an error and not provide any feature flag values, potentially leaving parts of the UI in an inconsistent state. There’s no retry logic or offline support. In production, we cannot let a LaunchDarkly outage or connectivity blip break core features. Plan: Implement graceful degradation so that if the feature flag service fails, the app continues with sensible defaults:
Use Fallback Values: Every call to get a flag should provide a default value that the app can use if the real value is unavailable. (The LaunchDarkly JS SDK’s .variation(flagKey, defaultValue) method already returns the default if it can’t get a flag from the service.) Ensure our code consistently uses defaults. According to LaunchDarkly’s support guidance, if the SDK fails to connect, it will serve the fallback value on variation calls
support.launchdarkly.com
. In other words, the worst case when LaunchDarkly is down is that we get the default “off” value for a flag, which means a new feature might appear disabled – far better than an app crash
bennadel.com
. We should verify that all flag usages in the code provide meaningful defaults so that the user experience remains functional (features just stay off until flags can be fetched).
Auto-Retry and Timeout: The LaunchDarkly client SDK automatically attempts to reconnect if initially offline
support.launchdarkly.com
. We will leave this to the SDK but also implement a timeout for initialization – e.g., if flags aren’t fetched within, say, 2 seconds on app startup, proceed rendering the app with all flags at their default. This prevents the UI from hanging. We can later update the UI when flags do arrive (LaunchDarkly SDK emits a ready or change event).
Offline Mode for Dev/Test: Enable LaunchDarkly’s offline mode or caching features in non-production environments. LaunchDarkly client SDKs can be configured with an offline mode where they use cached or default flag values and do not attempt network calls
launchdarkly.com
. For example, in unit tests or storybook, we might initialize the client in offline mode with predetermined flag values. This ensures tests aren’t flaky due to external calls, and developers can work without internet if needed. In our code, we could detect a special env (like NODE_ENV=test) and initialize the LD client with a bootstrap of flags from local storage or JSON. According to LaunchDarkly, using a bootstrap (e.g., from localStorage) can let the app start instantly with saved flag values and avoid flicker
support.launchdarkly.com
. We will use localStorage (or a JSON file in tests) to bootstrap flags in dev/test.
Verification Script: Create a Node script to sanity-check LaunchDarkly connectivity and flag availability (especially useful right after configuring keys). For example, a script scripts/verifyLaunchDarkly.ts can initialize the LD client with a test user and log the values of all important flags, as well as exercise the change listeners. This can be run during development or in CI to ensure the keys and network access are correct. (This was partially drafted in internal docs – it connects with a dummy user and prints out personalization_greeting, show_opt_out_banner, profile_ui_revamp, wallet_ui flag values, etc.) Running npx tsx scripts/verifyLaunchDarkly.ts in a dev environment will quickly surface any misconfiguration (e.g., wrong client ID or no network). This script isn’t needed in production, but is a safety net for developers.
Justification: These measures align with best practices for resilient feature flags. LaunchDarkly’s own guidance notes that if the SDK can’t reach the service, it will use last-known or default flag values
launchdarkly.com
, which limits the blast radius of an outage to “feature off” rather than a broken app. Veteran engineers note that an offline LaunchDarkly effectively just means features revert to default state – not ideal but far less damaging than a total outage
bennadel.com
. By proactively coding for this scenario (defaults and caching), we ensure no critical functionality is solely dependent on a live flag fetch.
1.3 Dynamic User Context Updates on Auth Changes
Issue: Currently, LaunchDarkly is likely initialized with a single user context (perhaps an anonymous user or a snapshot of the user at page load). When a user logs in or out, or their profile changes, the LaunchDarkly client doesn’t get updated with the new user identity. This means feature flag targeting (which often uses user attributes or keys) could be incorrect – e.g., a user logs in but still gets flags intended for a logged-out user context. Plan: Utilize LaunchDarkly’s identify() (or similar) functionality to update the context at runtime. The LaunchDarkly JavaScript SDK provides a method to change the user (context) on the fly without reloading the page. After a user successfully logs in (or out), we will call the SDK’s client.identify(newUserContext). This triggers the SDK to fetch flag values for the new context immediately
launchdarkly.com
. For example:
typescript
Copy
// When user logs in:
const newLDContext = { key: user.id, email: user.email, name: user.name };
ldClient.identify(newLDContext).then(() => {
  console.log("LaunchDarkly flags updated for new user");
});
Likewise, on logout, we might switch to an “anonymous” or system context. The key point is that the flags should always reflect the current user’s context. If a user’s role or plan level is used in flag targeting, this ensures they see the correct variant. The identify() call returns a promise we can await to know when flags are updated
launchdarkly.com
, or we can rely on change events (the SDK emits change events for any flag that changes value when the context switches). Additionally, if using the newer LaunchDarkly multi-context (for example, distinguishing device vs user), ensure initialization includes all relevant context kinds (perhaps not needed here, but good to know LD supports multi-context scenarios
launchdarkly.com
launchdarkly.com
). In our case, focusing on the user is sufficient. Justification: This approach follows LaunchDarkly’s recommendations for SPAs where users can sign in/out without full page reload. The docs explicitly state that calling identify will load flag values for the new user and update immediately
launchdarkly.com
. Without this, feature flags might be stuck in a state that doesn’t match the actual user, leading to potential mis-targeting. Implementing dynamic context updates ensures feature gating (e.g., showing beta features to only some users) works correctly after login transitions.
1.4 Development and Testing Utilities for Flags
Issue: When running the app locally or writing tests, relying on the real LaunchDarkly service can be cumbersome (or unnecessary). We may want to override flags manually to simulate various scenarios (e.g. force a feature on). Currently, there’s no mechanism for that – developers have to manipulate LaunchDarkly remotely or change code. Plan: Introduce a development-only flag override system and improve how we test LaunchDarkly:
Local Flag Overrides: In development mode, allow developers to force certain flags on/off. A simple technique is using localStorage to store flag values that the app will check first. For example, we can create a utility that sets items like LD_FLAG__wallet_ui=true in localStorage. Then modify the LaunchDarklyService.getVariation method to first look for such an override in development:
typescript
Copy
// Only in development, check localStorage for an override
if (import.meta.env.DEV) {
  const overrideVal = localStorage.getItem(`LD_FLAG__${flagKey}`);
  if (overrideVal !== null) {
    console.log(`🔧 Dev override: ${flagKey} = ${overrideVal}`);
    return overrideVal === 'true' ? true : overrideVal;
  }
}
// Otherwise, call LaunchDarkly SDK
return ldClient.variation(flagKey, defaultValue);
We will provide helper functions setDevFlags() and clearDevFlags() that developers can call in the console or as part of a dev script to populate these overrides (setting all feature flags to true, for instance, to see all features). This way, even if LaunchDarkly is off or a flag is supposed to be off in production, a developer can locally see the feature for testing UI integration. These overrides will never run in production (guarded by import.meta.env.DEV or NODE_ENV !== 'production'). They also won’t persist unless the dev sets them each session.
Integration Testing with Flags: For automated tests (Playwright), we have a couple of options:
Use the same localStorage override mechanism – the tests (which run in a browser context) can set LD_FLAG__... items before loading the app, forcing the app to render with certain features on. This avoids needing the test environment to call out to LaunchDarkly at all.
Alternatively, run LaunchDarkly in offline mode with pre-loaded flag values for tests. LaunchDarkly’s JS SDK can accept an initial flags state (via a bootstrap object). In a Node test environment (Vitest), we could mock the LD client to return specific values. However, given that our feature flags primarily affect UI, using the actual application code with localStorage overrides in Playwright might be simplest – we’re basically toggling the UI as needed.
Monitoring Flag Changes: In addition to error handling, ensure we log flag change events (the LD SDK allows listening for change:flagKey events). For critical feature flags like profile_ui_revamp or wallet_ui, we can log when they flip during a session. This can aid debugging if, say, LaunchDarkly updates a rollout in real-time.
Justification: Providing dev overrides speeds up debugging and testing. It decouples our local workflow from the remote LaunchDarkly environment, which is important if working offline or writing deterministic tests. The approach of using localStorage for dev flags is straightforward and confined to non-production use, so it won’t impact real users. Many teams implement a “debug panel” or similar for QA to toggle flags – our approach could be a simple version of that. It ensures that feature development and QA isn’t blocked by feature-flag config changes (which might be under someone else’s control). Lastly, all these LaunchDarkly improvements (secure keys, fallbacks, dynamic context, and dev/test support) will make our feature flag integration production-grade – secure, reliable, and developer-friendly.
2. Wallet System Integration Improvements
The wallet feature is partially implemented (backend tables and some UI components exist), but it’s hidden behind feature flags and suffers from state management and connectivity issues. We need to finalize its integration so it can be rolled out confidently.
2.1 Feature Flag Strategy for Wallet UI
Issue: The wallet_ui feature flag is gated behind another flag profile_ui_revamp and currently set to 0% rollout (off for all users except maybe internal testers). This cascading flag dependency can be confusing and risky – if profile_ui_revamp is off for a user, the wallet won’t show even if wallet_ui is on. Such interdependent flags require careful management to avoid inconsistent states. Plan: Simplify and de-risk the feature flag setup for Wallet:
Decouple Flags or Use a Master Flag: Consider making wallet_ui a standalone flag that does not depend on profile_ui_revamp, or treat profile_ui_revamp as a master switch that controls multiple sub-features. LaunchDarkly best practices suggest that if multiple parts of a feature must work together, you should use a “master” flag to enable the overall feature while still having fine-grained flags for subcomponents
launchdarkly.com
launchdarkly.com
. In our case, the Profile Revamp is a broader feature and Wallet is a subset of it (the wallet UI might be part of the new profile experience). We have two options:
Option A: Combine into one flag – since Wallet likely won’t be used without the new profile UI, we could roll them out together using just profile_ui_revamp. This simplifies logic (one flag to check). However, if the wallet is not as stable as the rest of profile revamp, this is less flexible.
Option B: Keep separate but coordinate – Continue using both flags but enforce in code that Wallet UI only renders if profile_ui_revamp is true. This might already be how it’s implemented. Additionally, coordinate the rollout percentages: e.g., do not ramp up wallet_ui beyond the percentage of profile_ui_revamp. Initially, profile_ui_revamp is 5% and wallet_ui 0%. As we increase profile_ui_revamp to say 25%, we might then start enabling wallet_ui to 5%. Essentially, wallet should always be a subset of the profile revamp audience until we fully launch both. This could be managed via LaunchDarkly targeting rules (e.g., a rule that says if profile_ui_revamp is false for user, then wallet_ui = false), or just via application logic checking both flags.
Implement Consistent Checks: In the React app, ensure any place that uses wallet_ui feature also checks profile_ui_revamp (if we keep them separate). For example, the navigation tab for “Wallet” should appear only if profile_ui_revamp && wallet_ui are true for the user. It’s safer to have an explicit combined condition in the UI than to assume LaunchDarkly’s rollout rules implicitly handle it. This double-check ensures no user sees the wallet without the new profile, preventing weird UX (e.g., old profile page but new wallet section – which might not even be possible depending on routing).
Justification: Aligning with feature flag best practices avoids confusion and unexpected exposures. LaunchDarkly’s guidance on flag design indicates that for multiple coordinated rollouts, a main flag plus dependent flags is a valid pattern
launchdarkly.com
. They recommend using a master flag as a kill switch – in our scenario profile_ui_revamp can serve as that master kill switch for all profile-related changes, including wallet. The key is to implement it cleanly so that it’s easy to turn off all related features at once if needed, and to understand which flags to remove later (once features are fully launched, we’ll retire both flags from the code).
2.2 Global Wallet State Management
Issue: The wallet context/state is currently only instantiated within the Wallet page/tab. This means if the user navigates away, the wallet data (e.g., loaded payment methods, balance info) might be lost or not readily available to other parts of the app. However, we anticipate that other components (like a top navbar or account overview) might need to display some wallet info (e.g., current balance or a notification badge if payment method is expiring). Scoping the state to only the wallet section causes duplicate loading of data and fails to make wallet info accessible app-wide. Plan: Refactor wallet state to use a global React context provider (or equivalent state management) so it persists across the app and is accessible wherever needed. Concretely:
Create WalletContext: Implement a React Context (e.g., WalletProvider) at a high level in the app (likely wrapping the entire app or at least all routes that might need wallet data). This provider will manage the wallet state (list of payment methods, selected method, balance, etc.) and expose functions to modify it (add card, remove card, etc.). On the initial load (probably when the user opens the wallet section or on login), it can fetch the necessary data via Supabase functions and store it in context state.
Provide at App Level: Wrap the application (in App.tsx or similar) with <WalletProvider> so that whether the user is on the wallet page or elsewhere, the provider stays mounted and retains state. This avoids re-fetching data each time. Components can use useContext(WalletContext) to get data or perform actions.
Update Wallet Page Components: The Wallet-specific components (like <PaymentMethodList> or <AddCardModal>) should be refactored to consume the context instead of managing their own internal state. For example, PaymentMethodList can use const { paymentMethods, refreshMethods } = useWallet() (a custom hook from context) rather than having its own useState for the list. This ensures one source of truth.
Access from Other Components: If, say, we want a small wallet balance indicator on the profile page or a “Wallet” link in the navigation that is disabled/enabled based on something, those components can also tap into the WalletContext. This wouldn’t have been possible earlier when state was local to the Wallet page.
Justification: Global or shared state is warranted here because the wallet is conceptually part of the user’s profile/account, and its data may be needed in multiple places. React’s documentation suggests that when state needs to be shared between components not in a direct parent-child line, lifting it up to a common ancestor or using Context is the solution
react.dev
stackoverflow.com
. In fact, “if something is global, it should probably be placed in context and accessed anywhere”
stackoverflow.com
. By leveraging context, we avoid prop-drilling and ensure consistency. This change will make the app architecture cleaner and prepare it for when the wallet feature is fully rolled out (likely then it will be a core part of the user’s account settings visible from multiple screens). From a performance standpoint, we should be mindful that context updates re-render consumers. We can mitigate unnecessary re-renders by splitting context (maybe separate context for “wallet data” vs “wallet UI state” if needed) or using memoization. But unless the wallet data is huge or frequently changing, this should not be a major issue.
2.3 Robustness of Supabase Edge Function Calls
Issue: The wallet operations (e.g., adding a payment method) rely on Supabase Edge Functions. It’s noted that connectivity to these is unreliable – perhaps requests sometimes time out or fail due to network issues or CORS. If a user tries to add a card and the function call fails, the app needs to handle that gracefully (and maybe retry). Currently, error handling might be minimal (just logging to console). Plan: Improve the reliability and error handling of these API calls:
CORS Configuration: First, ensure that any CORS issues are resolved, as they could be a cause of “unreliability”. Supabase Edge Functions by default allow requests from any origin with the correct headers, but we will double-check. In our Edge Function code, include appropriate CORS headers, for example:
ts
Copy
// At the top of each Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // or specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-id',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders }); // handle preflight
}

// ... actual logic ...

return new Response(JSON.stringify(resultData), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
This ensures the browser can call the function from our domain without being blocked. In production, it might be wiser to set 'Access-Control-Allow-Origin': 'https://your-app-domain.com' instead of * for security. We’ll implement that when deploying.
Retry Logic: Implement a simple retry mechanism on the client for critical operations. For instance, if fetching the payment methods fails (network error), automatically try again once or twice after a short delay. We can use an exponential backoff approach:
ts
Copy
async function callWithRetry(fn, retries = 2) {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, 1000)); // wait 1s (could increase next time)
      return callWithRetry(fn, retries - 1);
    } else {
      throw err;
    }
  }
}

// Usage:
const data = await callWithRetry(() => supabase.functions.invoke('get_payment_methods'));
Not every operation needs retry (e.g., creating a payment might double-charge if actually succeeded but network failed on response – so careful with idempotency). But for GETs or idempotent actions, it helps user experience. Stripe-related functions (like charging wallet or adding card) should use idempotency keys on the backend to be safe for retries.
Graceful UI on Failures: If even after retries an operation fails, inform the user with a clear error message (e.g., “Unable to fetch your wallet details. Please check your connection or try again.”). Do not leave the UI blank or stuck. Perhaps provide a manual “Retry” button on the UI as well if appropriate. Logging the error to our monitoring (console or an error service) is also useful for debugging.
Connectivity Monitoring: Use the browser’s network status API or WebSocket on Supabase to detect if the user has lost connection, and if so, maybe hold off on calling functions until back online (to avoid immediate failures). Supabase doesn’t automatically cache function results, but for something like payment methods (which change infrequently), we could cache them in memory (context state as discussed) to avoid unnecessary calls.
Justification: These steps will make the wallet feature more resilient. The CORS setup is critical – without it, no front-end calls succeed due to browser security. The provided CORS header configuration is aligned with what Supabase needs (allowing Supabase’s auth headers and our custom headers). Retrying is a common practice to handle transient network issues. We must ensure not to duplicate actions on retry (hence caution with non-idempotent calls), but reading data and even adding a payment method (with proper backend handling) can be retried safely. This improves reliability from the user’s perspective. By implementing proper error UI, we adhere to good UX – users get feedback and can take action, instead of silently failing operations. Overall, these measures will build trust in the wallet system as it rolls out.
2.4 Completing Wallet Feature Implementation
Issue: The UI components for wallet (PaymentMethodList, AddCardModal, etc.) were said to be ~75% complete. We need to finish any remaining pieces so that the wallet can be fully functional. This includes verifying integration with Stripe for adding payment methods or charging the wallet (if applicable). Also, ensure the wallet UI meets our UX standards. Plan: Complete the wallet feature end-to-end:
Finalize UI Components: Audit the wallet UI for any missing parts. For example, is there a way to delete a payment method? Is there a display of the wallet balance or transaction history (if the concept of storing funds is in scope)? Complete any stubbed or placeholder components. Ensure input validation is in place (for card forms, etc.) and that loading states or success/error states are handled (e.g., show a spinner while a card is being added, show a confirmation when done).
Integrate Stripe Elements: If not already, use Stripe Elements (or Stripe’s UI library) for secure card input within the AddCardModal. Ensure the Stripe public key is configured and the Stripe integration is tested with Stripe’s test cards. This ties into the testing aspect: we will use Stripe’s test mode for QA (discussed later in CI/CD section).
Testing Wallet Flows: Write Playwright tests that simulate a user adding a card (using a Stripe test card number), and verify that the new payment method appears in the list. Also test failing scenarios (Stripe declines, etc.) to see that errors propagate to UI. This double-checks our integration wiring.
Responsive Design: As noted under production readiness, make sure the wallet UI is responsive. For instance, on mobile, the PaymentMethodList might collapse or scroll nicely, and the AddCardModal should perhaps be a full-screen dialog instead of a small modal. We can use Tailwind responsive utilities to adjust styling for smaller screens. Test on various device sizes (Chrome DevTools device emulator).
Accessibility in Wallet UI: Ensure form fields have labels, the modal can be reached via keyboard (focus trapping within modal and ESC to close, etc.), and that announcements are made for errors (using aria-live regions for form submission results, for instance). This ties into the WCAG compliance we need.
Justification: We want to avoid launching a half-baked wallet feature. By thoroughly finishing and testing it under the feature flag, we can be confident when we enable it for real users. This proactive completion and testing in a feature branch or staging environment ensures that when wallet_ui flag flips to true for customers, they have a smooth experience. It’s easier to address any UX quirks or integration bugs now, before the stress of production issues. Additionally, having a fully implemented wallet feature behind a flag means we can do internal demos or beta tests to gather feedback without affecting all users.
3. Profile System Integration Improvements
The user profile area is another critical part that’s behind a feature flag (profile_ui_revamp). The backend supports multiple profiles (multi-traveler) and calculates profile completeness, but the frontend doesn’t expose these. We plan to enhance the profile UI to leverage these backend capabilities and provide a richer user experience.
3.1 Multi-Traveler Profile Support
Issue: The database and API support multiple traveler profiles per account (perhaps a user can manage profiles for family members or multiple passengers), but the current UI treats the profile as singular. This is both a feature gap and potentially confusing if the backend expects multiple profiles. Without UI support, all users are effectively stuck with one profile. Plan: Introduce a UI for managing multiple profiles:
Profile List/Selector: If a user can have more than one traveler profile, the UI should show a list or dropdown of profiles. For example, on the profile page, there could be a sidebar or menu for “Your Travelers” listing each profile’s name. The user could select one to view/edit details. This is similar to how travel sites let you save multiple traveler info (e.g., yourself and family).
Add/Edit Profile Flows: Provide a way to add a new profile (a form to input name, DOB, passport info, etc., depending on what a profile contains) and to edit or remove existing profiles. Ensure that when a new profile is added, it’s created via the appropriate API (likely a Supabase function or direct table insert if permissions allow). Use the feature flag gating: possibly this entire multi-profile UI is only visible when profile_ui_revamp is enabled, since it’s part of the revamp.
UI/UX Considerations: Make it clear which profile is “active” if that concept matters (for example, if the user is booking a flight, which traveler profile is being used? Perhaps the active one?). Provide cues in the UI – e.g., “Currently viewing: [Profile Name]”. If multi-profile is a power-user feature, consider that novice users might just use one profile; we should not over-complicate the interface for them. Maybe the list is hidden if only one profile exists, and shown once they add a second.
Data Model Alignment: Confirm how the backend expects multiple profiles – likely there’s a table linking user -> profiles. We should use Supabase queries or functions to fetch all profiles for the user at login and then allow switching. Because of RLS, ensure the logged-in user can only access their own profiles (the backend likely enforces that). The UI should reflect any such constraints (e.g., if certain fields or number of profiles are limited).
Justification: If a feature is supported by the backend but not exposed in the UI, it’s effectively wasted. Enabling multi-profile support can be a selling point (for example, a user can manage travel info for their spouse/kids under one account). It also future-proofs the app if the business expects use-cases like corporate accounts managing multiple travelers. Implementing it now under the feature flag means it will roll out as part of the profile revamp. This improvement simply bridges the gap between backend capability and frontend experience.
3.2 Profile Completeness Indicator
Issue: The backend computes a “completeness score” for a user’s profile (likely a percentage of how much of their profile info is filled out). But the frontend doesn’t display this at all. We’re missing an opportunity to prompt users to complete their profiles – which can drive engagement and also ensure we have necessary data (like emergency contact, etc.). Plan: Display a profile completeness meter and guide users to finish filling out information:
Progress Bar or Meter: On the profile page, add a visual indicator (e.g., a progress bar or a pie chart icon) showing the profile completion percentage. For example, “Profile 70% complete” with a bar. Use a clear label and perhaps an enticing message like “70% – Almost there! Add more details to complete your profile.” This encourages users to reach 100%. Research shows that visual progress indicators can motivate users to finish tasks by making remaining steps obvious
blog.logrocket.com
 (the progress bar sets expectations and reduces cognitive load by showing what’s left).
List Missing Fields: Optionally, list out what is missing. For instance, “To reach 100%, please add: [Passport Information], [Emergency Contact].” This ties into findability – users shouldn’t wonder how to improve the score. We can highlight incomplete sections with a small icon or different color.
Backend Integration: Fetch the completeness score from the backend. If it’s computed on the server, perhaps it’s returned as part of the profile object. If not, we could compute it in the client by checking filled fields, but using the backend’s logic is more consistent. We may need an API endpoint or extend the Supabase profile query to include a completeness_percentage.
Real-time Update: After a user adds info, recalc the score and update the UI. If the backend doesn’t give a new score on each update, we might replicate the logic client-side to recalc immediately, or simply refetch the profile from the server after a change. It might be simpler to do a full refetch on each save, which ensures we get any derived values updated.
Gamification/Rewards: Though not strictly necessary, some apps reward users for completing profiles (like giving a badge or some non-monetary credit). We can consider a small incentive text like “Complete your profile to get better recommendations!” or similar, depending on product goals. But at minimum, showing the percent and prompting completion should increase engagement.
Justification: A profile completeness meter has UX benefits – it provides feedback and motivation. As one UI pattern site suggests, even a simple “Your profile is 100% complete!” message or a percentage marker can drive users to fill in all fields
ui-patterns.com
. The progress approach is widely used (LinkedIn’s profile strength, for example). By implementing this, we improve the likelihood that users provide all needed data, which in turn can improve personalized features (the app can use profile data for better service). It’s also an easy win UI-wise and demonstrates attention to detail in the new profile UI. From an engineering perspective, it’s a straightforward addition that leverages existing logic, so it’s low risk but high reward in terms of user satisfaction. We will ensure it’s accessible: use an <progress> element or ARIA roles so screen readers can announce “Profile 70% complete” (important per WCAG guidelines on non-text content).
3.3 Finishing Profile Revamp Features
Issue: The profile revamp may include other enhancements (the prompt mentions “identity verifications” and such). We should ensure any partially done pieces are completed. Also, since profile_ui_revamp is at 5% rollout, presumably internal users are testing it. We must collect their feedback and fix any bugs before broader release. Plan: Do a thorough QA of the profile revamp and address remaining tasks:
Identity Verification UI: If the app requires verifying identity (maybe uploading passport scans or similar), implement that flow fully. This often involves file uploads or third-party verification services. Ensure the UI guides the user through it and handles success/failure. If this feature is behind yet another flag or conditional, coordinate it with the profile flag.
Consistency and Navigation: The revamped profile UI should integrate nicely with the rest of the app. Check that navigation links point correctly (e.g., if there’s a “Profile” link in a menu, it should load the correct revamp component when flag is on). Avoid broken links or missing routes.
Backward Compatibility: Consider users who might not have the revamp yet (e.g., 95% of users while rollout is 5%). The old profile UI and new one might differ significantly. We should maintain both until the rollout is complete. That means our codebase needs to handle both versions: likely via conditional rendering based on the flag. Keep an eye on not introducing regressions to the old UI while improving the new one. This might mean minimal changes to old UI (just keep it working), focusing improvements on new UI.
Performance: Profile page load should be performant, even after adding things like multiple profiles and completeness checks. Use lazy loading for any heavy components (like if loading verification components or large images). Given our SLO of P95 < 200ms for responses, ensure any data fetch for profile (like retrieving profiles or computing completeness) is optimized – maybe combine into one request rather than multiple sequential ones.
Justification: Completing all aspects of the profile system ensures we aren’t presenting users with half-implemented features during rollout. A thorough QA aligns with our staged rollout approach – we catch issues at the internal 5% stage rather than when it’s at 50%. The mention in our plan to “finalize remaining components of profile and wallet to reach production readiness” is essentially what we’re doing. By the time we ramp up the flags, the profile system will be robust and user-friendly, which is crucial as profiles contain personal data that users expect to be handled reliably.
4. CI/CD Pipeline and Testing Improvements
To confidently deploy updates, we need a comprehensive CI/CD pipeline that runs tests, builds the Docker image, and deploys it in an automated, repeatable way. Additionally, we must expand our testing coverage to include integration points (LaunchDarkly, Stripe, Supabase) so that issues are caught early.
4.1 Continuous Integration (CI) Setup
Issue: CI/CD is not fully implemented – possibly only basic build or no pipeline at all. We need at least test -> build -> deploy stages. Without CI, there’s risk of human error in deployment and untested code reaching production. Plan: Use a CI service (like GitHub Actions, GitLab CI, CircleCI, etc.) to automate our workflow on each push/merge:
Install & Cache Dependencies: The pipeline should first install Node dependencies (using npm ci for a clean install) and possibly cache them for faster builds. Using Node 18.x (as our app is React 18 + Vite, Node 18 is fine).
Run Unit Tests (Vitest): Execute npm run test:unit (assuming Vitest covers unit tests) and ensure they pass. Fail the pipeline if any test fails. Vitest can generate JUnit or console output for CI reporting.
Run Integration/E2E Tests (Playwright): Next, run Playwright tests. This often requires setting up the application server or using a test build. We can either:
Spin up the app (for example, start a development server or serve a built version) and then run Playwright against it.
Or use Playwright Test’s ability to launch a static server. Since our frontend is a static build, we could do vite build first and then serve dist using a simple HTTP server in CI for testing. Alternatively, use Playwright’s CI tools or Docker for consistency
playwright.dev
. (Note: Playwright provides Docker images and CI config examples to run tests headlessly in GitHub Actions, which we can follow
playwright.dev
.)
Ensure environment variables for tests are set (e.g., use a Supabase test project and LaunchDarkly test flags if needed, so that tests don’t hit production data). We might use a .env.test file loaded in CI with test keys.
Build the Docker Image: If tests pass, run npm run build to produce the production-ready static files (or Node server build). Then build the Docker image using the Dockerfile. Use a multi-stage Dockerfile to keep the image slim:
dockerfile
Copy
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build  # produces dist/ with static files

# Stage 2: Production container
FROM nginx:1.21-alpine  # using nginx to serve static files
COPY --from=build /app/dist /usr/share/nginx/html
# (For a SPA, also copy an nginx config that handles routing if needed)
# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost/health || exit 1
If our app requires a Node server (for SSR or API proxy), we’d adjust the base image to something like node:18-alpine and start the server. But assuming it’s static, nginx is efficient. The HEALTHCHECK instruction above tells Docker (or orchestrator) how to check if the container is healthy – here we assume hitting /health returns a 200. We’ll implement a simple /health endpoint (could even be a static file) that returns “OK”. This way, in production, our orchestrator can detect if the app goes down and restart if needed.
Deploy Stage: After building, the CI can deploy the image. This depends on our infrastructure:
If we use a container registry + Kubernetes/ECS, the step would be: push the Docker image to registry, then update the deployment (e.g., kubectl set image or trigger a rolling update).
If using a simpler platform (like Docker Compose on a VM), the pipeline might SSH and pull the image then restart containers.
Another approach is using a service like Vercel or Netlify for frontend (they have their own build pipeline), but since we containerize, we’ll proceed with container deployment.
We will integrate any secrets at deploy time (not in the image). For example, our Kubernetes pod spec or Docker run command will provide the needed environment variables (Supabase URL, anon key, etc.). Never bake those into the image – this allows one image to be promoted from staging to prod by just changing env variables, which is a best practice
reddit.com
.
Justification: A solid CI pipeline ensures quality control – tests are consistently run and the build is repeatable. By separating test and build stages, we avoid deploying untested code. The steps outlined match common CI setups. Playwright has documentation on running in CI and even provides GitHub Action templates
playwright.dev
, making it feasible to integrate our end-to-end tests. Using Docker in CI is also standard; multi-stage builds keep the final image small and secure by not including dev tools. The inclusion of a health check in the Dockerfile will help our uptime (the container orchestration can automatically replace unhealthy instances). Finally, injecting env vars at runtime (with something like AWS’s ECS task IAM roles or Kubernetes secrets) is recommended for security
reddit.com
. We’ll follow that to handle secrets safely.
4.2 Integration Testing for External Services
Issue: We currently lack integration tests for LaunchDarkly flags, Stripe payments, and Supabase connectivity. These are crucial areas that unit tests might mock out, but we need to test them end-to-end to catch any misconfiguration (e.g., wrong API keys, or CORS issues). Plan: Add targeted integration tests or environment checks for each service:
LaunchDarkly Integration Test: We don’t want tests depending on LaunchDarkly’s cloud (could be slow/flaky), but we can simulate it. One approach is using the LaunchDarkly “offline mode” with a set of known flag values for testing. For example, we could configure the app in test mode to initialize LaunchDarkly with a flag dataset (maybe via the LDClient.bootstrapping option or by our local override method). Another approach is to use a dummy LD SDK implementation in tests. However, a simpler high-level test: use the aforementioned verification script as a CI step. We can run npm run verify:launchdarkly as part of CI which uses the real client ID (pointing likely to a test LD environment) to ensure flags can be fetched. If this script fails (non-zero exit), we fail the pipeline, indicating something’s wrong (like invalid LD credentials or network issues). This gives us immediate feedback on LaunchDarkly config before deploying.
Stripe Testing: Leverage Stripe Test Mode and stripe’s testing tools. We will use Stripe test API keys (different from prod keys) in our testing environment. In Playwright, we can simulate adding a card by inputting a known test card number (e.g., 4242 4242 4242 4242 which Stripe documents as a success card). Stripe’s test mode accepts these without actually charging money
docs.stripe.com
. We should verify that our webhooks or supabase functions handle Stripe events properly. Possibly write a test that triggers a Stripe webhook event (Stripe allows sending test events from dashboard or using their CLI in test mode). For example, if we have a webhook for successful payment, we could simulate that and see if our system updates something (though this might be out-of-scope for front-end e2e; it’s more backend integration test). Another technique is using stripe-mock, an official tool that runs a local server to mock Stripe API responses for testing
softwareengineering.stackexchange.com
. This could be integrated in CI to run in the background while tests execute, allowing offline testing of Stripe interactions. However, for our level, using real Stripe test environment is fine as long as tests remain in test mode (so no real charges occur
docs.stripe.com
).
Supabase Connectivity Test: We want to ensure our app can talk to Supabase services (database and functions) with correct CORS and auth. In CI, we could run a Supabase emulator (Supabase offers a Docker image that emulates their Postgres and functions locally). Alternatively, point the app to a testing Supabase project (with separate database) using test credentials. A simple integration test scenario: call a Supabase function endpoint from a test context and assert on the response. For instance, using a Node fetch to hit the /functions/v1/yourFunction endpoint with an anon key and see if we get a 200. If our CORS headers are wrong, this might fail in a browser context – we should catch that in a dev environment. Perhaps during development, open the app in a browser and check network requests for CORS errors (this is more of a QA step than automated test). We should also include some integration tests around the auth flow – e.g., sign-up or sign-in via Supabase Auth (using email/password or OAuth if used). This can be tricky to automate, but Supabase provides ways to work with its auth in Node (like using service key to create users). At minimum, ensure that the login page and profile data fetch work in an end-to-end test scenario (we might stub authentication or use a pre-created dummy account in the test DB to log in via UI).
Test Data Management: For integration tests, especially hitting a real (or emulated) DB, manage test data. Possibly run tests against an isolated database that can be reset. If using the Supabase emulator, we can reset it each run. If hitting a remote test instance, ensure our tests create and later delete any entities (profiles, etc.) they make, or use a dedicated test user account.
Justification: These integration tests give confidence in our complex external integrations. By using Stripe’s test mode, we leverage the fact that Stripe allows full end-to-end tests of payments without real money
docs.stripe.com
. Many companies do this to verify payment flows. LaunchDarkly’s fallback testing (via offline mode or a quick live check) helps ensure feature flags won’t mysteriously all be off due to a config mistake – essentially it’s a sanity check as part of deployment. Supabase integration testing ensures that our app, when deployed, can actually retrieve and update data. It’s easy for an environment variable mispointing to break connectivity; testing connectivity in CI catches things like wrong URLs or missing RLS policies causing failures. In summary, covering these in tests moves us towards continuous quality. When combined with the feature flags, we can even run tests conditionally with flags on/off to make sure both old and new features work (for example, run the profile tests with profile_ui_revamp off and then with it on, to verify both versions function during the rollout period). This thorough approach is appropriate for production readiness.
4.3 Docker Build & Deployment Considerations
Issue: Our Docker build process must properly inject env variables, include health checks, and handle CORS (as partially discussed). There is a risk that environment variables (like API keys or URLs) are not correctly passed into the container, which can break connectivity at runtime. Also, without a health check, we might not know if the container starts correctly until users report an issue. Plan: Harden the Docker build and run configuration:
Build-time vs Run-time Env: Vite builds will bake in any variables that are prefixed with VITE_. For example, VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY likely need to be provided at build time so that the frontend knows how to call Supabase. This means our CI/build stage should have those env vars. We will supply non-production values in CI (pointing to our test Supabase) for testing, and then in production build, use prod values. If we want one image for all envs, an alternative is to have the app fetch config from a <script> tag or external source at startup. But given our current setup, simplest is building separate images per environment or re-building with appropriate .env.
Secure Secrets: Secrets like LAUNCHDARKLY_SDK_KEY or STRIPE_SECRET_KEY should not end up in the client bundle. They should only be used server-side (edge functions or backend). We must verify that none of these are accidentally exposed via Vite’s define. (Usually, only VITE_* get exposed; no secret keys should be prefixed with VITE in our env). The Dockerfile should not COPY .env or anything into the image. Instead, rely on environment injection at runtime as discussed. For example, if using Kubernetes, we’d have a ConfigMap/Secret that populates env in the container for any needed runtime config (though in a static site, there’s little runtime aside from environment used by nginx, which might not need much).
Health Check Endpoint: As noted, implement a small endpoint or file for health checks. If using an nginx to serve static files, we can simply create a file health.json in dist with content like {"status": "ok"} and have the orchestrator hit http://container/health.json. If we had a Node server, we’d implement an express route /health. The health check ensures the container started and is serving content (and could catch issues like a crash in a Node server, etc.).
CORS in Production: Double-check CORS in production environment: our Supabase Edge Functions likely need the 'Access-Control-Allow-Origin': 'https://prod-domain.com'. We don’t want * in production for security (to prevent malicious sites from calling our API). So, configure an environment variable or use Supabase settings to allow the specific origin. We could pass an env var ALLOWED_ORIGIN to functions and use it in the response headers instead of *. This way if our frontend domain changes, we update config easily.
Environment Variable Injection: When deploying the container, ensure the necessary env vars are provided. For example, the container (especially if it has any server-side rendering or runtime code) might need NODE_ENV=production, SUPABASE_URL, SUPABASE_ANON_KEY, LAUNCHDARKLY_CLIENT_ID (for client code to init LD). In our nginx static scenario, the frontend is already built with those values, so at runtime it doesn’t need env. But if we had any, we could use a startup script to inject them. Given our approach, we will build separate images for each env (or reconfigure via rebuilds). This is acceptable for now.
Docker Security: Use a minimal base image (alpine variants) to reduce attack surface. Ensure we’re not running as root in the container (nginx alpine by default runs as nginx user; if using Node, we can use USER node). Also, do not include dev secrets in the image – which we’ve covered by not copying any secret files. As an extra step, we can add a Dockerfile line to clear any build cache that might have secrets (in multi-stage, secrets shouldn’t end in final image anyway).
Justification: These steps adhere to DevOps best practices. Using environment-specific configuration at deploy time is standard – for instance, with AWS ECS one uses IAM roles to fetch secrets and inject into containers
reddit.com
, or with Kubernetes, use Secrets and ConfigMaps. We avoid the anti-pattern of storing secrets in the container or code repo. The Reddit DevOps thread confirms that injecting via env and using the orchestrator’s secret store is a common approach
reddit.com
. Health checks and CORS config ensure reliability and security (no dangling issues that would cause downtime or data leaks). All in all, our deployment process will be more robust and secure after these improvements.
5. Production Readiness and Rollout Strategy
With integrations refined and tested, we focus on hardening for production. This includes securing secrets, monitoring performance, defining a gradual rollout plan for new features, and ensuring top-notch accessibility and UX polish.
5.1 Security Hardening (Secrets & Data Protection)
Secure Secret Management: We will integrate a Key Management Service (KMS) or secrets vault to handle sensitive keys. For example, if running in AWS, we can use AWS KMS to encrypt secrets and store them (or AWS Secrets Manager/Parameter Store). The deployment pipeline or container orchestrator will decrypt and inject them as environment variables available to the app. This way, secrets (Stripe secret keys, LaunchDarkly SDK key, Supabase service key if any, etc.) are never stored in plaintext in code or config files – only in secure vaults and memory. This approach is identity-based: the container (or its IAM role) has permission to access the secret
reddit.com
, and no one else. For instance, an AWS ECS task can be given permission to retrieve certain secrets, and those secrets get injected into the container at launch. Many platforms support similar mechanisms (Docker Swarm has secrets, Kubernetes has secrets, etc.). Using these ensures that even if someone gets access to the running container or image, they cannot trivially find the secrets (they’d have to extract from env at runtime, which is harder and can be mitigated by not logging env, etc.). Additionally, after retrieving secrets, we can programmatically use KMS to decrypt if needed in our code (for edge functions, maybe the KMS encryption of sensitive data like payment info is already in place as noted by the presence of KMS in the stack). We’ll make sure any confidential data at rest (like stored wallet payment method details) are encrypted in the database (perhaps using Postgres’s encryption or storing only tokens rather than actual card numbers). API Key Handling: Review where API keys are used on the client side. Supabase anon key and LaunchDarkly client ID are meant to be public, so they are fine to include. But ensure that the Supabase service key (if any) is only used in edge functions, never in client. Stripe uses publishable key on frontend (public) and secret key on backend (we might use secret in edge function for webhooks or creating Checkout sessions). So segregate those properly. If any third-party keys (Amadeus API key) are used in front-end, reconsider if they should be proxied via our backend to avoid exposing them. RLS and Auth: Double-check that Row-Level Security (RLS) policies in Supabase are correctly configured so that users can only access their data. This is a last line of defense in case anything in the frontend could be exploited (like someone manipulating tokens). Also ensure JWTs from Supabase Auth are short-lived and that we handle refresh securely (Supabase client library usually does this). We can consider using Supabase’s new auth features like sending a JWT to edge functions to identify the user (sounds like we do via x-user-id header possibly, as hinted in CORS headers). Dependency and Vulnerability Scanning: As part of readiness, run a vulnerability scan on our dependencies and Docker image. For example, use npm audit or a tool like Snyk for known vuln in packages. Similarly, scan the Docker base image for security updates (there are GitHub Action workflows to do this). This helps catch any glaring security issues before release. Justification: Emphasizing secret management and data security is crucial for user trust and compliance. Using KMS-backed solutions is considered industry best practice (don’t hardcode or config secrets in repos). The approach to inject at deploy time is confirmed by DevOps pros
reddit.com
. It’s also important for achieving any security certifications or simply avoiding breaches.
5.2 Performance Monitoring and SLOs
We aim to meet a Service Level Objective (SLO) of p95 latency < 200ms and 99.9% uptime. To do this, we need monitoring in place to measure our performance and availability. Metrics Collection: We will set up metrics for key operations:
Frontend performance metrics: Time to interactive, API call durations, etc. We can use a monitoring service or even build custom metrics. For instance, instrument the Supabase function calls to record their response times and success rates. This data can be fed to a Prometheus instance or directly to Grafana Cloud if we use their agent. Since the user specifically mentioned Grafana, likely we have a Grafana + Prometheus stack available. We can use Grafana’s frontend profiling or synthetic monitoring for the web app as well (Grafana k6 or Synthetic checks can periodically hit our site and measure response)
grafana.com
.
Backend metrics: Supabase might not allow custom instrumentation easily (since it’s a managed service), but we can rely on their built-in statistics for database query performance. For our edge functions, we could add logging of execution time and export those logs to Grafana (using Loki or something). Alternatively, wrap the handler logic to catch slow responses.
Error Tracking: Besides metrics, ensure we have error logging. Possibly integrate a service like Sentry for the frontend to catch runtime errors, which can alert us if something goes wrong for many users (this is separate from Grafana but complementary).
Grafana Dashboards: Create dashboards to display:
Uptime: We can use a simple ping check from Grafana (synthetic monitoring) hitting our health endpoint every minute. Grafana can chart uptime percentage over time and alert if it dips below 99.9% for the month.
Latency: Chart the distribution of response times for key API endpoints or page loads. For example, track p50, p95, p99 latency. Our goal is p95 < 200ms, so we draw a threshold line at 200ms to see if we stay under it
grafana.com
. In practice, 200ms for a full page load is ambitious (likely this refers to API response times, not full page). We clarify that it’s likely for API calls or critical interactions. Grafana’s k6 docs give an example threshold of “95% of requests below 200ms”
grafana.com
 – very similar to our target. We can run load tests with k6 to verify this prior to release.
Alerts: Configure Grafana alerts for when p95 goes above 200ms for a sustained period, or if uptime falls below target, or if error rates spike. Alerts should notify the devops team via email/Slack.
Scalability: Though not explicitly asked, meeting 99.9% uptime might require eliminating single points of failure. Ensure we run at least two instances of the container behind a load balancer, so that if one instance goes down (during deploy or crash), the other continues serving (this achieves high availability). Similarly, rely on Supabase’s multi-AZ architecture for the DB (Supabase likely handles that). We’ll test that our app can handle at least moderate load (maybe simulate some concurrent users with k6 testing as part of performance tests). Justification: By quantifying performance and watching it, we can ensure we meet the SLOs. Grafana is an excellent choice for this, and even has an SLO plugin/feature for tracking objectives
drdroid.io
. For example, Grafana can compute what percentage of requests met the <200ms goal
grafana.com
. If initial measurements show we’re above 200ms, we’ll investigate and optimize (maybe caching, query optimization, CDN for static assets, etc.). Uptime 99.9% means < ~43 minutes of downtime per month. Using robust CI/CD (with health checks and gradual deployment) and redundant instances will help achieve this. Monitoring ensures we know immediately if downtime occurs so we can rectify it.
5.3 Feature Rollout Strategy with LaunchDarkly
We will employ a phased rollout for the Profile Revamp (and by extension Wallet) using LaunchDarkly, as described: internal → team → beta → 100%. This mitigates risk by limiting exposure if something goes wrong. Phase 0 – Internal Only: Initially, keep profile_ui_revamp and wallet_ui off for all except internal users. We can use LaunchDarkly user segments or targeting rules: e.g., “if user email ends with @ourcompany.com, enable profile_ui_revamp”. This way, only employees see the new profile (regardless of the percentage rollout, we explicitly include staff). This is effectively our dogfooding stage. Phase 1 – 5% Beta: Gradually enable the feature to a small % of real users. For instance, set profile_ui_revamp to 5% rollout (randomly assigned)
launchdarkly.com
, and similarly a small % for wallet_ui (or leave wallet at 0% until profile is higher). This is our beta test with a minimal subset of customers. We’ll closely monitor metrics and feedback during this phase. LaunchDarkly does the random sampling so the 5% distribution is unbiased. Phase 2 – 25% (Expanded Beta): If all goes well in phase 1 (no major errors in logs, performance is good, feedback is positive), increase profile_ui_revamp to 25%
launchdarkly.com
. At this point, a quarter of users get the new experience. We likely include some known friendly users or maybe premium users if that fits (though random is fine). Continue monitoring. Also at this stage, maybe start ramping wallet_ui to 10% (since profile revamp is more broadly on, we can begin enabling wallet for some of those users). Phase 3 – 50% and Beyond: Gradually roll out to 50%, then 75%, and finally 100% over a span of days or weeks, assuming metrics remain good. This “percentage-based deployment” strategy is exactly what LaunchDarkly is built for
launchdarkly.com
, and some companies even automate it with rules to auto-increase if error rates are low
launchdarkly.com
. We can do it manually while closely watching Grafana and error tracking. During these phases, if at any point we see a spike in errors or performance degradation (e.g., p95 latency shoots up for users with the new feature), we can use LaunchDarkly as a kill switch and immediately turn the flag off (set to false for everyone)
launchdarkly.com
. This instantly disables the new feature globally, returning everyone to the stable old experience. That ability is a key advantage of feature flags for release management
launchdarkly.com
. Combining Ring & Percentage: Our strategy is a hybrid of ring deployments (internal, then beta users by segment) and percentage rollouts for scaling up
launchdarkly.com
launchdarkly.com
. This ensures both targeting specific safe user groups and broad random sampling. LaunchDarkly supports both approaches and even combining them
launchdarkly.com
, which matches our plan to first deploy to internal (ring1), then maybe a group of VIPs (ring2) if we wanted, and simultaneously controlling the percentage gradually. Communication: We should inform internal users and possibly beta users about the new features so they expect changes and can provide feedback. For beta users, perhaps a one-time in-app message: “You’re seeing our new profile page! Let us know what you think.” This can generate useful feedback and also explain any differences in UI. Justification: A phased rollout drastically reduces deployment risk. If a severe bug made it past tests, only a small user subset is affected initially, and we can rollback by toggling a flag in seconds. This approach is recommended in feature management best practices
launchdarkly.com
launchdarkly.com
. By observing system behavior under increasing load (10% → 25% → 50%...) we ensure we don’t overload anything unexpectedly
launchdarkly.com
. For example, maybe the new profile page makes a heavier query – at 5% it’s fine, but at 50% we might notice DB CPU increase. We can catch that and optimize or increase resources. The rollout plan thus not only protects users but also allows us to validate scalability in production gradually
launchdarkly.com
.
5.4 Accessibility (WCAG 2.2 AA Compliance)
Accessibility is a non-negotiable aspect of production readiness. We will audit the entire app (especially the new profile & wallet UIs) against WCAG 2.2 AA standards and fix any issues:
Keyboard Navigation & Focus: Ensure every interactive element (links, buttons, inputs) is reachable via keyboard (tab order logical) and has a visible focus indicator. WCAG 2.2 puts new emphasis on focus appearance – the focus outline must be clearly visible and not obscured by other UI
wcag.com
. We might need to adjust our Tailwind styles or use :focus styles to meet contrast requirements for focus indicators. For example, add a Tailwind class like focus:outline-2 focus:outline-blue-500 to components or use shadcn’s focus ring utilities. Also avoid any focus being trapped or lost; modals should trap focus within them while open (so the user can’t tab to background content) and return focus to trigger when closed.
Color Contrast: Verify text vs background contrast ratios are at least 4.5:1 for normal text (3:1 for large text) to satisfy WCAG AA. Tailwind’s default styles usually are okay, but if our design uses any lighter grays on white, we might need to darken them. We can use browser extensions or testing tools to flag low-contrast elements.
Form Elements & Labels: All form inputs should have associated <label>s or aria-labels. For example, the Add Card form fields need labels or at least placeholder + aria-label if no visible label (visible labels are preferable). Also ensure error messages are announced (using role="alert" or similar on error message containers).
New WCAG 2.2 Criteria: WCAG 2.2 includes some new points like:
Dragging Movements (2.5.7): If our app has any drag-and-drop (probably not, unless maybe reordering payment methods?), we should provide an alternative (like an up/down arrow control to reorder, since dragging can be hard for some users)
wcag.com
.
Redundant Entry (3.3.7): Avoid forcing users to re-enter data we already have (for example, if a user’s billing address is same as mailing, have a checkbox to copy it rather than requiring retyping)
wcag.com
. In our context, maybe profile forms can pre-fill or at least not ask the same info twice.
Accessible Authentication (3.3.8): If we have any CAPTCHA or tricky login, provide alternatives
wcag.com
. Supabase Auth typically handles this, but just ensure any 2FA or such is accessible.
Focus Not Obscured (2.4.11): Make sure when an element is focused it isn’t hidden by a popover or off screen. This can happen if modals aren’t handled properly.
Testing: Use tools like Axe or Lighthouse Accessibility audit to scan our app. Also perform manual keyboard-only navigation tests and try using a screen reader (NVDA or VoiceOver) on key flows (login, profile update, payment add) to see if everything is announced meaningfully.
Responsive Design (UX): While not directly an accessibility requirement, a responsive design ensures users on mobile or zoomed-in screens can use the app (which overlaps with accessibility for low-vision users who zoom). We will test the wallet and profile UI on small screens, making adjustments (e.g., use flex or grid that wraps, avoid fixed widths that overflow, etc.). Tailwind makes this easier with classes like md:w-1/2 etc. Ensure no horizontal scroll or cut-off text on mobile.
Justification: Compliance with WCAG 2.2 AA not only avoids legal risks but broadens our user base and improves overall UX (often improvements like clear focus indicators benefit everyone)
wcag.com
. Given WCAG 2.2’s recent enhancements (like stricter focus requirements)
wcag.com
wcag.com
, implementing them keeps us ahead of the curve and demonstrates a commitment to inclusivity. Moreover, many accessibility practices (like semantic HTML, proper labels) also enhance SEO and general quality of the app. By addressing these now, we ensure a smooth experience for users with disabilities from day one of launch, rather than retrofitting fixes later.
Conclusion
By executing this comprehensive improvement plan, we will elevate the application to a production-grade level of quality, reliability, and maintainability. Key integrations (LaunchDarkly, Stripe, Supabase) will be robust and secure, guarded by better error handling and thorough testing. State management refinements (global context for wallet, multi-profile support) will ensure consistency across the app. Our CI/CD pipeline will enforce code quality and enable safe, repeatable deployments via Docker. We’ve embedded best practices for feature flag gating and gradual rollouts, meaning new features can be deployed with minimal risk and quickly turned off if needed
launchdarkly.com
launchdarkly.com
. Monitoring through Grafana will give us visibility into performance (aiming for p95 <200ms and 99.9% uptime) and allow us to react to issues before they impact many users. Finally, an emphasis on security and accessibility ensures that we respect user data and provide an inclusive, user-friendly experience. From secure secret handling
reddit.com
 to WCAG-compliant UI, these are the hallmarks of a mature application ready for real-world use. By following this plan step by step, we will prevent disruption to existing users during the transition and set the stage for a successful, scalable launch of the revamped profile and wallet features – and any future enhancements to come.