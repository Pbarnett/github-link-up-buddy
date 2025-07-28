import * as React from 'react';
import { useMemo } from 'react';
import { UseFormReturn, FormProvider } from 'react-hook-form';

/**
 * Optimized FormProvider Component
 *
 * Wraps React Hook Form's FormProvider with performance optimizations
 * to prevent unnecessary re-renders in complex form applications.
 */

type ReactNode = React.ReactNode;
type FC<T = {}> = React.FC<T>;
type _Component<P = {}, S = {}> = React.Component<P, S>;

interface OptimizedFormProviderProps {
  children: ReactNode;
  form: UseFormReturn<any>;
  className?: string;
}

/**
 * Optimized FormProvider that uses memo to prevent
 * unnecessary re-renders when form state hasn't changed
 */
export const OptimizedFormProvider: FC<OptimizedFormProviderProps> = React.memo(
  ({ children, form, className }) => {
    // Memoize form methods to prevent recreation on each render
    const memoizedFormMethods = useMemo(
      () => ({
        ...form,
        // Extract commonly used form state to optimize subscriptions
        formState: form.formState,
      }),
      [form]
    );

    return (
      <FormProvider {...memoizedFormMethods}>
        <div className={className}>{children}</div>
      </FormProvider>
    );
  },
  // Custom comparison function to optimize re-renders
  (prevProps, nextProps) => {
    // Only re-render if form state has actually changed
    const prevFormState = prevProps.form.formState;
    const nextFormState = nextProps.form.formState;

    // Compare key form state properties
    const hasFormStateChanged =
      prevFormState.isDirty !== nextFormState.isDirty ||
      prevFormState.isValid !== nextFormState.isValid ||
      prevFormState.isSubmitting !== nextFormState.isSubmitting ||
      JSON.stringify(prevFormState.errors) !==
        JSON.stringify(nextFormState.errors);

    // Re-render if form state changed or children changed
    return !hasFormStateChanged && prevProps.children === nextProps.children;
  }
);

OptimizedFormProvider.displayName = 'OptimizedFormProvider';

/**
 * Optimized form section component that only re-renders when its specific
 * form state changes, following React Hook Form best practices
 */
interface OptimizedFormSectionProps {
  children: ReactNode;
  formState: {
    isDirty?: boolean;
    isValid?: boolean;
    isSubmitting?: boolean;
    errors?: Record<string, any>;
  };
  className?: string;
}

export const OptimizedFormSection: FC<OptimizedFormSectionProps> = React.memo(
  ({ children, formState, className }) => {
    // Destructure formState to properly subscribe to changes
    const { isDirty, isValid, isSubmitting, errors } = formState;

    return (
      <div
        className={className}
        data-form-dirty={isDirty}
        data-form-valid={isValid}
        data-form-submitting={isSubmitting}
      >
        {children}
        {/* Optional: Add visual indicators for form state */}
        {isDirty && !isSubmitting && (
          <div className="text-xs text-muted-foreground mt-2">
            • Form has unsaved changes
          </div>
        )}
      </div>
    );
  },
  // Compare form state properties for optimal re-rendering
  (prevProps, nextProps) => {
    return (
      prevProps.formState.isDirty === nextProps.formState.isDirty &&
      prevProps.formState.isValid === nextProps.formState.isValid &&
      prevProps.formState.isSubmitting === nextProps.formState.isSubmitting &&
      JSON.stringify(prevProps.formState.errors) ===
        JSON.stringify(nextProps.formState.errors) &&
      prevProps.children === nextProps.children
    );
  }
);

OptimizedFormSection.displayName = 'OptimizedFormSection';

export default OptimizedFormProvider;
