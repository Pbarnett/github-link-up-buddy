
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChoiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badges: React.ReactNode[];
  buttonText: string;
  buttonVariant?: 'default' | 'secondary';
  onClick: () => void;
  className?: string;
  'aria-describedby'?: string;
}

const ChoiceCard = ({
  icon,
  title,
  description,
  badges,
  buttonText,
  buttonVariant = 'default',
  onClick,
  className,
  'aria-describedby': ariaDescribedBy,
}: ChoiceCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 bg-card max-w-sm mx-auto",
        "mode-card-hover",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4 mb-3">
          <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/15 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-card-foreground mb-2">
              {title}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground leading-relaxed prose-analyst">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0" id={ariaDescribedBy}>
        <div className="flex flex-wrap gap-2 mb-6">
          {badges}
        </div>
        <Button 
          onClick={onClick}
          variant={buttonVariant === 'default' ? 'default' : 'analyst-secondary'}
          className={cn(
            "w-full font-medium py-3 h-11 transform hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          )}
          aria-describedby={ariaDescribedBy}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChoiceCard;
