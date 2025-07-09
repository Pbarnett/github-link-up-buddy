
import AuthGuard from "@/components/AuthGuard";
import { ProfileForm } from "@/components/ProfileForm";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTravelerProfile } from "@/hooks/useTravelerProfile";
import { SimpleProfileStatus } from "@/components/profile/SimpleProfileStatus";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { ProfileCompletenessScore } from "@/services/profileCompletenessService";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Enhanced Profile Component for canary users
function EnhancedProfilePage() {
  const { profile, completion, calculateCompleteness } = useTravelerProfile();
  const [activeTab, setActiveTab] = useState("profile");
  
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
        recommendations: completion.recommendations || []
      };
    }
    
    if (profile) {
      return calculateCompleteness(profile);
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
        setActiveTab('profile');
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
        setActiveTab('profile');
        toast({ 
          title: 'Phone Verification', 
          description: 'Update your phone number in the form below, then verify it.',
        });
        break;
      case 'add_phone':
        setActiveTab('profile');
        toast({ 
          title: 'Add Phone Number', 
          description: 'Add your phone number in the form below for SMS notifications.',
        });
        break;
      case 'add_passport':
        setActiveTab('profile');
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Enhanced
              </Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <SimpleProfileStatus 
                completeness={completenessData}
                onActionClick={handleActionClick}
                className="mb-6"
              />
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <NotificationPreferences />
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Additional profile configuration options for enhanced users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium">Profile Completeness</h3>
                        <p className="text-sm text-muted-foreground">
                          Enhanced profile completeness tracking with detailed recommendations.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Smart Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Intelligent notification preferences based on your travel patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Legacy Profile Component
function LegacyProfilePage() {
  const { profile, completion, calculateCompleteness } = useTravelerProfile();
  const [activeTab, setActiveTab] = useState("profile");
  
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
        recommendations: completion.recommendations || []
      };
    }
    
    if (profile) {
      return calculateCompleteness(profile);
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
        setActiveTab('profile');
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
        setActiveTab('profile');
        toast({ 
          title: 'Phone Verification', 
          description: 'Update your phone number in the form below, then verify it.',
        });
        break;
      case 'add_phone':
        setActiveTab('profile');
        toast({ 
          title: 'Add Phone Number', 
          description: 'Add your phone number in the form below for SMS notifications.',
        });
        break;
      case 'add_passport':
        setActiveTab('profile');
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <SimpleProfileStatus 
                completeness={completenessData}
                onActionClick={handleActionClick}
                className="mb-6"
              />
              <ProfileForm />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <NotificationPreferences />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Profile component with feature flag logic
function ProfilePage() {
  const { enabled: showEnhancedProfile, loading: flagLoading } = useFeatureFlag('profile_ui_revamp');
  
  // Show loading state while feature flag is being determined
  if (flagLoading) {
    return <ProfileSkeleton />;
  }
  
  // Show enhanced profile for canary users
  if (showEnhancedProfile) {
    return <EnhancedProfilePage />;
  }
  
  // Default to legacy profile
  return <LegacyProfilePage />;
}

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
