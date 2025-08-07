# Email Notifications Setup Guide

## Quick Setup with Gmail (Recommended)

### Step 1: Create Gmail App Password

1. **Go to Google Account settings**: https://myaccount.google.com/
2. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to "Security" → "2-Step Verification"
   - Follow the setup process
3. **Create App Password**:
   - Go to "Security" → "2-Step Verification" → "App passwords"
   - Select "Mail" and your device
   - Copy the 16-character password (like: `abcd efgh ijkl mnop`)

### Step 2: Update .env File

Edit `monitoring/alertmanager/.env` and replace:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-actual-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM=your-actual-email@gmail.com
ALERT_EMAIL_TO=your-actual-email@gmail.com
```

**Example:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=parker@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=parker@gmail.com
ALERT_EMAIL_TO=parker@gmail.com
```

### Step 3: Restart Monitoring Stack

```bash
cd monitoring
docker-compose down
docker-compose up -d
```

## Alternative Email Providers

### Apple iCloud Mail
```bash
SMTP_HOST=smtp.mail.me.com
SMTP_PORT=587
SMTP_USERNAME=your-icloud-email@icloud.com
```

### Outlook/Hotmail
```bash
SMTP_HOST=smtp.live.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
```

### Yahoo Mail
```bash
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
```

## Testing Email Alerts

Once configured, you can test by:

1. **Simulate high CPU usage**:
   ```bash
   # This will trigger a CPU alert
   yes > /dev/null &
   # Stop it after a few seconds with: kill %1
   ```

2. **Check AlertManager**: http://localhost:9093
3. **Check your email** for alert notifications

## Email Types You'll Receive

- **🚨 CRITICAL**: Immediate attention needed (red alerts)
- **⚠️ WARNING**: Monitor closely (yellow alerts)  
- **ℹ️ INFO**: Informational updates (blue alerts)

## Troubleshooting

### Common Issues:
1. **"Authentication failed"**: Double-check app password
2. **"Connection refused"**: Check SMTP_HOST and SMTP_PORT
3. **No emails received**: Check spam folder first

### Debug Steps:
```bash
# Check AlertManager logs
docker-compose logs alertmanager

# Check if AlertManager is receiving alerts
curl http://localhost:9093/api/v1/alerts
```

## Security Notes

✅ **Your setup is secure because:**
- App passwords are safer than your main password
- `.env` file is excluded from Git
- Secrets stay on your local machine
- No credentials in code or logs

❌ **Never do:**
- Commit the `.env` file to Git
- Share your app password
- Use your main Gmail password
