// src/lib/logger.ts
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Basic environment check (can be improved with actual env variable like process.env.LOG_LEVEL)
// For client-side code, process.env.NODE_ENV is typically available via build tools.
const CURRENT_LOG_LEVEL = import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

const logger: Logger = {
  debug: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug('[DEBUG]', ...args);
    }
  },
  info: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.INFO) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.WARN) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args) => {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.ERROR) {
      console.error('[ERROR]', ...args);
    }
  },
};

export default logger;
