import React from 'react';

function formatNumber(n: number | undefined, locale = undefined as Intl.LocalesArgument) {
  if (n === undefined) return '';
  return new Intl.NumberFormat(locale).format(n);
}

function parseDigits(value: string): number | undefined {
  const digits = value.replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  const n = Number(digits);
  return Number.isNaN(n) ? undefined : n;
}

export type MoneyInputProps = {
  id?: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  className?: string;
};

export function MoneyInput({ id, value, onChange, placeholder = 'e.g., 1000', className }: MoneyInputProps) {
  const [text, setText] = React.useState<string>(formatNumber(value));
  React.useEffect(() => setText(formatNumber(value)), [value]);

  return (
    <input
      id={id}
      inputMode="numeric"
      className={(className ?? '') + ' w-full'}
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        const n = parseDigits(raw);
        const formatted = formatNumber(parseDigits(raw));
        setText(formatted || raw.replace(/[^0-9]/g, ''));
        onChange(n);
      }}
      onBlur={() => setText(formatNumber(parseDigits(text)))}
    />
  );
}

