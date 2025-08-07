# PaymentKMSService - IAM Role Configuration Guide

## 🔐 Security Fix: IAM Role-Based Authentication

This guide helps you implement IAM role-based authentication to replace insecure access key usage in the PaymentKMSService.

## ⚠️ Security Issue Fixed

**Previous Issue**: The service was using long-term access keys stored in environment variables
**Fix**: Implemented IAM role assumption with temporary credentials

## 🚀 Quick Start

### 1. Environment Variables Required

```bash
# Required IAM Role Configuration
AWS_ROLE_ARN=arn:aws:iam::YOUR-ACCOUNT-ID:role/PaymentKMSRole
AWS_EXTERNAL_ID=your-unique-external-id-here
AWS_REGION=us-east-1

# Optional KMS Configuration
KMS_FALLBACK_REGIONS=["us-west-2","eu-west-1"]
KMS_GENERAL_ALIAS=alias/parker-flight-general-production
KMS_PII_ALIAS=alias/parker-flight-pii-production  
KMS_PAYMENT_ALIAS=alias/parker-flight-payment-production
```

### 2. Remove Insecure Environment Variables

```bash
# REMOVE THESE (Security Risk):
# AWS_ACCESS_KEY_ID=xxxxx
# AWS_SECRET_ACCESS_KEY=xxxxx
```

## 🔧 AWS IAM Role Setup

### Step 1: Create the IAM Role

```bash
# Create the IAM role
aws iam create-role \
  --role-name PaymentKMSRole \
  --assume-role-policy-document file://trust-policy.json
```

### Step 2: Trust Policy (`trust-policy.json`)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::SUPABASE-ACCOUNT-ID:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "your-unique-external-id-here"
        }
      }
    }
  ]
}
```

### Step 3: KMS Permissions Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": [
        "arn:aws:kms:*:YOUR-ACCOUNT-ID:key/*"
      ],
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "kms.us-east-1.amazonaws.com",
            "kms.us-west-2.amazonaws.com",
            "kms.eu-west-1.amazonaws.com"
          ]
        }
      }
    }
  ]
}
```

### Step 4: Attach Policy to Role

```bash
# Create and attach the policy
aws iam create-policy \
  --policy-name PaymentKMSPolicy \
  --policy-document file://kms-policy.json

aws iam attach-role-policy \
  --role-name PaymentKMSRole \
  --policy-arn arn:aws:iam::YOUR-ACCOUNT-ID:policy/PaymentKMSPolicy
```

## 🏗️ Implementation Details

### Key Security Improvements

1. **Eliminated Long-term Credentials**: No more hardcoded access keys
2. **Automatic Credential Rotation**: STS tokens expire and refresh automatically  
3. **External ID Protection**: Guards against confused deputy attacks
4. **Credential Caching**: Reduces STS API calls with intelligent caching
5. **Multi-region Support**: Secure credentials work across all regions

### Code Changes Made

- ✅ All KMS clients now use assumed role credentials
- ✅ Lazy initialization of clients with role-based authentication
- ✅ Credential caching with 5-minute refresh buffer
- ✅ Enhanced error handling for role assumption failures
- ✅ Required configuration validation at startup

### Session Management

- **Session Duration**: 1 hour (3600 seconds)
- **Refresh Buffer**: 5 minutes before expiry
- **Session Name**: `supabase-edge-function`
- **Caching**: In-memory with automatic expiry

## 🧪 Testing the Implementation

### Health Check

```typescript
const kmsService = createPaymentKMSService();
const health = await kmsService.healthCheck();
console.log('KMS Service Health:', health);
```

### Example Usage

```typescript
import { createPaymentKMSService } from './PaymentKMSService';

const kmsService = createPaymentKMSService();

// Encrypt payment data (now uses IAM roles)
const paymentData = {
  cardNumber: "4111111111111111",
  cvv: "123",
  expiryDate: "12/25"
};

const encrypted = await kmsService.encryptPaymentData(paymentData);
const decrypted = await kmsService.decryptPaymentData(encrypted);
```

## 🔍 Monitoring & Troubleshooting

### CloudWatch Logs to Monitor

```bash
# Look for these log entries:
"Successfully assumed IAM role for KMS operations"
"Failed to assume IAM role"
"IAM role assumption failed"
```

### Common Issues

1. **Missing Role ARN**: Ensure `AWS_ROLE_ARN` is set correctly
2. **Invalid External ID**: Verify `AWS_EXTERNAL_ID` matches trust policy
3. **Permission Denied**: Check role has KMS permissions for your keys
4. **Network Issues**: Verify connectivity to STS and KMS endpoints

### CloudTrail Events

Monitor these AWS CloudTrail events:
- `sts:AssumeRole` - Role assumption attempts
- `kms:Encrypt` - KMS encryption operations
- `kms:Decrypt` - KMS decryption operations
- `kms:GenerateDataKey` - Data key generation

## 📊 Security Benefits

| Aspect | Before | After |
|--------|---------|--------|
| Credential Storage | ❌ Long-term keys in env | ✅ No stored credentials |
| Rotation | ❌ Manual rotation | ✅ Automatic (1 hour) |
| Audit Trail | ❌ Limited logging | ✅ Full CloudTrail logs |
| Attack Surface | ❌ High (permanent keys) | ✅ Low (temporary tokens) |
| Confused Deputy | ❌ No protection | ✅ External ID required |

## 🚨 Migration Checklist

- [ ] Set up IAM role with trust policy
- [ ] Attach KMS permissions policy
- [ ] Set `AWS_ROLE_ARN` environment variable
- [ ] Set `AWS_EXTERNAL_ID` environment variable  
- [ ] Remove `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- [ ] Test with health check endpoint
- [ ] Verify CloudTrail logs show role assumption
- [ ] Monitor for any authentication errors

## ⚡ Performance Impact

- **Initial Role Assumption**: ~200-500ms (cached for 1 hour)
- **Subsequent Operations**: No additional latency (uses cached credentials)
- **Network Overhead**: Minimal (1 STS call per hour)

This implementation significantly enhances your security posture while maintaining high performance through intelligent credential caching.
