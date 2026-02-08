import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getHolyPlaces,
  getHolyPlace,
  createHolyPlace,
  updateHolyPlace,
  deleteHolyPlace,
  getHolyPlaceStats,
  getNearbyHolyPlaces,
  getHolyPlacesByUnit,
  type CreateHolyPlaceDto,
  type UpdateHolyPlaceDto,
  type GetHolyPlacesParams,
  type NearbyParams,
} from '../api/holyPlaces';

// Holy Places hooks
export function useHolyPlaces(params?: GetHolyPlacesParams) {
  return useQuery({
    queryKey: ['holy-places', params],
    queryFn: () => getHolyPlaces(params),
  });
}

export function useHolyPlace(id: number) {
  return useQuery({
    queryKey: ['holy-places', id],
    queryFn: () => getHolyPlace(id),
    enabled: !!id,
  });
}

export function useCreateHolyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (holyPlaceData: CreateHolyPlaceDto) => createHolyPlace(holyPlaceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holy-places'] });
    },
  });
}

export function useUpdateHolyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateHolyPlaceDto }) =>
      updateHolyPlace(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holy-places'] });
    },
  });
}

export function useDeleteHolyPlace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteHolyPlace(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holy-places'] });
    },
  });
}

export function useHolyPlaceStats() {
  return useQuery({
    queryKey: ['holy-places', 'stats'],
    queryFn: getHolyPlaceStats,
  });
}

export function useNearbyHolyPlaces(params: NearbyParams) {
  return useQuery({
    queryKey: ['holy-places', 'nearby', params],
    queryFn: () => getNearbyHolyPlaces(params),
    enabled: !!params.latitude && !!params.longitude,
  });
}

export function useHolyPlacesByUnit(unitId: number) {
  return useQuery({
    queryKey: ['holy-places', 'unit', unitId],
    queryFn: () => getHolyPlacesByUnit(unitId),
    enabled: !!unitId,
  });
}
