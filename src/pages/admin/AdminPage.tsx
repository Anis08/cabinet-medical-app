import React from 'react';
import { Settings, Users, Shield } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function AdminPage() {
  return (
    <div className="py-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600">
          Gérer les utilisateurs, rôles et paramètres système
        </p>
      </div>

      {/* Page en construction */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Settings className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Administration - En développement
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Panel d'administration pour gérer les utilisateurs, leurs rôles et permissions, 
          ainsi que les paramètres globaux de l'application.
        </p>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-indigo-600 mt-0.5 mr-3" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-indigo-900 mb-2">
                Fonctionnalités prévues :
              </h3>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Gestion des utilisateurs (CRUD)</li>
                <li>• Attribution et modification des rôles</li>
                <li>• Configuration des niveaux de priorité</li>
                <li>• Paramètres anti-famine (délais de promotion)</li>
                <li>• Logs d'audit et traçabilité</li>
                <li>• Sauvegarde et restauration des données</li>
                <li>• Configuration RGPD et rétention</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span className="text-gray-500">Implémentation en cours...</span>
        </div>
      </div>
    </div>
  );
}