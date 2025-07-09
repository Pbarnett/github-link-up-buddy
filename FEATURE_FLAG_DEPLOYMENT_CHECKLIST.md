# Feature Flag Deployment Checklist ✅

## System Overview
- **Feature**: Profile UI Revamp (`profile_ui_revamp`)
- **Technology**: MurmurHash3 deterministic bucketing
- **Rollout Strategy**: 5% → 25% → 100%
- **Monitoring**: Comprehensive headers + Grafana alerts

## Pre-Deployment Checklist

### ✅ Code Implementation
- [x] Shared `userInBucket()` helper with MurmurHash3
- [x] Edge Function `/functions/flags` with monitoring headers
- [x] React `useFeatureFlag` hook with React Query caching
- [x] Example `ProfileRevamp` component with feature gating
- [x] Comprehensive test suite (5 tests passing)

### ✅ Database Setup
- [x] Migration: `20250709210000_add_rollout_percentage_to_feature_flags.sql`
- [x] Seed: `20250709210001_seed_profile_ui_revamp_flag.sql`
- [x] Verification: `SELECT rollout_percentage FROM feature_flags WHERE name = 'profile_ui_revamp'`

### ✅ Testing & Validation
- [x] Unit tests protect against hash algorithm changes
- [x] Manual testing confirms 5% rollout works correctly
- [x] Edge cases handled (empty userId, 0%, 100%)
- [x] Deterministic behavior verified

### ✅ Observability
- [x] Monitoring headers: `x-canary`, `x-user-bucket`, `x-rollout-percentage`
- [x] Grafana queries for error rate and rollout validation
- [x] Alerting rules for high error rate and rollout drift

### ✅ Documentation
- [x] README snippet explaining `userInBucket()` helper
- [x] Monitoring & alerting guide
- [x] Rollout schedule and SQL commands

## Deployment Steps

### Day 0: Initial 5% Rollout
1. **Deploy code** to production
2. **Verify database** has `profile_ui_revamp` flag at 5%
3. **Monitor metrics** for 24-48 hours:
   - Error rate < baseline + 0.5%
   - Hash buckets 0-4 only
   - No 5xx spikes

### Day +2: Increase to 25%
```sql
UPDATE feature_flags SET rollout_percentage = 25 WHERE name = 'profile_ui_revamp';
```
- Compare error & conversion metrics vs control
- Monitor user feedback
- Validate performance metrics

### Day +7: Full Rollout (100%)
```sql
UPDATE feature_flags SET rollout_percentage = 100 WHERE name = 'profile_ui_revamp';
```
- Remove legacy code path
- Clean up monitoring alerts
- Document lessons learned

## Emergency Procedures

### Disable Feature Flag
```sql
UPDATE feature_flags SET enabled = false WHERE name = 'profile_ui_revamp';
```

### Rollback to Previous Percentage
```sql
UPDATE feature_flags SET rollout_percentage = 5 WHERE name = 'profile_ui_revamp';
```

## Key Metrics to Monitor

### Success Metrics
- Feature flag API response time < 100ms
- Error rate < 0.5%
- User satisfaction scores
- Conversion rates

### Warning Signs
- Error rate spike > 0.5%
- Rollout percentage drift > 2%
- User bucket distribution skewed
- Performance degradation

## Post-Deployment Tasks

### After Each Rollout Increase
- [ ] Update monitoring dashboards
- [ ] Review error logs
- [ ] Gather user feedback
- [ ] Document any issues

### After Full Rollout
- [ ] Remove legacy components
- [ ] Clean up feature flag code
- [ ] Update documentation
- [ ] Conduct retrospective

---

**Deployment Ready:** ✅ All systems green for production deployment

**Next Steps:** 
1. Deploy to production
2. Set calendar reminder for Day +2 review
3. Monitor dashboards for first 48 hours
