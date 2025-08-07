# AlertManager Multi-Channel Notifications Setup Guide

## ✅ COMPLETED

### 1. Basic AlertManager Configuration
- ✅ AlertManager container is running successfully
- ✅ Basic routing by severity levels (critical, warning, info)
- ✅ Webhook notifications to Uptime Kuma (port 3002)
- ✅ Proper inhibition rules to prevent spam
- ✅ Environment file template created

### 2. Configuration Structure
- ✅ `alertmanager.yml` - Main configuration file
- ✅ `.env.example` - Template for secrets
- ✅ `.env` - Created (needs your actual secrets)

## 🔄 NEXT STEPS TO COMPLETE

### 1. Add Your Actual Notification Endpoints

#### Slack Setup
1. Create a Slack app and get webhook URL
2. Update `alertmanager.yml` to add slack_configs:
```yaml
slack_configs:
  - api_url: 'YOUR_SLACK_WEBHOOK_URL'
    channel: '#alerts'
    title: 'Parker Flight Alert'
    text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

#### PagerDuty Setup
1. Create PagerDuty integration and get routing key
2. Add pagerduty_configs to critical alerts:
```yaml
pagerduty_configs:
  - routing_key: 'YOUR_PAGERDUTY_KEY'
    description: '{{ .GroupLabels.alertname }}: {{ .CommonAnnotations.summary }}'
```

#### Email Setup
1. Configure SMTP settings in global section
2. Add email_configs to receivers:
```yaml
email_configs:
  - to: 'alerts@parker-flight.com'
    subject: '[Parker Flight] {{ .GroupLabels.alertname }}'
```

### 2. Update Environment Variables
Edit `monitoring/alertmanager/.env` with your actual values:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/ACTUAL/WEBHOOK
PAGERDUTY_INTEGRATION_KEY=your-actual-pagerduty-key
SMTP_PASSWORD=your-actual-smtp-password
```

### 3. Test the Setup
1. Access AlertManager UI: http://localhost:9093
2. Send test alerts to verify routing works
3. Check that notifications are received in each channel

### 4. Optional Enhancements
- Add Discord notifications
- Add Microsoft Teams notifications
- Create custom alert templates
- Set up alert grouping by service/component

## 📁 Current File Structure
```
monitoring/
├── alertmanager/
│   ├── alertmanager.yml      # ✅ Main config (basic working version)
│   ├── .env.example          # ✅ Template for secrets
│   ├── .env                  # ✅ Your secrets (fill this in)
│   └── SETUP_GUIDE.md        # ✅ This guide
```

## 🚀 Ready to Use
Your AlertManager is now running with:
- ✅ Working webhook notifications to Uptime Kuma
- ✅ Proper alert routing by severity
- ✅ Configuration ready for Slack, PagerDuty, and Email

To complete the setup, just add your actual notification endpoints and restart AlertManager!
