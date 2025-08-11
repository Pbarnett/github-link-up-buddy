/**
 * Form Validation Schema Generator
 * 
 * Generates Zod validation schemas from dynamic form configurations
 */

import { z } from 'zod';
import type {
  FormConfiguration,
  FieldConfiguration,
  ValidationRules
} from '@/types/dynamic-forms';

/**
 * Generate a Zod schema from a form configuration
 */
export const generateZodSchema = (configuration: FormConfiguration): z.ZodSchema => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Process all fields from all sections
  configuration.sections.forEach(section => {
    section.fields.forEach(field => {
      const fieldSchema = generateFieldSchema(field);
      if (fieldSchema) {
        schemaFields[field.id] = fieldSchema;
      }
    });
  });

  return z.object(schemaFields);
};

/**
 * Generate a Zod schema for a single field
 */
export const generateFieldSchema = (field: FieldConfiguration): z.ZodTypeAny | null => {
  // Skip non-input field types
  if (['section-header', 'divider'].includes(field.type)) {
    return null;
  }

  let schema: z.ZodTypeAny;

  // Base schema based on field type
  switch (field.type) {
    case 'text':
    case 'textarea':
    case 'password':
      schema = z.string();
      break;

    case 'email':
      schema = z.string().email('Please enter a valid email address');
      break;

    case 'phone':
      schema = z.string().min(10, 'Please enter a valid phone number');
      break;

    case 'number':
    case 'slider':
      schema = z.number();
      break;

    case 'checkbox':
    case 'switch':
      schema = z.boolean();
      break;

    case 'select':
    case 'country-select':
    case 'currency-select':
      // Validate against available options if provided
      if (field.options && field.options.length > 0) {
        const optionValues = field.options.map(opt => opt.value);
        schema = z.enum(optionValues as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;

    case 'multi-select':
      schema = z.array(z.string());
      break;

    case 'date':
    case 'datetime':
      schema = z.string().refine((val) => {
        if (!val) return false; // Empty values should fail validation for required fields
        return !isNaN(Date.parse(val));
      }, 'Please enter a valid date');
      break;

    case 'date-range':
    case 'date-range-flexible':
      schema = z.object({
        from: z.string().optional(),
        to: z.string().optional()
      });
      break;

    case 'airport-autocomplete':
      schema = z.object({
        code: z.string().min(1, 'Airport code is required'),
        name: z.string().min(1, 'Airport name is required'),
        city: z.string().optional(),
        country: z.string().optional()
      });
      break;

    case 'address-group':
      schema = z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string()
      });
      break;

    case 'file-upload':
      schema = z.instanceof(File).or(z.array(z.instanceof(File)));
      break;

    case 'rating':
      schema = z.number().min(1).max(5);
      break;

    default:
      // Default to string for unknown types
      schema = z.string();
  }

  // Apply validation rules
  if (field.validation) {
    schema = applyValidationRules(schema, field.validation, field.type);
  }

  // Handle required/optional
  if (field.validation?.required) {
    // For string fields, ensure they're not empty
    if (['text', 'textarea', 'password', 'email', 'phone'].includes(field.type)) {
      // Check if schema still has min method (might be modified by custom validation)
      if (typeof (schema as any).min === 'function') {
        schema = (schema as z.ZodString).min(1, field.validation.message || `${field.label} is required`);
      } else {
        // Use refine for complex schemas
        schema = schema.refine((val) => {
          return typeof val === 'string' && val.length > 0;
        }, {
          message: field.validation.message || `${field.label} is required`
        });
      }
    }
    // For checkbox/switch, must be true
    else if (field.type === 'checkbox' || field.type === 'switch') {
      schema = schema.refine((val) => val === true, {
        message: field.validation.message || `${field.label} is required`
      });
    }
    // For other types, use default required validation
  } else {
    // Make optional
    schema = schema.optional();
  }

  return schema;
};

/**
 * Apply validation rules to a Zod schema
 */
const applyValidationRules = (
  schema: z.ZodTypeAny,
  rules: ValidationRules,
  fieldType: string
): z.ZodTypeAny => {
  let updatedSchema = schema;

  // String validations
  if (schema instanceof z.ZodString) {
    if (rules.minLength !== undefined) {
      updatedSchema = (updatedSchema as z.ZodString).min(
        rules.minLength,
        rules.message || `Must be at least ${rules.minLength} characters`
      );
    }

    if (rules.maxLength !== undefined) {
      updatedSchema = (updatedSchema as z.ZodString).max(
        rules.maxLength,
        rules.message || `Must be no more than ${rules.maxLength} characters`
      );
    }

    if (rules.pattern) {
      try {
        const regex = new RegExp(rules.pattern);
        updatedSchema = (updatedSchema as z.ZodString).regex(
          regex,
          rules.message || 'Invalid format'
        );
      } catch (error) {
        console.warn(`Invalid regex pattern for field: ${rules.pattern}`);
      }
    }

    if (rules.email) {
      updatedSchema = (updatedSchema as z.ZodString).email(
        rules.message || 'Please enter a valid email address'
      );
    }

    if (rules.url) {
      updatedSchema = (updatedSchema as z.ZodString).url(
        rules.message || 'Please enter a valid URL'
      );
    }
  }

  // Number validations
  if (schema instanceof z.ZodNumber) {
    if (rules.min !== undefined) {
      updatedSchema = (updatedSchema as z.ZodNumber).min(
        rules.min,
        rules.message || `Must be at least ${rules.min}`
      );
    }

    if (rules.max !== undefined) {
      updatedSchema = (updatedSchema as z.ZodNumber).max(
        rules.max,
        rules.message || `Must be no more than ${rules.max}`
      );
    }
  }

  // Custom validation
  if (rules.custom) {
    try {
      // Safely evaluate custom validation function
      const customValidation = new Function('value', 'field', rules.custom);
      
      updatedSchema = updatedSchema.refine((value) => {
        try {
          return customValidation(value, { type: fieldType });
        } catch (error) {
          console.error('Custom validation error:', error);
          return false;
        }
      }, {
        message: rules.message || 'Custom validation failed'
      });
    } catch (error) {
      console.warn('Invalid custom validation function:', error);
    }
  }

  return updatedSchema;
};

/**
 * Validate a single field value against its configuration
 */
export const validateFieldValue = (
  field: FieldConfiguration,
  value: any
): { isValid: boolean; error?: string } => {
  try {
    const fieldSchema = generateFieldSchema(field);
    if (!fieldSchema) {
      return { isValid: true };
    }

    fieldSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed'
      };
    }
    return {
      isValid: false,
      error: 'Unknown validation error'
    };
  }
};

/**
 * Validate all form values against the configuration
 */
export const validateFormValues = (
  configuration: FormConfiguration,
  values: Record<string, any>
): { isValid: boolean; errors: Record<string, string> } => {
  try {
    const schema = generateZodSchema(configuration);
    schema.parse(values);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        if (err.path.length > 0) {
          const fieldPath = err.path.join('.');
          errors[fieldPath] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { form: 'Validation failed' } };
  }
};

/**
 * Get default values from form configuration
 */
export const getDefaultValues = (configuration: FormConfiguration): Record<string, any> => {
  const defaults: Record<string, any> = {};

  configuration.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        defaults[field.id] = field.defaultValue;
      } else {
        // Set type-appropriate default values
        switch (field.type) {
          case 'checkbox':
          case 'switch':
            defaults[field.id] = false;
            break;
          case 'multi-select':
            defaults[field.id] = [];
            break;
          case 'number':
          case 'slider':
            defaults[field.id] = field.validation?.min || 0;
            break;
          case 'date-range':
          case 'date-range-flexible':
            defaults[field.id] = { from: undefined, to: undefined };
            break;
          case 'address-group':
            defaults[field.id] = {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            };
            break;
          default:
            defaults[field.id] = '';
        }
      }
    });
  });

  return defaults;
};
