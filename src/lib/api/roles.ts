import { apiClient } from './client';

export interface Role {
  code: number;
  libelle: string;
  description?: string;
  date_creation: string;
  date_modification: string;
  permissions?: any[];
}

export interface CreateRoleDto {
  libelle: string;
  description?: string;
  permissionIds?: number[];
}

export interface UpdateRoleDto {
  libelle?: string;
  description?: string;
  permissionIds?: number[];
}

export async function getRoles(): Promise<Role[]> {
  const { data } = await apiClient.get<Role[]>('/roles');
  return data;
}

export async function getRole(id: number): Promise<Role> {
  const { data } = await apiClient.get<Role>(`/roles/${id}`);
  return data;
}

export async function createRole(roleData: CreateRoleDto): Promise<Role> {
  const { data } = await apiClient.post<Role>('/roles', roleData);
  return data;
}

export async function updateRole(id: number, roleData: UpdateRoleDto): Promise<Role> {
  const { data } = await apiClient.patch<Role>(`/roles/${id}`, roleData);
  return data;
}

export async function deleteRole(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/roles/${id}`);
  return data;
}

export async function getRoleStats(): Promise<any> {
  const { data } = await apiClient.get('/roles/stats');
  return data;
}
