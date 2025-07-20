
// Enhanced profile component with React 19 features

import * as React from 'react';
const { useState, useMemo, useDeferredValue, useTransition } = React;
type FC<T = {}> = React.FC<T>;
type Component<P = {}, S = {}> = React.Component<P, S>;

import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Settings, Bell, Plane } from 'lucide-react';

// Mock user activities for demo
const mockActivities = [
  { id: '1', type: 'flight', title: 'Flight to NYC', date: '2024-03-15', status: 'completed' },
  { id: '2', type: 'booking', title: 'Hotel Reservation', date: '2024-03-10', status: 'pending' },
  { id: '3', type: 'campaign', title: 'Auto-booking Campaign', date: '2024-03-08', status: 'active' },
  { id: '4', type: 'flight', title: 'Return from LAX', date: '2024-03-05', status: 'completed' },
  { id: '5', type: 'search', title: 'Flight Search', date: '2024-03-01', status: 'completed' },
];

const ProfileRevamp: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'activity'>('overview');
  const deferredQuery = useDeferredValue(searchQuery);
  
  // Filter activities with deferred value for better performance
  const filteredActivities = useMemo(() => {
    if (!deferredQuery) return mockActivities;
    
    return mockActivities.filter(activity => 
      activity.title.toLowerCase().includes(deferredQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery]);
  
  const isSearchStale = searchQuery !== deferredQuery;
  
  const handleViewChange = (view: 'overview' | 'activity') => {
    startTransition(() => {
      setActiveView(view);
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Enhanced Profile Dashboard
            <Badge variant="outline">React 19</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">Premium Traveler</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plane className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold">24</h3>
              <p className="text-sm text-muted-foreground">Flights Booked</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">3</h3>
              <p className="text-sm text-muted-foreground">Active Campaigns</p>
            </div>
          </div>
          
          {/* View Toggle Buttons with useTransition */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeView === 'overview' ? 'default' : 'outline'}
              onClick={() => handleViewChange('overview')}
              size="sm"
            >
              Overview
            </Button>
            <Button
              variant={activeView === 'activity' ? 'default' : 'outline'}
              onClick={() => handleViewChange('activity')}
              size="sm"
            >
              Activity
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Overview Content */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">React 19 Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">NEW</Badge>
                  <span className="text-sm">useTransition for smooth view changes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">NEW</Badge>
                  <span className="text-sm">useDeferredValue for search optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">NEW</Badge>
                  <span className="text-sm">Enhanced Suspense patterns</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  <Plane className="w-4 h-4 mr-2" />
                  Book New Flight
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Campaigns
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Activity Content with useDeferredValue search */}
      {activeView === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activity
              {isSearchStale && (
                <Badge variant="secondary" className="text-xs">
                  Searching...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search with useDeferredValue */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Activity List */}
            <div className={`space-y-3 transition-opacity duration-200 ${
              isSearchStale ? 'opacity-60' : 'opacity-100'
            }`}>
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'flight' && <Plane className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'booking' && <Settings className="w-4 h-4 text-green-600" />}
                      {activity.type === 'campaign' && <Bell className="w-4 h-4 text-purple-600" />}
                      {activity.type === 'search' && <Search className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={activity.status === 'completed' ? 'default' : 
                            activity.status === 'active' ? 'secondary' : 'outline'}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            
            {filteredActivities.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                <p className="text-muted-foreground">Try searching with different keywords.</p>
              </div>
            )}
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>
                <strong>Performance Note:</strong> Search uses{' '}
                <code className="bg-muted px-1 rounded">useDeferredValue</code> to defer filtering while keeping input responsive.
                Current: "{searchQuery}" | Deferred: "{deferredQuery}"
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Legacy Profile Component
const LegacyProfile: FC = () => {
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
const ProfileSkeleton: FC = () => {
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
const Profile: FC = () => {
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
