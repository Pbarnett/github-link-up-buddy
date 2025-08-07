# 📋 Production Environment Configuration Guide

## Required Environment Variables

### NEXT_PUBLIC_SUPABASE_URL
Supabase project URL
Example: `https://your-project.supabase.co`
### NEXT_PUBLIC_SUPABASE_ANON_KEY
Supabase anonymous key
**⚠️ SENSITIVE** - Handle with care
Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
### SUPABASE_SERVICE_ROLE_KEY
Supabase service role key (server-side)
**⚠️ SENSITIVE** - Handle with care
Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
### STRIPE_SECRET_KEY
Stripe secret key (live mode)
**⚠️ SENSITIVE** - Handle with care
Example: `sk_live_...`
### VITE_STRIPE_PUBLISHABLE_KEY
Stripe publishable key (live mode)
Example: `pk_live_...`
### STRIPE_WEBHOOK_SECRET
Stripe webhook endpoint secret
**⚠️ SENSITIVE** - Handle with care
Example: `whsec_...`
### DUFFEL_API_TOKEN
Duffel API token (live mode)
**⚠️ SENSITIVE** - Handle with care
Example: `duffel_live_...`
### DUFFEL_LIVE_ENABLED
Enable Duffel live mode
Example: `true`
### LAUNCHDARKLY_SERVER_SDK_KEY
LaunchDarkly server SDK key
**⚠️ SENSITIVE** - Handle with care
Example: `sdk-...`
### VITE_LD_CLIENT_ID
LaunchDarkly client-side ID
Example: `your-client-id`
### RESEND_API_KEY
Resend email API key
**⚠️ SENSITIVE** - Handle with care
Example: `re_...`
### JWT_SECRET
JWT signing secret (32+ chars)
**⚠️ SENSITIVE** - Handle with care
Example: `your-very-long-jwt-secret-key-here`
### ENCRYPTION_KEY
Data encryption key (32+ chars)
**⚠️ SENSITIVE** - Handle with care
Example: `your-encryption-key-32-chars-minimum`

## Optional Environment Variables

### AMADEUS_CLIENT_ID
Amadeus API client ID
Example: `your-amadeus-client-id`
### AMADEUS_CLIENT_SECRET
Amadeus API client secret
Example: `your-amadeus-client-secret`
### SLACK_WEBHOOK_URL
Slack webhook for alerts
Example: `https://hooks.slack.com/services/...`
### UPSTASH_REDIS_REST_URL
Upstash Redis REST URL
Example: `https://your-redis.upstash.io`
### UPSTASH_REDIS_REST_TOKEN
Upstash Redis REST token
Example: `your-redis-token`

## Security Best Practices

1. **Never commit sensitive values** to version control
2. **Use different keys** for each environment
3. **Rotate secrets regularly** (quarterly recommended)
4. **Validate all values** before deployment
5. **Monitor for exposed credentials** in logs

## Validation

```bash
npm run validate:env
```

## Deployment

```bash
npm run deploy:production
```