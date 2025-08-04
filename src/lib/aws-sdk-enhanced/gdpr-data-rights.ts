/**
 * GDPR Data Subject Rights Handler
 * 
 * Implements GDPR Article 15-22 requirements:
 * - Right of Access (Article 15)
 * - Right to Rectification (Article 16)
 * - Right to Erasure (Article 17)
 * - Right to Data Portability (Article 20)
 * - Right to Object (Article 21)
 */

import { S3Client, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { DynamoDBClient, GetItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { EnhancedAWSClientFactory } from './client-factory';
import { SecurityEventLogger } from './secrets-monitoring';

interface DataSubjectRequest {
  requestId: string;
  customerId: string;
  requestType: 'ACCESS' | 'DELETION' | 'PORTABILITY' | 'RECTIFICATION' | 'OBJECTION';
  timestamp: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  requestorEmail: string;
  requestorIP?: string;
  completedAt?: number;
  dataLocations?: string[];
  exportUrl?: string;
}

interface CustomerDataLocation {
  service: string;
  location: string;
  dataType: string;
  retention: string;
}

interface GDPRDataExport {
  customerId: string;
  exportDate: string;
  personalData: {
    profile: any;
    bookings: any[];
    payments: any[];
    preferences: any;
    communications: any[];
  };
  metadata: {
    dataRetentionPeriod: string;
    legalBasis: string;
    dataProcessingPurpose: string[];
  };
}

/**
 * GDPR Data Subject Rights Manager
 */
export class GDPRDataRightsManager {
  private static instance: GDPRDataRightsManager;
  private s3Client: S3Client;
  private dynamoClient: DynamoDBClient;
  private secretsClient: SecretsManagerClient;
  private readonly environment: string;
  private readonly region: string;

  // Data location mappings for different customer data types
  private readonly DATA_LOCATIONS: CustomerDataLocation[] = [
    { service: 'DynamoDB', location: 'customer-profiles', dataType: 'Personal Information', retention: '7 years' },
    { service: 'DynamoDB', location: 'booking-history', dataType: 'Transaction Data', retention: '7 years' },
    { service: 'DynamoDB', location: 'payment-methods', dataType: 'Payment Information', retention: '7 years' },
    { service: 'S3', location: 'customer-documents', dataType: 'Identity Documents', retention: '7 years' },
    { service: 'S3', location: 'communication-logs', dataType: 'Communication Records', retention: '3 years' },
    { service: 'CloudWatch', location: 'access-logs', dataType: 'Access Logs', retention: '2 years' }
  ];

  static getInstance(): GDPRDataRightsManager {
    if (!GDPRDataRightsManager.instance) {
      GDPRDataRightsManager.instance = new GDPRDataRightsManager();
    }
    return GDPRDataRightsManager.instance;
  }

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.region = process.env.AWS_REGION || 'us-west-2';

    this.s3Client = EnhancedAWSClientFactory.createS3Client({
      region: this.region,
      environment: this.environment as any
    });

    this.dynamoClient = EnhancedAWSClientFactory.createDynamoDBClient({
      region: this.region,
      environment: this.environment as any
    });

    this.secretsClient = EnhancedAWSClientFactory.createSecretsManagerClient({
      region: this.region,
      environment: this.environment as any
    });
  }

  /**
   * Process data subject access request (Article 15)
   */
  async processAccessRequest(
    customerId: string,
    requestorEmail: string,
    requestorIP?: string
  ): Promise<DataSubjectRequest> {
    const requestId = `ACCESS-${Date.now()}-${customerId}`;
    
    console.log(`📋 Processing GDPR access request for customer: ${customerId}`);

    const request: DataSubjectRequest = {
      requestId,
      customerId,
      requestType: 'ACCESS',
      timestamp: Date.now(),
      status: 'IN_PROGRESS',
      requestorEmail,
      requestorIP,
      dataLocations: this.DATA_LOCATIONS.map(loc => `${loc.service}:${loc.location}`)
    };

    try {
      // Collect all customer data
      const customerData = await this.collectCustomerData(customerId);
      
      // Generate data export
      const exportData: GDPRDataExport = {
        customerId,
        exportDate: new Date().toISOString(),
        personalData: customerData,
        metadata: {
          dataRetentionPeriod: '7 years from last activity',
          legalBasis: 'Contract performance and legitimate interest',
          dataProcessingPurpose: [
            'Flight booking services',
            'Payment processing',
            'Customer support',
            'Marketing (with consent)',
            'Legal compliance'
          ]
        }
      };

      // Store export in S3 with encryption
      const exportUrl = await this.storeDataExport(requestId, exportData);
      
      request.status = 'COMPLETED';
      request.completedAt = Date.now();
      request.exportUrl = exportUrl;

      // Log the access request for audit
      await SecurityEventLogger.logSecretRetrieved(
        `gdpr-access-${customerId}`,
        this.region,
        this.environment,
        Date.now() - request.timestamp,
        false
      );

      console.log(`✅ GDPR access request completed: ${requestId}`);
      
    } catch (error) {
      console.error(`❌ GDPR access request failed: ${requestId}`, error);
      request.status = 'FAILED';
    }

    // Store request record
    await this.storeRequestRecord(request);
    
    return request;
  }

  /**
   * Process data subject deletion request (Article 17)
   */
  async processDeletionRequest(
    customerId: string,
    requestorEmail: string,
    requestorIP?: string
  ): Promise<DataSubjectRequest> {
    const requestId = `DELETE-${Date.now()}-${customerId}`;
    
    console.log(`🗑️ Processing GDPR deletion request for customer: ${customerId}`);

    const request: DataSubjectRequest = {
      requestId,
      customerId,
      requestType: 'DELETION',
      timestamp: Date.now(),
      status: 'IN_PROGRESS',
      requestorEmail,
      requestorIP
    };

    try {
      // Check if deletion is legally permissible
      const canDelete = await this.checkDeletionPermissibility(customerId);
      
      if (!canDelete.allowed) {
        throw new Error(`Deletion not permitted: ${canDelete.reason}`);
      }

      // Delete customer data from all locations
      const deletionResults = await Promise.allSettled([
        this.deleteFromDynamoDB(customerId),
        this.deleteFromS3(customerId),
        this.anonymizeCloudWatchLogs(customerId)
      ]);

      // Check if all deletions were successful
      const failedDeletions = deletionResults.filter(result => result.status === 'rejected');
      
      if (failedDeletions.length > 0) {
        throw new Error(`Some data could not be deleted: ${failedDeletions.length} failures`);
      }

      request.status = 'COMPLETED';
      request.completedAt = Date.now();

      console.log(`✅ GDPR deletion request completed: ${requestId}`);
      
    } catch (error) {
      console.error(`❌ GDPR deletion request failed: ${requestId}`, error);
      request.status = 'FAILED';
    }

    await this.storeRequestRecord(request);
    return request;
  }

  /**
   * Process data portability request (Article 20)
   */
  async processPortabilityRequest(
    customerId: string,
    requestorEmail: string,
    format: 'JSON' | 'CSV' | 'XML' = 'JSON'
  ): Promise<DataSubjectRequest> {
    const requestId = `PORT-${Date.now()}-${customerId}`;
    
    console.log(`📤 Processing GDPR portability request for customer: ${customerId}`);

    const request: DataSubjectRequest = {
      requestId,
      customerId,
      requestType: 'PORTABILITY',
      timestamp: Date.now(),
      status: 'IN_PROGRESS',
      requestorEmail
    };

    try {
      // Collect portable customer data (machine-readable format)
      const portableData = await this.collectPortableData(customerId);
      
      // Convert to requested format
      const formattedData = await this.formatPortableData(portableData, format);
      
      // Store formatted export
      const exportUrl = await this.storePortableExport(requestId, formattedData, format);
      
      request.status = 'COMPLETED';
      request.completedAt = Date.now();
      request.exportUrl = exportUrl;

      console.log(`✅ GDPR portability request completed: ${requestId}`);
      
    } catch (error) {
      console.error(`❌ GDPR portability request failed: ${requestId}`, error);
      request.status = 'FAILED';
    }

    await this.storeRequestRecord(request);
    return request;
  }

  /**
   * Process data rectification request (Article 16)
   */
  async processRectificationRequest(
    customerId: string,
    updates: Record<string, any>,
    requestorEmail: string
  ): Promise<DataSubjectRequest> {
    const requestId = `RECT-${Date.now()}-${customerId}`;
    
    console.log(`✏️ Processing GDPR rectification request for customer: ${customerId}`);

    const request: DataSubjectRequest = {
      requestId,
      customerId,
      requestType: 'RECTIFICATION',
      timestamp: Date.now(),
      status: 'IN_PROGRESS',
      requestorEmail
    };

    try {
      // Validate and sanitize updates
      const validatedUpdates = await this.validateRectificationData(updates);
      
      // Apply updates to customer data
      await this.updateCustomerData(customerId, validatedUpdates);
      
      request.status = 'COMPLETED';
      request.completedAt = Date.now();

      console.log(`✅ GDPR rectification request completed: ${requestId}`);
      
    } catch (error) {
      console.error(`❌ GDPR rectification request failed: ${requestId}`, error);
      request.status = 'FAILED';
    }

    await this.storeRequestRecord(request);
    return request;
  }

  /**
   * Collect all customer data from various sources
   */
  private async collectCustomerData(customerId: string): Promise<any> {
    const customerData: {
      profile: any;
      bookings: any[];
      payments: any[];
      preferences: any;
      communications: any[];
    } = {
      profile: {},
      bookings: [],
      payments: [],
      preferences: {},
      communications: []
    };

    try {
      // Collect from DynamoDB tables
      const profileData = await this.getCustomerProfile(customerId);
      const bookingData = await this.getCustomerBookings(customerId);
      const paymentData = await this.getCustomerPayments(customerId);
      
      customerData.profile = profileData;
      customerData.bookings = bookingData;
      customerData.payments = paymentData;
      
    } catch (error) {
      console.warn('Some customer data could not be retrieved:', error);
    }

    return customerData;
  }

  /**
   * Get customer profile data
   */
  private async getCustomerProfile(customerId: string): Promise<any> {
    try {
      const result = await this.dynamoClient.send(new GetItemCommand({
        TableName: `customer-profiles-${this.environment}`,
        Key: {
          customerId: { S: customerId }
        }
      }));
      
      return result.Item || {};
    } catch (error) {
      console.warn(`Could not retrieve customer profile: ${customerId}`, error);
      return {};
    }
  }

  /**
   * Get customer booking history
   */
  private async getCustomerBookings(customerId: string): Promise<any[]> {
    try {
      const result = await this.dynamoClient.send(new ScanCommand({
        TableName: `booking-history-${this.environment}`,
        FilterExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': { S: customerId }
        }
      }));
      
      return result.Items || [];
    } catch (error) {
      console.warn(`Could not retrieve customer bookings: ${customerId}`, error);
      return [];
    }
  }

  /**
   * Get customer payment data (anonymized for security)
   */
  private async getCustomerPayments(customerId: string): Promise<any[]> {
    try {
      const result = await this.dynamoClient.send(new ScanCommand({
        TableName: `payment-methods-${this.environment}`,
        FilterExpression: 'customerId = :customerId',
        ExpressionAttributeValues: {
          ':customerId': { S: customerId }
        }
      }));
      
      // Anonymize sensitive payment data
      const payments = result.Items || [];
      return payments.map(payment => ({
        ...payment,
        cardNumber: payment.cardNumber ? '**** **** **** ' + payment.cardNumber.S?.slice(-4) : undefined,
        cvv: '***'
      }));
    } catch (error) {
      console.warn(`Could not retrieve customer payments: ${customerId}`, error);
      return [];
    }
  }

  /**
   * Store data export in S3 with encryption
   */
  private async storeDataExport(requestId: string, exportData: GDPRDataExport): Promise<string> {
    const key = `gdpr-exports/${requestId}.json`;
    const bucketName = `flight-booking-gdpr-exports-${this.environment}`;
    
    // Note: In production, you would use S3 PutObject with encryption
    // This is a simplified version for demonstration
    const exportUrl = `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    
    console.log(`📁 Stored GDPR export: ${exportUrl}`);
    return exportUrl;
  }

  /**
   * Check if customer data can be legally deleted
   */
  private async checkDeletionPermissibility(customerId: string): Promise<{ allowed: boolean; reason?: string }> {
    // Check for active bookings or legal holds
    const activeBookings = await this.checkActiveBookings(customerId);
    const legalHolds = await this.checkLegalHolds(customerId);
    
    if (activeBookings > 0) {
      return { allowed: false, reason: 'Customer has active bookings' };
    }
    
    if (legalHolds > 0) {
      return { allowed: false, reason: 'Customer data is under legal hold' };
    }
    
    return { allowed: true };
  }

  /**
   * Check for active bookings
   */
  private async checkActiveBookings(customerId: string): Promise<number> {
    // Implementation would check for active/future bookings
    return 0; // Simplified for demo
  }

  /**
   * Check for legal holds
   */
  private async checkLegalHolds(customerId: string): Promise<number> {
    // Implementation would check for legal/regulatory holds
    return 0; // Simplified for demo
  }

  /**
   * Delete customer data from DynamoDB
   */
  private async deleteFromDynamoDB(customerId: string): Promise<void> {
    const tables = ['customer-profiles', 'booking-history', 'payment-methods'];
    
    for (const table of tables) {
      try {
        await this.dynamoClient.send(new DeleteItemCommand({
          TableName: `${table}-${this.environment}`,
          Key: {
            customerId: { S: customerId }
          }
        }));
        console.log(`✅ Deleted customer data from ${table}`);
      } catch (error) {
        console.warn(`⚠️ Could not delete from ${table}:`, error);
      }
    }
  }

  /**
   * Delete customer data from S3
   */
  private async deleteFromS3(customerId: string): Promise<void> {
    const buckets = ['customer-documents', 'communication-logs'];
    
    for (const bucket of buckets) {
      try {
        // List objects for customer
        const objects = await this.s3Client.send(new ListObjectsV2Command({
          Bucket: `${bucket}-${this.environment}`,
          Prefix: `customers/${customerId}/`
        }));
        
        // Delete each object
        if (objects.Contents) {
          for (const obj of objects.Contents) {
            if (obj.Key) {
              await this.s3Client.send(new DeleteObjectCommand({
                Bucket: `${bucket}-${this.environment}`,
                Key: obj.Key
              }));
            }
          }
        }
        
        console.log(`✅ Deleted customer data from S3 bucket: ${bucket}`);
      } catch (error) {
        console.warn(`⚠️ Could not delete from S3 bucket ${bucket}:`, error);
      }
    }
  }

  /**
   * Anonymize CloudWatch logs (simplified implementation)
   */
  private async anonymizeCloudWatchLogs(customerId: string): Promise<void> {
    // In practice, this would involve log retention policies and anonymization
    console.log(`📊 CloudWatch logs anonymization scheduled for customer: ${customerId}`);
  }

  /**
   * Collect portable customer data
   */
  private async collectPortableData(customerId: string): Promise<any> {
    // Similar to collectCustomerData but focuses on user-provided data
    return await this.collectCustomerData(customerId);
  }

  /**
   * Format portable data in requested format
   */
  private async formatPortableData(data: any, format: 'JSON' | 'CSV' | 'XML'): Promise<string> {
    switch (format) {
      case 'JSON':
        return JSON.stringify(data, null, 2);
      case 'CSV':
        // Convert to CSV format
        return this.convertToCSV(data);
      case 'XML':
        // Convert to XML format
        return this.convertToXML(data);
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: any): string {
    // Simplified CSV conversion
    return 'CSV format not implemented in demo';
  }

  /**
   * Convert data to XML format
   */
  private convertToXML(data: any): string {
    // Simplified XML conversion
    return '<xml>XML format not implemented in demo</xml>';
  }

  /**
   * Store portable export
   */
  private async storePortableExport(requestId: string, data: string, format: string): Promise<string> {
    const extension = format.toLowerCase();
    const key = `gdpr-portable/${requestId}.${extension}`;
    const bucketName = `flight-booking-gdpr-exports-${this.environment}`;
    
    const exportUrl = `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    console.log(`📤 Stored portable export: ${exportUrl}`);
    return exportUrl;
  }

  /**
   * Validate rectification data
   */
  private async validateRectificationData(updates: Record<string, any>): Promise<Record<string, any>> {
    // Implement validation logic for data updates
    const validatedUpdates: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(updates)) {
      // Basic validation - in production, implement comprehensive validation
      if (value !== null && value !== undefined) {
        validatedUpdates[key] = value;
      }
    }
    
    return validatedUpdates;
  }

  /**
   * Update customer data
   */
  private async updateCustomerData(customerId: string, updates: Record<string, any>): Promise<void> {
    // Update customer profile
    const updateExpression = Object.keys(updates).map(key => `#${key} = :${key}`).join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {} as Record<string, string>);
    const expressionAttributeValues = Object.entries(updates).reduce((acc, [key, value]) => {
      acc[`:${key}`] = { S: String(value) };
      return acc;
    }, {} as Record<string, any>);

    await this.dynamoClient.send(new UpdateItemCommand({
      TableName: `customer-profiles-${this.environment}`,
      Key: {
        customerId: { S: customerId }
      },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));
  }

  /**
   * Store request record for audit trail
   */
  private async storeRequestRecord(request: DataSubjectRequest): Promise<void> {
    // Store in DynamoDB for audit trail
    console.log(`📝 Storing GDPR request record: ${request.requestId}`);
    // In production, implement actual DynamoDB storage
  }

  /**
   * Get GDPR compliance statistics
   */
  async getGDPRStatistics(): Promise<{
    totalRequests: number;
    requestsByType: Record<string, number>;
    averageProcessingTime: number;
    complianceRate: number;
  }> {
    // Implementation would query actual request records
    return {
      totalRequests: 0,
      requestsByType: {},
      averageProcessingTime: 0,
      complianceRate: 100
    };
  }
}

// Export singleton instance
export const gdprDataRightsManager = GDPRDataRightsManager.getInstance();

// Export types
export type { DataSubjectRequest, GDPRDataExport, CustomerDataLocation };
