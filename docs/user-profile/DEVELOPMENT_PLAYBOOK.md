# Parker Flight - Development Playbook
## User Profile & Wallet Implementation

### 🎯 Executive Summary

This playbook outlines the 10-day AI-driven development approach for implementing an enterprise-grade user profile and wallet system for Parker Flight. The system prioritizes security, compliance, and user experience while maintaining rapid development velocity.

### 🔐 Guiding Principles

1. **Security First**: All payment data handled via Stripe tokenization (PCI SAQ A compliance)
2. **Lazy Stripe Customer Creation**: Create Stripe customers only when payment methods are added
3. **Row-Level Security**: Database policies ensure users only access their own data
4. **AWS Key Security**: Least-privilege principle - AWS keys restricted to KMS-encrypt/decrypt on parker-kms-key only
5. **Audit Everything**: Complete audit trails for all payment and profile actions
6. **Progressive Enhancement**: Build core functionality first, enhance iteratively

### 📋 Configuration & Schema

#### Core Tables Structure

```sql
-- User profiles with enhanced security
CREATE TABLE traveler_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods with KMS encryption
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT NOT NULL,
  stripe_payment_method_id TEXT NOT NULL,
  encrypted_card_data BYTEA NOT NULL,
  brand TEXT,
  last4 TEXT,
  exp_month SMALLINT,
  exp_year SMALLINT,
  is_default BOOLEAN DEFAULT FALSE,
  encryption_version SMALLINT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profile completion tracking
CREATE TABLE profile_completion_tracking (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completeness_score INT DEFAULT 0,
  missing_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Audit logging for compliance
CREATE TABLE traveler_data_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row-Level Security Policies

```sql
-- Payment methods RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own payment methods"
  ON payment_methods FOR ALL
  USING (auth.uid() = user_id);

-- Profile completion RLS
ALTER TABLE profile_completion_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own completion tracking"
  ON profile_completion_tracking FOR SELECT
  USING (auth.uid() = user_id);
```

### 📅 Development Timeline

#### Phase 0: Foundation & Hardening (Day 1-2)
**Duration**: 2 days

**Day 1 (Environment Setup):**
- [ ] Supabase project configuration with RLS enabled
- [ ] AWS KMS key setup with least-privilege IAM policies
- [ ] Stripe account configuration with webhook endpoints
- [ ] Database schema deployment with payment_methods table
- [ ] Edge Functions deployment structure

**Day 2 (Security & Compliance):**
- [ ] Publish secrets rotation runbook with quarterly scheduling
- [ ] KMS key rotation documentation and automated cron setup
- [ ] Stripe webhook signature verification testing
- [ ] Database encryption key testing and validation
- [ ] Security audit of all authentication flows

#### Phase 1: Core Implementation (Day 3-8)

**Day 3-4 (Profile Management):**
- [ ] User registration and profile creation flows
- [ ] Profile completion scoring algorithm
- [ ] Phone number verification with SMS (Twilio integration)
- [ ] Profile editing with real-time validation
- [ ] Notification preferences management

**Day 5 (Stripe & Wallet DB):**
- [ ] Run migration to create payment_methods table and KMS column
- [ ] Wire manage-payment-methods Edge Function (already coded) to new table
- [ ] Insert audit-trail row on add/update/delete payment actions
- [ ] Implement Stripe customer creation on first payment method

**Day 6 (Wallet Integration):**
- [ ] Stripe Elements integration for secure card input
- [ ] SetupIntent flow for card tokenization
- [ ] Payment method CRUD operations with KMS encryption
- [ ] Default payment method selection logic

**Day 7 (UI & UX):**
- [ ] Profile completion progress indicator
- [ ] Wallet management interface with multiple cards
- [ ] Insert PSD2 consent checkbox & store timestamp in campaigns.consent_at
- [ ] Mobile-responsive design implementation

**Day 8 (Testing & QA):**
- [ ] Mobile responsiveness testing across devices
- [ ] Accessibility audit (WCAG 2.1 compliance)
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization and caching

#### Phase 2: Advanced Features & Hardening (Day 9-10)

**Day 9-10 (Production Hardening):**
- [ ] Switch off-session flow to capture_method=manual; capture only after Duffel confirms
- [ ] Implement UI + email flow for "Complete authentication" when payment_intent.requires_action
- [ ] Review Radar logs, add high-risk rule set for fraud prevention
- [ ] Backup card fallback logic implementation
- [ ] Load testing and performance optimization

### 🧪 Testing Strategy

#### Unit Testing
- [ ] Profile completion scoring accuracy
- [ ] Payment method encryption/decryption cycles
- [ ] Verify idempotent key prevents double-charge
- [ ] RLS policy enforcement testing
- [ ] KMS encryption validation

#### Integration Testing
- [ ] Stripe webhook processing end-to-end
- [ ] Phone verification SMS delivery
- [ ] Simulate Duffel booking failure → expect automatic Stripe refund
- [ ] Profile completion workflow testing
- [ ] Payment method lifecycle management

#### Security Testing
- [ ] Webhook signature verification
- [ ] Payment data encryption validation
- [ ] Row-level security bypass attempts
- [ ] SQL injection prevention
- [ ] XSS protection verification

### 📊 Monitoring & Observability

#### Performance SLOs
- [ ] p95 API latency < 200ms
- [ ] Error rate < 0.1%
- [ ] 99.9% uptime guarantee
- [ ] Automated alerting for SLO violations

#### Audit Requirements
- [ ] All payment actions logged in traveler_data_audit
- [ ] Stripe webhook event logging
- [ ] Profile modification tracking
- [ ] Failed authentication attempt monitoring

#### Financial Monitoring
- [ ] Payment success/failure rates
- [ ] Refund processing tracking
- [ ] Stripe fee analysis
- [ ] Currency conversion monitoring

### 🚀 Deployment Strategy

#### Safe Rollback Procedures
- [ ] Supabase Point-in-Time Recovery (PITR) for surgical rollbacks
- [ ] Git commit revert procedures for code changes
- [ ] Database migration rollback scripts
- [ ] Feature flag toggles for instant disabling

#### Production Rollout
- [ ] Blue-green deployment strategy
- [ ] Canary releases with gradual user rollout
- [ ] Real-time monitoring during deployment
- [ ] Automated rollback triggers

### 🛡️ Compliance & Security

#### PCI DSS SAQ A Compliance
- [ ] Stripe tokenization implementation
- [ ] No card data in application scope
- [ ] Secure transmission protocols
- [ ] Regular security assessments

#### SCA/PSD2 Compliance
- [ ] 3D Secure automatic handling
- [ ] Off-session payment authorization
- [ ] User consent for stored payment methods
- [ ] Strong customer authentication flows

#### GDPR Compliance
- [ ] Document account-deletion playbook inc. stripe.customers.del
- [ ] Data encryption at rest and in transit
- [ ] User data export capabilities
- [ ] Consent management workflows

### 🔧 Post-Launch Optimization (Day 11-13)

#### Data Team Ownership
- [ ] Day 12-13: Data team owns first 100 payments review
- [ ] Stripe Radar rule tuning based on real transaction data
- [ ] Payment pattern analysis and optimization
- [ ] User behavior analytics implementation

#### Operational Excellence
- [ ] Incident response procedures
- [ ] Performance monitoring dashboards
- [ ] User support workflows
- [ ] Continuous security monitoring

### 📈 Success Metrics

#### User Experience
- [ ] Profile completion rate > 80%
- [ ] Payment method addition success rate > 95%
- [ ] User satisfaction score > 4.5/5
- [ ] Support ticket volume < 5% of users

#### Technical Performance
- [ ] API response time < 200ms p95
- [ ] Payment processing success rate > 99%
- [ ] Zero security incidents
- [ ] 99.9% system uptime

#### Business Impact
- [ ] Reduced payment friction
- [ ] Increased conversion rates
- [ ] Enhanced user trust and retention
- [ ] Compliance audit readiness

### 🎖️ Compliance Achievements

This implementation ensures enterprise-grade compliance:

- ✅ **PCI DSS SAQ A**: Minimal compliance scope through Stripe tokenization
- ✅ **SCA/PSD2**: 3D Secure for European users with proper consent flows
- ✅ **GDPR**: Complete data deletion capability and privacy controls
- ✅ **SOX**: Full audit trails and financial controls
- ✅ **Anti-Fraud**: Stripe Radar ML protection with custom rule tuning

### 🚀 Production Readiness

The system achieves production-ready status through:

1. **Enterprise-Grade Security**: Least-privilege access and automated rotation
2. **Production-Safe Operations**: Non-destructive rollbacks and PITR recovery
3. **Performance Guarantees**: Quantified SLOs with automated monitoring
4. **Operational Clarity**: Clear ownership and timelines for critical tasks
5. **Compliance Assurance**: All regulatory requirements explicitly scheduled

This development playbook ensures Parker Flight can deploy a secure, compliant, and user-friendly profile and wallet system that rivals systems built by major fintech companies while maintaining rapid development velocity through AI-driven approaches.
