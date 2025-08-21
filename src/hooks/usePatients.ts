import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api, formatApiError } from '../lib/api';
import type { 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest,
  PatientFilters,
  Visit 
} from '../types';

// Hook pour obtenir la liste des patients
export function usePatients(filters?: PatientFilters) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => api.getPatients(filters),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook pour obtenir un patient par ID
export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => api.getPatient(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook pour obtenir l'historique d'un patient
export function usePatientHistory(id: string | undefined) {
  return useQuery({
    queryKey: ['patients', id, 'history'],
    queryFn: () => api.getPatientHistory(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook pour créer un patient
export function useCreatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => api.createPatient(data),
    onSuccess: (newPatient) => {
      // Invalider et refetch la liste des patients
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      
      toast.success(`Patient ${newPatient.prenom} ${newPatient.nom} créé avec succès`);
    },
    onError: (error) => {
      console.error('Erreur lors de la création du patient:', error);
      toast.error(formatApiError(error));
    },
  });
}

// Hook pour mettre à jour un patient
export function useUpdatePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }: UpdatePatientRequest) => api.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      // Mettre à jour le cache du patient spécifique
      queryClient.setQueryData(['patients', updatedPatient.id], updatedPatient);
      
      // Invalider la liste des patients pour la mettre à jour
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      
      toast.success(`Patient ${updatedPatient.prenom} ${updatedPatient.nom} mis à jour`);
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du patient:', error);
      toast.error(formatApiError(error));
    },
  });
}

// Hook pour supprimer un patient
export function useDeletePatient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deletePatient(id),
    onSuccess: (_, deletedId) => {
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: ['patients', deletedId] });
      
      // Invalider la liste des patients
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      
      toast.success('Patient supprimé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du patient:', error);
      toast.error(formatApiError(error));
    },
  });
}

// Hook pour rechercher des patients
export function useSearchPatients(searchTerm: string, enabled = true) {
  return useQuery({
    queryKey: ['patients', 'search', searchTerm],
    queryFn: () => api.getPatients({ search: searchTerm, limit: 10 }),
    enabled: enabled && searchTerm.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Hook utilitaire pour les actions optimistes sur les patients
export function usePatientOptimisticActions() {
  const queryClient = useQueryClient();
  
  const updatePatientOptimistic = (patientId: string, updates: Partial<Patient>) => {
    // Mise à jour optimiste du cache
    queryClient.setQueryData(['patients', patientId], (old: Patient | undefined) => {
      if (!old) return old;
      return { ...old, ...updates, updated_at: new Date().toISOString() };
    });
  };
  
  const revertPatientOptimistic = (patientId: string, originalData: Patient) => {
    // Restaurer les données originales en cas d'erreur
    queryClient.setQueryData(['patients', patientId], originalData);
  };
  
  return {
    updatePatientOptimistic,
    revertPatientOptimistic,
  };
}