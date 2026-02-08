import { apiClient } from './client';

export interface EcclesiasticalUnit {
  code: number;
  libelle: string;
  description?: string;
  titre?: string;
  adresse?: string;
  code_type?: number;
  longitude?: string;
  latitude?: string;
  altitude?: string;
  fidele?: string;
  date_creation_unite?: string;
  statut_canonique?: string;
  code_unite_parent?: number;
  activite?: string;
  code_createur?: number;
  code_modificateur?: number;
  date_creation: string;
  date_modification: string;
  parent?: any;
  children?: any[];
  translations?: Translation[];
}

export interface Translation {
  id?: number;
  nom: string;
  description?: string;
  adresse?: string;
  languageCode: string;
  ecclesiasticalUnitCode?: number;
}

export interface CreateEcclesiasticalUnitDto {
  libelle: string;
  description?: string;
  titre?: string;
  adresse?: string;
  code_type?: number;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  fidele?: string;
  date_creation_unite?: string;
  statut_canonique?: string;
  code_unite_parent?: number;
  activite?: string;
  translations?: Omit<Translation, 'id' | 'ecclesiasticalUnitCode'>[];
}

export interface UpdateEcclesiasticalUnitDto {
  libelle?: string;
  description?: string;
  titre?: string;
  adresse?: string;
  code_type?: number;
  longitude?: number;
  latitude?: number;
  altitude?: number;
  fidele?: string;
  date_creation_unite?: string;
  statut_canonique?: string;
  code_unite_parent?: number;
  activite?: string;
}

export interface GetUnitsParams {
  search?: string;
  code_type?: number;
  code_unite_parent?: number;
  statut_canonique?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

export interface UnitsResponse {
  data: EcclesiasticalUnit[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UnitStats {
  total: number;
  byType: Record<string | number, number>;
  byParentUnit: Record<string | number, number>;
}

// Get all ecclesiastical units with filtering
export async function getEcclesiasticalUnits(params?: GetUnitsParams): Promise<UnitsResponse> {
  const { data } = await apiClient.get<UnitsResponse>('/ecclesiastical-units', { params });
  return data;
}

// Get single ecclesiastical unit
export async function getEcclesiasticalUnit(id: number, lang?: string): Promise<EcclesiasticalUnit> {
  const { data } = await apiClient.get<EcclesiasticalUnit>(`/ecclesiastical-units/${id}`, {
    params: { lang },
  });
  return data;
}

// Create ecclesiastical unit
export async function createEcclesiasticalUnit(
  unitData: CreateEcclesiasticalUnitDto
): Promise<EcclesiasticalUnit> {
  const { data } = await apiClient.post<EcclesiasticalUnit>('/ecclesiastical-units', unitData);
  return data;
}

// Update ecclesiastical unit
export async function updateEcclesiasticalUnit(
  id: number,
  unitData: UpdateEcclesiasticalUnitDto
): Promise<EcclesiasticalUnit> {
  const { data } = await apiClient.patch<EcclesiasticalUnit>(
    `/ecclesiastical-units/${id}`,
    unitData
  );
  return data;
}

// Delete ecclesiastical unit
export async function deleteEcclesiasticalUnit(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/ecclesiastical-units/${id}`);
  return data;
}

// Get statistics
export async function getEcclesiasticalUnitsStats(): Promise<UnitStats> {
  const { data } = await apiClient.get<UnitStats>('/ecclesiastical-units/stats');
  return data;
}

// Get hierarchical tree
export async function getEcclesiasticalUnitsHierarchy(rootId?: number): Promise<any[]> {
  const { data } = await apiClient.get<any[]>('/ecclesiastical-units/hierarchy', {
    params: { rootId },
  });
  return data;
}

// Get my subscriptions
export async function getMySubscriptions(): Promise<EcclesiasticalUnit[]> {
  const { data } = await apiClient.get<EcclesiasticalUnit[]>('/ecclesiastical-units/my-subscriptions');
  return data;
}

// Subscribe to unit
export async function subscribeToUnit(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>(
    `/ecclesiastical-units/${id}/subscribe`
  );
  return data;
}

// Unsubscribe from unit
export async function unsubscribeFromUnit(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(
    `/ecclesiastical-units/${id}/subscribe`
  );
  return data;
}

// Get unit subscribers
export async function getUnitSubscribers(id: number): Promise<any[]> {
  const { data } = await apiClient.get<any[]>(`/ecclesiastical-units/${id}/subscribers`);
  return data;
}
