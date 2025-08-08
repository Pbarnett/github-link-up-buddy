# Fix Google OAuth Client - Step by Step

## The Issue
Your OAuth client ID `209526864602-b7g6tlsftft5srildqrv7ulb4ll2v3smk.apps.googleusercontent.com` is returning "OAuth client was not found" error.

## Solution: Create New OAuth Client

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project (or create a new one)

### 2. Navigate to Credentials
- Go to **APIs & Services → Credentials**
- Click **"+ CREATE CREDENTIALS"**
- Select **"OAuth client ID"**

### 3. Configure OAuth Client
- **Application type**: Web application
- **Name**: GitHub Link Up Buddy (or any name you prefer)

### 4. Add Authorized Redirect URIs
Add these exact URIs:
```
http://127.0.0.1:54321/auth/v1/callback
http://localhost:3000/auth/callback
http://localhost:54321/auth/v1/callback
```

### 5. Add Authorized JavaScript Origins (if needed)
```
http://127.0.0.1:54321
http://localhost:3000
http://localhost:54321
```

### 6. Copy the New Credentials
After creation, copy:
- **Client ID**: (something like `123456789-abc123.apps.googleusercontent.com`)
- **Client Secret**: (something like `GOCSPX-xyz123`)

### 7. Update Your Environment Files
Update both `.env` and `.env.local` with the new credentials:

```bash
# Replace in .env
GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=YOUR_NEW_CLIENT_SECRET

# Replace in .env.local
GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=YOUR_NEW_CLIENT_SECRET
```

### 8. Restart Supabase
```bash
npx supabase stop
npx supabase start
```

### 9. Test the Fix
```bash
node test-oauth-config.cjs
```

## Alternative Quick Fix (if you have access to the original project)
If you can access the original Google Cloud project:
1. Check if the OAuth client was disabled
2. Re-enable it
3. Verify the redirect URIs are correct
4. Check if there are any quota/billing issues

## Note
The original OAuth client ID might have been:
- Deleted accidentally
- Disabled due to quota limits
- Removed due to project billing issues
- Part of a project that was deleted

This is common when working with development environments.
