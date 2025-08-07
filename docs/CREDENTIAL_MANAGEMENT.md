# 🔐 Professional Credential Management

This document outlines enterprise-grade security practices for managing API credentials and environment variables in this project.

## 🆕 Professional Security System

We now offer two credential management approaches:

1. **Professional Grade** (Recommended) - Enterprise security with encryption, audit logging, and compliance
2. **Standard** - Basic secure credential setup

### Professional System Features
- 🔐 End-to-end AES-256-GCM encryption
- 📊 Comprehensive audit logging
- 🏛️ SOX, PCI DSS, HIPAA compliance ready
- 🔄 Automated credential rotation
- 🚨 Real-time security monitoring
- 🎯 Tamper detection and integrity checks

## 🚨 Security Principles

1. **NEVER commit real credentials to git**
2. **Use placeholder values in committed files**
3. **Store real credentials in ignored files**
4. **Rotate credentials regularly**
5. **Use test keys only for development**

## 📁 File Structure

```
├── .env.example          # Template with placeholder values (committed)
├── .env.test             # Test placeholders only (committed)
├── .env.test.local       # Real test credentials (ignored by git)
├── .env.local            # Real dev credentials (ignored by git)
└── scripts/
    └── setup-credentials.sh  # Secure credential setup script
```

## ⚙️ Setup Process

### 🏆 Professional Setup (Enterprise Grade)

**Recommended for production environments and enterprise compliance:**

```bash
# Initialize professional credential manager
npm run credentials:pro:init

# Run interactive professional setup
npm run credentials:pro:setup
```

**Professional system benefits:**
- 🔐 Credentials encrypted at rest with AES-256-GCM
- 📋 Complete audit trail with tamper detection
- 🎯 Compliance reporting (SOX, PCI DSS, HIPAA)
- 🔄 Automated rotation scheduling
- 🚨 Security monitoring and alerts

**Professional commands:**
```bash
# View security report
npm run credentials:pro:report

# Export audit logs
npm run credentials:pro:audit

# Run comprehensive security audit
npm run security:audit

# Generate JSON security report
npm run security:audit:report
```

### 📝 Standard Setup (Basic Security)

Run the secure credential setup script:

```bash
./scripts/setup-credentials.sh
```

This script will:
- ✅ Prompt for each credential with format validation
- ✅ Create `.env.test.local` with real credentials
- ✅ Ensure the file is ignored by git
- ✅ Validate credential formats for safety

### 2. Manual Setup (Alternative)

If you prefer to set up credentials manually:

1. Copy the template:
   ```bash
   cp .env.test .env.test.local
   ```

2. Edit `.env.test.local` with your real credentials:
   ```bash
   # Replace placeholder values with real test credentials
   STRIPE_SECRET_KEY=sk_test_your_real_key_here
   LAUNCHDARKLY_SDK_KEY=sdk-your-real-key-here
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJ_your_real_key_here
   ```

3. Verify the file is ignored:
   ```bash
   git status  # Should not show .env.test.local
   ```

## 🔑 Required Credentials

### Stripe (Payment Processing)
- `STRIPE_SECRET_KEY` - Test secret key (`sk_test_...`)
- `STRIPE_PUBLISHABLE_KEY` - Test publishable key (`pk_test_...`) [Optional]

**Get from**: https://dashboard.stripe.com/test/apikeys

### LaunchDarkly (Feature Flags)
- `LAUNCHDARKLY_SDK_KEY` - Server SDK key (`sdk-...`)
- `VITE_LD_CLIENT_ID` - Client-side ID [Optional]

**Get from**: LaunchDarkly Dashboard → Project Settings → Environments

### Supabase (Database & Auth)
- `SUPABASE_URL` - Project URL (`https://xxx.supabase.co`)
- `SUPABASE_ANON_KEY` - Anonymous key (`eyJ...`)
- `VITE_SUPABASE_URL` - Same as above (for frontend)
- `VITE_SUPABASE_ANON_KEY` - Same as above (for frontend)

**Get from**: Supabase Dashboard → Settings → API

## 🧪 Running Tests

Once credentials are set up:

```bash
# Run integration tests
npm run test:integration:external

# The system will automatically use .env.test.local if it exists,
# otherwise fall back to .env.test (placeholder values)
```

## 🔄 Credential Management

### Environment Priority

The system loads credentials in this order:
1. `.env.test.local` (secure, real credentials)
2. `.env.test` (placeholders for CI/demo)
3. `.env` (general environment)
4. System environment variables

### Updating Credentials

To update credentials:
```bash
# Re-run the setup script
./scripts/setup-credentials.sh

# Or edit the file directly
nano .env.test.local
```

### Credential Rotation

When rotating credentials:
1. Update credentials in the service dashboards
2. Run `./scripts/setup-credentials.sh` with new values
3. Test integration tests to verify
4. Consider updating any shared team credentials

## 🚫 What NOT to Do

❌ **Never do this:**
```bash
# DON'T commit real credentials
git add .env.test.local
git commit -m "Add credentials"  # 🚨 SECURITY RISK!

# DON'T put real credentials in committed files
echo "STRIPE_SECRET_KEY=sk_test_real_key" >> .env.test  # 🚨 DANGER!

# DON'T share credentials in chat/email
# Use secure password managers instead
```

## ✅ Best Practices

✅ **Do this:**
```bash
# Use the setup script
./scripts/setup-credentials.sh

# Check git status before committing
git status

# Use test keys only
# Stripe: sk_test_... (not sk_live_...)
# LaunchDarkly: SDK keys from test environment
```

## 🔍 Troubleshooting

### "Invalid API Key" Errors
- Verify you're using **test** keys, not production keys
- Check that credentials haven't expired
- Ensure no extra spaces/characters in the keys

### "No credentials found"
- Run `./scripts/setup-credentials.sh`
- Verify `.env.test.local` exists and has content
- Check file permissions: `ls -la .env.test.local`

### Git Shows Environment Files
If git shows `.env.test.local` or similar:
```bash
# Remove from git tracking
git rm --cached .env.test.local

# Verify .gitignore includes the file
grep "\.env" .gitignore
```

## 🆘 Emergency Response

If credentials are accidentally committed:
1. **Immediately rotate all compromised credentials**
2. Remove them from git history:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env.test.local' \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (if safe): `git push --force-with-lease`
4. Update team members about the rotation

## 📞 Support

If you have questions about credential management:
- Check this documentation first
- Review the setup script: `./scripts/setup-credentials.sh`
- Ensure you're following security best practices
- Consider using a team password manager for shared credentials

---

Remember: **Security is everyone's responsibility!** 🛡️
