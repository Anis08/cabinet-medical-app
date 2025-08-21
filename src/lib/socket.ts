import { io, Socket } from 'socket.io-client';
import type { RealtimeEvent, Visit } from '../types';

class RealtimeClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  
  constructor() {
    // Initialiser les event listeners vides
    this.listeners.set('queue_update', []);
    this.listeners.set('patient_called', []);
    this.listeners.set('consultation_started', []);
    this.listeners.set('consultation_finished', []);
    this.listeners.set('connected', []);
    this.listeners.set('disconnected', []);
    this.listeners.set('error', []);
  }

  connect(token: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      const socketURL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3001';
      
      this.socket = io(socketURL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        retries: 3,
      });

      // Événement de connexion réussie
      this.socket.on('connect', () => {
        console.log('✅ Connexion WebSocket établie');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected', { connected: true });
        resolve();
      });

      // Gestion des erreurs de connexion
      this.socket.on('connect_error', (error) => {
        console.error('❌ Erreur de connexion WebSocket:', error);
        this.isConnecting = false;
        this.emit('error', error);
        
        if (this.reconnectAttempts === 0) {
          // Premier échec, rejeter la Promise
          reject(error);
        }
      });

      // Événement de déconnexion
      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Déconnexion WebSocket:', reason);
        this.emit('disconnected', { reason });
        
        // Tentative de reconnexion automatique
        if (reason !== 'io client disconnect' && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Tentative de reconnexion (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          
          setTimeout(() => {
            this.socket?.connect();
          }, 2000 * this.reconnectAttempts); // Délai croissant
        }
      });

      // Écouter les événements de la file d'attente
      this.socket.on('queue:update', (data: Visit[]) => {
        console.log('📋 Mise à jour de la file d\'attente:', data.length, 'patients');
        this.emit('queue_update', data);
      });

      this.socket.on('patient:called', (data: { visit_id: string; patient_nom: string; patient_prenom: string }) => {
        console.log('📢 Patient appelé:', data.patient_prenom, data.patient_nom);
        this.emit('patient_called', data);
      });

      this.socket.on('consultation:started', (data: { visit_id: string; medecin_id: string }) => {
        console.log('🩺 Consultation démarrée:', data);
        this.emit('consultation_started', data);
      });

      this.socket.on('consultation:finished', (data: { visit_id: string; duree: number }) => {
        console.log('✅ Consultation terminée:', data);
        this.emit('consultation_finished', data);
      });

      // Événement générique pour les données temps réel
      this.socket.on('realtime:event', (event: RealtimeEvent) => {
        console.log('⚡ Événement temps réel:', event.type);
        this.emit(event.type, event.data);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Déconnexion manuelle du WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  // Ajouter un listener pour un événement
  on<T = any>(event: string, callback: (data: T) => void): () => void {
    const listeners = this.listeners.get(event) || [];
    listeners.push(callback);
    this.listeners.set(event, listeners);

    // Retourner une fonction de nettoyage
    return () => {
      this.off(event, callback);
    };
  }

  // Supprimer un listener
  off(event: string, callback: Function): void {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      this.listeners.set(event, listeners);
    }
  }

  // Émettre un événement vers le serveur
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('⚠️ Tentative d\'émission sur une socket non connectée:', event);
    }
  }

  // Émettre un événement vers les listeners locaux
  private emit(event: string, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Erreur dans le listener ${event}:`, error);
      }
    });
  }

  // Getters pour l'état de la connexion
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  get connectionState(): 'connected' | 'connecting' | 'disconnected' {
    if (this.socket?.connected) return 'connected';
    if (this.isConnecting) return 'connecting';
    return 'disconnected';
  }

  // Méthodes spécifiques au domaine médical
  
  // Rejoindre la room de la file d'attente
  joinQueue(): void {
    this.emit('queue:join');
  }

  // Quitter la room de la file d'attente
  leaveQueue(): void {
    this.emit('queue:leave');
  }

  // Rejoindre la room de l'écran d'affichage
  joinDisplay(): void {
    this.emit('display:join');
  }

  // Quitter la room de l'écran d'affichage
  leaveDisplay(): void {
    this.emit('display:leave');
  }

  // Notifier d'une action sur une visite
  notifyVisitAction(action: string, visitId: string, data?: any): void {
    this.emit('visit:action', {
      action,
      visitId,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

// Instance globale du client temps réel
export const realtimeClient = new RealtimeClient();

// Hook-like function pour utiliser le client dans les composants
export function useRealtimeClient() {
  return realtimeClient;
}