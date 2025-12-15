# 🔧 Configuration Production - Variables d'Environnement

## DigitalOcean App Platform - Variables Requises

### Configuration Serveur

```bash
PORT=8080
HOST=0.0.0.0
NODE_ENV=production
```

### Base de Données MongoDB

```bash
MONGODB_URI=mongodb+srv://doadmin:1073HXg4E68OdoC9@db-inutilecorp-34a5d185.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-inutilecorp&tls=true
```

**Détails de connexion:**
- Cluster: `db-inutilecorp-34a5d185`
- Database: `admin`
- Auth Source: `admin`
- TLS: Activé
- Replica Set: `db-inutilecorp`

### JWT Authentication

```bash
JWT_SECRET=CHANGEZ_CE_SECRET_UTILISEZ_UN_SECRET_FORT_ET_ALEATOIRE
JWT_EXPIRES_IN=7d
```

⚠️ **Important**: Générez un secret fort avec:
```bash
openssl rand -base64 32
```

### Frontend CORS

```bash
FRONTEND_URL=https://inutile.cards
```

### Email (Optionnel)

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@inutile.cards
```

## 📍 URLs de Production

- **API Base**: `https://seahorse-app-vtzyo.ondigitalocean.app`
- **Health Check**: `https://seahorse-app-vtzyo.ondigitalocean.app/health`
- **Documentation**: `https://seahorse-app-vtzyo.ondigitalocean.app/docs`

## 🚀 Déploiement

1. Configurez toutes les variables dans DigitalOcean (Settings → Environment Variables)
2. Le build se fait automatiquement avec: `npm install && npm run build`
3. Le démarrage se fait avec: `npm start`
4. L'app écoute sur le port **8080**

## ✅ Vérification

Testez le health check:
```bash
curl https://seahorse-app-vtzyo.ondigitalocean.app/health
```

Devrait retourner:
```json
{
  "status": "ok",
  "timestamp": "2024-12-15T..."
}
```

