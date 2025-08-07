# Parker Flight Alert Notification Options

## Current Setup
Your AlertManager is configured to send webhooks to `http://host.docker.internal:3002/webhook/alerts`. This is very flexible!

## Option 1: Email Alerts (Simple Setup)
Add to `monitoring/alertmanager/alertmanager.yml`:

```yaml
receivers:
  - name: 'parker-flight-email'
    email_configs:
      - to: 'your-email@example.com'
        from: 'alerts@parker-flight.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alerts@parker-flight.com'
        auth_password: 'your-app-password'
        subject: '[Parker Flight] {{ .Status }}: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Severity: {{ .Labels.severity }}
          {{ end }}
```

## Option 2: Discord/Teams Webhook (Current Webhook Setup)
Your current webhook can be adapted for:
- **Discord**: Change URL to Discord webhook
- **Microsoft Teams**: Change URL to Teams webhook  
- **Custom Service**: Create your own webhook receiver

## Option 3: Console/Log Alerts (Development)
```yaml
receivers:
  - name: 'console-alerts'
    webhook_configs:
      - url: 'http://localhost:8080/console-webhook'
```

## Option 4: Multiple Channels by Severity
```yaml
route:
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'  # Email + Webhook
    - match:  
        severity: warning
      receiver: 'warning-alerts'   # Just webhook

receivers:
  - name: 'critical-alerts'
    email_configs: [...]
    webhook_configs: [...]
  - name: 'warning-alerts'  
    webhook_configs: [...]
```

## Quick Test Command
```bash
# Test AlertManager config
curl -X POST http://localhost:9093/api/v1/alerts -d '[
  {
    "labels": {"alertname": "TestAlert", "severity": "warning"},
    "annotations": {"summary": "Test alert from Parker Flight"}
  }
]'
```

## Recommended Next Steps
1. **Start Simple**: Use console/webhook for development
2. **Add Email**: For important production alerts  
3. **Scale Up**: Add Slack/Discord/PagerDuty later

Your webhook setup at port 3002 is already perfect - just point it where you want notifications to go!
