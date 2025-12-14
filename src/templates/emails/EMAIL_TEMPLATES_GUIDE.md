# 📧 Guide Complet des Templates d'Emails - Inutile Cards

## Vue d'ensemble

Cette collection comprend **18 templates d'emails** professionnels couvrant tous les besoins de l'application Inutile Cards, du lifecycle utilisateur à la prospection B2B.

---

## 📊 Résumé des Templates

| Catégorie | Nombre | Templates |
|-----------|--------|-----------|
| **Lifecycle Utilisateur** | 3 | Welcome, Activation, Profil incomplet |
| **E-commerce & Commandes** | 6 | Confirmation, Expédition, Livraison, Abandon panier (x3) |
| **Auth & Sécurité** | 1 | Reset password |
| **Marketing & Engagement** | 4 | Newsletter, Article, Avis, Parrainage |
| **B2B & Prospection** | 3 | Cold email, Relance, Démo |
| **TOTAL** | **18** | - |

---

## 📋 Catégories Détaillées

### 🎯 1. LIFECYCLE UTILISATEUR

#### 1.1 `welcome.html` - Email de Bienvenue
**Timing:** Immédiat après inscription  
**Objectif:** Onboarding et première impression positive

**Contenu:**
- Message de bienvenue chaleureux
- 3 fonctionnalités clés avec icônes
- Statistiques sociales (10k+ cartes, 98% satisfaction)
- CTA vers l'éditeur de cartes
- Liens réseaux sociaux

**Variables:**
```typescript
{
  firstName: string;
  editorUrl: string;
  faqUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  unsubscribeUrl: string;
}
```

---

#### 1.2 `card-not-activated.html` - Rappel d'Activation
**Timing:** 3-7 jours après livraison si carte non activée  
**Objectif:** Encourager l'activation pour maximiser l'utilisation

**Contenu:**
- Rappel doux avec icône animée
- Guide d'activation en 3 étapes
- Durée estimée (2 minutes)
- Lien vers l'aide si besoin
- Social proof (X utilisateurs actifs)

**Variables:**
```typescript
{
  firstName: string;
  daysSinceDelivery: number;
  activationUrl: string;
  helpUrl: string;
  activeUsers: string;
}
```

---

#### 1.3 `profile-incomplete.html` - Profil Incomplet
**Timing:** 2-3 jours après activation si profil < 70% complet  
**Objectif:** Maximiser la complétude des profils

**Contenu:**
- Barre de progression visuelle
- Checklist interactive (tâches complétées/restantes)
- Statistique: profils complets = 3x plus de vues
- CTA vers l'éditeur de profil

**Variables:**
```typescript
{
  firstName: string;
  completionPercentage: number;
  tasks: Array<{
    title: string;
    description: string;
    completed: boolean;
  }>;
  profileUrl: string;
}
```

---

### 🛒 2. E-COMMERCE & COMMANDES

#### 2.1 `order-confirmation.html` - Confirmation de Commande
**Timing:** Immédiat après paiement validé  
**Objectif:** Rassurer et informer le client

**Contenu:**
- Badge de succès avec checkmark
- Détails complets de la commande
- Résumé des items avec prix
- Adresse de livraison
- Timeline visuelle du processus
- Lien de suivi de commande

**Variables:**
```typescript
{
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{ name: string; price: string }>;
  total: string;
  shippingAddress: string;
  trackOrderUrl: string;
}
```

---

#### 2.2 `order-shipped.html` - Commande Expédiée
**Timing:** Lorsque le statut passe à "shipped"  
**Objectif:** Tracking et anticipation de la livraison

**Contenu:**
- Icône fusée pour l'excitement
- Numéro de tracking en grand format
- Bouton tracking direct vers transporteur
- Infos transporteur et date estimée
- Tips pendant l'attente (personnaliser profil, etc.)

**Variables:**
```typescript
{
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  trackingUrl: string;
  shippedDate: string;
  carrier: string;
  estimatedDelivery: string;
  shippingAddress: string;
}
```

---

#### 2.3 `order-delivered.html` - Commande Livrée
**Timing:** Confirmation de livraison  
**Objectif:** Guide d'utilisation et demande de feedback

**Contenu:**
- Célébration de la livraison
- Guide étape par étape (activation, personnalisation, usage)
- Liens vers dashboard et tutoriel vidéo
- Conseils Pro pour optimiser l'usage
- Demande d'avis avec étoiles

**Variables:**
```typescript
{
  customerName: string;
  dashboardUrl: string;
  videoGuideUrl: string;
  reviewUrl: string;
}
```

---

#### 2.4-2.6 Séquence d'Abandon de Panier (3 emails)

##### 2.4 `cart-abandoned-1.html` - Rappel Doux (1h après)
**Objectif:** Rappel simple sans pression

**Contenu:**
- Message amical "Vous avez oublié quelque chose"
- Aperçu visuel du panier
- Rappel des avantages (livraison 24-48h, sécurité, etc.)
- Bouton retour au checkout
- Durée de conservation du panier

**Variables:**
```typescript
{
  firstName: string;
  items: Array<{ name: string; description: string; price: string }>;
  total: string;
  checkoutUrl: string;
  cartExpiryDays: number;
  supportEmail: string;
}
```

---

##### 2.5 `cart-abandoned-2.html` - Avec Incentive (24h après)
**Objectif:** Convertir avec réduction

**Contenu:**
- Badge "cadeau" pour capter l'attention
- Code promo en grand format (ex: 10% off)
- Calcul automatique des économies
- Prix barré vs nouveau prix
- Urgence: expire dans X heures
- Témoignage client

**Variables:**
```typescript
{
  firstName: string;
  items: Array<{ name: string; price: string }>;
  discountPercentage: number;
  discountCode: string;
  discountAmount: string;
  originalTotal: string;
  discountedTotal: string;
  expiryHours: number;
  supportEmail: string;
}
```

---

##### 2.6 `cart-abandoned-3.html` - Dernière Chance (3 jours après)
**Objectif:** Urgence maximale, dernière tentative

**Contenu:**
- Header rouge pour urgence
- Compte à rebours visuel (heures/minutes)
- Grosse réduction finale (20-25%)
- Warning box "panier expire"
- Social proof (X commandes cette semaine)
- Plusieurs CTA

**Variables:**
```typescript
{
  firstName: string;
  items: Array<{ name: string; price: string }>;
  finalDiscountPercentage: number;
  finalDiscountCode: string;
  finalDiscountAmount: string;
  originalTotal: string;
  finalTotal: string;
  hoursLeft: number;
  minutesLeft: number;
  checkoutUrl: string;
}
```

---

### 🔐 3. AUTHENTIFICATION & SÉCURITÉ

#### 3.1 `password-reset.html` - Réinitialisation Mot de Passe
**Timing:** Demande de reset password  
**Objectif:** Sécurité et simplicité

**Contenu:**
- Icône cadenas pour sécurité
- Bouton reset proéminent
- Durée de validité (1h) bien visible
- Warning si pas demandé
- Lien textuel en backup
- Message de sécurité rassurant

**Variables:**
```typescript
{
  firstName: string;
  resetUrl: string;
}
```

---

### 📰 4. MARKETING & ENGAGEMENT

#### 4.1 `newsletter.html` - Newsletter
**Timing:** Périodique (mensuel recommandé)  
**Objectif:** Engagement et rétention

**Contenu:**
- Badge numéro d'édition
- Image hero gradient
- Stats du mois (2 métriques clés)
- Grille d'articles avec catégories
- Section nouveautés
- CTA vers création de carte

**Variables:**
```typescript
{
  firstName: string;
  issueNumber: string;
  newsletterTitle: string;
  date: string;
  introText: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  articles: Array<{ category: string; title: string; excerpt: string; url: string }>;
  featureTitle: string;
  featureDescription: string;
  ctaUrl: string;
  // + social links
}
```

---

#### 4.2 `new-article.html` - Nouvel Article
**Timing:** Publication d'un article important  
**Objectif:** Drive traffic vers le blog

**Contenu:**
- Badge catégorie coloré
- Image featured article
- Métadonnées (date, temps de lecture)
- Extrait captivant
- Points clés en bullet points
- Carte auteur
- Articles similaires
- CTA marketing

**Variables:**
```typescript
{
  category: string;
  articleTitle: string;
  publishDate: string;
  readTime: string;
  articleExcerpt: string;
  articleUrl: string;
  keyPoints: string[];
  authorName: string;
  authorTitle: string;
  authorInitials: string;
  relatedArticles?: Array<{ title: string; excerpt: string; url: string }>;
  // + standard URLs
}
```

---

#### 4.3 `review-request.html` - Demande d'Avis
**Timing:** 2-3 semaines après livraison  
**Objectif:** Collecter reviews et social proof

**Contenu:**
- Étoiles interactives (1-5)
- Boutons vers plateformes (Google, Trustpilot, etc.)
- Témoignage d'exemple
- Incentive: 20% de réduction sur prochaine commande

**Variables:**
```typescript
{
  firstName: string;
  reviewUrl: string;
  googleReviewUrl: string;
  trustpilotUrl: string;
  productHuntUrl: string;
  facebookUrl: string;
  unsubscribeUrl: string;
}
```

---

#### 4.4 `referral-invite.html` - Programme de Parrainage
**Timing:** 1 mois après livraison  
**Objectif:** Croissance virale via referral

**Contenu:**
- Valeur du reward (ex: 20€)
- Code promo unique en grand format
- Boutons de partage (WhatsApp, Email, Copier)
- Explication du process en 3 étapes
- Stats personnelles (X parrainages, X€ gagnés)
- Illimité mis en avant

**Variables:**
```typescript
{
  firstName: string;
  rewardAmount: number;
  referralCode: string;
  referralsCount: number;
  earnedAmount: number;
  shareWhatsappUrl: string;
  shareEmailUrl: string;
  shareLinkUrl: string;
  sharePageUrl: string;
  dashboardUrl: string;
}
```

---

### 💼 5. B2B & PROSPECTION COMMERCIALE

#### 5.1 `cold-outreach-initial.html` - Prospection Initiale
**Timing:** Premier contact B2B  
**Objectif:** Ouvrir la conversation

**Contenu:**
- Personnalisation entreprise
- Problème identifié (cartes papier)
- Stats impactantes (88% jetées, coût annuel)
- 4 bénéfices clés avec icônes
- Social proof (témoignage)
- CTA vers calendrier
- Offre early adopter
- Signature professionnelle complète

**Variables:**
```typescript
{
  contactName: string;
  companyName: string;
  companyContext: string;
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  calendarUrl: string;
}
```

---

#### 5.2 `cold-outreach-followup.html` - Relance Prospection
**Timing:** 3-5 jours après premier email sans réponse  
**Objectif:** Rappel avec valeur ajoutée

**Contenu:**
- Rappel de contexte
- 3 raisons d'agir maintenant
- Case study détaillée avec résultats chiffrés
- Alternative: vidéo 2min ou appel 15min
- Urgence: X places restantes
- Option de opt-out respectueuse

**Variables:**
```typescript
{
  contactName: string;
  companyName: string;
  daysSinceLastEmail: string;
  estimatedSavings: number;
  caseStudyCompany: string;
  caseStudyIndustry: string;
  caseStudyTeamSize: string;
  calendarUrl: string;
  videoUrl: string;
  slotsRemaining: number;
  senderName: string;
  senderTitle: string;
}
```

---

#### 5.3 `enterprise-demo-invite.html` - Invitation Démo
**Timing:** Après acceptation de démo  
**Objectif:** Confirmation et préparation

**Contenu:**
- Badge "démo personnalisée"
- Détails RDV (date, heure, plateforme)
- Lien meeting + add to calendar
- Agenda détaillé (30 min breakdown)
- 4 bénéfices de la démo
- Checklist de préparation
- Possibilité de reschedule

**Variables:**
```typescript
{
  contactName: string;
  companyName: string;
  demoDate: string;
  demoTime: string;
  duration: number;
  platform: string;
  meetingLink: string;
  addToCalendarUrl: string;
  rescheduleUrl: string;
  teamSize: number;
  industry: string;
  senderName: string;
  senderTitle: string;
}
```

---

## 🎨 Design System

### Couleurs

#### Mode Sombre (par défaut)
- **Background:** `#000000`
- **Surface:** `#0a0a0a`
- **Border:** `#1a1a1a` / `#2a2a2a`
- **Text primary:** `#ffffff`
- **Text secondary:** `#cccccc`
- **Text tertiary:** `#999999` / `#666666`

#### Accents
- **Success:** `#22c55e` / `#16a34a`
- **Info:** `#3b82f6` / `#06b6d4`
- **Warning:** `#fbbf24` / `#f59e0b`
- **Error:** `#dc2626` / `#991b1b`
- **Premium:** `#8b5cf6` / `#6366f1`

### Typography
- **Font:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Headings:** `700` (bold)
- **Body:** `400` (regular)
- **Size scale:** 12px, 14px, 16px, 18px, 20px, 24px, 28px, 32px

### Spacing
- **Section padding:** `40px 20px`
- **Element margin:** `20px - 30px`
- **Border radius:** `8px - 16px`

---

## 🚀 Guide d'Utilisation

### Installation des dépendances

```bash
npm install nodemailer handlebars
```

### Utilisation avec le Helper

```typescript
import { prepareWelcomeEmail, sendEmail } from './utils/email';

// Préparer et envoyer
const email = await prepareWelcomeEmail({
  firstName: 'Nicolas',
  email: 'nicolas@example.com'
});

await sendEmail('nicolas@example.com', email);
```

### Exemples par Cas d'Usage

#### 📧 Séquence d'Onboarding Complète

```typescript
// Jour 0: Inscription
await sendEmail(user.email, await prepareWelcomeEmail({ firstName: user.firstName }));

// Jour 3: Si carte non activée
if (!user.cardActivated) {
  await sendEmail(user.email, await prepareCardNotActivatedEmail({
    firstName: user.firstName,
    daysSinceDelivery: 3
  }));
}

// Jour 5: Si profil incomplet
if (user.profileCompleteness < 70) {
  await sendEmail(user.email, await prepareProfileIncompleteEmail({
    firstName: user.firstName,
    completionPercentage: user.profileCompleteness
  }));
}
```

#### 🛒 Séquence d'Abandon de Panier

```typescript
// 1 heure après abandon
setTimeout(() => {
  sendEmail(user.email, await prepareCartAbandonedEmail1({ ... }));
}, 1 * 60 * 60 * 1000);

// 24 heures après
setTimeout(() => {
  sendEmail(user.email, await prepareCartAbandonedEmail2({
    discountCode: generatePromoCode(10), // 10% off
    ...
  }));
}, 24 * 60 * 60 * 1000);

// 72 heures après (dernière chance)
setTimeout(() => {
  sendEmail(user.email, await prepareCartAbandonedEmail3({
    finalDiscountCode: generatePromoCode(25), // 25% off
    ...
  }));
}, 72 * 60 * 60 * 1000);
```

#### 💼 Séquence de Prospection B2B

```typescript
// Email initial
await sendColdEmail(lead.email, await prepareColdOutreachInitial({
  contactName: lead.name,
  companyName: lead.company,
  ...
}));

// Relance J+4
setTimeout(() => {
  sendColdEmail(lead.email, await prepareColdOutreachFollowup({ ... }));
}, 4 * 24 * 60 * 60 * 1000);

// Après acceptation: démo
if (lead.acceptedDemo) {
  await sendEmail(lead.email, await prepareEnterpriseDemoInvite({ ... }));
}
```

---

## 📊 Métriques & Optimisation

### KPIs à Suivre par Template

| Template | Métrique Principale | Target |
|----------|---------------------|--------|
| Welcome | Taux de clic vers éditeur | >35% |
| Cart Abandoned 1 | Taux de récupération | >15% |
| Cart Abandoned 2 | Taux de conversion avec promo | >25% |
| Cart Abandoned 3 | Conversion finale | >10% |
| Review Request | Taux de review | >8% |
| Referral | Taux de partage | >12% |
| Cold Outreach | Taux de réponse | >5% |
| Demo Invite | Taux de participation | >75% |

### A/B Testing Recommandé

1. **Objets d'email** (ligne de sujet)
2. **CTA wording** (texte des boutons)
3. **Timing d'envoi** (heure de journée)
4. **Incentives** (montant des réductions)

---

## 🔧 Maintenance & Updates

### Checklist avant Envoi

- ✅ Toutes les variables sont définies
- ✅ URLs testées et fonctionnelles
- ✅ Preview sur desktop + mobile
- ✅ Test sur Gmail, Outlook, Apple Mail
- ✅ Lien de désinscription présent
- ✅ Pas de données sensibles en clair
- ✅ Tracking pixels (si utilisé)

### Updates Réguliers

- **Statistiques:** Mettre à jour tous les 3 mois
- **Témoignages:** Rotation mensuelle
- **Offres promotionnelles:** Adapter selon saison
- **Social proof:** Actualiser régulièrement

---

## 📱 Responsive Design

Tous les templates sont optimisés pour:
- ✅ **Desktop clients** (Outlook, Thunderbird, Apple Mail)
- ✅ **Webmail** (Gmail, Yahoo, Outlook.com)
- ✅ **Mobile** (iOS Mail, Gmail App, Outlook Mobile)

### Breakpoints
- **Mobile:** < 600px
- **Desktop:** ≥ 600px

---

## 🔐 Conformité & Légal

### RGPD & Confidentialité

- ✅ Lien de désinscription dans chaque email
- ✅ Raison de l'envoi clairement indiquée
- ✅ Pas de tracking intrusif sans consentement
- ✅ Données personnelles protégées

### Anti-Spam

- ✅ From address authentique (@inutile.cards)
- ✅ SPF, DKIM, DMARC configurés
- ✅ Ratio texte/images équilibré
- ✅ Pas de mots spammy dans objets

---

## 📞 Support

Pour toute question sur les templates:
- **Email:** dev@inutile.cards
- **Documentation:** https://docs.inutile.cards/emails

---

**© 2025 Inutile Cards. Tous droits réservés.**




