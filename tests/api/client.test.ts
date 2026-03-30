import { jest } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { linkedinClient } from '../../src/api/client.js';
import { rateLimiter } from '../../src/api/rate-limiter.js';
import { quota } from '../../src/api/quota.js';

describe('LinkedIn API Client', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter((linkedinClient as any).client);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should make successful GET requests through rate limiter', async () => {
    const mockData = { id: '123', name: 'John' };
    mockAxios.onGet('/test').reply(200, mockData);

    const scheduleSpy = jest.spyOn(rateLimiter, 'schedule');
    const quotaSpy = jest.spyOn(quota, 'increment').mockResolvedValue(1);

    const result = await linkedinClient.get('/test');

    expect(result.data).toEqual(mockData);
    expect(scheduleSpy).toHaveBeenCalled();
    expect(quotaSpy).toHaveBeenCalled();
  });

  it('should respect daily quota limits', async () => {
    jest.spyOn(quota, 'isLimitReached').mockResolvedValue(true);

    await expect(linkedinClient.get('/test')).rejects.toThrow('quota reached');
  });

  it('should handle API errors', async () => {
    mockAxios.onGet('/error').reply(500, { message: 'Server Error' });

    await expect(linkedinClient.get('/error')).rejects.toThrow();
  });
});
