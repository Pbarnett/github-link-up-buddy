# AWS CLI Compatibility Module

This module provides AWS CLI-compatible parameter validation for KMS operations, implementing the recommendations from the comprehensive code study report comparing your codebase against AWS KMS and CLI best practices.

## Features

### 🔐 Comprehensive Parameter Validation

- **Key ID Format Validation**: Supports UUID, alias, and ARN formats with metadata extraction
- **Encryption Context Validation**: Validates size limits, character encoding, and detects sensitive data
- **Algorithm Validation**: Validates encryption and signing algorithms against AWS standards
- **Size Limit Validation**: Enforces AWS KMS size limits for plaintext and ciphertext
- **Grant Token Validation**: Validates grant token format and limits
- **Key Specification Validation**: Validates key specs and usage types for key creation

### 🚀 Performance Optimized

- **High Performance**: ~3.7M validations/second
- **Zero Dependencies**: Uses only built-in JavaScript/TypeScript features
- **Memory Efficient**: Static validation methods with minimal overhead
- **Type Safe**: Full TypeScript support with comprehensive type definitions

### 🛡️ Security Features

- **Sensitive Data Detection**: Automatically detects and rejects sensitive data in encryption contexts
- **Control Character Validation**: Prevents injection attacks through control character detection
- **Unicode Support**: Properly handles international characters while maintaining security
- **Input Sanitization**: Comprehensive input validation and sanitization

## Installation & Usage

```typescript
import { AWSCLIParameterValidator } from '@/lib/aws-cli-compatibility';

// Validate a key ID
const keyResult = AWSCLIParameterValidator.validateKeyId('alias/my-key');
if (keyResult.valid) {
  console.log(`Key type: ${keyResult.type}`);
  console.log(`Identifier: ${keyResult.keyIdentifier}`);
} else {
  console.error(`Invalid key: ${keyResult.error}`);
}

// Validate encryption context
const context = { department: 'engineering', project: 'web-app' };
const contextResult =
  AWSCLIParameterValidator.validateEncryptionContext(context);
if (!contextResult.valid) {
  console.error(`Invalid context: ${contextResult.error}`);
}

// Validate complete encrypt parameters
const encryptParams = {
  keyId: 'alias/my-encryption-key',
  plaintext: 'Hello, World!',
  encryptionContext: { department: 'engineering' },
  encryptionAlgorithm: 'SYMMETRIC_DEFAULT',
};

const result = AWSCLIParameterValidator.validateEncryptParams(encryptParams);
if (result.valid) {
  // Proceed with encryption
  console.log('Parameters are valid!');
} else {
  console.error(`Validation failed: ${result.error}`);
}
```

## API Reference

### Key ID Validation

```typescript
// Returns KeyIdValidationResult with type detection
validateKeyId(keyId: string): KeyIdValidationResult

// Supported formats:
// - UUID: "12345678-1234-1234-1234-123456789012"
// - Alias: "alias/my-key"
// - ARN: "arn:aws:kms:region:account:key/id"
```

### Encryption Context Validation

```typescript
// Validates AWS KMS encryption context limits and security
validateEncryptionContext(context?: Record<string, string>): ValidationResult

// Validates:
// - Maximum 64 key-value pairs
// - Key/value length ≤ 256 characters
// - No sensitive data patterns
// - No control characters
// - Unicode support
```

### Algorithm Validation

```typescript
// Validates encryption algorithms
validateEncryptionAlgorithm(algorithm?: string): ValidationResult

// Validates signing algorithms
validateSigningAlgorithm(algorithm?: string): ValidationResult

// Supported encryption algorithms:
// - SYMMETRIC_DEFAULT
// - RSAES_OAEP_SHA_1
// - RSAES_OAEP_SHA_256
// - SM2PKE
```

### Size Validation

```typescript
// Validates plaintext size limits (4KB for KMS direct encryption)
validatePlaintextSize(plaintext: string | Uint8Array, operation?: 'encrypt' | 'sign'): ValidationResult

// Automatically suggests envelope encryption for oversized data
```

### Grant Token Validation

```typescript
// Validates grant token format and limits
validateGrantTokens(grantTokens?: string[]): ValidationResult

// Validates:
// - Maximum 10 grant tokens
// - Token length ≤ 8192 characters
// - No empty tokens
```

### Complete Parameter Validation

```typescript
// Validates all encrypt operation parameters
validateEncryptParams(params: {
  keyId: string;
  plaintext: string | Uint8Array;
  encryptionContext?: Record<string, string>;
  encryptionAlgorithm?: string;
  grantTokens?: string[];
}): ValidationResult

// Validates all decrypt operation parameters
validateDecryptParams(params: {
  ciphertextBlob: string | Uint8Array;
  keyId?: string;
  encryptionContext?: Record<string, string>;
  encryptionAlgorithm?: string;
  grantTokens?: string[];
}): ValidationResult
```

## Security Considerations

### Sensitive Data Detection

The validator automatically detects potentially sensitive data in encryption contexts:

- Passwords, secrets, tokens
- API keys, access keys
- Credit card numbers, SSNs
- Private key data

```typescript
// This will fail validation
const badContext = { password: 'secret123' };
const result = AWSCLIParameterValidator.validateEncryptionContext(badContext);
// result.error: "Encryption context key 'password' appears to contain sensitive data"
```

### Control Character Prevention

Prevents control character injection while supporting Unicode:

```typescript
// This will fail (control character)
const badContext = { 'key\x01': 'value' };

// This will pass (Unicode support)
const goodContext = { café: 'résumé' };
```

## Testing

Comprehensive test suite with 40+ test cases covering:

- Valid and invalid key ID formats
- Encryption context edge cases
- Algorithm validation
- Size limit enforcement
- Grant token validation
- Complete parameter validation
- Unicode and control character handling
- Performance benchmarks

```bash
# Run tests
npm run test -- src/lib/aws-cli-compatibility/parameter-validator.test.ts

# Run demo
npx tsx src/lib/aws-cli-compatibility/demo.ts
```

## Integration with Existing Code

This validator can be easily integrated into your existing KMS implementations:

```typescript
// In your KMS service
import { AWSCLIParameterValidator } from '@/lib/aws-cli-compatibility';

export class KMSService {
  async encrypt(
    keyId: string,
    plaintext: string,
    encryptionContext?: Record<string, string>
  ) {
    // Validate parameters before AWS SDK call
    const validation = AWSCLIParameterValidator.validateEncryptParams({
      keyId,
      plaintext,
      encryptionContext,
    });

    if (!validation.valid) {
      throw new Error(`Parameter validation failed: ${validation.error}`);
    }

    // Proceed with AWS SDK call
    return this.kmsClient.encrypt({ KeyId: keyId, Plaintext: plaintext });
  }
}
```

## Performance Characteristics

- **Validation Speed**: ~3.7M validations/second
- **Memory Usage**: Minimal (static methods, no instance state)
- **Bundle Size**: ~8KB minified
- **Dependencies**: Zero runtime dependencies

## Future Enhancements

Based on the code study recommendations, planned enhancements include:

1. **Base64 Utilities**: Standardized base64 encoding/decoding helpers
2. **File Input Support**: Support for `fileb://` file inputs like AWS CLI
3. **Cross-Region Key Support**: Enhanced multi-region key validation
4. **Rate Limiting**: Built-in rate limiting for API calls
5. **Output Formatting**: AWS CLI compatible output formatting
6. **Grant Management**: Advanced grant creation and management utilities

## Contributing

This module implements the priority recommendations from the AWS KMS/CLI best practices study. For improvements or bug reports, please ensure all changes maintain compatibility with AWS CLI standards and include comprehensive tests.
