// Test utilities for mocking react-day-picker components

// Mock Calendar component that allows easy date setting
import * as React from 'react';

export const MockCalendar = ({
  onSelect,
}: {
  selected?: Date;
  onSelect?: (date: Date) => void;
  [key: string]: unknown;
}) => {
  const handleDateClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  // Create a simple date picker with predefined dates for testing
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return (
    <div data-testid="mock-calendar" role="grid">
      <button
        type="button"
        role="button"
        onClick={() => handleDateClick(tomorrow)}
        data-testid="date-tomorrow"
      >
        {tomorrow.getDate()}
      </button>
      <button
        type="button"
        role="button"
        onClick={() => handleDateClick(nextWeek)}
        data-testid="date-next-week"
      >
        {nextWeek.getDate()}
      </button>
    </div>
  );
};

// Mock DateRangeField that uses simple inputs instead of complex UI
export const MockDateRangeField = ({
  control,
}: {
  control: { _formValues: Record<string, unknown> };
}) => {
  return (
    <div data-testid="mock-date-range-field">
      <label htmlFor="earliestDeparture">Earliest Departure</label>
      <input
        type="date"
        id="earliestDeparture"
        name="earliestDeparture"
        data-testid="earliest-departure-input"
        onChange={e => {
          const date = new Date((e.target as HTMLInputElement).value);
          // Trigger form field change
          control._formValues.earliestDeparture = date;
        }}
      />

      <label htmlFor="latestDeparture">Latest Departure</label>
      <input
        type="date"
        id="latestDeparture"
        name="latestDeparture"
        data-testid="latest-departure-input"
        onChange={e => {
          const date = new Date((e.target as HTMLInputElement).value);
          // Trigger form field change
          control._formValues.latestDeparture = date;
        }}
      />
    </div>
  );
};

// Helper function to set form dates programmatically
export const setFormDates = (
  form: { setValue: (key: string, value: Date) => void },
  earliestDate: Date,
  latestDate: Date
) => {
  form.setValue('earliestDeparture', earliestDate);
  form.setValue('latestDeparture', latestDate);
};

// Test utility to create valid date ranges
export const createTestDateRange = (daysFromNow = 1, rangeDays = 7) => {
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + daysFromNow);

  const latest = new Date(earliest);
  latest.setDate(earliest.getDate() + rangeDays);

  return { earliest, latest };
};
