// Authentication testing utility
import { supabase } from '@/integrations/supabase/client';

export const testAuth = async () => {
  console.log('🔍 Testing authentication setup...');
  
  try {
    // Test 1: Check if Supabase client is working
    const { data: settings, error: settingsError } = await supabase.auth.getSettings();
    if (settingsError) {
      console.error('❌ Failed to get auth settings:', settingsError);
      return false;
    }
    console.log('✅ Auth settings loaded successfully');
    console.log('Available providers:', Object.keys(settings.external).filter(key => settings.external[key]));
    
    // Test 2: Check current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Failed to get session:', sessionError);
      return false;
    }
    
    if (sessionData.session) {
      console.log('✅ User is currently authenticated:', sessionData.session.user.email);
    } else {
      console.log('ℹ️ No active session found');
    }
    
    // Test 3: Try to get user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('❌ Failed to get user:', userError);
      return false;
    }
    
    if (userData.user) {
      console.log('✅ User data retrieved:', userData.user.email);
    } else {
      console.log('ℹ️ No user data available');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  interface WindowWithTestAuth extends Window {
    testAuth: typeof testAuth;
  }
  (window as WindowWithTestAuth).testAuth = testAuth;
}
