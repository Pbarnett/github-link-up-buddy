
import { Control } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface TripDurationInputsProps {
  control: Control<any>;
}

const TripDurationInputs = ({ control }: TripDurationInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="min_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">Trip Length (min days)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="30"
                className="h-11 border-gray-300"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500">1–30</div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="max_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-900">(max days)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="30"
                className="h-11 border-gray-300"
                {...field}
              />
            </FormControl>
            <div className="text-xs text-gray-500">1–30</div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TripDurationInputs;
