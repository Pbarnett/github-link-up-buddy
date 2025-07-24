

/**
 * useFormValidation Hook
 * 
 * Manages dynamic form validation including real-time validation,
 * custom validation rules, and integration with React Hook Form
 */


import { z } from 'zod';
import type { 
import * as React from 'react';
  FieldConfiguration,
  FormConfiguration,
  DynamicFormConfig
} from '@/types/dynamic-forms';
import { generateValidationSchema, validateFormData } from '@/lib/form-validation';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

export interface UseFormValidationReturn {
  /** Validate a single field */
  validateField: (fieldId: string, value: unknown) => Promise<ValidationResult>;
  /** Validate the entire form */
  validateForm: (formData: Record<string, unknown>) => Promise<ValidationResult>;
  /** Current validation errors */
  validationErrors: Record<string, string>;
  /** Current validation warnings */
  validationWarnings: Record<string, string>;
  /** Whether the form is currently valid */
  isFormValid: boolean;
  /** Clear validation errors for a field */
  clearFieldError: (fieldId: string) => void;
  /** Clear all validation errors */
  clearAllErrors: () => void;
  /** Add custom validation error */
  addCustomError: (fieldId: string, error: string) => void;
  /** Get validation schema for the form */
  getValidationSchema: () => z.ZodSchema<unknown>;
  /** Check if real-time validation is enabled */
  isRealTimeEnabled: boolean;
}

export const useFormValidation = (
  config: DynamicFormConfig | FormConfiguration | null,
  enableRealTime: boolean = false
): UseFormValidationReturn => {
  
  // State for validation errors and warnings
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<string, string>>({});

  // Generate validation schema from config
  const validationSchema = useMemo(() => {
    if (!config) return z.object({});
    return generateValidationSchema(config as FormConfiguration);
  }, [config]);

  // Check if form is valid (no errors)
  const isFormValid = useMemo(() => {
    return Object.keys(validationErrors).length === 0;
  }, [validationErrors]);

  // Get field configuration by ID
  const getFieldConfig = useCallback((fieldId: string): FieldConfiguration | null => {
    if (!config) return null;
    
    for (const section of config.sections) {
      const field = section.fields.find((f: any) => f.id === fieldId);
      if (field) return field;
    }
    return null;
  }, [config]);

  // Validate a single field
  const validateField = useCallback(async (
    fieldId: string, 
    value: unknown
  ): Promise<ValidationResult> => {
    const fieldConfig = getFieldConfig(fieldId);
    if (!fieldConfig) {
      return { isValid: true, errors: {}, warnings: {} };
    }

    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    try {
      // Create a partial schema for just this field
      const fieldSchema = generateFieldValidationSchema(fieldConfig);
      fieldSchema.parse(value);

      // Custom validation if specified
      if (fieldConfig.validation?.custom) {
        const customValidation = await executeCustomValidation(
          fieldConfig.validation.custom,
          value,
          fieldId
        );
        
        if (!customValidation.isValid) {
          errors[fieldId] = customValidation.error || 'Custom validation failed';
        }
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        errors[fieldId] = fieldConfig.validation?.message || firstError.message;
      } else {
        errors[fieldId] = 'Validation error occurred';
      }
    }

    // Update state with new errors
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (errors[fieldId]) {
        newErrors[fieldId] = errors[fieldId];
      } else {
        delete newErrors[fieldId];
      }
      return newErrors;
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }, [getFieldConfig]);

  // Validate entire form
  const validateForm = useCallback(async (
    formData: Record<string, unknown>
  ): Promise<ValidationResult> => {
    if (!config) {
      return { isValid: true, errors: {}, warnings: {} };
    }

    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    try {
      // Use the comprehensive validation from form-validation lib
      const validationResult = await validateFormData(config as FormConfiguration, formData);
      
      if (!validationResult.isValid) {
        Object.assign(errors, validationResult.errors);
      }

      // Also run Zod schema validation
      validationSchema.parse(formData);

    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const fieldPath = err.path.join('.');
          const fieldConfig = getFieldConfig(fieldPath);
          const message = fieldConfig?.validation?.message || err.message;
          errors[fieldPath] = message;
        });
      }
    }

    // Run cross-field validations
    const crossFieldErrors = await validateCrossFieldRules(config, formData);
    Object.assign(errors, crossFieldErrors);

    // Update state
    setValidationErrors(errors);
    setValidationWarnings(warnings);

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }, [config, validationSchema, getFieldConfig]);

  // Clear field error
  const clearFieldError = useCallback((fieldId: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldId];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setValidationErrors({});
    setValidationWarnings({});
  }, []);

  // Add custom error
  const addCustomError = useCallback((fieldId: string, error: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldId]: error
    }));
  }, []);

  // Get validation schema
  const getValidationSchema = useCallback(() => {
    return validationSchema;
  }, [validationSchema]);

  return {
    validateField,
    validateForm,
    validationErrors,
    validationWarnings,
    isFormValid,
    clearFieldError,
    clearAllErrors,
    addCustomError,
    getValidationSchema,
    isRealTimeEnabled: enableRealTime
  };
};

// Helper function to generate validation schema for a single field
const generateFieldValidationSchema = (field: FieldConfiguration): z.ZodTypeAny => {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
    case 'textarea': {
      let stringSchema = z.string();
      
      if (field.validation?.email) {
        stringSchema = stringSchema.email('Invalid email address');
      }
      if (field.validation?.minLength) {
        stringSchema = stringSchema.min(field.validation.minLength, `Minimum ${field.validation.minLength} characters`);
      }
      if (field.validation?.maxLength) {
        stringSchema = stringSchema.max(field.validation.maxLength, `Maximum ${field.validation.maxLength} characters`);
      }
      if (field.validation?.pattern) {
        stringSchema = stringSchema.regex(new RegExp(field.validation.pattern), 'Invalid format');
      }
      
      schema = stringSchema;
      break;
    }

    case 'number': {
      let numberSchema = z.number();
      
      if (field.validation?.min !== undefined) {
        numberSchema = numberSchema.min(field.validation.min, `Minimum value is ${field.validation.min}`);
      }
      if (field.validation?.max !== undefined) {
        numberSchema = numberSchema.max(field.validation.max, `Maximum value is ${field.validation.max}`);
      }
      
      schema = numberSchema;
      break;
    }

    case 'date':
    case 'datetime':
      schema = z.date();
      break;

    case 'checkbox':
    case 'switch':
      schema = z.boolean();
      break;

    case 'select':
    case 'radio':
      if (field.options) {
        const values = field.options.map(opt => opt.value);
        schema = z.enum(values as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;

    case 'multi-select':
      schema = z.array(z.string());
      break;

    default:
      schema = z.unknown();
  }

  // Apply required validation
  if (field.validation?.required !== undefined && field.validation?.required) {
    if (schema instanceof z.ZodString) {
      schema = schema.min(1, 'This field is required');
    } else if (schema instanceof z.ZodArray) {
      schema = schema.min(1, 'At least one option must be selected');
    } else {
      schema = schema.refine(value => value !== null && value !== undefined, {
        message: 'This field is required'
      });
    }
  } else {
    schema = schema.optional();
  }

  return schema;
};

// Execute custom validation function
const executeCustomValidation = async (
  customValidationCode: string,
  value: unknown,
  fieldId: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    // Create a safe execution context for custom validation
    const validationFn = new Function('value', 'fieldId', `
      return (${customValidationCode})(value, fieldId);
    `);

    const result = await validationFn(value, fieldId);
    
    if (typeof result === 'boolean') {
      return { isValid: result };
    }
    
    if (typeof result === 'object' && result !== null) {
      return {
        isValid: result.isValid || false,
        error: result.error || result.message
      };
    }

    return { isValid: false, error: 'Invalid validation result' };

  } catch (error) {
    console.error('Custom validation error:', error);
    return { isValid: false, error: 'Validation function error' };
  }
};

// Validate cross-field rules (like "confirm password" or date ranges)
const validateCrossFieldRules = async (
  config: DynamicFormConfig | FormConfiguration,
  formData: Record<string, unknown>
): Promise<Record<string, string>> => {
  const errors: Record<string, string> = {};

  // Example: Date range validation
  const startDate = formData['start_date'];
  const endDate = formData['end_date'];
  
  if (startDate && endDate && new Date(startDate as string) >= new Date(endDate as string)) {
    errors['end_date'] = 'End date must be after start date';
  }

  // Example: Password confirmation
  const password = formData['password'];
  const confirmPassword = formData['confirm_password'];
  
  if (password && confirmPassword && password !== confirmPassword) {
    errors['confirm_password'] = 'Passwords do not match';
  }

  // Add more cross-field validations as needed
  
  return errors;
};

export default useFormValidation;
