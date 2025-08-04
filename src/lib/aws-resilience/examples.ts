/**
 * AWS Resilience System Usage Examples
 * 
 * Comprehensive examples showing how to use the AWS resilience system
 * for different AWS services and scenarios.
 */

import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

import {
  executeWithResilience,
  createAwsResilientClient,
  withAwsResilience,
  resilienceOrchestrator
} from './resilience-orchestrator';

// Example 1: Direct usage with executeWithResilience
export async function encryptDataWithResilience(keyId: string, plaintext: string): Promise<string> {
  const kmsClient = new KMSClient({ region: 'us-east-1' });
  
  const result = await executeWithResilience(
    'KMS',
    'encrypt',
    async () => {
      const command = new EncryptCommand({
        KeyId: keyId,
        Plaintext: Buffer.from(plaintext)
      });
      
      const response = await kmsClient.send(command);
      return Buffer.from(response.CiphertextBlob!).toString('base64');
    },
    { keyId, plaintextLength: plaintext.length }
  );
  
  return result;
}

// Example 2: Wrapping an entire client
export function createResilientKmsClient() {
  const kmsClient = new KMSClient({ region: 'us-east-1' });
  return createAwsResilientClient(kmsClient, 'KMS');
}

// Example 3: Using higher-order function wrapper
export const resilientGetSecret = withAwsResilience(
  'SECRETS_MANAGER',
  'getSecretValue',
  async (secretName: string) => {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);
    return response.SecretString;
  }
);

// Example 4: Complex DynamoDB operations with resilience
export class ResilientUserService {
  private dynamoClient: DynamoDBClient;
  
  constructor() {
    this.dynamoClient = createAwsResilientClient(
      new DynamoDBClient({ region: 'us-east-1' }),
      'DYNAMODB'
    );
  }
  
  async getUser(userId: string): Promise<any> {
    const command = new GetItemCommand({
      TableName: 'Users',
      Key: {
        userId: { S: userId }
      }
    });
    
    const response = await this.dynamoClient.send(command);
    return response.Item;
  }
  
  async createUser(userData: any): Promise<void> {
    const command = new PutItemCommand({
      TableName: 'Users',
      Item: userData
    });
    
    await this.dynamoClient.send(command);
  }
}

// Example 5: Batch operations with individual resilience
export async function batchEncryptData(items: Array<{ keyId: string; data: string }>): Promise<string[]> {
  const results = await Promise.allSettled(
    items.map(item => 
      executeWithResilience(
        'KMS',
        'encrypt',
        async () => {
          const client = new KMSClient({ region: 'us-east-1' });
          const command = new EncryptCommand({
            KeyId: item.keyId,
            Plaintext: Buffer.from(item.data)
          });
          
          const response = await client.send(command);
          return Buffer.from(response.CiphertextBlob!).toString('base64');
        },
        { keyId: item.keyId, dataLength: item.data.length }
      )
    )
  );
  
  // Handle partial failures gracefully
  const successfulResults: string[] = [];
  const failedIndices: number[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulResults.push(result.value);
    } else {
      failedIndices.push(index);
      console.error(`Failed to encrypt item ${index}:`, result.reason);
    }
  });
  
  if (failedIndices.length > 0) {
    console.warn(`${failedIndices.length} out of ${items.length} encryption operations failed`);
  }
  
  return successfulResults;
}

// Example 6: Monitoring and health checks
export class ResilienceMonitor {
  
  getSystemHealth() {
    return resilienceOrchestrator.getHealthStatus();
  }
  
  getDetailedMetrics() {
    return resilienceOrchestrator.getComprehensiveMetrics();
  }
  
  async performHealthCheck(): Promise<{
    overall: string;
    services: Record<string, any>;
    recommendations: string[];
  }> {
    const health = this.getSystemHealth();
    const metrics = this.getDetailedMetrics();
    const recommendations: string[] = [];
    
    // Analyze metrics and provide recommendations
    Object.entries(health.services).forEach(([serviceName, serviceHealth]) => {
      if (serviceHealth.status === 'unhealthy') {
        recommendations.push(`Service ${serviceName} is unhealthy - check circuit breaker status`);
      } else if (serviceHealth.status === 'degraded') {
        recommendations.push(`Service ${serviceName} is degraded - monitor for potential issues`);
      }
      
      if (serviceHealth.avgResponseTime > 5000) {
        recommendations.push(`Service ${serviceName} has high response times - consider optimization`);
      }
      
      if (serviceHealth.successRate < 0.95) {
        recommendations.push(`Service ${serviceName} has low success rate - investigate error patterns`);
      }
    });
    
    return {
      overall: health.overall,
      services: health.services,
      recommendations
    };
  }
  
  resetSystem() {
    resilienceOrchestrator.resetAll();
    console.log('Resilience system reset completed');
  }
}

// Example 7: Error handling patterns
export async function handleAwsOperationWithFallback<T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  serviceName: string,
  operationName: string
): Promise<T> {
  try {
    return await executeWithResilience(
      serviceName,
      operationName,
      primaryOperation
    );
  } catch (error) {
    console.warn(`Primary ${serviceName}:${operationName} failed, using fallback:`, error);
    
    try {
      return await fallbackOperation();
    } catch (fallbackError) {
      console.error(`Both primary and fallback operations failed:`, {
        primaryError: error,
        fallbackError
      });
      throw fallbackError;
    }
  }
}

// Example 8: Configuration and setup
export function setupAwsResilience() {
  console.log('Setting up AWS resilience system...');
  
  // The system is automatically initialized when imported
  // Health checks and cleanup processes are started automatically
  
  // Optional: Add custom monitoring
  const monitor = new ResilienceMonitor();
  
  // Log health status every 5 minutes
  setInterval(async () => {
    const healthCheck = await monitor.performHealthCheck();
    console.log('System Health Check:', {
      overall: healthCheck.overall,
      services: Object.keys(healthCheck.services).length,
      recommendations: healthCheck.recommendations.length
    });
    
    if (healthCheck.recommendations.length > 0) {
      console.warn('Health recommendations:', healthCheck.recommendations);
    }
  }, 300000); // 5 minutes
  
  console.log('AWS resilience system setup complete');
}

// Example 9: Testing circuit breaker behavior
export async function testCircuitBreakerBehavior() {
  console.log('Testing circuit breaker behavior...');
  
  // Simulate failing operations to trigger circuit breaker
  const failingOperation = async () => {
    throw new Error('Simulated service failure');
  };
  
  // Try multiple operations to trigger circuit breaker
  for (let i = 0; i < 20; i++) {
    try {
      await executeWithResilience(
        'KMS',
        'testOperation',
        failingOperation
      );
    } catch (error) {
      console.log(`Operation ${i + 1} failed:`, error.message);
    }
    
    // Small delay between operations
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Check circuit breaker status
  const metrics = resilienceOrchestrator.getComprehensiveMetrics();
  console.log('Circuit breaker status:', metrics.circuitBreakers.KMS);
}

// Example 10: Integration with existing error handling
export function wrapExistingAwsService<T extends Record<string, any>>(
  service: T,
  serviceName: string,
  methodsToWrap: string[] = []
): T {
  const wrappedService = { ...service };
  
  // Wrap specific methods or all methods if none specified
  const methodNames = methodsToWrap.length > 0 
    ? methodsToWrap 
    : Object.getOwnPropertyNames(service).filter(name => 
        typeof service[name] === 'function' && 
        !name.startsWith('_') &&
        name !== 'constructor'
      );
  
  methodNames.forEach(methodName => {
    const originalMethod = service[methodName];
    if (typeof originalMethod === 'function') {
      (wrappedService as any)[methodName] = withAwsResilience(
        serviceName,
        methodName,
        originalMethod.bind(service)
      );
    }
  });
  
  return wrappedService;
}
