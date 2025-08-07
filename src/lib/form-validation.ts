/**
 * Enhanced Form Validation Schema Generator
 *
 * Generates Zod validation schemas from dynamic form configurations
 * with Zod v4-inspired features and optimizations
 */

import type {
  FormConfiguration,
  FormSection,
  FieldConfiguration,
  ValidationRules,
../types/dynamic-forms';
import {
  treeifyError,
  flattenError,
  prettifyError,
  createLocalizedErrorMap,
  commonErrorMessages,
./validation/error-formatting';
import {
  globalRegistry,
  createEnhancedSchema,
  type GlobalMeta,
./validation/schema-registry';

/**
 * Generate a Zod schema from a form configuration
 */
export const generateZodSchema = (
  configuration: FormConfiguration
): z.ZodSchema => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  // Process all fields from all sections
  configuration.sections.forEach((section: FormSection) => {
    section.fields.forEach((field: FieldConfiguration) => {
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
export const generateFieldSchema = (
  field: FieldConfiguration
): z.ZodTypeAny | null => {
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
        const optionValues = field.options.map((opt: any) => opt.value);
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
      schema = z.string().refine(val => {
        if (!val) return false; // Empty values should fail validation for required fields
        return !isNaN(Date.parse(val));
      }, 'Please enter a valid date');
      break;

    case 'date-range':
    case 'date-range-flexible':
      schema = z.object({
        from: z.string().optional(),
        to: z.string().optional(),
      });
      break;

    case 'airport-autocomplete':
      schema = z.object({
        code: z.string().min(1, 'Airport code is required'),
        name: z.string().min(1, 'Airport name is required'),
        city: z.string().optional(),
        country: z.string().optional(),
      });
      break;

    case 'address-group':
      schema = z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        country: z.string(),
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

  // Handle required/optional with optimized validation
  if (field.validation?.required) {
    // Use superRefine for consolidated required validation
    schema = schema.superRefine((val, ctx) => {
      let isValid = false;

      if (
        ['text', 'textarea', 'password', 'email', 'phone'].includes(field.type)
      ) {
        isValid = typeof val === 'string' && val.length > 0;
      } else if (field.type === 'checkbox' || field.type === 'switch') {
        isValid = val === true;
      } else if (field.type === 'number') {
        isValid = typeof val === 'number' && !isNaN(val);
      } else if (field.type === 'multi-select') {
        isValid = Array.isArray(val) && val.length > 0;
      } else if (field.type === 'date' || field.type === 'datetime') {
        isValid =
          typeof val === 'string' && val.length > 0 && !isNaN(Date.parse(val));
      } else {
        // Generic validation - check for non-empty values
        isValid = val !== undefined && val !== null && val !== '';
      }

      if (!isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: field.validation?.message || `${field.label} is required`,
        });
      }
    });
  } else {
    // Make optional
    schema = schema.optional();
  }

  return schema;
};

/**
 * Apply validation rules to a Zod schema
 */
const applyValidationRules = <T extends z.ZodTypeAny>(
  schema: T,
  rules: ValidationRules,
  fieldType: string
): z.ZodTypeAny => {
  let updatedSchema: z.ZodTypeAny = schema;

  // String validations
  if (schema instanceof z.ZodString) {
    let stringSchema = schema as z.ZodString;

    if (rules.minLength !== undefined) {
      stringSchema = stringSchema.min(
        rules.minLength,
        rules.message || `Must be at least ${rules.minLength} characters`
      );
    }

    if (rules.maxLength !== undefined) {
      stringSchema = stringSchema.max(
        rules.maxLength,
        rules.message || `Must be no more than ${rules.maxLength} characters`
      );
    }

    if (rules.pattern) {
      try {
        const regex = new RegExp(rules.pattern);
        stringSchema = stringSchema.regex(
          regex,
          rules.message || 'Invalid format'
        );
      } catch {
        console.warn(`Invalid regex pattern for field: ${rules.pattern}`);
      }
    }

    if (rules.email) {
      stringSchema = stringSchema.email(
        rules.message || 'Please enter a valid email address'
      );
    }

    if (rules.url) {
      stringSchema = stringSchema.url(
        rules.message || 'Please enter a valid URL'
      );
    }

    updatedSchema = stringSchema;
  }

  // Number validations
  if (schema instanceof z.ZodNumber) {
    let numberSchema = schema as z.ZodNumber;

    if (rules.min !== undefined) {
      numberSchema = numberSchema.min(
        rules.min,
        rules.message || `Must be at least ${rules.min}`
      );
    }

    if (rules.max !== undefined) {
      numberSchema = numberSchema.max(
        rules.max,
        rules.message || `Must be no more than ${rules.max}`
      );
    }

    updatedSchema = numberSchema;
  }

  // Custom validation
  if (rules.custom) {
    try {
      // Safely evaluate custom validation function
      const customValidation = new Function('value', 'field', rules.custom);

      updatedSchema = updatedSchema.refine(
        value => {
          try {
            return customValidation(value, { type: fieldType });
          } catch (error) {
            console.error('Custom validation error:', error);
            return false;
          }
        },
        {
          message: rules.message || 'Custom validation failed',
        }
      );
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
  value: unknown
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
        error: error.errors[0]?.message || 'Validation failed',
      };
    }
    return {
      isValid: false,
      error: 'Unknown validation error',
    };
  }
};

/**
 * Validate all form values against the configuration
 */
export const validateFormValues = (
  configuration: FormConfiguration,
  values: Record<string, unknown>
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
export const getDefaultValues = (
  configuration: FormConfiguration
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};

  configuration.sections.forEach((section: FormSection) => {
    section.fields.forEach((field: FieldConfiguration) => {
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
              country: '',
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

/**
 * Alias for generateZodSchema for backward compatibility
 */
export const generateValidationSchema = generateZodSchema;

/**
 * Enhanced form validation with better error formatting (Zod v4-inspired)
 */
export const validateFormValuesEnhanced = (
  configuration: FormConfiguration,
  values: Record<string, unknown>,
  options?: {
    locale?: string;
    prettify?: boolean;
    flatten?: boolean;
  }
): {
  isValid: boolean;
  errors: Record<string, string>;
  formattedError?: string;
  errorTree?: any;
  flattenedErrors?: any;
} => {
  try {
    const schema = generateZodSchema(configuration);

    // Apply localized error map if specified
    if (options?.locale) {
      const localizedErrorMap = createLocalizedErrorMap(options.locale);
      schema._def.errorMap = localizedErrorMap;
    }

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

      const result: any = { isValid: false, errors };

      // Add enhanced error formatting if requested
      if (options?.prettify) {
        result.formattedError = prettifyError(error);
      }

      if (options?.flatten) {
        result.flattenedErrors = flattenError(error);
      } else {
        result.errorTree = treeifyError(error);
      }

      return result;
    }
    return { isValid: false, errors: { form: 'Validation failed' } };
  }
};

/**
 * Create enhanced schema with metadata (Zod v4-inspired)
 */
export const createFormSchema = (
  configuration: FormConfiguration,
  metadata?: GlobalMeta
): any => {
  const baseSchema = generateZodSchema(configuration);

  const schemaMetadata: GlobalMeta = {
    id: `form_${configuration.id || 'unnamed'}`,
    title: configuration.title || 'Form Schema',
    description:
      configuration.description || 'Generated form validation schema',
    category: 'form',
    tags: ['form', 'validation', 'dynamic'],
    version: '1.0.0',
    ...metadata,
  };

  return createEnhancedSchema(baseSchema, schemaMetadata);
};

/**
 * Enhanced field validation with metadata
 */
export const validateFieldValueEnhanced = (
  field: FieldConfiguration,
  value: unknown,
  options?: {
    locale?: string;
    includeContext?: boolean;
  }
): {
  isValid: boolean;
  error?: string;
  context?: any;
} => {
  try {
    const fieldSchema = generateFieldSchema(field);
    if (!fieldSchema) {
      return { isValid: true };
    }

    // Apply localized error map if specified
    if (options?.locale) {
      const localizedErrorMap = createLocalizedErrorMap(options.locale);
      (fieldSchema as any)._def.errorMap = localizedErrorMap;
    }

    fieldSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const result: any = {
        isValid: false,
        error: error.errors[0]?.message || 'Validation failed',
      };

      if (options?.includeContext) {
        result.context = {
          field: {
            id: field.id,
            type: field.type,
            label: field.label,
          },
          value,
          issues: error.errors,
        };
      }

      return result;
    }
    return {
      isValid: false,
      error: 'Unknown validation error',
    };
  }
};

/**
 * String format validators (inspired by Zod v4 top-level functions)
 */
export const stringFormatValidators = {
  email: () => z.string().email(commonErrorMessages.email),
  url: () => z.string().url(commonErrorMessages.url),
  uuid: () => z.string().uuid(commonErrorMessages.uuid),
  phone: () =>
    z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, commonErrorMessages.phone),
  strongPassword: () =>
    z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        commonErrorMessages.strongPassword
      ),
  positiveNumber: () => z.number().positive(commonErrorMessages.positiveNumber),
  dateInFuture: () =>
    z
      .date()
      .refine(date => date > new Date(), commonErrorMessages.dateInFuture),
  dateInPast: () =>
    z.date().refine(date => date < new Date(), commonErrorMessages.dateInPast),
};

/**
 * Utility function to create conditional validation (inspired by Zod v4 patterns)
 */
export const createConditionalValidation = <T>(
  condition: (data: any) => boolean,
  schema: z.ZodSchema<T>,
  fallbackSchema?: z.ZodSchema<T>
) => {
  return z.any().superRefine((data, ctx) => {
    if (condition(data)) {
      const result = schema.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach(error => {
          ctx.addIssue(error);
        });
      }
    } else if (fallbackSchema) {
      const result = fallbackSchema.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach(error => {
          ctx.addIssue(error);
        });
      }
    }
  });
};

/**
 * Register common form schemas in the global registry
 */
export const registerCommonSchemas = () => {
  // Register string format schemas
  Object.entries(stringFormatValidators).forEach(([name, validator]) => {
    globalRegistry.add(validator(), {
      id: `string_format_${name}`,
      title: `${name.charAt(0).toUpperCase() + name.slice(1)} Format`,
      category: 'string_formats',
      tags: ['string', 'format', 'validation'],
    });
  });

  console.log('Registered common validation schemas in global registry');
};

/**
 * Alias for validateFormValues for backward compatibility
 */
export const validateFormData = validateFormValues;
