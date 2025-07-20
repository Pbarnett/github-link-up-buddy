import { describe, it, expect } from 'vitest';
import { AWSCLIParameterValidator, ValidationResult, KeyIdValidationResult } from './parameter-validator';

describe('AWSCLIParameterValidator', () => {
  describe('validateKeyId', () => {
    it('should validate UUID format key IDs', () => {
      const validUUID = '12345678-1234-1234-1234-123456789012';
      const result = AWSCLIParameterValidator.validateKeyId(validUUID);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('uuid');
      expect(result.keyIdentifier).toBe(validUUID);
    });

    it('should validate alias format key IDs', () => {
      const validAlias = 'alias/my-key';
      const result = AWSCLIParameterValidator.validateKeyId(validAlias);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('alias');
      expect(result.keyIdentifier).toBe(validAlias);
    });

    it('should validate ARN format key IDs and extract metadata', () => {
      const validARN = 'arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012';
      const result = AWSCLIParameterValidator.validateKeyId(validARN);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('arn');
      expect(result.region).toBe('us-west-2');
      expect(result.accountId).toBe('123456789012');
      expect(result.keyIdentifier).toBe(validARN);
    });

    it('should validate alias ARN format', () => {
      const aliasARN = 'arn:aws:kms:us-east-1:123456789012:alias/my-key';
      const result = AWSCLIParameterValidator.validateKeyId(aliasARN);
      
      expect(result.valid).toBe(true);
      expect(result.type).toBe('arn');
      expect(result.region).toBe('us-east-1');
      expect(result.accountId).toBe('123456789012');
    });

    it('should reject empty or invalid key IDs', () => {
      const invalidCases = ['', '   ', 'invalid-key', '123', 'alias/', 'arn:aws:kms'];
      
      invalidCases.forEach(keyId => {
        const result = AWSCLIParameterValidator.validateKeyId(keyId);
        expect(result.valid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should handle null and undefined key IDs', () => {
      const result1 = AWSCLIParameterValidator.validateKeyId(null as any);
      const result2 = AWSCLIParameterValidator.validateKeyId(undefined as any);
      
      expect(result1.valid).toBe(false);
      expect(result2.valid).toBe(false);
    });
  });

  describe('validateEncryptionContext', () => {
    it('should accept valid encryption contexts', () => {
      const validContext = {
        department: 'finance',
        project: 'budget-2024',
        environment: 'production'
      };
      
      const result = AWSCLIParameterValidator.validateEncryptionContext(validContext);
      expect(result.valid).toBe(true);
    });

    it('should accept empty or undefined contexts', () => {
      const result1 = AWSCLIParameterValidator.validateEncryptionContext(undefined);
      const result2 = AWSCLIParameterValidator.validateEncryptionContext({});
      
      expect(result1.valid).toBe(true);
      expect(result2.valid).toBe(true);
    });

    it('should reject contexts with too many key-value pairs', () => {
      const largeContext: Record<string, string> = {};
      for (let i = 0; i < 65; i++) {
        largeContext[`key${i}`] = `value${i}`;
      }
      
      const result = AWSCLIParameterValidator.validateEncryptionContext(largeContext);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('64 key-value pairs');
    });

    it('should reject keys or values exceeding 256 characters', () => {
      const longKey = 'a'.repeat(257);
      const longValue = 'b'.repeat(257);
      
      const result1 = AWSCLIParameterValidator.validateEncryptionContext({ [longKey]: 'value' });
      const result2 = AWSCLIParameterValidator.validateEncryptionContext({ key: longValue });
      
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('exceeds 256 characters');
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('exceeds 256 characters');
    });

    it('should detect sensitive data in context keys and values', () => {
      const sensitiveCases = [
        { password: 'secret123' },
        { key: 'my-api-key-123' },
        { username: 'credit-card-number' },
        { data: 'social-security-number' },
        { field: 'private-key-data' }
      ];
      
      sensitiveCases.forEach(context => {
        const result = AWSCLIParameterValidator.validateEncryptionContext(context);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('sensitive data');
      });
    });

    it('should reject control characters', () => {
      const result1 = AWSCLIParameterValidator.validateEncryptionContext({ 'key\x01': 'value' });
      const result2 = AWSCLIParameterValidator.validateEncryptionContext({ key: 'value\x7F' });
      
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('control characters');
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('control characters');
    });
  });

  describe('validateEncryptionAlgorithm', () => {
    it('should accept valid encryption algorithms', () => {
      const validAlgorithms = [
        'SYMMETRIC_DEFAULT',
        'RSAES_OAEP_SHA_1',
        'RSAES_OAEP_SHA_256',
        'SM2PKE'
      ];
      
      validAlgorithms.forEach(algorithm => {
        const result = AWSCLIParameterValidator.validateEncryptionAlgorithm(algorithm);
        expect(result.valid).toBe(true);
      });
    });

    it('should accept undefined algorithm', () => {
      const result = AWSCLIParameterValidator.validateEncryptionAlgorithm(undefined);
      expect(result.valid).toBe(true);
    });

    it('should reject invalid algorithms', () => {
      const result = AWSCLIParameterValidator.validateEncryptionAlgorithm('INVALID_ALGORITHM');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid encryption algorithm');
    });
  });

  describe('validateSigningAlgorithm', () => {
    it('should accept valid signing algorithms', () => {
      const validAlgorithms = [
        'RSASSA_PSS_SHA_256',
        'RSASSA_PKCS1_V1_5_SHA_256',
        'ECDSA_SHA_256',
        'SM2DSA'
      ];
      
      validAlgorithms.forEach(algorithm => {
        const result = AWSCLIParameterValidator.validateSigningAlgorithm(algorithm);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid signing algorithms', () => {
      const result = AWSCLIParameterValidator.validateSigningAlgorithm('INVALID_SIGNING');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid signing algorithm');
    });
  });

  describe('validatePlaintextSize', () => {
    it('should accept valid plaintext sizes', () => {
      const smallText = 'Hello, World!';
      const result1 = AWSCLIParameterValidator.validatePlaintextSize(smallText);
      expect(result1.valid).toBe(true);

      const binaryData = new Uint8Array(1000);
      const result2 = AWSCLIParameterValidator.validatePlaintextSize(binaryData);
      expect(result2.valid).toBe(true);
    });

    it('should reject empty plaintext', () => {
      const result1 = AWSCLIParameterValidator.validatePlaintextSize('');
      const result2 = AWSCLIParameterValidator.validatePlaintextSize(new Uint8Array(0));
      
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('cannot be empty');
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('cannot be empty');
    });

    it('should reject oversized plaintext', () => {
      const largeText = 'x'.repeat(5000);
      const result1 = AWSCLIParameterValidator.validatePlaintextSize(largeText);
      expect(result1.valid).toBe(false);
      expect(result1.error).toContain('exceeds maximum allowed size');

      const largeBinary = new Uint8Array(5000);
      const result2 = AWSCLIParameterValidator.validatePlaintextSize(largeBinary);
      expect(result2.valid).toBe(false);
      expect(result2.error).toContain('envelope encryption');
    });
  });

  describe('validateGrantTokens', () => {
    it('should accept valid grant tokens', () => {
      const validTokens = ['token1', 'token2', 'token3'];
      const result = AWSCLIParameterValidator.validateGrantTokens(validTokens);
      expect(result.valid).toBe(true);
    });

    it('should accept undefined grant tokens', () => {
      const result = AWSCLIParameterValidator.validateGrantTokens(undefined);
      expect(result.valid).toBe(true);
    });

    it('should reject too many grant tokens', () => {
      const tooManyTokens = Array.from({ length: 11 }, (_, i) => `token${i}`);
      const result = AWSCLIParameterValidator.validateGrantTokens(tooManyTokens);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('more than 10 grant tokens');
    });

    it('should reject empty grant tokens', () => {
      const tokensWithEmpty = ['valid-token', '', 'another-valid-token'];
      const result = AWSCLIParameterValidator.validateGrantTokens(tokensWithEmpty);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should reject oversized grant tokens', () => {
      const oversizedToken = 'x'.repeat(8193);
      const result = AWSCLIParameterValidator.validateGrantTokens([oversizedToken]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot exceed 8192 characters');
    });
  });

  describe('validateKeySpec', () => {
    it('should accept valid key specs', () => {
      const validKeySpecs = [
        'SYMMETRIC_DEFAULT',
        'RSA_2048',
        'RSA_3072',
        'RSA_4096',
        'ECC_NIST_P256',
        'HMAC_256',
        'SM2'
      ];
      
      validKeySpecs.forEach(keySpec => {
        const result = AWSCLIParameterValidator.validateKeySpec(keySpec);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid key specs', () => {
      const result = AWSCLIParameterValidator.validateKeySpec('INVALID_KEY_SPEC');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid key spec');
    });
  });

  describe('validateKeyUsage', () => {
    it('should accept valid key usages', () => {
      const validUsages = [
        'ENCRYPT_DECRYPT',
        'SIGN_VERIFY',
        'GENERATE_VERIFY_MAC',
        'KEY_AGREEMENT'
      ];
      
      validUsages.forEach(usage => {
        const result = AWSCLIParameterValidator.validateKeyUsage(usage);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid key usage', () => {
      const result = AWSCLIParameterValidator.validateKeyUsage('INVALID_USAGE');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid key usage');
    });
  });

  describe('validateEncryptParams', () => {
    it('should accept valid encrypt parameters', () => {
      const validParams = {
        keyId: 'alias/my-key',
        plaintext: 'Hello, World!',
        encryptionContext: { department: 'engineering' },
        encryptionAlgorithm: 'SYMMETRIC_DEFAULT',
        grantTokens: ['token1']
      };
      
      const result = AWSCLIParameterValidator.validateEncryptParams(validParams);
      expect(result.valid).toBe(true);
    });

    it('should reject encrypt params with invalid key ID', () => {
      const invalidParams = {
        keyId: 'invalid-key',
        plaintext: 'Hello, World!'
      };
      
      const result = AWSCLIParameterValidator.validateEncryptParams(invalidParams);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Key ID must be a valid');
    });

    it('should reject encrypt params with oversized plaintext', () => {
      const invalidParams = {
        keyId: 'alias/my-key',
        plaintext: 'x'.repeat(5000)
      };
      
      const result = AWSCLIParameterValidator.validateEncryptParams(invalidParams);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });
  });

  describe('validateDecryptParams', () => {
    it('should accept valid decrypt parameters', () => {
      const validParams = {
        ciphertextBlob: 'AQICAHh...encrypted-data...',
        keyId: 'alias/my-key',
        encryptionContext: { department: 'engineering' }
      };
      
      const result = AWSCLIParameterValidator.validateDecryptParams(validParams);
      expect(result.valid).toBe(true);
    });

    it('should reject decrypt params with empty ciphertext', () => {
      const invalidParams = {
        ciphertextBlob: ''
      };
      
      const result = AWSCLIParameterValidator.validateDecryptParams(invalidParams);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should reject decrypt params with oversized ciphertext', () => {
      const largeCiphertext = 'x'.repeat(7000);
      const invalidParams = {
        ciphertextBlob: largeCiphertext
      };
      
      const result = AWSCLIParameterValidator.validateDecryptParams(invalidParams);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('should accept decrypt params without keyId (optional)', () => {
      const validParams = {
        ciphertextBlob: 'AQICAHh...encrypted-data...'
      };
      
      const result = AWSCLIParameterValidator.validateDecryptParams(validParams);
      expect(result.valid).toBe(true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle unicode characters in encryption context properly', () => {
      const unicodeContext = {
        'café': 'résumé',
        'naïve': 'Zürich'
      };
      
      const result = AWSCLIParameterValidator.validateEncryptionContext(unicodeContext);
      expect(result.valid).toBe(true);
    });

    it('should handle mixed case UUIDs', () => {
      const mixedCaseUUID = '12345678-1234-1234-1234-123456789aBc';
      const result = AWSCLIParameterValidator.validateKeyId(mixedCaseUUID);
      expect(result.valid).toBe(true);
      expect(result.type).toBe('uuid');
    });

    it('should trim whitespace from key IDs', () => {
      const keyWithSpaces = '  alias/my-key  ';
      const result = AWSCLIParameterValidator.validateKeyId(keyWithSpaces);
      expect(result.valid).toBe(true);
      expect(result.keyIdentifier).toBe('alias/my-key');
    });

    it('should handle binary data correctly in plaintext size validation', () => {
      const binaryData = new Uint8Array([0x00, 0xFF, 0x80, 0x7F]);
      const result = AWSCLIParameterValidator.validatePlaintextSize(binaryData);
      expect(result.valid).toBe(true);
    });
  });
});
