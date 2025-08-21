import React from 'react';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function QueuePage() {
  return (
    <div className="py-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">File d'attente</h1>
        <p className="text-gray-600">
          Gérer la file d'attente des patients en temps réel
        </p>
      </div>

      {/* Page en construction */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Clock className="h-16 w-16 text-blue-500 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          File d'attente - En développement
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Cette page permettra de gérer la file d'attente des patients avec priorisation 
          (critique, prioritaire, standard), actions en temps réel (appeler, démarrer consultation, 
          terminer), et mise à jour automatique via WebSocket.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Fonctionnalités prévues :
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tri automatique par priorité et heure d'arrivée</li>
                <li>• Actions : Appeler, Démarrer consultation, Terminer, Passer, Annuler</li>
                <li>• Minuterie temps d'attente en temps réel</li>
                <li>• Badges de priorité visuels</li>
                <li>• Système anti-famine (promotion automatique)</li>
                <li>• Synchronisation temps réel entre utilisateurs</li>
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