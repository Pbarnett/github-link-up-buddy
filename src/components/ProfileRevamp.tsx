// Example component for profile UI revamp feature flag
import React, { Suspense } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileRevamp: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            New Profile UI
            <Badge variant="outline">Revamped</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium">Enhanced Profile</h3>
                <p className="text-sm text-muted-foreground">
                  This is the new and improved profile interface with better UX and modern design.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Advanced Features</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Improved navigation</li>
                  <li>• Better accessibility</li>
                  <li>• Enhanced performance</li>
                  <li>• Modern design system</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Legacy Profile Component
const LegacyProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is the legacy profile interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Loading component
const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Profile component with feature flag
const Profile: React.FC = () => {
  const { data: showNewUI, isLoading } = useFeatureFlag('profile_ui_revamp', false);

  // Show loading state
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Show new UI if feature flag is enabled
  if (showNewUI) {
    return (
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileRevamp />
      </Suspense>
    );
  }

  // Default to legacy profile
  return <LegacyProfile />;
};

export default Profile;
export { ProfileRevamp, LegacyProfile };
