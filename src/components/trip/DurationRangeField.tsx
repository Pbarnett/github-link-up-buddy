import * as React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Control } from 'react-hook-form';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CalendarIcon,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Circle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Info,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Plane,
  PlaneTakeoff,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Wifi,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

// Duration range form data interface
interface DurationRangeFormData {
  min_duration?: number;
  max_duration?: number;
  [key: string]: unknown;
}

interface DurationRangeFieldProps {
  control: Control<DurationRangeFormData>;
}

const DurationRangeField = ({ control }: DurationRangeFieldProps) => {
  const { setValue, watch } = useFormContext();
  const isMobile = useIsMobile();
  const minDuration = watch('min_duration');
  const maxDuration = watch('max_duration');

  const presetDurations = [
    { label: '3 days', min: 3, max: 3 },
    { label: '5 days', min: 5, max: 5 },
    { label: '7 days', min: 7, max: 7 },
  ];

  const handlePresetClick = (preset: { min: number; max: number }) => {
    setValue('min_duration', preset.min, { shouldValidate: true });
    setValue('max_duration', preset.max, { shouldValidate: true });
  };

  const handleSliderChange = (values: number[]) => {
    setValue('min_duration', values[0], { shouldValidate: true });
    setValue('max_duration', values[1], { shouldValidate: true });
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FormLabel className="text-base font-semibold text-gray-900">
            Duration (days)
          </FormLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Minimum and maximum trip length (1-30 days)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-3 mb-3">
          {presetDurations.map(preset => (
            <Button
              key={preset.label}
              type="button"
              variant="outline"
              size="sm"
              className={`h-9 ${
                minDuration === preset.min && maxDuration === preset.max
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : ''
              }`}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={control}
            name="min_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Min</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="max_duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-600">Max</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    className="h-11"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FormLabel className="text-base lg:text-lg font-semibold text-gray-900">
          Trip Duration
        </FormLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Select your preferred trip length (1-30 days)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-2 mb-4">
        {presetDurations.map(preset => (
          <Button
            key={preset.label}
            type="button"
            variant="outline"
            size="sm"
            className={`h-8 px-3 text-xs ${
              minDuration === preset.min && maxDuration === preset.max
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : ''
            }`}
            onClick={() => handlePresetClick(preset)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="px-2">
        <Slider
          value={[minDuration || 3, maxDuration || 7]}
          onValueChange={handleSliderChange}
          max={30}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{minDuration || 3} days</span>
          <span>{maxDuration || 7} days</span>
        </div>
      </div>
    </div>
  );
};

export default DurationRangeField;
