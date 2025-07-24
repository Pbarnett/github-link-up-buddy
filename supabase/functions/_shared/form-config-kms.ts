// supabase/functions/_shared/form-config-kms.ts
/**
 * Form Configuration Security and KMS Service
 * Provides security validation and key management for form configurations
 */

export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: Option[];
  placeholder?: string;
  description?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message?: string;
}

export interface Option {
  label: string;
  value: any;
}

export interface FormSection {
  title: string;
  fields: FormField[];
  conditions?: Condition[];
}

export interface Condition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'in' | 'notIn';
  value: any;
}

export interface FormConfiguration {
  name: string;
  version?: string;
  sections: FormSection[];
  metadata?: Record<string, any>;
  security?: SecurityConfig;
}

export interface SecurityConfig {
  encrypted?: boolean;
  allowedDomains?: string[];
  rateLimit?: {
    requests: number;
    window: string;
  };
}

export interface SecurityViolation {
  type: 'injection' | 'xss' | 'invalid_field' | 'validation_error' | 'security_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  field?: string;
  suggestion?: string;
}

export interface SecurityValidationResult {
  isSecure: boolean;
  violations: SecurityViolation[];
  securityScore: number;
  recommendations: string[];
}

/**
 * Form Configuration KMS Service
 */
export class FormConfigKMSService {
  private encryptionKey: string | null = null;

  constructor() {
    this.encryptionKey = Deno.env.get('FORM_CONFIG_ENCRYPTION_KEY') || null;
  }

  /**
   * Encrypt sensitive form configuration data
   */
  async encryptConfig(config: FormConfiguration): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    // Simple base64 encoding for demo (use proper encryption in production)
    const configString = JSON.stringify(config);
    return btoa(configString);
  }

  /**
   * Decrypt form configuration data
   */
  async decryptConfig(encryptedConfig: string): Promise<FormConfiguration> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    try {
      // Simple base64 decoding for demo (use proper decryption in production)
      const configString = atob(encryptedConfig);
      return JSON.parse(configString);
    } catch (error) {
      throw new Error('Failed to decrypt form configuration');
    }
  }

  /**
   * Generate encryption key for new configurations
   */
  generateEncryptionKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

/**
 * Validate form configuration for security issues
 */
export async function validateFormConfiguration(config: FormConfiguration): Promise<SecurityValidationResult> {
  const violations: SecurityViolation[] = [];
  let securityScore = 100;

  // Check for basic structure
  if (!config.name || !config.sections) {
    violations.push({
      type: 'validation_error',
      severity: 'high',
      message: 'Form configuration must have name and sections',
      suggestion: 'Ensure all required fields are present'
    });
    securityScore -= 30;
  }

  // Validate each section
  for (const section of config.sections || []) {
    // Check for XSS in titles
    if (containsSuspiciousContent(section.title)) {
      violations.push({
        type: 'xss',
        severity: 'high',
        message: `Section title contains potentially dangerous content: ${section.title}`,
        suggestion: 'Remove script tags and suspicious content from titles'
      });
      securityScore -= 25;
    }

    // Validate fields
    for (const field of section.fields || []) {
      // Check field ID for injection patterns
      if (containsInjectionPattern(field.id)) {
        violations.push({
          type: 'injection',
          severity: 'critical',
          message: `Field ID contains injection pattern: ${field.id}`,
          field: field.id,
          suggestion: 'Use alphanumeric characters and underscores only'
        });
        securityScore -= 40;
      }

      // Check for XSS in labels and placeholders
      if (containsSuspiciousContent(field.label)) {
        violations.push({
          type: 'xss',
          severity: 'medium',
          message: `Field label contains suspicious content: ${field.label}`,
          field: field.id,
          suggestion: 'Sanitize field labels'
        });
        securityScore -= 15;
      }

      if (field.placeholder && containsSuspiciousContent(field.placeholder)) {
        violations.push({
          type: 'xss',
          severity: 'medium',
          message: `Field placeholder contains suspicious content`,
          field: field.id,
          suggestion: 'Sanitize field placeholders'
        });
        securityScore -= 10;
      }

      // Validate field type
      const validFieldTypes = [
        'text', 'email', 'password', 'number', 'tel', 'url', 'date', 
        'datetime-local', 'time', 'checkbox', 'radio', 'select', 
        'textarea', 'file', 'hidden'
      ];

      if (!validFieldTypes.includes(field.type)) {
        violations.push({
          type: 'invalid_field',
          severity: 'medium',
          message: `Unknown field type: ${field.type}`,
          field: field.id,
          suggestion: 'Use only supported field types'
        });
        securityScore -= 10;
      }

      // Check validation rules
      if (field.validation) {
        for (const rule of field.validation) {
          if (rule.type === 'pattern' && typeof rule.value === 'string') {
            try {
              new RegExp(rule.value);
            } catch (error) {
              violations.push({
                type: 'validation_error',
                severity: 'medium',
                message: `Invalid regex pattern in validation rule`,
                field: field.id,
                suggestion: 'Fix the regular expression pattern'
              });
              securityScore -= 10;
            }
          }
        }
      }
    }
  }

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (violations.length > 0) {
    recommendations.push('Address all security violations before deploying');
  }
  
  if (!config.security?.encrypted) {
    recommendations.push('Consider encrypting sensitive form configurations');
  }
  
  if (!config.security?.rateLimit) {
    recommendations.push('Implement rate limiting to prevent abuse');
  }

  return {
    isSecure: violations.filter(v => v.severity === 'high' || v.severity === 'critical').length === 0,
    violations,
    securityScore: Math.max(0, securityScore),
    recommendations
  };
}

/**
 * Check for suspicious content that might contain XSS
 */
function containsSuspiciousContent(content: string): boolean {
  if (!content) return false;
  
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /eval\s*\(/gi,
    /document\.cookie/gi,
    /window\.location/gi
  ];

  return suspiciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Check for SQL injection patterns in field IDs
 */
function containsInjectionPattern(fieldId: string): boolean {
  if (!fieldId) return false;

  const injectionPatterns = [
    /['";]/,
    /\b(DROP|DELETE|INSERT|UPDATE|SELECT|UNION|ALTER)\b/gi,
    /--|\/\*/,
    /\bOR\b.*=.*\bOR\b/gi,
    /\bAND\b.*=.*\bAND\b/gi
  ];

  return injectionPatterns.some(pattern => pattern.test(fieldId));
}

/**
 * Sanitize user input for form configurations
 */
export function sanitizeFormInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
