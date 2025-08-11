# 🚀 Parker Flight - Production Operations Runbook

## 📋 Quick Reference

### Emergency Contacts
- **DevOps Lead:** [Your Contact]
- **Production Support:** [24/7 Contact]
- **Security Team:** [Security Contact]

### System Status Dashboard
- **Grafana:** [Your Grafana URL]
- **CloudWatch:** https://console.aws.amazon.com/cloudwatch/
- **Supabase Dashboard:** https://supabase.com/dashboard/project/bbonngdyfyfjqfhvoljl

---

## 🚨 Emergency Procedures

### Critical System Down
```bash
# 1. Check system status
node scripts/deploy-production.js  # Will show health checks

# 2. Emergency rollback
node scripts/rollback-production.js --reason "System down" --emergency

# 3. Check rollback status
# Review rollback-report-*.json for details
```

### High Error Rate Alert
```bash
# 1. Check current load
SUPABASE_URL="https://bbonngdyfyfjqfhvoljl.supabase.co" \
SUPABASE_ANON_KEY="your-key" node scripts/load-test.js

# 2. Review recent deployments
ls -la deployment-report-*.json | tail -5

# 3. If needed, rollback to last known good
node scripts/rollback-production.js --reason "High error rate" --target [commit-hash]
```

### Performance Degradation
```bash
# 1. Run performance test
node scripts/load-test.js

# 2. Check KMS performance
aws kms describe-key --key-id alias/parker-flight-general-production

# 3. Monitor Edge Functions
# Check Supabase dashboard for function performance
```

---

## 📈 Regular Operations

### Daily Health Check
```bash
# Run full deployment validation (non-destructive)
node scripts/deploy-production.js
```

### Weekly Performance Review
```bash
# 1. Run comprehensive load test
node scripts/load-test.js

# 2. Review performance trends
ls -la scripts/load-test-report-*.json | tail -7

# 3. Check monitoring setup
node scripts/setup-monitoring.js
```

### Monthly Rollback Test
```bash
# Test rollback procedures (safe dry run)
node scripts/rollback-production.js --dry-run --reason "Monthly rollback test"
```

---

## 🔧 Deployment Procedures

### Standard Deployment
1. **Push to main branch** → Automatic deployment via GitHub Actions
2. **Manual deployment:**
   ```bash
   node scripts/deploy-production.js
   ```
3. **Verify deployment:**
   - Check deployment report
   - Run load test
   - Monitor dashboard for 15 minutes

### Hotfix Deployment
1. **Create hotfix branch from main**
2. **Apply critical fix**
3. **Deploy immediately:**
   ```bash
   node scripts/deploy-production.js
   ```
4. **Monitor closely for 30 minutes**

### Rollback Deployment
1. **Standard rollback:**
   ```bash
   node scripts/rollback-production.js --reason "Detailed reason"
   ```
2. **Emergency rollback:**
   ```bash
   node scripts/rollback-production.js --reason "Emergency" --emergency
   ```
3. **Verify rollback success**

---

## 📊 Monitoring & Alerts

### Key Metrics to Monitor
- **Response Time:** <100ms (95th percentile)
- **Error Rate:** <1%
- **Throughput:** >25 requests/second
- **KMS Operations:** <5% failure rate
- **Database Connections:** <80 active connections

### Alert Thresholds
- **Critical:** System down, >5% error rate, KMS failures
- **Warning:** >2s response time, >80% resource usage
- **Info:** Deployment notifications, performance changes

### Monitoring Commands
```bash
# Check system health
curl -H "apikey: your-key" https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/

# Validate KMS
aws kms encrypt --key-id alias/parker-flight-general-production --plaintext "test"

# Edge Function status
curl -X POST https://bbonngdyfyfjqfhvoljl.supabase.co/functions/v1/encrypt-data
```

---

## 🔐 Security Procedures

### KMS Key Rotation
```bash
# 1. Create new KMS key
aws kms create-key --description "Parker Flight New Key"

# 2. Update environment variables
# 3. Deploy with new key
node scripts/deploy-production.js

# 4. Validate encryption works
```

### Security Incident Response
1. **Isolate affected systems**
2. **Check recent deployments**
3. **Review access logs**
4. **Apply security patches**
5. **Redeploy with fixes**

---

## 🛠️ Troubleshooting Guide

### Common Issues

#### Deployment Fails at KMS Step
```bash
# Check KMS permissions
aws kms describe-key --key-id alias/parker-flight-general-production

# Verify AWS credentials
aws sts get-caller-identity
```

#### Edge Functions Not Responding
```bash
# Check Supabase connection
curl -H "apikey: your-key" https://bbonngdyfyfjqfhvoljl.supabase.co/rest/v1/

# Redeploy functions
npx supabase functions deploy encrypt-data
npx supabase functions deploy create-payment-method
```

#### High Response Times
```bash
# Run load test to confirm
node scripts/load-test.js

# Check database connections
# Monitor CloudWatch metrics
# Consider scaling resources
```

#### Rollback Fails
```bash
# Check git status
git status
git log --oneline -10

# Manual rollback if needed
git reset --hard [previous-commit]
node scripts/deploy-production.js
```

---

## 📋 Performance Baselines

### Expected Performance (Load Test Results)
```json
{
  "rest_api": {
    "requests_per_second": "40-50",
    "response_time_ms": "20-35",
    "error_rate": "<1%"
  },
  "edge_functions": {
    "encrypt_data": {
      "requests_per_second": "25-35",
      "response_time_ms": "35-50"
    },
    "create_payment_method": {
      "requests_per_second": "40-45", 
      "response_time_ms": "20-30"
    }
  }
}
```

### Deployment Benchmarks
- **Standard Deployment:** 20-35 seconds
- **Emergency Rollback:** <10 seconds
- **Health Check Validation:** <5 seconds
- **Load Test Execution:** 15-20 seconds

---

## 🎯 SLA Targets

### Availability
- **Uptime:** 99.9% (8.7 hours downtime/year)
- **Response Time:** 95th percentile <100ms
- **Error Rate:** <0.1%

### Recovery Time Objectives
- **Detection Time:** <2 minutes
- **Response Time:** <5 minutes
- **Recovery Time:** <10 minutes (via rollback)

### Performance Targets
- **Throughput:** 100+ requests/second
- **Concurrent Users:** 1000+
- **Data Processing:** <50ms for encryption operations

---

## 📞 Escalation Matrix

### Level 1: Application Issues
- **Action:** Standard troubleshooting
- **Tools:** Health checks, monitoring dashboards
- **Escalation Time:** 15 minutes

### Level 2: Service Degradation
- **Action:** Performance analysis, potential rollback
- **Tools:** Load testing, metric analysis
- **Escalation Time:** 30 minutes

### Level 3: Critical System Failure
- **Action:** Emergency rollback, incident response
- **Tools:** All available resources
- **Escalation Time:** Immediate

---

## 🔄 Change Management

### Deployment Windows
- **Standard:** Anytime (automated)
- **Major Changes:** Business hours with approval
- **Emergency:** 24/7 with incident commander approval

### Approval Process
- **Hotfixes:** DevOps lead approval
- **Features:** Code review + testing
- **Infrastructure:** Security + DevOps approval

### Documentation Requirements
- All deployments logged in deployment reports
- Performance impact documented
- Rollback procedures tested

---

## 📚 Additional Resources

### Documentation
- [Deployment Summary](./DEPLOYMENT_SUMMARY.md)
- [Environment Template](./.env.production.template)
- [GitHub Actions Workflow](./.github/workflows/production-deploy.yml)

### Tools & Scripts
- Production Deployment: `scripts/deploy-production.js`
- Emergency Rollback: `scripts/rollback-production.js`
- Load Testing: `scripts/load-test.js`
- Monitoring Setup: `scripts/setup-monitoring.js`

### External Services
- **AWS Console:** https://console.aws.amazon.com/
- **Supabase Dashboard:** https://supabase.com/dashboard/
- **GitHub Actions:** https://github.com/[your-repo]/actions

---

*This runbook should be reviewed monthly and updated with any operational changes.*
