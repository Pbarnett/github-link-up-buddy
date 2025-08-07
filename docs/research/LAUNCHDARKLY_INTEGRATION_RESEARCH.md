# LaunchDarkly Integration Research

LaunchDarkly Integration Gaps in React 18 + Vite + Supabase + Docker
1. React + Vite: Environment Variable Injection for LaunchDarkly Client
Context: A React 18 application built with Vite needs to use a LaunchDarkly client-side SDK key (Client-side ID) in the front-end. Vite handles environment variables at build time, which affects how we inject the LaunchDarkly Client ID for different environments (development, staging, production) especially when using Docker. Vite Environment Variables: In Vite, only variables prefixed with VITE_ are exposed to the client bundle. You should define your LaunchDarkly client-side ID in a .env file with a VITE_ prefix. For example, in your project’s .env or .env.development file:
dotenv
Copy
Edit
# .env (for development)
VITE_LD_CLIENT_ID = <your LaunchDarkly client-side ID>
And for production builds, you might have a separate .env.production:
dotenv
Copy
Edit
# .env.production
VITE_LD_CLIENT_ID = <prod LaunchDarkly client-side ID>
LaunchDarkly’s documentation explicitly notes to use the VITE_ prefix so that the variable is embedded into the bundle
launchdarkly.com
. The client-side ID is not a secret – it’s safe to expose in frontend code, but keeping it in an env file (instead of hard-coding) makes it easier to change per environment
launchdarkly.com
. Using the Client ID in Code: In your React code, you can access this variable via import.meta.env. For example, when initializing LaunchDarkly’s React SDK (using the launchdarkly-react-client-sdk):
tsx
Copy
Edit
// src/main.tsx or App.tsx
import { LDProvider } from 'launchdarkly-react-client-sdk';
import App from './App';

const ldClientId = import.meta.env.VITE_LD_CLIENT_ID;  // injected at build time
const initialContext = { key: 'anonymous-user', anonymous: true };  // initial user context

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LDProvider clientSideID={ldClientId} context={initialContext}>
      <App />
    </LDProvider>
  </React.StrictMode>
);
Here, clientSideID comes from the env var, and we provide an initial context (anonymous user) for flag evaluation. Using LDProvider sets up the LaunchDarkly client across the app. Ensure the ldClientId is defined; you may want to throw an error or warning if import.meta.env.VITE_LD_CLIENT_ID is empty, to catch misconfiguration early. Build-Time vs Runtime Considerations: By default, Vite statically injects the env value at build time
dev.to
dev.to
. This means if you build your app and bake in a particular VITE_LD_CLIENT_ID, the built JavaScript will always use that value. In a Docker deployment, this can be problematic if you want one Docker image to work in multiple environments – because the LaunchDarkly key (and other API endpoints, etc.) might differ between say, staging and production. Simply passing a different env var to the container at runtime won’t affect the already-built bundle (the frontend is just static files). Docker & Runtime Injection: To avoid rebuilding the React app for each environment, a common strategy is placeholder replacement. The idea is: build the app with a placeholder value for the env, then replace it with the real value when the container starts. For example, in .env.production you might set VITE_LD_CLIENT_ID="__LD_CLIENT_ID__PLACEHOLDER__". Vite will embed that placeholder string in the bundle
dev.to
. Then, in your Docker entrypoint script, use a tool like sed to swap the placeholder with the actual env variable provided to the container
dev.to
:
bash
Copy
Edit
# env.sh (to be run at container startup)
#!/bin/sh
# Replace placeholder with actual value from ENV
sed -i "s/__LD_CLIENT_ID__PLACEHOLDER__/${LD_CLIENT_ID}/g" /usr/share/nginx/html/assets/*.js
In the above, we assume the built files are served by nginx from /usr/share/nginx/html and the placeholder is unique. The script replaces the placeholder in all JS assets with the LD_CLIENT_ID environment variable from the container. In your Dockerfile, you’d copy this script and set the container CMD to run it before starting the server. This approach lets you build once and inject config at runtime
dev.to
, aligning with Docker’s philosophy of immutable builds. Best Practices & Security:
Never commit keys: Do not commit your actual LaunchDarkly IDs in git. Use env files and add them to .gitignore
launchdarkly.com
.
Client-side ID vs Server SDK key: Use the client-side ID (starting with mob- or client-) in frontend code. Never expose your secret server SDK key in the browser.
Verify env loading: Vite doesn’t reload env vars on the fly. If you add/change VITE_LD_CLIENT_ID, you may need to restart the dev server to see the effect
launchdarkly.com
.
Docker build args: Alternatively, you can pass VITE_LD_CLIENT_ID as a build arg to Docker and bake it in during docker build (simpler, but then each environment requires a separate build).
Multi-env builds: If you deploy to multiple environments, consider using Vite’s --mode flag or separate builds per environment with different .env files. This is simpler but does mean multiple builds.
Placeholder uniqueness: When using runtime replacement, choose a placeholder string that’s unique and won’t accidentally appear elsewhere in your code.
Common Pitfalls:
Using process.env: In Vite (and modern frontend builds), process.env.X won’t work unless shimmed. Use import.meta.env.VITE_X for variables
launchdarkly.com
.
Forgetting the prefix: If you name it LD_CLIENT_ID without VITE_, it will be undefined in the browser
launchdarkly.com
.
Not updating Docker strategies: If you modify how envs are handled (like adding new flags or variables), ensure your Docker startup scripts are updated accordingly.
Case-sensitivity: import.meta.env.VITE_LD_CLIENT_ID is case-sensitive. The key must match exactly what’s in the env file.
By following these practices, you can confidently inject the LaunchDarkly client ID at build or runtime as needed, enabling feature flag initialization in your React+Vite app under Docker.
2. Supabase Edge Functions + LaunchDarkly Server SDK (Deno Compatibility)
Context: Supabase Edge Functions run on Deno (a secure JavaScript runtime), which historically had limitations with Node.js modules. However, as of Deno 1.34+ and Supabase updates in late 2023, Supabase Edge Functions support npm modules and many Node built-in APIs natively
supabase.com
. This opens the door to using LaunchDarkly’s Node.js Server SDK inside Supabase Edge Functions to evaluate flags on the backend. Using the LaunchDarkly Node SDK in a Deno Function: The LaunchDarkly Node SDK (@launchdarkly/node-server-sdk) can be imported via Deno’s npm compatibility. In your Supabase Edge Function (written in TypeScript/JavaScript), do for example:
ts
Copy
Edit
// supabase/functions/launchdarkly-example.ts
import { init } from 'npm:@launchdarkly/node-server-sdk';  // Import Node SDK via Deno npm spec

// Initialize LD client at the top (outside the handler) for reuse across invocations:
const sdkKey = Deno.env.get('LD_SERVER_SDK_KEY')!;  // Set this env var in Supabase
const ldConfig = { 
  stream: false,  // Using polling mode for faster cold starts (streaming explained below)
};
const ldClient = init(sdkKey, ldConfig);

// Optionally wait for initialization at startup (could also do inside handler if needed)
ldClient.waitForInitialization().catch(err => {
  console.error("LD client failed to init:", err);
});

// The Edge Function handler
export default async function handleRequest(req: Request): Promise<Response> {
  // Ensure client is ready (with a timeout to avoid hanging too long)
  try {
    await ldClient.waitForInitialization({ timeout: 2 });
  } catch {
    console.warn("LaunchDarkly client not fully initialized (timeout). Proceeding with defaults.");
  }

  // Determine user context for flag evaluation
  const user = await getUserContextFromRequest(req);  // your logic to identify user, or use anon
  // Example user context object:
  // const user = { key: userId || "anon-user", email: userEmail, custom: { role: "free" } };

  // Evaluate a feature flag
  const flagValue = await ldClient.variation("wallet_ui", user, false);
  if (flagValue) {
    // ... perform logic if feature is enabled
  }

  // Optionally, capture some output or return flag in response
  return new Response(JSON.stringify({ wallet_ui: flagValue }), { status: 200 });
}
In the import, using the npm: specifier tells Deno to pull the module from NPM. Supabase’s build system will bundle this for you. Ensure you use the Server-side SDK key (often starting with sdk-) as LD_SERVER_SDK_KEY in your environment variables; you can set this in the Supabase dashboard for your function, or via the CLI. Compatibility and Alternatives: Thanks to Supabase’s custom Deno runtime, many Node core modules are supported (e.g. Buffer, crypto, etc.), so LaunchDarkly’s Node SDK should function. If you encounter any compatibility issues (say LaunchDarkly uses an unsupported API), there are a few strategies:
Use the Edge/Cloudflare variant: LaunchDarkly has an optimized Edge SDK for Cloudflare Workers and similar runtimes
github.com
, which is designed for environments without full Node support. In Deno, however, standard Node SDK now works, so this is less necessary than before.
Use the REST API: In a pinch, you can call LaunchDarkly’s flag evaluation endpoints directly. For example, the client-side flags can be fetched via HTTP using the client-side ID and an evaluation URL (LaunchDarkly provides an endpoint to get flag settings for a given user)
stackoverflow.com
. This requires constructing the request with the environment’s client ID and user context. However, using the official SDK is preferred – it handles caching, streaming updates, and offline fallbacks automatically.
Edge Proxy / Relay: For advanced setups, consider running a LaunchDarkly Relay Proxy or a persistent service that keeps flag data updated. Your Deno function could then query this local store (for example, via Redis or Supabase DB). This is complex but can nearly eliminate cold-start latency (see Persistent Flag Store below).
Optimization for Short-lived Functions: A Supabase Edge Function invocation is akin to a serverless function – it may start “cold” and run briefly. The LaunchDarkly Node SDK by default opens a streaming connection to receive real-time flag updates
launchdarkly.com
. For short-lived or infrequently invoked functions, the overhead of establishing a streaming connection might be unnecessary. Consider the following configurations:
Streaming vs Polling: You can disable streaming with stream: false in the config, which makes the SDK poll for flags at intervals instead. Polling mode can reduce init time on cold start because it doesn’t maintain an open socket
launchdarkly.com
. LaunchDarkly notes that if invocations are frequent (multiple per minute), streaming is beneficial so subsequent calls reuse the open connection and get instant updates
launchdarkly.com
. If invocations are rare or you have sudden scale-outs, polling might lead to faster startup because there’s no long-lived connection attempt on each cold start.
waitForInitialization Timeout: Use a short timeout when waiting for initialization
launchdarkly.com
. In the code above, we waited up to 2 seconds. If the SDK hasn’t fully initialized (downloaded all flags) by then, you can still proceed – variation() will return the default value if flags aren’t available yet. This ensures your function isn’t hanging too long. Always provide a sensible default in variation(flagKey, user, default) calls.
Re-use across invocations: By initializing the LD client outside the request handler (at the module top-level), the same client instance can be reused for subsequent invocations on a warm function instance. This amortizes the initialization cost. The first invocation may incur the delay for flag download; later ones will have flags cached in memory. Supabase’s Edge Runtime will try to keep functions warm, but this isn’t guaranteed on every call.
Flushing events: The Node SDK will queue analytics events (for flag evaluations) and send them periodically or on close. In a short function, you might want to call ldClient.flush() before the function exits to ensure events are delivered. You can also call ldClient.close() at the end of the function if you want to shut down the client (closing will flush events as well). If you keep the client around (no close), that’s fine for warm reuse; just be aware to close it during function shutdown (Supabase may handle this when the Deno isolate is disposed).
Example – evaluating flags in the function: Suppose you want to use a feature flag to gate logic in an edge function (maybe to decide if a certain beta logic runs on the server side). The above example demonstrates this: calling ldClient.variation("wallet_ui", userCtx, false) returns a boolean flag value for that user, defaulting to false if anything goes wrong. You can then use that to conditionally execute code. Alternative approach – secure mode or JWT: If you prefer not to use the server SDK in Deno, another approach is to evaluate flags on the client and send results to your edge function (for example, include a flag in a request header) – but this can be manipulated by clients, so it’s not secure. LaunchDarkly does support secure mode (where you sign the user identity with a secret and the client can request flags in a trusted way), but that’s mainly for client-side usage. For server-side decisions, using the server SDK as shown is the recommended approach for full security and flexibility. Common Pitfalls:
Missing SDK Key: Ensure LD_SERVER_SDK_KEY is set in the environment where the Edge Function runs. If it’s not, init() will fail. Never use a client-side ID here – server-side SDK key is required for the Node SDK.
Deno-specific issues: Deno may not support every Node module. If @launchdarkly/node-server-sdk had any Node-specific calls (like filesystem access, etc.), those could error. Test your function locally with the Supabase CLI. The Supabase Edge runtime team has worked to cover common modules – for example, if LaunchDarkly SDK uses crypto or http, those should be polyfilled by Deno. According to Supabase, you can migrate many Node apps with minimal changes
supabase.com
.
Cold start latency: The first flag request might be slow (a few hundred milliseconds to fetch flags from LaunchDarkly’s network). If your function is extremely latency-sensitive, consider using LaunchDarkly’s Relay Proxy or daemon mode (flag data pre-fetched and stored in Redis) to eliminate this. LaunchDarkly’s guide on serverless suggests using a persistent cache for high-performance scenarios
launchdarkly.com
launchdarkly.com
.
Staying under limits: Supabase Edge Functions have execution time limits (e.g., 5 seconds). Don’t wait an excessive time for LaunchDarkly initialization. Use timeouts or proceed with defaults if necessary.
Analytics events: By default, every flag evaluation is sent as an event to LaunchDarkly (for experimentation and tracking who’s seen what). In a high-volume edge function, this could generate many events. The SDK will batch them, but keep an eye on your LaunchDarkly plan’s event capacity. If you don’t need events, you could disable them in config (setting sendEvents: false in ldConfig) which will skip sending analytics events.
In summary, Supabase Edge Functions can integrate LaunchDarkly’s Node SDK now that Node compatibility is supported. With careful initialization and config, you can evaluate feature flags in your Deno-based functions. This enables use cases like feature-flagged logic in your backend (for example, gating an outgoing API call or altering a database operation based on a flag). Always test in a staging environment, and use LaunchDarkly’s best practices for serverless (e.g., reuse clients, consider shorter timeouts or polling mode) to ensure performance is optimal
launchdarkly.com
.
3. Syncing LaunchDarkly User Context with Supabase Auth (Dynamic User Context)
Context: In a single-page app using Supabase Auth, users can log in and out during a session. LaunchDarkly’s client-side SDK needs to know who the user is (the context) to serve the right flag variations, especially if you target flags based on user attributes or if you simply want consistent rollout (so each user gets their bucketed experience). We need to keep LaunchDarkly’s user context in sync with Supabase’s auth state. This typically involves using LaunchDarkly’s identify() method when a user logs in or out
launchdarkly.com
launchdarkly.com
. Initial Context on App Load: When your app first initializes LaunchDarkly, you might not have a Supabase user ready (especially if the user is not logged in, or if Supabase is still restoring a session). It’s common to start LaunchDarkly with an anonymous context. For example:
ts
Copy
Edit
const initialLDContext = { key: crypto.randomUUID(), anonymous: true };
// When initializing LDProvider or LDClient:
LDProvider clientSideID={ldClientId} context={initialLDContext} …
Here we use a random UUID as the key for an anonymous user. anonymous: true flags this context as not an identified user. This ensures that before login, the user is not recognized as a known account in LaunchDarkly, and won’t be counted in your users list beyond being an anonymous context. You could also use a stable device-based key (like hashed device ID) if you want the anonymous context to persist between sessions on the same device. Reacting to Auth State Changes: Supabase’s client library provides an onAuthStateChange listener for login/logout events
supabase.com
supabase.com
. We can use this to call LaunchDarkly’s identify() method. The identify() call tells the LaunchDarkly client to switch to a new user context and fetch flag values for that context
launchdarkly.com
. Here’s how you might implement it in a React app:
tsx
Copy
Edit
import { useLDClient } from 'launchdarkly-react-client-sdk';
import { supabase } from './supabaseClient';  // your Supabase init

function LaunchDarklyAuthSync() {
  const ldClient = useLDClient();  // get the LD client instance
  useEffect(() => {
    // Subscribe to Supabase auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!ldClient) return;  // LD not ready yet
      if (event === 'SIGNED_IN' && session?.user) {
        const { user } = session;
        // Prepare LaunchDarkly context for the logged-in user
        const ldContext = {
          key: user.id,  // unique user ID from Supabase (UUID)
          name: user.user_metadata?.full_name || user.email || 'User', 
          email: user.email,
          // You can include custom attributes:
          custom: { plan: user.app_metadata?.subscription_tier || 'free' }
        };
        ldClient.identify(ldContext, undefined, () => {
          console.log('LD identify: new user flags loaded');
        });
      } else if (event === 'SIGNED_OUT') {
        // Revert to anonymous (or a baseline context)
        const anonContext = { key: crypto.randomUUID(), anonymous: true };
        ldClient.identify(anonContext);
      }
    });
    return () => {
      // Cleanup the listener on component unmount
      authListener?.unsubscribe();
    };
  }, [ldClient]);

  return null; // This component doesn't render anything
}
You can include <LaunchDarklyAuthSync /> in your app (e.g. inside your main App component) to attach this effect. It uses Supabase’s listener to detect sign-in and sign-out events:
On SIGN IN: We construct a LaunchDarkly context from the Supabase user object. Typically, you’d use user.id (the Supabase UUID for the user) as the LaunchDarkly key – this uniquely identifies the user in LaunchDarkly
stackoverflow.com
. It’s also useful to pass attributes like email or name for targeting or just for easier identification in the LaunchDarkly dashboard. You can include any custom fields that your LaunchDarkly flags might use (for example, a “plan” attribute if certain flags target paid vs free users). Then we call ldClient.identify(newContext, undefined, callback)
launchdarkly.com
. The optional callback will execute after the flag values for the new user have been loaded, so you could, for instance, hide a loading spinner or trigger a re-render if not using the hooks.
On SIGN OUT: We call identify() with an anonymous context. This effectively resets the LaunchDarkly user. Any flags that were targeted to the specific user will now fall back to whatever the anonymous (or default) context should see. For example, if you had a flag that’s only on for logged-in users, after signing out the user should no longer see it – that will be the case because now the context is anonymous and likely not targeted.
Using LaunchDarkly React SDK Hooks: If you’re using hooks like useFlags or useLDFlags, these will automatically update when identify() is called. The LaunchDarkly React SDK ensures that when the context changes, new flag values are fetched and the React context/state updates. For example, any components using useFlag('your-flag-key') will re-render if that flag’s value changes due to a user context switch. Lifecycle Integration: The key is to call identify() at the right time:
After a successful login/signup (you might also call it after a magic link authentication, etc. – any event where a user becomes authenticated).
After logout or session expiration (to avoid the old user’s flags sticking around).
Supabase emits events like 'INITIAL_SESSION', 'TOKEN_REFRESHED', etc. You usually only need to handle 'SIGNED_IN' and 'SIGNED_OUT' for this purpose
supabase.com
supabase.com
. On initial page load, Supabase might emit INITIAL_SESSION if a user is already logged in (restoring from local storage). In that case, you’ll get a 'SIGNED_IN' event as well with the current session. Our handler above will catch that and identify the user on app startup. Pitfalls & Considerations:
Flicker on context switch: When you call identify(), the LaunchDarkly client will asynchronously fetch new flag values. During that brief moment, calls to useFlag might return the old values or defaults until the update arrives. In practice, the SDK handles this quickly, but be mindful if you see any UI flicker. Using the callback in identify to trigger a state update (or even wrapping parts of your UI in a condition that waits for ldClient?.initialized or similar) can help if needed. LaunchDarkly’s docs note that for single-page apps, calling identify updates flags for the new user immediately after fetching
launchdarkly.com
.
Preserving anonymous context traits: If you want to “associate” an anonymous user with a logged-in user (so LaunchDarkly knows they are the same person pre/post login for experimentation continuity), LaunchDarkly supports multi-context identify calls
launchdarkly.com
. For instance, you could do ldClient.identify({ kind: "multi", user: { ...loggedInUserContext }, device: { ...deviceContextUsedBefore } }). However, this is an advanced use-case. In most cases, a simple identify with the new user is sufficient.
Ensure ldClient is ready: If you call identify() too early (before the initial client is fully initialized), it may not do anything. In the code above, we check if (!ldClient) return; to ensure we have the LaunchDarkly client from the context. If you’re not using the React SDK’s useLDClient, make sure to only call identify after the client is initialized (ldClient.waitForInitialization() or using the on('ready') event).
Matching user IDs: Use a stable identifier for key. Supabase user IDs are great for this (they’re UUIDs). Do not use an email as the key (emails can change; use it as a separate attribute instead). LaunchDarkly treats the key as the primary identifier for the user context
stackoverflow.com
.
Logout handling: In the example, we generated a new random key on logout. This ensures the logged-out state is treated as a brand new anonymous context. Alternatively, you could use a constant like key: 'anon' for all logged-out users, but that might group all anonymous users as one in LaunchDarkly’s context list. Using a random key per session avoids any possible cross-user state. Mark it anonymous: true so LaunchDarkly doesn’t count each as a unique user for billing – LaunchDarkly typically treats anonymous users differently.
Flag defaults: After switching context, if any flags are not set for the new context, the SDK will return the default variation you specified in code. This is expected. Just ensure your code passes sensible default values into useFlag or variation calls.
By integrating the onAuthStateChange listener with LaunchDarkly’s identify(), your feature flags will seamlessly update as users log in or out. For example, a “premium feature” flag might be off for anonymous or free users, but on for a paying user – once the user logs in and has a plan: "pro", the flag value will change in the UI accordingly (perhaps showing a new section in your app). This dynamic context switching is crucial for SPAs where the page isn’t reloaded on login/logout.
4. LocalStorage Overrides for Development (LD_FLAG__* Pattern)
Context: During development, it’s often useful to force certain feature flags to a value locally, without going through LaunchDarkly’s UI or affecting teammates. For example, when working on a flagged feature, a developer might want to simulate “flag on” and “flag off” quickly. One pattern for this is using special keys in localStorage to override flag values in your local environment. We’ll discuss the LD_FLAG__<flagKey> convention and how to implement a safe override mechanism. Understanding the Pattern: The idea is to allow a developer to set a localStorage item like LD_FLAG__my-new-flag = true (string "true" or "false" etc.), and have the app prefer that value for the my-new-flag feature flag instead of whatever LaunchDarkly service returns. This can be done by wrapping LaunchDarkly’s flag lookup with a check for an override. Implementation – Utility Function: Create a utility that checks localStorage for an override before returning the LaunchDarkly-evaluated flag. For example:
ts
Copy
Edit
// ldOverrides.ts
export function getFlagWithOverride<T extends boolean | string | number>(
  ldClient: LDClient, flagKey: string, defaultVal: T
): T {
  const localStorageKey = `LD_FLAG__${flagKey}`;
  try {
    const storedVal = window.localStorage.getItem(localStorageKey);
    if (storedVal !== null) {
      // Attempt to parse JSON (to handle boolean and number stored as string)
      return JSON.parse(storedVal) as T;
    }
  } catch (e) {
    console.warn('Error parsing localStorage override for', flagKey, e);
    // If JSON parsing fails, we fallback to using the raw stored string (for e.g. string flags)
    const storedVal = window.localStorage.getItem(localStorageKey);
    if (storedVal !== null) {
      return storedVal as unknown as T;
    }
  }
  // If no override, return the actual flag value from LaunchDarkly
  return ldClient.variation(flagKey, defaultVal) as T;
}
Usage in development might look like:
ts
Copy
Edit
const flagValue = getFlagWithOverride(ldClient, 'my-new-flag', false);
If localStorage["LD_FLAG__my-new-flag"] = "true", this function will return true (a boolean, via JSON.parse) regardless of what LaunchDarkly’s servers say. If no override is set, it falls back to the real LaunchDarkly value (with defaultVal as the fallback if LD hasn’t loaded). Implementation – Custom Hook (React): If you use the React SDK’s hooks, you can wrap them. For example:
ts
Copy
Edit
import { useFlag } from 'launchdarkly-react-client-sdk';

export function useDevFlag<T extends boolean | string | number>(
  flagKey: string,
  defaultVal: T
): T {
  const ldValue = useFlag<T>(flagKey);  // get LaunchDarkly's current value
  const lsKey = `LD_FLAG__${flagKey}`;
  const [overrideValue, setOverrideValue] = useState<T | null>(null);

  useEffect(() => {
    // On mount, check if override is present
    const stored = window.localStorage.getItem(lsKey);
    if (stored !== null) {
      try {
        setOverrideValue(JSON.parse(stored));
      } catch {
        setOverrideValue(stored as unknown as T);
      }
    }
    // Watch for changes in localStorage via storage events (optional)
    const handler = (e: StorageEvent) => {
      if (e.key === lsKey) {
        if (e.newValue === null) {
          setOverrideValue(null);
        } else {
          try {
            setOverrideValue(JSON.parse(e.newValue));
          } catch {
            setOverrideValue(e.newValue as unknown as T);
          }
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [flagKey]);

  if (overrideValue !== null) {
    return overrideValue;
  }
  // If no override, use LaunchDarkly value or default
  return ldValue ?? defaultVal;
}
This hook useDevFlag can be used in place of useFlag. It checks localStorage once on mount (and optionally listens for any changes, so you can toggle via console and see it live). If an override exists, it returns that; otherwise it returns the LaunchDarkly value (or the default while LD initializes). This approach integrates with React’s state, ensuring that if you remove the override (e.g. via DevTools), the UI will reflect the actual flag again. Using the Override: To use this pattern:
Set a value in localStorage: Open your browser’s dev console (in your local dev environment) and set an item, e.g.:
js
Copy
Edit
localStorage.setItem('LD_FLAG__profile_ui_revamp', 'false');
You can also do this via the Application tab in Chrome, under Local Storage. This string will be what our code looks for.
Refresh or trigger effect: Depending on implementation, you might need to refresh the page or the code might pick it up dynamically. Our hook above picks up on mount or storage events.
Now the app will use false for profile_ui_revamp flag, regardless of what LaunchDarkly says (useful if LaunchDarkly would normally return true or if you are offline).
Clearing the override: Remove the key:
js
Copy
Edit
localStorage.removeItem('LD_FLAG__profile_ui_revamp');
Or set it to an empty string/null. Our code treats the absence of the key as no override. Clearing it will revert flag control back to LaunchDarkly.
Preventing Leaks to Production: It’s critical to ensure this override mechanism is only active in development mode. You don’t want end users to be able to tamper with flags by setting localStorage keys. Some safeguards:
Dev-mode check: Wrap the override logic so it only runs in development. For example, use if (import.meta.env.DEV) { ... } around the override code. In production builds, this could be compiled out entirely. If you’re not using Vite’s env, you can use process.env.NODE_ENV !== 'production' or a custom ENV flag.
Runtime check: Additionally, you could check the hostname (if your app’s running on localhost) or use a specific query param to enable overrides. But a compile-time removal (via env) is cleaner.
Do not ship debug code: Make sure any console logs or override listeners are stripped from production.
Separate config: Some teams implement an “Override Panel” that’s only available on a localhost or development build, where you can toggle flags. This is essentially a UI that sets these localStorage keys. That panel is not included in prod.
By following these precautions, even if a savvy user tried to set LD_FLAG__foo in their browser, your production app would ignore it. Utilities for Inspecting Overrides: Since overrides live in localStorage, they persist between page refreshes. It’s easy to forget you set one. A tip is to print out any detected overrides to the console on app start (in dev). For example:
ts
Copy
Edit
if (import.meta.env.DEV) {
  const entries = Object.entries(localStorage).filter(([k]) => k.startsWith('LD_FLAG__'));
  if (entries.length) {
    console.info('LD Overrides active:', entries);
  }
}
This will remind you which flags you forced. Additionally, you can provide a method to clear them all:
js
Copy
Edit
localStorage.keys().filter(k => k.startsWith('LD_FLAG__')).forEach(k => localStorage.removeItem(k));
(This could be in a debug menu or just a snippet to run in console.) Alternate Approaches: LaunchDarkly’s official stance for local development is often to use feature flag environments per developer (each dev has their own LD environment or project) so they can toggle flags freely without affecting others
github.com
. They also offer a CLI dev server which can load flag configs and apply overrides locally
launchdarkly.com
. Those are more heavyweight but worth knowing:
ld-dev-server: LaunchDarkly CLI can run a local relay that serves flag values, and it supports overriding specific flags for your session
launchdarkly.com
launchdarkly.com
.
Mocks in tests: For unit testing, LaunchDarkly provides test harnesses (like launchdarkly-js-test-sdk or mocking tools) – not directly relevant to development runtime, but you might see patterns like LDClient.bootstrapping options, which allow providing an initial set of flags
launchdarkly.com
. Bootstrapping could be another way to force values if you initialize the client with a predetermined flag set (though this would apply to all users of that session).
Pitfalls:
Forgetting an override on: You might be toggling a feature and think LaunchDarkly isn’t working – when in fact you left an override forcing it on/off. Always clear your overrides or use the logging technique above.
Data types: localStorage stores strings. Our code uses JSON.parse to handle booleans, numbers, or JSON objects. If your flag is a JSON type or multivariate, you can store a JSON string. For example, for a JSON flag:
js
Copy
Edit
localStorage.setItem('LD_FLAG__complex_flag', JSON.stringify({ "bgColor": "red" }));
The override code will parse it into an object. Just ensure the types line up.
Flag keys with unusual characters: Typically flag keys are simple lowercase with dashes/underscores. Our pattern LD_FLAG__${key} should be fine. If your flag key itself contains __ (rare in practice), ensure no collision or adjust the delimiter.
Not calling variation: In our utility, we called ldClient.variation(flagKey). If the LD client isn’t initialized yet, this might return default immediately. In the hook approach, we used useFlag which handles waiting internally. Just be mindful that your override logic doesn’t block LaunchDarkly initialization. It should check localStorage quickly and then get out of the way.
Using a localStorage override pattern can greatly speed up development and testing of feature-flagged code. It allows you to simulate various flag states in a local environment without needing to create test users or constantly flip flags in the LD dashboard. Just remember to remove or disable these in production, and coordinate with your team so everyone knows this is just a local dev tool (not an actual feature flag control for end users).
5. Managing Dependent Feature Flags (Flag Dependency Chains)
Context: Often, one feature flag’s availability is logically tied to another. For example, you might have a large feature “Profile UI Revamp” (profile_ui_revamp) which includes a sub-feature “Wallet Widget” (wallet_ui). You wouldn’t want the Wallet to show unless the Profile Revamp is enabled (it might rely on new UI components only present in the revamp). Managing such dependencies requires careful coordination so that you don’t accidentally expose a sub-feature or break functionality when one flag is on and the other off. LaunchDarkly Prerequisites (Flag Dependencies): LaunchDarkly has first-class support for dependent flags via prerequisite flags
launchdarkly.com
launchdarkly.com
. This feature lets you declare in LaunchDarkly that Flag B (e.g. wallet_ui) depends on Flag A (profile_ui_revamp). When Flag B is evaluated, LaunchDarkly will automatically ensure Flag A is true for that user; if not, Flag B will serve as “off” (or a specified variation). In other words, the logic becomes: if Profile Revamp is on AND Wallet UI is on, then show wallet; otherwise no wallet
launchdarkly.com
. How to Configure Prerequisites: In LaunchDarkly’s flag settings UI, go to the dependent flag’s Targeting rules and find the “Prerequisites” section. For wallet_ui, you would add a prerequisite: Flag: profile_ui_revamp must be true (assuming profile_ui_revamp is a boolean flag). Save this. Now LaunchDarkly will enforce that relationship for you. Under the hood, if you call variation("wallet_ui") for a user, LaunchDarkly will first evaluate profile_ui_revamp for that user. If profile_ui_revamp is off (or false), wallet_ui will immediately return false (and in the LaunchDarkly dashboard, you’ll see it marked as “prerequisite not met”)
launchdarkly.com
. If profile_ui_revamp is true for that user, then LaunchDarkly proceeds to evaluate wallet_ui’s own targeting to decide true/false. This happens entirely within the LaunchDarkly SDK/service – your code doesn’t need an explicit if-check; you can still just do if(walletFlag) { ... }. Important: Prerequisite flags and dependent flags must reside in the same LaunchDarkly project
launchdarkly.com
. And the prerequisite feature is available depending on your LaunchDarkly plan (some lower-tier plans might not include it)
launchdarkly.com
. Frontend (or Backend) Guardrails: Even if you use LaunchDarkly prerequisites, it’s wise to also structure your code defensively:
tsx
Copy
Edit
const showProfileRevamp = useFlag('profile_ui_revamp');
const showWallet = useFlag('wallet_ui');
{ showProfileRevamp && showWallet && <WalletWidget/> }
In the above JSX, even if someone misconfigured the flags, the WalletWidget will only render if both flags are true. This double-check in the UI aligns with the logical dependency. If LaunchDarkly prerequisites are working, showWallet will never be true when showProfileRevamp is false (because LD would return false for wallet_ui if prerequisite fails), so the check is just an extra safety net. But it can prevent accidents if the dependency wasn’t set or if using a different flag system. Rollout Coordination Strategies:
Feature Bundling: If profile_ui_revamp is a big umbrella feature with multiple sub-flags (like wallet, new profile sections, etc.), you can use it as a kill switch/master flag (the “keystone” flag)
launchdarkly.com
launchdarkly.com
. All related flags list profile_ui_revamp as a prerequisite. This means you can roll out the entire revamp in one go by turning on the master flag, and only the sub-features that are individually enabled will show. Teams can work on sub-features behind their own flags, test them in isolation (with master flag on in test environments), but in production the master flag off ensures none leak out until the big reveal.
Sequential Rollouts: If you plan a phased rollout – for instance, first enable the Profile Revamp (flag A) to users, and only later enable the Wallet (flag B) – prerequisites help avoid inconsistent states. You could first release profile_ui_revamp to 100% (everyone sees new profile page, which perhaps has an empty spot where wallet would go). Then once stable, enable wallet_ui. Because wallet had profile as a prereq, during the time profile was on and wallet off, wallet never showed (even if someone inadvertently turned it on for a segment, the prereq off would stop it). After profile is fully ramped, you ramp wallet_ui as a second stage.
Atomic Release of Multiple Flags: If you want to release a set of features all at once, using a master flag as prereq for all and then toggling just the master flag gives an all-or-nothing release. E.g. profile revamp includes new profile page, wallet widget, and a new settings menu – all behind their own flags. By gating them under profile_ui_revamp, you ensure the end user doesn’t see a partial revamp. When you’re ready, enable profile_ui_revamp for a % of users; those users will then get whichever sub-flags are on. (If a sub-flag is off, that part just stays hidden – you might leave some sub-flags off if a sub-feature isn’t ready, but the page still loads because maybe the wallet section is just blank or not rendered.)
Targeting rules vs Code logic: Prefer letting LaunchDarkly handle flag relationships via prerequisites or targeting rules rather than duplicating a lot of logic in code. LaunchDarkly’s evaluation is consistent across platforms – if you have backend code also checking wallet_ui, it will also respect the prereq automatically if using the SDK. Keeping the logic in LD means product managers or engineers can adjust targeting without changing code (for example, if we decided wallet should be visible to beta testers even if profile revamp is off, we could override in LD by temporarily removing prereq for those users – though that’s an edge case). If logic is purely in code (like an if chain of flags), any change requires a redeploy.
Ordering of releases: If not using prerequisites, you must manually coordinate: ensure the parent feature is enabled before any child. In our example, turning on wallet_ui while profile_ui_revamp is off could confuse users or break UI (wallet component might assume new profile layout). So you’d document that dependency and maybe even enforce it by convention. Some teams use naming conventions or automation – e.g. they won’t let wallet_ui be on in production if profile_ui_revamp is off (could be enforced via LaunchDarkly tags or a script). This is essentially reimplementing what prerequisites give you automatically.
Avoid deep chains if possible: While LaunchDarkly allows multiple levels (A is prereq for B, B for C, etc.), this can get hard to manage. It’s usually better to have one master flag with many dependents (a star topology) rather than a long linked chain. A deep chain might make it unclear what’s controlling what if you revisit after months. Use descriptions in the flag settings to note dependencies. LaunchDarkly’s UI does show the prereq relationship in both flags’ settings (e.g., on the wallet_ui flag page, it will list profile_ui_revamp as a prereq; on the profile_ui_revamp page, it will list that it’s a prereq for wallet_ui).
Testing dependent flags: In your test or QA environment, you might often have all flags on to see full functionality. It’s fine for the prerequisite logic to be always true there. Just be sure to test scenarios where parent is off and child is on (to ensure child indeed doesn’t activate – LaunchDarkly covers that, but your UI should handle the absence gracefully). Also test parent on, child off (the sub-feature is hidden, which should be okay).
Cleanup and Archival: When a master flag is finally permanently on (feature fully launched), you might retire the sub-flags or vice versa. Order matters: if you archive the master flag first, make sure to remove it from prereqs of children (or archive children too). LaunchDarkly will warn you if you try to archive a flag that others depend on
launchdarkly.com
dzone.com
. Clean up technical debt by removing flag checks in code for retired flags as well.
Example Scenario: Profile Revamp gating Wallet UI. Let’s say initially profile_ui_revamp is off for all users, wallet_ui is off for all. We enable some internal testing: turn profile_ui_revamp on for our team (via a user segment rule), and also turn wallet_ui on for our team. Because of the prereq, both flags “On for team” results in both working for us. To all other users, profile is off so they see old profile page, wallet automatically off. Next, we gradually rollout profile_ui_revamp to 50% of users over a week (LaunchDarkly supports percentage rollouts). Throughout this, wallet_ui flag could even be set to 100% on globally, but until a user is in the 50% getting profile revamp, they won’t see wallet (prereq stops it). Once profile_ui_revamp goes 100%, suddenly all those users also have wallet (since it was globally on). If we instead left wallet_ui off globally, then when profile goes 100%, wallet still wouldn’t show because it’s off. We could then do a second rollout for wallet_ui – say 10%, 50%, 100%. That second rollout effectively happens within the population that already has profile. This staggering helps isolate issues: if something goes wrong with profile revamp, we know wallet wasn’t a factor yet, and vice versa. LaunchDarkly Targeting Rules vs Frontend Logic: LaunchDarkly can sometimes model complex dependencies using targeting rules and segments. For instance, one might be tempted to say “if user.email contains @mycompany.com AND flag X is on then serve true” as a rule on flag Y. However, that quickly becomes hard to maintain. It’s cleaner to use the prerequisite or to just handle combined logic in code if absolutely necessary. A simple pattern in code is to combine flags as shown above (render component if both true). That might be sufficient for UI elements. For non-UI logic, you could similarly nest conditions or create a derived boolean. Some teams create a composed flag in code, like:
ts
Copy
Edit
const isWalletVisible = profileFlag && walletFlag;
and use isWalletVisible throughout. This is fine, but remember that any analytics or event tracking tied to wallet_ui flag in LaunchDarkly will consider it “off” whenever the prereq is off (which might align better with how you reason about the feature release). Common Pitfalls:
Mismatched targeting: If profile_ui_revamp is on for a user but wallet_ui was never targeted to that user (e.g., maybe wallet flag was left off), the user sees profile without wallet – which might be okay if wallet is optional. But if wallet is crucial, ensure you plan the targeting of sub-flags in concert with the master flag’s rollout. Usually you’d leave sub-flags off until the master is broadly on, unless they’re ready together.
Overlapping flags without prereq: If you forget to set the prereq and just rely on code &&, someone might accidentally toggle wallet_ui on for a segment in LD (not realizing the code gating), which could do nothing in UI but LaunchDarkly will count it as served = true. This could confuse analytics or metrics. Prerequisites prevent such config mistakes by outright not allowing the dependent flag to go true when prereq false
launchdarkly.com
.
Plan changes: If you decide to decouple the features (maybe now wallet should appear in old profile too), you’d have to remove the prerequisite in LD and update code if you had combined logic. Keep an eye on requirement changes; feature dependencies often evolve.
Documentation: Document in your code and LaunchDarkly flag descriptions that “wallet_ui requires profile_ui_revamp”. This helps future maintainers. LaunchDarkly’s UI shows a dependent flag list which is helpful for this
launchdarkly.com
.
Architectural Pattern – Flag Hierarchy: Summarizing, you can treat profile_ui_revamp as a parent flag and wallet_ui as a child flag. The parent flag’s state gates the child. This hierarchy can be one-to-many (one parent, many children) which is common for big feature launches (LaunchDarkly calls it “feature bundling” when many flags are tied to one big launch
launchdarkly.com
). One can also have many-to-one (flag A and B must be true to enable C) – LaunchDarkly doesn’t support multiple prerequisites directly on one flag, but you could nest (A as prereq for C and B as prereq for C as well; all prereqs must pass). More often, a single prereq flag is enough to represent the combined gate. In practice, use LaunchDarkly prerequisites for coordinating dependent flags whenever available – it offloads the logic to LaunchDarkly, ensures consistency across front and back end, and prevents user exposure mistakes. Back it up with sound application logic (don’t assume a sub-feature works without its parent UI) and a clear rollout plan. This way, you maintain control and flexibility in releasing complex, multi-flag features with confidence. 



RESEARCH SET 2

LaunchDarkly Integration for React + Vite, Supabase and Flag Dependencies (High‑Priority Topics)
1 React + Vite integration
Use Vite‑friendly environment variables
Vite exposes only variables prefixed with VITE_. When Vite builds your project it replaces references such as import.meta.env.VITE_SOME_KEY with literal values. Other variables (e.g., DB_PASSWORD) are not exposed to client code
vite.dev
. Always define your LaunchDarkly client‑side key as VITE_LD_CLIENT_ID (or similar) in .env, and read it using import.meta.env.VITE_LD_CLIENT_ID in your code.

Do not store sensitive keys in the client bundle. The LaunchDarkly client‑side SDK uses a client‑side identifier that is safe to expose (it only allows read‑only flag evaluations). Keep server‑side keys in your backend (e.g., Supabase Edge Function) and never commit them to public code.

Sample Vite/React integration
The LaunchDarkly React SDK provides an LDProvider component. In a Vite project you pass the client‑side ID from import.meta.env:

tsx
Copy
Edit
// src/main.tsx (Vite + React + LaunchDarkly)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import App from './App.tsx';

// read the client ID from the environment or fall back to a placeholder
const clientSideID = import.meta.env.VITE_CLIENT_SIDE_ID ?? 'your-client-side-id';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LDProvider clientSideID={clientSideID}>
      <App />
    </LDProvider>
  </StrictMode>,
);
This pattern was taken from LaunchDarkly’s Vite example repository
raw.githubusercontent.com
. The client ID must be known at build time; you cannot change it at runtime without rebuilding the bundle.

Handling environment variables in Docker
Vite replaces import.meta.env.VITE_* at build time, so changing environment variables at container runtime has no effect. To avoid rebuilding for each environment you can use placeholders during the build and replace them at startup. A practical workflow is:

In .env.production define a placeholder (e.g., VITE_LD_CLIENT_ID=PREFIX_LD_CLIENT_ID). During the vite build step this placeholder is baked into your bundle.

Write a small script (env.sh) that runs at container startup. It searches your built files for the placeholder and replaces it with the real value from environment variables (for example using sed).

Copy the script into the container and run it before starting the web server.

A DEV Community article on dynamic environment variables explains that Vite’s build process locks in values; runtime injection requires replacing placeholders during container startup
dev.to
. The article includes an example Dockerfile that copies the built app, copies env.sh, and executes it before starting Nginx
dev.to
. This “build once, inject later” approach allows the same image to be used across staging and production.

Common pitfalls
Forgetting the VITE_ prefix – non‑prefixed variables will be undefined at runtime
vite.dev
.

Changing the client‑side ID after the app is built – you must rebuild or use runtime placeholder injection.

Exposing sensitive keys – only use client‑side IDs in front‑end code; keep server keys in secure back‑end services.

2 Supabase Edge Functions and LaunchDarkly Server SDK
Using Node modules in Supabase Edge Functions
Supabase Edge Functions run in a Deno‑based runtime. Recent updates allow them to import npm packages using the npm: spec
supabase.com
. In theory this means you can import LaunchDarkly’s Node server SDK:

ts
Copy
Edit
// supabase/functions/flags.ts
// Deno with npm support (available in Supabase Edge Runtime)
import ld from 'npm:@launchdarkly/node-server-sdk';

const sdkKey = Deno.env.get('LD_SDK_KEY');
const client = ld.init(sdkKey);

// Evaluate a flag for a given user/context
export const handler = async (req: Request): Promise<Response> => {
  await client.waitForInitialization();
  const context = { kind: 'user', key: 'user-key-123', email: 'user@example.com' };
  const enabled = await client.variation('wallet_ui', context, false);

  return new Response(JSON.stringify({ wallet_ui: enabled }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
However, the Node SDK is designed for Node.js and may not work in Deno without polyfills. You must test this pattern in your environment. Another option is to use LaunchDarkly’s Cloudflare server SDK (@launchdarkly/cloudflare-server-sdk), which is intended for edge runtimes; it may work in Deno with the npm: spec. If neither SDK functions correctly, call LaunchDarkly’s REST API directly.

Calling LaunchDarkly’s REST API from Deno
The LaunchDarkly REST API can evaluate flags for a context. A Deno example (from a community gist) uses fetch to request flag values:

ts
Copy
Edit
import { serve } from 'https://deno.land/std@0.114.0/http/server.ts';
import { DOMParser } from 'https://esm.sh/linkedom';

async function getFlagValue(project: string, environment: string, key: string) {
  // Use a personal API token with "Reader" permission stored in the environment
  const token = Deno.env.get('LAUNCHDARKLY_API');
  const response = await fetch(
    `https://app.launchdarkly.com/api/v2/flags/${project}/${key}?env=${environment}`,
    { headers: { Authorization: token } }
  );
  const flagData = await response.json();
  // Return the on‑variation value if the flag is on, else the off‑variation value
  if (flagData.environments[environment].on) {
    return flagData.variations[flagData.defaults.onVariation].value;
  }
  return flagData.variations[flagData.defaults.offVariation].value;
}

serve(async () => {
  const headerText = await getFlagValue('default', 'production', 'header-text');
  // … return a response based on the flag
});
This gist demonstrates how to fetch flag metadata and extract the flag value using a LaunchDarkly API token
gist.githubusercontent.com
. When using the REST API:

Use a LaunchDarkly API token (not a client‑side ID) and store it in Supabase’s environment variables.

Because the REST API returns the full flag definition, you must select the proper variation and consider prerequisites yourself.

The API has rate limits; caching results in Supabase’s global cache or a KV store will improve performance.

Initializing and evaluating flags with the Node SDK
If Node compatibility works, the server SDK should be initialized once and reused. The LaunchDarkly docs emphasize that LDClient must be a singleton per project
launchdarkly.com
. To evaluate a flag:

ts
Copy
Edit
// Example using @launchdarkly/node-server-sdk
const ld = require('@launchdarkly/node-server-sdk');
const client = ld.init('sdk-key-123abc');
await client.waitForInitialization();
const context = { kind: 'user', key: 'user-key-123abc', name: 'Sandy' };
const variation = await client.variation('wallet_ui', context, false);
Recommended pattern for Supabase Edge Functions
Store the LaunchDarkly SDK key (server key) and other secrets as environment variables in your Supabase project.

Initialize the LaunchDarkly client once at module scope and await waitForInitialization() in the handler.

Read the Supabase user ID or claims from the JWT and construct a LaunchDarkly context (e.g., key, email, subscription plan).

Return flag values along with your API response.

Consider caching results in a global variable or Supabase’s in‑memory cache to reduce API calls.

3 Dynamic user context with Supabase Auth
When to call identify()
The LaunchDarkly client‑side SDK operates on a single context at a time. Use identify() to change the context whenever the user logs in, logs out or when you gain additional context (for example, device + user + organization). The docs explain that calling identify() tells the client to change the current context and fetch new flag values
launchdarkly.com
. You can also pass a multi‑context containing device, user and organization objects to associate them
launchdarkly.com
.

Listening to Supabase Auth events
Supabase provides an onAuthStateChange method that invokes a callback whenever the authentication state changes. In a React example, the callback updates the component state:

tsx
Copy
Edit
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setSession(session);
    }
  );
  return () => subscription.unsubscribe();
}, []);
This pattern from LogRocket’s tutorial shows how to obtain the current session and subscribe to auth changes
blog.logrocket.com
.

Updating LaunchDarkly when the user logs in or out
To synchronize LaunchDarkly with Supabase Auth:

Initialize the LaunchDarkly client with an anonymous or device context when the app loads.

Subscribe to auth changes using supabase.auth.onAuthStateChange.

When a user logs in, construct a new LaunchDarkly context (for example, { kind: 'user', key: user.id, email: user.email }).

Call ldClient.identify(newContext), then update your local state when the promise resolves. The docs show that the React SDK exposes useLDClient() which returns the client and that you call identify() to update flags
launchdarkly.com
.

When the user logs out, call identify() with an anonymous or device context to revert.

Example integration:

tsx
Copy
Edit
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useLDClient } from 'launchdarkly-react-client-sdk';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function AuthSync() {
  const ldClient = useLDClient();

  useEffect(() => {
    // subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user = session.user;
          const context = { kind: 'user', key: user.id, email: user.email };
          await ldClient.identify(context);
        } else if (event === 'SIGNED_OUT') {
          // revert to anonymous context
          await ldClient.identify({ kind: 'device', key: 'anonymous' });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [ldClient]);

  return null;
}
This approach ensures that feature flags are re‑evaluated when Supabase Auth state changes, giving each user the correct flag variations.

4 Local development override pattern
Caching vs overriding
The LaunchDarkly JavaScript SDK supports a bootstrap option where initial flags can be taken from localStorage
launchdarkly.com
. However, this is meant for caching the last known flag values to avoid network calls and does not provide a mechanism for manually overriding flags.

Implementing manual overrides with localStorage
Developers often want to force particular flag values when developing or writing end‑to‑end tests. A GitHub discussion describes a practical pattern: store overrides in a JSON object in localStorage and merge them with the flags returned by LaunchDarkly
github.com
. The key points are:

Define a localStorage key (e.g., override-flags) containing a JSON object mapping flag names to override values:

js
Copy
Edit
// Developer sets override flags in the browser console
localStorage.setItem('override-flags', JSON.stringify({
  myFlagName: true,
  anotherFlag: false
}));
Wrap the LaunchDarkly useFlags hook to merge overrides with real flags:

ts
Copy
Edit
import { useFlags as useLDFlags } from 'launchdarkly-react-client-sdk';
import { useState } from 'react';

export const useFlags = () => {
  // read overrides from localStorage
  const getManualOverrides = () => {
    try {
      return JSON.parse(localStorage.getItem('override-flags') || '{}');
    } catch {
      return {};
    }
  };

  const [overrides, setOverrides] = useState(getManualOverrides());

  // update overrides if localStorage changes (another tab)
  window.onstorage = () => setOverrides(getManualOverrides());

  const ldFlags = useLDFlags();

  // merge LaunchDarkly flags with overrides; overrides take precedence
  return { ...ldFlags, ...overrides };
};
Use the wrapper hook in your components instead of the built‑in useFlags hook.

The GitHub comment emphasises that this pattern is for local development; LaunchDarkly recommends assigning each developer their own environment for manual toggling
github.com
. Avoid using manual overrides in production.

5 Feature flag dependency chains
Understanding prerequisites and dependent flags
LaunchDarkly supports prerequisite flags, allowing one flag to depend on another. A dependent flag does not evaluate if its prerequisite is off. The feature flag hierarchy guide explains that you can configure dependencies to ensure rollout order; for example, a wallet_ui flag might depend on a profile_ui_revamp flag. If profile_ui_revamp is off, the wallet_ui flag is not evaluated
launchdarkly.com
.

In LaunchDarkly’s UI, you can add a prerequisite when editing a flag. The dependent flag then references the prerequisite flag and the variation it must return for the dependent flag to proceed. Prerequisites can be chained; LaunchDarkly evaluates them in order
launchdarkly.com
. This ensures that complex rollouts happen in a controlled sequence.

Coordinated rollout pattern
Create the prerequisite flag (profile_ui_revamp) and the dependent flag (wallet_ui). In the LaunchDarkly dashboard, set wallet_ui’s prerequisite to profile_ui_revamp and choose the variation (usually true) that enables wallet_ui.

Roll out the prerequisite flag using targeting rules or percentage rollouts until you are satisfied with the performance of the core feature.

Roll out the dependent flag. Only users who already have profile_ui_revamp will see the wallet_ui changes, preventing broken experiences if the profile UI isn’t enabled.

Implement defensive checks in code to ensure both flags are on before showing the feature:

ts
Copy
Edit
const flags = useFlags();
if (flags.profile_ui_revamp && flags.wallet_ui) {
  return <NewWalletComponent />;
}
return <OldWalletComponent />;
This pattern can be extended to multiple levels. When the prerequisite is permanently rolled out and stable, you can remove the dependency and eventually clean up the flags.

Best practices
Use clear naming to reflect hierarchical relationships (e.g., profile_ui_revamp → wallet_ui).

Document dependencies so team members know why certain flags are combined.

Plan cleanup to avoid long‑lived flags; once features are fully rolled out, remove flags or set them permanently on/off.

Summary
These high‑priority integration topics bridge LaunchDarkly’s documentation gaps for modern stacks:

For React + Vite, prefix environment variables with VITE_, read them via import.meta.env, and use runtime placeholder injection in Docker to avoid multiple builds
vite.dev
dev.to
.

Supabase Edge Functions can import Node modules using the npm: spec and may support the LaunchDarkly Node server SDK, but falling back to the REST API is reliable
gist.githubusercontent.com
. Always store server keys in environment variables and reuse a singleton client
launchdarkly.com
.

Use Supabase’s onAuthStateChange to detect login/logout events and call LaunchDarkly’s identify() to update the context
launchdarkly.com
blog.logrocket.com
.

For local development, implement manual flag overrides by reading override-flags from localStorage and merging them with real flags
github.com
; do not use this pattern in production.

Prerequisite flags enable dependency chains, ensuring that features like wallet_ui are only evaluated when profile_ui_revamp is enabled
launchdarkly.com
. Configure dependencies in LaunchDarkly and check multiple flags in your code.

These strategies enable a robust feature‑flagging system for your React + Vite + Supabase + Docker architecture.