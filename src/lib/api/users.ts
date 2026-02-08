import { apiClient } from './client';
import type { User } from '../../types';

export interface CreateUserDto {
  username: string;
  password: string;
  noms?: string;
  prenoms?: string;
  date_naissance?: string;
  contact_1?: string;
  contact_2?: string;
  addresse?: string;
  roleIds?: number[];
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  noms?: string;
  prenoms?: string;
  date_naissance?: string;
  contact_1?: string;
  contact_2?: string;
  addresse?: string;
  roleIds?: number[];
}

export interface AssignRolesDto {
  roleIds: number[];
}

export async function getUsers(): Promise<User[]> {
  const { data } = await apiClient.get<any>('/users');

  // Handle different response structures
  if (Array.isArray(data)) {
    return data;
  }
  if (data.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data.users && Array.isArray(data.users)) {
    return data.users;
  }

  return [];
}

export async function getUser(id: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}

export async function createUser(userData: CreateUserDto): Promise<User> {
  const { data } = await apiClient.post<User>('/users', userData);
  return data;
}

export async function updateUser(id: number, userData: UpdateUserDto): Promise<User> {
  const { data } = await apiClient.patch<User>(`/users/${id}`, userData);
  return data;
}

export async function deleteUser(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/users/${id}`);
  return data;
}

export async function assignRolesToUser(
  userId: number,
  rolesData: AssignRolesDto
): Promise<User> {
  const { data } = await apiClient.post<User>(`/users/${userId}/roles`, rolesData);
  return data;
}
