import React from 'react';
import { useAuthStore } from '../../stores/auth';
import { AccessDenied } from '../ui/AccessDenied';
import type { Role } from '../../types';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, hasRole } = useAuthStore();

  // Vérifier si l'utilisateur a l'un des rôles autorisés
  const hasRequiredRole = allowedRoles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <AccessDenied 
        message="Vous n'avez pas les permissions nécessaires pour accéder à cette page."
        allowedRoles={allowedRoles}
        userRole={user?.role}
      />
    );
  }

  return <>{children}</>;
}