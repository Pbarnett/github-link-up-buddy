# Multi-Region KMS Setup Guide for Parker Flight

This guide walks you through setting up the multi-region KMS encryption system for your Parker Flight application.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [IAM Roles and Policies](#iam-roles-and-policies)
4. [Multi-Region Key Setup](#multi-region-key-setup)
5. [Application Integration](#application-integration)
6. [Monitoring and Alerting](#monitoring-and-alerting)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

## Architecture Overview

### Multi-Region Key (MRK) Benefits
- **Seamless Failover**: Same key ID works across all regions
- **Lower Latency**: Keys available locally in each region
- **High Availability**: No single point of failure
- **Cost Optimization**: Reduced cross-region API calls

### Key Architecture
```
Primary Region (us-east-1)
├── parker-flight-general-production (MRK)
├── parker-flight-pii-production (MRK)
└── parker-flight-payment-production (MRK)

Replica Regions (us-west-2, eu-west-1)
├── Same key IDs as primary
├── Local alias mappings
└── Independent operation capability
```

## Prerequisites

### Environment Variables
```bash
# Required environment variables
export AWS_ACCOUNT_ID="123456789012"
export AWS_REGION="us-east-1"
export NODE_ENV="production"

# Optional (if using role assumption)
export AWS_ROLE_ARN="arn:aws:iam::123456789012:role/ParkerFlightServiceRole"
```

### AWS CLI Setup
```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure CLI
aws configure set region us-east-1
aws configure set output json
```

## IAM Roles and Policies

### 1. Create Service Roles

#### Parker Flight Service Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": ["ecs-tasks.amazonaws.com", "ec2.amazonaws.com"]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

#### Payment Service Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/ParkerFlightServiceRole"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### 2. KMS Permissions Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowKMSOperations",
      "Effect": "Allow",
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey",
        "kms:CreateGrant",
        "kms:ListGrants",
        "kms:RevokeGrant",
        "kms:GetKeyRotationStatus"
      ],
      "Resource": [
        "arn:aws:kms:us-east-1:123456789012:key/*",
        "arn:aws:kms:us-west-2:123456789012:key/*",
        "arn:aws:kms:eu-west-1:123456789012:key/*"
      ],
      "Condition": {
        "StringEquals": {
          "kms:ViaService": [
            "s3.us-east-1.amazonaws.com",
            "s3.us-west-2.amazonaws.com",
            "s3.eu-west-1.amazonaws.com",
            "dynamodb.us-east-1.amazonaws.com",
            "dynamodb.us-west-2.amazonaws.com",
            "dynamodb.eu-west-1.amazonaws.com"
          ]
        }
      }
    },
    {
      "Sid": "AllowDirectKMSAccess",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": [
        "arn:aws:kms:*:123456789012:alias/parker-flight-*"
      ]
    },
    {
      "Sid": "AllowKMSAliasListing",
      "Effect": "Allow",
      "Action": [
        "kms:ListAliases",
        "kms:ListKeys"
      ],
      "Resource": "*"
    }
  ]
}
```

### 3. Cross-Region Access Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCrossRegionKMSAccess",
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt",
        "kms:GenerateDataKey",
        "kms:DescribeKey"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": [
            "us-east-1",
            "us-west-2", 
            "eu-west-1"
          ]
        },
        "Bool": {
          "aws:SecureTransport": "true"
        }
      }
    }
  ]
}
```

## Multi-Region Key Setup

### 1. Create IAM Roles Using AWS CLI

```bash
# Create service role
aws iam create-role \
  --role-name ParkerFlightServiceRole \
  --assume-role-policy-document file://service-role-trust-policy.json

# Attach KMS policy
aws iam put-role-policy \
  --role-name ParkerFlightServiceRole \
  --policy-name ParkerFlightKMSPolicy \
  --policy-document file://kms-permissions-policy.json

# Create payment-specific role
aws iam create-role \
  --role-name ParkerFlightPaymentRole \
  --assume-role-policy-document file://payment-role-trust-policy.json

aws iam put-role-policy \
  --role-name ParkerFlightPaymentRole \
  --policy-name PaymentKMSPolicy \
  --policy-document file://kms-permissions-policy.json
```

### 2. Create Multi-Region Keys

```bash
# Create general purpose MRK
aws kms create-key \
  --region us-east-1 \
  --description "General purpose encryption for Parker Flight services" \
  --key-usage ENCRYPT_DECRYPT \
  --key-spec SYMMETRIC_DEFAULT \
  --multi-region \
  --policy file://general-key-policy.json

# Get the key ID from the output and create alias
aws kms create-alias \
  --region us-east-1 \
  --alias-name alias/parker-flight-general-production \
  --target-key-id <KEY-ID-FROM-ABOVE>

# Replicate to other regions
aws kms replicate-key \
  --region us-west-2 \
  --key-id <KEY-ID> \
  --replica-region us-west-2 \
  --description "General purpose encryption replica in us-west-2"

aws kms create-alias \
  --region us-west-2 \
  --alias-name alias/parker-flight-general-production \
  --target-key-id <KEY-ID>

# Repeat for eu-west-1 and other key types (pii, payment)
```

### 3. Enable Key Rotation

```bash
# Enable automatic key rotation for all keys
for region in us-east-1 us-west-2 eu-west-1; do
  aws kms enable-key-rotation \
    --region $region \
    --key-id alias/parker-flight-general-production
  
  aws kms enable-key-rotation \
    --region $region \
    --key-id alias/parker-flight-pii-production
    
  aws kms enable-key-rotation \
    --region $region \
    --key-id alias/parker-flight-payment-production
done
```

## Application Integration

### 1. Install Dependencies

```bash
npm install @aws-sdk/client-kms @smithy/node-http-handler
```

### 2. Environment Configuration

```typescript
// config/kms-config.ts
export const KMS_CONFIG = {
  regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
  primaryRegion: process.env.AWS_REGION || 'us-east-1',
  keyAliases: {
    general: 'alias/parker-flight-general-production',
    pii: 'alias/parker-flight-pii-production',
    payment: 'alias/parker-flight-payment-production'
  },
  dataKeyTTL: 5 * 60 * 1000, // 5 minutes
  maxEncryptionsPerKey: 1000,
  circuitBreakerThreshold: 3,
  maxRetries: 5
};
```

### 3. Application Startup

```typescript
// app.ts
import { initializeKMS, shutdownKMS } from './lib/aws-sdk-enhanced/kms-usage-examples';

async function startApp() {
  try {
    // Initialize KMS during application startup
    await initializeKMS();
    
    // Start your Express server
    const app = express();
    // ... your app configuration
    
    const server = app.listen(PORT, () => {
      console.log(`Parker Flight API running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully');
      server.close();
      await shutdownKMS();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

startApp();
```

### 4. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV AWS_REGION=us-east-1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

### 5. ECS Task Definition

```json
{
  "family": "parker-flight-api",
  "taskRoleArn": "arn:aws:iam::123456789012:role/ParkerFlightServiceRole",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "parker-flight-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/parker-flight-api:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        },
        {
          "name": "AWS_ACCOUNT_ID",
          "value": "123456789012"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/parker-flight-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:3000/health || exit 1"
        ],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

## Monitoring and Alerting

### 1. CloudWatch Metrics

```typescript
// monitoring/kms-metrics.ts
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

export class KMSMetricsReporter {
  private cloudWatch = new CloudWatchClient({ region: 'us-east-1' });

  async reportKMSMetrics(metrics: KMSOperationMetrics[]) {
    const metricData = metrics.map(metric => ({
      MetricName: 'KMSOperationDuration',
      Dimensions: [
        { Name: 'Region', Value: metric.region },
        { Name: 'Operation', Value: metric.operation },
        { Name: 'Success', Value: metric.success.toString() }
      ],
      Value: metric.duration,
      Unit: 'Milliseconds',
      Timestamp: new Date()
    }));

    await this.cloudWatch.send(new PutMetricDataCommand({
      Namespace: 'ParkerFlight/KMS',
      MetricData: metricData
    }));
  }
}
```

### 2. CloudWatch Alarms

```bash
# High error rate alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "ParkerFlight-KMS-HighErrorRate" \
  --alarm-description "KMS operations error rate is high" \
  --metric-name "KMSOperationDuration" \
  --namespace "ParkerFlight/KMS" \
  --statistic "Average" \
  --period 300 \
  --evaluation-periods 2 \
  --threshold 50 \
  --comparison-operator "GreaterThanThreshold" \
  --dimensions Name=Success,Value=false \
  --alarm-actions "arn:aws:sns:us-east-1:123456789012:parker-flight-alerts"

# Circuit breaker alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "ParkerFlight-KMS-CircuitBreakerOpen" \
  --alarm-description "KMS circuit breaker is open" \
  --metric-name "CircuitBreakerState" \
  --namespace "ParkerFlight/KMS" \
  --statistic "Maximum" \
  --period 60 \
  --evaluation-periods 1 \
  --threshold 1 \
  --comparison-operator "GreaterThanOrEqualToThreshold" \
  --alarm-actions "arn:aws:sns:us-east-1:123456789012:parker-flight-critical-alerts"
```

### 3. Health Check Endpoint

```typescript
// routes/health.ts
import { monitoring } from '../lib/aws-sdk-enhanced/kms-usage-examples';

app.get('/health', async (req, res) => {
  try {
    const health = await monitoring.getKMSHealth();
    
    const allRegionsHealthy = Object.values(health.regions).every(healthy => healthy);
    const hasOpenCircuitBreakers = Object.values(health.circuitBreakers)
      .some((cb: any) => cb.state === 'OPEN');
    
    const status = allRegionsHealthy && !hasOpenCircuitBreakers ? 'healthy' : 'degraded';
    
    res.status(status === 'healthy' ? 200 : 503).json({
      status,
      timestamp: new Date().toISOString(),
      ...health
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "KMS_KEY_UNAVAILABLE" Errors
```bash
# Check key status in all regions
for region in us-east-1 us-west-2 eu-west-1; do
  echo "Checking $region:"
  aws kms describe-key \
    --region $region \
    --key-id alias/parker-flight-payment-production \
    --query 'KeyMetadata.{KeyId:KeyId,KeyState:KeyState,Enabled:Enabled}'
done
```

**Solutions:**
- Verify key exists in all regions
- Check IAM permissions
- Ensure key is enabled
- Verify MRK replication completed

#### 2. Rate Limiting Issues
```typescript
// Implement exponential backoff with jitter
const delay = Math.min(
  baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
  maxDelay
);
```

**Solutions:**
- Implement data key caching (already included)
- Use batch processing
- Add jitter to retry logic
- Monitor request patterns

#### 3. Cross-Region Access Issues
```bash
# Test cross-region access
aws kms decrypt \
  --region us-west-2 \
  --ciphertext-blob fileb://encrypted-data.bin \
  --output text \
  --query Plaintext | base64 -d
```

**Solutions:**
- Verify MRK is properly replicated
- Check IAM policies for cross-region permissions
- Ensure VPC endpoints are configured correctly

### Debugging Commands

```bash
# List all KMS keys
aws kms list-keys --region us-east-1

# Check key rotation status
aws kms get-key-rotation-status \
  --key-id alias/parker-flight-payment-production \
  --region us-east-1

# View key policy  
aws kms get-key-policy \
  --key-id alias/parker-flight-payment-production \
  --policy-name default \
  --region us-east-1

# Test key access
aws kms generate-data-key \
  --key-id alias/parker-flight-payment-production \
  --key-spec AES_256 \
  --region us-east-1
```

## Best Practices

### 1. Security Best Practices
- **Principle of Least Privilege**: Grant minimal necessary permissions
- **Key Separation**: Use different keys for different data types
- **Audit Logging**: Enable CloudTrail for all KMS operations
- **Network Security**: Use VPC endpoints for KMS access
- **Encryption Context**: Always use encryption context for additional security

### 2. Performance Optimization
- **Data Key Caching**: Cache data keys to reduce KMS API calls
- **Batch Processing**: Process multiple items together
- **Regional Optimization**: Use nearest region for operations
- **Connection Pooling**: Reuse HTTP connections
- **Circuit Breakers**: Implement failover logic

### 3. Cost Optimization
- **Data Key Reuse**: Maximize data key usage within limits
- **Regional Strategy**: Minimize cross-region calls
- **Request Batching**: Reduce total API calls
- **Monitoring**: Track usage patterns and optimize

### 4. Operational Excellence
- **Monitoring**: Comprehensive metrics and alerting
- **Testing**: Regular failover testing
- **Documentation**: Keep runbooks updated
- **Automation**: Automate key rotation and management
- **Disaster Recovery**: Test recovery procedures

### 5. Multi-Region Strategy
- **MRK Usage**: Use Multi-Region Keys for seamless failover
- **Regional Fallback**: Implement intelligent region selection
- **Consistency**: Ensure consistent configuration across regions
- **Latency Optimization**: Route to nearest healthy region
- **Health Monitoring**: Continuous region health checks

## Production Checklist

Before deploying to production, ensure:

- [ ] All IAM roles and policies are created
- [ ] Multi-Region Keys are created and replicated
- [ ] Key rotation is enabled
- [ ] Health checks are implemented
- [ ] Monitoring and alerting are configured
- [ ] Circuit breakers are tested
- [ ] Failover scenarios are tested
- [ ] Performance testing is completed
- [ ] Security review is completed
- [ ] Documentation is updated
- [ ] Team training is completed

## Support and Maintenance

### Regular Tasks
- Weekly: Review KMS metrics and performance
- Monthly: Test failover scenarios
- Quarterly: Review and update IAM policies
- Annually: Complete security audit

### Emergency Procedures
1. **Circuit Breaker Activation**: Check region health, failover if needed
2. **High Error Rates**: Scale back operations, investigate root cause
3. **Key Unavailability**: Verify key status, check replication
4. **Performance Degradation**: Review metrics, optimize usage patterns

This setup provides a robust, scalable, and secure multi-region KMS encryption solution for your Parker Flight application.
