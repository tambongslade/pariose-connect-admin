import { apiClient } from './client';

export interface Announcement {
  code: number;
  libelle: string;
  contenu?: string;
  code_type?: number;
  code_unite_ecclesiale?: number;
  date_publication?: string;
  date_expiration?: string;
  code_createur: number;
  date_creation: string;
  date_modification: string;
  announcementType?: {
    code: number;
    libelle: string;
    description?: string;
  };
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
  };
  creator?: {
    code: number;
    username: string;
    noms?: string;
    prenoms?: string;
  };
}

export interface AnnouncementType {
  code: number;
  libelle: string;
  description?: string;
}

export interface CreateAnnouncementDto {
  libelle: string;
  contenu?: string;
  code_type?: number;
  code_unite_ecclesiale?: number;
  date_publication?: string;
  date_expiration?: string;
}

export interface UpdateAnnouncementDto {
  libelle?: string;
  contenu?: string;
  code_type?: number;
  code_unite_ecclesiale?: number;
  date_publication?: string;
  date_expiration?: string;
}

export interface CreateAnnouncementTypeDto {
  libelle: string;
  description?: string;
}

export interface UpdateAnnouncementTypeDto {
  libelle?: string;
  description?: string;
}

export interface GetAnnouncementsParams {
  search?: string;
  code_unite_ecclesiale?: number;
  code_type?: number;
  date_from?: string;
  date_to?: string;
  active_only?: boolean;
  page?: number;
  limit?: number;
}

export interface AnnouncementsResponse {
  data: Announcement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AnnouncementStats {
  total: number;
  active: number;
  expired: number;
  byType: Record<string, number>;
  byMonth: Record<string, number>;
}

// Announcements CRUD
export async function getAnnouncements(params?: GetAnnouncementsParams): Promise<AnnouncementsResponse> {
  const { data } = await apiClient.get<AnnouncementsResponse>('/announcements', { params });
  return data;
}

export async function getAnnouncement(id: number): Promise<Announcement> {
  const { data } = await apiClient.get<Announcement>(`/announcements/${id}`);
  return data;
}

export async function createAnnouncement(announcementData: CreateAnnouncementDto): Promise<Announcement> {
  const { data } = await apiClient.post<Announcement>('/announcements', announcementData);
  return data;
}

export async function updateAnnouncement(
  id: number,
  announcementData: UpdateAnnouncementDto
): Promise<Announcement> {
  const { data } = await apiClient.patch<Announcement>(`/announcements/${id}`, announcementData);
  return data;
}

export async function deleteAnnouncement(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/announcements/${id}`);
  return data;
}

export async function getAnnouncementStats(): Promise<AnnouncementStats> {
  const { data } = await apiClient.get<AnnouncementStats>('/announcements/stats');
  return data;
}

export async function getActiveAnnouncements(limit?: number): Promise<Announcement[]> {
  const { data } = await apiClient.get<Announcement[]>('/announcements/active', {
    params: { limit },
  });
  return data;
}

export async function getAnnouncementsByUnit(unitId: number): Promise<Announcement[]> {
  const { data } = await apiClient.get<Announcement[]>(`/announcements/unit/${unitId}`);
  return data;
}

// Announcement Types CRUD
export async function getAnnouncementTypes(): Promise<AnnouncementType[]> {
  const { data } = await apiClient.get<AnnouncementType[]>('/announcements/types/all');
  return data;
}

export async function getAnnouncementType(id: number): Promise<AnnouncementType> {
  const { data } = await apiClient.get<AnnouncementType>(`/announcements/types/${id}`);
  return data;
}

export async function createAnnouncementType(
  typeData: CreateAnnouncementTypeDto
): Promise<AnnouncementType> {
  const { data } = await apiClient.post<AnnouncementType>('/announcements/types', typeData);
  return data;
}

export async function updateAnnouncementType(
  id: number,
  typeData: UpdateAnnouncementTypeDto
): Promise<AnnouncementType> {
  const { data } = await apiClient.patch<AnnouncementType>(`/announcements/types/${id}`, typeData);
  return data;
}

export async function deleteAnnouncementType(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/announcements/types/${id}`);
  return data;
}
