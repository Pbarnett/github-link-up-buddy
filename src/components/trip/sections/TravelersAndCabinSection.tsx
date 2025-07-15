import React from 'react';
import { Control } from 'react-hook-form';
import { Users } from 'lucide-react';

// Travelers and cabin form data interface
interface TravelersAndCabinFormData {
  travelers_count?: string;
  cabin_class?: 'economy' | 'premium_economy' | 'business' | 'first';
  [key: string]: unknown;
}
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TravelersAndCabinSectionProps {
  control: Control<TravelersAndCabinFormData>;
}

const TravelersAndCabinSection = ({ control }: TravelersAndCabinSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Travelers Count */}
      <FormField
        control={control}
        name="travelers_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Travelers
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "1"}>
              <FormControl>
                <SelectTrigger className="w-full h-12 border-gray-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Select travelers" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 Adult</SelectItem>
                <SelectItem value="2">2 Adults</SelectItem>
                <SelectItem value="3">3 Adults</SelectItem>
                <SelectItem value="4">4 Adults</SelectItem>
                <SelectItem value="5">5 Adults</SelectItem>
                <SelectItem value="6">6+ Adults</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Cabin Class */}
      <FormField
        control={control}
        name="cabin_class"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Cabin Class
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || "economy"}>
              <FormControl>
                <SelectTrigger className="w-full h-12 border-gray-300">
                  <SelectValue placeholder="Select cabin class" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium_economy">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default TravelersAndCabinSection;
