import React from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface ConnectionStatusProps {
  isConnected: boolean;
  className?: string;
}

export function ConnectionStatus({ isConnected, className }: ConnectionStatusProps) {
  if (isConnected) {
    return null; // Ne rien afficher si connecté
  }

  return (
    <div className={clsx(
      'bg-yellow-50 border-l-4 border-yellow-400 p-4',
      className
    )}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <WifiOff className="h-4 w-4 text-yellow-600 mr-2" />
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Connexion temps réel interrompue</span>
              {' - Les données pourraient ne pas être à jour.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher le statut dans la barre latérale ou elsewhere
export function ConnectionIndicator({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center text-xs">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 text-green-500 mr-1" />
          <span className="text-green-600">Connecté</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500 mr-1" />
          <span className="text-red-600">Déconnecté</span>
        </>
      )}
    </div>
  );
}