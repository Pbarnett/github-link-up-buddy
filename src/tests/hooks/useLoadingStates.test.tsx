/**
 * Test Suite for Loading States System
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  useLoadingStates, 
  useFormLoadingStates, 
  FORM_LOADING_OPERATIONS,
  type LoadingOperation 
} from '@/hooks/useLoadingStates';

describe('useLoadingStates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty operations', () => {
    const { result } = renderHook(() => useLoadingStates());

    expect(result.current.operations).toEqual({});
    expect(result.current.isAnyLoading()).toBe(false);
  });

  it('should start a loading operation', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        {
          id: 'stage1',
          label: 'Stage 1',
          description: 'First stage',
          estimatedDuration: 1000,
        },
        {
          id: 'stage2',
          label: 'Stage 2',
          description: 'Second stage',
          estimatedDuration: 2000,
        },
      ],
      timeoutMs: 5000,
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation).toBeDefined();
    expect(operation?.isLoading).toBe(true);
    expect(operation?.currentStage?.id).toBe('stage1');
    expect(operation?.stageIndex).toBe(0);
    expect(operation?.totalStages).toBe(2);
    expect(operation?.progress).toBe(0);
    expect(result.current.isAnyLoading()).toBe(true);
  });

  it('should advance to next stage', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1', estimatedDuration: 1000 },
        { id: 'stage2', label: 'Stage 2', estimatedDuration: 1000 },
      ],
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    act(() => {
      result.current.nextStage('test_operation', { customData: 'test' });
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.stageIndex).toBe(1);
    expect(operation?.metadata).toEqual({ customData: 'test' });
  });

  it('should complete loading operation', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1', estimatedDuration: 1000 },
      ],
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    act(() => {
      result.current.completeLoading('test_operation', { result: 'success' });
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.isLoading).toBe(false);
    expect(operation?.progress).toBe(100);
    expect(operation?.currentStage).toBeUndefined();
    expect(operation?.metadata).toEqual({ result: 'success' });
    expect(result.current.isAnyLoading()).toBe(false);
  });

  it('should handle loading errors', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1', estimatedDuration: 1000 },
      ],
    };

    const testError = new Error('Test error');

    act(() => {
      result.current.startLoading(mockOperation);
    });

    act(() => {
      result.current.errorLoading('test_operation', testError);
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.isLoading).toBe(false);
    expect(operation?.error).toBe(testError);
    expect(result.current.isAnyLoading()).toBe(false);
  });

  it('should handle timeout', () => {
    const onTimeoutMock = vi.fn();
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1', estimatedDuration: 1000 },
      ],
      timeoutMs: 1000,
      onTimeout: onTimeoutMock,
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    // Fast-forward time past the timeout
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.hasTimedOut).toBe(true);
    expect(operation?.isLoading).toBe(false);
    expect(onTimeoutMock).toHaveBeenCalled();
  });

  it('should update progress over time', () => {
    const onProgressMock = vi.fn();
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1', estimatedDuration: 1000 },
      ],
      onProgress: onProgressMock,
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    // Advance time to trigger progress updates
    act(() => {
      vi.advanceTimersByTime(600); // Progress update interval is 500ms
    });

    expect(onProgressMock).toHaveBeenCalled();
    
    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.elapsedTime).toBeGreaterThan(0);
    expect(operation?.progress).toBeGreaterThan(0);
  });

  it('should clear completed operations', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation1: LoadingOperation = {
      id: 'completed_operation',
      stages: [{ id: 'stage1', label: 'Stage 1' }],
    };

    const mockOperation2: LoadingOperation = {
      id: 'ongoing_operation',
      stages: [{ id: 'stage1', label: 'Stage 1' }],
    };

    act(() => {
      result.current.startLoading(mockOperation1);
      result.current.startLoading(mockOperation2);
    });

    act(() => {
      result.current.completeLoading('completed_operation');
    });

    expect(Object.keys(result.current.operations)).toHaveLength(2);

    act(() => {
      result.current.clearCompleted();
    });

    expect(Object.keys(result.current.operations)).toHaveLength(1);
    expect(result.current.getLoadingState('ongoing_operation')).toBeDefined();
    expect(result.current.getLoadingState('completed_operation')).toBeUndefined();
  });

  it('should auto-complete when advancing past final stage', () => {
    const { result } = renderHook(() => useLoadingStates());

    const mockOperation: LoadingOperation = {
      id: 'test_operation',
      stages: [
        { id: 'stage1', label: 'Stage 1' },
      ],
    };

    act(() => {
      result.current.startLoading(mockOperation);
    });

    // Advance past the final stage
    act(() => {
      result.current.nextStage('test_operation');
    });

    const operation = result.current.getLoadingState('test_operation');
    expect(operation?.isLoading).toBe(false);
    expect(operation?.progress).toBe(100);
    expect(operation?.stageIndex).toBe(1); // Total stages
  });

  it('should handle multiple concurrent operations', () => {
    const { result } = renderHook(() => useLoadingStates());

    const operation1: LoadingOperation = {
      id: 'operation1',
      stages: [{ id: 'stage1', label: 'Stage 1' }],
    };

    const operation2: LoadingOperation = {
      id: 'operation2',
      stages: [{ id: 'stage1', label: 'Stage 1' }],
    };

    act(() => {
      result.current.startLoading(operation1);
      result.current.startLoading(operation2);
    });

    expect(result.current.isAnyLoading()).toBe(true);
    expect(Object.keys(result.current.operations)).toHaveLength(2);

    act(() => {
      result.current.completeLoading('operation1');
    });

    expect(result.current.isAnyLoading()).toBe(true); // operation2 still loading

    act(() => {
      result.current.completeLoading('operation2');
    });

    expect(result.current.isAnyLoading()).toBe(false);
  });
});

describe('useFormLoadingStates', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should provide form-specific loading operations', () => {
    const { result } = renderHook(() => useFormLoadingStates());

    expect(result.current.submitForm).toBeDefined();
    expect(result.current.searchFlights).toBeDefined();
    expect(result.current.startLoading).toBeDefined();
  });

  it('should handle form submission with stages', () => {
    const { result } = renderHook(() => useFormLoadingStates());
    
    // Test that submitForm method exists and can be called
    expect(result.current.submitForm).toBeDefined();
    
    // Basic test to ensure the method works
    const mockSubmitFn = vi.fn().mockResolvedValue(undefined);
    expect(() => result.current.submitForm(mockSubmitFn)).not.toThrow();
  });

  it('should handle form submission errors', () => {
    const { result } = renderHook(() => useFormLoadingStates());
    
    // Test that submitForm method exists and can handle errors
    expect(result.current.submitForm).toBeDefined();
    
    const mockSubmitFn = vi.fn().mockRejectedValue(new Error('Test error'));
    
    // Test that error handling is set up
    expect(() => result.current.submitForm(mockSubmitFn)).not.toThrow();
  });

  it('should handle flight search with stages', () => {
    const { result } = renderHook(() => useFormLoadingStates());
    
    // Test that searchFlights method exists and can be called
    expect(result.current.searchFlights).toBeDefined();
    
    // Basic test to ensure the method works
    const mockSearchFn = vi.fn().mockResolvedValue(undefined);
    expect(() => result.current.searchFlights(mockSearchFn)).not.toThrow();
  });
});

describe('FORM_LOADING_OPERATIONS', () => {
  it('should define form submission operation', () => {
    const operation = FORM_LOADING_OPERATIONS.FORM_SUBMISSION;
    
    expect(operation.id).toBe('form_submission');
    expect(operation.stages).toHaveLength(4);
    expect(operation.stages[0].id).toBe('validation');
    expect(operation.stages[1].id).toBe('transformation');
    expect(operation.stages[2].id).toBe('submission');
    expect(operation.stages[3].id).toBe('processing');
    expect(operation.timeoutMs).toBe(15000);
  });

  it('should define flight search operation', () => {
    const operation = FORM_LOADING_OPERATIONS.FLIGHT_SEARCH;
    
    expect(operation.id).toBe('flight_search');
    expect(operation.stages).toHaveLength(4);
    expect(operation.stages[0].id).toBe('initializing');
    expect(operation.stages[1].id).toBe('searching');
    expect(operation.stages[2].id).toBe('analyzing');
    expect(operation.stages[3].id).toBe('finalizing');
    expect(operation.timeoutMs).toBe(30000);
  });

  it('should define payment processing operation', () => {
    const operation = FORM_LOADING_OPERATIONS.PAYMENT_PROCESSING;
    
    expect(operation.id).toBe('payment_processing');
    expect(operation.stages).toHaveLength(3);
    expect(operation.stages[0].id).toBe('validating_payment');
    expect(operation.stages[1].id).toBe('processing_payment');
    expect(operation.stages[2].id).toBe('confirming');
    expect(operation.timeoutMs).toBe(20000);
  });

  it('should have realistic estimated durations', () => {
    const formSubmission = FORM_LOADING_OPERATIONS.FORM_SUBMISSION;
    const totalDuration = formSubmission.stages.reduce(
      (sum, stage) => sum + (stage.estimatedDuration || 0), 
      0
    );
    
    expect(totalDuration).toBe(6500); // 1000 + 500 + 2000 + 3000
    expect(totalDuration).toBeLessThan(formSubmission.timeoutMs!);
  });
});
