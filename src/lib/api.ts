import type { 
  User, 
  Patient, 
  Visit, 
  StatsJour,
  LoginRequest, 
  LoginResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
  CreateVisitRequest,
  PaginatedResponse,
  PatientFilters,
  VisitFilters,
  StatsFilters,
  ApiError
} from '../types';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `Erreur HTTP ${response.status}`,
          code: errorData.code,
          details: errorData.details,
        };
        throw error;
      }

      // Gérer les réponses vides (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          code: 'NETWORK_ERROR',
        } as ApiError;
      }
      throw error;
    }
  }

  // Méthodes HTTP de base
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // === AUTHENTIFICATION ===
  
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    return this.post<void>('/auth/logout');
  }

  async refreshToken(): Promise<{ token: string }> {
    return this.post<{ token: string }>('/auth/refresh');
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/auth/me');
  }

  // === PATIENTS ===
  
  async getPatients(filters?: PatientFilters): Promise<PaginatedResponse<Patient>> {
    return this.get<PaginatedResponse<Patient>>('/patients', filters);
  }

  async getPatient(id: string): Promise<Patient> {
    return this.get<Patient>(`/patients/${id}`);
  }

  async createPatient(data: CreatePatientRequest): Promise<Patient> {
    return this.post<Patient>('/patients', data);
  }

  async updatePatient(id: string, data: UpdatePatientRequest): Promise<Patient> {
    return this.put<Patient>(`/patients/${id}`, data);
  }

  async deletePatient(id: string): Promise<void> {
    return this.delete<void>(`/patients/${id}`);
  }

  async getPatientHistory(id: string): Promise<Visit[]> {
    return this.get<Visit[]>(`/patients/${id}/visits`);
  }

  // === VISITES / FILE D'ATTENTE ===
  
  async getQueue(): Promise<Visit[]> {
    return this.get<Visit[]>('/queue');
  }

  async createVisit(data: CreateVisitRequest): Promise<Visit> {
    return this.post<Visit>('/visits', data);
  }

  async getVisit(id: string): Promise<Visit> {
    return this.get<Visit>(`/visits/${id}`);
  }

  async callPatient(visitId: string): Promise<Visit> {
    return this.post<Visit>(`/queue/${visitId}/call`);
  }

  async startConsultation(visitId: string): Promise<Visit> {
    return this.post<Visit>(`/queue/${visitId}/start`);
  }

  async finishConsultation(visitId: string, notes?: string): Promise<Visit> {
    return this.post<Visit>(`/queue/${visitId}/finish`, { notes });
  }

  async skipPatient(visitId: string): Promise<Visit> {
    return this.post<Visit>(`/queue/${visitId}/skip`);
  }

  async cancelVisit(visitId: string): Promise<void> {
    return this.delete<void>(`/queue/${visitId}`);
  }

  // === HISTORIQUE ===
  
  async getVisitHistory(filters?: VisitFilters): Promise<PaginatedResponse<Visit>> {
    return this.get<PaginatedResponse<Visit>>('/visits', filters);
  }

  // === STATISTIQUES ===
  
  async getStats(filters?: StatsFilters): Promise<StatsJour> {
    return this.get<StatsJour>('/stats', filters);
  }

  async getDailyStats(date?: string): Promise<StatsJour> {
    return this.get<StatsJour>('/stats/daily', { date });
  }

  async getWeeklyStats(startDate?: string): Promise<StatsJour[]> {
    return this.get<StatsJour[]>('/stats/weekly', { startDate });
  }

  async getMonthlyStats(year?: number, month?: number): Promise<StatsJour[]> {
    return this.get<StatsJour[]>('/stats/monthly', { year, month });
  }

  // === UTILISATEURS (Admin) ===
  
  async getUsers(): Promise<User[]> {
    return this.get<User[]>('/users');
  }

  async createUser(data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    return this.post<User>('/users', data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.put<User>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete<void>(`/users/${id}`);
  }

  // === EXPORTS ===
  
  async exportPatients(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/exports/patients?format=${format}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }
    
    return response.blob();
  }

  async exportStats(filters?: StatsFilters, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams({ format, ...filters });
    const response = await fetch(`${this.baseURL}/exports/stats?${params}`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'export');
    }
    
    return response.blob();
  }
}

// Instance globale du client API
export const api = new ApiClient(API_BASE_URL);

// Helper pour gérer les erreurs d'API
export function isApiError(error: any): error is ApiError {
  return error && typeof error.message === 'string';
}

// Helper pour formater les erreurs
export function formatApiError(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Une erreur inattendue s\'est produite';
}