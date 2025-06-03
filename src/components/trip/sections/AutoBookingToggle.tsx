
import { Control } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

interface AutoBookingToggleProps {
  control: Control<any>;
}

const AutoBookingToggle = ({ control }: AutoBookingToggleProps) => {
  return (
    <FormField
      control={control}
      name="auto_book_enabled"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-200 p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base font-medium">
              Enable Auto-Booking
            </FormLabel>
            <div className="text-sm text-gray-600">
              Automatically book flights that match your criteria
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default AutoBookingToggle;
