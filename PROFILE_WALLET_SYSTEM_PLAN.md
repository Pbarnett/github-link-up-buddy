# Profile and Wallet System Plan

## Overview
This document outlines the plan for implementing the Profile and Wallet system.

---

*Please paste your plan below this line*

# Parker Flight – Development Playbook (v1.0, AI-First)

> **Purpose**  
> Provide a 10-day, AI-orchestrated roadmap for shipping the upgraded Profile + Wallet system with strong security, compliance, observability, and human-in-the-loop (HITL) gates.

---

## 0 · Key Facts
| Item | Detail |
|------|--------|
| **Owner** | Lead Engineer (single developer) |
| **Designer support** | ~1 day total (Day 8) |
| **Target go-live** | **12 working days** after Day 0 kickoff |
| **Stack** | Supabase Edge Functions, React 18 + shadcn/ui, Vitest 3.2.4, Stripe, Twilio, Resend |
| **SLOs** | p95 API < 200 ms 🔸 Error rate < 0.1 % 🔸 99.9 % uptime |
| **Definition of Done** | ✅ CI green <10 min ✅ WCAG 2.2 AA audit pass ✅ 90% critical-path test coverage ✅ Rollback drill |

---

## Guiding Principles
1. **Zero-data-loss & security**: KMS + `pgcrypto` for PII; strict RLS on every table.  
2. **Lazy Stripe customer creation**: Create customer only on first PM add (PCI SAQ A).  
3. **Feature-flag canary pattern**: Deterministic 𝑓(userId) % 100 < rollout%.  
4. **AI governance**: All agent jobs logged to `ai_activity`; scoped, expiring creds; HITL approvals for destructive ops.

---

## High-Level Schedule (12 days)

| Day | Theme | Outcomes | HITL ✅ |
|-----|-------|---------|---------|
| **0-1** | **Hardening & Monitoring** | · Sentry DSN wired (≈ 2h) · /health endpoint + Prometheus scrape (≈ 3h) · Trigger perf baseline (≈ 1h) | Approve monitoring setup #pf-launch-approvals |
| **2-3** | **Secrets & Notifications** | · Twilio phone # added (≈ 1h) · Resend DNS (SPF, DKIM, DMARC) verified (≈ 4h) · Notification E2E test passes (≈ 3h) | Confirm secrets docs #pf-launch-approvals |
| **4-5** | **Feature Flags (Canary)** | · `feature_flags.rollout_percentage` column + deterministic bucket fn (≈ 3h) · 5% canary harness ready (≈ 5h) | Verify canary % #pf-launch-approvals |
| **6-7** | **Payments & Back-fills** | · Stripe lazy customer flow passes tests (≈ 6h) · `2025-07-migration.sql` + profile completeness back-fill (≈ 2h) | Schema migration OK #pf-launch-approvals |
| **8-9** | **UI Revamp & QA** | · Profile UI behind flag (≈ 4h) · Responsive & a11y fixes (≈ 2h) · Designer review & polish (≈ 8h) | Designer sign-off #pf-launch-approvals |
| **10-11** | **Observability & Rollback** | · Grafana dashboard + synthetic probes (≈ 4h) · Rollback rehearsal (blue/green) (≈ 4h) | Alert fires as expected #pf-launch-approvals |
| **12** | **Docs + Bug-bash** | · Run-books in `/docs/runbooks/...` (≈ 2h) · Test-fix sprint, sign-off, release tag (≈ 6h) | PITR drill pass #pf-launch-approvals |

*(Days 12-13 are post-launch hardening but within sprint window.)*

---

## 3 · Success Criteria Checklist

✅ **CI green <10 min** - All tests pass within 10 minutes  
✅ **90% critical-path test coverage** - Core business logic thoroughly tested  
✅ **PITR drill pass** - Point-in-time recovery successfully executed  
✅ **WCAG 2.2 AA audit pass** - Accessibility standards met  
✅ **p95 < 200 ms** - 95th percentile API response time under 200ms  
✅ **Secrets-rotation cron** - Automated quarterly rotation in place  

---

## Schema & Migrations

```sql
-- traveler_profiles (excerpt)
ALTER TABLE traveler_profiles
  ADD COLUMN profile_completeness_score INT DEFAULT 0,
  ADD COLUMN verification_level TEXT DEFAULT 'basic';

-- payment_methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  encrypted_card_data BYTEA NOT NULL,
  brand TEXT,
  last4 TEXT,
  exp_month SMALLINT,
  exp_year SMALLINT,
  is_default BOOLEAN DEFAULT FALSE,
  encryption_version SMALLINT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own PMs"
  ON payment_methods FOR ALL
  USING (auth.uid() = user_id);

-- feature_flags rollout
ALTER TABLE feature_flags ADD COLUMN rollout_percentage INT DEFAULT 100;
Key Code Snippets
ts
Copy
Edit
// utils/featureFlag.ts
export const isEnabled = (flag, userId: string) => {
  const pct = flag.rollout_percentage ?? 100;
  return pct === 100 || (hash(userId) % 100) < pct;
};
ts
Copy
Edit
// Supabase Edge Fn: manage-payment-methods
const { data, error } = await stripe.paymentMethods.attach(pmId, {
  customer: stripeCustomerId,
});
await sql`
  INSERT INTO payment_methods
  (user_id, stripe_customer_id, stripe_payment_method_id, encrypted_card_data, brand, last4)
  VALUES (${uid}, ${stripeCustomerId}, ${pmId}, ${enc(card)}, ${brand}, ${last4});
`;
await sql`INSERT INTO traveler_data_audit (...) VALUES (...)`;
Testing & CI
Unit: isEnabled() distribution, idempotent key double-charge guard.

Integration: Duffel booking failure → Stripe refund via webhook.

E2E: Canary vs control renders, card add flow, consent checkbox required.

Coverage targets: ≥ 85 % services, ≥ 90 % business logic.

CI runs Vitest + Playwright + axe-core, < 10 min pipeline.

Monitoring & Rollback
Item	Tool / Cmd
Metrics	Prometheus scrape /health + custom /metrics; p95 latency alert 200 ms
Logs	Sentry for Edge Fns & React, Supabase logs for DB errors
Rollback	supabase db remote commit -m revert_<tag> or PITR restore snapshot
Cost guards	SMS ≤ 10 / hr (non-prod), Stripe test fees ≤ $50 / day

Compliance & Security
PCI SAQ A: Stripe Elements + tokenization, no card data stored.

PSD2/SCA: Consent checkbox (campaigns.consent_at), SCA fallback flow.

GDPR: /scripts/delete_account.ts – detaches PMs, deletes Stripe customer.

AWS KMS: Key policy limited to kms:Encrypt/Decrypt on parker-kms-key.

Secrets rotation: Quarterly cron, run-book Day 2.

Definition of Done (excerpt)
✅ All Warp agent actions logged in ai_activity.

✅ HITL approvals recorded (schema migration, flag > 25 %, Stripe live switch).

✅ p95 latency & error-rate SLO monitored, alerts verified.

✅ PITR rollback drill executed & documented.

✅ WCAG 2.2 AA audit (axe-core + manual).

✅ 90 %+ critical-path test coverage.

Last updated: 2025-07-08 by Warp AI & Lead Engineer.

yaml
Copy
Edit

---

### Next steps  
If you’re resuming with **Day 3**, start with the “DB migration – add `rollout_percentage`” bullet. Need code, SQL, or CLI examples? Just let me know!






## Suggested Improvements

1. **File Structure & Repository Map**
   - Explicit migration file naming conventions (e.g., `supabase/migrations/20250709_my_migration.sql`)
   - Edge function directory structure (`supabase/functions/<fn-name>`)
   - Test file organization under `tests/`
   - Documentation locations in `docs/runbooks/`

2. **Detailed Code Examples**
   - Complete function signatures with proper imports
   - Full Edge Function wrappers (not just SQL snippets)
   - Actual test file stubs with Given/When/Then scenarios

3. **Environment Setup**
   - Local development setup instructions
   - Environment variable configuration
   - Database seeding for testing

4. **Error Handling Specifics**
   - Specific error codes and messages
   - Retry logic patterns
   - Circuit breaker configurations

5. **Performance Benchmarks**
   - Load testing scenarios
   - Database query optimization guidelines
   - Caching strategies

6. **Security Implementation Details**
   - Key rotation procedures
   - Audit log formats
   - Rate limiting configurations

---

You said:
Is this detailed enough?


ChatGPT said:
Your playbook is very close to “implementation-ready”—it captures every big rock (schema, timeline, SLOs, rollback, compliance). For most teams that’s enough to start work. But if you want it to function as a single source of truth that an engineer can follow without extra context, a few sections could use one more level of concreteness:

Area	Good as-is?	What an engineer may still ask for
SQL migrations	✅ Table definitions included.	“Where do I put this?” Add a file-path convention (supabase/migrations/2025-07-05_wallet.sql) and a db:push CLI one-liner.
Edge-function wiring	⚠️ Snippet shows insert but not the export wrapper.	Drop in a minimal runnable function skeleton (serve(handler) or Supabase createClient import).
Time estimates	⚠️ Tasks are chunked (~6 h) but no numeric hours.	Put a (~4 h) or (~2 h) tag beside each bullet; helps scheduling & burndown.
Test specs	✅ Coverage targets + scenarios listed.	Provide file stubs (e.g. __tests__/wallet.spec.ts) or at least “Given/When/Then” bullets so QA knows success cases.
HITL checkpoints	✅ Listed.	Link to the exact Slack channel / GitHub PR template you’ll use for approvals so nothing slips.
Rollback commands	✅ PITR & commit-revert named.	Include a dry-run example (supabase db remote commit --dry-run) and call out where the snapshot lives (aws s3://pf-backups/...).
Secrets rotation cron	⚠️ Day 2 says “schedule quarterly.”	Add the actual GitHub Actions YAML or Hashicorp Vault policy snippet so it’s codified.
Radar tuning	✅ Owner + date given.	Paste the SQL/API call you’ll run to pull the first 100 payments, so Data team has a starting query.
Access-control diagrams	❓ Optional.	If new hires will read this, a quick Mermaid diagram of table relationships & RLS flows clarifies a lot.

Bottom line
For a senior-leaning team that already knows the repo conventions, the playbook is detailed enough to start Day 3 immediately.
If you’ll have junior engineers or stakeholders dipping in, sprinkle in the concrete file paths / CLI invocations so nobody has to ask “Where exactly does this live?”

Let me know if you'd like me to append any of those concrete stubs or diagrams.

---

# IMPLEMENTATION-READY ADDENDUM

## 📂 Repository Map

| Area | Path | Notes |
|------|------|-------|
| Migrations | `supabase/migrations/<yyyymmdd>_<slug>.sql` | One file per day's DB change |
| Edge Functions | `supabase/functions/<fn-name>/index.ts` | Use Deno style imports (Supabase runtime) |
| React App | `apps/web/` | Next.js 14 app; src under `apps/web/src` |
| Shared Utils | `packages/shared/` | Pure TS helpers (e.g. `hash.ts`, `featureFlag.ts`) |
| Tests | `tests/` | Vitest config lives in `vitest.config.ts` |
| CI | `.github/workflows/ci.yml` | Runs Vitest + Playwright + axe-core |
| Docs | `docs/runbooks/` | Run-books & playbook live here |

## 🏗 Day 3-4 Detailed Code Tasks

### 1. Create migration `supabase/migrations/20250709_feature_flags_rollout.sql`

```sql
ALTER TABLE feature_flags ADD COLUMN rollout_percentage INT DEFAULT 100;
```

Apply with:
```bash
supabase db push
```

### 2. Add deterministic helper `packages/shared/featureFlag.ts`

```typescript
import { createHash } from 'node:crypto';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rollout_percentage: number;
  created_at: string;
  updated_at: string;
}

export const isEnabled = (flag: FeatureFlag, userId: string): boolean => {
  if (!flag.enabled) return false;
  
  const pct = flag.rollout_percentage ?? 100;
  if (pct === 100) return true;
  
  const hashVal = parseInt(
    createHash('sha1').update(userId).digest('hex').slice(0, 8),
    16
  );
  return (hashVal % 100) < pct;
};

export const getFeatureFlagHash = (userId: string): number => {
  return parseInt(
    createHash('sha1').update(userId).digest('hex').slice(0, 8),
    16
  ) % 100;
};
```

### 3. Wire React check (example in `apps/web/src/pages/profile/index.tsx`)

```typescript
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { isEnabled } from '@shared/featureFlag';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { session } = useAuth();
  const { data: flag, isLoading } = useFeatureFlag('profile_ui_revamp');
  
  if (isLoading) return <ProfileSkeleton />;
  
  const showV2 = flag && isEnabled(flag, session.user.id);
  
  return (
    <div className="profile-container">
      {showV2 ? <ProfileV2 /> : <ProfileV1 />}
    </div>
  );
};

export default ProfilePage;
```

### 4. Wire Edge Function override in `supabase/functions/profile/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { isEnabled } from '../../../packages/shared/featureFlag.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { data: flag } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('name', 'profile_ui_revamp')
      .single();

    if (flag && isEnabled(flag, user.id)) {
      // Return new profile data structure
      const { data: profile } = await supabase
        .from('traveler_profiles')
        .select('*, profile_completeness_score, verification_level')
        .eq('user_id', user.id)
        .single();
        
      return new Response(
        JSON.stringify({ profile, version: 'v2' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return legacy profile structure
    const { data: profile } = await supabase
      .from('traveler_profiles')
      .select('id, first_name, last_name, email, phone')
      .eq('user_id', user.id)
      .single();

    return new Response(
      JSON.stringify({ profile, version: 'v1' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

## 🧪 Test Skeleton Paths

### Unit test stub `tests/featureFlag.spec.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { isEnabled, getFeatureFlagHash } from '@shared/featureFlag';

describe('featureFlag', () => {
  describe('isEnabled', () => {
    it('returns true for 100% rollout', () => {
      const flag = { 
        name: 'test_flag', 
        enabled: true, 
        rollout_percentage: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(isEnabled(flag, 'user123')).toBe(true);
    });

    it('returns false for disabled flag', () => {
      const flag = { 
        name: 'test_flag', 
        enabled: false, 
        rollout_percentage: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      expect(isEnabled(flag, 'user123')).toBe(false);
    });

    it('distributes users for 5% canary', () => {
      const flag = { 
        name: 'test_flag', 
        enabled: true, 
        rollout_percentage: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      let hits = 0;
      for (let i = 0; i < 1000; i++) {
        if (isEnabled(flag, `user${i}`)) hits++;
      }
      
      expect(hits).toBeGreaterThan(30);     // ~5%
      expect(hits).toBeLessThan(70);
    });
  });
});
```

### Integration test stub `tests/edge/webhookRefund.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';

describe('Webhook Refund Integration', () => {
  let supabase: ReturnType<typeof createClient>;
  
  beforeEach(() => {
    supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  });

  it('processes Duffel booking failure and triggers Stripe refund', async () => {
    // Given: A payment has been made for a booking
    const mockPayment = {
      stripe_payment_intent_id: 'pi_test_123',
      amount: 50000, // $500.00
      booking_id: 'booking_123',
      status: 'succeeded'
    };

    // When: Duffel webhook indicates booking failure
    const webhookPayload = {
      type: 'booking.failed',
      data: {
        booking_id: 'booking_123',
        failure_reason: 'airline_rejected'
      }
    };

    const response = await fetch('/api/webhooks/duffel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    // Then: Stripe refund should be initiated
    expect(response.ok).toBe(true);
    
    const { data: refund } = await supabase
      .from('refunds')
      .select('*')
      .eq('payment_intent_id', 'pi_test_123')
      .single();
      
    expect(refund).toBeDefined();
    expect(refund.amount).toBe(50000);
    expect(refund.status).toBe('pending');
  });
});
```

### E2E test stub `tests/e2e/canary-ui.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Canary UI Tests', () => {
  test('canary user sees V2 profile interface', async ({ page }) => {
    // Given: User is in the 5% canary group
    await page.goto('/profile');
    await page.fill('[data-testid="email"]', 'canary.user@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="login-button"]');

    // When: User navigates to profile page
    await page.goto('/profile');

    // Then: Should see V2 profile interface
    await expect(page.locator('[data-testid="profile-v2-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="completeness-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="verification-level"]')).toBeVisible();
  });

  test('control user sees V1 profile interface', async ({ page }) => {
    // Given: User is in the control group (95%)
    await page.goto('/profile');
    await page.fill('[data-testid="email"]', 'control.user@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="login-button"]');

    // When: User navigates to profile page
    await page.goto('/profile');

    // Then: Should see V1 profile interface
    await expect(page.locator('[data-testid="profile-v1-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="completeness-score"]')).not.toBeVisible();
  });
});
```

## 🔄 Rollback How-To

```bash
# Dry-run before reverting
supabase db remote commit --dry-run -m revert_day3_flag_migration

# If approved (HITL ✅), execute:
supabase db remote commit -m revert_day3_flag_migration

# or, for surgical restore:
supabase db branches switch production-2025-07-09T15:30Z
# snapshot in s3://pf-backups/2025-07-day10/

# Verify rollback worked
supabase db remote status
```

## 🔐 Secrets Rotation Cron

```yaml
# .github/workflows/rotate-secrets.yml
name: Rotate AWS & Twilio Secrets
on:
  schedule:
    - cron: '0 3 1 */3 *'   # quarterly at 3am on 1st of quarter
  workflow_dispatch:        # manual trigger

jobs:
  rotate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Rotate KMS key & update Env Vars
        run: |
          # Create new KMS key
          NEW_KEY=$(aws kms create-key --tags TagKey=Project,TagValue=ParkerFlight --query 'KeyMetadata.KeyId' --output text)
          
          # Update Supabase secrets
          supabase secrets set KMS_KEY_ID=$NEW_KEY
          supabase secrets set TWILIO_AUTH_TOKEN=$(openssl rand -base64 32)
          
          # Schedule old key for deletion (7 days)
          aws kms schedule-key-deletion --key-id ${{ secrets.OLD_KMS_KEY_ID }} --pending-window-in-days 7
          
          # Update GitHub secrets for next rotation
          echo "NEW_KEY=$NEW_KEY" >> $GITHUB_ENV
          
      - name: Verify rotation
        run: |
          # Test new key works
          echo "test data" | aws kms encrypt --key-id $NEW_KEY --plaintext fileb://- --output text
          
          # Test Supabase functions still work
          curl -X POST "$SUPABASE_URL/functions/v1/health" \
            -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
            -H "Content-Type: application/json"
```

## 🏥 Environment Setup

### Local Development Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/your-org/parker-flight.git
cd parker-flight
npm install

# 2. Set up Supabase locally
supabase start
supabase db reset

# 3. Environment variables
cp .env.example .env.local
# Edit .env.local with your values:
# SUPABASE_URL=http://localhost:54321
# SUPABASE_ANON_KEY=your-anon-key
# STRIPE_SECRET_KEY=sk_test_...
# TWILIO_ACCOUNT_SID=AC...
# AWS_KMS_KEY_ID=your-kms-key

# 4. Seed test data
npm run db:seed

# 5. Start development server
npm run dev
```

### Database Seeding Script `scripts/seed.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedDatabase() {
  // Create feature flags
  await supabase.from('feature_flags').upsert([
    {
      name: 'profile_ui_revamp',
      enabled: true,
      rollout_percentage: 5,
      description: 'New profile UI with completeness score'
    },
    {
      name: 'wallet_system',
      enabled: true,
      rollout_percentage: 100,
      description: 'Payment methods and wallet functionality'
    }
  ]);

  // Create test users
  const testUsers = [
    {
      email: 'canary.user@example.com',
      password: 'testpassword',
      user_metadata: { name: 'Canary User' }
    },
    {
      email: 'control.user@example.com',
      password: 'testpassword',
      user_metadata: { name: 'Control User' }
    }
  ];

  for (const user of testUsers) {
    const { data: authUser } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      user_metadata: user.user_metadata
    });

    if (authUser.user) {
      await supabase.from('traveler_profiles').insert({
        user_id: authUser.user.id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: user.email,
        phone: faker.phone.number(),
        profile_completeness_score: faker.number.int({ min: 0, max: 100 }),
        verification_level: faker.helpers.arrayElement(['basic', 'verified', 'premium'])
      });
    }
  }

  console.log('Database seeded successfully!');
}

seedDatabase().catch(console.error);
```

## 📊 Performance & Monitoring

### Load Testing Scenarios `tests/load/profile.k6.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Steady state
    { duration: '2m', target: 200 },  // Peak load
    { duration: '5m', target: 200 },  // Steady peak
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'],   // 95% of requests under 200ms
    errors: ['rate<0.001'],             // Error rate under 0.1%
  },
};

export default function () {
  const response = http.get('https://your-app.com/api/profile', {
    headers: {
      'Authorization': `Bearer ${__ENV.TEST_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'profile data present': (r) => JSON.parse(r.body).profile !== undefined,
  }) || errorRate.add(1);

  sleep(1);
}
```

### Database Query Optimization Guidelines

```sql
-- Index for feature flag lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_feature_flags_name 
  ON feature_flags (name) WHERE enabled = true;

-- Index for user profile lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_traveler_profiles_user_id 
  ON traveler_profiles (user_id);

-- Index for payment methods
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_methods_user_id 
  ON payment_methods (user_id) WHERE is_default = true;

-- Composite index for audit queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_traveler_data_audit_user_action 
  ON traveler_data_audit (user_id, action, created_at DESC);
```

## 🔒 Security Implementation Details

### Error Codes and Messages `packages/shared/errors.ts`

```typescript
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
  RATE_LIMITED = 'RATE_LIMITED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export const ErrorMessages = {
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.PAYMENT_FAILED]: 'Payment processing failed',
  [ErrorCode.INVALID_PAYMENT_METHOD]: 'Invalid payment method',
  [ErrorCode.RATE_LIMITED]: 'Too many requests, please try again later',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid input data',
  [ErrorCode.INTERNAL_ERROR]: 'Internal server error'
};

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### Rate Limiting Configuration `middleware/rateLimit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different rate limits for different endpoints
export const profileRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
  analytics: true,
});

export const paymentRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 payment attempts per minute
  analytics: true,
});

export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 auth attempts per minute
  analytics: true,
});
```

### Audit Log Format `types/audit.ts`

```typescript
export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: AuditAction;
  resource_type: 'profile' | 'payment_method' | 'booking' | 'feature_flag';
  resource_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address: string;
  user_agent: string;
  session_id: string;
  created_at: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  ENCRYPT = 'ENCRYPT',
  DECRYPT = 'DECRYPT'
}

export const logAuditEvent = async (entry: Omit<AuditLogEntry, 'id' | 'created_at'>) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('traveler_data_audit').insert({
    ...entry,
    created_at: new Date().toISOString()
  });
};
```

---

## Final Implementation Checklist

✅ **File Structure**: All paths explicitly defined  
✅ **Code Examples**: Complete functions with imports  
✅ **Test Stubs**: Unit, integration, and E2E tests ready  
✅ **Environment Setup**: Local dev instructions complete  
✅ **Error Handling**: Codes, messages, and patterns defined  
✅ **Performance**: Load testing and query optimization  
✅ **Security**: Rate limiting, audit logs, and error handling  
✅ **Rollback**: Concrete commands and procedures  
✅ **Monitoring**: Metrics, alerts, and observability  

**This plan is now implementation-ready for AI agents or development teams.**

---

## 🗂 Audit Log JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["user_id", "action", "table_name", "created_at"],
  "properties": {
    "user_id": { "type": "string", "format": "uuid" },
    "action": { "type": "string", "enum": ["INSERT", "UPDATE", "DELETE"] },
    "table_name": { "type": "string" },
    "record_id": { "type": ["string", "null"], "format": "uuid" },
    "old_data": {},
    "new_data": {},
    "ip_address": { "type": ["string", "null"], "format": "ipv4" },
    "user_agent": { "type": ["string", "null"] },
    "created_at": { "type": "string", "format": "date-time" }
  }
}
```

## 🔗 References

* Schema SQL: `supabase/migrations/2025-07-profile.sql`
* Feature flag util: `packages/shared/featureFlag.ts`
* Notification docs: `docs/runbooks/notifications.md`
* Design system: shadcn/ui v0.9

> **Next Step**: Kick off Day 0 by merging this playbook into `docs/DEVELOPMENT_PLAYBOOK.md`, creating project epic **PF-SPRINT-07**, and time-boxing tasks as per schedule above.
