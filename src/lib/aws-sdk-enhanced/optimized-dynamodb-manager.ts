import { 
  DynamoDBClient, 
  PutItemCommand, 
  UpdateItemCommand,
  GetItemCommand,
  QueryCommand
} from '@aws-sdk/client-dynamodb';
import { 
  ApplicationAutoScalingClient,
  RegisterScalableTargetCommand,
  PutScalingPolicyCommand
} from '@aws-sdk/client-application-auto-scaling';
import { Agent } from 'https';

interface DynamoDBConfig {
  region: string;
  environment: 'development' | 'staging' | 'production';
  tableName: string;
  capacityMode: 'PROVISIONED' | 'ON_DEMAND';
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  nextAttempt: number;
}

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class OptimizedDynamoDBManager {
  private client: DynamoDBClient;
  private autoScalingClient: ApplicationAutoScalingClient;
  private circuitBreaker = new Map<string, CircuitBreakerState>();
  private retryConfig: RetryConfig;

  constructor(config: DynamoDBConfig) {
    this.client = new DynamoDBClient({
      region: config.region,
      maxAttempts: 0 // We'll handle retries manually for better control
    });

    this.autoScalingClient = new ApplicationAutoScalingClient({
      region: config.region
    });

    this.retryConfig = this.getRetryConfig(config.environment);
  }

  private getConnectionTimeout(env: string): number {
    const timeouts = { development: 5000, staging: 8000, production: 10000 };
    return timeouts[env] || 5000;
  }

  private getSocketTimeout(env: string): number {
    const timeouts = { development: 10000, staging: 20000, production: 15000 };
    return timeouts[env] || 10000;
  }

  private getMaxSockets(env: string): number {
    const sockets = { development: 50, staging: 100, production: 200 };
    return sockets[env] || 50;
  }

  private getRetryConfig(env: string): RetryConfig {
    const configs = {
      development: { maxAttempts: 3, baseDelay: 100, maxDelay: 5000, backoffMultiplier: 2 },
      staging: { maxAttempts: 4, baseDelay: 200, maxDelay: 10000, backoffMultiplier: 2 },
      production: { maxAttempts: 5, baseDelay: 300, maxDelay: 20000, backoffMultiplier: 2.5 }
    };
    return configs[env] || configs.development;
  }

  // Setup auto-scaling for DynamoDB table
  async setupAutoScaling(tableName: string): Promise<void> {
    try {
      // Register read capacity as scalable target
      await this.autoScalingClient.send(new RegisterScalableTargetCommand({
        ServiceNamespace: 'dynamodb',
        ResourceId: `table/${tableName}`,
        ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
        MinCapacity: 5,
        MaxCapacity: 4000, // Adjust based on your needs
        RoleARN: process.env.DYNAMODB_AUTOSCALING_ROLE_ARN
      }));

      // Register write capacity as scalable target
      await this.autoScalingClient.send(new RegisterScalableTargetCommand({
        ServiceNamespace: 'dynamodb',
        ResourceId: `table/${tableName}`,
        ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
        MinCapacity: 5,
        MaxCapacity: 4000,
        RoleARN: process.env.DYNAMODB_AUTOSCALING_ROLE_ARN
      }));

      // Create scaling policies
      await this.createScalingPolicies(tableName);
      
      console.log(`Auto-scaling configured for table ${tableName}`);
    } catch (error) {
      console.error('Failed to setup auto-scaling:', error);
      throw error;
    }
  }

  private async createScalingPolicies(tableName: string): Promise<void> {
    // Read capacity scaling policy
    await this.autoScalingClient.send(new PutScalingPolicyCommand({
      PolicyName: `${tableName}-read-scaling-policy`,
      ServiceNamespace: 'dynamodb',
      ResourceId: `table/${tableName}`,
      ScalableDimension: 'dynamodb:table:ReadCapacityUnits',
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        TargetValue: 70.0, // Target 70% utilization
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'DynamoDBReadCapacityUtilization'
        },
        ScaleOutCooldown: 60, // 1 minute
        ScaleInCooldown: 300  // 5 minutes
      }
    }));

    // Write capacity scaling policy
    await this.autoScalingClient.send(new PutScalingPolicyCommand({
      PolicyName: `${tableName}-write-scaling-policy`,
      ServiceNamespace: 'dynamodb',
      ResourceId: `table/${tableName}`,
      ScalableDimension: 'dynamodb:table:WriteCapacityUnits',
      PolicyType: 'TargetTrackingScaling',
      TargetTrackingScalingPolicyConfiguration: {
        TargetValue: 70.0,
        PredefinedMetricSpecification: {
          PredefinedMetricType: 'DynamoDBWriteCapacityUtilization'
        },
        ScaleOutCooldown: 60,
        ScaleInCooldown: 300
      }
    }));
  }

  // Enhanced retry logic with exponential backoff and jitter
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationType: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (!this.shouldRetry(error as any, attempt)) {
          throw error;
        }

        const delay = this.calculateBackoffDelay(attempt, error as any);
        console.warn(`${operationType} failed (attempt ${attempt}/${this.retryConfig.maxAttempts}):`, {
          error: error.name,
          message: error.message,
          delay
        });

        if (attempt < this.retryConfig.maxAttempts) {
          await this.sleep(delay);
        }
      }
    }

    throw lastError!;
  }

  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt >= this.retryConfig.maxAttempts) return false;

    // Retryable DynamoDB errors
    const retryableErrors = [
      'ProvisionedThroughputExceededException',
      'ThrottlingException',
      'ServiceUnavailable',
      'InternalServerError',
      'RequestLimitExceeded'
    ];

    // Non-retryable errors
    const nonRetryableErrors = [
      'ValidationException',
      'ResourceNotFoundException',
      'AccessDeniedException',
      'ItemCollectionSizeLimitExceededException'
    ];

    if (nonRetryableErrors.includes(error.name)) {
      return false;
    }

    if (retryableErrors.includes(error.name)) {
      return true;
    }

    // Retry on network errors
    return error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT';
  }

  private calculateBackoffDelay(attempt: number, error: any): number {
    let delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1);
    
    // Add jitter (±25%)
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    delay += jitter;
    
    // Special handling for throttling - longer delays
    if (error.name === 'ProvisionedThroughputExceededException' || 
        error.name === 'ThrottlingException') {
      delay *= 2;
    }
    
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class ConditionalWriteManager {
  private dynamoManager: OptimizedDynamoDBManager;
  private readonly MAX_CONDITIONAL_RETRIES = 10;

  constructor(dynamoManager: OptimizedDynamoDBManager) {
    this.dynamoManager = dynamoManager;
  }

  async updateProfileWithOptimisticLocking(
    userId: string,
    updates: Record<string, any>,
    tableName: string
  ): Promise<boolean> {
    let attempt = 0;
    
    while (attempt < this.MAX_CONDITIONAL_RETRIES) {
      try {
        // First, get the current item with version
        const currentItem = await this.getCurrentItem(userId, tableName);
        if (!currentItem) {
          throw new Error(`Profile not found for user ${userId}`);
        }

        const currentVersion = currentItem.version?.N ? parseInt(currentItem.version.N) : 0;
        const newVersion = currentVersion + 1;

        // Prepare update with version check
        const updateCommand = new UpdateItemCommand({
          TableName: tableName,
          Key: { userId: { S: userId } },
          UpdateExpression: this.buildUpdateExpression(updates, newVersion),
          ExpressionAttributeValues: this.buildExpressionAttributeValues(updates, newVersion),
          ExpressionAttributeNames: this.buildExpressionAttributeNames(updates),
          ConditionExpression: 'version = :currentVersion',
          ReturnValues: 'ALL_NEW'
        });

        await this.dynamoManager.executeWithRetry(
          () => this.dynamoManager['client'].send(updateCommand),
          'ConditionalUpdate'
        );

        return true; // Success
      } catch (error) {
        if (error.name === 'ConditionalCheckFailedException') {
          attempt++;
          console.warn(`Conditional check failed for user ${userId}, attempt ${attempt}`);
          
          // Exponential backoff with jitter for conditional failures
          const delay = Math.min(50 * Math.pow(2, attempt) + Math.random() * 100, 2000);
          await this.sleep(delay);
          continue;
        }
        
        // Non-conditional errors should be thrown immediately
        throw error;
      }
    }

    throw new Error(`Failed to update profile after ${this.MAX_CONDITIONAL_RETRIES} attempts due to concurrent modifications`);
  }

  private async getCurrentItem(userId: string, tableName: string): Promise<any> {
    const getCommand = new GetItemCommand({
      TableName: tableName,
      Key: { userId: { S: userId } },
      ConsistentRead: true // Ensure we get the latest version
    });

    const result = await this.dynamoManager.executeWithRetry(
      () => this.dynamoManager['client'].send(getCommand),
      'GetItem'
    );

    return result.Item;
  }

  private buildUpdateExpression(updates: Record<string, any>, newVersion: number): string {
    const setParts = Object.keys(updates).map(key => `#${key} = :${key}`);
    setParts.push('#version = :newVersion');
    return `SET ${setParts.join(', ')}`;
  }

  private buildExpressionAttributeValues(updates: Record<string, any>, newVersion: number): Record<string, any> {
    const values: Record<string, any> = {
      ':newVersion': { N: newVersion.toString() },
      ':currentVersion': { N: (newVersion - 1).toString() }
    };

    Object.entries(updates).forEach(([key, value]) => {
      values[`:${key}`] = this.convertToAttributeValue(value);
    });

    return values;
  }

  private buildExpressionAttributeNames(updates: Record<string, any>): Record<string, string> {
    const names: Record<string, string> = { '#version': 'version' };
    
    Object.keys(updates).forEach(key => {
      names[`#${key}`] = key;
    });

    return names;
  }

  private convertToAttributeValue(value: any): any {
    if (typeof value === 'string') return { S: value };
    if (typeof value === 'number') return { N: value.toString() };
    if (typeof value === 'boolean') return { BOOL: value };
    if (Array.isArray(value)) return { L: value.map(v => this.convertToAttributeValue(v)) };
    if (typeof value === 'object' && value !== null) {
      const obj: Record<string, any> = {};
      Object.entries(value).forEach(([k, v]) => {
        obj[k] = this.convertToAttributeValue(v);
      });
      return { M: obj };
    }
    return { NULL: true };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
