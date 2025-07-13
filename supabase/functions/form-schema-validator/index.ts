/**
 * Form Schema Validator Edge Function
 * 
 * Real-time validation service for form configurations
 * Provides instant feedback on form schema validity and security
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { 
  FormConfigKMSService, 
  FormConfiguration,
  validateFormConfiguration,
  type SecurityValidationResult
} from '../_shared/form-config-kms.ts';

interface ValidationRequest {
  config: FormConfiguration;
  validationLevel: 'basic' | 'security' | 'comprehensive';
  includePerformanceMetrics?: boolean;
}

interface ValidationResponse {
  success: boolean;
  isValid: boolean;
  validationResults: SecurityValidationResult;
  performanceMetrics?: PerformanceMetrics;
  suggestions?: string[];
}

interface PerformanceMetrics {
  estimatedRenderTime: number;
  fieldCount: number;
  sectionCount: number;
  complexityScore: number;
  memoryEstimate: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return createErrorResponse('METHOD_NOT_ALLOWED', 'Only POST method is allowed', 405);
    }

    const requestData: ValidationRequest = await req.json();

    if (!requestData.config) {
      return createErrorResponse('MISSING_CONFIG', 'Form configuration is required', 400);
    }

    // Initialize services
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const kmsService = new FormConfigKMSService();

    // Perform validation based on requested level
    let validationResults: SecurityValidationResult;
    
    switch (requestData.validationLevel) {
      case 'basic':
        validationResults = await performBasicValidation(requestData.config);
        break;
      case 'security':
        validationResults = await validateFormConfiguration(requestData.config);
        break;
      case 'comprehensive':
        validationResults = await performComprehensiveValidation(
          requestData.config, 
          supabase, 
          kmsService
        );
        break;
      default:
        validationResults = await validateFormConfiguration(requestData.config);
    }

    // Calculate performance metrics if requested
    let performanceMetrics: PerformanceMetrics | undefined;
    if (requestData.includePerformanceMetrics) {
      performanceMetrics = calculatePerformanceMetrics(requestData.config);
    }

    // Generate suggestions for improvement
    const suggestions = generateSuggestions(requestData.config, validationResults);

    const response: ValidationResponse = {
      success: true,
      isValid: validationResults.isSecure,
      validationResults,
      performanceMetrics,
      suggestions
    };

    return createSuccessResponse(response);

  } catch (error) {
    console.error('Form validation error:', error);
    return createErrorResponse('VALIDATION_ERROR', error.message, 500);
  }
});

/**
 * Perform basic validation checks
 */
async function performBasicValidation(config: FormConfiguration): Promise<SecurityValidationResult> {
  const violations = [];
  
  // Check required fields
  if (!config.name || config.name.trim() === '') {
    violations.push({
      type: 'validation_error',
      severity: 'high' as const,
      message: 'Form name is required',
      field: 'name'
    });
  }

  if (!config.sections || config.sections.length === 0) {
    violations.push({
      type: 'validation_error',
      severity: 'high' as const,
      message: 'Form must have at least one section',
      field: 'sections'
    });
  }

  // Check each section
  config.sections?.forEach((section, sectionIndex) => {
    if (!section.title || section.title.trim() === '') {
      violations.push({
        type: 'validation_error',
        severity: 'medium' as const,
        message: `Section ${sectionIndex + 1} is missing a title`,
        field: `sections[${sectionIndex}].title`
      });
    }

    if (!section.fields || section.fields.length === 0) {
      violations.push({
        type: 'validation_error',
        severity: 'medium' as const,
        message: `Section "${section.title}" has no fields`,
        field: `sections[${sectionIndex}].fields`
      });
    }

    // Check each field
    section.fields?.forEach((field, fieldIndex) => {
      if (!field.id || field.id.trim() === '') {
        violations.push({
          type: 'validation_error',
          severity: 'high' as const,
          message: `Field ${fieldIndex + 1} in section "${section.title}" is missing an ID`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].id`
        });
      }

      if (!field.type || field.type.trim() === '') {
        violations.push({
          type: 'validation_error',
          severity: 'high' as const,
          message: `Field "${field.id}" is missing a type`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].type`
        });
      }

      if (!field.label || field.label.trim() === '') {
        violations.push({
          type: 'validation_error',
          severity: 'medium' as const,
          message: `Field "${field.id}" is missing a label`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].label`
        });
      }

      // Check for duplicate field IDs
      const duplicateFields = config.sections
        .flatMap(s => s.fields)
        .filter(f => f.id === field.id);
      
      if (duplicateFields.length > 1) {
        violations.push({
          type: 'validation_error',
          severity: 'high' as const,
          message: `Duplicate field ID "${field.id}" found`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].id`
        });
      }
    });
  });

  return {
    isSecure: violations.filter(v => v.severity === 'high').length === 0,
    violations,
    recommendations: generateBasicRecommendations(violations)
  };
}

/**
 * Perform comprehensive validation including database checks
 */
async function performComprehensiveValidation(
  config: FormConfiguration,
  supabase: SupabaseClient,
  _kmsService: FormConfigKMSService
): Promise<SecurityValidationResult> {
  // Start with security validation
  const securityResults = await validateFormConfiguration(config);
  
  // Ignore unused parameter for now (future enhancement)
  void _kmsService;

  // Add database-specific validations
  const dbViolations = await validateAgainstDatabase(config, supabase);
  securityResults.violations.push(...dbViolations);

  // Add integration validations
  const integrationViolations = await validateIntegrations(config);
  securityResults.violations.push(...integrationViolations);

  // Add accessibility validations
  const accessibilityViolations = validateAccessibility(config);
  securityResults.violations.push(...accessibilityViolations);

  // Update security status
  securityResults.isSecure = securityResults.violations.filter(
    v => v.severity === 'critical' || v.severity === 'high'
  ).length === 0;

  return securityResults;
}

/**
 * Validate against database constraints and existing data
 */
async function validateAgainstDatabase(
  config: FormConfiguration,
  supabase: SupabaseClient
): Promise<Array<{
  type: string;
  severity: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}>> {
  const violations = [];

  try {
    // Check if form name already exists
    const { data: existingForms, error } = await supabase
      .from('form_configurations')
      .select('name, version')
      .eq('name', config.name)
      .neq('status', 'archived');

    if (error) {
      violations.push({
        type: 'database_error',
        severity: 'medium',
        message: `Failed to check existing forms: ${error.message}`,
        details: { error }
      });
    } else if (existingForms && existingForms.length > 0) {
      const maxVersion = Math.max(...existingForms.map((f: { version: number }) => f.version));
      if (config.version <= maxVersion) {
        violations.push({
          type: 'version_conflict',
          severity: 'high',
          message: `Form version ${config.version} already exists. Use version ${maxVersion + 1} or higher.`,
          details: { existingVersions: existingForms.map((f: { version: number }) => f.version) }
        });
      }
    }

    // Validate against business rules
    const { data: rules, error: rulesError } = await supabase
      .from('form_validation_rules')
      .select('*')
      .eq('is_active', true);

    if (!rulesError && rules) {
      const ruleViolations = await validateAgainstBusinessRules(config, rules);
      violations.push(...ruleViolations);
    }

  } catch (error) {
    violations.push({
      type: 'database_validation_error',
      severity: 'medium',
      message: `Database validation failed: ${error.message}`,
      details: { error: error.message }
    });
  }

  return violations;
}

/**
 * Validate against business rules stored in database
 */
async function validateAgainstBusinessRules(
  config: FormConfiguration,
  rules: Array<{
    name: string;
    rule_type: string;
    rule_data: Record<string, unknown>;
    severity: string;
    error_message: string;
  }>
): Promise<Array<{
  type: string;
  severity: string;
  message: string;
  details?: Record<string, unknown>;
}>> {
  const violations = [];

  for (const rule of rules) {
    try {
      const ruleData = rule.rule_data;
      const ruleType = rule.rule_type;

      switch (ruleType) {
        case 'security':
          if (ruleData.patterns) {
            const configStr = JSON.stringify(config);
            for (const pattern of ruleData.patterns) {
              const regex = new RegExp(pattern, ruleData.case_insensitive ? 'gi' : 'g');
              if (regex.test(configStr)) {
                violations.push({
                  type: 'business_rule_violation',
                  severity: rule.severity,
                  message: rule.error_message,
                  details: { rule: rule.name, pattern }
                });
              }
            }
          }
          break;

        case 'technical':
          if (ruleData.max_fields) {
            const totalFields = config.sections.reduce((total, section) => 
              total + section.fields.length, 0
            );
            if (totalFields > ruleData.max_fields) {
              violations.push({
                type: 'business_rule_violation',
                severity: rule.severity,
                message: rule.error_message,
                details: { 
                  rule: rule.name, 
                  current: totalFields, 
                  max: ruleData.max_fields 
                }
              });
            }
          }
          break;

        case 'compliance':
          if (ruleData.payment_fields && ruleData.required_ssl) {
            const hasPaymentFields = config.sections.some(section =>
              section.fields.some(field => 
                ruleData.payment_fields.includes(field.type)
              )
            );

            if (hasPaymentFields) {
              // Check if integrations use HTTPS
              const integrations = [
                config.integrations?.onSubmit,
                config.integrations?.onValidation,
                ...(config.integrations?.webhooks || [])
              ].filter(Boolean);

              const hasInsecureEndpoints = integrations.some(integration =>
                integration && !integration.endpoint.startsWith('https://')
              );

              if (hasInsecureEndpoints) {
                violations.push({
                  type: 'business_rule_violation',
                  severity: rule.severity,
                  message: rule.error_message,
                  details: { rule: rule.name }
                });
              }
            }
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to validate against rule ${rule.name}:`, error);
    }
  }

  return violations;
}

/**
 * Validate API integrations
 */
async function validateIntegrations(config: FormConfiguration): Promise<Array<{
  type: string;
  severity: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}>> {
  const violations = [];

  if (!config.integrations) {
    return violations;
  }

  const integrations = [
    { key: 'onSubmit', integration: config.integrations.onSubmit },
    { key: 'onValidation', integration: config.integrations.onValidation },
    ...(config.integrations.webhooks || []).map((webhook, index) => ({
      key: `webhook_${index}`,
      integration: webhook
    }))
  ].filter(item => item.integration);

  for (const { key, integration } of integrations) {
    try {
      // Validate endpoint URL format
      new URL(integration.endpoint);
      
      // Check if endpoint is reachable (head request)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(integration.endpoint, {
          method: 'HEAD',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok && response.status !== 405) { // 405 Method Not Allowed is OK for HEAD
          violations.push({
            type: 'integration_unreachable',
            severity: 'medium',
            message: `Integration endpoint ${key} returned status ${response.status}`,
            field: key,
            details: { endpoint: integration.endpoint, status: response.status }
          });
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          violations.push({
            type: 'integration_timeout',
            severity: 'medium',
            message: `Integration endpoint ${key} timed out`,
            field: key,
            details: { endpoint: integration.endpoint }
          });
        } else {
          violations.push({
            type: 'integration_error',
            severity: 'low',
            message: `Could not verify integration endpoint ${key}: ${fetchError.message}`,
            field: key,
            details: { endpoint: integration.endpoint, error: fetchError.message }
          });
        }
      }
    } catch {
      violations.push({
        type: 'integration_invalid_url',
        severity: 'high',
        message: `Integration endpoint ${key} has invalid URL format`,
        field: key,
        details: { endpoint: integration.endpoint }
      });
    }
  }

  return violations;
}

/**
 * Validate accessibility compliance
 */
function validateAccessibility(config: FormConfiguration): Array<{
  type: string;
  severity: string;
  message: string;
  field?: string;
}> {
  const violations = [];

  config.sections.forEach((section, sectionIndex) => {
    section.fields.forEach((field, fieldIndex) => {
      // Check for proper labeling
      if (!field.label || field.label.trim().length < 2) {
        violations.push({
          type: 'accessibility_violation',
          severity: 'medium',
          message: `Field "${field.id}" needs a descriptive label for screen readers`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].label`
        });
      }

      // Check for required field indicators
      if (field.validation?.required && !field.label?.includes('*') && !field.description?.includes('required')) {
        violations.push({
          type: 'accessibility_violation',
          severity: 'low',
          message: `Required field "${field.id}" should indicate it's required`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}]`
        });
      }

      // Check for appropriate field types
      if (field.type === 'text' && field.id?.toLowerCase().includes('email')) {
        violations.push({
          type: 'accessibility_violation',
          severity: 'low',
          message: `Field "${field.id}" should use email type for better accessibility`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].type`
        });
      }

      if (field.type === 'text' && field.id?.toLowerCase().includes('phone')) {
        violations.push({
          type: 'accessibility_violation',
          severity: 'low',
          message: `Field "${field.id}" should use phone type for better accessibility`,
          field: `sections[${sectionIndex}].fields[${fieldIndex}].type`
        });
      }
    });
  });

  return violations;
}

/**
 * Calculate performance metrics
 */
function calculatePerformanceMetrics(config: FormConfiguration): PerformanceMetrics {
  const fieldCount = config.sections.reduce((total, section) => total + section.fields.length, 0);
  const sectionCount = config.sections.length;
  
  // Calculate complexity score based on various factors
  let complexityScore = 0;
  
  config.sections.forEach(section => {
    section.fields.forEach(field => {
      // Base complexity
      complexityScore += 1;
      
      // Add complexity for validation rules
      if (field.validation) {
        complexityScore += Object.keys(field.validation).length * 0.5;
      }
      
      // Add complexity for conditional logic
      if (field.conditional) {
        complexityScore += 2;
      }
      
      // Add complexity for special field types
      if (['stripe-card', 'airport-autocomplete', 'file-upload'].includes(field.type)) {
        complexityScore += 3;
      }
      
      // Add complexity for API integrations
      if (field.apiIntegration) {
        complexityScore += 2;
      }
    });
  });

  // Estimate render time (rough approximation)
  const estimatedRenderTime = (fieldCount * 10) + (complexityScore * 5); // milliseconds
  
  // Estimate memory usage (rough approximation)
  const memoryEstimate = (fieldCount * 2) + (complexityScore * 0.5); // KB

  return {
    fieldCount,
    sectionCount,
    complexityScore: Math.round(complexityScore),
    estimatedRenderTime,
    memoryEstimate: Math.round(memoryEstimate)
  };
}

/**
 * Generate suggestions for improvement
 */
function generateSuggestions(
  config: FormConfiguration, 
  validationResults: SecurityValidationResult
): string[] {
  const suggestions = [];

  // Performance suggestions
  const fieldCount = config.sections.reduce((total, section) => total + section.fields.length, 0);
  
  if (fieldCount > 20) {
    suggestions.push('Consider breaking this form into multiple steps to improve user experience');
  }

  if (config.sections.length === 1 && fieldCount > 10) {
    suggestions.push('Consider organizing fields into multiple sections for better visual hierarchy');
  }

  // Security suggestions
  const criticalViolations = validationResults.violations.filter(v => v.severity === 'critical');
  if (criticalViolations.length > 0) {
    suggestions.push('Critical security issues must be resolved before deployment');
  }

  // Accessibility suggestions
  const accessibilityViolations = validationResults.violations.filter(v => v.type === 'accessibility_violation');
  if (accessibilityViolations.length > 0) {
    suggestions.push('Improve accessibility by adding proper labels and field types');
  }

  // Integration suggestions
  if (config.integrations && !config.integrations.onSubmit) {
    suggestions.push('Consider adding a submit integration to handle form submissions');
  }

  // Validation suggestions
  const fieldsWithoutValidation = config.sections
    .flatMap(s => s.fields)
    .filter(f => !f.validation || Object.keys(f.validation).length === 0);
    
  if (fieldsWithoutValidation.length > fieldCount * 0.5) {
    suggestions.push('Add validation rules to improve data quality');
  }

  return suggestions;
}

/**
 * Generate basic recommendations
 */
function generateBasicRecommendations(violations: Array<{
  type: string;
  severity: string;
  message: string;
  field?: string;
}>): string[] {
  const recommendations = [];
  
  if (violations.some(v => v.field?.includes('name'))) {
    recommendations.push('Ensure all forms have descriptive names');
  }
  
  if (violations.some(v => v.field?.includes('sections'))) {
    recommendations.push('Organize form fields into logical sections');
  }
  
  if (violations.some(v => v.field?.includes('fields'))) {
    recommendations.push('Ensure all fields have unique IDs, types, and labels');
  }
  
  return recommendations;
}

/**
 * Helper functions
 */
function createSuccessResponse(data: ValidationResponse): Response {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      } 
    }
  );
}

function createErrorResponse(
  code: string, 
  message: string, 
  status: number = 500
): Response {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: { 
        code, 
        message,
        timestamp: new Date().toISOString() 
      } 
    }),
    { 
      status,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      } 
    }
  );
}
