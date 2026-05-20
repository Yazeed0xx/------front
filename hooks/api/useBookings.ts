import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/utils/api';
import { queryKeys } from '@/lib/query-client';
import type {
  Booking,
  BookingResponse,
  BookingsListResponse,
  AcceptBookingResponse,
  RejectBookingResponse,
  BookingStatus,
} from '@/types/booking';

// Get all company bookings
export function useCompanyBookings(page = 1, limit = 20, status?: BookingStatus) {
  return useQuery({
    queryKey: [...queryKeys.bookings, { page, limit, status }],
    queryFn: async () => {
      const response = await api.get<BookingsListResponse>('/api/companies/bookings', {
        params: { page, limit, status },
      });
      return response.data;
    },
  });
}

// Get pending bookings (need company response)
export function usePendingBookings(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.pendingBookings, { page, limit }],
    queryFn: async () => {
      const response = await api.get<BookingsListResponse>('/api/companies/bookings/pending', {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

// Get single booking details
export function useBooking(id: number) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: async () => {
      const response = await api.get<BookingResponse>(`/api/companies/bookings/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Accept booking mutation
export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<AcceptBookingResponse>(
        `/api/companies/bookings/${id}/accept`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingBookings });
    },
    onError: (error) => {
      console.error('Accept booking error:', getErrorMessage(error));
    },
  });
}

// Reject booking mutation
export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await api.post<RejectBookingResponse>(
        `/api/companies/bookings/${id}/reject`,
        {
          reason,
        }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      queryClient.invalidateQueries({ queryKey: queryKeys.pendingBookings });
    },
    onError: (error) => {
      console.error('Reject booking error:', getErrorMessage(error));
    },
  });
}

// Get booking stats for dashboard
export function useBookingStats() {
  return useQuery({
    queryKey: ['bookings', 'stats'],
    queryFn: async () => {
      const [pendingRes, allRes] = await Promise.all([
        api.get<BookingsListResponse>('/api/companies/bookings/pending', { params: { limit: 1 } }),
        api.get<BookingsListResponse>('/api/companies/bookings', { params: { limit: 1 } }),
      ]);

      return {
        pendingCount: pendingRes.data.meta?.total ?? 0,
        totalCount: allRes.data.meta?.total ?? 0,
      };
    },
    staleTime: 60 * 1000,
  });
}
