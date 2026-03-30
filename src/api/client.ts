import axios, { AxiosInstance } from 'axios';
import { config } from '../config.js';
import { oauthManager } from '../auth/oauth.js';
import { rateLimiter } from './rate-limiter.js';
import { quota } from './quota.js';

/**
 * LinkedIn API Client.
 * Handles authentication, rate limiting, and quota tracking.
 */
class LinkedInClient {
  private client: AxiosInstance;
  private readonly BASE_URL = 'https://api.linkedin.com';

  constructor() {
    this.client = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(async (axiosConfig) => {
      const token = await oauthManager.getValidToken();
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
      return axiosConfig;
    });

    // Add response interceptor for quota tracking
    this.client.interceptors.response.use(async (response) => {
      await quota.increment();
      return response;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  /**
   * Makes a GET request through the rate limiter.
   */
  async get<T = any>(url: string, axiosConfig?: any): Promise<{ data: T }> {
    if (await quota.isLimitReached()) {
      throw new Error('Daily LinkedIn API quota reached (100 requests/day).');
    }
    return rateLimiter.schedule(() => this.client.get(url, axiosConfig));
  }

  /**
   * Makes a POST request through the rate limiter.
   */
  async post<T = any>(url: string, data?: any, axiosConfig?: any): Promise<{ data: T }> {
    if (await quota.isLimitReached()) {
      throw new Error('Daily LinkedIn API quota reached (100 requests/day).');
    }
    return rateLimiter.schedule(() => this.client.post(url, data, axiosConfig));
  }

  /**
   * Makes a PUT request through the rate limiter.
   */
  async put<T = any>(url: string, data?: any, axiosConfig?: any): Promise<{ data: T }> {
    if (await quota.isLimitReached()) {
      throw new Error('Daily LinkedIn API quota reached (100 requests/day).');
    }
    return rateLimiter.schedule(() => this.client.put(url, data, axiosConfig));
  }

  /**
   * Makes a DELETE request through the rate limiter.
   */
  async delete<T = any>(url: string, axiosConfig?: any): Promise<{ data: T }> {
    if (await quota.isLimitReached()) {
      throw new Error('Daily LinkedIn API quota reached (100 requests/day).');
    }
    return rateLimiter.schedule(() => this.client.delete(url, axiosConfig));
  }
}

export const linkedinClient = new LinkedInClient();
