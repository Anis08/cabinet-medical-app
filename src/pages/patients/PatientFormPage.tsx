import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePatient, useCreatePatient, useUpdatePatient } from '../../hooks/usePatients';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { PatientFormData } from '../../types';

// Schéma de validation
const patientSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  age: z.number().min(0, 'L\'âge doit être positif').max(150, 'Âge invalide'),
  poids: z.number().min(0.1, 'Le poids doit être positif').max(1000, 'Poids invalide'),
  maladie: z.string().min(2, 'Veuillez préciser la maladie'),
  notes: z.string().optional(),
  phone: z.string().optional(),
});

export default function PatientFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: patient, isLoading: patientLoading } = usePatient(id);
  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient || {
      nom: '',
      prenom: '',
      age: 0,
      poids: 0,
      maladie: '',
      notes: '',
      phone: '',
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (isEditing && id) {
        await updatePatientMutation.mutateAsync({ id, ...data });
      } else {
        await createPatientMutation.mutateAsync(data);
      }
      navigate('/patients');
    } catch (error) {
      // L'erreur est gérée par le hook
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (patientLoading) {
    return (
      <div className="py-6">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement du dossier patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des patients
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Modifier le patient' : 'Nouveau patient'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Modifier les informations du patient'
            : 'Ajouter un nouveau patient au cabinet'
          }
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                {...register('nom')}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom de famille"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                {...register('prenom')}
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Prénom"
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Âge *
              </label>
              <input
                {...register('age', { valueAsNumber: true })}
                type="number"
                min="0"
                max="150"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="poids" className="block text-sm font-medium text-gray-700">
                Poids (kg) *
              </label>
              <input
                {...register('poids', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.0"
              />
              {errors.poids && (
                <p className="mt-1 text-sm text-red-600">{errors.poids.message}</p>
              )}
            </div>
          </div>

          {/* Informations médicales */}
          <div>
            <label htmlFor="maladie" className="block text-sm font-medium text-gray-700">
              Maladie principale *
            </label>
            <input
              {...register('maladie')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Diagnostic ou motif de consultation"
            />
            {errors.maladie && (
              <p className="mt-1 text-sm text-red-600">{errors.maladie.message}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="06 12 34 56 78"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes complémentaires
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Informations complémentaires, allergies, traitements..."
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" className="mr-2 inline" />
              ) : (
                <Save className="h-4 w-4 mr-2 inline" />
              )}
              {isEditing ? 'Mettre à jour' : 'Créer le patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}