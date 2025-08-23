import React from 'react';
import { Control } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import NightsRangeSection from './NightsRangeSection';
import { useRenderCount } from '@/hooks/useRenderCount';

interface ImprovedDatePickerSectionProps {
  control: Control<any>;
}

const ImprovedDatePickerSection = ({ control }: ImprovedDatePickerSectionProps) => {
  // Dev-only render counter for Phase 2 baseline
  useRenderCount('ImprovedDatePickerSection');

  return (
    <div className="space-y-6">
      {/* Travel Window */}
      <div>
        <FormLabel className="text-base font-semibold text-gray-900 mb-4 block">
          When do you want to travel?
        </FormLabel>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="earliestDeparture"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Departure Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-gray-400",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "MMM dd, yyyy")
                        ) : (
                          <span>Pick departure date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
                {/* Test-only hidden input to allow programmatic date setting in integration tests */}
                <input
                  type="date"
                  data-testid="earliest-departure-input"
                  aria-hidden="true"
                  style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const v = e.target.value ? new Date(`${e.target.value}T00:00:00`) : undefined;
                    field.onChange(v);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="latestDeparture"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Latest Departure
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-gray-400",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "MMM dd, yyyy")
                        ) : (
                          <span>Latest acceptable date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                      className="rounded-md border-0"
                    />
                  </PopoverContent>
                </Popover>
                {/* Test-only hidden input to allow programmatic date setting in integration tests */}
                <input
                  type="date"
                  data-testid="latest-departure-input"
                  aria-hidden="true"
                  style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const v = e.target.value ? new Date(`${e.target.value}T00:00:00`) : undefined;
                    field.onChange(v);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Trip Length */}
      <NightsRangeSection control={control} />
    </div>
  );
};

export default React.memo(ImprovedDatePickerSection);
