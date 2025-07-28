/**
 * Structured Logger Unit Tests
 * 
 * Tests structured logging with trace correlation,
 * metrics counters, and context management
 */

import { assertEquals, assertExists, assert } from 'https://deno.land/std@0.192.0/testing/asserts.ts';
import {
  log,
  logger,
  setLogContext,
  getLogContext,
  clearLogContext,
  generateRequestId,
  initializeLogContext,
  getMetrics,
  incrementCounter,
  withTiming
} from '../logger.ts';

// Mock console.log to capture output
let capturedLogs: string[] = [];
const originalConsoleLog = console.log;

function mockConsoleLog() {
  capturedLogs = [];
  console.log = (message: string) => {
    capturedLogs.push(message);
  };
}

function restoreConsoleLog() {
  console.log = originalConsoleLog;
}

Deno.test('Logger - Generate unique request ID', () => {
  const id1 = generateRequestId();
  const id2 = generateRequestId();
  
  assert(id1.startsWith('req_'));
  assert(id2.startsWith('req_'));
  assert(id1 !== id2);
  
  // Should be properly formatted
  assert(/^req_\d+_[a-z0-9]{9}$/.test(id1));
});

Deno.test('Logger - Set and get log context', () => {
  clearLogContext();
  
  const context = {
    requestId: 'test-req-123',
    userId: 'user-456',
    function: 'test-function'
  };
  
  setLogContext(context);
  const retrieved = getLogContext();
  
  assertEquals(retrieved.requestId, 'test-req-123');
  assertEquals(retrieved.userId, 'user-456');
  assertEquals(retrieved.function, 'test-function');
  
  // Clear should reset context
  clearLogContext();
  const empty = getLogContext();
  assertEquals(Object.keys(empty).length, 0);
});

Deno.test('Logger - Initialize log context for function', () => {
  clearLogContext();
  
  const context = initializeLogContext('test-function', 'user-123', 'req-456');
  
  assertEquals(context.function, 'test-function');
  assertEquals(context.userId, 'user-123');
  assertEquals(context.requestId, 'req-456');
  
  // Should set global context
  const global = getLogContext();
  assertEquals(global.function, 'test-function');
  assertEquals(global.userId, 'user-123');
  assertEquals(global.requestId, 'req-456');
});

Deno.test('Logger - Initialize with auto-generated request ID', () => {
  clearLogContext();
  
  const context = initializeLogContext('test-function', 'user-123');
  
  assertEquals(context.function, 'test-function');
  assertEquals(context.userId, 'user-123');
  assertExists(context.requestId);
  assert(context.requestId!.startsWith('req_'));
});

Deno.test('Logger - Structured log output', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    setLogContext({
      requestId: 'test-req-123',
      userId: 'user-456',
      function: 'test-function'
    });
    
    log('info', 'Test message', { operation: 'test_op', duration: 100 });
    
    assertEquals(capturedLogs.length, 1);
    const logEntry = JSON.parse(capturedLogs[0]);
    
    assertEquals(logEntry.level, 'info');
    assertEquals(logEntry.msg, 'Test message');
    assertEquals(logEntry.service, 'parker-flight-auto-booking');
    assertExists(logEntry.timestamp);
    assertExists(logEntry.context);
    
    // Should include global context
    assertEquals(logEntry.context.requestId, 'test-req-123');
    assertEquals(logEntry.context.userId, 'user-456');
    assertEquals(logEntry.context.function, 'test-function');
    
    // Should include provided context
    assertEquals(logEntry.context.operation, 'test_op');
    assertEquals(logEntry.context.duration, 100);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Convenience methods', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    logger.debug('Debug message');
    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    
    assertEquals(capturedLogs.length, 4);
    
    const debugLog = JSON.parse(capturedLogs[0]);
    const infoLog = JSON.parse(capturedLogs[1]);
    const warnLog = JSON.parse(capturedLogs[2]);
    const errorLog = JSON.parse(capturedLogs[3]);
    
    assertEquals(debugLog.level, 'debug');
    assertEquals(debugLog.msg, 'Debug message');
    
    assertEquals(infoLog.level, 'info');
    assertEquals(infoLog.msg, 'Info message');
    
    assertEquals(warnLog.level, 'warn');
    assertEquals(warnLog.msg, 'Warning message');
    
    assertEquals(errorLog.level, 'error');
    assertEquals(errorLog.msg, 'Error message');
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Metrics counters', () => {
  // Reset metrics (assuming they're persistent)
  const initialMetrics = getMetrics();
  const initialSuccessCount = initialMetrics.auto_booking_success_total;
  const initialFailureCount = initialMetrics.auto_booking_failure_total;
  
  incrementCounter('auto_booking_success_total');
  incrementCounter('auto_booking_success_total');
  incrementCounter('auto_booking_failure_total');
  
  const updatedMetrics = getMetrics();
  assertEquals(updatedMetrics.auto_booking_success_total, initialSuccessCount + 2);
  assertEquals(updatedMetrics.auto_booking_failure_total, initialFailureCount + 1);
});

Deno.test('Logger - Booking success logging', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const initialMetrics = getMetrics();
    const initialCount = initialMetrics.auto_booking_success_total;
    
    logger.bookingSuccess('trip-123', 'booking-456', { 
      amount: 299.99 
    });
    
    assertEquals(capturedLogs.length, 1);
    const logEntry = JSON.parse(capturedLogs[0]);
    
    assertEquals(logEntry.level, 'info');
    assertEquals(logEntry.msg, 'Auto-booking completed successfully');
    assertEquals(logEntry.context.tripRequestId, 'trip-123');
    assertEquals(logEntry.context.bookingId, 'booking-456');
    assertEquals(logEntry.context.amount, 299.99);
    assertEquals(logEntry.context.operation, 'auto_booking_complete');
    
    // Should increment counter
    const updatedMetrics = getMetrics();
    assertEquals(updatedMetrics.auto_booking_success_total, initialCount + 1);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Booking failure logging', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const initialMetrics = getMetrics();
    const initialCount = initialMetrics.auto_booking_failure_total;
    
    logger.bookingFailure('trip-123', 'Payment failed', { 
      errorCode: 'PAYMENT_DECLINED' 
    });
    
    assertEquals(capturedLogs.length, 1);
    const logEntry = JSON.parse(capturedLogs[0]);
    
    assertEquals(logEntry.level, 'error');
    assertEquals(logEntry.msg, 'Auto-booking failed');
    assertEquals(logEntry.context.tripRequestId, 'trip-123');
    assertEquals(logEntry.context.error, 'Payment failed');
    assertEquals(logEntry.context.errorCode, 'PAYMENT_DECLINED');
    assertEquals(logEntry.context.operation, 'auto_booking_failed');
    
    // Should increment counter
    const updatedMetrics = getMetrics();
    assertEquals(updatedMetrics.auto_booking_failure_total, initialCount + 1);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Stripe operation logging', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const initialMetrics = getMetrics();
    const initialSuccessCount = initialMetrics.stripe_capture_success_total;
    const initialFailureCount = initialMetrics.stripe_capture_failure_total;
    
    logger.stripeCaptureSuccess('pi_123', 29999, { currency: 'usd' });
    logger.stripeCaptureFailure('pi_456', 'Insufficient funds', { code: 'card_declined' });
    
    assertEquals(capturedLogs.length, 2);
    
    const successLog = JSON.parse(capturedLogs[0]);
    assertEquals(successLog.level, 'info');
    assertEquals(successLog.msg, 'Stripe payment captured successfully');
    assertEquals(successLog.context.paymentIntentId, 'pi_123');
    assertEquals(successLog.context.amount, 29999);
    assertEquals(successLog.context.currency, 'usd');
    
    const failureLog = JSON.parse(capturedLogs[1]);
    assertEquals(failureLog.level, 'error');
    assertEquals(failureLog.msg, 'Stripe payment capture failed');
    assertEquals(failureLog.context.paymentIntentId, 'pi_456');
    assertEquals(failureLog.context.error, 'Insufficient funds');
    assertEquals(failureLog.context.code, 'card_declined');
    
    // Should increment counters
    const updatedMetrics = getMetrics();
    assertEquals(updatedMetrics.stripe_capture_success_total, initialSuccessCount + 1);
    assertEquals(updatedMetrics.stripe_capture_failure_total, initialFailureCount + 1);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Redis lock operation logging', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const initialMetrics = getMetrics();
    const initialAcquiredCount = initialMetrics.redis_lock_acquired_total;
    const initialFailedCount = initialMetrics.redis_lock_failed_total;
    
    logger.lockAcquired('offer:123', 'lock-456', 300, { attempt: 1 });
    logger.lockFailed('offer:789', 'Timeout', { maxRetries: 3 });
    
    assertEquals(capturedLogs.length, 2);
    
    const acquiredLog = JSON.parse(capturedLogs[0]);
    assertEquals(acquiredLog.level, 'debug');
    assertEquals(acquiredLog.msg, 'Redis lock acquired');
    assertEquals(acquiredLog.context.lockKey, 'offer:123');
    assertEquals(acquiredLog.context.lockId, 'lock-456');
    assertEquals(acquiredLog.context.ttl, 300);
    assertEquals(acquiredLog.context.attempt, 1);
    
    const failedLog = JSON.parse(capturedLogs[1]);
    assertEquals(failedLog.level, 'warn');
    assertEquals(failedLog.msg, 'Redis lock acquisition failed');
    assertEquals(failedLog.context.lockKey, 'offer:789');
    assertEquals(failedLog.context.reason, 'Timeout');
    assertEquals(failedLog.context.maxRetries, 3);
    
    // Should increment counters
    const updatedMetrics = getMetrics();
    assertEquals(updatedMetrics.redis_lock_acquired_total, initialAcquiredCount + 1);
    assertEquals(updatedMetrics.redis_lock_failed_total, initialFailedCount + 1);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Performance timing decorator', async () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    // Test async function timing
    const asyncFn = withTiming(
      async (delay: number) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        return 'async-result';
      },
      'async_operation',
      { operation: 'test' }
    );
    
    const result = await asyncFn(10);
    assertEquals(result, 'async-result');
    
    // Should log completion
    assert(capturedLogs.length > 0);
    const logEntry = JSON.parse(capturedLogs[capturedLogs.length - 1]);
    assertEquals(logEntry.level, 'debug');
    assert(logEntry.msg.includes('async_operation completed'));
    assertEquals(logEntry.context.operation, 'async_operation');
    assertEquals(logEntry.context.success, true);
    assert(typeof logEntry.context.duration === 'number');
    assert(logEntry.context.duration >= 10);
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Performance timing decorator error handling', async () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const failingFn = withTiming(
      async () => {
        throw new Error('Test error');
      },
      'failing_operation'
    );
    
    try {
      await failingFn();
      assert(false, 'Should have thrown error');
    } catch (error) {
      assertEquals(error.message, 'Test error');
    }
    
    // Should log failure
    assert(capturedLogs.length > 0);
    const logEntry = JSON.parse(capturedLogs[capturedLogs.length - 1]);
    assertEquals(logEntry.level, 'error');
    assert(logEntry.msg.includes('failing_operation failed'));
    assertEquals(logEntry.context.operation, 'failing_operation');
    assertEquals(logEntry.context.success, false);
    assertEquals(logEntry.context.error, 'Test error');
    assert(typeof logEntry.context.duration === 'number');
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Sync function timing', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    const syncFn = withTiming(
      (value: string) => {
        return value.toUpperCase();
      },
      'sync_operation'
    );
    
    const result = syncFn('test');
    assertEquals(result, 'TEST');
    
    // Should log completion
    assert(capturedLogs.length > 0);
    const logEntry = JSON.parse(capturedLogs[capturedLogs.length - 1]);
    assertEquals(logEntry.level, 'debug');
    assert(logEntry.msg.includes('sync_operation completed'));
    assertEquals(logEntry.context.operation, 'sync_operation');
    assertEquals(logEntry.context.success, true);
    assert(typeof logEntry.context.duration === 'number');
    
  } finally {
    restoreConsoleLog();
  }
});

Deno.test('Logger - Context merging priority', () => {
  clearLogContext();
  mockConsoleLog();
  
  try {
    setLogContext({
      requestId: 'global-req',
      userId: 'global-user',
      function: 'global-function'
    });
    
    log('info', 'Test message', {
      userId: 'local-user', // Should override global
      operation: 'local-op'  // Should be added
    });
    
    assertEquals(capturedLogs.length, 1);
    const logEntry = JSON.parse(capturedLogs[0]);
    
    // Global context should be present
    assertEquals(logEntry.context.requestId, 'global-req');
    assertEquals(logEntry.context.function, 'global-function');
    
    // Local context should override
    assertEquals(logEntry.context.userId, 'local-user');
    assertEquals(logEntry.context.operation, 'local-op');
    
  } finally {
    restoreConsoleLog();
  }
});
