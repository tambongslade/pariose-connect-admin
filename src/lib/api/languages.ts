import { apiClient } from './client';

export interface Language {
  code: string;
  name: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  is_default?: boolean;
  is_active?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  is_active?: boolean;
}

// Languages CRUD
export async function getLanguages(): Promise<Language[]> {
  const { data } = await apiClient.get<Language[]>('/languages');
  return data;
}

export async function getActiveLanguages(): Promise<Language[]> {
  const { data } = await apiClient.get<Language[]>('/languages/active');
  return data;
}

export async function getDefaultLanguage(): Promise<Language> {
  const { data } = await apiClient.get<Language>('/languages/default');
  return data;
}

export async function getLanguage(code: string): Promise<Language> {
  const { data } = await apiClient.get<Language>(`/languages/${code}`);
  return data;
}

export async function createLanguage(languageData: CreateLanguageDto): Promise<Language> {
  const { data } = await apiClient.post<Language>('/languages', languageData);
  return data;
}

export async function updateLanguage(
  code: string,
  languageData: UpdateLanguageDto
): Promise<Language> {
  const { data } = await apiClient.patch<Language>(`/languages/${code}`, languageData);
  return data;
}

export async function deleteLanguage(code: string): Promise<{ message: string }> {
  const { data } = await apiClient.delete<{ message: string }>(`/languages/${code}`);
  return data;
}

export async function setDefaultLanguage(code: string): Promise<Language> {
  const { data } = await apiClient.post<Language>(`/languages/${code}/set-default`);
  return data;
}

export async function activateLanguage(code: string): Promise<Language> {
  const { data } = await apiClient.post<Language>(`/languages/${code}/activate`);
  return data;
}

export async function deactivateLanguage(code: string): Promise<Language> {
  const { data } = await apiClient.post<Language>(`/languages/${code}/deactivate`);
  return data;
}
