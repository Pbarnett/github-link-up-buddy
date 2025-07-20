/**
 * Secure OAuth Callback Edge Function
 * 
 * Handles OAuth callbacks from providers and creates/updates user accounts
 * using secure credential management with AWS Secrets Manager.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SecretsManagerClient, GetSecretValueCommand } from 'https://esm.sh/@aws-sdk/client-secrets-manager@3';

// Environment configuration
const ENVIRONMENT = Deno.env.get('ENVIRONMENT') || 'development';
const AWS_REGION = Deno.env.get('AWS_REGION') || 'us-west-2';

// Secret naming patterns
const SUPABASE_SECRET_ID = `${ENVIRONMENT}/supabase/credentials`;
const OAUTH_SECRET_PATTERNS = {
  google: `${ENVIRONMENT}/oauth/google-credentials`,
  github: `${ENVIRONMENT}/oauth/github-credentials`,
  discord: `${ENVIRONMENT}/oauth/discord-credentials`,
  microsoft: `${ENVIRONMENT}/oauth/microsoft-credentials`,
};

/**
 * Secure AWS Secrets Manager Client
 */
class SecureSecretsClient {
  private static instance: SecureSecretsClient;
  private client: SecretsManagerClient;
  private cache = new Map<string, { value: string; expiry: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  private constructor() {
    this.client = new SecretsManagerClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
        sessionToken: Deno.env.get('AWS_SESSION_TOKEN'),
      },
    });
  }

  static getInstance(): SecureSecretsClient {
    if (!SecureSecretsClient.instance) {
      SecureSecretsClient.instance = new SecureSecretsClient();
    }
    return SecureSecretsClient.instance;
  }

  async getSecret(secretId: string): Promise<string> {
    // Check cache first
    const cached = this.cache.get(secretId);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    try {
      const command = new GetSecretValueCommand({ SecretId: secretId });
      const response = await this.client.send(command);
      
      if (!response.SecretString) {
        throw new Error(`Secret ${secretId} has no string value`);
      }

      // Cache the secret
      this.cache.set(secretId, {
        value: response.SecretString,
        expiry: Date.now() + this.CACHE_TTL,
      });

      return response.SecretString;
    } catch (error) {
      console.error(`Failed to get secret ${secretId}:`, error);
      throw error;
    }
  }
}

/**
 * OAuth Provider Configuration
 */
interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  userInfoUrl: string;
}

/**
 * Secure OAuth Configuration Manager
 */
class OAuthConfigManager {
  private static configCache = new Map<string, { config: OAuthConfig; expiry: number }>();
  private static readonly CACHE_TTL = 10 * 60 * 1000;

  static async getConfig(provider: string): Promise<OAuthConfig> {
    const cached = this.configCache.get(provider);
    if (cached && cached.expiry > Date.now()) {
      return cached.config;
    }

    const secretsClient = SecureSecretsClient.getInstance();
    const secretId = OAUTH_SECRET_PATTERNS[provider as keyof typeof OAUTH_SECRET_PATTERNS];
    
    if (!secretId) {
      throw new Error(`Unsupported OAuth provider: ${provider}`);
    }

    const credentialsJson = await secretsClient.getSecret(secretId);
    const credentials = JSON.parse(credentialsJson);

    const config = this.buildProviderConfig(provider, credentials);
    
    // Cache configuration
    this.configCache.set(provider, {
      config,
      expiry: Date.now() + this.CACHE_TTL,
    });

    return config;
  }

  private static buildProviderConfig(provider: string, credentials: any): OAuthConfig {
    const baseConfigs = {
      google: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      },
      github: {
        tokenUrl: 'https://github.com/login/oauth/access_token',
        userInfoUrl: 'https://api.github.com/user',
      },
      discord: {
        tokenUrl: 'https://discord.com/api/oauth2/token',
        userInfoUrl: 'https://discord.com/api/users/@me',
      },
      microsoft: {
        tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
      },
    };

    const baseConfig = baseConfigs[provider as keyof typeof baseConfigs];
    if (!baseConfig) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    return {
      clientId: credentials.client_id,
      clientSecret: credentials.client_secret,
      ...baseConfig,
    };
  }
}

/**
 * OAuth Token Exchange
 */
async function exchangeCodeForToken(
  provider: string,
  code: string,
  redirectUri: string,
  codeVerifier?: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const config = await OAuthConfigManager.getConfig(provider);

  const tokenParams = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  // Add PKCE code verifier if provided
  if (codeVerifier) {
    tokenParams.append('code_verifier', codeVerifier);
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: tokenParams.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  const tokenData = await response.json();

  if (tokenData.error) {
    throw new Error(`OAuth error: ${tokenData.error_description || tokenData.error}`);
  }

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    expiresIn: tokenData.expires_in,
  };
}

/**
 * Get User Information from OAuth Provider
 */
async function getUserInfo(provider: string, accessToken: string): Promise<{
  id: string;
  email: string;
  name: string;
  avatar?: string;
}> {
  const config = await OAuthConfigManager.getConfig(provider);

  const response = await fetch(config.userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.status}`);
  }

  const userData = await response.json();

  // Map provider-specific data to standardized format
  return mapUserData(provider, userData);
}

/**
 * Map Provider User Data
 */
function mapUserData(provider: string, userData: any): {
  id: string;
  email: string;
  name: string;
  avatar?: string;
} {
  switch (provider) {
    case 'google':
      return {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.picture,
      };

    case 'github':
      return {
        id: userData.id.toString(),
        email: userData.email,
        name: userData.name || userData.login,
        avatar: userData.avatar_url,
      };

    case 'discord':
      return {
        id: userData.id,
        email: userData.email,
        name: userData.username,
        avatar: userData.avatar 
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : undefined,
      };

    case 'microsoft':
      return {
        id: userData.id,
        email: userData.mail || userData.userPrincipalName,
        name: userData.displayName,
        avatar: undefined,
      };

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Create or Update User in Supabase
 */
async function createOrUpdateUser(
  supabase: any,
  provider: string,
  userInfo: any,
  tokens: any
): Promise<{
  user: any;
  session: any;
}> {
  // Check if user already exists with this OAuth provider
  const { data: existingUser, error: queryError } = await supabase
    .from('user_oauth_providers')
    .select(`
      user_id,
      users (*)
    `)
    .eq('provider', provider)
    .eq('provider_user_id', userInfo.id)
    .single();

  if (queryError && queryError.code !== 'PGRST116') {
    throw new Error(`Database query error: ${queryError.message}`);
  }

  let userId: string;

  if (existingUser) {
    // Update existing user's OAuth tokens
    userId = existingUser.user_id;
    
    const { error: updateError } = await supabase
      .from('user_oauth_providers')
      .update({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: tokens.expiresIn ? 
          new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('provider', provider)
      .eq('provider_user_id', userInfo.id);

    if (updateError) {
      throw new Error(`Failed to update OAuth tokens: ${updateError.message}`);
    }
  } else {
    // Check if user exists with the same email
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userInfo.email)
      .single();

    if (emailError && emailError.code !== 'PGRST116') {
      throw new Error(`Email lookup error: ${emailError.message}`);
    }

    if (emailUser) {
      // Link OAuth provider to existing user
      userId = emailUser.id;
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          full_name: userInfo.name,
          avatar_url: userInfo.avatar,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      userId = newUser.id;
    }

    // Create OAuth provider record
    const { error: providerError } = await supabase
      .from('user_oauth_providers')
      .insert({
        user_id: userId,
        provider,
        provider_user_id: userInfo.id,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_at: tokens.expiresIn ? 
          new Date(Date.now() + tokens.expiresIn * 1000).toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (providerError) {
      throw new Error(`Failed to create OAuth provider record: ${providerError.message}`);
    }
  }

  // Get complete user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError) {
    throw new Error(`Failed to fetch user data: ${userError.message}`);
  }

  // Create Supabase auth session
  const { data: session, error: sessionError } = await supabase.auth.admin
    .generateLink({
      type: 'magiclink',
      email: user.email,
      options: {
        redirectTo: `${Deno.env.get('SITE_URL')}/dashboard`,
      },
    });

  if (sessionError) {
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  return { user, session };
}

/**
 * Main Handler Function
 */
serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse URL parameters
    const url = new URL(req.url);
    const provider = url.searchParams.get('provider');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const codeVerifier = url.searchParams.get('code_verifier');
    const redirectUri = url.searchParams.get('redirect_uri');

    if (!provider || !code || !state) {
      throw new Error('Missing required OAuth parameters');
    }

    // Validate state parameter (should match what was stored in client)
    // In a real implementation, you'd validate this against a stored value
    console.log(`OAuth callback for ${provider} with state: ${state}`);

    // Get Supabase credentials
    const secretsClient = SecureSecretsClient.getInstance();
    const supabaseCredentials = JSON.parse(
      await secretsClient.getSecret(SUPABASE_SECRET_ID)
    );

    const supabase = createClient(
      supabaseCredentials.supabase_url,
      supabaseCredentials.supabase_service_key
    );

    // Exchange authorization code for access token
    const tokens = await exchangeCodeForToken(
      provider,
      code,
      redirectUri || `${url.origin}/auth/callback/${provider}`,
      codeVerifier
    );

    // Get user information from OAuth provider
    const userInfo = await getUserInfo(provider, tokens.accessToken);

    // Create or update user in Supabase
    const { user, session } = await createOrUpdateUser(
      supabase,
      provider,
      userInfo,
      tokens
    );

    // Return success response with user data and session
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
        },
        session: {
          access_token: session.properties?.hashed_token,
          refresh_token: session.properties?.refresh_token,
        },
        provider,
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('OAuth callback error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'OAuth authentication failed',
        code: 'OAUTH_ERROR',
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});
