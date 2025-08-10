import React from 'react';

export type FieldProps = {
  id: string;
  label: string;
  children: React.ReactElement;
  help?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function Field({ id, label, children, help, error, required, className }: FieldProps) {
  const helpId = help ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className ?? 'mb-4'}>
      <label htmlFor={id} className="block mb-1 text-sm font-medium">
        {label}{required ? ' *' : ''}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            id,
            'aria-describedby': [helpId, errorId].filter(Boolean).join(' ') || undefined,
            'aria-invalid': !!error || undefined,
            className: ((children as any).props?.className ?? '') + ' focus-visible-ring'
          })
        : children}
      {help && <p id={helpId} className="text-xs opacity-75 mt-1">{help}</p>}
      {error && <p id={errorId} className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

