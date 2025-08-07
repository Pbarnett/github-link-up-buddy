/**
 * Browser-compatible AWS SDK stubs
 *
 * This file provides browser-compatible stubs for AWS SDK functionality
 * that would normally only work in server environments. Used for development
 * and testing environments where AWS SDK browser compatibility is needed.
 */

// Mock AWS SDK clients for browser environments
export class MockSecretsManagerClient {
  async send(command: any) {
    // Check for GetSecretValueCommand by class name or command type
    const isGetSecretCommand =
      command.constructor.name === 'GetSecretValueCommand' ||
      command.constructor.name === 'MockGetSecretValueCommand' ||
      command.input?.SecretId;

    if (isGetSecretCommand) {
      const secretId = command.input?.SecretId || 'unknown';

      // Return appropriate mock values based on secret type
      if (secretId.includes('stripe-publishable-key')) {
        return {
          SecretString:
            import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
            'pk_test_mock_development_key',
        };
      }

      if (secretId.includes('supabase-url')) {
        return {
          SecretString:
            import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co',
        };
      }

      if (secretId.includes('supabase-anon-key')) {
        return {
          SecretString:
            import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key',
        };
      }

      // Default mock response
      return {
        SecretString: JSON.stringify({
          mock: true,
          environment: 'development',
          secretId,
        }),
      };
    }

    console.warn(
      `Mock SecretsManager: Unsupported operation ${command.constructor.name}`
    );
    return { mock: true, operation: command.constructor.name };
  }
}

export class MockKMSClient {
  async send(command: any) {
    throw new Error('Mock KMS operation not implemented');
  }
}

export class MockS3Client {
  async send(command: any) {
    throw new Error('Mock S3 operation not implemented');
  }
}

export class MockDynamoDBClient {
  async send(command: any) {
    throw new Error('Mock DynamoDB operation not implemented');
  }
}

export class MockSTSClient {
  async send(command: any) {
    throw new Error('Mock STS operation not implemented');
  }
}

export class MockCloudWatchClient {
  async send(command: any) {
    throw new Error('Mock CloudWatch operation not implemented');
  }
}

// Mock credential providers for browser environments
export const fromEnv = () => {
  return {
    accessKeyId: 'mock-access-key',
    secretAccessKey: 'mock-secret-key',
    sessionToken: 'mock-session-token',
  };
};

export const fromContainerMetadata = () => {
  throw new Error('Container metadata not available in browser environment');
};

export const fromInstanceMetadata = () => {
  throw new Error('Instance metadata not available in browser environment');
};

export const fromIni = () => {
  throw new Error('INI credentials not available in browser environment');
};

// Check if we're in a browser environment
export const isBrowserEnvironment = () => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

// Factory function to create appropriate clients based on environment
export const createAWSClient = (clientType: string, config?: any) => {
  if (!isBrowserEnvironment()) {
    // Server environment - use real AWS SDK
    throw new Error('Real AWS SDK should be used in server environment');
  }

  // Browser environment - use mock clients
  switch (clientType) {
    case 'SecretsManager':
      return new MockSecretsManagerClient();
    case 'KMS':
      return new MockKMSClient();
    case 'S3':
      return new MockS3Client();
    case 'DynamoDB':
      return new MockDynamoDBClient();
    case 'STS':
      return new MockSTSClient();
    case 'CloudWatch':
      return new MockCloudWatchClient();
    default:
      throw new Error(`Unknown AWS client type: ${clientType}`);
  }
};

// Export a flag to identify mock mode
export const IS_MOCK_MODE = isBrowserEnvironment();

// Console warning for development
if (IS_MOCK_MODE && process.env.NODE_ENV === 'development') {
  console.warn(
    '🚧 AWS SDK Browser Compatibility Mode: Using mock AWS services for development/testing. ' +
      'Real AWS operations should be performed through your backend API.'
  );
}
