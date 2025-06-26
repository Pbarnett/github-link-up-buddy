# Duffel Environment Setup Guide

> **Purpose**: Complete guide for setting up Duffel API credentials and environment variables for Parker Flight integration.

## Quick Setup Checklist

- [ ] Create Duffel account
- [ ] Obtain test API key
- [ ] Configure Supabase environment variables
- [ ] Test API connectivity
- [ ] Set up webhook endpoint (optional for initial testing)

---

## Step 1: Create Duffel Account

1. **Sign up for Duffel**
   - Go to [https://app.duffel.com/signup](https://app.duffel.com/signup)
   - Create account with your business email
   - Complete account verification

2. **Access Dashboard**
   - Login to [https://app.duffel.com/dashboard](https://app.duffel.com/dashboard)
   - Navigate to **Settings** → **API Keys**

---

## Step 2: Obtain API Keys

### Test API Key (Required)
1. In Duffel Dashboard → **Settings** → **API Keys**
2. Click **"Create API Key"**
3. Name: `Parker Flight Test`
4. Environment: **Test**
5. Copy the generated key (starts with `duffel_test_`)

### Production API Key (Later)
⚠️ **Don't create production key yet** - wait until testing is complete.

---

## Step 3: Configure Environment Variables

### Option A: Supabase Dashboard (Recommended)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** → **API** → **Edge Function Secrets**
4. Add these secrets:

```
DUFFEL_API_KEY = duffel_test_YOUR_ACTUAL_KEY_HERE
DUFFEL_WEBHOOK_SECRET = your_webhook_secret_here
DUFFEL_LIVE = false
```

### Option B: Local Environment Files
1. **Copy environment templates:**
   ```bash
   cp supabase/.env.example supabase/.env
   ```

2. **Edit `supabase/.env`:**
   ```bash
   # Duffel API Configuration
   DUFFEL_API_KEY=duffel_test_YOUR_ACTUAL_KEY_HERE
   DUFFEL_WEBHOOK_SECRET=your_webhook_secret_here
   DUFFEL_LIVE=false
   ```

3. **Restart Supabase functions:**
   ```bash
   npx supabase functions serve
   ```

---

## Step 4: Test API Connectivity

### Test 1: Basic Connectivity
```bash
# Call the Duffel test function
curl -X POST 'http://localhost:54321/functions/v1/duffel-test' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": true,
  "phase": "Phase 1, Step 1.1",
  "tests": {
    "connectivity": true,
    "offer_request": {
      "id": "orq_...",
      "created": true
    },
    "offers": {
      "count": 5,
      "first_offer": {
        "id": "off_...",
        "amount": "150.00",
        "currency": "USD"
      }
    }
  }
}
```

### Test 2: Flight Search
```bash
# Test flight search functionality
curl -X POST 'http://localhost:54321/functions/v1/duffel-search' \
  -H 'Content-Type: application/json' \
  -d '{
    "origin": "LHR",
    "destination": "JFK", 
    "departure_date": "2025-08-15",
    "passengers": [{"type": "adult"}],
    "cabin_class": "economy"
  }'
```

---

## Step 5: Webhook Setup (Optional for Initial Testing)

### Generate Webhook Secret
```bash
# Generate a random webhook secret
openssl rand -hex 32
```

### Update Environment
Add the generated secret to your environment:
```
DUFFEL_WEBHOOK_SECRET=your_generated_secret_here
```

### Test Webhook Endpoint (Local)
```bash
# Test webhook processing
curl -X POST 'http://localhost:54321/functions/v1/duffel-webhook' \
  -H 'Content-Type: application/json' \
  -H 'x-duffel-signature: sha256=test_signature' \
  -d '{
    "data": {
      "id": "evt_test_123",
      "type": "order.created",
      "object": {
        "id": "ord_test_123",
        "booking_reference": "ABCD123"
      }
    }
  }'
```

---

## Troubleshooting

### Error: "DUFFEL_API_KEY not configured"
**Solution**: Ensure API key is set in Supabase Edge Function Secrets or local `.env` file.

### Error: "Invalid API key format"
**Solution**: Verify key starts with `duffel_test_` for test environment.

### Error: "Rate limit exceeded"
**Solution**: Test API has limits. Wait and retry, or contact Duffel support.

### Error: "Network connectivity issues"
**Solution**: 
1. Check internet connection
2. Verify Supabase functions are running
3. Check firewall settings

---

## Environment Variable Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DUFFEL_API_KEY` | ✅ | `duffel_test_abc123...` | Duffel API authentication key |
| `DUFFEL_WEBHOOK_SECRET` | 📝 | `your_webhook_secret` | For webhook signature verification |
| `DUFFEL_LIVE` | ✅ | `false` | Set to `true` for production |

**Legend:**
- ✅ Required for basic functionality
- 📝 Required for webhooks only

---

## Security Best Practices

### API Key Security
- ✅ **Never commit API keys to git**
- ✅ **Use Supabase Edge Function Secrets for production**
- ✅ **Rotate keys regularly**
- ✅ **Use test keys for development**

### Webhook Security
- ✅ **Always verify webhook signatures**
- ✅ **Use HTTPS in production**
- ✅ **Generate strong webhook secrets**

---

## Next Steps

After completing environment setup:

1. **Test Basic Functions** - Run `duffel-test` function
2. **Test Flight Search** - Use `duffel-search` with real queries  
3. **Verify Database Integration** - Check booking creation
4. **Set up Monitoring** - Add logging and error tracking
5. **Production Preparation** - Obtain production API keys

---

## Support

- **Duffel Documentation**: [https://duffel.com/docs](https://duffel.com/docs)
- **Duffel Support**: [support@duffel.com](mailto:support@duffel.com)
- **Parker Flight Issues**: Create GitHub issue with `duffel` label

---

**File Location**: `docs/DUFFEL_ENVIRONMENT_SETUP.md`  
**Last Updated**: 2025-06-26  
**Maintained By**: Development Team
