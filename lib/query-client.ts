import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Auth
  companyProfile: ['company', 'profile'] as const,

  // Halls
  halls: ['halls'] as const,
  hall: (id: number) => ['halls', id] as const,

  // Bookings
  bookings: ['bookings'] as const,
  bookingsWithStatus: (status?: string) => ['bookings', { status }] as const,
  pendingBookings: ['bookings', 'pending'] as const,
  booking: (id: number) => ['bookings', id] as const,

  // Notifications
  notifications: ['notifications'] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};
