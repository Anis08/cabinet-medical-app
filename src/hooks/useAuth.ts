import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api, formatApiError } from '../lib/api';
import { useAuthStore } from '../stores/auth';
import { realtimeClient } from '../lib/socket';
import type { LoginRequest, User } from '../types';

// Hook pour la connexion
export function useLogin() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials: LoginRequest) => api.login(credentials),
    onSuccess: (response) => {
      // Sauvegarder l'authentification
      setAuth(response.user, response.token);
      
      // Configurer le token pour les requêtes API
      api.setToken(response.token);
      
      // Se connecter au WebSocket
      realtimeClient.connect(response.token).catch(console.error);
      
      // Rediriger vers le dashboard
      navigate('/', { replace: true });
      
      toast.success(`Bienvenue, ${response.user.name} !`);
    },
    onError: (error) => {
      console.error('Erreur de connexion:', error);
      toast.error(formatApiError(error));
    },
  });
}

// Hook pour la déconnexion
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout: clearAuth } = useAuthStore();
  
  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      // Nettoyer l'état
      clearAuth();
      api.setToken(null);
      realtimeClient.disconnect();
      
      // Nettoyer le cache React Query
      queryClient.clear();
      
      // Rediriger vers la page de connexion
      navigate('/login', { replace: true });
      
      toast.success('Déconnexion réussie');
    },
    onError: (error) => {
      // Même en cas d'erreur, on déconnecte localement
      clearAuth();
      api.setToken(null);
      realtimeClient.disconnect();
      queryClient.clear();
      navigate('/login', { replace: true });
      
      console.error('Erreur de déconnexion:', error);
    },
  });
}

// Hook pour obtenir l'utilisateur actuel
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => api.getCurrentUser(),
    enabled: isAuthenticated,
    initialData: user || undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error: any) => {
      // Si token expiré, déconnecter automatiquement
      if (error?.status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
      }
    },
  });
}

// Hook pour rafraîchir le token
export function useRefreshToken() {
  const { login: setAuth, user } = useAuthStore();
  
  return useMutation({
    mutationFn: () => api.refreshToken(),
    onSuccess: (response) => {
      if (user) {
        setAuth(user, response.token);
        api.setToken(response.token);
      }
    },
    onError: (error) => {
      console.error('Erreur de rafraîchissement du token:', error);
      // Token invalide, déconnecter
      const { logout } = useAuthStore.getState();
      logout();
    },
  });
}

// Hook pour vérifier les permissions
export function usePermissions() {
  const { hasRole, hasPermission } = useAuthStore();
  
  return {
    hasRole,
    hasPermission,
    canCreatePatient: () => hasPermission('patients:create'),
    canUpdatePatient: () => hasPermission('patients:update'),
    canDeletePatient: () => hasPermission('patients:delete'),
    canCallPatient: () => hasPermission('visits:call'),
    canStartConsultation: () => hasPermission('visits:start'),
    canFinishConsultation: () => hasPermission('visits:finish'),
    canViewStats: () => hasPermission('stats:read'),
    canExportStats: () => hasPermission('stats:export'),
    canManageUsers: () => hasPermission('users:create'),
  };
}