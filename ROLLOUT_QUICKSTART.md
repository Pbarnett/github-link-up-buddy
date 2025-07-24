# Coordinated Feature Rollout - Quick Start Guide

## 🚀 Overview

This guide helps you quickly set up and run the coordinated feature rollout for `wallet_ui` and `profile_ui_revamp` features using the validated rollout script.

## ✅ Prerequisites

1. **Dependencies**: PostgreSQL client (`psql`), `curl`, `jq`, and `bc`
2. **Database**: Access to your development/staging database
3. **LaunchDarkly**: Development environment SDK keys
4. **API Server**: Your development API server running on localhost:3000

## 🔧 Quick Setup (2 minutes)

### Step 1: Update Environment Configuration

Edit `.env.rollout-dev` and replace these values:

```bash
# 1. Database Connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/github_link_up_buddy_dev"
# OR for Supabase:
# DATABASE_URL="postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres"

# 2. LaunchDarkly Keys (get from LaunchDarkly dashboard)
LAUNCHDARKLY_SDK_KEY="sdk-your_actual_development_key"
VITE_LD_CLIENT_ID="your_actual_development_client_id"
```

### Step 2: Test Your Setup

```bash
# Run the comprehensive test suite
./scripts/test-rollout-dev.sh
```

This validates everything and ensures you're ready to proceed.

### Step 3: Run the Rollout

```bash
# Load development environment
source .env.rollout-dev

# Option A: Validation only (safe, no changes)
./scripts/coordinated-feature-rollout.sh --validate-only

# Option B: Dry run (simulate the entire process)
./scripts/coordinated-feature-rollout.sh --dry-run

# Option C: Actual rollout (with manual approvals)
./scripts/coordinated-feature-rollout.sh

# Option D: Automated rollout (skip manual approvals)
./scripts/coordinated-feature-rollout.sh --skip-user-input
```

## 📊 Rollout Process

The script will automatically:

1. **Validate dependencies** and database connection
2. **Roll out in stages**: 5% → 10% → 25% → 50% → 75% → 100%
3. **Monitor metrics** for 30 minutes between each stage
4. **Request approval** before proceeding to next stage
5. **Emergency rollback** if issues are detected

## 🚨 Emergency Procedures

### Immediate Rollback
```bash
./scripts/coordinated-feature-rollout.sh --rollback
```

### Monitor Current Status
```bash
# Check current feature flag status
source .env.rollout-dev
psql "$DATABASE_URL" -c "SELECT name, enabled, rollout_percentage FROM feature_flags WHERE name IN ('wallet_ui', 'profile_ui_revamp');"
```

## 🎯 Feature Flags Being Managed

- **`wallet_ui`**: Primary wallet interface features
- **`profile_ui_revamp`**: Updated profile user interface

Both flags are coordinated to roll out together for consistent user experience.

## 📈 Monitoring

During rollout, the script monitors:
- **Error rates** (threshold: 5%)
- **Feature usage metrics**
- **Database performance**
- **API health checks**

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Test connection manually
   psql "$DATABASE_URL" -c "SELECT 1;"
   ```

2. **LaunchDarkly Authentication Failed**
   - Verify SDK key is correct
   - Check if key has appropriate permissions
   - Ensure environment is set to "development"

3. **API Health Check Failed**
   ```bash
   # Start your development server
   npm run dev
   # OR
   yarn dev
   ```

### Get Help

```bash
# View detailed help
./scripts/coordinated-feature-rollout.sh --help

# View test script help
./scripts/test-rollout-dev.sh --help
```

## 🚀 Production Readiness

After successful development testing:

1. **Create `.env.rollout-prod`** with production values
2. **Test in staging environment** first
3. **Coordinate with stakeholders** for production rollout
4. **Schedule maintenance window** if needed
5. **Prepare rollback plan** and communication

## 📋 Checklist

- [ ] `.env.rollout-dev` configured with actual values
- [ ] Test suite passes (`./scripts/test-rollout-dev.sh`)
- [ ] Development database accessible
- [ ] LaunchDarkly development environment configured
- [ ] Feature flags created in LaunchDarkly dashboard
- [ ] Development API server running
- [ ] Stakeholders notified of development rollout
- [ ] Monitoring dashboards ready
- [ ] Emergency contacts available

## 🎉 Success!

Once rollout completes successfully, you'll see:
- Both feature flags at target rollout percentage
- Comprehensive rollout report
- Audit trail of all changes
- Monitoring recommendations for next 24 hours

---

*For detailed technical documentation, see `scripts/coordinated-feature-rollout.sh` and the validation report.*
