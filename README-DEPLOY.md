# 🚀 Déploiement Backend sur DigitalOcean

## Configuration DigitalOcean App Platform

### 1. Paramètres de Build

Dans les settings de votre app DigitalOcean, configurez :

**Build Command:**
```bash
npm install && npm run build
```

**Run Command:**
```bash
npm start
```

**HTTP Port:** `8080`

### 2. Variables d'environnement requises

⚠️ **IMPORTANT** : Ajoutez ces variables dans l'interface DigitalOcean (Settings → Environment Variables)

```bash
# Server
PORT=8080
HOST=0.0.0.0
NODE_ENV=production

# Database MongoDB (DigitalOcean)
MONGODB_URI=mongodb+srv://doadmin:1073HXg4E68OdoC9@db-inutilecorp-34a5d185.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-inutilecorp&tls=true

# JWT (générez un secret fort)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=https://inutile.cards
```

### 3. Health Check Configuration

Dans Settings → Health Check :

- **HTTP Request Route**: `/health`
- **Port**: `8080`
- **Timeout**: 3 secondes
- **Period**: 60 secondes
- **Success Threshold**: 1
- **Failure Threshold**: 3

### 4. Vérification après déploiement

✅ Une fois déployé, testez les endpoints :

**Health Check:**
```bash
curl https://seahorse-app-vtzyo.ondigitalocean.app/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2024-12-15T..."
}
```

**Documentation API:**
```bash
curl https://seahorse-app-vtzyo.ondigitalocean.app/docs
```

### 5. URLs de l'API en production

- **API Base URL**: `https://seahorse-app-vtzyo.ondigitalocean.app`
- **Health Check**: `https://seahorse-app-vtzyo.ondigitalocean.app/health`
- **Documentation**: `https://seahorse-app-vtzyo.ondigitalocean.app/docs`
- **Auth API**: `https://seahorse-app-vtzyo.ondigitalocean.app/api/auth`
- **Profiles API**: `https://seahorse-app-vtzyo.ondigitalocean.app/api/profiles`

### 6. Connexion à MongoDB

La base de données MongoDB est hébergée sur DigitalOcean :
- **Cluster**: `db-inutilecorp-34a5d185`
- **Database**: `admin`
- **Auth Source**: `admin`
- **TLS**: Activé
