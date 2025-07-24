/**
 * Step 4: Review & Confirmation
 * Review all campaign details before creation
 */

import { CheckCircle, User, CreditCard, MapPin, Calendar, Plane } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { withErrorBoundary } from '@/components/ErrorBoundary';
import { trackCampaignEvent } from '@/utils/monitoring';
import type { CriteriaFormData } from './StepCriteria';
import type { TravelerFormData } from './StepTraveler';

interface StepReviewProps {
  criteriaData: CriteriaFormData;
  travelerData: TravelerFormData;
  paymentMethodId: string;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function StepReview({ 
  criteriaData, 
  travelerData, 
  paymentMethodId, 
  onBack, 
  onConfirm, 
  isLoading = false 
}: StepReviewProps) {

  const handleConfirm = () => {
    // Track campaign creation attempt
    trackCampaignEvent('campaign_creation_started', 'temp-id', {
      destination: criteriaData.destination,
      trip_type: criteriaData.tripType,
      max_price: criteriaData.maxPrice,
      has_passport: !!travelerData.passportNumber,
      payment_method_id: paymentMethodId,
    });

    onConfirm();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getCabinClassName = (cabinClass: string) => {
    switch (cabinClass) {
      case 'economy': return 'Economy';
      case 'premium_economy': return 'Premium Economy';
      case 'business': return 'Business';
      case 'first': return 'First Class';
      default: return cabinClass;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review & Confirm Campaign
        </CardTitle>
        <CardDescription>
          Please review all details before creating your auto-booking campaign.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Campaign Criteria Review */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Campaign Details</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Campaign Name</p>
              <p className="font-medium">{criteriaData.campaignName}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Trip Type</p>
              <Badge variant="secondary">
                {criteriaData.tripType === 'round_trip' ? 'Round Trip' : 'One Way'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Maximum Budget</p>
              <p className="font-medium text-green-600">${criteriaData.maxPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Route
              </p>
              <p className="font-medium">{criteriaData.origin} → {criteriaData.destination}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Departure Window
              </p>
              <p className="font-medium">
                {formatDate(criteriaData.departureStart)} - {formatDate(criteriaData.departureEnd)}
              </p>
            </div>
          </div>

          {criteriaData.tripType === 'round_trip' && (criteriaData.returnStart || criteriaData.returnEnd) && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Return Window</p>
                <p className="font-medium">
                  {formatDate(criteriaData.returnStart || '')} - {formatDate(criteriaData.returnEnd || '')}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Trip Duration</p>
                <p className="font-medium">
                  {criteriaData.minDuration} - {criteriaData.maxDuration} days
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Cabin Class</p>
              <Badge variant="outline">{getCabinClassName(criteriaData.cabinClass)}</Badge>
            </div>
            
            {criteriaData.directFlightsOnly && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Preferences</p>
                <Badge variant="secondary">Direct Flights Only</Badge>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Traveler Information Review */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Traveler Information</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="font-medium">{travelerData.firstName} {travelerData.lastName}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium">{travelerData.email}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="font-medium">{travelerData.phone}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="font-medium">{formatDate(travelerData.dateOfBirth)}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Nationality</p>
              <p className="font-medium">{travelerData.nationality}</p>
            </div>
          </div>

          {(travelerData.passportNumber || travelerData.knownTravelerNumber) && (
            <div className="grid gap-4 md:grid-cols-2">
              {travelerData.passportNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Passport</p>
                  <p className="font-medium">{travelerData.passportNumber}</p>
                  {travelerData.passportExpiry && (
                    <p className="text-sm text-gray-500">Expires: {formatDate(travelerData.passportExpiry)}</p>
                  )}
                </div>
              )}
              
              {travelerData.knownTravelerNumber && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Known Traveler Number</p>
                  <p className="font-medium">{travelerData.knownTravelerNumber}</p>
                </div>
              )}
            </div>
          )}

          {(travelerData.frequentFlyerNumber || travelerData.dietaryRequirements || travelerData.accessibilityRequirements) && (
            <div className="space-y-4">
              <h4 className="font-medium">Preferences</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {travelerData.frequentFlyerNumber && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Frequent Flyer</p>
                    <p className="font-medium">{travelerData.frequentFlyerAirline}: {travelerData.frequentFlyerNumber}</p>
                  </div>
                )}
                
                {travelerData.dietaryRequirements && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Dietary Requirements</p>
                    <p className="font-medium">{travelerData.dietaryRequirements}</p>
                  </div>
                )}
              </div>
              
              {travelerData.accessibilityRequirements && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Accessibility Requirements</p>
                  <p className="font-medium">{travelerData.accessibilityRequirements}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Payment Information Review */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Payment Information</h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Payment Method</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Card ending in ****</Badge>
              <p className="text-sm text-gray-500">Securely stored by Stripe</p>
            </div>
            <p className="text-sm text-gray-500">
              Payment method ID: {paymentMethodId.substring(0, 20)}...
            </p>
          </div>
        </div>

        <Separator />

        {/* Final Actions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your campaign will be activated immediately</li>
            <li>• We'll monitor flights matching your criteria 24/7</li>
            <li>• When we find a deal within your budget, we'll automatically book it</li>
            <li>• You'll receive instant notifications about bookings and status updates</li>
            <li>• You can pause or modify your campaign anytime from the dashboard</li>
          </ul>
        </div>

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
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default withErrorBoundary(StepReview, 'component');
