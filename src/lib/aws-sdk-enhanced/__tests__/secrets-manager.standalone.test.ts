/**
 * Standalone AWS Secrets Manager Integration Tests
 *
 * This test file is designed to run independently of the global test setup
 * to avoid module mocking conflicts.
 */

import type {
  _SecretsManagerClient,
  GetSecretValueCommand,

describe('AWS Secrets Manager Integration - Standalone', () => {
  let mockSecretsManagerClient: any;
  let mockClientFactory: any;
  let mockErrorHandler: any;
  let getSecretValue: any;

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create fresh mock objects
    mockSecretsManagerClient = {
      send: vi.fn(),
      destroy: vi.fn(),
    };

    mockClientFactory = {
      createSecretsManagerClient: vi.fn(() => mockSecretsManagerClient),
    };

    mockErrorHandler = {
      executeWithRetry: vi.fn(operation => operation()),
    };

    // Mock the AWS SDK
    vi.doMock('@aws-sdk/client-secrets-manager', () => ({
      SecretsManagerClient: vi.fn(),
      GetSecretValueCommand: vi.fn(),
    }));

    // Mock our factory and error handler
    vi.doMock('../client-factory', () => ({
      EnhancedAWSClientFactory: mockClientFactory,
    }));

    vi.doMock('../error-handling', () => ({
      EnhancedAWSErrorHandler: mockErrorHandler,
    }));

    // Import the module after mocking
    const module = await import('../secrets-manager');
    getSecretValue = module.getSecretValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
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
          environment: process.env.NODE_ENV || 'development',
        }
      );
      expect(mockSecretsManagerClient.send).toHaveBeenCalled();
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
      const binarySecret = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);

      mockSecretsManagerClient.send.mockResolvedValue({
        SecretBinary: binarySecret,
        VersionId: 'v1',
        VersionStages: ['AWSCURRENT'],
        // No SecretString property
      });

      // Act
      const result = await getSecretValue(secretId, region);

      // Assert
      expect(result).toBeUndefined(); // Since SecretString is undefined
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

    it('should work with different AWS regions', async () => {
      // Test common AWS regions
      const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

      for (const region of regions) {
        // Reset mocks for each iteration
        vi.clearAllMocks();
        mockClientFactory.createSecretsManagerClient.mockReturnValue(
          mockSecretsManagerClient
        );
        mockErrorHandler.executeWithRetry.mockImplementation(operation =>
          operation()
        );

        mockSecretsManagerClient.send.mockResolvedValue({
          SecretString: `secret-in-${region}`,
        });

        const result = await getSecretValue('test-secret', region);

        expect(result).toBe(`secret-in-${region}`);
        expect(
          mockClientFactory.createSecretsManagerClient
        ).toHaveBeenCalledWith({
          region,
          environment: process.env.NODE_ENV || 'development',
        });
      }
    });

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
        // Reset mocks for each iteration
        vi.clearAllMocks();
        mockClientFactory.createSecretsManagerClient.mockReturnValue(
          mockSecretsManagerClient
        );
        mockErrorHandler.executeWithRetry.mockImplementation(operation =>
          operation()
        );

        mockSecretsManagerClient.send.mockResolvedValue({
          SecretString: `value-for-${secretId}`,
        });

        const result = await getSecretValue(secretId, 'us-west-2');
        expect(result).toBe(`value-for-${secretId}`);
      }
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

  describe('Environment Configuration', () => {
    it('should use production environment when NODE_ENV is production', async () => {
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
});
