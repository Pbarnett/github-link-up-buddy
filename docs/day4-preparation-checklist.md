# Day 4 Preparation Checklist

## 🚦 Green-Light Checklist (Complete Before Canary)

### 1. QA Walkthrough ✅
```bash
npm run qa:wallet-walkthrough qa.wallet.user@pf.dev
```
**Expected Output**: All API endpoints functional, feature flags verified

### 2. Grafana Metrics Check ⏳
**Panel**: `wallet_add_pm_latency_ms`
- **Target**: P95 < 800ms
- **Current**: _[To be measured]_
- **Error Rate**: ~0%

**Import Dashboard**:
```bash
# Import wallet performance dashboard
curl -X POST http://grafana:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @monitoring/grafana/dashboards/wallet-performance.json
```

### 3. Playwright Smoke Tests ⏳
```bash
# Run wallet-specific tests
npm run test:wallet-smoke

# Mobile responsiveness
npm run test:wallet-mobile
```

### 4. Manual UI Verification ⏳
- [ ] Enhanced profile shows 3 tabs (wallet_ui at 0%)
- [ ] Wallet tab appears when feature flag enabled
- [ ] Beta badge visible
- [ ] Add card modal opens/closes properly
- [ ] Empty state messaging correct
- [ ] Dark mode compatibility (if applicable)

## 🚀 Canary Rollout (When Green)

### Execute Rollout
```sql
UPDATE feature_flags 
SET rollout_percentage = 5 
WHERE name = 'wallet_ui';
```

### Monitor for 30 Minutes
- **Grafana Dashboard**: Wallet Performance
- **Key Metrics**:
  - Error rate baseline + 0.5%
  - P95 latency < 800ms
  - Feature flag adoption rate
  - Payment method operations

### Rollback Plan (If Issues)
```sql
UPDATE feature_flags 
SET rollout_percentage = 0 
WHERE name = 'wallet_ui';
```

## 📋 Day 4 Focus Areas

### AM: Designer Polish (4h)
**Objective**: Capture feedback in Storybook, refine spacing and color tokens

#### Tasks:
1. **Storybook Integration** (~2h)
   - [ ] Create wallet component stories
   - [ ] Document design tokens usage
   - [ ] Interactive examples for all states

2. **Design System Alignment** (~1h)
   - [ ] Verify color token consistency
   - [ ] Check spacing against design system
   - [ ] Validate typography scales

3. **Accessibility Review** (~1h)
   - [ ] Run axe-core against wallet components
   - [ ] Keyboard navigation testing
   - [ ] Screen reader compatibility

#### Deliverables:
- Storybook stories for PaymentMethodList, AddCardModal, WalletTab
- Design token documentation
- Accessibility audit report

### PM: Mobile & Accessibility Tweaks (4h)
**Objective**: Ensure WCAG 2.2 AA compliance on wallet modals & lists

#### Tasks:
1. **Mobile Optimization** (~2h)
   - [ ] Test on iPhone SE (375px)
   - [ ] Test on iPad (768px)
   - [ ] Verify touch targets (44px minimum)
   - [ ] Test modal behavior on mobile

2. **Accessibility Enhancements** (~2h)
   - [ ] ARIA labels and descriptions
   - [ ] Focus management in modals
   - [ ] Color contrast verification
   - [ ] Screen reader announcements

#### Tools Needed:

**Playwright Device Emulation**:
```javascript
// tests/e2e/wallet-mobile.spec.ts
test.use({ 
  viewport: { width: 375, height: 667 } // iPhone SE
});

test.use({ 
  viewport: { width: 768, height: 1024 } // iPad
});
```

**axe-core Integration**:
```javascript
import { injectAxe, checkA11y } from 'axe-playwright';

test('Wallet UI meets WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/profile');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  });
});
```

### EOD: Feature Flag Bump (30min)
**Objective**: Flip wallet_ui to 5% → watch metrics

#### Pre-Rollout Checklist:
- [ ] All QA tests passing
- [ ] Grafana dashboard monitoring active
- [ ] Rollback plan tested and ready
- [ ] On-call engineer notified

#### Rollout Commands:
```bash
# Execute canary rollout
npm run deploy:wallet-canary

# Or manual SQL:
psql $DATABASE_URL -c "UPDATE feature_flags SET rollout_percentage = 5 WHERE name = 'wallet_ui';"
```

#### Post-Rollout Monitoring:
- **Alert Threshold**: Error rate > baseline + 0.5%
- **Watch Duration**: 30 minutes minimum
- **Success Criteria**: 
  - No error rate increase
  - P95 latency stable
  - No user-reported issues

## 🛠️ Development Setup

### Environment Variables Needed:
```bash
# .env.local
QA_WALLET_USER_EMAIL=qa.wallet.user@pf.dev
QA_WALLET_USER_PASSWORD=qa-test-password-123
GRAFANA_URL=http://localhost:3000
DATABASE_URL=postgresql://...
```

### Test User Setup:
1. Create test user in Supabase Dashboard
2. Ensure user gets both feature flags enabled
3. Add test data if needed for payment methods

### Monitoring Setup:
1. Import Grafana dashboard: `monitoring/grafana/dashboards/wallet-performance.json`
2. Configure alerts for error rate thresholds
3. Set up Slack notifications for alerts

## 📊 Success Criteria

### Technical Metrics:
- [ ] P95 latency < 800ms
- [ ] Error rate < 0.1%
- [ ] 100% test coverage for new components
- [ ] WCAG 2.2 AA compliance score

### User Experience:
- [ ] Smooth canary rollout with no issues
- [ ] Positive designer feedback on polish
- [ ] Mobile responsiveness verified
- [ ] Accessibility standards met

### Business Metrics:
- [ ] Feature flag adoption tracking working
- [ ] Payment method operations logged
- [ ] User engagement with wallet UI (if any users see it)

---

**Day 4 Preparation**: ✅ Ready to execute
**Timeline**: On track for 12-day delivery
**Risk Level**: Low (comprehensive testing and rollback plan in place)
