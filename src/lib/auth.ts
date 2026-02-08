// Admin roles that can access the dashboard
const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'PRIEST', 'DEACON'];

export interface User {
  code: number;
  username: string;
  noms: string;
  prenoms: string;
  roles: Array<{
    code: number;
    libelle: string;
  }>;
}

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  return !!token;
};

export const isAdmin = (): boolean => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;

  try {
    const user: User = JSON.parse(userStr);

    // If roles array is empty, check username (backend has validated access)
    if (!user.roles || user.roles.length === 0) {
      // Allow access for users like 'superadmin' or any user with 'admin' in username
      return user.username.toLowerCase().includes('admin');
    }

    // Check if user has admin roles
    return user.roles.some((role) => ADMIN_ROLES.includes(role.libelle));
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('token_type');
  localStorage.removeItem('expires_in');
  window.location.href = '/login';
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const getUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getUserRoles = (): string[] => {
  const user = getUser();
  if (!user) return [];

  // If roles array is empty or undefined, derive role from username
  if (!user.roles || user.roles.length === 0) {
    if (user.username.toLowerCase().includes('superadmin')) {
      return ['SUPER_ADMIN'];
    }
    if (user.username.toLowerCase().includes('admin')) {
      return ['ADMIN'];
    }
    return ['UTILISATEUR'];
  }

  return user.roles.map((role) => role.libelle);
};
