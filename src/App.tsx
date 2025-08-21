import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import { useRealtimeConnection } from './hooks/useRealtime';

// Components
import { AuthGuard } from './components/guards/AuthGuard';
import { RoleGuard } from './components/guards/RoleGuard';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/patients/PatientsPage';
import PatientFormPage from './pages/patients/PatientFormPage';
import PatientDetailPage from './pages/patients/PatientDetailPage';
import QueuePage from './pages/queue/QueuePage';
import HistoryPage from './pages/history/HistoryPage';
import StatsPage from './pages/stats/StatsPage';
import DisplayPage from './pages/display/DisplayPage';
import AdminPage from './pages/admin/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Initialiser la connexion temps réel si authentifié
  useRealtimeConnection(isAuthenticated);

  return (
    <ErrorBoundary>
      <div className="App">
        <Routes>
          {/* Route publique - Login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            } 
          />
          
          {/* Route publique - Écran d'affichage */}
          <Route path="/display" element={<DisplayPage />} />
          
          {/* Routes protégées */}
          <Route
            path="/*"
            element={
              <AuthGuard>
                <Layout>
                  <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<DashboardPage />} />
                    
                    {/* Patients */}
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route 
                      path="/patients/new" 
                      element={
                        <RoleGuard allowedRoles={['admin', 'secretaire']}>
                          <PatientFormPage />
                        </RoleGuard>
                      } 
                    />
                    <Route 
                      path="/patients/:id/edit" 
                      element={
                        <RoleGuard allowedRoles={['admin', 'secretaire', 'medecin']}>
                          <PatientFormPage />
                        </RoleGuard>
                      } 
                    />
                    <Route path="/patients/:id" element={<PatientDetailPage />} />
                    
                    {/* File d'attente */}
                    <Route path="/queue" element={<QueuePage />} />
                    
                    {/* Historique */}
                    <Route path="/history" element={<HistoryPage />} />
                    
                    {/* Statistiques */}
                    <Route path="/stats" element={<StatsPage />} />
                    
                    {/* Administration */}
                    <Route 
                      path="/admin/*" 
                      element={
                        <RoleGuard allowedRoles={['admin']}>
                          <AdminPage />
                        </RoleGuard>
                      } 
                    />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </AuthGuard>
            }
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;