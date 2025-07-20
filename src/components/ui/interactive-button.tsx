import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export interface InteractiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  interactive?: boolean;
}

const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, loading = false, interactive = true, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(
          // Base styles with modern interactivity
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          // Touch and accessibility optimizations
          'touch-manipulation select-none',
          // Interactive enhancements when enabled
          interactive && [
            'will-change-transform cursor-pointer',
            'hover:-translate-y-0.5 hover:shadow-medium',
            'active:translate-y-0 active:shadow-sm',
            'disabled:transform-none disabled:shadow-none disabled:cursor-not-allowed'
          ],
          // Size variants
          size === 'default' && 'h-10 px-4 py-2 min-w-[44px]',
          size === 'sm' && 'h-9 rounded-md px-3 min-w-[36px]',
          size === 'lg' && 'h-11 rounded-md px-8 min-w-[48px]',
          size === 'icon' && 'h-10 w-10 min-w-[44px]',
          // Color variants with modern approach
          variant === 'default' && [
            'bg-primary text-primary-foreground shadow-sm',
            'hover:bg-primary/90',
            interactive && 'hover:shadow-medium'
          ],
          variant === 'secondary' && [
            'bg-secondary text-secondary-foreground shadow-sm',
            'hover:bg-secondary/80',
            interactive && 'hover:shadow-soft'
          ],
          variant === 'ghost' && [
            'hover:bg-accent hover:text-accent-foreground',
            interactive && 'hover:shadow-soft'
          ],
          variant === 'link' && [
            'text-primary underline-offset-4 hover:underline',
            'shadow-none p-0 h-auto'
          ],
          variant === 'destructive' && [
            'bg-destructive text-destructive-foreground shadow-sm',
            'hover:bg-destructive/90',
            interactive && 'hover:shadow-medium'
          ],
          // Loading state
          loading && [
            'cursor-wait opacity-70',
            'hover:transform-none hover:shadow-none',
            'active:transform-none active:shadow-none'
          ],
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

export { InteractiveButton };
