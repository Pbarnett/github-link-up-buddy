/**
 * Step 1: Campaign Criteria
 * Define travel search criteria (destination, dates, budget)
 */

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, DollarSign, Plane, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';

// Validation schema for criteria step
const criteriaSchema = z.object({
  campaignName: z.string().min(3, 'Campaign name must be at least 3 characters'),
  origin: z.string().min(3, 'Origin airport is required'),
  destination: z.string().min(3, 'Destination is required'),
  departureStart: z.string().min(1, 'Departure start date is required'),
  departureEnd: z.string().min(1, 'Departure end date is required'),
  returnStart: z.string().optional(),
  returnEnd: z.string().optional(),
  maxPrice: z.number().min(50, 'Minimum budget is $50').max(10000, 'Maximum budget is $10,000'),
  currency: z.string().default('USD'),
  tripType: z.enum(['one_way', 'round_trip']),
  directFlightsOnly: z.boolean().default(false),
  cabinClass: z.enum(['economy', 'premium_economy', 'business', 'first']).default('economy'),
  minDuration: z.number().min(1).max(365).optional(),
  maxDuration: z.number().min(1).max(365).optional(),
});

export type CriteriaFormData = z.infer<typeof criteriaSchema>;

interface StepCriteriaProps {
  initialData?: Partial<CriteriaFormData>;
  onNext: (data: CriteriaFormData) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

function StepCriteria({ initialData, onNext, onBack, isLoading = false }: StepCriteriaProps) {
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>(
    initialData?.tripType || 'round_trip'
  );

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<CriteriaFormData>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: {
      campaignName: initialData?.campaignName || '',
      origin: initialData?.origin || '',
      destination: initialData?.destination || '',
      departureStart: initialData?.departureStart || '',
      departureEnd: initialData?.departureEnd || '',
      returnStart: initialData?.returnStart || '',
      returnEnd: initialData?.returnEnd || '',
      maxPrice: initialData?.maxPrice || 1000,
      currency: initialData?.currency || 'USD',
      tripType: initialData?.tripType || 'round_trip',
      directFlightsOnly: initialData?.directFlightsOnly || false,
      cabinClass: initialData?.cabinClass || 'economy',
      minDuration: initialData?.minDuration || 3,
      maxDuration: initialData?.maxDuration || 14,
    },
  });

  const handleFormSubmit = (data: CriteriaFormData) => {
    // Track step completion
    trackCampaignEvent('wizard_step_completed', 'temp-id', {
      step_name: 'criteria',
      trip_type: data.tripType,
      destination: data.destination,
      max_price: data.maxPrice,
    });

    onNext(data);
  };

  const handleTripTypeChange = (value: string) => {
    const newTripType = value as 'one_way' | 'round_trip';
    setTripType(newTripType);
    setValue('tripType', newTripType);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Campaign Criteria
        </CardTitle>
        <CardDescription>
          Define your travel preferences and search criteria for automated booking
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Controller
              name="campaignName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="campaignName"
                  placeholder="e.g., Summer Europe Trip 2025"
                  className={errors.campaignName ? 'border-red-500' : ''}
                />
              )}
            />
            {errors.campaignName && (
              <p className="text-sm text-red-500">{errors.campaignName.message}</p>
            )}
          </div>

          {/* Trip Type */}
          <div className="space-y-2">
            <Label htmlFor="tripType">Trip Type</Label>
            <Controller
              name="tripType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={handleTripTypeChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round_trip">Round Trip</SelectItem>
                    <SelectItem value="one_way">One Way</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Origin & Destination */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origin">
                <MapPin className="h-4 w-4 inline mr-1" />
                From (Origin)
              </Label>
              <Controller
                name="origin"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="origin"
                    placeholder="e.g., LAX, Los Angeles"
                    className={errors.origin ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.origin && (
                <p className="text-sm text-red-500">{errors.origin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">
                <MapPin className="h-4 w-4 inline mr-1" />
                To (Destination)
              </Label>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="destination"
                    placeholder="e.g., JFK, New York"
                    className={errors.destination ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.destination && (
                <p className="text-sm text-red-500">{errors.destination.message}</p>
              )}
            </div>
          </div>

          {/* Departure Dates */}
          <div className="space-y-4">
            <Label>
              <Calendar className="h-4 w-4 inline mr-1" />
              Departure Date Range
            </Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="departureStart" className="text-sm">Earliest Departure</Label>
                <Controller
                  name="departureStart"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      id="departureStart"
                      className={errors.departureStart ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.departureStart && (
                  <p className="text-sm text-red-500">{errors.departureStart.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureEnd" className="text-sm">Latest Departure</Label>
                <Controller
                  name="departureEnd"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      id="departureEnd"
                      className={errors.departureEnd ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.departureEnd && (
                  <p className="text-sm text-red-500">{errors.departureEnd.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Return Dates - Only for Round Trip */}
          {tripType === 'round_trip' && (
            <div className="space-y-4">
              <Label>Return Date Range</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="returnStart" className="text-sm">Earliest Return</Label>
                  <Controller
                    name="returnStart"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        id="returnStart"
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnEnd" className="text-sm">Latest Return</Label>
                  <Controller
                    name="returnEnd"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        id="returnEnd"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Budget & Preferences */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="maxPrice">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Max Price (USD)
              </Label>
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
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className={errors.maxPrice ? 'border-red-500' : ''}
                  />
                )}
              />
              {errors.maxPrice && (
                <p className="text-sm text-red-500">{errors.maxPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cabinClass">Cabin Class</Label>
              <Controller
                name="cabinClass"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directFlightsOnly" className="flex items-center gap-2">
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
                Direct flights only
              </Label>
            </div>
          </div>

          {/* Trip Duration for Round Trip */}
          {tripType === 'round_trip' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minDuration">Min Trip Duration (days)</Label>
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDuration">Max Trip Duration (days)</Label>
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  )}
                />
              </div>
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We'll monitor flights matching these criteria and automatically book when we find deals within your budget.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Next: Traveler Info'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default withErrorBoundary(StepCriteria, 'component');
