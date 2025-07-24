



import { cn } from '@/lib/utils';

export interface ModernScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'snap-x' | 'snap-y' | 'snap-both';
  snapType?: 'mandatory' | 'proximity' | 'none';
  scrollBehavior?: 'auto' | 'smooth';
  touchOptimized?: boolean;
  hideScrollbar?: boolean;
  scrollPadding?: 'none' | 'sm' | 'md' | 'lg';
}

const ModernScrollArea = forwardRef<HTMLDivElement, ModernScrollAreaProps>(
  ({ 
    className, 
    variant = 'default', 
    snapType = 'none',
    scrollBehavior = 'smooth',
    touchOptimized = true,
    hideScrollbar = false,
    scrollPadding = 'none',
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(
          // Base styles
          'relative overflow-auto',
          
          // Scroll behavior
          scrollBehavior === 'smooth' && 'scroll-smooth',
          
          // Touch optimizations
          touchOptimized && [
            'touch-pan-x touch-pan-y',
            'overscroll-contain',
            '-webkit-overflow-scrolling: touch'
          ],
          
          // Scroll snap variants
          variant === 'snap-x' && 'snap-x overflow-x-auto overflow-y-hidden',
          variant === 'snap-y' && 'snap-y overflow-y-auto overflow-x-hidden', 
          variant === 'snap-both' && 'snap-both',
          
          // Snap strictness
          snapType === 'mandatory' && 'snap-mandatory',
          snapType === 'proximity' && 'snap-proximity',
          
          // Scroll padding variants
          scrollPadding === 'sm' && 'scroll-p-2',
          scrollPadding === 'md' && 'scroll-p-4',
          scrollPadding === 'lg' && 'scroll-p-6',
          
          // Hide scrollbar when requested
          hideScrollbar && [
            'scrollbar-none',
            // Fallback for browsers that don't support scrollbar-none
            '[&::-webkit-scrollbar]:hidden',
            '[-ms-overflow-style:none]',
            '[scrollbar-width:none]'
          ],
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModernScrollArea.displayName = 'ModernScrollArea';

// Scroll item component for snap containers
export interface ScrollItemProps extends HTMLAttributes<HTMLDivElement> {
  snapAlign?: 'start' | 'center' | 'end' | 'none';
  snapStop?: 'always' | 'normal';
}

const ScrollItem = forwardRef<HTMLDivElement, ScrollItemProps>(
  ({ className, snapAlign = 'start', snapStop = 'normal', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          // Flex shrink prevention for horizontal scrolling
          'flex-shrink-0',
          
          // Snap alignment
          snapAlign === 'start' && 'snap-start',
          snapAlign === 'center' && 'snap-center', 
          snapAlign === 'end' && 'snap-end',
          snapAlign === 'none' && 'snap-align-none',
          
          // Snap stop behavior
          snapStop === 'always' && 'snap-always',
          snapStop === 'normal' && 'snap-normal',
          
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollItem.displayName = 'ScrollItem';

export { ModernScrollArea, ScrollItem };
