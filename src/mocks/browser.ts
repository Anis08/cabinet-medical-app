import { setupWorker } from 'msw';
import { handlers } from './handlers';

// Configurer le service worker pour intercepter les requêtes
export const worker = setupWorker(...handlers);

// Démarrer le mock en mode développement
export async function startMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass', // Laisser passer les requêtes non mockées
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      
      console.log('🔧 Mode développement avec API mockée activé');
      console.log('📋 Comptes de test disponibles :');
      console.log('  Admin: admin@cabinet.fr / admin123');
      console.log('  Médecin: medecin@cabinet.fr / medecin123');
      console.log('  Secrétaire: secretaire@cabinet.fr / secretaire123');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du mock:', error);
      return false;
    }
  }
  
  return false;
}

// Arrêter le mock
export function stopMocking() {
  if (worker) {
    worker.stop();
    console.log('🔧 API mockée désactivée');
  }
}