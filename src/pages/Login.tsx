import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { oauthProviders } from '@/lib/auth';

/**
 * LOGIN COMPONENT - Enterprise Grade Authentication
 *
 * Utilizes world-class authentication architecture with:
 * - Centralized auth service with singleton pattern
 * - Environment-aware redirect URL configuration
 * - Comprehensive error handling and retry logic
 * - Proper TypeScript types and state management
 * - Toast notifications and loading states
 */

const Login: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    error,
    signInWithGoogle,
    emergencyReset,
    clearError,
    isInitialized,
  } = useAuth();

  // Handle authentication redirect
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-gray-600">Initializing...</span>
        </div>
      </div>
    );
  }

  // Handle Google sign-in with enterprise auth service
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in the useAuth hook
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ backgroundColor: '#f3f4f6' }}
    >
      <Card
        className="w-full max-w-md"
        style={{
          backgroundColor: 'white',
          border: '2px solid #374151',
          borderRadius: '0.5rem',
          padding: '2rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-2xl font-bold"
            style={{
              color: '#000000',
              fontSize: '1.875rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
            }}
          >
            Sign In
          </CardTitle>
          <CardDescription
            style={{ color: '#374151', fontSize: '1rem', fontWeight: '500' }}
          >
            Sign in with Google to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearError}
                  className="ml-2 h-auto p-0 text-xs underline"
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1rem',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                {oauthProviders.google.icon} {oauthProviders.google.buttonText}
              </>
            )}
          </Button>

          {/* Emergency Reset */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full text-xs"
              onClick={emergencyReset}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
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
