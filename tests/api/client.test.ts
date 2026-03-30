import { jest } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LinkedInClient } from '../../src/api/client.js';
import { oauthManager } from '../../src/auth/index.js';
import { quotaTracker } from '../../src/api/quota.js';

describe('LinkedInClient', () => {
  let client: LinkedInClient;
  let mockAxios: MockAdapter;

  beforeEach(() => {
    client = new LinkedInClient();
    mockAxios = new MockAdapter((client as any).axiosInstance);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should attach Bearer token to requests', async () => {
    jest.spyOn(oauthManager, 'getValidToken').mockResolvedValue('test-token');
    jest.spyOn(quotaTracker, 'checkQuota').mockResolvedValue(true);
    jest.spyOn(quotaTracker, 'incrementRequestCount').mockResolvedValue(undefined);

    mockAxios.onGet('/me').reply(200, { id: '123' });

    const response = await client.get('/me');

    expect(response.status).toBe(200);
    expect(response.config.headers?.Authorization).toBe('Bearer test-token');
  });

  it('should throw error when quota is exceeded', async () => {
    jest.spyOn(quotaTracker, 'checkQuota').mockResolvedValue(false);

    await expect(client.get('/me')).rejects.toThrow('Daily API quota exceeded');
  });

  it('should increment request count on successful request', async () => {
    jest.spyOn(oauthManager, 'getValidToken').mockResolvedValue('test-token');
    jest.spyOn(quotaTracker, 'checkQuota').mockResolvedValue(true);
    const incrementSpy = jest.spyOn(quotaTracker, 'incrementRequestCount').mockResolvedValue(undefined);

    mockAxios.onGet('/me').reply(200, { id: '123' });

    await client.get('/me');

    expect(incrementSpy).toHaveBeenCalled();
  });

  it('should retry on 429 Too Many Requests', async () => {
    jest.spyOn(oauthManager, 'getValidToken').mockResolvedValue('test-token');
    jest.spyOn(quotaTracker, 'checkQuota').mockResolvedValue(true);
    jest.spyOn(quotaTracker, 'incrementRequestCount').mockResolvedValue(undefined);

    mockAxios
      .onGet('/me').replyOnce(429, {}, { 'retry-after': '1' })
      .onGet('/me').reply(200, { id: '123' });

    // We need to mock the console.warn to avoid cluttering test output
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    const response = await client.get('/me');

    expect(response.status).toBe(200);
    expect(response.data.id).toBe('123');
  });
});
