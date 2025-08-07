
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

// Budget form data interface
interface BudgetFormData {
  budget?: number;
  [key: string]: unknown;
}

interface BudgetSectionProps {
  control: Control<BudgetFormData>;
}

const BudgetSection = ({ control }: BudgetSectionProps) => {
  return (
    <FormField
      control={control}
      name="budget"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-900">
            Budget (USD)
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-sm">
                $
              </span>
              <Input
                type="number"
                min="100"
                max="10000"
                step="1"
                placeholder="1000"
                className="pl-6 pr-3 py-2"
                {...field}
              />
            </div>
          </FormControl>
          <FormDescription className="text-xs text-gray-500">
            Your budget for the trip ($100–$10,000).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BudgetSection;
