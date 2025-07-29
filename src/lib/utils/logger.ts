/**
 * Structured Logger Utility
 *
 * Provides structured logging with different levels and environment-aware output.
 * Supports both browser and server-side logging with consistent format.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  operation?: string;
  userId?: string;
  customerId?: string;
  requestId?: string;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private formatLog(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error?.message,
    };
  }

  private output(logEntry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print for development
      const { timestamp, level, message, context, error } = logEntry;
      const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
      const errorStr = error ? ` | ERROR: ${error}` : '';

      console.log(
        `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${errorStr}`
      );
    } else {
      // Structured JSON for production
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      this.output(this.formatLog('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      this.output(this.formatLog('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      this.output(this.formatLog('warn', message, context));
    }
  }

  error(message: string, context?: LogContext, error?: Error): void {
    if (this.shouldLog('error')) {
      this.output(this.formatLog('error', message, context, error));
    }
  }

  // Security-specific logging methods
  security(message: string, context?: LogContext): void {
    this.info(`[SECURITY] ${message}`, {
      ...context,
      security_event: true,
    });
  }

  audit(message: string, context?: LogContext): void {
    this.info(`[AUDIT] ${message}`, {
      ...context,
      audit_event: true,
    });
  }

  // PCI compliance logging
  pciCompliance(message: string, context?: LogContext): void {
    this.info(`[PCI-COMPLIANCE] ${message}`, {
      ...context,
      pci_compliance: true,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing or custom instances
export { Logger };
