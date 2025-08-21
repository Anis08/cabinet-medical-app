import React from 'react';
import { Monitor, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function DisplayPage() {
  return (
    <div className="display-screen min-h-screen p-8">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Écran d'affichage public</h1>
        <p className="text-xl opacity-90">
          Cabinet Médical - File d'attente
        </p>
      </div>

      {/* Page en construction */}
      <div className="max-w-4xl mx-auto text-center">
        <Monitor className="h-24 w-24 mx-auto mb-8 opacity-80" />
        <h2 className="text-3xl font-semibold mb-6">
          Écran connecté - En développement
        </h2>
        <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
          Cet écran affichera en temps réel le patient actuellement en consultation 
          et les 3-5 prochains patients dans la file d'attente, sans informations médicales sensibles.
        </p>
        
        <div className="bg-black bg-opacity-20 rounded-xl p-8 mb-12 backdrop-blur-sm">
          <div className="flex items-start justify-center">
            <Clock className="h-6 w-6 mt-1 mr-4 opacity-80" />
            <div className="text-left">
              <h3 className="text-lg font-medium mb-4">
                Fonctionnalités prévues :
              </h3>
              <ul className="text-base space-y-2 opacity-90">
                <li>• Affichage plein écran optimisé pour TV/moniteur</li>
                <li>• Patient en cours de consultation (nom/prénom uniquement)</li>
                <li>• Liste des 3-5 prochains patients</li>
                <li>• Horloge en temps réel</li>
                <li>• Mise à jour automatique via WebSocket</li>
                <li>• Design moderne avec grande typographie</li>
                <li>• Respect de la confidentialité (pas de données médicales)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Aperçu de l'interface */}
        <div className="bg-black bg-opacity-30 rounded-2xl p-12 mb-12 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-8">
              <p className="text-lg opacity-75 mb-4">Patient en consultation</p>
              <p className="now-serving">Dr. Martin DUBOIS</p>
            </div>
            
            <div className="border-t border-white border-opacity-30 pt-8">
              <p className="text-lg opacity-75 mb-6">Prochains patients</p>
              <div className="space-y-4 next-patients">
                <p>1. Marie BERNARD</p>
                <p>2. Jean MOREAU</p>
                <p>3. Sophie PETIT</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-3" />
          <span className="text-lg opacity-80">Implémentation en cours...</span>
        </div>
      </div>

      {/* Horloge */}
      <div className="absolute top-8 right-8">
        <div className="clock">
          {new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}