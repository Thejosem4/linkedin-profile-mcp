import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { oauthManager } from '../auth/index.js';
import { rateLimiter } from './rate-limiter.js';
import { LINKEDIN_API_BASE_URL } from './endpoints.js';

/**
 * LinkedIn API client.
 * Handles authentication, rate limiting, and quota tracking.
 */
export class LinkedInClient {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: LINKEDIN_API_BASE_URL,
      headers: {
        'X-Restli-Protocol-Version': '2.0.0',
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to attach the Bearer token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await oauthManager.getValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  /**
   * Makes a GET request through the rate limiter.
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return rateLimiter.schedule(() => this.axiosInstance.get<T>(url, config));
  }

  /**
   * Makes a POST request through the rate limiter.
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return rateLimiter.schedule(() => this.axiosInstance.post<T>(url, data, config));
  }

  /**
   * Makes a PUT request through the rate limiter.
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return rateLimiter.schedule(() => this.axiosInstance.put<T>(url, data, config));
  }

  /**
   * Makes a DELETE request through the rate limiter.
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return rateLimiter.schedule(() => this.axiosInstance.delete<T>(url, config));
  }
}

export const linkedinClient = new LinkedInClient();
