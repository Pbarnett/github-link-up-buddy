import { format, parseISO, isValid, parse } from 'date-fns';
/**
 * Safe date formatting utility that prevents RangeError for invalid dates
 * Used in tests and components to handle malformed date strings gracefully
 */

export const safeFormatDate = (
  dateString: string | Date | null | undefined,
  formatString: string = 'MMM dd, yyyy',
  fallback: string = 'Invalid Date'
): string => {
  if (!dateString) return fallback;

  try {
    let date: Date;

    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // Try to parse ISO string first
      date = parseISO(dateString);

      // If that fails, try standard Date constructor
      if (!isValid(date)) {
        date = new Date(dateString);
      }

      // If still invalid, try common date formats
      if (!isValid(date)) {
        // Try parsing common formats
        const commonFormats = [
          'yyyy-MM-dd',
          'MM/dd/yyyy',
          'dd/MM/yyyy',
          'yyyy-MM-dd HH:mm:ss',
          'MM/dd/yyyy HH:mm:ss',
        ];

        for (const fmt of commonFormats) {
          try {
            date = parse(dateString, fmt, new Date());
            if (isValid(date)) break;
          } catch {
            continue;
          }
        }
      }
    } else {
      return fallback;
    }

    if (!isValid(date)) {
      return fallback;
    }

    return format(date, formatString);
  } catch (error) {
    console.warn(`Date formatting error for "${dateString}":`, error);
    return fallback;
  }
};

export const safeParseISO = (
  dateString: string | null | undefined
): Date | null => {
  if (!dateString) return null;

  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

export const isValidDateString = (
  dateString: string | null | undefined
): boolean => {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isValid(date);
  } catch {
    return false;
  }
};

// Mock date utilities for testing
export const createMockDate = (
  year: number = 2024,
  month: number = 1,
  day: number = 1
): Date => {
  return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
};

export const createMockISOString = (
  year: number = 2024,
  month: number = 1,
  day: number = 1
): string => {
  return createMockDate(year, month, day).toISOString();
};

// Test utilities
export const mockDateUtils = {
  validISOString: '2024-01-15T00:00:00.000Z',
  invalidDateString: 'invalid-date-string',
  malformedISOString: '2024-13-45T25:70:90.000Z', // Invalid month/day/time values
  emptyString: '',
  nullValue: null,
  undefinedValue: undefined,
  validDate: new Date(2024, 0, 15), // January 15, 2024
  invalidDate: new Date('invalid'),
};

export default {
  safeFormatDate,
  safeParseISO,
  isValidDateString,
  createMockDate,
  createMockISOString,
  mockDateUtils,
};
