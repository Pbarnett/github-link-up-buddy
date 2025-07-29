/**
 * AWS CLI Compatibility Module
 *
 * This module provides utilities to ensure compatibility with AWS CLI
 * standards and best practices for KMS operations.
 */

export {
  AWSCLIParameterValidator,
  type __ValidationResult,
  type KeyId_ValidationResult,
} from './parameter-validator';

// Re-export for convenience
export { AWSCLIParameterValidator as ParameterValidator } from './parameter-validator';
