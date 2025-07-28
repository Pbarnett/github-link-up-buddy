import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { log, createRequestLogger } from '../logger.ts';

describe('Logger Module', () => {
  let consoleSpy: any;

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('log function', () => {
    it('should log info messages with correct format', () => {
      const message = 'Test info message';
      const metadata = { operation: 'test', duration: 100 };

      log('info', message, metadata);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"level":"info"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test info message"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"test"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"duration":100')
      );
    });

    it('should log error messages with correct format', () => {
      const message = 'Test error message';
      const error = new Error('Test error');

      log('error', message, { error });

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('"level":"error"')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test error message"')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('"error":"Test error"')
      );
    });

    it('should log warn messages with correct format', () => {
      const message = 'Test warning message';
      
      log('warn', message);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('"level":"warn"')
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test warning message"')
      );
    });

    it('should log debug messages with correct format', () => {
      const message = 'Test debug message';
      
      log('debug', message);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('"level":"debug"')
      );
      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test debug message"')
      );
    });

    it('should include timestamp in log messages', () => {
      log('info', 'Test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"timestamp":"')
      );
    });

    it('should handle empty metadata', () => {
      log('info', 'Test message', {});

      expect(consoleSpy.log).toHaveBeenCalledOnce();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test message"')
      );
    });

    it('should handle no metadata', () => {
      log('info', 'Test message');

      expect(consoleSpy.log).toHaveBeenCalledOnce();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test message"')
      );
    });
  });

  describe('createRequestLogger function', () => {
    it('should create logger with correlation ID', () => {
      const correlationId = 'test-correlation-id';
      const requestLogger = createRequestLogger(correlationId);

      requestLogger.info('Test message', { operation: 'test' });

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"correlationId":"test-correlation-id"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Test message"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"operation":"test"')
      );
    });

    it('should generate correlation ID if not provided', () => {
      const requestLogger = createRequestLogger();

      requestLogger.info('Test message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"correlationId":"')
      );
    });

    it('should support all log levels', () => {
      const requestLogger = createRequestLogger('test-id');

      requestLogger.debug('Debug message');
      requestLogger.info('Info message');
      requestLogger.warn('Warn message');
      requestLogger.error('Error message');

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('"level":"debug"')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"level":"info"')
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('"level":"warn"')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('"level":"error"')
      );
    });

    it('should maintain correlation ID across multiple calls', () => {
      const correlationId = 'persistent-id';
      const requestLogger = createRequestLogger(correlationId);

      requestLogger.info('First message');
      requestLogger.warn('Second message');
      requestLogger.error('Third message');

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"correlationId":"persistent-id"')
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('"correlationId":"persistent-id"')
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('"correlationId":"persistent-id"')
      );
    });
  });

  describe('error handling', () => {
    it('should handle circular references in metadata', () => {
      const circular: any = { prop: 'value' };
      circular.self = circular;

      expect(() => {
        log('info', 'Test message', circular);
      }).not.toThrow();

      expect(consoleSpy.log).toHaveBeenCalledOnce();
    });

    it('should handle undefined and null metadata values', () => {
      log('info', 'Test message', { 
        undef: undefined, 
        nul: null, 
        empty: '',
        zero: 0
      });

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"nul":null')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"empty":""')
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('"zero":0')
      );
    });
  });
});
