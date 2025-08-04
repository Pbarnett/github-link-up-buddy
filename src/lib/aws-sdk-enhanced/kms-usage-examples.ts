import { kmsManager, KeyType, EncryptedData } from './multi-region-kms-manager';

/**
 * Parker Flight KMS Integration Examples
 * 
 * This file demonstrates how to integrate the multi-region KMS manager
 * into your Parker Flight application for different use cases.
 */

// Environment setup
const ENVIRONMENT = process.env.NODE_ENV as 'development' | 'staging' | 'production';
const PRIMARY_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID;

/**
 * Initialize KMS Manager (call this once during application startup)
 */
export async function initializeKMS(): Promise<void> {
  try {
    console.log('Initializing KMS Manager for Parker Flight...');
    
    // Health check all regions
    const healthStatus = await kmsManager.healthCheck();
    console.log('KMS Health Status:', Object.fromEntries(healthStatus));
    
    // Enable key rotation for all keys
    await kmsManager.manageKeyRotation();
    
    console.log('KMS Manager initialized successfully');
  } catch (error) {
    console.error('Failed to initialize KMS Manager:', error);
    throw error;
  }
}

/**
 * Example 1: Encrypt/Decrypt Payment Information
 */
export class PaymentEncryptionService {
  async encryptPaymentData(paymentData: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    billingAddress: any;
  }): Promise<EncryptedData> {
    try {
      const sensitiveData = JSON.stringify(paymentData);
      const dataBuffer = Buffer.from(sensitiveData, 'utf-8');
      
      // Use payment key with primary region preference
      const encryptedData = await kmsManager.encryptData(
        dataBuffer,
        'payment',
        PRIMARY_REGION
      );
      
      console.log(`Payment data encrypted successfully in region ${encryptedData.region}`);
      return encryptedData;
    } catch (error) {
      console.error('Payment encryption failed:', error);
      throw new Error('Failed to encrypt payment data');
    }
  }

  async decryptPaymentData(encryptedData: EncryptedData): Promise<{
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    billingAddress: any;
  }> {
    try {
      const decryptedBuffer = await kmsManager.decryptData(
        encryptedData,
        PRIMARY_REGION
      );
      
      const paymentData = JSON.parse(decryptedBuffer.toString('utf-8'));
      console.log('Payment data decrypted successfully');
      return paymentData;
    } catch (error) {
      console.error('Payment decryption failed:', error);
      throw new Error('Failed to decrypt payment data');
    }
  }
}

/**
 * Example 2: Encrypt/Decrypt PII Data
 */
export class PIIEncryptionService {
  async encryptUserPII(userData: {
    email: string;
    phone: string;
    ssn?: string;
    passport?: string;
    address: any;
  }): Promise<EncryptedData> {
    try {
      const sensitiveData = JSON.stringify(userData);
      const dataBuffer = Buffer.from(sensitiveData, 'utf-8');
      
      return await kmsManager.encryptData(
        dataBuffer,
        'pii',
        PRIMARY_REGION
      );
    } catch (error) {
      console.error('PII encryption failed:', error);
      throw new Error('Failed to encrypt PII data');
    }
  }

  async decryptUserPII(encryptedData: EncryptedData): Promise<{
    email: string;
    phone: string;
    ssn?: string;
    passport?: string;
    address: any;
  }> {
    try {
      const decryptedBuffer = await kmsManager.decryptData(encryptedData);
      return JSON.parse(decryptedBuffer.toString('utf-8'));
    } catch (error) {
      console.error('PII decryption failed:', error);
      throw new Error('Failed to decrypt PII data');
    }
  }
}

/**
 * Example 3: General Data Encryption for Flight Data
 */
export class FlightDataEncryptionService {
  async encryptFlightBooking(bookingData: {
    bookingId: string;
    flightDetails: any;
    passengerInfo: any;
    seatPreferences: any;
  }): Promise<EncryptedData> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(bookingData), 'utf-8');
      
      return await kmsManager.encryptData(
        dataBuffer,
        'general',
        PRIMARY_REGION
      );
    } catch (error) {
      console.error('Flight booking encryption failed:', error);
      throw new Error('Failed to encrypt flight booking data');
    }
  }

  async decryptFlightBooking(encryptedData: EncryptedData): Promise<{
    bookingId: string;
    flightDetails: any;
    passengerInfo: any;
    seatPreferences: any;
  }> {
    try {
      const decryptedBuffer = await kmsManager.decryptData(encryptedData);
      return JSON.parse(decryptedBuffer.toString('utf-8'));
    } catch (error) {
      console.error('Flight booking decryption failed:', error);
      throw new Error('Failed to decrypt flight booking data');
    }
  }
}

/**
 * Example 4: High-Volume Payment Processing with Rate Limiting Optimization
 */
export class HighVolumePaymentProcessor {
  private batchSize = 100;
  private concurrentBatches = 5;

  async processBatchPayments(payments: Array<{
    id: string;
    amount: number;
    cardData: any;
  }>): Promise<Array<{
    id: string;
    encrypted: EncryptedData;
    success: boolean;
    error?: string;
  }>> {
    const results: Array<{
      id: string;
      encrypted?: EncryptedData;
      success: boolean;
      error?: string;
    }> = [];

    // Process in batches to avoid rate limiting
    const batches = this.chunkArray(payments, this.batchSize);
    
    for (let i = 0; i < batches.length; i += this.concurrentBatches) {
      const currentBatches = batches.slice(i, i + this.concurrentBatches);
      
      const batchPromises = currentBatches.map(async (batch) => {
        return await this.processBatch(batch);
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      // Flatten results
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(...result.value);
        } else {
          // Handle batch failure
          const failedBatch = currentBatches[index];
          failedBatch.forEach(payment => {
            results.push({
              id: payment.id,
              success: false,
              error: `Batch processing failed: ${result.reason}`
            });
          });
        }
      });

      // Add delay between batch groups to prevent overwhelming KMS
      if (i + this.concurrentBatches < batches.length) {
        await this.sleep(100); // 100ms delay
      }
    }

    return results as Array<{
      id: string;
      encrypted: EncryptedData;
      success: boolean;
      error?: string;
    }>;
  }

  private async processBatch(payments: Array<{
    id: string;
    amount: number;
    cardData: any;
  }>): Promise<Array<{
    id: string;
    encrypted?: EncryptedData;
    success: boolean;
    error?: string;
  }>> {
    const results: Array<{
      id: string;
      encrypted?: EncryptedData;
      success: boolean;
      error?: string;
    }> = [];

    for (const payment of payments) {
      try {
        const dataBuffer = Buffer.from(JSON.stringify(payment.cardData), 'utf-8');
        const encrypted = await kmsManager.encryptData(
          dataBuffer,
          'payment',
          PRIMARY_REGION
        );

        results.push({
          id: payment.id,
          encrypted,
          success: true
        });
      } catch (error) {
        console.error(`Failed to encrypt payment ${payment.id}:`, error);
        results.push({
          id: payment.id,
          success: false,
          error: (error as Error).message
        });
      }
    }

    return results;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Example 5: Multi-Region Failover Testing
 */
export class MultiRegionFailoverTester {
  async testRegionFailover(): Promise<void> {
    const testData = { message: 'Testing multi-region failover' };
    const dataBuffer = Buffer.from(JSON.stringify(testData), 'utf-8');

    console.log('Testing multi-region failover capabilities...');

    // Test encryption in each region
    const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
    
    for (const region of regions) {
      try {
        console.log(`Testing encryption in region: ${region}`);
        
        const encrypted = await kmsManager.encryptData(
          dataBuffer,
          'general',
          region
        );
        
        console.log(`✓ Encryption successful in ${encrypted.region}`);

        // Test decryption in different regions
        for (const decryptRegion of regions) {
          try {
            console.log(`  Testing decryption in region: ${decryptRegion}`);
            const decrypted = await kmsManager.decryptData(encrypted, decryptRegion);
            const result = JSON.parse(decrypted.toString('utf-8'));
            
            if (result.message === testData.message) {
              console.log(`  ✓ Decryption successful in ${decryptRegion}`);
            } else {
              console.log(`  ✗ Decryption data mismatch in ${decryptRegion}`);
            }
          } catch (error) {
            console.log(`  ✗ Decryption failed in ${decryptRegion}:`, error);
          }
        }
      } catch (error) {
        console.log(`✗ Encryption failed in ${region}:`, error);
      }
    }
  }
}

/**
 * Example 6: Monitoring and Metrics
 */
export class KMSMonitoringService {
  async getKMSHealth(): Promise<{
    regions: Record<string, boolean>;
    circuitBreakers: Record<string, any>;
    metrics: Array<any>;
  }> {
    const healthStatus = await kmsManager.healthCheck();
    const circuitBreakerStatus = kmsManager.getCircuitBreakerStatus();
    const metrics = kmsManager.getMetrics();

    return {
      regions: Object.fromEntries(healthStatus),
      circuitBreakers: Object.fromEntries(circuitBreakerStatus),
      metrics: metrics.slice(-50) // Last 50 operations
    };
  }

  async logPerformanceMetrics(): Promise<void> {
    const metrics = kmsManager.getMetrics();
    
    // Group by operation type
    const operationStats = metrics.reduce((acc, metric) => {
      const key = `${metric.operation}-${metric.region}`;
      if (!acc[key]) {
        acc[key] = {
          count: 0,
          successCount: 0,
          totalDuration: 0,
          avgRetries: 0
        };
      }
      
      acc[key].count++;
      if (metric.success) acc[key].successCount++;
      acc[key].totalDuration += metric.duration;
      acc[key].avgRetries += metric.retryCount;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages and success rates
    Object.entries(operationStats).forEach(([key, stats]) => {
      const avgDuration = stats.totalDuration / stats.count;
      const successRate = (stats.successCount / stats.count) * 100;
      const avgRetries = stats.avgRetries / stats.count;
      
      console.log(`KMS Performance - ${key}:`, {
        operations: stats.count,
        successRate: `${successRate.toFixed(2)}%`,
        avgDuration: `${avgDuration.toFixed(2)}ms`,
        avgRetries: avgRetries.toFixed(2)
      });
    });
  }
}

/**
 * Example 7: Application Shutdown Handler
 */
export async function shutdownKMS(): Promise<void> {
  try {
    console.log('Shutting down KMS Manager...');
    await kmsManager.cleanup();
    console.log('KMS Manager shutdown complete');
  } catch (error) {
    console.error('Error during KMS shutdown:', error);
  }
}

// Export service instances
export const paymentEncryption = new PaymentEncryptionService();
export const piiEncryption = new PIIEncryptionService();
export const flightDataEncryption = new FlightDataEncryptionService();
export const highVolumeProcessor = new HighVolumePaymentProcessor();
export const failoverTester = new MultiRegionFailoverTester();
export const monitoring = new KMSMonitoringService();

/**
 * Example usage in your Express.js routes
 */

// Payment processing endpoint
export async function handlePaymentProcessing(req: any, res: any) {
  try {
    const { cardNumber, cvv, expiryDate, billingAddress } = req.body;
    
    const encrypted = await paymentEncryption.encryptPaymentData({
      cardNumber,
      cvv,
      expiryDate,
      billingAddress
    });
    
    // Store encrypted data in database
    // ... your database logic here
    
    res.json({ 
      success: true, 
      paymentId: 'payment-123', 
      encrypted: encrypted.keyId // Don't send full encrypted data to client
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
}

// Health check endpoint
export async function healthCheckEndpoint(req: any, res: any) {
  try {
    const health = await monitoring.getKMSHealth();
    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
}
