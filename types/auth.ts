import { z } from 'zod';
import type { ApiDataResponse, ApiMessageDataResponse } from '@/types/api';

// Company status types
export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

// Company profile nested in company response
export interface CompanyProfile {
  id?: number;
  companyName: string;
  description?: string;
  logo?: string;
  banner?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}

// Company entity from API
export interface Company {
  id: number;
  userId?: number;
  companyName?: string;
  taxId?: string;
  registrationNumber?: string;
  registrationNumberPdf?: string;
  businessLicense?: string | null;
  contactPerson?: string;
  businessAddress?: string;
  city: string;
  status: CompanyStatus;
  rejectionReason?: string | null;
  approvedAt?: string | null;
  approvedBy?: number | null;
  rejectedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  companyProfile?: CompanyProfile;
}

// User entity from API
export interface User {
  id: number;
  email: string;
  userType: 'company';
}

// Token response from API
export interface TokenResponse {
  type: 'bearer';
  token: string;
}

export interface AuthPayload {
  user: User;
  company: Company;
  token: TokenResponse;
}

// Login response
export type LoginResponse = ApiMessageDataResponse<AuthPayload>;

// Register response
export type RegisterResponse = ApiMessageDataResponse<AuthPayload>;

// Current company profile response (GET /api/companies/me)
export interface CompanyProfileData {
  user: User;
  company: Company;
}

export type CompanyProfileResponse = ApiDataResponse<CompanyProfileData>;

// Auth context state
export interface AuthState {
  user: User | null;
  company: Company | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth context type with methods
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

// Login form schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form schema for company
export const companyRegisterSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(2, 'Company name is required'),
  city: z.string().min(2, 'City is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  registrationNumberPdf: z.string().min(1, 'Registration PDF is required'),
  businessAddress: z.string().min(3, 'Business address is required'),
  taxId: z.string().optional(),
  businessLicense: z.string().optional(),
  contactPerson: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
});

export type RegisterFormData = z.infer<typeof companyRegisterSchema>;
