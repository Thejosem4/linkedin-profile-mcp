# Setup OAuth for LinkedIn API

To use the LinkedIn Profile MCP Server, you need to create a LinkedIn app and obtain OAuth 2.0 credentials.

## Step 1: Create a LinkedIn App

1. Go to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
2. Click **Create app**.
3. Fill in the required details:
   - App Name
   - LinkedIn Page (you must associate the app with a company page)
   - Privacy Policy URL
   - App Logo
4. Agree to the terms and click **Create app**.

## Step 2: Request API Products

1. In your app dashboard, go to the **Products** tab.
2. Request access to the following products:
   - **Sign In with LinkedIn using OpenID Connect** (for basic profile info)
   - **Share on LinkedIn** (for posting updates)
   - Any other products required for full profile editing (Note: LinkedIn restricts access to full profile editing APIs. You may need to apply for specific partner programs).

## Step 3: Configure Auth Settings

1. Go to the **Auth** tab.
2. Under **OAuth 2.0 settings**, add your authorized redirect URLs for local development:
   - `http://localhost:3000/callback` (or whichever port your local callback server uses)
3. Note your **Client ID** and **Client Secret**.

## Step 4: Configure the MCP Server

1. Create a `.env` file in the root of the project.
2. Add your credentials:
   ```env
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_client_secret
   LINKEDIN_REDIRECT_URI=http://localhost:3000/callback
   ```

The server uses Keytar to securely store the access and refresh tokens after the initial OAuth flow.
