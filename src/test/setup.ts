import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';

// Démarrer le serveur de mock avant tous les tests
beforeAll(() => server.listen());

// Reset des handlers après chaque test
afterEach(() => server.resetHandlers());

// Fermer le serveur après tous les tests
afterAll(() => server.close());