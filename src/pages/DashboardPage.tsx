import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Activity, 
  TrendingUp, 
  UserPlus, 
  ClipboardList,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useQueueStore } from '../stores/queue';
import { useAuthStore } from '../stores/auth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const { user, hasPermission } = useAuthStore();
  const { queue, getWaitingCount, getInConsultationCount } = useQueueStore();

  // Récupérer les statistiques du jour
  const { data: todayStats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats', 'daily', format(new Date(), 'yyyy-MM-dd')],
    queryFn: () => api.getDailyStats(format(new Date(), 'yyyy-MM-dd')),
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Récupérer la liste des patients récents
  const { data: recentPatients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients', { limit: 5, page: 1 }],
    queryFn: () => api.getPatients({ limit: 5, page: 1 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const waitingCount = getWaitingCount();
  const inConsultationCount = getInConsultationCount();
  const totalQueueCount = queue.length;

  // Statistiques KPI
  const kpiStats = [
    {
      name: 'Patients aujourd\'hui',
      value: todayStats?.patients_total || 0,
      icon: Users,
      color: 'blue',
      trend: '+12%',
    },
    {
      name: 'En attente',
      value: waitingCount,
      icon: Clock,
      color: 'orange',
      urgent: waitingCount > 5,
    },
    {
      name: 'En consultation',
      value: inConsultationCount,
      icon: Activity,
      color: 'green',
    },
    {
      name: 'Temps d\'attente moyen',
      value: todayStats?.attente_moyenne ? `${Math.round(todayStats.attente_moyenne)}min` : '-',
      icon: TrendingUp,
      color: 'purple',
      trend: todayStats?.attente_moyenne > 30 ? 'warning' : 'good',
    },
  ];

  // Actions rapides
  const quickActions = [
    {
      name: 'Nouveau patient',
      description: 'Ajouter un nouveau patient',
      href: '/patients/new',
      icon: UserPlus,
      color: 'blue',
      show: hasPermission('patients:create'),
    },
    {
      name: 'File d\'attente',
      description: 'Gérer la file d\'attente',
      href: '/queue',
      icon: ClipboardList,
      color: 'green',
      show: true,
    },
    {
      name: 'Statistiques',
      description: 'Voir les statistiques',
      href: '/stats',
      icon: TrendingUp,
      color: 'purple',
      show: hasPermission('stats:read'),
    },
  ].filter(action => action.show);

  return (
    <div className="py-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {user?.name} 👋
        </h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </p>
      </div>

      {/* Alertes */}
      {waitingCount > 10 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Attention :</strong> {waitingCount} patients en attente. 
                Considérez optimiser la file d'attente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiStats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500',
            orange: 'bg-orange-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
          };

          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-center">
                    <p className={`text-2xl font-semibold ${
                      stat.urgent ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {statsLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    {stat.trend && (
                      <span className={`ml-2 text-xs ${
                        stat.trend === 'warning' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {stat.trend}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
          </div>
          <div className="p-6 space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colorClasses = {
                blue: 'bg-blue-100 text-blue-600',
                green: 'bg-green-100 text-green-600',
                purple: 'bg-purple-100 text-purple-600',
              };

              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className="flex items-center p-4 rounded-lg border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div className={`p-2 rounded-md ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* File d'attente actuelle */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">File d'attente</h2>
            <Link
              to="/queue"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Voir tout
            </Link>
          </div>
          <div className="p-6">
            {queue.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">Aucun patient en attente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.slice(0, 5).map((visit, index) => (
                  <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          visit.niveau_urgence === 'critique' ? 'bg-red-100 text-red-800' :
                          visit.niveau_urgence === 'prioritaire' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {visit.patient?.prenom} {visit.patient?.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {visit.statut === 'attente' ? 'En attente' : 
                           visit.statut === 'appele' ? 'Appelé' : 'En consultation'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        visit.niveau_urgence === 'critique' ? 'bg-red-500' :
                        visit.niveau_urgence === 'prioritaire' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-xs text-gray-500 capitalize">
                        {visit.niveau_urgence}
                      </span>
                    </div>
                  </div>
                ))}
                {queue.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... et {queue.length - 5} autre{queue.length - 5 > 1 ? 's' : ''} patient{queue.length - 5 > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patients récents */}
      {recentPatients && recentPatients.data.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Patients récents</h2>
            <Link
              to="/patients"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Voir tous
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {patientsLoading ? (
              <div className="p-6 text-center">
                <LoadingSpinner />
              </div>
            ) : (
              recentPatients.data.map((patient) => (
                <div key={patient.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {patient.prenom} {patient.nom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {patient.age} ans • {patient.maladie}
                      </p>
                    </div>
                    <Link
                      to={`/patients/${patient.id}`}
                      className="text-sm text-blue-600 hover:text-blue-500"
                    >
                      Voir dossier
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}