import { z } from 'zod';
import type {
  ApiDataResponse,
  ApiMessageDataResponse,
  ApiMessageResponse,
  PaginatedApiResponse,
} from '@/types/api';

// Hall entity from API
export interface Hall {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  location: string;
  pricing: number;
  images: string[];
  address: string;
  city: string;
  amenities?: Record<string, boolean>;
  services?: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  company?: {
    id: number;
    city: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    companyProfile?: {
      id: number;
      companyName: string;
      description?: string | null;
      logo?: string | null;
      banner?: string | null;
      website?: string | null;
      socialLinks?: Record<string, string> | null;
    };
  };
}

// Hall with bookings (from GET /api/companies/halls/:id)
export interface HallWithBookings extends Hall {
  bookings: {
    id: number;
    bookingDate: string;
    status: string;
  }[];
}

// Paginated halls response
export type HallsListResponse = PaginatedApiResponse<Hall>;

// Single hall response
export type HallResponse = ApiDataResponse<Hall>;

// Create hall response
export type CreateHallResponse = ApiMessageDataResponse<Hall>;

// Update hall response
export type UpdateHallResponse = ApiMessageDataResponse<Hall>;

// Delete hall response
export type DeleteHallResponse = ApiMessageResponse;

// Hall form schema
export const hallFormSchema = z.object({
  name: z.string().min(2, 'Hall name is required'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  location: z.string().min(2, 'Location is required'),
  pricing: z.number().min(0, 'Pricing must be positive'),
  images: z.array(z.string()).optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  amenities: z.record(z.string(), z.boolean()).optional(),
  services: z.array(z.string()).optional(),
  isAvailable: z.boolean().default(true),
});

export type HallFormData = z.infer<typeof hallFormSchema>;

// Common amenities for UI
export const AMENITIES = [
  'parking',
  'wifi',
  'catering',
  'sound_system',
  'stage',
  'lighting',
  'ac',
  'valet',
] as const;

// Common services for UI
export const SERVICES = ['decoration', 'photography', 'video', 'dj', 'flowers', 'cake'] as const;
