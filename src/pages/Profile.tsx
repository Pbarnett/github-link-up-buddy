
import AuthGuard from "@/components/AuthGuard";
import { ProfileForm } from "@/components/ProfileForm";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTravelerProfile } from "@/hooks/useTravelerProfile";
import { SimpleProfileStatus } from "@/components/profile/SimpleProfileStatus";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { ProfileCompletenessScore } from "@/services/profileCompletenessService";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { ProfileV2 } from "@/components/profile/ProfileV2";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletProvider, useWallet } from "@/contexts/WalletContext";
import { PaymentMethodList } from "@/components/wallet/PaymentMethodList";
import { AddCardModal } from "@/components/wallet/AddCardModal";

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
              <ProfileV2 />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <NotificationPreferences />
            </TabsContent>
            
            {showWalletUI && !walletFlagLoading && (
              <TabsContent value="wallet" className="space-y-6">
                <WalletProvider>
                  <WalletTab 
                    showAddCardModal={showAddCardModal} 
                    setShowAddCardModal={setShowAddCardModal} 
                  />
                </WalletProvider>
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
