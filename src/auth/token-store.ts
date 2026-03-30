import keytar from 'keytar';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { UserContext } from '../types.js';

const SERVICE_NAME = 'linkedin-profile-mcp';
const ACCOUNT_NAME = 'default';
const FALLBACK_DIR = path.join(os.homedir(), '.linkedin-profile-mcp');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'tokens.json');

export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export class TokenStore {
  /**
   * Saves the token data securely.
   * Tries keytar first, then falls back to a local file.
   */
  async saveTokens(tokens: TokenData): Promise<void> {
    try {
      await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, JSON.stringify(tokens));
    } catch (error) {
      console.warn('⚠️ Failed to save to keytar, falling back to local file:', error);
      await this.saveToFallback(tokens);
    }
  }

  /**
   * Retrieves the token data.
   * Tries keytar first, then falls back to a local file.
   */
  async getTokens(): Promise<TokenData | null> {
    try {
      const stored = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
      if (stored) {
        return JSON.parse(stored) as TokenData;
      }
    } catch (error) {
      console.warn('⚠️ Failed to read from keytar, checking local file:', error);
    }

    return this.getFromFallback();
  }

  /**
   * Clears the stored tokens.
   */
  async clearTokens(): Promise<void> {
    try {
      await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
    } catch (error) {
      console.warn('⚠️ Failed to delete from keytar:', error);
    }

    try {
      await fs.unlink(FALLBACK_FILE);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  }

  private async saveToFallback(tokens: TokenData): Promise<void> {
    try {
      await fs.mkdir(FALLBACK_DIR, { recursive: true });
      await fs.writeFile(FALLBACK_FILE, JSON.stringify(tokens, null, 2), 'utf-8');
    } catch (error) {
      console.error('❌ Failed to save tokens to fallback file:', error);
      throw error;
    }
  }

  private async getFromFallback(): Promise<TokenData | null> {
    try {
      const content = await fs.readFile(FALLBACK_FILE, 'utf-8');
      return JSON.parse(content) as TokenData;
    } catch (error) {
      return null;
    }
  }

  /**
   * Checks if the token is expired or will expire soon (within 5 minutes).
   */
  isTokenExpired(tokens: TokenData): boolean {
    const BUFFER_MS = 5 * 60 * 1000; // 5 minutes
    return Date.now() + BUFFER_MS > tokens.expiresAt;
  }
}

export const tokenStore = new TokenStore();
