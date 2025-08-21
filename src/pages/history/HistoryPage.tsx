import React from 'react';
import { History, Filter, Calendar } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function HistoryPage() {
  return (
    <div className="py-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
        <p className="text-gray-600">
          Consulter l'historique complet des consultations
        </p>
      </div>

      {/* Page en construction */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <History className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Historique - En développement
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Cette page permettra de consulter l'historique complet des consultations 
          avec filtrage avancé par date, médecin, patient, et type de consultation.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-green-900 mb-2">
                Fonctionnalités prévues :
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Filtrage par période (jour, semaine, mois)</li>
                <li>• Recherche par nom de patient ou médecin</li>
                <li>• Filtrage par type de consultation ou pathologie</li>
                <li>• Affichage des durées de consultation</li>
                <li>• Export des données au format CSV/Excel</li>
                <li>• Vue timeline et vue tableau</li>
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