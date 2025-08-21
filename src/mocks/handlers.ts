import { rest } from 'msw';
import { mockUsers, mockPatients, mockVisits, mockStats } from './data';
import type { 
  LoginRequest, 
  LoginResponse, 
  Patient, 
  Visit,
  CreatePatientRequest,
  CreateVisitRequest,
  User,
  StatsJour,
  PaginatedResponse 
} from '../types';

const API_BASE = '/api';

export const handlers = [
  // === AUTHENTIFICATION ===
  
  rest.post<LoginRequest>(`${API_BASE}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Vérifier les credentials
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Email ou mot de passe incorrect' })
      );
    }
    
    // Simulation de vérification du mot de passe
    const isValidPassword = 
      (email === 'admin@cabinet.fr' && password === 'admin123') ||
      (email === 'medecin@cabinet.fr' && password === 'medecin123') ||
      (email === 'secretaire@cabinet.fr' && password === 'secretaire123');
    
    if (!isValidPassword) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Email ou mot de passe incorrect' })
      );
    }
    
    const response: LoginResponse = {
      token: `mock-jwt-token-${user.id}`,
      user,
    };
    
    return res(
      ctx.delay(500), // Simuler latence réseau
      ctx.json(response)
    );
  }),

  rest.post(`${API_BASE}/auth/logout`, (req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(204));
  }),

  rest.get(`${API_BASE}/auth/me`, (req, res, ctx) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Token manquant' }));
    }
    
    // Simuler la récupération de l'utilisateur depuis le token
    const user = mockUsers[0]; // Pour le mock, retourner le premier utilisateur
    return res(ctx.delay(200), ctx.json(user));
  }),

  // === PATIENTS ===
  
  rest.get(`${API_BASE}/patients`, (req, res, ctx) => {
    const search = req.url.searchParams.get('search') || '';
    const page = parseInt(req.url.searchParams.get('page') || '1');
    const limit = parseInt(req.url.searchParams.get('limit') || '10');
    
    let filteredPatients = mockPatients;
    
    // Filtrage par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPatients = mockPatients.filter(
        p => 
          p.nom.toLowerCase().includes(searchLower) ||
          p.prenom.toLowerCase().includes(searchLower) ||
          p.maladie.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
    
    const response: PaginatedResponse<Patient> = {
      data: paginatedPatients,
      total: filteredPatients.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPatients.length / limit),
    };
    
    return res(ctx.delay(300), ctx.json(response));
  }),

  rest.get(`${API_BASE}/patients/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const patient = mockPatients.find(p => p.id === id);
    
    if (!patient) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Patient non trouvé' })
      );
    }
    
    return res(ctx.delay(200), ctx.json(patient));
  }),

  rest.post<CreatePatientRequest>(`${API_BASE}/patients`, (req, res, ctx) => {
    const patientData = req.body;
    
    const newPatient: Patient = {
      id: `patient-${Date.now()}`,
      ...patientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockPatients.unshift(newPatient);
    
    return res(
      ctx.delay(500),
      ctx.status(201),
      ctx.json(newPatient)
    );
  }),

  rest.put<Partial<Patient>>(`${API_BASE}/patients/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const updates = req.body;
    
    const patientIndex = mockPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Patient non trouvé' })
      );
    }
    
    const updatedPatient = {
      ...mockPatients[patientIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    mockPatients[patientIndex] = updatedPatient;
    
    return res(ctx.delay(400), ctx.json(updatedPatient));
  }),

  rest.delete(`${API_BASE}/patients/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const patientIndex = mockPatients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json({ message: 'Patient non trouvé' })
      );
    }
    
    mockPatients.splice(patientIndex, 1);
    
    return res(ctx.delay(300), ctx.status(204));
  }),

  rest.get(`${API_BASE}/patients/:id/visits`, (req, res, ctx) => {
    const { id } = req.params;
    const patientVisits = mockVisits.filter(v => v.patient_id === id);
    
    return res(ctx.delay(200), ctx.json(patientVisits));
  }),

  // === VISITES / FILE D'ATTENTE ===
  
  rest.get(`${API_BASE}/queue`, (req, res, ctx) => {
    const activeVisits = mockVisits.filter(
      v => ['attente', 'appele', 'en_consultation'].includes(v.statut)
    );
    
    // Trier selon les règles de priorisation
    const sortedQueue = activeVisits.sort((a, b) => {
      const priorityOrder = { 'critique': 0, 'prioritaire': 1, 'standard': 2 };
      const priorityDiff = priorityOrder[a.niveau_urgence] - priorityOrder[b.niveau_urgence];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.heure_arrivee).getTime() - new Date(b.heure_arrivee).getTime();
    });
    
    return res(ctx.delay(200), ctx.json(sortedQueue));
  }),

  rest.post<CreateVisitRequest>(`${API_BASE}/visits`, (req, res, ctx) => {
    const visitData = req.body;
    
    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      ...visitData,
      statut: 'attente',
      heure_arrivee: new Date().toISOString(),
      patient: mockPatients.find(p => p.id === visitData.patient_id),
    };
    
    mockVisits.unshift(newVisit);
    
    return res(
      ctx.delay(300),
      ctx.status(201),
      ctx.json(newVisit)
    );
  }),

  // Actions sur les visites
  rest.post(`${API_BASE}/queue/:id/call`, (req, res, ctx) => {
    const { id } = req.params;
    const visit = mockVisits.find(v => v.id === id);
    
    if (!visit) {
      return res(ctx.status(404), ctx.json({ message: 'Visite non trouvée' }));
    }
    
    visit.statut = 'appele';
    visit.heure_appel = new Date().toISOString();
    
    return res(ctx.delay(200), ctx.json(visit));
  }),

  rest.post(`${API_BASE}/queue/:id/start`, (req, res, ctx) => {
    const { id } = req.params;
    const visit = mockVisits.find(v => v.id === id);
    
    if (!visit) {
      return res(ctx.status(404), ctx.json({ message: 'Visite non trouvée' }));
    }
    
    visit.statut = 'en_consultation';
    visit.heure_debut_consult = new Date().toISOString();
    
    return res(ctx.delay(200), ctx.json(visit));
  }),

  rest.post(`${API_BASE}/queue/:id/finish`, (req, res, ctx) => {
    const { id } = req.params;
    const visit = mockVisits.find(v => v.id === id);
    
    if (!visit) {
      return res(ctx.status(404), ctx.json({ message: 'Visite non trouvée' }));
    }
    
    visit.statut = 'termine';
    visit.heure_fin_consult = new Date().toISOString();
    
    return res(ctx.delay(200), ctx.json(visit));
  }),

  rest.post(`${API_BASE}/queue/:id/skip`, (req, res, ctx) => {
    const { id } = req.params;
    const visit = mockVisits.find(v => v.id === id);
    
    if (!visit) {
      return res(ctx.status(404), ctx.json({ message: 'Visite non trouvée' }));
    }
    
    visit.statut = 'attente'; // Remettre en attente
    
    return res(ctx.delay(200), ctx.json(visit));
  }),

  rest.delete(`${API_BASE}/queue/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const visitIndex = mockVisits.findIndex(v => v.id === id);
    
    if (visitIndex === -1) {
      return res(ctx.status(404), ctx.json({ message: 'Visite non trouvée' }));
    }
    
    mockVisits[visitIndex].statut = 'annule';
    
    return res(ctx.delay(200), ctx.status(204));
  }),

  // === STATISTIQUES ===
  
  rest.get(`${API_BASE}/stats/daily`, (req, res, ctx) => {
    const date = req.url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    return res(ctx.delay(400), ctx.json(mockStats));
  }),

  // === UTILISATEURS (Admin) ===
  
  rest.get(`${API_BASE}/users`, (req, res, ctx) => {
    return res(ctx.delay(300), ctx.json(mockUsers));
  }),

  // Gestion des erreurs pour les endpoints non implémentés
  rest.all(`${API_BASE}/*`, (req, res, ctx) => {
    console.warn(`Endpoint non mocké: ${req.method} ${req.url.pathname}`);
    return res(
      ctx.status(501),
      ctx.json({ 
        message: `Endpoint ${req.method} ${req.url.pathname} non implémenté en mode mock` 
      })
    );
  }),
];