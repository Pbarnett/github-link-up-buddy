

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

import {
  Popover,
  PopoverContent,
  PopoverTrigger,

// Form data interface for trip date fields
interface TripDateFormData {
  earliestDeparture?: Date;
  latestDeparture?: Date;
  [key: string]: unknown; // Allow additional fields for flexibility
}

interface TripDateFieldProps {
  name: 'earliestDeparture' | 'latestDeparture';
  label: string;
  description: string;
  control: Control<TripDateFormData>;
}

const TripDateField = ({
  name,
  label,
  description,
  control,
}: TripDateFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-sm font-medium text-gray-900">
            {label}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal border-gray-300 hover:bg-gray-50',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={date =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
          <FormDescription className="text-xs text-gray-500">
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TripDateField;
