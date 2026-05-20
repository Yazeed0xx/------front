import type { ApiDataResponse, ApiMessageDataResponse, PaginatedApiResponse } from '@/types/api';

// Notification types
export type NotificationType =
  | 'new_booking_request'
  | 'booking_created'
  | 'company_approved'
  | 'company_rejected'
  | 'booking_cancelled'
  | 'payment_received'
  | 'system';

// Notification data for booking-related notifications
export interface BookingNotificationData {
  bookingId: number;
  hallName: string;
  bookingDate: string;
  userName?: string;
}

// Notification entity from API
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: BookingNotificationData | Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
  isRead?: boolean;
}

// Paginated notifications response
export type NotificationsListResponse = PaginatedApiResponse<Notification>;

// Unread count response
export interface UnreadCountData {
  unreadCount: number;
}

export type UnreadCountResponse = ApiDataResponse<UnreadCountData>;

// Mark as read response
export interface MarkAsReadData {
  id: number;
  isRead: boolean;
}

export type MarkAsReadResponse = ApiMessageDataResponse<MarkAsReadData>;

// Mark all as read response
export interface MarkAllAsReadData {
  markedCount: number;
}

export type MarkAllAsReadResponse = ApiMessageDataResponse<MarkAllAsReadData>;

// Notification icons for UI
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  new_booking_request: 'calendar-plus',
  booking_created: 'calendar-plus',
  company_approved: 'check-circle',
  company_rejected: 'x-circle',
  booking_cancelled: 'calendar-x',
  payment_received: 'credit-card',
  system: 'info',
};
