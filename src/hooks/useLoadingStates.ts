/**
 * Advanced Loading States System
 * 
 * Provides contextual loading feedback with progress tracking,
 * stage indicators, and intelligent timeout handling
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface LoadingStage {
  id: string;
  label: string;
  description?: string;
  estimatedDuration?: number; // in milliseconds
  isOptional?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  currentStage?: LoadingStage;
  stageIndex: number;
  totalStages: number;
  progress: number; // 0-100
  elapsedTime: number;
  estimatedTimeRemaining?: number;
  hasTimedOut: boolean;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface LoadingOperation {
  id: string;
  stages: readonly LoadingStage[];
  timeoutMs?: number;
  onTimeout?: () => void;
  onProgress?: (state: LoadingState) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export function useLoadingStates() {
  const [operations, setOperations] = useState<Record<string, LoadingState>>({});
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const progressTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const startTimes = useRef<Record<string, number>>({});
  const originalOperations = useRef<Record<string, LoadingOperation>>({});

  // Start a loading operation
  const startLoading = useCallback((operation: LoadingOperation) => {
    const startTime = Date.now();
    startTimes.current[operation.id] = startTime;
    originalOperations.current[operation.id] = operation;

    // Initialize loading state
    const initialState: LoadingState = {
      isLoading: true,
      currentStage: operation.stages[0],
      stageIndex: 0,
      totalStages: operation.stages.length,
      progress: 0,
      elapsedTime: 0,
      hasTimedOut: false,
      metadata: {},
    };

    setOperations(prev => ({
      ...prev,
      [operation.id]: initialState,
    }));

    // Set up timeout
    if (operation.timeoutMs || DEFAULT_TIMEOUT) {
      timers.current[operation.id] = setTimeout(() => {
        setOperations(prev => ({
          ...prev,
          [operation.id]: {
            ...prev[operation.id],
            hasTimedOut: true,
            isLoading: false,
          },
        }));
        operation.onTimeout?.();
      }, operation.timeoutMs || DEFAULT_TIMEOUT);
    }

    // Set up progress tracking
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      setOperations(prev => {
        const current = prev[operation.id];
        if (!current || !current.isLoading) return prev;

        const currentStage = current.currentStage;
        let progress = current.progress;
        let estimatedTimeRemaining: number | undefined;

        // Calculate progress based on stages and time
        if (currentStage?.estimatedDuration) {
          const stageProgress = Math.min(
            elapsed / currentStage.estimatedDuration * 100,
            100
          );
          const baseProgress = (current.stageIndex / operation.stages.length) * 100;
          const stageWeight = 100 / operation.stages.length;
          progress = baseProgress + (stageProgress * stageWeight / 100);

          // Estimate remaining time
          if (progress > 0) {
            const totalEstimated = (elapsed / progress) * 100;
            estimatedTimeRemaining = Math.max(0, totalEstimated - elapsed);
          }
        } else {
          // Fallback: linear progress based on time
          const totalEstimated = operation.stages.reduce(
            (sum, stage) => sum + (stage.estimatedDuration || 5000),
            0
          );
          progress = Math.min((elapsed / totalEstimated) * 100, 95); // Never reach 100% without explicit completion
        }

        const updatedState = {
          ...current,
          progress: Math.min(progress, 100),
          elapsedTime: elapsed,
          estimatedTimeRemaining,
        };

        operation.onProgress?.(updatedState);
        return {
          ...prev,
          [operation.id]: updatedState,
        };
      });

      // Continue updating if still loading
      if (operations[operation.id]?.isLoading) {
        progressTimers.current[operation.id] = setTimeout(updateProgress, 500);
      }
    };

    // Start progress updates
    progressTimers.current[operation.id] = setTimeout(updateProgress, 500);

    return operation.id;
  }, [operations]);

  // Advance to next stage
  const nextStage = useCallback((operationId: string, metadata?: Record<string, any>) => {
    setOperations(prev => {
      const current = prev[operationId];
      if (!current || !current.isLoading) return prev;

      const nextIndex = current.stageIndex + 1;
      const isComplete = nextIndex >= current.totalStages;
      const originalOperation = originalOperations.current[operationId];

      if (isComplete) {
        // Complete the operation
        if (timers.current[operationId]) {
          clearTimeout(timers.current[operationId]);
          delete timers.current[operationId];
        }
        if (progressTimers.current[operationId]) {
          clearTimeout(progressTimers.current[operationId]);
          delete progressTimers.current[operationId];
        }

        return {
          ...prev,
          [operationId]: {
            ...current,
            isLoading: false,
            progress: 100,
            stageIndex: current.totalStages,
            currentStage: undefined,
            metadata: { ...current.metadata, ...metadata },
          },
        };
      }

      // Get the next stage from the original operation
      const nextStage = originalOperation?.stages[nextIndex];
      
      return {
        ...prev,
        [operationId]: {
          ...current,
          stageIndex: nextIndex,
          currentStage: nextStage,
          metadata: { ...current.metadata, ...metadata },
        },
      };
    });
  }, []);

  // Complete a loading operation
  const completeLoading = useCallback((operationId: string, metadata?: Record<string, any>) => {
    setOperations(prev => {
      const current = prev[operationId];
      if (!current) return prev;

      // Clear timers
      if (timers.current[operationId]) {
        clearTimeout(timers.current[operationId]);
        delete timers.current[operationId];
      }
      if (progressTimers.current[operationId]) {
        clearTimeout(progressTimers.current[operationId]);
        delete progressTimers.current[operationId];
      }

      return {
        ...prev,
        [operationId]: {
          ...current,
          isLoading: false,
          progress: 100,
          currentStage: undefined,
          metadata: { ...current.metadata, ...metadata },
        },
      };
    });
  }, []);

  // Handle loading error
  const errorLoading = useCallback((operationId: string, error: Error) => {
    setOperations(prev => {
      const current = prev[operationId];
      if (!current) return prev;

      // Clear timers
      if (timers.current[operationId]) {
        clearTimeout(timers.current[operationId]);
        delete timers.current[operationId];
      }
      if (progressTimers.current[operationId]) {
        clearTimeout(progressTimers.current[operationId]);
        delete progressTimers.current[operationId];
      }

      return {
        ...prev,
        [operationId]: {
          ...current,
          isLoading: false,
          error,
        },
      };
    });
  }, []);

  // Get loading state for an operation
  const getLoadingState = useCallback((operationId: string): LoadingState | undefined => {
    return operations[operationId];
  }, [operations]);

  // Check if any operation is loading
  const isAnyLoading = useCallback((): boolean => {
    return Object.values(operations).some(op => op.isLoading);
  }, [operations]);

  // Clear completed operations
  const clearCompleted = useCallback(() => {
    setOperations(prev => {
      const filtered = Object.entries(prev).reduce((acc, [id, state]) => {
        if (state.isLoading) {
          acc[id] = state;
        }
        return acc;
      }, {} as Record<string, LoadingState>);
      return filtered;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(timer => clearTimeout(timer));
      Object.values(progressTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  return {
    startLoading,
    nextStage,
    completeLoading,
    errorLoading,
    getLoadingState,
    isAnyLoading,
    clearCompleted,
    operations,
  };
}

// Predefined loading operations for common form actions
export const FORM_LOADING_OPERATIONS = {
  FORM_SUBMISSION: {
    id: 'form_submission',
    stages: [
      {
        id: 'validation',
        label: 'Validating form data',
        description: 'Checking all fields are correct',
        estimatedDuration: 1000,
      },
      {
        id: 'transformation',
        label: 'Preparing data',
        description: 'Converting form data for submission',
        estimatedDuration: 500,
      },
      {
        id: 'submission',
        label: 'Submitting request',
        description: 'Sending your trip request',
        estimatedDuration: 2000,
      },
      {
        id: 'processing',
        label: 'Processing request',
        description: 'Creating your trip and starting search',
        estimatedDuration: 3000,
      },
    ],
    timeoutMs: 15000,
  },

  FLIGHT_SEARCH: {
    id: 'flight_search',
    stages: [
      {
        id: 'initializing',
        label: 'Initializing search',
        description: 'Connecting to flight search service',
        estimatedDuration: 1000,
      },
      {
        id: 'searching',
        label: 'Searching flights',
        description: 'Finding flights matching your criteria',
        estimatedDuration: 8000,
      },
      {
        id: 'analyzing',
        label: 'Analyzing results',
        description: 'Scoring and ranking flight options',
        estimatedDuration: 2000,
      },
      {
        id: 'finalizing',
        label: 'Finalizing results',
        description: 'Preparing your flight recommendations',
        estimatedDuration: 1000,
      },
    ],
    timeoutMs: 30000,
  },

  PAYMENT_PROCESSING: {
    id: 'payment_processing',
    stages: [
      {
        id: 'validating_payment',
        label: 'Validating payment method',
        description: 'Checking your payment information',
        estimatedDuration: 2000,
      },
      {
        id: 'processing_payment',
        label: 'Processing payment',
        description: 'Securely processing your payment',
        estimatedDuration: 3000,
      },
      {
        id: 'confirming',
        label: 'Confirming booking',
        description: 'Finalizing your flight booking',
        estimatedDuration: 2000,
      },
    ],
    timeoutMs: 20000,
  },
} as const;

/**
 * Hook for form-specific loading states
 */
export function useFormLoadingStates() {
  const loadingStates = useLoadingStates();

  const submitForm = useCallback(async (
    submitFn: () => Promise<void>,
    onProgress?: (state: LoadingState) => void
  ) => {
    const operationId = loadingStates.startLoading({
      ...FORM_LOADING_OPERATIONS.FORM_SUBMISSION,
      onProgress,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Validation
      loadingStates.nextStage(operationId);

      await new Promise(resolve => setTimeout(resolve, 500)); // Transformation
      loadingStates.nextStage(operationId);

      await submitFn(); // Actual submission
      loadingStates.nextStage(operationId);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Processing
      loadingStates.completeLoading(operationId);

    } catch (error) {
      loadingStates.errorLoading(operationId, error as Error);
      throw error;
    }
  }, [loadingStates]);

  const searchFlights = useCallback(async (
    searchFn: () => Promise<void>,
    onProgress?: (state: LoadingState) => void
  ) => {
    const operationId = loadingStates.startLoading({
      ...FORM_LOADING_OPERATIONS.FLIGHT_SEARCH,
      onProgress,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Initializing
      loadingStates.nextStage(operationId);

      await searchFn(); // Actual search
      loadingStates.nextStage(operationId);

      await new Promise(resolve => setTimeout(resolve, 2000)); // Analyzing
      loadingStates.nextStage(operationId);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Finalizing
      loadingStates.completeLoading(operationId);

    } catch (error) {
      loadingStates.errorLoading(operationId, error as Error);
      throw error;
    }
  }, [loadingStates]);

  return {
    ...loadingStates,
    submitForm,
    searchFlights,
  };
}
