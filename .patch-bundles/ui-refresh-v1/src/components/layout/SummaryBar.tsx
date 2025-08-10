import React from 'react';

export type SummaryValue = {
  from?: string[];
  to?: string[];
  nights?: [number?, number?];
  depart?: [Date?, Date?];
  price?: number;
  cabin?: string;
  nonstop?: boolean;
};

function summarize(v: SummaryValue) {
  const parts: string[] = [];
  if (v.from?.length) parts.push(`From ${v.from.join(', ')}`);
  if (v.to?.length) parts.push(`to ${v.to.join(', ')}`);
  if (v.nights && (v.nights[0] || v.nights[1])) {
    const [min, max] = v.nights;
    const range = [min, max].filter((x) => x !== undefined).join('–');
    if (range) parts.push(`${range} nights`);
  }
  if (v.depart && (v.depart[0] || v.depart[1])) {
    const [a, b] = v.depart;
    const fmt = (d?: Date) => (d ? d.toLocaleDateString() : '');
    parts.push(`depart ${fmt(a)} to ${fmt(b)}`.trim());
  }
  if (typeof v.price === 'number') parts.push(`up to $${v.price.toLocaleString()}`);
  if (v.cabin) parts.push(v.cabin);
  if (v.nonstop) parts.push('non-stop only');
  return parts.join(', ');
}

export function SummaryBar({ value, cta, onSubmit }: { value: SummaryValue; cta: string; onSubmit: () => void; }) {
  const text = React.useMemo(() => summarize(value), [value]);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t sticky-footer-shadow safe-area-bottom">
      <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 p-4">
        <p aria-live="polite" role="status" className="truncate text-sm">
          {text}
        </p>
        <button type="button" onClick={onSubmit} className="btn-primary-new px-4 py-2 rounded-md">
          {cta}
        </button>
      </div>
    </div>
  );
}

