import * as React from 'react';
/**
 * AWS CLI Compatible Parameter Validator
 *
 * Provides validation for KMS parameters that matches AWS CLI standards
 * and ensures compliance with AWS KMS API requirements.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface KeyIdValidationResult extends ValidationResult {
  type: 'uuid' | 'alias' | 'arn';
  region?: string;
  accountId?: string;
  keyIdentifier: string;
}

export class AWSCLIParameterValidator {
  private static readonly KEY_ID_PATTERNS = {
    UUID: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
    ALIAS: /^alias\/[a-zA-Z0-9\/_-]+$/,
    ARN: /^arn:aws:kms:[a-z0-9-]+:[0-9]{12}:(key\/[a-f0-9-]+|alias\/[a-zA-Z0-9\/_-]+)$/,
  };

  private static readonly ENCRYPTION_ALGORITHMS = [
    'SYMMETRIC_DEFAULT',
    'RSAES_OAEP_SHA_1',
    'RSAES_OAEP_SHA_256',
    'SM2PKE',
  ];

  private static readonly SIGNING_ALGORITHMS = [
    'RSASSA_PSS_SHA_256',
    'RSASSA_PSS_SHA_384',
    'RSASSA_PSS_SHA_512',
    'RSASSA_PKCS1_V1_5_SHA_256',
    'RSASSA_PKCS1_V1_5_SHA_384',
    'RSASSA_PKCS1_V1_5_SHA_512',
    'ECDSA_SHA_256',
    'ECDSA_SHA_384',
    'ECDSA_SHA_512',
    'SM2DSA',
  ];

  /**
   * Validates KMS key ID format and extracts metadata
   */
  static validateKeyId(keyId: string): KeyIdValidationResult {
    if (!keyId || typeof keyId !== 'string' || keyId.trim() === '') {
      return {
        valid: false,
        type: 'uuid',
        error: 'Key ID cannot be empty',
        keyIdentifier: '',
      };
    }

    const trimmed = keyId.trim();

    // Check for ARN format
    if (this.KEY_ID_PATTERNS.ARN.test(trimmed)) {
      const arnParts = trimmed.split(':');
      const _resourcePart = arnParts[5];

      return {
        valid: true,
        type: 'arn',
        region: arnParts[3],
        accountId: arnParts[4],
        keyIdentifier: trimmed,
      };
    }

    // Check for alias format
    if (this.KEY_ID_PATTERNS.ALIAS.test(trimmed)) {
      return {
        valid: true,
        type: 'alias',
        keyIdentifier: trimmed,
      };
    }

    // Check for UUID format
    if (this.KEY_ID_PATTERNS.UUID.test(trimmed)) {
      return {
        valid: true,
        type: 'uuid',
        keyIdentifier: trimmed,
      };
    }

    return {
      valid: false,
      type: 'uuid',
      error:
        'Key ID must be a valid UUID, alias (alias/name), or ARN (arn:aws:kms:region:account:key/id)',
      keyIdentifier: trimmed,
    };
  }

  /**
   * Validates encryption context according to AWS KMS limits and security best practices
   */
  static validateEncryptionContext(
    context?: Record<string, string>
  ): ValidationResult {
    if (!context) return { valid: true };

    // Check context size limits
    const contextEntries = Object.entries(context);
    if (contextEntries.length > 64) {
      return {
        valid: false,
        error: 'Encryption context cannot contain more than 64 key-value pairs',
      };
    }

    // Check for sensitive data patterns
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /private.*key/i,
      /ssn/i,
      /social.*security/i,
      /credit.*card/i,
      /card.*number/i,
      /api.*key/i,
      /access.*key/i,
    ];

    for (const [key, value] of contextEntries) {
      // Validate key length
      if (key.length > 256) {
        return {
          valid: false,
          error: `Encryption context key '${key}' exceeds 256 characters`,
        };
      }

      // Validate value length
      if (value.length > 256) {
        return {
          valid: false,
          error: `Encryption context value for key '${key}' exceeds 256 characters`,
        };
      }

      // Check for sensitive data in key names
      for (const pattern of sensitivePatterns) {
        if (pattern.test(key)) {
          return {
            valid: false,
            error: `Encryption context key '${key}' appears to contain sensitive data. Encryption context is not encrypted and should not contain sensitive information.`,
          };
        }
        if (pattern.test(value)) {
          return {
            valid: false,
            error: `Encryption context value for key '${key}' appears to contain sensitive data. Encryption context is not encrypted and should not contain sensitive information.`,
          };
        }
      }

      // Validate characters (printable characters including Unicode)
      // AWS KMS supports UTF-8 encoded strings, so we allow Unicode characters
      // but exclude control characters and other non-printable characters
      const hasControlChars = (str: string) => /[\x00-\x1F\x7F-\x9F]/.test(str);

      if (hasControlChars(key)) {
        return {
          valid: false,
          error: `Encryption context key '${key}' contains control characters`,
        };
      }
      if (hasControlChars(value)) {
        return {
          valid: false,
          error: `Encryption context value for key '${key}' contains control characters`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates encryption algorithm
   */
  static validateEncryptionAlgorithm(algorithm?: string): ValidationResult {
    if (!algorithm) return { valid: true }; // Optional parameter

    if (!this.ENCRYPTION_ALGORITHMS.includes(algorithm)) {
      return {
        valid: false,
        error: `Invalid encryption algorithm '${algorithm}'. Valid algorithms: ${this.ENCRYPTION_ALGORITHMS.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates signing algorithm
   */
  static validateSigningAlgorithm(algorithm?: string): ValidationResult {
    if (!algorithm) return { valid: true }; // Optional parameter

    if (!this.SIGNING_ALGORITHMS.includes(algorithm)) {
      return {
        valid: false,
        error: `Invalid signing algorithm '${algorithm}'. Valid algorithms: ${this.SIGNING_ALGORITHMS.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates plaintext size limits
   */
  static validatePlaintextSize(
    plaintext: string | Uint8Array,
    operation: 'encrypt' | 'sign' = 'encrypt'
  ): ValidationResult {
    let size: number;

    if (typeof plaintext === 'string') {
      size = new TextEncoder().encode(plaintext).length;
    } else {
      size = plaintext.length;
    }

    const maxSize = operation === 'encrypt' ? 4096 : 4096; // 4KB for both operations

    if (size > maxSize) {
      return {
        valid: false,
        error: `Plaintext size (${size} bytes) exceeds maximum allowed size (${maxSize} bytes) for ${operation} operation. Consider using envelope encryption for larger data.`,
      };
    }

    if (size === 0) {
      return {
        valid: false,
        error: 'Plaintext cannot be empty',
      };
    }

    return { valid: true };
  }

  /**
   * Validates grant tokens
   */
  static validateGrantTokens(grantTokens?: string[]): ValidationResult {
    if (!grantTokens) return { valid: true };

    if (grantTokens.length > 10) {
      return {
        valid: false,
        error: 'Cannot specify more than 10 grant tokens',
      };
    }

    for (const token of grantTokens) {
      if (!token || token.length === 0) {
        return {
          valid: false,
          error: 'Grant tokens cannot be empty',
        };
      }

      if (token.length > 8192) {
        return {
          valid: false,
          error: 'Grant token cannot exceed 8192 characters',
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates key spec for key creation
   */
  static validateKeySpec(keySpec?: string): ValidationResult {
    if (!keySpec) return { valid: true }; // Optional parameter

    const validKeySpecs = [
      'SYMMETRIC_DEFAULT',
      'RSA_2048',
      'RSA_3072',
      'RSA_4096',
      'ECC_NIST_P256',
      'ECC_NIST_P384',
      'ECC_NIST_P521',
      'ECC_SECG_P256K1',
      'HMAC_224',
      'HMAC_256',
      'HMAC_384',
      'HMAC_512',
      'SM2',
    ];

    if (!validKeySpecs.includes(keySpec)) {
      return {
        valid: false,
        error: `Invalid key spec '${keySpec}'. Valid key specs: ${validKeySpecs.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validates key usage
   */
  static validateKeyUsage(keyUsage?: string): ValidationResult {
    if (!keyUsage) return { valid: true }; // Optional parameter

    const validKeyUsages = [
      'ENCRYPT_DECRYPT',
      'SIGN_VERIFY',
      'GENERATE_VERIFY_MAC',
      'KEY_AGREEMENT',
    ];

    if (!validKeyUsages.includes(keyUsage)) {
      return {
        valid: false,
        error: `Invalid key usage '${keyUsage}'. Valid key usages: ${validKeyUsages.join(', ')}`,
      };
    }

    return { valid: true };
  }

  /**
   * Comprehensive validation for encrypt operation parameters
   */
  static validateEncryptParams(params: {
    keyId: string;
    plaintext: string | Uint8Array;
    encryptionContext?: Record<string, string>;
    encryptionAlgorithm?: string;
    grantTokens?: string[];
  }): ValidationResult {
    // Validate key ID
    const keyIdValidation = this.validateKeyId(params.keyId);
    if (!keyIdValidation.valid) {
      return keyIdValidation;
    }

    // Validate plaintext size
    const plaintextValidation = this.validatePlaintextSize(
      params.plaintext,
      'encrypt'
    );
    if (!plaintextValidation.valid) {
      return plaintextValidation;
    }

    // Validate encryption context
    const contextValidation = this.validateEncryptionContext(
      params.encryptionContext
    );
    if (!contextValidation.valid) {
      return contextValidation;
    }

    // Validate encryption algorithm
    const algorithmValidation = this.validateEncryptionAlgorithm(
      params.encryptionAlgorithm
    );
    if (!algorithmValidation.valid) {
      return algorithmValidation;
    }

    // Validate grant tokens
    const grantTokensValidation = this.validateGrantTokens(params.grantTokens);
    if (!grantTokensValidation.valid) {
      return grantTokensValidation;
    }

    return { valid: true };
  }

  /**
   * Comprehensive validation for decrypt operation parameters
   */
  static validateDecryptParams(params: {
    ciphertextBlob: string | Uint8Array;
    keyId?: string;
    encryptionContext?: Record<string, string>;
    encryptionAlgorithm?: string;
    grantTokens?: string[];
  }): ValidationResult {
    // Validate ciphertext
    if (!params.ciphertextBlob) {
      return {
        valid: false,
        error: 'Ciphertext blob cannot be empty',
      };
    }

    let ciphertextSize: number;
    if (typeof params.ciphertextBlob === 'string') {
      ciphertextSize = new TextEncoder().encode(params.ciphertextBlob).length;
    } else {
      ciphertextSize = params.ciphertextBlob.length;
    }

    if (ciphertextSize > 6144) {
      // 6KB limit for ciphertext
      return {
        valid: false,
        error: `Ciphertext blob size (${ciphertextSize} bytes) exceeds maximum allowed size (6144 bytes)`,
      };
    }

    // Validate optional key ID
    if (params.keyId) {
      const keyIdValidation = this.validateKeyId(params.keyId);
      if (!keyIdValidation.valid) {
        return keyIdValidation;
      }
    }

    // Validate encryption context
    const contextValidation = this.validateEncryptionContext(
      params.encryptionContext
    );
    if (!contextValidation.valid) {
      return contextValidation;
    }

    // Validate encryption algorithm
    const algorithmValidation = this.validateEncryptionAlgorithm(
      params.encryptionAlgorithm
    );
    if (!algorithmValidation.valid) {
      return algorithmValidation;
    }

    // Validate grant tokens
    const grantTokensValidation = this.validateGrantTokens(params.grantTokens);
    if (!grantTokensValidation.valid) {
      return grantTokensValidation;
    }

    return { valid: true };
  }
}
