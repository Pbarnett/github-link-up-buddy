import React from "react";
import { SimpleProfileStatus } from "@/components/profile/SimpleProfileStatus";
import { ProfileForm } from "@/components/ProfileForm";
import type { ProfileCompletenessScore } from "@/services/profileCompletenessService";

// Minimal ProfileV2 to satisfy current Profile page usage
// Renders existing SimpleProfileStatus alongside the ProfileForm
export const ProfileV2: React.FC = () => {
  const initialCompleteness: ProfileCompletenessScore = {
    overall: 0,
    categories: {
      basic_info: 0,
      contact_info: 0,
      travel_documents: 0,
      preferences: 0,
      verification: 0,
    },
    missing_fields: [],
    recommendations: [],
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <SimpleProfileStatus completeness={initialCompleteness} />
      </div>
      <div className="md:col-span-2">
        <ProfileForm />
      </div>
    </div>
  );
};

