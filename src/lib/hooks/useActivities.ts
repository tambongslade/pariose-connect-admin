import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
  getUpcomingActivities,
  getActivityTypes,
  getActivityType,
  createActivityType,
  updateActivityType,
  deleteActivityType,
  type CreateActivityDto,
  type UpdateActivityDto,
  type GetActivitiesParams,
  type CreateActivityTypeDto,
  type UpdateActivityTypeDto,
} from '../api/activities';

// Activities hooks
export function useActivities(params?: GetActivitiesParams) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => getActivities(params),
  });
}

export function useActivity(id: number) {
  return useQuery({
    queryKey: ['activities', id],
    queryFn: () => getActivity(id),
    enabled: !!id,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (activityData: CreateActivityDto) => createActivity(activityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityDto }) =>
      updateActivity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useActivityStats() {
  return useQuery({
    queryKey: ['activities', 'stats'],
    queryFn: getActivityStats,
  });
}

export function useUpcomingActivities(limit?: number) {
  return useQuery({
    queryKey: ['activities', 'upcoming', limit],
    queryFn: () => getUpcomingActivities(limit),
  });
}

// Activity Types hooks
export function useActivityTypes() {
  return useQuery({
    queryKey: ['activity-types'],
    queryFn: getActivityTypes,
  });
}

export function useActivityType(id: number) {
  return useQuery({
    queryKey: ['activity-types', id],
    queryFn: () => getActivityType(id),
    enabled: !!id,
  });
}

export function useCreateActivityType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (typeData: CreateActivityTypeDto) => createActivityType(typeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-types'] });
    },
  });
}

export function useUpdateActivityType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityTypeDto }) =>
      updateActivityType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-types'] });
    },
  });
}

export function useDeleteActivityType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteActivityType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-types'] });
    },
  });
}
