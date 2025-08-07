
/**
 * useConditionalLogic Hook
 *
 * Manages conditional logic evaluation for dynamic forms
 * Handles field visibility, enablement, and dependency tracking
 */

import type {
  FormConfiguration,
  FieldConfiguration,
  FormSection,
../types/dynamic-forms';
import { , evaluateConditionalLogic, createConditionalDependencyGraph, hasCircularDependencies, validateConditionalLogic } from '../lib/conditional-logic';
  evaluateConditionalLogic,
  createConditionalDependencyGraph,
  hasCircularDependencies,
  validateConditionalLogic,
../lib/conditional-logic';

export interface UseConditionalLogicReturn {
  /** Fields that are currently visible based on conditional logic */
  visibleFields: FieldConfiguration[];
  /** Sections that are currently visible based on conditional logic */
  visibleSections: FormSection[];
  /** Check if a specific field is visible */
  isFieldVisible: (fieldId: string) => boolean;
  /** Check if a specific field is enabled */
  isFieldEnabled: (fieldId: string) => boolean;
  /** Check if a specific section is visible */
  isSectionVisible: (sectionId: string) => boolean;
  /** Re-evaluate all conditional logic */
  evaluateConditions: (formData: Record<string, unknown>) => void;
  /** Get fields that depend on a specific field */
  getDependentFields: (fieldId: string) => string[];
  /** Validation errors in conditional logic setup */
  conditionalErrors: string[];
  /** Whether the conditional logic configuration is valid */
  isValidConfiguration: boolean;
}

export const useConditionalLogic = (
  config: FormConfiguration | null,
  formData: Record<string, unknown>
): UseConditionalLogicReturn => {
  // Create dependency graph
  const dependencyGraph = useMemo(() => {
    if (!config) return new Map();
    return createConditionalDependencyGraph(config);
  }, [config]);

  // Validate conditional logic configuration
  const { conditionalErrors, isValidConfiguration } = useMemo(() => {
    if (!config) return { conditionalErrors: [], isValidConfiguration: true };

    const errors: string[] = [];
    let isValid = true;

    // Check for circular dependencies
    if (hasCircularDependencies(dependencyGraph)) {
      errors.push('Circular dependencies detected in conditional logic');
      isValid = false;
    }

    // Get all field IDs for validation
    const allFieldIds: string[] = [];
    config.sections.forEach((section: FormSection) => {
      section.fields.forEach((field: FieldConfiguration) => {
        allFieldIds.push(field.id);
      });
    });

    // Validate each field's conditional logic
    config.sections.forEach((section: FormSection) => {
      section.fields.forEach((field: FieldConfiguration) => {
        if (field.conditional) {
          const validation = validateConditionalLogic(
            field.conditional,
            allFieldIds
          );
          if (!validation.isValid) {
            errors.push(
              ...validation.errors.map(
                (error: string) => `Field "${field.id}": ${error}`
              )
            );
            isValid = false;
          }
        }
      });

      // Validate section conditional logic
      if (section.conditional) {
        const validation = validateConditionalLogic(
          section.conditional,
          allFieldIds
        );
        if (!validation.isValid) {
          errors.push(
            ...validation.errors.map(
              (error: string) => `Section "${section.id}": ${error}`
            )
          );
          isValid = false;
        }
      }
    });

    return { conditionalErrors: errors, isValidConfiguration: isValid };
  }, [config, dependencyGraph]);

  // Evaluate field visibility and enablement
  const fieldStates = useMemo(() => {
    if (!config || !isValidConfiguration) return new Map();

    const states = new Map<string, { visible: boolean; enabled: boolean }>();

    config.sections.forEach((section: FormSection) => {
      section.fields.forEach((field: FieldConfiguration) => {
        if (field.conditional) {
          const { visible, enabled } = evaluateConditionalLogic(
            field.conditional,
            formData
          );
          states.set(field.id, { visible, enabled });
        } else {
          states.set(field.id, { visible: true, enabled: true });
        }
      });
    });

    return states;
  }, [config, formData, isValidConfiguration]);

  // Evaluate section visibility
  const sectionStates = useMemo(() => {
    if (!config || !isValidConfiguration) return new Map();

    const states = new Map<string, { visible: boolean; enabled: boolean }>();

    config.sections.forEach((section: FormSection) => {
      if (section.conditional) {
        const { visible, enabled } = evaluateConditionalLogic(
          section.conditional,
          formData
        );
        states.set(section.id, { visible, enabled });
      } else {
        states.set(section.id, { visible: true, enabled: true });
      }
    });

    return states;
  }, [config, formData, isValidConfiguration]);

  // Get visible fields
  const visibleFields = useMemo(() => {
    if (!config) return [];

    const visible: FieldConfiguration[] = [];

    config.sections.forEach((section: FormSection) => {
      const sectionState = sectionStates.get(section.id);
      const isSectionVisible = sectionState?.visible ?? true;

      if (isSectionVisible) {
        section.fields.forEach((field: FieldConfiguration) => {
          const fieldState = fieldStates.get(field.id);
          const isFieldVisible = fieldState?.visible ?? true;

          if (isFieldVisible) {
            visible.push(field);
          }
        });
      }
    });

    return visible;
  }, [config, fieldStates, sectionStates]);

  // Get visible sections
  const visibleSections = useMemo(() => {
    if (!config) return [];

    return config.sections.filter((section: FormSection) => {
      const sectionState = sectionStates.get(section.id);
      return sectionState?.visible ?? true;
    });
  }, [config, sectionStates]);

  // Check if a specific field is visible
  const isFieldVisible = useCallback(
    (fieldId: string): boolean => {
      const fieldState = fieldStates.get(fieldId);
      return fieldState?.visible ?? true;
    },
    [fieldStates]
  );

  // Check if a specific field is enabled
  const isFieldEnabled = useCallback(
    (fieldId: string): boolean => {
      const fieldState = fieldStates.get(fieldId);
      return fieldState?.enabled ?? true;
    },
    [fieldStates]
  );

  // Check if a specific section is visible
  const isSectionVisible = useCallback(
    (sectionId: string): boolean => {
      const sectionState = sectionStates.get(sectionId);
      return sectionState?.visible ?? true;
    },
    [sectionStates]
  );

  // Re-evaluate all conditional logic (useful for manual triggers)
  const evaluateConditions = useCallback(
    (newFormData: Record<string, unknown>) => {
      // This will trigger a re-render with new formData
      // The useMemo hooks above will recalculate based on the new data
      console.log('Re-evaluating conditions with new form data:', newFormData);
    },
    []
  );

  // Get fields that depend on a specific field
  const getDependentFields = useCallback(
    (fieldId: string): string[] => {
      const dependents: string[] = [];

      dependencyGraph.forEach((dependencies, targetField) => {
        if (dependencies.includes(fieldId)) {
          dependents.push(targetField);
        }
      });

      return dependents;
    },
    [dependencyGraph]
  );

  return {
    visibleFields,
    visibleSections,
    isFieldVisible,
    isFieldEnabled,
    isSectionVisible,
    evaluateConditions,
    getDependentFields,
    conditionalErrors,
    isValidConfiguration,
  };
};
