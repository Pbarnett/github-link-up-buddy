#!/usr/bin/env tsx
import * as React from 'react';
/**
 * Demo script showing AWS CLI Parameter Validator usage
 * Run with: tsx src/lib/aws-cli-compatibility/demo.ts
 */

import { AWSCLIParameterValidator } from './parameter-validator';
console.log('🔐 AWS CLI Parameter Validator Demo\n');

// Demo 1: Key ID Validation
console.log('📋 1. Key ID Validation Examples:');
console.log('─'.repeat(50));

const keyIds = [
  'alias/my-encryption-key',
  '12345678-1234-1234-1234-123456789012',
  'arn:aws:kms:us-west-2:123456789012:key/12345678-1234-1234-1234-123456789012',
  'invalid-key-id',
  '',
];

keyIds.forEach(keyId => {
  const result = AWSCLIParameterValidator.validateKeyId(keyId);
  console.log(`Key ID: "${keyId}"`);
  console.log(`  ✓ Valid: ${result.valid}`);
  if (result.valid) {
    console.log(`  ✓ Type: ${result.type}`);
    if (result.region) console.log(`  ✓ Region: ${result.region}`);
    if (result.accountId) console.log(`  ✓ Account: ${result.accountId}`);
  } else {
    console.log(`  ✗ Error: ${result.error}`);
  }
  console.log('');
});

// Demo 2: Encryption Context Validation
console.log('📋 2. Encryption Context Validation:');
console.log('─'.repeat(50));

const contexts = [
  { department: 'engineering', project: 'web-app', environment: 'production' },
  { café: 'résumé', naïve: 'Zürich' }, // Unicode test
  { password: 'secret123' }, // Sensitive data - should fail
  { 'key\x01': 'value' }, // Control character - should fail
  Object.fromEntries(
    Array.from({ length: 65 }, (_, i) => [`key${i}`, `value${i}`])
  ), // Too many pairs
];

contexts.forEach((context, index) => {
  const result = AWSCLIParameterValidator.validateEncryptionContext(context);
  console.log(
    `Context ${index + 1}: ${JSON.stringify(context).substring(0, 60)}${Object.keys(context).length > 3 ? '...' : ''}`
  );
  console.log(`  ${result.valid ? '✓' : '✗'} Valid: ${result.valid}`);
  if (!result.valid) {
    console.log(`  ✗ Error: ${result.error}`);
  }
  console.log('');
});

// Demo 3: Full Encrypt Parameters Validation
console.log('📋 3. Complete Encrypt Parameters Validation:');
console.log('─'.repeat(50));

const encryptParams = [
  {
    keyId: 'alias/my-key',
    plaintext: 'Hello, World!',
    encryptionContext: { department: 'engineering' },
    encryptionAlgorithm: 'SYMMETRIC_DEFAULT',
  },
  {
    keyId: 'invalid-key',
    plaintext: 'Hello, World!',
  },
  {
    keyId: 'alias/my-key',
    plaintext: 'x'.repeat(5000), // Too large
  },
];

encryptParams.forEach((params, index) => {
  const result = AWSCLIParameterValidator.validateEncryptParams(params);
  console.log(`Encrypt Params ${index + 1}:`);
  console.log(`  Key ID: ${params.keyId}`);
  console.log(
    `  Plaintext: ${params.plaintext.length > 20 ? params.plaintext.substring(0, 20) + '...' : params.plaintext}`
  );
  console.log(`  ${result.valid ? '✓' : '✗'} Valid: ${result.valid}`);
  if (!result.valid) {
    console.log(`  ✗ Error: ${result.error}`);
  }
  console.log('');
});

// Demo 4: Algorithm Validation
console.log('📋 4. Algorithm Validation:');
console.log('─'.repeat(50));

const algorithms = [
  'SYMMETRIC_DEFAULT',
  'RSAES_OAEP_SHA_256',
  'INVALID_ALGORITHM',
];

algorithms.forEach(algorithm => {
  const result =
    AWSCLIParameterValidator.validateEncryptionAlgorithm(algorithm);
  console.log(`Algorithm: "${algorithm}"`);
  console.log(`  ${result.valid ? '✓' : '✗'} Valid: ${result.valid}`);
  if (!result.valid) {
    console.log(`  ✗ Error: ${result.error}`);
  }
  console.log('');
});

// Demo 5: Performance Test
console.log('📋 5. Performance Test:');
console.log('─'.repeat(50));

const iterations = 10000;
const testKeyId = 'alias/performance-test-key';

console.log(`Running ${iterations} key ID validations...`);
const startTime = performance.now();

for (let i = 0; i < iterations; i++) {
  AWSCLIParameterValidator.validateKeyId(testKeyId);
}

const endTime = performance.now();
const duration = endTime - startTime;
const validationsPerSecond = Math.round((iterations / duration) * 1000);

console.log(
  `✓ Completed ${iterations} validations in ${duration.toFixed(2)}ms`
);
console.log(
  `✓ Performance: ~${validationsPerSecond.toLocaleString()} validations/second`
);

console.log('\n🎉 Demo completed successfully!');
