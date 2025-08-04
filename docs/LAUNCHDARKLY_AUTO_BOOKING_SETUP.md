# LaunchDarkly Auto-Booking Feature Flags Setup

## Required Feature Flags

Your auto-booking system needs these two critical feature flags in LaunchDarkly:

### 1. `auto_booking_pipeline_enabled` (Boolean)
- **Purpose**: Main toggle for the entire auto-booking feature
- **Default Value**: `false` (disabled by default)
- **Description**: "Enables the automated flight booking pipeline for users"
- **Targeting**: 
  - Start with internal team emails only
  - Gradually increase percentage: 5% → 20% → 50% → 100%

### 2. `auto_booking_emergency_disable` (Boolean)
- **Purpose**: Emergency kill switch to instantly disable all auto-booking
- **Default Value**: `false` (not disabled)
- **Description**: "Emergency disable for auto-booking - overrides all other flags"
- **Targeting**: Global (affects all users when enabled)

## Setup Instructions

### In LaunchDarkly Dashboard:

1. **Go to Feature Flags** in your LaunchDarkly project

2. **Create Flag #1:**
   ```
   Flag Key: auto_booking_pipeline_enabled
   Name: Auto-Booking Pipeline
   Description: Enables the automated flight booking pipeline for users
   Flag Type: Boolean
   Default Value: false
   ```

3. **Create Flag #2:**
   ```
   Flag Key: auto_booking_emergency_disable
   Name: Auto-Booking Emergency Disable
   Description: Emergency disable for auto-booking - overrides all other flags
   Flag Type: Boolean
   Default Value: false
   ```

### Initial Targeting Rules:

**For `auto_booking_pipeline_enabled`:**
1. Create a segment called "Internal Team" with your team email addresses
2. Target this segment with `true`
3. Set fallback to `false` for all other users

**For `auto_booking_emergency_disable`:**
1. Keep targeting simple - just the default value
2. Only change to `true` in emergencies

## Environment Variables

Make sure these are set in your environment:

```bash
# LaunchDarkly Client SDK (for React frontend)
VITE_LD_CLIENT_ID=your-client-side-id

# LaunchDarkly Server SDK (for Edge Functions)
LAUNCHDARKLY_SERVER_SDK_KEY=your-server-sdk-key
```

## Testing the Flags

After setup, test with:
```bash
npx tsx scripts/test-feature-flags.ts
```

## Progressive Rollout Plan

1. **Phase 1**: Internal team only (0% public)
2. **Phase 2**: 5% of users (monitor closely)
3. **Phase 3**: 20% of users (if no issues)
4. **Phase 4**: 50% of users (scale monitoring)
5. **Phase 5**: 100% rollout (full launch)

## Emergency Procedures

If issues occur:
1. **Immediate**: Set `auto_booking_emergency_disable` to `true`
2. **Follow-up**: Investigate and fix issues
3. **Recovery**: Set emergency flag back to `false` when ready

## Monitoring

Watch these metrics during rollout:
- Auto-booking success rate
- Payment failure rate
- User complaints/support tickets
- System error rates
- Performance metrics
