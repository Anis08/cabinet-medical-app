// Types de base
export type Role = 'admin' | 'medecin' | 'secretaire';
export type Urgence = 'standard' | 'prioritaire' | 'critique';
export type StatutVisite = 'attente' | 'appele' | 'en_consultation' | 'termine' | 'annule';

// Interface utilisateur
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

// Interface patient
export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  maladie: string;
  notes?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Interface visite
export interface Visit {
  id: string;
  patient_id: string;
  medecin_id?: string | null;
  statut: StatutVisite;
  niveau_urgence: Urgence;
  heure_arrivee: string;
  heure_appel?: string | null;
  heure_debut_consult?: string | null;
  heure_fin_consult?: string | null;
  patient?: Patient;
  medecin?: User;
  // Champs calculés côté client
  temps_attente?: number; // en minutes
  position_file?: number;
}

// Interface statistiques journalières
export interface StatsJour {
  date: string;
  patients_total: number;
  patients_termines: number;
  patients_en_attente: number;
  patients_en_consultation: number;
  attente_moyenne: number; // en minutes
  attente_mediane: number; // en minutes
  distribution: Array<{
    bucket: string; // "0-15min", "15-30min", etc.
    count: number;
  }>;
  temps_entre: Array<{
    medecin_id: string;
    medecin_name: string;
    temps_moyen: number; // en minutes
  }>;
}

// Interfaces pour l'API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreatePatientRequest {
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  maladie: string;
  notes?: string;
  phone?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}

export interface CreateVisitRequest {
  patient_id: string;
  niveau_urgence: Urgence;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Types pour les formulaires
export interface PatientFormData {
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  maladie: string;
  notes?: string;
  phone?: string;
}

export interface VisitFormData {
  patient_id: string;
  niveau_urgence: Urgence;
  notes?: string;
}

// Types pour les filtres et recherche
export interface PatientFilters {
  search?: string;
  maladie?: string;
  age_min?: number;
  age_max?: number;
  page?: number;
  limit?: number;
}

export interface VisitFilters {
  date?: string;
  medecin_id?: string;
  statut?: StatutVisite;
  niveau_urgence?: Urgence;
  page?: number;
  limit?: number;
}

export interface StatsFilters {
  date_debut?: string;
  date_fin?: string;
  medecin_id?: string;
}

// Types pour les événements temps réel
export interface QueueUpdateEvent {
  type: 'queue_update';
  data: Visit[];
}

export interface PatientCalledEvent {
  type: 'patient_called';
  data: {
    visit_id: string;
    patient_nom: string;
    patient_prenom: string;
  };
}

export interface ConsultationStartedEvent {
  type: 'consultation_started';
  data: {
    visit_id: string;
    medecin_id: string;
  };
}

export interface ConsultationFinishedEvent {
  type: 'consultation_finished';
  data: {
    visit_id: string;
    duree: number; // en minutes
  };
}

export type RealtimeEvent = 
  | QueueUpdateEvent 
  | PatientCalledEvent 
  | ConsultationStartedEvent 
  | ConsultationFinishedEvent;

// Types pour l'état de l'application
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  currentQueue: Visit[];
  nowServing: Visit | null;
}

// Types pour les permissions
export interface Permission {
  resource: string;
  action: string;
  condition?: (user: User, resource?: any) => boolean;
}

export const PERMISSIONS = {
  PATIENTS: {
    CREATE: 'patients:create',
    READ: 'patients:read',
    UPDATE: 'patients:update',
    DELETE: 'patients:delete',
  },
  VISITS: {
    CREATE: 'visits:create',
    READ: 'visits:read',
    UPDATE: 'visits:update',
    DELETE: 'visits:delete',
    CALL: 'visits:call',
    START: 'visits:start',
    FINISH: 'visits:finish',
  },
  STATS: {
    READ: 'stats:read',
    EXPORT: 'stats:export',
  },
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
} as const;

// Mapping des rôles aux permissions
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    PERMISSIONS.PATIENTS.CREATE,
    PERMISSIONS.PATIENTS.READ,
    PERMISSIONS.PATIENTS.UPDATE,
    PERMISSIONS.PATIENTS.DELETE,
    PERMISSIONS.VISITS.CREATE,
    PERMISSIONS.VISITS.READ,
    PERMISSIONS.VISITS.UPDATE,
    PERMISSIONS.VISITS.DELETE,
    PERMISSIONS.VISITS.CALL,
    PERMISSIONS.VISITS.START,
    PERMISSIONS.VISITS.FINISH,
    PERMISSIONS.STATS.READ,
    PERMISSIONS.STATS.EXPORT,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
  ],
  medecin: [
    PERMISSIONS.PATIENTS.READ,
    PERMISSIONS.PATIENTS.UPDATE,
    PERMISSIONS.VISITS.READ,
    PERMISSIONS.VISITS.CALL,
    PERMISSIONS.VISITS.START,
    PERMISSIONS.VISITS.FINISH,
    PERMISSIONS.STATS.READ,
  ],
  secretaire: [
    PERMISSIONS.PATIENTS.CREATE,
    PERMISSIONS.PATIENTS.READ,
    PERMISSIONS.PATIENTS.UPDATE,
    PERMISSIONS.VISITS.CREATE,
    PERMISSIONS.VISITS.READ,
    PERMISSIONS.VISITS.UPDATE,
    PERMISSIONS.STATS.READ,
  ],
};