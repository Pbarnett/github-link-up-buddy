/**
 * useFormState Hook
 * 
 * Manages form state, validation, and conditional logic evaluation
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type {
  FormConfiguration,
  FormState,
  FieldConfiguration,
  ConditionalRule,
  UseFormStateReturn
} from '@/types/dynamic-forms';

export const useFormState = (
  configuration: FormConfiguration | null,
  form: UseFormReturn<Record<string, unknown>>
): UseFormStateReturn => {
  const [formState, setFormState] = useState<FormState>({
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true
  });

  // Update form state when React Hook Form state changes
  useEffect(() => {
    if (!form) return;

    const subscription = form.watch((values) => {
      setFormState((prevState: FormState) => ({
        ...prevState,
        values: values || {},
        errors: form.formState.errors || {},
        isSubmitting: form.formState.isSubmitting,
        isValid: form.formState.isValid
      }));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Set field value
  const setValue = useCallback((fieldId: string, value: unknown) => {
    form.setValue(fieldId, value, { shouldValidate: true, shouldTouch: true });
    
    setFormState(prevState => ({
      ...prevState,
      values: { ...prevState.values, [fieldId]: value },
      touched: { ...prevState.touched, [fieldId]: true }
    }));
  }, [form]);

  // Set field error
  const setError = useCallback((fieldId: string, error: string) => {
    form.setError(fieldId, { message: error });
    
    setFormState(prevState => ({
      ...prevState,
      errors: { ...prevState.errors, [fieldId]: error }
    }));
  }, [form]);

  // Clear field error
  const clearError = useCallback((fieldId: string) => {
    form.clearErrors(fieldId);
    
    setFormState(prevState => {
      const newErrors = { ...prevState.errors };
      delete newErrors[fieldId];
      return {
        ...prevState,
        errors: newErrors
      };
    });
  }, [form]);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    return form.formState.isValid;
  }, [form]);

  // Reset form
  const resetForm = useCallback(() => {
    form.reset();
    setFormState({
      values: {},
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true
    });
  }, [form]);

  // Evaluate conditional rule
  const evaluateConditionalRule = useCallback((
    rule: ConditionalRule,
    values: Record<string, unknown>
  ): boolean => {
    const fieldValue = values[rule.field];
    
    switch (rule.operator) {
      case 'equals':
        return fieldValue === rule.value;
      
      case 'not_equals':
        return fieldValue !== rule.value;
      
      case 'contains':
        if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
          return fieldValue.includes(rule.value);
        }
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(rule.value);
        }
        return false;
      
      case 'not_contains':
        if (typeof fieldValue === 'string' && typeof rule.value === 'string') {
          return !fieldValue.includes(rule.value);
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
      
      case 'greater':
        return Number(fieldValue) > Number(rule.value);
      
      case 'less':
        return Number(fieldValue) < Number(rule.value);
      
      case 'greaterOrEqual':
        return Number(fieldValue) >= Number(rule.value);
      
      case 'lessOrEqual':
        return Number(fieldValue) <= Number(rule.value);
      
      default:
        console.warn(`Unknown conditional operator: ${rule.operator}`);
        return true;
    }
  }, []);

  // Check if field should be visible
  const isFieldVisible = useCallback((field: FieldConfiguration): boolean => {
    if (!field.conditional || !configuration) return true;

    const { showWhen, hideWhen } = field.conditional;
    const values = formState.values;

    // Check showWhen condition
    if (showWhen) {
      const shouldShow = evaluateConditionalRule(showWhen, values);
      if (!shouldShow) return false;
    }

    // Check hideWhen condition
    if (hideWhen) {
      const shouldHide = evaluateConditionalRule(hideWhen, values);
      if (shouldHide) return false;
    }

    return true;
  }, [configuration, formState.values, evaluateConditionalRule]);

  // Check if field should be enabled
  const isFieldEnabled = useCallback((field: FieldConfiguration): boolean => {
    if (!field.conditional || !configuration) return true;

    const { enableWhen, disableWhen } = field.conditional;
    const values = formState.values;

    // Check enableWhen condition
    if (enableWhen) {
      const shouldEnable = evaluateConditionalRule(enableWhen, values);
      if (!shouldEnable) return false;
    }

    // Check disableWhen condition
    if (disableWhen) {
      const shouldDisable = evaluateConditionalRule(disableWhen, values);
      if (shouldDisable) return false;
    }

    return true;
  }, [configuration, formState.values, evaluateConditionalRule]);

  // Memoized return object
  return useMemo(() => ({
    formState,
    setValue,
    setError,
    clearError,
    validateForm,
    resetForm,
    isFieldVisible,
    isFieldEnabled
  }), [
    formState,
    setValue,
    setError,
    clearError,
    validateForm,
    resetForm,
    isFieldVisible,
    isFieldEnabled
  ]);
};
