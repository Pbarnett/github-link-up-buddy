# Enhanced AWS SDK Usage Examples

This document provides comprehensive usage examples for the enhanced AWS SDK integration with your encryption workflows. The enhanced capabilities include production-grade client factory, intelligent error handling, and multi-region resilience.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Enhanced Client Factory](#enhanced-client-factory)
3. [Error Handling Examples](#error-handling-examples)
4. [Multi-Region Configuration](#multi-region-configuration)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

## Basic Usage

### Shared Package (Node.js/TypeScript)

```typescript
import { 
  encryptPaymentData, 
  decryptPaymentData, 
  validateKMSKey,
  safeKMSOperation 
} from '../packages/shared/kms';

// Basic encryption/decryption
async function handlePaymentData() {
  const paymentData = {
    fingerprint: 'card_123',
    network: 'visa',
    wallet: 'apple_pay',
    three_d_secure_usage: { supported: true }
  };

  try {
    // Encrypt payment data with enhanced error handling
    const encrypted = await encryptPaymentData(paymentData);
    console.log('✅ Payment data encrypted successfully');
    
    // Decrypt payment data with multi-region failover
    const decrypted = await decryptPaymentData(encrypted.encryptedData);
    console.log('✅ Payment data decrypted successfully', decrypted);
    
  } catch (error) {
    console.error('❌ Payment data operation failed:', error.message);
    // Error message now includes actionable suggestions
  }
}
```

### Supabase Edge Functions (Deno)

```typescript
import { 
  encryptData, 
  decryptData,
  encryptUserProfile,
  decryptUserProfile,
  safeKMSOperation,
  analyzeKMSError,
  createKMSAuditLog
} from '../shared/kms.ts';

// Handle user profile encryption
export async function encryptUserData(profileData: any) {
  try {
    // Automatically selects appropriate keys based on data sensitivity
    const encrypted = await encryptUserProfile(profileData);
    
    // Create audit log
    const auditLog = createKMSAuditLog('encrypt_profile', true, 'PII', {
      fieldsCount: Object.keys(profileData).length
    });
    
    console.log('✅ User profile encrypted', auditLog);
    return encrypted;
    
  } catch (error) {
    // Enhanced error analysis
    const errorAnalysis = analyzeKMSError(error);
    
    const auditLog = createKMSAuditLog('encrypt_profile', false, 'PII', {
      errorCategory: errorAnalysis.category,
      retryable: errorAnalysis.retryable
    });
    
    console.error('❌ Profile encryption failed', auditLog);
    throw new Error(`Encryption failed: ${errorAnalysis.suggestions.join(', ')}`);
  }
}
```

## Enhanced Client Factory

### Environment-Optimized Configuration

```typescript
import { EnhancedAWSClientFactory, Environment } from '../src/lib/aws-sdk-enhanced/client-factory';

// Development configuration
const devKMSClient = EnhancedAWSClientFactory.createKMSClient({
  region: 'us-east-1',
  environment: 'development',
  enableLogging: true,
  enableMetrics: false,
  maxAttempts: 2,
  connectionTimeout: 3000,
  socketTimeout: 10000,
});

// Production configuration
const prodKMSClient = EnhancedAWSClientFactory.createKMSClient({
  region: 'us-east-1',
  environment: 'production',
  enableLogging: false,        // Reduced logging for performance
  enableMetrics: true,         // Enable CloudWatch metrics
  enableTracing: true,         // Enable X-Ray tracing
  maxAttempts: 3,
  connectionTimeout: 5000,
  socketTimeout: 30000,
  maxSockets: 50,              // Connection pooling
  keepAlive: true,
});

// Custom credential configuration
const customKMSClient = EnhancedAWSClientFactory.createKMSClient({
  region: 'us-east-1',
  environment: 'production',
  credentialSource: 'instance-metadata', // For EC2 instances
  // credentialSource: 'container-metadata', // For ECS/Fargate
  // credentialSource: 'environment', // For local development
});
```

### Multiple Service Clients

```typescript
// Create clients for different AWS services
const kmsClient = EnhancedAWSClientFactory.createKMSClient(config);
const s3Client = EnhancedAWSClientFactory.createS3Client(config);
const dynamoClient = EnhancedAWSClientFactory.createDynamoDBClient(config);
const cloudWatchClient = EnhancedAWSClientFactory.createCloudWatchClient(config);

// Clients are cached and reused automatically
const sameKMSClient = EnhancedAWSClientFactory.createKMSClient(config); // Returns cached instance
```

## Error Handling Examples

### Intelligent Error Analysis

```typescript
import { EnhancedAWSErrorHandler, ErrorCategory } from '../src/lib/aws-sdk-enhanced/error-handling';
import { EncryptCommand } from '@aws-sdk/client-kms';

async function handleKMSOperationWithRetry() {
  try {
    const command = new EncryptCommand({
      KeyId: 'alias/my-key',
      Plaintext: Buffer.from('sensitive data', 'utf8'),
    });
    
    const response = await kmsClient.send(command);
    return response;
    
  } catch (error) {
    // Analyze error for actionable insights
    const enhancedError = EnhancedAWSErrorHandler.analyzeError(
      error as Error,
      'kms',
      'encrypt'
    );
    
    console.error('KMS Operation Failed:', {
      category: enhancedError.category,
      code: enhancedError.code,
      retryable: enhancedError.retryable,
      statusCode: enhancedError.statusCode,
      suggestions: enhancedError.suggestions
    });
    
    // Handle different error categories
    switch (enhancedError.category) {
      case ErrorCategory.AUTHENTICATION:
        console.error('🔑 Check your AWS credentials');
        break;
        
      case ErrorCategory.AUTHORIZATION:
        console.error('🚫 Check IAM permissions and key policies');
        break;
        
      case ErrorCategory.RATE_LIMIT:
        console.error('🚦 Consider implementing exponential backoff');
        break;
        
      case ErrorCategory.SERVICE_UNAVAILABLE:
        console.error('🌐 AWS service may be experiencing issues');
        break;
        
      default:
        console.error('❓ Unknown error category');
    }
    
    throw enhancedError;
  }
}
```

### Retry Logic with Enhanced Error Handling

```typescript
import { safeKMSOperation } from '../packages/shared/kms';

async function robustEncryption(data: any) {
  return await safeKMSOperation(
    async () => {
      // Your KMS operation
      return await encryptPaymentData(data);
    },
    'encrypt_payment_data',  // Operation name for logging
    3,                       // Max retries
    1000                     // Base delay in ms
  );
}

// The function will:
// 1. Analyze each error to determine if retry is appropriate
// 2. Use exponential backoff with jitter
// 3. Provide detailed logging for each attempt
// 4. Only retry on retryable errors (not auth/validation errors)
```

## Multi-Region Configuration

### Basic Multi-Region Setup

```typescript
import { MultiRegionAWSManager } from '../src/lib/aws-sdk-enhanced/multi-region-manager';

const multiRegionManager = new MultiRegionAWSManager({
  primaryRegion: 'us-east-1',
  backupRegions: ['us-west-2', 'eu-west-1'],
  services: ['kms', 's3', 'dynamodb'],
  environment: 'production',
  failoverStrategy: 'latency',  // or 'priority' or 'round-robin'
  healthCheckInterval: 30000,   // 30 seconds
  circuitBreakerThreshold: 5,   // Failures before circuit opens
});

// Execute operations with automatic failover
async function encryptWithFailover(data: any) {
  return await multiRegionManager.executeWithFailover(
    'kms',
    async (client) => {
      const command = new EncryptCommand({
        KeyId: 'alias/my-key',
        Plaintext: Buffer.from(JSON.stringify(data), 'utf8'),
      });
      return await client.send(command);
    },
    { 
      operation: 'encrypt',
      retries: 2,
      timeout: 10000 
    }
  );
}
```

### Advanced Multi-Region Configuration

```typescript
// Custom failover strategy
const advancedMultiRegion = new MultiRegionAWSManager({
  primaryRegion: 'us-east-1',
  backupRegions: ['us-west-2', 'eu-west-1', 'ap-southeast-1'],
  services: ['kms'],
  environment: 'production',
  
  // Advanced configuration
  failoverStrategy: 'latency',
  healthCheckInterval: 15000,
  circuitBreakerThreshold: 3,
  circuitBreakerTimeout: 60000,
  
  // Custom health check
  customHealthCheck: async (client, region) => {
    try {
      const start = Date.now();
      await client.send(new ListKeysCommand({ Limit: 1 }));
      const latency = Date.now() - start;
      
      return {
        healthy: latency < 1000, // Consider healthy if < 1s
        latency,
        region
      };
    } catch (error) {
      return { healthy: false, latency: Infinity, region };
    }
  }
});

// Monitor region health
multiRegionManager.on('regionHealthChange', (event) => {
  console.log(`Region ${event.region} health changed:`, {
    healthy: event.healthy,
    latency: event.latency,
    timestamp: event.timestamp
  });
});

multiRegionManager.on('failover', (event) => {
  console.log(`Failover occurred:`, {
    from: event.fromRegion,
    to: event.toRegion,
    reason: event.reason,
    operation: event.operation
  });
});
```

## Production Deployment

### Environment Configuration

```bash
# Production environment variables
export NODE_ENV=production
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=AKIA...  # Use IAM roles in production
export AWS_SECRET_ACCESS_KEY=...  # Use IAM roles in production

# KMS Key aliases
export KMS_GENERAL_ALIAS=alias/parker-flight-general-production
export KMS_PII_ALIAS=alias/parker-flight-pii-production
export KMS_PAYMENT_ALIAS=alias/parker-flight-payment-production

# Enhanced SDK configuration
export AWS_SDK_LOAD_CONFIG=1
export AWS_SDK_LOG_LEVEL=warn
export AWS_SDK_ENABLE_METRICS=true
export AWS_SDK_ENABLE_TRACING=true
```

### Docker Configuration

```dockerfile
# In your Dockerfile
ENV NODE_ENV=production
ENV AWS_SDK_LOAD_CONFIG=1
ENV AWS_SDK_ENABLE_METRICS=true

# Use multi-stage build for smaller production image
FROM node:18-alpine AS production
WORKDIR /app

# Copy enhanced AWS SDK modules
COPY src/lib/aws-sdk-enhanced ./src/lib/aws-sdk-enhanced
COPY packages/shared ./packages/shared

# Install production dependencies
RUN npm ci --only=production

# Health check for KMS connectivity
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('./packages/shared/kms').validateKMSKey().then(r => process.exit(r ? 0 : 1))"

CMD ["node", "dist/index.js"]
```

### Kubernetes Deployment

```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: parker-flight-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: parker-flight-api
  template:
    metadata:
      labels:
        app: parker-flight-api
    spec:
      serviceAccountName: parker-flight-kms-service-account
      containers:
      - name: api
        image: parker-flight-api:latest
        env:
        - name: NODE_ENV
          value: "production"
        - name: AWS_REGION
          value: "us-east-1"
        # Use IAM roles for service accounts (IRSA) instead of access keys
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: parker-flight-kms-service-account
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::ACCOUNT:role/parker-flight-kms-role
```

### Monitoring and Observability

```typescript
// Custom CloudWatch metrics
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

class KMSMetrics {
  private cloudWatch: CloudWatchClient;
  
  constructor() {
    this.cloudWatch = EnhancedAWSClientFactory.createCloudWatchClient({
      region: process.env.AWS_REGION!,
      environment: process.env.NODE_ENV as Environment,
    });
  }
  
  async recordEncryption(success: boolean, duration: number, keyType: string) {
    const metrics = [
      {
        MetricName: 'KMSEncryptionDuration',
        Value: duration,
        Unit: 'Milliseconds',
        Dimensions: [
          { Name: 'KeyType', Value: keyType },
          { Name: 'Success', Value: success.toString() }
        ]
      },
      {
        MetricName: 'KMSEncryptionCount',
        Value: 1,
        Unit: 'Count',
        Dimensions: [
          { Name: 'KeyType', Value: keyType },
          { Name: 'Success', Value: success.toString() }
        ]
      }
    ];
    
    await this.cloudWatch.send(new PutMetricDataCommand({
      Namespace: 'ParkerFlight/KMS',
      MetricData: metrics
    }));
  }
}

// Usage in your encryption functions
const metrics = new KMSMetrics();

async function monitoredEncryption(data: any) {
  const start = Date.now();
  let success = false;
  
  try {
    const result = await encryptPaymentData(data);
    success = true;
    return result;
  } finally {
    const duration = Date.now() - start;
    await metrics.recordEncryption(success, duration, 'PAYMENT');
  }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Import Path Issues

```typescript
// ❌ Wrong import path
import { EnhancedAWSClientFactory } from './aws-sdk-enhanced/client-factory';

// ✅ Correct import path  
import { EnhancedAWSClientFactory } from '../src/lib/aws-sdk-enhanced/client-factory';
```

#### 2. Missing Dependencies

```bash
# Install required AWS SDK packages
npm install @aws-sdk/client-kms @aws-sdk/client-s3 @aws-sdk/client-dynamodb
npm install @aws-sdk/credential-providers @aws-sdk/node-http-handler
```

#### 3. Environment Variable Issues

```typescript
// Validate environment before using
import { validateKMSEnvironment } from '../packages/shared/kms';

const envCheck = validateKMSEnvironment();
if (!envCheck.isValid) {
  console.error('Environment validation failed:', envCheck.errors);
  process.exit(1);
}
```

#### 4. TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": [
    "src/**/*",
    "packages/**/*",
    "tests/**/*"
  ]
}
```

### Debug Mode

```typescript
// Enable debug logging
process.env.AWS_SDK_LOG_LEVEL = 'debug';
process.env.NODE_ENV = 'development';

// Test connectivity
import { testKMS } from '../supabase/functions/shared/kms.ts';

async function debugKMS() {
  console.log('Testing KMS connectivity...');
  const isWorking = await testKMS();
  console.log('KMS Test Result:', isWorking ? '✅ Working' : '❌ Failed');
}
```

### Performance Optimization

```typescript
// Connection pooling optimization
const optimizedConfig = {
  region: 'us-east-1',
  environment: 'production',
  maxSockets: 100,           // Increase for high throughput
  keepAlive: true,
  connectionTimeout: 3000,   // Faster timeouts for better UX
  socketTimeout: 15000,
  maxAttempts: 2,            // Reduce retries for faster failures
};

// Batch operations when possible
async function batchEncrypt(dataItems: any[]) {
  const results = await Promise.all(
    dataItems.map(data => encryptPaymentData(data))
  );
  return results;
}
```

## Support and Documentation

- **AWS SDK v3 Documentation**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/
- **KMS Best Practices**: https://docs.aws.amazon.com/kms/latest/developerguide/best-practices.html
- **Error Handling Guide**: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/interfaces/_aws_sdk_types.awsError.html

For additional support or questions about the enhanced AWS SDK integration, please refer to the project's issue tracker or documentation.
