import { toast } from '@/hooks/use-toast';
import { useTravelerProfile } from '@/hooks/useTravelerProfile';
import { useMultiTravelerProfiles } from '@/hooks/useMultiTravelerProfiles';
import { ProfileForm } from '@/components/ProfileForm';
import { SimpleProfileStatus } from './SimpleProfileStatus';
import { ProfileCompletionWidget } from './ProfileCompletionWidget';
import { MultiTravelerManager } from './MultiTravelerManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileCompletenessScore, ProfileRecommendation } from '@/services/profileCompletenessService';
import * as React from 'react';

// Enhanced ProfileV2 Component
export function ProfileV2() {
  const { profile, completion, calculateCompleteness, isLoading } = useTravelerProfile();
  const multiTravelerProfiles = useMultiTravelerProfiles();
  
  // Calculate completeness from profile data if completion tracking is not available
  const completenessData: ProfileCompletenessScore = useMemo(() => {
    if (completion) {
      return {
        overall: completion.completion_percentage,
        categories: {
          basic_info: 0,
          contact_info: 0,
          travel_documents: 0,
          preferences: 0,
          verification: 0
        },
        missing_fields: completion.missing_fields || [],
        recommendations: (completion.recommendations || []).map(rec => ({
          category: rec.category || 'general',
          priority: rec.priority || 'medium',
          title: rec.title || '',
          description: rec.description || '',
          action: rec.action || 'complete_profile',
          points_value: rec.points_value || 0
        })) as ProfileRecommendation[]
      };
    }
    
    if (profile) {
      return calculateCompleteness(profile) as ProfileCompletenessScore;
    }
    
    return {
      overall: 0,
      categories: {
        basic_info: 0,
        contact_info: 0,
        travel_documents: 0,
        preferences: 0,
        verification: 0
      },
      missing_fields: [],
      recommendations: []
    };
  }, [completion, profile, calculateCompleteness]);
  
  const handleActionClick = (action: string) => {
    switch (action) {
      case 'complete_profile':
        toast({ 
          title: 'Complete Your Profile', 
          description: 'Fill out the form below to complete your profile setup.',
        });
        setTimeout(() => {
          const formElement = document.querySelector('[id^="first_name"]');
          if (formElement && formElement instanceof HTMLElement) {
            formElement.focus();
          }
        }, 100);
        break;
      case 'verify_phone':
        toast({ 
          title: 'Phone Verification', 
          description: 'Update your phone number in the form below, then verify it.',
        });
        break;
      case 'add_phone':
        toast({ 
          title: 'Add Phone Number', 
          description: 'Add your phone number in the form below for SMS notifications.',
        });
        break;
      case 'add_passport':
        toast({ 
          title: 'Add Passport Information', 
          description: 'Add your passport details for international travel bookings.',
        });
        break;
      default:
        toast({ 
          title: 'Action Required', 
          description: `Please complete: ${action.replace(/_/g, ' ')}`,
        });
    }
  };
  
  const handleCategoryClick = (category: string) => {
    toast({
      title: 'Category Focus',
      description: `Focus on improving your ${category.replace(/_/g, ' ')} information.`,
    });
    // Could scroll to relevant form section or open specific modal
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Enhanced Profile Status with Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleProfileStatus 
          completeness={completenessData}
          onActionClick={handleActionClick}
          className="h-fit"
        />
        <ProfileCompletionWidget 
          completeness={completenessData}
          onCategoryClick={handleCategoryClick}
          className="h-fit"
        />
      </div>
      
      {/* Enhanced Profile Information with Multi-Traveler Support */}
      <Card className="relative overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Profile Management
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Enhanced
                </Badge>
              </CardTitle>
              <CardDescription>
                Manage your personal information and family traveler profiles with enhanced features.
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {completenessData.overall}%
              </div>
              <div className="text-xs text-muted-foreground">
                Complete
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="primary-profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="primary-profile">Primary Profile</TabsTrigger>
              <TabsTrigger value="travelers">Family Travelers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="primary-profile" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Your Primary Profile</h3>
                  <Badge variant="secondary">Main Account</Badge>
                </div>
                <ProfileForm useKMS={true} />
              </div>
            </TabsContent>
            
            <TabsContent value="travelers" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">Family & Additional Travelers</h3>
                  <Badge variant="outline">
                    {multiTravelerProfiles.travelers.length} travelers
                  </Badge>
                </div>
                <MultiTravelerManager
                  travelers={multiTravelerProfiles.travelers}
                  onAddTraveler={multiTravelerProfiles.addTraveler}
                  onUpdateTraveler={multiTravelerProfiles.updateTraveler}
                  onDeleteTraveler={multiTravelerProfiles.deleteTraveler}
                  onSetDefault={multiTravelerProfiles.setDefaultTraveler}
                  loading={multiTravelerProfiles.isLoading || 
                    multiTravelerProfiles.isAddingTraveler || 
                    multiTravelerProfiles.isUpdatingTraveler ||
                    multiTravelerProfiles.isDeletingTraveler ||
                    multiTravelerProfiles.isSettingDefault}
                  maxTravelers={6}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Enhanced Completion Tips */}
      {completenessData.overall < 100 && (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800">Quick Tips to Complete Your Profile</CardTitle>
            <CardDescription className="text-orange-700">
              Complete these sections to unlock all features and get the best travel experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {completenessData.recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-orange-200">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-900">{rec.title}</h4>
                    <p className="text-sm text-orange-700 mt-1">{rec.description}</p>
                    {rec.points_value && (
                      <p className="text-xs text-orange-600 mt-2">
                        Reward: +{rec.points_value} completion points
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProfileV2;
