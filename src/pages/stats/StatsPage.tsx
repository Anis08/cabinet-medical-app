import React from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function StatsPage() {
  return (
    <div className="py-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600">
          Analyser les performances et tendances du cabinet
        </p>
      </div>

      {/* Page en construction */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <BarChart3 className="h-16 w-16 text-purple-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Statistiques - En développement
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Cette page affichera des graphiques détaillés et des métriques de performance 
          pour analyser l'activité du cabinet médical.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-purple-900 mb-2">
                Métriques disponibles :
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Nombre de patients par jour/semaine/mois</li>
                <li>• Temps d'attente moyen et médian</li>
                <li>• Distribution des temps d'attente (histogramme)</li>
                <li>• Temps entre patients par médecin</li>
                <li>• Taux de no-show et d'annulations</li>
                <li>• Graphiques avec Recharts (courbes, barres, aires)</li>
                <li>• Export des données statistiques</li>
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