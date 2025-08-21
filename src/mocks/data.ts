import type { User, Patient, Visit, StatsJour } from '../types';

// Utilisateurs de démonstration
export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. Laurent ADMIN',
    email: 'admin@cabinet.fr',
    role: 'admin',
    created_at: '2024-01-01T08:00:00.000Z',
    updated_at: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'user-medecin-1',
    name: 'Dr. Marie DUBOIS',
    email: 'medecin@cabinet.fr',
    role: 'medecin',
    created_at: '2024-01-01T08:00:00.000Z',
    updated_at: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'user-secretaire-1',
    name: 'Sophie MARTIN',
    email: 'secretaire@cabinet.fr',
    role: 'secretaire',
    created_at: '2024-01-01T08:00:00.000Z',
    updated_at: '2024-01-01T08:00:00.000Z',
  },
];

// Patients de démonstration
export const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    nom: 'BENALI',
    prenom: 'Nadia',
    age: 34,
    poids: 62.5,
    maladie: 'Grippe saisonnière',
    notes: 'Allergie aux antibiotiques de type pénicilline',
    phone: '06 12 34 56 78',
    created_at: '2024-08-15T10:30:00.000Z',
    updated_at: '2024-08-15T10:30:00.000Z',
  },
  {
    id: 'patient-2',
    nom: 'KACI',
    prenom: 'Yacine',
    age: 58,
    poids: 81.2,
    maladie: 'Hypertension artérielle',
    notes: 'Traitement en cours : Amlodipine 5mg',
    phone: '06 23 45 67 89',
    created_at: '2024-08-10T14:15:00.000Z',
    updated_at: '2024-08-20T09:45:00.000Z',
  },
  {
    id: 'patient-3',
    nom: 'MANSOURI',
    prenom: 'Amina',
    age: 72,
    poids: 70.0,
    maladie: 'Diabète type 2',
    notes: 'Suivi diabétologique régulier, contrôle glycémique',
    phone: '06 34 56 78 90',
    created_at: '2024-07-25T16:20:00.000Z',
    updated_at: '2024-08-18T11:30:00.000Z',
  },
  {
    id: 'patient-4',
    nom: 'BERNARD',
    prenom: 'Jean',
    age: 45,
    poids: 78.5,
    maladie: 'Lombalgie chronique',
    notes: 'Antécédents de hernie discale L4-L5',
    phone: '06 45 67 89 01',
    created_at: '2024-08-12T08:45:00.000Z',
    updated_at: '2024-08-12T08:45:00.000Z',
  },
  {
    id: 'patient-5',
    nom: 'PETIT',
    prenom: 'Sophie',
    age: 29,
    poids: 55.0,
    maladie: 'Migraine chronique',
    notes: 'Déclencheurs : stress, manque de sommeil',
    phone: '06 56 78 90 12',
    created_at: '2024-08-05T13:10:00.000Z',
    updated_at: '2024-08-16T15:20:00.000Z',
  },
  {
    id: 'patient-6',
    nom: 'MOREAU',
    prenom: 'Pierre',
    age: 67,
    poids: 85.3,
    maladie: 'Arthrose du genou',
    notes: 'Infiltrations prévues',
    phone: '06 67 89 01 23',
    created_at: '2024-08-08T11:30:00.000Z',
    updated_at: '2024-08-19T14:15:00.000Z',
  },
  {
    id: 'patient-7',
    nom: 'GARCIA',
    prenom: 'Maria',
    age: 41,
    poids: 63.2,
    maladie: 'Asthme allergique',
    notes: 'Allergène principal : pollen de graminées',
    phone: '06 78 90 12 34',
    created_at: '2024-08-14T09:20:00.000Z',
    updated_at: '2024-08-14T09:20:00.000Z',
  },
  {
    id: 'patient-8',
    nom: 'ROUSSEAU',
    prenom: 'Marc',
    age: 52,
    poids: 92.1,
    maladie: 'Surpoids et cholestérol',
    notes: 'Programme de suivi nutritionnel',
    phone: '06 89 01 23 45',
    created_at: '2024-08-02T16:45:00.000Z',
    updated_at: '2024-08-17T10:30:00.000Z',
  },
];

// Visites de démonstration
export const mockVisits: Visit[] = [
  {
    id: 'visit-1',
    patient_id: 'patient-1',
    medecin_id: 'user-medecin-1',
    statut: 'attente',
    niveau_urgence: 'standard',
    heure_arrivee: '2024-08-21T08:15:00.000Z',
    patient: mockPatients[0],
    medecin: mockUsers[1],
  },
  {
    id: 'visit-2',
    patient_id: 'patient-2',
    medecin_id: 'user-medecin-1',
    statut: 'attente',
    niveau_urgence: 'prioritaire',
    heure_arrivee: '2024-08-21T08:20:00.000Z',
    patient: mockPatients[1],
    medecin: mockUsers[1],
  },
  {
    id: 'visit-3',
    patient_id: 'patient-3',
    medecin_id: 'user-medecin-1',
    statut: 'attente',
    niveau_urgence: 'standard',
    heure_arrivee: '2024-08-21T08:22:00.000Z',
    patient: mockPatients[2],
    medecin: mockUsers[1],
  },
  {
    id: 'visit-4',
    patient_id: 'patient-4',
    medecin_id: 'user-medecin-1',
    statut: 'termine',
    niveau_urgence: 'standard',
    heure_arrivee: '2024-08-21T07:45:00.000Z',
    heure_appel: '2024-08-21T08:00:00.000Z',
    heure_debut_consult: '2024-08-21T08:05:00.000Z',
    heure_fin_consult: '2024-08-21T08:25:00.000Z',
    patient: mockPatients[3],
    medecin: mockUsers[1],
  },
  {
    id: 'visit-5',
    patient_id: 'patient-5',
    medecin_id: 'user-medecin-1',
    statut: 'attente',
    niveau_urgence: 'critique',
    heure_arrivee: '2024-08-21T08:30:00.000Z',
    patient: mockPatients[4],
    medecin: mockUsers[1],
  },
];

// Statistiques de démonstration
export const mockStats: StatsJour = {
  date: '2024-08-21',
  patients_total: 12,
  patients_termines: 8,
  patients_en_attente: 3,
  patients_en_consultation: 1,
  attente_moyenne: 25.5, // en minutes
  attente_mediane: 22.0, // en minutes
  distribution: [
    { bucket: '0-15min', count: 3 },
    { bucket: '15-30min', count: 4 },
    { bucket: '30-45min', count: 2 },
    { bucket: '45-60min', count: 1 },
    { bucket: '60min+', count: 2 },
  ],
  temps_entre: [
    {
      medecin_id: 'user-medecin-1',
      medecin_name: 'Dr. Marie DUBOIS',
      temps_moyen: 18.5, // en minutes
    },
  ],
};

// Fonction utilitaire pour générer des données aléatoires
export function generateRandomPatient(): Patient {
  const noms = ['MARTIN', 'BERNARD', 'THOMAS', 'PETIT', 'ROBERT', 'RICHARD', 'DURAND', 'DUBOIS', 'MOREAU', 'LAURENT'];
  const prenoms = ['Jean', 'Marie', 'Pierre', 'Michel', 'Anne', 'François', 'Catherine', 'Nicolas', 'Christine', 'Daniel'];
  const maladies = [
    'Grippe saisonnière',
    'Hypertension artérielle',
    'Diabète type 2',
    'Lombalgie',
    'Migraine',
    'Arthrose',
    'Asthme',
    'Gastro-entérite',
    'Sinusite',
    'Allergie',
  ];

  const nom = noms[Math.floor(Math.random() * noms.length)];
  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  const age = Math.floor(Math.random() * 80) + 18;
  const poids = Math.round((Math.random() * 50 + 45) * 10) / 10;
  const maladie = maladies[Math.floor(Math.random() * maladies.length)];

  return {
    id: `patient-${Date.now()}-${Math.random()}`,
    nom,
    prenom,
    age,
    poids,
    maladie,
    phone: `06 ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')} ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Fonction pour ajouter des patients aléatoires
export function addRandomPatients(count: number = 5) {
  for (let i = 0; i < count; i++) {
    mockPatients.push(generateRandomPatient());
  }
}