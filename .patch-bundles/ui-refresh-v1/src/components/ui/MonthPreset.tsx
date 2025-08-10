import React from 'react';

function monthRange(year: number, monthIndex0: number) {
  const start = new Date(year, monthIndex0, 1);
  const end = new Date(year, monthIndex0 + 1, 0);
  return { start, end };
}

export function MonthPreset({ onSelect, monthsAhead = 6 }: { onSelect: (start: Date, end: Date) => void; monthsAhead?: number; }) {
  const today = new Date();
  const months = Array.from({ length: monthsAhead }, (_, i) => new Date(today.getFullYear(), today.getMonth() + i, 1));
  return (
    <div className="flex gap-2 flex-wrap">
      {months.map((m) => (
        <button
          key={`${m.getFullYear()}-${m.getMonth()}`}
          type="button"
          onClick={() => {
            const { start, end } = monthRange(m.getFullYear(), m.getMonth());
            onSelect(start, end);
          }}
          className="px-2 py-1 border rounded text-sm"
        >
          {m.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </button>
      ))}
      <button type="button" onClick={() => onSelect(undefined as any, undefined as any)} className="px-2 py-1 border rounded text-sm opacity-75">
        Clear dates
      </button>
    </div>
  );
}

