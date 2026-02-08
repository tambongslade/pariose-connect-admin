import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConfessions,
  getConfession,
  createConfession,
  updateConfession,
  deleteConfession,
  getConfessionStats,
  getConfessionsByUnit,
  type CreateConfessionDto,
  type UpdateConfessionDto,
  type GetConfessionsParams,
} from '../api/confessions';

// Confessions hooks
export function useConfessions(params?: GetConfessionsParams) {
  return useQuery({
    queryKey: ['confessions', params],
    queryFn: () => getConfessions(params),
  });
}

export function useConfession(id: number) {
  return useQuery({
    queryKey: ['confessions', id],
    queryFn: () => getConfession(id),
    enabled: !!id,
  });
}

export function useCreateConfession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (confessionData: CreateConfessionDto) => createConfession(confessionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
}

export function useUpdateConfession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateConfessionDto }) =>
      updateConfession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
}

export function useDeleteConfession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteConfession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
    },
  });
}

export function useConfessionStats() {
  return useQuery({
    queryKey: ['confessions', 'stats'],
    queryFn: getConfessionStats,
  });
}

export function useConfessionsByUnit(unitId: number) {
  return useQuery({
    queryKey: ['confessions', 'unit', unitId],
    queryFn: () => getConfessionsByUnit(unitId),
    enabled: !!unitId,
  });
}
