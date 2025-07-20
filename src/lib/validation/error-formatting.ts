/**
 * Enhanced Zod Error Formatting Utilities
 * 
 * Implements Zod v4-inspired error formatting and prettification
 * for better user experience with validation errors
 */

import { ZodError, ZodIssue } from 'zod';

/**
 * Tree structure for nested error representation
 */
export interface ErrorTree {
  errors: string[];
  properties?: { [key: string]: ErrorTree };
  items?: (ErrorTree | undefined)[];
}

/**
 * Flattened error structure for simple forms
 */
export interface FlattenedErrors {
  formErrors: string[];
  fieldErrors: { [key: string]: string[] };
}

/**
 * Convert ZodError to a nested tree structure (inspired by Zod v4's treeifyError)
 */
export function treeifyError(error: ZodError): ErrorTree {
  const tree: ErrorTree = { errors: [] };

  error.issues.forEach((issue) => {
    if (issue.path.length === 0) {
      // Root level error
      tree.errors.push(issue.message);
    } else {
      // Navigate through the path to create nested structure
      let current = tree;
      
      for (let i = 0; i < issue.path.length; i++) {
        const segment = issue.path[i];
        const isLast = i === issue.path.length - 1;
        
        if (typeof segment === 'string') {
          // Property access
          if (!current.properties) current.properties = {};
          if (!current.properties[segment]) {
            current.properties[segment] = { errors: [] };
          }
          
          if (isLast) {
            current.properties[segment].errors.push(issue.message);
          } else {
            current = current.properties[segment];
          }
        } else if (typeof segment === 'number') {
          // Array index access
          if (!current.items) current.items = [];
          if (!current.items[segment]) {
            current.items[segment] = { errors: [] };
          }
          
          if (isLast) {
            current.items[segment]!.errors.push(issue.message);
          } else {
            current = current.items[segment]!;
          }
        }
      }
    }
  });

  return tree;
}

/**
 * Flatten ZodError for simple form handling (inspired by Zod v4's flattenError)
 */
export function flattenError(error: ZodError): FlattenedErrors {
  const formErrors: string[] = [];
  const fieldErrors: { [key: string]: string[] } = {};

  error.issues.forEach((issue) => {
    if (issue.path.length === 0) {
      formErrors.push(issue.message);
    } else {
      const fieldPath = issue.path.join('.');
      if (!fieldErrors[fieldPath]) {
        fieldErrors[fieldPath] = [];
      }
      fieldErrors[fieldPath].push(issue.message);
    }
  });

  return { formErrors, fieldErrors };
}

/**
 * Pretty print ZodError with visual indicators (inspired by Zod v4's prettifyError)
 */
export function prettifyError(error: ZodError): string {
  const lines: string[] = [];

  error.issues.forEach((issue) => {
    let line = `✖ ${issue.message}`;
    
    if (issue.path.length > 0) {
      const pathStr = issue.path
        .map((segment, index) => {
          if (typeof segment === 'number') {
            return `[${segment}]`;
          }
          return index === 0 ? segment : `.${segment}`;
        })
        .join('');
      
      line += `\n  → at ${pathStr}`;
    }
    
    lines.push(line);
  });

  return lines.join('\n');
}

/**
 * Enhanced error customization with better context
 */
export interface ErrorContext {
  issue: ZodIssue;
  input: any;
  path: (string | number)[];
}

/**
 * Custom error map type for enhanced error handling
 */
export type CustomErrorMap = (ctx: ErrorContext) => string | undefined;

/**
 * Create a custom error map with better context handling
 */
export function createCustomErrorMap(customMap: CustomErrorMap) {
  return (issue: ZodIssue, ctx: { data: any; path: (string | number)[] }) => {
    const result = customMap({
      issue,
      input: ctx.data,
      path: ctx.path
    });
    
    return result ? { message: result } : { message: issue.message || 'Validation failed' };
  };
}

/**
 * Pre-built error messages for common validation scenarios
 */
export const commonErrorMessages = {
  required: (fieldName: string) => `${fieldName} is required`,
  email: 'Please enter a valid email address',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  minValue: (min: number) => `Must be at least ${min}`,
  maxValue: (max: number) => `Must be no more than ${max}`,
  positiveNumber: 'Must be a positive number',
  dateInFuture: 'Date must be in the future',
  dateInPast: 'Date must be in the past',
  url: 'Please enter a valid URL',
  phone: 'Please enter a valid phone number',
  uuid: 'Please enter a valid UUID',
  strongPassword: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character'
};

/**
 * Localization support for error messages
 */
export interface ErrorLocalization {
  required: string;
  invalid_type: string;
  invalid_email: string;
  too_small: string;
  too_big: string;
  invalid_date: string;
  custom: string;
}

export const errorLocalizations: { [locale: string]: ErrorLocalization } = {
  en: {
    required: 'This field is required',
    invalid_type: 'Invalid input type',
    invalid_email: 'Please enter a valid email address',
    too_small: 'Input is too small',
    too_big: 'Input is too large',
    invalid_date: 'Please enter a valid date',
    custom: 'Validation failed'
  },
  es: {
    required: 'Este campo es obligatorio',
    invalid_type: 'Tipo de entrada inválido',
    invalid_email: 'Por favor ingrese una dirección de correo válida',
    too_small: 'La entrada es demasiado pequeña',
    too_big: 'La entrada es demasiado grande',
    invalid_date: 'Por favor ingrese una fecha válida',
    custom: 'Falló la validación'
  },
  fr: {
    required: 'Ce champ est obligatoire',
    invalid_type: 'Type de saisie invalide',
    invalid_email: 'Veuillez saisir une adresse email valide',
    too_small: 'La saisie est trop petite',
    too_big: 'La saisie est trop grande',
    invalid_date: 'Veuillez saisir une date valide',
    custom: 'Échec de la validation'
  }
};

/**
 * Create localized error map
 */
export function createLocalizedErrorMap(locale: string = 'en') {
  const localization = errorLocalizations[locale] || errorLocalizations.en;
  
  return (issue: ZodIssue) => {
    switch (issue.code) {
      case 'invalid_type':
        return { message: localization.invalid_type };
      case 'too_small':
        return { message: localization.too_small };
      case 'too_big':
        return { message: localization.too_big };
      case 'invalid_string':
        if (issue.validation === 'email') {
          return { message: localization.invalid_email };
        }
        break;
      case 'invalid_date':
        return { message: localization.invalid_date };
      case 'custom':
        return { message: issue.message || localization.custom };
    }
    
    return { message: issue.message || 'Validation error' };
  };
}
