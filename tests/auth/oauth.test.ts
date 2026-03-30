import { jest } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OAuthManager } from '../../src/auth/oauth.js';
import { tokenStore } from '../../src/auth/token-store.js';

// Mock keytar
jest.mock('keytar', () => ({
  setPassword: jest.fn(),
  getPassword: jest.fn(),
  deletePassword: jest.fn(),
}));

// Mock fs
jest.mock('node:fs/promises', () => ({
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  readFile: jest.fn(),
  unlink: jest.fn(),
}));

describe('OAuthManager', () => {
  let oauthManager: OAuthManager;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    oauthManager = new OAuthManager();
    mockAxios = new MockAdapter(axios as any);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should generate a valid auth URL', () => {
    const url = oauthManager.generateAuthUrl();
    expect(url).toContain('https://www.linkedin.com/oauth/v2/authorization');
    expect(url).toContain('response_type=code');
    expect(url).toContain('client_id=');
    expect(url).toContain('scope=');
    expect(url).toContain('state=');
  });

  it('should handle callback and exchange code for tokens', async () => {
    const mockTokens = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
    };

    mockAxios.onPost('https://www.linkedin.com/oauth/v2/accessToken').reply(200, mockTokens);

    const saveTokensSpy = jest.spyOn(tokenStore, 'saveTokens').mockResolvedValue(undefined);

    const tokens = await oauthManager.handleCallback('mock-code');

    expect(tokens.accessToken).toBe('mock-access-token');
    expect(tokens.refreshToken).toBe('mock-refresh-token');
    expect(tokens.expiresAt).toBeGreaterThan(Date.now());
    expect(saveTokensSpy).toHaveBeenCalled();
  });

  it('should refresh token when expired', async () => {
    const mockOldTokens = {
      accessToken: 'old-access-token',
      refreshToken: 'old-refresh-token',
      expiresAt: Date.now() - 1000,
    };

    const mockNewTokens = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token',
      expires_in: 3600,
    };

    jest.spyOn(tokenStore, 'getTokens').mockResolvedValue(mockOldTokens);
    mockAxios.onPost('https://www.linkedin.com/oauth/v2/accessToken').reply(200, mockNewTokens);
    const saveTokensSpy = jest.spyOn(tokenStore, 'saveTokens').mockResolvedValue(undefined);

    const tokens = await oauthManager.refreshToken();

    expect(tokens?.accessToken).toBe('new-access-token');
    expect(saveTokensSpy).toHaveBeenCalled();
  });

  it('should return null if no refresh token is available', async () => {
    jest.spyOn(tokenStore, 'getTokens').mockResolvedValue({
      accessToken: 'token',
      expiresAt: Date.now(),
    });

    const tokens = await oauthManager.refreshToken();
    expect(tokens).toBeNull();
  });
});
