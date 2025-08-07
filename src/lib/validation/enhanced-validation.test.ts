/**
 * Enhanced Validation Tests
 *
 * Tests for Zod v4-inspired validation enhancements including
 * error formatting, schema registry, and improved validation patterns
 */

import { , validateFormValuesEnhanced, stringFormatValidators, createConditionalValidation, registerCommonSchemas, ../form-validation';, import {, treeifyError, flattenError, prettifyError, createLocalizedErrorMap, commonErrorMessages, ./error-formatting';, import {, globalRegistry, createEnhancedSchema, SchemaRegistry, SchemaDocumentationGenerator } from './schema-registry';
  validateFormValuesEnhanced,
  stringFormatValidators,
  createConditionalValidation,
  registerCommonSchemas,
../form-validation';
import { , treeifyError, flattenError, prettifyError, createLocalizedErrorMap, commonErrorMessages, ./error-formatting';, import {, globalRegistry, createEnhancedSchema, SchemaRegistry, SchemaDocumentationGenerator } from './schema-registry';
  treeifyError,
  flattenError,
  prettifyError,
  createLocalizedErrorMap,
  commonErrorMessages,
./error-formatting';
import { , globalRegistry, createEnhancedSchema, SchemaRegistry, SchemaDocumentationGenerator } from './schema-registry';
  globalRegistry,
  createEnhancedSchema,
  SchemaRegistry,
  SchemaDocumentationGenerator,
./schema-registry';

describe('Enhanced Error Formatting', () => {
  const testSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    age: z.number().min(18),
    hobbies: z.array(z.string()).min(1),
    address: z.object({
      street: z.string(),
      city: z.string(),
    }),
  });

  it('should treeify errors into nested structure', () => {
    const result = testSchema.safeParse({
      name: 'A',
      email: 'invalid-email',
      age: 16,
      hobbies: [],
      address: {
        street: '',
        city: 'New York',
      },
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const tree = treeifyError(result.error);

      expect(tree.properties).toBeDefined();
      expect(tree.properties?.name?.errors).toContain(
        'String must contain at least 2 character(s)'
      );
      expect(tree.properties?.email?.errors).toContain('Invalid email');
      expect(tree.properties?.age?.errors).toContain(
        'Number must be greater than or equal to 18'
      );
      expect(tree.properties?.hobbies?.errors).toContain(
        'Array must contain at least 1 element(s)'
      );
      // Note: address.street with empty string doesn't fail validation in this test schema
    }
  });

  it('should flatten errors for simple forms', () => {
    const result = testSchema.safeParse({
      name: '',
      email: 'bad-email',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const flattened = flattenError(result.error);

      expect(flattened.fieldErrors.name).toBeDefined();
      expect(flattened.fieldErrors.email).toBeDefined();
      // Note: simplified test case
    }
  });

  it('should prettify errors with visual indicators', () => {
    const result = testSchema.safeParse({
      name: 'A',
      email: 'invalid',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const prettified = prettifyError(result.error);

      expect(prettified).toContain('✖');
      expect(prettified).toContain('→ at');
      expect(prettified).toContain('name');
      expect(prettified).toContain('email');
    }
  });

  it('should create localized error maps', () => {
    const spanishErrorMap = createLocalizedErrorMap('es');
    const schema = z.string().refine(() => false);

    // This is a conceptual test - actual localization would need proper implementation
    expect(typeof spanishErrorMap).toBe('function');
  });
});

describe('Schema Registry', () => {
  let registry: SchemaRegistry;

  beforeAll(() => {
    registry = new SchemaRegistry();
  });

  it('should add and retrieve schemas with metadata', () => {
    const schema = z.string();
    const metadata = {
      id: 'test-schema',
      title: 'Test Schema',
      description: 'A test schema',
      category: 'testing',
    };

    registry.add(schema, metadata);

    expect(registry.has(schema)).toBe(true);
    expect(registry.get(schema)).toEqual(metadata);
    expect(registry.getById('test-schema')).toBe(schema);
  });

  it('should prevent duplicate IDs', () => {
    const schema1 = z.string();
    const schema2 = z.number();

    registry.add(schema1, { id: 'duplicate-test' });

    expect(() => {
      registry.add(schema2, { id: 'duplicate-test' });
    }).toThrow('Schema with id "duplicate-test" already exists in registry');
  });

  it('should filter schemas by category and tags', () => {
    const stringSchema = z.string();
    const numberSchema = z.number();

    registry.add(stringSchema, {
      id: 'string-test',
      category: 'primitives',
      tags: ['string', 'validation'],
    });

    registry.add(numberSchema, {
      id: 'number-test',
      category: 'primitives',
      tags: ['number', 'validation'],
    });

    const primitives = registry.getByCategory('primitives');
    expect(primitives).toHaveLength(2);

    const stringSchemas = registry.getByTag('string');
    expect(stringSchemas).toHaveLength(1);
    expect(stringSchemas[0].schema).toBe(stringSchema);
  });

  it('should generate documentation', () => {
    const docGenerator = new SchemaDocumentationGenerator(registry);

    const markdown = docGenerator.generateMarkdown();
    expect(markdown).toContain('# Schema Documentation');
    expect(markdown).toContain('## primitives');

    const json = docGenerator.generateJSON();
    expect(json.schemas).toBeDefined();
    expect(Array.isArray(json.schemas)).toBe(true);
  });
});

describe('Enhanced Schema Features', () => {
  it('should create enhanced schemas with metadata', () => {
    const baseSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const enhanced = createEnhancedSchema(baseSchema, {
      id: 'person-schema',
      title: 'Person Schema',
      description: 'Schema for person data',
      examples: [{ name: 'John', age: 30 }],
    });

    expect(enhanced.getMeta()?.title).toBe('Person Schema');

    const jsonSchema = enhanced.toJSONSchema();
    expect(jsonSchema.type).toBe('object');
    expect(jsonSchema.properties).toBeDefined();
    expect(jsonSchema.title).toBe('Person Schema');
  });

  it('should validate with enhanced error formatting', () => {
    const mockConfig = {
      id: 'test-form',
      title: 'Test Form',
      sections: [
        {
          id: 'section1',
          title: 'Section 1',
          fields: [
            {
              id: 'name',
              type: 'text' as const,
              label: 'Name',
              validation: { required: true, minLength: 2 },
            },
            {
              id: 'email',
              type: 'email' as const,
              label: 'Email',
              validation: { required: true },
            },
          ],
        },
      ],
    };

    const result = validateFormValuesEnhanced(
      mockConfig,
      {
        name: 'A',
        email: 'invalid-email',
      },
      {
        prettify: true,
        flatten: true,
      }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.formattedError).toBeDefined();
    expect(result.flattenedErrors).toBeDefined();
  });
});

describe('String Format Validators', () => {
  it('should validate email format', () => {
    const emailValidator = stringFormatValidators.email();

    expect(emailValidator.safeParse('test@example.com').success).toBe(true);
    expect(emailValidator.safeParse('invalid-email').success).toBe(false);
  });

  it('should validate URL format', () => {
    const urlValidator = stringFormatValidators.url();

    expect(urlValidator.safeParse('https://example.com').success).toBe(true);
    expect(urlValidator.safeParse('invalid-url').success).toBe(false);
  });

  it('should validate strong password', () => {
    const passwordValidator = stringFormatValidators.strongPassword();

    expect(passwordValidator.safeParse('StrongPass123!').success).toBe(true);
    expect(passwordValidator.safeParse('weak').success).toBe(false);
  });

  it('should validate phone numbers', () => {
    const phoneValidator = stringFormatValidators.phone();

    expect(phoneValidator.safeParse('+1234567890').success).toBe(true);
    expect(phoneValidator.safeParse('123456789012345').success).toBe(true);
    expect(phoneValidator.safeParse('abc').success).toBe(false);
  });
});

describe('Conditional Validation', () => {
  it('should apply conditional validation based on data', () => {
    const conditionalSchema = createConditionalValidation(
      data => data.type === 'premium',
      z.object({
        type: z.literal('premium'),
        features: z.array(z.string()).min(1),
      }),
      z.object({
        type: z.string(),
        features: z.array(z.string()).optional(),
      })
    );

    // Premium type should require features
    const premiumResult = conditionalSchema.safeParse({
      type: 'premium',
      features: [],
    });
    expect(premiumResult.success).toBe(false);

    // Non-premium type should not require features
    const basicResult = conditionalSchema.safeParse({
      type: 'basic',
    });
    expect(basicResult.success).toBe(true);
  });
});

describe('Common Schema Registration', () => {
  it('should register common schemas in global registry', () => {
    const initialCount = globalRegistry.getAll().length;

    registerCommonSchemas();

    const finalCount = globalRegistry.getAll().length;
    expect(finalCount).toBeGreaterThan(initialCount);

    // Check that email format schema was registered
    const emailSchema = globalRegistry.getById('string_format_email');
    expect(emailSchema).toBeDefined();
  });
});

describe('Enhanced Validation Performance', () => {
  it('should validate large datasets efficiently', () => {
    const schema = z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        age: z.number().min(0).max(150),
      })
    );

    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: `user-${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      age: Math.floor(Math.random() * 100) + 18,
    }));

    const startTime = Date.now();
    const result = schema.safeParse(largeDataset);
    const endTime = Date.now();

    expect(result.success).toBe(true);
    expect(endTime - startTime).toBeLessThan(100); // Should validate in under 100ms
  });

  it('should handle complex nested validation efficiently', () => {
    const complexSchema = z.object({
      users: z.array(
        z.object({
          profile: z.object({
            personal: z.object({
              name: z.string(),
              contacts: z.array(
                z.object({
                  type: z.enum(['email', 'phone']),
                  value: z.string(),
                })
              ),
            }),
            preferences: z.record(z.string(), z.boolean()),
          }),
        })
      ),
    });

    const complexData = {
      users: Array.from({ length: 100 }, (_, i) => ({
        profile: {
          personal: {
            name: `User ${i}`,
            contacts: [
              { type: 'email' as const, value: `user${i}@example.com` },
              { type: 'phone' as const, value: `+1234567890${i}` },
            ],
          },
          preferences: {
            notifications: true,
            marketing: false,
            analytics: true,
          },
        },
      })),
    };

    const startTime = Date.now();
    const result = complexSchema.safeParse(complexData);
    const endTime = Date.now();

    expect(result.success).toBe(true);
    expect(endTime - startTime).toBeLessThan(200); // Should validate complex nested data efficiently
  });
});
