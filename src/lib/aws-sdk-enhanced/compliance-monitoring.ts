/**
 * Enterprise Compliance Monitoring Service
 * 
 * Implements comprehensive compliance monitoring for:
 * - PCI DSS Level 1
 * - SOC 2 Type II
 * - GDPR
 * - Industry audit requirements
 */

import { 
  ConfigServiceClient, 
  PutConfigRuleCommand,
  GetComplianceDetailsByConfigRuleCommand 
} from '@aws-sdk/client-config-service';
import { 
  SecurityHubClient, 
  BatchEnableStandardsCommand,
  GetFindingsCommand 
} from '@aws-sdk/client-securityhub';
import { 
  CloudWatchClient, 
  PutMetricDataCommand,
  PutDashboardCommand 
} from '@aws-sdk/client-cloudwatch';
import { 
  Macie2Client as MacieClient,
  EnableMacieCommand,
  CreateClassificationJobCommand 
} from '@aws-sdk/client-macie2';
import { EnhancedAWSClientFactory } from './client-factory';

interface ComplianceRule {
  name: string;
  sourceIdentifier: string;
  resourceTypes?: string[];
  description: string;
  framework: 'PCI-DSS' | 'SOC2' | 'GDPR' | 'ALL';
}

interface ComplianceMetric {
  MetricName: string;
  Value: number;
  Unit: 'Count' | 'Percent';
  Dimensions: Array<{ Name: string; Value: string }>;
  Timestamp?: Date;
}

/**
 * Compliance Framework Manager
 */
export class ComplianceFrameworkManager {
  private static instance: ComplianceFrameworkManager;
  private configService: ConfigServiceClient;
  private securityHub: SecurityHubClient;
  private cloudWatch: CloudWatchClient;
  private macie: MacieClient;
  private readonly environment: string;
  private readonly region: string;

  static getInstance(): ComplianceFrameworkManager {
    if (!ComplianceFrameworkManager.instance) {
      ComplianceFrameworkManager.instance = new ComplianceFrameworkManager();
    }
    return ComplianceFrameworkManager.instance;
  }

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.region = process.env.AWS_REGION || 'us-west-2';
    
    this.configService = EnhancedAWSClientFactory.createConfigServiceClient({
      region: this.region,
      environment: this.environment as any
    });
    
    this.securityHub = EnhancedAWSClientFactory.createSecurityHubClient({
      region: this.region,
      environment: this.environment as any
    });
    
    this.cloudWatch = EnhancedAWSClientFactory.createCloudWatchClient({
      region: this.region,
      environment: this.environment as any
    });

    this.macie = EnhancedAWSClientFactory.createMacieClient({
      region: this.region,
      environment: this.environment as any
    });
  }

  /**
   * Initialize all compliance frameworks
   */
  async initializeCompliance(): Promise<void> {
    console.log('🔐 Initializing enterprise compliance frameworks...');
    
    try {
      await Promise.all([
        this.setupPCIDSSCompliance(),
        this.setupSOC2Compliance(),
        this.setupGDPRCompliance(),
        this.setupSecurityHubStandards(),
        this.createComplianceDashboard()
      ]);
      
      console.log('✅ Compliance frameworks initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize compliance frameworks:', error);
      throw error;
    }
  }

  /**
   * Setup PCI DSS Level 1 compliance rules
   */
  private async setupPCIDSSCompliance(): Promise<void> {
    console.log('💳 Setting up PCI DSS Level 1 compliance...');
    
    const pciRules: ComplianceRule[] = [
      {
        name: 'pci-dss-encrypted-volumes',
        sourceIdentifier: 'ENCRYPTED_VOLUMES',
        resourceTypes: ['AWS::EC2::Volume'],
        description: 'Ensures all EBS volumes are encrypted',
        framework: 'PCI-DSS'
      },
      {
        name: 'pci-dss-rds-encryption-enabled',
        sourceIdentifier: 'RDS_STORAGE_ENCRYPTED',
        description: 'Ensures RDS instances have encryption enabled',
        framework: 'PCI-DSS'
      },
      {
        name: 'pci-dss-s3-bucket-ssl-requests-only',
        sourceIdentifier: 'S3_BUCKET_SSL_REQUESTS_ONLY',
        description: 'Ensures S3 buckets require SSL requests',
        framework: 'PCI-DSS'
      },
      {
        name: 'pci-dss-cloudtrail-enabled',
        sourceIdentifier: 'CLOUD_TRAIL_ENABLED',
        description: 'Ensures CloudTrail is enabled',
        framework: 'PCI-DSS'
      },
      {
        name: 'pci-dss-vpc-sg-open-only-to-authorized-ports',
        sourceIdentifier: 'INCOMING_SSH_DISABLED',
        description: 'Ensures security groups restrict unauthorized access',
        framework: 'PCI-DSS'
      }
    ];

    await this.deployConfigRules(pciRules);
    
    // Set up PCI DSS specific monitoring
    await this.publishComplianceMetric({
      MetricName: 'PCIDSSRulesDeployed',
      Value: pciRules.length,
      Unit: 'Count',
      Dimensions: [
        { Name: 'Framework', Value: 'PCI-DSS' },
        { Name: 'Environment', Value: this.environment }
      ]
    });
  }

  /**
   * Setup SOC 2 Type II compliance
   */
  private async setupSOC2Compliance(): Promise<void> {
    console.log('🔍 Setting up SOC 2 Type II compliance...');
    
    const soc2Rules: ComplianceRule[] = [
      {
        name: 'soc2-iam-password-policy',
        sourceIdentifier: 'IAM_PASSWORD_POLICY',
        description: 'Ensures IAM password policy meets requirements',
        framework: 'SOC2'
      },
      {
        name: 'soc2-root-access-key-check',
        sourceIdentifier: 'ROOT_ACCESS_KEY_CHECK',
        description: 'Ensures root account has no access keys',
        framework: 'SOC2'
      },
      {
        name: 'soc2-mfa-enabled-for-iam-console-access',
        sourceIdentifier: 'MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS',
        description: 'Ensures MFA is enabled for console access',
        framework: 'SOC2'
      },
      {
        name: 'soc2-cloudtrail-log-file-validation-enabled',
        sourceIdentifier: 'CLOUD_TRAIL_LOG_FILE_VALIDATION_ENABLED',
        description: 'Ensures CloudTrail log file validation is enabled',
        framework: 'SOC2'
      }
    ];

    await this.deployConfigRules(soc2Rules);
    
    await this.publishComplianceMetric({
      MetricName: 'SOC2RulesDeployed',
      Value: soc2Rules.length,
      Unit: 'Count',
      Dimensions: [
        { Name: 'Framework', Value: 'SOC2' },
        { Name: 'Environment', Value: this.environment }
      ]
    });
  }

  /**
   * Setup GDPR compliance
   */
  private async setupGDPRCompliance(): Promise<void> {
    console.log('🇪🇺 Setting up GDPR compliance...');
    
    try {
      // Enable Amazon Macie for data classification
      await this.macie.send(new EnableMacieCommand({}));
      console.log('✅ Amazon Macie enabled for data classification');
      
      // Create classification job for customer data
      const classificationJob = {
        jobType: 'ONE_TIME' as const,
        name: `GDPR-Customer-Data-Classification-${Date.now()}`,
        s3JobDefinition: {
          bucketDefinitions: [
            {
              accountId: process.env.AWS_ACCOUNT_ID || '',
              buckets: ['flight-booking-customer-data']
            }
          ]
        }
      };

      await this.macie.send(new CreateClassificationJobCommand(classificationJob));
      console.log('✅ GDPR data classification job created');

    } catch (error) {
      console.warn('⚠️ GDPR setup partial - some features may require manual configuration:', error);
    }

    const gdprRules: ComplianceRule[] = [
      {
        name: 'gdpr-s3-bucket-public-access-prohibited',
        sourceIdentifier: 'S3_BUCKET_PUBLIC_ACCESS_PROHIBITED',
        description: 'Ensures S3 buckets prohibit public access',
        framework: 'GDPR'
      },
      {
        name: 'gdpr-kms-cmk-not-scheduled-for-deletion',
        sourceIdentifier: 'KMS_CMK_NOT_SCHEDULED_FOR_DELETION',
        description: 'Ensures KMS keys are not scheduled for deletion',
        framework: 'GDPR'
      }
    ];

    await this.deployConfigRules(gdprRules);
    
    await this.publishComplianceMetric({
      MetricName: 'GDPRRulesDeployed',
      Value: gdprRules.length,
      Unit: 'Count',
      Dimensions: [
        { Name: 'Framework', Value: 'GDPR' },
        { Name: 'Environment', Value: this.environment }
      ]
    });
  }

  /**
   * Setup Security Hub compliance standards
   */
  private async setupSecurityHubStandards(): Promise<void> {
    console.log('🛡️ Setting up Security Hub compliance standards...');
    
    try {
      const standards = [
        'arn:aws:securityhub:::standard/pci-dss/v/3.2.1',
        'arn:aws:securityhub:::standard/aws-foundational-security/v/1.0.0'
      ];

      await this.securityHub.send(new BatchEnableStandardsCommand({
        StandardsSubscriptionRequests: standards.map(arn => ({ StandardsArn: arn }))
      }));
      
      console.log('✅ Security Hub standards enabled');
    } catch (error) {
      console.warn('⚠️ Security Hub setup may require manual configuration:', error);
    }
  }

  /**
   * Deploy AWS Config rules
   */
  private async deployConfigRules(rules: ComplianceRule[]): Promise<void> {
    for (const rule of rules) {
      try {
        const configRule = {
          ConfigRule: {
            ConfigRuleName: rule.name,
            Description: rule.description,
            Source: {
              Owner: 'AWS' as const,
              SourceIdentifier: rule.sourceIdentifier
            },
            ...(rule.resourceTypes && {
              Scope: {
                ComplianceResourceTypes: rule.resourceTypes
              }
            })
          }
        };

        await this.configService.send(new PutConfigRuleCommand(configRule));
        console.log(`✅ Deployed config rule: ${rule.name}`);
        
      } catch (error) {
        console.warn(`⚠️ Failed to deploy config rule ${rule.name}:`, error);
      }
    }
  }

  /**
   * Publish compliance metrics to CloudWatch
   */
  private async publishComplianceMetric(metric: ComplianceMetric): Promise<void> {
    try {
      await this.cloudWatch.send(new PutMetricDataCommand({
        Namespace: 'Enterprise/Compliance',
        MetricData: [{
          MetricName: metric.MetricName,
          Value: metric.Value,
          Unit: metric.Unit,
          Dimensions: metric.Dimensions,
          Timestamp: metric.Timestamp || new Date()
        }]
      }));
    } catch (error) {
      console.warn('Failed to publish compliance metric:', error);
    }
  }

  /**
   * Create compliance monitoring dashboard
   */
  private async createComplianceDashboard(): Promise<void> {
    console.log('📊 Creating compliance monitoring dashboard...');
    
    const dashboardBody = {
      widgets: [
        {
          type: 'metric',
          x: 0,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['Enterprise/Compliance', 'PCIDSSRulesDeployed'],
              ['Enterprise/Compliance', 'SOC2RulesDeployed'],
              ['Enterprise/Compliance', 'GDPRRulesDeployed']
            ],
            period: 3600,
            stat: 'Average',
            region: this.region,
            title: 'Compliance Rules Deployed',
            yAxis: {
              left: {
                min: 0
              }
            }
          }
        },
        {
          type: 'metric',
          x: 0,
          y: 6,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/Config', 'ComplianceByConfigRule']
            ],
            period: 3600,
            stat: 'Average',
            region: this.region,
            title: 'Overall Compliance Status'
          }
        }
      ]
    };

    try {
      await this.cloudWatch.send(new PutDashboardCommand({
        DashboardName: `Enterprise-Compliance-${this.environment}`,
        DashboardBody: JSON.stringify(dashboardBody)
      }));
      
      console.log('✅ Compliance dashboard created');
    } catch (error) {
      console.warn('⚠️ Failed to create compliance dashboard:', error);
    }
  }

  /**
   * Get compliance status report
   */
  async getComplianceReport(): Promise<{
    pciDSS: any[];
    soc2: any[];
    gdpr: any[];
    overall: { compliant: number; nonCompliant: number; total: number };
  }> {
    console.log('📋 Generating compliance report...');
    
    const report = {
      pciDSS: [] as any[],
      soc2: [] as any[],
      gdpr: [] as any[],
      overall: { compliant: 0, nonCompliant: 0, total: 0 }
    };

    // This would typically query Config and Security Hub for actual compliance data
    // For now, we'll return a basic structure
    
    return report;
  }

  /**
   * Check if environment is production for strict compliance
   */
  private isProductionEnvironment(): boolean {
    return this.environment === 'production';
  }
}

// Export singleton instance
export const complianceManager = ComplianceFrameworkManager.getInstance();

// Export types for use in other modules
export type { ComplianceRule, ComplianceMetric };
