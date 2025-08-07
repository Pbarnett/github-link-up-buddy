# GitHub Link Buddy - Enterprise AWS Optimized Platform

A comprehensive full-stack application for managing GitHub repositories and links with enterprise-grade AWS optimization patterns, advanced monitoring, and zero-downtime deployment capabilities.

## 🌟 Enterprise AWS Optimization Features

### 🔧 Infrastructure Optimization
- **Multi-Region Architecture**: Automated failover between us-east-1 and us-west-2
- **Cost Optimization**: Automated weekly cost analysis with Lambda-based recommendations
- **S3 Intelligent Tiering**: Automatic storage class optimization for 30-60% cost savings
- **DynamoDB Global Tables**: Multi-region replication with pay-per-request billing
- **AWS Backup**: Cross-region backup with 1-hour RPO and 15-minute RTO targets

### 🔒 Security & Compliance
- **End-to-End Encryption**: Customer-managed KMS keys with automatic rotation
- **AWS Secrets Manager**: Secure credential management with automatic rotation
- **VPC Isolation**: Lambda functions and databases in private subnets
- **Security Groups**: Least-privilege network access controls
- **CloudTrail Integration**: Comprehensive audit logging with 7-year retention

### 📊 Monitoring & Observability
- **X-Ray Distributed Tracing**: Full request tracing across Lambda, API Gateway, and DynamoDB
- **CloudWatch Insights**: Custom queries for P99 latency and error analysis
- **Custom Metrics**: Business KPI tracking and correlation
- **Comprehensive Dashboards**: Real-time performance and cost monitoring
- **Automated Alerting**: SNS notifications for SLA violations and anomalies

### 🚀 Deployment & DevOps
- **Zero-Downtime Deployments**: Blue-green deployment with ALB target groups
- **API Gateway Optimization**: Caching, throttling, and request validation
- **Lambda Cost Controls**: Reserved concurrency and automated optimization
- **Container Optimization**: Multi-stage Docker builds with security scanning
- **Infrastructure as Code**: Complete CloudFormation templates with best practices

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│  API Gateway     │────│     Lambda      │
│   (Global CDN)  │    │  (Regional)      │    │   (Optimized)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                       ┌──────────────────┐    ┌─────────────────┐
                       │       ALB        │    │   DynamoDB      │
                       │  (Blue-Green)    │    │ (Global Tables) │
                       └──────────────────┘    └─────────────────┘
                                │                        │
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Target Groups  │    │       S3        │
                       │ (Health Checks)  │    │ (Intelligent    │
                       └──────────────────┘    │   Tiering)      │
                                               └─────────────────┘
```

## 🚀 LaunchDarkly Server Integration - COMPLETED ✅

### Overview
The LaunchDarkly server-side integration is **fully implemented and operational**. This enables server-side feature flag evaluation in Supabase Edge Functions for production-ready feature management.

### Features Implemented
- ✅ **Server SDK Integration**: LaunchDarkly Node.js SDK integrated in Supabase Edge Functions
- ✅ **Environment Configuration**: Production SDK keys properly configured
- ✅ **Shared Utilities**: Comprehensive utility functions for context management
- ✅ **Health Monitoring**: Health check endpoints for integration monitoring
- ✅ **Production Usage**: Currently used in `flight-search-v2` function
- ✅ **Verification Scripts**: Comprehensive testing and verification scripts

### Current Implementation

**Environment Configuration (.env)**
```bash
LAUNCHDARKLY_SDK_KEY=sdk-382cff6d-3979-4830-a69d-52eb1bd09299
VITE_LD_CLIENT_ID=686f3ab8ed094f0948726002
LAUNCHDARKLY_MOBILE_KEY=mob-d47fc938-7ec3-4a62-9916-a27230095fda
```

**Server Function**: `supabase/functions/launchdarkly-server/index.ts`
- Full LaunchDarkly server SDK implementation
- Context validation and error handling
- Performance monitoring and event tracking
- Health check endpoints

**Shared Utilities**: `supabase/functions/_shared/launchdarkly.ts`
- User, organization, and device context helpers
- Multi-context support for complex targeting
- Health check functions
- Request/response interfaces

### Production Usage Example
The integration is actively used in the flight search function:
```typescript
// Evaluate feature flags for flight search behavior
const useAdvancedFiltering = await evaluateFlag('flight-search-advanced-filtering', userContext, false);
const enablePriceOptimization = await evaluateFlag('flight-search-price-optimization', userContext, false);
const maxOfferLimit = await evaluateFlag('flight-search-max-offers', userContext, 10);
```

### Active Feature Flags
- `wallet_ui`: **ENABLED** - Controls wallet UI features
- `profile_ui_revamp`: Disabled - Profile enhancement features  
- `personalization_greeting`: **ENABLED** - Friend-test personalized user greetings
- `flight-search-advanced-filtering`: Server-side flight filtering
- `flight-search-price-optimization`: Price optimization algorithms
- `flight-search-max-offers`: Dynamic offer limit control

### Verification & Testing
Run the comprehensive verification scripts:
```bash
# Test server-side SDK integration
npx tsx scripts/verify-launchdarkly.ts

# Test client-side connectivity  
npx tsx scripts/test-launchdarkly-connectivity.ts

# Test server integration with Edge Functions
npx tsx scripts/test-launchdarkly-server-integration.ts
```

### Next Steps (Optional Enhancements)
1. **Expand Server Usage**: Integrate LaunchDarkly evaluation in additional Edge Functions
2. **A/B Testing**: Implement experimentation in booking and personalization flows  
3. **Advanced Targeting**: Add user segmentation based on behavior and preferences
4. **Analytics Integration**: Connect LaunchDarkly events with application analytics

---

## Feature Flag Utilities

### userInBucket

`userInBucket(userId: string, rollout: number) => boolean`

- **Description**: Determines if a user falls within the specified rollout percentage using consistent hashing with MurmurHash.
- **Parameters**:
  - `userId` (string): The unique user identifier.
  - `rollout` (number): The rollout percentage (0-100).
- **Returns**: `true` if the user should see the feature, `false` otherwise.
- **Why MurmurHash?**: Fast, non-cryptographic, stable across runtimes — ideal for consistent user bucketing.

### Example Usage

```typescript
const isEligible = userInBucket('user123', 10);
console.log(isEligible); // true if user falls within the 10% rollout
```

## 🏗️ AWS Deployment Guide

### Prerequisites

1. **AWS Account Setup**:
   - AWS CLI installed and configured
   - Required IAM permissions for CloudFormation, Lambda, DynamoDB, S3, etc.
   - SSL certificate issued via AWS Certificate Manager

2. **Environment Variables**:
   ```bash
   export NOTIFICATION_EMAIL="your-email@example.com"
   export DOMAIN_NAME="your-domain.com"
   export CERTIFICATE_ARN="arn:aws:acm:us-east-1:123456789012:certificate/abc123"
   export AWS_REGION="us-east-1"
   export SECONDARY_REGION="us-west-2"
   ```

### Quick Deployment

```bash
# Deploy complete AWS infrastructure
./scripts/deploy-optimized-infrastructure.sh

# Validate templates without deploying
./scripts/deploy-optimized-infrastructure.sh --dry-run

# View deployment help
./scripts/deploy-optimized-infrastructure.sh --help
```

### Infrastructure Components

The deployment creates the following optimized AWS resources:

#### Core Infrastructure (comprehensive-optimization.yml)
- **Multi-region KMS keys** with automatic rotation
- **DynamoDB Global Tables** for multi-region data replication
- **S3 buckets** with Intelligent Tiering and cross-region replication
- **AWS Backup** with cross-region vault replication
- **X-Ray sampling rules** for distributed tracing
- **CloudWatch dashboards** and alarms
- **AWS Secrets Manager** for secure credential storage
- **Route 53 health checks** for failover automation

#### Lambda Optimization (lambda-optimization.yml)
- **Cost-optimized Lambda functions** with X-Ray tracing
- **Automated cost monitoring** with weekly analysis
- **Reserved concurrency limits** based on environment
- **CloudWatch Log Groups** with appropriate retention
- **Security Groups** with least-privilege access

#### API Gateway & ALB (api-gateway-alb-optimization.yml)
- **API Gateway** with caching, throttling, and validation
- **Application Load Balancer** with SSL termination
- **Blue-Green deployment** target groups
- **Health checks** and connection draining
- **Weighted routing** for canary deployments
- **Access logging** to S3 with lifecycle policies

### Cost Optimization Features

1. **Automated Cost Monitoring**:
   - Weekly Lambda function analyzes costs and usage
   - Recommendations sent via SNS notifications
   - Memory and concurrency optimization suggestions

2. **Storage Optimization**:
   - S3 Intelligent Tiering for automatic cost reduction
   - Lifecycle policies for logs and backups
   - Cross-region replication to lower-cost storage classes

3. **Database Optimization**:
   - DynamoDB pay-per-request billing
   - Global Secondary Indexes for efficient queries
   - Point-in-time recovery for data protection

4. **Lambda Optimization**:
   - Reserved concurrency limits to control costs
   - Memory size optimization based on usage patterns
   - Cold start detection and recommendations

### Security Features

1. **Encryption**:
   - Customer-managed KMS keys for all services
   - Multi-region key replication
   - Automatic key rotation enabled

2. **Network Security**:
   - VPC isolation for Lambda functions
   - Security groups with least-privilege access
   - Private subnets for sensitive resources

3. **Access Control**:
   - IAM roles with minimal permissions
   - AWS Secrets Manager for credential management
   - CloudTrail logging with 7-year retention

### Monitoring & Alerting

1. **X-Ray Distributed Tracing**:
   - Custom sampling rules for different endpoints
   - Error detection and performance analysis
   - Service map visualization

2. **CloudWatch Monitoring**:
   - Custom dashboards for all services
   - Automated alerting for SLA violations
   - Cost and performance metrics

3. **Health Checks**:
   - API Gateway and ALB health endpoints
   - Route 53 health checks for failover
   - Automated recovery procedures

### Disaster Recovery

- **RPO**: 1 hour (Recovery Point Objective)
- **RTO**: 15 minutes (Recovery Time Objective)
- **Multi-region replication** for all data stores
- **Automated failover** with Route 53 health checks
- **Cross-region backup** with AWS Backup

### Deployment Verification

After deployment, the system automatically:

1. Tests API Gateway health endpoints
2. Verifies DynamoDB table access
3. Confirms S3 bucket connectivity
4. Generates comprehensive deployment report

### Production Readiness Checklist

- ✅ **Multi-region deployment** with automated failover
- ✅ **End-to-end encryption** with customer-managed keys
- ✅ **Comprehensive monitoring** with alerts and dashboards
- ✅ **Cost optimization** with automated recommendations
- ✅ **Security compliance** with AWS best practices
- ✅ **Zero-downtime deployments** with blue-green strategy
- ✅ **Disaster recovery** with cross-region backups
- ✅ **Performance optimization** with caching and CDN

### Troubleshooting

**Common Issues**:

1. **VPC/Subnet Issues**: Ensure you have public and private subnets in multiple AZs
2. **Certificate Issues**: SSL certificate must be in the same region as ALB
3. **Permissions Issues**: Ensure IAM user has CloudFormation and service permissions
4. **Domain Issues**: Domain must be resolvable and certificate must match

**Logs and Monitoring**:
- Deployment logs: `deployment-logs/deployment-YYYYMMDD_HHMMSS.log`
- CloudWatch logs: Check `/aws/lambda/` and `/aws/apigateway/` log groups
- X-Ray traces: AWS X-Ray console for distributed tracing
- CloudFormation events: AWS Console > CloudFormation > Events

### Cleanup

```bash
# Remove all AWS resources
./scripts/deploy-optimized-infrastructure.sh --cleanup
```

**Note**: This will delete all resources including data. Ensure you have backups if needed.

