#!/usr/bin/env node

/**
 * Enhanced AWS SDK Deployment Script
 * 
 * Automates the complete deployment of enhanced AWS SDK integration including:
 * - Environment validation
 * - AWS infrastructure setup
 * - KMS keys creation
 * - IAM policies and roles
 * - CloudWatch monitoring setup
 * - Configuration validation
 */

const { CloudFormationClient, CreateStackCommand, UpdateStackCommand, DescribeStacksCommand, waitUntilStackCreateComplete, waitUntilStackUpdateComplete } = require('@aws-sdk/client-cloudformation');
const { IAMClient, CreateRoleCommand, CreatePolicyCommand, AttachRolePolicyCommand, GetRoleCommand } = require('@aws-sdk/client-iam');
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');
const fs = require('fs');
const path = require('path');

class EnhancedAWSSDKDeployment {
  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.environment = process.env.NODE_ENV || 'production';
    this.applicationName = 'parker-flight';
    
    this.cloudFormation = new CloudFormationClient({ region: this.region });
    this.iam = new IAMClient({ region: this.region });
    this.sts = new STSClient({ region: this.region });
    
    this.accountId = null;
    this.deploymentConfig = {};
  }

  /**
   * Initialize deployment
   */
  async initialize() {
    console.log(`
🚀 Enhanced AWS SDK Deployment
==============================

Environment: ${this.environment}
Region: ${this.region}
Application: ${this.applicationName}
`);

    try {
      // Get AWS account ID
      const identity = await this.sts.send(new GetCallerIdentityCommand({}));
      this.accountId = identity.Account;
      console.log(`Account ID: ${this.accountId}`);
      
      // Load deployment configuration
      this.loadConfiguration();
      
      return true;
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }

  /**
   * Load deployment configuration
   */
  loadConfiguration() {
    try {
      const configPath = path.join(process.cwd(), 'config', 'aws-sdk-enhanced.config.js');
      if (fs.existsSync(configPath)) {
        this.deploymentConfig = require(configPath);
        console.log('✅ Configuration loaded successfully');
      } else {
        console.warn('⚠️  Configuration file not found, using defaults');
      }
    } catch (error) {
      console.warn('⚠️  Failed to load configuration:', error.message);
    }
  }

  /**
   * Validate prerequisites
   */
  async validatePrerequisites() {
    console.log('🔍 Validating prerequisites...');
    const issues = [];

    // Check required environment variables
    const requiredEnvVars = ['AWS_REGION'];
    const optionalEnvVars = ['KMS_GENERAL_ALIAS', 'KMS_PII_ALIAS', 'KMS_PAYMENT_ALIAS'];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        issues.push(`Missing required environment variable: ${envVar}`);
      }
    }

    // Check AWS credentials
    try {
      await this.sts.send(new GetCallerIdentityCommand({}));
      console.log('  ✅ AWS credentials valid');
    } catch (error) {
      issues.push(`AWS credentials invalid: ${error.message}`);
    }

    // Check required files
    const requiredFiles = [
      'deployment/aws/iam-policy-template.json',
      'deployment/aws/kms-keys-cloudformation.yaml',
    ];

    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        issues.push(`Missing required file: ${file}`);
      }
    }

    if (issues.length > 0) {
      console.error('❌ Prerequisites validation failed:');
      issues.forEach(issue => console.error(`  - ${issue}`));
      return false;
    }

    console.log('✅ Prerequisites validation passed');
    return true;
  }

  /**
   * Create IAM role and policies
   */
  async createIAMResources() {
    console.log('🔐 Setting up IAM resources...');
    
    const roleName = `parker-flight-${this.environment}-role`;
    const policyName = `parker-flight-${this.environment}-policy`;

    try {
      // Create IAM role
      const assumeRolePolicyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: ['lambda.amazonaws.com', 'ecs-tasks.amazonaws.com']
            },
            Action: 'sts:AssumeRole'
          }
        ]
      };

      try {
        await this.iam.send(new GetRoleCommand({ RoleName: roleName }));
        console.log(`  ℹ️  IAM role ${roleName} already exists`);
      } catch (error) {
        if (error.name === 'NoSuchEntityException') {
          console.log(`  📝 Creating IAM role: ${roleName}`);
          await this.iam.send(new CreateRoleCommand({
            RoleName: roleName,
            AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyDocument),
            Description: `IAM role for Parker Flight ${this.environment} environment`,
            Tags: [
              { Key: 'Application', Value: this.applicationName },
              { Key: 'Environment', Value: this.environment },
              { Key: 'ManagedBy', Value: 'enhanced-aws-sdk-deployment' }
            ]
          }));
          console.log('  ✅ IAM role created successfully');
        } else {
          throw error;
        }
      }

      // Create IAM policy
      const policyTemplate = fs.readFileSync(
        path.join(process.cwd(), 'deployment/aws/iam-policy-template.json'),
        'utf8'
      );
      
      const policyDocument = policyTemplate
        .replace(/ACCOUNT_ID/g, this.accountId)
        .replace(/KEY_ID_GENERAL/g, '*')  // Will be updated after key creation
        .replace(/KEY_ID_PII/g, '*')
        .replace(/KEY_ID_PAYMENT/g, '*');

      try {
        await this.iam.send(new CreatePolicyCommand({
          PolicyName: policyName,
          PolicyDocument: policyDocument,
          Description: `IAM policy for Parker Flight KMS operations in ${this.environment}`
        }));
        console.log('  ✅ IAM policy created successfully');
      } catch (error) {
        if (error.name === 'EntityAlreadyExistsException') {
          console.log('  ℹ️  IAM policy already exists');
        } else {
          throw error;
        }
      }

      // Attach policy to role
      const policyArn = `arn:aws:iam::${this.accountId}:policy/${policyName}`;
      try {
        await this.iam.send(new AttachRolePolicyCommand({
          RoleName: roleName,
          PolicyArn: policyArn
        }));
        console.log('  ✅ Policy attached to role');
      } catch (error) {
        if (!error.message.includes('already attached')) {
          throw error;
        }
      }

      return { roleName, policyName, policyArn };
    } catch (error) {
      console.error('❌ IAM resources creation failed:', error.message);
      throw error;
    }
  }

  /**
   * Deploy KMS keys using CloudFormation
   */
  async deployKMSKeys() {
    console.log('🔑 Deploying KMS keys...');
    
    const stackName = `parker-flight-kms-${this.environment}`;
    
    try {
      // Read CloudFormation template
      const templateBody = fs.readFileSync(
        path.join(process.cwd(), 'deployment/aws/kms-keys-cloudformation.yaml'),
        'utf8'
      );

      const params = {
        StackName: stackName,
        TemplateBody: templateBody,
        Parameters: [
          { ParameterKey: 'Environment', ParameterValue: this.environment },
          { ParameterKey: 'ApplicationName', ParameterValue: this.applicationName },
          { ParameterKey: 'KeyRotationEnabled', ParameterValue: 'true' }
        ],
        Capabilities: ['CAPABILITY_IAM'],
        Tags: [
          { Key: 'Application', Value: this.applicationName },
          { Key: 'Environment', Value: this.environment },
          { Key: 'ManagedBy', Value: 'enhanced-aws-sdk-deployment' }
        ]
      };

      try {
        // Check if stack exists
        await this.cloudFormation.send(new DescribeStacksCommand({ StackName: stackName }));
        
        // Stack exists, update it
        console.log(`  📝 Updating CloudFormation stack: ${stackName}`);
        await this.cloudFormation.send(new UpdateStackCommand(params));
        
        console.log('  ⏳ Waiting for stack update to complete...');
        await waitUntilStackUpdateComplete(
          { client: this.cloudFormation, maxWaitTime: 600 },
          { StackName: stackName }
        );
        
      } catch (error) {
        if (error.message.includes('does not exist')) {
          // Stack doesn't exist, create it
          console.log(`  📝 Creating CloudFormation stack: ${stackName}`);
          await this.cloudFormation.send(new CreateStackCommand(params));
          
          console.log('  ⏳ Waiting for stack creation to complete...');
          await waitUntilStackCreateComplete(
            { client: this.cloudFormation, maxWaitTime: 600 },
            { StackName: stackName }
          );
        } else {
          throw error;
        }
      }

      // Get stack outputs
      const stackDescription = await this.cloudFormation.send(
        new DescribeStacksCommand({ StackName: stackName })
      );
      
      const outputs = stackDescription.Stacks[0].Outputs || [];
      const keyInfo = {};
      
      outputs.forEach(output => {
        keyInfo[output.OutputKey] = output.OutputValue;
      });

      console.log('  ✅ KMS keys deployed successfully');
      console.log('  📋 Key Information:');
      console.log(`     General Key: ${keyInfo.GeneralKeyAlias || 'N/A'}`);
      console.log(`     PII Key: ${keyInfo.PIIKeyAlias || 'N/A'}`);
      console.log(`     Payment Key: ${keyInfo.PaymentKeyAlias || 'N/A'}`);

      return keyInfo;
    } catch (error) {
      console.error('❌ KMS keys deployment failed:', error.message);
      throw error;
    }
  }

  /**
   * Set up monitoring
   */
  async setupMonitoring() {
    console.log('📊 Setting up monitoring...');
    
    try {
      const MonitoringSetup = require('./setup-monitoring.cjs');
      const monitoring = new MonitoringSetup();
      
      await monitoring.setupAll();
      console.log('  ✅ Monitoring setup completed');
      
    } catch (error) {
      console.error('❌ Monitoring setup failed:', error.message);
      // Don't fail the entire deployment for monitoring issues
      console.warn('  ⚠️  Continuing deployment without monitoring setup');
    }
  }

  /**
   * Validate deployment
   */
  async validateDeployment() {
    console.log('✅ Validating deployment...');
    
    try {
      // Test configuration loading
      const configPath = path.join(process.cwd(), 'config', 'aws-sdk-enhanced.config.js');
      if (fs.existsSync(configPath)) {
        const config = require(configPath);
        const validation = config.validate();
        
        if (validation.isValid) {
          console.log('  ✅ Configuration validation passed');
        } else {
          console.warn('  ⚠️  Configuration validation warnings:');
          validation.errors.forEach(error => {
            console.warn(`    - ${error}`);
          });
        }
      }

      // Test AWS connectivity
      await this.sts.send(new GetCallerIdentityCommand({}));
      console.log('  ✅ AWS connectivity verified');

      console.log('  ✅ Deployment validation completed');
      return true;
      
    } catch (error) {
      console.error('  ❌ Deployment validation failed:', error.message);
      return false;
    }
  }

  /**
   * Run complete deployment
   */
  async deploy() {
    try {
      console.log('Starting enhanced AWS SDK deployment...\n');
      
      // Initialize
      if (!(await this.initialize())) {
        process.exit(1);
      }

      // Validate prerequisites
      if (!(await this.validatePrerequisites())) {
        process.exit(1);
      }

      // Create IAM resources
      const iamResources = await this.createIAMResources();

      // Deploy KMS keys
      const keyInfo = await this.deployKMSKeys();

      // Setup monitoring
      await this.setupMonitoring();

      // Validate deployment
      await this.validateDeployment();

      console.log(`
🎉 Enhanced AWS SDK Deployment Complete!
========================================

Environment: ${this.environment}
Region: ${this.region}
Account: ${this.accountId}

IAM Resources:
- Role: ${iamResources.roleName}
- Policy: ${iamResources.policyName}

KMS Keys:
- General: ${keyInfo.GeneralKeyAlias || 'N/A'}
- PII: ${keyInfo.PIIKeyAlias || 'N/A'}  
- Payment: ${keyInfo.PaymentKeyAlias || 'N/A'}

Next Steps:
1. Update your environment variables with the created key aliases
2. Test the enhanced KMS integration using: node scripts/demo-enhanced-aws-sdk.cjs
3. Run the integration tests: node tests/integration/enhanced-aws-sdk-integration.test.cjs
4. Monitor your CloudWatch dashboard for metrics and alerts

Environment Variables to Set:
export KMS_GENERAL_ALIAS="${keyInfo.GeneralKeyAlias || 'alias/parker-flight-general-production'}"
export KMS_PII_ALIAS="${keyInfo.PIIKeyAlias || 'alias/parker-flight-pii-production'}"  
export KMS_PAYMENT_ALIAS="${keyInfo.PaymentKeyAlias || 'alias/parker-flight-payment-production'}"
`);

    } catch (error) {
      console.error(`
❌ Deployment Failed!
====================

Error: ${error.message}

Troubleshooting:
1. Check your AWS credentials and permissions
2. Verify the AWS region is correctly configured
3. Ensure all required files are present
4. Check the CloudFormation console for detailed error information

For support, refer to the documentation in docs/enhanced-aws-sdk-usage-examples.md
`);
      process.exit(1);
    }
  }

  /**
   * Cleanup deployment (for development/testing)
   */
  async cleanup() {
    console.log('🧹 Cleaning up deployment...');
    
    try {
      const stackName = `parker-flight-kms-${this.environment}`;
      
      // Delete CloudFormation stack
      const { DeleteStackCommand, waitUntilStackDeleteComplete } = require('@aws-sdk/client-cloudformation');
      
      console.log(`  📝 Deleting CloudFormation stack: ${stackName}`);
      await this.cloudFormation.send(new DeleteStackCommand({ StackName: stackName }));
      
      console.log('  ⏳ Waiting for stack deletion to complete...');
      await waitUntilStackDeleteComplete(
        { client: this.cloudFormation, maxWaitTime: 600 },
        { StackName: stackName }
      );
      
      console.log('  ✅ Cleanup completed successfully');
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }
}

// Run deployment if this file is executed directly
if (require.main === module) {
  const deployment = new EnhancedAWSSDKDeployment();
  
  const command = process.argv[2];
  
  if (command === 'cleanup') {
    deployment.cleanup().catch(error => {
      console.error('Cleanup error:', error);
      process.exit(1);
    });
  } else {
    deployment.deploy().catch(error => {
      console.error('Deployment error:', error);
      process.exit(1);
    });
  }
}

module.exports = EnhancedAWSSDKDeployment;
