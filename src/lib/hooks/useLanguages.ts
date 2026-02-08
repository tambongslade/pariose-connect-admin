import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLanguages,
  getActiveLanguages,
  getDefaultLanguage,
  getLanguage,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  setDefaultLanguage,
  activateLanguage,
  deactivateLanguage,
  type CreateLanguageDto,
  type UpdateLanguageDto,
} from '../api/languages';

// Languages hooks
export function useLanguages() {
  return useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  });
}

export function useActiveLanguages() {
  return useQuery({
    queryKey: ['languages', 'active'],
    queryFn: getActiveLanguages,
  });
}

export function useDefaultLanguage() {
  return useQuery({
    queryKey: ['languages', 'default'],
    queryFn: getDefaultLanguage,
  });
}

export function useLanguage(code: string) {
  return useQuery({
    queryKey: ['languages', code],
    queryFn: () => getLanguage(code),
    enabled: !!code,
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (languageData: CreateLanguageDto) => createLanguage(languageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, data }: { code: string; data: UpdateLanguageDto }) =>
      updateLanguage(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deleteLanguage(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}

export function useSetDefaultLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => setDefaultLanguage(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}

export function useActivateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => activateLanguage(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}

export function useDeactivateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => deactivateLanguage(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
    },
  });
}
