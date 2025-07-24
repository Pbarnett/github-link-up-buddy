/**
 * Step 2: Traveler Information
 * Collect traveler details for booking
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';

// Validation schema for traveler step
const travelerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().optional(),
  nationality: z.string().min(2, 'Nationality is required'),
  frequentFlyerNumber: z.string().optional(),
  frequentFlyerAirline: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  accessibilityRequirements: z.string().optional(),
  knownTravelerNumber: z.string().optional(),
  saveProfile: z.boolean().default(true),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type TravelerFormData = z.infer<typeof travelerSchema>;

interface StepTravelerProps {
  initialData?: Partial<TravelerFormData>;
  onNext: (data: TravelerFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

function StepTraveler({
  initialData,
  onNext,
  onBack,
  isLoading = false,
}: StepTravelerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TravelerFormData>({
    resolver: zodResolver(travelerSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      dateOfBirth: initialData?.dateOfBirth || '',
      passportNumber: initialData?.passportNumber || '',
      passportExpiry: initialData?.passportExpiry || '',
      nationality: initialData?.nationality || '',
      frequentFlyerNumber: initialData?.frequentFlyerNumber || '',
      frequentFlyerAirline: initialData?.frequentFlyerAirline || '',
      dietaryRequirements: initialData?.dietaryRequirements || '',
      accessibilityRequirements: initialData?.accessibilityRequirements || '',
      knownTravelerNumber: initialData?.knownTravelerNumber || '',
      saveProfile: initialData?.saveProfile ?? true,
      agreeToTerms: initialData?.agreeToTerms || false,
    },
  });

  const handleFormSubmit = (data: TravelerFormData) => {
    // Track step completion
    trackCampaignEvent('wizard_step_completed', 'temp-id', {
      step_name: 'traveler',
      has_passport: !!data.passportNumber,
      has_frequent_flyer: !!data.frequentFlyerNumber,
      save_profile: data.saveProfile,
    });

    onNext(data);
  };

  const watchSaveProfile = watch('saveProfile');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Traveler Information
        </CardTitle>
        <CardDescription>
          Provide traveler details for automated booking. This information will
          be securely stored and encrypted.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      placeholder="John"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      placeholder="john.doe@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      id="dateOfBirth"
                      className={errors.dateOfBirth ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={errors.nationality ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="JP">Japan</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nationality && (
                  <p className="text-sm text-red-500">
                    {errors.nationality.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Travel Documents (Optional)</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Controller
                  name="passportNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="passportNumber"
                      placeholder="A12345678"
                    />
                  )}
                />
                <p className="text-sm text-gray-500">
                  Required for international flights
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passportExpiry">Passport Expiry Date</Label>
                <Controller
                  name="passportExpiry"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="date" id="passportExpiry" />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="knownTravelerNumber">
                Known Traveler Number (TSA PreCheck/Global Entry)
              </Label>
              <Controller
                name="knownTravelerNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="knownTravelerNumber"
                    placeholder="12345678"
                  />
                )}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Travel Preferences (Optional)
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="frequentFlyerAirline">
                  Frequent Flyer Airline
                </Label>
                <Controller
                  name="frequentFlyerAirline"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select airline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AA">American Airlines</SelectItem>
                        <SelectItem value="DL">Delta Airlines</SelectItem>
                        <SelectItem value="UA">United Airlines</SelectItem>
                        <SelectItem value="WN">Southwest Airlines</SelectItem>
                        <SelectItem value="BA">British Airways</SelectItem>
                        <SelectItem value="LH">Lufthansa</SelectItem>
                        <SelectItem value="AF">Air France</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequentFlyerNumber">
                  Frequent Flyer Number
                </Label>
                <Controller
                  name="frequentFlyerNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="frequentFlyerNumber"
                      placeholder="AB123456789"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
              <Controller
                name="dietaryRequirements"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="dietaryRequirements"
                    placeholder="e.g., Vegetarian, Kosher, Halal"
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessibilityRequirements">
                Accessibility Requirements
              </Label>
              <Controller
                name="accessibilityRequirements"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="accessibilityRequirements"
                    placeholder="e.g., Wheelchair assistance, Extra legroom"
                  />
                )}
              />
            </div>
          </div>

          {/* Privacy & Terms */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="saveProfile"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="saveProfile"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="saveProfile" className="text-sm">
                Save this traveler profile for future bookings
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreeToTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={errors.agreeToTerms ? 'border-red-500' : ''}
                  />
                )}
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                *
              </Label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-500">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              All traveler information is encrypted and securely stored.{' '}
              {watchSaveProfile
                ? 'Your profile will be saved for future bookings.'
                : 'Your information will only be used for this campaign.'}
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Next: Payment Info'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default withErrorBoundary(StepTraveler, 'component');
