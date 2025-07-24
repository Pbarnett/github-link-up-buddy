import { forwardRef } from 'react';
type HTMLAttributes<T = HTMLElement> = HTMLAttributes<T>;

import { cn } from '@/lib/utils';

export interface EnhancedInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'enhanced' | 'ghost';
  inputSize?: 'default' | 'sm' | 'lg';
  interactive?: boolean;
  status?: 'default' | 'success' | 'warning' | 'error';
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'default',
      interactive = true,
      status = 'default',
      type,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

          // Modern interactivity enhancements
          interactive && [
            'focus:caret-blue-500 selection:bg-blue-100',
            'transition-all duration-200',
            'will-change-contents',
          ],

          // Enhanced focus states
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',

          // Touch optimization
          'touch-manipulation min-h-[44px]',

          // Size variants
          inputSize === 'sm' && 'h-9 px-2 text-sm min-h-[36px]',
          inputSize === 'lg' && 'h-12 px-4 text-lg min-h-[48px]',
          inputSize === 'default' && 'h-10 min-h-[44px]',

          // Variant styles
          variant === 'enhanced' && [
            'border-2 border-gray-200',
            'focus:border-blue-500 focus:ring-blue-500/20',
            'hover:border-gray-300 hover:shadow-soft',
            interactive && 'focus:shadow-interactive',
          ],

          variant === 'ghost' && [
            'border-transparent bg-transparent',
            'hover:bg-accent/50',
            'focus:bg-background focus:border-input',
          ],

          // Status variants
          status === 'success' && [
            'border-green-500 text-green-900',
            'focus:border-green-600 focus:ring-green-500/20',
            'bg-green-50',
          ],

          status === 'warning' && [
            'border-yellow-500 text-yellow-900',
            'focus:border-yellow-600 focus:ring-yellow-500/20',
            'bg-yellow-50',
          ],

          status === 'error' && [
            'border-red-500 text-red-900',
            'focus:border-red-600 focus:ring-red-500/20',
            'bg-red-50',
          ],

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export { EnhancedInput };
