

/**
 * Retry Queue for Offline Operations
 * Queues tasks for re-execution when network becomes available
 */

import * as React from 'react';
const { useState, useEffect } = React;

import localforage from 'localforage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { trackEvent } from './monitoring';

const QUEUE_KEY = 'pf-retry-queue';

interface QueuedOperation {
  id: string;
  type: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
}

type OperationHandler = (data: unknown) => Promise<void>;

const operationHandlers: Map<string, OperationHandler> = new Map();

// Register operation handlers
export function registerOperationHandler(type: string, handler: OperationHandler) {
  operationHandlers.set(type, handler);
}

// Enqueue operation for later retry
export async function enqueueOperation(type: string, data: unknown): Promise<void> {
  try {
    const operations: QueuedOperation[] = (await localforage.getItem(QUEUE_KEY)) || [];
    const task: QueuedOperation = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    operations.push(task);
    await localforage.setItem(QUEUE_KEY, operations);
    
    trackEvent('operation_queued', {
      operation_type: type,
      queue_size: operations.length,
    });
  } catch (error) {
    console.error('Failed to enqueue operation:', error);
  }
}

// Hook to handle retry queue
export function useRetryQueue() {
  const { isOnline } = useNetworkStatus();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOnline && !isProcessing) {
      processQueue();
    }
  }, [isOnline, isProcessing]);

  const processQueue = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await flushQueuedOperations();
    } finally {
      setIsProcessing(false);
    }
  };

  return { processQueue, isProcessing };
}

// Process queued operations
async function flushQueuedOperations() {
  try {
    const operations: QueuedOperation[] = (await localforage.getItem(QUEUE_KEY)) || [];
    if (operations.length === 0) return;

    const remaining: QueuedOperation[] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const operation of operations) {
      const handler = operationHandlers.get(operation.type);
      
      if (!handler) {
        console.warn(`No handler registered for operation type: ${operation.type}`);
        continue;
      }

      try {
        await handler(operation.data);
        successCount++;
        
        trackEvent('queued_operation_success', {
          operation_type: operation.type,
          retry_count: operation.retryCount,
          queue_time: Date.now() - operation.timestamp,
        });
      } catch (error) {
        operation.retryCount++;
        failureCount++;
        
        // Retry up to 3 times
        if (operation.retryCount < 3) {
          remaining.push(operation);
        }
        
        trackEvent('queued_operation_failure', {
          operation_type: operation.type,
          retry_count: operation.retryCount,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    await localforage.setItem(QUEUE_KEY, remaining);
    
    if (successCount > 0 || failureCount > 0) {
      trackEvent('queue_processed', {
        success_count: successCount,
        failure_count: failureCount,
        remaining_count: remaining.length,
      });
    }
  } catch (error) {
    console.error('Failed to process retry queue:', error);
  }
}
