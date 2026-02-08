import { apiClient } from './client';

export interface SacredObject {
  code: number;
  libelle: string;
  description?: string;
  photo?: string;
  code_unite_ecclesiale?: number;
  date_creation: string;
  date_modification: string;
  code_createur?: number;
  code_modificateur?: number;
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
    code_type?: number;
  };
  creator?: {
    code: number;
    nom: string;
    prenom: string;
    email?: string;
  };
  modifier?: {
    code: number;
    nom: string;
    prenom: string;
    email?: string;
  };
}

export interface CreateSacredObjectDto {
  libelle: string;
  description?: string;
  photo?: string;
  code_unite_ecclesiale?: number;
}

export interface UpdateSacredObjectDto {
  libelle?: string;
  description?: string;
  photo?: string;
  code_unite_ecclesiale?: number;
}

export interface GetSacredObjectsParams {
  search?: string;
  code_unite_ecclesiale?: number;
  page?: number;
  limit?: number;
}

export interface SacredObjectsResponse {
  data: SacredObject[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SacredObjectStats {
  total: number;
  byUnit: Record<string, number>;
}

// Sacred Objects CRUD
export async function getSacredObjects(
  params?: GetSacredObjectsParams
): Promise<SacredObjectsResponse> {
  const { data } = await apiClient.get<SacredObjectsResponse>('/sacred-objects', { params });
  return data;
}

export async function getSacredObject(id: number): Promise<SacredObject> {
  const { data } = await apiClient.get<SacredObject>(`/sacred-objects/${id}`);
  return data;
}

export async function createSacredObject(
  sacredObjectData: CreateSacredObjectDto
): Promise<SacredObject> {
  const { data } = await apiClient.post<SacredObject>('/sacred-objects', sacredObjectData);
  return data;
}

export async function updateSacredObject(
  id: number,
  sacredObjectData: UpdateSacredObjectDto
): Promise<SacredObject> {
  const { data } = await apiClient.patch<SacredObject>(
    `/sacred-objects/${id}`,
    sacredObjectData
  );
  return data;
}

export async function deleteSacredObject(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/sacred-objects/${id}`);
  return data;
}

export async function getSacredObjectStats(): Promise<SacredObjectStats> {
  const { data } = await apiClient.get<SacredObjectStats>('/sacred-objects/stats');
  return data;
}

export async function getSacredObjectsByUnit(unitId: number): Promise<SacredObject[]> {
  const { data } = await apiClient.get<SacredObject[]>(`/sacred-objects/unit/${unitId}`);
  return data;
}
