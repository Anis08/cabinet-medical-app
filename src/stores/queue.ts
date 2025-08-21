import { create } from 'zustand';
import type { Visit } from '../types';

interface QueueState {
  queue: Visit[];
  nowServing: Visit | null;
  isConnected: boolean;
  lastUpdate: Date | null;
  
  // Actions
  setQueue: (queue: Visit[]) => void;
  setNowServing: (visit: Visit | null) => void;
  setConnected: (connected: boolean) => void;
  updateVisit: (visitId: string, updates: Partial<Visit>) => void;
  removeVisit: (visitId: string) => void;
  addVisit: (visit: Visit) => void;
  
  // Helpers
  getVisitById: (id: string) => Visit | undefined;
  getQueuePosition: (visitId: string) => number;
  getWaitingCount: () => number;
  getInConsultationCount: () => number;
}

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  nowServing: null,
  isConnected: false,
  lastUpdate: null,
  
  setQueue: (queue: Visit[]) => {
    set({
      queue: sortQueue(queue),
      lastUpdate: new Date(),
    });
  },
  
  setNowServing: (visit: Visit | null) => {
    set({ nowServing: visit });
  },
  
  setConnected: (connected: boolean) => {
    set({ isConnected: connected });
  },
  
  updateVisit: (visitId: string, updates: Partial<Visit>) => {
    const { queue } = get();
    const updatedQueue = queue.map(visit =>
      visit.id === visitId
        ? { ...visit, ...updates }
        : visit
    );
    
    set({
      queue: sortQueue(updatedQueue),
      lastUpdate: new Date(),
    });
  },
  
  removeVisit: (visitId: string) => {
    const { queue } = get();
    const updatedQueue = queue.filter(visit => visit.id !== visitId);
    
    set({
      queue: updatedQueue,
      lastUpdate: new Date(),
    });
  },
  
  addVisit: (visit: Visit) => {
    const { queue } = get();
    const updatedQueue = [...queue, visit];
    
    set({
      queue: sortQueue(updatedQueue),
      lastUpdate: new Date(),
    });
  },
  
  getVisitById: (id: string): Visit | undefined => {
    const { queue } = get();
    return queue.find(visit => visit.id === id);
  },
  
  getQueuePosition: (visitId: string): number => {
    const { queue } = get();
    return queue.findIndex(visit => visit.id === visitId) + 1;
  },
  
  getWaitingCount: (): number => {
    const { queue } = get();
    return queue.filter(visit => visit.statut === 'attente').length;
  },
  
  getInConsultationCount: (): number => {
    const { queue } = get();
    return queue.filter(visit => visit.statut === 'en_consultation').length;
  },
}));

// Fonction utilitaire pour trier la file selon les règles de priorisation
function sortQueue(queue: Visit[]): Visit[] {
  return [...queue].sort((a, b) => {
    // D'abord par priorité (critique > prioritaire > standard)
    const priorityOrder = { 'critique': 0, 'prioritaire': 1, 'standard': 2 };
    const priorityDiff = priorityOrder[a.niveau_urgence] - priorityOrder[b.niveau_urgence];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Ensuite par heure d'arrivée (plus ancien en premier)
    const timeA = new Date(a.heure_arrivee).getTime();
    const timeB = new Date(b.heure_arrivee).getTime();
    
    return timeA - timeB;
  });
}