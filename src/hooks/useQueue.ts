import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, formatApiError } from '../lib/api';
import { useQueueStore } from '../stores/queue';
import { realtimeClient } from '../lib/socket';
import type { Visit, CreateVisitRequest } from '../types';

// Hook pour obtenir la file d'attente
export function useQueue() {
  const { setQueue } = useQueueStore();
  
  return useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const queue = await api.getQueue();
      setQueue(queue);
      return queue;
    },
    staleTime: 30 * 1000, // 30 secondes (mise à jour fréquente)
    refetchInterval: 60 * 1000, // Refetch toutes les 60 secondes en backup du WebSocket
  });
}

// Hook pour créer une visite (ajouter un patient à la file)
export function useCreateVisit() {
  const queryClient = useQueryClient();
  const { addVisit } = useQueueStore();
  
  return useMutation({
    mutationFn: (data: CreateVisitRequest) => api.createVisit(data),
    onSuccess: (newVisit) => {
      // Mise à jour optimiste du store local
      addVisit(newVisit);
      
      // Invalider la file d'attente pour refetch depuis le serveur
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      
      // Notifier via WebSocket
      realtimeClient.notifyVisitAction('created', newVisit.id, newVisit);
      
      if (newVisit.patient) {
        toast.success(`${newVisit.patient.prenom} ${newVisit.patient.nom} ajouté à la file d'attente`);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout à la file:', error);
      toast.error(formatApiError(error));
    },
  });
}

// Hook pour appeler un patient
export function useCallPatient() {
  const queryClient = useQueryClient();
  const { updateVisit } = useQueueStore();
  
  return useMutation({
    mutationFn: (visitId: string) => api.callPatient(visitId),
    onMutate: async (visitId) => {
      // Annuler les refetch en cours
      await queryClient.cancelQueries({ queryKey: ['queue'] });
      
      // Mise à jour optimiste
      const previousQueue = queryClient.getQueryData<Visit[]>(['queue']);
      updateVisit(visitId, { 
        statut: 'appele', 
        heure_appel: new Date().toISOString() 
      });
      
      return { previousQueue };
    },
    onSuccess: (updatedVisit) => {
      // Notifier via WebSocket
      realtimeClient.notifyVisitAction('called', updatedVisit.id, updatedVisit);
      
      if (updatedVisit.patient) {
        toast.success(`${updatedVisit.patient.prenom} ${updatedVisit.patient.nom} appelé`);
      }
    },
    onError: (error, visitId, context) => {
      // Restaurer l'état précédent en cas d'erreur
      if (context?.previousQueue) {
        queryClient.setQueryData(['queue'], context.previousQueue);
      }
      
      console.error('Erreur lors de l\'appel du patient:', error);
      toast.error(formatApiError(error));
    },
    onSettled: () => {
      // Toujours refetch pour s'assurer de la cohérence
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}

// Hook pour démarrer une consultation
export function useStartConsultation() {
  const queryClient = useQueryClient();
  const { updateVisit, setNowServing } = useQueueStore();
  
  return useMutation({
    mutationFn: (visitId: string) => api.startConsultation(visitId),
    onMutate: async (visitId) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] });
      
      const previousQueue = queryClient.getQueryData<Visit[]>(['queue']);
      const visit = previousQueue?.find(v => v.id === visitId);
      
      updateVisit(visitId, { 
        statut: 'en_consultation', 
        heure_debut_consult: new Date().toISOString() 
      });
      
      if (visit) {
        setNowServing(visit);
      }
      
      return { previousQueue };
    },
    onSuccess: (updatedVisit) => {
      realtimeClient.notifyVisitAction('consultation_started', updatedVisit.id, updatedVisit);
      
      if (updatedVisit.patient) {
        toast.success(`Consultation de ${updatedVisit.patient.prenom} ${updatedVisit.patient.nom} démarrée`);
      }
    },
    onError: (error, visitId, context) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(['queue'], context.previousQueue);
      }
      
      console.error('Erreur lors du démarrage de la consultation:', error);
      toast.error(formatApiError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}

// Hook pour terminer une consultation
export function useFinishConsultation() {
  const queryClient = useQueryClient();
  const { removeVisit, setNowServing } = useQueueStore();
  
  return useMutation({
    mutationFn: ({ visitId, notes }: { visitId: string; notes?: string }) => 
      api.finishConsultation(visitId, notes),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] });
      
      const previousQueue = queryClient.getQueryData<Visit[]>(['queue']);
      
      // Retirer de la file d'attente
      removeVisit(variables.visitId);
      setNowServing(null);
      
      return { previousQueue };
    },
    onSuccess: (updatedVisit) => {
      realtimeClient.notifyVisitAction('consultation_finished', updatedVisit.id, updatedVisit);
      
      // Invalider l'historique du patient
      if (updatedVisit.patient_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['patients', updatedVisit.patient_id, 'history'] 
        });
      }
      
      if (updatedVisit.patient) {
        toast.success(`Consultation de ${updatedVisit.patient.prenom} ${updatedVisit.patient.nom} terminée`);
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(['queue'], context.previousQueue);
      }
      
      console.error('Erreur lors de la fin de consultation:', error);
      toast.error(formatApiError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

// Hook pour passer un patient (skip)
export function useSkipPatient() {
  const queryClient = useQueryClient();
  const { updateVisit } = useQueueStore();
  
  return useMutation({
    mutationFn: (visitId: string) => api.skipPatient(visitId),
    onMutate: async (visitId) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] });
      
      const previousQueue = queryClient.getQueryData<Visit[]>(['queue']);
      updateVisit(visitId, { statut: 'attente' }); // Remettre en attente
      
      return { previousQueue };
    },
    onSuccess: (updatedVisit) => {
      realtimeClient.notifyVisitAction('skipped', updatedVisit.id, updatedVisit);
      
      if (updatedVisit.patient) {
        toast.info(`${updatedVisit.patient.prenom} ${updatedVisit.patient.nom} passé - remis en file`);
      }
    },
    onError: (error, visitId, context) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(['queue'], context.previousQueue);
      }
      
      console.error('Erreur lors du passage du patient:', error);
      toast.error(formatApiError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}

// Hook pour annuler une visite
export function useCancelVisit() {
  const queryClient = useQueryClient();
  const { removeVisit } = useQueueStore();
  
  return useMutation({
    mutationFn: (visitId: string) => api.cancelVisit(visitId),
    onMutate: async (visitId) => {
      await queryClient.cancelQueries({ queryKey: ['queue'] });
      
      const previousQueue = queryClient.getQueryData<Visit[]>(['queue']);
      removeVisit(visitId);
      
      return { previousQueue, visitId };
    },
    onSuccess: (_, visitId) => {
      realtimeClient.notifyVisitAction('cancelled', visitId);
      toast.success('Visite annulée');
    },
    onError: (error, visitId, context) => {
      if (context?.previousQueue) {
        queryClient.setQueryData(['queue'], context.previousQueue);
      }
      
      console.error('Erreur lors de l\'annulation de la visite:', error);
      toast.error(formatApiError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });
}