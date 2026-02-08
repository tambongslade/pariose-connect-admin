import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Church,
  Megaphone,
  Building2,
  Settings,
  LogOut,
  Shield,
  Heart,
  MapPin,
  Sparkles,
  Languages,
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '../../lib/auth';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Utilisateurs', href: '/users', icon: Users },
  { name: 'Rôles', href: '/roles', icon: Shield },
  { name: 'Unités ecclésiales', href: '/ecclesiastical-units', icon: Building2 },
  { name: 'Activités', href: '/activities', icon: Calendar },
  { name: 'Messes', href: '/celebrations', icon: Church },
  { name: 'Confessions', href: '/confessions', icon: Heart },
  { name: 'Lieux saints', href: '/holy-places', icon: MapPin },
  { name: 'Objets sacrés', href: '/sacred-objects', icon: Sparkles },
  { name: 'Annonces', href: '/announcements', icon: Megaphone },
  { name: 'Langues', href: '/languages', icon: Languages },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Church className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Parriose</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={clsx('w-5 h-5', isActive ? 'text-indigo-600' : 'text-gray-500')} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-500" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
