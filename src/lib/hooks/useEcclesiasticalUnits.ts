import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEcclesiasticalUnits,
  getEcclesiasticalUnit,
  createEcclesiasticalUnit,
  updateEcclesiasticalUnit,
  deleteEcclesiasticalUnit,
  getEcclesiasticalUnitsStats,
  getEcclesiasticalUnitsHierarchy,
  getMySubscriptions,
  subscribeToUnit,
  unsubscribeFromUnit,
  getUnitSubscribers,
  type CreateEcclesiasticalUnitDto,
  type UpdateEcclesiasticalUnitDto,
  type GetUnitsParams,
} from '../api/ecclesiasticalUnits';

export function useEcclesiasticalUnits(params?: GetUnitsParams) {
  return useQuery({
    queryKey: ['ecclesiastical-units', params],
    queryFn: () => getEcclesiasticalUnits(params),
  });
}

export function useEcclesiasticalUnit(id: number, lang?: string) {
  return useQuery({
    queryKey: ['ecclesiastical-units', id, lang],
    queryFn: () => getEcclesiasticalUnit(id, lang),
    enabled: !!id,
  });
}

export function useCreateEcclesiasticalUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitData: CreateEcclesiasticalUnitDto) => createEcclesiasticalUnit(unitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecclesiastical-units'] });
    },
  });
}

export function useUpdateEcclesiasticalUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEcclesiasticalUnitDto }) =>
      updateEcclesiasticalUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecclesiastical-units'] });
    },
  });
}

export function useDeleteEcclesiasticalUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteEcclesiasticalUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecclesiastical-units'] });
    },
  });
}

export function useEcclesiasticalUnitsStats() {
  return useQuery({
    queryKey: ['ecclesiastical-units', 'stats'],
    queryFn: getEcclesiasticalUnitsStats,
  });
}

export function useEcclesiasticalUnitsHierarchy(rootId?: number) {
  return useQuery({
    queryKey: ['ecclesiastical-units', 'hierarchy', rootId],
    queryFn: () => getEcclesiasticalUnitsHierarchy(rootId),
  });
}

export function useMySubscriptions() {
  return useQuery({
    queryKey: ['ecclesiastical-units', 'my-subscriptions'],
    queryFn: getMySubscriptions,
  });
}

export function useSubscribeToUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subscribeToUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecclesiastical-units'] });
    },
  });
}

export function useUnsubscribeFromUnit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => unsubscribeFromUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ecclesiastical-units'] });
    },
  });
}

export function useUnitSubscribers(id: number) {
  return useQuery({
    queryKey: ['ecclesiastical-units', id, 'subscribers'],
    queryFn: () => getUnitSubscribers(id),
    enabled: !!id,
  });
}
