import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { trackComponentRender } from '@/utils/debugUtils';
interface CurrentUserState {
  user: User | null;
  userId: string | null;
  loading: boolean;
  error: Error | null;
}

// Singleton state manager to prevent multiple subscriptions
class UserStateManager {
  private state: CurrentUserState = {
    user: null,
    userId: null,
    loading: true,
    error: null,
  };

  private listeners = new Set<(state: CurrentUserState) => void>();
  private subscription: any = null;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      // Initial user check
      const { data, error } = await supabase.auth.getUser();

      if (error && !error.message?.includes('Auth session missing')) {
        throw error;
      }

      this.updateState({
        user: data?.user || null,
        userId: data?.user?.id || null,
        loading: false,
        error: null,
      });

      // Set up auth state listener (only once)
      if (!this.subscription) {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          this.updateState({
            user: session?.user || null,
            userId: session?.user?.id || null,
            loading: false,
            error: null,
          });
        });
        this.subscription = subscription;
      }
    } catch (error) {
      console.error('Error initializing user state:', error);
      this.updateState({
        user: null,
        userId: null,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  }

  private updateState(newState: Partial<CurrentUserState>) {
    const prevState = this.state;
    this.state = { ...prevState, ...newState };

    // Only notify listeners if something actually changed
    const hasChanged =
      prevState.user?.id !== this.state.user?.id ||
      prevState.loading !== this.state.loading ||
      prevState.error !== this.state.error;

    if (hasChanged) {
      this.listeners.forEach(listener => listener(this.state));
    }
  }

  subscribe(listener: (state: CurrentUserState) => void) {
    this.listeners.add(listener);

    // Initialize on first subscription
    if (!this.initialized) {
      this.initialize();
    }

    // Return current state immediately
    listener(this.state);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return this.state;
  }

  cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.listeners.clear();
    this.initialized = false;
  }
}

// Singleton instance
const userStateManager = new UserStateManager();

export const useCurrentUser = (): CurrentUserState => {
  // Track hook usage for debugging
  trackComponentRender('useCurrentUser');

  const [state, setState] = useState<CurrentUserState>(() =>
    userStateManager.getState()
  );
  const stateRef = useRef(state);

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = userStateManager.subscribe(newState => {
      // Only update if state actually changed to prevent unnecessary re-renders
      if (
        stateRef.current.user?.id !== newState.user?.id ||
        stateRef.current.loading !== newState.loading ||
        stateRef.current.error !== newState.error
      ) {
        stateRef.current = newState;
        setState(newState);
      }
    });

    return unsubscribe;
  }, []); // Empty dependency array - this effect should only run once

  return state;
};

// Cleanup function for testing
export const cleanupUserState = () => {
  userStateManager.cleanup();
};
