import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSacredObjects,
  getSacredObject,
  createSacredObject,
  updateSacredObject,
  deleteSacredObject,
  getSacredObjectStats,
  getSacredObjectsByUnit,
  type CreateSacredObjectDto,
  type UpdateSacredObjectDto,
  type GetSacredObjectsParams,
} from '../api/sacredObjects';

// Sacred Objects hooks
export function useSacredObjects(params?: GetSacredObjectsParams) {
  return useQuery({
    queryKey: ['sacred-objects', params],
    queryFn: () => getSacredObjects(params),
  });
}

export function useSacredObject(id: number) {
  return useQuery({
    queryKey: ['sacred-objects', id],
    queryFn: () => getSacredObject(id),
    enabled: !!id,
  });
}

export function useCreateSacredObject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sacredObjectData: CreateSacredObjectDto) => createSacredObject(sacredObjectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sacred-objects'] });
    },
  });
}

export function useUpdateSacredObject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSacredObjectDto }) =>
      updateSacredObject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sacred-objects'] });
    },
  });
}

export function useDeleteSacredObject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSacredObject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sacred-objects'] });
    },
  });
}

export function useSacredObjectStats() {
  return useQuery({
    queryKey: ['sacred-objects', 'stats'],
    queryFn: getSacredObjectStats,
  });
}

export function useSacredObjectsByUnit(unitId: number) {
  return useQuery({
    queryKey: ['sacred-objects', 'unit', unitId],
    queryFn: () => getSacredObjectsByUnit(unitId),
    enabled: !!unitId,
  });
}
