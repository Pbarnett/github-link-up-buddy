import * as React from 'react';
type ReactNode = React.ReactNode;
type FC<T = {}> = React.FC<T>;

import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  fullWidth?: boolean;
}

const PageWrapper: FC<PageWrapperProps> = ({
  children,
  className,
  title,
  description,
  fullWidth = false,
}) => {
  return (
    <div
      className={cn(
        'min-h-screen bg-background',
        'animate-in fade-in-0 duration-300', // 2025 page transition
        fullWidth ? 'w-full' : 'container max-w-screen-2xl mx-auto px-4 py-6',
        className
      )}
    >
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-muted-foreground text-lg">{description}</p>
          )}
        </div>
      )}
      <div className="animate-in slide-in-from-bottom-4 duration-500 delay-150">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
export { PageWrapper };
