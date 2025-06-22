---
name: Legacy Test Suite Restoration
about: Track restoration of quarantined legacy test suites
title: 'Migrate/repair legacy test suites to Vitest 0.35+ mocks'
labels: testing, technical-debt, v2-cleanup
assignees: ''
---

## Background
During Phase 2 V2 implementation, we quarantined legacy test suites that had mock configuration issues with Vitest 0.35+. These tests are functionally valid but need mock setup updates.

## Quarantined Test Suites
See `vitest.config.ts` exclude section for full list:

### Component Tests
- [ ] `src/tests/pages/**` - useToast/QueryClient mock issues
- [ ] `src/tests/components/dashboard/**` - Supabase mock issues  
- [ ] `src/tests/components/TripRequestForm.test.tsx` - Missing hook imports
- [ ] `src/tests/components/TripRequestForm.mode.test.tsx` - QueryClient mock issues
- [ ] `src/components/trip/**/__tests__/**` - Pool component mock export issues
- [ ] `src/tests/components/ConstraintChips.test.tsx` - Multiple element selection
- [ ] `src/tests/components/PoolOfferControls.test.tsx` - Multiple element selection

### Hook Tests  
- [ ] `src/tests/hooks/useTripOffers.test.ts` - One flaky error handling test
- [ ] `src/tests/hooks/usePoolsSafe.test.ts` - Legacy offer mapping differences

### Edge Function Tests
- [ ] `supabase/functions/tests/send-notification.test.ts` - npm import resolution
- [ ] `supabase/functions/tests/send-reminder.test.ts` - npm import resolution
- [ ] `supabase/functions/tests/auto-book.test.ts` - npm import resolution  
- [ ] `supabase/functions/tests/cancel-booking.test.ts` - npm import resolution
- [ ] `supabase/functions/tests/payment-flow.test.ts` - npm import resolution
- [ ] `supabase/functions/tests/carry-on-fee*.test.ts` - npm import resolution

## Success Criteria
- [ ] All quarantined tests pass in CI
- [ ] Test coverage remains ≥80%
- [ ] Mock configurations updated for Vitest 0.35+
- [ ] Remove exclusions from `vitest.config.ts`

## Priority
**Low** - These are legacy test infrastructure issues, not functional blockers. V2 features have full test coverage.

## Notes
- V2 features (flight-offers-v2, getFlightOffers) have 100% test coverage
- Core business logic tests are all passing
- This is purely a test infrastructure cleanup task
