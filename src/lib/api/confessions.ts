import { apiClient } from './client';

export interface Confession {
  code: number;
  lieu?: string;
  horaire_debut?: string;
  horaire_fin?: string;
  granularite?: string;
  code_unite_ecclesiale?: number;
  date_creation: string;
  date_modification: string;
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
  };
}

export interface CreateConfessionDto {
  lieu?: string;
  horaire_debut?: string;
  horaire_fin?: string;
  granularite?: 'daily' | 'weekly' | 'monthly' | 'on_demand';
  code_unite_ecclesiale?: number;
}

export interface UpdateConfessionDto {
  lieu?: string;
  horaire_debut?: string;
  horaire_fin?: string;
  granularite?: 'daily' | 'weekly' | 'monthly' | 'on_demand';
}

export interface GetConfessionsParams {
  search?: string;
  code_unite_ecclesiale?: number;
  granularite?: string;
  page?: number;
  limit?: number;
}

export interface ConfessionsResponse {
  data: Confession[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConfessionStats {
  total: number;
  byFrequency: Record<string, number>;
  byUnit: Record<string, number>;
}

// Confessions CRUD
export async function getConfessions(params?: GetConfessionsParams): Promise<ConfessionsResponse> {
  const { data } = await apiClient.get<ConfessionsResponse>('/confessions', { params });
  return data;
}

export async function getConfession(id: number): Promise<Confession> {
  const { data } = await apiClient.get<Confession>(`/confessions/${id}`);
  return data;
}

export async function createConfession(confessionData: CreateConfessionDto): Promise<Confession> {
  const { data } = await apiClient.post<Confession>('/confessions', confessionData);
  return data;
}

export async function updateConfession(
  id: number,
  confessionData: UpdateConfessionDto
): Promise<Confession> {
  const { data } = await apiClient.patch<Confession>(`/confessions/${id}`, confessionData);
  return data;
}

export async function deleteConfession(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/confessions/${id}`);
  return data;
}

export async function getConfessionStats(): Promise<ConfessionStats> {
  const { data } = await apiClient.get<ConfessionStats>('/confessions/stats');
  return data;
}

export async function getConfessionsByUnit(unitId: number): Promise<Confession[]> {
  const { data } = await apiClient.get<Confession[]>(`/confessions/unit/${unitId}`);
  return data;
}
