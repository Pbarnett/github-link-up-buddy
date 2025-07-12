/**
 * Test helper utilities for dynamic forms
 * 
 * Provides mock factories for form configurations and field configurations
 */

import type { 
  FormConfiguration, 
  FieldConfiguration, 
  FormSection, 
  ValidationRules,
  FieldType,
  FieldOption
} from '@/types/dynamic-forms';

/**
 * Create a mock form configuration with default values
 */
export const createMockFormConfiguration = (overrides: Partial<FormConfiguration> = {}): FormConfiguration => {
  return {
    id: 'test-form-1',
    name: 'Test Form',
    version: 1,
    sections: [
      {
        id: 'section-1',
        title: 'Test Section',
        description: 'A test section',
        fields: []
      }
    ],
    ...overrides
  };
};

/**
 * Create a mock field configuration with default values
 */
export const createMockFieldConfiguration = (overrides: Partial<FieldConfiguration> = {}): FieldConfiguration => {
  return {
    id: 'test-field-1',
    type: 'text',
    label: 'Test Field',
    placeholder: 'Enter test value',
    description: 'A test field',
    ...overrides
  };
};

/**
 * Create a mock form section with default values
 */
export const createMockFormSection = (overrides: Partial<FormSection> = {}): FormSection => {
  return {
    id: 'test-section-1',
    title: 'Test Section',
    description: 'A test section',
    fields: [],
    ...overrides
  };
};

/**
 * Create mock validation rules
 */
export const createMockValidationRules = (overrides: Partial<ValidationRules> = {}): ValidationRules => {
  return {
    required: false,
    ...overrides
  };
};

/**
 * Create mock field options for select/radio fields
 */
export const createMockFieldOptions = (count: number = 3): FieldOption[] => {
  return Array.from({ length: count }, (_, index) => ({
    label: `Option ${index + 1}`,
    value: `option_${index + 1}`,
    description: `Description for option ${index + 1}`
  }));
};

/**
 * Create a complete form configuration with multiple field types for testing
 */
export const createCompleteTestForm = (): FormConfiguration => {
  return {
    id: 'complete-test-form',
    name: 'Complete Test Form',
    version: 1,
    sections: [
      {
        id: 'basic-fields',
        title: 'Basic Fields',
        fields: [
          createMockFieldConfiguration({
            id: 'name',
            type: 'text',
            label: 'Full Name',
            validation: { required: true, minLength: 2, maxLength: 50 }
          }),
          createMockFieldConfiguration({
            id: 'email',
            type: 'email',
            label: 'Email Address',
            validation: { required: true, email: true }
          }),
          createMockFieldConfiguration({
            id: 'phone',
            type: 'phone',
            label: 'Phone Number',
            validation: { required: false, phone: true }
          }),
          createMockFieldConfiguration({
            id: 'age',
            type: 'number',
            label: 'Age',
            validation: { required: true, min: 18, max: 120 }
          })
        ]
      },
      {
        id: 'advanced-fields',
        title: 'Advanced Fields',
        fields: [
          createMockFieldConfiguration({
            id: 'country',
            type: 'select',
            label: 'Country',
            options: [
              { label: 'United States', value: 'US' },
              { label: 'Canada', value: 'CA' },
              { label: 'United Kingdom', value: 'GB' }
            ],
            validation: { required: true }
          }),
          createMockFieldConfiguration({
            id: 'birthdate',
            type: 'date',
            label: 'Birth Date',
            validation: { required: true }
          }),
          createMockFieldConfiguration({
            id: 'newsletter',
            type: 'checkbox',
            label: 'Subscribe to Newsletter',
            validation: { required: false }
          }),
          createMockFieldConfiguration({
            id: 'departure_airport',
            type: 'airport-autocomplete',
            label: 'Departure Airport',
            validation: { required: true }
          })
        ]
      }
    ]
  };
};

/**
 * Create field configurations of specific types for testing
 */
export const createFieldByType = (type: FieldType, overrides: Partial<FieldConfiguration> = {}): FieldConfiguration => {
  const baseConfig = createMockFieldConfiguration({ type, ...overrides });
  
  // Add type-specific defaults
  switch (type) {
    case 'select':
    case 'multi-select':
    case 'radio':
      return {
        ...baseConfig,
        options: createMockFieldOptions(3),
        ...overrides
      };
    
    case 'email':
      return {
        ...baseConfig,
        validation: { required: true, email: true },
        ...overrides
      };
    
    case 'phone':
      return {
        ...baseConfig,
        validation: { required: true, phone: true },
        ...overrides
      };
    
    case 'number':
    case 'slider':
      return {
        ...baseConfig,
        validation: { required: true, min: 0, max: 100 },
        ...overrides
      };
    
    case 'checkbox':
    case 'switch':
      return {
        ...baseConfig,
        validation: { required: false },
        ...overrides
      };
    
    case 'date':
    case 'datetime':
      return {
        ...baseConfig,
        validation: { required: true },
        ...overrides
      };
    
    default:
      return baseConfig;
  }
};

/**
 * Create mock form values that match a form configuration
 */
export const createMockFormValues = (configuration: FormConfiguration): Record<string, any> => {
  const values: Record<string, any> = {};
  
  configuration.sections.forEach(section => {
    section.fields.forEach(field => {
      // Skip non-input fields
      if (['section-header', 'divider'].includes(field.type)) {
        return;
      }
      
      // Create mock values based on field type
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'password':
          values[field.id] = 'Test value';
          break;
        case 'email':
          values[field.id] = 'test@example.com';
          break;
        case 'phone':
          values[field.id] = '+1234567890';
          break;
        case 'number':
        case 'slider':
          values[field.id] = 50;
          break;
        case 'checkbox':
        case 'switch':
          values[field.id] = true;
          break;
        case 'select':
        case 'country-select':
        case 'currency-select':
          values[field.id] = field.options?.[0]?.value || 'option1';
          break;
        case 'multi-select':
          values[field.id] = field.options?.slice(0, 2).map(opt => opt.value) || ['option1', 'option2'];
          break;
        case 'date':
        case 'datetime':
          values[field.id] = '2023-12-25';
          break;
        case 'date-range':
        case 'date-range-flexible':
          values[field.id] = { from: '2023-12-25', to: '2023-12-31' };
          break;
        case 'airport-autocomplete':
          values[field.id] = {
            code: 'LAX',
            name: 'Los Angeles International Airport',
            city: 'Los Angeles',
            country: 'US'
          };
          break;
        case 'address-group':
          values[field.id] = {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'US'
          };
          break;
        case 'rating':
          values[field.id] = 4;
          break;
        default:
          values[field.id] = 'default value';
      }
    });
  });
  
  return values;
};
