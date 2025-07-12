/**
 * Date Range Field Component
 * 
 * Renders a date range picker with optional flexible dates
 */

import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeValue {
  from?: string;
  to?: string;
  flexible?: boolean;
}

interface DateRangeFieldProps {
  value?: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  flexible?: boolean;
  className?: string;
}

export const DateRangeField: React.FC<DateRangeFieldProps> = ({
  value = { from: undefined, to: undefined },
  onChange,
  placeholder = "Select date range",
  disabled = false,
  error,
  flexible = false,
  className
}) => {
  const [open, setOpen] = React.useState(false);
  
  // Parse date values
  const fromDate = value.from ? new Date(value.from) : undefined;
  const toDate = value.to ? new Date(value.to) : undefined;

  const handleDateSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range) {
      onChange({
        ...value,
        from: range.from ? format(range.from, 'yyyy-MM-dd') : undefined,
        to: range.to ? format(range.to, 'yyyy-MM-dd') : undefined
      });
    } else {
      onChange({ from: undefined, to: undefined, flexible: value.flexible });
    }
  };

  const handleFlexibleChange = (checked: boolean) => {
    onChange({
      ...value,
      flexible: checked
    });
  };

  const displayText = () => {
    if (value.flexible) {
      return "Flexible dates";
    }
    
    if (fromDate && toDate) {
      return `${format(fromDate, "LLL dd")} - ${format(toDate, "LLL dd, y")}`;
    }
    
    if (fromDate) {
      return `From ${format(fromDate, "LLL dd, y")}`;
    }
    
    return placeholder;
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              (!fromDate && !value.flexible) && "text-muted-foreground",
              error && "border-destructive",
              className
            )}
            disabled={disabled || value.flexible}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: fromDate,
              to: toDate
            }}
            onSelect={handleDateSelect}
            disabled={disabled}
            numberOfMonths={2}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {flexible && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="flexible-dates"
            checked={value.flexible || false}
            onCheckedChange={handleFlexibleChange}
            disabled={disabled}
          />
          <label 
            htmlFor="flexible-dates" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            My dates are flexible
          </label>
        </div>
      )}
    </div>
  );
};
