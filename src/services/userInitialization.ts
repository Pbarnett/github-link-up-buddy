import { supabase } from '@/integrations/supabase/client';

/**
 * Service for handling user initialization after authentication
 */
export class UserInitializationService {
  /**
   * Initializes user preferences after successful sign-in
   * This calls the Edge Function to create user preferences asynchronously
   */
  static async initializeUserPreferences(userId: string): Promise<void> {
    try {
      console.log(`🔧 Initializing user preferences for user: ${userId}`);
      
      // Get the current session to use the user's JWT
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No valid session found for user initialization');
      }

      // Call the user preferences initialization Edge Function
      const { data, error } = await supabase.functions.invoke('create-user-preferences', {
        body: { user_id: userId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('❌ Failed to initialize user preferences:', error);
        // Don't throw - we want this to be non-blocking
        return;
      }

      console.log('✅ Successfully initialized user preferences:', data);
    } catch (error) {
      console.error('❌ Error during user initialization:', error);
      // Non-blocking - log the error but don't prevent login
    }
  }

  /**
   * Ensures user preferences exist, creating them if missing
   * This is idempotent and safe to call multiple times
   */
  static async ensureUserPreferences(userId: string): Promise<boolean> {
    try {
      // First check if preferences already exist
      const { data: existingPreferences, error: checkError } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" which is expected if preferences don't exist
        throw checkError;
      }

      if (existingPreferences) {
        console.log('✅ User preferences already exist');
        return true;
      }

      // If no preferences exist, initialize them
      console.log('🔧 User preferences not found, initializing...');
      await this.initializeUserPreferences(userId);
      return true;
    } catch (error) {
      console.error('❌ Failed to ensure user preferences:', error);
      return false;
    }
  }

  /**
   * Handles the complete post-signin initialization flow
   */
  static async handlePostSignin(userId: string): Promise<void> {
    console.log('🚀 Starting post-signin initialization for user:', userId);
    
    try {
      // Ensure user preferences exist
      await this.ensureUserPreferences(userId);
      
      // Add any other post-signin initialization here
      // For example: analytics tracking, feature flags, etc.
      
      console.log('✅ Post-signin initialization completed successfully');
    } catch (error) {
      console.error('❌ Post-signin initialization failed:', error);
      // This is non-blocking - we don't want to prevent the user from using the app
    }
  }
}
