# Email Templates - Inutile Cards

Collection complète de templates d'emails HTML professionnels pour l'application Inutile Cards.

## 📧 Templates Disponibles

### 📋 Table des Matières

#### Lifecycle Utilisateur
- [welcome.html](#1-welcomehtml---email-de-bienvenue) - Email de bienvenue
- [card-not-activated.html](#13-card-not-activatedhtml---rappel-dactivation) - Rappel d'activation
- [profile-incomplete.html](#14-profile-incompletehtml---profil-incomplet) - Profil incomplet

#### Commandes & E-commerce
- [order-confirmation.html](#2-order-confirmationhtml---confirmation-de-commande) - Confirmation commande
- [order-shipped.html](#3-order-shippedhtml---commande-expédiée) - Expédition
- [order-delivered.html](#4-order-deliveredhtml---commande-livrée) - Livraison
- [cart-abandoned-1.html](#9-cart-abandoned-1html---abandon-panier-1h) - Abandon panier 1h
- [cart-abandoned-2.html](#10-cart-abandoned-2html---abandon-panier-24h) - Abandon panier 24h avec promo
- [cart-abandoned-3.html](#11-cart-abandoned-3html---abandon-panier-3j) - Abandon panier final

#### Authentification & Sécurité
- [password-reset.html](#5-password-resethtml---réinitialisation-de-mot-de-passe) - Reset password

#### Marketing & Communication
- [newsletter.html](#6-newsletterhtml---newsletter) - Newsletter
- [new-article.html](#7-new-articlehtml---nouvel-article) - Notification article
- [review-request.html](#8-review-requesthtml---demande-davis) - Demande d'avis
- [referral-invite.html](#15-referral-invitehtml---programme-de-parrainage) - Programme parrainage

#### B2B & Prospection
- [cold-outreach-initial.html](#16-cold-outreach-initialhtml---prospection-initiale) - Cold email initial
- [cold-outreach-followup.html](#17-cold-outreach-followuphtml---relance-prospection) - Relance prospection
- [enterprise-demo-invite.html](#18-enterprise-demo-invitehtml---invitation-démo-entreprise) - Invitation démo

---

### 1. **welcome.html** - Email de Bienvenue
**Timing:** Envoyé immédiatement lors de l'inscription d'un nouvel utilisateur.

**Objectif:** Accueillir le nouvel utilisateur et le guider vers la création de sa première carte.

**Variables:**
- `firstName` - Prénom de l'utilisateur
- `editorUrl` - Lien vers l'éditeur de cartes
- `faqUrl` - Lien vers la FAQ
- `twitterUrl`, `linkedinUrl`, `instagramUrl` - Liens réseaux sociaux
- `unsubscribeUrl` - Lien de désinscription

### 2. **order-confirmation.html** - Confirmation de Commande
Envoyé immédiatement après qu'une commande soit passée.

**Variables:**
- `customerName` - Nom du client
- `orderNumber` - Numéro de commande
- `orderDate` - Date de la commande
- `items` - Array d'objets { name, price }
- `total` - Montant total
- `shippingAddress` - Adresse de livraison
- `trackOrderUrl` - Lien pour suivre la commande

### 3. **order-shipped.html** - Commande Expédiée
Envoyé quand la commande est expédiée avec le numéro de suivi.

**Variables:**
- `customerName` - Nom du client
- `orderNumber` - Numéro de commande
- `trackingNumber` - Numéro de suivi
- `trackingUrl` - URL de tracking complète
- `shippedDate` - Date d'expédition
- `carrier` - Transporteur (ex: Colissimo)
- `estimatedDelivery` - Date de livraison estimée
- `shippingAddress` - Adresse de livraison

### 4. **order-delivered.html** - Commande Livrée
Envoyé quand la commande est livrée, avec guide d'utilisation.

**Variables:**
- `customerName` - Nom du client
- `dashboardUrl` - Lien vers le dashboard
- `videoGuideUrl` - Lien vers le tutoriel vidéo
- `reviewUrl` - Lien pour laisser un avis

### 5. **password-reset.html** - Réinitialisation de Mot de Passe
Envoyé quand l'utilisateur demande à réinitialiser son mot de passe.

**Variables:**
- `firstName` - Prénom de l'utilisateur
- `resetUrl` - URL unique de réinitialisation (expire en 1h)

### 6. **newsletter.html** - Newsletter
Newsletter périodique avec actualités et articles.

**Variables:**
- `firstName` - Prénom de l'utilisateur
- `issueNumber` - Numéro de l'édition
- `newsletterTitle` - Titre de la newsletter
- `date` - Date de publication
- `introText` - Texte d'introduction
- `stat1Number`, `stat1Label` - Première statistique
- `stat2Number`, `stat2Label` - Deuxième statistique
- `articles` - Array d'objets { category, title, excerpt, url }
- `featureTitle`, `featureDescription` - Nouvelle fonctionnalité
- `ctaUrl` - Call-to-action URL
- URLs réseaux sociaux et désinscription

### 7. **new-article.html** - Nouvel Article
Notification d'un nouvel article de blog ou FAQ.

**Variables:**
- `category` - Catégorie de l'article
- `articleTitle` - Titre de l'article
- `publishDate` - Date de publication
- `readTime` - Temps de lecture estimé
- `articleExcerpt` - Extrait de l'article
- `articleUrl` - URL complète de l'article
- `keyPoints` - Array de points clés
- `authorName`, `authorTitle`, `authorInitials` - Info auteur
- `relatedArticles` - Array optionnel d'articles similaires { title, excerpt, url }
- URLs standards

### 8. **review-request.html** - Demande d'Avis
Envoyé quelques semaines après la livraison pour demander un avis.

**Variables:**
- `firstName` - Prénom de l'utilisateur
- `reviewUrl` - URL du formulaire d'avis
- `googleReviewUrl` - Lien Google Reviews
- `trustpilotUrl` - Lien Trustpilot
- `productHuntUrl` - Lien Product Hunt
- `facebookUrl` - Lien Facebook Reviews
- `unsubscribeUrl` - Désinscription

## 🎨 Design System

Tous les templates suivent le même design system:

### Couleurs
- **Fond principal:** `#000000` (noir)
- **Fond secondaire:** `#0a0a0a`
- **Bordures:** `#1a1a1a`
- **Texte principal:** `#ffffff` (blanc)
- **Texte secondaire:** `#cccccc`
- **Texte tertiaire:** `#999999` / `#666666`

### Gradients
- **Succès:** `linear-gradient(135deg, #22c55e 0%, #16a34a 100%)`
- **Info:** `linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)`
- **Warning:** `linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)`
- **Premium:** `linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)`

### Typography
- **Famille:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Titres:** `700` (bold)
- **Corps:** `400` (regular)

### Espacements
- **Padding sections:** `40px 20px`
- **Margin between elements:** `20px` - `30px`
- **Border radius:** `12px` - `16px`

## 🚀 Utilisation

### Avec le Helper TypeScript

```typescript
import { prepareWelcomeEmail, sendEmail } from './utils/email';

// Préparer l'email
const emailData = await prepareWelcomeEmail({
  firstName: 'Nicolas',
  email: 'nicolas@example.com'
});

// Envoyer l'email
await sendEmail('nicolas@example.com', emailData);
```

### Exemple pour chaque type

```typescript
// Welcome Email
const welcome = await prepareWelcomeEmail({
  firstName: 'Nicolas',
  email: 'nicolas@example.com'
});

// Order Confirmation
const orderConf = await prepareOrderConfirmationEmail({
  customerName: 'Nicolas Dupont',
  orderNumber: 'ORD-2025-001',
  orderDate: '10 Décembre 2025',
  items: [
    { name: 'Carte NFC Premium - Metal', price: '99' }
  ],
  total: '99',
  shippingAddress: '123 rue de Paris, 75001 Paris'
});

// Order Shipped
const shipped = await prepareOrderShippedEmail({
  customerName: 'Nicolas Dupont',
  orderNumber: 'ORD-2025-001',
  trackingNumber: 'FR123456789',
  trackingUrl: 'https://tracking.laposte.fr/FR123456789',
  shippedDate: '11 Décembre 2025',
  carrier: 'Colissimo',
  estimatedDelivery: '12-13 Décembre 2025',
  shippingAddress: '123 rue de Paris, 75001 Paris'
});

// Password Reset
const reset = await preparePasswordResetEmail({
  firstName: 'Nicolas',
  resetUrl: 'https://inutile.cards/reset-password?token=abc123'
});

// Newsletter
const newsletter = await prepareNewsletterEmail({
  firstName: 'Nicolas',
  issueNumber: '42',
  newsletterTitle: 'Les nouveautés de Décembre',
  date: '1er Décembre 2025',
  introText: 'Découvrez toutes les nouveautés du mois...',
  stat1Number: '15k+',
  stat1Label: 'Cartes créées',
  stat2Number: '99%',
  stat2Label: 'Satisfaction',
  articles: [
    {
      category: 'Tutoriel',
      title: 'Comment optimiser votre profil',
      excerpt: 'Découvrez nos 10 conseils...',
      url: 'https://inutile.cards/blog/optimiser-profil'
    }
  ],
  featureTitle: 'Mode sombre',
  featureDescription: 'Nouveau thème sombre pour votre profil'
});
```

## 🔧 Personnalisation

Pour personnaliser un template:

1. Copiez le fichier HTML
2. Modifiez le design selon vos besoins
3. Ajoutez/supprimez des variables
4. Mettez à jour le helper TypeScript si nécessaire

## 📱 Responsive Design

Tous les templates sont optimisés pour:
- ✅ Desktop email clients (Outlook, Apple Mail, Thunderbird)
- ✅ Webmail (Gmail, Yahoo, Outlook.com)
- ✅ Mobile (iOS Mail, Gmail App, Outlook Mobile)

## 🧪 Testing

Pour tester vos emails:
1. Utilisez [Litmus](https://www.litmus.com/) ou [Email on Acid](https://www.emailonacid.com/)
2. Envoyez des emails de test à différents clients
3. Vérifiez sur mobile et desktop

## 📝 Best Practices

- ✅ Utilisez des tables pour la structure (meilleure compatibilité)
- ✅ Inline CSS pour garantir le rendu
- ✅ Testez sur plusieurs clients email
- ✅ Gardez le poids des emails < 100KB
- ✅ Utilisez des alt text pour les images
- ✅ Incluez toujours un lien de désinscription

## 🔐 Sécurité

- Ne jamais inclure de données sensibles dans les templates
- Toujours valider les URLs avant l'envoi
- Expirer les tokens de réinitialisation après 1h
- Logger tous les envois d'emails

## 📄 Licence

© 2025 Inutile Card. Tous droits réservés.




