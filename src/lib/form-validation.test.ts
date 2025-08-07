/**
 * Form Validation Tests
 *
 * Unit tests for the form validation utilities and Zod schema generation
 */

import {
  generateZodSchema,
  generateFieldSchema,
  validateFieldValue,
  validateFormValues,
  getDefaultValues,
./form-validation';
import {
  createMockFormConfiguration,
  createMockFieldConfiguration,

describe('Form Validation', () => {
  describe('generateFieldSchema', () => {
    it('should generate text field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'text',
        validation: { required: true, minLength: 3, maxLength: 10 },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid value
      expect(() => schema!.parse('hello')).not.toThrow();

      // Test invalid values
      expect(() => schema!.parse('')).toThrow(); // required
      expect(() => schema!.parse('hi')).toThrow(); // too short
      expect(() => schema!.parse('this is too long')).toThrow(); // too long
    });

    it('should generate email field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'email',
        validation: { required: true },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid email
      expect(() => schema!.parse('test@example.com')).not.toThrow();

      // Test invalid emails
      expect(() => schema!.parse('invalid-email')).toThrow();
      expect(() => schema!.parse('')).toThrow();
    });

    it('should generate number field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'number',
        validation: { required: true, min: 1, max: 100 },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid numbers
      expect(() => schema!.parse(50)).not.toThrow();
      expect(() => schema!.parse(1)).not.toThrow();
      expect(() => schema!.parse(100)).not.toThrow();

      // Test invalid numbers
      expect(() => schema!.parse(0)).toThrow(); // too small
      expect(() => schema!.parse(101)).toThrow(); // too large
    });

    it('should generate checkbox field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'checkbox',
        validation: { required: true },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid values
      expect(() => schema!.parse(true)).not.toThrow();

      // Test invalid value (required checkbox must be true)
      expect(() => schema!.parse(false)).toThrow();
    });

    it('should generate select field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'select',
        options: [
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
        ],
        validation: { required: true },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid values
      expect(() => schema!.parse('opt1')).not.toThrow();
      expect(() => schema!.parse('opt2')).not.toThrow();

      // Test invalid value
      expect(() => schema!.parse('')).toThrow();
    });

    it('should generate date field schema', () => {
      const field = createMockFieldConfiguration({
        type: 'date',
        validation: { required: true },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid dates
      expect(() => schema!.parse('2023-12-25')).not.toThrow();
      expect(() => schema!.parse('2023-01-01')).not.toThrow();

      // Test invalid dates
      expect(() => schema!.parse('invalid-date')).toThrow();
      expect(() => schema!.parse('')).toThrow();
    });

    it('should generate airport autocomplete schema', () => {
      const field = createMockFieldConfiguration({
        type: 'airport-autocomplete',
        validation: { required: true },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test valid airport object
      expect(() =>
        schema!.parse({
          code: 'LAX',
          name: 'Los Angeles International Airport',
          city: 'Los Angeles',
          country: 'US',
        })
      ).not.toThrow();

      // Test invalid airport object
      expect(() =>
        schema!.parse({
          code: '',
          name: '',
        })
      ).toThrow();
    });

    it('should handle optional fields', () => {
      const field = createMockFieldConfiguration({
        type: 'text',
        validation: { required: false },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Should not throw for undefined/empty values
      expect(() => schema!.parse(undefined)).not.toThrow();
      expect(() => schema!.parse('')).not.toThrow();
    });

    it('should return null for non-input field types', () => {
      const headerField = createMockFieldConfiguration({
        type: 'section-header',
      });

      const dividerField = createMockFieldConfiguration({
        type: 'divider',
      });

      expect(generateFieldSchema(headerField)).toBeNull();
      expect(generateFieldSchema(dividerField)).toBeNull();
    });

    it('should handle custom validation rules', () => {
      const field = createMockFieldConfiguration({
        type: 'text',
        validation: {
          required: true,
          custom: 'return value.includes("test");',
          message: 'Value must contain "test"',
        },
      });

      const schema = generateFieldSchema(field);
      expect(schema).toBeDefined();

      // Test custom validation
      expect(() => schema!.parse('test value')).not.toThrow();
      expect(() => schema!.parse('invalid')).toThrow();
    });
  });

  describe('generateZodSchema', () => {
    it('should generate schema for form configuration', () => {
      const configuration = createMockFormConfiguration({
        sections: [
          {
            id: 'section-1',
            title: 'Test Section',
            fields: [
              {
                id: 'firstName',
                type: 'text',
                label: 'First Name',
                validation: { required: true },
              },
              {
                id: 'email',
                type: 'email',
                label: 'Email',
                validation: { required: true },
              },
              {
                id: 'age',
                type: 'number',
                label: 'Age',
                validation: { required: false, min: 18 },
              },
            ],
          },
        ],
      });

      const schema = generateZodSchema(configuration);
      expect(schema).toBeDefined();

      // Test valid data
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        age: 25,
      };
      expect(() => schema.parse(validData)).not.toThrow();

      // Test invalid data
      const invalidData = {
        firstName: '',
        email: 'invalid-email',
        age: 15,
      };
      expect(() => schema.parse(invalidData)).toThrow();
    });

    it('should handle multiple sections', () => {
      const configuration = createMockFormConfiguration({
        sections: [
          {
            id: 'personal',
            title: 'Personal Info',
            fields: [
              {
                id: 'firstName',
                type: 'text',
                label: 'First Name',
                validation: { required: true },
              },
            ],
          },
          {
            id: 'contact',
            title: 'Contact Info',
            fields: [
              {
                id: 'email',
                type: 'email',
                label: 'Email',
                validation: { required: true },
              },
            ],
          },
        ],
      });

      const schema = generateZodSchema(configuration);

      const validData = {
        firstName: 'John',
        email: 'john@example.com',
      };
      expect(() => schema.parse(validData)).not.toThrow();
    });
  });

  describe('validateFieldValue', () => {
    it('should validate individual field values', () => {
      const field = createMockFieldConfiguration({
        type: 'email',
        validation: { required: true },
      });

      // Valid email
      const validResult = validateFieldValue(field, 'test@example.com');
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBeUndefined();

      // Invalid email
      const invalidResult = validateFieldValue(field, 'invalid-email');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBeDefined();
    });

    it('should handle validation errors gracefully', () => {
      const field = createMockFieldConfiguration({
        type: 'text',
        validation: { required: true },
      });

      const result = validateFieldValue(field, '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('validateFormValues', () => {
    it('should validate complete form data', () => {
      const configuration = createMockFormConfiguration({
        sections: [
          {
            id: 'section-1',
            title: 'Test Section',
            fields: [
              {
                id: 'name',
                type: 'text',
                label: 'Name',
                validation: { required: true },
              },
              {
                id: 'email',
                type: 'email',
                label: 'Email',
                validation: { required: true },
              },
            ],
          },
        ],
      });

      // Valid data
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
      };
      const validResult = validateFormValues(configuration, validData);
      expect(validResult.isValid).toBe(true);
      expect(Object.keys(validResult.errors)).toHaveLength(0);

      // Invalid data
      const invalidData = {
        name: '',
        email: 'invalid-email',
      };
      const invalidResult = validateFormValues(configuration, invalidData);
      expect(invalidResult.isValid).toBe(false);
      expect(Object.keys(invalidResult.errors).length).toBeGreaterThan(0);
    });
  });

  describe('getDefaultValues', () => {
    it('should extract default values from configuration', () => {
      const configuration = createMockFormConfiguration({
        sections: [
          {
            id: 'section-1',
            title: 'Test Section',
            fields: [
              {
                id: 'name',
                type: 'text',
                label: 'Name',
                defaultValue: 'John Doe',
              },
              {
                id: 'subscribe',
                type: 'checkbox',
                label: 'Subscribe',
                // No default value - should use type default
              },
              {
                id: 'country',
                type: 'select',
                label: 'Country',
                defaultValue: 'US',
              },
            ],
          },
        ],
      });

      const defaults = getDefaultValues(configuration);

      expect(defaults.name).toBe('John Doe');
      expect(defaults.subscribe).toBe(false); // checkbox default
      expect(defaults.country).toBe('US');
    });

    it('should provide type-appropriate defaults', () => {
      const configuration = createMockFormConfiguration({
        sections: [
          {
            id: 'section-1',
            title: 'Test Section',
            fields: [
              { id: 'text', type: 'text', label: 'Text' },
              { id: 'checkbox', type: 'checkbox', label: 'Checkbox' },
              { id: 'number', type: 'number', label: 'Number' },
              {
                id: 'multiSelect',
                type: 'multi-select',
                label: 'Multi Select',
              },
              { id: 'dateRange', type: 'date-range', label: 'Date Range' },
            ],
          },
        ],
      });

      const defaults = getDefaultValues(configuration);

      expect(defaults.text).toBe('');
      expect(defaults.checkbox).toBe(false);
      expect(defaults.number).toBe(0);
      expect(defaults.multiSelect).toEqual([]);
      expect(defaults.dateRange).toEqual({ from: undefined, to: undefined });
    });
  });
});
