import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import type { ApiErrorPayload } from '@/types/api';

const TOKEN_KEY = 'auth_token';

// In-memory token for faster access (SecureStore is async)
let memoryToken: string | null = null;

// Create axios instance
export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3333',
  headers: {
    Accept: 'application/json',
  },
  timeout: 60000,
});

// Token management functions
export const setAuthToken = async (token: string): Promise<void> => {
  memoryToken = token;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  if (memoryToken) return memoryToken;
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  memoryToken = token;
  return token;
};

export const clearAuthToken = async (): Promise<void> => {
  memoryToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// Initialize token from storage (call on app start)
export const initializeToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  memoryToken = token;
  return token;
};

// Request interceptor - inject auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = memoryToken || (await getAuthToken());
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await clearAuthToken();
      // Use setTimeout to avoid navigation during render
      setTimeout(() => {
        router.replace('/login');
      }, 0);
    }
    return Promise.reject(error);
  }
);

// API error type
export interface ApiError {
  message: string;
  code?: string;
  reason?: string;
  error?: ApiErrorPayload;
}

// Extract error message from axios error
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return data?.error?.message || data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
