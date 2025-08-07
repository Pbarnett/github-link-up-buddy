# 🎛️ LaunchDarkly Feature Flags - Complete Setup Guide

## 🌐 STEP 1: Access LaunchDarkly
1. Visit: **https://app.launchdarkly.com**
2. Sign in with your account
3. Go to **"Feature Flags"** in left sidebar

---

## 🎯 STEP 2: Create 7 Feature Flags
Click **"+ Flag"** button for each flag below:

### 1️⃣ `auto_booking_pipeline_enabled`
- **Type**: Boolean
- **Key**: `auto_booking_pipeline_enabled`
- **Name**: Auto Booking Pipeline Enabled
- **Description**: Master switch for the entire auto-booking pipeline
- **Default variation**: `false` (OFF)
- **Variations**: true, false
- 🔴 **IMPORTANT**: Keep this OFF until you're ready to go live!

### 2️⃣ `auto_booking_emergency_disable`
- **Type**: Boolean
- **Key**: `auto_booking_emergency_disable`
- **Name**: Auto Booking Emergency Disable
- **Description**: Emergency kill switch to immediately disable all auto-booking
- **Default variation**: `false` (OFF)
- **Variations**: true, false
- 🚨 **EMERGENCY**: Turn this ON to stop everything immediately!

### 3️⃣ `flight_monitoring_enabled`
- **Type**: Boolean
- **Key**: `flight_monitoring_enabled`
- **Name**: Flight Monitoring Enabled
- **Description**: Enable continuous flight price monitoring
- **Default variation**: `true` (ON)
- **Variations**: true, false

### 4️⃣ `payment_processing_enabled`
- **Type**: Boolean
- **Key**: `payment_processing_enabled`
- **Name**: Payment Processing Enabled
- **Description**: Enable payment processing for bookings
- **Default variation**: `true` (ON)
- **Variations**: true, false

### 5️⃣ `concurrency_control_enabled`
- **Type**: Boolean
- **Key**: `concurrency_control_enabled`
- **Name**: Concurrency Control Enabled
- **Description**: Enable Redis-based concurrency control
- **Default variation**: `true` (ON)
- **Variations**: true, false

### 6️⃣ `max_concurrent_bookings`
- **Type**: Number
- **Key**: `max_concurrent_bookings`
- **Name**: Max Concurrent Bookings
- **Description**: Maximum number of concurrent booking attempts
- **Default variation**: `3`
- **Variations**: Use default number variations

### 7️⃣ `booking_timeout_seconds`
- **Type**: Number
- **Key**: `booking_timeout_seconds`
- **Name**: Booking Timeout Seconds
- **Description**: Timeout in seconds for booking operations
- **Default variation**: `300`
- **Variations**: Use default number variations

---

## 🎯 TARGETING RULES (Optional but Recommended)

For each flag, you can set targeting rules:
- **Production environment**: Start with defaults
- **Internal testing**: Enable features for your team
- **Gradual rollout**: Control who sees new features

### Recommended Initial Settings:
- `auto_booking_pipeline_enabled`: **OFF** for all users (manual activation)
- `auto_booking_emergency_disable`: **OFF** for all users (emergency only)
- `flight_monitoring_enabled`: **ON** for internal team, **OFF** for others
- `payment_processing_enabled`: **ON** for internal team, **OFF** for others
- `concurrency_control_enabled`: **ON** for all (safe to enable)
- `max_concurrent_bookings`: **3** for all (conservative limit)
- `booking_timeout_seconds`: **300** for all (5 minute timeout)

---

## 🔐 SECURITY SETTINGS

- ✅ Keep `auto_booking_pipeline_enabled` **OFF** initially
- ✅ All other flags can use default settings
- ✅ Emergency disable flag should always be **OFF** unless needed
- ✅ Test with internal team before public rollout

---

## 🧪 TESTING YOUR FLAGS

After creating all flags, run:
```bash
node scripts/test-production-readiness.ts
```

This will verify your LaunchDarkly integration is working correctly.

---

## 🚀 GO LIVE PROCESS

1. **Phase 1**: Create all 7 flags (keep master switch OFF)
2. **Phase 2**: Enable monitoring and processing flags for testing
3. **Phase 3**: Deploy Supabase Edge Functions
4. **Phase 4**: Test complete pipeline in dry-run mode
5. **Phase 5**: Enable master switch when ready for live bookings

---

## 🚨 EMERGENCY CONTROLS

### Immediate Stop Everything:
Turn **ON**: `auto_booking_emergency_disable`

### Stop New Bookings:
Turn **OFF**: `auto_booking_pipeline_enabled`

### Control System Load:
- Reduce: `max_concurrent_bookings` (from 3 to 1)
- Reduce: `booking_timeout_seconds` (from 300 to 120)

---

## 📞 SUPPORT

- **LaunchDarkly Support**: https://support.launchdarkly.com
- **Documentation**: https://docs.launchdarkly.com
- **Your SDK Key**: `sdk-382cff6d-3979-48...` (configured)
- **Your Client ID**: `686f3ab8ed094f0948726002` (configured)
