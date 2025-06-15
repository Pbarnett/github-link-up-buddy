
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
    primary: "bg-transparent text-primary border border-primary/80",
    secondary: "bg-transparent text-muted-foreground border border-border",
    accent: "bg-transparent text-primary border border-primary/80"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center gap-1 px-3 py-[3px] rounded-full text-[11px] font-medium",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="h-[10px] w-[10px]">{icon}</span>}
      {children}
    </span>
  );
};

export default TagChip;
