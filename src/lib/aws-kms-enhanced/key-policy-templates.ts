/**
 * Enhanced KMS Key Policy Templates
 * 
 * Implementing world-class security based on AWS AI Bot recommendations:
 * 1. Data isolation with separate keys for different data types
 * 2. Enhanced condition keys for restricted access
 * 3. PCI DSS compliance considerations
 */

export interface KeyPolicyConditions {
  allowedVPCEndpoints?: string[];
  allowedSourceIPs?: string[];
  allowedServices?: string[];
  requireMFA?: boolean;
  allowedTimeRange?: {
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  allowedRegions?: string[];
}

export interface KeyPolicyConfig {
  keyId: string;
  accountId: string;
  allowedRoles: string[];
  allowedUsers?: string[];
  conditions?: KeyPolicyConditions;
  keyUsage: 'payment-data' | 'user-pii' | 'database-credentials' | 'api-keys' | 'general';
}

/**
 * Generate enhanced key policy for payment data encryption (PCI DSS compliant)
 */
export function generatePaymentDataKeyPolicy(config: KeyPolicyConfig): any {
  const { keyId, accountId, allowedRoles, conditions = {} } = config;
  
  const baseConditions: any = {
    StringEquals: {
      'kms:EncryptionContext:data-type': 'payment',
      'kms:EncryptionContext:environment': process.env.NODE_ENV || 'development',
    }
  };

  // Add VPC endpoint restriction for payment data
  if (conditions.allowedVPCEndpoints?.length) {
    baseConditions.StringEquals['aws:SourceVpce'] = conditions.allowedVPCEndpoints;
  }

  // Add IP restrictions for payment processing
  if (conditions.allowedSourceIPs?.length) {
    baseConditions.IpAddress = {
      'aws:SourceIp': conditions.allowedSourceIPs
    };
  }

  // Add service restrictions (only allow specific services to use payment keys)
  if (conditions.allowedServices?.length) {
    baseConditions.StringEquals['kms:ViaService'] = conditions.allowedServices.map(
      service => `${service}.${process.env.AWS_REGION || 'us-west-2'}.amazonaws.com`
    );
  }

  // Require MFA for administrative operations on payment keys
  const adminConditions: any = {
    ...baseConditions,
    Bool: {
      'aws:MultiFactorAuthPresent': 'true'
    }
  };

  return {
    Version: '2012-10-17',
    Id: `payment-data-key-policy-${keyId}`,
    Statement: [
      // Root account administrative access
      {
        Sid: 'EnableRootAccountAccess',
        Effect: 'Allow',
        Principal: {
          AWS: `arn:aws:iam::${accountId}:root`
        },
        Action: 'kms:*',
        Resource: '*'
      },
      // Restricted decrypt access for payment processing
      {
        Sid: 'AllowPaymentDecryption',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.map(role => `arn:aws:iam::${accountId}:role/${role}`)
        },
        Action: [
          'kms:Decrypt',
          'kms:DescribeKey',
          'kms:GenerateDataKey',
          'kms:GenerateDataKeyWithoutPlaintext'
        ],
        Resource: '*',
        Condition: baseConditions
      },
      // Highly restricted encrypt access
      {
        Sid: 'AllowPaymentEncryption',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.slice(0, 2).map(role => `arn:aws:iam::${accountId}:role/${role}`) // Only first 2 roles
        },
        Action: [
          'kms:Encrypt',
          'kms:ReEncrypt'
        ],
        Resource: '*',
        Condition: baseConditions
      },
      // Administrative operations require MFA
      {
        Sid: 'RequireMFAForAdmin',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.map(role => `arn:aws:iam::${accountId}:role/${role}`)
        },
        Action: [
          'kms:CreateGrant',
          'kms:RevokeGrant',
          'kms:RetireGrant',
          'kms:TagResource',
          'kms:UntagResource'
        ],
        Resource: '*',
        Condition: adminConditions
      },
      // Deny all operations outside allowed time window (if specified)
      ...(conditions.allowedTimeRange ? [{
        Sid: 'DenyOutsideBusinessHours',
        Effect: 'Deny',
        Principal: '*',
        Action: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:GenerateDataKey'
        ],
        Resource: '*',
        Condition: {
          DateLessThan: {
            'aws:CurrentTime': conditions.allowedTimeRange.start
          },
          DateGreaterThan: {
            'aws:CurrentTime': conditions.allowedTimeRange.end
          }
        }
      }] : [])
    ]
  };
}

/**
 * Generate key policy for user PII data
 */
export function generatePIIDataKeyPolicy(config: KeyPolicyConfig): any {
  const { keyId, accountId, allowedRoles, conditions = {} } = config;

  const baseConditions: any = {
    StringEquals: {
      'kms:EncryptionContext:data-type': 'pii',
      'kms:EncryptionContext:environment': process.env.NODE_ENV || 'development',
    }
  };

  // Add GDPR compliance conditions
  if (conditions.allowedRegions?.length) {
    baseConditions.StringEquals['aws:RequestedRegion'] = conditions.allowedRegions;
  }

  return {
    Version: '2012-10-17',
    Id: `pii-data-key-policy-${keyId}`,
    Statement: [
      {
        Sid: 'EnableRootAccountAccess',
        Effect: 'Allow',
        Principal: {
          AWS: `arn:aws:iam::${accountId}:root`
        },
        Action: 'kms:*',
        Resource: '*'
      },
      {
        Sid: 'AllowPIIOperations',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.map(role => `arn:aws:iam::${accountId}:role/${role}`)
        },
        Action: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncrypt*',
          'kms:GenerateDataKey*',
          'kms:DescribeKey'
        ],
        Resource: '*',
        Condition: baseConditions
      }
    ]
  };
}

/**
 * Generate key policy for database credentials
 */
export function generateDatabaseKeyPolicy(config: KeyPolicyConfig): any {
  const { keyId, accountId, allowedRoles, conditions = {} } = config;

  const baseConditions: any = {
    StringEquals: {
      'kms:EncryptionContext:data-type': 'database-credentials',
      'kms:EncryptionContext:environment': process.env.NODE_ENV || 'development',
    }
  };

  // Restrict to specific database services
  if (conditions.allowedServices?.length) {
    baseConditions.StringEquals['kms:ViaService'] = [
      'rds.us-west-2.amazonaws.com',
      'rds.us-east-1.amazonaws.com',
      'secretsmanager.us-west-2.amazonaws.com',
      'secretsmanager.us-east-1.amazonaws.com'
    ];
  }

  return {
    Version: '2012-10-17',
    Id: `database-key-policy-${keyId}`,
    Statement: [
      {
        Sid: 'EnableRootAccountAccess',
        Effect: 'Allow',
        Principal: {
          AWS: `arn:aws:iam::${accountId}:root`
        },
        Action: 'kms:*',
        Resource: '*'
      },
      {
        Sid: 'AllowDatabaseCredentialOperations',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.map(role => `arn:aws:iam::${accountId}:role/${role}`)
        },
        Action: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncrypt*',
          'kms:GenerateDataKey*',
          'kms:DescribeKey'
        ],
        Resource: '*',
        Condition: baseConditions
      },
      // Allow Secrets Manager to use the key for automatic rotation
      {
        Sid: 'AllowSecretsManagerAccess',
        Effect: 'Allow',
        Principal: {
          Service: 'secretsmanager.amazonaws.com'
        },
        Action: [
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncrypt*',
          'kms:GenerateDataKey*',
          'kms:DescribeKey'
        ],
        Resource: '*',
        Condition: baseConditions
      }
    ]
  };
}

/**
 * Generate key policy for API keys and application secrets
 */
export function generateAPIKeyPolicy(config: KeyPolicyConfig): any {
  const { keyId, accountId, allowedRoles, conditions = {} } = config;

  const baseConditions: any = {
    StringEquals: {
      'kms:EncryptionContext:data-type': 'api-keys',
      'kms:EncryptionContext:environment': process.env.NODE_ENV || 'development',
    }
  };

  return {
    Version: '2012-10-17',
    Id: `api-key-policy-${keyId}`,
    Statement: [
      {
        Sid: 'EnableRootAccountAccess',
        Effect: 'Allow',
        Principal: {
          AWS: `arn:aws:iam::${accountId}:root`
        },
        Action: 'kms:*',
        Resource: '*'
      },
      {
        Sid: 'AllowAPIKeyOperations',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.map(role => `arn:aws:iam::${accountId}:role/${role}`)
        },
        Action: [
          'kms:Decrypt',
          'kms:DescribeKey',
          'kms:GenerateDataKey*'
        ],
        Resource: '*',
        Condition: baseConditions
      },
      // Restrict encrypt operations to fewer roles
      {
        Sid: 'RestrictedEncryptAccess',
        Effect: 'Allow',
        Principal: {
          AWS: allowedRoles.slice(0, 1).map(role => `arn:aws:iam::${accountId}:role/${role}`) // Only first role
        },
        Action: [
          'kms:Encrypt',
          'kms:ReEncrypt*'
        ],
        Resource: '*',
        Condition: baseConditions
      }
    ]
  };
}

/**
 * Key policy generator factory
 */
export function generateKeyPolicy(config: KeyPolicyConfig): any {
  switch (config.keyUsage) {
    case 'payment-data':
      return generatePaymentDataKeyPolicy(config);
    case 'user-pii':
      return generatePIIDataKeyPolicy(config);
    case 'database-credentials':
      return generateDatabaseKeyPolicy(config);
    case 'api-keys':
      return generateAPIKeyPolicy(config);
    default:
      throw new Error(`Unsupported key usage type: ${config.keyUsage}`);
  }
}

/**
 * Example configurations for different environments
 */
export const EXAMPLE_CONFIGS = {
  production: {
    paymentKey: {
      keyUsage: 'payment-data' as const,
      allowedRoles: ['PaymentProcessorRole', 'StripeIntegrationRole'],
      conditions: {
        allowedVPCEndpoints: ['vpce-1234567890abcdef0'],
        allowedSourceIPs: ['10.0.0.0/8'],
        allowedServices: ['lambda', 'ecs'],
        requireMFA: true,
        allowedTimeRange: {
          start: '06:00',
          end: '22:00'
        }
      }
    },
    piiKey: {
      keyUsage: 'user-pii' as const,
      allowedRoles: ['UserDataProcessorRole', 'ProfileManagementRole'],
      conditions: {
        allowedRegions: ['us-west-2', 'eu-west-1'],
        allowedVPCEndpoints: ['vpce-1234567890abcdef0']
      }
    },
    databaseKey: {
      keyUsage: 'database-credentials' as const,
      allowedRoles: ['DatabaseAccessRole', 'ApplicationRole'],
      conditions: {
        allowedServices: ['rds', 'secretsmanager']
      }
    }
  }
};
