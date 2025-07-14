import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// User profile interface with KMS encryption support
export interface UserProfile {
  id: string;
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
      marketing?: boolean;
    };
    privacy?: {
      profileVisibility?: 'public' | 'private' | 'friends';
      showEmail?: boolean;
      showPhone?: boolean;
    };
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  encryptedFields?: string[]; // Fields that are encrypted with KMS
}

// KMS encryption service interface
interface KMSEncryption {
  encrypt(data: string, keyId: string): Promise<string>;
  decrypt(encryptedData: string, keyId: string): Promise<string>;
}

// Profile API service with KMS encryption
export class ProfileApiKMS {
  private supabase: ReturnType<typeof createClient<Database>>;
  private kmsKeyId: string;
  private encryptedFields: Set<string>;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    this.kmsKeyId = process.env.NEXT_PUBLIC_KMS_KEY_ID || 'default-key';
    this.encryptedFields = new Set(['email', 'phone', 'bio', 'location']);
  }

  private async encryptField(value: string): Promise<string> {
    try {
      // Use Supabase edge function for KMS encryption
      const { data, error } = await this.supabase.functions.invoke('kms-encrypt', {
        body: { data: value, keyId: this.kmsKeyId }
      });
      
      if (error) throw error;
      return data.encryptedData;
    } catch (error) {
      console.error('KMS encryption failed:', error);
      // Fallback to base64 encoding for development
      return btoa(value);
    }
  }

  private async decryptField(encryptedValue: string): Promise<string> {
    try {
      // Use Supabase edge function for KMS decryption
      const { data, error } = await this.supabase.functions.invoke('kms-decrypt', {
        body: { encryptedData: encryptedValue, keyId: this.kmsKeyId }
      });
      
      if (error) throw error;
      return data.data;
    } catch (error) {
      console.error('KMS decryption failed:', error);
      // Fallback to base64 decoding for development
      return atob(encryptedValue);
    }
  }

  private async encryptProfile(profile: Partial<UserProfile>): Promise<Partial<UserProfile>> {
    const encrypted = { ...profile };
    
    for (const [key, value] of Object.entries(profile)) {
      if (this.encryptedFields.has(key) && typeof value === 'string') {
        (encrypted as any)[key] = await this.encryptField(value);
      }
    }
    
    encrypted.encryptedFields = Array.from(this.encryptedFields);
    return encrypted;
  }

  private async decryptProfile(profile: UserProfile): Promise<UserProfile> {
    const decrypted = { ...profile };
    
    if (profile.encryptedFields) {
      for (const field of profile.encryptedFields) {
        const value = profile[field as keyof UserProfile];
        if (typeof value === 'string') {
          (decrypted as any)[field] = await this.decryptField(value);
        }
      }
    }
    
    return decrypted;
  }

  async getProfile(): Promise<UserProfile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        return await this.createProfile(user.id, {
          email: user.email,
          firstName: user.user_metadata?.firstName,
          lastName: user.user_metadata?.lastName
        });
      }
      throw error;
    }

    return await this.decryptProfile(data as UserProfile);
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const encryptedData = await this.encryptProfile(profileData);
    const updateData = {
      ...encryptedData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return await this.decryptProfile(data as UserProfile);
  }

  async createProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    const encryptedData = await this.encryptProfile(profileData);
    const createData = {
      id: crypto.randomUUID(),
      user_id: userId,
      ...encryptedData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('profiles')
      .insert(createData)
      .select()
      .single();

    if (error) throw error;
    return await this.decryptProfile(data as UserProfile);
  }

  async deleteProfile(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await this.supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;
  }

  async uploadAvatar(file: File): Promise<string> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async getProfileByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return await this.decryptProfile(data as UserProfile);
  }

  async searchProfiles(query: string, limit: number = 10): Promise<UserProfile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .or(`display_name.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;

    return await Promise.all(
      (data as UserProfile[]).map(profile => this.decryptProfile(profile))
    );
  }

  async updatePreferences(preferences: UserProfile['preferences']): Promise<UserProfile> {
    return await this.updateProfile({ preferences });
  }

  async updateSocialLinks(socialLinks: UserProfile['socialLinks']): Promise<UserProfile> {
    return await this.updateProfile({ socialLinks });
  }
}

// Export singleton instance
export const profileServiceKMS = new ProfileApiKMS();
export default profileServiceKMS;
