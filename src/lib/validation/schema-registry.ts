/**
 * Schema Registry and Metadata System
 *
 * Implements Zod v4-inspired schema registry and metadata management
 * for better schema organization and documentation
 */

/**
 * Global metadata interface for schemas
 */
export interface GlobalMeta {
  id?: string;
  title?: string;
  description?: string;
  example?: unknown;
  examples?:
    | unknown[]
    | Record<string, { value: unknown; [k: string]: unknown }>;
  deprecated?: boolean;
  version?: string;
  category?: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Schema registry for managing schemas with metadata
 */
export class SchemaRegistry<TMeta = GlobalMeta> {
  private schemas = new Map<ZodSchema, TMeta>();
  private idMap = new Map<string, ZodSchema>();

  /**
   * Add a schema with metadata to the registry
   */
  add<T extends ZodSchema>(schema: T, metadata: TMeta): T {
    // Check for ID conflicts
    if (this.isGlobalMeta(metadata) && metadata.id) {
      if (this.idMap.has(metadata.id)) {
        throw new Error(
          `Schema with id "${metadata.id}" already exists in registry`
        );
      }
      this.idMap.set(metadata.id, schema);
    }

    this.schemas.set(schema, metadata);
    return schema;
  }

  /**
   * Get metadata for a schema
   */
  get<T extends ZodSchema>(schema: T): TMeta | undefined {
    return this.schemas.get(schema);
  }

  /**
   * Check if a schema exists in the registry
   */
  has<T extends ZodSchema>(schema: T): boolean {
    return this.schemas.has(schema);
  }

  /**
   * Remove a schema from the registry
   */
  remove<T extends ZodSchema>(schema: T): boolean {
    const metadata = this.schemas.get(schema);
    if (metadata && this.isGlobalMeta(metadata) && metadata.id) {
      this.idMap.delete(metadata.id);
    }
    return this.schemas.delete(schema);
  }

  /**
   * Clear all schemas from the registry
   */
  clear(): void {
    this.schemas.clear();
    this.idMap.clear();
  }

  /**
   * Get schema by ID
   */
  getById(id: string): ZodSchema | undefined {
    return this.idMap.get(id);
  }

  /**
   * Get all schemas with their metadata
   */
  getAll(): Array<{ schema: ZodSchema; metadata: TMeta }> {
    return Array.from(this.schemas.entries()).map(([schema, metadata]) => ({
      schema,
      metadata,
    }));
  }

  /**
   * Get schemas by category
   */
  getByCategory(
    category: string
  ): Array<{ schema: ZodSchema; metadata: TMeta }> {
    return this.getAll().filter(
      ({ metadata }) =>
        this.isGlobalMeta(metadata) && metadata.category === category
    );
  }

  /**
   * Get schemas by tag
   */
  getByTag(tag: string): Array<{ schema: ZodSchema; metadata: TMeta }> {
    return this.getAll().filter(
      ({ metadata }) =>
        this.isGlobalMeta(metadata) && metadata.tags?.includes(tag)
    );
  }

  /**
   * Type guard for GlobalMeta
   */
  private isGlobalMeta(metadata: TMeta): metadata is GlobalMeta & TMeta {
    return typeof metadata === 'object' && metadata !== null;
  }
}

/**
 * Global schema registry instance
 */
export const globalRegistry = new SchemaRegistry<GlobalMeta>();

/**
 * Enhanced schema wrapper with metadata support
 */
export class EnhancedSchema<T extends ZodType> {
  constructor(
    public schema: T,
    public metadata?: GlobalMeta
  ) {
    if (metadata) {
      globalRegistry.add(schema, metadata);
    }
  }

  /**
   * Add metadata to the schema
   */
  withMeta(metadata: GlobalMeta): EnhancedSchema<T> {
    return new EnhancedSchema(this.schema, { ...this.metadata, ...metadata });
  }

  /**
   * Add description to the schema
   */
  describe(description: string): EnhancedSchema<T> {
    return this.withMeta({ description });
  }

  /**
   * Parse with enhanced error context
   */
  parse(input: unknown) {
    try {
      return this.schema.parse(input);
    } catch (error) {
      // Add metadata context to error if needed
      throw error;
    }
  }

  /**
   * Safe parse with enhanced error context
   */
  safeParse(input: unknown) {
    return this.schema.safeParse(input);
  }

  /**
   * Get metadata
   */
  getMeta(): GlobalMeta | undefined {
    return this.metadata;
  }

  /**
   * Convert to JSON Schema representation
   */
  toJSONSchema(): any {
    const baseSchema = this.convertZodToJSONSchema(this.schema);

    if (this.metadata) {
      return {
        ...baseSchema,
        ...this.metadata,
      };
    }

    return baseSchema;
  }

  /**
   * Basic Zod to JSON Schema conversion
   * (Simplified version inspired by Zod v4's toJSONSchema)
   */
  private convertZodToJSONSchema(schema: ZodType): any {
    const def = (schema as any)._def;

    switch (def.typeName) {
      case 'ZodString':
        return { type: 'string' };
      case 'ZodNumber':
        return { type: 'number' };
      case 'ZodBoolean':
        return { type: 'boolean' };
      case 'ZodDate':
        return { type: 'string', format: 'date-time' };
      case 'ZodArray':
        return {
          type: 'array',
          items: this.convertZodToJSONSchema(def.type),
        };
      case 'ZodObject':
        const properties: any = {};
        const required: string[] = [];

        Object.entries(def.shape()).forEach(([key, value]: [string, any]) => {
          properties[key] = this.convertZodToJSONSchema(value);
          if (!value.isOptional()) {
            required.push(key);
          }
        });

        return {
          type: 'object',
          properties,
          required: required.length > 0 ? required : undefined,
          additionalProperties: false,
        };
      case 'ZodUnion':
        return {
          oneOf: def.options.map((option: ZodType) =>
            this.convertZodToJSONSchema(option)
          ),
        };
      case 'ZodEnum':
        return {
          type: 'string',
          enum: def.values,
        };
      case 'ZodOptional':
        return this.convertZodToJSONSchema(def.innerType);
      case 'ZodNullable':
        const innerSchema = this.convertZodToJSONSchema(def.innerType);
        return {
          oneOf: [innerSchema, { type: 'null' }],
        };
      default:
        return { type: 'string' }; // fallback
    }
  }
}

/**
 * Create an enhanced schema with metadata
 */
export function createEnhancedSchema<T extends ZodType>(
  schema: T,
  metadata?: GlobalMeta
): EnhancedSchema<T> {
  return new EnhancedSchema(schema, metadata);
}

/**
 * Registry for form schemas specifically
 */
export class FormSchemaRegistry extends SchemaRegistry<
  GlobalMeta & {
    formType?: 'creation' | 'update' | 'search' | 'filter';
    validationLevel?: 'strict' | 'lenient' | 'custom';
  }
> {
  /**
   * Get schemas by form type
   */
  getByFormType(formType: string) {
    return this.getAll().filter(
      ({ metadata }) => metadata.formType === formType
    );
  }

  /**
   * Get schemas by validation level
   */
  getByValidationLevel(level: string) {
    return this.getAll().filter(
      ({ metadata }) => metadata.validationLevel === level
    );
  }
}

/**
 * Global form schema registry
 */
export const formSchemaRegistry = new FormSchemaRegistry();

/**
 * Schema documentation generator
 */
export class SchemaDocumentationGenerator {
  constructor(private registry: SchemaRegistry) {}

  /**
   * Generate markdown documentation for all schemas
   */
  generateMarkdown(): string {
    const sections: string[] = [];
    const schemas = this.registry.getAll();

    sections.push('# Schema Documentation\n');

    // Group by category
    const categories = new Map<
      string,
      Array<{ schema: ZodSchema; metadata: GlobalMeta }>
    >();

    schemas.forEach(({ schema, metadata }) => {
      const category = (metadata as GlobalMeta).category || 'Uncategorized';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories
        .get(category)!
        .push({ schema, metadata: metadata as GlobalMeta });
    });

    // Generate documentation for each category
    categories.forEach((schemas, category) => {
      sections.push(`## ${category}\n`);

      schemas.forEach(({ schema, metadata }) => {
        sections.push(
          `### ${metadata.title || metadata.id || 'Unnamed Schema'}\n`
        );

        if (metadata.description) {
          sections.push(`${metadata.description}\n`);
        }

        if (metadata.deprecated) {
          sections.push(
            `> **⚠️ Deprecated**: This schema is deprecated and may be removed in future versions.\n`
          );
        }

        if (metadata.examples) {
          sections.push('**Examples:**\n');
          if (Array.isArray(metadata.examples)) {
            metadata.examples.forEach((example, index) => {
              sections.push(`${index + 1}. \`${JSON.stringify(example)}\``);
            });
          }
          sections.push('');
        }

        if (metadata.tags && metadata.tags.length > 0) {
          sections.push(
            `**Tags:** ${metadata.tags.map(tag => `\`${tag}\``).join(', ')}\n`
          );
        }

        sections.push('---\n');
      });
    });

    return sections.join('\n');
  }

  /**
   * Generate JSON documentation
   */
  generateJSON(): any {
    return {
      schemas: this.registry.getAll().map(({ schema, metadata }) => ({
        id: (metadata as GlobalMeta).id,
        metadata: metadata as GlobalMeta,
        jsonSchema: new EnhancedSchema(
          schema,
          metadata as GlobalMeta
        ).toJSONSchema(),
      })),
    };
  }
}
