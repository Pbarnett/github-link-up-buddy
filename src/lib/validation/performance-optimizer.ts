/**
 * Performance Optimizer for Large-Scale Dynamic Form Validation
 *
 * Handles optimization for forms with hundreds of fields:
 * 1. Lazy schema compilation
 * 2. Incremental validation
 * 3. Field grouping and batching
 * 4. Memory-efficient processing
 */

import type {
  FormConfiguration,
  FieldConfiguration,

./schema-cache';

interface ValidationTask {
  fieldId: string;
  value: unknown;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
}

interface FieldGroup {
  id: string;
  fields: FieldConfiguration[];
  schema: z.ZodObject<any> | null;
  dependencies: string[];
}

interface ValidationResult {
  fieldId: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  executionTime: number;
}

class FormPerformanceOptimizer {
  private validationQueue: ValidationTask[] = [];
  private fieldGroups: Map<string, FieldGroup> = new Map();
  private schemaCache: Map<string, z.ZodSchema> = new Map(); // Add schema memoization
  private isProcessing = false;
  private batchSize = 50; // Process 50 fields at once
  private debounceMs = 100; // Debounce validation by 100ms
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor(private config: FormConfiguration) {
    this.initializeFieldGroups();
  }

  /**
   * Initialize field groups for optimal processing
   */
  private initializeFieldGroups(): void {
    const groups: FieldGroup[] = [];

    // Group fields by section and dependencies
    this.config.sections.forEach(section => {
      const sectionGroup: FieldGroup = {
        id: section.id,
        fields: [],
        schema: null,
        dependencies: [],
      };

      section.fields.forEach(field => {
        sectionGroup.fields.push(field);

        // Track dependencies for conditional validation
        if (field.conditional) {
          // Extract dependency fields from conditional logic
          const deps = this.extractDependencies(field.conditional);
          sectionGroup.dependencies.push(...deps);
        }
      });

      groups.push(sectionGroup);
    });

    // Further optimize by splitting large groups
    groups.forEach(group => {
      if (group.fields.length > this.batchSize) {
        this.splitLargeGroup(group);
      } else {
        this.fieldGroups.set(group.id, group);
      }
    });
  }

  /**
   * Split large field groups into smaller batches
   */
  private splitLargeGroup(group: FieldGroup): void {
    const batches = Math.ceil(group.fields.length / this.batchSize);

    for (let i = 0; i < batches; i++) {
      const start = i * this.batchSize;
      const end = Math.min(start + this.batchSize, group.fields.length);

      const batchGroup: FieldGroup = {
        id: `${group.id}_batch_${i}`,
        fields: group.fields.slice(start, end),
        schema: null,
        dependencies: group.dependencies,
      };

      this.fieldGroups.set(batchGroup.id, batchGroup);
    }
  }

  /**
   * Extract field dependencies from conditional logic
   */
  private extractDependencies(conditional: any): string[] {
    const deps: string[] = [];

    if (conditional.showWhen?.field) {
      deps.push(conditional.showWhen.field);
    }
    if (conditional.hideWhen?.field) {
      deps.push(conditional.hideWhen.field);
    }
    if (conditional.enableWhen?.field) {
      deps.push(conditional.enableWhen.field);
    }
    if (conditional.disableWhen?.field) {
      deps.push(conditional.disableWhen.field);
    }

    return deps;
  }

  /**
   * Queue field validation with priority
   */
  queueValidation(
    fieldId: string,
    value: unknown,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    // Remove existing validation for same field
    this.validationQueue = this.validationQueue.filter(
      task => task.fieldId !== fieldId
    );

    // Add new validation task
    this.validationQueue.push({
      fieldId,
      value,
      priority,
      timestamp: Date.now(),
    });

    // Sort by priority and timestamp
    this.validationQueue.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityWeight[b.priority] - priorityWeight[a.priority];

      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });

    // Debounce processing
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.processValidationQueue();
    }, this.debounceMs);
  }

  /**
   * Process validation queue in batches
   */
  private async processValidationQueue(): Promise<void> {
    if (this.isProcessing || this.validationQueue.length === 0) return;

    this.isProcessing = true;

    try {
      const batch = this.validationQueue.splice(0, this.batchSize);
      const results = await this.processBatch(batch);

      // Emit results
      results.forEach(result => {
        this.emitValidationResult(result);
      });

      // Process remaining queue
      if (this.validationQueue.length > 0) {
        setTimeout(() => this.processValidationQueue(), 0);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a batch of validation tasks
   */
  private async processBatch(
    batch: ValidationTask[]
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Group tasks by field group for efficient processing
    const tasksByGroup = new Map<string, ValidationTask[]>();

    batch.forEach(task => {
      const groupId = this.findFieldGroup(task.fieldId);
      if (!tasksByGroup.has(groupId)) {
        tasksByGroup.set(groupId, []);
      }
      tasksByGroup.get(groupId)!.push(task);
    });

    // Process each group
    for (const [groupId, tasks] of tasksByGroup) {
      const groupResults = await this.processGroupTasks(groupId, tasks);
      results.push(...groupResults);
    }

    return results;
  }

  /**
   * Process validation tasks for a specific field group
   */
  private async processGroupTasks(
    groupId: string,
    tasks: ValidationTask[]
  ): Promise<ValidationResult[]> {
    const group = this.fieldGroups.get(groupId);
    if (!group) return [];

    const results: ValidationResult[] = [];

    // Get or create group schema
    const groupSchema = await this.getGroupSchema(group);

    // Process tasks in parallel where possible
    const validationPromises = tasks.map(async task => {
      const startTime = performance.now();

      try {
        const field = group.fields.find(f => f.id === task.fieldId);
        if (!field) {
          throw new Error(`Field ${task.fieldId} not found in group`);
        }

        const fieldSchema = zodSchemaCache.getFieldSchema(field);
        const result = fieldSchema.safeParse(task.value);

        const endTime = performance.now();

        return {
          fieldId: task.fieldId,
          isValid: result.success,
          errors: result.success ? [] : result.error.errors.map(e => e.message),
          warnings: [],
          executionTime: endTime - startTime,
        };
      } catch (error) {
        const endTime = performance.now();

        return {
          fieldId: task.fieldId,
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          executionTime: endTime - startTime,
        };
      }
    });

    const taskResults = await Promise.all(validationPromises);
    results.push(...taskResults);

    return results;
  }

  /**
   * Get or create schema for field group
   */
  private async getGroupSchema(group: FieldGroup): Promise<z.ZodObject<any>> {
    if (group.schema) return group.schema;

    const schemaFields: Record<string, z.ZodTypeAny> = {};

    group.fields.forEach(field => {
      const fieldSchema = zodSchemaCache.getFieldSchema(field);
      schemaFields[field.id] = fieldSchema;
    });

    group.schema = z.object(schemaFields);
    return group.schema;
  }

  /**
   * Find which group a field belongs to
   */
  private findFieldGroup(fieldId: string): string {
    for (const [groupId, group] of this.fieldGroups) {
      if (group.fields.some(field => field.id === fieldId)) {
        return groupId;
      }
    }

    // Default to first group if not found
    return this.fieldGroups.keys().next().value || 'default';
  }

  /**
   * Emit validation result (override in subclass or use event system)
   */
  private emitValidationResult(result: ValidationResult): void {
    // This would typically emit to an event system or callback
    console.log('Validation result:', result);
  }

  /**
   * Validate entire form with optimizations
   */
  async validateForm(formData: Record<string, unknown>): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    warnings: Record<string, string[]>;
    performance: {
      totalTime: number;
      fieldCount: number;
      groupCount: number;
    };
  }> {
    const startTime = performance.now();

    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};

    // Process groups in parallel
    const groupPromises = Array.from(this.fieldGroups.entries()).map(
      async ([groupId, group]) => {
        const groupSchema = await this.getGroupSchema(group);
        const groupData: Record<string, unknown> = {};

        // Extract data for this group
        group.fields.forEach(field => {
          if (field.id in formData) {
            groupData[field.id] = formData[field.id];
          }
        });

        const result = groupSchema.safeParse(groupData);

        if (!result.success) {
          result.error.errors.forEach(error => {
            const fieldPath = error.path.join('.');
            if (!errors[fieldPath]) {
              errors[fieldPath] = [];
            }
            errors[fieldPath].push(error.message);
          });
        }
      }
    );

    await Promise.all(groupPromises);

    const endTime = performance.now();

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
      performance: {
        totalTime: endTime - startTime,
        fieldCount: this.config.sections.reduce(
          (sum, section) => sum + section.fields.length,
          0
        ),
        groupCount: this.fieldGroups.size,
      },
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    return {
      queueLength: this.validationQueue.length,
      groupCount: this.fieldGroups.size,
      isProcessing: this.isProcessing,
      averageGroupSize:
        Array.from(this.fieldGroups.values()).reduce(
          (sum, group) => sum + group.fields.length,
          0
        ) / this.fieldGroups.size,
    };
  }

  /**
   * Clear validation queue
   */
  clearQueue(): void {
    this.validationQueue = [];
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /**
   * Update batch size for optimization
   */
  setBatchSize(size: number): void {
    this.batchSize = Math.max(1, Math.min(200, size));
  }

  /**
   * Update debounce timing
   */
  setDebounceMs(ms: number): void {
    this.debounceMs = Math.max(0, Math.min(1000, ms));
  }
}

// Factory function for creating optimized validators
export const createOptimizedValidator = (config: FormConfiguration) => {
  return new FormPerformanceOptimizer(config);
};

// Hook for React components
export const useOptimizedFormValidation = (config: FormConfiguration) => {
  const optimizer = new FormPerformanceOptimizer(config);

  return {
    queueValidation: optimizer.queueValidation.bind(optimizer),
    validateForm: optimizer.validateForm.bind(optimizer),
    getStats: optimizer.getPerformanceStats.bind(optimizer),
    clearQueue: optimizer.clearQueue.bind(optimizer),
  };
};
