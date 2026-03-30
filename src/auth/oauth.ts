import axios from 'axios';
import express from 'express';
import { Server } from 'node:http';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { SCOPES_STRING } from './scopes.js';
import { tokenStore, TokenData } from './token-store.js';

const AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

export class OAuthManager {
  private state: string;

  constructor() {
    this.state = crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generates the LinkedIn OAuth 2.0 authorization URL.
   */
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      state: this.state,
      scope: SCOPES_STRING,
    });

    return `${AUTH_URL}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   */
  async handleCallback(code: string): Promise<TokenData> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    });

    const response = await axios.post(TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const tokens: TokenData = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000,
    };

    await tokenStore.saveTokens(tokens);
    return tokens;
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  async refreshToken(): Promise<TokenData | null> {
    const tokens = await tokenStore.getTokens();
    if (!tokens || !tokens.refreshToken) {
      return null;
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    });

    try {
      const response = await axios.post(TOKEN_URL, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      const newTokens: TokenData = {
        accessToken: access_token,
        refreshToken: refresh_token || tokens.refreshToken,
        expiresAt: Date.now() + expires_in * 1000,
      };

      await tokenStore.saveTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Gets a valid access token, refreshing it if necessary.
   */
  async getValidToken(): Promise<string | null> {
    let tokens = await tokenStore.getTokens();
    if (!tokens) {
      return null;
    }

    if (tokenStore.isTokenExpired(tokens)) {
      tokens = await this.refreshToken();
    }

    return tokens?.accessToken || null;
  }

  /**
   * Starts a temporary express server to handle the OAuth callback.
   * Returns a promise that resolves with the authorization code.
   */
  async startCallbackServer(): Promise<string> {
    return new Promise((resolve, reject) => {
      const app = express();
      let server: Server;

      const url = new URL(config.redirectUri);
      const port = url.port || '3000';
      const path = url.pathname || '/';

      app.get(path, async (req, res) => {
        const { code, state, error, error_description } = req.query;

        if (error) {
          res.status(400).send(`Authentication error: ${error_description}`);
          server.close();
          reject(new Error(`OAuth error: ${error_description}`));
          return;
        }

        if (state !== this.state) {
          res.status(400).send('Invalid state parameter');
          server.close();
          reject(new Error('Invalid state parameter'));
          return;
        }

        if (typeof code !== 'string') {
          res.status(400).send('Invalid code parameter');
          server.close();
          reject(new Error('Invalid code parameter'));
          return;
        }

        res.send('Authentication successful! You can close this window.');
        server.close();
        resolve(code);
      });

      server = app.listen(port, () => {
        console.log(`🚀 Callback server listening on port ${port}`);
        console.log(`🔗 Please visit: ${this.generateAuthUrl()}`);
      });

      server.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const oauthManager = new OAuthManager();
