import React from 'react';

export default function MockCalendar(props: {
  onSelect?: (d: Date) => void;
}) {
  return (
    <div
      data-testid="mock-day-picker"
      onClick={() => props.onSelect?.(new Date('2030-01-02'))}
    />
  );
}
