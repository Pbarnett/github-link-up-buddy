import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { DateRange } from 'react-day-picker';
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

interface ImprovedDatePickerSectionProps {
  control: Control<any>;
}

const ImprovedDatePickerSection = ({ control }: ImprovedDatePickerSectionProps) => {
  const watchedFields = useWatch({ control });

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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Trip Length */}
      <div className="space-y-4">
          <FormField
            control={control}
            name="trip_duration"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Trip Length
                  </FormLabel>
                  <span className="text-sm text-gray-500">
                    {watchedFields?.min_duration || 3} - {watchedFields?.max_duration || 7} nights
                  </span>
                </div>
                <div className="px-3">
                  <FormField
                    control={control}
                    name="min_duration"
                    render={({ field: minField }) => (
                      <FormField
                        control={control}
                        name="max_duration"
                        render={({ field: maxField }) => (
                          <FormItem>
                            <FormControl>
                              <Slider
                                min={1}
                                max={30}
                                step={1}
                                value={[minField.value || 3, maxField.value || 7]}
                                onValueChange={(values) => {
                                  minField.onChange(values[0]);
                                  maxField.onChange(values[1]);
                                }}
                                className="w-full"
                              />
                            </FormControl>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>1 night</span>
                              <span>30 nights</span>
                            </div>
                          </FormItem>
                        )}
                      />
                    )}
                  />
                </div>
                <FormDescription className="text-xs text-gray-500">
                  Total nights away from home
                </FormDescription>
              </FormItem>
            )}
          />
      </div>
    </div>
  );
};

export default ImprovedDatePickerSection;
