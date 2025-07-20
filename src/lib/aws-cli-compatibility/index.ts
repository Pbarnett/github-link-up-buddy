/**
 * AWS CLI Compatibility Module
 * 
 * This module provides utilities to ensure compatibility with AWS CLI
 * standards and best practices for KMS operations.
 */

export {
  AWSCLIParameterValidator,
  type ValidationResult,
  type KeyIdValidationResult
} from './parameter-validator';

// Re-export for convenience
export { AWSCLIParameterValidator as ParameterValidator } from './parameter-validator';
