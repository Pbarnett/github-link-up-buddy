import * as React from 'react';
/**
 * Conditional Validation System - Yup-like .when() for Zod
 *
 * Implements conditional validation similar to Yup's .when() method
 * while maintaining Zod's performance and type safety.
 */

import { z } from 'zod';
import type {
  FormConfiguration,
  FieldConfiguration,
} from '@/types/dynamic-forms';

interface ConditionalRule<T> {
  field: string | string[];
  is:
    | boolean
    | ((value: any) => boolean)
    | ((values: Record<string, any>) => boolean);
  then: (schema: z.ZodTypeAny) => z.ZodTypeAny;
  otherwise?: (schema: z.ZodTypeAny) => z.ZodTypeAny;
}

interface ConditionalContext {
  formData: Record<string, unknown>;
  fieldId: string;
  fieldValue: unknown;
}

class ConditionalValidationBuilder {
  private conditionalRules: ConditionalRule<any>[] = [];
  private baseSchema: z.ZodTypeAny;

  constructor(baseSchema: z.ZodTypeAny) {
    this.baseSchema = baseSchema;
  }

  /**
   * Add conditional validation rule (Yup-like .when())
   */
  when<T>(
    field: string | string[],
    options: {
      is:
        | boolean
        | ((value: any) => boolean)
        | ((values: Record<string, any>) => boolean);
      then: (schema: z.ZodTypeAny) => z.ZodTypeAny;
      otherwise?: (schema: z.ZodTypeAny) => z.ZodTypeAny;
    }
  ): ConditionalValidationBuilder {
    this.conditionalRules.push({
      field,
      is: options.is,
      then: options.then,
      otherwise: options.otherwise,
    });

    return this;
  }

  /**
   * Build the final conditional schema
   */
  build(): z.ZodTypeAny {
    if (this.conditionalRules.length === 0) {
      return this.baseSchema;
    }

    // Create a refined schema that applies conditional logic
    return this.baseSchema.superRefine((value, ctx) => {
      // Get form data from context (requires custom parsing context)
      const formData = (ctx as any).formData || {};

      this.conditionalRules.forEach(rule => {
        const shouldApplyThen = this.evaluateCondition(rule, formData, value);
        const targetSchema = shouldApplyThen
          ? rule.then(this.baseSchema)
          : rule.otherwise
            ? rule.otherwise(this.baseSchema)
            : this.baseSchema;

        // Apply the conditional schema
        const result = targetSchema.safeParse(value);
        if (!result.success) {
          result.error.errors.forEach(error => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: error.message,
              path: error.path,
            });
          });
        }
      });
    });
  }

  /**
   * Evaluate conditional rule
   */
  private evaluateCondition(
    rule: ConditionalRule<any>,
    formData: Record<string, unknown>,
    currentValue: unknown
  ): boolean {
    const fieldNames = Array.isArray(rule.field) ? rule.field : [rule.field];

    if (typeof rule.is === 'boolean') {
      return rule.is;
    }

    if (typeof rule.is === 'function') {
      if (fieldNames.length === 1) {
        const fieldValue = formData[fieldNames[0]];
        return rule.is(fieldValue as any);
      } else {
        // Multiple field dependency
        const fieldValues: Record<string, any> = {};
        fieldNames.forEach(fieldName => {
          fieldValues[fieldName] = formData[fieldName];
        });
        return (rule.is as (values: Record<string, any>) => boolean)(fieldValues);
      }
    }

    return false;
  }
}

/**
 * Enhanced Zod schema factory with conditional validation
 */
class ConditionalSchemaFactory {
  /**
   * Create conditional string schema
   */
  static conditionalString(): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(z.string());
  }

  /**
   * Create conditional number schema
   */
  static conditionalNumber(): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(z.number());
  }

  /**
   * Create conditional boolean schema
   */
  static conditionalBoolean(): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(z.boolean());
  }

  /**
   * Create conditional array schema
   */
  static conditionalArray<T>(
    itemSchema: z.ZodTypeAny
  ): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(z.array(itemSchema));
  }

  /**
   * Create conditional object schema
   */
  static conditionalObject(
    shape: Record<string, z.ZodTypeAny>
  ): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(z.object(shape));
  }

  /**
   * Wrap existing schema with conditional logic
   */
  static conditional<T extends z.ZodTypeAny>(
    schema: T
  ): ConditionalValidationBuilder {
    return new ConditionalValidationBuilder(schema);
  }
}

/**
 * Advanced conditional form schema generator
 */
export class ConditionalFormSchemaGenerator {
  private formConfig: FormConfiguration;
  private conditionalSchemas: Map<string, z.ZodTypeAny> = new Map();

  constructor(formConfig: FormConfiguration) {
    this.formConfig = formConfig;
  }

  /**
   * Generate form schema with conditional validation
   */
  generateSchema(): z.ZodTypeAny {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    this.formConfig.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldSchema = this.generateFieldSchema(field);
        schemaFields[field.id] = fieldSchema;
      });
    });

    // Create object schema with custom refinement for cross-field validation
    const objectSchema = z.object(schemaFields);
    return objectSchema.superRefine((data, ctx) => {
      // Inject form data into context for conditional validation
      (ctx as any).formData = data;
    });
  }

  /**
   * Generate field schema with conditional logic
   */
  private generateFieldSchema(field: FieldConfiguration): z.ZodTypeAny {
    // Start with base schema
    let baseSchema = this.createBaseSchema(field);

    // Apply conditional logic if present
    if (field.conditional) {
      baseSchema = this.applyConditionalLogic(baseSchema, field);
    }

    // Apply validation rules
    if (field.validation) {
      baseSchema = this.applyValidationRules(baseSchema, field.validation);
    }

    // Handle required/optional
    if (field.validation?.required) {
      if (baseSchema instanceof z.ZodString) {
        baseSchema = baseSchema.min(1, `${field.label} is required`);
      }
    } else {
      baseSchema = baseSchema.optional();
    }

    return baseSchema;
  }

  /**
   * Create base schema for field type
   */
  private createBaseSchema(field: FieldConfiguration): z.ZodTypeAny {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'textarea':
        return z.string();

      case 'number':
        return z.number();

      case 'checkbox':
      case 'switch':
        return z.boolean();

      case 'select':
        if (field.options) {
          const values = field.options.map(opt => opt.value);
          return z.enum(values as [string, ...string[]]);
        }
        return z.string();

      case 'multi-select':
        return z.array(z.string());

      default:
        return z.unknown();
    }
  }

  /**
   * Apply conditional logic to schema
   */
  private applyConditionalLogic(
    schema: z.ZodTypeAny,
    field: FieldConfiguration
  ): z.ZodTypeAny {
    if (!field.conditional) return schema;

    const conditional = ConditionalSchemaFactory.conditional(schema);

    // Handle showWhen condition
    if (field.conditional.showWhen) {
      conditional.when(field.conditional.showWhen.field, {
        is: value =>
          this.evaluateConditionRule(field.conditional!.showWhen!, value),
        then: schema => schema,
        otherwise: schema => z.undefined(),
      });
    }

    // Handle hideWhen condition
    if (field.conditional.hideWhen) {
      conditional.when(field.conditional.hideWhen.field, {
        is: value =>
          this.evaluateConditionRule(field.conditional!.hideWhen!, value),
        then: schema => z.undefined(),
        otherwise: schema => schema,
      });
    }

    // Handle enableWhen/disableWhen (affects validation, not visibility)
    if (field.conditional.enableWhen) {
      conditional.when(field.conditional.enableWhen.field, {
        is: value =>
          this.evaluateConditionRule(field.conditional!.enableWhen!, value),
        then: schema => schema,
        otherwise: schema => schema.optional(),
      });
    }

    return conditional.build();
  }

  /**
   * Evaluate condition rule
   */
  private evaluateConditionRule(rule: any, value: unknown): boolean {
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'not_equals':
        return value !== rule.value;
      case 'contains':
        return typeof value === 'string' && value.includes(rule.value);
      case 'not_contains':
        return typeof value === 'string' && !value.includes(rule.value);
      case 'oneOf':
        return Array.isArray(rule.value) && rule.value.includes(value);
      case 'notOneOf':
        return Array.isArray(rule.value) && !rule.value.includes(value);
      case 'greater':
        return typeof value === 'number' && value > rule.value;
      case 'less':
        return typeof value === 'number' && value < rule.value;
      case 'greaterOrEqual':
        return typeof value === 'number' && value >= rule.value;
      case 'lessOrEqual':
        return typeof value === 'number' && value <= rule.value;
      default:
        return false;
    }
  }

  /**
   * Apply validation rules to schema
   */
  private applyValidationRules(
    schema: z.ZodTypeAny,
    validation: any
  ): z.ZodTypeAny {
    if (schema instanceof z.ZodString) {
      let stringSchema = schema as z.ZodString;

      if (validation.email) {
        stringSchema = stringSchema.email('Invalid email address');
      }
      if (validation.minLength) {
        stringSchema = stringSchema.min(validation.minLength);
      }
      if (validation.maxLength) {
        stringSchema = stringSchema.max(validation.maxLength);
      }
      if (validation.pattern) {
        stringSchema = stringSchema.regex(new RegExp(validation.pattern));
      }

      return stringSchema;
    }

    if (schema instanceof z.ZodNumber) {
      let numberSchema = schema as z.ZodNumber;

      if (validation.min !== undefined) {
        numberSchema = numberSchema.min(validation.min);
      }
      if (validation.max !== undefined) {
        numberSchema = numberSchema.max(validation.max);
      }

      return numberSchema;
    }

    return schema;
  }
}

// Example usage patterns
export const conditionalExamples = {
  // Employment form example
  employmentForm: () => {
    const employmentType = z.enum(['employed', 'self-employed', 'unemployed']);

    const companyName = ConditionalSchemaFactory.conditionalString()
      .when('employmentType', {
        is: (value: any) => value === 'employed',
        then: schema =>
          (schema as z.ZodString).min(1, 'Company name is required for employed individuals'),
        otherwise: schema => schema.optional(),
      })
      .build();

    return z.object({
      employmentType,
      companyName,
    });
  },

  // Address form with country-specific validation
  addressForm: () => {
    const country = z.string();

    const zipCode = ConditionalSchemaFactory.conditionalString()
      .when(['country', 'state'], {
        is: ({ country, state }: Record<string, any>) => country === 'US' && state === 'CA',
        then: schema => (schema as z.ZodString).regex(/^\d{5}$/, 'Must be 5 digits for US/CA'),
        otherwise: schema => schema.optional(),
      })
      .build();

    return z.object({
      country,
      state: z.string(),
      zipCode,
    });
  },

  // Multi-step form validation
  multiStepForm: () => {
    const step = z.number();

    const email = ConditionalSchemaFactory.conditionalString()
      .when('step', {
        is: (step: any) => step >= 1,
        then: schema => (schema as z.ZodString).email('Valid email required'),
        otherwise: schema => schema.optional(),
      })
      .build();

    const password = ConditionalSchemaFactory.conditionalString()
      .when('step', {
        is: (step: any) => step >= 2,
        then: schema => (schema as z.ZodString).min(8, 'Password must be at least 8 characters'),
        otherwise: schema => schema.optional(),
      })
      .build();

    return z.object({
      step,
      email,
      password,
    });
  },
};

export { ConditionalValidationBuilder, ConditionalSchemaFactory };
