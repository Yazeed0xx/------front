import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/utils/api';
import { queryKeys } from '@/lib/query-client';
import type {
  Notification,
  NotificationsListResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
} from '@/types/notification';

// Get all notifications
export function useNotifications(page = 1, limit = 20, unreadOnly = false) {
  return useQuery({
    queryKey: [...queryKeys.notifications, { page, limit, unreadOnly }],
    queryFn: async () => {
      const response = await api.get<NotificationsListResponse>('/api/companies/notifications', {
        params: { page, limit, unread_only: unreadOnly },
      });
      return response.data;
    },
  });
}

// Get unread notification count
export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: async () => {
      const response = await api.get<UnreadCountResponse>(
        '/api/companies/notifications/unread-count'
      );
      return response.data.data.unreadCount;
    },
    refetchInterval: 30 * 1000,
    staleTime: 10 * 1000,
  });
}

// Mark single notification as read
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.post<MarkAsReadResponse>(
        `/api/companies/notifications/${id}/read`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
    onError: (error) => {
      console.error('Mark as read error:', getErrorMessage(error));
    },
  });
}

// Mark all notifications as read
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<MarkAllAsReadResponse>(
        '/api/companies/notifications/read-all'
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
    onError: (error) => {
      console.error('Mark all as read error:', getErrorMessage(error));
    },
  });
}
