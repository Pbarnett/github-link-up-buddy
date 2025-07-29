import * as React from 'react';
import { IS_MOCK_MODE } from '../aws-sdk-browser-compat';
import { EnhancedAWSClientFactory } from './client-factory';
import { EnhancedAWSErrorHandler } from './error-handling';
// Conditionally import AWS SDK commands based on environment
let GetSecretValueCommand: any;

if (!IS_MOCK_MODE) {
  ({ GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager'));
} else {
  // Mock command for browser environments
  GetSecretValueCommand = class MockGetSecretValueCommand {
    constructor(public input: any) {}
  };
}

/**
 * Retrieves a secret value from AWS Secrets Manager.
 *
 * This function uses the SecretsManagerClient from the client factory.
 * It retrieves the specified secret using GetSecretValueCommand
 * and handles errors using EnhancedAWSErrorHandler.
 */
export async function getSecretValue(
  secretId: string,
  region: string
): Promise<string | undefined> {
  const client = EnhancedAWSClientFactory.createSecretsManagerClient({
    region,
    environment: process.env.NODE_ENV || 'development',
  });

  try {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await EnhancedAWSErrorHandler.executeWithRetry(
      () => client.send(command),
      'secretsmanager',
      'getSecretValue'
    );

    return response.SecretString;
  } catch (error) {
    console.error('Failed to retrieve secret:', error);
    throw error;
  }
}
