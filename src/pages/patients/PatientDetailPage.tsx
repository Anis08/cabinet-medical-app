import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, UserPlus, Calendar, Phone, Weight, User } from 'lucide-react';
import { usePatient, usePatientHistory } from '../../hooks/usePatients';
import { usePermissions } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: patient, isLoading: patientLoading, error } = usePatient(id);
  const { data: history, isLoading: historyLoading } = usePatientHistory(id);
  const { canUpdatePatient } = usePermissions();

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

  if (error || !patient) {
    return (
      <div className="py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Patient non trouvé
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Le patient demandé n'existe pas ou a été supprimé.</p>
              </div>
              <div className="mt-4">
                <Link
                  to="/patients"
                  className="text-sm bg-red-100 text-red-800 rounded-md px-2 py-1 hover:bg-red-200"
                >
                  Retour à la liste des patients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des patients
        </button>
        
        <div className="flex space-x-3">
          <Link
            to={`/queue?add=${patient.id}`}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter à la file
          </Link>
          
          {canUpdatePatient() && (
            <Link
              to={`/patients/${patient.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          )}
        </div>
      </div>

      {/* Informations du patient */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.prenom} {patient.nom}
              </h1>
              <p className="text-gray-600">
                Patient ID: {patient.id}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Âge</p>
                <p className="text-lg text-gray-900">{patient.age} ans</p>
              </div>
            </div>

            <div className="flex items-center">
              <Weight className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Poids</p>
                <p className="text-lg text-gray-900">{patient.poids} kg</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="text-lg text-gray-900">{patient.phone || '-'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-500">Enregistré le</p>
                <p className="text-lg text-gray-900">
                  {format(new Date(patient.created_at), 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Maladie principale</h3>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{patient.maladie}</p>
          </div>

          {patient.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Notes complémentaires</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{patient.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Historique des visites */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Historique des consultations</h2>
        </div>
        
        <div className="px-6 py-6">
          {historyLoading ? (
            <div className="text-center py-8">
              <LoadingSpinner />
              <p className="mt-4 text-gray-600">Chargement de l'historique...</p>
            </div>
          ) : !history?.length ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune consultation
              </h3>
              <p className="text-gray-600">
                Ce patient n'a pas encore été consulté.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((visit) => (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${
                        visit.statut === 'termine' ? 'bg-green-500' :
                        visit.statut === 'en_consultation' ? 'bg-blue-500' :
                        visit.statut === 'annule' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {visit.statut.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        visit.niveau_urgence === 'critique' ? 'bg-red-100 text-red-800' :
                        visit.niveau_urgence === 'prioritaire' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {visit.niveau_urgence}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(visit.heure_arrivee), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </div>
                  </div>
                  
                  {visit.medecin && (
                    <p className="text-sm text-gray-600">
                      <strong>Médecin :</strong> {visit.medecin.name}
                    </p>
                  )}
                  
                  {visit.heure_debut_consult && visit.heure_fin_consult && (
                    <p className="text-sm text-gray-600">
                      <strong>Durée :</strong>{' '}
                      {Math.round(
                        (new Date(visit.heure_fin_consult).getTime() - 
                         new Date(visit.heure_debut_consult).getTime()) / (1000 * 60)
                      )} minutes
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}