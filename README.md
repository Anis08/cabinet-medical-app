# Cabinet Médical - Application de Gestion

Une application web moderne pour la gestion d'un cabinet médical avec file d'attente priorisée, développée en React TypeScript.

## 🎯 Objectif

Cette application permet de gérer efficacement un cabinet médical avec :
- **File d'attente priorisée** (FIFO + niveaux d'urgence)
- **Gestion des patients** (CRUD complet avec historique)
- **Statistiques en temps réel** (patients/jour, temps d'attente, etc.)
- **Écran d'affichage public** pour la salle d'attente
- **Système de rôles** (Admin, Médecin, Secrétaire)

## ✨ Fonctionnalités Actuellement Implémentées

### ✅ Authentification & Sécurité
- [x] Système de connexion avec JWT
- [x] Gestion des rôles (RBAC) : Admin, Médecin, Secrétaire
- [x] Guards de protection des routes
- [x] Gestion des permissions par rôle

### ✅ Gestion des Patients
- [x] Liste des patients avec recherche et pagination
- [x] Formulaire de création/modification de patient
- [x] Dossier patient détaillé avec historique
- [x] Validation des formulaires avec Zod

### ✅ Interface Utilisateur
- [x] Design responsive avec Tailwind CSS
- [x] Navigation latérale adaptative
- [x] Composants réutilisables (LoadingSpinner, Dialog, etc.)
- [x] Gestion des erreurs avec ErrorBoundary
- [x] Notifications toast avec Sonner

### ✅ API & Data Management
- [x] Client API avec gestion d'erreurs
- [x] React Query pour le cache et synchronisation
- [x] Stores Zustand pour l'état global
- [x] Mock API avec MSW pour le développement

### ✅ Configuration & Développement
- [x] Configuration TypeScript stricte
- [x] Build system avec Vite
- [x] Environnement de développement complet
- [x] Variables d'environnement configurées

## 🚧 Fonctionnalités En Développement

### File d'Attente Temps Réel
- [ ] Interface de gestion de la file d'attente
- [ ] Priorisation automatique (critique > prioritaire > standard)
- [ ] Actions : Appeler, Démarrer consultation, Terminer, Passer
- [ ] Minuterie temps d'attente en temps réel
- [ ] Système anti-famine (promotion automatique)

### Statistiques & Analytics
- [ ] Graphiques avec Recharts (patients/jour, temps d'attente)
- [ ] Métriques de performance du cabinet
- [ ] Export des données (CSV/Excel)
- [ ] Tableaux de bord personnalisés

### Écran d'Affichage Public
- [ ] Interface plein écran pour salle d'attente
- [ ] Affichage patient en cours + suivants
- [ ] Mise à jour temps réel via WebSocket
- [ ] Design optimisé pour TV/moniteur

### Temps Réel & WebSocket
- [ ] Connexion WebSocket pour synchronisation
- [ ] Événements temps réel (patient appelé, consultation démarrée)
- [ ] Notifications push
- [ ] Synchronisation multi-utilisateur

### Administration
- [ ] Gestion des utilisateurs et rôles
- [ ] Configuration des paramètres système
- [ ] Logs d'audit et traçabilité
- [ ] Sauvegarde et restauration

## 🚀 Installation & Développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd cabinet-medical-app

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.development

# Démarrer en mode développement
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérification ESLint
npm test             # Lancer les tests
```

## 🔐 Comptes de Démonstration

L'application inclut des comptes de test pour chaque rôle :

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Admin** | admin@cabinet.fr | admin123 | Toutes les permissions |
| **Médecin** | medecin@cabinet.fr | medecin123 | Consultations, statistiques |
| **Secrétaire** | secretaire@cabinet.fr | secretaire123 | Patients, file d'attente |

## 🏗️ Architecture Technique

### Stack Frontend
- **React 18** + **TypeScript** - Framework principal
- **Vite** - Build tool et serveur de développement
- **React Router v6** - Routing côté client
- **Tailwind CSS** - Framework CSS utilitaire
- **React Query** - Gestion des données et cache
- **Zustand** - State management
- **React Hook Form + Zod** - Formulaires et validation
- **Sonner** - Notifications toast
- **Lucide React** - Icônes
- **MSW** - Mock API pour développement

### Structure du Projet
```
src/
├── components/          # Composants réutilisables
│   ├── guards/         # Guards d'authentification
│   ├── layout/         # Layout et navigation
│   └── ui/             # Composants UI de base
├── hooks/              # Custom hooks React
├── lib/                # Utilitaires et configuration
├── mocks/              # Mock API (MSW)
├── pages/              # Pages de l'application
├── stores/             # Stores Zustand
├── styles/             # Styles globaux
└── types/              # Types TypeScript
```

### Modèle de Données

#### Utilisateurs
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'medecin' | 'secretaire';
}
```

#### Patients
```typescript
interface Patient {
  id: string;
  nom: string;
  prenom: string;
  age: number;
  poids: number;
  maladie: string;
  notes?: string;
  phone?: string;
}
```

#### Visites
```typescript
interface Visit {
  id: string;
  patient_id: string;
  medecin_id?: string;
  statut: 'attente' | 'appele' | 'en_consultation' | 'termine' | 'annule';
  niveau_urgence: 'standard' | 'prioritaire' | 'critique';
  heure_arrivee: string;
  heure_appel?: string;
  heure_debut_consult?: string;
  heure_fin_consult?: string;
}
```

## 🔧 Configuration

### Variables d'Environnement
```env
# API Backend
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=ws://localhost:3001

# Mode développement avec mock API
VITE_USE_MOCK_API=true

# Debug
VITE_DEBUG=true
```

### Mode Mock API
Par défaut, l'application utilise une API mockée avec MSW pour le développement.
Pour désactiver le mock et utiliser une vraie API :
```env
VITE_USE_MOCK_API=false
```

## 🎨 Design System

L'application utilise un design system cohérent basé sur :
- **Palette de couleurs** : Bleu principal, gris neutres, couleurs sémantiques
- **Typographie** : System fonts avec hiérarchie claire
- **Espacements** : Système de grille 4px
- **Composants** : Bibliothèque de composants réutilisables
- **Responsive** : Mobile-first avec breakpoints définis

## 📱 Responsive Design

L'interface s'adapte automatiquement :
- **Mobile** (< 768px) : Navigation en overlay, layout vertical
- **Tablet** (768px - 1024px) : Layout adapté, sidebar collapsible
- **Desktop** (> 1024px) : Sidebar fixe, layout complet

## 🧪 Tests

Le projet inclut une configuration de tests avec :
- **Vitest** - Runner de tests rapide
- **React Testing Library** - Tests de composants
- **MSW** - Mock des APIs dans les tests

```bash
npm test              # Lancer tous les tests
npm run test:watch    # Mode watch
npm run test:ui       # Interface graphique des tests
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement
L'application génère un build statique dans le dossier `dist/` qui peut être déployé sur :
- Netlify
- Vercel
- GitHub Pages
- Tout serveur web statique

## 🛣️ Roadmap

### Phase 1 (Actuelle) - Base MVP ✅
- [x] Authentification et gestion des rôles
- [x] CRUD Patients complet
- [x] Interface utilisateur de base
- [x] Mock API et environnement de dev

### Phase 2 - File d'Attente 🚧
- [ ] Interface de gestion de file d'attente
- [ ] Priorisation et minuterie temps réel
- [ ] Actions sur les visites (appeler, démarrer, terminer)

### Phase 3 - Temps Réel 📋
- [ ] WebSocket pour synchronisation temps réel
- [ ] Écran d'affichage public
- [ ] Notifications push

### Phase 4 - Analytics 📊
- [ ] Statistiques avancées avec graphiques
- [ ] Tableaux de bord personnalisables
- [ ] Export de données

### Phase 5 - Administration 🔧
- [ ] Panel d'administration complet
- [ ] Gestion des utilisateurs
- [ ] Configuration système
- [ ] Audit et logs

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajouter nouvelle fonctionnalite'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation technique

---

**Cabinet Médical v1.0.0** - Développé avec ❤️ en React TypeScript