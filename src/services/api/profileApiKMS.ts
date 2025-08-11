// Minimal Profile API with KMS shim for useProfileKMS hook
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  preferences?: Record<string, any>;
}

export const profileServiceKMS = {
  async getProfile(): Promise<UserProfile> {
    // Return a dummy profile for typing purposes
    return {
      id: 'user_dummy',
      email: 'user@example.com',
      name: 'Test User',
      preferences: { locale: 'en-US' },
    };
  },
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    // Echo back updated data merged with defaults
    return {
      id: 'user_dummy',
      email: profileData.email || 'user@example.com',
      name: profileData.name || 'Test User',
      preferences: { locale: 'en-US', ...(profileData.preferences || {}) },
    };
  },
};

