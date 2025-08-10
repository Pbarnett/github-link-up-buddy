// src/functions/_lib/logger.ts
// Structured JSON logger for Lambda. Avoid PII, add optional redaction.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  correlationId?: string;
  step?: string;
  state?: string;
  pii?: boolean;
  errorType?: string;
  errorCode?: string;
  latencyMs?: number;
  [key: string]: any;
}

function redact(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    // crude email redaction
    return value.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED]');
  }
  if (Array.isArray(value)) return value.map(redact);
  if (typeof value === 'object') {
    const o: any = value as any;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) {
      if (/password|secret|token|ssn|dob|email/i.test(k)) {
        out[k] = '[REDACTED]';
      } else {
        out[k] = redact(o[k]);
      }
    }
    return out;
  }
  return value;
}

function emit(level: LogLevel, msg: string, ctx?: LogContext) {
  const base = {
    level,
    msg,
    timestamp: new Date().toISOString(),
    pii: false,
    ...ctx,
  };
  const safe = base.pii ? { ...base, msg: '[REDACTED]', pii: false } : { ...base };
  const payload = redact(safe);
  const line = JSON.stringify(payload);
  switch (level) {
    case 'debug':
      console.debug(line); break;
    case 'info':
      console.info(line); break;
    case 'warn':
      console.warn(line); break;
    case 'error':
      console.error(line); break;
  }
}

export const logger = {
  debug: (msg: string, ctx?: LogContext) => emit('debug', msg, ctx),
  info: (msg: string, ctx?: LogContext) => emit('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => emit('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => emit('error', msg, ctx),
};
