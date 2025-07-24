/**
 * Dynamic Form Renderer
 *
 * Core component that renders forms from configuration data
 * Integrates with React Hook Form and Zod for validation
 */

import * as React from 'react';
import { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type {
  DynamicFormRendererProps,
  FormSubmissionData,
} from '@/types/dynamic-forms';
import { useFormConfiguration } from '@/hooks/useFormConfiguration';
import { useFormState } from '@/hooks/useFormState';
import { generateZodSchema } from '@/lib/form-validation';
import { FormSection } from './FormSection';

type FC<T = {}> = React.FC<T>;

export const DynamicFormRenderer: FC<DynamicFormRendererProps> = ({
  configId,
  configName,
  configuration: providedConfiguration,
  onSubmit,
  onFieldChange,
  onValidationError,
  className,
  disabled = false,
  showValidationSummary = true,
}) => {
  // Load configuration if not provided
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
  const configuration = providedConfiguration || loadedConfiguration;

  // Generate Zod schema from configuration
  const validationSchema = useMemo(() => {
    if (!configuration) return z.object({});
    return generateZodSchema(configuration);
  }, [configuration]);

  // Initialize React Hook Form with proper default values
  const defaultValues = useMemo(() => {
    if (!configuration) return {};

    const defaults: Record<string, unknown> = {};

    configuration.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaults[field.id] = field.defaultValue;
        } else {
          // Provide appropriate defaults based on field type to avoid undefined values
          switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'textarea':
              defaults[field.id] = '';
              break;
            case 'number':
              defaults[field.id] = 0;
              break;
            case 'checkbox':
            case 'switch':
              defaults[field.id] = false;
              break;
            case 'multi-select':
              defaults[field.id] = [];
              break;
            case 'date':
            case 'datetime':
              // Don't set default dates, let them be undefined until user selects
              break;
            default:
              defaults[field.id] = '';
          }
        }
      });
    });

    return defaults;
  }, [configuration]);

  // Initialize React Hook Form
  const form = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Destructure formState properties for proper Proxy subscription
  const { errors, isSubmitting, isValid } = form.formState;

  // Form state management
  const {
    formState,
    setValue,
    clearError,
    validateForm,
    isFieldVisible,
    isFieldEnabled,
  } = useFormState(configuration, form);

  // Handle field changes
  const handleFieldChange = (fieldId: string, value: unknown) => {
    setValue(fieldId, value);
    onFieldChange?.(fieldId, value);

    // Clear field error when value changes
    if (errors[fieldId]) {
      clearError(fieldId);
    }
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit(async data => {
    try {
      if (!validateForm()) {
        onValidationError?.(
          Object.fromEntries(
            Object.entries(errors).map(([key, error]) => {
              const errorMessage =
                error && typeof error === 'object' && 'message' in error
                  ? (error as { message?: string }).message
                  : 'Invalid value';
              return [key, errorMessage || 'Invalid value'];
            })
          )
        );
        return;
      }

      // Create FormSubmissionData if onSubmit expects it
      if (onSubmit) {
        if (configuration) {
          const submissionData: FormSubmissionData = {
            formId: configuration.id,
            formName: configuration.name,
            data,
            metadata: {
              submittedAt: new Date().toISOString(),
              userAgent: navigator.userAgent,
              formVersion: configuration.version,
              instanceId: `form-${Date.now()}`,
            },
          };
          await onSubmit(submissionData);
        } else {
          await onSubmit(data as unknown as FormSubmissionData);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  // Loading state
  if (configLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading form configuration...</span>
      </div>
    );
  }

  // Error state
  if (configError || !configuration) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {configError || 'Failed to load form configuration'}
        </AlertDescription>
      </Alert>
    );
  }

  // Get visible sections
  const visibleSections = configuration.sections.filter(section => {
    if (!section.conditional) return true;

    // Evaluate conditional logic for sections
    // This will be implemented in the conditional logic engine
    return true; // For now, show all sections
  });

  return (
    <div className={cn('dynamic-form-renderer', className)}>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Sections */}
            {visibleSections.map((section, index) => (
              <FormSection
                key={section.id}
                section={section}
                sectionIndex={index}
                formState={formState}
                onFieldChange={handleFieldChange}
                isFieldVisible={isFieldVisible}
                isFieldEnabled={isFieldEnabled}
                disabled={disabled}
              />
            ))}

            {/* Validation Summary */}
            {showValidationSummary && Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">
                    Please fix the following errors:
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(errors).map(([field, error]) => {
                      const errorMessage =
                        error && typeof error === 'object' && 'message' in error
                          ? (error as { message?: string }).message
                          : `Invalid value for ${field}`;
                      return (
                        <li key={field} className="text-sm">
                          {errorMessage || `Invalid value for ${field}`}
                        </li>
                      );
                    })}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={disabled || isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default DynamicFormRenderer;
