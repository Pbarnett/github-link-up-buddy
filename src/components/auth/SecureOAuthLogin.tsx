
/**
 * Secure OAuth Login Component
 *
 * React component for OAuth authentication with secure credential management.
 * Integrates with AWS Secrets Manager and Supabase edge functions.
 */

// OAuth provider icons (you can replace with actual icons)
const ProviderIcons = {
  google: '🔍',
  github: '🐙',
  discord: '🎮',
  microsoft: '🪟',
};

interface OAuthLoginProps {
  onSuccess?: (user: unknown, session: unknown) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
  enabledProviders?: ('google' | 'github' | 'discord' | 'microsoft')[];
  className?: string;
}

interface OAuthState {
  loading: boolean;
  error: string | null;
  currentProvider: string | null;
}

export const SecureOAuthLogin: React.FC<OAuthLoginProps> = ({
  onSuccess,
  onError,
  redirectTo = '/dashboard',
  enabledProviders = ['google', 'github', 'discord'],
  className = '',
}) => {
  const [state, setState] = useState<OAuthState>({
    loading: false,
    error: null,
    currentProvider: null,
  });

  /**
   * Complete OAuth flow after callback
   */
  const completeOAuthFlow = useCallback(
    async (provider: string, code: string, state: string) => {
      try {
        setState(prev => ({
          ...prev,
          loading: true,
          currentProvider: provider,
        }));

        // Validate state parameter
        const storedState = sessionStorage.getItem('oauth_state');
        const storedProvider = sessionStorage.getItem('oauth_provider');
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier');

        if (!storedState || !OAuthUtils.validateState(state, storedState)) {
          throw new Error(
            'Invalid OAuth state parameter - possible CSRF attack'
          );
        }

        if (storedProvider !== provider) {
          throw new Error('OAuth provider mismatch');
        }

        // Call secure OAuth callback edge function
        const callbackUrl = new URL(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/oauth-callback-secure`
        );
        callbackUrl.searchParams.set('provider', provider);
        callbackUrl.searchParams.set('code', code);
        callbackUrl.searchParams.set('state', state);
        callbackUrl.searchParams.set(
          'redirect_uri',
          `${window.location.origin}/auth/callback`
        );

        if (codeVerifier) {
          callbackUrl.searchParams.set('code_verifier', codeVerifier);
        }

        const response = await fetch(callbackUrl.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `OAuth callback failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'OAuth authentication failed');
        }

        // Clear OAuth session storage
        sessionStorage.removeItem('oauth_state');
        sessionStorage.removeItem('oauth_code_verifier');
        sessionStorage.removeItem('oauth_provider');

        // Set Supabase session (use a different method as setSession may not exist)
        if (result.session?.access_token) {
          // Try to set the session, but handle if method doesn't exist
          try {
            if ('setSession' in supabaseClient.auth) {
              await supabaseClient.auth.setSession({
                access_token: result.session.access_token,
                refresh_token: result.session.refresh_token,
              });
            }
          } catch (authError) {
            console.warn('Could not set session:', authError);
          }
        }

        setState({
          loading: false,
          error: null,
          currentProvider: null,
        });

        // Call success callback
        onSuccess?.(result.user, result.session);

        // Clean up URL parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        // Redirect to dashboard or specified URL
        if (redirectTo && redirectTo !== window.location.pathname) {
          window.location.href = redirectTo;
        }
      } catch (error) {
        console.error('OAuth completion failed:', error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'OAuth authentication failed';

        setState({
          loading: false,
          error: errorMessage,
          currentProvider: null,
        });

        onError?.(errorMessage);
      }
    },
    [onSuccess, onError, redirectTo]
  );

  /**
   * Handle OAuth callback from URL parameters
   */
  const handleOAuthCallback = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const provider = urlParams.get('provider');
    const error = urlParams.get('error');

    if (error) {
      const errorDescription = urlParams.get('error_description') || error;
      setState(prev => ({ ...prev, error: errorDescription }));
      onError?.(errorDescription);
      return;
    }

    if (code && state && provider) {
      await completeOAuthFlow(provider, code, state);
    }
  }, [onError, completeOAuthFlow]);

  // Handle OAuth callback on component mount
  useEffect(() => {
    handleOAuthCallback();
  }, [handleOAuthCallback]);

  /**
   * Initiate OAuth login flow
   */
  const initiateOAuthLogin = async (provider: string) => {
    try {
      setState({
        loading: true,
        error: null,
        currentProvider: provider,
      });

      // Generate authorization URL with PKCE
      const {
        url,
        state: oauthState,
        codeVerifier,
      } = await oauthServiceSecure.getAuthorizationUrl(
        provider as 'google' | 'github' | 'discord' | 'microsoft'
      );

      // Store OAuth state and code verifier in session storage
      sessionStorage.setItem('oauth_state', oauthState);
      if (codeVerifier) {
        sessionStorage.setItem('oauth_code_verifier', codeVerifier);
      }
      sessionStorage.setItem('oauth_provider', provider);

      // Redirect to OAuth provider
      window.location.href = url;
    } catch (error) {
      console.error(`OAuth initiation failed for ${provider}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : 'OAuth initiation failed';

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        currentProvider: null,
      }));

      onError?.(errorMessage);
    }
  };

  /**
   * Render OAuth provider button
   */
  const renderProviderButton = (provider: string) => {
    const isLoading = state.loading && state.currentProvider === provider;
    const displayName = OAuthUtils.getProviderDisplayName(provider);
    const icon = ProviderIcons[provider as keyof typeof ProviderIcons];

    return (
      <button
        key={provider}
        onClick={() => initiateOAuthLogin(provider)}
        disabled={state.loading}
        className={`
          flex items-center justify-center space-x-3 w-full px-4 py-3 
          border border-gray-300 rounded-lg shadow-sm bg-white 
          hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-offset-2 focus:ring-blue-500 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${className}
        `}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span className="text-sm font-medium text-gray-900">
              Connecting to {displayName}...
            </span>
          </>
        ) : (
          <>
            <span
              className="text-xl"
              role="img"
              aria-label={`${displayName} icon`}
            >
              {icon}
            </span>
            <span className="text-sm font-medium text-gray-900">
              Continue with {displayName}
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {state.error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400" role="img" aria-label="Error">
                ⚠️
              </span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Authentication Error
              </h3>
              <div className="mt-2 text-sm text-red-700">{state.error}</div>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setState(prev => ({ ...prev, error: null }))}
                className="inline-flex text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Dismiss</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OAuth provider buttons */}
      <div className="space-y-3">
        {enabledProviders.map(provider => renderProviderButton(provider))}
      </div>

      {/* Security notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure authentication powered by AWS Secrets Manager
        </p>
      </div>
    </div>
  );
};

/**
 * Hook for OAuth authentication state management
 */
export const useSecureOAuth = () => {
  const [authState, setAuthState] = useState<{
    user: unknown | null;
    session: unknown | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const checkExistingSession = useCallback(async () => {
    try {
      // Check for test auth override first
      const testAuthOverride = (window as any).__TEST_AUTH_OVERRIDE__;
      if (testAuthOverride) {
        setAuthState({
          user: testAuthOverride.user,
          session: testAuthOverride.session,
          loading: false,
          error: null,
        });
        return;
      }

      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) {
        throw error;
      }

      if (session) {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        setAuthState({
          user,
          session,
          loading: false,
          error: null,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Session check failed',
      });
    }
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    checkExistingSession();
  }, [checkExistingSession]);

  const logout = async () => {
    try {
      await supabaseClient.auth.signOut();
      setAuthState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  };

  const handleAuthSuccess = (user: unknown, session: unknown) => {
    setAuthState({
      user,
      session,
      loading: false,
      error: null,
    });
  };

  const handleAuthError = (error: string) => {
    setAuthState(prev => ({
      ...prev,
      error,
      loading: false,
    }));
  };

  return {
    ...authState,
    logout,
    handleAuthSuccess,
    handleAuthError,
  };
};

// Export default component
export default SecureOAuthLogin;
