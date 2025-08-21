import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { api } from '../../lib/api';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, token, user } = useAuthStore();
  const location = useLocation();

  // Configurer le token pour les requêtes API
  useEffect(() => {
    if (token) {
      api.setToken(token);
    }
  }, [token]);

  // Si pas authentifié, rediriger vers login
  if (!isAuthenticated || !token) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Si authentifié mais pas d'utilisateur (cas de reprise de session), afficher loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}