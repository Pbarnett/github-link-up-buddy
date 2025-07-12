# Feature Flag Monitoring & Alerts

## Observability Headers

The feature flag Edge Function includes comprehensive monitoring headers:

| Header | Description | Example |
|--------|-------------|---------|
| `x-canary` | Whether the feature is enabled for this user | `true` |
| `x-user-bucket` | User's hash bucket (0-99) | `42` |
| `x-rollout-percentage` | Current rollout percentage | `25` |
| `x-flag-name` | Name of the feature flag | `profile_ui_revamp` |
| `x-flag-enabled` | Whether the flag is globally enabled | `true` |
| `x-timestamp` | Request timestamp | `2025-07-09T17:00:00Z` |
| `x-function-version` | Edge function version | `1.0.0` |

## Grafana Queries

### Error Rate Monitoring
```promql
sum(rate(http_requests_total{route="/functions/flags",
                             flag="profile_ui_revamp",status!="200"}[5m]))
 /
sum(rate(http_requests_total{route="/functions/flags",
                             flag="profile_ui_revamp"}[5m]))
```

### Rollout Percentage Validation
```promql
sum(rate(http_requests_total{route="/functions/flags",
                             flag="profile_ui_revamp",x_canary="true"}[5m]))
 /
sum(rate(http_requests_total{route="/functions/flags",
                             flag="profile_ui_revamp"}[5m]))
```

### Bucket Distribution
```promql
histogram_quantile(0.5, 
  sum(rate(http_request_duration_seconds_bucket{route="/functions/flags"}[5m])) 
  by (le, x_user_bucket)
)
```

## Recommended Alerts

### High Error Rate
```yaml
- alert: FeatureFlagHighErrorRate
  expr: |
    sum(rate(http_requests_total{route="/functions/flags",flag="profile_ui_revamp",status!="200"}[5m])) /
    sum(rate(http_requests_total{route="/functions/flags",flag="profile_ui_revamp"}[5m])) > 0.005
  for: 15m
  annotations:
    summary: "Feature flag error rate above baseline"
    description: "Profile UI revamp feature flag error rate is {{ $value | humanizePercentage }} over the last 15 minutes"
```

### Rollout Percentage Drift
```yaml
- alert: FeatureFlagRolloutDrift
  expr: |
    abs(
      sum(rate(http_requests_total{route="/functions/flags",flag="profile_ui_revamp",x_canary="true"}[5m])) /
      sum(rate(http_requests_total{route="/functions/flags",flag="profile_ui_revamp"}[5m])) - 0.05
    ) > 0.02
  for: 10m
  annotations:
    summary: "Feature flag rollout percentage drifting from expected"
    description: "Profile UI revamp rollout is {{ $value | humanizePercentage }} off from expected 5%"
```

## Rollout Schedule

| Day | Target Rollout | Validation Checklist |
|-----|---------------|---------------------|
| D+0 | 5% | ✅ No 5xx spikes<br>✅ Hash buckets 0-4 only<br>✅ Error rate < baseline + 0.5% |
| D+2 | 25% | ✅ Error & conversion metrics vs control<br>✅ User feedback monitoring<br>✅ Performance metrics stable |
| D+7 | 100% | ✅ Remove legacy code path<br>✅ Update flag: enabled=false, rollout=100<br>✅ Clean up monitoring |

## SQL Commands

### Check current rollout
```sql
SELECT rollout_percentage FROM feature_flags WHERE name = 'profile_ui_revamp';
```

### Increase to 25%
```sql
UPDATE feature_flags SET rollout_percentage = 25 WHERE name = 'profile_ui_revamp';
```

### Full rollout (100%)
```sql
UPDATE feature_flags SET rollout_percentage = 100 WHERE name = 'profile_ui_revamp';
```

### Disable flag (emergency)
```sql
UPDATE feature_flags SET enabled = false WHERE name = 'profile_ui_revamp';
```
