
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TagChipProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const TagChip = ({ 
  icon, 
  children, 
  variant = 'secondary',
  className 
}: TagChipProps) => {
  const variantStyles = {
    primary: "bg-primary/5 text-primary border-primary/20",
    secondary: "bg-surface text-text-primary-analyst border-border-subtle",
    accent: "bg-accent-fade text-accent-analyst border-accent-analyst/20"
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="h-3 w-3">{icon}</span>}
      {children}
    </Badge>
  );
};

export default TagChip;
