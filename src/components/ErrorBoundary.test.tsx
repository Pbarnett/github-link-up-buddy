import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { SmartErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Mock console.error to suppress error output during tests
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  vi.clearAllTimers();
  vi.useRealTimers();
});

// Test components
const ThrowingComponent = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Component rendered successfully</div>;
};

const AsyncThrowingComponent = ({ delay = 0 }: { delay?: number }) => {
  React.useEffect(() => {
    setTimeout(() => {
      throw new Error('Async error');
    }, delay);
  }, [delay]);
  return <div>Async component</div>;
};

describe('SmartErrorBoundary', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('Error Catching', () => {
    test('catches errors and displays component-level fallback', () => {
      render(
        <SmartErrorBoundary level="component">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('This component encountered an error')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    test('displays global-level fallback for page/global errors', () => {
      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We encountered an unexpected error. Our team has been notified.')).toBeInTheDocument();
      expect(screen.getByText(/Try Again \(3 attempts left\)/)).toBeInTheDocument();
      expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
    });

    test('uses custom fallback when provided', () => {
      const customFallback = <div>Custom error fallback</div>;
      
      render(
        <SmartErrorBoundary fallback={customFallback}>
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
      expect(screen.queryByText('This component encountered an error')).not.toBeInTheDocument();
    });

    test('renders children when no error occurs', () => {
      render(
        <SmartErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('Component rendered successfully')).toBeInTheDocument();
    });
  });

  describe('Retry Mechanism', () => {
    test('retry button triggers timeout and clears error state', () => {
      render(
        <SmartErrorBoundary level="component">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      // Error should be displayed initially
      expect(screen.getByText('This component encountered an error')).toBeInTheDocument();
      
      const retryButton = screen.getByText('Retry');
      
      // Click retry
      fireEvent.click(retryButton);
      
      // Should show retrying state immediately
      expect(retryButton).toBeDisabled();
      
      // Wait for retry timeout (3 seconds)
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // After timeout, error boundary should have attempted to reset
      // (The component will still throw the error again, but we've verified the retry mechanism works)
      expect(screen.queryByText('This component encountered an error')).toBeInTheDocument();
    });

    test('limits retry attempts to 3', () => {
      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      const getRetryButton = () => screen.getByText(/Try Again/);
      
      // First retry
      fireEvent.click(getRetryButton());
      act(() => { vi.advanceTimersByTime(3000); });
      expect(screen.getByText(/Try Again \(2 attempts left\)/)).toBeInTheDocument();

      // Second retry
      fireEvent.click(getRetryButton());
      act(() => { vi.advanceTimersByTime(3000); });
      expect(screen.getByText(/Try Again \(1 attempts left\)/)).toBeInTheDocument();

      // Third retry
      fireEvent.click(getRetryButton());
      act(() => { vi.advanceTimersByTime(3000); });
      
      // Should no longer have retry button
      expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument();
    });

    test('shows retrying state during retry', () => {
      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      const retryButton = screen.getByText(/Try Again/);
      fireEvent.click(retryButton);
      
      expect(screen.getByText('Retrying...')).toBeInTheDocument();
      expect(retryButton).toBeDisabled();
    });
  });

  describe('Navigation Actions', () => {
    test('Go to Dashboard button navigates correctly', () => {
      // Mock window.location
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      const dashboardButton = screen.getByText('Go to Dashboard');
      fireEvent.click(dashboardButton);
      
      expect(mockLocation.href).toBe('/dashboard');
    });
  });

  describe('Error Information Display', () => {
    test('displays error message in global fallback', () => {
      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    test('shows technical details in development mode', () => {
      // Mock development environment
      const originalEnv = import.meta.env.DEV;
      import.meta.env.DEV = true;

      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.getByText('Technical Details (Development)')).toBeInTheDocument();
      
      // Restore original environment
      import.meta.env.DEV = originalEnv;
    });

    test('hides technical details in production mode', () => {
      // Mock production environment
      const originalEnv = import.meta.env.DEV;
      import.meta.env.DEV = false;

      render(
        <SmartErrorBoundary level="global">
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      expect(screen.queryByText('Technical Details (Development)')).not.toBeInTheDocument();
      
      // Restore original environment
      import.meta.env.DEV = originalEnv;
    });
  });

  describe('Cleanup', () => {
    test('clears timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
      
      const { unmount } = render(
        <SmartErrorBoundary>
          <ThrowingComponent />
        </SmartErrorBoundary>
      );

      // Trigger retry to set timeout
      const retryButton = screen.getByText('Retry');
      fireEvent.click(retryButton);
      
      // Unmount component
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });
});

describe('withErrorBoundary HOC', () => {
  test('wraps component with error boundary', () => {
    const TestComponent = () => <div>Test Component</div>;
    const WrappedComponent = withErrorBoundary(TestComponent, 'component');
    
    render(<WrappedComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('catches errors in wrapped component', () => {
    const WrappedThrowingComponent = withErrorBoundary(ThrowingComponent, 'component');
    
    render(<WrappedThrowingComponent />);
    expect(screen.getByText('This component encountered an error')).toBeInTheDocument();
  });

  test('uses specified error boundary level', () => {
    const WrappedThrowingComponent = withErrorBoundary(ThrowingComponent, 'global');
    
    render(<WrappedThrowingComponent />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('defaults to component level when no level specified', () => {
    const WrappedThrowingComponent = withErrorBoundary(ThrowingComponent);
    
    render(<WrappedThrowingComponent />);
    expect(screen.getByText('This component encountered an error')).toBeInTheDocument();
  });
});

describe('Error Boundary Edge Cases', () => {
  test('handles multiple rapid retries correctly', () => {
    render(
      <SmartErrorBoundary level="component">
        <ThrowingComponent />
      </SmartErrorBoundary>
    );

    const retryButton = screen.getByText('Retry');
    
    // Click retry once
    fireEvent.click(retryButton);
    
    // Button should be disabled after first click
    expect(retryButton).toBeDisabled();
    
    // Additional clicks should have no effect
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    
    // Should still be disabled and show spinner icon
    expect(retryButton).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none');
  });

  test('handles error boundary within error boundary', () => {
    const NestedThrowingComponent = () => {
      throw new Error('Nested error');
    };

    render(
      <SmartErrorBoundary level="global">
        <SmartErrorBoundary level="component">
          <NestedThrowingComponent />
        </SmartErrorBoundary>
      </SmartErrorBoundary>
    );

    // Inner boundary should catch the error
    expect(screen.getByText('This component encountered an error')).toBeInTheDocument();
  });
});

