import { z } from 'zod';
import type { ApiDataResponse, ApiMessageDataResponse, PaginatedApiResponse } from '@/types/api';

// Booking status types
export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'expired';

// Payment status types
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

// User profile in booking
export interface BookingUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  avatar?: string | null;
}

// User in booking
export interface BookingUser {
  id: number;
  userName: string;
  email: string;
  userType?: 'user';
  createdAt?: string;
  updatedAt?: string;
  isEmailVerified?: boolean;
  userProfile?: BookingUserProfile;
}

// Hall in booking (simplified)
export interface BookingHall {
  id: number;
  name: string;
  pricing?: number;
  location?: string;
  city?: string;
}

// Service in booking
export interface BookingService {
  id: number;
  name: string;
  price?: number;
}

// Booking entity from API
export interface Booking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  guestCount?: number;
  notes?: string;
  specialRequests?: string;
  rejectionReason?: string;
  companyRespondedAt?: string | null;
  expiresAt?: string;
  paymentDueDate?: string;
  createdAt: string;
  updatedAt?: string;
  isExpired?: boolean;
  hall: BookingHall;
  user: BookingUser;
  services: BookingService[];
}

// Paginated bookings response
export type BookingsListResponse = PaginatedApiResponse<Booking>;

export type BookingResponse = ApiDataResponse<Booking>;

// Accept booking response
export interface AcceptBookingData {
    id: number;
    status: 'accepted';
    paymentStatus: PaymentStatus;
}

export type AcceptBookingResponse = ApiMessageDataResponse<AcceptBookingData>;

// Reject booking request
export const rejectBookingSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500),
});

export type RejectBookingData = z.infer<typeof rejectBookingSchema>;

// Reject booking response
export interface RejectBookingDataResponse {
    id: number;
    status: 'rejected';
    rejectionReason: string;
}

export type RejectBookingResponse = ApiMessageDataResponse<RejectBookingDataResponse>;

// Status colors for UI
export const BOOKING_STATUS_COLORS: Record<BookingStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-700' },
  accepted: { bg: 'bg-blue-500/10', text: 'text-blue-700' },
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-700' },
  rejected: { bg: 'bg-red-500/10', text: 'text-red-700' },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-700' },
  completed: { bg: 'bg-purple-500/10', text: 'text-purple-700' },
  expired: { bg: 'bg-gray-500/10', text: 'text-gray-500' },
};
