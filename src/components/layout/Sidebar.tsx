import React, { Fragment } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  X, 
  Home, 
  Users, 
  Clock, 
  History, 
  BarChart3, 
  Settings,
  Stethoscope,
  UserPlus
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { clsx } from 'clsx';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

export function Sidebar({ open = true, onClose, mobile = false }: SidebarProps) {
  const { user, hasRole } = useAuthStore();
  const location = useLocation();

  const navigation = [
    { 
      name: 'Tableau de bord', 
      href: '/', 
      icon: Home,
      roles: ['admin', 'medecin', 'secretaire'] 
    },
    { 
      name: 'Patients', 
      href: '/patients', 
      icon: Users,
      roles: ['admin', 'medecin', 'secretaire'] 
    },
    { 
      name: 'File d\'attente', 
      href: '/queue', 
      icon: Clock,
      roles: ['admin', 'medecin', 'secretaire'] 
    },
    { 
      name: 'Historique', 
      href: '/history', 
      icon: History,
      roles: ['admin', 'medecin', 'secretaire'] 
    },
    { 
      name: 'Statistiques', 
      href: '/stats', 
      icon: BarChart3,
      roles: ['admin', 'medecin'] 
    },
    { 
      name: 'Administration', 
      href: '/admin', 
      icon: Settings,
      roles: ['admin'] 
    },
  ];

  const quickActions = [
    {
      name: 'Nouveau patient',
      href: '/patients/new',
      icon: UserPlus,
      roles: ['admin', 'secretaire'],
    },
  ];

  // Filtrer la navigation selon les rôles
  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role as any))
  );

  const filteredQuickActions = quickActions.filter(action =>
    action.roles.some(role => hasRole(role as any))
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo et titre */}
      <div className="flex items-center px-4 py-6">
        <Stethoscope className="h-8 w-8 text-blue-600" />
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-gray-900">
            Cabinet Médical
          </h1>
          <p className="text-sm text-gray-500">
            {user?.name} • {user?.role === 'admin' ? 'Admin' : user?.role === 'medecin' ? 'Médecin' : 'Secrétaire'}
          </p>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 space-y-1">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => clsx(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              onClick={mobile ? onClose : undefined}
            >
              <Icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Actions rapides */}
      {filteredQuickActions.length > 0 && (
        <div className="px-4 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Actions rapides
          </h3>
          <div className="space-y-1">
            {filteredQuickActions.map((action) => {
              const Icon = action.icon;
              
              return (
                <NavLink
                  key={action.name}
                  to={action.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  onClick={mobile ? onClose : undefined}
                >
                  <Icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-blue-500" />
                  {action.name}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </p>
      </div>
    </div>
  );

  if (mobile) {
    if (!open) return null;
    
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <div className="fixed inset-0 flex z-40">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <span className="sr-only">Fermer la sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <SidebarContent />
    </div>
  );
}