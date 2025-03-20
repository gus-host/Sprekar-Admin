import axios from "axios";

import { API_BASE_URL } from "./config";
import {
  getRefreshTokenCookie,
  getUserTokenCookie,
  removeUserTokenCookie,
} from "../helper/auth/cookieUtility";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;

let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Notify all subscribers of the new token.
 */
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Subscribe to token refresh events.
 */
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = getUserTokenCookie();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a list of endpoints that should not trigger a refresh token
const noRefreshEndpoints = [
  "auth/login",
  "auth/create-user",
  "auth/verify-email",
  "auth/resend-otp",
  "auth/google/create-user",
  "auth/google/login",
];

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the endpoint is in the noRefreshEndpoints list
    if (
      noRefreshEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      )
    ) {
      return Promise.reject(error); // Skip refresh token logic
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = getRefreshTokenCookie();

        onRefreshed(token || ""); // Notify subscribers
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        removeUserTokenCookie(); // Remove tokens on failure
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
