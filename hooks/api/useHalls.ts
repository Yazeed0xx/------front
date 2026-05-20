import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getErrorMessage } from '@/utils/api';
import { queryKeys } from '@/lib/query-client';
import type {
  Hall,
  HallResponse,
  HallsListResponse,
  CreateHallResponse,
  UpdateHallResponse,
  DeleteHallResponse,
  HallFormData,
} from '@/types/hall';

// Get all company halls
export function useCompanyHalls(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...queryKeys.halls, { page, limit }],
    queryFn: async () => {
      const response = await api.get<HallsListResponse>('/api/companies/halls', {
        params: { page, limit },
      });
      return response.data;
    },
  });
}

// Get single hall details
export function useHall(id: number) {
  return useQuery({
    queryKey: queryKeys.hall(id),
    queryFn: async () => {
      const response = await api.get<HallResponse>(`/api/companies/halls/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Create hall mutation
export function useCreateHall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HallFormData) => {
      const response = await api.post<CreateHallResponse>('/api/companies/halls', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.halls });
    },
    onError: (error) => {
      console.error('Create hall error:', getErrorMessage(error));
    },
  });
}

// Update hall mutation
export function useUpdateHall(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<HallFormData>) => {
      const response = await api.put<UpdateHallResponse>(`/api/companies/halls/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.halls });
      queryClient.invalidateQueries({ queryKey: queryKeys.hall(id) });
    },
    onError: (error) => {
      console.error('Update hall error:', getErrorMessage(error));
    },
  });
}

// Delete hall mutation
export function useDeleteHall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<DeleteHallResponse>(`/api/companies/halls/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.halls });
    },
    onError: (error) => {
      console.error('Delete hall error:', getErrorMessage(error));
    },
  });
}

// Toggle hall availability
export function useToggleHallAvailability(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isAvailable: boolean) => {
      const response = await api.put<UpdateHallResponse>(`/api/companies/halls/${id}`, {
        isAvailable,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.halls });
      queryClient.invalidateQueries({ queryKey: queryKeys.hall(id) });
    },
  });
}
