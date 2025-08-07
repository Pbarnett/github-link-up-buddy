/**
 * Advanced Zod Schema Caching System
 *
 * Multi-layer caching strategy for dynamic form validation:
 * 1. Field-level schema cache
 * 2. Form-level schema cache
 * 3. Conditional schema cache
 * 4. Memory-efficient cleanup
 */

import type {
  FormConfiguration,
  FieldConfiguration,

interface CacheEntry<T> {
  schema: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

interface SchemaCache {
  fieldSchemas: Map<string, CacheEntry<z.ZodTypeAny>>;
  formSchemas: Map<string, CacheEntry<z.ZodObject<any>>>;
  conditionalSchemas: Map<string, CacheEntry<z.ZodTypeAny>>;
  compoundSchemas: Map<string, CacheEntry<z.ZodObject<any>>>;
}

class ZodSchemaCache {
  private cache: SchemaCache;
  private maxSize: number;
  private maxAge: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    options: {
      maxSize?: number;
      maxAge?: number; // in milliseconds
      cleanupInterval?: number;
    } = {}
  ) {
    this.maxSize = options.maxSize || 1000;
    this.maxAge = options.maxAge || 30 * 60 * 1000; // 30 minutes

    this.cache = {
      fieldSchemas: new Map(),
      formSchemas: new Map(),
      conditionalSchemas: new Map(),
      compoundSchemas: new Map(),
    };

    // Start cleanup interval
    if (options.cleanupInterval !== 0) {
      this.cleanupInterval = setInterval(
        () => {
          this.cleanup();
        },
        options.cleanupInterval || 5 * 60 * 1000
      ); // 5 minutes
    }
  }

  /**
   * Generate cache key for field schema
   */
  private generateFieldKey(field: FieldConfiguration): string {
    const keyParts = [
      field.type,
      field.validation?.required ? 'req' : 'opt',
      field.validation?.minLength || '',
      field.validation?.maxLength || '',
      field.validation?.min || '',
      field.validation?.max || '',
      field.validation?.pattern || '',
      field.validation?.email ? 'email' : '',
      field.validation?.url ? 'url' : '',
      field.validation?.custom ? 'custom' : '',
      field.options?.map(opt => `${opt.value}`).join(',') || '',
    ];

    return keyParts.join('|');
  }

  /**
   * Generate cache key for form schema
   */
  private generateFormKey(config: FormConfiguration): string {
    const fieldKeys = config.sections
      .flatMap(section => section.fields)
      .map(field => this.generateFieldKey(field))
      .sort() // Ensure consistent ordering
      .join('::');

    return `form_${config.id}_${fieldKeys}`;
  }

  /**
   * Get cached field schema or generate new one
   */
  getFieldSchema(field: FieldConfiguration): z.ZodTypeAny {
    const key = this.generateFieldKey(field);
    const cached = this.cache.fieldSchemas.get(key);

    if (cached && !this.isExpired(cached)) {
      this.updateAccess(cached);
      return cached.schema;
    }

    // Generate new schema
    const schema = this.generateFieldSchema(field);
    this.setFieldSchema(key, schema);
    return schema;
  }

  /**
   * Get cached form schema or generate new one
   */
  getFormSchema(config: FormConfiguration): z.ZodObject<any> {
    const key = this.generateFormKey(config);
    const cached = this.cache.formSchemas.get(key);

    if (cached && !this.isExpired(cached)) {
      this.updateAccess(cached);
      return cached.schema;
    }

    // Generate new schema
    const schema = this.generateFormSchema(config);
    this.setFormSchema(key, schema);
    return schema;
  }

  /**
   * Get conditional schema based on field dependencies
   */
  getConditionalSchema(
    baseSchema: z.ZodTypeAny,
    conditions: Record<string, unknown>
  ): z.ZodTypeAny {
    const conditionKey = JSON.stringify(conditions);
    const key = `${baseSchema.constructor.name}_${conditionKey}`;

    const cached = this.cache.conditionalSchemas.get(key);
    if (cached && !this.isExpired(cached)) {
      this.updateAccess(cached);
      return cached.schema;
    }

    // Generate conditional schema
    const schema = this.applyConditionalLogic(baseSchema, conditions);
    this.setConditionalSchema(key, schema);
    return schema;
  }

  /**
   * Cache field schema
   */
  private setFieldSchema(key: string, schema: z.ZodTypeAny): void {
    this.ensureSpace(this.cache.fieldSchemas);
    this.cache.fieldSchemas.set(key, {
      schema,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Cache form schema
   */
  private setFormSchema(key: string, schema: z.ZodObject<any>): void {
    this.ensureSpace(this.cache.formSchemas);
    this.cache.formSchemas.set(key, {
      schema,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Cache conditional schema
   */
  private setConditionalSchema(key: string, schema: z.ZodTypeAny): void {
    this.ensureSpace(this.cache.conditionalSchemas);
    this.cache.conditionalSchemas.set(key, {
      schema,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Generate field schema (your existing logic)
   */
  private generateFieldSchema(field: FieldConfiguration): z.ZodTypeAny {
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
          stringSchema = stringSchema.min(field.validation.minLength);
        }
        if (field.validation?.maxLength) {
          stringSchema = stringSchema.max(field.validation.maxLength);
        }
        if (field.validation?.pattern) {
          stringSchema = stringSchema.regex(
            new RegExp(field.validation.pattern)
          );
        }

        schema = stringSchema;
        break;
      }

      case 'number': {
        let numberSchema = z.number();

        if (field.validation?.min !== undefined) {
          numberSchema = numberSchema.min(field.validation.min);
        }
        if (field.validation?.max !== undefined) {
          numberSchema = numberSchema.max(field.validation.max);
        }

        schema = numberSchema;
        break;
      }

      case 'checkbox':
      case 'switch':
        schema = z.boolean();
        break;

      case 'select':
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
    if (field.validation?.required) {
      if (schema instanceof z.ZodString) {
        schema = schema.min(1, 'This field is required');
      } else if (schema instanceof z.ZodArray) {
        schema = schema.min(1, 'At least one option must be selected');
      }
    } else {
      schema = schema.optional();
    }

    return schema;
  }

  /**
   * Generate form schema
   */
  private generateFormSchema(config: FormConfiguration): z.ZodObject<any> {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    config.sections.forEach(section => {
      section.fields.forEach(field => {
        const fieldSchema = this.getFieldSchema(field);
        schemaFields[field.id] = fieldSchema;
      });
    });

    return z.object(schemaFields);
  }

  /**
   * Apply conditional logic to schema
   */
  private applyConditionalLogic(
    schema: z.ZodTypeAny,
    conditions: Record<string, unknown>
  ): z.ZodTypeAny {
    // Implement conditional logic based on your requirements
    // This is a simplified example
    return schema;
  }

  /**
   * Check if cache entry is expired
   */
  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > this.maxAge;
  }

  /**
   * Update access statistics
   */
  private updateAccess(entry: CacheEntry<any>): void {
    entry.accessCount++;
    entry.lastAccessed = Date.now();
  }

  /**
   * Ensure cache doesn't exceed max size
   */
  private ensureSpace(cache: Map<string, CacheEntry<any>>): void {
    if (cache.size >= this.maxSize) {
      // Remove least recently used entries
      const entries = Array.from(cache.entries()).sort(
        (a, b) => a[1].lastAccessed - b[1].lastAccessed
      );

      const toRemove = Math.floor(this.maxSize * 0.2); // Remove 20%
      for (let i = 0; i < toRemove; i++) {
        cache.delete(entries[i][0]);
      }
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();

    [
      this.cache.fieldSchemas,
      this.cache.formSchemas,
      this.cache.conditionalSchemas,
      this.cache.compoundSchemas,
    ].forEach(cache => {
      for (const [key, entry] of cache.entries()) {
        if (now - entry.timestamp > this.maxAge) {
          cache.delete(key);
        }
      }
    });
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      fieldSchemas: this.cache.fieldSchemas.size,
      formSchemas: this.cache.formSchemas.size,
      conditionalSchemas: this.cache.conditionalSchemas.size,
      compoundSchemas: this.cache.compoundSchemas.size,
      totalEntries:
        this.cache.fieldSchemas.size +
        this.cache.formSchemas.size +
        this.cache.conditionalSchemas.size +
        this.cache.compoundSchemas.size,
    };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.fieldSchemas.clear();
    this.cache.formSchemas.clear();
    this.cache.conditionalSchemas.clear();
    this.cache.compoundSchemas.clear();
  }

  /**
   * Destroy cache and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clearCache();
  }
}

// Global cache instance
export const zodSchemaCache = new ZodSchemaCache({
  maxSize: 1000,
  maxAge: 30 * 60 * 1000, // 30 minutes
  cleanupInterval: 5 * 60 * 1000, // 5 minutes
});

// React hook for using cached schemas
export const useCachedSchema = (config: FormConfiguration) => {
  return zodSchemaCache.getFormSchema(config);
};

// Hook for field-level caching
export const useCachedFieldSchema = (field: FieldConfiguration) => {
  return zodSchemaCache.getFieldSchema(field);
};
