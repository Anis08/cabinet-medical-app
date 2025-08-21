import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../../types';

interface AccessDeniedProps {
  message?: string;
  allowedRoles?: Role[];
  userRole?: Role;
}

export function AccessDenied({ 
  message = "Accès refusé", 
  allowedRoles = [], 
  userRole 
}: AccessDeniedProps) {
  const navigate = useNavigate();

  const roleNames = {
    admin: 'Administrateur',
    medecin: 'Médecin',
    secretaire: 'Secrétaire',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accès refusé
          </h1>
          <p className="text-gray-600">
            {message}
          </p>
        </div>

        {allowedRoles.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Rôles autorisés :</strong>
            </p>
            <ul className="text-sm text-gray-600">
              {allowedRoles.map(role => (
                <li key={role} className="inline-block mr-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {roleNames[role]}
                  </span>
                </li>
              ))}
            </ul>
            {userRole && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Votre rôle :</strong> 
                <span className="ml-1 px-2 py-1 bg-gray-200 text-gray-800 rounded-full">
                  {roleNames[userRole]}
                </span>
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
}