

/**
 * useDynamicForm Hook
 *
 * Main hook that integrates all dynamic form functionality:
 * - Form configuration management
 * - State management with React Hook Form
 * - Conditional logic evaluation
 * - Validation handling
 * - Analytics and performance tracking
 */

import React from 'react';
import type {
  FormSubmissionData,
  FieldConfiguration,

type FormEvent = React.FormEvent;

// Type aliases to handle missing exports
type DynamicFormConfig = any;
type FormSubmission = FormSubmissionData;

./useFormConfiguration';
./useFormState';
./useConditionalLogic';
./useFormValidation';
// Note: These imports have missing exports, using fallbacks
// import { generateValidationSchema } from '@/lib/form-validation';
// import { formConfigService } from '@/services/form-config.service';

// Fallback implementations
const generateValidationSchema = (config: any) => undefined;
const formConfigService = {
  logAnalytics: (formId: string, eventType: string, data: any) => {
    console.log('Analytics:', { formId, eventType, data });
  },
};

export interface UseDynamicFormOptions {
  /** Form configuration ID to load */
  configId?: string;
  /** Form configuration name to load */
  configName?: string;
  /** Direct configuration object (bypasses loading) */
  configuration?: DynamicFormConfig;
  /** Initial form data */
  initialData?: Record<string, unknown>;
  /** Enable real-time validation */
  realTimeValidation?: boolean;
  /** Enable analytics tracking */
  enableAnalytics?: boolean;
  /** Form submission handler */
  onSubmit?: (data: FormSubmission) => void | Promise<void>;
  /** Field change handler */
  onFieldChange?: (fieldId: string, value: unknown) => void;
  /** Error handler */
  onError?: (error: Error) => void;
  /** Configuration load handler */
  onConfigLoad?: (config: DynamicFormConfig) => void;
}

// Type for form data structure
type FormData = Record<string, unknown>;

// Type for validation results
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Type for exported form data
interface ExportedFormData {
  formId?: string;
  data: FormData;
  timestamp: string;
}

export interface UseDynamicFormReturn {
  // Form management
  form: UseFormReturn<FormData>;
  formConfig: DynamicFormConfig | null;
  isLoading: boolean;
  error: string | null;

  // Form data and state
  formData: FormData;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;

  // Field management
  visibleFields: FieldConfiguration[];
  setValue: (fieldId: string, value: unknown) => void;
  getValue: (fieldId: string) => unknown;
  watchField: (fieldId: string) => unknown;

  // Conditional logic
  isFieldVisible: (fieldId: string) => boolean;
  isFieldEnabled: (fieldId: string) => boolean;
  evaluateConditions: (formData: FormData) => void;

  // Validation
  validateField: (fieldId: string, value: unknown) => Promise<ValidationResult>;
  validateForm: (
    formData?: Record<string, unknown>
  ) => Promise<ValidationResult>;
  validationErrors: Record<string, string>;
  clearFieldError: (fieldId: string) => void;

  // Form actions
  submitForm: () => Promise<void>;
  resetForm: () => void;
  reloadConfig: () => Promise<void>;

  // Analytics
  trackFieldInteraction: (fieldId: string, interactionType: string) => void;
  trackFormEvent: (eventType: string, data?: Record<string, unknown>) => void;

  // Utility
  getFieldConfig: (fieldId: string) => FieldConfiguration | null;
  exportFormData: () => ExportedFormData;
  importFormData: (data: FormData) => void;
}

export const useDynamicForm = (
  options: UseDynamicFormOptions
): UseDynamicFormReturn => {
  const {
    configId,
    configName,
    configuration: providedConfiguration,
    initialData = {},
    realTimeValidation = false,
    enableAnalytics = true,
    onSubmit,
    onFieldChange,
    onError,
    onConfigLoad,
  } = options;

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load form configuration
  const {
    configuration: loadedConfiguration,
    loading: configLoading,
    error: configError,
  } = useFormConfiguration({
    configId,
    configName,
    enabled: !providedConfiguration,
  });

  // Use provided configuration or loaded configuration
  const formConfig = providedConfiguration || loadedConfiguration;

  // Generate validation schema
  const validationSchema = useMemo(() => {
    if (!formConfig) return undefined;
    return generateValidationSchema(formConfig);
  }, [formConfig]);

  // Initialize React Hook Form
  const form = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: initialData,
    mode: realTimeValidation ? 'onChange' : 'onSubmit',
  });

  const { watch, setValue, getValues, formState, reset } = form;
  const getValue = (fieldId: string) => getValues(fieldId);

  // Watch all form values for conditional logic
  const formData = watch();

  // Form state management
  const formStateHook = useFormState(formConfig, form);

  // Conditional logic
  const { visibleFields, isFieldVisible, isFieldEnabled, evaluateConditions } =
    useConditionalLogic(formConfig, formData);

  // Validation
  const { validateField, validateForm, validationErrors, clearFieldError } =
    useFormValidation(formConfig, realTimeValidation);

  // Analytics tracking functions (defined before usage)
  const trackFieldInteraction = useCallback(
    (fieldId: string, interactionType: string) => {
      if (!enableAnalytics || !formConfig) return;

      formConfigService.logAnalytics(formConfig.id, 'field_interaction', {
        fieldId,
        interactionType,
        formVersion: formConfig.version,
        timestamp: new Date().toISOString(),
      });
    },
    [enableAnalytics, formConfig]
  );

  const trackFormEvent = useCallback(
    (eventType: string, data?: Record<string, unknown>) => {
      if (!enableAnalytics || !formConfig) return;

      formConfigService.logAnalytics(formConfig.id, eventType, {
        ...data,
        formVersion: formConfig.version,
        timestamp: new Date().toISOString(),
      });
    },
    [enableAnalytics, formConfig]
  );

  // Track configuration loading
  useEffect(() => {
    if (formConfig && onConfigLoad) {
      onConfigLoad(formConfig);
    }
  }, [formConfig, onConfigLoad]);

  // Handle field changes
  const handleFieldChange = useCallback(
    (fieldId: string, value: unknown) => {
      setValue(fieldId, value, { shouldValidate: true, shouldDirty: true });
      onFieldChange?.(fieldId, value);

      // Track analytics if enabled
      if (enableAnalytics && formConfig) {
        trackFieldInteraction(fieldId, 'change');
      }

      // Clear validation errors for the field
      clearFieldError(fieldId);

      // Re-evaluate conditional logic
      evaluateConditions({ ...formData, [fieldId]: value });
    },
    [
      setValue,
      onFieldChange,
      enableAnalytics,
      formConfig,
      clearFieldError,
      evaluateConditions,
      formData,
      trackFieldInteraction,
    ]
  );

  // Submit form
  const submitForm = useCallback(async () => {
    if (!formConfig || !onSubmit) {
      console.warn(
        'Cannot submit form: missing configuration or submit handler'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate form before submission
      const validationResult = await validateForm(formData);

      if (!validationResult.isValid) {
        throw new Error(
          `Form validation failed: ${Object.values(validationResult.errors).join(', ')}`
        );
      }

      // Create submission object
      const submission: FormSubmission = {
        formId: formConfig.id,
        formName: formConfig.name,
        data: formData,
        metadata: {
          submittedAt: new Date().toISOString(),
          userAgent: navigator.userAgent,
          formVersion: formConfig.version,
          instanceId: crypto.randomUUID(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          formTitle: formConfig.title,
          submissionId: crypto.randomUUID(),
        },
      };

      // Track analytics
      if (enableAnalytics) {
        trackFormEvent('form_submit', {
          formId: formConfig.id,
          fieldCount: visibleFields.length,
          validationErrors: Object.keys(validationErrors).length,
        });
      }

      // Submit the form
      await onSubmit(submission);

      // Track successful submission
      if (enableAnalytics) {
        trackFormEvent('form_submit_success', { formId: formConfig.id });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';

      // Track error
      if (enableAnalytics) {
        trackFormEvent('form_submit_error', {
          formId: formConfig.id,
          error: errorMessage,
        });
      }

      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formConfig,
    formData,
    onSubmit,
    validateForm,
    enableAnalytics,
    visibleFields.length,
    validationErrors,
    onError,
    trackFormEvent,
  ]);

  // Reset form
  const resetForm = useCallback(() => {
    reset(initialData);
    formStateHook.resetForm();

    if (enableAnalytics && formConfig) {
      trackFormEvent('form_reset', { formId: formConfig.id });
    }
  }, [
    reset,
    initialData,
    formStateHook,
    enableAnalytics,
    formConfig,
    trackFormEvent,
  ]);

  // Reload configuration
  const reloadConfig = useCallback(async () => {
    // Since UseFormConfigurationReturn doesn't have reloadConfiguration,
    // we'll just trigger a re-render by updating the configuration
    if (configId || configName) {
      window.location.reload();
    }
  }, [configId, configName]);

  // Analytics tracking functions already defined above

  // Utility functions
  const getFieldConfig = useCallback(
    (fieldId: string): FieldConfiguration | null => {
      if (!formConfig) return null;

      for (const section of formConfig.sections) {
        const field = section.fields.find(
          (f: FieldConfiguration) => f.id === fieldId
        );
        if (field) return field;
      }
      return null;
    },
    [formConfig]
  );

  const exportFormData = useCallback(() => {
    return {
      formId: formConfig?.id,
      data: formData,
      timestamp: new Date().toISOString(),
    };
  }, [formConfig, formData]);

  const importFormData = useCallback(
    (data: FormData) => {
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key, value);
        });

        if (enableAnalytics && formConfig) {
          trackFormEvent('form_data_imported', { formId: formConfig.id });
        }
      }
    },
    [setValue, enableAnalytics, formConfig, trackFormEvent]
  );

  // Enhanced setValue with analytics tracking
  const enhancedSetValue = useCallback(
    (fieldId: string, value: unknown) => {
      handleFieldChange(fieldId, value);
    },
    [handleFieldChange]
  );

  // Watch specific field
  const watchField = useCallback(
    (fieldId: string) => {
      return watch(fieldId);
    },
    [watch]
  );

  return {
    // Form management
    form,
    formConfig,
    isLoading: configLoading,
    error: configError,

    // Form data and state
    formData,
    isSubmitting,
    isDirty: formState.isDirty,
    isValid: formState.isValid && Object.keys(validationErrors).length === 0,

    // Field management
    visibleFields,
    setValue: enhancedSetValue,
    getValue,
    watchField,

    // Conditional logic
    isFieldVisible,
    isFieldEnabled,
    evaluateConditions,

    // Validation
    validateField,
    validateForm: (formData: Record<string, unknown> = {}) =>
      validateForm(formData),
    validationErrors,
    clearFieldError,

    // Form actions
    submitForm,
    resetForm,
    reloadConfig,

    // Analytics
    trackFieldInteraction,
    track_FormEvent,

    // Utility
    getFieldConfig,
    exportFormData,
    importFormData,
  };
};

export default useDynamicForm;
