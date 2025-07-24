import { HelpCircle } from 'lucide-react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Budget form data interface
interface BudgetFormData {
  max_price?: number;
  [key: string]: unknown;
}

interface EnhancedBudgetSectionProps {
  control: Control<BudgetFormData>;
}

const EnhancedBudgetSection = ({ control }: EnhancedBudgetSectionProps) => {
  return (
    <FormField
      control={control}
      name="max_price"
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-2">
            <FormLabel
              htmlFor="max_price_input"
              className="text-base lg:text-lg font-semibold text-gray-900"
            >
              Top price you'll pay
            </FormLabel>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    We will not charge above this amount; lower is possible.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <Input
                id="max_price_input"
                type="number"
                min="100"
                max="10000"
                step="1"
                placeholder="1000"
                className="h-11 pl-6 pr-3 border-gray-300"
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EnhancedBudgetSection;
