import * as React from 'react';
import { FC } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Calendar, DollarSign, MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CampaignFormData } from '@/types/campaign';
// import { ConfigDrivenCampaignForm } from "./CampaignForm.config-driven";

const campaignFormSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureDates: z.string().min(1, 'Departure dates are required'),
  maxPrice: z.number().min(1, 'Maximum price must be greater than 0'),
  directFlightsOnly: z.boolean(),
  minDuration: z.number().min(1).max(365).optional(),
  maxDuration: z.number().min(1).max(365).optional(),
  cabinClass: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .optional(),
});

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  initialData?: Partial<CampaignFormData>;
}

// Legacy implementation (preserved for fallback)
const LegacyCampaignForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  initialData,
}: CampaignFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      destination: initialData?.destination || '',
      departureDates: initialData?.departureDates || '',
      maxPrice: initialData?.maxPrice || 1000,
      directFlightsOnly: initialData?.directFlightsOnly || false,
      minDuration: initialData?.minDuration || 3,
      maxDuration: initialData?.maxDuration || 14,
      cabinClass: initialData?.cabinClass || 'economy',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Campaign Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Campaign Details
          </CardTitle>
          <CardDescription>
            Give your campaign a name and set your travel preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g., Summer Vacation to Paris"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="destination">
                <MapPin className="h-4 w-4 inline mr-1" />
                Destination
              </Label>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="destination"
                    placeholder="e.g., NYC, JFK, or New York"
                    className={errors.destination ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.destination && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.destination.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="departureDates">
              <Calendar className="h-4 w-4 inline mr-1" />
              Travel Dates
            </Label>
            <Controller
              name="departureDates"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="departureDates"
                  placeholder="e.g., June 2025 or 2025-06-01 to 2025-06-15"
                  className={errors.departureDates ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.departureDates && (
              <p className="text-sm text-red-500 mt-1">
                {errors.departureDates.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              We'll monitor flights within this timeframe
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trip Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Preferences</CardTitle>
          <CardDescription>
            Configure your travel preferences and constraints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="minDuration">Min Duration (days)</Label>
              <Controller
                name="minDuration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="minDuration"
                    min="1"
                    max="365"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange(
                        parseInt((e.target as HTMLInputElement).value) || 0
                      )
                    }
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="maxDuration">Max Duration (days)</Label>
              <Controller
                name="maxDuration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="maxDuration"
                    min="1"
                    max="365"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      field.onChange(
                        parseInt((e.target as HTMLInputElement).value) || 0
                      )
                    }
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Controller
                name="cabinClass"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cabin class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">
                        Premium Economy
                      </SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="directFlightsOnly"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="directFlightsOnly"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="directFlightsOnly">
              Direct flights only (no layovers)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget & Auto-booking
          </CardTitle>
          <CardDescription>
            Set your maximum budget - we'll automatically book flights within
            this limit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxPrice">Maximum Price (USD)</Label>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  id="maxPrice"
                  min="50"
                  max="10000"
                  step="50"
                  placeholder="e.g., 500"
                  className={errors.maxPrice ? 'border-red-500' : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    field.onChange(
                      parseInt((e.target as HTMLInputElement).value) || 0
                    )
                  }
                />
              )}
            />
            {errors.maxPrice && (
              <p className="text-sm text-red-500 mt-1">
                {errors.maxPrice.message}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              We'll automatically book any flight under this amount that matches
              your criteria
            </p>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

// Progressive migration wrapper component
export const CampaignForm = ({
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  initialData,
}: CampaignFormProps) => {
  return (
    <LegacyCampaignForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      initialData={initialData}
    />
  );
};
