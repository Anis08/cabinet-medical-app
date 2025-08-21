import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Helpers
  hasRole: (role: Role) => boolean;
  hasPermission: (permission: string) => boolean;
}

// Mapping des rôles aux permissions (importé depuis types)
import { ROLE_PERMISSIONS } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        
        // Nettoyer le localStorage des autres données si nécessaire
        localStorage.removeItem('cabinet-medical-auth');
      },
      
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },
      
      hasRole: (role: Role): boolean => {
        const { user } = get();
        return user?.role === role;
      },
      
      hasPermission: (permission: string): boolean => {
        const { user } = get();
        if (!user) return false;
        
        const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
        return rolePermissions.includes(permission);
      },
    }),
    {
      name: 'cabinet-medical-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);