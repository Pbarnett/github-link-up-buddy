import React, { useState } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, ToggleLeft, ToggleRight } from 'lucide-react';
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
  const [isFlexible, setIsFlexible] = useState(false);
  const watchedFields = useWatch({ control });

  const handleFlexibleToggle = () => {
    setIsFlexible(!isFlexible);
    // When switching to flexible, clear specific dates
    if (!isFlexible) {
      // Clear specific dates when going flexible
    }
  };

  return (
    <div className="space-y-6">
      {/* Dates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <FormLabel className="text-base font-semibold text-gray-900">
            When do you want to travel?
          </FormLabel>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleFlexibleToggle}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {isFlexible ? (
              <>
                <ToggleRight className="w-4 h-4" />
                <span>I'm flexible</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4" />
                <span>Specific dates</span>
              </>
            )}
          </Button>
        </div>

        {isFlexible ? (
          /* Flexible Date Range Mode */
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
            <FormField
              control={control}
              name="flexible_dates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Choose your travel window
                  </FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-gray-400"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span className="text-gray-500">Pick a date range (flexible)</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          className="rounded-md border-0"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    We'll search for the best deals within this timeframe
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          /* Specific Dates Mode */
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
        )}
      </div>

      {/* Trip Length - Only show when flexible or as enhancement */}
      {(isFlexible || true) && (
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
      )}
    </div>
  );
};

export default ImprovedDatePickerSection;
