import { logger } from './logger';
import { toast } from '@/components/ui/use-toast';
import { NavigateFunction } from 'react-router-dom';
import { LogContext } from './types';

export interface ErrorOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: LogContext;
}

const DEFAULT_OPTIONS: ErrorOptions = {
  showToast: true,
  logError: true,
};

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (
  error: unknown,
  title: string = 'Error',
  options: ErrorOptions = DEFAULT_OPTIONS
): string => {
  const { showToast, logError, context } = { ...DEFAULT_OPTIONS, ...options };
  
  const appError = error instanceof AppError 
    ? error 
    : new AppError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        undefined,
        error
      );

  const message = appError.message;

  if (logError) {
    logger.error(message, appError.originalError || appError, {
      errorCode: appError.code,
      ...context
    });
  }

  if (showToast) {
    toast({
      title,
      description: message,
      variant: 'destructive',
    });
  }

  return message;
};

export const handleAuthError = (
  navigate: NavigateFunction,
  options: ErrorOptions = DEFAULT_OPTIONS
): void => {
  const message = 'You must be logged in to perform this action.';
  
  handleError(
    new AppError(message, 'AUTH_REQUIRED'),
    'Authentication Error',
    options
  );
  
  navigate('/login');
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const createAppError = (
  message: string,
  code?: string,
  originalError?: unknown
): AppError => {
  return new AppError(message, code, originalError);
};

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

