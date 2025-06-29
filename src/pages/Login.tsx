import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Auth state cleanup utility
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  try {
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Ignore if sessionStorage is not available
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // console.log('Initial session check:', data.session); // Removed
      setIsAuthenticated(!!data.session);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Auth state changed:', event, session?.user?.id); // Removed
      setIsAuthenticated(!!session);
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out globally (ignore errors)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // console.log('Sign out error (ignored):', signOutError); // Removed
      }
      
      // Now sign in with OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auto-booking',
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We've sent you a login link",
      });
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message || "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      // Log debugging information
      // console.log("Initiating Google login from:", window.location.origin); // Removed
      // console.log("Redirect URL:", window.location.origin + '/dashboard'); // Removed
      
      // Log known Supabase configuration (using hardcoded known values instead of accessing protected properties)
      // console.log("Supabase URL:", "https://bbonngdyfyfjqfhvoljl.supabase.co"); // Removed
      // console.log("Supabase auth config:", { // Removed
      //   storage: "localStorage", // Removed
      //   autoRefreshToken: true, // Removed
      //   persistSession: true // Removed
      // }); // Removed
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out globally (ignore errors)
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (signOutError) {
        // console.log('Sign out error (ignored):', signOutError); // Removed
      }
      
      // Check for popup blockers
      const popupTest = window.open('about:blank', '_blank', 'width=1,height=1');
      if (!popupTest) {
        toast({
          title: "Popup Blocked",
          description: "Please enable popups for this site to use Google login",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      popupTest.close();
      
      // console.log("Sending OAuth request with params:", { // Removed
      //   provider: 'google', // Removed
      //   options: { // Removed
      //     redirectTo: window.location.origin + '/dashboard', // Removed
      //     skipBrowserRedirect: false // Removed
      //   } // Removed
      // }); // Removed
      
      // Now sign in with Google OAuth with explicit parameters
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auto-booking',
          skipBrowserRedirect: false
        }
      });
      
      // console.log("OAuth response:", data); // Removed
      
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Google Login Failed", description: error.message || "An unexpected error occurred with Google login. Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/auto-booking" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending link...' : 'Send Magic Link'}
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            Google
          </Button>
          
          <div className="pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="destructive" 
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                cleanupAuthState();
                toast({ title: "Auth Reset", description: "Authentication data cleared. Page will reload." });
                setTimeout(() => window.location.reload(), 1000);
              }}
            >
              🔧 Emergency Reset (Clear Auth Data)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
