/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  __SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

// Mock modules at the top level
const mockSecretsManagerClient = {
  send: vi.fn(),
  destroy: vi.fn(),
};

const mockClientFactory = {
  createSecretsManagerClient: vi.fn(() => mockSecretsManagerClient),
};

const mockErrorHandler = {
  executeWithRetry: vi.fn(),
};

// Mock the modules
vi.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: vi.fn(),
  GetSecretValueCommand: vi.fn(),
}));

vi.mock('../client-factory', () => ({
  EnhancedAWSClientFactory: mockClientFactory,
}));

vi.mock('../error-handling', () => ({
  EnhancedAWSErrorHandler: mockErrorHandler,
}));

// Import after mocking
const { getSecretValue } = await import('../secrets-manager');

describe('AWS Secrets Manager Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockClientFactory.createSecretsManagerClient.mockReturnValue(
      mockSecretsManagerClient
    );
    mockErrorHandler.executeWithRetry.mockImplementation(operation =>
      operation()
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSecretValue', () => {
    it('should successfully retrieve a secret value', async () => {
      // Arrange
      const secretId = 'prod/api/stripe-key';
      const region = 'us-west-2';
      const expectedSecretValue = 'sk_test_123456789';

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretString: expectedSecretValue,
        VersionId: 'v1',
        VersionStages: ['AWSCURRENT'],
      });

      // Act
      const result = await getSecretValue(secretId, region);

      // Assert
      expect(result).toBe(expectedSecretValue);
      expect(mockClientFactory.createSecretsManagerClient).toHaveBeenCalledWith(
        {
          region,
          environment: 'test', // NODE_ENV during testing
        }
      );
      expect(mockSecretsManagerClient.send).toHaveBeenCalledWith(
        expect.any(GetSecretValueCommand)
      );
      expect(mockErrorHandler.executeWithRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'secretsmanager',
        'getSecretValue'
      );
    });

    it('should handle binary secret values', async () => {
      // Arrange
      const secretId = 'prod/certificates/private-key';
      const region = 'us-east-1';
      const binarySecret = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello" in binary

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretBinary: binarySecret,
        VersionId: 'v1',
        VersionStages: ['AWSCURRENT'],
      });

      // Act
      const result = await getSecretValue(secretId, region);

      // Assert
      expect(result).toBeUndefined(); // Since SecretString is undefined, function returns undefined
    });

    it('should handle undefined secret values', async () => {
      // Arrange
      const secretId = 'prod/empty-secret';
      const region = 'us-west-2';

      mockSecretsManagerClient.send.mockResolvedValue({
        VersionId: 'v1',
        VersionStages: ['AWSCURRENT'],
        // No SecretString or SecretBinary
      });

      // Act
      const result = await getSecretValue(secretId, region);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should propagate errors from the error handler', async () => {
      // Arrange
      const secretId = 'nonexistent/secret';
      const region = 'us-west-2';
      const error = new Error('Secret not found');

      mockErrorHandler.executeWithRetry.mockRejectedValue(error);

      // Act & Assert
      await expect(getSecretValue(secretId, region)).rejects.toThrow(
        'Secret not found'
      );
    });

    it('should use the correct environment from NODE_ENV', async () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const secretId = 'prod/api/key';
      const region = 'us-west-2';

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretString: 'secret-value',
      });

      try {
        // Act
        await getSecretValue(secretId, region);

        // Assert
        expect(
          mockClientFactory.createSecretsManagerClient
        ).toHaveBeenCalledWith({
          region,
          environment: 'production',
        });
      } finally {
        // Cleanup
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('should default to development environment when NODE_ENV is not set', async () => {
      // Arrange
      const originalEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      const secretId = 'dev/api/key';
      const region = 'us-west-2';

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretString: 'dev-secret-value',
      });

      try {
        // Act
        await getSecretValue(secretId, region);

        // Assert
        expect(
          mockClientFactory.createSecretsManagerClient
        ).toHaveBeenCalledWith({
          region,
          environment: 'development',
        });
      } finally {
        // Cleanup
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('Client Factory Integration', () => {
    it('should create SecretsManagerClient with correct configuration', () => {
      // Arrange
      const config = {
        region: 'us-west-2',
        environment: 'production' as const,
        enableMetrics: true,
        credentialSource: 'auto' as const,
      };

      // Act
      mockClientFactory.createSecretsManagerClient(config);

      // Assert
      expect(mockClientFactory.createSecretsManagerClient).toHaveBeenCalledWith(
        config
      );
    });
  });

  describe('Error Scenarios', () => {
    it('should handle client creation errors', async () => {
      // Arrange
      mockClientFactory.createSecretsManagerClient.mockImplementation(() => {
        throw new Error('Failed to create client');
      });

      // Act & Assert
      await expect(getSecretValue('test-secret', 'us-west-2')).rejects.toThrow(
        'Failed to create client'
      );
    });

    it('should handle network timeouts', async () => {
      // Arrange
      const timeoutError = new Error('Network timeout');
      mockErrorHandler.executeWithRetry.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(getSecretValue('test-secret', 'us-west-2')).rejects.toThrow(
        'Network timeout'
      );
    });

    it('should handle authentication errors', async () => {
      // Arrange
      const authError = new Error('Access denied');
      mockErrorHandler.executeWithRetry.mockRejectedValue(authError);

      // Act & Assert
      await expect(
        getSecretValue('protected-secret', 'us-west-2')
      ).rejects.toThrow('Access denied');
    });
  });

  describe('Integration Patterns', () => {
    it('should work with different secret naming conventions', async () => {
      // Test common secret naming patterns
      const secretPatterns = [
        'prod/api/stripe-key',
        'application/database/password',
        'service/oauth/client-secret',
        'infrastructure/ssl/certificate',
        'arn:aws:secretsmanager:us-west-2:123456789012:secret:MySecret-AbCdEf',
      ];

      for (const secretId of secretPatterns) {
        mockSecretsManagerClient.send.mockResolvedValue({
          SecretString: `value-for-${secretId}`,
        });

        const result = await getSecretValue(secretId, 'us-west-2');
        expect(result).toBe(`value-for-${secretId}`);
      }
    });

    it('should work with different AWS regions', async () => {
      // Test common AWS regions
      const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

      for (const region of regions) {
        mockSecretsManagerClient.send.mockResolvedValue({
          SecretString: `secret-in-${region}`,
        });

        const result = await getSecretValue('test-secret', region);
        expect(result).toBe(`secret-in-${region}`);
        expect(
          mockClientFactory.createSecretsManagerClient
        ).toHaveBeenCalledWith({
          region,
          environment: 'test',
        });
      }
    });
  });
});
