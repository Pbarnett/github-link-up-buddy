export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          github_username: string | null;
          github_avatar_url: string | null;
          display_name: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          twitter_username: string | null;
          linkedin_url: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          github_username?: string | null;
          github_avatar_url?: string | null;
          display_name?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          twitter_username?: string | null;
          linkedin_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          github_username?: string | null;
          github_avatar_url?: string | null;
          display_name?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          twitter_username?: string | null;
          linkedin_url?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      github_repositories: {
        Row: {
          id: string;
          user_id: string;
          github_id: number;
          name: string;
          full_name: string;
          description: string | null;
          html_url: string;
          clone_url: string;
          language: string | null;
          stars_count: number;
          forks_count: number;
          open_issues_count: number;
          is_fork: boolean;
          is_private: boolean;
          created_at: string;
          updated_at: string;
          pushed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          github_id: number;
          name: string;
          full_name: string;
          description?: string | null;
          html_url: string;
          clone_url: string;
          language?: string | null;
          stars_count?: number;
          forks_count?: number;
          open_issues_count?: number;
          is_fork?: boolean;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
          pushed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          github_id?: number;
          name?: string;
          full_name?: string;
          description?: string | null;
          html_url?: string;
          clone_url?: string;
          language?: string | null;
          stars_count?: number;
          forks_count?: number;
          open_issues_count?: number;
          is_fork?: boolean;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
          pushed_at?: string | null;
        };
      };
      connections: {
        Row: {
          id: string;
          requester_id: string;
          requested_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          requested_id: string;
          status?: 'pending' | 'accepted' | 'rejected';
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          requested_id?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_name: string;
          proficiency_level:
            | 'beginner'
            | 'intermediate'
            | 'advanced'
            | 'expert';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_name: string;
          proficiency_level?:
            | 'beginner'
            | 'intermediate'
            | 'advanced'
            | 'expert';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_name?: string;
          proficiency_level?:
            | 'beginner'
            | 'intermediate'
            | 'advanced'
            | 'expert';
          created_at?: string;
        };
      };
      user_interests: {
        Row: {
          id: string;
          user_id: string;
          interest_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          interest_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          interest_name?: string;
          created_at?: string;
        };
      };
      traveler_profiles: {
        Row: {
          id: string;
          user_id: string;
          firstName: string;
          lastName: string;
          dateOfBirth: string;
          nationality: string;
          passportNumber?: string | null;
          passportExpiry?: string | null;
          preferredSeat?: string | null;
          dietaryRestrictions?: string | null;
          medicalInfo?: string | null;
          emergencyContact?: string | null;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          firstName: string;
          lastName: string;
          dateOfBirth: string;
          nationality: string;
          passportNumber?: string | null;
          passportExpiry?: string | null;
          preferredSeat?: string | null;
          dietaryRestrictions?: string | null;
          medicalInfo?: string | null;
          emergencyContact?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          firstName?: string;
          lastName?: string;
          dateOfBirth?: string;
          nationality?: string;
          passportNumber?: string | null;
          passportExpiry?: string | null;
          preferredSeat?: string | null;
          dietaryRestrictions?: string | null;
          medicalInfo?: string | null;
          emergencyContact?: string | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_method_id: string;
          type: 'card' | 'bank_account' | 'wallet';
          card_brand?: string | null;
          card_last4?: string | null;
          card_exp_month?: number | null;
          card_exp_year?: number | null;
          billing_address?: Json | null;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_payment_method_id: string;
          type: 'card' | 'bank_account' | 'wallet';
          card_brand?: string | null;
          card_last4?: string | null;
          card_exp_month?: number | null;
          card_exp_year?: number | null;
          billing_address?: Json | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_payment_method_id?: string;
          type?: 'card' | 'bank_account' | 'wallet';
          card_brand?: string | null;
          card_last4?: string | null;
          card_exp_month?: number | null;
          card_exp_year?: number | null;
          billing_address?: Json | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      search_profiles: {
        Args: {
          search_term: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          github_username: string;
          display_name: string;
          bio: string;
          location: string;
          avatar_url: string;
        }[];
      };
      search_repositories: {
        Args: {
          search_term: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          name: string;
          description: string;
          language: string;
          stars_count: number;
          html_url: string;
          owner_username: string;
        }[];
      };
      get_connection_suggestions: {
        Args: {
          user_id: string;
          limit_count?: number;
        };
        Returns: {
          id: string;
          github_username: string;
          display_name: string;
          bio: string;
          common_interests_count: number;
          common_skills_count: number;
        }[];
      };
      get_user_stats: {
        Args: {
          user_id: string;
        };
        Returns: {
          total_repositories: number;
          total_stars: number;
          total_connections: number;
          pending_requests: number;
          total_interests: number;
          total_skills: number;
        }[];
      };
    };
    Enums: {
      connection_status: 'pending' | 'accepted' | 'rejected';
      proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Export utility types for easier access
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Export table names as a union type
export type TableName = keyof Database['public']['Tables'];

// Export enum types
export type ConnectionStatus = Database['public']['Enums']['connection_status'];
export type ProficiencyLevel = Database['public']['Enums']['proficiency_level'];
