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

### 2. Variables d'environnement

Ajoutez ces variables dans l'interface DigitalOcean :

- `MONGODB_URI`: `mongodb+srv://doadmin:1073HXg4E68OdoC9@db-inutilecorp-34a5d185.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-inutilecorp&tls=true`
- `JWT_SECRET`: (générez un secret aléatoire fort)
- `NODE_ENV`: `production`
- `PORT`: `8080`
- `HOST`: `0.0.0.0`
- `FRONTEND_URL`: `https://inutile.cards`

### 3. Health Check

- Path: `/health`
- Port: `8080`

### 4. Vérification

Une fois déployé, testez :

```bash
curl https://api.inutile.cards/health
```

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2024-12-10T..."
}
```

### 5. Documentation API

Accessible sur : `https://api.inutile.cards/docs`
