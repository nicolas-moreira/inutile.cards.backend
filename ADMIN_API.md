# API Admin - Documentation

Cette API permet aux administrateurs de gérer l'ensemble de la plateforme Inutile Cards.

## Authentication

Toutes les routes admin nécessitent :
- Un token JWT valide dans le header `Authorization: Bearer <token>`
- Le rôle `admin` pour l'utilisateur authentifié

## Base URL

```
/api/admin
```

---

## 📊 Dashboard & Statistiques

### GET `/api/admin/stats`

Récupère les statistiques du dashboard admin.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "pendingOrders": 5,
    "totalRevenue": 1250.50,
    "activeUsers": 128,
    "lowStock": 2
  }
}
```

---

## 📦 Gestion des Commandes (Orders)

### GET `/api/admin/orders`

Liste toutes les commandes.

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "customerName": "Jean Dupont",
      "email": "jean@example.com",
      "items": ["1x Carte Premium NFC"],
      "total": 99,
      "status": "pending",
      "cardDesign": "Modern Gold",
      "shippingAddress": "...",
      "trackingNumber": "...",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/admin/orders/:id`

Récupère une commande spécifique.

### PUT `/api/admin/orders/:id/status`

Met à jour le statut d'une commande.

**Body:**
```json
{
  "status": "processing" // "pending" | "processing" | "completed" | "cancelled"
}
```

### DELETE `/api/admin/orders/:id`

Supprime une commande.

---

## 🎴 Gestion des Cartes Produits

### GET `/api/admin/cards`

Liste toutes les cartes produits.

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Carte Premium NFC",
      "type": "Premium",
      "price": 99,
      "stock": 45,
      "image": "...",
      "active": true,
      "description": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### POST `/api/admin/cards`

Crée une nouvelle carte produit.

**Body:**
```json
{
  "name": "Carte Premium NFC",
  "type": "Premium",
  "price": 99,
  "stock": 50,
  "image": "https://...",
  "description": "Description de la carte",
  "active": true
}
```

### PUT `/api/admin/cards/:id`

Met à jour une carte produit.

### PUT `/api/admin/cards/:id/toggle-active`

Active/désactive une carte produit.

### DELETE `/api/admin/cards/:id`

Supprime une carte produit.

---

## 👥 Gestion des Utilisateurs

### GET `/api/admin/users`

Liste tous les utilisateurs (sans les mots de passe).

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+33612345678",
      "role": "user",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### PUT `/api/admin/users/:id/role`

Change le rôle d'un utilisateur.

**Body:**
```json
{
  "role": "admin" // "user" | "admin"
}
```

### PUT `/api/admin/users/:id`

Met à jour les informations d'un utilisateur.

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "new@email.com",
  "phone": "+33612345678",
  "isActive": true
}
```

### DELETE `/api/admin/users/:id`

Supprime un utilisateur (et son profil associé).

---

## 🎭 Gestion des Profils

### GET `/api/admin/profiles`

Liste tous les profils avec métriques.

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "slug": "john.doe",
      "displayName": "John Doe",
      "bio": "...",
      "avatarUrl": "...",
      "isPublic": true,
      "links": [...],
      "socialLinks": [...],
      "theme": {...},
      "linksCount": 5,
      "views": 1234,
      "clicks": 567,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### PUT `/api/admin/profiles/:id/toggle-public`

Rend un profil public ou privé.

### PUT `/api/admin/profiles/:id`

Met à jour un profil.

**Body:**
```json
{
  "displayName": "New Name",
  "bio": "New bio",
  "avatarUrl": "https://...",
  "isPublic": true
}
```

### DELETE `/api/admin/profiles/:id`

Supprime un profil.

---

## 💳 Gestion des Cartes Clients (Cartes Physiques)

### GET `/api/admin/client-cards`

Liste toutes les cartes clients.

**Réponse:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "serialNumber": "IC-2025-001234",
      "orderId": "...",
      "userId": "...",
      "customerName": "Jean Dupont",
      "email": "jean@example.com",
      "cardType": "Premium NFC",
      "design": "Modern Gold",
      "status": "shipped",
      "shippingAddress": "...",
      "trackingNumber": "FR123456789",
      "orderDate": "...",
      "deliveryDate": "...",
      "activatedAt": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### GET `/api/admin/client-cards/:id`

Récupère une carte client spécifique.

### GET `/api/admin/client-cards/order/:orderId`

Récupère toutes les cartes d'une commande.

### POST `/api/admin/client-cards`

Crée une nouvelle carte client.

**Body:**
```json
{
  "serialNumber": "IC-2025-001234",
  "orderId": "...",
  "customerName": "Jean Dupont",
  "email": "jean@example.com",
  "cardType": "Premium NFC",
  "design": "Modern Gold",
  "shippingAddress": "123 Rue de la Paix, 75001 Paris",
  "orderDate": "2025-01-01T00:00:00.000Z"
}
```

### PUT `/api/admin/client-cards/:id/status`

Met à jour le statut d'une carte client.

**Body:**
```json
{
  "status": "shipped" // "ordered" | "manufacturing" | "shipped" | "delivered" | "activated"
}
```

**Note:** Les dates `deliveryDate` et `activatedAt` sont automatiquement mises à jour lors du changement de statut.

### PUT `/api/admin/client-cards/:id`

Met à jour les informations d'une carte client.

**Body:**
```json
{
  "trackingNumber": "FR123456789",
  "shippingAddress": "...",
  "status": "shipped"
}
```

### DELETE `/api/admin/client-cards/:id`

Supprime une carte client.

---

## Codes d'Erreur

- **401**: Non authentifié (token manquant ou invalide)
- **403**: Accès refusé (role admin requis)
- **404**: Ressource non trouvée
- **500**: Erreur serveur

## Exemples d'Utilisation

### Avec cURL

```bash
# Récupérer les statistiques
curl -X GET http://localhost:4000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Créer une carte produit
curl -X POST http://localhost:4000/api/admin/cards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Carte Premium NFC",
    "type": "Premium",
    "price": 99,
    "stock": 50,
    "active": true
  }'

# Mettre à jour le statut d'une commande
curl -X PUT http://localhost:4000/api/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```

### Avec JavaScript/Fetch

```javascript
// Configuration de base
const API_URL = 'http://localhost:4000/api/admin';
const token = 'YOUR_JWT_TOKEN';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

// Récupérer les stats
const stats = await fetch(`${API_URL}/stats`, { headers })
  .then(res => res.json());

// Créer une carte produit
const newCard = await fetch(`${API_URL}/cards`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name: 'Carte Premium NFC',
    type: 'Premium',
    price: 99,
    stock: 50,
    active: true
  })
}).then(res => res.json());

// Mettre à jour le rôle d'un utilisateur
const updateRole = await fetch(`${API_URL}/users/USER_ID/role`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({ role: 'admin' })
}).then(res => res.json());
```

---

## Seed Data

Pour peupler la base de données avec des données de test :

```bash
cd backend
npm run seed
```

Cela créera :
- 3 utilisateurs de test (dont 2 admins)
- Des templates
- Des cartes produits
- Des commandes
- Des cartes clients
- Des données financières

**Comptes de test créés:**
- User: `test@inutile.cards` / `Test123456!`
- Admin: `admin@inutile.cards` / `Admin123456!`
- Demo Admin: `nicolas.oliveira@inutile.cards` / `Nicolas123456!`





