import { LogLevel, LogContext, LogEntry } from './types';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(message: string, context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) {
      return message;
    }
    return `${message} | Context: ${JSON.stringify(context)}`;
  }

  private formatError(error: unknown): unknown {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any),
      };
    }
    return error;
  }

  private formatLog(level: LogLevel, message: string, data?: unknown, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: this.formatMessage(message, context),
      context,
      error: data ? this.formatError(data) : undefined
    };
  }

  debug(message: string, data?: unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const logEntry = this.formatLog(LogLevel.DEBUG, message, data, context);
      console.debug(logEntry);
    }
  }

  info(message: string, data?: unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const logEntry = this.formatLog(LogLevel.INFO, message, data, context);
      console.info(logEntry);
    }
  }

  warn(message: string, data?: unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const logEntry = this.formatLog(LogLevel.WARN, message, data, context);
      console.warn(logEntry);
    }
  }

  error(message: string, error?: unknown, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const logEntry = this.formatLog(LogLevel.ERROR, message, error, context);
      console.error(logEntry);
    }
  }
}

export const logger = Logger.getInstance();

