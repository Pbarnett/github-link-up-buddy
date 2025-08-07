

/**
 * Smart Error Boundary
 * Global error boundary with retry mechanisms and graceful degradation
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

type ReactNode = React.ReactNode;
type ErrorInfo = React.ErrorInfo;
type ComponentType<P = {}> = React.ComponentType<P>;

// Safe error reporting that doesn't throw
const reportError = (error: Error, context?: any) => {
  try {
    console.error('Error reported:', error, context);
    // Add your error reporting service here
  } catch (e) {
    console.error('Failed to report error:', e);
  }
};

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'global';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  isRetrying: boolean;
}

export class SmartErrorBoundary extends React.Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Report error with context
    const safeProps = {
      level: this.props.level || 'component',
      // Only include safe props to avoid circular references
      hasChildren: !!this.props.children,
      hasFallback: !!this.props.fallback,
    };

    reportError(error, {
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
      retryCount: this.state.retryCount,
      props: JSON.stringify(safeProps, null, 2),
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state;

    // Don't allow more than 3 retries
    if (retryCount >= 3) {
      return;
    }

    this.setState({ isRetrying: true });

    // Retry with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);

    this.retryTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
        isRetrying: false,
      });
    }, delay);
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  private renderErrorFallback() {
    const { error, retryCount, isRetrying } = this.state;
    const { level = 'component' } = this.props;

    const canRetry = retryCount < 3;
    const isGlobalError = level === 'global' || level === 'page';

    if (isGlobalError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. Our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert>
                  <AlertDescription className="text-sm font-mono">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                {canRetry && (
                  <Button
                    onClick={this.handleRetry}
                    disabled={isRetrying}
                    className="w-full"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again ({3 - retryCount} attempts left)
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>

              {import.meta.env.DEV && error && (
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer">
                    Technical Details (Development)
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Component-level error fallback
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>This component encountered an error</span>
          {canRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={this.handleRetry}
              disabled={isRetrying}
              className="ml-2"
            >
              {isRetrying ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                'Retry'
              )}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorFallback();
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  level: Props['level'] = 'component'
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <SmartErrorBoundary level={level}>
        <Component {...props} />
      </SmartErrorBoundary>
    );
  };
}
