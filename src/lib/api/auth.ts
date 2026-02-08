import { apiClient } from './client';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: {
    code: number;
    username: string;
    noms: string;
    prenoms: string;
    date_naissance: string;
    contact_1: string;
    contact_2: string;
    addresse: string;
    code_createur: number | null;
    code_modificateur: number | null;
    date_creation: string;
    date_modification: string;
    roles: Array<{
      code: number;
      libelle: string;
      code_createur: number | null;
      code_modificateur: number | null;
      date_creation: string;
      date_modification: string;
      permissions: any[];
    }>;
  };
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials);
  return data;
}
