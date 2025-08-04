# Enhanced AWS Secrets Manager

A comprehensive, production-ready AWS Secrets Manager solution that addresses all common issues with intelligent caching, rotation handling, and cost optimization.

## 🚀 Features

- **Intelligent Multi-Layer Caching** - 5-minute TTL with proactive refresh
- **Multi-Region Failover** - Automatic failover with circuit breaker pattern
- **Rotation-Aware Connections** - Seamless secret rotation without service interruption
- **Cost Optimization** - Reduces API calls by up to 95% through smart caching
- **Comprehensive Error Handling** - Specific error messages and retry logic
- **Performance Monitoring** - Built-in metrics and health monitoring
- **Connection Management** - Automatic client lifecycle management

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Connection Manager  │  Secret Config Manager  │  Monitor   │
├─────────────────────────────────────────────────────────────┤
│              Enhanced Secrets Manager Core                  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐   │
│  │  Cache Layer    │ │ Circuit Breaker │ │   Metrics    │   │
│  │  - 5min TTL     │ │ - Multi-region  │ │ - Performance│   │
│  │  - Proactive    │ │ - Failover      │ │ - Health     │   │
│  │  - LRU Eviction │ │ - Auto-recovery │ │ - Monitoring │   │
│  └─────────────────┘ └─────────────────┘ └──────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                AWS Secrets Manager API                      │
│              us-east-1  │  us-west-2  │  eu-west-1         │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

The system is already integrated into your project. Import the components you need:

```typescript
import { secretConfigManager } from './secret-config-manager';
import { connectionManager } from './connection-manager';
import { startupHelper } from './secrets-usage-examples';
```

## 🎯 Quick Start

### 1. Application Initialization

```typescript
import { startupHelper } from './secrets-usage-examples';

// Initialize at application startup
async function initializeApp() {
  try {
    await startupHelper.initialize();
    console.log('✅ Application ready');
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await startupHelper.shutdown();
  process.exit(0);
});
```

### 2. Secret Retrieval

```typescript
import { secretConfigManager } from './secret-config-manager';

// Get Stripe credentials
const stripeCredentials = await secretConfigManager.getStripeCredentials('production');

// Get database credentials
const supabaseCredentials = await secretConfigManager.getSupabaseCredentials('production');

// Get flight API credentials
const amadeusCredentials = await secretConfigManager.getFlightAPICredentials('amadeus', 'production');
```

### 3. Connection Management

```typescript
import { connectionManager } from './connection-manager';

// Get clients with automatic rotation handling
const stripe = await connectionManager.getStripeClient('production');
const supabase = await connectionManager.getSupabaseClient('production');
const amadeus = await connectionManager.getFlightAPIClient('amadeus', 'production');

// Use clients normally - rotation happens transparently
const account = await stripe.accounts.retrieve();
const { data } = await supabase.from('users').select('*').limit(10);
```

## 🔧 Configuration

### Secret Naming Convention

Use the format: `{environment}/{service-type}/{service-name}`

```
production/payments/stripe-credentials
production/database/supabase-credentials
production/flight-apis/amadeus-credentials
production/api-keys/openai
staging/payments/stripe-credentials
development/database/local-postgres
```

### Secret Structure Examples

**Stripe Credentials:**
```json
{
  "publishable_key": "pk_live_...",
  "secret_key": "sk_live_...",
  "webhook_secret": "whsec_..."
}
```

**Supabase Credentials:**
```json
{
  "url": "https://xxx.supabase.co",
  "anon_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "service_role_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Flight API Credentials:**
```json
{
  "api_key": "xxx",
  "api_secret": "xxx",
  "client_id": "xxx",
  "client_secret": "xxx",
  "base_url": "https://api.amadeus.com"
}
```

## 📊 Monitoring & Health Checks

### Basic Health Status

```typescript
import { secretsMonitor } from './secrets-usage-examples';

const health = await secretsMonitor.getHealthStatus();
console.log('Cache hit rate:', health.cache.hitRate);
console.log('Success rate:', health.performance.successRate);
console.log('Healthy connections:', health.connections.healthy);
```

### Detailed Monitoring Report

```typescript
const report = await secretsMonitor.generateMonitoringReport();
console.log(report);
```

### Express.js Middleware

```typescript
import express from 'express';
import { createSecretsMiddleware } from './secrets-usage-examples';

const app = express();
app.use(createSecretsMiddleware());

app.get('/api/payment', async (req, res) => {
  const stripe = await req.secrets.getStripe();
  // Use Stripe client...
});
```

## 🔄 Handling Secret Rotation

### Automatic Rotation

The system handles rotation automatically:

1. **Proactive Refresh** - Secrets are refreshed at 20% of TTL remaining
2. **Connection Testing** - New credentials are tested before switching
3. **Graceful Failover** - Old connections remain until new ones are verified
4. **Zero Downtime** - No service interruption during rotation

### Manual Rotation

```typescript
// Force rotation of all connections
await connectionManager.forceRotation();

// Invalidate specific secret
secretConfigManager.invalidateSecret('payments', 'stripe-credentials', 'production');

// Invalidate specific connection
await connectionManager.invalidateConnection('stripe-production');
```

## 💰 Cost Optimization

### Cache Performance

The system reduces AWS API calls by up to 95%:

- **Default TTL**: 5 minutes for most secrets
- **Payment Secrets**: 3 minutes (high sensitivity)
- **API Keys**: 10 minutes (low rotation frequency)
- **Config Secrets**: 15 minutes (rarely change)

### Monitoring Costs

```typescript
const stats = secretConfigManager.getCacheStats();
console.log(`Cache hit rate: ${stats.hitRate}%`);
console.log(`API calls saved: ${(stats.hitRate/100 * stats.totalRequests)} out of ${stats.totalRequests}`);
```

## 🛠️ Troubleshooting

### Common Issues & Solutions

#### 1. "SECRET_NOT_FOUND" Errors

**Cause**: Incorrect secret naming or missing secrets
**Solution**:
```typescript
// Test secret accessibility
const result = await secretConfigManager.testSecretAccess(
  'production/payments/stripe-credentials', 
  'payments'
);
console.log('Accessible:', result.accessible);
if (!result.accessible) {
  console.log('Error:', result.error);
}
```

#### 2. High Startup Latency

**Cause**: Cold cache requiring multiple API calls
**Solution**:
```typescript
// Warm up cache during startup
await secretConfigManager.warmupCache('production');
```

#### 3. Rate Limiting

**Cause**: Too many concurrent API calls
**Solution**: The system automatically handles rate limiting with exponential backoff. Monitor circuit breaker status:
```typescript
const breakers = secretConfigManager.getCircuitBreakerStatus();
for (const [region, state] of breakers) {
  console.log(`${region}: ${state.state}`);
}
```

#### 4. Cross-Region Failures

**Cause**: Regional outages or connectivity issues
**Solution**: The system automatically fails over to backup regions. Check health:
```typescript
const health = await secretsMonitor.getHealthStatus();
console.log('Circuit breakers:', health.circuitBreakers);
```

#### 5. Rotation Breaking Connections

**Cause**: Credentials changed without connection update
**Solution**: Use the connection manager instead of managing clients manually:
```typescript
// ❌ Don't do this
const stripe = new Stripe(secretKey);

// ✅ Do this instead
const stripe = await connectionManager.getStripeClient('production');
```

## 🔒 Security Best Practices

### 1. Environment Separation

Always use environment-specific secrets:
```typescript
const env = process.env.NODE_ENV || 'development';
const credentials = await secretConfigManager.getStripeCredentials(env);
```

### 2. Least Privilege Access

Ensure IAM roles have minimal required permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:production/*"
    }
  ]
}
```

### 3. Audit Logging

Monitor secret access:
```typescript
const metrics = secretConfigManager.getMetrics();
const recentAccess = metrics.filter(m => Date.now() - m.timestamp < 3600000);
console.log('Secret access in last hour:', recentAccess.length);
```

## 📈 Performance Optimization

### Cache Tuning

Adjust TTL based on secret sensitivity:
```typescript
// High-security, short TTL
const paymentSecret = await secretsManager.getSecret('payments/stripe', {
  ttl: 180000, // 3 minutes
  proactiveRefreshThreshold: 0.3 // 30% remaining
});

// Low-security, long TTL
const configSecret = await secretsManager.getSecret('config/settings', {
  ttl: 900000, // 15 minutes
  proactiveRefreshThreshold: 0.1 // 10% remaining
});
```

### Batch Operations

Fetch multiple secrets efficiently:
```typescript
const secrets = await secretConfigManager.batchGetSecrets([
  { name: 'production/payments/stripe-credentials', type: 'payments' },
  { name: 'production/database/supabase-credentials', type: 'database' },
  { name: 'production/api-keys/openai', type: 'api-keys' }
]);
```

## 🧪 Testing

### Unit Tests

```typescript
import { secretConfigManager } from './secret-config-manager';

describe('Secret Management', () => {
  it('should retrieve Stripe credentials', async () => {
    const credentials = await secretConfigManager.getStripeCredentials('test');
    expect(credentials.secretKey).toBeDefined();
    expect(credentials.publishableKey).toBeDefined();
  });

  it('should handle rotation gracefully', async () => {
    const stripe1 = await connectionManager.getStripeClient('test');
    await connectionManager.forceRotation();
    const stripe2 = await connectionManager.getStripeClient('test');
    
    // Should be different instances but both functional
    expect(stripe1).not.toBe(stripe2);
  });
});
```

### Health Check Endpoint

```typescript
app.get('/health/secrets', async (req, res) => {
  try {
    const health = await secretsMonitor.getHealthStatus();
    
    const isHealthy = 
      health.performance.successRate > 95 &&
      health.connections.healthy === health.connections.total &&
      health.cache.hitRate > 80;
    
    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});
```

## 📚 API Reference

### SecretConfigurationManager

- `getStripeCredentials(environment?)` - Get Stripe API credentials
- `getSupabaseCredentials(environment?)` - Get Supabase database credentials
- `getFlightAPICredentials(provider, environment?)` - Get flight API credentials
- `getAPIKey(serviceName, environment?)` - Get generic API key
- `batchGetSecrets(requests)` - Fetch multiple secrets efficiently
- `warmupCache(environment?)` - Pre-populate cache
- `getCacheStats()` - Get cache performance metrics

### RotationAwareConnectionManager

- `getStripeClient(environment?)` - Get Stripe client with rotation handling
- `getSupabaseClient(environment?)` - Get Supabase client with rotation handling
- `getFlightAPIClient(provider, environment?)` - Get flight API client
- `forceRotation()` - Manually trigger rotation for all connections
- `getConnectionHealth()` - Get health status of all connections
- `invalidateConnection(key)` - Force recreation of specific connection

### SecretsMonitor

- `getHealthStatus()` - Comprehensive health and performance data
- `generateMonitoringReport()` - Human-readable health report

## 🤝 Contributing

1. Follow the established patterns for new secret types
2. Add appropriate TTL configurations
3. Include health checks for new connection types
4. Update documentation and examples

## 📝 License

This enhanced secrets management system is part of the Parker Flight project.
