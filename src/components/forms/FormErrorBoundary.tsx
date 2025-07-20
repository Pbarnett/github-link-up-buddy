
/**
 * Form Error Boundary Component
 * 
 * Catches and handles errors in React Hook Form components
 * following best practices for error handling and user experience
 */

import * as React from 'react';
const { useCallback } = React;
type ReactNode = React.ReactNode;
type ErrorInfo = React.ErrorInfo;
type ComponentType<P = {}> = React.ComponentType<P>;

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number | boolean | null | undefined>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
}

/**
 * Form Error Boundary that catches form-related errors and provides
 * user-friendly error messages with recovery options
 */
export class FormErrorBoundary extends React.Component<Props, State> {
  private resetTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: ''
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for logging purposes
    const errorId = `form-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Form Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      errorInfo,
      errorId: this.state.errorId
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo
    });
  }

  public componentDidUpdate(prevProps: Props) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when specified props change
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (resetKey, index) => prevProps.resetKeys?.[index] !== resetKey
      );

      if (hasResetKeyChanged) {
        this.resetError();
      }
    }
  }

  public componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: ''
    });
  };

  private handleRetry = () => {
    this.resetError();
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Determine error type for better user messaging
      const isFormValidationError = error?.message?.includes('validation') ||
        error?.message?.includes('required') ||
        error?.message?.includes('invalid');

      const isNetworkError = error?.message?.includes('fetch') ||
        error?.message?.includes('network') ||
        error?.message?.includes('timeout');

      const isRenderError = error?.message?.includes('render') ||
        error?.name === 'ChunkLoadError';

      // Provide contextual error messages
      let errorTitle = 'Form Error';
      let errorMessage = 'An unexpected error occurred while processing your form.';
      let showReload = false;

      if (isFormValidationError) {
        errorTitle = 'Form Validation Error';
        errorMessage = 'There was an issue with form validation. Please check your inputs and try again.';
      } else if (isNetworkError) {
        errorTitle = 'Connection Error';
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (isRenderError) {
        errorTitle = 'Loading Error';
        errorMessage = 'There was an issue loading the form. Please refresh the page to try again.';
        showReload = true;
      }

      return (
        <div className="form-error-boundary p-6">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{errorTitle}</h3>
                  <p className="text-sm">{errorMessage}</p>
                </div>

                {/* Error ID for support purposes */}
                <div className="text-xs text-muted-foreground">
                  Error ID: {errorId}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={this.handleRetry}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Try Again
                  </Button>
                  
                  {showReload && (
                    <Button
                      onClick={this.handleReload}
                      variant="default"
                      size="sm"
                    >
                      Reload Page
                    </Button>
                  )}
                </div>

                {/* Development error details */}
                {process.env.NODE_ENV === 'development' && error && (
                  <details className="mt-4 p-3 bg-gray-50 rounded text-xs">
                    <summary className="cursor-pointer font-medium">
                      Development Error Details
                    </summary>
                    <div className="mt-2 space-y-2">
                      <div>
                        <strong>Error:</strong> {error.message}
                      </div>
                      {error.stack && (
                        <div>
                          <strong>Stack Trace:</strong>
                          <pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded border mt-1">
                            {error.stack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook for using form error boundary functionality
 */
export const useFormErrorHandler = () => {
  const handleFormError = useCallback((error: Error) => {
    console.error('Form error:', error);
    
    // You can integrate with error reporting services here
    // Example: Sentry.captureException(error);
    
    return error;
  }, []);

  return { handleFormError };
};

/**
 * Higher-order component wrapper for form error boundary
 */
export const withFormErrorBoundary = <P extends object>(
  Component: ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <FormErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </FormErrorBoundary>
  );

  WrappedComponent.displayName = `withFormErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

export default FormErrorBoundary;
