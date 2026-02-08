import { apiClient } from './client';

export interface HolyPlace {
  code: number;
  libelle: string;
  adresse?: string;
  photo?: string;
  longitude?: string;
  latitude?: string;
  code_unite_ecclesiale?: number;
  date_creation: string;
  date_modification: string;
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
    code_type?: number;
  };
  distance?: number; // Only in nearby results
}

export interface CreateHolyPlaceDto {
  libelle: string;
  adresse?: string;
  photo?: string;
  longitude?: number;
  latitude?: number;
  code_unite_ecclesiale?: number;
}

export interface UpdateHolyPlaceDto {
  libelle?: string;
  adresse?: string;
  photo?: string;
  longitude?: number;
  latitude?: number;
  code_unite_ecclesiale?: number;
}

export interface GetHolyPlacesParams {
  search?: string;
  code_unite_ecclesiale?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface HolyPlacesResponse {
  data: HolyPlace[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HolyPlaceStats {
  total: number;
  withPhotos: number;
  withCoordinates: number;
  byUnit: Record<string, number>;
}

export interface NearbyParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

// Holy Places CRUD
export async function getHolyPlaces(params?: GetHolyPlacesParams): Promise<HolyPlacesResponse> {
  const { data } = await apiClient.get<HolyPlacesResponse>('/holy-places', { params });
  return data;
}

export async function getHolyPlace(id: number): Promise<HolyPlace> {
  const { data } = await apiClient.get<HolyPlace>(`/holy-places/${id}`);
  return data;
}

export async function createHolyPlace(holyPlaceData: CreateHolyPlaceDto): Promise<HolyPlace> {
  const { data } = await apiClient.post<HolyPlace>('/holy-places', holyPlaceData);
  return data;
}

export async function updateHolyPlace(
  id: number,
  holyPlaceData: UpdateHolyPlaceDto
): Promise<HolyPlace> {
  const { data } = await apiClient.patch<HolyPlace>(`/holy-places/${id}`, holyPlaceData);
  return data;
}

export async function deleteHolyPlace(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/holy-places/${id}`);
  return data;
}

export async function getHolyPlaceStats(): Promise<HolyPlaceStats> {
  const { data } = await apiClient.get<HolyPlaceStats>('/holy-places/stats');
  return data;
}

export async function getNearbyHolyPlaces(params: NearbyParams): Promise<HolyPlace[]> {
  const { data } = await apiClient.get<HolyPlace[]>('/holy-places/nearby', { params });
  return data;
}

export async function getHolyPlacesByUnit(unitId: number): Promise<HolyPlace[]> {
  const { data } = await apiClient.get<HolyPlace[]>(`/holy-places/unit/${unitId}`);
  return data;
}
