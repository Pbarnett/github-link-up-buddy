import { vi } from 'vitest';
import * as React from 'react';

// Create predictable test dates
export const getTestDates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  return {
    today,
    tomorrow,
    nextWeek,
    nextMonth,
    // ISO strings for form inputs
    tomorrowISO: tomorrow.toISOString().split('T')[0],
    nextWeekISO: nextWeek.toISOString().split('T')[0],
  };
};

// Simple mock DayPicker component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MockDayPicker = ({ selected: _selected, onSelect, disabled, ...props }: {
  selected?: Date | Date[];
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  [key: string]: unknown;
}) => {
  const { tomorrow, nextWeek } = getTestDates();
  
  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return;
    if (onSelect) {
      onSelect(date);
    }
  };

  return React.createElement('div', {
    'data-testid': 'mock-day-picker',
    role: 'grid'
  }, [
    React.createElement('button', {
      key: 'tomorrow',
      type: 'button',
      role: 'button',
      name: tomorrow.getDate().toString(),
      onClick: () => handleDateClick(tomorrow),
      'data-testid': 'calendar-day-tomorrow'
    }, tomorrow.getDate().toString()),
    React.createElement('button', {
      key: 'next-week',
      type: 'button',
      role: 'button', 
      name: nextWeek.getDate().toString(),
      onClick: () => handleDateClick(nextWeek),
      'data-testid': 'calendar-day-next-week'
    }, nextWeek.getDate().toString())
  ]);
};

// Setup function to apply mocks - call this in setupTests.ts
export const setupCalendarMocks = () => {
  // Mock react-day-picker
  vi.mock('react-day-picker', () => ({
    DayPicker: MockDayPicker,
  }));

  // Mock our custom Calendar component
  vi.mock('@/components/ui/calendar', () => ({
    Calendar: MockDayPicker,
  }));
};
