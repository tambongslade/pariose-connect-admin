import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Church, Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import churchImage from '../assets/church.jpg';
import { login } from '../lib/api/auth';
import { isAdmin } from '../lib/auth';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'PRIEST', 'DEACON'];

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login({ username, password });

      // Store auth data first
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token_type', response.token_type);
      localStorage.setItem('expires_in', response.expires_in.toString());

      // Check if user has admin role or is an admin user
      const userRoles = response.user.roles?.map((role) => role.libelle) || [];
      const hasAdminRole = userRoles.some((role) => ADMIN_ROLES.includes(role));
      const isAdminUsername = response.user.username.toLowerCase().includes('admin');

      // Allow access if:
      // 1. User has admin role in roles array, OR
      // 2. Roles array is empty and username contains 'admin' (like superadmin), OR
      // 3. User is verified as admin by isAdmin() function
      if (!hasAdminRole && !isAdminUsername && userRoles.length > 0) {
        // User has roles but none are admin roles
        localStorage.clear();
        setError(
          "Accès refusé. Vous n'avez pas les permissions nécessaires pour accéder au tableau de bord administrateur."
        );
        setIsLoading(false);
        return;
      }

      // Verify admin status
      if (isAdmin()) {
        navigate('/', { replace: true });
      } else {
        localStorage.clear();
        setError('Erreur de configuration des rôles.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      } else if (err.response?.status === 404) {
        setError('Utilisateur non trouvé.');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Church Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            src={churchImage}
            alt="Église"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Church className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Parriose Connect</h1>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Bienvenue dans votre espace administrateur
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Gérez votre paroisse de manière simple et efficace. Restez connecté avec votre communauté.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <div>
                <p className="font-semibold">Gestion des membres</p>
                <p className="text-sm text-white/80">Suivez et gérez tous vos fidèles</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <div>
                <p className="font-semibold">Organisation des événements</p>
                <p className="text-sm text-white/80">Planifiez messes et activités paroissiales</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-xs">✓</span>
              </div>
              <div>
                <p className="font-semibold">Suivi des dons</p>
                <p className="text-sm text-white/80">Gérez les offrandes et contributions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-xl mb-4">
              <Church className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Parriose Connect</h1>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
              <p className="text-gray-600">Accédez à votre tableau de bord</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="tambongslade"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                  Mot de passe oublié?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Vous n'avez pas de compte?{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Contactez l'administrateur
                </a>
              </p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2026 Parriose Connect. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
}
