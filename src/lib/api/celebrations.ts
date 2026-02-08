import { apiClient } from './client';

export interface Celebration {
  code: number;
  libelle: string;
  granularite?: string;
  code_horaire?: string;
  code_type?: string;
  code_unite_ecclesiale: number;
  date_creation: string;
  date_modification: string;
  ecclesiasticalUnit?: {
    code: number;
    libelle: string;
    titre?: string;
    adresse?: string;
  };
  intentions?: MassIntention[];
}

export interface MassIntention {
  code: number;
  intention_messe: string;
  code_celebration_eucharistique: number;
  montant_verse?: string;
  date_versement?: string;
  code_createur: number;
  code_modificateur?: number;
  date_creation: string;
  date_modification: string;
  celebration?: {
    code: number;
    libelle: string;
    code_horaire?: string;
  };
  creator?: {
    code: number;
    username: string;
    noms?: string;
    prenoms?: string;
  };
}

export interface CreateCelebrationDto {
  libelle: string;
  granularite?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';
  code_horaire?: string;
  code_type?: 'regular' | 'special' | 'feast' | 'wedding' | 'funeral' | 'baptism';
  code_unite_ecclesiale: number;
}

export interface UpdateCelebrationDto {
  libelle?: string;
  granularite?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'once';
  code_horaire?: string;
  code_type?: 'regular' | 'special' | 'feast' | 'wedding' | 'funeral' | 'baptism';
}

export interface CreateMassIntentionDto {
  intention_messe: string;
  code_celebration_eucharistique: number;
  montant_verse?: number;
  date_versement?: string;
}

export interface UpdateMassIntentionDto {
  intention_messe?: string;
  montant_verse?: number;
  date_versement?: string;
}

export interface GetCelebrationsParams {
  search?: string;
  code_unite_ecclesiale?: number;
  granularite?: string;
  code_type?: string;
  page?: number;
  limit?: number;
}

export interface CelebrationsResponse {
  data: Celebration[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CelebrationStats {
  total: number;
  upcoming: number;
  past: number;
  byType: Record<string, number>;
  byFrequency: Record<string, number>;
}

// Celebrations CRUD
export async function getCelebrations(params?: GetCelebrationsParams): Promise<CelebrationsResponse> {
  const { data } = await apiClient.get<CelebrationsResponse>('/celebrations', { params });
  return data;
}

export async function getCelebration(id: number): Promise<Celebration> {
  const { data } = await apiClient.get<Celebration>(`/celebrations/${id}`);
  return data;
}

export async function createCelebration(celebrationData: CreateCelebrationDto): Promise<Celebration> {
  const { data } = await apiClient.post<Celebration>('/celebrations', celebrationData);
  return data;
}

export async function updateCelebration(
  id: number,
  celebrationData: UpdateCelebrationDto
): Promise<Celebration> {
  const { data } = await apiClient.patch<Celebration>(`/celebrations/${id}`, celebrationData);
  return data;
}

export async function deleteCelebration(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/celebrations/${id}`);
  return data;
}

export async function getCelebrationStats(): Promise<CelebrationStats> {
  const { data } = await apiClient.get<CelebrationStats>('/celebrations/stats');
  return data;
}

// Mass Intentions CRUD
export async function createMassIntention(intentionData: CreateMassIntentionDto): Promise<MassIntention> {
  const { data } = await apiClient.post<MassIntention>('/celebrations/intentions', intentionData);
  return data;
}

export async function getMassIntentions(celebrationId?: number): Promise<MassIntention[]> {
  const { data } = await apiClient.get<MassIntention[]>('/celebrations/intentions/all', {
    params: { celebrationId },
  });
  return data;
}

export async function getMassIntention(id: number): Promise<MassIntention> {
  const { data } = await apiClient.get<MassIntention>(`/celebrations/intentions/${id}`);
  return data;
}

export async function updateMassIntention(
  id: number,
  intentionData: UpdateMassIntentionDto
): Promise<MassIntention> {
  const { data } = await apiClient.patch<MassIntention>(
    `/celebrations/intentions/${id}`,
    intentionData
  );
  return data;
}

export async function deleteMassIntention(id: number): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/celebrations/intentions/${id}`);
  return data;
}
