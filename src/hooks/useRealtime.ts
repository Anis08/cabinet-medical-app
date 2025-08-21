import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { realtimeClient } from '../lib/socket';
import { useQueueStore } from '../stores/queue';
import { useAuthStore } from '../stores/auth';
import type { Visit } from '../types';

// Hook principal pour gérer la connexion temps réel
export function useRealtimeConnection(shouldConnect: boolean) {
  const { token } = useAuthStore();
  const { setConnected } = useQueueStore();

  useEffect(() => {
    if (!shouldConnect || !token) {
      realtimeClient.disconnect();
      setConnected(false);
      return;
    }

    // Se connecter au WebSocket
    realtimeClient.connect(token)
      .then(() => {
        console.log('🔌 Connexion temps réel établie');
        setConnected(true);
      })
      .catch((error) => {
        console.error('❌ Erreur de connexion temps réel:', error);
        setConnected(false);
      });

    // Nettoyage à la déconnexion du composant
    return () => {
      realtimeClient.disconnect();
      setConnected(false);
    };
  }, [shouldConnect, token, setConnected]);
}

// Hook pour écouter les mises à jour de la file d'attente
export function useQueueUpdates() {
  const queryClient = useQueryClient();
  const { setQueue } = useQueueStore();

  const handleQueueUpdate = useCallback((queue: Visit[]) => {
    console.log('📋 Mise à jour temps réel de la file d\'attente');
    
    // Mettre à jour le store local
    setQueue(queue);
    
    // Mettre à jour le cache React Query
    queryClient.setQueryData(['queue'], queue);
  }, [queryClient, setQueue]);

  useEffect(() => {
    const unsubscribe = realtimeClient.on('queue_update', handleQueueUpdate);
    return unsubscribe;
  }, [handleQueueUpdate]);
}

// Hook pour écouter les appels de patients
export function usePatientCalls() {
  const handlePatientCalled = useCallback((data: { 
    visit_id: string; 
    patient_nom: string; 
    patient_prenom: string; 
  }) => {
    console.log('📢 Patient appelé:', data.patient_prenom, data.patient_nom);
    
    // Notification toast
    toast.info(`Patient appelé: ${data.patient_prenom} ${data.patient_nom}`, {
      duration: 5000,
      action: {
        label: 'Voir',
        onClick: () => {
          // Optionnel: navigation vers la file d'attente
          window.location.hash = '#queue';
        }
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = realtimeClient.on('patient_called', handlePatientCalled);
    return unsubscribe;
  }, [handlePatientCalled]);
}

// Hook pour écouter les consultations
export function useConsultationUpdates() {
  const queryClient = useQueryClient();
  const { setNowServing } = useQueueStore();

  const handleConsultationStarted = useCallback((data: { 
    visit_id: string; 
    medecin_id: string; 
  }) => {
    console.log('🩺 Consultation démarrée:', data);
    
    // Mettre à jour le patient en cours
    const queue = queryClient.getQueryData<Visit[]>(['queue']);
    const visit = queue?.find(v => v.id === data.visit_id);
    if (visit) {
      setNowServing(visit);
    }
    
    // Invalider les queries pertinentes
    queryClient.invalidateQueries({ queryKey: ['queue'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
  }, [queryClient, setNowServing]);

  const handleConsultationFinished = useCallback((data: { 
    visit_id: string; 
    duree: number; 
  }) => {
    console.log('✅ Consultation terminée:', data);
    
    // Retirer le patient en cours
    setNowServing(null);
    
    // Invalider les queries
    queryClient.invalidateQueries({ queryKey: ['queue'] });
    queryClient.invalidateQueries({ queryKey: ['stats'] });
    queryClient.invalidateQueries({ queryKey: ['history'] });
    
    // Notification de fin de consultation
    toast.success(`Consultation terminée (${data.duree} min)`, {
      duration: 3000,
    });
  }, [queryClient, setNowServing]);

  useEffect(() => {
    const unsubscribeStart = realtimeClient.on('consultation_started', handleConsultationStarted);
    const unsubscribeFinish = realtimeClient.on('consultation_finished', handleConsultationFinished);
    
    return () => {
      unsubscribeStart();
      unsubscribeFinish();
    };
  }, [handleConsultationStarted, handleConsultationFinished]);
}

// Hook pour écouter l'état de la connexion
export function useConnectionStatus() {
  const { isConnected, setConnected } = useQueueStore();

  const handleConnected = useCallback(() => {
    console.log('✅ WebSocket connecté');
    setConnected(true);
  }, [setConnected]);

  const handleDisconnected = useCallback((data: { reason?: string }) => {
    console.log('🔌 WebSocket déconnecté:', data.reason);
    setConnected(false);
    
    // Notification seulement si ce n'est pas une déconnexion volontaire
    if (data.reason !== 'io client disconnect') {
      toast.warning('Connexion temps réel perdue - tentative de reconnexion...', {
        duration: 3000,
      });
    }
  }, [setConnected]);

  const handleError = useCallback((error: any) => {
    console.error('❌ Erreur WebSocket:', error);
    setConnected(false);
    
    toast.error('Erreur de connexion temps réel', {
      description: 'Certaines fonctionnalités peuvent être limitées',
      duration: 5000,
    });
  }, [setConnected]);

  useEffect(() => {
    const unsubscribeConnected = realtimeClient.on('connected', handleConnected);
    const unsubscribeDisconnected = realtimeClient.on('disconnected', handleDisconnected);
    const unsubscribeError = realtimeClient.on('error', handleError);
    
    return () => {
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeError();
    };
  }, [handleConnected, handleDisconnected, handleError]);

  return {
    isConnected,
    connectionState: realtimeClient.connectionState,
  };
}

// Hook complet combinant tous les listeners temps réel
export function useRealtimeListeners() {
  useQueueUpdates();
  usePatientCalls();
  useConsultationUpdates();
  
  const connectionStatus = useConnectionStatus();
  
  return connectionStatus;
}

// Hook pour l'écran d'affichage public
export function useDisplayScreen() {
  const { queue, nowServing } = useQueueStore();

  useEffect(() => {
    // Rejoindre la room d'affichage
    realtimeClient.joinDisplay();
    
    return () => {
      realtimeClient.leaveDisplay();
    };
  }, []);

  // Utiliser les listeners temps réel
  useQueueUpdates();

  // Calculer les prochains patients (3-5 suivants)
  const nextPatients = queue
    .filter(visit => visit.statut === 'attente')
    .slice(0, 5);

  return {
    nowServing,
    nextPatients,
    queueLength: queue.length,
  };
}

// Hook utilitaire pour forcer une reconnexion
export function useForceReconnect() {
  const { token } = useAuthStore();
  
  return useCallback(() => {
    if (token) {
      realtimeClient.disconnect();
      setTimeout(() => {
        realtimeClient.connect(token);
      }, 1000);
    }
  }, [token]);
}