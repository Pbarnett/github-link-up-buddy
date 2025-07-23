

type _Component<P = {}, S = {}> = React.Component<P, S>;

import AuthGuard from "@/components/AuthGuard";
import { ProfileForm } from "@/components/ProfileForm";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTravelerProfile, TravelerProfile } from "@/hooks/useTravelerProfile";
import { SimpleProfileStatus } from "@/components/profile/SimpleProfileStatus";
import { ProfileCompletenessIndicator, ProfileCompletenessData, ProfileField } from "@/components/profile/ProfileCompletenessIndicator";
import { toast } from "@/hooks/use-toast";
import { ProfileCompletenessScore, ProfileRecommendation } from "@/services/profileCompletenessService";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { ProfileV2 } from "@/components/profile/ProfileV2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/contexts/WalletContext";
import { PaymentMethodList } from "@/components/wallet/PaymentMethodList";
import { AddCardModal } from "@/components/wallet/AddCardModal";
import { User, Phone, MapPin, FileText } from "lucide-react";
import { useState, useMemo } from 'react';

// Utility function to convert ProfileCompletenessScore to ProfileCompletenessData
function convertToIndicatorData(
  completenessScore: ProfileCompletenessScore,
  profile: TravelerProfile | null
): ProfileCompletenessData {
  const fieldMappings: Record<string, { category: ProfileField['category'], label: string, required: boolean, icon: any }> = {
    full_name: { category: 'basic', label: 'Full Name', required: true, icon: User },
    date_of_birth: { category: 'basic', label: 'Date of Birth', required: true, icon: User },
    gender: { category: 'basic', label: 'Gender', required: true, icon: User },
    email: { category: 'contact', label: 'Email Address', required: true, icon: Phone },
    phone: { category: 'contact', label: 'Phone Number', required: false, icon: Phone },
    passport_number: { category: 'travel', label: 'Passport Number', required: false, icon: MapPin },
    passport_country: { category: 'travel', label: 'Passport Country', required: false, icon: MapPin },
    passport_expiry: { category: 'travel', label: 'Passport Expiry', required: false, icon: MapPin },
    known_traveler_number: { category: 'travel', label: 'Known Traveler Number', required: false, icon: MapPin },
    phone_verified: { category: 'verification', label: 'Phone Verification', required: false, icon: FileText },
    is_verified: { category: 'verification', label: 'Identity Verification', required: false, icon: FileText },
  };

  const fields: ProfileField[] = Object.entries(fieldMappings).map(([fieldId, config]) => {
    const value = profile?.[fieldId as keyof TravelerProfile];
    const isCompleted = fieldId === 'phone_verified' || fieldId === 'is_verified' 
      ? Boolean(value) 
      : Boolean(value && value !== '');
    
    return {
      id: fieldId,
      label: config.label,
      completed: isCompleted,
      required: config.required,
      category: config.category,
      icon: config.icon,
      description: `Complete your ${config.label.toLowerCase()} for a better booking experience`
    };
  });

  return {
    completionPercentage: completenessScore.overall,
    completedFields: fields.filter(f => f.completed).length,
    totalFields: fields.length,
    fields,
    lastUpdated: profile?.updated_at ? new Date(profile.updated_at) : new Date(),
    tier: completenessScore.overall >= 100 ? 'verified' : 
          completenessScore.overall >= 70 ? 'complete' : 'basic'
  };
}

// Wallet Tab Component (inside WalletProvider)
function WalletTab({ 
  showAddCardModal, 
  setShowAddCardModal 
}: { 
  showAddCardModal: boolean; 
  setShowAddCardModal: (show: boolean) => void; 
}) {
  const { 
    paymentMethods, 
    loading, 
    error, 
    deletePaymentMethod, 
    setDefaultPaymentMethod, 
    updatePaymentMethodNickname,
    refreshPaymentMethods
  } = useWallet();

  const handleAddSuccess = () => {
    setShowAddCardModal(false);
    refreshPaymentMethods();
  };

  return (
    <div className="space-y-6" data-testid="wallet-content">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600">Manage your saved payment methods for faster booking</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200" data-testid="wallet-beta-badge">
          Beta
        </Badge>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}
      
      <PaymentMethodList
        paymentMethods={paymentMethods}
        loading={loading}
        onAddNew={() => setShowAddCardModal(true)}
        onSetDefault={setDefaultPaymentMethod}
        onDelete={deletePaymentMethod}
        onUpdateNickname={updatePaymentMethodNickname}
      />
      
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

// Enhanced Profile Component for canary users
function EnhancedProfilePage() {
  const { profile, completion, calculateCompleteness } = useTravelerProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const { data: showWalletUI, isLoading: walletFlagLoading } = useFeatureFlag('wallet_ui');
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
  // Calculate completeness from profile data if completion tracking is not available
  const _completenessData: ProfileCompletenessScore = useMemo(() => {  
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
  
  // Convert to indicator data format
  const indicatorData = useMemo(() => {
    return convertToIndicatorData(_completenessData, profile);
  }, [_completenessData, profile]);
  
  // Handle field clicks from the indicator
  const handleFieldClick = (fieldId: string) => {
    setActiveTab('profile');
    
    // Focus on specific form fields based on the field ID
    setTimeout(() => {
      let selector = '';
      switch (fieldId) {
        case 'full_name':
          selector = '[id^="first_name"], [id^="full_name"]';
          break;
        case 'date_of_birth':
        case 'gender':
        case 'email':
        case 'phone':
          selector = `[id^="${fieldId}"]`;
          break;
        case 'passport_number':
        case 'passport_country':
        case 'passport_expiry':
        case 'known_traveler_number':
          selector = `[id^="${fieldId}"]`;
          break;
        default:
          selector = '[id^="first_name"]';
      }
      
      const formElement = document.querySelector(selector);
      if (formElement && formElement instanceof HTMLElement) {
        formElement.focus();
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
    // Show appropriate toast message
    const fieldLabels: Record<string, string> = {
      full_name: 'Full Name',
      date_of_birth: 'Date of Birth',
      gender: 'Gender',
      email: 'Email Address',
      phone: 'Phone Number',
      passport_number: 'Passport Number',
      passport_country: 'Passport Country',
      passport_expiry: 'Passport Expiry Date',
      known_traveler_number: 'Known Traveler Number',
      phone_verified: 'Phone Verification',
      is_verified: 'Identity Verification'
    };
    
    toast({
      title: `Complete ${fieldLabels[fieldId] || 'Field'}`,
      description: `Please fill out your ${(fieldLabels[fieldId] || fieldId).toLowerCase()} in the form below.`,
    });
  };
  
  const _handleActionClick = (action: string) => {
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
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
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
            <TabsList className={`grid w-full ${showWalletUI && !walletFlagLoading ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {showWalletUI && !walletFlagLoading && (
                <TabsTrigger value="wallet" data-testid="wallet-tab">Wallet</TabsTrigger>
              )}
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProfileV2 />
                </div>
                <div className="space-y-4">
                  <ProfileCompletenessIndicator
                    data={indicatorData}
                    onFieldClick={handleFieldClick}
                    showFieldList={true}
                    compact={false}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <NotificationPreferences />
            </TabsContent>
            
            {showWalletUI && !walletFlagLoading && (
              <TabsContent value="wallet" className="space-y-6">
                <WalletTab 
                  showAddCardModal={showAddCardModal} 
                  setShowAddCardModal={setShowAddCardModal} 
                />
              </TabsContent>
            )}
            
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
  
  // Convert to indicator data format
  const indicatorData = useMemo(() => {
    return convertToIndicatorData(completenessData, profile);
  }, [completenessData, profile]);
  
  // Handle field clicks from the indicator
  const handleFieldClick = (fieldId: string) => {
    setActiveTab('profile');
    
    // Focus on specific form fields based on the field ID
    setTimeout(() => {
      let selector = '';
      switch (fieldId) {
        case 'full_name':
          selector = '[id^="first_name"], [id^="full_name"]';
          break;
        case 'date_of_birth':
        case 'gender':
        case 'email':
        case 'phone':
          selector = `[id^="${fieldId}"]`;
          break;
        case 'passport_number':
        case 'passport_country':
        case 'passport_expiry':
        case 'known_traveler_number':
          selector = `[id^="${fieldId}"]`;
          break;
        default:
          selector = '[id^="first_name"]';
      }
      
      const formElement = document.querySelector(selector);
      if (formElement && formElement instanceof HTMLElement) {
        formElement.focus();
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
    // Show appropriate toast message
    const fieldLabels: Record<string, string> = {
      full_name: 'Full Name',
      date_of_birth: 'Date of Birth',
      gender: 'Gender',
      email: 'Email Address',
      phone: 'Phone Number',
      passport_number: 'Passport Number',
      passport_country: 'Passport Country',
      passport_expiry: 'Passport Expiry Date',
      known_traveler_number: 'Known Traveler Number',
      phone_verified: 'Phone Verification',
      is_verified: 'Identity Verification'
    };
    
    toast({
      title: `Complete ${fieldLabels[fieldId] || 'Field'}`,
      description: `Please fill out your ${(fieldLabels[fieldId] || fieldId).toLowerCase()} in the form below.`,
    });
  };
  
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
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <SimpleProfileStatus 
                    completeness={completenessData}
                    onActionClick={handleActionClick}
                    className="mb-6"
                  />
                  <ProfileForm useKMS={true} />
                </div>
                <div className="space-y-4">
                  <ProfileCompletenessIndicator
                    data={indicatorData}
                    onFieldClick={handleFieldClick}
                    showFieldList={true}
                    compact={false}
                  />
                </div>
              </div>
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
    <div className="min-h-screen bg-gray-50" data-testid="profile-page">
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
  const { data: showEnhancedProfile, isLoading: flagLoading } = useFeatureFlag('profile_ui_revamp');
  
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
