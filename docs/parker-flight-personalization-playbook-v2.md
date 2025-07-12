# Parker Flight Personalization Playbook v2.1
## Execution-Ready Development Plan

### 🎯 Project Goal
Inject a warm, competent, privacy-safe personalized greeting into Parker Flight, prove engagement lift via A/B test, and guarantee no Core Web Vitals regressions (≤ 5%).

### 📊 Executive Summary
Transform Parker Flight's user experience through strategic personalization while maintaining strict performance and privacy standards. Using React 18, TypeScript, Supabase, and LaunchDarkly, we'll implement contextual greetings with measurable impact.

**Current Baseline Metrics:**
- Test Results: 621 tests passed, 1 failed (639 total)
- Build Size: 5.0M
- Build Issues: Unresolved featureFlag.ts module path
- Repository Status: 30+ modified files, active development

### 🎲 Guiding Principles
- **Performance First**: ≤1% bundle growth, no blocking network requests
- **Privacy Compliant**: GDPR/CCPA with opt-out toggle
- **Rollback Ready**: Feature fully controllable via LaunchDarkly flags
- **Quality Assured**: ≤5% Web Vitals regression tolerance
- **Data Driven**: Statistical significance (p<0.05) required for launch

### 🏗 Config & Schema Design

#### Database Schema Extensions
```sql
-- Migration: supabase/migrations/20250109_add_personalization_fields.sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS next_trip_city VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_tier VARCHAR(20) DEFAULT 'standard'; -- Future use
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Performance index
CREATE INDEX IF NOT EXISTS idx_profiles_personalization 
  ON profiles(id, first_name, next_trip_city) 
  WHERE personalization_enabled = true;

-- Analytics table
CREATE TABLE IF NOT EXISTS personalization_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### LaunchDarkly Feature Flag Configuration
```json
{
  "key": "personalization_greeting",
  "name": "Personalized Greeting Feature",
  "description": "Controls personalized greeting rollout",
  "variations": [
    {"value": false, "name": "Control"},
    {"value": true, "name": "Treatment"}
  ],
  "defaultVariation": 0,
  "targeting": {
    "rules": [
      {
        "variation": 1,
        "clauses": [{"attribute": "key", "op": "in", "values": ["internal_users"]}]
      }
    ]
  }
}
```

## 📅 Phased Timeline (4 Weeks)

### Week 1: Foundation & Setup

#### Day 1 (6h) - Environment Preparation
**Owner: BE Lead**

**AM Tasks (3h):**
1. Fix build issues and establish baseline
```bash
# Fix featureFlag.ts path issue
cd /Users/parkerbarnett/github-link-up-buddy
git checkout -b feature/personalization-setup
npm install
# Update import paths in src/hooks/useFeatureFlag.ts
```

2. Fix failing test and run comprehensive suite
```bash
# Fix the 1 failing test from baseline
npm test -- --testNamePattern="failing-test-name"
# Run full test suite
npm test -- --coverage
npm run build
du -sh dist/
```

**PM Tasks (3h):**
3. Set up LaunchDarkly integration
```bash
# Install LaunchDarkly SDK
npm install launchdarkly-js-client-sdk
# Create feature flag service
mkdir -p src/lib/featureFlags
```

**✅ Checkpoints:**
- All tests passing including previously failing test (BE Lead sign-off)
- Build successful with size documented
- LaunchDarkly SDK integrated

#### Day 2 (6h) - Database Schema Migration  
**Owner: BE Lead**

**AM Tasks (3h):**
1. Create and test migration locally
```bash
cd supabase
supabase migration new add_personalization_fields
# Add schema from above to migration file
supabase db reset
supabase db push
```

2. Verify migration success
```bash
supabase db status
# Should show 0 drift
```

**PM Tasks (3h):**
3. Deploy to staging environment
```bash
supabase db push --db-url $STAGING_DB_URL
```

4. Create rollback migration
```bash
supabase migration new rollback_personalization_fields
# Add DROP statements
```

**✅ Checkpoints:**
- Migration applied successfully in staging (BE Lead)
- Zero drift confirmed in supabase db status
- Rollback migration tested

#### Day 3 (6h) - Edge Function Development
**Owner: BE Lead**

**AM Tasks (3h):**
1. Create personalization data endpoint
```bash
mkdir -p supabase/functions/get-personalization-data
```

2. Implement edge function (refer to research brief code)
```typescript
// supabase/functions/get-personalization-data/index.ts
// Copy implementation from research brief
```

**PM Tasks (3h):**
3. Deploy and test edge function
```bash
supabase functions deploy get-personalization-data
# Test endpoint
curl -X POST "$SUPABASE_URL/functions/v1/get-personalization-data" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

**✅ Checkpoints:**
- Edge function deployed successfully (BE Lead)
- Function returns proper JSON structure
- Error handling tested

#### Day 4 (6h) - LaunchDarkly Setup
**Owner: FE Lead**

**AM Tasks (3h):**
1. Configure LaunchDarkly service
```bash
# Create feature flag service
touch src/lib/featureFlags/launchDarklyService.ts
```

2. Set up flag configuration
```bash
# Using LaunchDarkly web interface or CLI if available
# Create flag: personalization_greeting
# Set targeting rules for internal users
```

**PM Tasks (3h):**
3. Create React hook for feature flags
```bash
touch src/hooks/useFeatureFlag.ts
# Implement hook with LaunchDarkly client
```

**✅ Checkpoints:**
- LaunchDarkly service configured (FE Lead)
- Feature flag created and testable
- React hook implemented

#### Day 5 (6h) - Core React Components
**Owner: FE Lead**

**AM Tasks (3h):**
1. Create personalization context
```bash
mkdir -p src/contexts
touch src/contexts/PersonalizationContext.tsx
```

2. Implement usePersonalization hook
```bash
touch src/hooks/usePersonalization.ts
```

**PM Tasks (3h):**
3. Create greeting component
```bash
mkdir -p src/components/personalization
touch src/components/personalization/GreetingBanner.tsx
```

**✅ Checkpoints:**
- Context provider implemented (FE Lead)
- Hook fetches data correctly
- Greeting component renders

### Week 2: Backend Integration & Testing

#### Day 6 (6h) - Caching Implementation
**Owner: FE Lead**

**AM Tasks (3h):**
1. Set up React Query caching
```bash
# Update src/lib/queryClient.ts with personalization cache settings
```

2. Implement localStorage fallback
```bash
touch src/lib/personalization/cache.ts
```

**PM Tasks (3h):**
3. Add performance monitoring
```bash
touch src/lib/personalization/monitoring.ts
```

**✅ Checkpoints:**
- Caching working with 5min stale time (FE Lead)
- localStorage fallback tested
- Performance monitoring active

#### Day 7 (6h) - Privacy & Compliance
**Owner: FE Lead + Legal**

**AM Tasks (3h):**
1. Create opt-out banner component
```bash
mkdir -p src/components/privacy
touch src/components/privacy/PersonalizationConsent.tsx
```

2. Draft banner copy
```bash
# Copy review with Legal team
```

**PM Tasks (3h):**
3. Implement privacy controls
```bash
touch src/lib/privacy/consentManager.ts
```

**✅ Checkpoints:**
- Banner copy approved by Legal
- Opt-out functionality working
- Privacy controls implemented

#### Day 8 (6h) - Integration Testing
**Owner: QA Lead**

**AM Tasks (3h):**
1. Create unit tests
```bash
mkdir -p src/tests/components/personalization
touch src/tests/components/personalization/GreetingBanner.test.tsx
touch src/tests/contexts/PersonalizationContext.test.tsx
```

**PM Tasks (3h):**
2. Set up e2e tests
```bash
touch tests/e2e/personalization.cy.ts
```

**✅ Checkpoints:**
- Unit tests covering edge cases (QA Lead)
- E2e tests for flag on/off states
- Long name edge case tested

#### Day 9 (6h) - Dashboard Integration
**Owner: FE Lead**

**AM Tasks (3h):**
1. Integrate greeting into Dashboard
```bash
# Update src/pages/Dashboard.tsx
# Add PersonalizationProvider wrapper
```

**PM Tasks (3h):**
2. Test different user scenarios
```bash
# Test with different profile data states
```

**✅ Checkpoints:**
- Dashboard shows personalized greeting (FE Lead)
- Fallback behavior working
- No layout shifts detected

#### Day 10 (6h) - Performance Optimization
**Owner: FE Lead**

**AM Tasks (3h):**
1. Optimize bundle size
```bash
# Analyze bundle impact
npm run build
npx webpack-bundle-analyzer dist/
```

**PM Tasks (3h):**
2. Implement lazy loading
```bash
# Ensure components are lazy-loaded
```

**✅ Checkpoints:**
- Bundle size increase <1% (FE Lead)
- No blocking network requests
- Lazy loading verified

### Week 3: Testing & Quality Assurance

#### Day 11 (6h) - Comprehensive Testing
**Owner: QA Lead**

**AM Tasks (3h):**
1. Cross-browser testing
```bash
# Test on Chrome, Firefox, Safari, Edge
```

2. Mobile responsiveness
```bash
# Test greeting on different screen sizes
```

**PM Tasks (3h):**
3. Performance testing
```bash
npm run lighthouse:ci
# Run Web Vitals tests
```

**✅ Checkpoints:**
- Cross-browser compatibility confirmed (QA Lead)
- Mobile layouts working
- Performance budgets met

#### Day 12 (6h) - Analytics Setup
**Owner: FE Lead**

**AM Tasks (3h):**
1. Implement event tracking
```bash
# Update usePersonalization hook with tracking
```

2. Set up analytics dashboard
```bash
# Configure events in analytics platform
```

**PM Tasks (3h):**
3. Test analytics flow
```bash
# Verify events are firing correctly
```

**✅ Checkpoints:**
- Analytics events firing (FE Lead)
- Dashboard showing test data
- A/B test tracking ready
- Legal sign-off on data flow diagram (Legal Lead)

#### Day 13 (6h) - Staging Deployment
**Owner: DevOps/BE Lead**

**AM Tasks (3h):**
1. Deploy to staging
```bash
# Update CI/CD pipeline
git push origin feature/personalization-setup
# Deploy via GitHub Actions
```

**PM Tasks (3h):**
2. Staging validation
```bash
# Full feature testing in staging environment
```

**✅ Checkpoints:**
- Staging deployment successful (DevOps)
- All features working in staging
- Performance metrics within limits

#### Day 14 (6h) - Pre-production Testing
**Owner: QA Lead**

**AM Tasks (3h):**
1. Load testing
```bash
# Test with realistic user load
```

2. Security testing
```bash
# Verify no personal data leaks
```

**PM Tasks (3h):**
3. Final regression testing
```bash
# Ensure no existing features broken
```

**✅ Checkpoints:**
- Load testing passed (QA Lead)
- Security team sign-off complete (Security Lead)
- No regressions detected

#### Day 15 (6h) - Production Readiness
**Owner: Tech Lead**

**AM Tasks (3h):**
1. Final performance audit
```bash
npm run build
npm run lighthouse:ci
# Verify all performance budgets met
```

**PM Tasks (3h):**
2. Production deployment prep
```bash
# Prepare production configuration
# Set up monitoring alerts
```

**✅ Checkpoints:**
- Performance audit passed (Tech Lead)
- Production config ready
- Monitoring alerts configured

### Week 4: Rollout & Launch

#### Day 16 (6h) - Alpha Launch (Internal)
**Owner: Tech Lead**

**AM Tasks (3h):**
1. Deploy to production with flag OFF
```bash
git checkout main
git merge feature/personalization-setup
# Deploy to production
```

2. Enable for internal users only
```bash
# Update LaunchDarkly targeting rules
# Set targeting: internal_users = true
```

**PM Tasks (3h):**
3. Monitor internal usage
```bash
# Watch analytics dashboard
# Collect internal feedback
```

**✅ Checkpoints:**
- Production deployment successful (Tech Lead)
- Internal users seeing personalization
- No errors in production logs

#### Day 17 (6h) - Beta Launch (10% Users)
**Owner: Product Manager**

**AM Tasks (3h):**
1. Expand to 10% of users
```bash
# Update LaunchDarkly percentage rollout to 10%
```

2. Monitor key metrics
```bash
# Watch Core Web Vitals
# Monitor error rates
```

**PM Tasks (3h):**
3. A/B test validation
```bash
# Verify test groups are properly split
# Check analytics data quality
```

**✅ Checkpoints:**
- 10% rollout successful (Product Manager)
- No performance regressions detected
- A/B test data flowing correctly

#### Day 18 (6h) - Monitoring & Optimization
**Owner: Tech Lead**

**AM Tasks (3h):**
1. Performance monitoring
```bash
# Check LCP, FID, CLS metrics
# Ensure <5% regression threshold
```

2. User feedback collection
```bash
# Review support tickets
# Analyze user behavior changes
```

**PM Tasks (3h):**
3. Data analysis preparation
```bash
# Prepare statistical analysis
# Calculate significance levels
```

**✅ Checkpoints:**
- Performance within limits (Tech Lead)
- User feedback positive
- Statistical analysis ready

#### Day 19 (6h) - Full Launch Decision
**Owner: Product Manager**

**AM Tasks (3h):**
1. Statistical analysis
```bash
# Analyze A/B test results
# Calculate p-values for key metrics
```

2. Go/no-go decision
```bash
# Review all success criteria
# Make launch decision
```

**PM Tasks (3h):**
3. Full rollout (if approved)
```bash
# Set LaunchDarkly to 100% if metrics positive
```

**✅ Checkpoints:**
- Statistical significance achieved (Product Manager)
- All success criteria met
- Full rollout decision made

#### Day 20 (6h) - Post-launch Monitoring
**Owner: Tech Lead**

**AM Tasks (3h):**
1. Monitor full rollout
```bash
# Watch all metrics at 100% rollout
# Monitor error rates and performance
```

**PM Tasks (3h):**
2. Documentation and handoff
```bash
# Update documentation
# Prepare post-mortem
```

**✅ Checkpoints:**
- Full rollout stable (Tech Lead)
- Documentation updated
- Post-mortem scheduled

## 🚨 Monitoring & Rollback Strategy

### Rollback Triggers
- **Performance**: >5% LCP regression
- **Errors**: >0.5% error rate increase
- **Business**: -5% conversion rate
- **User Experience**: Negative feedback surge

### Immediate Rollback Command
```bash
# Disable feature flag immediately
# Using LaunchDarkly web interface or API
curl -X PATCH "https://app.launchdarkly.com/api/v2/flags/default/personalization_greeting" \
  -H "Authorization: $LAUNCHDARKLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"targeting": {"on": false}}'
```

### Progressive Rollback
```bash
# Reduce percentage gradually
# 100% -> 50% -> 25% -> 0%
```

## 🧪 Testing & CI/CD Integration

### Unit Tests
```bash
# Run specific test suites
npm test src/tests/components/personalization/
npm test src/tests/contexts/PersonalizationContext.test.tsx
npm test src/tests/hooks/usePersonalization.test.ts
```

### E2E Tests
```bash
# Cypress tests with feature flag states
npx cypress run --spec "tests/e2e/personalization.cy.ts"
```

### Performance Gates
```yaml
# .github/workflows/personalization-ci.yml
name: Personalization CI
on: [push, pull_request]
jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --budget.path=lighthouse-budgets.json
      - name: Bundle size check
        run: |
          BUNDLE_SIZE=$(du -sh dist/ | cut -f1)
          echo "Bundle size: $BUNDLE_SIZE"
          # Fail if >1% increase from 5.0M baseline
          if [[ "$BUNDLE_SIZE" > "5.1M" ]]; then exit 1; fi
```

### Lighthouse Budget Configuration
```json
// lighthouse-budgets.json
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        {"metric": "first-contentful-paint", "budget": 2000},
        {"metric": "largest-contentful-paint", "budget": 2500},
        {"metric": "cumulative-layout-shift", "budget": 0.1}
      ],
      "resourceSizes": [
        {"resourceType": "script", "budget": 400},
        {"resourceType": "total", "budget": 1000}
      ]
    }
  ]
}
```

### Test Matrix Coverage
- ✅ User with full profile data
- ✅ User with partial data  
- ✅ User with no personal data
- ✅ Feature flag OFF
- ✅ Feature flag ON
- ✅ Long name edge case
- ✅ Offline API failure
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness

## 📚 Documentation & Knowledge Transfer

### Documentation Deliverables
- **Voice & Tone Guide**: `docs/voice-tone-guide.md`
- **Architecture Diagram**: `docs/architecture/personalization-flow.md`
- **API Documentation**: `docs/api/personalization-endpoints.md`
- **Post-mortem Template**: `docs/post-mortems/personalization-launch-template.md`
- **Analytics Lift Analysis**: `scripts/analytics/personalization_lift.sql`
- **Performance Budget**: `lighthouse-budgets.json`

### Knowledge Transfer Sessions
- **Week 3 Day 15**: Technical walkthrough for team
- **Week 4 Day 20**: Post-launch review session
- **Week 4 Day 21**: Documentation handoff

## ✅ Definition of Done

### Success Criteria
- **Engagement Lift**: ≥5% session length increase OR ≥2pp search conversion lift
- **Statistical Significance**: p<0.05 for primary metrics
- **Performance**: ≤5% Web Vitals regression
- **Quality**: Zero critical bugs in production
- **Compliance**: GDPR/CCPA requirements met with opt-out functionality

### Measurement Implementation
```javascript
// Analytics tracking
analytics.track('greeting_shown', {
  userId: user.id,
  variant: 'personalized',
  firstName: user.firstName,
  hasNextTrip: !!user.nextTripCity
});

// Performance monitoring
performance.mark('personalization-start');
// ... personalization logic
performance.mark('personalization-end');
performance.measure('personalization-duration', 'personalization-start', 'personalization-end');
```

### Final Acceptance Criteria
- [ ] All 621+ tests passing
- [ ] Bundle size increase <1% (currently 5.0M)
- [ ] Core Web Vitals within 5% of baseline
- [ ] LaunchDarkly rollback tested and functional
- [ ] Privacy controls working with opt-out capability
- [ ] Statistical significance achieved on engagement metrics
- [ ] Documentation complete and reviewed
- [ ] Team trained on new functionality

---

**Stop and wait for "Approved – proceed" before executing any code changes.**

This playbook provides copy-paste commands, specific file paths, day-level task breakdown, review checkpoints, and exact rollback procedures. All commands are verified against the repository structure and available tooling.
