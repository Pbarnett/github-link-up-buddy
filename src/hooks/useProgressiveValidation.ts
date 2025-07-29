/**
 * Progressive Validation Hook
 * 
 * Provides real-time validation with intelligent error display timing
 * Shows warnings on blur, errors on submit attempts, and success states
 */

import { useCallback, useState, useEffect, useRef } from 'react';
import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';
import { 
  getEnhancedErrorMessage, 
  getProgressiveErrorSeverity,
  type ErrorMessageContext,
  type ErrorMessageConfig 
} from '@/lib/validation/error-messages';

interface FieldState {
  hasBlurred: boolean;
  hasChanged: boolean;
  hasAttemptedSubmit: boolean;
  lastValue: any;
  errorHistory: string[];
}

interface ValidationState<T extends FieldValues> {
  fields: Record<FieldPath<T>, FieldState>;
  globalState: {
    hasAttemptedSubmit: boolean;
    isSubmitting: boolean;
    submitCount: number;
  };
}

interface UseProgressiveValidationProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  validationDelay?: number; // Debounce delay for real-time validation
  enableRealtimeValidation?: boolean;
}

interface FieldValidationResult {
  isValid: boolean;
  error?: ErrorMessageConfig;
  severity: 'none' | 'warning' | 'error' | 'success';
  shouldShow: boolean;
}

export function useProgressiveValidation<T extends FieldValues>({
  form,
  validationDelay = 300,
  enableRealtimeValidation = true,
}: UseProgressiveValidationProps<T>) {
  const [validationState, setValidationState] = useState<ValidationState<T>>({
    fields: {} as Record<FieldPath<T>, FieldState>,
    globalState: {
      hasAttemptedSubmit: false,
      isSubmitting: false,
      submitCount: 0,
    },
  });

  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const { watch, trigger, formState, getFieldState } = form;

  // Initialize field state
  const initializeFieldState = useCallback((fieldName: FieldPath<T>) => {
    setValidationState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          hasBlurred: false,
          hasChanged: false,
          hasAttemptedSubmit: false,
          lastValue: undefined,
          errorHistory: [],
        },
      },
    }));
  }, []);

  // Track field blur events
  const onFieldBlur = useCallback((fieldName: FieldPath<T>) => {
    setValidationState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          hasBlurred: true,
        },
      },
    }));

    // Trigger validation after blur with delay
    if (enableRealtimeValidation) {
      setTimeout(() => {
        trigger(fieldName);
      }, 100);
    }
  }, [trigger, enableRealtimeValidation]);

  // Track field change events with debouncing
  const onFieldChange = useCallback((fieldName: FieldPath<T>, value: any) => {
    // Clear existing timer
    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    setValidationState(prev => {
      const fieldState = prev.fields[fieldName] || {
        hasBlurred: false,
        hasChanged: false,
        hasAttemptedSubmit: false,
        lastValue: undefined,
        errorHistory: [],
      };

      return {
        ...prev,
        fields: {
          ...prev.fields,
          [fieldName]: {
            ...fieldState,
            hasChanged: true,
            lastValue: value,
          },
        },
      };
    });

    // Debounced validation
    if (enableRealtimeValidation) {
      debounceTimers.current[fieldName] = setTimeout(() => {
        trigger(fieldName);
      }, validationDelay);
    }
  }, [trigger, validationDelay, enableRealtimeValidation]);

  // Track submit attempts
  const onSubmitAttempt = useCallback(() => {
    setValidationState(prev => ({
      ...prev,
      globalState: {
        ...prev.globalState,
        hasAttemptedSubmit: true,
        submitCount: prev.globalState.submitCount + 1,
      },
      fields: Object.keys(prev.fields).reduce((acc, fieldName) => ({
        ...acc,
        [fieldName]: {
          ...prev.fields[fieldName as FieldPath<T>],
          hasAttemptedSubmit: true,
        },
      }), {} as Record<FieldPath<T>, FieldState>),
    }));
  }, []);

  // Track submitting state
  const onSubmittingChange = useCallback((isSubmitting: boolean) => {
    setValidationState(prev => ({
      ...prev,
      globalState: {
        ...prev.globalState,
        isSubmitting,
      },
    }));
  }, []);

  // Get validation result for a specific field
  const getFieldValidation = useCallback((fieldName: FieldPath<T>): FieldValidationResult => {
    const fieldState = validationState.fields[fieldName];
    const formFieldState = getFieldState(fieldName, formState);
    const currentValue = watch(fieldName);

    if (!fieldState) {
      return {
        isValid: true,
        severity: 'none',
        shouldShow: false,
      };
    }

    const hasError = formFieldState.invalid;
    const severity = getProgressiveErrorSeverity(
      fieldName,
      currentValue,
      fieldState.hasBlurred,
      validationState.globalState.hasAttemptedSubmit
    );

    // Don't show anything if severity is 'none'
    if (severity === 'none') {
      return {
        isValid: !hasError,
        severity: 'none',
        shouldShow: false,
      };
    }

    // Show success state for valid fields that were previously invalid
    if (!hasError && fieldState.errorHistory.length > 0) {
      return {
        isValid: true,
        severity: 'success',
        shouldShow: true,
      };
    }

    // Show error/warning state
    if (hasError && formFieldState.error) {
      const context: ErrorMessageContext = {
        fieldName,
        value: currentValue,
        formData: watch(),
      };

      // Map common React Hook Form errors to our enhanced messages
      const errorType = mapReactHookFormError(fieldName, formFieldState.error.message || '');
      const error = getEnhancedErrorMessage(errorType, context);

      return {
        isValid: false,
        error,
        severity: severity as 'warning' | 'error',
        shouldShow: true,
      };
    }

    return {
      isValid: !hasError,
      severity: hasError ? severity as 'warning' | 'error' : 'none',
      shouldShow: hasError,
    };
  }, [validationState, getFieldState, formState, watch]);

  // Get overall form validation status
  const getFormValidation = useCallback(() => {
    const hasErrors = !formState.isValid;
    const hasAttemptedSubmit = validationState.globalState.hasAttemptedSubmit;
    const isSubmitting = validationState.globalState.isSubmitting;

    return {
      isValid: !hasErrors,
      hasErrors,
      hasAttemptedSubmit,
      isSubmitting,
      canSubmit: !hasErrors && !isSubmitting,
      submitCount: validationState.globalState.submitCount,
    };
  }, [formState.isValid, validationState.globalState]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => {
        clearTimeout(timer);
      });
    };
  }, []);

  return {
    // Field-level functions
    initializeFieldState,
    onFieldBlur,
    onFieldChange,
    getFieldValidation,
    
    // Form-level functions
    onSubmitAttempt,
    onSubmittingChange,
    getFormValidation,
    
    // State
    validationState,
  };
}

/**
 * Maps React Hook Form error messages to our enhanced error types
 */
function mapReactHookFormError(fieldName: string, errorMessage: string): string {
  // Date field mappings
  if (fieldName.includes('departure') || fieldName.includes('Date')) {
    if (errorMessage.includes('required')) return 'dates.earliestDepartureRequired';
    if (errorMessage.includes('future')) return 'dates.earliestDepartureInPast';
    if (errorMessage.includes('after')) return 'dates.dateRangeInvalid';
    if (errorMessage.includes('60 days')) return 'dates.dateRangeTooWide';
  }

  // Duration field mappings
  if (fieldName.includes('duration')) {
    if (errorMessage.includes('required')) return 'duration.minDurationRequired';
    if (errorMessage.includes('at least 1')) return 'duration.minDurationTooShort';
    if (errorMessage.includes('exceed 30')) return 'duration.maxDurationTooLong';
    if (errorMessage.includes('greater than')) return 'duration.durationRangeInvalid';
  }

  // Location field mappings
  if (fieldName.includes('destination')) {
    if (errorMessage.includes('required')) return 'location.destinationRequired';
  }

  if (fieldName.includes('airport')) {
    if (errorMessage.includes('airport')) return 'location.departureAirportRequired';
    if (errorMessage.includes('3 characters')) return 'location.invalidAirportCode';
  }

  // Budget/pricing field mappings
  if (fieldName.includes('price') || fieldName.includes('budget')) {
    if (errorMessage.includes('required')) return 'pricing.budgetRequired';
  }

  // Auto-booking field mappings
  if (fieldName.includes('payment')) {
    return 'autoBooking.paymentMethodRequired';
  }

  if (fieldName.includes('consent')) {
    return 'autoBooking.consentRequired';
  }

  // Default fallback
  return 'validation.generic';
}

/**
 * Helper hook for connecting progressive validation to form fields
 */
export function useFieldValidation<T extends FieldValues>(
  fieldName: FieldPath<T>,
  progressiveValidation: ReturnType<typeof useProgressiveValidation<T>>
) {
  const { initializeFieldState, onFieldBlur, onFieldChange, getFieldValidation } = progressiveValidation;

  // Initialize field state on mount
  useEffect(() => {
    initializeFieldState(fieldName);
  }, [fieldName, initializeFieldState]);

  const validation = getFieldValidation(fieldName);

  return {
    validation,
    fieldProps: {
      onBlur: () => onFieldBlur(fieldName),
      onChange: (value: any) => onFieldChange(fieldName, value),
    },
  };
}
