import { apiClient } from './client';

export interface Activity {
  code: number;
  libelle: string;
  date_activite?: string;
  description?: string;
  frequence?: string;
  date_debut?: string;
  date_fin?: string;
  statut?: number;
  lieu?: string;
  code_unite_ecclesiale: number;
  code_type_activite?: number;
  date_creation: string;
  date_modification: string;
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
  };
  activityType?: {
    code: number;
    libelle: string;
    description?: string;
  };
}

export interface ActivityType {
  code: number;
  libelle: string;
  description?: string;
  code_createur?: number;
  code_modificateur?: number;
  date_creation: string;
  creator?: {
    code: number;
    username: string;
    noms?: string;
    prenoms?: string;
  };
}

export interface CreateActivityDto {
  libelle: string;
  date_activite?: string;
  description?: string;
  frequence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  date_debut?: string;
  date_fin?: string;
  statut?: number;
  lieu?: string;
  code_unite_ecclesiale: number;
  code_type_activite?: number;
}

export interface UpdateActivityDto {
  libelle?: string;
  date_activite?: string;
  description?: string;
  frequence?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  date_debut?: string;
  date_fin?: string;
  statut?: number;
  lieu?: string;
  code_type_activite?: number;
}

export interface CreateActivityTypeDto {
  libelle: string;
  description?: string;
}

export interface UpdateActivityTypeDto {
  libelle?: string;
  description?: string;
}

export interface GetActivitiesParams {
  search?: string;
  code_unite_ecclesiale?: number;
  code_type_activite?: number;
  frequence?: string;
  statut?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface ActivitiesResponse {
  data: Activity[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ActivityStats {
  total: number;
  upcoming: number;
  past: number;
  byStatus: {
    planned: number;
    ongoing: number;
    completed: number;
  };
  byFrequency: Record<string, number>;
  byType: Record<string, number>;
}

// Activities CRUD
export async function getActivities(params?: GetActivitiesParams): Promise<ActivitiesResponse> {
  const { data } = await apiClient.get<ActivitiesResponse>('/activities', { params });
  return data;
}

export async function getActivity(id: number): Promise<Activity> {
  const { data } = await apiClient.get<Activity>(`/activities/${id}`);
  return data;
}

export async function createActivity(activityData: CreateActivityDto): Promise<Activity> {
  const { data } = await apiClient.post<Activity>('/activities', activityData);
  return data;
}

export async function updateActivity(
  id: number,
  activityData: UpdateActivityDto
): Promise<Activity> {
  const { data } = await apiClient.patch<Activity>(`/activities/${id}`, activityData);
  return data;
}

export async function deleteActivity(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/activities/${id}`);
  return data;
}

export async function getActivityStats(): Promise<ActivityStats> {
  const { data } = await apiClient.get<ActivityStats>('/activities/stats');
  return data;
}

export async function getUpcomingActivities(limit?: number): Promise<Activity[]> {
  const { data } = await apiClient.get<Activity[]>('/activities/upcoming', {
    params: { limit },
  });
  return data;
}

// Activity Types CRUD
export async function getActivityTypes(): Promise<ActivityType[]> {
  const { data } = await apiClient.get<ActivityType[]>('/activities/types/all');
  return data;
}

export async function getActivityType(id: number): Promise<ActivityType> {
  const { data } = await apiClient.get<ActivityType>(`/activities/types/${id}`);
  return data;
}

export async function createActivityType(
  typeData: CreateActivityTypeDto
): Promise<ActivityType> {
  const { data } = await apiClient.post<ActivityType>('/activities/types', typeData);
  return data;
}

export async function updateActivityType(
  id: number,
  typeData: UpdateActivityTypeDto
): Promise<ActivityType> {
  const { data } = await apiClient.patch<ActivityType>(`/activities/types/${id}`, typeData);
  return data;
}

export async function deleteActivityType(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/activities/types/${id}`);
  return data;
}
