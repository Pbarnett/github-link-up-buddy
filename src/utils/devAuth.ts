// Development authentication utility
// This file provides easy authentication for development and testing

import { supabase } from '@/integrations/supabase/client';

export const signInTestUser = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123' // This matches the encrypted password we created
    });

    if (error) {
      console.error('Failed to sign in test user:', error);
      return null;
    }

    console.log('✅ Successfully signed in test user:', data.user?.email);
    return data.user;
  } catch (error) {
    console.error('Error during test user sign in:', error);
    return null;
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    console.log('✅ Successfully signed out');
  } catch (error) {
    console.error('Error during sign out:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Auto-sign in for development (call this from console)
if (typeof window !== 'undefined') {
  (window as Record<string, unknown>).devAuth = {
    signIn: signInTestUser,
    signOut,
    getCurrentUser,
  };
}
