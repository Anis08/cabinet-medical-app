import React from 'react';
import { Menu, Bell, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../stores/auth';
import { useLogout } from '../../hooks/useAuth';
import { useQueueStore } from '../../stores/queue';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();
  const { getWaitingCount, getInConsultationCount } = useQueueStore();
  const logoutMutation = useLogout();

  const waitingCount = getWaitingCount();
  const inConsultationCount = getInConsultationCount();

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logoutMutation.mutate();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu mobile et titre */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-4 lg:ml-0">
              <h1 className="text-lg font-semibold text-gray-900">
                Gestion Cabinet Médical
              </h1>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  En attente: <span className="font-semibold">{waitingCount}</span>
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  En consultation: <span className="font-semibold">{inConsultationCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-5 w-5" />
              {waitingCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {waitingCount > 9 ? '9+' : waitingCount}
                  </span>
                </span>
              )}
            </button>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Se déconnecter"
              >
                {logoutMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <LogOut className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}