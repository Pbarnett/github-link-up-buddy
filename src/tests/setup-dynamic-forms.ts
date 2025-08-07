/**
 * Test Setup Utilities for Dynamic Forms
 *
 * Mock factories and utilities for testing dynamic form configurations
 */

import type {
  FormConfiguration,
  FieldConfiguration,

/**
 * Creates a mock field configuration for testing
 */
export function createMockFieldConfiguration(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  const defaultConfig: FieldConfiguration = {
    id: 'test-field',
    name: 'testField',
    type: 'text',
    label: 'Test Field',
    placeholder: 'Enter test value',
    required: false,
    validation: {
      required: false,
    },
    visible: true,
    disabled: false,
    order: 0,
  };

  return {
    ...defaultConfig,
    ...overrides,
  };
}

/**
 * Creates a mock form configuration for testing
 */
export function createMockFormConfiguration(
  overrides: Partial<FormConfiguration> = {}
): FormConfiguration {
  const defaultConfig: FormConfiguration = {
    id: 'test-form',
    title: 'Test Form',
    description: 'Test form description',
    version: '1.0.0',
    fields: [
      createMockFieldConfiguration({
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
        validation: {
          required: true,
          minLength: 1,
        },
      }),
      createMockFieldConfiguration({
        id: 'email',
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        validation: {
          required: true,
        },
      }),
    ],
    sections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        fields: ['name', 'email'],
        visible: true,
        order: 0,
      },
    ],
    schema: 'auto',
    submitAction: 'api',
    apiEndpoint: '/api/forms/submit',
    theme: 'default',
    layout: 'vertical',
    showProgress: false,
    allowDraft: false,
    redirectOnSuccess: '/success',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...defaultConfig,
    ...overrides,
  };
}

/**
 * Creates a mock field configuration with specific field type
 */
export function createMockTextField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'text',
    ...overrides,
  });
}

export function createMockEmailField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'email',
    validation: {
      required: true,
    },
    ...overrides,
  });
}

export function createMockNumberField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'number',
    validation: {
      required: false,
      min: 0,
    },
    ...overrides,
  });
}

export function createMockSelectField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'select',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
    ],
    ...overrides,
  });
}

export function createMockCheckboxField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'checkbox',
    label: 'Accept terms',
    ...overrides,
  });
}

export function createMockDateField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'date',
    validation: {
      required: false,
    },
    ...overrides,
  });
}

export function createMockAirportField(
  overrides: Partial<FieldConfiguration> = {}
): FieldConfiguration {
  return createMockFieldConfiguration({
    type: 'airport-autocomplete',
    label: 'Airport',
    placeholder: 'Search airports...',
    validation: {
      required: true,
    },
    ...overrides,
  });
}

/**
 * Mock data generators for testing
 */
export const mockFormData = {
  validTextValue: 'Valid text input',
  validEmailValue: 'test@example.com',
  validNumberValue: 42,
  validDateValue: '2023-12-25',
  validAirportValue: {
    code: 'LAX',
    name: 'Los Angeles International Airport',
    city: 'Los Angeles',
    country: 'US',
  },
  invalidEmailValue: 'not-an-email',
  invalidNumberValue: 'not-a-number',
  invalidDateValue: 'invalid-date',
};

/**
 * Helper to create form validation test cases
 */
export function createValidationTestCase(
  field: FieldConfiguration,
  validValue: any,
  invalidValue: any
) {
  return {
    field,
    validValue,
    invalidValue,
    description: `${field.type} field validation`,
  };
}

/**
 * Default export with all utilities
 */
export default {
  createMockFieldConfiguration,
  createMockFormConfiguration,
  createMockTextField,
  createMockEmailField,
  createMockNumberField,
  createMockSelectField,
  createMockCheckboxField,
  createMockDateField,
  createMockAirportField,
  mockFormData,
  createValidationTestCase,
};
