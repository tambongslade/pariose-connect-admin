import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  getActiveAnnouncements,
  getAnnouncementsByUnit,
  getAnnouncementTypes,
  getAnnouncementType,
  createAnnouncementType,
  updateAnnouncementType,
  deleteAnnouncementType,
  type CreateAnnouncementDto,
  type UpdateAnnouncementDto,
  type GetAnnouncementsParams,
  type CreateAnnouncementTypeDto,
  type UpdateAnnouncementTypeDto,
} from '../api/announcements';

// Announcements hooks
export function useAnnouncements(params?: GetAnnouncementsParams) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => getAnnouncements(params),
  });
}

export function useAnnouncement(id: number) {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => getAnnouncement(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementData: CreateAnnouncementDto) => createAnnouncement(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementDto }) =>
      updateAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
  });
}

export function useAnnouncementStats() {
  return useQuery({
    queryKey: ['announcements', 'stats'],
    queryFn: getAnnouncementStats,
  });
}

export function useActiveAnnouncements(limit?: number) {
  return useQuery({
    queryKey: ['announcements', 'active', limit],
    queryFn: () => getActiveAnnouncements(limit),
  });
}

export function useAnnouncementsByUnit(unitId: number) {
  return useQuery({
    queryKey: ['announcements', 'unit', unitId],
    queryFn: () => getAnnouncementsByUnit(unitId),
    enabled: !!unitId,
  });
}

// Announcement Types hooks
export function useAnnouncementTypes() {
  return useQuery({
    queryKey: ['announcement-types'],
    queryFn: getAnnouncementTypes,
  });
}

export function useAnnouncementType(id: number) {
  return useQuery({
    queryKey: ['announcement-types', id],
    queryFn: () => getAnnouncementType(id),
    enabled: !!id,
  });
}

export function useCreateAnnouncementType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (typeData: CreateAnnouncementTypeDto) => createAnnouncementType(typeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-types'] });
    },
  });
}

export function useUpdateAnnouncementType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnouncementTypeDto }) =>
      updateAnnouncementType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-types'] });
    },
  });
}

export function useDeleteAnnouncementType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAnnouncementType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcement-types'] });
    },
  });
}
