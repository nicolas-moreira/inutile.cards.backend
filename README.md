# Inutile Cards - Backend API

API Backend pour Inutile Cards, construite avec Fastify, TypeScript et MongoDB.

## 🚀 Démarrage rapide

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- npm ou yarn

### Installation

```bash
# Installer les dépendances
cd backend
npm install

# Démarrer MongoDB avec Docker
cd ..
docker compose up mongodb -d

# Seeder la base de données
cd backend
npm run seed

# Lancer le serveur de développement
npm run dev
```

### Avec Docker Compose (tout-en-un)

```bash
# Démarrer MongoDB + Backend avec hot reload
docker compose up mongodb backend-dev

# Ou avec l'interface Mongo Express
docker compose --profile dev-tools up mongodb mongo-express backend-dev
```

## 📝 Comptes de test

| Type | Email | Mot de passe |
|------|-------|--------------|
| User | test@inutile.cards | Test123456! |
| Admin | admin@inutile.cards | Admin123456! |
| Demo | nicolas.oliveira@inutile.cards | Nicolas123456! |

## 🔌 API Endpoints

### Authentification (`/api/auth`)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/register` | Inscription |
| POST | `/login` | Connexion |
| POST | `/forgot-password` | Demande de réinitialisation |
| POST | `/reset-password` | Réinitialisation du mot de passe |
| POST | `/change-password` | Changer le mot de passe (auth) |
| GET | `/me` | Utilisateur actuel (auth) |

### Profils (`/api/profiles`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/public/:slug` | Profil public par slug |
| GET | `/me` | Mon profil (auth) |
| PUT | `/me` | Mettre à jour mon profil (auth) |
| PUT | `/me/slug` | Changer mon slug (auth) |
| POST | `/me/links` | Ajouter un lien (auth) |
| PUT | `/me/links/:linkId` | Modifier un lien (auth) |
| DELETE | `/me/links/:linkId` | Supprimer un lien (auth) |
| PUT | `/me/links/reorder` | Réordonner les liens (auth) |
| GET | `/check-slug/:slug` | Vérifier disponibilité slug |

### Templates (`/api/templates`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Liste des templates |
| GET | `/:id` | Détails d'un template |
| POST | `/:id/apply` | Appliquer un template (auth) |
| POST | `/` | Créer un template (admin) |
| PUT | `/:id` | Modifier un template (admin) |
| DELETE | `/:id` | Supprimer un template (admin) |

### Finances (`/api/finances`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/overview` | Vue d'ensemble finances (auth) |
| GET | `/payment-cards` | Mes cartes de paiement (auth) |
| POST | `/payment-cards` | Ajouter une carte (auth) |
| DELETE | `/payment-cards/:cardId` | Supprimer une carte (auth) |
| PUT | `/payment-cards/:cardId/default` | Carte par défaut (auth) |
| GET | `/subscription` | Mon abonnement (auth) |
| GET | `/bills` | Mes factures (auth) |
| GET | `/physical-cards` | Mes cartes physiques (auth) |
| POST | `/physical-cards` | Commander une carte (auth) |
| PUT | `/physical-cards/:cardId` | Maj statut carte (admin) |

### Utilisateurs (`/api/users`)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/me` | Mon profil utilisateur (auth) |
| PUT | `/me` | Modifier mon profil (auth) |
| DELETE | `/me` | Désactiver mon compte (auth) |
| GET | `/` | Liste utilisateurs (admin) |
| GET | `/:userId` | Détails utilisateur (admin) |
| PUT | `/:userId` | Modifier utilisateur (admin) |
| DELETE | `/:userId` | Désactiver utilisateur (admin) |

## 📚 Documentation Swagger

Une fois le serveur lancé, la documentation interactive est disponible sur :

```
http://localhost:3001/docs
```

## 🏗️ Structure du projet

```
backend/
├── src/
│   ├── config/          # Configuration (env, database)
│   ├── middleware/      # Middlewares (auth, etc.)
│   ├── models/          # Modèles Mongoose
│   ├── routes/          # Routes API
│   ├── seeds/           # Scripts de seed
│   ├── types/           # Types TypeScript
│   ├── utils/           # Utilitaires
│   └── index.ts         # Point d'entrée
├── Dockerfile           # Image de production
├── Dockerfile.dev       # Image de développement
├── package.json
└── tsconfig.json
```

## 🔐 Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| PORT | Port du serveur | 3001 |
| HOST | Host du serveur | 0.0.0.0 |
| NODE_ENV | Environnement | development |
| MONGODB_URI | URI MongoDB | mongodb://localhost:27017/inutilecards |
| JWT_SECRET | Secret JWT | (requis en prod) |
| JWT_EXPIRES_IN | Expiration JWT | 7d |
| FRONTEND_URL | URL du frontend | http://localhost:3000 |

## 🧪 Scripts

```bash
npm run dev       # Développement avec hot reload
npm run build     # Build production
npm run start     # Lancer la production
npm run seed      # Seeder la base de données
npm run typecheck # Vérifier les types
```

