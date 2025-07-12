/**
 * Conditional Logic Engine for Dynamic Forms
 * 
 * Evaluates conditional rules to determine field visibility, enablement,
 * and other dynamic behaviors in forms
 */

import type { ConditionalRule, ConditionalLogic } from '@/types/dynamic-forms';

/**
 * Evaluate a single conditional rule against form data
 */
export const evaluateConditionalRule = (
  rule: ConditionalRule,
  formData: Record<string, any>
): boolean => {
  const fieldValue = formData[rule.field];
  
  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value;
    
    case 'not_equals':
      return fieldValue !== rule.value;
    
    case 'contains':
      if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
        return fieldValue.toLowerCase().includes(rule.value.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(rule.value);
      }
      return false;
    
    case 'not_contains':
      if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
        return !fieldValue.toLowerCase().includes(rule.value.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(rule.value);
      }
      return true;
    
    case 'oneOf':
      if (Array.isArray(rule.value)) {
        return rule.value.includes(fieldValue);
      }
      return false;
    
    case 'notOneOf':
      if (Array.isArray(rule.value)) {
        return !rule.value.includes(fieldValue);
      }
      return true;
    
    case 'greater': {
      const numValue = Number(fieldValue);
      const ruleValue = Number(rule.value);
      return !isNaN(numValue) && !isNaN(ruleValue) && numValue > ruleValue;
    }
    
    case 'less': {
      const numValue2 = Number(fieldValue);
      const ruleValue2 = Number(rule.value);
      return !isNaN(numValue2) && !isNaN(ruleValue2) && numValue2 < ruleValue2;
    }
    
    case 'greaterOrEqual': {
      const numValue3 = Number(fieldValue);
      const ruleValue3 = Number(rule.value);
      return !isNaN(numValue3) && !isNaN(ruleValue3) && numValue3 >= ruleValue3;
    }
    
    case 'lessOrEqual': {
      const numValue4 = Number(fieldValue);
      const ruleValue4 = Number(rule.value);
      return !isNaN(numValue4) && !isNaN(ruleValue4) && numValue4 <= ruleValue4;
    }
    
    default:
      console.warn(`Unknown conditional operator: ${rule.operator}`);
      return true;
  }
};

/**
 * Evaluate conditional logic (combination of multiple rules)
 */
export const evaluateConditionalLogic = (
  logic: ConditionalLogic,
  formData: Record<string, any>
): {
  visible: boolean;
  enabled: boolean;
} => {
  let visible = true;
  let enabled = true;

  // Evaluate visibility rules
  if (logic.showWhen) {
    visible = evaluateConditionalRule(logic.showWhen, formData);
  }

  if (logic.hideWhen) {
    const shouldHide = evaluateConditionalRule(logic.hideWhen, formData);
    visible = visible && !shouldHide;
  }

  // Evaluate enablement rules
  if (logic.enableWhen) {
    enabled = evaluateConditionalRule(logic.enableWhen, formData);
  }

  if (logic.disableWhen) {
    const shouldDisable = evaluateConditionalRule(logic.disableWhen, formData);
    enabled = enabled && !shouldDisable;
  }

  return { visible, enabled };
};

/**
 * Complex conditional logic evaluator with support for AND/OR operations
 */
export interface ComplexConditionalRule {
  operator: 'AND' | 'OR';
  rules: (ConditionalRule | ComplexConditionalRule)[];
}

export const evaluateComplexConditionalRule = (
  rule: ConditionalRule | ComplexConditionalRule,
  formData: Record<string, any>
): boolean => {
  // Simple rule
  if ('field' in rule) {
    return evaluateConditionalRule(rule, formData);
  }

  // Complex rule with AND/OR
  if (rule.operator === 'AND') {
    return rule.rules.every(subRule => 
      evaluateComplexConditionalRule(subRule, formData)
    );
  }

  if (rule.operator === 'OR') {
    return rule.rules.some(subRule => 
      evaluateComplexConditionalRule(subRule, formData)
    );
  }

  return true;
};

/**
 * Get all fields that a conditional rule depends on
 */
export const getConditionalDependencies = (
  logic: ConditionalLogic
): string[] => {
  const dependencies = new Set<string>();

  if (logic.showWhen) {
    dependencies.add(logic.showWhen.field);
  }

  if (logic.hideWhen) {
    dependencies.add(logic.hideWhen.field);
  }

  if (logic.enableWhen) {
    dependencies.add(logic.enableWhen.field);
  }

  if (logic.disableWhen) {
    dependencies.add(logic.disableWhen.field);
  }

  return Array.from(dependencies);
};

/**
 * Validate conditional logic configuration
 */
export const validateConditionalLogic = (
  logic: ConditionalLogic,
  availableFields: string[]
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const dependencies = getConditionalDependencies(logic);

  // Check if all referenced fields exist
  dependencies.forEach(fieldId => {
    if (!availableFields.includes(fieldId)) {
      errors.push(`Conditional logic references unknown field: ${fieldId}`);
    }
  });

  // Check for circular dependencies (basic check)
  if (logic.showWhen && logic.hideWhen) {
    if (logic.showWhen.field === logic.hideWhen.field) {
      errors.push('Conflicting show/hide conditions on the same field');
    }
  }

  if (logic.enableWhen && logic.disableWhen) {
    if (logic.enableWhen.field === logic.disableWhen.field) {
      errors.push('Conflicting enable/disable conditions on the same field');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create a dependency graph for conditional logic
 */
export const createConditionalDependencyGraph = (
  formConfig: any
): Map<string, string[]> => {
  const dependencyGraph = new Map<string, string[]>();

  // Helper to process fields recursively
  const processFields = (fields: any[]) => {
    fields.forEach(field => {
      if (field.conditional) {
        const dependencies = getConditionalDependencies(field.conditional);
        dependencyGraph.set(field.id, dependencies);
      } else {
        dependencyGraph.set(field.id, []);
      }
    });
  };

  // Process sections and their fields
  if (formConfig.sections) {
    formConfig.sections.forEach((section: any) => {
      if (section.fields) {
        processFields(section.fields);
      }
    });
  }

  return dependencyGraph;
};

/**
 * Check for circular dependencies in conditional logic
 */
export const hasCircularDependencies = (
  dependencyGraph: Map<string, string[]>
): boolean => {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const hasCycle = (fieldId: string): boolean => {
    if (recursionStack.has(fieldId)) {
      return true; // Circular dependency found
    }

    if (visited.has(fieldId)) {
      return false; // Already processed
    }

    visited.add(fieldId);
    recursionStack.add(fieldId);

    const dependencies = dependencyGraph.get(fieldId) || [];
    for (const dep of dependencies) {
      if (hasCycle(dep)) {
        return true;
      }
    }

    recursionStack.delete(fieldId);
    return false;
  };

  // Check all fields
  for (const fieldId of dependencyGraph.keys()) {
    if (hasCycle(fieldId)) {
      return true;
    }
  }

  return false;
};

/**
 * Utility to create common conditional rules
 */
export const conditionalRules = {
  /**
   * Show field when another field equals a specific value
   */
  showWhenEquals: (fieldId: string, value: any): ConditionalLogic => ({
    showWhen: { field: fieldId, operator: 'equals', value }
  }),

  /**
   * Hide field when another field equals a specific value
   */
  hideWhenEquals: (fieldId: string, value: any): ConditionalLogic => ({
    hideWhen: { field: fieldId, operator: 'equals', value }
  }),

  /**
   * Show field when another field is one of multiple values
   */
  showWhenOneOf: (fieldId: string, values: any[]): ConditionalLogic => ({
    showWhen: { field: fieldId, operator: 'oneOf', value: values }
  }),

  /**
   * Enable field when another field has a value
   */
  enableWhenHasValue: (fieldId: string): ConditionalLogic => ({
    enableWhen: { field: fieldId, operator: 'not_equals', value: null }
  }),

  /**
   * Show field when value is greater than threshold
   */
  showWhenGreater: (fieldId: string, threshold: number): ConditionalLogic => ({
    showWhen: { field: fieldId, operator: 'greater', value: threshold }
  })
};

export default {
  evaluateConditionalRule,
  evaluateConditionalLogic,
  evaluateComplexConditionalRule,
  getConditionalDependencies,
  validateConditionalLogic,
  createConditionalDependencyGraph,
  hasCircularDependencies,
  conditionalRules
};
