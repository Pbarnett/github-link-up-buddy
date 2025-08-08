# Project Scripts Guide 📋

Complete reference for all available scripts and commands for managing the GitHub Link Up Buddy - Flight Booking Platform. This guide covers scripts organized by function according to the repository organization guidelines.

---

## 🚀 **Main Management Scripts**

### **Lifecycle Management**

#### 1. **System Health Check**
```bash
./monitoring-check.sh
```
**What it does:**
- Checks if the system is healthy and responding
- Shows current statistics (total customers processed, anonymized, deleted)
- Verifies all endpoints are working
- Displays last update timestamp

**When to use:** Daily/weekly to verify system is running properly

---

#### 2. **View Audit Logs**
```bash
./view-audit-logs.sh
```
**What it does:**
- Shows recent customer lifecycle actions (last 10 entries)
- Displays summary of all actions taken (how many anonymized, deleted, etc.)
- Provides command to see full audit trail
- Shows timestamps, customer IDs, and reasons for each action

**When to use:** When you need to see what the system has been doing, for compliance audits, or troubleshooting

---

#### 3. **Manual Lifecycle Execution (Dry Run)**
```bash
./manual-lifecycle-run.sh
```
**What it does:**
- Runs the customer lifecycle process manually in TEST MODE
- Identifies inactive customers but doesn't actually change anything
- Shows what WOULD happen if run in production
- Safe to run anytime - won't modify data

**When to use:** Testing, debugging, or seeing what customers would be affected before running for real

---

#### 4. **Manual Lifecycle Execution (Production)**
```bash
./manual-lifecycle-run.sh --production
```
**What it does:**
- Runs the customer lifecycle process for REAL
- Actually anonymizes and deletes customer data
- Processes customers according to the configured rules
- Creates audit log entries for all actions

**When to use:** Emergency situations or when you need to trigger processing outside the scheduled time

**⚠️ CAUTION:** This makes real changes to customer data!

---

### **Monitoring & Health Checks**

#### 5. **Health Check Script**
```bash
./scripts/health-check.sh
```
**What it does:**
- Performs comprehensive health checks, beyond simple HTTP status
- Checks HTTP responses, response times, nginx config, permissions, disk space, memory

**When to use:** Regularly or before deployment to ensure the system is fully operational

---

#### 6. **Health Monitor**
```bash
./scripts/health-monitor.sh
```
**What it does:**
- Checks if the container is running
- Sends alerts if down, attempts restart
- Verifies health endpoint and can restart container

**When to use:** Continuous background monitoring

---

#### 7. **Application Monitoring**
```bash
./scripts/monitor-app.sh
```
**What it does:**
- Monitors key metrics for high-traffic apps
- Sends alerts to Slack, logs resource usage, checks endpoints

**When to use:** Continuous monitoring of app performance

---

#### 8. **Monitoring Status**
```bash
./scripts/monitoring-status.sh
```
**What it does:**
- Checks the status of various monitoring services and displays URL links
- Shows sample metrics data

**When to use:** To verify all monitoring services are running and collecting data

---

#### 9. **Performance Monitor**
```bash
./scripts/performance-monitor.sh
```
**What it does:**
- Logs Docker container performance metrics
- Alerts for high CPU/Memory usage

**When to use:** To keep an eye on container resource consumption

---

### **System Deployment & Setup**

#### 10. **Quick Start Development**
```bash
./scripts/utils/quick-start.sh
```
**What it does:**
- Quick setup for development environment
- Starts Supabase and frontend

**When to use:** Fast startup for local development

---

#### 11. **Deploy Production**
```bash
./scripts/deploy-production.sh
```
**What it does:**
- Sets up production environment using Docker
- Backs up current state, pulls latest images, ensures health

**When to use:** For deploying updates to production

---

#### 12. **Deployment Readiness Test**
```bash
./scripts/test-deployment-ready.sh
```
**What it does:**
- Tests readiness of system for production deployment
- Checks build artifacts, feature implementation, infra settings

**When to use:** Before deploying to ensure everything is in place

---

#### 13. **Validate Production Ready**
```bash
./scripts/validate-production-ready.sh
```
**What it does:**
- Validates that the system is ready for production
- Performs network, container, security, performance checks

**When to use:** Before finalizing production deployment

---

### **Utilities & Maintenance**

#### 14. **Complete System Deployment**
```bash
./scripts/deploy-bluegreen.sh
```
**What it does:**
- Deploys the entire Customer Lifecycle Management system
- Sets up database tables and security policies
- Creates monitoring scripts
- Installs cron jobs for automated processing
- Runs health checks and verifies deployment

**When to use:** Initial setup or when redeploying the entire system

---

#### 15. **Direct Database Query (Audit Log)**
```bash
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "apikey: $SUPABASE_ANON_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/customer_lifecycle_audit?select=*&order=performed_at.desc&limit=20"
```
**What it does:**
- Directly queries the audit database table
- Returns raw JSON data of lifecycle actions
- Can be customized with different filters and limits
- Shows complete details including metadata

**When to use:** Advanced analysis, custom reporting, or integration with other tools

---

#### 16. **Current System Statistics (API)**
```bash
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=stats"
```
**What it does:**
- Gets real-time statistics from the system
- Returns JSON with counts of processed customers
- Shows last update timestamp
- Indicates system health

**When to use:** API integration, custom dashboards, or programmatic monitoring

---

#### 17. **System Health Check (API)**
```bash
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=health"
```
**What it does:**
- Checks if the system endpoints are responding
- Verifies database connectivity
- Returns simple health status
- Useful for automated monitoring

**When to use:** Automated health monitoring, CI/CD pipelines, or external monitoring systems

---

## ⏰ **Automated System Management**

### 9. **Cron Job Script (Automated)**
```bash
/usr/local/bin/lifecycle-cron.sh
```
**What it does:**
- Automatically runs every Sunday at 2:00 AM
- Executes the customer lifecycle process
- Logs all results to `/var/log/customer-lifecycle.log`
- Sends email alerts on failures (if configured)

**When to use:** This runs automatically - you don't need to run it manually

**To check if it's installed:**
```bash
sudo crontab -l
```

---

### 10. **View Cron Job Logs**
```bash
sudo tail -f /var/log/customer-lifecycle.log
```
**What it does:**
- Shows logs from the automated cron job execution
- Displays results of weekly processing
- Shows any errors or issues during automated runs
- Follows the log file in real-time

**When to use:** Troubleshooting automated runs, verifying weekly processing worked

---

## 🛠️ **Troubleshooting & Maintenance**

### 11. **Check Cron Job Status**
```bash
sudo crontab -l
```
**What it does:**
- Lists all installed cron jobs
- Verifies the lifecycle cron job is installed
- Shows the schedule (should show: `0 2 * * 0 /usr/local/bin/lifecycle-cron.sh`)

**When to use:** Verifying automated processing is set up correctly

---

### 12. **Manual Test API Endpoints**
```bash
# Health Check
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=health"

# Statistics  
curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/customer-lifecycle-scheduler?action=stats"

# Trigger Processing
curl -X POST -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
     -H "Content-Type: application/json" \
     "https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/lifecycle-cron-scheduler" \
     -d '{"dryRun": true}'
```
**What it does:**
- Tests individual API endpoints directly
- Bypasses the wrapper scripts
- Useful for debugging specific endpoint issues
- Can customize parameters for testing

**When to use:** Debugging, testing specific functionality, or API integration development

---

## 📋 **Quick Reference Commands**

| Task | Command | Safe? |
|------|---------|--------|
| Check system health | `./monitoring-check.sh` | ✅ Safe |
| View what happened | `./view-audit-logs.sh` | ✅ Safe |
| Test what would happen | `./manual-lifecycle-run.sh` | ✅ Safe (dry run) |
| Process customers for real | `./manual-lifecycle-run.sh --production` | ⚠️ Makes changes |
| Check automated job | `sudo crontab -l` | ✅ Safe |
| View automation logs | `sudo tail /var/log/customer-lifecycle.log` | ✅ Safe |
| Deploy whole system | `./scripts/deploy-bluegreen.sh` | ⚠️ System changes |

---

## 🚨 **Emergency Procedures**

### If the system stops working:
1. Run `./monitoring-check.sh` to see what's wrong
2. Check `sudo tail /var/log/customer-lifecycle.log` for errors
3. Test manually with `./manual-lifecycle-run.sh` (dry run)
4. If needed, redeploy with `./scripts/deploy-bluegreen.sh`

### If you need immediate processing:
1. Run `./manual-lifecycle-run.sh --production` (be careful!)
2. Check results with `./view-audit-logs.sh`

### For compliance audits:
1. Run `./view-audit-logs.sh` for recent activity
2. Use the curl command to get full audit trail
3. Check `sudo tail /var/log/customer-lifecycle.log` for automation logs

---

## 📝 **Environment Variables Required**

Make sure these are set before running any scripts:
```bash
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
export SUPABASE_ANON_KEY="your_anon_key"  
export TWILIO_AUTH_TOKEN="your_twilio_token"
```

---

**🎯 Most Common Daily Commands:**
- `./monitoring-check.sh` - Check if everything is working
- `./view-audit-logs.sh` - See what the system has been doing
- `./manual-lifecycle-run.sh` - Test run to see what would happen

**📞 Need Help?** Check the logs first, then run a test to see what's happening!
