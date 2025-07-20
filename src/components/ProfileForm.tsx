

import * as React from 'react';
const { useState, useEffect } = React;
type FormEvent = React.FormEvent;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useProfileKMS } from "@/hooks/useProfileKMS";
import { useState as reactUseState } from 'react';

interface ProfileFormProps {
  useKMS?: boolean;
}

export function ProfileForm({ useKMS = false }: ProfileFormProps = {}) {
  const legacyProfile = useProfile();
  const kmsProfile = useProfileKMS();
  
  // Choose which profile service to use
  const { profile, isLoading, updateProfile, isUpdating, error } = useKMS ? kmsProfile : legacyProfile;
  const [encryptionEnabled] = reactUseState(useKMS);
  
  console.log(`ProfileForm: Using ${useKMS ? 'KMS-encrypted' : 'legacy'} profile service`);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Profile Information
          {encryptionEnabled && (
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
              🔐 Encrypted
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Manage your personal information. Your phone number is required for SMS notifications about your flight bookings.
          {encryptionEnabled && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              <strong>🔐 Enhanced Security:</strong> Your sensitive data is encrypted using AWS KMS.
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter your phone number (e.g., +1234567890)"
            />
            <p className="text-sm text-muted-foreground">
              Include country code (e.g., +1 for US). Required for SMS flight reminders.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full md:w-auto"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
