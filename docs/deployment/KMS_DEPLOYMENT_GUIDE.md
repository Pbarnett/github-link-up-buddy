# AWS KMS Integration Deployment Guide

This guide walks through deploying the AWS KMS integration for Parker Flight's payment processing system, following AWS AI bot recommendations.

## Pre-Deployment Checklist

### ✅ Prerequisites
- [ ] AWS CLI installed and configured
- [ ] Supabase CLI installed
- [ ] Valid AWS account with billing enabled
- [ ] Development environment set up with Node.js/Deno

### 🔐 Security Requirements
- [ ] Dedicated AWS account or strong IAM isolation for production
- [ ] MFA enabled on AWS root and admin accounts
- [ ] CloudTrail logging enabled for audit requirements

## Step 1: Deploy AWS Infrastructure

### 1.1 Deploy KMS Keys and IAM Resources

```bash
# Navigate to aws-infrastructure directory
cd aws-infrastructure/

# Deploy the CloudFormation stack
aws cloudformation deploy \
  --template-file kms-setup.yml \
  --stack-name parker-flight-kms-production \
  --parameter-overrides \
    Environment=production \
    ApplicationName=parker-flight \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1

# Wait for deployment to complete
aws cloudformation wait stack-create-complete \
  --stack-name parker-flight-kms-production \
  --region us-east-1
```

### 1.2 Retrieve Stack Outputs

```bash
# Get the key aliases and role ARN
aws cloudformation describe-stacks \
  --stack-name parker-flight-kms-production \
  --region us-east-1 \
  --query 'Stacks[0].Outputs'
```

Expected outputs:
- `GeneralKeyAlias`: `alias/parker-flight-general-production`
- `PIIKeyAlias`: `alias/parker-flight-pii-production` 
- `PaymentKeyAlias`: `alias/parker-flight-payment-production`
- `SupabaseRoleArn`: `arn:aws:iam::123456789012:role/parker-flight-supabase-kms-role-production`
- `ExternalId`: `parker-flight-production-external-id`

## Step 2: Configure Environment Variables

### 2.1 Local Development Environment

Create `.env.local` (never commit this file):

```bash
# Copy from example
cp .env.example .env.local

# Edit .env.local with your actual values
cat > .env.local << 'EOF'
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_dev_access_key_here
AWS_SECRET_ACCESS_KEY=your_dev_secret_access_key_here

# KMS Configuration (from CloudFormation outputs)
KMS_GENERAL_ALIAS=alias/parker-flight-general-production
KMS_PII_ALIAS=alias/parker-flight-pii-production
KMS_PAYMENT_ALIAS=alias/parker-flight-payment-production

# Multi-region configuration
KMS_FALLBACK_REGIONS=["us-west-2", "eu-west-1"]

# Development settings
NODE_ENV=development
SUPABASE_ENV=development
KMS_ENABLE_LOGGING=true
KMS_RUN_STARTUP_TEST=true
EOF
```

### 2.2 Supabase Production Environment

Set environment variables in Supabase Dashboard:

```bash
# For production, use IAM roles instead of access keys
AWS_REGION=us-east-1
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/parker-flight-supabase-kms-role-production
AWS_EXTERNAL_ID=parker-flight-production-external-id

# KMS Configuration
KMS_GENERAL_ALIAS=alias/parker-flight-general-production
KMS_PII_ALIAS=alias/parker-flight-pii-production
KMS_PAYMENT_ALIAS=alias/parker-flight-payment-production
KMS_FALLBACK_REGIONS=["us-west-2", "eu-west-1"]

# Production settings
NODE_ENV=production
SUPABASE_ENV=production
KMS_ENABLE_LOGGING=false
KMS_ENABLE_METRICS=true
```

## Step 3: Test KMS Integration Locally

### 3.1 Run Unit Tests

```bash
# Run mocked KMS tests (no AWS charges)
npm test src/tests/services/kms/PaymentKMSService.test.ts
```

### 3.2 Run Integration Tests (Optional - uses real AWS)

```bash
# Set up AWS credentials for integration testing
export AWS_ACCESS_KEY_ID=your_dev_access_key
export AWS_SECRET_ACCESS_KEY=your_dev_secret_key
export AWS_REGION=us-east-1

# Run integration tests (will incur small AWS charges ~$0.01)
NODE_ENV=development npm test src/tests/services/kms/PaymentKMSService.test.ts
```

### 3.3 Test KMS Health Check Locally

```bash
# Start Supabase functions locally
supabase functions serve

# Test the health check endpoint
curl http://localhost:54321/functions/v1/kms-health-check
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-07T12:00:00.000Z",
  "checks": {
    "config": { "status": "pass" },
    "kms_connectivity": { "status": "pass" },
    "key_functionality": { "status": "pass" }
  },
  "metadata": {
    "version": 2,
    "region": "us-east-1",
    "environment": "development",
    "latency_ms": 1250
  }
}
```

## Step 4: Deploy to Supabase

### 4.1 Deploy Edge Functions

```bash
# Deploy the enhanced KMS service
supabase functions deploy kms-health-check

# Deploy any payment-related functions that use KMS
supabase functions deploy encrypt-payment-data
supabase functions deploy manage-payment-methods-kms
```

### 4.2 Verify Deployment

```bash
# Test health check in production
curl https://your-project.supabase.co/functions/v1/kms-health-check
```

## Step 5: Set Up Monitoring and Alerting

### 5.1 CloudWatch Alarms

```bash
# Create CloudWatch alarm for KMS failures
aws cloudwatch put-metric-alarm \
  --alarm-name "parker-flight-kms-failures" \
  --alarm-description "Alert on KMS operation failures" \
  --metric-name "Errors" \
  --namespace "AWS/KMS" \
  --statistic "Sum" \
  --period 300 \
  --threshold 5 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2 \
  --region us-east-1
```

### 5.2 Cost Monitoring

```bash
# Set up billing alert for KMS costs
aws budgets create-budget \
  --account-id your-account-id \
  --budget '{
    "BudgetName": "parker-flight-kms-budget",
    "BudgetLimit": {
      "Amount": "10",
      "Unit": "USD"
    },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST",
    "CostFilters": {
      "Service": ["Amazon Key Management Service"]
    }
  }'
```

## Step 6: Security Hardening

### 6.1 Enable CloudTrail for KMS Operations

```bash
# Ensure CloudTrail is logging KMS operations
aws cloudtrail put-event-selectors \
  --trail-name your-cloudtrail-name \
  --event-selectors '[{
    "ReadWriteType": "All",
    "IncludeManagementEvents": true,
    "DataResources": [{
      "Type": "AWS::KMS::Key",
      "Values": ["arn:aws:kms:*"]
    }]
  }]'
```

### 6.2 Review KMS Key Policies

```bash
# Verify key policies are restrictive
aws kms get-key-policy \
  --key-id alias/parker-flight-payment-production \
  --policy-name default \
  --region us-east-1
```

## Step 7: Performance Testing

### 7.1 Load Testing

```bash
# Test KMS performance under load
npm run test:load-kms
```

### 7.2 Latency Testing

```bash
# Test multi-region failover latency
curl -w "@curl-format.txt" \
  https://your-project.supabase.co/functions/v1/kms-health-check
```

## Troubleshooting Guide

### Common Issues

#### 1. "AccessDenied" Errors
```bash
# Check IAM permissions
aws sts get-caller-identity
aws iam get-role-policy --role-name parker-flight-supabase-kms-role-production --policy-name SupabaseKMSPolicy
```

#### 2. "KeyDisabled" or "KeyNotFound" Errors  
```bash
# Check key status
aws kms describe-key --key-id alias/parker-flight-payment-production
```

#### 3. High Latency Issues
```bash
# Test regional latency
for region in us-east-1 us-west-2 eu-west-1; do
  echo "Testing $region..."
  aws kms encrypt --key-id alias/parker-flight-general-production --plaintext "test" --region $region
done
```

#### 4. Cost Optimization
```bash
# Monitor KMS usage
aws cloudwatch get-metric-statistics \
  --namespace AWS/KMS \
  --metric-name NumberOfRequestsSucceeded \
  --dimensions Name=KeyId,Value=alias/parker-flight-payment-production \
  --statistics Sum \
  --start-time $(date -u -d '1 month ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 86400
```

## Production Checklist

### Pre-Go-Live
- [ ] All unit tests passing
- [ ] Integration tests passing with real KMS keys
- [ ] Health check returning "healthy" status
- [ ] CloudTrail logging enabled
- [ ] Cost monitoring configured
- [ ] Security policies reviewed
- [ ] Backup regions tested
- [ ] Performance benchmarks completed

### Post-Go-Live Monitoring
- [ ] KMS health check automated (every 5 minutes)
- [ ] CloudWatch alarms configured
- [ ] Cost tracking in place
- [ ] Error rate monitoring
- [ ] Latency monitoring across regions
- [ ] Monthly security review scheduled

## Cost Optimization Tips

### At Your Scale (100-1000 payments/month)

1. **Expected Costs**: ~$3.06/month total
   - 3 KMS keys: $3.00/month
   - API calls: ~$0.06/month

2. **Cost Monitoring**:
   ```bash
   # Weekly cost check
   aws ce get-cost-and-usage \
     --time-period Start=2025-01-01,End=2025-01-31 \
     --granularity MONTHLY \
     --metrics BlendedCost \
     --group-by Type=DIMENSION,Key=SERVICE
   ```

3. **Optimization Strategies**:
   - Cache data keys when possible
   - Use appropriate encryption context for better auditability
   - Monitor for unused keys or excessive API calls

## Next Steps

1. **Implement in Payment Flow**: Update your payment processing functions to use the new KMS service
2. **Database Integration**: Update payment method storage to use encrypted data
3. **Monitoring Dashboard**: Create a dashboard for KMS health and performance
4. **Documentation**: Document your encryption key rotation procedures
5. **Disaster Recovery**: Test multi-region failover scenarios

## Support and Resources

- AWS KMS Documentation: https://docs.aws.amazon.com/kms/
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Cost Calculator: https://calculator.aws/#/createCalculator/KMS

---

**Estimated Total Implementation Time**: 4-6 hours
**Estimated Monthly Cost**: $3.06/month
**Security Level**: Enterprise-grade with multi-region failover
**PCI DSS Compliance**: ✅ Ready for payment processing
