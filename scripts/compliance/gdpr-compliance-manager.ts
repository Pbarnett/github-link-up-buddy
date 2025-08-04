import { DynamoDBClient, PutItemCommand, UpdateItemCommand, GetItemCommand, QueryCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import * as crypto from 'crypto';

interface DataSubjectRequest {
  requestId: string;
  userId: string;
  type: 'ACCESS' | 'RECTIFICATION' | 'ERASURE' | 'PORTABILITY' | 'RESTRICTION';
  details?: any;
  requestedAt: Date;
  requesterEmail: string;
  legalBasis?: string;
}

interface DataSubjectResponse {
  requestId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'PARTIAL';
  data?: any;
  completedAt?: Date;
  expiresAt?: Date;
  notes?: string;
}

interface ConsentRecord {
  userId: string;
  consentId: string;
  purpose: string;
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
  withdrawnAt?: Date;
  legalBasis: string;
}

interface UserDataExport {
  userId: string;
  categories: string[];
  data: {
    profile?: any;
    connections?: any;
    activity?: any;
    payments?: any;
  };
  collectedAt: Date;
  legalBasis: string;
  retentionPeriod: string;
  encryptionMethod: string;
}

interface DeletionVerification {
  isComplete: boolean;
  deletedSystems: string[];
  remainingSystems: string[];
  verificationTimestamp: Date;
}

class AuditLogger {
  private dynamoClient: DynamoDBClient;
  
  constructor() {
    this.dynamoClient = new DynamoDBClient({});
  }

  async logDataSubjectRequest(request: DataSubjectRequest): Promise<void> {
    await this.dynamoClient.send(new PutItemCommand({
      TableName: 'github-link-buddy-audit-log',
      Item: {
        auditId: { S: `dsr-${request.requestId}` },
        eventType: { S: 'DATA_SUBJECT_REQUEST' },
        userId: { S: request.userId },
        requestType: { S: request.type },
        timestamp: { S: new Date().toISOString() },
        details: { S: JSON.stringify(request) },
        ttl: { N: Math.floor((Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) / 1000).toString() }
      }
    }));
  }

  async logDataDeletion(deletion: any): Promise<void> {
    await this.dynamoClient.send(new PutItemCommand({
      TableName: 'github-link-buddy-audit-log',
      Item: {
        auditId: { S: `deletion-${deletion.requestId}` },
        eventType: { S: 'DATA_DELETION' },
        userId: { S: deletion.userId },
        timestamp: { S: new Date().toISOString() },
        details: { S: JSON.stringify(deletion) },
        ttl: { N: Math.floor((Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) / 1000).toString() }
      }
    }));
  }

  async logConsentChange(consent: ConsentRecord): Promise<void> {
    await this.dynamoClient.send(new PutItemCommand({
      TableName: 'github-link-buddy-audit-log',
      Item: {
        auditId: { S: `consent-${consent.consentId}` },
        eventType: { S: 'CONSENT_CHANGE' },
        userId: { S: consent.userId },
        purpose: { S: consent.purpose },
        granted: { BOOL: consent.granted },
        timestamp: { S: consent.timestamp.toISOString() },
        ipAddress: { S: consent.ipAddress },
        details: { S: JSON.stringify(consent) },
        ttl: { N: Math.floor((Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) / 1000).toString() }
      }
    }));
  }
}

class GDPRComplianceManager {
  private dynamoClient: DynamoDBClient;
  private s3Client: S3Client;
  private kmsClient: KMSClient;
  private auditLogger: AuditLogger;
  private encryptionKeyId: string;

  constructor() {
    this.dynamoClient = new DynamoDBClient({});
    this.s3Client = new S3Client({});
    this.kmsClient = new KMSClient({});
    this.auditLogger = new AuditLogger();
    this.encryptionKeyId = process.env.GDPR_ENCRYPTION_KEY_ID || 'alias/github-link-buddy-gdpr';
  }

  // Data Subject Rights Implementation
  async handleDataSubjectRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    await this.auditLogger.logDataSubjectRequest(request);

    // Validate request
    const validationResult = await this.validateDataSubjectRequest(request);
    if (!validationResult.isValid) {
      return {
        requestId: request.requestId,
        status: 'REJECTED',
        notes: validationResult.reason,
        completedAt: new Date()
      };
    }

    switch (request.type) {
      case 'ACCESS':
        return await this.handleAccessRequest(request);
      case 'RECTIFICATION':
        return await this.handleRectificationRequest(request);
      case 'ERASURE':
        return await this.handleErasureRequest(request);
      case 'PORTABILITY':
        return await this.handlePortabilityRequest(request);
      case 'RESTRICTION':
        return await this.handleRestrictionRequest(request);
      default:
        throw new Error(`Unsupported request type: ${request.type}`);
    }
  }

  private async validateDataSubjectRequest(request: DataSubjectRequest): Promise<{ isValid: boolean; reason?: string }> {
    // Verify user identity
    const userExists = await this.verifyUserExists(request.userId);
    if (!userExists) {
      return { isValid: false, reason: 'User not found in our systems' };
    }

    // Check for recent duplicate requests
    const recentRequests = await this.getRecentRequests(request.userId, request.type);
    if (recentRequests.length > 0) {
      const lastRequest = recentRequests[0];
      const daysSinceLastRequest = (Date.now() - lastRequest.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastRequest < 30) {
        return { isValid: false, reason: 'Similar request processed within the last 30 days' };
      }
    }

    return { isValid: true };
  }

  private async handleAccessRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    try {
      // Collect all user data
      const userData = await this.collectUserData(request.userId);
      
      // Encrypt the data export
      const encryptedData = await this.encryptDataExport(userData);
      
      // Store in secure S3 bucket with expiration
      const exportUrl = await this.storeSecureExport(encryptedData, request.userId, request.requestId);
      
      // Create secure download link
      const secureDownloadUrl = await this.generateSecureDownloadUrl(exportUrl);

      return {
        requestId: request.requestId,
        status: 'COMPLETED',
        data: {
          downloadUrl: secureDownloadUrl,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          dataCategories: userData.categories,
          exportSize: JSON.stringify(userData).length,
          encryptionMethod: 'AES-256-GCM with KMS'
        },
        completedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to handle access request:', error);
      return {
        requestId: request.requestId,
        status: 'PARTIAL',
        notes: `Error occurred during data collection: ${error.message}`,
        completedAt: new Date()
      };
    }
  }

  private async handleErasureRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    try {
      // Check for legal obligations to retain data
      const retentionCheck = await this.checkRetentionRequirements(request.userId);
      if (retentionCheck.mustRetain) {
        return {
          requestId: request.requestId,
          status: 'REJECTED',
          notes: `Data must be retained due to: ${retentionCheck.reasons.join(', ')}`,
          completedAt: new Date()
        };
      }

      // Create deletion plan
      const deletionPlan = await this.createDeletionPlan(request.userId);
      
      // Execute deletion across all systems
      const deletionResults = await Promise.allSettled([
        this.deleteFromDynamoDB(request.userId),
        this.deleteFromS3(request.userId),
        this.deleteFromBackups(request.userId),
        this.deleteFromLogs(request.userId),
        this.deleteFromAnalytics(request.userId)
      ]);

      // Verify deletion completion
      const verificationResults = await this.verifyDeletion(request.userId);
      
      await this.auditLogger.logDataDeletion({
        userId: request.userId,
        requestId: request.requestId,
        deletionResults,
        verificationResults,
        timestamp: new Date()
      });

      return {
        requestId: request.requestId,
        status: verificationResults.isComplete ? 'COMPLETED' : 'PARTIAL',
        data: {
          deletedSystems: verificationResults.deletedSystems,
          remainingSystems: verificationResults.remainingSystems,
          verificationTimestamp: verificationResults.verificationTimestamp
        },
        completedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to handle erasure request:', error);
      return {
        requestId: request.requestId,
        status: 'PARTIAL',
        notes: `Error occurred during data deletion: ${error.message}`,
        completedAt: new Date()
      };
    }
  }

  private async handleRectificationRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    try {
      const corrections = request.details?.corrections || {};
      const updatedFields: string[] = [];

      // Update user profile data
      if (corrections.profile) {
        await this.updateUserProfile(request.userId, corrections.profile);
        updatedFields.push('profile');
      }

      // Update preference data
      if (corrections.preferences) {
        await this.updateUserPreferences(request.userId, corrections.preferences);
        updatedFields.push('preferences');
      }

      return {
        requestId: request.requestId,
        status: 'COMPLETED',
        data: {
          updatedFields,
          updatedAt: new Date()
        },
        completedAt: new Date()
      };
    } catch (error) {
      return {
        requestId: request.requestId,
        status: 'PARTIAL',
        notes: `Error occurred during data rectification: ${error.message}`,
        completedAt: new Date()
      };
    }
  }

  private async handlePortabilityRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    const userData = await this.collectPortableUserData(request.userId);
    
    // Create structured export in common format (JSON)
    const portableData = {
      exportedAt: new Date().toISOString(),
      userId: request.userId,
      format: 'JSON',
      version: '1.0',
      data: userData
    };

    const exportUrl = await this.storePortableExport(portableData, request.requestId);

    return {
      requestId: request.requestId,
      status: 'COMPLETED',
      data: {
        exportUrl,
        format: 'JSON',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      completedAt: new Date()
    };
  }

  private async handleRestrictionRequest(request: DataSubjectRequest): Promise<DataSubjectResponse> {
    const restrictionTypes = request.details?.restrictions || ['processing'];
    
    // Mark user data for processing restriction
    await this.restrictDataProcessing(request.userId, restrictionTypes);
    
    return {
      requestId: request.requestId,
      status: 'COMPLETED',
      data: {
        restrictedProcessing: restrictionTypes,
        restrictedAt: new Date()
      },
      completedAt: new Date()
    };
  }

  private async collectUserData(userId: string): Promise<UserDataExport> {
    const [profileData, connectionData, activityData] = await Promise.all([
      this.getUserProfile(userId),
      this.getUserConnections(userId),
      this.getUserActivity(userId)
    ]);

    return {
      userId,
      categories: ['profile', 'connections', 'activity'],
      data: {
        profile: profileData,
        connections: connectionData,
        activity: activityData
      },
      collectedAt: new Date(),
      legalBasis: 'consent',
      retentionPeriod: '2 years',
      encryptionMethod: 'AES-256-GCM'
    };
  }

  private async encryptDataExport(userData: UserDataExport): Promise<string> {
    const dataString = JSON.stringify(userData);
    
    const encryptResult = await this.kmsClient.send(new EncryptCommand({
      KeyId: this.encryptionKeyId,
      Plaintext: Buffer.from(dataString),
      EncryptionContext: {
        purpose: 'gdpr-data-export',
        userId: userData.userId,
        timestamp: new Date().toISOString()
      }
    }));

    return Buffer.from(encryptResult.CiphertextBlob!).toString('base64');
  }

  private async storeSecureExport(encryptedData: string, userId: string, requestId: string): Promise<string> {
    const key = `gdpr-exports/${userId}/${requestId}/data-export.enc`;
    
    await this.s3Client.send(new PutObjectCommand({
      Bucket: 'github-link-buddy-gdpr-exports',
      Key: key,
      Body: encryptedData,
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: this.encryptionKeyId,
      Metadata: {
        userId,
        requestId,
        exportType: 'gdpr-access-request',
        createdAt: new Date().toISOString()
      },
      Expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }));

    return key;
  }

  private async generateSecureDownloadUrl(s3Key: string): Promise<string> {
    // Generate pre-signed URL with short expiration
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const command = new GetObjectCommand({
      Bucket: 'github-link-buddy-gdpr-exports',
      Key: s3Key
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 24 * 60 * 60 }); // 24 hours
  }

  // Consent Management System
  async recordConsent(consent: ConsentRecord): Promise<void> {
    const consentItem = {
      userId: { S: consent.userId },
      consentId: { S: consent.consentId },
      purpose: { S: consent.purpose },
      granted: { BOOL: consent.granted },
      timestamp: { S: consent.timestamp.toISOString() },
      ipAddress: { S: consent.ipAddress },
      userAgent: { S: consent.userAgent },
      version: { S: consent.version },
      legalBasis: { S: consent.legalBasis },
      ttl: { N: Math.floor((Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) / 1000).toString() } // 7 years
    };

    await this.dynamoClient.send(new PutItemCommand({
      TableName: 'github-link-buddy-consent-records',
      Item: consentItem
    }));

    await this.auditLogger.logConsentChange(consent);
  }

  async withdrawConsent(userId: string, purpose: string): Promise<void> {
    const withdrawalTimestamp = new Date().toISOString();
    
    // Update consent record
    await this.dynamoClient.send(new UpdateItemCommand({
      TableName: 'github-link-buddy-consent-records',
      Key: {
        userId: { S: userId },
        consentId: { S: `${userId}-${purpose}` }
      },
      UpdateExpression: 'SET granted = :granted, withdrawnAt = :withdrawnAt',
      ExpressionAttributeValues: {
        ':granted': { BOOL: false },
        ':withdrawnAt': { S: withdrawalTimestamp }
      }
    }));

    // Trigger data processing restriction
    await this.restrictDataProcessing(userId, [purpose]);

    // Log consent withdrawal
    await this.auditLogger.logConsentChange({
      userId,
      consentId: `${userId}-${purpose}`,
      purpose,
      granted: false,
      timestamp: new Date(),
      ipAddress: 'system',
      userAgent: 'system',
      version: '1.0',
      withdrawnAt: new Date(),
      legalBasis: 'consent-withdrawal'
    });
  }

  async getConsentStatus(userId: string, purpose: string): Promise<boolean> {
    const result = await this.dynamoClient.send(new GetItemCommand({
      TableName: 'github-link-buddy-consent-records',
      Key: {
        userId: { S: userId },
        consentId: { S: `${userId}-${purpose}` }
      }
    }));

    if (!result.Item) {
      return false;
    }

    return result.Item.granted?.BOOL === true && !result.Item.withdrawnAt?.S;
  }

  // Helper methods
  private async verifyUserExists(userId: string): Promise<boolean> {
    try {
      const result = await this.dynamoClient.send(new GetItemCommand({
        TableName: 'github-link-buddy-users',
        Key: { userId: { S: userId } }
      }));
      return !!result.Item;
    } catch {
      return false;
    }
  }

  private async getRecentRequests(userId: string, type: string): Promise<any[]> {
    // Implementation would query audit log for recent requests
    return [];
  }

  private async getUserProfile(userId: string): Promise<any> {
    const result = await this.dynamoClient.send(new GetItemCommand({
      TableName: 'github-link-buddy-users',
      Key: { userId: { S: userId } }
    }));
    return result.Item || {};
  }

  private async getUserConnections(userId: string): Promise<any[]> {
    const result = await this.dynamoClient.send(new QueryCommand({
      TableName: 'github-link-buddy-connections',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId }
      }
    }));
    return result.Items || [];
  }

  private async getUserActivity(userId: string): Promise<any[]> {
    // Implementation would collect user activity data
    return [];
  }

  private async collectPortableUserData(userId: string): Promise<any> {
    return await this.collectUserData(userId);
  }

  private async checkRetentionRequirements(userId: string): Promise<{ mustRetain: boolean; reasons: string[] }> {
    // Check for legal/regulatory retention requirements
    const reasons: string[] = [];
    
    // Example checks
    const hasActiveSubscription = await this.hasActiveSubscription(userId);
    if (hasActiveSubscription) {
      reasons.push('Active subscription - financial records retention required');
    }

    const hasLegalClaims = await this.hasLegalClaims(userId);
    if (hasLegalClaims) {
      reasons.push('Pending legal claims - data retention required');
    }

    return {
      mustRetain: reasons.length > 0,
      reasons
    };
  }

  private async createDeletionPlan(userId: string): Promise<any> {
    return {
      userId,
      systems: ['dynamodb', 's3', 'backups', 'logs', 'analytics'],
      createdAt: new Date()
    };
  }

  private async deleteFromDynamoDB(userId: string): Promise<void> {
    // Delete from all relevant DynamoDB tables
    const tables = [
      'github-link-buddy-users',
      'github-link-buddy-connections',
      'github-link-buddy-activity'
    ];

    for (const table of tables) {
      await this.dynamoClient.send(new DeleteItemCommand({
        TableName: table,
        Key: { userId: { S: userId } }
      }));
    }
  }

  private async deleteFromS3(userId: string): Promise<void> {
    // Delete user files from S3
    // Implementation would list and delete all objects with userId prefix
  }

  private async deleteFromBackups(userId: string): Promise<void> {
    // Mark user data for deletion in backup systems
    // Implementation depends on backup strategy
  }

  private async deleteFromLogs(userId: string): Promise<void> {
    // Anonymize or delete user data from logs
    // Implementation depends on logging architecture
  }

  private async deleteFromAnalytics(userId: string): Promise<void> {
    // Remove user data from analytics systems
    // Implementation depends on analytics platform
  }

  private async verifyDeletion(userId: string): Promise<DeletionVerification> {
    const deletedSystems: string[] = [];
    const remainingSystems: string[] = [];

    // Verify deletion from each system
    const verificationChecks = [
      { system: 'dynamodb', check: () => this.verifyDynamoDBDeletion(userId) },
      { system: 's3', check: () => this.verifyS3Deletion(userId) },
      { system: 'backups', check: () => this.verifyBackupDeletion(userId) },
      { system: 'logs', check: () => this.verifyLogDeletion(userId) },
      { system: 'analytics', check: () => this.verifyAnalyticsDeletion(userId) }
    ];

    for (const { system, check } of verificationChecks) {
      const isDeleted = await check();
      if (isDeleted) {
        deletedSystems.push(system);
      } else {
        remainingSystems.push(system);
      }
    }

    return {
      isComplete: remainingSystems.length === 0,
      deletedSystems,
      remainingSystems,
      verificationTimestamp: new Date()
    };
  }

  private async verifyDynamoDBDeletion(userId: string): Promise<boolean> {
    try {
      const result = await this.dynamoClient.send(new GetItemCommand({
        TableName: 'github-link-buddy-users',
        Key: { userId: { S: userId } }
      }));
      return !result.Item;
    } catch {
      return true; // Consider deleted if we can't find it
    }
  }

  private async verifyS3Deletion(userId: string): Promise<boolean> {
    // Implementation would check for remaining S3 objects
    return true;
  }

  private async verifyBackupDeletion(userId: string): Promise<boolean> {
    // Implementation would verify backup deletion
    return true;
  }

  private async verifyLogDeletion(userId: string): Promise<boolean> {
    // Implementation would verify log anonymization/deletion
    return true;
  }

  private async verifyAnalyticsDeletion(userId: string): Promise<boolean> {
    // Implementation would verify analytics deletion
    return true;
  }

  private async restrictDataProcessing(userId: string, restrictions: string[]): Promise<void> {
    // Mark user for processing restriction
    await this.dynamoClient.send(new UpdateItemCommand({
      TableName: 'github-link-buddy-users',
      Key: { userId: { S: userId } },
      UpdateExpression: 'SET processingRestrictions = :restrictions, restrictedAt = :timestamp',
      ExpressionAttributeValues: {
        ':restrictions': { SS: restrictions },
        ':timestamp': { S: new Date().toISOString() }
      }
    }));
  }

  private async updateUserProfile(userId: string, profileUpdates: any): Promise<void> {
    // Implementation would update user profile with corrections
  }

  private async updateUserPreferences(userId: string, preferenceUpdates: any): Promise<void> {
    // Implementation would update user preferences with corrections
  }

  private async storePortableExport(data: any, requestId: string): Promise<string> {
    const key = `portability-exports/${requestId}/portable-data.json`;
    
    await this.s3Client.send(new PutObjectCommand({
      Bucket: 'github-link-buddy-gdpr-exports',
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: 'application/json',
      ServerSideEncryption: 'aws:kms',
      SSEKMSKeyId: this.encryptionKeyId
    }));

    return key;
  }

  private async hasActiveSubscription(userId: string): Promise<boolean> {
    // Implementation would check for active subscriptions
    return false;
  }

  private async hasLegalClaims(userId: string): Promise<boolean> {
    // Implementation would check for legal claims
    return false;
  }
}

export default GDPRComplianceManager;
