import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCelebrations,
  getCelebration,
  createCelebration,
  updateCelebration,
  deleteCelebration,
  getCelebrationStats,
  createMassIntention,
  getMassIntentions,
  getMassIntention,
  updateMassIntention,
  deleteMassIntention,
  type CreateCelebrationDto,
  type UpdateCelebrationDto,
  type GetCelebrationsParams,
  type CreateMassIntentionDto,
  type UpdateMassIntentionDto,
} from '../api/celebrations';

// Celebrations hooks
export function useCelebrations(params?: GetCelebrationsParams) {
  return useQuery({
    queryKey: ['celebrations', params],
    queryFn: () => getCelebrations(params),
  });
}

export function useCelebration(id: number) {
  return useQuery({
    queryKey: ['celebrations', id],
    queryFn: () => getCelebration(id),
    enabled: !!id,
  });
}

export function useCreateCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (celebrationData: CreateCelebrationDto) => createCelebration(celebrationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}

export function useUpdateCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCelebrationDto }) =>
      updateCelebration(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}

export function useDeleteCelebration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCelebration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}

export function useCelebrationStats() {
  return useQuery({
    queryKey: ['celebrations', 'stats'],
    queryFn: getCelebrationStats,
  });
}

// Mass Intentions hooks
export function useMassIntentions(celebrationId?: number) {
  return useQuery({
    queryKey: ['mass-intentions', celebrationId],
    queryFn: () => getMassIntentions(celebrationId),
  });
}

export function useMassIntention(id: number) {
  return useQuery({
    queryKey: ['mass-intentions', id],
    queryFn: () => getMassIntention(id),
    enabled: !!id,
  });
}

export function useCreateMassIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (intentionData: CreateMassIntentionDto) => createMassIntention(intentionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mass-intentions'] });
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}

export function useUpdateMassIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMassIntentionDto }) =>
      updateMassIntention(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mass-intentions'] });
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}

export function useDeleteMassIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMassIntention(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mass-intentions'] });
      queryClient.invalidateQueries({ queryKey: ['celebrations'] });
    },
  });
}
