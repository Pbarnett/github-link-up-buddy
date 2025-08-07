# 🔐 Production API Keys Setup Guide

## 🎯 **Critical: Your App Needs Real API Keys to Function**

Your GitHub Link Up Buddy is running perfectly, but needs production API credentials to be fully functional.

---

## 📋 **Required API Keys Checklist**

### **✅ 1. Supabase Database (CRITICAL)**
🔗 **Setup**: [supabase.com/dashboard](https://supabase.com/dashboard)

```bash
# What you need:
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Steps:**
1. Create new Supabase project
2. Go to Settings → API
3. Copy Project URL and API keys
4. Update `.env.production`

---

### **✅ 2. Stripe Payments (CRITICAL)**
🔗 **Setup**: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

```bash
# Switch to LIVE mode first!
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Steps:**
1. Toggle to "Live mode" in Stripe dashboard
2. Reveal and copy live API keys
3. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
4. Update `.env.production`

---

### **✅ 3. Google OAuth (CRITICAL)**
🔗 **Setup**: [console.developers.google.com](https://console.developers.google.com/)

```bash
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
```

**Steps:**
1. Create new Google Cloud project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs:
   - `https://yourdomain.com/auth/callback/google`
   - `http://localhost:3001/auth/callback/google` (for testing)

---

### **✅ 4. GitHub OAuth (CRITICAL)**
🔗 **Setup**: [github.com/settings/applications/new](https://github.com/settings/applications/new)

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**Steps:**
1. Create new OAuth App
2. Set Authorization callback URL: `https://yourdomain.com/auth/callback/github`
3. Copy Client ID and Secret

---

### **✅ 5. Discord OAuth (IMPORTANT)**
🔗 **Setup**: [discord.com/developers/applications](https://discord.com/developers/applications)

```bash
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

**Steps:**
1. Create new application
2. Go to OAuth2 → General
3. Add redirect: `https://yourdomain.com/auth/callback/discord`

---

### **✅ 6. Amadeus Travel API (CRITICAL)**
🔗 **Setup**: [developers.amadeus.com](https://developers.amadeus.com/)

```bash
AMADEUS_API_KEY=your_production_api_key
AMADEUS_API_SECRET=your_production_secret
AMADEUS_ENVIRONMENT=production
```

**Steps:**
1. Create production application
2. Get production credentials (not test)
3. Ensure sufficient API quota for flight searches

---

### **✅ 7. AWS Secrets Manager (IMPORTANT)**
🔗 **Setup**: [aws.amazon.com/console](https://aws.amazon.com/console)

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Steps:**
1. Create IAM user with Secrets Manager permissions
2. Generate access keys
3. Create secrets for sensitive data

---

### **✅ 8. LaunchDarkly Feature Flags (OPTIONAL)**
🔗 **Setup**: [app.launchdarkly.com](https://app.launchdarkly.com/)

```bash
LAUNCHDARKLY_SDK_KEY=sdk-your-production-key
VITE_LD_CLIENT_ID=your-client-id
```

---

## 🚀 **Quick Setup Commands**

### **1. Update Environment File**
```bash
# Edit production environment
nano .env.production

# Or use your preferred editor
code .env.production
```

### **2. Restart Container with New Keys**
```bash
# Restart to pick up new environment variables
docker restart github-link-up-buddy-prod

# Verify it's running
curl http://localhost:3001/health
```

### **3. Test Critical Functions**
```bash
# Test the app
open http://localhost:3001/

# Check logs for any errors
docker logs -f github-link-up-buddy-prod
```

---

## ⚡ **Priority Order for Setup**

### **🔥 IMMEDIATE (App won't work without these):**
1. **Supabase** - Database and authentication
2. **Stripe** - Payment processing  
3. **Google OAuth** - User login
4. **Amadeus** - Flight search functionality

### **🟡 IMPORTANT (Features won't work):**
5. **GitHub OAuth** - Alternative login
6. **AWS** - Enhanced security features
7. **Discord OAuth** - Additional login option

### **🟢 OPTIONAL (Nice to have):**
8. **LaunchDarkly** - Feature flag management

---

## 🧪 **Testing Your Setup**

After updating API keys, test these critical paths:

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Test authentication (visit in browser)
open http://localhost:3001/login

# 3. Test flight search (requires login)
# Visit app and try searching for flights

# 4. Monitor logs for errors
docker logs -f github-link-up-buddy-prod
```

---

## 🔒 **Security Best Practices**

### **Environment Variables:**
- Never commit real API keys to git
- Use `.env.production` (already in .gitignore)
- Rotate keys regularly

### **API Key Permissions:**
- Use least-privilege access
- Enable webhook security
- Monitor API usage

### **Domain Security:**
- Always use HTTPS in production
- Set proper CORS origins
- Validate redirect URIs

---

## 🚨 **Common Issues & Solutions**

### **"OAuth redirect URI mismatch"**
```bash
# Make sure OAuth apps have correct callback URLs:
# Google: https://yourdomain.com/auth/callback/google
# GitHub: https://yourdomain.com/auth/callback/github
```

### **"Stripe webhook signature verification failed"**
```bash
# Ensure webhook endpoint is: https://yourdomain.com/api/stripe/webhook
# Copy exact webhook secret from Stripe dashboard
```

### **"Supabase connection failed"**
```bash
# Verify project URL format: https://PROJECT_ID.supabase.co
# Check if project is active and billing is set up
```

---

## 📞 **Support Resources**

- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe**: [stripe.com/docs](https://stripe.com/docs) 
- **Google OAuth**: [developers.google.com/identity](https://developers.google.com/identity)
- **Amadeus**: [developers.amadeus.com/docs](https://developers.amadeus.com/docs)

---

## 🎉 **You're Almost There!**

Once you've updated these API keys, your GitHub Link Up Buddy will be a fully functional, production-ready flight booking platform!

**Estimated setup time**: 2-3 hours
**Result**: Complete, live flight booking application ✈️

Your users will be able to:
- ✅ Sign up and log in
- ✅ Search for real flights  
- ✅ Book and pay for flights
- ✅ Manage multiple travelers
- ✅ Use all advanced features

**Next step**: Start with Supabase and Stripe - they're the most critical!
